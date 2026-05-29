import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

// Utility sleep function
const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Retry wrapper for temporary Gemini failures
const generateWithRetry = async (
  prompt,
  retries = 3
) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(
        `Gemini Request Attempt ${attempt}/${retries}`
      );

      const result =
        await model.generateContent(prompt);

      return result;
    } catch (error) {
      const status = error?.status;

      console.error(
        `Gemini Error Attempt ${attempt}:`,
        status,
        error.message
      );

      // Retry only on temporary service failures
      if (
        status === 503 &&
        attempt < retries
      ) {
        const delay = attempt * 3000;

        console.log(
          `Gemini overloaded. Retrying in ${delay}ms...`
        );

        await sleep(delay);
        continue;
      }

      throw error;
    }
  }
};

export const generateV2Analysis = async (
  resumeText,
  jobDescription
) => {
  const prompt = `
You are an expert ATS (Applicant Tracking System) and Senior Technical Recruiter.

Analyze the provided Resume against the provided Job Description.

You MUST return your response as a STRICT JSON object.

Do NOT include:
- Markdown
- Code blocks
- Explanations
- Any text outside JSON

EXPECTED JSON STRUCTURE:

{
  "score": <Number between 0-100>,
  "matchedKeywords": [<Array of matching skills>],
  "missingKeywords": [<Array of missing skills>],
  "sectionFeedback": {
    "hasEmail": <Boolean>,
    "hasPhone": <Boolean>,
    "hasLinkedIn": <Boolean>,
    "hasProjects": <Boolean>,
    "hasEducation": <Boolean>,
    "hasSkills": <Boolean>
  },
  "suggestions": [
    "<Actionable suggestion>"
  ],
  "rewrittenBullets": [
    {
      "original": "<Original bullet>",
      "rewritten": "<Improved bullet>",
      "reasoning": "<Reason>"
    }
  ],
  "coverLetter": "<Professional cover letter>"
}

RESUME TEXT:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`;

  try {
    const result =
      await generateWithRetry(prompt);

    const responseText =
      result.response.text();

    // Remove markdown wrappers if Gemini adds them
    const cleanedText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Extract JSON safely
    const jsonStart =
      cleanedText.indexOf("{");

    const jsonEnd =
      cleanedText.lastIndexOf("}");

    if (
      jsonStart === -1 ||
      jsonEnd === -1
    ) {
      throw new Error(
        "Gemini did not return valid JSON."
      );
    }

    const jsonString = cleanedText.slice(
      jsonStart,
      jsonEnd + 1
    );

    const parsedResponse =
      JSON.parse(jsonString);

    return parsedResponse;
  } catch (error) {
    console.error(
      "Gemini API Error:",
      error
    );

    throw new Error(
      "Failed to generate AI analysis."
    );
  }
};