import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BarChart3, BookOpen, Users, TrendingUp, ArrowRight, Activity } from "lucide-react";

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
        // 1️⃣ fetch quizzes
        const quizzesRes = await api.get("/quizzes");

        const myQuizzes = (quizzesRes.data || []).filter(
          (q) =>
            String(q.createdBy?._id || q.createdBy) === String(user.id)
        );


        setQuizzes(myQuizzes);

        // 2️⃣ fetch results (THIS WAS MISSING ❌)
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

  // Calculate stats for each quiz
  const getQuizStats = (quizId) => {
    const quizResults = results.filter(
      (r) => String(r.quiz?._id || r.quiz) === String(quizId)
    );

    const totalSubmissions = quizResults.length;

    const averageScore =
      totalSubmissions > 0
        ? (
          quizResults.reduce((sum, r) => sum + (r.score || 0), 0) /
          totalSubmissions
        ).toFixed(1)
        : 0;

    const averagePercentage =
      totalSubmissions > 0
        ? (
          quizResults.reduce((sum, r) => sum + (r.percentage || 0), 0) /
          totalSubmissions
        ).toFixed(1)
        : 0;

    return { totalSubmissions, averageScore, averagePercentage };
  };


  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <div className="dashboard-section">
            <div className="loading">Loading quiz results...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        <div className="dashboard-section">
          {/* HEADER */}
          <section className="dashboard-section hero-pro" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '40px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div className="header-icon" style={{ background: 'rgba(255,255,255,0.2)', width: '64px', height: '64px' }}>
                <Activity size={36} color="white" />
              </div>
              <div>
                <h1 className="hero-pro-title" style={{ margin: 0, fontSize: '32px' }}>Student Performance</h1>
                <p className="hero-pro-sub" style={{ margin: 0, opacity: 0.9 }}>
                  Analyze results and track progress across all your quizzes
                </p>
              </div>
            </div>
            <BarChart3 size={100} style={{ opacity: 0.15, color: 'white' }} />
          </section>

          {quizzes.length === 0 ? (
            <div className="empty-state enhanced">
              <BookOpen size={50} color="var(--primary)" />
              <h3>No Quizzes Created Yet</h3>
              <p>Create your first quiz to start tracking student results.</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/create-quiz")}
                style={{ marginTop: "20px" }}
              >
                Create Quiz
              </button>
            </div>
          ) : (
            <div className="quizzes-grid-dashboard">
              {quizzes.map((quiz) => {
                const stats = getQuizStats(quiz._id);
                return (
                  <div key={quiz._id} className="quiz-card-dashboard hover-lift">
                    <div className="quiz-card-header">
                      <div className="quiz-card-subject">{quiz.subject}</div>
                      <div className="quiz-card-date">
                        {new Date(quiz.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="quiz-card-content">
                      <h3 className="quiz-card-title">{quiz.title}</h3>
                      <p className="quiz-card-description">
                        {quiz.description || "View detailed results for this quiz."}
                      </p>
                      <div className="quiz-card-stats">
                        <div className="quiz-stat-item">
                          <BookOpen size={16} />
                          <span>{quiz.questions?.length || 0} questions</span>
                        </div>
                        <div className="quiz-stat-item">
                          <Users size={14} />
                          <span>{stats.totalSubmissions} submissions</span>
                        </div>
                        {stats.averagePercentage > 0 && (
                          <div className="quiz-stat-item">
                            <TrendingUp size={14} />
                            <span>Avg: {stats.averagePercentage}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="quiz-card-actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/results/${quiz._id}`)}
                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                      >
                        View Results
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuizResultsList;

