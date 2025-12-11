// src/pages/Dashboard.jsx
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  LayoutDashboard,
  BookOpen,
  Users,
  TrendingUp,
  Target,
  SquareKanban,
  Award,
  Flame,
  Rocket,
  Plus,
  Clock,
  CheckCircle2,
  BarChart3,
  FileText,
  Zap,
} from "lucide-react";

/* ------------------------------------------------------
   REUSABLE STAT CARD (Premium Theme Safe)
------------------------------------------------------ */
const StatCard = ({ icon: Icon, value, label, gradient, onClick }) => (
  <div 
    className="stat-card hover-lift" 
    onClick={onClick}
    style={{
      cursor: onClick ? 'pointer' : 'default',
      background: gradient ? `linear-gradient(135deg, ${gradient})` : 'var(--card-bg)',
    }}
  >
    <div className="stat-icon-wrapper">
      <Icon size={28} />
    </div>
    <h3 className="stat-value">{value}</h3>
    <p className="stat-label">{label}</p>
  </div>
);

/* ------------------------------------------------------
   EMPTY STATE (Dark-Mode Friendly)
------------------------------------------------------ */
const EmptyBox = ({ icon: Icon, title, subtitle }) => (
  <div className="empty-state enhanced">
    <Icon size={50} color="var(--primary)" />
    <h3>{title}</h3>
    <p>{subtitle}</p>
  </div>
);

/* ------------------------------------------------------
   QUIZ CARD COMPONENT
------------------------------------------------------ */
const QuizCard = ({ quiz, onTakeQuiz, isTeacher, navigate }) => (
  <div className="quiz-card-dashboard hover-lift">
    <div className="quiz-card-header">
      <div className="quiz-card-subject">{quiz.subject}</div>
      <div className="quiz-card-date">
        {new Date(quiz.createdAt).toLocaleDateString()}
      </div>
    </div>
    <div className="quiz-card-content">
      <h3 className="quiz-card-title">{quiz.title}</h3>
      <p className="quiz-card-description">
        {quiz.description || "Test your knowledge with this interactive quiz."}
      </p>
      <div className="quiz-card-stats">
        <div className="quiz-stat-item">
          <FileText size={14} />
          <span>{quiz.questions?.length || 0} questions</span>
        </div>
        {quiz.timeLimit && (
          <div className="quiz-stat-item">
            <Clock size={14} />
            <span>{quiz.timeLimit} min</span>
          </div>
        )}
      </div>
    </div>
    <div className="quiz-card-actions">
      {isTeacher ? (
        <button
          className="btn btn-outline"
          onClick={() => navigate(`/results/${quiz._id}`)}
        >
          <BarChart3 size={16} />
          View Results
        </button>
      ) : (
        <button
          className="btn btn-primary"
          onClick={() => onTakeQuiz(quiz._id)}
        >
          <Rocket size={16} />
          Take Quiz
        </button>
      )}
    </div>
  </div>
);

