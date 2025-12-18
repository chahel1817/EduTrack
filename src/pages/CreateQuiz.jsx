import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FileText, Clock, ArrowRight } from "lucide-react";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* ---------------- STATE ---------------- */
  const [quiz, setQuiz] = useState({
    title: "",
    subject: "",
    description: "",
    timeLimit: 30, // whole quiz (minutes)
    enableQuestionTimeLimit: false,
    questionTimeLimit: null, // per-question (seconds)
  });

  /* ---------------- RESTORE STATE WHEN COMING BACK ---------------- */
  useEffect(() => {
    if (location.state) {
      setQuiz(location.state);
    }
  }, []);

  /* ---------------- NEXT HANDLER ---------------- */
  const handleNext = () => {
    if (!quiz.title.trim() || !quiz.subject.trim()) {
      alert("Title & Subject are required");
      return;
    }

    if (quiz.enableQuestionTimeLimit && (!quiz.questionTimeLimit || quiz.questionTimeLimit < 5)) {
      alert("Per-question time must be at least 5 seconds");
      return;
    }

    navigate("/create/quiz/questions", {
      state: quiz,
    });
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      <main className="dashboard-main">
        <div className="dashboard-section max-w-3xl mx-auto">

          {/* ---------------- HEADER ---------------- */}
          <h2 className="section-heading mb-6 flex items-center gap-2">
            <FileText /> Quiz Details
          </h2>

          {/* ---------------- FORM CARD ---------------- */}
          <div className="card space-y-6">

            {/* TITLE */}
            <input
              className="input-field"
              placeholder="Quiz Title"
              value={quiz.title}
              onChange={(e) =>
                setQuiz({ ...quiz, title: e.target.value })
              }
            />

            {/* SUBJECT */}
            <input
              className="input-field"
              placeholder="Subject"
              value={quiz.subject}
              onChange={(e) =>
                setQuiz({ ...quiz, subject: e.target.value })
              }
            />

            {/* DESCRIPTION */}
            <textarea
              className="input-field"
              rows="3"
              placeholder="Description (optional)"
              value={quiz.description}
              onChange={(e) =>
                setQuiz({ ...quiz, description: e.target.value })
              }
            />

            {/* QUIZ TIME LIMIT */}
            <div className="flex items-center gap-4">
              <Clock />
              <input
                type="number"
                className="input-field w-32"
                min="1"
                value={quiz.timeLimit}
                onChange={(e) =>
                  setQuiz({ ...quiz, timeLimit: Number(e.target.value) })
                }
              />
              <span>Minutes</span>
            </div>

            {/* PER QUESTION TIMER TOGGLE */}
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={quiz.enableQuestionTimeLimit}
                onChange={(e) =>
                  setQuiz({
                    ...quiz,
                    enableQuestionTimeLimit: e.target.checked,
                    questionTimeLimit: e.target.checked ? 30 : null,
                  })
                }
              />
              Enable per-question timer
            </label>

            {/* PER QUESTION TIME INPUT */}
            {quiz.enableQuestionTimeLimit && (
              <div className="flex items-center gap-4">
                <Clock size={18} />
                <input
                  type="number"
                  min="5"
                  className="input-field w-32"
                  value={quiz.questionTimeLimit}
                  onChange={(e) =>
                    setQuiz({
                      ...quiz,
                      questionTimeLimit: Number(e.target.value),
                    })
                  }
                />
                <span>Seconds per question</span>
              </div>
            )}

            {/* NEXT BUTTON */}
            <button
              className="btn btn-primary w-full flex justify-center gap-2"
              onClick={handleNext}
            >
              Next: Add Questions <ArrowRight />
            </button>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateQuiz;
