import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Mail,
  Phone,
  MessageCircle,
  FileText,
  Clock,
  Users,
  Send
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <Navbar />

      <main className="dashboard-main">
        <div className="dashboard-section">

          {/* HEADER */}
          <div className="page-header">
            <div className="header-content">
              <div className="header-icon">
                <Mail size={30} />
              </div>
              <div>
                <h1 className="page-title">Contact EduTrack</h1>
                <p className="page-subtitle">
                  We’re here to help, collaborate, and listen.
                </p>
              </div>
            </div>
          </div>

          {/* INTRO TEXT */}
          <p
            style={{
              maxWidth: "900px",
              lineHeight: "1.9",
              marginBottom: "3rem",
              color: "var(--gray-700)",
            }}
          >
            EduTrack is designed to empower students and educators with meaningful
            learning insights. Whether you’re facing a technical issue, looking to
            collaborate, or want to share ideas — our team is always ready to assist.
          </p>

          {/* CONTACT OPTIONS */}
          <div
            className="help-grid"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >

            {/* EMAIL */}
            <div className="help-card hover-lift">
              <div className="help-card-icon">
                <Mail size={26} />
              </div>
              <h3>Email Support</h3>
              <p>
                Reach out for account issues, technical assistance, partnerships,
                or general questions.
              </p>
              <a
                href="mailto:support@edutrack.com"
                className="help-link"
              >
                support@edutrack.com
              </a>
            </div>

            {/* PHONE */}
            <div className="help-card hover-lift">
              <div className="help-card-icon">
                <Phone size={26} />
              </div>
              <h3>Phone Support</h3>
              <p>
                Prefer speaking directly? Call us during business hours for
                faster assistance.
              </p>
              <span className="help-link">+91 98765 43210</span>
            </div>

            {/* LIVE CHAT */}
            <div className="help-card hover-lift">
              <div className="help-card-icon">
                <MessageCircle size={26} />
              </div>
              <h3>Live Chat</h3>
              <p>
                Chat with our support team in real time for quick questions
                and troubleshooting.
              </p>
              <span className="contact-status">
                🟢 Available (Mon–Fri, 9 AM – 6 PM)
              </span>
            </div>

          </div>

          {/* BUSINESS HOURS */}
          <div
            className="card"
            style={{
              marginTop: "3rem",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <Clock size={28} />
            <div>
              <h3>Business Hours</h3>
              <p>Monday – Friday</p>
              <p>9:00 AM – 6:00 PM (IST)</p>
            </div>
          </div>

          {/* FEEDBACK CTA */}
          <div
            className="card hover-lift"
            style={{
              marginTop: "3rem",
              textAlign: "center",
              background:
                "linear-gradient(135deg, var(--primary), var(--secondary))",
              color: "white",
            }}
          >
            <Users size={40} style={{ marginBottom: "1rem" }} />
            <h2 style={{ marginBottom: "0.5rem" }}>
              Help Us Improve EduTrack
            </h2>
            <p
              style={{
                maxWidth: "750px",
                margin: "0 auto 1.5rem",
                opacity: 0.95,
              }}
            >
              Your feedback plays a huge role in shaping better learning
              experiences for students and teachers.
            </p>

            <button
              className="btn btn-light"
              onClick={() => navigate("/feedback")}
              style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}
            >
              <FileText size={18} />
              Go to Feedback
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
