
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  BookOpen,
  Users,
  TrendingUp,
  Award,
  Plus,
  Clock,
  CheckCircle2,
  BarChart3,
  FileText,
  Sparkles,
  ArrowRight,
  Trophy,
  Activity,
  Zap
} from "lucide-react";

/* ------------------------------------------------------
   REUSABLE STAT CARD 
------------------------------------------------------ */
const StatCard = ({ icon: Icon, value, label, onClick, color }) => (
  <div
    className="stat-card"
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    <div className="stat-icon-wrapper" style={{ background: color ? `${color}15` : 'rgba(109, 40, 217, 0.1)', color: color || 'var(--primary)' }}>
      <Icon size={24} />
    </div>
    <h3 className="stat-value">{value}</h3>
    <p className="stat-label">{label}</p>
    <div className="stat-card-glow" style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '80px', height: '80px', background: color || 'var(--primary)', opacity: 0.05, borderRadius: '50%', filter: 'blur(30px)' }} />
  </div>
);

/* ------------------------------------------------------
   QUIZ CARD COMPONENT
------------------------------------------------------ */
const QuizCard = ({ quiz, onTakeQuiz, isTeacher, navigate, hasTaken, now: passedNow }) => {
  const currentNow = passedNow || new Date().getTime();
  const quizStart = quiz.startDate ? new Date(quiz.startDate).getTime() : 0;
  const quizEnd = quiz.endDate ? new Date(quiz.endDate).getTime() : 0;

  const isExpired = quizEnd > 0 && currentNow >= quizEnd;
  const isUpcoming = quizStart > 0 && currentNow < quizStart;
  const isActive = !isExpired && !isUpcoming;

  return (
    <div
      className={`glass-card ${(hasTaken || isExpired || isUpcoming) ? '' : 'hover-lift'}`}
      style={{
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        border: '1px solid var(--border)',
        opacity: (hasTaken || isExpired || isUpcoming) ? 0.8 : 1,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {hasTaken ? (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '-35px',
          background: 'var(--success)',
          color: 'white',
          padding: '5px 40px',
          fontSize: '10px',
          fontWeight: 900,
          transform: 'rotate(45deg)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: 1
        }}>
          COMPLETED
        </div>
      ) : isExpired ? (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '-35px',
          background: 'var(--gray-500)',
          color: 'white',
          padding: '5px 40px',
          fontSize: '10px',
          fontWeight: 900,
          transform: 'rotate(45deg)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: 1
        }}>
          EXPIRED
        </div>
      ) : isUpcoming ? (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '-35px',
          background: 'var(--accent)',
          color: 'white',
          padding: '5px 40px',
          fontSize: '10px',
          fontWeight: 900,
          transform: 'rotate(45deg)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: 1
        }}>
          UPCOMING
        </div>
      ) : null}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ padding: '6px 14px', background: 'rgba(109, 40, 217, 0.08)', borderRadius: '12px', fontSize: '13px', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={14} /> {quiz.subject}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gray-400)', fontSize: '13px' }}>
          <Clock size={14} /> {quiz.timeLimit ? `${quiz.timeLimit}m` : "No limit"}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '10px', color: 'var(--gray-900)' }}>{quiz.title}</h3>
        <p style={{ color: 'var(--gray-500)', fontSize: '15px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {quiz.description || "Challenge yourself with this quiz and master the concepts of " + quiz.subject + "."}
        </p>

        {(isUpcoming || isExpired || quiz.startDate || quiz.endDate) && (
          <div style={{
            marginTop: '12px',
            padding: '12px',
            background: 'var(--gray-50)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--gray-500)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Starts:</span>
              <span style={{ fontWeight: 600, color: 'var(--gray-700)' }}>
                {quiz.startDate ? new Date(quiz.startDate).toLocaleString() : "Now"}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--gray-500)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Ends:</span>
              <span style={{ fontWeight: 600, color: isExpired ? 'var(--error)' : 'var(--gray-700)' }}>
                {quiz.endDate ? new Date(quiz.endDate).toLocaleString() : "Never"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray-600)', fontWeight: 600, fontSize: '14px' }}>
          <FileText size={16} color="var(--primary)" />
          <span>{quiz.questionsCount || quiz.questions?.length || 0} Questions</span>
        </div>
        <button
          className={isTeacher || (hasTaken && !quiz.allowMultipleAttempts) || isExpired || isUpcoming ? "btn btn-outline" : "btn btn-primary"}
          onClick={() => {
            if (isTeacher) {
              navigate(`/results/${quiz._id}`);
            } else if (hasTaken && !quiz.allowMultipleAttempts) {
              navigate('/my-results');
            } else if (isActive) {
              onTakeQuiz(quiz._id);
            }
          }}
          disabled={!isTeacher && !isActive && !hasTaken}
          style={{ padding: '10px 20px', borderRadius: '12px' }}
        >
          {isTeacher ? "View Results" :
            isUpcoming ? "Coming Soon" :
              (hasTaken && !quiz.allowMultipleAttempts) ? "View Result" :
                isExpired ? "Expired" :
                  hasTaken ? "Retake Quiz" : "Take Quiz"}
        </button>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date().getTime());

  // Auto-refresh 'now' to update expiration status every 2 seconds for live-feel
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date().getTime()), 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchQuizzes = useCallback(async (signal) => {
    try {
      let res = await api.get(user?.role === "teacher" ? "/quizzes/teacher/my-quizzes" : "/quizzes", { signal });
      setQuizzes(res.data || []);
    } catch (err) {
      if (err.code === "ERR_CANCELED") return;
      console.error("Failed to fetch quizzes:", err);
    }
  }, [user]);

  const fetchResults = useCallback(async (signal) => {
    try {
      const endpoint = user?.role === "teacher" ? "/results/all" : "/results/student";
      const res = await api.get(endpoint, { signal });
      setResults(res.data || []);
    } catch (err) {
      if (err.code === "ERR_CANCELED") return;
      console.error("Failed to fetch results:", err);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();
    setLoading(true);

    Promise.all([fetchQuizzes(controller.signal), fetchResults(controller.signal)])
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [user, fetchQuizzes, fetchResults]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main style={{ padding: '100px 20px', textAlign: 'center' }}>
          <div className="loading-spinner" style={{ margin: '0 auto', width: '50px', height: '50px', border: '5px solid var(--gray-100)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
          <p style={{ marginTop: '20px', color: 'var(--gray-500)', fontWeight: 600 }}>Analyzing your dashboard...</p>
        </main>
      </div>
    );
  }

  const averageScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + (r.score / Math.max(1, r.total)) * 100, 0) / results.length)
    : 0;

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="animate-fade-in">

        {/* HERO SECTION */}
        <section className="hero-pro" style={{ marginBottom: '50px' }}>
          <div style={{ maxWidth: '650px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '99px', marginBottom: '24px', fontSize: '14px', fontWeight: 600 }}>
              <Sparkles size={16} /> <span>Level Up Your Learning</span>
            </div>
            <h1 className="hero-pro-title">
              Welcome back, <span style={{ textDecoration: 'underline', textDecorationColor: 'var(--accent)' }}>{user.name.split(' ')[0]}</span>!
            </h1>
            <p className="hero-pro-sub" style={{ opacity: 0.95, fontSize: '19px' }}>
              {user.role === "teacher"
                ? "Manage your classroom, track student performance, and create engaging quizzes in seconds."
                : "You've already completed " + results.length + " challenges. Keep the momentum going and achieve your goals today!"}
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <button
                className="btn"
                style={{ background: 'white', color: 'var(--primary)', fontWeight: 800, padding: '14px 28px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                onClick={() => navigate(user.role === "teacher" ? "/create-quiz" : "/quizzes")}
              >
                {user.role === "teacher" ? "Create New Quiz" : "Start New Journey"}
              </button>
              <button
                className="btn"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 700, padding: '14px 24px', borderRadius: '16px' }}
                onClick={() => navigate("/results")}
              >
                View Analytics
              </button>
            </div>
          </div>
          <div className="hero-illustration" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Trophy size={200} style={{ opacity: 0.2, filter: 'drop-shadow(0 0 40px rgba(255,255,255,0.3))' }} />
              <Award size={100} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white' }} />
            </div>
          </div>
        </section>

        {/* TOP STATS */}
        <div className="stats-grid" style={{ marginBottom: '60px' }}>
          <StatCard
            icon={BookOpen}
            value={quizzes.length}
            label={user.role === "teacher" ? "Your Quizzes" : "Available Quizzes"}
            onClick={() => navigate(user.role === "teacher" ? "/results" : "/quizzes")}
            color="#6D28D9"
          />
          <StatCard
            icon={user.role === "teacher" ? Users : CheckCircle2}
            value={user.role === "teacher" ? new Set(results.map(r => r.student?._id)).size : results.length}
            label={user.role === "teacher" ? "Total Students" : "Quizzes Taken"}
            color="#06B6D4"
          />
          <StatCard
            icon={Trophy}
            value={`${averageScore}%`}
            label="Class Average"
            color="#F97316"
          />
          <StatCard
            icon={Zap}
            value={results.filter(r => (r.score / r.total) >= 0.8).length}
            label="High Performers"
            color="#10B981"
          />
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="dashboard-main-grid" style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>

          {/* LEFT COLUMN: QUIZZES */}
          <section className="quizzes-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ background: 'var(--primary)', padding: '12px', borderRadius: '16px', color: 'white', boxShadow: '0 8px 16px rgba(109, 40, 217, 0.25)' }}>
                  <Zap size={24} />
                </div>
                <div>
                  <h2 className="dashboard-section-title" style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>Explore Challenges</h2>
                  <p style={{ margin: 0, color: 'var(--gray-500)', fontSize: '14px' }}>Ready for your next learning milestone?</p>
                </div>
              </div>
              <button className="btn" style={{ border: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => navigate(user.role === "teacher" ? "/results" : "/quizzes")}>
                View All <ArrowRight size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: user.role === 'teacher' ? 'repeat(auto-fill, minmax(300px, 1fr))' : 'repeat(auto-fill, minmax(360px, 1fr))', gap: '32px' }}>
              {quizzes.slice(0, 6).map(q => {
                const hasTaken = results.some(r => String(r.quiz?._id || r.quiz) === String(q._id));
                return (
                  <QuizCard key={q._id} quiz={q} onTakeQuiz={id => navigate(`/quiz/${id}`)} isTeacher={user.role === "teacher"} navigate={navigate} hasTaken={hasTaken} now={now} />
                );
              })}
              {quizzes.length === 0 && (
                <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '100px 40px', textAlign: 'center', borderStyle: 'dashed', background: 'rgba(0,0,0,0.02)' }}>
                  <div style={{ background: 'var(--gray-100)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                    <BookOpen size={40} color="var(--gray-400)" />
                  </div>
                  <h3 style={{ color: 'var(--gray-700)', fontSize: '20px', fontWeight: 800 }}>No quizzes available.</h3>
                  <p style={{ color: 'var(--gray-500)', maxWidth: '400px', margin: '0 auto' }}>You haven't created any quizzes yet. Click "Create New Quiz" to get started!</p>
                </div>
              )}
            </div>
          </section>

          {/* RECENT ACTIVITY SECTION BELOW */}
          <section className="activity-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
              <div style={{ background: 'var(--accent)', padding: '12px', borderRadius: '16px', color: 'white', boxShadow: '0 8px 16px rgba(6, 182, 212, 0.25)' }}>
                <Activity size={24} />
              </div>
              <div>
                <h2 className="dashboard-section-title" style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>Recent Activity</h2>
                <p style={{ margin: 0, color: 'var(--gray-500)', fontSize: '14px' }}>Keep track of your latest performances</p>
              </div>
            </div>

            <div className="glass-card" style={{ border: '1px solid var(--border)', overflow: 'hidden' }}>
              {results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <p style={{ color: 'var(--gray-400)', fontSize: '15px' }}>No recent activity found.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {results.slice(0, 5).map((r, idx) => (
                    <div
                      key={r._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        padding: '24px',
                        borderBottom: idx === results.slice(0, 5).length - 1 ? 'none' : '1px solid var(--border)',
                        background: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)'
                      }}
                    >
                      <div style={{
                        width: '70px',
                        height: '52px',
                        borderRadius: '16px',
                        background: 'rgba(109, 40, 217, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                        fontSize: '9px',
                        fontWeight: 900,
                        textAlign: 'center',
                        padding: '4px',
                        lineHeight: 1.1,
                        flexShrink: 0
                      }}>
                        <div style={{ fontSize: '14px' }}><BookOpen size={20} /></div>
                        <span style={{
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {r.quiz?.subject?.toUpperCase() || "QUIZ"}
                        </span>
                      </div>
                      <div style={{ flex: 1, textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h4 style={{
                          fontSize: '18px',
                          fontWeight: 800,
                          marginBottom: '6px',
                          color: 'var(--gray-900)',
                          letterSpacing: '-0.01em'
                        }}>
                          {user.role === "teacher" ? (r.student?.name || "Student") : (r.quiz?.title || "Quiz")}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--gray-500)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={14} /> {new Date(r.submittedAt || r.createdAt).toLocaleDateString()}
                          </span>
                          <span style={{ height: '4px', width: '4px', background: 'var(--gray-300)', borderRadius: '50%' }}></span>
                          <span style={{
                            fontWeight: 700,
                            color: (r.score / r.total) >= 0.8 ? 'var(--success)' : (r.score / r.total) >= 0.5 ? 'var(--warning)' : 'var(--error)'
                          }}>
                            {Math.round((r.score / r.total) * 100)}% Result
                          </span>
                        </div>
                      </div>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '10px' }}
                        onClick={() => navigate(`/results/${r.quiz?._id || r.quiz}`)}
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                  <div style={{ padding: '24px', background: 'rgba(0,0,0,0.02)', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '12px 32px', fontSize: '14px', fontWeight: 700, borderRadius: '12px' }}
                      onClick={() => navigate("/results")}
                    >
                      View All Activity Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

        </div>

      </main>
      <Footer />
    </div>
  );
}
