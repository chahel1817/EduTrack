import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Mail,
  Phone,
  MessageCircle,
  FileText,
  Clock,
  Users,
  Send,
  Zap,
  Shield,
  MapPin,
  Cpu,
  Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <Navbar />

      <main className="dashboard-main">
        <div style={{ padding: '0 24px' }}>

          {/* HEADER HERO */}
          <section className="hero-pro" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '120px 60px',
            borderRadius: '40px',
            marginBottom: '80px',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
            background: 'linear-gradient(135deg, var(--black) 0%, #1a1a1a 100%)',
            color: 'white'
          }}>
            <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', background: 'radial-gradient(circle at 70% 30%, rgba(109, 40, 217, 0.15) 0%, transparent 70%)', zIndex: 0 }}></div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '99px', marginBottom: '32px', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                <Cpu size={16} className="text-primary" /> <span>Learning Connection Hub</span>
              </div>
              <h1 style={{ margin: '0 0 24px', fontSize: '64px', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>Contact the <span style={{ background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Core Architect</span></h1>
              <p style={{ margin: '0 auto', opacity: 0.7, fontSize: '20px', maxWidth: '650px', lineHeight: 1.6, fontWeight: 500 }}>
                Whether you're scaling an institution or refining individual learning paths, our strategic response team is integrated and ready.
              </p>
            </div>

            <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', opacity: 0.05 }}>
              <Globe size={400} color="white" />
            </div>
          </section>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px', marginBottom: '100px' }}>

            {/* LEFT: CONTACT CHANNELS & WORKFLOW */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

              {/* SUPPORT SYSTEM WORKFLOW */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 900 }}>1</div>
                  <h4 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>Identify</h4>
                  <p style={{ fontSize: '12px', color: 'var(--gray-500)', margin: 0 }}>Define your architectural or pedagogical query.</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gray-200)', color: 'var(--gray-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 900 }}>2</div>
                  <h4 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>Connect</h4>
                  <p style={{ fontSize: '12px', color: 'var(--gray-500)', margin: 0 }}>Reach our team by email or direct call.</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gray-200)', color: 'var(--gray-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 900 }}>3</div>
                  <h4 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>Optimize</h4>
                  <p style={{ fontSize: '12px', color: 'var(--gray-500)', margin: 0 }}>Receive high-precision strategic resolution.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                <div className="glass-card hover-lift" style={{ padding: '48px', borderRadius: '40px', border: '1px solid var(--border)', background: 'var(--gray-50)' }}>
                  <div style={{ background: 'var(--primary)', color: 'white', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', boxShadow: '0 12px 24px rgba(109, 40, 217, 0.2)' }}>
                    <Mail size={32} />
                  </div>
                  <h3 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.02em' }}>Email Protocol</h3>
                  <p style={{ color: 'var(--gray-500)', fontSize: '16px', lineHeight: 1.7, marginBottom: '32px' }}>Enterprise-grade communication for formal documentation, security reports, and mission-critical inquiries.</p>
                  <a href="mailto:chahel1817@gmail.com" className="btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', color: 'white', fontWeight: 800, textDecoration: 'none', fontSize: '16px', padding: '16px 32px', background: 'var(--primary)', borderRadius: '16px', boxShadow: '0 10px 20px rgba(109, 40, 217, 0.2)' }}>
                    chahel1817@gmail.com <Send size={18} />
                  </a>
                </div>

                <div className="glass-card hover-lift" style={{ padding: '48px', borderRadius: '40px', border: '1px solid var(--border)', background: 'var(--gray-50)' }}>
                  <div style={{ background: 'var(--accent)', color: 'white', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', boxShadow: '0 12px 24px rgba(6, 182, 212, 0.2)' }}>
                    <Phone size={32} />
                  </div>
                  <h3 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.02em' }}>Direct Voice</h3>
                  <p style={{ color: 'var(--gray-500)', fontSize: '16px', lineHeight: 1.7, marginBottom: '32px' }}>Synchronous high-bandwidth communication for strategic partnerships and urgent instructional support cases.</p>
                  <span className="btn" style={{ display: 'inline-block', color: 'var(--accent)', fontWeight: 900, fontSize: '20px', padding: '16px 32px', background: 'white', borderRadius: '16px', border: '2px solid var(--accent)' }}>
                    +91 9328764005
                  </span>
                </div>
              </div>

              {/* FEEDBACK CTA */}
              <div style={{
                padding: '64px',
                borderRadius: '48px',
                background: 'var(--black)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '40px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.1 }}><Users size={200} /></div>
                <div style={{ flex: 1, minWidth: '350px', position: 'relative', zIndex: 1 }}>
                  <div style={{ color: 'var(--primary)', marginBottom: '24px' }}><Zap size={48} fill="var(--primary)" /></div>
                  <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.04em' }}>Learning Contributions</h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                    Our ecosystem thrives on user entropy. Report anomalies or suggest complex feature sets to drive our next development cycle.
                  </p>
                </div>
                <button className="btn" onClick={() => navigate('/feedback')} style={{ background: 'white', color: 'var(--black)', fontWeight: 900, padding: '24px 56px', borderRadius: '24px', border: 'none', fontSize: '18px', zIndex: 1, cursor: 'pointer', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                  Pulse Feedback Loop
                </button>
              </div>
            </div>

            {/* RIGHT: DETAILS & STATUS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div className="glass-card" style={{ padding: '40px', borderRadius: '40px', border: '1px solid var(--border)', background: 'var(--white)' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '32px', letterSpacing: '0.2em' }}>Live Station Status</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--gray-50)', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={24} /></div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 900, fontSize: '16px' }}>Strategic Window</p>
                      <p style={{ margin: 0, color: 'var(--gray-500)', fontSize: '13px' }}>Mon - Fri, 09:00 - 18:00 IST</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Shield size={24} /></div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 900, fontSize: '16px' }}>Network Security</p>
                      <p style={{ margin: 0, color: 'var(--success)', fontSize: '13px', fontWeight: 800 }}>Fully Encrypted & Online</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '40px', borderRadius: '40px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '32px', letterSpacing: '0.2em' }}>Physical Vector</h3>
                <div style={{ display: 'flex', alignItems: 'start', gap: '20px' }}>
                  <div style={{ color: 'var(--primary)', marginTop: '4px' }}><MapPin size={24} /></div>
                  <p style={{ fontSize: '16px', color: 'var(--gray-600)', lineHeight: 1.8, margin: 0, fontWeight: 500 }}>
                    EduTrack Technologies HQ<br />
                    Ahmedabad, Gujarat<br />
                    380001, India
                  </p>
                </div>
              </div>


            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;

