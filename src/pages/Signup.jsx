
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

import loginIllustration from "../assets/login-illustration.png";

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
      <div className="auth-split-layout">

        {/* LEFT SIDE: FORM */}
        <div className="auth-left">
          <div className="auth-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join EduTrack today.</p>
          </div>

          <div className="auth-container">
            {/* ROLE SELECT */}
            <div className="role-tabs-wrapper" style={{ marginBottom: '24px' }}>
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

            {error && <div className="auth-error">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <div className="auth-input-group auth-input-wrapper">
                  <User className="auth-input-icon" size={18} />
                  <input
                    className="auth-input"
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div className="auth-input-group auth-input-wrapper">
                  <Mail className="auth-input-icon" size={18} />
                  <input
                    className="auth-input"
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div className="auth-input-group auth-input-wrapper">
                  <Lock className="auth-input-icon" size={18} />
                  <input
                    className="auth-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="password-checklist" style={{ margin: '0 0 24px 0' }}>
                <div className={`checklist-item ${password.length >= 8 ? 'met' : ''}`}>
                  <div className="dot"></div><span>8+ chars</span>
                </div>
                <div className={`checklist-item ${/[A-Z]/.test(password) ? 'met' : ''}`}>
                  <div className="dot"></div><span>Uppercase</span>
                </div>
                <div className={`checklist-item ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'met' : ''}`}>
                  <div className="dot"></div><span>Symbol</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button type="submit" className="auth-btn glow-btn" disabled={loading} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {loading ? <Loader2 className="loading-spinner" /> : "Sign Up"}
                </button>
                <Link to="/login" className="auth-btn" style={{ flex: 1, background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)', boxShadow: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
                  Login
                </Link>
              </div>
            </form>
          </div>

          <div className="auth-footer-mini">
            <span className="auth-footer-link">© 2025 EduTrack</span>
            <Link to="/privacy" className="auth-footer-link">Privacy</Link>
          </div>
        </div>

        {/* RIGHT SIDE: VISUAL */}
        <div className="auth-right">
          <img
            src={loginIllustration}
            alt="Study Illustration"
            className="auth-illustration"
          />
        </div>

      </div>
    </div>
  );
};

export default Signup;
