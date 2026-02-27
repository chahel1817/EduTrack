import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import redis from "../config/redis.js";
import asyncHandler from "../utils/asyncHandler.js";

// Cache TTL in seconds (1 hour default)
const USER_CACHE_TTL = 3600;

/* --------------------------------------------------------
   SIGNUP CONTROLLER
-------------------------------------------------------- */
export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role, age, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email and password are required" });
  }

  const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
  if (existingUser) {
    return res.status(400).json({ success: false, message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 8);
  await User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: hashedPassword,
    role: role || "student",
    age,
    phone,
  });

  res.status(201).json({ success: true, message: "Signup successful" });
});

/* --------------------------------------------------------
   LOGIN CONTROLLER
-------------------------------------------------------- */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

  const safeUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    age: user.age,
    phone: user.phone,
    photo: user.photo,
    linkedin: user.linkedin,
    github: user.github,
    location: user.location,
    skills: user.skills,
    bio: user.bio,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  try {
    await redis.set(`user:${user._id}`, JSON.stringify(safeUser), 'EX', USER_CACHE_TTL);
  } catch (err) {
    console.warn('⚠️ Redis Cache Error:', err.message);
  }

  res.json({ success: true, token, user: safeUser });
});

/* --------------------------------------------------------
   LOGOUT / SESSION BLACKLIST
-------------------------------------------------------- */
export const logout = asyncHandler(async (req, res) => {
  const token = req.token;
  if (token) {
    // Blacklist for 7 days (matching JWT expiry)
    await redis.set(`blacklist:${token}`, 'true', 'EX', 7 * 24 * 60 * 60);
  }
  res.json({ success: true, message: "Logged out successfully" });
});

/* --------------------------------------------------------
   PROFILE CONTROLLER
-------------------------------------------------------- */
export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    const cachedUser = await redis.get(`user:${userId}`);
    if (cachedUser) return res.json(JSON.parse(cachedUser));
  } catch (err) {
    console.warn('⚠️ Redis GET Error:', err.message);
  }

  const user = await User.findById(userId).select("-password");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  try {
    await redis.set(`user:${userId}`, JSON.stringify(user), 'EX', USER_CACHE_TTL);
  } catch (err) {
    console.warn('⚠️ Redis SET Error:', err.message);
  }

  res.json(user);
});

/* --------------------------------------------------------
   PASSWORD / OTP FLOWS (OTP remains same logic but cleaner)
-------------------------------------------------------- */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) return res.status(400).json({ success: false, message: "Email not registered" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  user.resetOTP = hashedOTP;
  user.resetOTPExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "EduTrack Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
  });

  res.json({ success: true, message: "OTP sent to your email" });
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required" });

  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");
  const user = await User.findOne({
    email: email.trim().toLowerCase(),
    resetOTP: hashedOTP,
    resetOTPExpiry: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

  user.resetOTP = null;
  user.resetOTPExpiry = null;
  await user.save();

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

  const safeUser = {
    _id: user._id, name: user.name, email: user.email, role: user.role, age: user.age, phone: user.phone, photo: user.photo,
    linkedin: user.linkedin, github: user.github, location: user.location, skills: user.skills, bio: user.bio,
    createdAt: user.createdAt, updatedAt: user.updatedAt,
  };

  try { await redis.set(`user:${user._id}`, JSON.stringify(safeUser), 'EX', USER_CACHE_TTL); } catch (err) { }

  res.json({ success: true, token, user: safeUser });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, age, phone, photo, linkedin, github, location, skills, bio } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  if (name) user.name = name.trim();
  if (age !== undefined) user.age = age;
  if (phone !== undefined) user.phone = phone;
  if (photo !== undefined) user.photo = photo;
  if (linkedin !== undefined) user.linkedin = linkedin;
  if (github !== undefined) user.github = github;
  if (location !== undefined) user.location = location;
  if (skills !== undefined) user.skills = skills;
  if (bio !== undefined) user.bio = bio;

  await user.save();

  const safeUser = {
    _id: user._id, name: user.name, email: user.email, role: user.role, age: user.age, phone: user.phone, photo: user.photo,
    linkedin: user.linkedin, github: user.github, location: user.location, skills: user.skills, bio: user.bio,
    createdAt: user.createdAt, updatedAt: user.updatedAt,
  };

  try {
    await redis.del(`user:${user._id}`);
    await redis.set(`user:${user._id}`, JSON.stringify(safeUser), 'EX', USER_CACHE_TTL);
  } catch (err) { }

  res.json({ success: true, message: "Profile updated successfully", user: safeUser });
});
