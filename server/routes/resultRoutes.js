import express from "express";
import Result from "../models/Result.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student submits quiz result
router.post("/", authenticate, async (req, res) => {
  const { quiz, score, total, answers, timeSpent } = req.body;

  if (score === undefined || total === undefined || !quiz) {
    return res.status(400).json({ message: "Quiz, score, and total are required" });
  }

  try {
    // Check if student already submitted this quiz
    const existingResult = await Result.findOne({ student: req.user.id, quiz });
    if (existingResult) {
      return res.status(400).json({ message: "You have already submitted this quiz" });
    }

    const result = await Result.create({ 
      student: req.user.id, 
      quiz, 
      score, 
      total, 
      answers: answers || [],
      timeSpent: timeSpent || 0
    });
    
    await result.populate('quiz', 'title subject');
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Student view own results
router.get("/student", authenticate, async (req, res) => {
  try {
    const results = await Result.find({ student: req.user.id }).populate("quiz", "title subject");
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Teacher view all student results
router.get("/all", authenticate, authorize(["teacher"]), async (req, res) => {
  try {
    const results = await Result.find().populate("student", "name email").populate("quiz", "title subject");
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get results for a specific quiz (teacher)
router.get("/quiz/:quizId", authenticate, authorize(["teacher"]), async (req, res) => {
  try {
    const results = await Result.find({ quiz: req.params.quizId }).populate("student", "name email");
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
