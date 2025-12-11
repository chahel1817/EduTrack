import { GraduationCap, Heart, Mail, Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="dashboard-footer">
      <div className="footer-content">
        <div className="footer-brand">
  <GraduationCap size={36} />

  <div className="footer-brand-text">
    <h3 className="footer-title">EduTrack</h3>
    <p className="footer-subtitle">
      Transforming Learning Experiences with Interactive Quizzes and Analytics.<br />
      Empowering educators and students through innovative assessment tools,<br />
      real-time progress tracking, and comprehensive performance insights.<br />
      Building the future of education, one quiz at a time.
    </p>
  </div>
</div>

        <div className="footer-links">
          <div className="footer-section">
            <h4 className="footer-section-title">Platform</h4>
            <a href="#" className="footer-link">Dashboard</a>
            <a href="#" className="footer-link">Quizzes</a>
            <a href="#" className="footer-link">Results</a>
            <a href="#" className="footer-link">Profile</a>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Support</h4>
            <a href="/help" className="footer-link">Help Center</a>
            <a href="/contact" className="footer-link">Contact Us</a>
            <a href="/help" className="footer-link">FAQ</a>
            <a href="/contact" className="footer-link">Feedback</a>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Connect</h4>
            <div className="footer-social">
              <a href="#" className="social-link" title="Email">
                <Mail size={20} />
              </a>
              <a href="#" className="social-link" title="GitHub">
                <Github size={20} />
              </a>
              <a href="#" className="social-link" title="Twitter">
                <Twitter size={20} />
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
            <a href="/privacy" className="footer-bottom-link">Privacy Policy</a>
            <a href="/about" className="footer-bottom-link">About</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
