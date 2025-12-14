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
  ChevronLeft,
  BookOpen
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
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(30);
  const [quizTimeLeft, setQuizTimeLeft] = useState(null);
  const [quizTimeLimit, setQuizTimeLimit] = useState(null);

  /* ---------------- DARK MODE ---------------- */
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains("dark"));
    };
    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observer.disconnect();
  }, []);

  /* ---------------- FETCH QUIZ ---------------- */
  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      console.log('Fetching quiz with ID:', id);
      const res = await api.get(`/quizzes/${id}`);
      console.log('Quiz fetched successfully:', res.data);
      
      if (!res.data) {
        console.error('Quiz data is null');
        setLoading(false);
        return;
      }
      
      setQuiz(res.data);
      setStartTime(Date.now());

      if (res.data.timeLimit) {
        const quizLimit = res.data.timeLimit * 60;
        setQuizTimeLimit(quizLimit);
        setQuizTimeLeft(quizLimit);
      }
    } catch (err) {
      console.error('Failed to fetch quiz:', err);
      console.error('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        url: err.config?.url
      });
      
      // Set error state so user sees proper error message
      if (err.response?.status === 404) {
        // Quiz not found - will be handled by the !quiz check
      } else if (err.response?.status === 403) {
        // Access denied
        setSubmitError('You do not have permission to access this quiz.');
      } else if (err.response?.status === 401) {
        // Unauthorized - will be handled by interceptor
      } else {
        setSubmitError(err.response?.data?.message || 'Failed to load quiz. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- TOTAL TIMER ---------------- */
  useEffect(() => {
    if (!startTime || submitted) return;

    const interval = setInterval(() => {
      setTimeSpent(
        Math.floor((Date.now() - startTime) / 1000)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, submitted]);

  /* ---------------- QUESTION TIMER ---------------- */
  useEffect(() => {
    if (!quiz || submitted || !quiz.enableQuestionTimeLimit) return;

    setQuestionStartTime(Date.now());
    setQuestionTimeLeft(
      quiz.questions[currentQuestion]?.timeLimit || 30
    );

    const interval = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - questionStartTime) / 1000
      );
      const limit =
        quiz.questions[currentQuestion]?.timeLimit || 30;

      const remaining = limit - elapsed;

      if (remaining <= 0) {
        clearInterval(interval);
        if (currentQuestion < quiz.questions.length - 1) {
          setCurrentQuestion(q => q + 1);
        } else {
          handleSubmit();
        }
      } else {
        setQuestionTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestion, quiz, submitted]);

  /* ---------------- QUIZ TIMER ---------------- */
  useEffect(() => {
    if (!quizTimeLimit || submitted || !startTime) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - startTime) / 1000
      );
      const remaining = quizTimeLimit - elapsed;

      if (remaining <= 0) {
        clearInterval(interval);
        handleSubmit();
      } else {
        setQuizTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [quizTimeLimit, submitted, startTime]);

  /* ---------------- HANDLERS ---------------- */
  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: answerIndex
    });
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
    if (submitted || submitting) return;

    if (!user) {
      setSubmitError('You must be logged in to submit the quiz.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const finalTimeSpent = Math.floor(
      (Date.now() - startTime) / 1000
    );

    let correctAnswers = 0;
    const answerDetails = [];

    quiz.questions.forEach((question, index) => {
      const isCorrect =
        answers[index] === question.correctAnswer;
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
      await api.post('/results', {
        quiz: id,
        score: correctAnswers,
        total: quiz.questions.length,
        answers: answerDetails,
        timeSpent: finalTimeSpent
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
        'Failed to submit quiz.'
      );
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
    const answeredCount = Object.keys(answers).filter(
      key => answers[key] !== undefined
    ).length;

    return Math.round(
      (answeredCount / quiz.questions.length) * 100
    );
  };

  const getPerformanceFeedback = (percentage) => {
    if (percentage >= 90) return "Outstanding performance! Perfectly done with excellent understanding and accuracy.";
    if (percentage >= 80) return "Excellent work! Strong concepts and very good execution.";
    if (percentage >= 70) return "Very good performance. Concepts are clear, minor improvement needed.";
    if (percentage >= 60) return "Good effort. Basic understanding is present, keep practicing.";
    if (percentage >= 50) return "Average performance. Needs more focus and revision.";
    if (percentage >= 40) return "Below average. Significant improvement required.";
    return "Poor performance. More preparation and guidance needed.";
  };

  const getPerformanceEmoji = (percentage) => {
    if (percentage >= 90) return "🎉";
    if (percentage >= 80) return "👍";
    if (percentage >= 70) return "👏";
    if (percentage >= 60) return "🙂";
    if (percentage >= 50) return "🤔";
    if (percentage >= 40) return "📚";
    return "💪";
  };
  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <div className="dashboard-section">
            <div className="loading" style={{
              textAlign: 'center',
              padding: '3rem',
              background: isDarkMode ? 'var(--card-bg-dark)' : 'var(--card-bg)',
              border: `1px solid ${isDarkMode ? 'var(--border-dark)' : 'var(--border)'}`,
              borderRadius: '16px',
              boxShadow: isDarkMode ? '0 4px 16px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.1)'
            }}>
              <Loader2
                size={48}
                className="loading-spinner"
                style={{
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem',
                  color: 'var(--primary)'
                }}
              />
              <div style={{
                fontSize: '1.2rem',
                color: isDarkMode ? '#ffffff' : 'var(--black)',
                fontWeight: '500'
              }}>
                Loading quiz...
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!quiz && !loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <div className="dashboard-section">
            <div className="empty-state enhanced" style={{
              textAlign: 'center',
              padding: '3rem',
              background: isDarkMode ? 'var(--card-bg-dark)' : 'var(--card-bg)',
              border: `1px solid ${isDarkMode ? 'var(--border-dark)' : 'var(--border)'}`,
              borderRadius: '16px',
              boxShadow: isDarkMode ? '0 4px 16px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.1)'
            }}>
              <AlertCircle size={64} style={{ color: isDarkMode ? 'var(--primary)' : 'var(--primary)', marginBottom: '1.5rem' }} />
              <h3 style={{
                color: isDarkMode ? '#ffffff' : 'var(--black)',
                marginBottom: '1rem',
                fontSize: '1.8rem',
                fontWeight: '700'
              }}>
                Quiz Not Found
              </h3>
              <p style={{
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'var(--gray-600)',
                marginBottom: '2rem',
                fontSize: '1rem',
                lineHeight: '1.6'
              }}>
                {submitError || "The quiz you're looking for doesn't exist or may have been removed."}
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  margin: '0 auto'
                }}
              >
                <Home size={18} /> Back to Dashboard
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ---------------- RESULT SCREEN ---------------- */
  if (submitted) {
    const percentage = Math.round(
      (score / quiz.questions.length) * 100
    );

    const isExcellent = percentage >= 80;
    const isGood = percentage >= 60;
    const performanceColor = isExcellent ? 'var(--success)' : isGood ? 'var(--warning)' : 'var(--error)';
    const performanceBg = isExcellent ? 'rgba(16,185,129,0.1)' : isGood ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';
    const performanceIcon = isExcellent ? '🎉' : isGood ? '👍' : '📚';

    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <div className="dashboard-section text-center">
            <div className="card" style={{
              background: isDarkMode ? 'var(--card-bg-dark)' : 'var(--card-bg)',
              border: `1px solid ${isDarkMode ? 'var(--border-dark)' : 'var(--border)'}`,
              borderRadius: '16px',
              padding: '3rem',
              maxWidth: '600px',
              margin: '0 auto',
              boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: '1rem',
                animation: 'bounce 1s ease-in-out'
              }}>
                {getPerformanceEmoji(percentage)}
              </div>

              <div style={{
                padding: '1.5rem',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: `2px solid ${performanceColor}20`,
                marginBottom: '2rem',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: isDarkMode ? '#ffffff' : 'var(--black)',
                  marginBottom: '0.5rem'
                }}>
                  Performance Feedback
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'var(--gray-700)',
                  lineHeight: '1.5'
                }}>
                  {getPerformanceFeedback(percentage)}
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  background: performanceBg,
                  border: `2px solid ${performanceColor}30`
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: performanceColor }}>
                    {percentage}%
                  </div>
                  <div style={{ fontSize: '0.9rem', color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'var(--gray-600)' }}>
                    Score
                  </div>
                </div>

                <div style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  background: 'rgba(99,102,241,0.1)',
                  border: '2px solid rgba(99,102,241,0.3)'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>
                    {score}/{quiz.questions.length}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'var(--gray-600)' }}>
                    Correct
                  </div>
                </div>

                <div style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  background: 'rgba(139,92,246,0.1)',
                  border: '2px solid rgba(139,92,246,0.3)'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--secondary)' }}>
                    {formatTime(timeSpent)}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'var(--gray-600)' }}>
                    Time Spent
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/dashboard')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: '600'
                  }}
                >
                  <Home size={18} /> Dashboard
                </button>

                <button
                  className="btn btn-outline"
                  onClick={() => navigate(`/my-results/${quiz._id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: '600'
                  }}
                >
                  <Trophy size={18} /> View Detailed Results
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ---------------- QUIZ SCREEN ---------------- */
  const question = quiz.questions[currentQuestion];
  const answeredCount = Object.keys(answers).filter(
    key => answers[key] !== undefined
  ).length;

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        <div className="dashboard-section">

          {/* HEADER */}
          <div className="card mb-6" style={{
            background: isDarkMode ? 'var(--card-bg-dark)' : 'var(--card-bg)',
            border: `1px solid ${isDarkMode ? 'var(--border-dark)' : 'var(--border)'}`,
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: isDarkMode ? '0 4px 16px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2 style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: isDarkMode ? '#ffffff' : 'var(--black)',
                  margin: 0
                }}>
                  {quiz.title}
                </h2>
                <p style={{
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'var(--gray-600)',
                  margin: '0.5rem 0'
                }}>
                  {quiz.subject}
                </p>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontSize: '0.9rem',
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'var(--gray-700)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={16} />
                  <span>Time Left: {formatTime(quizTimeLeft)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={16} />
                  <span>Spent: {formatTime(timeSpent)}</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontWeight: '600', color: isDarkMode ? '#ffffff' : 'var(--black)' }}>
                  Progress
                </span>
                <span style={{ fontSize: '0.9rem', color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'var(--gray-600)' }}>
                  {getProgressPercentage()}%
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${getProgressPercentage()}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>
          </div>

          {/* QUESTION */}
          <div className="card" style={{
            background: isDarkMode ? 'var(--card-bg-dark)' : 'var(--card-bg)',
            border: `1px solid ${isDarkMode ? 'var(--border-dark)' : 'var(--border)'}`,
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: isDarkMode ? '0 4px 16px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.1)'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: '600',
                color: isDarkMode ? '#ffffff' : 'var(--black)',
                marginBottom: '0.5rem'
              }}>
                Question {currentQuestion + 1} of {quiz.questions.length}
              </h3>
              <p style={{
                fontSize: '1.1rem',
                color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'var(--gray-800)',
                lineHeight: '1.6'
              }}>
                {question.question}
              </p>
            </div>

            <div className="options-grid" style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1rem'
            }}>
              {question.options.map((option, index) => (
                <label key={index} className="option-item" style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem 1.5rem',
                  border: `2px solid ${answers[currentQuestion] === index ? 'var(--primary)' : (isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)')}`,
                  borderRadius: '12px',
                  background: answers[currentQuestion] === index ? 'rgba(99,102,241,0.1)' : (isDarkMode ? 'rgba(255,255,255,0.05)' : 'transparent'),
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '1rem',
                  color: isDarkMode ? '#ffffff' : 'var(--black)'
                }}>
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    checked={answers[currentQuestion] === index}
                    onChange={() =>
                      handleAnswerSelect(currentQuestion, index)
                    }
                    style={{ marginRight: '12px', accentColor: 'var(--primary)' }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="quiz-navigation" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '2rem',
            padding: '1.5rem',
            background: isDarkMode ? 'var(--card-bg-dark)' : 'var(--card-bg)',
            border: `1px solid ${isDarkMode ? 'var(--border-dark)' : 'var(--border)'}`,
            borderRadius: '12px',
            boxShadow: isDarkMode ? '0 4px 16px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.1)'
          }}>
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="btn btn-outline"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '8px',
                fontWeight: '600',
                opacity: currentQuestion === 0 ? 0.5 : 1,
                cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronLeft size={18} /> Previous
            </button>

            <div style={{
              fontSize: '0.9rem',
              color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'var(--gray-600)',
              fontWeight: '500'
            }}>
              {answeredCount} of {quiz.questions.length} answered
            </div>

            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={
                  answeredCount !== quiz.questions.length || submitting
                }
                className="btn btn-success"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  background: answeredCount === quiz.questions.length && !submitting ? '#23c074' : '#666',
                  color: 'white',
                  border: 'none',
                  cursor: answeredCount === quiz.questions.length && !submitting ? 'pointer' : 'not-allowed',
                  opacity: 1
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="loading-spinner" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Submit Quiz
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={answers[currentQuestion] === undefined}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  opacity: answers[currentQuestion] === undefined ? 0.5 : 1,
                  cursor: answers[currentQuestion] === undefined ? 'not-allowed' : 'pointer'
                }}
              >
                Next <ChevronRight size={18} />
              </button>
            )}
          </div>

          {submitError && (
            <div className="error-box" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '1rem 1.5rem',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px',
              color: 'var(--error)',
              marginTop: '1rem',
              fontWeight: '500'
            }}>
              <AlertCircle size={18} /> {submitError}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TakeQuiz;
