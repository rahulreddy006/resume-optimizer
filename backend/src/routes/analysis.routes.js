import express from "express";
import { createAnalysis } from "../controllers/analysis.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect); // Secure the route

router.post("/", createAnalysis);

export default router;