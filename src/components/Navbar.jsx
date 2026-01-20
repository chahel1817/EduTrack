import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

/* LUCIDE ICONS */
import {
  Home,
  FileEdit,
  BarChart3,
  GraduationCap,
  Moon,
  Sun,
  UserCircle,
  LogOut,
  Menu,
  X,
  MessageSquare,
  PieChart
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  /* -------------------------
      PREVENT BODY SCROLL WHEN MOBILE MENU IS OPEN
  -------------------------- */
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isActive = (path) => location.pathname === path;

  /* -------------------------
      THEME TOGGLE HANDLER
  -------------------------- */
  useEffect(() => {
    const saved = localStorage.getItem("theme") === "dark";
    setDark(saved);
    if (saved) document.body.classList.add("dark");
  }, []);

  /* -------------------------
      SCROLL HANDLER FOR STICKY NAV
  -------------------------- */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = !dark;
    setDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");

    if (newTheme) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  if (!user) return null;

  return (
    <nav className={`navbar glass-nav ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">

        {/* LOGO */}
        <div className="navbar-logo hover-bounce" onClick={() => navigate("/dashboard")}>
          <GraduationCap size={34} className="logo-icon" />
          <span className="logo-text gradient-text">EduTrack</span>
        </div>

        {/* MOBILE MENU BUTTON (Hidden on Desktop) */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          style={{ order: 1 }}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* MOBILE MENU BACKDROP */}
        {mobileMenuOpen && (
          <div
            className="mobile-menu-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* LINKS */}
        <div className={`navbar-links ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>

          {/* Dashboard */}
          <button
            className={`navbar-link glow-link ${isActive("/dashboard") ? "active" : ""}`}
            onClick={() => {
              navigate("/dashboard");
              setMobileMenuOpen(false);
            }}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </button>

          {/* Create Quiz — Teacher only */}
          {user.role === "teacher" && (
            <button
              className={`navbar-link glow-link ${isActive("/create-quiz") ? "active" : ""
                }`}
              onClick={() => {
                navigate("/create-quiz");
                setMobileMenuOpen(false);
              }}
            >
              <FileEdit size={18} />
              <span>Create Quiz</span>
            </button>
          )}

          {/* Quizzes */}
          <button
            className={`navbar-link ${isActive("/quizzes") || isActive("/teacher-quizzes") ? "active" : ""
              }`}
            onClick={() => {
              navigate(user.role === "teacher" ? "/results" : "/quizzes");
              setMobileMenuOpen(false);
            }}
          >
            <FileEdit size={18} />
            <span>Quizzes</span>
          </button>


          {/* Results */}
          <button
            className={`navbar-link glow-link ${isActive("/results") || isActive("/my-results")
              ? "active"
              : ""
              }`}
            onClick={() => {
              navigate(user.role === "teacher" ? "/results" : "/my-results");
              setMobileMenuOpen(false);
            }}
          >
            <BarChart3 size={18} />
            <span>Results</span>
          </button>

          {/* Analytics - Student only */}
          {user.role === "student" && (
            <button
              className={`navbar-link glow-link ${isActive("/analytics") ? "active" : ""}`}
              onClick={() => {
                navigate("/analytics");
                setMobileMenuOpen(false);
              }}
            >
              <PieChart size={18} />
              <span>Analytics</span>
            </button>
          )}

          {/* Feedback */}
          <button
            className={`navbar-link glow-link ${isActive("/feedback") ? "active" : ""}`}
            onClick={() => {
              navigate("/feedback");
              setMobileMenuOpen(false);
            }}
          >
            <MessageSquare size={18} />
            <span>Feedback</span>
          </button>
        </div>

        {/* RIGHT SIDE: THEME + USER */}
        <div className="navbar-user" style={{ position: "relative" }}>

          {/* THEME TOGGLE */}
          <button
            className="dark-toggle hover-bounce"
            onClick={toggleTheme}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              border: '1px solid var(--border)'
            }}
          >
            {dark ? <Sun size={20} className="sun-icon" /> : <Moon size={20} className="moon-icon" />}
          </button>

          {/* USER DROPDOWN */}
          <div
            className="user-info pulse-avatar"
            onClick={() => setMenuOpen((prev) => !prev)}
            style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: "12px", position: "relative" }}
          >
            <div className="user-avatar gradient-avatar">
              <UserCircle size={22} />
            </div>

            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
          </div>

          {/* DROPDOWN MENU - Fixed positioning */}
          {menuOpen && (
            <>
              {/* Backdrop to close menu */}
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 999,
                }}
                onClick={() => setMenuOpen(false)}
              />
              <div className="dropdown-menu glass-dropdown dropdown-animate" style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "8px",
                zIndex: 1000,
                minWidth: "180px",
              }}>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate(user.role === "student" ? "/profile" : "/dashboard");
                    setMenuOpen(false);
                  }}
                >
                  <UserCircle size={18} />
                  <span style={{ marginLeft: 8 }}>Profile</span>
                </button>

                <button
                  className="dropdown-item danger"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                    navigate("/login");
                  }}
                >
                  <LogOut size={18} />
                  <span style={{ marginLeft: 8 }}>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
