import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GraduationCap, UserCog, BookOpen, Sparkles } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  /* --------------------------
      Validation
  --------------------------- */
  const validateForm = () => {
    // Email validation
    if (!formData.email || !formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError("Please enter a valid email address");
      return false;
    }

    // Password validation
    if (!formData.password || !formData.password.trim()) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 1) {
      setError("Password cannot be empty");
      return false;
    }

    return true;
  };

  /* --------------------------
      Submit
  --------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await login(formData.email.trim(), formData.password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          "Login failed. Please check your credentials and ensure the server is running.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------
      UI
  ------------------------------------------------------------ */
  return (
    <div className="auth-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-container glass-card login-card shadow-xl animate-fade-in">

        {/* Title */}
        <div className="auth-header">
          <div className="auth-icon-wrapper">
            <BookOpen size={48} className="auth-main-icon" />
            <Sparkles size={20} className="auth-sparkle-icon" />
          </div>
          <h2 className="auth-title">
            Welcome Back
          </h2>
          <p className="auth-subtitle">Sign in to your EduTrack account and continue your learning journey</p>
        </div>

        {/* Role Tabs */}
        <div className="role-tabs-wrapper">
          <div className="role-tabs">
            <button
              type="button"
              className={`role-tab ${formData.role === "student" ? "active" : ""}`}
              onClick={() => setFormData({ ...formData, role: "student" })}
            >
              <GraduationCap strokeWidth={1.8} />
              <span>Student</span>
            </button>

            <button
              type="button"
              className={`role-tab ${formData.role === "teacher" ? "active" : ""}`}
              onClick={() => setFormData({ ...formData, role: "teacher" })}
            >
              <UserCog strokeWidth={1.8} />
              <span>Teacher</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">

          {error && <div className="auth-error">{error}</div>}

          <input
            type="email"
            className="auth-input"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            type="password"
            className="auth-input"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          {/* Submit */}
          <button 
            type="submit" 
            className="auth-btn glow-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '8px' }}></span>
                Signing in...
              </>
            ) : (
              `Sign in as ${formData.role === "student" ? "Student" : "Teacher"}`
            )}
          </button>

          {/* Signup redirect */}
          <button
            type="button"
            className="auth-text-link"
            onClick={() => navigate("/signup")}
          >
            Don’t have an account? <b>Create one</b>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
