import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import supabase from "./config/supabase.js";
import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";

dotenv.config();

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "your_jwt_secret_key_here_make_it_very_secure_and_long_minimum_32_characters";
}

const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from("users").select("count").limit(1);
    if (error && error.code !== 'PGRST116') {
      console.error("Supabase connection error:", error.message);
    } else {
      console.log("✓ Supabase database connected successfully");
    }
  } catch (err) {
    console.error("Failed to connect to Supabase:", err.message);
  }
};

testSupabaseConnection();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/results", resultRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "EduTrack API v2.0 - Powered by Supabase",
    status: "running",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", database: "supabase" });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 EduTrack Server v2.0`);
  console.log(`📍 Running on port ${PORT}`);
  console.log(`🗄️  Database: Supabase PostgreSQL`);
  console.log(`✨ Ready to accept requests\n`);
});
