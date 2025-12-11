import express from "express";
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
  async (req, res) => {
    try {
      const { title, subject, description, questions, timeLimit } = req.body;

      if (!title || !subject || !questions || questions.length === 0) {
        return res.status(400).json({
          message: "Quiz must include title, subject, and at least 1 question",
        });
      }

      const quiz = await Quiz.create({
        title: title.trim(),
        subject: subject.trim(),
        description: description || "",
        questions,
        timeLimit: timeLimit || 30,
        createdBy: req.user.id,
      });

      return res.status(201).json(quiz);
    } catch (error) {
      console.error("Create Quiz Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/* --------------------------------------------------------
   GET ALL QUIZZES (Authenticated Users)
-------------------------------------------------------- */
router.get("/", authenticate, async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    return res.json(quizzes);
  } catch (error) {
    console.error("Get Quizzes Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* --------------------------------------------------------
   CLEAR ALL QUIZZES + RESULTS (Dev Only)
-------------------------------------------------------- */
router.delete("/clear", async (req, res) => {
  try {
    await Quiz.deleteMany();
    await Result.deleteMany();

    return res.json({
      message: "All quizzes & results cleared (dev feature only)",
    });
  } catch (error) {
    console.error("Clear Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* --------------------------------------------------------
   GET QUIZ BY ID (Authenticated)
-------------------------------------------------------- */
router.get("/:id", authenticate, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate(
      "createdBy",
      "name role"
    );

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    return res.json(quiz);
  } catch (error) {
    console.error("Get Quiz Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* --------------------------------------------------------
   UPDATE QUIZ (Teacher + Must Be Creator)
-------------------------------------------------------- */
router.put(
  "/:id",
  authenticate,
  authorize(["teacher"]),
  async (req, res) => {
    try {
      const updated = await Quiz.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user.id },
        req.body,
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({
          message: "Quiz not found or you are not the creator",
        });
      }

      return res.json(updated);
    } catch (error) {
      console.error("Update Quiz Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/* --------------------------------------------------------
   DELETE QUIZ (Teacher + Must Be Creator)
-------------------------------------------------------- */
router.delete(
  "/:id",
  authenticate,
  authorize(["teacher"]),
  async (req, res) => {
    try {
      const deleted = await Quiz.findOneAndDelete({
        _id: req.params.id,
        createdBy: req.user.id,
      });

      if (!deleted) {
        return res.status(404).json({
          message: "Quiz not found or unauthorized",
        });
      }

      return res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
      console.error("Delete Quiz Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
