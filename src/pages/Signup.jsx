import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, Eye, EyeOff, BookOpen, Zap, Shield, Star, Presentation, Sparkles } from "lucide-react";

import AuthInput from "../components/common/AuthInput";
import AuthButton from "../components/common/AuthButton";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
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

  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Special symbol", ok: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!name || !email || !password) { setError("All fields are required"); return; }
    if (!checks.every(c => c.ok)) { setError("Please meet all password requirements"); return; }

    try {
      setLoading(true);
      setError("");
      await signup({ name, email, password, role });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth2-page">
      <div className="auth2-orb auth2-orb-1" />
      <div className="auth2-orb auth2-orb-2" />
      <div className="auth2-orb auth2-orb-3" />

      <div className={`auth2-wrapper auth2-wrapper--signup${mounted ? " auth2-wrapper--visible" : ""}`}>

        <div className="auth2-panel auth2-panel--brand">
          <div className="auth2-brand-inner">
            <div className="auth2-logo"><BookOpen size={28} /></div>
            <h1 className="auth2-brand-name">EduTrack</h1>
            <p className="auth2-brand-tagline">Join thousands of students and teachers accelerating their education with AI.</p>
            <div className="auth2-features">
              {[
                { icon: Zap, text: "AI-Powered Learning" },
                { icon: Shield, text: "100% Secure Platform" },
                { icon: Star, text: "Real-time Analytics" },
              ].map(({ icon: Icon, text }) => (
                <div className="auth2-feature-item" key={text}>
                  <div className="auth2-feature-icon"><Icon size={16} /></div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="auth2-brand-art">
              <div className="auth2-art-ring auth2-art-ring-1" /><div className="auth2-art-ring auth2-art-ring-2" /><div className="auth2-art-ring auth2-art-ring-3" /><div className="auth2-art-dot" />
            </div>
          </div>
        </div>

        <div className="auth2-panel auth2-panel--form">
          <div className="auth2-form-inner">
            <div className="auth2-mobile-logo">
              <div className="auth2-logo auth2-logo--sm"><BookOpen size={20} /></div>
              <span className="auth2-brand-name auth2-brand-name--sm">EduTrack</span>
            </div>

            <div className="auth2-form-header">
              <h2 className="auth2-form-title">Create your account</h2>
              <p className="auth2-form-subtitle">Start learning smarter today — it's free</p>
            </div>

            <div className="auth2-role-toggle">
              <button type="button" className={`auth2-role-btn${role === "student" ? " auth2-role-btn--active" : ""}`} onClick={() => setRole("student")}><User size={16} /><span>Student</span></button>
              <button type="button" className={`auth2-role-btn${role === "teacher" ? " auth2-role-btn--active" : ""}`} onClick={() => setRole("teacher")}><Presentation size={16} /><span>Teacher</span></button>
            </div>

            {error && <div className="auth2-error"><span>{error}</span></div>}

            <form className="auth2-form" onSubmit={handleSubmit} noValidate>
              <AuthInput
                id="signup-name"
                label="Full Name"
                icon={User}
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />

              <AuthInput
                id="signup-email"
                label="Email Address"
                icon={Mail}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />

              <AuthInput
                id="signup-password"
                label="Password"
                icon={Lock}
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                rightElement={
                  <button
                    type="button"
                    className="auth2-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    style={{ background: 'none', border: 'none', padding: 0, color: 'rgba(255,255,255,0.3)' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              {password.length > 0 && (
                <div className="auth2-checklist">
                  {checks.map(({ label, ok }) => (
                    <div key={label} className={`auth2-check-item${ok ? " auth2-check-item--ok" : ""}`}>
                      <div className="auth2-check-dot" /><span>{label}</span>
                    </div>
                  ))}
                </div>
              )}

              <AuthButton loading={loading} id="signup-submit-btn">
                <span>Create Account</span>
                <Sparkles size={18} />
              </AuthButton>
            </form>

            <p className="auth2-switch-text">
              Already have an account?{" "}
              <Link to="/login" className="auth2-switch-link">Sign in</Link>
            </p>

            <p className="auth2-footer-copy">© 2025 EduTrack · <Link to="/privacy" className="auth2-footer-small-link">Privacy</Link> · <Link to="/terms" className="auth2-footer-small-link">Terms</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
