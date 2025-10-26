import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
          <div className="navbar-logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">EduTrack</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          <button
            className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            <span className="link-icon">🏠</span>
            <span className="link-text">Dashboard</span>
          </button>

          {user.role === 'teacher' && (
            <button
              className={`navbar-link ${isActive('/create-quiz') ? 'active' : ''}`}
              onClick={() => navigate('/create-quiz')}
            >
              <span className="link-icon">📝</span>
              <span className="link-text">Create Quiz</span>
            </button>
          )}

          <button
            className={`navbar-link ${isActive('/results') ? 'active' : ''}`}
            onClick={() => navigate('/results')}
          >
            <span className="link-icon">📊</span>
            <span className="link-text">Results</span>
          </button>
        </div>

        {/* User Info & Logout */}
        <div className="navbar-user">
          <div className="user-info">
            <div className="user-avatar">
              {user.role === 'teacher' ? '👨‍🏫' : '🎓'}
            </div>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

