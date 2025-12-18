import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  Users, TrendingUp, Target, Trophy, ArrowLeft, Download,
  Loader2, AlertCircle, FileText, User, Clock,
  CheckCircle2, XCircle, AlertTriangle, BarChart3
} from "lucide-react";

/* ---------------- STAT CARD ---------------- */
const StatCard = ({ icon: Icon, value, label, gradient, border, progress, progressColor, isDarkMode }) => {
  const progressBarBg = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)";
  return (
    <div
      className="stat-card hover-lift"
      style={{
        background: isDarkMode
          ? `linear-gradient(135deg, ${gradient.replace("0.06", "0.15")})`
          : `linear-gradient(135deg, ${gradient})`,
        border: `1px solid ${border}`,
        borderRadius: 16,
        padding: "1.6rem",
        textAlign: "center",
      }}
    >
      <Icon size={32} />
      <div style={{ fontSize: "1.9rem", fontWeight: 700, color: isDarkMode ? "#fff" : "var(--black)" }}>{value}</div>
      <div style={{ color: isDarkMode ? "rgba(255,255,255,0.7)" : "var(--gray-600)" }}>{label}</div>

      {typeof progress === "number" && (
        <div style={{ marginTop: 12 }}>
          <div style={{ height: 6, background: progressBarBg, borderRadius: 6 }}>
            <div style={{
              height: "100%",
              width: `${Math.min(100, progress)}%`,
              background: progressColor,
              borderRadius: 6
            }} />
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------- MAIN PAGE ---------------- */
const QuizResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleExportCSV = () => {
  if (!results || results.length === 0) {
    alert("No results to export");
    return;
  }

  const headers = [
    "Name",
    "Email",
    "Score",
    "Percentage",
    "Time Spent (min)",
    "Submitted At",
  ];

  const rows = results.map(r => [
    r.student?.name || "",
    r.student?.email || "",
    `${r.score}/${r.total}`,
    `${r.percentage}%`,
    r.timeSpent,
    new Date(r.submittedAt).toLocaleString(),
  ]);

  const csvContent =
    [headers, ...rows]
      .map(row => row.map(value => `"${value}"`).join(","))
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${quiz?.title || "quiz"}-results.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};


  useEffect(() => {
    setIsDarkMode(document.body.classList.contains("dark"));
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [quizRes, resultsRes] = await Promise.all([
          api.get(`/quizzes/${id}`),
          api.get(`/results/${id}`),
        ]);
        setQuiz(quizRes.data);
        setResults(resultsRes.data || []);
      } catch (err) {
        setError("Error loading results");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <Loader2 className="loading-spinner" size={48} />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <AlertCircle size={48} />
          <p>{error}</p>
        </main>
      </div>
    );
  }

  const totalSubmissions = results.length;
  const avgScore = totalSubmissions
    ? (results.reduce((s, r) => s + r.score, 0) / totalSubmissions).toFixed(1)
    : 0;

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        <div className="dashboard-section">

          {/* ✅ HEADER FIXED */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 24,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <h2 className="section-heading" style={{ display: "flex", gap: 12 }}>
                <BarChart3 /> Quiz Results: {quiz.title}
              </h2>
              <p style={{ color: isDarkMode ? "rgba(255,255,255,0.7)" : "var(--gray-600)" }}>
                Subject: {quiz.subject}
              </p>
              <p style={{ fontSize: 13, color: isDarkMode ? "rgba(255,255,255,0.6)" : "var(--gray-600)" }}>
                Total Questions: {quiz.questions?.length || 0}
              </p>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-outline" onClick={() => navigate("/dashboard")}>
                <ArrowLeft size={16} /> Back
              </button>
              <button className="btn btn-primary" onClick={handleExportCSV}>
  Export CSV
</button>
            </div>
          </div>

          {/* TABLE */}
          <table className="enhanced-table">
            <thead>
              <tr>
                <th></th><th>Name</th><th>Email</th><th>Status</th>
                <th>Score</th><th>%</th><th>Time</th><th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => {
                const perc = r.percentage;
                return (
                  <tr key={r._id}>
                    <td><User /></td>

                    {/* ✅ DARK MODE FIX */}
                    <td style={{ color: isDarkMode ? "#fff" : "var(--black)" }}>{r.student.name}</td>
                    <td style={{ color: isDarkMode ? "rgba(255,255,255,0.7)" : "var(--gray-600)" }}>{r.student.email}</td>

                    <td>
                      {perc >= 80 ? "Excellent" : perc >= 60 ? "Good" : "Needs Improvement"}
                    </td>

                    <td style={{ color: isDarkMode ? "#fff" : "var(--black)" }}>{r.score}/{r.total}</td>
                    <td style={{ color: isDarkMode ? "#fff" : "var(--black)" }}>{perc}%</td>

                    <td>{r.timeSpent} min</td>

                    <td style={{ color: isDarkMode ? "rgba(255,255,255,0.7)" : "var(--gray-600)" }}>
                      {new Date(r.submittedAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuizResults;
