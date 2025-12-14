import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Video, PlayCircle } from "lucide-react";

const Tutorials = () => {
  return (
    <div className="dashboard-container">
      <Navbar />

      <main className="dashboard-main">
        <div className="dashboard-section">

          {/* HEADER */}
          <div className="page-header">
            <div className="header-content">
              <div className="header-icon">
                <Video size={32} />
              </div>
              <div>
                <h1 className="page-title">Tutorials</h1>
                <p className="page-subtitle">
                  Step-by-step guides to master EduTrack
                </p>
              </div>
            </div>
          </div>

          {/* TUTORIAL LIST */}
          <div className="help-grid">
            <div className="help-card">
              <PlayCircle size={30} />
              <h3>Getting Started</h3>
              <p>Learn how to create your first quiz and invite students.</p>
            </div>

            <div className="help-card">
              <PlayCircle size={30} />
              <h3>Quiz Creation</h3>
              <p>Understand quiz settings, timers, and question types.</p>
            </div>

            <div className="help-card">
              <PlayCircle size={30} />
              <h3>Results & Analytics</h3>
              <p>Learn how to analyze student performance and scores.</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tutorials;
