import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { Mail, Loader2, Sparkles } from "lucide-react";

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
        <div className="glass-card">
          <div className="auth-header">
            <Mail size={52} />
            <Sparkles size={18} />
            <h1 className="auth-title">Forgot Password</h1>
            <p className="auth-subtitle">
              Enter your email to receive a login OTP
            </p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSendOTP}>
            <input
              className="auth-input"
              type="email"
              placeholder="Registered email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="auth-btn glow-btn" disabled={loading}>
              {loading ? <Loader2 className="loading-spinner" /> : "Send OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
