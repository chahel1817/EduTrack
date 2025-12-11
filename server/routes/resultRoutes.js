import express from "express";
import Result from "../models/Result.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/* --------------------------------------------------------
   SUBMIT QUIZ RESULT (Student Only)
-------------------------------------------------------- */
router.post("/", authenticate, async (req, res) => {
  try {
    const { quiz, score, total, answers, timeSpent } = req.body;

    // Validate inputs
    if (!quiz || score === undefined || total === undefined) {
      return res.status(400).json({ message: "Quiz, score, and total are required" });
    }

    if (total <= 0) {
      return res.status(400).json({ message: "Total questions must be greater than 0" });
    }

    // Prevent double submission
    const existing = await Result.findOne({ student: req.user.id, quiz });
    if (existing) {
      return res.status(400).json({ message: "You have already submitted this quiz" });
    }

    // Convert time (seconds -> minutes)
    const minutesSpent = Math.max(0, Math.floor((timeSpent || 0) / 60));

    // Create result record
    const result = await Result.create({
      student: req.user.id,
      quiz,
      score,
      total,
      answers: Array.isArray(answers) ? answers : [],
      timeSpent: minutesSpent
      // Percentage auto-calculated by schema pre-save
    });

    await result.populate("quiz", "title subject");

    return res.status(201).json(result);
  } catch (error) {
    console.error("Result Submission Error:", error);
    return res.status(500).json({
      message: "Failed to submit quiz result. Please try again.",
    });
  }
});

/* --------------------------------------------------------
   GET STUDENT'S OWN RESULTS
-------------------------------------------------------- */
router.get("/student", authenticate, async (req, res) => {
  try {
    const results = await Result.find({ student: req.user.id })
      .populate("quiz", "title subject")
      .sort({ createdAt: -1 })
      .lean();

    return res.json(results);
  } catch (error) {
    console.error("Get Student Results Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* --------------------------------------------------------
   GET ALL RESULTS (Teacher Only)
-------------------------------------------------------- */
router.get("/all", authenticate, authorize(["teacher"]), async (req, res) => {
  try {
    const results = await Result.find()
      .populate("student", "name email")
      .populate("quiz", "title subject")
      .sort({ createdAt: -1 })
      .lean();

    return res.json(results);
  } catch (error) {
    console.error("Get All Results Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* --------------------------------------------------------
   GET RESULTS FOR SPECIFIC QUIZ (Teacher Only)
-------------------------------------------------------- */
router.get("/quiz/:quizId", authenticate, authorize(["teacher"]), async (req, res) => {
  try {
    const results = await Result.find({ quiz: req.params.quizId })
      .populate("student", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return res.json(results);
  } catch (error) {
    console.error("Get Quiz Results Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
