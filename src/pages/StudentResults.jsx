import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const StudentResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role !== 'student') {
      navigate('/dashboard');
      return;
    }
    fetchResult();
    fetchQuiz();
  }, [id, user]);

  const fetchResult = async () => {
    try {
      const res = await api.get('/results/student');
      const studentResult = res.data.find(r => r.quiz._id === id);
      if (!studentResult) {
        setError('You have not taken this quiz yet.');
        return;
      }
      setResult(studentResult);
    } catch (err) {
      console.error('Failed to fetch result:', err);
      setError('Failed to load quiz result. Please try again.');
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
          <div className="loading">Loading your quiz result...</div>
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
                {error.includes('not taken') ? 'Quiz Not Taken' : 'Error Loading Result'}
              </h3>
              <p style={{
                marginBottom: '2rem',
                maxWidth: '500px',
                margin: '0 auto 2rem auto',
                lineHeight: '1.6'
              }}>
                {error.includes('not taken')
                  ? 'You haven\'t taken this quiz yet. Complete the quiz first to view your results.'
                  : error
                }
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

  if (!result || !quiz) {
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
                Result Not Found
              </h3>
              <p style={{
                marginBottom: '2rem',
                maxWidth: '500px',
                margin: '0 auto 2rem auto',
                lineHeight: '1.6'
              }}>
                The quiz result you're looking for doesn't exist or has been removed.
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

  const percentage = result.percentage;
  const isExcellent = percentage >= 80;
  const isGood = percentage >= 60;
  const isNeedsImprovement = percentage < 60;

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
                📊 My Quiz Result: {quiz.title}
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
                Completed on {new Date(result.submittedAt).toLocaleDateString()} at {new Date(result.submittedAt).toLocaleTimeString()}
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

          {/* Performance Overview */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            {/* Main Score Card */}
            <div className="stat-card" style={{
              background: `linear-gradient(135deg, ${isExcellent ? 'rgba(16,185,129,0.1), rgba(5,150,105,0.1)' :
                                                     isGood ? 'rgba(245,158,11,0.1), rgba(234,88,12,0.1)' :
                                                     'rgba(239,68,68,0.1), rgba(193,18,31,0.1)'})`,
              borderRadius: '16px',
              padding: '2rem',
              textAlign: 'center',
              border: `1px solid ${isExcellent ? 'rgba(16,185,129,0.2)' :
                                   isGood ? 'rgba(245,158,11,0.2)' :
                                   'rgba(239,68,68,0.2)'}`,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div className="stat-icon" style={{
                fontSize: '4rem',
                marginBottom: '1rem',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}>
                {isExcellent ? '🎉' : isGood ? '👍' : '📚'}
              </div>
              <h3 style={{
                margin: '0 0 0.5rem 0',
                color: isExcellent ? 'var(--accent-dark)' :
                       isGood ? 'var(--warning-dark)' :
                       'var(--error-dark)',
                fontSize: '3rem',
                fontWeight: '700'
              }}>{percentage}%</h3>
              <p style={{
                margin: 0,
                color: '#64748b',
                fontSize: '16px',
                fontWeight: '500'
              }}>
                {isExcellent ? 'Excellent Performance!' :
                 isGood ? 'Good Job!' :
                 'Keep Improving!'}
              </p>
              <div className="performance-badge" style={{
                marginTop: '1rem',
                display: 'inline-block',
                background: isExcellent ? 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.1))' :
                           isGood ? 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(234,88,12,0.1))' :
                           'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(193,18,31,0.1))',
                color: isExcellent ? 'var(--accent-dark)' :
                       isGood ? 'var(--warning-dark)' :
                       'var(--error-dark)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                border: `1px solid ${isExcellent ? 'rgba(16,185,129,0.2)' :
                                     isGood ? 'rgba(245,158,11,0.2)' :
                                     'rgba(239,68,68,0.2)'}`
              }}>
                {isExcellent ? '🏆 Outstanding' :
                 isGood ? '⭐ Good Work' :
                 '💪 Keep Going'}
              </div>
            </div>

            {/* Score Breakdown */}
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
              }}>📊</div>
              <h3 style={{
                margin: '0 0 0.5rem 0',
                color: 'var(--black)',
                fontSize: '2.5rem',
                fontWeight: '700'
              }}>{result.score}/{result.total}</h3>
              <p style={{
                margin: 0,
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '500'
              }}>Correct Answers</p>
              <div style={{
                marginTop: '1rem',
                width: '100%',
                height: '8px',
                background: 'var(--gray-light)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${percentage}%`,
                  height: '100%',
                  background: isExcellent ? 'var(--accent)' :
                             isGood ? 'var(--warning)' :
                             'var(--error)',
                  borderRadius: '4px',
                  transition: 'width 1s ease-out'
                }}></div>
              </div>
            </div>

            {/* Time Spent */}
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
              }}>⏱️</div>
              <h3 style={{
                margin: '0 0 0.5rem 0',
                color: 'var(--black)',
                fontSize: '2.5rem',
                fontWeight: '700'
              }}>{result.timeSpent || 0}</h3>
              <p style={{
                margin: 0,
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '500'
              }}>Minutes Spent</p>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="card">
            <div className="px-4 py-5 sm:p-6">
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '1.5rem',
                color: 'var(--black)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>📝</span>
                Question Review
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {quiz.questions?.map((question, index) => {
                  const answerDetail = result.answers?.find(a => a.questionIndex === index);
                  const isCorrect = answerDetail?.isCorrect;
                  const selectedAnswer = answerDetail?.selectedAnswer;

                  return (
                    <div key={index} style={{
                      background: 'var(--white)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      border: `2px solid ${isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {/* Status indicator */}
                      <div style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        width: '0',
                        height: '0',
                        borderLeft: '40px solid transparent',
                        borderTop: isCorrect ? '40px solid var(--accent)' : '40px solid var(--error)'
                      }}>
                        <span style={{
                          position: 'absolute',
                          top: '-35px',
                          right: '5px',
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: 'bold'
                        }}>
                          {isCorrect ? '✓' : '✗'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{
                          background: isCorrect ? 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.1))' :
                                     'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(193,18,31,0.1))',
                          color: isCorrect ? 'var(--accent-dark)' : 'var(--error-dark)',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          fontWeight: '700',
                          flexShrink: 0
                        }}>
                          {index + 1}
                        </div>

                        <div style={{ flex: 1 }}>
                          <h4 style={{
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            marginBottom: '1rem',
                            color: 'var(--black)',
                            lineHeight: '1.4'
                          }}>
                            {question.question}
                          </h4>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                            {question.options.map((option, optIndex) => {
                              const isSelected = selectedAnswer === optIndex;
                              const isCorrectOption = optIndex === question.correctAnswer;

                              return (
                                <div key={optIndex} style={{
                                  padding: '0.75rem 1rem',
                                  borderRadius: '8px',
                                  border: `2px solid ${
                                    isCorrectOption ? 'rgba(16,185,129,0.3)' :
                                    isSelected && !isCorrect ? 'rgba(239,68,68,0.3)' :
                                    'rgba(0,0,0,0.1)'
                                  }`,
                                  background: isCorrectOption ? 'rgba(16,185,129,0.05)' :
                                             isSelected && !isCorrect ? 'rgba(239,68,68,0.05)' :
                                             'var(--white)',
                                  position: 'relative'
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{
                                      width: '20px',
                                      height: '20px',
                                      borderRadius: '50%',
                                      border: `2px solid ${
                                        isSelected ? (isCorrect ? 'var(--accent)' : 'var(--error)') :
                                        isCorrectOption ? 'var(--accent)' :
                                        'rgba(0,0,0,0.2)'
                                      }`,
                                      background: isSelected ? (isCorrect ? 'var(--accent)' : 'var(--error)') :
                                                 isCorrectOption ? 'var(--accent)' :
                                                 'transparent',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flexShrink: 0
                                    }}>
                                      {isSelected && <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>✓</span>}
                                    </span>
                                    <span style={{
                                      color: isCorrectOption ? 'var(--accent-dark)' :
                                             isSelected && !isCorrect ? 'var(--error-dark)' :
                                             'var(--black)',
                                      fontWeight: isCorrectOption || isSelected ? '600' : '500',
                                      fontSize: '14px'
                                    }}>
                                      {option}
                                    </span>
                                  </div>

                                  {/* Correct answer indicator */}
                                  {isCorrectOption && (
                                    <div style={{
                                      position: 'absolute',
                                      top: '-8px',
                                      right: '-8px',
                                      background: 'var(--accent)',
                                      color: 'white',
                                      width: '24px',
                                      height: '24px',
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '12px',
                                      fontWeight: 'bold'
                                    }}>
                                      ✓
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Answer explanation */}
                          <div style={{
                            background: isCorrect ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)',
                            border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                            borderRadius: '8px',
                            padding: '1rem',
                            marginTop: '1rem'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              marginBottom: '0.5rem'
                            }}>
                              <span style={{
                                fontSize: '16px',
                                color: isCorrect ? 'var(--accent-dark)' : 'var(--error-dark)'
                              }}>
                                {isCorrect ? '✅' : '❌'}
                              </span>
                              <span style={{
                                fontWeight: '600',
                                color: isCorrect ? 'var(--accent-dark)' : 'var(--error-dark)',
                                fontSize: '14px'
                              }}>
                                {isCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
                              </span>
                            </div>
                            <p style={{
                              margin: 0,
                              color: '#64748b',
                              fontSize: '14px',
                              lineHeight: '1.4'
                            }}>
                              {isCorrect
                                ? 'Great job! You selected the correct answer.'
                                : `The correct answer was: ${question.options[question.correctAnswer]}`
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '2rem'
          }}>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px'
              }}
            >
              <span>🏠</span>
              <span>Back to Dashboard</span>
            </button>
            <button
              onClick={() => navigate(`/quiz/${id}`)}
              className="btn btn-outline"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px'
              }}
            >
              <span>🔄</span>
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentResults;
