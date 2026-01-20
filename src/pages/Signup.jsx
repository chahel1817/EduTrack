
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  GraduationCap,
  UserPlus,
  Mail,
  Lock,
  User,
  Loader2,
  Sparkles,
  ArrowRight,
  Presentation
} from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    const hasUpper = /[A-Z]/.test(password);
    const lowerCount = (password.match(/[a-z]/g) || []).length;
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < 8 || !hasUpper || lowerCount < 3 || !hasSpecial) {
      setError("Please meet all password requirements");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await signup({
        name,
        email,
        password,
        role
      });

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="glass-card auth-card animate-fade-in">

          {/* HEADER */}
          <div className="auth-header">
            <div className="auth-icon-wrapper" style={{ marginBottom: '20px' }}>
              <GraduationCap size={64} className="auth-main-icon" />
              <Sparkles size={24} className="auth-sparkle-icon" />
            </div>

            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">
              Join EduTrack and start learning smarter
            </p>
          </div>


          {/* ROLE SELECT */}
          <div className="role-tabs-wrapper" style={{ marginBottom: '32px' }}>
            <div className="role-tabs">
              <button
                type="button"
                className={`role-tab ${role === "student" ? "active" : ""}`}
                onClick={() => setRole("student")}
              >
                <User size={18} />
                <span>Student</span>
              </button>

              <button
                type="button"
                className={`role-tab ${role === "teacher" ? "active" : ""}`}
                onClick={() => setRole("teacher")}
              >
                <Presentation size={18} />
                <span>Teacher</span>
              </button>
            </div>
          </div>

          {/* ERROR */}
          {error && <div className="auth-error">{error}</div>}

          {/* FORM */}
          <form className="auth-form" onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
            <div className="auth-input-group auth-input-wrapper">
              <User className="auth-input-icon" size={20} />
              <input
                className="auth-input"
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group auth-input-wrapper">
              <Mail className="auth-input-icon" size={20} />
              <input
                className="auth-input"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group auth-input-wrapper">
              <Lock className="auth-input-icon" size={20} />
              <input
                className="auth-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD REQUIREMENTS */}
            <div className="password-checklist">
              <div className={`checklist-item ${password.length >= 8 ? 'met' : ''}`}>
                <div className="dot"></div>
                <span>At least 8 characters</span>
              </div>
              <div className={`checklist-item ${/[A-Z]/.test(password) ? 'met' : ''}`}>
                <div className="dot"></div>
                <span>At least 1 uppercase letter</span>
              </div>
              <div className={`checklist-item ${(password.match(/[a-z]/g) || []).length >= 3 ? 'met' : ''}`}>
                <div className="dot"></div>
                <span>At least 3 lowercase letters</span>
              </div>
              <div className={`checklist-item ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'met' : ''}`}>
                <div className="dot"></div>
                <span>At least 1 special character</span>
              </div>
            </div>

            <button
              type="submit"
              className="auth-btn glow-btn"
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px' }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="loading-spinner" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* FOOTER */}
          <div style={{ marginTop: '32px', textAlign: 'center', color: 'var(--gray-500)', fontSize: '15px' }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
              Login Instead
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;
