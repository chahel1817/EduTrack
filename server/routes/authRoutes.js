import express from "express";
<<<<<<< HEAD
import { signup, login, getProfile, forgotPassword, verifyOTP } from "../controllers/authController.js";
=======
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import supabase from "../config/supabase.js";
>>>>>>> b88a038d8fd3994e1d8e412b28adc53c774f02e5
import { authenticate } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

<<<<<<< HEAD
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
=======
/* --------------------------------------------------------
   SIGNUP
-------------------------------------------------------- */
router.post(
  "/signup",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Invalid email address"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").optional().isIn(["student", "teacher"]).withMessage("Role must be student or teacher"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { name, email, password, role, age, phone } = req.body;

      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", email.toLowerCase())
        .maybeSingle();

      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const { data: newUser, error } = await supabase
        .from("users")
        .insert({
          name: name.trim(),
          email: email.toLowerCase(),
          password: hashedPassword,
          role: role || "student",
          age: age ? parseInt(age) : null,
          phone: phone || null,
        })
        .select()
        .single();

      if (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Failed to create account" });
      }

      return res.status(201).json({ message: "Signup successful" });
    } catch (error) {
      console.error("Signup Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);
>>>>>>> b88a038d8fd3994e1d8e412b28adc53c774f02e5

/* --------------------------------------------------------
   GET CURRENT USER (ME)
-------------------------------------------------------- */
<<<<<<< HEAD
router.get("/me", authenticate, async (req, res) => {
=======
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { email, password } = req.body;

      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email.toLowerCase())
        .maybeSingle();

      if (error || !user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role, user_id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      const { password: _, ...safeUser } = user;

      return res.json({ token, user: safeUser });
    } catch (error) {
      console.error("Login Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/* --------------------------------------------------------
   PROFILE (Protected)
-------------------------------------------------------- */
router.get("/profile", authenticate, async (req, res) => {
>>>>>>> b88a038d8fd3994e1d8e412b28adc53c774f02e5
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, role, age, phone, avatar_url, created_at, updated_at")
      .eq("id", req.user.id)
      .maybeSingle();

    if (error || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Auth Me Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* --------------------------------------------------------
   UPDATE PROFILE (Protected)
-------------------------------------------------------- */
router.put(
  "/profile",
  authenticate,
  [
    body("name").optional().trim().isLength({ min: 2 }),
    body("age").optional().isInt({ min: 10, max: 100 }),
    body("phone").optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { name, age, phone } = req.body;

      const updateData = {};
      if (name) updateData.name = name.trim();
      if (age) updateData.age = parseInt(age);
      if (phone !== undefined) updateData.phone = phone || null;

      const { data: updatedUser, error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", req.user.id)
        .select("id, name, email, role, age, phone, avatar_url, created_at, updated_at")
        .single();

      if (error) {
        return res.status(500).json({ message: "Failed to update profile" });
      }

      return res.json(updatedUser);
    } catch (error) {
      console.error("Update Profile Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
