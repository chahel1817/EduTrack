import express from "express";
import { generateQuizWithAI, explainQuestionWithAI } from "../services/openrouter.js";
import { authenticate } from "../middleware/authMiddleware.js";
import multer from "multer";

// Handle pdf-parse CJS import in ESM
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const router = express.Router();

// MULTER CONFIG
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

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

    /* ---------------- AI CALL ---------------- */
    const result = await generateQuizWithAI({
      topic,
      difficulty,
      totalQuestions: Number(totalQuestions),
    });

    return res.status(200).json({
      questions: result.questions,
    });

  } catch (err) {
    console.error("🔥 OpenRouter AI Error:", err.message);
    return res.status(200).json({
      questions: [],
      message: "AI generation failed",
    });
  }
});

/**
 * POST /api/ai/generate-from-pdf
 * Extracts text from PDF and generates questions
 */
router.post("/generate-from-pdf", authenticate, upload.single("pdf"), async (req, res) => {
  try {
    const { difficulty, totalQuestions } = req.body;
    const file = req.file;

    if (!file) {
      console.warn("⚠️ PDF Upload Failed: No file provided");
      return res.status(400).json({ message: "PDF file is required. Please select a valid file." });
    }

    console.log("📄 Processing PDF:", file.originalname, "Size:", file.size);

    // 1. EXTRACT TEXT
    let extractedText = "";
    try {
      const data = await pdfParse(file.buffer);
      extractedText = data.text;
      console.log("📝 Extracted characters:", extractedText?.length);
    } catch (parseErr) {
      console.error("❌ PDF Parsing Critical Failure:", parseErr.message);
      return res.status(400).json({
        message: "Failed to read PDF structure.",
        details: parseErr.message
      });
    }

    if (!extractedText || extractedText.trim().length < 50) {
      console.warn("⚠️ Insufficient Text Extracted. Length:", extractedText?.length);
      return res.status(400).json({
        message: "This PDF contains too little readable text. Please use a text-heavy document."
      });
    }

    // 2. GENERATE QUESTIONS
    console.log("🤖 Sending to AI...");
    const result = await generateQuizWithAI({
      difficulty: difficulty || "medium",
      totalQuestions: Number(totalQuestions) || 5,
      content: extractedText
    });

    if (!result || !result.questions) {
      throw new Error("AI failed to return questions");
    }

    console.log("✅ AI generated", result.questions.length, "questions");

    return res.status(200).json({
      questions: result.questions,
    });

  } catch (err) {
    console.error("🔥 PDF AI Error:", err.message);
    return res.status(500).json({
      message: "Failed to generate questions from PDF",
      error: err.message
    });
  }
});

/**
 * POST /api/ai/explain
 * Get AI tutor explanation for quiz results
 */
router.post("/explain", authenticate, async (req, res) => {
  try {
    const { question, selectedOption, correctOption, context } = req.body;
    const explanation = await explainQuestionWithAI({ question, selectedOption, correctOption, context });
    res.json({ explanation });
  } catch (err) {
    res.status(500).json({ message: "Explanation failed" });
  }
});

export default router;
