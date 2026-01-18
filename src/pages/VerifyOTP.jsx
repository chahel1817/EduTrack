
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Key, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError("OTP is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/verify-otp", { email, otp });

      // ✅ DIRECT LOGIN (JWT + user stored)
      setAuth(res.data.token, res.data.user);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
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
              <ShieldCheck size={64} className="auth-main-icon" />
            </div>
            <h1 className="auth-title">Verify OTP</h1>
            <p className="auth-subtitle">
              Enter the 6-digit code sent to <br />
              <strong style={{ color: 'var(--primary)' }}>{email}</strong>
            </p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-form" style={{ marginTop: '32px' }}>
            <div className="auth-input-group auth-input-wrapper">
              <Key className="auth-input-icon" size={20} />
              <input
                className="auth-input"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '20px' }}
              />
            </div>

            <button
              className="auth-btn glow-btn"
              onClick={handleVerifyOTP}
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' }}
            >
              {loading ? (
                <Loader2 className="loading-spinner" />
              ) : (
                <>
                  <span>Verify Account</span>
                </>
              )}
            </button>
          </div>

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

export default VerifyOTP;
