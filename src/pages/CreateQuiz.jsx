import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FileText, Clock, ArrowRight, Sparkles } from "lucide-react";

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
    allowMultipleAttempts: false,
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

    if (quiz.startDate && quiz.endDate && new Date(quiz.startDate) >= new Date(quiz.endDate)) {
      alert("End date must be after start date");
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
        {/* HEADER */}
        <section className="dashboard-section hero-pro" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '40px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div className="header-icon" style={{ background: 'rgba(255,255,255,0.2)', width: '64px', height: '64px' }}>
              <FileText size={36} color="white" />
            </div>
            <div>
              <h1 className="hero-pro-title" style={{ margin: 0, fontSize: '32px' }}>Create New Quiz</h1>
              <p className="hero-pro-sub" style={{ margin: 0, opacity: 0.9 }}>
                Define your quiz details and set the rules for your students
              </p>
            </div>
          </div>
          <Sparkles size={100} style={{ opacity: 0.15, color: 'white' }} />
        </section>

        <div className="dashboard-section max-w-3xl mx-auto">
          {/* ---------------- FORM CARD ---------------- */}
          <div className="glass-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px', border: '1px solid var(--border)' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '14px', color: 'var(--gray-600)' }}>Quiz Title</label>
                <input
                  className="input-field"
                  placeholder="e.g. Midterm Physics Exam"
                  style={{ width: '100%' }}
                  value={quiz.title}
                  onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '14px', color: 'var(--gray-600)' }}>Subject</label>
                <input
                  className="input-field"
                  placeholder="e.g. Science"
                  style={{ width: '100%' }}
                  value={quiz.subject}
                  onChange={(e) => setQuiz({ ...quiz, subject: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '14px', color: 'var(--gray-600)' }}>Description</label>
              <textarea
                className="input-field"
                rows="4"
                placeholder="What is this quiz about? (Optional)"
                style={{ width: '100%' }}
                value={quiz.description}
                onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '14px', color: 'var(--gray-600)' }}>Start Date & Time</label>
                <input
                  type="datetime-local"
                  className="input-field"
                  style={{ width: '100%' }}
                  value={quiz.startDate || ""}
                  onChange={(e) => setQuiz({ ...quiz, startDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '14px', color: 'var(--gray-600)' }}>End Date & Time</label>
                <input
                  type="datetime-local"
                  className="input-field"
                  style={{ width: '100%' }}
                  value={quiz.endDate || ""}
                  onChange={(e) => setQuiz({ ...quiz, endDate: e.target.value })}
                />
              </div>
            </div>

            {quiz.startDate && quiz.endDate && (
              <div style={{ padding: '16px', background: 'rgba(6, 182, 212, 0.05)', borderRadius: '12px', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Clock size={20} color="var(--accent)" />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>
                  Quiz span: {Math.round((new Date(quiz.endDate) - new Date(quiz.startDate)) / (1000 * 60 * 60))} hours
                </span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'end' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '14px', color: 'var(--gray-600)' }}>Total Time (Minutes)</label>
                <div style={{ position: 'relative' }}>
                  <Clock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                  <input
                    type="number"
                    className="input-field"
                    style={{ width: '100%', paddingLeft: '45px' }}
                    min="1"
                    value={quiz.timeLimit}
                    onChange={(e) => setQuiz({ ...quiz, timeLimit: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="flex items-center gap-3" style={{ cursor: 'pointer', padding: '12px 16px', background: 'var(--gray-50)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <input
                    type="checkbox"
                    checked={quiz.enableQuestionTimeLimit}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                    onChange={(e) =>
                      setQuiz({
                        ...quiz,
                        enableQuestionTimeLimit: e.target.checked,
                        questionTimeLimit: e.target.checked ? 30 : null,
                      })
                    }
                  />
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>Per-question timer</span>
                </label>
              </div>

              <div className="form-group">
                <label className="flex items-center gap-3" style={{ cursor: 'pointer', padding: '12px 16px', background: 'var(--gray-50)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <input
                    type="checkbox"
                    checked={quiz.allowMultipleAttempts}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                    onChange={(e) =>
                      setQuiz({
                        ...quiz,
                        allowMultipleAttempts: e.target.checked,
                      })
                    }
                  />
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>Allow multiple attempts</span>
                </label>
              </div>
            </div>

            {/* PER QUESTION TIME INPUT */}
            {quiz.enableQuestionTimeLimit && (
              <div className="animate-fade-in" style={{ padding: '20px', background: 'rgba(109, 40, 217, 0.05)', borderRadius: '16px', border: '1px solid var(--primary)', borderStyle: 'dashed' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 700, fontSize: '14px' }}>Seconds per question</label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="5"
                    className="input-field"
                    style={{ width: '120px' }}
                    value={quiz.questionTimeLimit}
                    onChange={(e) =>
                      setQuiz({
                        ...quiz,
                        questionTimeLimit: Number(e.target.value),
                      })
                    }
                  />
                  <span style={{ color: 'var(--gray-500)', fontSize: '14px' }}>Students will have a countdown for each question.</span>
                </div>
              </div>
            )}

            {/* NEXT BUTTON */}
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '16px', borderRadius: '16px', fontSize: '16px', fontWeight: 800, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '10px' }}
              onClick={handleNext}
            >
              Next: Add Questions <ArrowRight size={20} />
            </button>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateQuiz;
