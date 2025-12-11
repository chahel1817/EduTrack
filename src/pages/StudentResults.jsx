import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

/* ---------------------------------------------------
   Reusable EMPTY STATE Component
--------------------------------------------------- */
const EmptyState = ({ icon, title, message, navigate }) => (
  <div className="dashboard-container">
    <Navbar />
    <main className="dashboard-main">
      <div className="dashboard-section">
        <div className="empty-state enhanced">
          <div
            className="empty-icon"
            style={{
              fontSize: "5rem",
              marginBottom: "1.5rem",
              animation: "float 3s ease-in-out infinite",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
            }}
          >
            {icon}
          </div>

          <h3
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "1rem",
            }}
          >
            {title}
          </h3>

          <p
            style={{
              marginBottom: "2rem",
              maxWidth: "500px",
              margin: "0 auto 2rem auto",
              lineHeight: "1.6",
            }}
          >
            {message}
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-primary empty-cta"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: "0 auto",
              animation: "pulse 2s infinite",
            }}
          >
            <span>🏠</span>
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    </main>
  </div>
);

/* ---------------------------------------------------
   Reusable Stat Card
--------------------------------------------------- */
const StatCard = ({ icon, value, label, gradient, border }) => (
  <div
    style={{
      background: `linear-gradient(135deg, ${gradient}, ${gradient})`,
      border: `1px solid ${border}`,
      borderRadius: "16px",
      padding: "2rem",
      textAlign: "center",
    }}
  >
    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{icon}</div>
    <h3 style={{ fontSize: "2.4rem", fontWeight: "700" }}>{value}</h3>
    <p style={{ color: "#64748b", fontSize: "14px" }}>{label}</p>
  </div>
);

/* ---------------------------------------------------
   MAIN COMPONENT — Student Results
--------------------------------------------------- */
const StudentResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [result, setResult] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* -------------------------------
     Fetch Data
  -------------------------------- */
  useEffect(() => {
    if (!user) return;

    if (user?.role !== "student") {
      navigate("/dashboard");
      return;
    }

    const loadData = async () => {
      try {
        const [quizRes, resultsRes] = await Promise.all([
          api.get(`/quiz/${id}`),
          api.get("/results/student"),
        ]);

        setQuiz(quizRes.data);

        const results = resultsRes.data || [];

        const myResult = results.find((r) => r.quiz?._id === id);

        if (!myResult) {
          setError("NOT_TAKEN");
          return;
        }

        setResult(myResult);
      } catch (err) {
        console.error("Error fetching:", err);
        setError("SERVER_ERROR");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, user, navigate]);

  /* -------------------------------
     Loading
  -------------------------------- */
  if (loading) {
    return (
      <EmptyState
        icon="⏳"
        title="Loading Result…"
        message="Fetching your quiz performance…"
        navigate={navigate}
      />
    );
  }

  /* -------------------------------
     Errors
  -------------------------------- */
  if (error === "NOT_TAKEN") {
    return (
      <EmptyState
        icon="📝"
        title="Quiz Not Taken Yet"
        message="You haven't taken this quiz yet. Take the quiz to see results."
        navigate={navigate}
      />
    );
  }

  if (error === "SERVER_ERROR") {
    return (
      <EmptyState
        icon="⚠️"
        title="Error Loading Result"
        message="Something went wrong."
        navigate={navigate}
      />
    );
  }

  if (!quiz || !result) {
    return (
      <EmptyState
        icon="❓"
        title="Result Not Found"
        message="The result you're looking for does not exist."
        navigate={navigate}
      />
    );
  }

  /* -------------------------------
     Score Logic
  -------------------------------- */
  const percentage = result.percentage ?? 0;

  const isExcellent = percentage >= 80;
  const isGood = percentage >= 60;
  const isBad = percentage < 60;

  const performanceBG = isExcellent
    ? "rgba(16,185,129,0.1)"
    : isGood
    ? "rgba(245,158,11,0.1)"
    : "rgba(239,68,68,0.1)";

  const performanceBorder = performanceBG.replace("0.1", "0.3");

  /* ---------------------------------------------------
     RETURN UI
  --------------------------------------------------- */
  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        <div className="dashboard-section">

          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "2rem",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                📊 My Quiz Result — {quiz.title}
              </h2>
              <p style={{ color: "#64748b" }}>Subject: {quiz.subject}</p>
            </div>

            <button className="btn btn-outline" onClick={() => navigate("/dashboard")}>
              ← Back
            </button>
          </div>

          {/* Performance */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))",
              gap: "1.5rem",
              marginBottom: "3rem",
            }}
          >
            <StatCard
              icon={isExcellent ? "🎉" : isGood ? "👍" : "📚"}
              value={`${percentage}%`}
              label={isExcellent ? "Excellent!" : isGood ? "Good Job!" : "Needs Improvement"}
              gradient={performanceBG}
              border={performanceBorder}
            />

            <StatCard
              icon="📈"
              value={`${result.score}/${result.total}`}
              label="Correct Answers"
              gradient="rgba(99,102,241,0.1)"
              border="rgba(99,102,241,0.3)"
            />

            <StatCard
              icon="⏱️"
              value={`${result.timeSpent} min`}
              label="Time Spent"
              gradient="rgba(139,92,246,0.1)"
              border="rgba(139,92,246,0.3)"
            />
          </div>

          {/* Review */}
          <div className="card" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>📝 Question Review</h3>

            {quiz.questions.map((q, index) => {
              const detail = result.answers.find((a) => a.questionIndex === index);
              const selected = detail?.selectedAnswer;
              const isCorrect = detail?.isCorrect;

              return (
                <div
                  key={index}
                  style={{
                    padding: "1.5rem",
                    marginBottom: "1rem",
                    borderRadius: "12px",
                    border: `2px solid ${isCorrect ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                    background: isCorrect
                      ? "rgba(16,185,129,0.05)"
                      : "rgba(239,68,68,0.05)",
                  }}
                >
                  <h4>{index + 1}. {q.question}</h4>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.75rem",
                    }}
                  >
                    {q.options.map((option, optIndex) => {
                      const isCorrectOption = optIndex === q.correctAnswer;

                      return (
                        <div
                          key={optIndex}
                          style={{
                            padding: "0.75rem 1rem",
                            borderRadius: "8px",
                            border: `2px solid ${
                              isCorrectOption
                                ? "rgba(16,185,129,0.4)"
                                : selected === optIndex
                                ? "rgba(239,68,68,0.4)"
                                : "rgba(0,0,0,0.1)"
                            }`,
                          }}
                        >
                          {option}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "2rem",
            }}
          >
            <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
              🏠 Dashboard
            </button>

            <button className="btn btn-outline" onClick={() => navigate(`/quiz/${id}`)}>
              🔄 Retake Quiz
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentResults;
