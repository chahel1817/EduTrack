import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  signup,
  login,
  logout,
  getProfile,
  forgotPassword,
  verifyOTP,
  updateProfile,
} from "../controllers/authController.js";

const router = express.Router();

/* --------------------------------------------------------
   PUBLIC ROUTES
-------------------------------------------------------- */
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);

/* --------------------------------------------------------
   PROTECTED ROUTES
-------------------------------------------------------- */
router.get("/me", authenticate, getProfile);
router.get("/profile", authenticate, getProfile);
router.post("/logout", authenticate, logout);
router.put("/profile", authenticate, updateProfile);

export default router;
