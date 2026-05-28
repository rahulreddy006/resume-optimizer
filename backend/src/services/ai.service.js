import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

export const generateV2Analysis = async (resumeText, jobDescription) => {
  const prompt = `
    You are an expert ATS (Applicant Tracking System) and Senior Technical Recruiter.
    Analyze the provided Resume against the provided Job Description.
    
    You MUST return your response as a strict JSON object matching the exact structure below. 
    Do not include markdown formatting, code blocks like \`\`\`json, or any other text.
    
    EXPECTED JSON STRUCTURE:
    {
      "score": <Number between 0-100 representing the match strength>,
      "matchedKeywords": [<Array of matching technical skills>],
      "missingKeywords": [<Array of missing technical skills>],
      "sectionFeedback": {
        "hasEmail": <Boolean>,
        "hasPhone": <Boolean>,
        "hasLinkedIn": <Boolean>,
        "hasProjects": <Boolean>,
        "hasEducation": <Boolean>,
        "hasSkills": <Boolean>
      },
      "suggestions": [<Array of strings with actionable advice>],
      "rewrittenBullets": [
        {
          "original": "<A weak bullet point found in the resume>",
          "rewritten": "<The rewritten bullet point incorporating missing keywords and quantifiable metrics>",
          "reasoning": "<Explanation of why this rewrite is better for this specific job>"
        }
      ],
      "coverLetter": "<A highly professional, 3-paragraph cover letter tailored to the job description highlighting the user's specific skills>"
    }

    RESUME TEXT:
    ${resumeText}

    JOB DESCRIPTION:
    ${jobDescription}
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean the response in case Gemini includes markdown formatting
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate AI analysis.");
  }
};