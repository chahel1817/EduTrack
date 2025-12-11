import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

/* --------------------------------------------------------
   SIGNUP
-------------------------------------------------------- */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, age, phone } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email & password are required" });
    }

    // Email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: role || "student",
      age,
      phone
    });

    return res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* --------------------------------------------------------
   LOGIN
-------------------------------------------------------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // JWT (expires in 7 days)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Clean user data (no password)
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      age: user.age,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return res.json({ token, user: safeUser });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* --------------------------------------------------------
   PROFILE (Protected)
-------------------------------------------------------- */
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Profile Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
