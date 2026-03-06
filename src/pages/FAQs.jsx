import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  User,
  ShieldCheck,
  BarChart3,
  Moon,
  Lock,
  MessageCircle,
  Search,
  Zap,
  Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const faqsData = [
  {
    category: "Operations",
    icon: <BookOpen size={22} />,
    question: "How do I create a quiz on EduTrack?",
    answer: "Go to Dashboard and click Create Quiz. You can add questions manually, generate questions, or upload a PDF. Review your quiz and publish it when ready."
  },
  {
    category: "Learning",
    icon: <User size={22} />,
    question: "How can students attempt a quiz?",
    answer: "Students can open Quizzes from the dashboard, choose a quiz, and start. Keep your internet connection stable while taking a quiz."
  },
  {
    category: "Analytics",
    icon: <BarChart3 size={22} />,
    question: "Where can I see my quiz results?",
    answer: "Results are updated right after submission. Students can check the Results tab, and teachers can view class performance insights in reports."
  },
  {
    category: "Interface",
    icon: <Moon size={22} />,
    question: "Does EduTrack support dark mode?",
    answer: "Yes. EduTrack supports both light and dark themes. Use the theme toggle in the top bar, and your preference is saved."
  },
  {
    category: "Security",
    icon: <Lock size={22} />,
    question: "Is my data safe on EduTrack?",
    answer: "Yes. We use strong security practices, including encryption and protected access controls, to keep your account and data safe."
  },
  {
    category: "Account",
    icon: <ShieldCheck size={22} />,
    question: "What should I do if I forget my password?",
    answer: "Click Forgot Password on the login page, enter your email, and follow the OTP steps to reset your password."
  }
];

const FAQs = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = faqsData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <Navbar />

      <main className="dashboard-main">
        <div style={{ padding: '0 24px' }}>

          {/* PREMIUM HERO */}
          <section className="hero-pro" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 60px',
            borderRadius: '40px',
            marginBottom: '80px',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            color: 'white'
          }}>
            <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', background: 'radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 70%)', zIndex: 0 }}></div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '99px', marginBottom: '32px', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                <HelpCircle size={16} className="text-white" /> <span>Support Hub</span>
              </div>
              <h1 style={{ margin: '0 0 24px', fontSize: '64px', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>Frequently <br /><span style={{ color: 'rgba(255,255,255,0.7)' }}>Asked Questions</span></h1>
              <p style={{ margin: '0 auto', opacity: 0.9, fontSize: '20px', maxWidth: '650px', lineHeight: 1.6, fontWeight: 500 }}>
                Everything you need to get started and use EduTrack with confidence.
              </p>
            </div>

            <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', opacity: 0.1 }}>
              <MessageCircle size={400} color="white" />
            </div>
          </section>

          {/* SEARCH BAR */}
          <div style={{ maxWidth: '800px', margin: '0 auto 80px', position: 'relative' }}>
            <Search size={24} style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
            <input
              type="text"
              placeholder="Search the knowledge base..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '28px 28px 28px 72px',
                borderRadius: '32px',
                border: '1px solid var(--border)',
                background: 'var(--white)',
                fontSize: '18px',
                fontWeight: 500,
                boxShadow: 'var(--shadow-lg)'
              }}
            />
          </div>

          {/* FAQ ACCORDION */}
          <div style={{ maxWidth: '900px', margin: '0 auto 120px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredFaqs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '100px 40px', background: 'var(--gray-50)', borderRadius: '32px', border: '1px dashed var(--border)' }}>
                <Globe size={48} style={{ margin: '0 auto 24px', color: 'var(--gray-300)' }} />
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--gray-700)' }}>No matching result found</h3>
                <p style={{ color: 'var(--gray-400)' }}>Try a different search term or browse our categories.</p>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className={`glass-card hover-lift ${openIndex === index ? 'active' : ''}`}
                  style={{
                    padding: '32px',
                    borderRadius: '32px',
                    border: '1px solid var(--border)',
                    background: 'var(--white)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{
                        background: 'var(--gray-50)',
                        color: 'var(--primary)',
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                      }}>
                        {faq.icon}
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.1em', marginBottom: '8px', display: 'block' }}>{faq.category}</span>
                        <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gray-900)', margin: 0, letterSpacing: '-0.01em' }}>{faq.question}</h3>
                      </div>
                    </div>
                    <div style={{ color: openIndex === index ? 'var(--primary)' : 'var(--gray-300)' }}>
                      {openIndex === index ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </div>
                  </div>

                  {openIndex === index && (
                    <div style={{
                      marginTop: '32px',
                      paddingTop: '32px',
                      borderTop: '1px solid var(--gray-100)',
                      fontSize: '17px',
                      lineHeight: 1.8,
                      color: 'var(--gray-500)',
                      fontWeight: 500,
                      animation: 'fadeInUp 0.4s ease'
                    }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* CONTACT CTA */}
          <section className="glass-card" style={{
            padding: '80px 60px',
            borderRadius: '48px',
            textAlign: 'center',
            marginBottom: '100px',
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--card-bg)'
          }}>
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '300px', height: '300px', background: 'var(--primary)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1 }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Zap size={48} fill="var(--primary)" style={{ color: 'var(--primary)', marginBottom: '24px' }} />
              <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '16px', color: 'var(--text-color)' }}>Still have questions?</h2>
              <p style={{ color: 'var(--gray-500)', fontSize: '18px', maxWidth: '600px', margin: '0 auto 48px' }}>
                If you can't find what you're looking for, our support team is ready to help.
              </p>
              <button className="btn" onClick={() => navigate('/contact')} style={{
                background: 'var(--primary)',
                color: 'white',
                fontWeight: 900,
                padding: '20px 48px',
                borderRadius: '20px',
                fontSize: '16px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 20px 40px rgba(109, 40, 217, 0.3)'
              }}>
                Contact Support
              </button>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQs;
