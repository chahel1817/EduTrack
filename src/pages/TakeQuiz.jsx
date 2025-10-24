import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(null);

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
    const finalTimeSpent = Math.floor((Date.now() - startTime) / 1000);
    let correctAnswers = 0;
    const answerDetails = [];
    
    quiz.questions.forEach((question, index) => {
      const isCorrect = answers[index] === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      
      answerDetails.push({
        questionIndex: index,
        selectedAnswer: answers[index] || -1,
        isCorrect,
        points: isCorrect ? 1 : 0
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
      console.error('Failed to submit result:', err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return Math.round((Object.keys(answers).length / quiz.questions.length) * 100);
  };

  if (loading) {
    return <div className="loading">Loading quiz...</div>;
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--black), var(--red-dark))' }}>
        <div className="card max-w-md w-full text-center">
          <h2 className="auth-title mb-4">Quiz Not Found</h2>
          <p className="text-lg mb-6" style={{ color: 'var(--black)' }}>
            The quiz you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--black), var(--red-dark))' }}>
        <div className="card max-w-lg w-full text-center">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
            {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
          </div>
          <h2 className="auth-title mb-4">Quiz Completed!</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <div className="card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--black)' }}>{score}</div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Correct</div>
            </div>
            <div className="card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--black)' }}>{quiz.questions.length}</div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Total</div>
            </div>
            <div className="card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--black)' }}>{percentage}%</div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Score</div>
            </div>
          </div>
          <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--gray-light)', borderRadius: '12px' }}>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '0.5rem' }}>Time Spent</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--black)' }}>
              {formatTime(timeSpent)}
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            🏠 Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen py-6" style={{ background: 'linear-gradient(135deg, var(--black), var(--red-dark))' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  {Object.keys(answers).length} of {quiz.questions.length} answered
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
                      {answers[currentQuestion] !== undefined ? '✓ Answered' : 'Not answered'}
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
                  {question.questionText}
                </h3>
                <div className="space-y-4">
                  {question.options.map((option, index) => (
                    <label 
                      key={index} 
                      className="flex items-center p-4 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                      style={{ 
                        border: '2px solid var(--border-gray)',
                        background: answers[currentQuestion] === index ? 'rgba(193, 18, 31, 0.05)' : 'var(--gray-light)',
                        borderColor: answers[currentQuestion] === index ? 'var(--red)' : 'var(--border-gray)'
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        value={index}
                        checked={answers[currentQuestion] === index}
                        onChange={() => handleAnswerSelect(currentQuestion, index)}
                        className="mr-4"
                        style={{ accentColor: 'var(--red)', transform: 'scale(1.3)' }}
                      />
                      <span style={{ 
                        color: 'var(--black)', 
                        fontSize: '16px',
                        fontWeight: answers[currentQuestion] === index ? '600' : '400'
                      }}>
                        {option}
                      </span>
                      {answers[currentQuestion] === index && (
                        <span style={{ 
                          marginLeft: 'auto', 
                          color: 'var(--red)', 
                          fontWeight: '600',
                          fontSize: '14px'
                        }}>
                          ✓ Selected
                        </span>
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
                <button
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length !== quiz.questions.length}
                  className="btn btn-success disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  🎯 Submit Quiz
                </button>
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
    </div>
  );
};

export default TakeQuiz;
