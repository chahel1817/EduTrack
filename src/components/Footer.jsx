import { GraduationCap, Heart, Mail, Github, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="dashboard-footer">
      <div className="footer-container">

        {/* Brand Section */}
        <div className="footer-brand-section">
          <div className="footer-logo">
            <GraduationCap size={36} />
            <span className="footer-logo-text">EduTrack</span>
          </div>
          <p className="footer-brief">
            EduTrack helps students and teachers learn better with clear quizzes,
            instant results, and easy progress tracking. Build confidence, improve
            skills, and stay motivated every day.
          </p>
          <div className="footer-social-strip">
            <a href="mailto:chahel1817@gmail.com" className="social-icon-mini"><Mail size={18} /></a>
            <a href="https://github.com/chahel1817" target="_blank" rel="noreferrer" className="social-icon-mini"><Github size={18} /></a>
            <a href="https://instagram.com/chahel_1817" target="_blank" rel="noreferrer" className="social-icon-mini"><Instagram size={18} /></a>
          </div>
        </div>

        {/* Links Sections */}
        <div className="footer-columns">
          <div className="footer-col">
            <h4 className="footer-col-title">Platform</h4>
            <Link to="/dashboard" className="footer-col-link">Dashboard</Link>
            <Link to="/quizzes" className="footer-col-link">Quizzes</Link>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">Support</h4>
            <Link to="/help" className="footer-col-link">Help Center</Link>
            <Link to="/contact" className="footer-col-link">Contact</Link>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">Legal</h4>
            <Link to="/privacy" className="footer-col-link">Privacy</Link>
            <Link to="/terms" className="footer-col-link">Terms of Use</Link>
          </div>
        </div>

      </div>

      <div className="footer-bottom-bar">
        <div className="footer-container">
          <p>&copy; 2025 EduTrack. All rights reserved.</p>
          <div className="footer-bottom-extra">
            <Link to="/about">About Us</Link>
            <Link to="/faqs">FAQs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


