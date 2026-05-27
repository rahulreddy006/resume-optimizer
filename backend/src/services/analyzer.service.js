import natural from "natural";

const STOP_WORDS = new Set([
  ...natural.stopwords, 
  "ideal", "candidate", "huge", "plus", "seeking", "intern", "experience", "knowledge", "understand"
]);

const extractKeywords = (text) => {
  // 1. Lowercase and split by whitespace
  const rawTokens = text.toLowerCase().split(/\s+/);

  // 2. Clean and filter the tokens
  const keywords = rawTokens
    // Strip leading/trailing punctuation, but keep internal dots/symbols (Node.js, C++)
    .map(word => word.replace(/^[^a-z0-9+#]+|[^a-z0-9+#]+$/g, "")) 
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));

  // 3. Remove duplicates by converting to a Set, then back to an Array
  return [...new Set(keywords)];
};

const scoreResume = (resumeText, jdKeywords) => {
  const lowerResume = resumeText.toLowerCase();
  const matched = [];
  const missing = [];

  jdKeywords.forEach((kw) => {
    if (lowerResume.includes(kw)) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  });

  const score = jdKeywords.length === 0 ? 0 : Math.round((matched.length / jdKeywords.length) * 100);
  
  return { matched, missing, score };
};

const detectSections = (text) => {
  return {
    hasEmail: /@[\w.]+\.\w+/.test(text),
    hasPhone: /[\d]{10}/.test(text),
    hasLinkedIn: /linkedin\.com/i.test(text),
    hasProjects: /project/i.test(text),
    hasEducation: /b\.tech|bachelor|education/i.test(text),
    hasSkills: /skills/i.test(text),
  };
};

const generateSuggestions = (missing, sections) => {
  const suggestions = [];
  
  if (missing.length > 0) {
    suggestions.push(`Add these missing keywords naturally: ${missing.slice(0, 5).join(", ")}`);
  }
  if (!sections.hasEmail || !sections.hasPhone) {
    suggestions.push("Ensure your contact information (email and phone number) is clearly visible.");
  }
  if (!sections.hasLinkedIn) {
    suggestions.push("Your resume is missing a LinkedIn URL. Consider adding it for networking.");
  }
  if (!sections.hasProjects) {
    suggestions.push("No projects section detected. Highlight your technical projects to stand out.");
  }
  if (!sections.hasEducation) {
    suggestions.push("Education details seem to be missing or unclear.");
  }
  if (!sections.hasSkills) {
    suggestions.push("No explicit skills section detected — add one for better ATS parsing.");
  }

  return suggestions;
};

// Main Exported Pipeline
export const analyzeResumePipeline = (resumeText, jobDescription) => {
  const jdKeywords = extractKeywords(jobDescription);
  const { matched, missing, score } = scoreResume(resumeText, jdKeywords);
  const sections = detectSections(resumeText);
  const suggestions = generateSuggestions(missing, sections);

  return {
    score,
    matchedKeywords: matched,
    missingKeywords: missing,
    sectionFeedback: sections, // Stored as JSONB in Prisma
    suggestions,
    version: "v1.5" 
  };
};