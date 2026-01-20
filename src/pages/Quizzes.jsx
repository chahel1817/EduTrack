import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Search,
  BookOpen,
  Clock,
  Play,
  Filter,
  FileText,
  Check,
} from "lucide-react";

const Quizzes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [subjects, setSubjects] = useState([]);

  /* --------------------------------------------------
     ROLE GUARD — TEACHERS NOT ALLOWED HERE
  -------------------------------------------------- */
  useEffect(() => {
    if (!user) return;

    if (user.role === "teacher") {
      navigate("/dashboard");
      return;
    }

    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [quizzesRes, resultsRes] = await Promise.all([
        api.get("/quizzes"),
        api.get("/results/student")
      ]);

      const quizzesData = quizzesRes.data || [];
      setQuizzes(quizzesData);
      setResults(resultsRes.data || []);

      const uniqueSubjects = [...new Set(quizzesData.map((q) => q.subject))];
      setSubjects(uniqueSubjects);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------------
     FILTER LOGIC
  -------------------------------------------------- */
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject =
      !filterSubject || quiz.subject === filterSubject;

    return matchesSearch && matchesSubject;
  });

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  /* --------------------------------------------------
     LOADING STATE
  -------------------------------------------------- */
  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <div className="loading">Loading quizzes...</div>
        </main>
        <Footer />
      </div>
    );
  }

  /* --------------------------------------------------
     UI
  -------------------------------------------------- */
  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        <div className="dashboard-section">
          {/* HEADER */}
          <section className="dashboard-section hero-pro" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div className="header-icon" style={{ background: 'rgba(255,255,255,0.2)', width: '64px', height: '64px' }}>
                <BookOpen size={36} color="white" />
              </div>
              <div>
                <h1 className="hero-pro-title" style={{ margin: 0, fontSize: '32px' }}>Available Quizzes</h1>
                <p className="hero-pro-sub" style={{ margin: 0, opacity: 0.9 }}>
                  Browse and take quizzes to test your knowledge
                </p>
              </div>
            </div>
            <Search size={100} style={{ opacity: 0.15, color: 'white' }} />
          </section>

          {/* SEARCH & FILTER */}
          <div className="filters-section">
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-dropdown">
              <Filter size={20} />
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="filter-select"
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* QUIZZES GRID */}
          {filteredQuizzes.length === 0 ? (
            <div className="empty-state enhanced">
              <div className="empty-icon">📚</div>
              <h3>No quizzes found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="quizzes-grid">
              {filteredQuizzes.map((quiz) => {
                const hasTaken = results.some(r => String(r.quiz?._id || r.quiz) === String(quiz._id));
                return (
                  <div key={quiz._id} className="quiz-card" style={{ opacity: (hasTaken) ? 0.8 : 1, position: 'relative', overflow: 'hidden' }}>
                    {hasTaken && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '-35px',
                        background: 'var(--success)',
                        color: 'white',
                        padding: '4px 40px',
                        fontSize: '10px',
                        fontWeight: 900,
                        transform: 'rotate(45deg)',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        zIndex: 1
                      }}>
                        COMPLETED
                      </div>
                    )}
                    <div className="quiz-header">
                      <div className="quiz-subject">{quiz.subject}</div>
                      <div className="quiz-date">
                        {formatDate(quiz.createdAt)}
                      </div>
                    </div>

                    <div className="quiz-content">
                      <h3 className="quiz-title">{quiz.title}</h3>
                      <p className="quiz-description">
                        {quiz.description ||
                          "Test your knowledge with this interactive quiz."}
                      </p>

                      <div className="quiz-stats">
                        <div className="stat-item" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                          <Clock size={16} />
                          <span>{quiz.timeLimit || 30} mins</span>
                        </div>
                        <div className="stat-item" style={{ background: 'var(--gray-100)', padding: '4px 10px', borderRadius: '8px', fontSize: '12px' }}>
                          <FileText size={14} />
                          <span>{quiz.questionsCount || quiz.questions?.length || 0} Questions</span>
                        </div>
                      </div>
                    </div>

                    {/* ✅ STUDENTS ONLY */}
                    {user.role === "student" && (
                      <div className="quiz-actions" style={{ padding: '0 20px 20px 20px' }}>
                        <button
                          onClick={() => {
                            if (hasTaken && !quiz.allowMultipleAttempts) {
                              navigate('/my-results');
                            } else {
                              navigate(`/quiz/${quiz._id}`);
                            }
                          }}
                          className={`btn ${(hasTaken && !quiz.allowMultipleAttempts) ? 'btn-outline' : 'btn-primary'} quiz-btn`}
                          style={{ width: '100%', borderRadius: '12px', padding: '12px' }}
                        >
                          {hasTaken ? (
                            quiz.allowMultipleAttempts ? (
                              <>
                                <Play size={16} /> Retake Quiz
                              </>
                            ) : (
                              <>
                                <Check size={16} /> View Result
                              </>
                            )
                          ) : (
                            <>
                              <Play size={16} /> Start Challenge
                            </>
                          )}
                        </button>
                      </div>
                    )}
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

export default Quizzes;
