import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Key, ShieldCheck, BookOpen, Zap, Star, Mail } from "lucide-react";

import AuthButton from "../components/common/AuthButton";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, [email, navigate]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("OTP is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await api.post("/auth/verify-otp", { email, otp });
      setAuth(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP. Please try again.");
      setLoading(false);
    }
  };

  const features = [
    { icon: Mail, text: "OTP sent to email" },
    { icon: ShieldCheck, text: "Expires in 10 minutes" },
    { icon: Zap, text: "Instant Access" },
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
            <p className="auth2-brand-tagline">Verify your identity and continue your learning journey.</p>
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
              <h2 className="auth2-form-title">Verify OTP</h2>
              <p className="auth2-form-subtitle">
                {email ? (
                  <>Code sent to <strong style={{ color: '#a78bfa' }}>{email}</strong></>
                ) : (
                  "Enter the 6-digit code sent to your email"
                )}
              </p>
            </div>

            {error && <div className="auth2-error"><span>{error}</span></div>}

            <form className="auth2-form" onSubmit={handleVerifyOTP} noValidate>
              {/* OTP Input */}
              <div className="auth2-field">
                <div className="auth2-label-row">
                  <label className="auth2-label" htmlFor="verify-otp">6-Digit Code</label>
                </div>
                <div className="auth2-input-wrap">
                  <Key className="auth2-input-icon" size={17} />
                  <input
                    id="verify-otp"
                    className="auth2-input auth2-otp-input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="— — — — — —"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    autoComplete="one-time-code"
                    required
                  />
                </div>
              </div>

              <AuthButton loading={loading} id="verify-submit-btn">
                <span>Verify &amp; Login</span>
                <ShieldCheck size={18} />
              </AuthButton>
            </form>

            <p className="auth2-switch-text">
              Didn't receive the code?{" "}
              <Link to="/forgot-password" className="auth2-switch-link">Resend OTP</Link>
            </p>

            <p className="auth2-switch-text" style={{ marginTop: 0 }}>
              <Link to="/login" className="auth2-switch-link">← Back to Login</Link>
            </p>

            <p className="auth2-footer-copy">© 2025 EduTrack · <Link to="/privacy" className="auth2-footer-small-link">Privacy</Link> · <Link to="/terms" className="auth2-footer-small-link">Terms</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
