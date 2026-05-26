import prisma from "../utils/prisma.js";
import { parseResume } from "../services/parser.service.js";

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
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
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getUserResumes = async (req, res) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.user.userId },
      orderBy: { uploadedAt: "desc" },
    });
    res.status(200).json(resumes);
  } catch (error) {
    console.error("Fetch resumes error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;

    const resume = await prisma.resume.findUnique({
      where: { id },
    });

    if (!resume || resume.userId !== req.user.userId) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    await prisma.resume.delete({
      where: { id },
    });

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Delete resume error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};