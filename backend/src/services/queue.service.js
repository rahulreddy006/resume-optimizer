import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import prisma from '../utils/prisma.js';
import { generateV2Analysis } from './ai.service.js';
import { getIO } from '../utils/socket.js';

// 1. Connect to Redis (The Waiting Room)
const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

// 2. Create the Queue
export const analysisQueue = new Queue('resume-analysis', { connection });

// 3. Create the Background Worker
const worker = new Worker('resume-analysis', async (job) => {
  const { analysisId, resumeText, jobDescription } = job.data;
  
  try {
    // Tell DB we are working on it
    await prisma.analysis.update({
      where: { id: analysisId },
      data: { status: 'processing' }
    });

    // Run the heavy Gemini AI task
    const aiResult = await generateV2Analysis(resumeText, jobDescription);

    // Save final AI results to Database
    await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        score: aiResult.score,
        matchedKeywords: aiResult.matchedKeywords,
        missingKeywords: aiResult.missingKeywords,
        sectionFeedback: aiResult.sectionFeedback,
        suggestions: aiResult.suggestions,
        rewrittenBullets: aiResult.rewrittenBullets,
        coverLetter: aiResult.coverLetter,
        status: 'complete'
      }
    });

    console.log(`Job ${job.id} completed successfully!`);

    // Broadcast the success to the frontend
    getIO().emit('analysisComplete', { 
      analysisId: analysisId,
      message: 'Gemini V2 Analysis Finished'
    });

    // TODO: Emit WebSocket event to Frontend here (Next Step)

  } catch (error) {
    console.error(`Job ${job.id} failed:`, error);
    await prisma.analysis.update({
      where: { id: analysisId },
      data: { status: 'failed' }
    });
  }
}, { connection });

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});