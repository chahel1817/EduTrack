import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Mail, User, FileText, MessageCircle, Send, CheckCircle,
  Bug, Zap, Heart, HelpCircle, Star, ArrowLeft, RefreshCw
} from "lucide-react";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Feedback = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    userId: user?._id || null,
    category: 'other',
    rating: 5,
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Sync with user data if it loads late
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        userId: user._id
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const setCategory = (cat) => {
    setFormData(prev => ({ ...prev, category: cat }));
  };

  const setRating = (val) => {
    setFormData(prev => ({ ...prev, rating: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await api.post('/feedback', formData);
      if (response.data.success) {
        setIsSuccess(true);
        setFormData(prev => ({
          ...prev,
          subject: '',
          message: '',
          category: 'other',
          rating: 5
        }));
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(error.response?.data?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { id: 'bug', label: 'Report Bug', icon: Bug },
    { id: 'feature', label: 'New Feature', icon: Zap },
    { id: 'praise', label: 'Praise', icon: Heart },
    { id: 'help', label: 'Need Help', icon: HelpCircle },
    { id: 'other', label: 'Other', icon: MessageCircle },
  ];

  return (
    <div className="fdb2-page">
      <Navbar />

      <header className="fdb2-hero">
        <div className="fdb2-orb fdb2-orb-1" style={{ position: 'absolute', top: '-100px', left: '10%', width: '300px', height: '300px', background: 'rgba(124, 58, 237, 0.15)', filter: 'blur(80px)', borderRadius: '50%' }} />
        <h1 className="fdb2-hero-title">Help us build EduTrack</h1>
        <p className="fdb2-hero-sub">
          Your feedback helps us improve the learning experience for everyone.
        </p>
      </header>

      <main className="fdb2-container">

        {/* LEFT: FORM CARD */}
        <div className="fdb2-card">
          {isSuccess ? (
            <div className="fdb2-success animate-fade-in">
              <div className="fdb2-success-icon">
                <CheckCircle size={40} />
              </div>
              <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '16px' }}>Message Received!</h2>
              <p className="fdb2-success-sub" style={{ fontSize: '17px', marginBottom: '40px' }}>
                Thank you for your valuable feedback. Our team will review it shortly.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                <button className="fdb2-submit-btn" style={{ width: 'auto', padding: '16px 40px' }} onClick={() => setIsSuccess(false)}>
                  <RefreshCw size={18} />
                  <span>Send More Feedback</span>
                </button>
                <Link to="/dashboard" className="fdb2-submit-btn fdb2-btn-secondary" style={{ width: 'auto', padding: '16px 40px' }}>
                  <ArrowLeft size={18} />
                  <span>Back to Dashboard</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>

              <div className="fdb2-form-group" style={{ marginBottom: '36px' }}>
                <label className="fdb2-label" style={{ fontWeight: 800, fontSize: '16px', color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  What kind of feedback is this?
                </label>
                <div className="fdb2-categories" style={{ marginTop: '16px' }}>
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className={`fdb2-cat-btn ${formData.category === cat.id ? 'fdb2-cat-btn--active' : ''}`}
                      onClick={() => setCategory(cat.id)}
                    >
                      <cat.icon size={22} className="fdb2-cat-icon" />
                      <span style={{ fontSize: '11px', fontWeight: 700 }}>{cat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="fdb2-form-group" style={{ marginBottom: '36px' }}>
                <label className="fdb2-label">Overall Satisfaction</label>
                <div className="fdb2-rating-row" style={{ marginTop: '12px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={36}
                      className={`fdb2-star ${(hoverRating || formData.rating) >= star ? 'fdb2-star--active' : ''}`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    />
                  ))}
                  <span style={{ marginLeft: '16px', fontSize: '16px', fontWeight: 800, color: '#FBBF24', opacity: 0.9 }}>
                    {formData.rating} / 5
                  </span>
                </div>
              </div>

              <div className="fdb2-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div className="fdb2-form-group" style={{ margin: 0 }}>
                  <label className="fdb2-label">Locked Name</label>
                  <div className="fdb2-input-wrap">
                    <User className="fdb2-input-icon" size={17} />
                    <input
                      className={`fdb2-input ${user ? 'fdb2-input--readonly' : ''}`}
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      readOnly={!!user}
                      title={user ? "Name is fixed for your account" : ""}
                    />
                  </div>
                </div>
                <div className="fdb2-form-group" style={{ margin: 0 }}>
                  <label className="fdb2-label">Locked Email</label>
                  <div className="fdb2-input-wrap">
                    <Mail className="fdb2-input-icon" size={17} />
                    <input
                      type="email"
                      className={`fdb2-input ${user ? 'fdb2-input--readonly' : ''}`}
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      readOnly={!!user}
                      title={user ? "Email is fixed for your account" : ""}
                    />
                  </div>
                </div>
              </div>

              <div className="fdb2-form-group">
                <label className="fdb2-label">Subject</label>
                <div className="fdb2-input-wrap">
                  <FileText className="fdb2-input-icon" size={17} />
                  <input
                    className="fdb2-input"
                    name="subject"
                    placeholder="Short summary (e.g., Question about Quiz)"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="fdb2-form-group">
                <label className="fdb2-label">Details</label>
                <textarea
                  className="fdb2-input fdb2-textarea"
                  name="message"
                  placeholder="Share details about your experience..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="fdb2-submit-wrap" style={{ marginTop: '40px' }}>
                <button type="submit" className="fdb2-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="auth2-btn-spinner" style={{ width: '24px', height: '24px' }} />
                  ) : (
                    <>
                      <span style={{ fontSize: '18px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Send Feedback</span>
                      <Send size={22} className="fdb2-btn-icon" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* RIGHT: SIDEBAR */}
        <aside className="fdb2-sidebar">
          <div className="fdb2-sidebar-card">
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>Share Your Thoughts</h3>
            <p className="fdb2-sidebar-text" style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
              We're building EduTrack for you. Every suggestion or bug report helps us create a better learning platform for the community.
            </p>

            <div className="fdb2-faq-item">
              <div className="fdb2-faq-q">Found a bug?</div>
              <div className="fdb2-faq-a">Provide details about what happened and how to reproduce it. Screenshots help too!</div>
            </div>

            <div className="fdb2-faq-item">
              <div className="fdb2-faq-q">New Feature Idea?</div>
              <div className="fdb2-faq-a">Explain how it would help you or others. We love innovative ideas!</div>
            </div>

            <div className="fdb2-sidebar-footer" style={{ marginTop: '32px', paddingTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7C3AED', fontWeight: 700 }}>
                <Heart size={16} fill="#7C3AED" />
                <span>Made for Learners</span>
              </div>
            </div>
          </div>
        </aside>

      </main>

      <Footer />
    </div>
  );
};

export default Feedback;
