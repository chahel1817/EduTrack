
import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  User,
  Mail,
  Target,
  Award,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
} from "lucide-react";

const StudentProfile = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const res = await api.get("/results/student");
        setResults(res.data || []);
      } catch (err) {
        console.error("Profile error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const totalCompleted = results.length;
  const avgPercentage = totalCompleted > 0
    ? Math.round(results.reduce((sum, r) => sum + ((r.score / r.total) * 100), 0) / totalCompleted)
    : 0;
  const bestScore = totalCompleted > 0
    ? Math.max(...results.map(r => Math.round((r.score / r.total) * 100)))
    : 0;

  if (loading) return null;

  return (
    <div className="dashboard-container">
      <Navbar />
      <main>
        {/* PROFILE HERO */}
        <section className="profile-hero" style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div className="user-avatar" style={{ width: '100px', height: '100px', fontSize: '40px', border: '4px solid rgba(255,255,255,0.3)' }}>
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 style={{ color: 'white', marginBottom: '8px', fontSize: '32px' }}>{user.name}</h1>
            <div style={{ display: 'flex', gap: '16px', color: 'rgba(255,255,255,0.8)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={16} /> {user.email}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={16} /> {user.role}</div>
            </div>
          </div>
        </section>

        {/* STATS GRID */}
        <div className="stats-grid" style={{ marginBottom: '40px' }}>
          <div className="stat-card">
            <div className="stat-icon-wrapper"><CheckCircle2 size={24} /></div>
            <div className="stat-value">{totalCompleted}</div>
            <div className="stat-label">Quizzes Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper"><TrendingUp size={24} /></div>
            <div className="stat-value">{avgPercentage}%</div>
            <div className="stat-label">Average Accuracy</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper"><Target size={24} /></div>
            <div className="stat-value">{bestScore}%</div>
            <div className="stat-label">Highest Score</div>
          </div>
        </div>

        {/* ACHIEVEMENTS */}
        <section className="dashboard-section">
          <h2 className="dashboard-section-title">Certifications & Badges</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
              <Award size={48} color="var(--button)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Early Adopter</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '14px' }}>One of the first 100 students</p>
            </div>
            {totalCompleted > 5 && (
              <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                <Award size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Consistent Learner</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: '14px' }}>Completed over 5 quizzes</p>
              </div>
            )}
          </div>
        </section>

        {/* RECENT ACTIVITY */}
        <section className="dashboard-section">
          <h2 className="dashboard-section-title">Recent Quiz Results</h2>
          <div className="table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--gray-50)', textAlign: 'left' }}>
                  <th style={{ padding: '16px' }}>Quiz</th>
                  <th style={{ padding: '16px' }}>Subject</th>
                  <th style={{ padding: '16px' }}>Score</th>
                  <th style={{ padding: '16px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px', fontWeight: 600 }}>{r.quiz?.title || "Quiz"}</td>
                    <td style={{ padding: '16px' }}>{r.quiz?.subject || "General"}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{Math.round((r.score / r.total) * 100)}%</span>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--gray-500)' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default StudentProfile;
