import fetch from "node-fetch";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export const generateQuizWithAI = async ({ topic, difficulty, totalQuestions, content = null }) => {
  console.log("🔍 Checking API key...");

  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY missing from environment");
  }

  let prompt = "";
  if (content) {
    prompt = `Content for Quiz:
    "${content.substring(0, 8000)}"

    Generate ${totalQuestions} ${difficulty} level multiple-choice questions based on the content above.
    
    Format requirements:
    1. Respond with a JSON object containing a "questions" array.
    2. Each question must have: "question", "options" (array of 4), "correctAnswer" (0-3 index), and "category" (a specific skill or sub-topic found in the text).
    3. Ensure questions are accurate and directly based on the provided text.`;
  } else {
    prompt = `Topic: "${topic}"
    Generate ${totalQuestions} ${difficulty} level multiple-choice questions on this topic.
    
    Format requirements:
    1. Respond with a JSON object containing a "questions" array.
    2. Each question must have: "question", "options" (array of 4), "correctAnswer" (0-3 index), and "category" (a sub-topic).`;
  }

  console.log("� AI Prompt Length:", prompt.length);

  console.log("�📤 Making request to OpenRouter...");
  console.log("Model: openai/gpt-3.5-turbo");
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
          { role: "system", content: "You are an expert quiz generator. You take content and turn it into high-quality multiple choice questions. You always respond with ONLY valid JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 3000,
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

export const explainQuestionWithAI = async ({ question, selectedOption, correctOption, context }) => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY missing");
  }

  const prompt = `Context: This is a quiz about "${context}".
  Question: "${question}"
  The student selected: "${selectedOption}"
  The correct answer is: "${correctOption}"
  
  Explain why the correct answer is right and why the student's answer was wrong (if they were different). Keep the explanation encouraging, professional, and easy to understand for a student. Max 3-4 sentences.`;

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an encouraging AI tutor. You explain concepts clearly to students." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate an explanation right now.";
  } catch (error) {
    console.error("Explain AI Error:", error);
    return "Failed to fetch explanation from AI Tutor.";
  }
};
