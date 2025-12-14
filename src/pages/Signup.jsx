import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  GraduationCap,
  UserPlus,
  Mail,
  Lock,
  User,
  Loader2,
  Sparkles
} from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await signup({
        name,
        email,
        password,
        role
      });

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="glass-card signup-card animate-fade-in">

          {/* HEADER */}
          <div className="auth-header">
            <div className="auth-icon-wrapper">
              <GraduationCap size={56} className="auth-main-icon" />
              <Sparkles size={18} className="auth-sparkle-icon" />
            </div>

            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">
              Join EduTrack and start learning smarter
            </p>
          </div>

          {/* ROLE SELECT */}
          <div className="role-tabs-wrapper">
            <div className="role-tabs">
              <button
                type="button"
                className={`role-tab ${role === "student" ? "active" : ""}`}
                onClick={() => setRole("student")}
              >
                🎓 Student
              </button>

              <button
                type="button"
                className={`role-tab ${role === "teacher" ? "active" : ""}`}
                onClick={() => setRole("teacher")}
              >
                👨‍🏫 Teacher
              </button>
            </div>
          </div>

          {/* ERROR */}
          {error && <div className="auth-error">{error}</div>}

          {/* FORM */}
          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              className="auth-input"
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

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
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="auth-btn glow-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="loading-spinner" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Sign Up
                </>
              )}
            </button>
          </form>

          {/* FOOTER */}
          <Link to="/login" className="auth-text-link">
            Already have an account? Login
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Signup;
