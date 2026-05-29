import prisma from "../utils/prisma.js";
import { parseResume } from "../services/parser.service.js";
import catchAsync from "../utils/catchAsync.js";
import {AppError} from "../utils/AppError.js";

export const uploadResume = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError("No file uploaded", 400);
  }

    // 1. Parse the raw text
    const rawText = await parseResume(req.file.buffer, req.file.mimetype);

    // 2. Determine file type for the DB
    const fileType = req.file.mimetype === "application/pdf" ? "pdf" : "docx";

    // 3. Save to database
    const newResume = await prisma.resume.create({
      data: {
        fileName: req.file.originalname,
        fileType,
        rawText,
        userId: req.user.userId, // Pulled from your auth middleware
      },
    });

    res.status(201).json({
      message: "Resume uploaded successfully",
      resume: newResume,
    });
 
});

export const getUserResumes = catchAsync(async (req, res) => {
  const resumes = await prisma.resume.findMany({
    where: { userId: req.user.userId },
    orderBy: { uploadedAt: "desc" },
  });
    res.status(200).json(resumes);
});

export const deleteResume = catchAsync(async (req, res) => {
  const { id } = req.params;

  const resume = await prisma.resume.findUnique({
    where: { id },
  });

  if (!resume || resume.userId !== req.user.userId) {
    throw new AppError(
      "Resume not found or unauthorized",
      404
    );
  }

  await prisma.resume.delete({
    where: { id },
  });

  res.status(200).json({
    success: true,
    message: "Resume deleted successfully",
  });
});