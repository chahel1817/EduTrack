import express from "express";
import { signup, login, getProfile, forgotPassword, verifyOTP } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

/* ---------------- SIGNUP ---------------- */
router.post("/signup", signup);

/* ---------------- PASSWORD LOGIN ---------------- */
router.post("/login", login);

/* ---------------- FORGOT PASSWORD ---------------- */
router.post("/forgot-password", forgotPassword);

/* ---------------- VERIFY OTP ---------------- */
router.post("/verify-otp", verifyOTP);

/* ---------------- PROFILE (Protected) ---------------- */
router.get("/profile", authenticate, getProfile);

/* --------------------------------------------------------
   GET CURRENT USER (ME)
-------------------------------------------------------- */
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Auth Me Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
