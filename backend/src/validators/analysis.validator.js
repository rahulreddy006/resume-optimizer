import { z } from 'zod';

export const createAnalysisSchema = z.object({
  resumeId: z.string().uuid({ message: "Invalid Resume ID format" }),
  jobDescription: z.string()
    .min(50, { message: "Job description must be at least 50 characters to analyze properly." })
    .max(5000, { message: "Job description is too long." })
});