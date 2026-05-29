import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import prisma from "../utils/prisma.js";
import { generateV2Analysis } from "./ai.service.js";
import { getIO } from "../utils/socket.js";

// ======================================================
// Redis Connection
// ======================================================

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

// ======================================================
// Queue
// ======================================================

export const analysisQueue = new Queue(
  "resume-analysis",
  {
    connection,
  }
);

// ======================================================
// Worker
// ======================================================

const worker = new Worker(
  "resume-analysis",
  async (job) => {
    const {
      analysisId,
      resumeText,
      jobDescription,
    } = job.data;

    try {
      console.log(
        `Starting Job ${job.id} | Analysis ID: ${analysisId}`
      );

      // Mark Processing
      await prisma.analysis.update({
        where: { id: analysisId },
        data: {
          status: "processing",
          errorMessage: null,
        },
      });

      // Run Gemini Analysis
      const aiResult =
        await generateV2Analysis(
          resumeText,
          jobDescription
        );

      // Validate AI Response
      if (
        !aiResult ||
        typeof aiResult.score !== "number"
      ) {
        throw new Error(
          "Invalid Gemini response received."
        );
      }

      // Save Results
      await prisma.analysis.update({
        where: { id: analysisId },
        data: {
          score: aiResult.score,
          matchedKeywords:
            aiResult.matchedKeywords || [],
          missingKeywords:
            aiResult.missingKeywords || [],
          sectionFeedback:
            aiResult.sectionFeedback || {},
          suggestions:
            aiResult.suggestions || [],
          rewrittenBullets:
            aiResult.rewrittenBullets || [],
          coverLetter:
            aiResult.coverLetter || "",
          status: "complete",
          errorMessage: null,
        },
      });

      console.log(
        `Job ${job.id} completed successfully`
      );

      // Success Event
      getIO().emit("analysisComplete", {
        analysisId,
        message:
          "Gemini V2 Analysis Finished",
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error(
        `Job ${job.id} failed:`,
        error
      );

      // Mark Failed
      await prisma.analysis.update({
        where: { id: analysisId },
        data: {
          status: "failed",
          errorMessage:
            error.message ||
            "Unknown error occurred",
        },
      });

      // Failure Event
      getIO().emit("analysisFailed", {
        analysisId,
        message:
          error.message ||
          "Analysis failed",
      });

      throw error;
    }
  },
  {
    connection,
    concurrency: 3,
  }
);

// ======================================================
// Worker Events
// ======================================================

worker.on("ready", () => {
  console.log(
    "BullMQ Worker Ready - Waiting for jobs..."
  );
});

worker.on("completed", (job) => {
  console.log(
    `Job ${job.id} completed`
  );
});

worker.on("failed", (job, err) => {
  console.error(
    `Job ${job?.id} failed with error:`,
    err.message
  );
});

worker.on("error", (err) => {
  console.error(
    "Worker Error:",
    err
  );
});
