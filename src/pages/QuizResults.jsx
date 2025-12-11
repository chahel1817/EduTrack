import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  Users, 
  TrendingUp, 
  Target, 
  Trophy, 
  ArrowLeft, 
  Download, 
  Loader2,
  AlertCircle,
  FileText,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from "lucide-react";

/**
 * QuizResults.jsx
 * Polished "A-style" results page (consistent with Dashboard/CreateQuiz theme)
 *
 * - Fetches quiz and quiz results in parallel
 * - Shows stat cards, enhanced table, empty / error / loading states
 * - Reusable StatCard and EmptyState components matching global CSS
 */

const StatCard = ({ icon: Icon, value, label, gradient, border, progress, progressColor, isDarkMode }) => (
  <div
    className="stat-card hover-lift"
    style={{
      background: isDarkMode
        ? `linear-gradient(135deg, ${gradient.replace('0.06', '0.15').replace('0.1', '0.2')})`
        : `linear-gradient(135deg, ${gradient})`,
      border: `1px solid ${border}`,
      borderRadius: 16,
      padding: "1.6rem",
      textAlign: "center",
      transition: "transform 0.25s ease",
    }}
  >
    <div className="stat-icon-wrapper" style={{ marginBottom: 12 }}>
      <Icon size={32} />
    </div>
    <div style={{ fontSize: "1.9rem", fontWeight: 700, color: isDarkMode ? '#ffffff' : 'var(--black)' }}>{value}</div>
    <div style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : "var(--gray-600)", marginTop: 6, fontSize: 13 }}>{label}</div>

    {typeof progress === "number" && (
      <div style={{ marginTop: 12 }}>
        <div style={{ height: 6, background: "rgba(0,0,0,0.06)", borderRadius: 6, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${Math.max(0, Math.min(100, progress))}%`,
              background: progressColor || "linear-gradient(90deg, var(--primary), var(--secondary))",
              transition: "width 0.8s ease",
            }}
          />
        </div>
      </div>
    )}
  </div>
);

const EmptyState = ({ icon: Icon, title, message, ctaText, ctaOnClick, isDarkMode }) => (
  <div className="dashboard-section" style={{ textAlign: "center" }}>
    <div className="empty-state enhanced" style={{ padding: "3rem 2rem" }}>
      <div
        className="empty-icon"
        style={{
          marginBottom: "1rem",
          animation: "float 3s ease-in-out infinite",
          display: "flex",
          justifyContent: "center"
        }}
      >
        {Icon && <Icon size={64} color={isDarkMode ? 'var(--blue)' : 'var(--primary)'} />}
      </div>

      <h3 style={{ marginBottom: "0.75rem", fontSize: 22, fontWeight: 700 }}>
        <span className="section-heading" style={{ background: "linear-gradient(135deg,var(--blue),var(--purple))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          {title}
        </span>
      </h3>

      <p style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : "var(--gray-600)", marginBottom: "1.25rem", lineHeight: 1.6, maxWidth: 640, margin: "0 auto 1.25rem" }}>
        {message}
      </p>

      {ctaText && (
        <button className="btn btn-primary empty-cta" onClick={ctaOnClick} style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
          {ctaText}
        </button>
      )}
    </div>
  </div>
);

const QuizResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains("dark"));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!id) return;

    let mounted = true;
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [quizRes, resultsRes] = await Promise.all([
          api.get(`/quiz/${id}`, { signal: controller.signal }),
          api.get(`/results/quiz/${id}`, { signal: controller.signal }),
        ]);

        if (!mounted) return;
        setQuiz(quizRes.data || null);
        setResults(Array.isArray(resultsRes.data) ? resultsRes.data : []);
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") return;
        console.error("QuizResults fetch error:", err);
        if (mounted) setError("Unable to load quiz or results. Please try again later.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [id]);

  // Loading state: center loader card consistent with other pages
  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <div className="dashboard-section">
            <div className="loading" style={{ textAlign: 'center', padding: '3rem' }}>
              <Loader2 size={48} className="loading-spinner" style={{ 
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem',
                color: 'var(--blue)'
              }} />
              <div>Loading quiz results...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <EmptyState
            icon={AlertCircle}
            title="Error Loading Results"
            message={error}
            ctaText="Back to Dashboard"
            ctaOnClick={() => navigate("/dashboard")}
            isDarkMode={isDarkMode}
          />
        </main>
      </div>
    );
  }

  // Missing quiz
  if (!quiz) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <EmptyState
            icon={FileText}
            title="Quiz Not Found"
            message="The quiz you're looking for doesn't exist or may have been removed."
            ctaText="Back to Dashboard"
            ctaOnClick={() => navigate("/dashboard")}
            isDarkMode={isDarkMode}
          />
        </main>
      </div>
    );
  }

  // Stats calculations
  const totalSubmissions = results.length;
  const averageScore = totalSubmissions > 0 ? (results.reduce((s, r) => s + (r.score || 0), 0) / totalSubmissions).toFixed(1) : 0;
  const averagePercentage = totalSubmissions > 0 ? (results.reduce((s, r) => s + (r.percentage || 0), 0) / totalSubmissions).toFixed(1) : 0;
  const highestScore = totalSubmissions > 0 ? Math.max(...results.map((r) => r.percentage || 0)) : 0;
  const lowestScore = totalSubmissions > 0 ? Math.min(...results.map((r) => r.percentage || 0)) : 0;

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        <div className="dashboard-section">
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <div style={{ minWidth: 240 }}>
              <h2 className="section-heading" style={{ margin: 0, fontSize: 24, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BarChart3 size={28} />
                Quiz Results: {quiz.title}
              </h2>
              <p style={{ margin: "8px 0 0", color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : "var(--gray-600)" }}>
                Subject: {quiz.subject}
              </p>
              <p style={{ margin: "6px 0 0", color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : "var(--gray-600)", fontSize: 13 }}>
                Total Questions: {quiz.questions?.length || 0}
              </p>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: "auto", flexWrap: "wrap" }}>
              <button className="btn btn-outline" onClick={() => navigate("/dashboard")} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowLeft size={18} />
                Back to Dashboard
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (results.length === 0) return;
                  const header = ["Student Name", "Email", "Score", "Total", "Percentage", "TimeSpent(min)", "SubmittedAt"];
                  const rows = results.map((r) => [
                    `"${(r.student?.name || "").replace(/"/g, '""')}"`,
                    (r.student?.email || ""),
                    r.score ?? "",
                    r.total ?? "",
                    r.percentage ?? "",
                    r.timeSpent ?? "",
                    new Date(r.submittedAt).toLocaleString()
                  ]);
                  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${quiz.title.replace(/\s+/g, "_")}_results.csv`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                }}
                disabled={results.length === 0}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Download size={18} />
                Export CSV
              </button>
            </div>
          </div>

          {/* Stat cards */}
          {totalSubmissions > 0 && (
            <div className="stats-grid" style={{ marginBottom: 24 }}>
              <StatCard
                icon={Users}
                value={totalSubmissions}
                label="Total Submissions"
                gradient="rgba(99,102,241,0.06)"
                border="rgba(99,102,241,0.15)"
                progress={Math.min(100, (totalSubmissions / Math.max(1, 30)) * 100)}
                progressColor="linear-gradient(90deg,var(--blue),var(--purple))"
                isDarkMode={isDarkMode}
              />

              <StatCard
                icon={TrendingUp}
                value={`${averageScore}/${quiz.questions?.length || "0"}`}
                label="Average Score"
                gradient="rgba(16,185,129,0.06)"
                border="rgba(16,185,129,0.15)"
                progress={((averageScore / (quiz.questions?.length || 1)) * 100) || 0}
                progressColor="linear-gradient(90deg,var(--accent),var(--accent-light))"
                isDarkMode={isDarkMode}
              />

              <StatCard
                icon={Target}
                value={`${averagePercentage}%`}
                label="Average Percentage"
                gradient="rgba(245,158,11,0.06)"
                border="rgba(245,158,11,0.15)"
                progress={Number(averagePercentage) || 0}
                progressColor={Number(averagePercentage) >= 80 ? "var(--accent)" : Number(averagePercentage) >= 60 ? "var(--warning)" : "var(--error)"}
                isDarkMode={isDarkMode}
              />

              <StatCard
                icon={Trophy}
                value={`${highestScore}% / ${lowestScore}%`}
                label="Highest / Lowest"
                gradient="rgba(139,92,246,0.06)"
                border="rgba(139,92,246,0.15)"
                progress={highestScore}
                progressColor="linear-gradient(90deg,var(--purple),var(--blue))"
                isDarkMode={isDarkMode}
              />
            </div>
          )}

          {/* Results table */}
          <div className="enhanced-table-wrapper">
            <table className="enhanced-table">
              <thead>
                <tr>
                  <th><User size={18} style={{ verticalAlign: 'middle' }} /></th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>%</th>
                  <th><Clock size={18} style={{ verticalAlign: 'middle' }} /> Time</th>
                  <th>Submitted At</th>
                </tr>
              </thead>

              <tbody>
                {results.map((r, idx) => {
                  const perc = r.percentage ?? Math.round(((r.score ?? 0) / Math.max(1, r.total ?? 1)) * 100);
                  return (
                    <tr key={r._id || idx} className={idx % 2 === 0 ? "even-row" : "odd-row"}>
                      <td>
                        <div style={{
                          width: 40, height: 40, borderRadius: "50%",
                          background: "linear-gradient(135deg,var(--primary),var(--secondary))",
                          color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700
                        }}>
                          {r.student?.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                      </td>

                      <td style={{ fontWeight: 600 }}>{r.student?.name || "Unknown Student"}</td>
                      <td style={{ color: "var(--gray-600)" }}>{r.student?.email || "N/A"}</td>

                      <td>
                        <span style={{
                          padding: "6px 12px",
                          borderRadius: 999,
                          fontWeight: 700,
                          background: isDarkMode
                            ? (perc >= 80 ? "rgba(16,185,129,0.15)" : perc >= 60 ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)")
                            : (perc >= 80 ? "rgba(16,185,129,0.08)" : perc >= 60 ? "rgba(245,158,11,0.08)" : "rgba(239,68,68,0.06)"),
                          color: perc >= 80 ? "var(--accent-dark)" : perc >= 60 ? "var(--warning-dark)" : "var(--error-dark)",
                          border: `1px solid ${perc >= 80 ? "rgba(16,185,129,0.2)" : perc >= 60 ? "rgba(245,158,11,0.2)" : "rgba(239,68,68,0.15)"}`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          {perc >= 80 ? <CheckCircle2 size={14} /> : perc >= 60 ? <AlertTriangle size={14} /> : <XCircle size={14} />}
                          {perc >= 80 ? "Excellent" : perc >= 60 ? "Good" : "Needs Improvement"}
                        </span>
                      </td>

                      <td style={{ fontWeight: 700, color: isDarkMode ? '#ffffff' : 'var(--black)' }}>{r.score}/{r.total}</td>
                      <td style={{ fontWeight: 700, color: isDarkMode ? '#ffffff' : 'var(--black)' }}>{perc}%</td>

                      <td>
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: 12,
                          background: isDarkMode ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.06)",
                          fontWeight: 600,
                          color: isDarkMode ? "var(--blue)" : "var(--primary)",
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Clock size={14} />
                          {r.timeSpent ?? 0} min
                        </span>
                      </td>

                      <td style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : "var(--gray-600)" }}>{new Date(r.submittedAt).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty fallback if there are no results */}
          {results.length === 0 && (
            <div style={{ marginTop: 18 }}>
              <EmptyState
                icon={FileText}
                title="No Results Yet"
                message="Students haven't submitted this quiz yet. Check back later or share the quiz link with students."
                ctaText="Back to Dashboard"
                ctaOnClick={() => navigate("/dashboard")}
                isDarkMode={isDarkMode}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuizResults;
