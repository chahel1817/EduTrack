import express from "express";
import { generateQuizWithAI } from "../services/openrouter.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /api/ai/generate-quiz
 * Authenticated (teacher) AI quiz generation
 */
router.post("/generate-quiz", authenticate, async (req, res) => {
  try {
    const { topic, difficulty, totalQuestions } = req.body;

    /* ---------------- VALIDATION ---------------- */
    if (!topic || !difficulty || !totalQuestions) {
      return res.status(400).json({
        message: "Missing required fields (topic, difficulty, totalQuestions)",
        questions: [],
      });
    }

    if (Number(totalQuestions) < 1 || Number(totalQuestions) > 50) {
      return res.status(400).json({
        message: "totalQuestions must be between 1 and 50",
        questions: [],
      });
    }

    /* ---------------- AI CALL ---------------- */
    const result = await generateQuizWithAI({
      topic,
      difficulty,
      totalQuestions: Number(totalQuestions),
    });

    /* ---------------- RESPONSE GUARANTEE ---------------- */
    if (!result || !Array.isArray(result.questions)) {
      console.error("❌ Invalid AI response structure:", result);

      return res.status(200).json({
        questions: [],
        message: "AI returned invalid format",
      });
    }

    return res.status(200).json({
      questions: result.questions,
    });

  } catch (err) {
    console.error("🔥 OpenRouter AI Error:", err.message);

    /* NEVER crash frontend */
    return res.status(200).json({
      questions: [],
      message: "AI generation failed, please try again",
    });
  }
});

export default router;
