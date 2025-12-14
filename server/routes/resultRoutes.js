import express from "express";
<<<<<<< HEAD
import {
  submitResult,
  getResultsByQuiz,
  getStudentResults,
  getAllResults,
} from "../controllers/resultController.js";
import { authenticate } from "../middleware/authMiddleware.js";
=======
import { body, validationResult } from "express-validator";
import supabase from "../config/supabase.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
>>>>>>> b88a038d8fd3994e1d8e412b28adc53c774f02e5

const router = express.Router();

/* -------------------------------
   RESULT ROUTES
-------------------------------- */

<<<<<<< HEAD
router.post("/", authenticate, submitResult);              // student submits quiz
router.get("/quiz/:id", authenticate, getResultsByQuiz);   // teacher view quiz results
router.get("/student", authenticate, getStudentResults);   // student profile
router.get("/all", authenticate, getAllResults);           // teacher analytics
=======
    if (!quiz || score === undefined || total === undefined) {
      return res.status(400).json({ message: "Quiz, score, and total are required" });
    }

    if (total <= 0) {
      return res.status(400).json({ message: "Total questions must be greater than 0" });
    }

    const { data: existing } = await supabase
      .from("results")
      .select("id")
      .eq("student_id", req.user.id)
      .eq("quiz_id", quiz)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ message: "You have already submitted this quiz" });
    }

    const percentage = total > 0 ? ((score / total) * 100).toFixed(2) : 0;
    const minutesSpent = Math.max(0, Math.floor((timeSpent || 0) / 60));

    const { data: result, error: resultError } = await supabase
      .from("results")
      .insert({
        student_id: req.user.id,
        quiz_id: quiz,
        score,
        total,
        percentage,
        time_spent: minutesSpent,
      })
      .select()
      .single();

    if (resultError) {
      console.error("Result submission error:", resultError);
      return res.status(500).json({ message: "Failed to submit quiz result" });
    }

    if (Array.isArray(answers) && answers.length > 0) {
      const { data: quizQuestions } = await supabase
        .from("questions")
        .select("id, order_index")
        .eq("quiz_id", quiz)
        .order("order_index");

      if (quizQuestions && quizQuestions.length > 0) {
        const answerDetailsToInsert = answers.map((ans) => {
          const question = quizQuestions.find((q) => q.order_index === ans.questionIndex);
          return question ? {
            result_id: result.id,
            question_id: question.id,
            selected_answer: ans.selectedAnswer ?? -1,
            is_correct: ans.isCorrect || false,
            points_earned: ans.points || 0,
          } : null;
        }).filter(Boolean);

        if (answerDetailsToInsert.length > 0) {
          await supabase.from("answer_details").insert(answerDetailsToInsert);
        }
      }
    }

    const { data: completeResult } = await supabase
      .from("results")
      .select(`
        *,
        quiz:quizzes (
          id,
          title,
          subject
        )
      `)
      .eq("id", result.id)
      .single();

    return res.status(201).json({
      _id: completeResult.id,
      quiz: completeResult.quiz,
      score: completeResult.score,
      total: completeResult.total,
      percentage: completeResult.percentage,
      timeSpent: completeResult.time_spent,
      submittedAt: completeResult.submitted_at,
      createdAt: completeResult.created_at,
    });
  } catch (error) {
    console.error("Result Submission Error:", error);
    return res.status(500).json({ message: "Failed to submit quiz result" });
  }
});

