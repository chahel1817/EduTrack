import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Key, Loader2 } from "lucide-react";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!email) {
    navigate("/login");
  }

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError("OTP is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { email, otp }
      );

      // ✅ DIRECT LOGIN
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
        <div className="glass-card">

          <div className="auth-header">
            <Key size={52} />
            <h1 className="auth-title">Verify OTP</h1>
            <p className="auth-subtitle">
              Enter the OTP sent to your email
            </p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-form">
            <input
              className="auth-input"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              className="auth-btn glow-btn"
              onClick={handleVerifyOTP}
              disabled={loading}
            >
              {loading ? <Loader2 className="loading-spinner" /> : "Verify & Login"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
