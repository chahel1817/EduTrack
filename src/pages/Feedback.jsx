import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Mail, User, FileText, MessageCircle, Send } from "lucide-react";

const Feedback = () => {
  return (
    <div className="dashboard-container">
      <Navbar />

      <main className="dashboard-main">
        <div className="dashboard-section">

          {/* HEADER */}
          <div className="page-header">
            <div className="header-content">
              <div className="header-icon">
                <FileText size={28} />
              </div>
              <div>
                <h1 className="page-title">Feedback</h1>
                <p className="page-subtitle">
                  Your feedback helps us build a better learning experience.
                </p>
              </div>
            </div>
          </div>

          {/* FORM CARD */}
          <div className="contact-form-card">

            <h2 className="form-title">We’d love to hear from you</h2>
            <p className="form-subtitle">
              Share your thoughts, report issues, or suggest new features.
            </p>

            <form className="contact-form">

              {/* NAME */}
              <div className="form-group">
                <label className="form-label">
                  <User size={16} className="inline-icon" />
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="form-group">
                <label className="form-label">
                  <Mail size={16} className="inline-icon" />
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* SUBJECT */}
              <div className="form-group">
                <label className="form-label">
                  <FileText size={16} className="inline-icon" />
                  Subject
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Feedback subject"
                  required
                />
              </div>

              {/* MESSAGE */}
              <div className="form-group">
                <label className="form-label">
                  <MessageCircle size={16} className="inline-icon" />
                  Message
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Write your feedback here..."
                  required
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="btn btn-primary contact-submit-btn"
              >
                <Send size={18} />
                Submit Feedback
              </button>

            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Feedback;
