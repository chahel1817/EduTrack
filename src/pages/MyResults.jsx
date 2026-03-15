import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  BarChart3,
  BookOpen,
  Award,
  TrendingUp,
  ArrowRight,
  Clock,
  FileText,
  Trophy,
  Sparkles,
} from "lucide-react";

const MyResults = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get("/results/student");
        setResults(res.data || []);
      } catch (err) {
        console.error("Failed to load results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <div className="loading" style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
            <div>Loading your results...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">

        {/* ACHIEVEMENT HERO */}
        <section className="hero-pro myresults-hero" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 60px',
          borderRadius: '40px',
          marginBottom: '40px',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
          background: 'var(--vibrant-gradient)',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 80%)', zIndex: 0 }}></div>

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '99px', marginBottom: '32px', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              <Trophy size={16} fill="white" /> <span style={{ color: 'white' }}>The Archive of Excellence</span>
            </div>
            <h1 style={{ margin: '0 0 24px', fontSize: '64px', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color: 'white' }}>Learning <br /><span style={{ background: 'linear-gradient(to right, #fff, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Performance Record.</span></h1>
            <p style={{ margin: '0 auto', fontSize: '20px', maxWidth: '650px', lineHeight: 1.6, fontWeight: 500, color: 'white' }}>
              A strategic history of your learning achievements. Analyze your accuracy flux, temporal synchronization, and subject-level mastery.
            </p>
          </div>

          <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', opacity: 0.1 }}>
            <Sparkles size={400} color="white" />
          </div>
        </section>

        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 40px', background: 'var(--card-bg)', borderRadius: '48px', border: '1px dashed var(--border)' }}>
            <Award size={64} style={{ margin: '0 auto 32px', color: 'var(--gray-300)' }} />
            <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '16px' }}>No Results Yet</h2>
            <p style={{ color: 'var(--gray-500)', maxWidth: '400px', margin: '0 auto 48px' }}>Your achievement archive is empty. Start your first assessment quiz to begin historical tracking.</p>
            <button className="btn" onClick={() => navigate("/quizzes")} style={{ background: 'var(--vibrant-gradient)', color: 'white', padding: '20px 48px', borderRadius: '20px', fontWeight: 900, border: 'none' }}>
              Start Your First Trial
            </button>
          </div>
        ) : (
          <>
            {/* RESULTS GRID */}
            <section className="dashboard-section">
              <div className="quizzes-grid-dashboard">
                {results.map((r) => {
                  const percentage = Math.round(
                    (r.score / Math.max(1, r.total)) * 100
                  );

                  return (
                    <div key={r._id} className="quiz-card-dashboard hover-lift">
                      <div className="quiz-card-header">
                        <div className="quiz-card-subject">
                          <BookOpen size={16} />
                          {r.quiz.subject}
                        </div>
                        <div className="quiz-card-date">
                          {new Date(r.createdAt || r.submittedAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="quiz-card-content">
                        <h3 className="quiz-card-title">
                          {r.quiz.title}
                        </h3>

                        <div className="quiz-card-stats">
                          <div className="quiz-stat-item">
                            <FileText size={14} />
                            <span>
                              Score: <strong>{r.score}/{r.total}</strong>
                            </span>
                          </div>

                          <div className="quiz-stat-item">
                            <TrendingUp size={14} />
                            <span>
                              {percentage}%
                            </span>
                          </div>

                          <div className="quiz-stat-item">
                            <Clock size={14} />
                            <span>{r.timeSpent} min</span>
                          </div>
                        </div>

                        {/* PROGRESS BAR */}
                        <div
                          style={{
                            marginTop: "10px",
                            width: "100%",
                            height: "6px",
                            background: "var(--gray-200)",
                            borderRadius: "4px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${percentage}%`,
                              height: "100%",
                              background:
                                percentage >= 80
                                  ? "var(--accent)"
                                  : percentage >= 60
                                    ? "var(--warning)"
                                    : "var(--error)",
                              transition: "width 0.3s ease",
                            }}
                          />
                        </div>
                      </div>

                      <div className="quiz-card-actions">
                        <button
                          className="btn btn-outline"
                          onClick={() =>
                            navigate(`/my-results/${r.quiz?._id || r.quiz}`)
                          }

                        >
                          View Details
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyResults;
