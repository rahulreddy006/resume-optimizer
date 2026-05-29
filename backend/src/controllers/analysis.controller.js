import prisma from "../utils/prisma.js";
import { analysisQueue } from "../services/queue.service.js";
import catchAsync from "../utils/catchAsync.js";
import {AppError} from "../utils/AppError.js";

export const createAnalysis = catchAsync(async (req, res) => {
  const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      throw new AppError("resumeId and jobDescription are required", 400);
    }

    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume || resume.userId !== req.user.userId) {
      throw new AppError("Resume not found or unauthorized", 404);
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
    await analysisQueue.add(
  "analyze-resume",
  {
    analysisId: pendingAnalysis.id,
    resumeText: resume.rawText,
    jobDescription: jobDescription,
  },
  {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: 50,
    removeOnFail: 20,
  }
);

    // 3. Immediately return success to the user (Don't wait for the AI!)
    res.status(202).json({
      message: "Analysis added to processing queue",
      analysis: pendingAnalysis,
    });
    
});

export const getAnalysisById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const analysis = await prisma.analysis.findUnique({
      where: { id },
    });

    if (!analysis || analysis.userId !== req.user.userId) {
      throw new AppError("Analysis not found or unauthorized", 404);
    }

    res.status(200).json(analysis);
});

export const getAnalysesByResumeId = catchAsync(async (req, res) => {
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
});