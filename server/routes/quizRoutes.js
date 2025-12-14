import express from "express";
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

export default router;
