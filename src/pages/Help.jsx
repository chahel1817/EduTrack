import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  HelpCircle,
  Book,
  MessageCircle,
  Video,
  FileText,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

const Help = () => {
  return (
    <div className="dashboard-container">
      <Navbar />

      <main className="dashboard-main">
        <div className="dashboard-section">

          {/* HEADER */}
          <div className="page-header">
            <div className="header-content">
              <div className="header-icon">
                <HelpCircle size={32} />
              </div>
              <div>
                <h1 className="page-title">Help Center</h1>
                <p className="page-subtitle">
                  Everything you need to get the most out of EduTrack
                </p>
              </div>
            </div>
          </div>

          {/* INTRO */}
          <p
            style={{
              maxWidth: "900px",
              marginBottom: "3rem",
              lineHeight: "1.8",
              color: "var(--gray-700)"
            }}
          >
            Whether you're a student taking quizzes or a teacher creating them,
            our Help Center provides guides, support channels, and resources to
            ensure a smooth learning experience.
          </p>

          {/* HELP OPTIONS */}
          <div className="help-grid">

            {/* DOCUMENTATION */}
            <div className="help-card hover-lift">
              <div className="help-card-icon">
                <Book size={30} />
              </div>
              <h3>Documentation</h3>
              <p>
                Learn how to use EduTrack features step by step with clear guides.
              </p>
              <Link to="/docs" className="help-link">
                View Docs <ChevronRight size={16} />
              </Link>
            </div>

            {/* SUPPORT */}
            <div className="help-card hover-lift">
              <div className="help-card-icon">
                <MessageCircle size={30} />
              </div>
              <h3>Contact Support</h3>
              <p>
                Facing issues or need assistance? Our support team is ready.
              </p>
              <Link to="/contact" className="help-link">
                Get Support <ChevronRight size={16} />
              </Link>
            </div>

            {/* VIDEO TUTORIALS */}
            <div className="help-card hover-lift">
              <div className="help-card-icon">
                <Video size={30} />
              </div>
              <h3>Video Tutorials</h3>
              <p>
                Watch guided videos to quickly understand how things work.
              </p>
              <Link to="/tutorials" className="help-link">
                Watch Videos <ChevronRight size={16} />
              </Link>
            </div>

            {/* FAQs */}
            <div className="help-card hover-lift">
              <div className="help-card-icon">
                <FileText size={30} />
              </div>
              <h3>FAQs</h3>
              <p>
                Find quick answers to the most common questions.
              </p>
              <Link to="/faqs" className="help-link">
                View FAQs <ChevronRight size={16} />
                
              </Link>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Help;
