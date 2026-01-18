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
          <section className="dashboard-section hero-pro" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div className="header-icon" style={{ background: 'rgba(255,255,255,0.2)', width: '60px', height: '60px' }}>
                <FileText size={32} color="white" />
              </div>
              <div>
                <h1 className="hero-pro-title" style={{ margin: 0, fontSize: '32px' }}>Feedback</h1>
                <p className="hero-pro-sub" style={{ margin: 0, opacity: 0.9 }}>
                  Your feedback helps us build a better learning experience.
                </p>
              </div>
            </div>
            <MessageCircle size={80} style={{ opacity: 0.2, color: 'white' }} />
          </section>

          {/* FORM CARD */}
          <div className="glass-card contact-form-card" style={{ maxWidth: '700px', margin: '0 auto', padding: '40px', border: '1px solid var(--border)' }}>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '10px' }}>We'd love to hear from you</h2>
              <p style={{ color: 'var(--gray-500)', fontSize: '16px' }}>
                Share your thoughts, report issues, or suggest new features.
              </p>
            </div>

            {isSuccess ? (
              <div className="success-message animate-fade-in" style={{
                textAlign: 'center',
                padding: '50px 30px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(34, 197, 94, 0.1))',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '24px',
                color: '#10B981'
              }}>
                <CheckCircle size={80} style={{ margin: '0 auto 24px', color: '#10B981' }} />
                <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>Feedback Received!</h3>
                <p style={{ fontSize: '17px', opacity: 0.9 }}>Thank you for helping us improve EduTrack.</p>
                <button className="btn btn-primary" style={{ marginTop: '24px', padding: '12px 30px' }} onClick={() => setIsSuccess(false)}>Send Another</button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {/* NAME */}
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px', color: 'var(--gray-600)' }}>
                      Full Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                      <input
                        type="text"
                        name="name"
                        className="input-field"
                        style={{ width: '100%', paddingLeft: '45px' }}
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px', color: 'var(--gray-600)' }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                      <input
                        type="email"
                        name="email"
                        className="input-field"
                        style={{ width: '100%', paddingLeft: '45px' }}
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* SUBJECT */}
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px', color: 'var(--gray-600)' }}>
                    Subject
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FileText size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                    <input
                      type="text"
                      name="subject"
                      className="input-field"
                      style={{ width: '100%', paddingLeft: '45px' }}
                      placeholder="Feedback subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* MESSAGE */}
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px', color: 'var(--gray-600)' }}>
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    className="input-field"
                    style={{ width: '100%', minHeight: '150px' }}
                    placeholder="Tell us what's on your mind..."
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
                  style={{ width: '100%', marginTop: '10px', padding: '16px', fontSize: '16px', fontWeight: 800, borderRadius: '16px', boxShadow: '0 10px 20px rgba(109, 40, 217, 0.2)' }}
                >
                  {isSubmitting ? "Sending Thoughts..." : "Send Message"}
                  <Send size={20} />
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
