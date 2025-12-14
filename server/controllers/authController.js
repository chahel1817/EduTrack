import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

/* --------------------------------------------------------
   SIGNUP CONTROLLER
-------------------------------------------------------- */
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, age, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: role || "student",
      age,
      phone,
    });

    return res.status(201).json({
      message: "Signup successful",
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/* --------------------------------------------------------
   LOGIN CONTROLLER
-------------------------------------------------------- */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Remove password before sending
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      age: user.age,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.json({
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/* --------------------------------------------------------
   PROFILE CONTROLLER (Protected)
-------------------------------------------------------- */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json(user);
  } catch (error) {
    console.error("Profile Error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/* --------------------------------------------------------
   FORGOT PASSWORD CONTROLLER
-------------------------------------------------------- */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        message: "Email not registered",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP for storage
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    // Set OTP and expiry (10 minutes)
    user.resetOTP = hashedOTP;
    user.resetOTPExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send email
    await sendEmail({
      to: user.email,
      subject: "EduTrack Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
    });

    return res.json({
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/* --------------------------------------------------------
   VERIFY OTP CONTROLLER
-------------------------------------------------------- */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validation
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    // Hash the provided OTP
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      resetOTP: hashedOTP,
      resetOTPExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // Clear OTP fields
    user.resetOTP = null;
    user.resetOTPExpiry = null;
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Remove password before sending
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      age: user.age,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.json({
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
