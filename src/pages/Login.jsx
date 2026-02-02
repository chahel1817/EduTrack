
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  GraduationCap,
  Loader2,
  Sparkles,
  Mail,
  Lock,
  ArrowRight
} from "lucide-react";

import loginIllustration from "../assets/login-illustration.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
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
            <h1 className="auth-title">EduTrack</h1>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Welcome Back</h2>
            <p className="auth-subtitle">Please, login to your account.</p>
          </div>

          <div className="auth-container">
            {error && <div className="auth-error">{error}</div>}

            <form className="auth-form" onSubmit={handleLogin}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--gray-500)', marginBottom: '8px' }}>Email Address</label>
                <div className="auth-input-group auth-input-wrapper">
                  <Mail className="auth-input-icon" size={18} />
                  <input
                    className="auth-input"
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--gray-500)', marginBottom: '8px' }}>Password</label>
                <div className="auth-input-group auth-input-wrapper">
                  <Lock className="auth-input-icon" size={18} />
                  <input
                    className="auth-input"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--gray-500)', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ accentColor: 'var(--primary)' }} />
                  Remember Me
                </label>
                <Link to="/forgot-password" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                  Forgot Password?
                </Link>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button type="submit" className="auth-btn glow-btn" disabled={loading} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {loading ? <Loader2 className="loading-spinner" /> : "Login"}
                </button>
                <Link to="/signup" className="auth-btn" style={{ flex: 1, background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)', boxShadow: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
                  Sign Up
                </Link>
              </div>
            </form>
          </div>

          <div className="auth-footer-mini">
            <span className="auth-footer-link">© 2025 EduTrack</span>
            <Link to="/help" className="auth-footer-link">Help</Link>
            <Link to="/privacy" className="auth-footer-link">Privacy</Link>
            <Link to="/terms" className="auth-footer-link">Terms</Link>
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

export default Login;
