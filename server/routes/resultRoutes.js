import express from "express";
import {
  submitResult,
  getResultsByQuiz,
  getStudentResults,
  getAllResults,
} from "../controllers/resultController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

/* -------------------------------
   RESULT ROUTES
-------------------------------- */

router.post("/", authenticate, submitResult);              // student submits quiz
router.get("/quiz/:id", authenticate, getResultsByQuiz);   // teacher view quiz results
router.get("/student", authenticate, getStudentResults);   // student profile
router.get("/all", authenticate, getAllResults);           // teacher analytics

export default router;