/* --------------------------------------------------------
   GET STUDENT'S OWN RESULTS
-------------------------------------------------------- */
router.get("/student", authenticate, async (req, res) => {
  try {
    const { data: results, error } = await supabase
      .from("results")
      .select(`
        *,
        quiz:quizzes (
          id,
          title,
          subject
        )
      `)
      .eq("student_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get student results error:", error);
      return res.status(500).json({ message: "Failed to fetch results" });
    }

    const formattedResults = results.map((r) => ({
      _id: r.id,
      quiz: r.quiz,
      score: r.score,
      total: r.total,
      percentage: r.percentage,
      timeSpent: r.time_spent,
      submittedAt: r.submitted_at,
      createdAt: r.created_at,
      answers: [],
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
    const { data: results, error } = await supabase
      .from("results")
      .select(`
        *,
        student:users!student_id (
          id,
          name,
          email
        ),
        quiz:quizzes!quiz_id (
          id,
          title,
          subject,
          created_by
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get all results error:", error);
      return res.status(500).json({ message: "Failed to fetch results" });
    }

    const teacherResults = results.filter(
      (r) => r.quiz && r.quiz.created_by === req.user.id
    );

    const formattedResults = teacherResults.map((r) => ({
      _id: r.id,
      student: r.student,
      quiz: r.quiz,
      score: r.score,
      total: r.total,
      percentage: r.percentage,
      timeSpent: r.time_spent,
      submittedAt: r.submitted_at,
      createdAt: r.created_at,
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
    const { data: quiz } = await supabase
      .from("quizzes")
      .select("created_by")
      .eq("id", req.params.quizId)
      .eq("created_by", req.user.id)
      .maybeSingle();

    if (!quiz) {
      return res.status(403).json({ message: "Unauthorized to view these results" });
    }

    const { data: results, error } = await supabase
      .from("results")
      .select(`
        *,
        student:users!student_id (
          id,
          name,
          email
        )
      `)
      .eq("quiz_id", req.params.quizId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get quiz results error:", error);
      return res.status(500).json({ message: "Failed to fetch results" });
    }

    const formattedResults = results.map((r) => ({
      _id: r.id,
      student: r.student,
      score: r.score,
      total: r.total,
      percentage: r.percentage,
      timeSpent: r.time_spent,
      submittedAt: r.submitted_at,
      createdAt: r.created_at,
    }));

    return res.json(formattedResults);
  } catch (error) {
    console.error("Get Quiz Results Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
>>>>>>> b88a038d8fd3994e1d8e412b28adc53c774f02e5

/* --------------------------------------------------------
   GET DETAILED RESULT WITH ANSWERS (Student or Teacher)
-------------------------------------------------------- */
router.get("/:resultId/details", authenticate, async (req, res) => {
  try {
    const { data: result, error: resultError } = await supabase
      .from("results")
      .select(`
        *,
        student:users!student_id (id, name, email),
        quiz:quizzes!quiz_id (
          id,
          title,
          subject,
          created_by
        ),
        answer_details (
          *,
          question:questions (
            id,
            question_text,
            options,
            correct_answer,
            order_index
          )
        )
      `)
      .eq("id", req.params.resultId)
      .maybeSingle();

    if (resultError || !result) {
      return res.status(404).json({ message: "Result not found" });
    }

    const isStudent = result.student_id === req.user.id;
    const isTeacher = result.quiz.created_by === req.user.id;

    if (!isStudent && !isTeacher) {
      return res.status(403).json({ message: "Unauthorized to view this result" });
    }

    const formattedAnswers = result.answer_details.map((ans) => ({
      questionIndex: ans.question.order_index,
      selectedAnswer: ans.selected_answer,
      isCorrect: ans.is_correct,
      points: ans.points_earned,
    }));

    return res.json({
      _id: result.id,
      student: result.student,
      quiz: result.quiz,
      score: result.score,
      total: result.total,
      percentage: result.percentage,
      timeSpent: result.time_spent,
      submittedAt: result.submitted_at,
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
    const { data: results, error } = await supabase
      .from("results")
      .select(`
        *,
        student:users!student_id (
          id,
          name
        )
      `)
      .eq("quiz_id", req.params.quizId)
      .order("percentage", { ascending: false })
      .order("time_spent", { ascending: true })
      .limit(10);

    if (error) {
      console.error("Get leaderboard error:", error);
      return res.status(500).json({ message: "Failed to fetch leaderboard" });
    }

    const leaderboard = results.map((r, index) => ({
      rank: index + 1,
      studentName: r.student.name,
      score: r.score,
      total: r.total,
      percentage: r.percentage,
      timeSpent: r.time_spent,
    }));

    return res.json(leaderboard);
  } catch (error) {
    console.error("Get Leaderboard Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
