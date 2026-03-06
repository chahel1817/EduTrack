import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BarChart3, BookOpen, Users, TrendingUp, ArrowRight, Activity, Zap, Shield, PieChart, ShieldCheck, Cpu } from "lucide-react";

const QuizResultsList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "teacher") {
      navigate("/dashboard");
      return;
    }

    const fetchData = async () => {
      try {
        const quizzesRes = await api.get("/quizzes");
        const myQuizzes = (quizzesRes.data || []).filter(
          (q) => String(q.createdBy?._id || q.createdBy) === String(user.id)
        );
        setQuizzes(myQuizzes);

        const resultsRes = await api.get("/results/all");
        setResults(resultsRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  const getQuizStats = (quizId) => {
    const quizResults = results.filter(
      (r) => String(r.quiz?._id || r.quiz) === String(quizId)
    );
    const totalSubmissions = quizResults.length;
    const averagePercentage = totalSubmissions > 0
      ? (quizResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / totalSubmissions).toFixed(1)
      : 0;
    return { totalSubmissions, averagePercentage };
  };

  if (loading) return (
    <div className="dashboard-container resultslist-page">
      <Navbar />
      <main className="dashboard-main"><div className="loading">Syncing Performance Data...</div></main>
    </div>
  );

  return (
    <div className="dashboard-container resultslist-page">
      <Navbar />
      <main className="dashboard-main">
        <div style={{ padding: '0 24px' }}>

          {/* ANALYTICS HERO */}
          <section className="hero-pro resultslist-hero" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 60px',
            borderRadius: '40px',
            marginBottom: '60px',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
            color: 'white'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 70% 30%, rgba(6, 182, 212, 0.15) 0%, transparent 70%)', zIndex: 0 }}></div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '99px', marginBottom: '32px', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                <Activity size={16} className="text-accent" /> <span>Intel Stack Command Center</span>
              </div>
              <h1 style={{ margin: '0 0 24px', fontSize: '64px', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>Performance <br /><span style={{ background: 'linear-gradient(to right, var(--accent), #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Analytics.</span></h1>
              <p style={{ margin: '0 auto', opacity: 0.7, fontSize: '20px', maxWidth: '650px', lineHeight: 1.6, fontWeight: 500 }}>
                High-precision tracking of student learning flux. Analyze engagement, accuracy, and pedagogical efficiency across your entire quiz network.
              </p>
            </div>

            <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', opacity: 0.05 }}>
              <PieChart size={400} color="white" />
            </div>
          </section>

          {/* OVERALL STATS (Teacher perspective) */}
          <div className="stats-grid" style={{ marginBottom: '60px' }}>
            <div className="stat-card glass-card">
              <div className="stat-icon-wrapper" style={{ background: 'rgba(109, 40, 217, 0.1)', color: 'var(--primary)' }}><BookOpen size={24} /></div>
              <h3 className="stat-value">{quizzes.length}</h3>
              <p className="stat-label">Active Assessments</p>
            </div>
            <div className="stat-card glass-card">
              <div className="stat-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent)' }}><Users size={24} /></div>
              <h3 className="stat-value">{results.length}</h3>
              <p className="stat-label">Total Submissions</p>
            </div>
            <div className="stat-card glass-card">
              <div className="stat-icon-wrapper" style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)' }}><Zap size={24} /></div>
              <h3 className="stat-value">{results.length > 0 ? (results.reduce((s, r) => s + (r.percentage || 0), 0) / results.length).toFixed(1) : 0}%</h3>
              <p className="stat-label">Network Accuracy</p>
            </div>
          </div>

          {quizzes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '120px 40px', background: 'var(--gray-50)', borderRadius: '48px', border: '1px dashed var(--border)' }}>
              <Cpu size={64} style={{ margin: '0 auto 32px', color: 'var(--gray-300)' }} />
              <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '16px' }}>No Active Quizzes</h2>
              <p style={{ color: 'var(--gray-500)', maxWidth: '400px', margin: '0 auto 48px' }}>Your performance registry is currently empty. Start your first quiz to begin performance tracking.</p>
              <button className="btn btn-primary" onClick={() => navigate("/create-quiz")} style={{ padding: '20px 48px', borderRadius: '20px', fontWeight: 900 }}>
                Start New quiz
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '32px', marginBottom: '100px' }}>
              {quizzes.map((quiz) => {
                const stats = getQuizStats(quiz._id);
                return (
                  <div key={quiz._id} className="glass-card hover-lift" style={{ padding: '40px', borderRadius: '40px', border: '1px solid var(--border)', background: 'var(--white)', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ padding: '6px 14px', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent)', borderRadius: '12px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{quiz.subject}</span>
                      <span style={{ fontSize: '12px', color: 'var(--gray-400)', fontWeight: 700 }}>{new Date(quiz.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '12px', color: 'var(--gray-900)', letterSpacing: '-0.02em' }}>{quiz.title}</h3>
                      <p style={{ color: 'var(--gray-500)', fontSize: '15px', lineHeight: 1.7, minHeight: '3.4em' }}>{quiz.description || "In-depth performance artifacts for the " + quiz.subject + " assessment quiz."}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'var(--gray-50)', padding: '24px', borderRadius: '24px' }}>
                      <div>
                        <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 900, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Submissions</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 900, color: 'var(--gray-900)' }}>
                          <Users size={18} className="text-primary" /> {stats.totalSubmissions}
                        </div>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 900, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Avg. Accuracy</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 900, color: 'var(--accent)' }}>
                          <TrendingUp size={18} /> {stats.averagePercentage}%
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/results/${quiz._id}`)}
                        style={{ width: "100%", padding: '18px', borderRadius: '18px', fontWeight: 900, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 10px 20px rgba(109, 40, 217, 0.2)' }}
                      >
                        Decrypt Results <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PERFORMANCE TRENDS CTA */}
          <section className="resultslist-predictive-card" style={{
            padding: '80px',
            borderRadius: '48px',
            background: 'var(--black)',
            color: 'white',
            textAlign: 'center',
            marginBottom: '100px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', background: 'var(--accent)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.1 }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <ShieldCheck size={48} className="text-accent" style={{ marginBottom: '24px', margin: '0 auto' }} />
              <h2 style={{ fontSize: '38px', fontWeight: 900, marginBottom: '24px' }}>Predictive Analytics quiz</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '650px', margin: '0 auto 48px', fontSize: '18px', lineHeight: 1.6 }}>
                Our Learning engine is calculating class-wide growth trajectories based on current accuracy flux. Complete 5 more assessments to unlock deep-level predictive outcomes.
              </p>
              <div className="mastery-gauge" style={{ maxWidth: '400px', margin: '0 auto', background: 'rgba(255,255,255,0.1)' }}>
                <div className="mastery-gauge-fill" style={{ width: '60%' }}></div>
              </div>
              <p style={{ marginTop: '16px', fontSize: '13px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Synthesis 60% Complete</p>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuizResultsList;

