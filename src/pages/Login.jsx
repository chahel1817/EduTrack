import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  GraduationCap,
  Loader2,
  Sparkles,
  Mail,
  Key
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- PASSWORD LOGIN ---------------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="glass-card">

          <div className="auth-header">
            <GraduationCap size={56} className="auth-main-icon" />
            <Sparkles size={18} className="auth-sparkle-icon" />
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Secure login with password</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleLogin}>
            <input
              className="auth-input"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="auth-btn" disabled={loading}>
              {loading ? <Loader2 className="loading-spinner" /> : "Login"}
            </button>

            <Link to="/forgot-password" className="auth-text-link">
              Forgot password?
            </Link>
          </form>

          <Link to="/signup" className="auth-text-link">
            Don’t have an account? Sign up
          </Link>

        </div>
      </div>
    </div>
  );
  };

  export default Login;
