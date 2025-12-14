import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  BookOpen,
  Layers,
  BarChart3,
  Shield,
  Code,
  CheckCircle
} from "lucide-react";

const Documentation = () => {
  return (
    <div className="dashboard-container">
      <Navbar />

      <main className="dashboard-main">
        <div className="dashboard-section">

          {/* HEADER */}
          <div className="page-header">
            <div className="header-content">
              <div className="header-icon">
                <BookOpen size={32} />
              </div>
              <div>
                <h1 className="page-title">Documentation</h1>
                <p className="page-subtitle">
                  Everything you need to understand and use EduTrack effectively
                </p>
              </div>
            </div>
          </div>

          {/* FEATURES OVERVIEW */}
          <section className="doc-section">
            <h2 className="section-title">
              <Layers size={22} /> Features Overview
            </h2>

            <ul className="doc-list">
              <li>
                <CheckCircle size={18} />
                Create quizzes with multiple-choice questions
              </li>
              <li>
                <CheckCircle size={18} />
                Time-based quizzes & per-question timers
              </li>
              <li>
                <CheckCircle size={18} />
                Role-based access for students and teachers
              </li>
              <li>
                <CheckCircle size={18} />
                Real-time quiz attempts and auto-evaluation
              </li>
            </ul>
          </section>

          {/* SCORING & RESULTS */}
          <section className="doc-section">
            <h2 className="section-title">
              <BarChart3 size={22} /> Scoring & Results
            </h2>

            <p className="doc-text">
              EduTrack automatically evaluates quizzes upon submission.
              Teachers can view detailed analytics including student scores,
              accuracy per question, and overall performance trends.
            </p>
          </section>

          {/* API / INTEGRATION */}
          <section className="doc-section">
            <h2 className="section-title">
              <Code size={22} /> API & Integration
            </h2>

            <p className="doc-text">
              EduTrack provides REST APIs for authentication, quiz management,
              and results tracking. These APIs can be integrated with external
              systems such as learning platforms or dashboards.
            </p>

            <p className="doc-text">
              All APIs are secured using JWT authentication and role-based
              authorization.
            </p>
          </section>

          {/* PRIVACY */}
          <section className="doc-section">
            <h2 className="section-title">
              <Shield size={22} /> Privacy & Security
            </h2>

            <p className="doc-text">
              User data is securely stored using encrypted passwords and protected
              endpoints. EduTrack follows best practices for data privacy and
              access control.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Documentation;
