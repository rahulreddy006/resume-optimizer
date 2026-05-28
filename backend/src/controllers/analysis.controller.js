import prisma from "../utils/prisma.js";
import { analysisQueue } from "../services/queue.service.js";

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

    // 1. Create a "Pending" Analysis in the database immediately
    // 1. Create a "Pending" Analysis in the database immediately
    const pendingAnalysis = await prisma.analysis.create({
      data: {
        resumeId: resume.id,
        userId: req.user.userId,
        jobDescription,
        score: 0, 
        status: "pending",
        version: "v2",
        // Add these empty placeholders to satisfy Prisma's strict typing!
        sectionFeedback: {},
        matchedKeywords: [],
        missingKeywords: [],
        suggestions: []
      },
    });

    // 2. Add the heavy job to the Redis/BullMQ Queue
    await analysisQueue.add('analyze-resume', {
      analysisId: pendingAnalysis.id,
      resumeText: resume.rawText,
      jobDescription: jobDescription
    });

    // 3. Immediately return success to the user (Don't wait for the AI!)
    res.status(202).json({
      message: "Analysis added to processing queue",
      analysis: pendingAnalysis,
    });
    
  } catch (error) {
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
    res.status(500).json({ message: "Internal server error" });
  }
};