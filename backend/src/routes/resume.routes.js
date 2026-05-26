import express from "express";
import { uploadResume, getUserResumes, deleteResume } from "../controllers/resume.controller.js";
import { protect } from "../middlewares/auth.middleware.js"; 
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Protect all routes
router.use(protect); 

router.post("/upload", upload.single("file"), uploadResume); 
router.get("/", getUserResumes);
router.delete("/:id", deleteResume);

export default router;