import dotenv from "dotenv";

/**
 * ✅ Load ENV FIRST — before anything else
 */
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
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
const httpServer = createServer(app);

/**
 * ✅ Socket.io Setup
 */
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL
].filter(Boolean);

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins for Socket.io temporarily
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Middleware to attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined their notification room`);
  });

  socket.on("disconnect", () => {
    console.log("🔌 User disconnected");
  });
});

/**
 * ✅ Middlewares
 */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  cors({
    origin: true, // Allow all origins explicitly
    credentials: true,
  })
);

import errorMiddleware from "./middleware/errorMiddleware.js";

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
 * ✅ Global Error Handler (Unified)
 */
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`EduTrack server running on http://localhost:${PORT}`);
});

export { io };
