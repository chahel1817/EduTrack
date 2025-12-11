import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <div className="dashboard-section">
            <div className="text-center">
              <div style={{ fontSize: '6rem', marginBottom: '1.5rem', animation: 'bounce 2s infinite' }}>
                <CheckCircle size={80} style={{ color: 'var(--success)' }} />
              </div>
              <h2 style={{
                fontSize: '36px',
                fontWeight: '700',
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, var(--success), var(--blue))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.5px'
              }}>
                Message Sent Successfully!
              </h2>
              <p style={{
                fontSize: '18px',
                color: '#64748b',
                marginBottom: '2rem',
                maxWidth: '600px',
                margin: '0 auto 3rem auto',
                lineHeight: '1.6'
              }}>
                Thank you for reaching out! We've received your message and will get back to you within 24 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                }}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  margin: '0 auto',
                  padding: '16px 32px',
                  fontSize: '16px',
                  animation: 'pulse 2s infinite'
                }}
              >
                Send Another Message
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        <div className="dashboard-section">
          {/* Header */}
          <div className="page-header">
            <div className="header-content">
              <div className="header-icon">
                <Mail size={32} />
              </div>
              <div>
                <h1 className="page-title">Contact Us</h1>
                <p className="page-subtitle">Get in touch with our support team</p>
              </div>
            </div>
          </div>

          <div className="contact-container">
            {/* Contact Info */}
            <div className="contact-info">
              <div className="info-card">
                <div className="info-icon">
                  <Mail size={24} />
                </div>
                <h3>Email Support</h3>
                <p>Get help with technical issues, account problems, or general inquiries.</p>
                <a href="mailto:support@edutrack.com" className="contact-link">
                  support@edutrack.com
                </a>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <MessageSquare size={24} />
                </div>
                <h3>Live Chat</h3>
                <p>Chat with our support team for immediate assistance.</p>
                <span className="contact-status">Available 9 AM - 6 PM EST</span>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-card">
              <h2 className="form-title">Send us a Message</h2>
              <p className="form-subtitle">Fill out the form below and we'll get back to you soon.</p>

              <form onSubmit={handleSubmit} className="contact-form">
                {error && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select a subject</option>
                    <option value="technical">Technical Support</option>
                    <option value="account">Account Issues</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="feature">Feature Request</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Describe your issue or question..."
                    rows={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary contact-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
