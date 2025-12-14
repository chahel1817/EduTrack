import express from "express";
<<<<<<< HEAD
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  deleteQuiz,
} from "../controllers/quizController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

/* -------------------------------
   QUIZ ROUTES
-------------------------------- */

router.post("/", authenticate, createQuiz);     // teacher
router.get("/", authenticate, getAllQuizzes);   // all users
router.get("/:id", authenticate, getQuizById);  // all users
router.delete("/:id", authenticate, deleteQuiz);// teacher only
=======
import { body, validationResult } from "express-validator";
import supabase from "../config/supabase.js";
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

      const { title, subject, description, questions, timeLimit, difficulty } = req.body;

      const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .insert({
          title: title.trim(),
          subject: subject.trim(),
          description: description || "",
          time_limit: timeLimit || 30,
          difficulty: difficulty || "medium",
          created_by: req.user.id,
        })
        .select()
        .single();

      if (quizError) {
        console.error("Quiz creation error:", quizError);
        return res.status(500).json({ message: "Failed to create quiz" });
      }

      const questionsToInsert = questions.map((q, index) => ({
        quiz_id: quiz.id,
        question_text: q.question,
        options: q.options,
        correct_answer: q.correctAnswer,
        points: q.points || 1,
        order_index: index,
      }));

      const { error: questionsError } = await supabase
        .from("questions")
        .insert(questionsToInsert);

      if (questionsError) {
        console.error("Questions creation error:", questionsError);
        await supabase.from("quizzes").delete().eq("id", quiz.id);
        return res.status(500).json({ message: "Failed to create questions" });
      }

      const { data: completeQuiz } = await supabase
        .from("quizzes")
        .select(`
          *,
          questions (*)
        `)
        .eq("id", quiz.id)
        .single();

      return res.status(201).json(completeQuiz);
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
    const { subject, difficulty, search } = req.query;

    let query = supabase
      .from("quizzes")
      .select(`
        *,
        created_by_user:users!created_by (
          id,
          name,
          role
        ),
        questions (id)
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (subject) {
      query = query.eq("subject", subject);
    }

    if (difficulty) {
      query = query.eq("difficulty", difficulty);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,subject.ilike.%${search}%`);
    }

    const { data: quizzes, error } = await query;

    if (error) {
      console.error("Get quizzes error:", error);
      return res.status(500).json({ message: "Failed to fetch quizzes" });
    }

    const formattedQuizzes = quizzes.map((quiz) => ({
      _id: quiz.id,
      id: quiz.id,
      title: quiz.title,
      subject: quiz.subject,
      description: quiz.description,
      difficulty: quiz.difficulty,
      timeLimit: quiz.time_limit,
      isActive: quiz.is_active,
      totalPoints: quiz.total_points,
      createdAt: quiz.created_at,
      updatedAt: quiz.updated_at,
      createdBy: quiz.created_by_user,
      questions: quiz.questions,
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
    const { data: quiz, error } = await supabase
      .from("quizzes")
      .select(`
        *,
        created_by_user:users!created_by (
          id,
          name,
          role
        ),
        questions (*)
      `)
      .eq("id", req.params.id)
      .maybeSingle();

    if (error || !quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.questions.sort((a, b) => a.order_index - b.order_index);

    const formattedQuiz = {
      _id: quiz.id,
      id: quiz.id,
      title: quiz.title,
      subject: quiz.subject,
      description: quiz.description,
      difficulty: quiz.difficulty,
      timeLimit: quiz.time_limit,
      isActive: quiz.is_active,
      totalPoints: quiz.total_points,
      createdAt: quiz.created_at,
      updatedAt: quiz.updated_at,
      createdBy: quiz.created_by_user,
      questions: quiz.questions.map(q => ({
        _id: q.id,
        question: q.question_text,
        options: q.options,
        correctAnswer: q.correct_answer,
        points: q.points
      }))
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
      const { title, subject, description, timeLimit, difficulty, isActive } = req.body;

      const updateData = {};
      if (title) updateData.title = title.trim();
      if (subject) updateData.subject = subject.trim();
      if (description !== undefined) updateData.description = description;
      if (timeLimit) updateData.time_limit = timeLimit;
      if (difficulty) updateData.difficulty = difficulty;
      if (isActive !== undefined) updateData.is_active = isActive;

      const { data: updated, error } = await supabase
        .from("quizzes")
        .update(updateData)
        .eq("id", req.params.id)
        .eq("created_by", req.user.id)
        .select()
        .single();

      if (error || !updated) {
        return res.status(404).json({ message: "Quiz not found or unauthorized" });
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
>>>>>>> b88a038d8fd3994e1d8e412b28adc53c774f02e5

/* --------------------------------------------------------
   GET TEACHER'S QUIZZES
-------------------------------------------------------- */
router.get("/teacher/my-quizzes", authenticate, authorize(["teacher"]), async (req, res) => {
  try {
    const { data: quizzes, error } = await supabase
      .from("quizzes")
      .select(`
        *,
        questions (id),
        results (id)
      `)
      .eq("created_by", req.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get teacher quizzes error:", error);
      return res.status(500).json({ message: "Failed to fetch quizzes" });
    }

    const formattedQuizzes = quizzes.map((quiz) => ({
      ...quiz,
      questionsCount: quiz.questions.length,
      submissionsCount: quiz.results.length,
    }));

    return res.json(formattedQuizzes);
  } catch (error) {
    console.error("Get Teacher Quizzes Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
