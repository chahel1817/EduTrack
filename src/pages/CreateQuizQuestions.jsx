import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Plus, Save, CheckCircle, Trash2, AlertCircle } from "lucide-react";

const CreateQuizQuestions = () => {
  const { state: quizDetails } = useLocation();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: null },
  ]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: null },
    ]);
    setErrors({});
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
      setErrors({});
    }
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);

    // Clear error for this question when user starts editing
    if (errors[index]) {
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const validateQuestions = () => {
    const newErrors = {};

    questions.forEach((q, index) => {
      if (!q.question.trim()) {
        newErrors[index] = { ...newErrors[index], question: "Question text is required" };
      }

      const filledOptions = q.options.filter(opt => opt.trim());
      if (filledOptions.length < 2) {
        newErrors[index] = { ...newErrors[index], options: "At least 2 options are required" };
      }

      if (q.correctAnswer === null || q.correctAnswer === undefined) {
        newErrors[index] = { ...newErrors[index], correctAnswer: "Please select the correct answer" };
      } else if (!q.options[q.correctAnswer]?.trim()) {
        newErrors[index] = { ...newErrors[index], correctAnswer: "Correct answer must be a filled option" };
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateQuestions()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/quizzes", {
        ...quizDetails,
        questions,
      });

      navigate("/quiz-success");
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        <div className="dashboard-section max-w-4xl mx-auto">

          <div className="flex items-center justify-between mb-6">
            <h2 className="section-heading mb-0">
              Add Questions
            </h2>
            <div className="text-sm text-gray-600">
              {questions.length} question{questions.length !== 1 ? 's' : ''}
            </div>
          </div>

          {questions.map((q, i) => (
            <div key={i} className="card mb-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Question {i + 1}
                </h3>
                {questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion(i)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Remove question"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <textarea
                    className={`input-field ${errors[i]?.question ? 'border-red-500' : ''}`}
                    placeholder="Enter your question here..."
                    rows="3"
                    value={q.question}
                    onChange={(e) => updateQuestion(i, 'question', e.target.value)}
                  />
                  {errors[i]?.question && (
                    <div className="flex items-center gap-2 mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                      <AlertCircle size={16} className="text-red-500" />
                      <span className="font-medium">{errors[i].question}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Answer Options (select the correct answer)
                  </label>
                  <div className="space-y-3">
                    {q.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={`correct-${i}`}
                          checked={q.correctAnswer === idx}
                          onChange={() => updateQuestion(i, 'correctAnswer', idx)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <input
                          className={`input-field flex-1 ${errors[i]?.options ? 'border-red-500' : ''}`}
                          placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                          value={opt}
                          onChange={(e) => updateOption(i, idx, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                  {errors[i]?.options && (
                    <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                      <AlertCircle size={16} className="text-red-500" />
                      <span className="font-medium">{errors[i].options}</span>
                    </div>
                  )}
                  {errors[i]?.correctAnswer && (
                    <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                      <AlertCircle size={16} className="text-red-500" />
                      <span className="font-medium">{errors[i].correctAnswer}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              className="btn btn-outline flex items-center gap-2"
              onClick={addQuestion}
            >
              <Plus size={18} /> Add Question
            </button>

            <button
              className="btn btn-primary flex items-center gap-2"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating Quiz...
                </>
              ) : (
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
