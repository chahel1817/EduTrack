import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../utils/api";
import { Mail, Send, BookOpen, Key, Shield, Zap } from "lucide-react";

import AuthInput from "../components/common/AuthInput";
import AuthButton from "../components/common/AuthButton";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await api.post("/auth/forgot-password", { email });
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
      setLoading(false);
    }
  };

  const features = [
    { icon: Key, text: "Secure OTP Reset" },
    { icon: Shield, text: "Verified by Email" },
    { icon: Zap, text: "Instant Delivery" },
  ];

  return (
    <div className="auth2-page">
      <div className="auth2-orb auth2-orb-1" />
      <div className="auth2-orb auth2-orb-2" />
      <div className="auth2-orb auth2-orb-3" />

      <div className={`auth2-wrapper${mounted ? " auth2-wrapper--visible" : ""}`}>

        {/* LEFT: Brand Panel */}
        <div className="auth2-panel auth2-panel--brand">
          <div className="auth2-brand-inner">
            <div className="auth2-logo"><BookOpen size={28} /></div>
            <h1 className="auth2-brand-name">EduTrack</h1>
            <p className="auth2-brand-tagline">Reset your password securely and get back to learning.</p>
            <div className="auth2-features">
              {features.map(({ icon: Icon, text }) => (
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

        {/* RIGHT: Form Panel */}
        <div className="auth2-panel auth2-panel--form">
          <div className="auth2-form-inner">
            <div className="auth2-mobile-logo">
              <div className="auth2-logo auth2-logo--sm"><BookOpen size={20} /></div>
              <span className="auth2-brand-name auth2-brand-name--sm">EduTrack</span>
            </div>

            <div className="auth2-form-header">
              <h2 className="auth2-form-title">
                <span className="text-premium-gradient">Forgot Password? 🔑</span>
              </h2>
              <p className="auth2-form-subtitle">No worries, we'll help you get back in safely</p>
            </div>

            {error && <div className="auth2-error"><span>{error}</span></div>}

            <form className="auth2-form" onSubmit={handleSendOTP} noValidate>
              <AuthInput
                id="forgot-email"
                label="Registered Email"
                icon={Mail}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />

              <AuthButton loading={loading} id="forgot-submit-btn">
                <span>Send OTP</span>
                <Send size={18} />
              </AuthButton>
            </form>

            <p className="auth2-switch-text">
              Remember your password?{" "}
              <Link to="/login" className="auth2-switch-link">Back to Login</Link>
            </p>

            <p className="auth2-footer-copy">© 2025 EduTrack · <Link to="/privacy" className="auth2-footer-small-link">Privacy</Link> · <Link to="/terms" className="auth2-footer-small-link">Terms</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
