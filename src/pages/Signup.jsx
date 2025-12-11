import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GraduationCap, UserCog, UserPlus, Sparkles } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    age: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Reset form function
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "student",
      age: "",
      phone: "",
    });
    setError("");
    setSuccess(false);
  };

  /* --------------------------
        Validation
  --------------------------- */
  const validateForm = () => {
    // Name validation
    if (!formData.name || !formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return false;
    }

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
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (formData.password.length > 50) {
      setError("Password must be less than 50 characters");
      return false;
    }

    // Age validation (optional but if provided, should be valid)
    if (formData.age && formData.age.trim() !== "") {
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        setError("Please enter a valid age (1-120)");
        return false;
      }
    }

    // Phone validation (optional but if provided, should be valid)
    if (formData.phone && formData.phone.trim() !== "") {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        setError("Please enter a valid phone number");
        return false;
      }
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
      // Prepare data for signup
      const signupData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        ...(formData.age && formData.age.trim() !== "" && { age: parseInt(formData.age) }),
        ...(formData.phone && formData.phone.trim() !== "" && { phone: formData.phone.trim() }),
      };

      await signup(signupData);
      // Clear form fields after successful signup
      resetForm();
      setSuccess(true);
      // Navigate after a brief delay to show success
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Signup error:", err);
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          "Signup failed. Please check your information and ensure the server is running.";
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
      <div className="auth-container glass-card signup-card animate-fade-in">

        {/* Title */}
        <div className="auth-header">
          <div className="auth-icon-wrapper">
            <UserPlus size={48} className="auth-main-icon" />
            <Sparkles size={20} className="auth-sparkle-icon" />
          </div>
          <h2 className="auth-title">
            Create Your Account
          </h2>
          <p className="auth-subtitle">Join EduTrack and start your educational adventure with interactive quizzes</p>
        </div>

        {/* Role Selector */}
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

        <form onSubmit={handleSubmit} className="auth-form">
          {success && (
            <div style={{
              background: "rgba(16, 185, 129, 0.15)",
              border: "2px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "12px",
              padding: "14px 18px",
              color: "var(--accent-dark)",
              fontSize: "14px",
              fontWeight: "600",
              textAlign: "center",
              marginBottom: "8px",
            }}>
              ✓ Account created successfully! Redirecting to login...
            </div>
          )}
          {error && <div className="auth-error">{error}</div>}

          {/* Inputs with improved spacing */}
          <input
            type="text"
            className="auth-input"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <input
            type="email"
            className="auth-input"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            type="password"
            className="auth-input"
            placeholder="Password (min. 6 characters)"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <div className="two-column-inputs">
            <input
              type="number"
              className="auth-input"
              placeholder="Age (optional)"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
            />

            <input
              type="tel"
              className="auth-input"
              placeholder="Phone Number (optional)"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="auth-btn glow-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '8px' }}></span>
                Creating account...
              </>
            ) : (
              `Sign Up as ${formData.role === "student" ? "Student" : "Teacher"}`
            )}
          </button>

          {/* Switch to Login */}
          <button
            type="button"
            className="auth-text-link"
            onClick={() => navigate("/login")}
          >
            Already have an account? <b>Login</b>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
