import express from "express";
import { 
  createAnalysis, 
  getAnalysisById, 
  getAnalysesByResumeId 
} from "../controllers/analysis.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect); 

router.post("/", createAnalysis);
router.get("/:id", getAnalysisById);
router.get("/resume/:resumeId", getAnalysesByResumeId);

export default router;