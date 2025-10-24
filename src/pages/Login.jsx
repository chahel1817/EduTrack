import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">Welcome Back to EduTrack</h2>
        <p className="auth-subtitle">Choose your role and sign in to continue your learning journey</p>

        <div className="role-selector">
          <div className="role-tabs">
            <button
              type="button"
              className={`role-tab ${formData.role === 'student' ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, role: 'student' })}
            >
              <div className="role-icon">🎓</div>
              <div className="role-info">
                <h3>Student</h3>
                <p>Take quizzes and track your progress</p>
              </div>
            </button>
            <button
              type="button"
              className={`role-tab ${formData.role === 'teacher' ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, role: 'teacher' })}
            >
              <div className="role-icon">👨‍🏫</div>
              <div className="role-info">
                <h3>Teacher</h3>
                <p>Create quizzes and view student results</p>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <input
            type="email"
            name="email"
            placeholder="Email address"
            required
            className="auth-input"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="auth-input"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <button type="submit" className="auth-btn">
            Sign In as {formData.role === 'student' ? 'Student' : 'Teacher'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="auth-text-link"
          >
            Don't have an account? Sign up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
