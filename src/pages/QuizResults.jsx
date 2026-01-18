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

          {/* HEADER */}
          <section className="dashboard-section hero-pro" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '40px', marginBottom: '40px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div className="header-icon" style={{ background: 'rgba(255,255,255,0.2)', width: '64px', height: '64px' }}>
                <BarChart3 size={36} color="white" />
              </div>
              <div>
                <h1 className="hero-pro-title" style={{ margin: 0, fontSize: '32px' }}>{quiz.title}</h1>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>{quiz.subject}</span>
                  <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>{quiz.questions?.length || 0} Questions</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button className="btn" style={{ background: 'white', color: 'var(--primary)', fontWeight: 700, borderRadius: '12px' }} onClick={handleExportCSV}>
                <Download size={18} /> Export Results
              </button>
              <button className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 700, borderRadius: '12px' }} onClick={() => navigate("/results")}>
                <ArrowLeft size={18} /> Back
              </button>
            </div>
          </section>

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
