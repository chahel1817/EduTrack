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

        {/* HEADER */}
        <section className="dashboard-section">
          <h2 className="section-heading">
            <BarChart3 size={28} style={{ marginRight: "12px", verticalAlign: "middle" }} />
            My Test Results
          </h2>
          <p style={{ color: "var(--gray-600)", marginTop: "6px" }}>
            Track your performance and review detailed feedback
          </p>
        </section>

        {/* EMPTY STATE */}
        {results.length === 0 ? (
          <section className="dashboard-section">
            <div className="empty-state enhanced">
              <Award size={64} color="var(--primary)" />
              <h3>No Results Yet</h3>
              <p>You haven’t attempted any quizzes yet. Start one to see results here.</p>
              <button
                className="btn btn-primary"
                style={{ marginTop: "1rem" }}
                onClick={() => navigate("/quizzes")}
              >
                <BookOpen size={18} />
                Browse Quizzes
              </button>
            </div>
          </section>
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
