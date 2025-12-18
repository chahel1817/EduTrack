import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { api } from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Plus,
  Save,
  Trash2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const CreateQuizQuestions = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const quizDetails = location.state;

  /* ---------------- SAFETY CHECK ---------------- */
  useEffect(() => {
    if (!quizDetails) {
      navigate("/create-quiz");
    }
  }, [quizDetails, navigate]);

  /* ---------------- QUESTIONS STATE ---------------- */
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: null,
      timeLimit: quizDetails?.enableQuestionTimeLimit
        ? quizDetails.questionTimeLimit
        : null,
    },
  ]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------------- AI STATES ---------------- */
  const [difficulty, setDifficulty] = useState("Easy");
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  /* ---------------- QUESTION HANDLERS ---------------- */

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: null,
        timeLimit: quizDetails?.enableQuestionTimeLimit
          ? quizDetails.questionTimeLimit
          : null,
      },
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

  /* ---------------- AI GENERATE ---------------- */

  const handleGenerateAI = async () => {
    setIsGenerating(true);

    try {
      const res = await api.post("/ai/generate-quiz", {
        topic: quizDetails.subject,
        difficulty,
        totalQuestions,
      });

      if (!res.data?.questions?.length) {
        alert("AI returned no questions");
        return;
      }

      // Attach per-question timer if enabled
      const aiQuestions = res.data.questions.map((q) => ({
        ...q,
        timeLimit: quizDetails.enableQuestionTimeLimit
          ? quizDetails.questionTimeLimit
          : null,
      }));

      setQuestions(aiQuestions);
      setErrors({});
    } catch (err) {
      console.error("AI generation failed:", err);
      alert("AI service unavailable. Try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  /* ---------------- VALIDATION ---------------- */

  const validateQuestions = () => {
    const newErrors = {};

    questions.forEach((q, index) => {
      if (!q.question.trim()) {
        newErrors[index] = { question: "Question is required" };
      }

      if (q.options.filter((o) => o.trim()).length < 2) {
        newErrors[index] = {
          ...newErrors[index],
          options: "At least 2 options required",
        };
      }

      if (q.correctAnswer === null) {
        newErrors[index] = {
          ...newErrors[index],
          correctAnswer: "Select correct answer",
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

          {/* ---------------- BACK BUTTON ---------------- */}
          <button
            className="btn btn-outline mb-8 flex items-center gap-2"
            onClick={() =>
              navigate("/create-quiz", { state: quizDetails })
            }
          >
            <ArrowLeft size={18} />
            Back to Quiz Details
          </button>

          {/* ---------------- AI GENERATOR ---------------- */}
          <div className="ai-generator-card mb-12 border border-gray-200 rounded-xl p-8 shadow-sm">

            {/* HEADER */}
            <div className="ai-generator-header mb-8 text-center">
              <Sparkles size={24} className="mx-auto mb-3" />
              <h3 className="text-xl font-semibold">
                Generate Questions with AI
              </h3>
            </div>

            {/* CONTROLS */}
            <div className="ai-generator-controls space-y-6">

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
                  onChange={(e) =>
                    setTotalQuestions(Number(e.target.value))
                  }
                />
              </div>

              {/* GENERATE BUTTON */}
              <div className="flex justify-center pt-4 pb-2">
                <button
                  className="btn btn-primary flex items-center gap-2 px-8 py-3"
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                >
                  <Sparkles size={18} />
                  {isGenerating ? "Generating..." : "Generate"}
                </button>
              </div>
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
                onChange={(e) =>
                  updateQuestion(i, "question", e.target.value)
                }
                placeholder="Enter question"
              />

              {q.options.map((opt, idx) => (
                <div key={idx} className="flex gap-3 mb-4 items-center">
                  <input
                    type="radio"
                    checked={q.correctAnswer === idx}
                    onChange={() =>
                      updateQuestion(i, "correctAnswer", idx)
                    }
                  />

                  <input
                    className="input-field flex-1"
                    value={opt}
                    onChange={(e) =>
                      updateOption(i, idx, e.target.value)
                    }
                    placeholder={`Option ${idx + 1}`}
                  />
                </div>
              ))}

              {errors[i] && (
                <div className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  Fix errors before submitting
                </div>
              )}
            </div>
          ))}

          {/* ---------------- ACTIONS ---------------- */}
          <div className="flex justify-between gap-4 mt-8">
            <button className="btn btn-outline" onClick={addQuestion}>
              <Plus size={18} /> Add Question
            </button>

            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : (
                <>
                  <Save size={18} /> Create Quiz
                </>
              )}
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateQuizQuestions;
