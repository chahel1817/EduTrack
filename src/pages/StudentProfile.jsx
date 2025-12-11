import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Target,
  BookOpen,
  Award,
  BarChart3,
  Timer,
  TrendingUp,
  CheckCircle2,
  Edit,
  Clock,
} from "lucide-react";

const StudentProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [resultsRes, quizzesRes] = await Promise.all([
          api.get("/results/student"),
          api.get("/quiz"),
        ]);
        setResults(resultsRes.data || []);
        setQuizzes(quizzesRes.data || []);
      } catch (err) {
        console.error("Profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const totalCompleted = results.length;
  const avgPercentage =
    totalCompleted > 0
      ? Math.round(
          results.reduce((sum, r) => sum + (r.percentage || 0), 0) / totalCompleted
        )
      : 0;
  const bestScore =
    totalCompleted > 0
      ? Math.max(...results.map((r) => r.percentage || 0))
      : 0;
  const totalTimeSpent =
    results.reduce((sum, r) => sum + (r.timeSpent || 0), 0);

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        {/* Hero Section */}
        <section className="dashboard-section hero-pro" style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
            <div
              className="profile-avatar"
              style={{
                width: 120,
                height: 120,
                fontSize: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255, 255, 255, 0.2)",
                border: "3px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div style={{ flex: 1, minWidth: "250px" }}>
              <h2 className="hero-pro-title" style={{ marginBottom: "8px" }}>
                {user.name}
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", opacity: 0.9 }}>
                  <Mail size={18} />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", opacity: 0.9 }}>
                    <Phone size={18} />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.age && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", opacity: 0.9 }}>
                    <Calendar size={18} />
                    <span>{user.age} years old</span>
                  </div>
                )}
              </div>
              <div
                className="profile-role-chip"
                style={{
                  marginTop: "12px",
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <User size={16} />
                {user.role === "student" ? "Student" : "Teacher"}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="dashboard-section">
          <h2 className="section-heading">
            <BarChart3 size={28} style={{ marginRight: "12px", verticalAlign: "middle" }} />
            Performance Overview
          </h2>

          <div className="stats-grid">
            <div className="stat-card hover-lift">
              <div className="stat-icon-wrapper">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="stat-value">{totalCompleted}</h3>
              <p className="stat-label">Quizzes Completed</p>
            </div>

            <div className="stat-card hover-lift">
              <div className="stat-icon-wrapper">
                <TrendingUp size={28} />
              </div>
              <h3 className="stat-value">{avgPercentage}%</h3>
              <p className="stat-label">Average Score</p>
            </div>

            <div className="stat-card hover-lift">
              <div className="stat-icon-wrapper">
                <Target size={28} />
              </div>
              <h3 className="stat-value">{bestScore}%</h3>
              <p className="stat-label">Best Score</p>
            </div>

            <div className="stat-card hover-lift">
              <div className="stat-icon-wrapper">
                <Clock size={28} />
              </div>
              <h3 className="stat-value">{totalTimeSpent}</h3>
              <p className="stat-label">Minutes Spent</p>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="dashboard-section">
          <h2 className="section-heading">
            <Award size={28} style={{ marginRight: "12px", verticalAlign: "middle" }} />
            Achievements
          </h2>

          {totalCompleted === 0 ? (
            <div className="empty-state enhanced">
              <Award size={50} color="var(--primary)" />
              <h3>No Achievements Yet</h3>
              <p>Complete quizzes to unlock achievements!</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
              {avgPercentage >= 80 && (
                <div className="stat-card hover-lift" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🏆</div>
                  <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>High Achiever</h3>
                  <p style={{ fontSize: "14px", color: "var(--gray-600)" }}>Average score above 80%</p>
                </div>
              )}

              {totalCompleted >= 5 && (
                <div className="stat-card hover-lift" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🔥</div>
                  <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>Active Learner</h3>
                  <p style={{ fontSize: "14px", color: "var(--gray-600)" }}>Completed 5+ quizzes</p>
                </div>
              )}

              {bestScore === 100 && (
                <div className="stat-card hover-lift" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "12px" }}>💯</div>
                  <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>Perfect Score</h3>
                  <p style={{ fontSize: "14px", color: "var(--gray-600)" }}>Achieved 100% on a quiz</p>
                </div>
              )}

              <div className="stat-card hover-lift" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📚</div>
                <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>Quiz Master</h3>
                <p style={{ fontSize: "14px", color: "var(--gray-600)" }}>Completed {totalCompleted} quizzes</p>
              </div>
            </div>
          )}
        </section>

        {/* Recent Activity */}
        <section className="dashboard-section">
          <h2 className="section-heading">
            <BookOpen size={28} style={{ marginRight: "12px", verticalAlign: "middle" }} />
            Recent Activity
          </h2>

          {loading ? (
            <div className="loading">Loading your activity...</div>
          ) : results.length === 0 ? (
            <div className="empty-state enhanced">
              <BookOpen size={50} color="var(--primary)" />
              <h3>No Quiz Attempts Yet</h3>
              <p>Start taking quizzes to see your activity here.</p>
              <button className="btn btn-primary" onClick={() => navigate("/quizzes")} style={{ marginTop: "20px" }}>
                Browse Quizzes
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Quiz</th>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Time Spent</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.slice(0, 10).map((r) => {
                    const percentage = r.percentage || Math.round(((r.score || 0) / Math.max(1, r.total || 1)) * 100);
                    return (
                      <tr key={r._id}>
                        <td style={{ fontWeight: 600 }}>{r.quiz?.title || "Unknown Quiz"}</td>
                        <td>{r.quiz?.subject || "N/A"}</td>
                        <td>
                          <span
                            style={{
                              padding: "4px 12px",
                              borderRadius: "12px",
                              background:
                                percentage >= 80
                                  ? "rgba(16,185,129,0.1)"
                                  : percentage >= 60
                                  ? "rgba(245,158,11,0.1)"
                                  : "rgba(239,68,68,0.1)",
                              color:
                                percentage >= 80
                                  ? "var(--accent-dark)"
                                  : percentage >= 60
                                  ? "var(--warning-dark)"
                                  : "var(--error-dark)",
                              fontWeight: 600,
                            }}
                          >
                            {r.score}/{r.total}
                          </span>
                        </td>
                        <td style={{ fontWeight: 700, color: percentage >= 80 ? "var(--accent-dark)" : percentage >= 60 ? "var(--warning-dark)" : "var(--error-dark)" }}>
                          {percentage}%
                        </td>
                        <td>{r.timeSpent || 0} min</td>
                        <td>{new Date(r.submittedAt || r.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="btn btn-outline"
                            style={{ padding: "6px 12px", fontSize: "12px" }}
                            onClick={() => navigate(`/my-results/${r.quiz?._id}`)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default StudentProfile;
