import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, BookOpen, Clock, Users, Play, Plus, Filter } from 'lucide-react';

const Quizzes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await api.get('/quiz');
      setQuizzes(res.data || []);

      // Extract unique subjects
      const uniqueSubjects = [...new Set((res.data || []).map(quiz => quiz.subject))];
      setSubjects(uniqueSubjects);
    } catch (err) {
      console.error('Failed to fetch quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !filterSubject || quiz.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <div className="loading">Loading quizzes...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        <div className="dashboard-section">
          {/* Header */}
          <div className="page-header">
            <div className="header-content">
              <div className="header-icon">
                <BookOpen size={32} />
              </div>
              <div>
                <h1 className="page-title">Available Quizzes</h1>
                <p className="page-subtitle">Browse and take quizzes to test your knowledge</p>
              </div>
            </div>

            {user.role === 'teacher' && (
              <button
                onClick={() => navigate('/create-quiz')}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={18} />
                Create Quiz
              </button>
            )}
          </div>

          {/* Search and Filter */}
          <div className="filters-section">
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-dropdown">
              <Filter size={20} />
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="filter-select"
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quizzes Grid */}
          {filteredQuizzes.length === 0 ? (
            <div className="empty-state enhanced">
              <div className="empty-icon">
                📚
              </div>
              <h3>No quizzes found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="quizzes-grid">
              {filteredQuizzes.map(quiz => (
                <div key={quiz._id} className="quiz-card">
                  <div className="quiz-header">
                    <div className="quiz-subject">{quiz.subject}</div>
                    <div className="quiz-date">{formatDate(quiz.createdAt)}</div>
                  </div>

                  <div className="quiz-content">
                    <h3 className="quiz-title">{quiz.title}</h3>
                    <p className="quiz-description">
                      {quiz.description || 'Test your knowledge with this interactive quiz.'}
                    </p>

                    <div className="quiz-stats">
                      <div className="stat-item">
                        <Clock size={16} />
                        <span>{quiz.questions?.length || 0} questions</span>
                      </div>
                      <div className="stat-item">
                        <Users size={16} />
                        <span>Created by {quiz.createdBy?.name || 'Teacher'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="quiz-actions">
                    <button
                      onClick={() => navigate(`/quiz/${quiz._id}`)}
                      className="btn btn-primary quiz-btn"
                    >
                      <Play size={16} />
                      Take Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Quizzes;
