import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, Lock, Eye, Database, Mail, UserCheck, Scale, FileText, Globe, Zap } from 'lucide-react';
import { Clock } from 'lucide-react';

const Privacy = () => {
  const sections = [
    {
      icon: <Database size={24} />,
      title: "What We Collect",
      description: "How we collect data to run and improve your learning experience.",
      content: [
        "Basic account details like email and role",
        "Quiz performance and score history",
        "App usage data to improve usability",
        "Security logs to protect accounts"
      ],
      color: "var(--primary)"
    },
    {
      icon: <Lock size={24} />,
      title: "How We Use It",
      description: "How your data helps us deliver better learning outcomes.",
      content: [
        "Personalized quiz and learning recommendations",
        "Question generation and quiz setup features",
        "Core platform operation and maintenance",
        "Fraud prevention and account verification",
        "Product improvements based on trends"
      ],
      color: "var(--accent)"
    },
    {
      icon: <Eye size={24} />,
      title: "Transparency",
      description: "Our commitment to being clear about your data.",
      content: [
        "We do not sell your personal data",
        "Data is shared only when needed to run core services",
        "We comply with valid legal requests",
        "Anonymous aggregate data may be used for product research"
      ],
      color: "var(--secondary)"
    },
    {
      icon: <Shield size={24} />,
      title: "Security",
      description: "Strong protections for your account and data.",
      content: [
        "Encryption in storage and during transfer",
        "Regular security testing and audits",
        "Role-based access controls",
        "Reliable infrastructure and backups"
      ],
      color: "var(--success)"
    }
  ];

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
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: 'white'
          }}>
            <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', background: 'radial-gradient(circle at 50% 50%, rgba(109, 40, 217, 0.1) 0%, transparent 80%)', zIndex: 0 }}></div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '99px', marginBottom: '32px', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                <Shield size={16} className="text-primary" /> <span>Privacy & Security</span>
              </div>
              <h1 style={{ margin: '0 0 24px', fontSize: '64px', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>Privacy <br /><span style={{ background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Policy</span></h1>
              <p style={{ margin: '0 auto', opacity: 0.7, fontSize: '20px', maxWidth: '650px', lineHeight: 1.6, fontWeight: 500 }}>
                We protect your personal data and explain clearly how it is used.
              </p>
            </div>

            <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', opacity: 0.05 }}>
              <Lock size={400} color="white" />
            </div>
          </section>

          {/* META INFO */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginBottom: '80px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ color: 'var(--primary)' }}><Clock size={20} /></div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--gray-500)' }}>VERSION: v4.2.0</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ color: 'var(--accent)' }}><Globe size={20} /></div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--gray-500)' }}>COMPLIANCE: GDPR & CCPA</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ color: 'var(--success)' }}><Shield size={20} /></div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--gray-500)' }}>ENCRYPTION: AES-256</span>
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
                    <h3 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>{section.title}</h3>
                    <p style={{ color: 'var(--gray-400)', fontSize: '15px', fontWeight: 600, margin: 0 }}>{section.description}</p>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {section.content.map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: '12px', fontSize: '16px', color: 'var(--gray-600)', lineHeight: 1.5, fontWeight: 500 }}>
                      <span style={{ color: section.color, fontWeight: 900 }}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* DETAILED USER RIGHTS */}
          <section className="glass-card" style={{ padding: '80px', borderRadius: '48px', background: 'var(--gray-950)', color: 'white', marginBottom: '100px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '400px', height: '400px', background: 'var(--accent)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.1 }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h2 style={{ fontSize: '42px', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.03em' }}>Your Data Rights</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>You stay in control of your personal data.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
                {[
                  { title: "Access", desc: "Request a copy of your account data." },
                  { title: "Delete", desc: "Request deletion of your data when eligible." },
                  { title: "Correct", desc: "Update inaccurate personal details." },
                  { title: "Limit", desc: "Request limits on specific types of processing." }
                ].map((r, i) => (
                  <div key={i} style={{ padding: '32px', background: 'rgba(255,255,255,0.03)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '12px', color: 'var(--primary)' }}>{r.title}</h4>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CONTACT CTA */}
          <section style={{ textAlign: 'center', marginBottom: '120px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '16px 32px', background: 'var(--gray-50)', borderRadius: '24px', border: '1px solid var(--border)' }}>
              <Mail size={24} className="text-primary" />
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 900, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Privacy Officer</p>
                <p style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--gray-900)' }}>privacy@edutrack.io</p>
              </div>
              <button className="btn" onClick={() => window.location.href = '/contact'} style={{ marginLeft: '24px', padding: '12px 24px', background: 'var(--primary)', color: 'white', borderRadius: '14px', fontSize: '14px', fontWeight: 800, border: 'none' }}>
                Contact Us
              </button>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
