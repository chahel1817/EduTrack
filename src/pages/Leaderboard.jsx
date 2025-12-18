import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Trophy, Medal, Award, TrendingUp, Clock, ArrowLeft, Users, Target } from 'lucide-react';

const Leaderboard = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    const fetchData = async () => {
      try {
        const [leaderboardRes, quizRes] = await Promise.all([
          api.get(`/results/leaderboard/${quizId}`),
          api.get(`/quizzes/${quizId}`)
        ]);
        setLeaderboard(leaderboardRes.data || []);
        setQuiz(quizRes.data);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchData();
    }
  }, [quizId]);

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy size={24} color="#FFD700" />;
    if (rank === 2) return <Medal size={24} color="#C0C0C0" />;
    if (rank === 3) return <Medal size={24} color="#CD7F32" />;
    return <Award size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />;
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return 'linear-gradient(135deg, #FFD700, #FFA500)';
    if (rank === 2) return 'linear-gradient(135deg, #C0C0C0, #A8A8A8)';
    if (rank === 3) return 'linear-gradient(135deg, #CD7F32, #B87333)';
    return isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <div className="dashboard-section">
            <div className="loading" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
              <div>Loading leaderboard...</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        <div className="dashboard-section">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 className="section-heading" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Trophy size={32} color="#FFD700" />
                Leaderboard
              </h2>
              {quiz && (
                <p style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'var(--gray-600)', marginTop: '8px' }}>
                  {quiz.title} - {quiz.subject}
                </p>
              )}
            </div>
            <button
              className="btn btn-outline"
              onClick={() => navigate('/quizzes')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <ArrowLeft size={18} />
              Back to Quizzes
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid" style={{ marginBottom: '32px' }}>
            <div className="stat-card hover-lift" style={{
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,165,0,0.1))'
                : 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,165,0,0.05))',
            }}>
              <div className="stat-icon-wrapper">
                <Users size={28} />
              </div>
              <h3 className="stat-value">{leaderboard.length}</h3>
              <p className="stat-label">Total Participants</p>
            </div>

            {leaderboard.length > 0 && (
              <>
                <div className="stat-card hover-lift" style={{
                  background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))'
                    : 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.05))',
                }}>
                  <div className="stat-icon-wrapper">
                    <Target size={28} />
                  </div>
                  <h3 className="stat-value">{leaderboard[0].percentage}%</h3>
                  <p className="stat-label">Top Score</p>
                </div>

                <div className="stat-card hover-lift" style={{
                  background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(37,99,235,0.1))'
                    : 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(37,99,235,0.05))',
                }}>
                  <div className="stat-icon-wrapper">
                    <TrendingUp size={28} />
                  </div>
                  <h3 className="stat-value">
                    {Math.round(leaderboard.reduce((sum, l) => sum + parseFloat(l.percentage), 0) / leaderboard.length)}%
                  </h3>
                  <p className="stat-label">Average Score</p>
                </div>
              </>
            )}
          </div>

          {/* Leaderboard Table */}
          {leaderboard.length === 0 ? (
            <div className="empty-state enhanced">
              <Trophy size={64} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
              <h3>No Submissions Yet</h3>
              <p>Be the first to take this quiz and claim the top spot!</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/quiz/${quizId}`)}
                style={{ marginTop: '20px' }}
              >
                Take Quiz
              </button>
            </div>
          ) : (
            <div className="card" style={{
              background: isDarkMode ? '#000000' : 'var(--card-bg)',
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'var(--border-gray)'
            }}>
              <div style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{
                      borderBottom: isDarkMode ? '2px solid rgba(255, 255, 255, 0.1)' : '2px solid var(--border-gray)',
                      background: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'var(--gray-50)'
                    }}>
                      <th style={{ padding: '20px', textAlign: 'center', width: '100px' }}>Rank</th>
                      <th style={{ padding: '20px', textAlign: 'left' }}>Student</th>
                      <th style={{ padding: '20px', textAlign: 'center' }}>Score</th>
                      <th style={{ padding: '20px', textAlign: 'center' }}>Percentage</th>
                      <th style={{ padding: '20px', textAlign: 'center' }}>
                        <Clock size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr
                        key={index}
                        style={{
                          borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid var(--gray-200)',
                          background: entry.rank <= 3
                            ? isDarkMode
                              ? 'rgba(255, 255, 255, 0.03)'
                              : 'rgba(0, 0, 0, 0.02)'
                            : 'transparent',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = entry.rank <= 3
                            ? isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'
                            : 'transparent';
                        }}
                      >
                        <td style={{ padding: '20px', textAlign: 'center' }}>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            background: getRankBadge(entry.rank),
                            border: entry.rank <= 3 ? '2px solid rgba(255, 255, 255, 0.3)' : 'none',
                            boxShadow: entry.rank <= 3 ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'
                          }}>
                            {getRankIcon(entry.rank)}
                          </div>
                        </td>
                        <td style={{ padding: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, var(--blue), var(--purple))',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '16px'
                            }}>
                              {entry.studentName?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <div style={{
                                fontWeight: 600,
                                fontSize: '16px',
                                color: isDarkMode ? '#ffffff' : 'var(--black)'
                              }}>
                                {entry.studentName || 'Unknown'}
                              </div>
                              <div style={{
                                fontSize: '13px',
                                color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'var(--gray-600)'
                              }}>
                                Rank #{entry.rank}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '20px', textAlign: 'center' }}>
                          <span style={{
                            padding: '6px 16px',
                            borderRadius: '12px',
                            background: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
                            color: isDarkMode ? 'var(--blue)' : 'var(--primary)',
                            fontWeight: 700,
                            fontSize: '15px'
                          }}>
                            {entry.score}/{entry.total}
                          </span>
                        </td>
                        <td style={{ padding: '20px', textAlign: 'center' }}>
                          <div style={{
                            display: 'inline-flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <span style={{
                              fontWeight: 700,
                              fontSize: '20px',
                              color: entry.percentage >= 80
                                ? 'var(--accent-dark)'
                                : entry.percentage >= 60
                                ? 'var(--warning-dark)'
                                : 'var(--error-dark)'
                            }}>
                              {entry.percentage}%
                            </span>
                            <div style={{
                              width: '60px',
                              height: '4px',
                              background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'var(--gray-200)',
                              borderRadius: '2px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${entry.percentage}%`,
                                height: '100%',
                                background: entry.percentage >= 80
                                  ? 'var(--accent)'
                                  : entry.percentage >= 60
                                  ? 'var(--warning)'
                                  : 'var(--error)',
                                borderRadius: '2px'
                              }}></div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '20px', textAlign: 'center' }}>
                          <span style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)',
                            color: 'var(--warning-dark)',
                            fontWeight: 600,
                            fontSize: '14px'
                          }}>
                            {entry.timeSpent} min
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Leaderboard;
