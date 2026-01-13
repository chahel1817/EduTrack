import dotenv from "dotenv";

/**
 * ✅ Load ENV FIRST — before anything else
 */
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import sendEmail from "./utils/sendEmail.js";

/**
 * ✅ SAFETY CHECKS
 */
if (!process.env.JWT_SECRET) {
  throw new Error("❌ JWT_SECRET missing in .env");
}

if (!process.env.OPENROUTER_API_KEY && !process.env.HF_API_KEY) {
  console.warn("⚠️ No AI API key found OpenRouter");
}

/**
 * ✅ DEBUG LOGS (CLEAR & HONEST)
 */
console.log("🔑 JWT_SECRET:", "LOADED ✅");
console.log("🤖 OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY ? "LOADED ✅" : "NOT SET");


/**
 * ✅ Connect DB AFTER env is ready
 */
connectDB();

const app = express();

/**
 * ✅ Middlewares
 */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

/**
 * ✅ Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/feedback", feedbackRoutes);

/**
 * ✅ Health
 */

app.get("/test-email", async (req, res) => {
  await sendEmail({
    to: "chahel1817@gmail.com",
    subject: "EduTrack Test Email",
    html: "<h2>Outlook SMTP Working 🎉</h2>",
  });
  res.send("Email sent");
});
app.get("/", (req, res) => {
  res.json({
    message: "EduTrack API",
    status: "running",
    time: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

/**
 * ✅ BETTER ERROR HANDLER (IMPORTANT)
 */
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`EduTrack server running on http://localhost:${PORT}`);
});
