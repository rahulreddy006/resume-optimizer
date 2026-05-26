import prisma from "../utils/prisma.js";
import { analyzeV1 } from "../services/analyzer.service.js";

export const createAnalysis = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({ message: "resumeId and jobDescription are required" });
    }

    // 1. Fetch the resume to ensure it exists and belongs to the user
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume || resume.userId !== req.user.userId) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    // 2. Run the V1 Analysis algorithm
    const analysisResult = analyzeV1(resume.rawText, jobDescription);

    // 3. Save the analysis to the database
    const newAnalysis = await prisma.analysis.create({
      data: {
        resumeId: resume.id,
        userId: req.user.userId,
        jobDescription,
        score: analysisResult.score,
        matchedKeywords: analysisResult.matchedKeywords,
        missingKeywords: analysisResult.missingKeywords,
        sectionFeedback: analysisResult.sectionFeedback,
        suggestions: analysisResult.suggestions,
        version: analysisResult.version,
      },
    });

    res.status(201).json({
      message: "Analysis complete",
      analysis: newAnalysis,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};