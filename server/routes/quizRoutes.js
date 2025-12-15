import express from "express";
import { body, validationResult } from "express-validator";
import Quiz from "../models/Quiz.js";
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
    body("title").trim().isLength({ min: 3 }).withMessage("Title must be at least 3 characters"),
    body("subject").trim().notEmpty().withMessage("Subject is required"),
    body("questions").isArray({ min: 1 }).withMessage("At least one question is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { title, subject, description, questions, timeLimit, enableQuestionTimeLimit } = req.body;

      const quizData = {
        title: title.trim(),
        subject: subject.trim(),
        description: description || "",
        questions: questions.map(q => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          points: q.points || 1,
          timeLimit: q.timeLimit || null,
        })),
        timeLimit: timeLimit || null,
        enableQuestionTimeLimit: enableQuestionTimeLimit || false,
        createdBy: req.user.id,
      };

      const quiz = new Quiz(quizData);
      await quiz.save();

      // Populate createdBy for response
      await quiz.populate('createdBy', 'name email role');

      return res.status(201).json({
        _id: quiz._id,
        id: quiz._id,
        title: quiz.title,
        subject: quiz.subject,
        description: quiz.description,
        questions: quiz.questions.map(q => ({
          _id: q._id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          points: q.points,
          timeLimit: q.timeLimit,
        })),
        timeLimit: quiz.timeLimit,
        enableQuestionTimeLimit: quiz.enableQuestionTimeLimit,
        createdBy: quiz.createdBy,
        createdAt: quiz.createdAt,
        updatedAt: quiz.updatedAt,
      });
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
    const { subject, search } = req.query;

    let query = Quiz.find()
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    if (subject) {
      query = query.where('subject', subject);
    }

    if (search) {
      query = query.where({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } }
        ]
      });
    }

    const quizzes = await query;

    const formattedQuizzes = quizzes.map((quiz) => ({
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
      totalPoints: quiz.questions.reduce((sum, q) => sum + q.points, 0),
    }));

    return res.json(formattedQuizzes);
  } catch (error) {
    console.error("Get Quizzes Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* --------------------------------------------------------
   GET QUIZ BY ID (Authenticated)
-------------------------------------------------------- */
router.get("/:id", authenticate, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name email role');

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const formattedQuiz = {
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
      questions: quiz.questions.map(q => ({
        _id: q._id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: q.points,
        timeLimit: q.timeLimit,
      })),
      totalPoints: quiz.questions.reduce((sum, q) => sum + q.points, 0),
    };

    return res.json(formattedQuiz);
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
      const { title, subject, description, timeLimit, enableQuestionTimeLimit, questions } = req.body;

      const quiz = await Quiz.findOne({ _id: req.params.id, createdBy: req.user.id });

      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found or unauthorized" });
      }

      const updateData = {};
      if (title) updateData.title = title.trim();
      if (subject) updateData.subject = subject.trim();
      if (description !== undefined) updateData.description = description;
      if (timeLimit !== undefined) updateData.timeLimit = timeLimit;
      if (enableQuestionTimeLimit !== undefined) updateData.enableQuestionTimeLimit = enableQuestionTimeLimit;
      if (questions) {
        updateData.questions = questions.map(q => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          points: q.points || 1,
          timeLimit: q.timeLimit || null,
        }));
      }

      const updatedQuiz = await Quiz.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      ).populate('createdBy', 'name email role');

      return res.json({
        _id: updatedQuiz._id,
        id: updatedQuiz._id,
        title: updatedQuiz.title,
        subject: updatedQuiz.subject,
        description: updatedQuiz.description,
        timeLimit: updatedQuiz.timeLimit,
        enableQuestionTimeLimit: updatedQuiz.enableQuestionTimeLimit,
        createdBy: updatedQuiz.createdBy,
        createdAt: updatedQuiz.createdAt,
        updatedAt: updatedQuiz.updatedAt,
        questions: updatedQuiz.questions.map(q => ({
          _id: q._id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          points: q.points,
          timeLimit: q.timeLimit,
        })),
        totalPoints: updatedQuiz.questions.reduce((sum, q) => sum + q.points, 0),
      });
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
      const { error } = await supabase
        .from("quizzes")
        .delete()
        .eq("id", req.params.id)
        .eq("created_by", req.user.id);

      if (error) {
        return res.status(404).json({ message: "Quiz not found or unauthorized" });
      }

      return res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
      console.error("Delete Quiz Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);


/* --------------------------------------------------------
   GET TEACHER'S QUIZZES
-------------------------------------------------------- */
router.get("/teacher/my-quizzes", authenticate, authorize(["teacher"]), async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user.id })
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    const formattedQuizzes = quizzes.map((quiz) => ({
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
      totalPoints: quiz.questions.reduce((sum, q) => sum + q.points, 0),
      submissionsCount: 0, // TODO: Implement when results are migrated
    }));

    return res.json(formattedQuizzes);
  } catch (error) {
    console.error("Get Teacher Quizzes Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
