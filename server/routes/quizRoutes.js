import express from "express";
import Quiz from "../models/Quiz.js";
import Result from "../models/Result.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create quiz (authenticated users)
router.post("/", authenticate, async (req, res) => {
  const { title, subject, description, questions } = req.body;

  if (!title || !subject || !questions || questions.length === 0) {
    return res.status(400).json({ message: "Title, subject, and questions are required" });
  }

  try {
    const quiz = await Quiz.create({ title, subject, description, questions, createdBy: req.user.id });
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all quizzes (authenticated users)
router.get("/", authenticate, async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("createdBy", "name");
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Clear all quizzes (for development)
router.delete("/clear", async (req, res) => {
  try {
    await Quiz.deleteMany({});
    await Result.deleteMany({});
    res.json({ message: "All quizzes and results cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get quiz by ID (authenticated users)
router.get("/:id", authenticate, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("createdBy", "name");
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update quiz (teacher who created it)
router.put("/:id", authenticate, authorize(["teacher"]), async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    );
    if (!quiz) return res.status(404).json({ message: "Quiz not found or unauthorized" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete quiz (teacher who created it)
router.delete("/:id", authenticate, authorize(["teacher"]), async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!quiz) return res.status(404).json({ message: "Quiz not found or unauthorized" });
    res.json({ message: "Quiz deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