/* ------------------------------------------------------
   MAIN DASHBOARD
------------------------------------------------------ */
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  /* -------------------------------------------------- */
  /* API FETCHES */
  /* -------------------------------------------------- */
  const fetchQuizzes = useCallback(async (signal) => {
    try {
      const res = await api.get("/quiz", { signal });
      setQuizzes(res.data || []);
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
    }
  }, []);

  const fetchStudentResults = useCallback(async (signal) => {
    try {
      const res = await api.get("/results/student", { signal });
      setResults(res.data || []);
    } catch (err) {
      console.error("Failed to fetch student results:", err);
    }
  }, []);

  const fetchTeacherResults = useCallback(async (signal) => {
    try {
      const res = await api.get("/results/all", { signal });
      setResults(res.data || []);
    } catch (err) {
      console.error("Failed to fetch teacher results:", err);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const controller = new AbortController();
    setLoading(true);

    (async () => {
      await Promise.all([
        fetchQuizzes(controller.signal),
        user.role === "teacher"
          ? fetchTeacherResults(controller.signal)
          : fetchStudentResults(controller.signal),
      ]);

      setLoading(false);
    })();

    return () => controller.abort();
  }, [user, fetchQuizzes, fetchStudentResults, fetchTeacherResults]);

  /* -------------------------------------------------- */
  /* LOADING */
  /* -------------------------------------------------- */
  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <div className="dashboard-section">
            <div className="loading" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
              <div>Loading dashboard...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* -------------------------------------------------- */
  /* DASHBOARD STATS */
  /* -------------------------------------------------- */
  const totalQuizzes = quizzes.length;
  const totalSubmissions = results.length;
  
  // Calculate average score
  const averageScore =
    results.length > 0
      ? Math.round(
          results.reduce(
            (sum, r) => sum + (r.score / Math.max(1, r.total)) * 100,
            0
          ) / results.length
        )
      : 0;

  // For teachers: calculate total students who took quizzes
  const uniqueStudents = user.role === "teacher" 
    ? new Set(results.map(r => r.student?._id || r.student)).size 
    : 0;

  // For students: calculate completed quizzes
  const completedQuizzes = user.role === "student"
    ? results.length
    : 0;

  // For students: calculate best score
  const bestScore = user.role === "student" && results.length > 0
    ? Math.max(...results.map(r => Math.round((r.score / Math.max(1, r.total)) * 100)))
    : 0;

  /* -------------------------------------------------- */
  /* RENDER */
  /* -------------------------------------------------- */
  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        
        {/* --------------------------------------------------
            PREMIUM HERO SECTION 
        -------------------------------------------------- */}
        <section className="dashboard-section hero-pro">
          <div className="hero-pro-left">
            <div className="hero-pro-title-row">
              <div className="hero-pro-icon">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
                  alt="User icon"
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "18px",
                    padding: "10px",
                    background: "linear-gradient(135deg, var(--blue), var(--purple))",
                  }}
                />
              </div>
              <h2 className="hero-pro-title">
                Welcome back, {user.name}!
              </h2>
            </div>

            <p className="hero-pro-sub">
              <Rocket size={16} className="inline-icon" /> 
              {user.role === "teacher" 
                ? "Manage your quizzes and track student progress"
                : "Ready to continue your learning journey?"}
            </p>

            {/* BADGES */}
            <div className="hero-pro-badges">
              <div className="achievement-card" title="Active participation">
                <Flame size={20} className="achievement-icon" />
                <div className="achievement-content">
                  <span className="achievement-title">
                    {user.role === "teacher" ? "Active Teacher" : "Active Learner"}
                  </span>
                  <span className="achievement-desc">
                    {user.role === "teacher" 
                      ? "Managing quizzes effectively" 
                      : "Consistent quiz participation"}
                  </span>
                </div>
              </div>
              <div className="achievement-card" title="Achievements growing">
                <Award size={20} className="achievement-icon" />
                <div className="achievement-content">
                  <span className="achievement-title">Achievements Growing</span>
                  <span className="achievement-desc">
                    {user.role === "teacher" 
                      ? "Tracking student progress" 
                      : "Skills development ongoing"}
                  </span>
                </div>
              </div>
              <div className="achievement-card" title="Knowledge expanding">
                <BookOpen size={20} className="achievement-icon" />
                <div className="achievement-content">
                  <span className="achievement-title">Knowledge Expanding</span>
                  <span className="achievement-desc">
                    {user.role === "teacher" 
                      ? "Creating educational content" 
                      : "Continuous learning journey"}
                  </span>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="hero-pro-buttons">
              {user.role === "teacher" ? (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/create-quiz")}
                  >
                    <Plus size={18} />
                    Create Quiz
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => navigate("/quizzes")}
                  >
                    <BookOpen size={18} />
                    View All Quizzes
                  </button>
                </>
              ) : (
                <>
                  {quizzes.length > 0 && (
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/quiz/${quizzes[0]._id}`)}
                    >
                      <Rocket size={18} />
                      Start Quiz
                    </button>
                  )}
                  <button
                    className="btn btn-outline"
                    onClick={() => navigate(`/my-results/${user._id}`)}
                  >
                    <BarChart3 size={18} />
                    My Results
                  </button>
                </>
              )}
            </div>
          </div>

          {/* RIGHT ILLUSTRATION */}
          <div className="hero-pro-img-wrap">
            <img
              className="hero-pro-img"
              src="https://cdni.iconscout.com/illustration/premium/thumb/online-student-5790172-4844555.png"
              alt="Learning illustration"
              onError={(e) => {
                e.target.src =
                  "https://cdni.iconscout.com/illustration/premium/thumb/learning-path-illustration-4567341.png";
              }}
            />
          </div>
        </section>

        {/* --------------------------------------------------
            STAT GRID 
        -------------------------------------------------- */}
        <section className="dashboard-section">
          <h2 className="section-heading">
            <LayoutDashboard size={28} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
            Overview
          </h2>

          <div className="stats-grid">
            {user.role === "teacher" ? (
              <>
                <StatCard 
                  icon={BookOpen} 
                  value={totalQuizzes} 
                  label="Total Quizzes"
                  gradient="rgba(99,102,241,0.1), rgba(99,102,241,0.05)"
                  onClick={() => navigate("/quizzes")}
                />
                <StatCard 
                  icon={Users} 
                  value={uniqueStudents} 
                  label="Active Students"
                  gradient="rgba(16,185,129,0.1), rgba(16,185,129,0.05)"
                />
                <StatCard 
                  icon={CheckCircle2} 
                  value={totalSubmissions} 
                  label="Total Submissions"
                  gradient="rgba(245,158,11,0.1), rgba(245,158,11,0.05)"
                />
                <StatCard 
                  icon={TrendingUp} 
                  value={`${averageScore}%`} 
                  label="Average Score"
                  gradient="rgba(139,92,246,0.1), rgba(139,92,246,0.05)"
                />
              </>
            ) : (
              <>
                <StatCard 
                  icon={BookOpen} 
                  value={totalQuizzes} 
                  label="Available Quizzes"
                  gradient="rgba(99,102,241,0.1), rgba(99,102,241,0.05)"
                  onClick={() => navigate("/quizzes")}
                />
                <StatCard 
                  icon={CheckCircle2} 
                  value={completedQuizzes} 
                  label="Completed Quizzes"
                  gradient="rgba(16,185,129,0.1), rgba(16,185,129,0.05)"
                />
                <StatCard 
                  icon={Target} 
                  value={`${bestScore}%`} 
                  label="Best Score"
                  gradient="rgba(245,158,11,0.1), rgba(245,158,11,0.05)"
                />
                <StatCard 
                  icon={TrendingUp} 
                  value={`${averageScore}%`} 
                  label="Average Score"
                  gradient="rgba(139,92,246,0.1), rgba(139,92,246,0.05)"
                />
              </>
            )}
          </div>
        </section>

        {/* --------------------------------------------------
            QUIZ LIST 
        -------------------------------------------------- */}
        <section className="dashboard-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="section-heading" style={{ margin: 0 }}>
              <BookOpen size={28} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
              {user.role === "teacher" ? "My Quizzes" : "Available Quizzes"}
            </h2>
            {user.role === "teacher" && (
              <button
                className="btn btn-primary"
                onClick={() => navigate("/create-quiz")}
              >
                <Plus size={18} />
                Create New Quiz
              </button>
            )}
          </div>

          {quizzes.length === 0 ? (
            <EmptyBox
              icon={BookOpen}
              title={user.role === "teacher" ? "No quizzes created yet" : "No quizzes available"}
              subtitle={user.role === "teacher" 
                ? "Create your first quiz to get started!"
                : "Your teacher hasn't published anything yet."}
            />
          ) : (
            <div className="quizzes-grid-dashboard">
              {quizzes.slice(0, 6).map((q) => (
                <QuizCard
                  key={q._id}
                  quiz={q}
                  onTakeQuiz={(id) => navigate(`/quiz/${id}`)}
                  isTeacher={user.role === "teacher"}
                  navigate={navigate}
                />
              ))}
            </div>
          )}

          {quizzes.length > 6 && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                className="btn btn-outline"
                onClick={() => navigate("/quizzes")}
              >
                View All Quizzes ({quizzes.length})
              </button>
            </div>
          )}
        </section>

        {/* --------------------------------------------------
            RESULTS TABLE
        -------------------------------------------------- */}
        <section className="dashboard-section">
          <h2 className="section-heading">
            <BarChart3 size={28} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
            {user.role === "teacher" ? "Recent Submissions" : "My Recent Results"}
          </h2>

          {results.length === 0 ? (
            <EmptyBox
              icon={Award}
              title={user.role === "teacher" ? "No submissions yet" : "No results yet"}
              subtitle={user.role === "teacher"
                ? "Students haven't submitted any quizzes yet."
                : "Complete quizzes to see your progress here."}
            />
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    {user.role === "teacher" && <th>Student</th>}
                    <th>Quiz</th>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Date</th>
                    {user.role === "teacher" && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {results.slice(0, 10).map((r) => {
                    const percentage = Math.round((r.score / Math.max(1, r.total)) * 100);
                    return (
                      <tr key={r._id}>
                        {user.role === "teacher" && (
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--blue), var(--purple))',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 600,
                                fontSize: '14px'
                              }}>
                                {r.student?.name?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600 }}>{r.student?.name || "Unknown"}</div>
                                <div style={{ fontSize: '12px', color: 'var(--gray-600)' }}>
                                  {r.student?.email || ""}
                                </div>
                              </div>
                            </div>
                          </td>
                        )}
                        <td style={{ fontWeight: 600 }}>{r.quiz?.title || "Unknown Quiz"}</td>
                        <td>{r.quiz?.subject || "N/A"}</td>
                        <td>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            background: percentage >= 80 
                              ? 'rgba(16,185,129,0.1)' 
                              : percentage >= 60 
                              ? 'rgba(245,158,11,0.1)' 
                              : 'rgba(239,68,68,0.1)',
                            color: percentage >= 80 
                              ? 'var(--accent-dark)' 
                              : percentage >= 60 
                              ? 'var(--warning-dark)' 
                              : 'var(--error-dark)',
                            fontWeight: 600
                          }}>
                            {r.score}/{r.total}
                          </span>
                        </td>
                        <td>
                          <span style={{
                            fontWeight: 700,
                            color: percentage >= 80 
                              ? 'var(--accent-dark)' 
                              : percentage >= 60 
                              ? 'var(--warning-dark)' 
                              : 'var(--error-dark)'
                          }}>
                            {percentage}%
                          </span>
                        </td>
                        <td>{new Date(r.submittedAt || r.createdAt).toLocaleDateString()}</td>
                        {user.role === "teacher" && (
                          <td>
                            <button
                              className="btn btn-outline"
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                              onClick={() => navigate(`/results/${r.quiz?._id}`)}
                            >
                              View
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {results.length > 10 && (
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button
                className="btn btn-outline"
                onClick={() => navigate(user.role === "teacher" ? "/results" : `/my-results/${user._id}`)}
              >
                View All Results ({results.length})
              </button>
            </div>
          )}
        </section>

      </main>
      <Footer />
    </div>
  );
}
