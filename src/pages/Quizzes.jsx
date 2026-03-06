import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Search,
  BookOpen,
  Clock,
  Play,
  Filter,
  FileText,
  Check,
  Award,
  Zap,
} from "lucide-react";

const Quizzes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [subjects, setSubjects] = useState([]);

  /* --------------------------------------------------
     ROLE GUARD - TEACHERS NOT ALLOWED HERE
  -------------------------------------------------- */
  useEffect(() => {
    if (!user) return;

    if (user.role === "teacher") {
      navigate("/dashboard");
      return;
    }

    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [quizzesRes, resultsRes] = await Promise.all([
        api.get("/quizzes"),
        api.get("/results/student")
      ]);

      const quizzesData = quizzesRes.data || [];
      setQuizzes(quizzesData);
      setResults(resultsRes.data || []);

      const uniqueSubjects = [...new Set(quizzesData.map((q) => q.subject))];
      setSubjects(uniqueSubjects);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------------
     FILTER LOGIC
  -------------------------------------------------- */
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject =
      !filterSubject || quiz.subject === filterSubject;

    return matchesSearch && matchesSubject;
  });

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  /* --------------------------------------------------
     LOADING STATE
  -------------------------------------------------- */
  if (loading) {
    return (
      <div className="dashboard-container quizzes-page">
        <Navbar />
        <main className="dashboard-main">
          <div className="loading">Loading quizzes...</div>
        </main>
        <Footer />
      </div>
    );
  }

  /* --------------------------------------------------
     UI
  -------------------------------------------------- */
  return (
    <div className="dashboard-container quizzes-page">
      <Navbar />
      <main className="dashboard-main">
        <div className="dashboard-section" style={{ padding: '0 24px' }}>
          {/* HEADER HERO */}
          <section className="hero-pro quizzes-hero" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '60px',
            borderRadius: '32px',
            marginBottom: '40px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '99px', marginBottom: '24px', fontSize: '14px', fontWeight: 600 }}>
                <BookOpen size={16} /> <span>Curated Library</span>
              </div>
              <h1 className="hero-pro-title" style={{ margin: '0 0 16px', fontSize: '48px', fontWeight: 900 }}>Master Your Craft</h1>
              <p className="hero-pro-sub" style={{ margin: 0, opacity: 0.95, fontSize: '18px', lineHeight: 1.6 }}>
                Challenge yourself with our wide library of interactive quizzes designed by top educators. Track your progress and unlock your potential.
              </p>
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Search size={180} style={{ opacity: 0.1, color: 'white', transform: 'rotate(-15deg)' }} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--accent)', borderRadius: '50%', filter: 'blur(20px)', opacity: 0.5 }}></div>
              </div>
            </div>
          </section>

          {/* SEARCH & FILTER BAR */}
          <div className="glass-card" style={{
            display: 'flex',
            gap: '20px',
            padding: '12px',
            marginBottom: '48px',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} size={20} />
              <input
                type="text"
                placeholder="Search by title or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 48px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'var(--gray-50)',
                  fontWeight: 500,
                  color: 'var(--gray-900)'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Filter style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} size={18} />
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  style={{
                    padding: '14px 20px 14px 44px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'var(--gray-50)',
                    appearance: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: 'var(--gray-700)',
                    minWidth: '180px'
                  }}
                >
                  <option value="">All Subjects</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* QUIZZES GRID */}
          {filteredQuizzes.length === 0 ? (
            <div className="glass-card" style={{ padding: '80px 40px', textAlign: 'center', border: '1px dashed var(--border)', background: 'rgba(0,0,0,0.01)' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}><Search size={44} style={{ color: 'var(--gray-400)' }} /></div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--gray-700)' }}>No matches found</h3>
              <p style={{ color: 'var(--gray-500)', maxWidth: '400px', margin: '0 auto' }}>We couldn't find any quizzes matching your current search or filter. Try a different term!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px', marginBottom: '80px' }}>
              {filteredQuizzes.map((quiz) => {
                const hasTaken = results.some(r => String(r.quiz?._id || r.quiz) === String(quiz._id));
                return (
                  <div
                    key={quiz._id}
                    className="glass-card hover-lift"
                    style={{
                      padding: '32px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '24px',
                      border: '1px solid var(--border)',
                      position: 'relative',
                      background: 'var(--white)'
                    }}
                  >
                    {hasTaken && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '-40px',
                        background: 'var(--success)',
                        color: 'white',
                        padding: '4px 45px',
                        fontSize: '9px',
                        fontWeight: 900,
                        transform: 'rotate(45deg)',
                        boxShadow: '0 4px 10px rgba(34, 197, 94, 0.3)',
                        zIndex: 1,
                        letterSpacing: '0.1em'
                      }}>
                        MASTERED
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        padding: '6px 14px',
                        background: 'rgba(109, 40, 217, 0.08)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 800,
                        color: 'var(--primary)',
                        textTransform: 'uppercase'
                      }}>
                        {quiz.subject}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {formatDate(quiz.createdAt)}
                      </span>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '12px', color: 'var(--gray-900)', letterSpacing: '-0.02em' }}>{quiz.title}</h3>
                      <p style={{ color: 'var(--gray-500)', fontSize: '15px', lineHeight: 1.7, minHeight: '5.1em' }}>
                        {quiz.description || "Challenge your Learning pathways with this strategic assessment in " + quiz.subject + "."}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginTop: 'auto', padding: '16px', background: 'var(--gray-50)', borderRadius: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 800, fontSize: '13px' }}>
                        <Clock size={16} /> <span>{quiz.timeLimit || 30}m</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray-600)', fontWeight: 800, fontSize: '13px' }}>
                        <FileText size={16} /> <span>{quiz.questionsCount || quiz.questions?.length || 0} Qs</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (hasTaken && !quiz.allowMultipleAttempts) {
                          navigate('/results');
                        } else {
                          navigate(`/quiz/${quiz._id}`);
                        }
                      }}
                      className={`btn ${(hasTaken && !quiz.allowMultipleAttempts) ? 'btn-outline' : 'btn-primary'}`}
                      style={{ width: '100%', borderRadius: '18px', padding: '18px', fontWeight: 900, fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      {hasTaken ? (
                        quiz.allowMultipleAttempts ? "Start Retake" : "Analyze Performance"
                      ) : "Start Quiz"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* MASTERY ROADMAP */}
          <section style={{ marginBottom: '100px' }}>
            <div className="glass-card quizzes-roadmap-card" style={{ padding: '60px', borderRadius: '48px', background: 'var(--gray-900)', color: 'white', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.1 }}><Award size={300} /></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{ fontSize: '42px', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.04em' }}>Your Mastery Path</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', marginBottom: '60px', fontSize: '18px', lineHeight: 1.6 }}>
                  Follow these milestones to keep improving and move toward top performance.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
                  {[
                    { title: "Initiation", desc: "Complete 5 assessments with >80% accuracy.", status: "80%", icon: <Zap size={20} /> },
                    { title: "Specialist", desc: "Master 3 distinct subject quizzes.", status: "40%", icon: <BookOpen size={20} /> },
                    { title: "Top", desc: "Achieve a top 1% global accuracy ranking.", status: "10%", icon: <Award size={20} /> }
                  ].map((m, i) => (
                    <div key={i} className="quizzes-roadmap-item" style={{ padding: '32px', background: 'rgba(255,255,255,0.05)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>{m.icon}</div>
                      <h4 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '12px' }}>{m.title}</h4>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>{m.desc}</p>
                      <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ width: m.status, height: '100%', background: 'var(--primary)' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Quizzes;


