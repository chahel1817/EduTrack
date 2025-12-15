import express from "express";
import { body, validationResult } from "express-validator";
import Result from "../models/Result.js";
import Quiz from "../models/Quiz.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/* --------------------------------------------------------
   SUBMIT QUIZ RESULT (Student Only)
-------------------------------------------------------- */
router.post(
  "/",
  authenticate,
  [
    body("quiz").isMongoId().withMessage("Valid quiz ID is required"),
    body("score").isInt({ min: 0 }).withMessage("Score must be a non-negative integer"),
    body("total").isInt({ min: 1 }).withMessage("Total must be at least 1"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { quiz, score, total, answers, timeSpent } = req.body;

      if (!quiz || score === undefined || total === undefined) {
        return res.status(400).json({ message: "Quiz, score, and total are required" });
      }

      if (total <= 0) {
        return res.status(400).json({ message: "Total questions must be greater than 0" });
      }

      // Check if student has already submitted this quiz
      const existing = await Result.findOne({
        student: req.user.id,
        quiz: quiz
      });

      if (existing) {
        return res.status(400).json({ message: "You have already submitted this quiz" });
      }

      const percentage = total > 0 ? ((score / total) * 100).toFixed(2) : 0;
      const minutesSpent = Math.max(0, Math.floor((timeSpent || 0) / 60));

      // Get the quiz to map answers to questions
      const quizDoc = await Quiz.findById(quiz);
      if (!quizDoc) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      // Map answers to questions
      const mappedAnswers = [];
      if (Array.isArray(answers) && answers.length > 0) {
        answers.forEach((ans, index) => {
          if (quizDoc.questions[index]) {
            mappedAnswers.push({
              question: quizDoc.questions[index]._id,
              selectedAnswer: ans.selectedAnswer ?? -1,
              isCorrect: ans.isCorrect || false,
              points: ans.points || 0,
            });
          }
        });
      }

      const resultData = {
        student: req.user.id,
        quiz: quiz,
        score,
        total,
        percentage: parseFloat(percentage),
        timeSpent: minutesSpent,
        answers: mappedAnswers,
      };

      const result = new Result(resultData);
      await result.save();

      // Populate quiz and student for response
      await result.populate('quiz', 'title subject');
      await result.populate('student', 'name email');

      return res.status(201).json({
        _id: result._id,
        quiz: result.quiz,
        score: result.score,
        total: result.total,
        percentage: result.percentage,
        timeSpent: result.timeSpent,
        submittedAt: result.createdAt,
        createdAt: result.createdAt,
      });
    } catch (error) {
      console.error("Result Submission Error:", error);
      return res.status(500).json({ message: "Failed to submit quiz result" });
    }
  }
);

/* --------------------------------------------------------
   GET STUDENT'S OWN RESULTS
-------------------------------------------------------- */
router.get("/student", authenticate, async (req, res) => {
  try {
    const results = await Result.find({ student: req.user.id })
      .populate('quiz', 'title subject')
      .sort({ createdAt: -1 });

    const formattedResults = results.map((r) => ({
      _id: r._id,
      quiz: r.quiz,
      score: r.score,
      total: r.total,
      percentage: r.percentage,
      timeSpent: r.timeSpent,
      submittedAt: r.createdAt,
      createdAt: r.createdAt,
      answers: r.answers.map(a => ({
        questionIndex: r.quiz.questions.findIndex(q => q._id.equals(a.question)),
        selectedAnswer: a.selectedAnswer,
        isCorrect: a.isCorrect,
        points: a.points,
      })),
    }));

    return res.json(formattedResults);
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
      .populate('student', 'name email')
      .populate({
        path: 'quiz',
        select: 'title subject createdBy',
        populate: { path: 'createdBy', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    const teacherResults = results.filter(
      (r) => r.quiz && r.quiz.createdBy.equals(req.user.id)
    );

    const formattedResults = teacherResults.map((r) => ({
      _id: r._id,
      student: r.student,
      quiz: r.quiz,
      score: r.score,
      total: r.total,
      percentage: r.percentage,
      timeSpent: r.timeSpent,
      submittedAt: r.createdAt,
      createdAt: r.createdAt,
    }));

    return res.json(formattedResults);
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
    const quiz = await Quiz.findOne({
      _id: req.params.quizId,
      createdBy: req.user.id
    });

    if (!quiz) {
      return res.status(403).json({ message: "Unauthorized to view these results" });
    }

    const results = await Result.find({ quiz: req.params.quizId })
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    const formattedResults = results.map((r) => ({
      _id: r._id,
      student: r.student,
      score: r.score,
      total: r.total,
      percentage: r.percentage,
      timeSpent: r.timeSpent,
      submittedAt: r.createdAt,
      createdAt: r.createdAt,
    }));

    return res.json(formattedResults);
  } catch (error) {
    console.error("Get Quiz Results Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* --------------------------------------------------------
   GET DETAILED RESULT WITH ANSWERS (Student or Teacher)
-------------------------------------------------------- */
router.get("/:resultId/details", authenticate, async (req, res) => {
  try {
    const result = await Result.findById(req.params.resultId)
      .populate('student', 'name email')
      .populate({
        path: 'quiz',
        select: 'title subject createdBy',
        populate: { path: 'createdBy', select: 'name email' }
      });

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    const isStudent = result.student._id.equals(req.user.id);
    const isTeacher = result.quiz.createdBy.equals(req.user.id);

    if (!isStudent && !isTeacher) {
      return res.status(403).json({ message: "Unauthorized to view this result" });
    }

    const formattedAnswers = result.answers.map((ans) => ({
      questionIndex: result.quiz.questions.findIndex(q => q._id.equals(ans.question)),
      selectedAnswer: ans.selectedAnswer,
      isCorrect: ans.isCorrect,
      points: ans.points,
    }));

    return res.json({
      _id: result._id,
      student: result.student,
      quiz: result.quiz,
      score: result.score,
      total: result.total,
      percentage: result.percentage,
      timeSpent: result.timeSpent,
      submittedAt: result.createdAt,
      answers: formattedAnswers,
    });
  } catch (error) {
    console.error("Get Result Details Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* --------------------------------------------------------
   GET LEADERBOARD FOR A QUIZ
-------------------------------------------------------- */
router.get("/leaderboard/:quizId", authenticate, async (req, res) => {
  try {
    const results = await Result.find({ quiz: req.params.quizId })
      .populate('student', 'name')
      .sort({ percentage: -1, timeSpent: 1 })
      .limit(10);

    const leaderboard = results.map((r, index) => ({
      rank: index + 1,
      studentName: r.student.name,
      score: r.score,
      total: r.total,
      percentage: r.percentage,
      timeSpent: r.timeSpent,
    }));

    return res.json(leaderboard);
  } catch (error) {
    console.error("Get Leaderboard Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
