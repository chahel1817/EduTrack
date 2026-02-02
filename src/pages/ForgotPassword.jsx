
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../utils/api";
import { Mail, Loader2, Sparkles, ArrowLeft, Send } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setError(err.response?.data?.message || "Failed to send OTP");
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
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-subtitle">We'll send you an OTP.</p>
          </div>

          <div className="auth-container">
            {error && <div className="auth-error">{error}</div>}

            <form className="auth-form" onSubmit={handleSendOTP}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--gray-500)', marginBottom: '8px' }}>Registered Email</label>
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

              <button className="auth-btn glow-btn" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                {loading ? <Loader2 className="loading-spinner" /> : (
                  <>
                    <span>Send OTP</span>
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>

            <div style={{ textAlign: 'center' }}>
              <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--gray-500)', fontSize: '14px', textDecoration: 'none', fontWeight: 600 }}>
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          </div>

          <div className="auth-footer-mini">
            <span className="auth-footer-link">© 2025 EduTrack</span>
            <Link to="/help" className="auth-footer-link">Help</Link>
          </div>
        </div>

        {/* RIGHT SIDE: VISUAL */}
        <div className="auth-right">
          <img
            src="/src/assets/login-illustration.png"
            alt="Study Illustration"
            className="auth-illustration"
          />
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
