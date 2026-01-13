import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Mail, User, FileText, MessageCircle, Send, CheckCircle } from "lucide-react";
import axios from "../api/axios";

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/feedback', formData);
      if (response.status === 201) {
        setIsSuccess(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

            {isSuccess ? (
              <div className="success-message">
                <CheckCircle size={48} color="green" />
                <h3>Feedback submitted successfully!</h3>
                <p>We will look forward to working on it.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                {/* NAME */}
                <div className="form-group">
                  <label className="form-label">
                    <User size={16} className="inline-icon" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
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
                    name="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="subject"
                    className="form-input"
                    placeholder="Feedback subject"
                    value={formData.subject}
                    onChange={handleChange}
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
                    name="message"
                    className="form-textarea"
                    placeholder="Write your feedback here..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    cols={50}
                    required
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="btn btn-primary contact-submit-btn"
                  disabled={isSubmitting}
                >
                  <Send size={18} />
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Feedback;
