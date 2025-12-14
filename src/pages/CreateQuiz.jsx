import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FileText, Clock, ArrowRight } from "lucide-react";

const CreateQuiz = () => {
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState({
    title: "",
    subject: "",
    description: "",
    timeLimit: 30,
    enableQuestionTimeLimit: false,
  });

  const handleNext = () => {
    if (!quiz.title || !quiz.subject) return alert("Title & Subject required");

    navigate("/create/quiz/questions", {
      state: quiz,
    });
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        <div className="dashboard-section max-w-3xl mx-auto">

          <h2 className="section-heading mb-6 flex items-center gap-2">
            <FileText /> Quiz Details
          </h2>

          <div className="card space-y-6">

            <input
              className="input-field"
              placeholder="Quiz Title"
              value={quiz.title}
              onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            />

            <input
              className="input-field"
              placeholder="Subject"
              value={quiz.subject}
              onChange={(e) => setQuiz({ ...quiz, subject: e.target.value })}
            />

            <textarea
              className="input-field"
              rows="3"
              placeholder="Description (optional)"
              value={quiz.description}
              onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
            />

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

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={quiz.enableQuestionTimeLimit}
                onChange={(e) =>
                  setQuiz({ ...quiz, enableQuestionTimeLimit: e.target.checked })
                }
              />
              Enable per-question timer
            </label>

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
