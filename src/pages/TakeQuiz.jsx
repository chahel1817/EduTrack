import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  ArrowLeft, 
  ArrowRight, 
  Trophy, 
  Target, 
  FileText,
  Home,
  Send,
  Loader2,
  AlertCircle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

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

    try {
      const response = await api.post('/results', {
        quiz: id,
        score: correctAnswers,
        total: quiz.questions.length,
        answers: answerDetails,
        timeSpent: finalTimeSpent
      });
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
          <div className="dashboard-section">
            <div className="loading" style={{ textAlign: 'center', padding: '3rem' }}>
              <Loader2 size={48} className="loading-spinner" style={{ 
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem',
                color: 'var(--blue)'
              }} />
              <div>Loading quiz...</div>
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
              <AlertCircle size={64} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
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
                lineHeight: '1.6',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'var(--gray-600)'
              }}>
                The quiz you're looking for doesn't exist or has been removed.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '0 auto'
                }}
              >
                <Home size={18} />
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (submitted) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    const isExcellent = percentage >= 80;
    const isGood = percentage >= 60;
    
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <div className="dashboard-section">
            <div className="text-center">
              {/* Success Icon */}
              <div style={{ 
                fontSize: '6rem', 
                marginBottom: '1.5rem', 
                animation: 'bounce 2s infinite',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {isExcellent ? '🎉' : isGood ? '👍' : '📚'}
              </div>

              {/* Title */}
              <h2 className="section-heading" style={{ 
                fontSize: '36px',
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, var(--blue), var(--purple))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Quiz Completed!
              </h2>
              
              <p style={{
                fontSize: '18px',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#64748b',
                marginBottom: '2rem',
                maxWidth: '600px',
                margin: '0 auto 3rem auto',
                lineHeight: '1.6'
              }}>
                Great job! You've successfully completed the quiz. Here's your performance summary.
              </p>

              {/* Stats Grid */}
              <div className="stats-grid" style={{ marginBottom: '3rem' }}>
                <div className="stat-card hover-lift" style={{
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))'
                    : 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.1))',
                  border: `1px solid ${isDarkMode ? 'rgba(16,185,129,0.3)' : 'rgba(16,185,129,0.2)'}`,
                }}>
                  <div className="stat-icon-wrapper">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="stat-value">{score}</h3>
                  <p className="stat-label">Correct Answers</p>
                </div>

                <div className="stat-card hover-lift" style={{
                  background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))'
                    : 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(236,72,153,0.1))',
                  border: `1px solid ${isDarkMode ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.2)'}`,
                }}>
                  <div className="stat-icon-wrapper">
                    <FileText size={28} />
                  </div>
                  <h3 className="stat-value">{quiz.questions.length}</h3>
                  <p className="stat-label">Total Questions</p>
                </div>

                <div className="stat-card hover-lift" style={{
                  background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(234,88,12,0.1))'
                    : 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(234,88,12,0.1))',
                  border: `1px solid ${isDarkMode ? 'rgba(245,158,11,0.3)' : 'rgba(245,158,11,0.2)'}`,
                }}>
                  <div className="stat-icon-wrapper">
                    <Target size={28} />
                  </div>
                  <h3 className="stat-value" style={{
                    color: isExcellent ? 'var(--accent-dark)' : isGood ? 'var(--warning-dark)' : 'var(--error-dark)'
                  }}>
                    {percentage}%
                  </h3>
                  <p className="stat-label">Final Score</p>
                </div>
              </div>

              {/* Time Spent Component - Fixed for Dark Mode */}
              <div className="stat-card hover-lift" style={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6))'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.98))',
                borderRadius: '16px',
                padding: '2rem',
                marginBottom: '3rem',
                border: isDarkMode 
                  ? '1px solid rgba(99,102,241,0.3)'
                  : '1px solid rgba(99,102,241,0.1)',
                boxShadow: isDarkMode 
                  ? '0 8px 32px rgba(0,0,0,0.5)'
                  : '0 8px 32px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  marginBottom: '1rem'
                }}>
                  <Clock size={32} color={isDarkMode ? 'var(--blue)' : 'var(--primary)'} />
                  <h3 style={{
                    margin: 0,
                    color: isDarkMode ? '#ffffff' : 'var(--black)',
                    fontSize: '1.5rem',
                    fontWeight: '600'
                  }}>
                    Time Spent
                  </h3>
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: isDarkMode ? 'var(--blue)' : 'var(--primary)',
                  textAlign: 'center'
                }}>
                  {formatTime(timeSpent)}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 32px',
                    fontSize: '16px'
                  }}
                >
                  <Home size={18} />
                  Back to Dashboard
                </button>
                
                <button
                  onClick={() => navigate(`/my-results/${quiz._id}`)}
                  className="btn btn-outline"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 32px',
                    fontSize: '16px'
                  }}
                >
                  <Trophy size={18} />
                  View Results
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const answeredCount = Object.keys(answers).filter(key => answers[key] !== undefined).length;

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        <div className="dashboard-section">
          {/* Header with Progress */}
          <div className="card mb-6" style={{
            background: isDarkMode ? '#000000' : 'var(--card-bg)',
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'var(--border-gray)'
          }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 className="section-heading" style={{ fontSize: '24px', margin: '0 0 4px 0' }}>
                    {quiz.title}
                  </h2>
                  <p style={{ 
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#6b7280',
                    fontSize: '14px',
                    margin: 0
                  }}>
                    {quiz.subject}
                  </p>
                </div>
                <div style={{ 
                  textAlign: 'right',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  background: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                  borderRadius: '12px',
                  border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`
                }}>
                  <Clock size={20} color={isDarkMode ? 'var(--blue)' : 'var(--primary)'} />
                  <div>
                    <div style={{ fontSize: '12px', color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : '#64748b', marginBottom: '2px' }}>
                      Time
                    </div>
                    <div style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '700', 
                      color: isDarkMode ? '#ffffff' : 'var(--black)'
                    }}>
                      {formatTime(timeSpent)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: isDarkMode ? '#ffffff' : 'var(--black)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Target size={16} />
                    Progress: {getProgressPercentage()}%
                  </span>
                  <span style={{ 
                    fontSize: '14px', 
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#64748b' 
                  }}>
                    {answeredCount} of {quiz.questions.length} answered
                  </span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '10px', 
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'var(--gray-200)', 
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${getProgressPercentage()}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--blue), var(--purple))',
                    borderRadius: '8px',
                    transition: 'width 0.3s ease',
                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                  }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="card" style={{
            background: isDarkMode ? '#000000' : 'var(--card-bg)',
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'var(--border-gray)'
          }}>
            <div style={{ padding: '2rem' }}>
              {/* Question Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    background: 'linear-gradient(135deg, var(--blue), var(--purple))', 
                    color: 'white', 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '18px',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}>
                    {currentQuestion + 1}
                  </div>
                  <div>
                    <div style={{ 
                      fontSize: '18px',
                      fontWeight: '600',
                      color: isDarkMode ? '#ffffff' : 'var(--black)',
                      marginBottom: '4px'
                    }}>
                      Question {currentQuestion + 1} of {quiz.questions.length}
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      {answers[currentQuestion] !== undefined ? (
                        <>
                          <CheckCircle2 size={14} color="var(--accent-dark)" />
                          Answered
                        </>
                      ) : (
                        <>
                          <Circle size={14} />
                          Not answered yet
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Question Navigation Dots */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {quiz.questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        background: index === currentQuestion
                          ? 'var(--blue)'
                          : answers[index] !== undefined
                          ? 'var(--accent-dark)'
                          : isDarkMode
                          ? 'rgba(255, 255, 255, 0.2)'
                          : 'var(--gray-300)',
                        transform: index === currentQuestion ? 'scale(1.3)' : 'scale(1)',
                        boxShadow: index === currentQuestion ? '0 0 8px rgba(59, 130, 246, 0.5)' : 'none'
                      }}
                      title={`Question ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Question Text */}
              <div style={{
                background: isDarkMode 
                  ? 'rgba(59, 130, 246, 0.05)' 
                  : 'rgba(59, 130, 246, 0.02)',
                borderRadius: '16px',
                padding: '2rem',
                marginBottom: '2rem',
                border: `2px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'}`
              }}>
                <h3 style={{ 
                  color: isDarkMode ? '#ffffff' : 'var(--black)', 
                  lineHeight: '1.8',
                  fontSize: '20px',
                  fontWeight: '600',
                  margin: 0
                }}>
                  {question.question}
                </h3>
              </div>

              {/* Options */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {question.options.map((option, index) => {
                  const isSelected = answers[currentQuestion] === index;
                  return (
                    <label
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '1.25rem',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: isSelected
                          ? `3px solid var(--blue)`
                          : isDarkMode
                          ? '2px solid rgba(255, 255, 255, 0.2)'
                          : '2px solid var(--border-gray)',
                        background: isSelected
                          ? isDarkMode
                            ? 'rgba(59, 130, 246, 0.15)'
                            : 'rgba(59, 130, 246, 0.08)'
                          : isDarkMode
                          ? 'rgba(0, 0, 0, 0.5)'
                          : 'var(--white)',
                        boxShadow: isSelected
                          ? '0 4px 16px rgba(59, 130, 246, 0.3)'
                          : '0 2px 8px rgba(0, 0, 0, 0.08)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onClick={() => handleAnswerSelect(currentQuestion, index)}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                        }
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        value={index}
                        checked={isSelected}
                        onChange={() => {}}
                        style={{
                          accentColor: 'var(--blue)',
                          transform: 'scale(1.3)',
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                      />
                      <span style={{
                        color: isDarkMode ? '#ffffff' : 'var(--black)',
                        fontSize: '16px',
                        fontWeight: isSelected ? '600' : '500',
                        lineHeight: '1.6',
                        flex: 1
                      }}>
                        {option}
                      </span>
                      {isSelected && (
                        <CheckCircle2 
                          size={24} 
                          color="var(--blue)" 
                          style={{ flexShrink: 0 }}
                        />
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navigation Footer */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: isDarkMode ? '2px solid rgba(255, 255, 255, 0.1)' : '2px solid var(--border-gray)',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="btn btn-outline"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                opacity: currentQuestion === 0 ? 0.5 : 1,
                cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            {/* Question Numbers */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={index === currentQuestion ? 'btn btn-primary' : 'btn btn-outline'}
                  style={{ 
                    padding: '8px 14px', 
                    fontSize: '13px',
                    minWidth: '44px',
                    fontWeight: '600'
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestion === quiz.questions.length - 1 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
                {submitError && (
                  <div style={{
                    color: 'var(--error-dark)',
                    background: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: `1px solid ${isDarkMode ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.2)'}`,
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <AlertCircle size={16} />
                    {submitError}
                  </div>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={answeredCount !== quiz.questions.length || submitting}
                  className="btn btn-success"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '16px 32px',
                    fontSize: '16px',
                    fontWeight: '600',
                    minWidth: '200px',
                    justifyContent: 'center',
                    opacity: answeredCount !== quiz.questions.length ? 0.5 : 1,
                    cursor: answeredCount !== quiz.questions.length ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="loading-spinner" style={{ animation: 'spin 1s linear infinite' }} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Submit Quiz
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={handleNext}
                disabled={answers[currentQuestion] === undefined}
                className="btn btn-primary"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  opacity: answers[currentQuestion] === undefined ? 0.5 : 1,
                  cursor: answers[currentQuestion] === undefined ? 'not-allowed' : 'pointer'
                }}
              >
                Next
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TakeQuiz;
