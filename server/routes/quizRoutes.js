import express from "express";
import { body, validationResult } from "express-validator";
import Quiz from "../models/Quiz.js";
import Result from "../models/Result.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/* --------------------------------------------------------
   CREATE QUIZ (Teacher Only)
-------------------------------------------------------- */
router.post(
  "/",
  authenticate,
  authorize(["teacher"]),
  [
    body("title")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters"),
    body("subject")
      .trim()
      .notEmpty()
      .withMessage("Subject is required"),
    body("questions")
      .isArray({ min: 1 })
      .withMessage("At least one question is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const {
        title,
        subject,
        description,
        questions,
        timeLimit,
        enableQuestionTimeLimit,
      } = req.body;

      const quiz = new Quiz({
        title: title.trim(),
        subject: subject.trim(),
        description: description || "",
        questions: questions.map((q) => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          points: q.points || 1,
          timeLimit: q.timeLimit || null,
        })),
        timeLimit: timeLimit || null,
        enableQuestionTimeLimit: enableQuestionTimeLimit || false,
        createdBy: req.user.id,
      });

      await quiz.save();
      await quiz.populate("createdBy", "name email role");

      // Notify all users about new quiz
      req.io.emit("notification", {
        type: "new_quiz",
        message: `New Quiz Alert: "${quiz.title}" has been published by ${quiz.createdBy.name}!`,
        data: { quizId: quiz._id, subject: quiz.subject, createdBy: req.user.id }
      });

      res.status(201).json({
        _id: quiz._id,
        id: quiz._id,
        title: quiz.title,
        subject: quiz.subject,
        description: quiz.description,
        questions: quiz.questions,
        timeLimit: quiz.timeLimit,
        enableQuestionTimeLimit: quiz.enableQuestionTimeLimit,
        createdBy: quiz.createdBy,
        createdAt: quiz.createdAt,
        updatedAt: quiz.updatedAt,
      });
    } catch (error) {
      console.error("Create Quiz Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* --------------------------------------------------------
   GET ALL QUIZZES (Authenticated Users)
-------------------------------------------------------- */
router.get("/", authenticate, async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    const formatted = quizzes.map((quiz) => ({
      _id: quiz._id,
      id: quiz._id,
      title: quiz.title,
      subject: quiz.subject,
      description: quiz.description,
      timeLimit: quiz.timeLimit,
      enableQuestionTimeLimit: quiz.enableQuestionTimeLimit,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
      createdBy: quiz.createdBy,
      questionsCount: quiz.questions.length,
      totalPoints: quiz.questions.reduce((s, q) => s + q.points, 0),
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Get Quizzes Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* --------------------------------------------------------
   GET QUIZ BY ID (Authenticated)
-------------------------------------------------------- */
router.get("/:id", authenticate, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json({
      _id: quiz._id,
      id: quiz._id,
      title: quiz.title,
      subject: quiz.subject,
      description: quiz.description,
      timeLimit: quiz.timeLimit,
      enableQuestionTimeLimit: quiz.enableQuestionTimeLimit,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
      createdBy: quiz.createdBy,
      questions: quiz.questions,
      totalPoints: quiz.questions.reduce((s, q) => s + q.points, 0),
    });
  } catch (error) {
    console.error("Get Quiz Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* --------------------------------------------------------
   UPDATE QUIZ (Teacher + Creator Only)
-------------------------------------------------------- */
router.put(
  "/:id",
  authenticate,
  authorize(["teacher"]),
  async (req, res) => {
    try {
      const quiz = await Quiz.findOne({
        _id: req.params.id,
        createdBy: req.user.id,
      });

      if (!quiz) {
        return res
          .status(404)
          .json({ message: "Quiz not found or unauthorized" });
      }

      Object.assign(quiz, req.body);
      await quiz.save();
      await quiz.populate("createdBy", "name email role");

      res.json(quiz);
    } catch (error) {
      console.error("Update Quiz Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* --------------------------------------------------------
   DELETE QUIZ (Teacher + Creator Only)  ✅ FIXED
-------------------------------------------------------- */
router.delete(
  "/:id",
  authenticate,
  authorize(["teacher"]),
  async (req, res) => {
    try {
      const quiz = await Quiz.findOne({
        _id: req.params.id,
        createdBy: req.user.id,
      });

      if (!quiz) {
        return res
          .status(404)
          .json({ message: "Quiz not found or unauthorized" });
      }

      // 🔥 Delete related results first
      await Result.deleteMany({ quiz: quiz._id });

      // 🔥 Delete quiz
      await Quiz.findByIdAndDelete(quiz._id);

      res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
      console.error("Delete Quiz Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* --------------------------------------------------------
   GET TEACHER'S QUIZZES
-------------------------------------------------------- */
router.get(
  "/teacher/my-quizzes",
  authenticate,
  authorize(["teacher"]),
  async (req, res) => {
    try {
      const quizzes = await Quiz.find({ createdBy: req.user.id })
        .populate("createdBy", "name email role")
        .sort({ createdAt: -1 });

      res.json(
        quizzes.map((quiz) => ({
          _id: quiz._id,
          id: quiz._id,
          title: quiz.title,
          subject: quiz.subject,
          description: quiz.description,
          timeLimit: quiz.timeLimit,
          enableQuestionTimeLimit: quiz.enableQuestionTimeLimit,
          createdAt: quiz.createdAt,
          updatedAt: quiz.updatedAt,
          createdBy: quiz.createdBy,
          questionsCount: quiz.questions.length,
          totalPoints: quiz.questions.reduce((s, q) => s + q.points, 0),
        }))
      );
    } catch (error) {
      console.error("Get Teacher Quizzes Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
