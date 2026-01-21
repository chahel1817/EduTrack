import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNotifications } from "../context/NotificationContext";

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
  PieChart,
  Bell,
  Trash2
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, clearNotifications } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

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
        <div className="navbar-user" style={{ position: "relative", gap: '15px' }}>

          {/* NOTIFICATION BELL */}
          <div style={{ position: 'relative' }}>
            <button
              className="dark-toggle hover-bounce"
              onClick={() => { setNotifOpen(!notifOpen); setMenuOpen(false); }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                border: '1px solid var(--border)',
                position: 'relative'
              }}
            >
              <Bell size={20} className={notifications.length > 0 ? "animate-bounce" : ""} />
              {notifications.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: 'var(--error)',
                  color: 'white',
                  fontSize: '10px',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  border: '2px solid var(--card-bg)'
                }}>
                  {notifications.length}
                </span>
              )}
            </button>

            {notifOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={() => setNotifOpen(false)} />
                <div className="dropdown-menu glass-dropdown" style={{
                  position: "absolute",
                  top: "120%",
                  right: 0,
                  width: '320px',
                  zIndex: 999,
                  padding: '15px',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontWeight: 800, fontSize: '14px' }}>Notifications</span>
                    <button
                      onClick={clearNotifications}
                      style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}
                    >
                      <Trash2 size={14} /> Clear
                    </button>
                  </div>
                  {notifications.filter(n => !(n.type === 'new_quiz' && n.data?.createdBy === user._id)).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--gray-500)', fontSize: '13px' }}>
                      No new notifications
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {notifications
                        .filter(n => !(n.type === 'new_quiz' && n.data?.createdBy === user._id))
                        .map((n, i) => (
                          <div key={i} style={{
                            padding: '12px',
                            borderRadius: '10px',
                            background: 'var(--gray-50)',
                            fontSize: '13px',
                            borderLeft: `4px solid ${n.type === 'certification' ? 'var(--success)' : 'var(--primary)'}`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                          }}>
                            <p style={{ margin: '0 0 8px 0', color: 'var(--gray-700)', fontWeight: 600 }}>{n.message}</p>

                            {n.type === 'new_quiz' && user.role === 'student' && (
                              <button
                                onClick={() => { navigate(`/quiz/${n.data.quizId}`); setNotifOpen(false); }}
                                className="btn btn-primary"
                                style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px', width: 'auto', display: 'inline-flex', gap: '6px' }}
                              >
                                <GraduationCap size={14} /> Attempt Quiz
                              </button>
                            )}

                            {n.type === 'result' && user.role === 'teacher' && (
                              <button
                                onClick={() => { navigate(`/results/${n.data.quizId}`); setNotifOpen(false); }}
                                className="btn btn-outline"
                                style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px', width: 'auto' }}
                              >
                                View Result
                              </button>
                            )}

                            <div style={{ marginTop: '8px' }}>
                              <small style={{ color: 'var(--gray-400)', fontSize: '10px' }}>Just now</small>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

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
