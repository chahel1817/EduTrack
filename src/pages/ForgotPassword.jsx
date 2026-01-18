
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
      <div className="auth-container">
        <div className="glass-card auth-card animate-fade-in">
          <div className="auth-header">
            <div className="auth-icon-wrapper" style={{ marginBottom: '20px' }}>
              <Mail size={64} className="auth-main-icon" />
              <Sparkles size={24} className="auth-sparkle-icon" />
            </div>
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-subtitle">
              We'll send you a login OTP to reset your password.
            </p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSendOTP} style={{ marginTop: '32px' }}>
            <div className="auth-input-group auth-input-wrapper">
              <Mail className="auth-input-icon" size={20} />
              <input
                className="auth-input"
                type="email"
                placeholder="Enter registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button className="auth-btn glow-btn" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
              {loading ? <Loader2 className="loading-spinner" /> : (
                <>
                  <span>Send OTP</span>
                  <Send size={18} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--gray-500)', fontSize: '15px', textDecoration: 'none', fontWeight: 600 }}>
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
