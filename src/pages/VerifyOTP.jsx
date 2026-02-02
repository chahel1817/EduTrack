
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
      <div className="auth-split-layout">

        {/* LEFT SIDE: FORM */}
        <div className="auth-left">
          <div className="auth-header">
            <h1 className="auth-title">Verify OTP</h1>
            <p className="auth-subtitle">
              Enter the code sent to <br />
              <strong style={{ color: 'var(--primary)' }}>{email}</strong>
            </p>
          </div>

          <div className="auth-container">
            {error && <div className="auth-error">{error}</div>}

            <div className="auth-form">
              <div style={{ marginBottom: '24px' }}>
                <div className="auth-input-group auth-input-wrapper">
                  <Key className="auth-input-icon" size={18} />
                  <input
                    className="auth-input"
                    placeholder="— — — — — —"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '24px', fontWeight: 700, fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <button
                className="auth-btn glow-btn"
                onClick={handleVerifyOTP}
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}
              >
                {loading ? (
                  <Loader2 className="loading-spinner" />
                ) : (
                  <>
                    <span>Verify & Login</span>
                    <ShieldCheck size={18} />
                  </>
                )}
              </button>
            </div>

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

export default VerifyOTP;
