import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Plus,
  Save,
  Trash2,
  AlertCircle,
  Sparkles,
  Wand2,
} from "lucide-react";

const CreateQuizQuestions = () => {
  const { state: quizDetails } = useLocation();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: null },
  ]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------------- AI STATES (NEW) ---------------- */
  const [difficulty, setDifficulty] = useState("Easy");
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  /* ---------------- QUESTION HANDLERS ---------------- */

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: null },
    ]);
    setErrors({});
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
      setErrors({});
    }
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);

    if (errors[index]) {
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  /* ---------------- AI GENERATE HANDLER (NEW) ---------------- */

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const res = await api.post("/ai/generate-quiz", {
        topic: quizDetails.subject,
        difficulty,
        totalQuestions,
      });

      if (res.data?.questions?.length > 0) {
  setQuestions(res.data.questions);
} else {
  alert("AI returned no questions, try again");
}

    } catch (err) {
      console.error("AI generation failed:", err);
      alert("AI service is temporarily unavailable. Try again in a moment.");
    } finally {
      setIsGenerating(false);
    }
  };

  /* ---------------- VALIDATION ---------------- */

  const validateQuestions = () => {
    const newErrors = {};

    questions.forEach((q, index) => {
      if (!q.question.trim()) {
        newErrors[index] = { question: "Question text is required" };
      }

      if (q.options.filter(o => o.trim()).length < 2) {
        newErrors[index] = {
          ...newErrors[index],
          options: "At least 2 options are required",
        };
      }

      if (q.correctAnswer === null) {
        newErrors[index] = {
          ...newErrors[index],
          correctAnswer: "Select the correct answer",
        };
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    if (!validateQuestions()) return;

    setIsSubmitting(true);
    try {
      await api.post("/quizzes", {
        ...quizDetails,
        questions,
      });

      navigate("/quiz-success");
    } catch (error) {
      console.error(error);
      alert("Failed to create quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      <main className="dashboard-main">
        <div className="dashboard-section max-w-4xl mx-auto">

          {/* ---------------- AI GENERATOR UI ---------------- */}
          <div className="ai-generator-card">
            <div className="ai-generator-header">
              <Sparkles size={20} />
              <h3>Generate Questions with AI</h3>
            </div>

            <div className="ai-generator-controls">
              <div className="control-group">
                <label>Difficulty</label>
                <select
                  className="input-field"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              <div className="control-group">
                <label>Number of Questions</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  className="input-field"
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(Number(e.target.value))}
                  placeholder="Number of questions"
                />
              </div>

              <button
                className="btn btn-primary ai-generate-btn"
                onClick={handleGenerateAI}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "✨ Generate"}
              </button>
            </div>
          </div>




          {/* ---------------- QUESTIONS ---------------- */}
          {questions.map((q, i) => (
            <div key={i} className="card mb-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Question {i + 1}
                </h3>
                {questions.length > 1 && (
                  <button onClick={() => removeQuestion(i)}>
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <textarea
                className="input-field mb-6"
                value={q.question}
                onChange={(e) => updateQuestion(i, "question", e.target.value)}
                placeholder="Enter question"
              />

              {q.options.map((opt, idx) => (
                <div key={idx} className="flex gap-3 mb-4 items-center">

                  <input
                    type="radio"
                    checked={q.correctAnswer === idx}
                    onChange={() => updateQuestion(i, "correctAnswer", idx)}
                  />
                  <input
                    className="input-field flex-1"
                    value={opt}
                    onChange={(e) => updateOption(i, idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                  />
                </div>
              ))}

              {errors[i] && (
                <div className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle size={16} /> Fix errors before submitting
                </div>
              )}
            </div>
          ))}

          {/* ---------------- ACTIONS ---------------- */}
          <div className="flex justify-between gap-4">
            <button className="btn btn-outline" onClick={addQuestion}>
              <Plus size={18} /> Add Question
            </button>

            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : <><Save size={18} /> Create Quiz</>}
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateQuizQuestions;
