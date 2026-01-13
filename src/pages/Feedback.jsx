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
                <FileText size={32} />
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
          <div className="card contact-form-card" style={{ maxWidth: '600px', margin: '0 auto' }}>

            <div className="card-header" style={{ textAlign: 'center', paddingBottom: '24px' }}>
              <h2 className="card-title" style={{ fontSize: '24px', marginBottom: '8px' }}>We'd love to hear from you</h2>
              <p className="card-subtitle" style={{ fontSize: '16px' }}>
                Share your thoughts, report issues, or suggest new features.
              </p>
            </div>

            {isSuccess ? (
              <div className="success-message" style={{
                textAlign: 'center',
                padding: '40px 24px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(34, 197, 94, 0.1))',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--accent-dark)'
              }}>
                <CheckCircle size={64} style={{ margin: '0 auto 16px', color: 'var(--accent-dark)' }} />
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Feedback submitted successfully!</h3>
                <p style={{ fontSize: '16px', opacity: 0.8 }}>We will look forward to working on it.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* NAME */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '8px' }}>
                    <User size={18} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="input-field"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* EMAIL */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '8px' }}>
                    <Mail size={18} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="input-field"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* SUBJECT */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '8px' }}>
                    <FileText size={18} />
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    className="input-field"
                    placeholder="Feedback subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* MESSAGE */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '8px' }}>
                    <MessageCircle size={18} />
                    Message
                  </label>
                  <textarea
                    name="message"
                    className="input-field"
                    placeholder="Write your feedback here..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <Send size={20} />
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
