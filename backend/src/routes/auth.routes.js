import express from "express";
import { register, login,refreshAccessToken,logout,googleCallback } from "../controllers/auth.controller.js";
import {registerSchema} from "../validators/auth.validator.js";
import validator from "../middlewares/validate.js";
import passport from "passport";

const router = express.Router();

router.post("/register", validator(registerSchema), register);
router.post("/login", login);
router.post(
  "/refresh",
  refreshAccessToken
);
router.post("/logout", logout);
router.get(
  "/google",
  passport.authenticate(
    "google",
    {
      scope: ["profile", "email"],
    }
  )
);
router.get(
  "/google/callback",

  passport.authenticate(
    "google",
    {
      session: false,
    }
  ),

  googleCallback
);

export default router;