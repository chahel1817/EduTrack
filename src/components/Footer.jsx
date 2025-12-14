import { GraduationCap, Heart, Mail, Github, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="dashboard-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <GraduationCap size={36} />

          <div className="footer-brand-text">
            <h3 className="footer-title">EduTrack</h3>
            <p className="footer-subtitle">
              Transforming Learning Experiences with Interactive Quizzes and Analytics.
              Empowering educators and students through innovative assessment tools,
              real-time progress tracking, and comprehensive performance insights.
              Building the future of education, one quiz at a time.
            </p>
          </div>
        </div>

        <div className="footer-links">
          {/* PLATFORM */}
          <div className="footer-section">
            <h4 className="footer-section-title">Platform</h4>
            <Link to="/dashboard" className="footer-link">Dashboard</Link>
            <Link to="/quizzes" className="footer-link">Quizzes</Link>
            <Link to="/results" className="footer-link">Results</Link>
            <Link to="/profile" className="footer-link">Profile</Link>
          </div>

          {/* SUPPORT */}
          <div className="footer-section">
            <h4 className="footer-section-title">Support</h4>

            {/* ✅ CORRECT */}
            <Link to="/help" className="footer-link">Help Center</Link>
            <Link to="/contact" className="footer-link">Contact Us</Link>

            {/* ✅ FIXED FAQ LINK */}
            <Link to="/faqs" className="footer-link">FAQ</Link>

            {/* ✅ FIXED FEEDBACK LINK */}
            <Link to="/feedback" className="footer-link">Feedback</Link>
          </div>

          {/* CONNECT */}
          <div className="footer-section">
            <h4 className="footer-section-title">Connect</h4>
            <div className="footer-social">
              <a href="mailto:chahel1817@gmail.com" className="social-link" title="Email">
                <Mail size={20} />
              </a>
              <a href="https://github.com/chahel1817" target="_blank" rel="noopener noreferrer" className="social-link" title="GitHub">
                <Github size={20} />
              </a>
              <a href="https://www.instagram.com/chahel_1817/" target="_blank" rel="noopener noreferrer" className="social-link" title="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copyright">
            © 2025 EduTrack. Made with <Heart size={16} className="heart-icon" /> for education.
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy" className="footer-bottom-link">Privacy Policy</Link>
            <Link to="/about" className="footer-bottom-link">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
