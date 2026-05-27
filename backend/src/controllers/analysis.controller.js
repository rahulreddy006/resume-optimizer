import prisma from "../utils/prisma.js";
import { analyzeResumePipeline } from "../services/analyzer.service.js";

export const createAnalysis = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({ message: "resumeId and jobDescription are required" });
    }

    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume || resume.userId !== req.user.userId) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    // Run the upgraded pipeline
    const analysisResult = analyzeResumePipeline(resume.rawText, jobDescription);

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

export const getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;
    const analysis = await prisma.analysis.findUnique({
      where: { id },
    });

    if (!analysis || analysis.userId !== req.user.userId) {
      return res.status(404).json({ message: "Analysis not found or unauthorized" });
    }

    res.status(200).json(analysis);
  } catch (error) {
    console.error("Fetch analysis error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAnalysesByResumeId = async (req, res) => {
  try {
    const { resumeId } = req.params;
    
    // Verify user owns the resume before fetching its analyses
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume || resume.userId !== req.user.userId) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    const analyses = await prisma.analysis.findMany({
      where: { resumeId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(analyses);
  } catch (error) {
    console.error("Fetch resume analyses error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};