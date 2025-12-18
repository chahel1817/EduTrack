import fetch from "node-fetch";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const FALLBACK_QUESTIONS = (topic, difficulty, total) => ({
  questions: Array.from({ length: total }).map((_, i) => ({
    question: `${topic} (${difficulty}) – Question ${i + 1}?`,
    options: [
      "Option A",
      "Option B",
      "Option C",
      "Option D",
    ],
    correctAnswer: 0,
  })),
});

export const generateQuizWithAI = async ({ topic, difficulty, totalQuestions }) => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY missing");
  }

  const prompt = `
Generate ${totalQuestions} ${difficulty} level multiple-choice questions on "${topic}".

Requirements:
- Questions should be practical and real-world oriented
- Focus on concepts, applications, and problem-solving
- Make questions educational and relevant to real scenarios
- Ensure questions test understanding, not just memorization
- Options should be plausible and clearly distinguishable

Return ONLY valid JSON in this format:
{
  "questions": [
    {
      "question": "string",
      "options": ["string","string","string","string"],
      "correctAnswer": 0
    }
  ]
}
`;

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "EduTrack",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You are a quiz generator. Output JSON only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
      }),
    });

    const data = await response.json();
    const rawText = data?.choices?.[0]?.message?.content;

    if (!rawText) {
      console.warn("⚠️ OpenRouter returned empty response");
      return FALLBACK_QUESTIONS(topic, difficulty, totalQuestions);
    }

    // Remove markdown if present
    let cleaned = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1) {
      console.warn("⚠️ No JSON found in AI output");
      return FALLBACK_QUESTIONS(topic, difficulty, totalQuestions);
    }

    const parsed = JSON.parse(cleaned.slice(start, end + 1));

    if (!Array.isArray(parsed.questions)) {
      console.warn("⚠️ Invalid quiz format");
      return FALLBACK_QUESTIONS(topic, difficulty, totalQuestions);
    }

    return parsed;

  } catch (error) {
    console.error("❌ OpenRouter error:", error.message);
    return FALLBACK_QUESTIONS(topic, difficulty, totalQuestions);
  }
};
