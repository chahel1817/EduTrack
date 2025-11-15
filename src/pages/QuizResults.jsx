import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import Navbar from '../components/Navbar';

const QuizResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResults();
    fetchQuiz();
  }, [id]);

  const fetchResults = async () => {
    try {
      const res = await api.get(`/results/quiz/${id}`);
      setResults(res.data);
    } catch (err) {
      console.error('Failed to fetch results:', err);
      setError('Failed to load quiz results. Please try again.');
    }
  };

  const fetchQuiz = async () => {
    try {
      const res = await api.get(`/quiz/${id}`);
      setQuiz(res.data);
    } catch (err) {
      console.error('Failed to fetch quiz:', err);
      setError('Failed to load quiz details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <div className="loading">Loading quiz results...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <div className="dashboard-section">
            <div className="empty-state enhanced">
              <div className="empty-icon" style={{
                fontSize: '5rem',
                marginBottom: '1.5rem',
                animation: 'float 3s ease-in-out infinite',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
              }}>
                ⚠️
              </div>
              <h3 style={{
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1rem'
              }}>
                Error Loading Results
              </h3>
              <p style={{
                marginBottom: '2rem',
                maxWidth: '500px',
                margin: '0 auto 2rem auto',
                lineHeight: '1.6'
              }}>
                {error}
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary empty-cta"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '0 auto',
                  animation: 'pulse 2s infinite'
                }}
              >
                <span className="cta-icon">🏠</span>
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <div className="dashboard-section">
            <div className="empty-state enhanced">
              <div className="empty-icon" style={{
                fontSize: '5rem',
                marginBottom: '1.5rem',
                animation: 'float 3s ease-in-out infinite',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
              }}>
                ❓
              </div>
              <h3 style={{
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1rem'
              }}>
                Quiz Not Found
              </h3>
              <p style={{
                marginBottom: '2rem',
                maxWidth: '500px',
                margin: '0 auto 2rem auto',
                lineHeight: '1.6'
              }}>
                The quiz you're looking for doesn't exist or has been removed.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary empty-cta"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '0 auto',
                  animation: 'pulse 2s infinite'
                }}
              >
                <span className="cta-icon">🏠</span>
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Calculate statistics
  const totalSubmissions = results.length;
  const averageScore = totalSubmissions > 0
    ? (results.reduce((sum, result) => sum + result.score, 0) / totalSubmissions).toFixed(1)
    : 0;
  const averagePercentage = totalSubmissions > 0
    ? (results.reduce((sum, result) => sum + result.percentage, 0) / totalSubmissions).toFixed(1)
    : 0;
  const highestScore = totalSubmissions > 0
    ? Math.max(...results.map(result => result.percentage))
    : 0;
  const lowestScore = totalSubmissions > 0
    ? Math.min(...results.map(result => result.percentage))
    : 0;

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        {/* Quiz Header */}
        <div className="dashboard-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '0.5rem',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.5px'
              }}>
                📊 Quiz Results: {quiz.title}
              </h2>
              <p style={{
                fontSize: '1.1rem',
                color: '#64748b',
                marginBottom: '0.5rem'
              }}>
                Subject: {quiz.subject}
              </p>
              <p style={{
                fontSize: '0.9rem',
                color: '#64748b'
              }}>
                Total Questions: {quiz.questions?.length || 0}
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-outline"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>←</span>
              <span>Back to Dashboard</span>
            </button>
          </div>

          {/* Statistics Cards */}
          {totalSubmissions > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem'
            }}>
              <div className="stat-card" style={{
                background: `linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.1))`,
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                border: `1px solid rgba(16,185,129,0.2)`,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div className="stat-icon" style={{
                  fontSize: '3rem',
                  marginBottom: '1rem',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}>👥</div>
                <h3 style={{
                  margin: '0 0 0.5rem 0',
                  color: 'var(--black)',
                  fontSize: '2.5rem',
                  fontWeight: '700'
                }}>{totalSubmissions}</h3>
                <p style={{
                  margin: 0,
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>Total Submissions</p>
              </div>

              <div className="stat-card" style={{
                background: `linear-gradient(135deg, rgba(99,102,241,0.1), rgba(236,72,153,0.1))`,
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                border: `1px solid rgba(99,102,241,0.2)`,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div className="stat-icon" style={{
                  fontSize: '3rem',
                  marginBottom: '1rem',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}>📈</div>
                <h3 style={{
                  margin: '0 0 0.5rem 0',
                  color: 'var(--black)',
                  fontSize: '2.5rem',
                  fontWeight: '700'
                }}>{averageScore}/{quiz.questions?.length || 0}</h3>
                <p style={{
                  margin: 0,
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>Average Score</p>
              </div>

              <div className="stat-card" style={{
                background: `linear-gradient(135deg, rgba(245,158,11,0.1), rgba(234,88,12,0.1))`,
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                border: `1px solid rgba(245,158,11,0.2)`,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div className="stat-icon" style={{
                  fontSize: '3rem',
                  marginBottom: '1rem',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}>🎯</div>
                <h3 style={{
                  margin: '0 0 0.5rem 0',
                  color: 'var(--black)',
                  fontSize: '2.5rem',
                  fontWeight: '700'
                }}>{averagePercentage}%</h3>
                <p style={{
                  margin: 0,
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>Average Percentage</p>
              </div>

              <div className="stat-card" style={{
                background: `linear-gradient(135deg, rgba(139,92,246,0.1), rgba(124,58,237,0.1))`,
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                border: `1px solid rgba(139,92,246,0.2)`,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                <div className="stat-icon" style={{
                  fontSize: '3rem',
                  marginBottom: '1rem',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}>🏆</div>
                <h3 style={{
                  margin: '0 0 0.5rem 0',
                  color: 'var(--black)',
                  fontSize: '2.5rem',
                  fontWeight: '700'
                }}>{highestScore}%</h3>
                <p style={{
                  margin: 0,
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>Highest Score</p>
              </div>
            </div>
          )}

          {/* Results Table */}
          <div className="enhanced-table-wrapper">
            <table className="enhanced-table">
              <thead>
                <tr>
                  <th className="header-icon">👤</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th className="header-icon">✅</th>
                  <th>Score</th>
                  <th className="header-icon">📊</th>
                  <th>Percentage</th>
                  <th className="header-icon">⏱️</th>
                  <th>Time Spent</th>
                  <th className="header-icon">📅</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={result._id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                    <td>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        color: 'white',
                        fontWeight: '600'
                      }}>
                        {result.student?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                    </td>
                    <td style={{ fontWeight: '600', color: 'var(--black)' }}>
                      {result.student?.name || 'Unknown Student'}
                    </td>
                    <td style={{ color: '#64748b' }}>
                      {result.student?.email || 'N/A'}
                    </td>
                    <td>
                      <span style={{
                        background: result.percentage >= 80 ? 'rgba(16,185,129,0.1)' :
                                   result.percentage >= 60 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                        color: result.percentage >= 80 ? 'var(--accent-dark)' :
                               result.percentage >= 60 ? 'var(--warning-dark)' : 'var(--error-dark)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {result.percentage >= 80 ? 'Excellent' :
                         result.percentage >= 60 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </td>
                    <td className="score" style={{ fontSize: '16px', fontWeight: '700' }}>
                      {result.score}/{result.total}
                    </td>
                    <td>
                      <div style={{
                        width: '60px',
                        height: '8px',
                        background: 'var(--gray-light)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        margin: '0 auto'
                      }}>
                        <div style={{
                          width: `${result.percentage}%`,
                          height: '100%',
                          background: result.percentage >= 80 ? 'var(--accent)' :
                                     result.percentage >= 60 ? 'var(--warning)' : 'var(--error)',
                          borderRadius: '4px',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </td>
                    <td className="score" style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: result.percentage >= 80 ? 'var(--accent-dark)' :
                             result.percentage >= 60 ? 'var(--warning-dark)' : 'var(--error-dark)'
                    }}>
                      {result.percentage}%
                    </td>
                    <td>
                      <span style={{
                        background: 'rgba(99,102,241,0.1)',
                        color: 'var(--primary)',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {result.timeSpent || 0} min
                      </span>
                    </td>
                    <td className="date" style={{ fontSize: '14px', color: '#64748b' }}>
                      {new Date(result.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="date" style={{ fontSize: '14px', color: '#64748b' }}>
                      {new Date(result.submittedAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {results.length === 0 && (
            <div className="empty-state enhanced">
              <div className="empty-icon" style={{
                fontSize: '5rem',
                marginBottom: '1.5rem',
                animation: 'float 3s ease-in-out infinite',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
              }}>
                📝
              </div>
              <h3 style={{
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1rem'
              }}>
                No Results Yet
              </h3>
              <p style={{
                marginBottom: '2rem',
                maxWidth: '500px',
                margin: '0 auto 2rem auto',
                lineHeight: '1.6'
              }}>
                No students have submitted this quiz yet. Results will appear here once students complete the quiz.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary empty-cta"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '0 auto',
                  animation: 'pulse 2s infinite'
                }}
              >
                <span className="cta-icon">🏠</span>
                <span>Back to Dashboard</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizResults;
