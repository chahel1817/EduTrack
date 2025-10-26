import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const res = await api.get(`/quiz/${id}`);
      setQuiz(res.data);
      setStartTime(Date.now());
    } catch (err) {
      console.error('Failed to fetch quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (startTime && !submitted) {
      const interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, submitted]);

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers({ ...answers, [questionIndex]: answerIndex });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setSubmitError('You must be logged in to submit the quiz.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const finalTimeSpent = Math.floor((Date.now() - startTime) / 1000);
    let correctAnswers = 0;
    const answerDetails = [];

    quiz.questions.forEach((question, index) => {
      const isCorrect = answers[index] === question.correctAnswer;
      if (isCorrect) correctAnswers++;

      answerDetails.push({
        questionIndex: index,
        selectedAnswer: answers[index] ?? -1,
        isCorrect,
        points: isCorrect ? (question.points || 1) : 0
      });
    });

    setScore(correctAnswers);

    console.log('Submitting quiz result:', {
      quiz: id,
      score: correctAnswers,
      total: quiz.questions.length,
      answersCount: answerDetails.length,
      timeSpent: finalTimeSpent
    });

    try {
      const response = await api.post('/results', {
        quiz: id,
        score: correctAnswers,
        total: quiz.questions.length,
        answers: answerDetails,
        timeSpent: finalTimeSpent
      });
      console.log('Quiz submission successful:', response.data);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit result:', err);
      const errorMessage = err.response?.data?.message || 'Failed to submit quiz. Please try again.';
      setSubmitError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const answeredCount = Object.keys(answers).filter(key => answers[key] !== undefined).length;
    return Math.round((answeredCount / quiz.questions.length) * 100);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <div className="loading">Loading quiz...</div>
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

  if (submitted) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <div className="dashboard-section">
            <div className="text-center">
              <div style={{ fontSize: '6rem', marginBottom: '1.5rem', animation: 'bounce 2s infinite' }}>
                {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
              </div>
              <h2 style={{
                fontSize: '36px',
                fontWeight: '700',
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.5px'
              }}>
                Quiz Completed!
              </h2>
              <p style={{
                fontSize: '18px',
                color: '#64748b',
                marginBottom: '2rem',
                maxWidth: '600px',
                margin: '0 auto 3rem auto',
                lineHeight: '1.6'
              }}>
                Great job! You've successfully completed the quiz. Here's your performance summary.
              </p>

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
                  }}>✅</div>
                  <h3 style={{
                    margin: '0 0 0.5rem 0',
                    color: 'var(--black)',
                    fontSize: '2.5rem',
                    fontWeight: '700'
                  }}>{score}</h3>
                  <p style={{
                    margin: 0,
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>Correct Answers</p>
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
                  }}>📊</div>
                  <h3 style={{
                    margin: '0 0 0.5rem 0',
                    color: 'var(--black)',
                    fontSize: '2.5rem',
                    fontWeight: '700'
                  }}>{quiz.questions.length}</h3>
                  <p style={{
                    margin: 0,
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>Total Questions</p>
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
                    color: percentage >= 80 ? 'var(--accent-dark)' : percentage >= 60 ? 'var(--warning-dark)' : 'var(--error-dark)',
                    fontSize: '2.5rem',
                    fontWeight: '700'
                  }}>{percentage}%</h3>
                  <p style={{
                    margin: 0,
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>Final Score</p>
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.98))',
                borderRadius: '16px',
                padding: '2rem',
                marginBottom: '3rem',
                border: '1px solid rgba(99,102,241,0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  marginBottom: '1rem'
                }}>
                  <span style={{ fontSize: '2rem' }}>⏱️</span>
                  <h3 style={{
                    margin: 0,
                    color: 'var(--black)',
                    fontSize: '1.5rem',
                    fontWeight: '600'
                  }}>Time Spent</h3>
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: 'var(--primary)',
                  textAlign: 'center'
                }}>
                  {formatTime(timeSpent)}
                </div>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  margin: '0 auto',
                  padding: '16px 32px',
                  fontSize: '16px',
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

  const question = quiz.questions[currentQuestion];

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        <div className="dashboard-section">
        {/* Header with Progress */}
        <div className="card mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2 className="auth-title text-xl">{quiz.title}</h2>
                <p className="text-sm" style={{ color: '#6b7280' }}>{quiz.subject}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '0.25rem' }}>Time</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--black)' }}>
                  {formatTime(timeSpent)}
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--black)' }}>
                  Progress: {getProgressPercentage()}%
                </span>
                <span style={{ fontSize: '14px', color: '#64748b' }}>
                  {Object.keys(answers).filter(key => answers[key] !== undefined).length} of {quiz.questions.length} answered
                </span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                background: 'var(--gray-light)', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${getProgressPercentage()}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--red), var(--blue))',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="card">
          <div className="px-4 py-5 sm:p-6">

            <div className="mb-6">
              <div className="flex justify-between items-center mb-6">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    background: 'linear-gradient(135deg, var(--red), var(--blue))', 
                    color: 'white', 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}>
                    {currentQuestion + 1}
                  </div>
                  <div>
                    <div className="text-lg font-medium" style={{ color: 'var(--black)' }}>
                      Question {currentQuestion + 1} of {quiz.questions.length}
                    </div>
                    <div className="text-sm" style={{ color: '#64748b' }}>
                      {answers[currentQuestion] !== undefined ? '✓ Answered' : 'Not answered yet'}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {quiz.questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-4 h-4 rounded-full transition-all ${
                        index === currentQuestion
                          ? 'bg-red-600 scale-125'
                          : answers[index] !== undefined
                          ? 'bg-green-400 hover:bg-green-500'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </div>
              </div>

              <div className="card p-8" style={{ background: 'var(--white)', border: '2px solid var(--border-gray)' }}>
                <h3 className="text-xl font-medium mb-6" style={{ color: 'var(--black)', lineHeight: '1.6' }}>
                  {question.question}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {question.options.map((option, index) => (
                    <label
                      key={index}
                      className="flex items-center p-6 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md"
                      style={{
                        border: answers[currentQuestion] === index ? '3px solid var(--red)' : '2px solid var(--border-gray)',
                        background: answers[currentQuestion] === index ? 'linear-gradient(135deg, rgba(193, 18, 31, 0.08), rgba(193, 18, 31, 0.05))' : 'var(--white)',
                        boxShadow: answers[currentQuestion] === index ? '0 4px 12px rgba(193, 18, 31, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
                        minHeight: '60px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onClick={() => handleAnswerSelect(currentQuestion, index)}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        value={index}
                        checked={answers[currentQuestion] === index}
                        onChange={() => {}}
                        className="mr-5"
                        style={{
                          accentColor: 'var(--red)',
                          transform: 'scale(1.4)',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{
                        color: 'var(--black)',
                        fontSize: '17px',
                        fontWeight: answers[currentQuestion] === index ? '700' : '500',
                        lineHeight: '1.4',
                        flex: 1
                      }}>
                        {option}
                      </span>
                      {answers[currentQuestion] === index && (
                        <div style={{
                          marginLeft: 'auto',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span style={{
                            color: 'var(--red)',
                            fontWeight: '700',
                            fontSize: '15px',
                            background: 'rgba(193, 18, 31, 0.1)',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            border: '1px solid rgba(193, 18, 31, 0.2)'
                          }}>
                            ✓ Selected
                          </span>
                        </div>
                      )}
                      {answers[currentQuestion] === index && (
                        <div style={{
                          position: 'absolute',
                          top: '0',
                          right: '0',
                          width: '0',
                          height: '0',
                          borderLeft: '30px solid transparent',
                          borderTop: '30px solid var(--red)',
                          zIndex: 1
                        }}>
                          <span style={{
                            position: 'absolute',
                            top: '-25px',
                            right: '2px',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            ✓
                          </span>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px solid var(--border-gray)' }}>
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                ← Previous
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                {quiz.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`btn ${index === currentQuestion ? 'btn-primary' : 'btn-outline'}`}
                    style={{ 
                      padding: '8px 12px', 
                      fontSize: '12px',
                      minWidth: '40px'
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {currentQuestion === quiz.questions.length - 1 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                  {submitError && (
                    <div style={{
                      color: 'var(--error)',
                      background: 'rgba(239, 68, 68, 0.1)',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      fontSize: '14px',
                      fontWeight: '500',
                      textAlign: 'center'
                    }}>
                      {submitError}
                    </div>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={Object.keys(answers).length !== quiz.questions.length || submitting}
                    className="btn btn-success disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '16px 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      minWidth: '200px',
                      justifyContent: 'center'
                    }}
                  >
                    {submitting ? (
                      <>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          border: '2px solid transparent',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        🎯 Submit Quiz
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={answers[currentQuestion] === undefined}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default TakeQuiz;
