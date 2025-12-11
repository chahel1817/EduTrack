import { useState, useEffect } from "react";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Plus, X, FileText, Clock, Save, ArrowLeft } from "lucide-react";

const CreateQuiz = () => {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    questions: [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }],
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains("dark"));
    };
    checkDarkMode();
    // Watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  /* ---------------------------- VALIDATION ---------------------------- */
  const validateForm = () => {
    // Title validation
    if (!formData.title || !formData.title.trim()) {
      setError("Quiz title is required");
      return false;
    }
    if (formData.title.trim().length < 3) {
      setError("Quiz title must be at least 3 characters");
      return false;
    }

    // Subject validation
    if (!formData.subject || !formData.subject.trim()) {
      setError("Subject is required");
      return false;
    }

    // Questions validation
    if (!formData.questions || formData.questions.length === 0) {
      setError("At least one question is required");
      return false;
    }

    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      
      // Question text validation
      if (!q.question || !q.question.trim()) {
        setError(`Question ${i + 1}: Question text is required`);
        return false;
      }
      if (q.question.trim().length < 5) {
        setError(`Question ${i + 1}: Question must be at least 5 characters`);
        return false;
      }

      // Options validation
      const validOptions = q.options.filter((opt) => opt && opt.trim() !== "");
      if (validOptions.length < 2) {
        setError(`Question ${i + 1}: At least 2 options are required`);
        return false;
      }

      // Correct answer validation
      if (q.correctAnswer === undefined || q.correctAnswer === null) {
        setError(`Question ${i + 1}: Please select a correct answer`);
        return false;
      }
      if (q.correctAnswer < 0 || q.correctAnswer >= validOptions.length) {
        setError(`Question ${i + 1}: Invalid correct answer selection`);
        return false;
      }
    }

    return true;
  };

  /* ---------------------------- SUBMIT ---------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Process and validate questions before submission
      const processedQuestions = formData.questions
        .map((q) => {
          // Filter out empty options
          const validOptions = q.options.filter((opt) => opt.trim() !== "");
          
          // Ensure question text is not empty
          if (!q.question || !q.question.trim()) {
            return null; // Filter out invalid questions
          }

          // Ensure correctAnswer is within valid range
          const adjustedCorrectAnswer = Math.min(
            q.correctAnswer,
            validOptions.length - 1
          );

          return {
            question: q.question.trim(),
            options: validOptions,
            correctAnswer: Math.max(0, adjustedCorrectAnswer),
            points: q.points || 1,
          };
        })
        .filter((q) => q !== null && q.options.length >= 2); // Remove nulls and ensure at least 2 options

      // Final validation
      if (processedQuestions.length === 0) {
        setError("At least one valid question with 2+ options is required");
        setLoading(false);
        return;
      }

      await api.post("/quiz", {
        title: formData.title.trim(),
        subject: formData.subject.trim(),
        description: formData.description.trim() || "",
        questions: processedQuestions,
      });

      navigate("/dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Failed to create quiz";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------- INPUT HANDLERS ---------------------------- */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleQuestionChange = (index, field, value) => {
    const questions = [...formData.questions];

    if (field === "options") {
      questions[index].options[value.index] = value.value;
    } else {
      questions[index][field] = value;
    }

    setFormData({ ...formData, questions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { question: "", options: ["", "", "", ""], correctAnswer: 0 },
      ],
    });
  };

  const removeQuestion = (index) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index),
    });
  };

  /* ---------------------------- UI ---------------------------- */
  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        <div className="dashboard-section">
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h2 className="section-heading" style={{ margin: 0 }}>
                <FileText size={28} style={{ marginRight: "12px", verticalAlign: "middle" }} />
                Create New Quiz
              </h2>
              <p style={{ 
                color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "var(--gray-600)", 
                marginTop: "8px" 
              }}>
                Build engaging quizzes for your students
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate("/dashboard")}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>
          </div>

          {error && <div className="auth-error mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* TOP GRID */}
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              <div>
                <label className="block text-sm font-medium mb-2">Quiz Title *</label>
                <input
                  className="input-field"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter quiz title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <input
                  className="input-field"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Physics, English, Coding"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description (Optional)
              </label>
              <textarea
                className="input-field"
                rows="3"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What is this quiz about?"
              />
            </div>

            {/* QUESTIONS */}
            <div 
              className="flex justify-between items-center mb-4" 
              style={{ 
                marginTop: "32px", 
                paddingTop: "24px", 
                borderTop: isDarkMode ? "2px solid rgba(255, 255, 255, 0.1)" : "2px solid var(--border-gray)" 
              }}
            >
              <h3 className="section-heading" style={{ fontSize: "20px", margin: 0 }}>
                Questions ({formData.questions.length})
              </h3>

              <button 
                type="button" 
                className="btn btn-success" 
                onClick={addQuestion}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Plus size={18} />
                Add Question
              </button>
            </div>

            {formData.questions.map((q, index) => (
              <div key={index} className="card" style={{
                border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid var(--border-gray)",
                padding: "1.5rem",
                marginBottom: "2rem",
                transition: "0.3s",
                background: isDarkMode ? "#000000" : "var(--card-bg)",
              }}>
                {/* Question Header */}
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold" style={{ fontSize: "1.1rem" }}>
                    Question {index + 1}
                  </h4>

                  {formData.questions.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => removeQuestion(index)}
                      style={{ 
                        background: "rgba(239, 68, 68, 0.1)",
                        borderColor: "var(--error)",
                        color: "var(--error-dark)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <X size={16} />
                      Remove
                    </button>
                  )}
                </div>

                {/* Question Input */}
                <textarea
                  className="input-field"
                  rows="3"
                  placeholder="Enter question text..."
                  value={q.question}
                  onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                />

                {/* Options */}
                <label className="block font-medium mt-4 mb-2">Options</label>

                <div className="grid" style={{ gridTemplateColumns: "1fr", gap: "1rem" }}>
                  {q.options.map((opt, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 option-box"
                      style={{
                        padding: "12px",
                        borderRadius: "10px",
                        border:
                          q.correctAnswer === i
                            ? "2px solid var(--accent)"
                            : isDarkMode
                            ? "1px solid rgba(255, 255, 255, 0.2)"
                            : "1px solid var(--gray-300)",
                        background:
                          q.correctAnswer === i
                            ? isDarkMode
                              ? "rgba(16,185,129,0.15)"
                              : "rgba(16,185,129,0.08)"
                            : isDarkMode
                            ? "rgba(0, 0, 0, 0.6)"
                            : "var(--gray-50)",
                      }}
                    >
                      <input
                        type="radio"
                        name={`correct-${index}`}
                        checked={q.correctAnswer === i}
                        onChange={() => handleQuestionChange(index, "correctAnswer", i)}
                        style={{ accentColor: "var(--accent)", transform: "scale(1.3)" }}
                      />

                      <input
                        type="text"
                        className="input-field flex-1"
                        style={{ 
                          margin: 0,
                          background: "transparent",
                          border: "none",
                          padding: "4px 8px",
                        }}
                        placeholder={`Option ${i + 1}`}
                        value={opt}
                        onChange={(e) =>
                          handleQuestionChange(index, "options", {
                            index: i,
                            value: e.target.value,
                          })
                        }
                      />

                      {q.correctAnswer === i && (
                        <span style={{ color: "var(--accent-dark)", fontWeight: "700" }}>
                          ✓ Correct
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* FOOTER */}
            <div className="flex justify-between items-center pt-4" style={{ borderTop: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid var(--gray-300)" }}>
              <span style={{ 
                color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "var(--gray-600)", 
                fontSize: "14px" 
              }}>
                {formData.questions.length} questions
              </span>

              <div className="flex gap-3">
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => navigate("/dashboard")}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button 
                  className="btn btn-primary" 
                  type="submit" 
                  disabled={loading}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {loading ? (
                    <>
                      <div style={{ width: "16px", height: "16px", border: "2px solid white", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Create Quiz
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateQuiz;
