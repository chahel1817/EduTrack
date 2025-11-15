import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (user?.role === 'student') {
          await Promise.all([fetchQuizzes(), fetchResults()]);
        } else if (user?.role === 'teacher') {
          await Promise.all([fetchQuizzes(), fetchAllResults()]);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) loadData();
  }, [user]);

  const fetchQuizzes = async () => {
    try {
      const res = await api.get('/quiz');
      setQuizzes(res.data || []);
    } catch (err) {
      console.error('Failed to fetch quizzes:', err);
      setQuizzes([]);
    }
  };

  const fetchResults = async () => {
    try {
      const res = await api.get('/results/student');
      setResults(res.data || []);
    } catch (err) {
      console.error('Failed to fetch results:', err);
      setResults([]);
    }
  };

  const fetchAllResults = async () => {
    try {
      const res = await api.get('/results/all');
      setResults(res.data || []);
    } catch (err) {
      console.error('Failed to fetch results:', err);
      setResults([]);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div className="loading">Loading your dashboard...</div>;

  const getAverageScore = () => results.length ? Math.round(results.reduce((sum, result) => sum + (result.score / result.total) * 100, 0) / results.length) : 0;
  const getTotalQuizzes = () => quizzes.length;
  const getCompletedQuizzes = () => results.length;

  return (
    <div className="dashboard-container">
      <Navbar />
      
      {/* Main Content */}
      <main className="dashboard-main">
        {/* Welcome Message for New Users */}
        {quizzes.length === 0 && results.length === 0 && (
          <section className="dashboard-section welcome-section">
            <div style={{ textAlign: 'center', padding: '3rem 2rem', position: 'relative' }}>
              <div className="welcome-icon" style={{
                fontSize: '6rem',
                marginBottom: '1.5rem',
                animation: 'bounce 2s infinite',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
              }}>
                {user?.role === 'teacher' ? '👨‍🏫' : '🎓'}
              </div>
              <h2 style={{
                marginBottom: '1rem',
                animation: 'fadeInUp 0.8s ease-out',
                textAlign: 'center',
                width: '100%',
                fontSize: '36px',
                fontWeight: '700',
                color: 'var(--black)',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.5px'
              }}>
                Welcome to EduTrack, {user?.name}!
              </h2>
              <p style={{
                fontSize: '18px',
                color: '#64748b',
                marginBottom: '2rem',
                maxWidth: '600px',
                margin: '0 auto 2rem auto',
                lineHeight: '1.6',
                animation: 'fadeInUp 1s ease-out'
              }}>
                {user?.role === 'teacher'
                  ? 'You\'re all set to start creating engaging quizzes for your students. Build your first quiz to begin your teaching journey with EduTrack!'
                  : 'You\'re ready to start learning! Your teachers will create quizzes for you to take. Check back regularly for new assignments and track your progress.'
                }
              </p>
              {user?.role === 'teacher' && (
                <button
                  className="btn btn-primary welcome-cta"
                  onClick={() => navigate('/create-quiz')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    margin: '0 auto',
                    padding: '16px 32px',
                    fontSize: '16px',
                    animation: 'fadeInUp 1.2s ease-out',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <span className="cta-icon">🚀</span>
                  <span>Create Your First Quiz</span>
                  <div className="cta-glow"></div>
                </button>
              )}
              <div className="welcome-features" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                marginTop: '3rem',
                animation: 'fadeInUp 1.4s ease-out'
              }}>
                {[
                  { icon: '📊', title: 'Track Progress', desc: 'Monitor student performance and quiz results' },
                  { icon: '🎯', title: 'Interactive Quizzes', desc: 'Create engaging quizzes with multiple question types' },
                  { icon: '📈', title: 'Analytics', desc: 'Detailed insights and performance analytics' }
                ].map((feature, i) => (
                  <div key={i} className="feature-card" style={{
                    background: `linear-gradient(135deg, ${i === 0 ? 'rgba(99,102,241,0.1), rgba(236,72,153,0.1)' : i === 1 ? 'rgba(16,185,129,0.1), rgba(245,158,11,0.1)' : 'rgba(139,92,246,0.1), rgba(99,102,241,0.1)'})`,
                    padding: '1.5rem',
                    borderRadius: '16px',
                    border: `1px solid ${i === 0 ? 'rgba(99,102,241,0.2)' : i === 1 ? 'rgba(16,185,129,0.2)' : 'rgba(139,92,246,0.2)'}`,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{feature.icon}</div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--black)' }}>{feature.title}</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Statistics Cards - Only show if there's data */}
        {(quizzes.length > 0 || results.length > 0) && (
          <section className="dashboard-section">
            <h2>📊 Overview</h2>
            <div className="stats-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {[
                {
                  icon: '📚',
                  value: getTotalQuizzes(),
                  label: user?.role === 'teacher' ? 'Total Quizzes Created' : 'Available Quizzes',
                  bg: 'rgba(99,102,241,0.1), rgba(236,72,153,0.1)',
                  border: 'rgba(99,102,241,0.2)',
                  progress: Math.min((getTotalQuizzes() / 10) * 100, 100)
                },
                {
                  icon: '✅',
                  value: getCompletedQuizzes(),
                  label: user?.role === 'teacher' ? 'Total Submissions' : 'Quizzes Completed',
                  bg: 'rgba(16,185,129,0.1), rgba(245,158,11,0.1)',
                  border: 'rgba(16,185,129,0.2)',
                  progress: Math.min((getCompletedQuizzes() / getTotalQuizzes()) * 100 || 0, 100)
                },
                ...(user?.role === 'student' && results.length > 0 ? [{
                  icon: '🎯',
                  value: `${getAverageScore()}%`,
                  label: 'Average Score',
                  bg: 'rgba(245,158,11,0.1), rgba(239,68,68,0.1)',
                  border: 'rgba(245,158,11,0.2)',
                  progress: getAverageScore(),
                  color: getAverageScore() >= 80 ? 'var(--accent)' : getAverageScore() >= 60 ? 'var(--warning)' : 'var(--error)'
                }] : [])
              ].map((stat, i) => (
                <div key={i} className="stat-card" style={{
                  background: `linear-gradient(135deg, ${stat.bg})`,
                  borderRadius: '16px',
                  padding: '2rem',
                  textAlign: 'center',
                  border: `1px solid ${stat.border}`,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div className="stat-icon" style={{
                    fontSize: '3rem',
                    marginBottom: '1rem',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}>{stat.icon}</div>
                  <h3 style={{
                    margin: '0 0 0.5rem 0',
                    color: 'var(--black)',
                    fontSize: '2.5rem',
                    fontWeight: '700'
                  }}>{stat.value}</h3>
                  <p style={{
                    margin: 0,
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>{stat.label}</p>
                  <div className="stat-progress" style={{
                    marginTop: '1rem',
                    height: '4px',
                    background: `${stat.border}`,
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      background: stat.color || 'linear-gradient(90deg, var(--primary), var(--secondary))',
                      width: `${stat.progress}%`,
                      transition: 'width 1s ease-out'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quizzes Table */}
        <section className="dashboard-section">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h2 style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: 0
            }}>
              <span style={{
                fontSize: '1.5rem',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {user?.role === 'teacher' ? '📝' : '📚'}
              </span>
              {user?.role === 'teacher' ? 'My Quizzes' : 'Available Quizzes'}
            </h2>
            {user?.role === 'teacher' && (
              <button
                className="btn btn-secondary create-quiz-btn"
                onClick={() => navigate('/create-quiz')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <span className="btn-icon">➕</span>
                <span>Create New Quiz</span>
                <div className="btn-glow"></div>
              </button>
            )}
          </div>
          <div className="table-container">
            {quizzes.length === 0 ? (
              <div className="empty-state enhanced">
                <div className="empty-icon" style={{
                  fontSize: '5rem',
                  marginBottom: '1.5rem',
                  animation: 'float 3s ease-in-out infinite',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }}>
                  {user?.role === 'teacher' ? '📝' : '📚'}
                </div>
                <h3 style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '1rem'
                }}>
                  {user?.role === 'teacher' ? 'No Quizzes Created Yet' : 'No Quizzes Available'}
                </h3>
                <p style={{
                  marginBottom: '2rem',
                  maxWidth: '500px',
                  margin: '0 auto 2rem auto',
                  lineHeight: '1.6'
                }}>
                  {user?.role === 'teacher'
                    ? 'Start creating engaging quizzes for your students. Click the button above to create your first quiz and begin your teaching journey!'
                    : 'No quizzes have been created by your teachers yet. Check back later for new assignments and tests.'
                  }
                </p>
                {user?.role === 'teacher' && (
                  <button
                    className="btn btn-primary empty-cta"
                    onClick={() => navigate('/create-quiz')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      margin: '0 auto',
                      animation: 'pulse 2s infinite'
                    }}
                  >
                    <span className="cta-icon">🚀</span>
                    <span>Create Your First Quiz</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="enhanced-table-wrapper">
                <table className="enhanced-table">
                  <thead>
                    <tr>
                      {[
                        { icon: '📄', label: 'Title' },
                        { icon: '🏷️', label: 'Subject' },
                        { icon: '❓', label: 'Questions' },
                        { icon: '👤', label: 'Created By' },
                        { icon: '📅', label: 'Created Date' },
                        { icon: '⚡', label: 'Actions' }
                      ].map((header, i) => (
                        <th key={i}>
                          <span className="header-icon">{header.icon}</span>
                          {header.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {quizzes.map((quiz, index) => (
                      <tr key={quiz._id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                        <td style={{ fontWeight: '600', color: 'var(--black)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                              flexShrink: 0
                            }}></span>
                            {quiz.title}
                          </div>
                        </td>
                        <td>
                          <span className="subject-badge" style={{
                            background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(99,102,241,0.1))',
                            color: 'var(--purple-dark)',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            border: '1px solid rgba(139,92,246,0.2)'
                          }}>
                            {quiz.subject}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{
                              fontSize: '14px',
                              color: 'var(--accent-dark)',
                              fontWeight: '600'
                            }}>
                              {quiz.questions?.length || 0}
                            </span>
                            <span style={{ color: '#64748b', fontSize: '12px' }}>questions</span>
                          </div>
                        </td>
                        <td style={{ fontWeight: '500' }}>{quiz.createdBy?.name}</td>
                        <td className="date" style={{
                          color: '#64748b',
                          fontWeight: '500'
                        }}>
                          {new Date(quiz.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="action-buttons" style={{
                            display: 'flex',
                            gap: '8px',
                            flexWrap: 'wrap'
                          }}>
                            {user?.role === 'student' ? (
                              <>
                                <button
                                  className="btn btn-success action-btn"
                                  onClick={() => navigate(`/quiz/${quiz._id}`)}
                                  style={{
                                    fontSize: '12px',
                                    padding: '8px 12px',
                                    minWidth: 'auto'
                                  }}
                                >
                                  <span className="btn-icon">🎯</span>
                                  Take Quiz
                                </button>
                                <button
                                  className="btn btn-purple action-btn"
                                  onClick={() => navigate(`/my-results/${quiz._id}`)}
                                  style={{
                                    fontSize: '12px',
                                    padding: '8px 12px',
                                    minWidth: 'auto'
                                  }}
                                >
                                  <span className="btn-icon">📊</span>
                                  My Result
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="btn btn-secondary action-btn"
                                  onClick={() => navigate(`/quiz/${quiz._id}`)}
                                  style={{
                                    fontSize: '12px',
                                    padding: '8px 12px',
                                    minWidth: 'auto'
                                  }}
                                >
                                  <span className="btn-icon">👁️</span>
                                  View
                                </button>
                                <button
                                  className="btn btn-purple action-btn"
                                  onClick={() => navigate(`/results/${quiz._id}`)}
                                  style={{
                                    fontSize: '12px',
                                    padding: '8px 12px',
                                    minWidth: 'auto'
                                  }}
                                >
                                  <span className="btn-icon">📊</span>
                                  Results
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Results Table */}
        <section className="dashboard-section">
          <h2 style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: 0
          }}>
            <span style={{
              fontSize: '1.5rem',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {user?.role === 'teacher' ? '📊' : '🎯'}
            </span>
            {user?.role === 'teacher' ? 'All Student Results' : 'My Results'}
          </h2>
          <div className="table-container">
            {results.length === 0 ? (
              <div className="empty-state enhanced">
                <div className="empty-icon" style={{
                  fontSize: '5rem',
                  marginBottom: '1.5rem',
                  animation: 'float 3s ease-in-out infinite',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }}>
                  {user?.role === 'teacher' ? '📊' : '🎯'}
                </div>
                <h3 style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '1rem'
                }}>
                  {user?.role === 'teacher' ? 'No Student Submissions Yet' : 'No Quiz Results Yet'}
                </h3>
                <p style={{
                  marginBottom: '2rem',
                  maxWidth: '500px',
                  margin: '0 auto 2rem auto',
                  lineHeight: '1.6'
                }}>
                  {user?.role === 'teacher'
                    ? 'Student quiz submissions and results will appear here once they start taking your quizzes. Encourage them to participate!'
                    : 'Your quiz results and performance will be displayed here once you complete some quizzes. Start taking quizzes to track your progress!'
                  }
                </p>
                {user?.role === 'student' && quizzes.length > 0 && (
                  <button
                    className="btn btn-primary empty-cta"
                    onClick={() => {
                      const firstQuiz = quizzes[0];
                      if (firstQuiz) navigate(`/quiz/${firstQuiz._id}`);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      margin: '0 auto',
                      animation: 'pulse 2s infinite'
                    }}
                  >
                    <span className="cta-icon">🎯</span>
                    <span>Take Your First Quiz</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="enhanced-table-wrapper">
                <table className="enhanced-table">
                  <thead>
                    <tr>
                      {[
                        { icon: '📄', label: 'Quiz' },
                        { icon: '🏷️', label: 'Subject' },
                        ...(user?.role === 'teacher' ? [{ icon: '👤', label: 'Student' }] : []),
                        { icon: '📊', label: 'Score' },
                        { icon: '📈', label: 'Percentage' },
                        { icon: '📅', label: 'Submitted At' }
                      ].map((header, i) => (
                        <th key={i}>
                          <span className="header-icon">{header.icon}</span>
                          {header.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => {
                      const percentage = Math.round((result.score / result.total) * 100);
                      return (
                        <tr key={result._id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                          <td style={{ fontWeight: '600', color: 'var(--black)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                flexShrink: 0
                              }}></span>
                              {result.quiz?.title || 'Quiz'}
                            </div>
                          </td>
                          <td>
                            <span className="subject-badge" style={{
                              background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(99,102,241,0.1))',
                              color: 'var(--purple-dark)',
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '600',
                              border: '1px solid rgba(139,92,246,0.2)'
                            }}>
                              {result.quiz?.subject}
                            </span>
                          </td>
                          {user?.role === 'teacher' && (
                            <td>
                              <div className="student-info" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px'
                              }}>
                                <div style={{
                                  fontWeight: '600',
                                  color: 'var(--black)',
                                  fontSize: '14px'
                                }}>
                                  {result.student?.name}
                                </div>
                                <div style={{
                                  fontSize: '12px',
                                  color: '#64748b',
                                  fontWeight: '500'
                                }}>
                                  {result.student?.email}
                                </div>
                              </div>
                            </td>
                          )}
                          <td className="score" style={{
                            fontWeight: '700',
                            color: 'var(--accent-dark)',
                            fontSize: '15px'
                          }}>
                            {result.score}/{result.total}
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className="percentage-badge" style={{
                                background: percentage >= 80 ? 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.1))' :
                                           percentage >= 60 ? 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(234,88,12,0.1))' :
                                           'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(193,18,31,0.1))',
                                color: percentage >= 80 ? 'var(--accent-dark)' :
                                       percentage >= 60 ? 'var(--warning-dark)' :
                                       'var(--error-dark)',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontWeight: '700',
                                fontSize: '14px',
                                border: `1px solid ${percentage >= 80 ? 'rgba(16,185,129,0.2)' :
                                                     percentage >= 60 ? 'rgba(245,158,11,0.2)' :
                                                     'rgba(239,68,68,0.2)'}`
                              }}>
                                {percentage}%
                              </span>
                              <div className="mini-progress" style={{
                                flex: 1,
                                height: '4px',
                                background: 'rgba(0,0,0,0.1)',
                                borderRadius: '2px',
                                overflow: 'hidden',
                                maxWidth: '60px'
                              }}>
                                <div style={{
                                  height: '100%',
                                  background: percentage >= 80 ? 'var(--accent)' :
                                             percentage >= 60 ? 'var(--warning)' :
                                             'var(--error)',
                                  width: `${percentage}%`,
                                  transition: 'width 1s ease-out'
                                }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="date" style={{
                            color: '#64748b',
                            fontWeight: '500'
                          }}>
                            {new Date(result.submittedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
