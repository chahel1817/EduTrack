import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";

/* --------------------------------------------------
   LOAD ENV (MUST BE FIRST)
-------------------------------------------------- */
dotenv.config();

/* --------------------------------------------------
   DEBUG ENV (REMOVE AFTER CONFIRMATION)
-------------------------------------------------- */
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is undefined. Check your .env file location.");
  process.exit(1);
}

/* --------------------------------------------------
   CONNECT DATABASE
-------------------------------------------------- */
connectDB();

const app = express();

/* --------------------------------------------------
   MIDDLEWARES
-------------------------------------------------- */
app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend
    credentials: true,
  })
);

app.use(express.json());

/* --------------------------------------------------
   ROUTES
-------------------------------------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/results", resultRoutes);

/* --------------------------------------------------
   HEALTH CHECK
-------------------------------------------------- */
app.get("/", (req, res) => {
  res.send("🚀 EduTrack API is running");
});

/* --------------------------------------------------
   GLOBAL ERROR HANDLER
-------------------------------------------------- */
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

/* --------------------------------------------------
   START SERVER
-------------------------------------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});
