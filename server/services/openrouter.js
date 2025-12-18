import fetch from "node-fetch";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export const generateQuizWithAI = async ({ topic, difficulty, totalQuestions }) => {
  console.log("🔍 Checking API key...");
  console.log("API key exists:", !!process.env.OPENROUTER_API_KEY);
  console.log("API key starts with:", process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.substring(0, 10) + "..." : "NOT SET");

  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY missing from environment");
  }

  const prompt = `Generate ${totalQuestions} ${difficulty} level multiple-choice questions on "${topic}".

Return ONLY valid JSON in this format:
{
  "questions": [
    {
      "question": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": 1
    }
  ]
}`;

  console.log("📤 Making request to OpenRouter...");
  console.log("Model: anthropic/claude-3-haiku");
  console.log("Topic:", topic, "Difficulty:", difficulty, "Questions:", totalQuestions);

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
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a quiz generator. Always respond with valid JSON only. No explanations, no markdown, just pure JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    console.log("📡 Response status:", response.status);
    console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API request failed with status:", response.status);
      console.error("❌ Error response:", errorText);
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("📦 Full API response:", JSON.stringify(data, null, 2));

    const rawText = data?.choices?.[0]?.message?.content;

    if (!rawText) {
      console.error("❌ No content in choices[0].message.content");
      console.error("❌ Full response data:", data);
      throw new Error("Empty response from OpenRouter - no content in response");
    }

    console.log("📝 Raw AI text:", rawText);

    // Remove markdown if present
    let cleaned = rawText
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    console.log("🧹 Cleaned text:", cleaned);

    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1) {
      console.error("❌ No JSON object found in cleaned text");
      throw new Error("No JSON found in AI output");
    }

    const jsonString = cleaned.slice(start, end + 1);
    console.log("🔍 Extracted JSON string:", jsonString);

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
      console.log("✅ Successfully parsed JSON");
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError.message);
      console.error("❌ Failed to parse:", jsonString);
      throw new Error(`Invalid JSON from AI: ${parseError.message}`);
    }

    if (!Array.isArray(parsed.questions)) {
      console.error("❌ Parsed object doesn't have questions array:", parsed);
      throw new Error("Invalid quiz format - questions is not an array");
    }

    if (parsed.questions.length === 0) {
      console.error("❌ Questions array is empty");
      throw new Error("AI generated empty questions array");
    }

    console.log("✅ Successfully generated", parsed.questions.length, "questions");
    return parsed;

  } catch (error) {
    console.error("❌ OpenRouter error:", error.message);
    console.error("❌ Stack:", error.stack);
    throw error;
  }
};
