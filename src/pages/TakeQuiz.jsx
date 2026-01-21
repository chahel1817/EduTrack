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
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

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
      console.log('⚙️ Settings:', {
        limit: res.data.timeLimit,
        enableQTimer: res.data.enableQuestionTimeLimit,
        qLimit: res.data.questionTimeLimit
      });

      if (!res.data) {
        console.error('Quiz data is null');
        setLoading(false);
        return;
      }

      setQuiz(res.data);
      // Only set start time if not already set (prevents reset on re-renders if logic changes)
      if (!startTime) setStartTime(Date.now());

      if (res.data.timeLimit) {
        const quizLimit = res.data.timeLimit * 60;
        console.log(`⏱️ Setting Total Timer: ${res.data.timeLimit} mins -> ${quizLimit} seconds`);
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

    // Reset question time left when question changes
    const limit = quiz.questions[currentQuestion]?.timeLimit || quiz.questionTimeLimit || 30;
    setQuestionTimeLeft(limit);

    // Flag to prevent double-skipping
    let alreadyJumped = false;

    const interval = setInterval(() => {
      setQuestionTimeLeft((prev) => {
        if (prev <= 1) {
          if (!alreadyJumped) {
            alreadyJumped = true;
            clearInterval(interval);
            if (currentQuestion < quiz.questions.length - 1) {
              setCurrentQuestion(q => q + 1);
            } else {
              handleSubmit();
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestion, quiz, submitted]);

  /* ---------------- QUIZ TIMER ---------------- */
  useEffect(() => {
    // Safety check: ensure we have valid numbers
    if (!quizTimeLimit || !startTime || submitted) return;

    console.log(`🕒 Timer Running: Limit=${quizTimeLimit}s, Start=${new Date(startTime).toLocaleTimeString()}`);

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = quizTimeLimit - elapsed;

      // Debug log every 30 seconds
      if (remaining % 30 === 0) {
        console.log(`⏳ Time Remaining: ${remaining}s`);
      }

      if (remaining <= 0) {
        console.warn("⚠️ Timer Expired! Submitting quiz...", { remaining, limit: quizTimeLimit, elapsed });
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      // If quiz has allowBack: false, we shouldn't allow going back
      // If enableQuestionTimeLimit is true, we also usually don't allow going back
      if (quiz.allowBack === false || quiz.enableQuestionTimeLimit) {
        return;
      }
      setCurrentQuestion(currentQuestion - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    setShowSubmitConfirm(false);

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
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
        'Failed to submit quiz.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const confirmSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < quiz.questions.length) {
      setShowSubmitConfirm(true);
    } else {
      handleSubmit();
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
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
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
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
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

    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <div className="dashboard-section text-center">
            <div className="card" style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '3rem',
              maxWidth: '650px',
              margin: '0 auto',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{
                fontSize: '5rem',
                marginBottom: '1rem',
                animation: 'bounce 1s ease-in-out'
              }}>
                {getPerformanceEmoji(percentage)}
              </div>

              <div style={{
                padding: '1.5rem',
                borderRadius: '16px',
                background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'var(--gray-50)',
                border: `1px solid ${performanceColor}30`,
                marginBottom: '2rem',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  color: 'var(--gray-900)',
                  marginBottom: '0.5rem'
                }}>
                  Performance Feedback
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: 'var(--gray-600)',
                  lineHeight: '1.6'
                }}>
                  {getPerformanceFeedback(percentage)}
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2.5rem'
              }}>
                <div style={{
                  padding: '1.5rem',
                  borderRadius: '16px',
                  background: performanceBg,
                  border: `2px solid ${performanceColor}20`
                }}>
                  <div style={{ fontSize: '2.2rem', fontWeight: '800', color: performanceColor }}>
                    {percentage}%
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--gray-500)' }}>
                    Accuracy
                  </div>
                </div>

                <div style={{
                  padding: '1.5rem',
                  borderRadius: '16px',
                  background: 'rgba(109,40,241,0.08)',
                  border: '2px solid rgba(109,40,241,0.15)'
                }}>
                  <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--primary)' }}>
                    {score}/{quiz.questions.length}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--gray-500)' }}>
                    Correct Answers
                  </div>
                </div>

                <div style={{
                  padding: '1.5rem',
                  borderRadius: '16px',
                  background: 'rgba(6,182,212,0.08)',
                  border: '2px solid rgba(6,182,212,0.15)'
                }}>
                  <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--accent)' }}>
                    {formatTime(timeSpent)}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--gray-500)' }}>
                    Time Taken
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
                  style={{ padding: '14px 28px', borderRadius: '12px' }}
                >
                  <Home size={18} /> Back to Home
                </button>

                <button
                  className="btn btn-outline"
                  onClick={() => navigate(`/my-results/${quiz._id}`)}
                  style={{ padding: '14px 28px', borderRadius: '12px' }}
                >
                  <Trophy size={18} /> Full Analysis
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
      <main className="dashboard-main animate-fade-in">
        <div className="dashboard-section" style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: 0 }}>

          {/* TIMER & PROGRESS STICKY BAR */}
          <div className="glass-card" style={{
            position: 'sticky',
            top: '80px',
            zIndex: 10,
            padding: '16px 24px',
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ background: 'var(--primary)', color: 'white', padding: '8px', borderRadius: '10px' }}>
                <BookOpen size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{quiz.title}</h3>
                <span style={{ fontSize: '12px', color: 'var(--gray-500)' }}>{quiz.subject}</span>
              </div>
            </div>

            <div style={{ flex: 1, maxWidth: '400px', margin: '0 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px', fontWeight: 700 }}>
                <span>Progress</span>
                <span>{getProgressPercentage()}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--gray-200)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${getProgressPercentage()}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent))', transition: 'width 0.3s ease' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--gray-100)', borderRadius: '10px', color: 'var(--gray-700)', fontWeight: 700 }}>
                <Clock size={16} />
                <span>{formatTime(quizTimeLimit ? quizTimeLeft : timeSpent)}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px', alignItems: 'start' }}>

            {/* MAIN QUESTION SECTION */}
            <div className="glass-card" style={{ padding: '40px' }}>
              <div style={{ marginBottom: '30px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </span>
                {quiz.enableQuestionTimeLimit && (
                  <div style={{
                    float: 'right',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    background: questionTimeLeft < 10 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(109, 40, 217, 0.1)',
                    borderRadius: '8px',
                    color: questionTimeLeft < 10 ? 'var(--error)' : 'var(--primary)',
                    fontWeight: 800
                  }}>
                    <Clock size={16} />
                    <span>{questionTimeLeft}s remaining</span>
                  </div>
                )}
                <h2 style={{ fontSize: '28px', fontWeight: 800, marginTop: '20px', lineHeight: 1.3, color: 'var(--gray-900)' }}>
                  {question.question}
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {question.options.map((option, index) => (
                  <label key={index} className="option-item" style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '20px 24px',
                    border: `2px solid ${answers[currentQuestion] === index ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: '16px',
                    background: answers[currentQuestion] === index ? 'rgba(109,40,217,0.05)' : 'var(--card-bg)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      checked={answers[currentQuestion] === index}
                      onChange={() => handleAnswerSelect(currentQuestion, index)}
                      style={{ marginRight: '16px', width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                    />
                    <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--gray-800)' }}>{option}</span>
                    {answers[currentQuestion] === index && (
                      <div style={{ position: 'absolute', right: '20px', color: 'var(--primary)' }}>
                        <CheckCircle2 size={24} />
                      </div>
                    )}
                  </label>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '30px', borderTop: '1px solid var(--border)' }}>
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0 || quiz.allowBack === false || quiz.enableQuestionTimeLimit}
                  className="btn btn-outline"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    opacity: (currentQuestion === 0 || quiz.allowBack === false || quiz.enableQuestionTimeLimit) ? 0.3 : 1,
                    cursor: (currentQuestion === 0 || quiz.allowBack === false || quiz.enableQuestionTimeLimit) ? 'not-allowed' : 'pointer',
                    display: quiz.allowBack === false ? 'none' : 'flex'
                  }}
                >
                  <ChevronLeft size={20} /> Previous
                </button>

                <div style={{ display: 'flex', gap: '12px' }}>
                  {currentQuestion < quiz.questions.length - 1 && (
                    <button
                      onClick={confirmSubmit}
                      className="btn btn-outline"
                      style={{ padding: '12px 24px', borderRadius: '12px', color: 'var(--error)', borderColor: 'var(--error)' }}
                    >
                      <Send size={18} /> Submit Early
                    </button>
                  )}

                  {currentQuestion === quiz.questions.length - 1 ? (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="btn btn-primary"
                      style={{ padding: '14px 32px', borderRadius: '12px', background: 'var(--success)', border: 'none', boxShadow: '0 10px 20px rgba(16,185,129,0.2)' }}
                    >
                      {submitting ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> Finish Quiz</>}
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      disabled={answers[currentQuestion] === undefined}
                      className="btn btn-primary"
                      style={{ padding: '12px 32px', borderRadius: '12px' }}
                    >
                      Next Question <ChevronRight size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* SIDEBAR: NAVIGATION DOTS */}
            <aside className="glass-card" style={{ padding: '24px' }}>
              <h4 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: 700 }}>Question Map</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                {quiz.questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (quiz.allowBack === false && i < currentQuestion) return;
                      if (quiz.enableQuestionTimeLimit && i < currentQuestion) return;
                      setCurrentQuestion(i);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={(quiz.allowBack === false && i < currentQuestion) || (quiz.enableQuestionTimeLimit && i < currentQuestion)}
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '10px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: ((quiz.allowBack === false || quiz.enableQuestionTimeLimit) && i < currentQuestion) ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      background: currentQuestion === i ? 'var(--primary)' : answers[i] !== undefined ? 'var(--success)' : 'var(--gray-100)',
                      color: currentQuestion === i ? 'white' : answers[i] !== undefined ? 'white' : 'var(--gray-400)',
                      opacity: ((quiz.allowBack === false || quiz.enableQuestionTimeLimit) && i < currentQuestion) ? 0.3 : 1
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: '30px', padding: '20px', borderRadius: '16px', background: 'var(--gray-50)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gray-600)', fontSize: '14px' }}>
                  <AlertCircle size={16} />
                  <span>Finalizing...</span>
                </div>
                <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: 'var(--gray-500)', lineHeight: '1.4' }}>
                  Make sure you've answered all questions before submitting.
                </p>
              </div>
            </aside>
          </div>

          {submitError && (
            <div className="auth-error" style={{ marginTop: '20px' }}>
              <AlertCircle size={18} /> {submitError}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* CONFIRM SUBMISSION DIALOG */}
      {showSubmitConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-card" style={{ padding: '32px', maxWidth: '400px', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--error)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <AlertCircle size={32} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>Submit Early?</h3>
            <p style={{ color: 'var(--gray-500)', marginBottom: '24px', lineHeight: 1.5 }}>
              Are you sure you want to submit early? There are still questions left.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn btn-outline"
                style={{ flex: 1, padding: '12px' }}
                onClick={() => setShowSubmitConfirm(false)}
              >
                Go Back
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px', background: 'var(--error)', border: 'none' }}
                onClick={handleSubmit}
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeQuiz;
