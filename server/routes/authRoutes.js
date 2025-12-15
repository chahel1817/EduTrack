import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

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

      const existingUser = await User.findOne({ email: email.toLowerCase() });

      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || "student",
        age: age ? parseInt(age) : null,
        phone: phone || null,
      });

      await newUser.save();

      return res.status(201).json({ message: "Signup successful" });
    } catch (error) {
      console.error("Signup Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/* --------------------------------------------------------
   LOGIN
-------------------------------------------------------- */
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

      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user._id.toString(), role: user.role, user_id: user._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      const safeUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        phone: user.phone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return res.json({ token, user: safeUser });
    } catch (error) {
      console.error("Login Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/* --------------------------------------------------------
   GET CURRENT USER (ME)
-------------------------------------------------------- */
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email role age phone createdAt updatedAt");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      age: user.age,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error("Auth Me Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* --------------------------------------------------------
   PROFILE (Protected)
-------------------------------------------------------- */
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email role age phone createdAt updatedAt");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      age: user.age,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error("Auth Profile Error:", error);
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

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        updateData,
        { new: true, select: "name email role age phone createdAt updatedAt" }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        age: updatedUser.age,
        phone: updatedUser.phone,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      });
    } catch (error) {
      console.error("Update Profile Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
