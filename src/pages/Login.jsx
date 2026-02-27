
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, LogIn, Eye, EyeOff, BookOpen, Zap, Shield, Star } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      setError("");
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password");
      setLoading(false);
    }
  };

  const features = [
    { icon: Zap, text: "AI-Powered Quizzes" },
    { icon: Shield, text: "Secure Learning" },
    { icon: Star, text: "Track Progress" },
  ];

  return (
    <div className="auth2-page">
      {/* Animated Orbs */}
      <div className="auth2-orb auth2-orb-1" />
      <div className="auth2-orb auth2-orb-2" />
      <div className="auth2-orb auth2-orb-3" />

      <div className={`auth2-wrapper${mounted ? " auth2-wrapper--visible" : ""}`}>

        {/* ── LEFT PANEL ── */}
        <div className="auth2-panel auth2-panel--brand">
          <div className="auth2-brand-inner">
            <div className="auth2-logo">
              <BookOpen size={28} />
            </div>
            <h1 className="auth2-brand-name">EduTrack</h1>
            <p className="auth2-brand-tagline">
              Your intelligent learning companion for academic excellence.
            </p>
            <div className="auth2-features">
              {features.map(({ icon: Icon, text }) => (
                <div className="auth2-feature-item" key={text}>
                  <div className="auth2-feature-icon">
                    <Icon size={16} />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="auth2-brand-art">
              <div className="auth2-art-ring auth2-art-ring-1" />
              <div className="auth2-art-ring auth2-art-ring-2" />
              <div className="auth2-art-ring auth2-art-ring-3" />
              <div className="auth2-art-dot" />
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL (FORM) ── */}
        <div className="auth2-panel auth2-panel--form">
          <div className="auth2-form-inner">

            {/* Mobile logo */}
            <div className="auth2-mobile-logo">
              <div className="auth2-logo auth2-logo--sm">
                <BookOpen size={20} />
              </div>
              <span className="auth2-brand-name auth2-brand-name--sm">EduTrack</span>
            </div>

            <div className="auth2-form-header">
              <h2 className="auth2-form-title">Welcome back</h2>
              <p className="auth2-form-subtitle">Sign in to continue your learning journey</p>
            </div>

            {error && (
              <div className="auth2-error">
                <span>{error}</span>
              </div>
            )}

            <form className="auth2-form" onSubmit={handleLogin} noValidate>
              {/* Email */}
              <div className="auth2-field">
                <label className="auth2-label">Email Address</label>
                <div className="auth2-input-wrap">
                  <Mail className="auth2-input-icon" size={17} />
                  <input
                    id="login-email"
                    className="auth2-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="auth2-field">
                <div className="auth2-label-row">
                  <label className="auth2-label">Password</label>
                  <Link to="/forgot-password" className="auth2-forgot-link">Forgot password?</Link>
                </div>
                <div className="auth2-input-wrap">
                  <Lock className="auth2-input-icon" size={17} />
                  <input
                    id="login-password"
                    className="auth2-input auth2-input--pad-right"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth2-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="auth2-remember">
                <input type="checkbox" className="auth2-checkbox" />
                <span>Remember me for 30 days</span>
              </label>

              {/* Submit */}
              <button
                id="login-submit-btn"
                type="submit"
                className="auth2-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="auth2-btn-spinner" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <LogIn size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="auth2-switch-text">
              Don't have an account?{" "}
              <Link to="/signup" className="auth2-switch-link">Create one free</Link>
            </p>

            <p className="auth2-footer-copy">© 2025 EduTrack · <Link to="/privacy" className="auth2-footer-small-link">Privacy</Link> · <Link to="/terms" className="auth2-footer-small-link">Terms</Link></p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
