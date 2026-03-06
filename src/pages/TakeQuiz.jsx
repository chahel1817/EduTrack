import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Clock,
  CheckCircle2,
  Home,
  Send,
  Loader2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Target,
  Trophy,
  BarChart3
} from 'lucide-react';
import './TakeQuiz.css';

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
  const [questionTimeLeft, setQuestionTimeLeft] = useState(30);
  const [quizTimeLeft, setQuizTimeLeft] = useState(null);
  const [quizTimeLimit, setQuizTimeLimit] = useState(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const submitRef = useRef(null);
  const questionDeadlineRef = useRef(null);

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      if (quiz.allowBack === false || quiz.enableQuestionTimeLimit) {
        return;
      }
      setCurrentQuestion((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = useCallback(async () => {
    if (submitted || submitting || !quiz) return;

    if (!user) {
      setSubmitError('You must be logged in to submit the quiz.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setShowSubmitConfirm(false);

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
      await api.post('/results', {
        quiz: id,
        score: correctAnswers,
        total: quiz.questions.length,
        answers: answerDetails,
        timeSpent: finalTimeSpent
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  }, [id, user, startTime, quiz, answers, submitted, submitting]);

  useEffect(() => {
    submitRef.current = handleSubmit;
  }, [handleSubmit]);

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
    if (!quiz?.questions?.length) return 0;
    const answeredCount = Object.keys(answers).filter((key) => answers[key] !== undefined).length;
    return Math.round((answeredCount / quiz.questions.length) * 100);
  };

  const getPerformanceFeedback = (percentage) => {
    if (percentage >= 90) return 'Outstanding performance with excellent accuracy.';
    if (percentage >= 80) return 'Excellent work. Your concepts are strong and clear.';
    if (percentage >= 70) return 'Very good performance. Minor improvement is needed.';
    if (percentage >= 60) return 'Good effort. Keep practicing to improve consistency.';
    if (percentage >= 50) return 'Average performance. More revision is recommended.';
    if (percentage >= 40) return 'Below average. Focus on fundamentals and practice.';
    return 'Needs improvement. Review concepts and attempt again.';
  };

  const fetchQuiz = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await api.get(`/quizzes/${id}`);

      if (!res.data) {
        setLoading(false);
        return;
      }

      setQuiz(res.data);
      if (!startTime) setStartTime(Date.now());

      if (res.data.timeLimit) {
        const quizLimit = res.data.timeLimit * 60;
        setQuizTimeLimit(quizLimit);
        setQuizTimeLeft(quizLimit);
      }
    } catch (err) {
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

  useEffect(() => {
    if (!startTime || submitted) return;

    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, submitted]);

  useEffect(() => {
    if (!quiz || submitted || !quiz.enableQuestionTimeLimit) return;

    const limit = quiz.questions[currentQuestion]?.timeLimit || quiz.questionTimeLimit || 30;
    questionDeadlineRef.current = Date.now() + limit * 1000;
    setQuestionTimeLeft(limit);

    const interval = setInterval(() => {
      const remainingMs = questionDeadlineRef.current - Date.now();
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

      setQuestionTimeLeft(remainingSec);

      if (remainingMs <= 0) {
        clearInterval(interval);
        if (currentQuestion < quiz.questions.length - 1) {
          setCurrentQuestion((q) => q + 1);
        } else {
          submitRef.current?.();
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentQuestion, quiz, submitted]);

  useEffect(() => {
    if (!quizTimeLimit || !startTime || submitted) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = quizTimeLimit - elapsed;

      if (remaining <= 0) {
        clearInterval(interval);
        submitRef.current?.();
      } else {
        setQuizTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [quizTimeLimit, submitted, startTime]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <section className="tq-center-card">
            <Loader2 size={42} className="tq-spinner" />
            <h3>Loading quiz</h3>
            <p>Please wait while we prepare your questions.</p>
          </section>
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
          <section className="tq-center-card tq-center-card--error">
            <AlertCircle size={50} />
            <h3>Quiz Not Found</h3>
            <p>{submitError || "The quiz you requested does not exist or is no longer available."}</p>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary tq-btn-inline">
              <Home size={18} /> Back to Dashboard
            </button>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    const percentage = Math.round((score / quiz.questions.length) * 100);

    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <section className="tq-result">
            <div className="tq-result-header">
              <div className="tq-result-icon">
                <Trophy size={30} />
              </div>
              <h2>Quiz Completed</h2>
              <p>{getPerformanceFeedback(percentage)}</p>
            </div>

            <div className="tq-result-grid">
              <div className="tq-result-stat tq-result-stat--primary">
                <span>Score</span>
                <strong>{score}/{quiz.questions.length}</strong>
              </div>
              <div className="tq-result-stat tq-result-stat--success">
                <span>Accuracy</span>
                <strong>{percentage}%</strong>
              </div>
              <div className="tq-result-stat tq-result-stat--accent">
                <span>Time Taken</span>
                <strong>{formatTime(timeSpent)}</strong>
              </div>
            </div>

            <div className="tq-result-actions">
              <button className="btn btn-primary tq-btn-inline" onClick={() => navigate('/dashboard')}>
                <Home size={18} /> Dashboard
              </button>
              <button className="btn btn-outline tq-btn-inline" onClick={() => navigate(`/my-results/${quiz._id}`)}>
                <BarChart3 size={18} /> View Analysis
              </button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const questionLimit = quiz.questions[currentQuestion]?.timeLimit || quiz.questionTimeLimit || 30;

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main animate-fade-in">
        <div className="tq-page">
          <section className="tq-hero glass-card">
            <div className="tq-hero-main">
              <div className="tq-hero-icon">
                <BookOpen size={24} />
              </div>
              <div>
                <h1>{quiz.title}</h1>
                <p>
                  <Target size={14} /> {quiz.subject || 'General Quiz'}
                </p>
              </div>
            </div>

            <div className="tq-hero-progress">
              <div className="tq-hero-progress-top">
                <span>Answered {answeredCount}/{quiz.questions.length}</span>
                <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
              </div>
              <div className="tq-progress-track">
                <div
                  className="tq-progress-fill"
                  style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="tq-hero-timers">
              <div className={`tq-timer-chip ${quizTimeLimit && quizTimeLeft < 60 ? 'is-danger' : ''}`}>
                <Clock size={16} />
                <span>{formatTime(quizTimeLimit ? quizTimeLeft : timeSpent)}</span>
              </div>
              {quiz.enableQuestionTimeLimit && (
                <div className={`tq-timer-chip ${questionTimeLeft <= 10 ? 'is-danger' : ''}`}>
                  <span>Q: {questionTimeLeft}s</span>
                </div>
              )}
            </div>
          </section>

          <div className="tq-layout">
            <section className="tq-question glass-card">
              {quiz.enableQuestionTimeLimit && (
                <div
                  className="tq-question-timer-bar"
                  style={{
                    width: `${(questionTimeLeft / questionLimit) * 100}%`
                  }}
                />
              )}

              <header className="tq-question-header">
                <div className="tq-question-kicker">Question {currentQuestion + 1}</div>
                <h2>{question.question}</h2>
              </header>

              <div className="tq-options">
                {question.options.map((option, index) => {
                  const isSelected = answers[currentQuestion] === index;
                  return (
                    <label
                      key={index}
                      className={`tq-option ${isSelected ? 'is-selected' : ''}`}
                    >
                      <span className="tq-option-letter">{String.fromCharCode(65 + index)}</span>
                      <span className="tq-option-text">{option}</span>
                      <input
                        type="radio"
                        className="tq-option-input"
                        name={`q-${currentQuestion}`}
                        checked={isSelected}
                        onChange={() => handleAnswerSelect(currentQuestion, index)}
                      />
                      {isSelected && <CheckCircle2 size={20} className="tq-option-check" />}
                    </label>
                  );
                })}
              </div>

              <footer className="tq-actions">
                {quiz.allowBack !== false && !quiz.enableQuestionTimeLimit ? (
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="btn tq-btn-secondary tq-btn-inline"
                  >
                    <ChevronLeft size={18} /> Previous
                  </button>
                ) : (
                  <span className="tq-back-locked">Backward navigation is disabled</span>
                )}

                <div className="tq-actions-right">
                  {currentQuestion < quiz.questions.length - 1 && (
                    <button
                      onClick={confirmSubmit}
                      className="btn tq-btn-danger tq-btn-inline"
                    >
                      Submit Early
                    </button>
                  )}

                  {currentQuestion === quiz.questions.length - 1 ? (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="btn btn-primary tq-btn-inline"
                    >
                      {submitting ? <Loader2 size={18} className="tq-spinner" /> : <Send size={18} />}
                      {submitting ? 'Submitting...' : 'Submit Quiz'}
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      disabled={answers[currentQuestion] === undefined}
                      className="btn btn-primary tq-btn-inline"
                    >
                      Next <ChevronRight size={18} />
                    </button>
                  )}
                </div>
              </footer>
            </section>

            <aside className="tq-sidebar">
              <section className="tq-nav glass-card">
                <h4>Question Navigator</h4>
                <div className="tq-nav-grid">
                  {quiz.questions.map((_, i) => {
                    const locked =
                      (quiz.allowBack === false && i < currentQuestion) ||
                      (quiz.enableQuestionTimeLimit && i < currentQuestion);

                    const className = [
                      'tq-nav-item',
                      currentQuestion === i ? 'is-current' : '',
                      answers[i] !== undefined ? 'is-answered' : '',
                      locked ? 'is-locked' : ''
                    ].filter(Boolean).join(' ');

                    return (
                      <button
                        key={i}
                        onClick={() => {
                          if (locked) return;
                          setCurrentQuestion(i);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={locked}
                        className={className}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="tq-legend">
                  <span><i className="dot current" />Current</span>
                  <span><i className="dot answered" />Answered</span>
                  <span><i className="dot pending" />Pending</span>
                </div>
              </section>

              <section className="tq-summary glass-card">
                <h4>Progress Summary</h4>
                <div className="tq-summary-row">
                  <span>Completion</span>
                  <strong>{getProgressPercentage()}%</strong>
                </div>
                <div className="tq-summary-row">
                  <span>Answered</span>
                  <strong>{answeredCount}</strong>
                </div>
                <div className="tq-summary-row">
                  <span>Remaining</span>
                  <strong>{quiz.questions.length - answeredCount}</strong>
                </div>
              </section>
            </aside>
          </div>

          {submitError && (
            <div className="auth-error tq-error-inline">
              <AlertCircle size={18} /> {submitError}
            </div>
          )}
        </div>

        {showSubmitConfirm && (
          <div className="tq-modal-wrap">
            <button
              className="tq-modal-backdrop"
              onClick={() => setShowSubmitConfirm(false)}
              aria-label="Close confirmation"
            />
            <div className="tq-modal glass-card">
              <div className="tq-modal-icon">
                <AlertCircle size={30} />
              </div>
              <h3>Submit Quiz Now?</h3>
              <p>
                You still have {quiz.questions.length - answeredCount} unanswered question(s). You can submit now, but your score may be affected.
              </p>
              <div className="tq-modal-actions">
                <button onClick={handleSubmit} className="btn tq-btn-danger tq-btn-inline">
                  Confirm Submit
                </button>
                <button onClick={() => setShowSubmitConfirm(false)} className="btn tq-btn-secondary tq-btn-inline">
                  Continue Quiz
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
