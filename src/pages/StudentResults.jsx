import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  BarChart3,
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Award,
} from "lucide-react";

const StudentResults = () => {
  const { id } = useParams(); // quizId
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchResult = async () => {
    try {
      console.log("🔍 Fetching student results for quiz:", id);

      const res = await api.get("/results/student");

      console.log("📦 Raw API response:", res.data);

      const results = res.data || [];

     const found = results.find(
  (r) => String(r.quiz?._id || r.quiz) === String(id)
);


      console.log("🎯 Matched result:", found);

      if (found) setResult(found);
    } catch (err) {
      console.error("❌ Frontend error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchResult();
}, [id]);


  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <div className="loading">Loading result...</div>
        </main>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <div className="empty-state enhanced">
            <XCircle size={64} color="var(--error)" />
            <h3>Result Not Found</h3>
            <p>The result for this quiz could not be found.</p>
          </div>
        </main>
      </div>
    );
  }

  const { quiz } = result;

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">

        {/* HEADER */}
        <section className="dashboard-section">
          <div className="card" style={{ padding: "2rem" }}>
            <h2 className="section-heading">
              <BarChart3 size={28} style={{ marginRight: 10 }} />
              {quiz.title}
            </h2>
            <p style={{ color: "var(--gray-600)", marginTop: 4 }}>
              <BookOpen size={14} /> Subject: {quiz.subject}
            </p>

            {/* STATS */}
            <div className="stats-grid" style={{ marginTop: "1.5rem" }}>
              <div className="stat-card">
                <Award size={24} />
                <h3>{result.score}/{result.total}</h3>
                <p>Score</p>
              </div>

              <div className="stat-card">
                <CheckCircle2 size={24} />
                <h3>{result.percentage}%</h3>
                <p>Percentage</p>
              </div>

              <div className="stat-card">
                <Clock size={24} />
                <h3>{result.timeSpent} min</h3>
                <p>Time Spent</p>
              </div>
            </div>
          </div>
        </section>

        {/* QUESTION REVIEW */}
        <section className="dashboard-section">
          <h2 className="section-heading">
            <BookOpen size={28} style={{ marginRight: 10 }} />
            Question Review
          </h2>

          {quiz.questions.map((q, index) => {
            const ans = result.answers.find(
              (a) => a.questionIndex === index
            );

            return (
              <div key={index} className="card" style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ marginBottom: "1rem" }}>
                  {index + 1}. {q.question}
                </h3>

                {q.options.map((opt, i) => {
                  const isCorrect = i === q.correctAnswer;
                  const isSelected = ans?.selectedAnswer === i;

                  return (
                    <div
                      key={i}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "8px",
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        background: isCorrect
                          ? "rgba(16,185,129,0.15)"
                          : isSelected
                          ? "rgba(239,68,68,0.15)"
                          : "var(--gray-50)",
                        border: isCorrect
                          ? "1px solid rgba(16,185,129,0.4)"
                          : isSelected
                          ? "1px solid rgba(239,68,68,0.4)"
                          : "1px solid var(--border-gray)",
                      }}
                    >
                      {isCorrect ? (
                        <CheckCircle2 size={18} color="var(--accent-dark)" />
                      ) : isSelected ? (
                        <XCircle size={18} color="var(--error-dark)" />
                      ) : null}
                      <span>{opt}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </section>

        {/* ACTION */}
        <section className="dashboard-section" style={{ textAlign: "center" }}>
          <button
            className="btn btn-outline"
            onClick={() => navigate("/my-results")}
          >
            <ArrowLeft size={18} />
            Back to My Results
          </button>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default StudentResults;
