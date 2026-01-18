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
  Zap,
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
        {/* HEADER */}
        <section className="dashboard-section hero-pro" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '40px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div className="header-icon" style={{ background: 'rgba(255,255,255,0.2)', width: '64px', height: '64px' }}>
              <Sparkles size={36} color="white" />
            </div>
            <div>
              <h1 className="hero-pro-title" style={{ margin: 0, fontSize: '32px' }}>Question Builder</h1>
              <p className="hero-pro-sub" style={{ margin: 0, opacity: 0.9 }}>
                Add questions manually or use our advanced AI to generate them
              </p>
            </div>
          </div>
          <Zap size={100} style={{ opacity: 0.15, color: 'white' }} />
        </section>

        <div className="dashboard-section max-w-4xl mx-auto">

          {/* ---------------- BACK BUTTON ---------------- */}
          <button
            className="btn btn-outline mb-8 flex items-center gap-2"
            style={{ padding: '10px 20px', borderRadius: '12px', fontWeight: 600 }}
            onClick={() =>
              navigate("/create-quiz", { state: quizDetails })
            }
          >
            <ArrowLeft size={18} />
            Back to Quiz Details
          </button>

          {/* ---------------- AI GENERATOR ---------------- */}
          <div className="glass-card mb-12" style={{ padding: '32px', border: '1px solid var(--primary)', background: 'rgba(109, 40, 217, 0.03)' }}>

            {/* HEADER */}
            <div className="flex items-center gap-4 mb-8">
              <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '12px', color: 'white' }}>
                <Sparkles size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Magic AI Generator</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: '14px', margin: 0 }}>Generate high-quality questions on "{quizDetails?.subject}"</p>
              </div>
            </div>

            {/* CONTROLS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 200px', gap: '24px', alignItems: 'end' }}>
              <div className="control-group">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700 }}>Difficulty Level</label>
                <select
                  className="input-field"
                  style={{ width: '100%' }}
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              <div className="control-group">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700 }}>Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  className="input-field"
                  style={{ width: '100%' }}
                  value={totalQuestions}
                  onChange={(e) =>
                    setTotalQuestions(Number(e.target.value))
                  }
                />
              </div>

              <button
                className="btn btn-primary"
                style={{ height: '48px', width: '100%', borderRadius: '12px', fontWeight: 800 }}
                onClick={handleGenerateAI}
                disabled={isGenerating}
              >
                {isGenerating ? "Magic..." : "Generate ✨"}
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', margin: '40px 0', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--surface-bg)', padding: '0 20px', color: 'var(--gray-400)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Or build manually</span>
          </div>

          {/* ---------------- QUESTIONS ---------------- */}
          {questions.map((q, i) => (
            <div key={i} className="glass-card mb-8" style={{ padding: '32px' }}>
              <div className="flex justify-between items-center mb-6">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', background: 'var(--primary)', color: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{i + 1}</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Question Details</h3>
                </div>

                {questions.length > 1 && (
                  <button onClick={() => removeQuestion(i)} style={{ color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)', padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700 }}>Question Text</label>
                <textarea
                  className="input-field"
                  style={{ width: '100%', minHeight: '100px' }}
                  value={q.question}
                  onChange={(e) =>
                    updateQuestion(i, "question", e.target.value)
                  }
                  placeholder="Enter your question here..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {q.options.map((opt, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                      <input
                        type="radio"
                        checked={q.correctAnswer === idx}
                        style={{ width: '20px', height: '20px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                        onChange={() =>
                          updateQuestion(i, "correctAnswer", idx)
                        }
                      />
                    </div>
                    <input
                      className="input-field"
                      style={{ width: '100%', paddingLeft: '50px' }}
                      value={opt}
                      onChange={(e) =>
                        updateOption(i, idx, e.target.value)
                      }
                      placeholder={`Option ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>

              {errors[i] && (
                <div style={{ marginTop: '20px', color: 'var(--error)', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} />
                  Please complete this question (text, 2+ options, & correct answer)
                </div>
              )}
            </div>
          ))}

          {/* ---------------- ACTIONS ---------------- */}
          <div className="flex justify-between gap-4 mt-12 items-center">
            <button className="btn btn-outline" style={{ padding: '14px 28px', borderRadius: '16px', fontWeight: 700 }} onClick={addQuestion}>
              <Plus size={18} /> Add New Question
            </button>

            <button
              className="btn btn-primary"
              style={{ padding: '14px 40px', borderRadius: '16px', fontWeight: 800, fontSize: '16px', boxShadow: '0 10px 25px rgba(109, 40, 217, 0.3)' }}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : (
                <>
                  <Save size={18} /> Finalize & Create Quiz
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
