import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    age: '',
    phone: ''
  });

  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    try {
      await signup(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">Join EduTrack Today</h2>
        <p className="auth-subtitle">Choose your role and start your educational journey</p>

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
            type="text"
            name="name"
            placeholder="Full Name"
            required
            className="auth-input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

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
            placeholder="Password (min 6 characters)"
            required
            className="auth-input"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <input
            type="number"
            name="age"
            placeholder="Age (optional)"
            className="auth-input"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number (optional)"
            className="auth-input"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <button type="submit" className="auth-btn">
            Sign Up as {formData.role === 'student' ? 'Student' : 'Teacher'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="auth-text-link"
          >
            Already have an account? Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
