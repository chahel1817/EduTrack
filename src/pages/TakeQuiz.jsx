import { useState, useEffect, useCallback } from 'react';
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
  const fetchQuiz = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/quizzes/${id}`);

      if (!res.data) {
        setLoading(false);
        return;
      }

      setQuiz(res.data);
      // Only set start time if not already set (prevents reset on re-renders if logic changes)
      if (!startTime) setStartTime(Date.now());

      if (res.data.timeLimit) {
        const quizLimit = res.data.timeLimit * 60;
        setQuizTimeLimit(quizLimit);
        setQuizTimeLeft(quizLimit);
      }
    } catch (err) {
      console.error('Failed to fetch quiz:', err);
      // Set error state so user sees proper error message
      if (err.response?.status === 403) {
        setSubmitError('You do not have permission to access this quiz.');
      } else {
        setSubmitError(err.response?.data?.message || 'Failed to load quiz. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [id, startTime]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

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
  }, [currentQuestion, quiz, submitted, handleSubmit]);

  /* ---------------- QUIZ TIMER ---------------- */
  useEffect(() => {
    // Safety check: ensure we have valid numbers
    if (!quizTimeLimit || !startTime || submitted) return;

    console.log(`ðŸ•’ Timer Running: Limit=${quizTimeLimit}s, Start=${new Date(startTime).toLocaleTimeString()}`);

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = quizTimeLimit - elapsed;

      // Debug log every 30 seconds
      if (remaining % 30 === 0) {
        console.log(`Time Remaining: ${remaining}s`);
      }

      if (remaining <= 0) {
        clearInterval(interval);
        handleSubmit();
      } else {
        setQuizTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [quizTimeLimit, submitted, startTime, handleSubmit]);

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

  const handleSubmit = useCallback(async () => {
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
  }, [id, user, startTime, quiz, answers, submitted, submitting]);

  const confirmSubmit = useCallback(() => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < quiz?.questions?.length) {
      setShowSubmitConfirm(true);
    } else {
      handleSubmit();
    }
  }, [answers, quiz, handleSubmit]);

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
    if (percentage >= 90) return "ðŸŽ‰";
    if (percentage >= 80) return "ðŸ‘";
    if (percentage >= 70) return "ðŸ‘";
    if (percentage >= 60) return "ðŸ™‚";
    if (percentage >= 50) return "ðŸ¤”";
    if (percentage >= 40) return "ðŸ“š";
    return "ðŸ’ª";
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

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main animate-fade-in">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

          {/* STRATEGIC STATUS BAR (Sticky) */}
          <section className="glass-card" style={{
            position: 'sticky',
            top: '100px',
            zIndex: 100,
            padding: '24px 32px',
            borderRadius: '24px',
            marginBottom: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '30px',
            border: '1px solid var(--border)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '56px', height: '56px', background: 'var(--primary)', color: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(109,40,217,0.2)' }}>
                <BookOpen size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: 'var(--gray-900)' }}>{quiz.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray-500)', fontSize: '13px', fontWeight: 700 }}>
                  <Target size={14} /> <span>{quiz.subject}</span>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, maxWidth: '400px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--gray-400)', letterSpacing: '0.05em' }}>
                <span>Accuracy Focus: {getProgressPercentage()}%</span>
                <span>{currentQuestion + 1} / {quiz.questions.length}</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'var(--gray-100)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent))', borderRadius: '99px', transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="glass-card" style={{ padding: '12px 20px', borderRadius: '14px', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', gap: '10px', color: (quizTimeLimit && quizTimeLeft < 60) ? 'var(--error)' : 'var(--gray-700)', fontWeight: 800 }}>
                <Clock size={18} className={(quizTimeLimit && quizTimeLeft < 60) ? 'animate-pulse' : ''} />
                <span style={{ fontSize: '16px', fontFamily: 'monospace' }}>{formatTime(quizTimeLimit ? quizTimeLeft : timeSpent)}</span>
              </div>
            </div>
          </section>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '40px', alignItems: 'start', paddingBottom: '100px' }}>

            {/* MAIN QUESTION INTERFACE */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div className="glass-card" style={{ padding: '60px', borderRadius: '40px', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>

                {quiz.enableQuestionTimeLimit && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '4px',
                    background: questionTimeLeft < 10 ? 'var(--error)' : 'var(--primary)',
                    width: `${(questionTimeLeft / (quiz.questions[currentQuestion]?.timeLimit || quiz.questionTimeLimit || 30)) * 100}%`,
                    transition: 'width 1s linear, background 0.3s'
                  }} />
                )}

                <div style={{ marginBottom: '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <span style={{ padding: '6px 14px', background: 'rgba(109, 40, 217, 0.1)', color: 'var(--primary)', borderRadius: '10px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>
                      Assessment Stage {currentQuestion + 1}
                    </span>
                    {quiz.enableQuestionTimeLimit && (
                      <span style={{
                        padding: '6px 14px',
                        background: questionTimeLeft < 10 ? 'rgba(239, 68, 68, 0.1)' : 'var(--gray-100)',
                        color: questionTimeLeft < 10 ? 'var(--error)' : 'var(--gray-600)',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 800
                      }}>
                        {questionTimeLeft}s Remaining
                      </span>
                    )}
                  </div>
                  <h2 style={{ fontSize: '32px', fontWeight: 900, lineHeight: 1.25, color: 'var(--gray-900)' }}>
                    {question.question}
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {question.options.map((option, index) => (
                    <label
                      key={index}
                      className={`hover-lift ${answers[currentQuestion] === index ? 'selected-option' : ''}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '24px 32px',
                        border: '2px solid' + (answers[currentQuestion] === index ? ' var(--primary)' : ' var(--border)'),
                        borderRadius: '24px',
                        background: answers[currentQuestion] === index ? 'rgba(109,40,217,0.05)' : 'var(--card-bg)',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative'
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        border: '2px solid' + (answers[currentQuestion] === index ? ' var(--primary)' : ' var(--gray-200)'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '20px',
                        fontSize: '14px',
                        fontWeight: 900,
                        background: answers[currentQuestion] === index ? 'var(--primary)' : 'transparent',
                        color: answers[currentQuestion] === index ? 'white' : 'var(--gray-400)'
                      }}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gray-800)', flex: 1 }}>{option}</span>
                      <input
                        type="radio"
                        className="hidden"
                        name={`q-${currentQuestion}`}
                        checked={answers[currentQuestion] === index}
                        onChange={() => handleAnswerSelect(currentQuestion, index)}
                      />
                      {answers[currentQuestion] === index && <CheckCircle2 size={24} color="var(--primary)" />}
                    </label>
                  ))}
                </div>

                <div style={{ marginTop: '50px', paddingTop: '40px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0 || quiz.allowBack === false || quiz.enableQuestionTimeLimit}
                    className="btn"
                    style={{
                      display: (quiz.allowBack === false || quiz.enableQuestionTimeLimit) ? 'none' : 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '16px 28px',
                      borderRadius: '16px',
                      background: 'var(--gray-100)',
                      color: 'var(--gray-600)',
                      fontWeight: 800,
                      opacity: currentQuestion === 0 ? 0.3 : 1
                    }}
                  >
                    <ChevronLeft size={20} /> Back
                  </button>

                  <div style={{ display: 'flex', gap: '16px', marginLeft: 'auto' }}>
                    {currentQuestion < quiz.questions.length - 1 && (
                      <button
                        onClick={confirmSubmit}
                        className="btn"
                        style={{ padding: '16px 24px', borderRadius: '16px', color: 'var(--error)', background: 'rgba(239, 68, 68, 0.05)', fontWeight: 800, border: 'none' }}
                      >
                        Abandon Early
                      </button>
                    )}

                    {currentQuestion === quiz.questions.length - 1 ? (
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="btn btn-primary"
                        style={{ padding: '16px 48px', borderRadius: '16px', fontSize: '18px', fontWeight: 900, background: 'var(--success)', border: 'none', boxShadow: '0 15px 30px rgba(16,185,129,0.25)' }}
                      >
                        {submitting ? <Loader2 size={24} className="animate-spin" /> : <><Send size={20} /> Deploy Submission</>}
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        disabled={answers[currentQuestion] === undefined}
                        className="btn btn-primary"
                        style={{
                          padding: '16px 48px',
                          borderRadius: '16px',
                          fontSize: '18px',
                          fontWeight: 900,
                          opacity: answers[currentQuestion] === undefined ? 0.5 : 1
                        }}
                      >
                        Advance quiz <ChevronRight size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="auth-error" style={{ borderRadius: '20px', padding: '20px 32px' }}>
                  <AlertCircle size={20} /> {submitError}
                </div>
              )}
            </div>

            {/* SIDE NAVIGATION PANEL */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'sticky', top: '260px' }}>
              <div className="glass-card" style={{ padding: '32px', borderRadius: '32px', border: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '24px', letterSpacing: '0.1em' }}>Neuro-Map</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
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
                        aspectRatio: '1',
                        borderRadius: '14px',
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: 900,
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        background: currentQuestion === i ? 'var(--primary)' : answers[i] !== undefined ? 'rgba(16, 185, 129, 0.1)' : 'var(--gray-50)',
                        color: currentQuestion === i ? 'white' : answers[i] !== undefined ? 'var(--success)' : 'var(--gray-400)',
                        transform: currentQuestion === i ? 'scale(1.1)' : 'scale(1)',
                        opacity: ((quiz.allowBack === false || quiz.enableQuestionTimeLimit) && i < currentQuestion) ? 0.3 : 1,
                        boxShadow: currentQuestion === i ? '0 8px 16px rgba(109,40,217,0.2)' : 'none'
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '28px', borderRadius: '24px', background: 'var(--gray-900)', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
                  <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>System Active</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--gray-400)', lineHeight: 1.6 }}>
                  Assessments are indexed in real-time. Unauthorized navigation or learning assistance may result in session invalidation.
                </p>
              </div>
            </aside>

          </div>
        </div>

        {/* SUBMISSION MODAL */}
        {showSubmitConfirm && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
              onClick={() => setShowSubmitConfirm(false)}
            />
            <div className="glass-card animate-scale-in" style={{ position: 'relative', zIndex: 1001, padding: '48px', maxWidth: '480px', textAlign: 'center', borderRadius: '40px' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <AlertCircle size={40} />
              </div>
              <h3 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '16px' }}>Terminal Submission?</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '16px', lineHeight: 1.6, marginBottom: '32px' }}>
                You have not documented results for all learning stages. Total accuracy will be negatively impacted by {quiz.questions.length - Object.keys(answers).length} pending fields.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={handleSubmit}
                  className="btn"
                  style={{ background: 'var(--error)', color: 'white', padding: '18px', borderRadius: '18px', fontWeight: 800, border: 'none' }}
                >
                  Confirm Premature Submission
                </button>
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="btn"
                  style={{ background: 'var(--gray-100)', color: 'var(--gray-600)', padding: '18px', borderRadius: '18px', fontWeight: 800, border: 'none' }}
                >
                  Return to Mission
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TakeQuiz;


