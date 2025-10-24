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
    
    if (user) {
      loadData();
    }
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

  if (loading) {
    return <div className="loading">Loading your dashboard...</div>;
  }

  const getAverageScore = () => {
    if (results.length === 0) return 0;
    const totalScore = results.reduce((sum, result) => sum + (result.score / result.total) * 100, 0);
    return Math.round(totalScore / results.length);
  };

  const getTotalQuizzes = () => {
    return user?.role === 'teacher' ? quizzes.length : quizzes.length;
  };

  const getCompletedQuizzes = () => {
    if (user?.role === 'student') {
      return results.length;
    }
    return results.length;
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      
      {/* Main Content */}
      <main className="dashboard-main">
        {/* Welcome Message for New Users */}
        {quizzes.length === 0 && results.length === 0 && (
          <section className="dashboard-section">
            <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>
                {user?.role === 'teacher' ? '👨‍🏫' : '🎓'}
              </div>
              <h2 className="auth-title" style={{ marginBottom: '1rem' }}>
                Welcome to EduTrack, {user?.name}!
              </h2>
              <p style={{ 
                fontSize: '18px', 
                color: '#64748b', 
                marginBottom: '2rem', 
                maxWidth: '600px', 
                margin: '0 auto 2rem auto',
                lineHeight: '1.6'
              }}>
                {user?.role === 'teacher' 
                  ? 'You\'re all set to start creating engaging quizzes for your students. Build your first quiz to begin your teaching journey with EduTrack!'
                  : 'You\'re ready to start learning! Your teachers will create quizzes for you to take. Check back regularly for new assignments and track your progress.'
                }
              </p>
              {user?.role === 'teacher' && (
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/create-quiz')}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    margin: '0 auto',
                    padding: '16px 32px',
                    fontSize: '16px'
                  }}
                >
                  🚀 Create Your First Quiz
                </button>
              )}
            </div>
          </section>
        )}

        {/* Statistics Cards - Only show if there's data */}
        {(quizzes.length > 0 || results.length > 0) && (
          <section className="dashboard-section">
            <h2>📊 Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--black)' }}>{getTotalQuizzes()}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                  {user?.role === 'teacher' ? 'Total Quizzes Created' : 'Available Quizzes'}
                </p>
              </div>
              <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--black)' }}>{getCompletedQuizzes()}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                  {user?.role === 'teacher' ? 'Total Submissions' : 'Quizzes Completed'}
                </p>
              </div>
              {user?.role === 'student' && results.length > 0 && (
                <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--black)' }}>{getAverageScore()}%</h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Average Score</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Quizzes Table */}
        <section className="dashboard-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>{user?.role === 'teacher' ? 'My Quizzes' : 'Available Quizzes'}</h2>
            {user?.role === 'teacher' && (
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/create-quiz')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                ➕ Create New Quiz
              </button>
            )}
          </div>
          <div className="table-container">
            {quizzes.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
                  {user?.role === 'teacher' ? '📝' : '📚'}
                </div>
                <h3>{user?.role === 'teacher' ? 'No Quizzes Created Yet' : 'No Quizzes Available'}</h3>
                <p style={{ marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
                  {user?.role === 'teacher' 
                    ? 'Start creating engaging quizzes for your students. Click the button above to create your first quiz and begin your teaching journey!'
                    : 'No quizzes have been created by your teachers yet. Check back later for new assignments and tests.'
                  }
                </p>
                {user?.role === 'teacher' && (
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/create-quiz')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}
                  >
                    ➕ Create Your First Quiz
                  </button>
                )}
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Questions</th>
                    <th>Created By</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz) => (
                    <tr key={quiz._id}>
                      <td style={{ fontWeight: '600' }}>{quiz.title}</td>
                      <td>
                        <span style={{ 
                          background: 'var(--gray-light)', 
                          padding: '4px 8px', 
                          borderRadius: '6px', 
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {quiz.subject}
                        </span>
                      </td>
                      <td>{quiz.questions?.length || 0} questions</td>
                      <td>{quiz.createdBy?.name}</td>
                      <td className="date">
                        {new Date(quiz.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {user?.role === 'student' && (
                            <button
                              className="btn btn-success"
                              onClick={() => navigate(`/quiz/${quiz._id}`)}
                              style={{ fontSize: '12px', padding: '8px 12px' }}
                            >
                              🎯 Take Quiz
                            </button>
                          )}
                          {user?.role === 'teacher' && (
                            <>
                              <button
                                className="btn btn-secondary"
                                onClick={() => navigate(`/quiz/${quiz._id}`)}
                                style={{ fontSize: '12px', padding: '8px 12px' }}
                              >
                                👁️ View
                              </button>
                              <button
                                className="btn btn-purple"
                                onClick={() => navigate(`/results/${quiz._id}`)}
                                style={{ fontSize: '12px', padding: '8px 12px' }}
                              >
                                📊 Results
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Results Table */}
        <section className="dashboard-section">
          <h2>{user?.role === 'teacher' ? 'All Student Results' : 'My Results'}</h2>
          <div className="table-container">
            {results.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
                  {user?.role === 'teacher' ? '📊' : '🎯'}
                </div>
                <h3>{user?.role === 'teacher' ? 'No Student Submissions Yet' : 'No Quiz Results Yet'}</h3>
                <p style={{ marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
                  {user?.role === 'teacher' 
                    ? 'Student quiz submissions and results will appear here once they start taking your quizzes. Encourage them to participate!'
                    : 'Your quiz results and performance will be displayed here once you complete some quizzes. Start taking quizzes to track your progress!'
                  }
                </p>
                {user?.role === 'student' && quizzes.length > 0 && (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      const firstQuiz = quizzes[0];
                      if (firstQuiz) navigate(`/quiz/${firstQuiz._id}`);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}
                  >
                    🎯 Take Your First Quiz
                  </button>
                )}
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Quiz</th>
                    <th>Subject</th>
                    {user?.role === 'teacher' && <th>Student</th>}
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => {
                    const percentage = Math.round((result.score / result.total) * 100);
                    return (
                      <tr key={result._id}>
                        <td style={{ fontWeight: '600' }}>{result.quiz?.title || 'Quiz'}</td>
                        <td>
                          <span style={{ 
                            background: 'var(--gray-light)', 
                            padding: '4px 8px', 
                            borderRadius: '6px', 
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {result.quiz?.subject}
                          </span>
                        </td>
                        {user?.role === 'teacher' && (
                          <td>
                            <div>
                              <div style={{ fontWeight: '600' }}>{result.student?.name}</div>
                              <div style={{ fontSize: '12px', color: '#64748b' }}>{result.student?.email}</div>
                            </div>
                          </td>
                        )}
                        <td className="score">
                          {result.score}/{result.total}
                        </td>
                        <td>
                          <span style={{
                            background: percentage >= 80 ? 'rgba(5, 150, 105, 0.1)' : 
                                       percentage >= 60 ? 'rgba(234, 88, 12, 0.1)' : 
                                       'rgba(193, 18, 31, 0.1)',
                            color: percentage >= 80 ? 'var(--green)' : 
                                   percentage >= 60 ? 'var(--orange)' : 
                                   'var(--red)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontWeight: '700',
                            fontSize: '14px'
                          }}>
                            {percentage}%
                          </span>
                        </td>
                        <td className="date">
                          {new Date(result.submittedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
