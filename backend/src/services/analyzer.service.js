// A basic list of words to ignore so they don't skew the score
const STOP_WORDS = new Set([
  "the", "and", "a", "an", "is", "in", "it", "of", "for", "to", "with", "on",
  "as", "by", "at", "this", "that", "from", "we", "you", "our", "are", "be",
  "or", "ideal", "candidate", "should", "understand", "knowledge", "huge",
  "plus", "seeking", "intern", "experience", "have", "who", "will", "an"
]);

const sanitizeText = (text) => {
  return text
    .toLowerCase()
    .split(/\s+/) // Split by whitespace first
    // Strip leading/trailing punctuation, but keep internal ones (e.g., node.js, c++)
    .map(word => word.replace(/^[^a-z0-9+#]+|[^a-z0-9+#]+$/g, "")) 
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));
};

export const analyzeV1 = (resumeText, jobDescription) => {
  // 1. Sanitize and Tokenize
  const resumeTokens = new Set(sanitizeText(resumeText));
  const jdTokens = sanitizeText(jobDescription);

  // 2. We only care about unique keywords from the Job Description
  const uniqueJdKeywords = [...new Set(jdTokens)];

  const matchedKeywords = [];
  const missingKeywords = [];

  // 3. Compare JD against Resume
  uniqueJdKeywords.forEach((keyword) => {
    if (resumeTokens.has(keyword)) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  // 4. Calculate Score
  const totalKeywords = uniqueJdKeywords.length;
  const score = totalKeywords === 0 ? 0 : Math.round((matchedKeywords.length / totalKeywords) * 100);

  // 5. Generate basic V1 suggestions
  const suggestions = [];
  if (score < 50) {
    suggestions.push("Consider tailoring your resume more closely to the job description.");
  }
  if (missingKeywords.length > 5) {
    suggestions.push(`Try incorporating some of these missing skills naturally: ${missingKeywords.slice(0, 3).join(", ")}`);
  }

  // 6. Generate basic section feedback (We'll expand this heavily in V2 with Claude)
  const sectionFeedback = {
    skills: "Ensure your technical skills section explicitly lists the missing keywords if you have experience with them.",
    experience: "Try to quantify your achievements using metrics and numbers where possible."
  };

  return {
    score,
    matchedKeywords,
    missingKeywords,
    sectionFeedback,
    suggestions,
    version: "v1"
  };
};