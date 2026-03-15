import { Link } from "react-router-dom";
import { Scale, FileCheck, AlertTriangle, Shield, Mail, CheckCircle2, BookOpen, User, Server } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Terms = () => {
  const sections = [
    {
      icon: <User size={28} />,
      title: "Account Responsibilities",
      description: "How to maintain your EduTrack profile.",
      points: [
        "Provide accurate, up-to-date registration information.",
        "Secure your account credentials and monitor access.",
        "You are responsible for all activities under your account."
      ],
      color: "var(--primary)"
    },
    {
      icon: <Shield size={28} />,
      title: "Acceptable Use",
      description: "Rules for interacting with the platform securely.",
      points: [
        "Do not engage in unauthorized scraping or data mining.",
        "Do not attempt to compromise platform security or infrastructure.",
        "Respect the community and avoid abusive usage patterns."
      ],
      color: "var(--accent)"
    },
    {
      icon: <Server size={28} />,
      title: "Platform Modifications",
      description: "Understanding changes and continuous updates.",
      points: [
        "We constantly update features to improve learning experiences.",
        "Service availability may change during scheduled maintenance.",
        "Significant policy changes will be communicated in advance."
      ],
      color: "var(--secondary)"
    },
    {
      icon: <BookOpen size={28} />,
      title: "Intellectual Property",
      description: "Ownership and usage rights for content.",
      points: [
        "You retain ownership of any content you upload or create.",
        "EduTrack holds rights to all proprietary platform code and design.",
        "By uploading, you grant us necessary processing licenses."
      ],
      color: "var(--success)"
    }
  ];

  return (
    <div className="dashboard-container">
      <Navbar />

      <main className="dashboard-main">
        <div style={{ padding: "0 24px" }}>

          {/* PREMIUM HERO */}
          <section className="hero-pro" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 60px',
            borderRadius: '40px',
            marginBottom: '80px',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center'
          }}>
            <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', background: 'radial-gradient(circle at 30% 70%, rgba(6, 182, 212, 0.15) 0%, transparent 80%)', zIndex: 0 }}></div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '99px', marginBottom: '32px', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'white' }}>
                <Scale size={16} className="text-accent" /> <span>Legal Framework</span>
              </div>
              <h1 style={{ margin: '0 0 24px', fontSize: '64px', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color: 'white' }}>Terms of <br /><span style={{ background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>Service</span></h1>
              <p style={{ margin: '0 auto', opacity: 0.9, color: 'white', fontSize: '20px', maxWidth: '650px', lineHeight: 1.6, fontWeight: 500 }}>
                These terms govern your usage of EduTrack and set the foundation for a secure, fair learning environment.
              </p>
            </div>

            <div style={{ position: 'absolute', bottom: '-60px', right: '-40px', opacity: 0.05 }}>
              <Scale size={450} color="white" />
            </div>
          </section>

          {/* META INFO */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginBottom: '80px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ color: 'var(--primary)' }}><FileCheck size={20} /></div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--gray-500)' }}>LAST UPDATED: MARCH 6, 2026</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ color: 'var(--accent)' }}><Shield size={20} /></div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--gray-500)' }}>JURISDICTION: GLOBAL</span>
            </div>
          </div>

          {/* POLICY GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '32px', marginBottom: '100px' }}>
            {sections.map((section, index) => (
              <div key={index} className="glass-card hover-lift" style={{ padding: '48px', borderRadius: '40px', border: '1px solid var(--border)', background: 'var(--white)' }}>
                <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                  <div style={{
                    background: `${section.color}15`,
                    color: section.color,
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {section.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em', color: 'var(--gray-900)' }}>{section.title}</h3>
                    <p style={{ color: 'var(--gray-400)', fontSize: '15px', fontWeight: 600, margin: 0 }}>{section.description}</p>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {section.points.map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: '12px', fontSize: '16px', color: 'var(--gray-600)', lineHeight: 1.5, fontWeight: 500 }}>
                      <span style={{ color: section.color, fontWeight: 900, paddingTop: '2px' }}><CheckCircle2 size={18} /></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* FINAL CTA */}
          <section className="glass-card" style={{
            padding: '80px 60px',
            borderRadius: '48px',
            textAlign: 'center',
            marginBottom: '100px',
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--card-bg)'
          }}>
            <div style={{ position: 'absolute', top: '-10%', left: '-5%', opacity: 0.03 }}><AlertTriangle size={300} color="var(--primary)" /></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.02em', color: 'var(--text-color)' }}>Need Clarification?</h2>
              <p style={{ color: 'var(--gray-500)', maxWidth: '600px', margin: '0 auto 48px', fontSize: '18px', lineHeight: 1.6 }}>
                If you have questions about these terms or our data practices, our legal and support teams are available.
              </p>
              <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="mailto:chahel1817@gmail.com" className="btn" style={{ background: 'var(--primary)', color: 'white', fontWeight: 900, padding: '20px 48px', borderRadius: '20px', border: 'none', fontSize: '16px', boxShadow: '0 20px 40px rgba(109, 40, 217, 0.3)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={18} /> Legal Inquiry
                </a>
                <Link to="/privacy" className="btn" style={{ background: 'var(--gray-100)', color: 'var(--gray-900)', border: '1px solid var(--border)', padding: '20px 48px', borderRadius: '20px', fontSize: '16px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                  Review Privacy Policy
                </Link>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;

