import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  HelpCircle,
  Book,
  MessageCircle,
  Video,
  FileText,
  ChevronRight,
  Search,
  Zap,
  Globe,
  Lock,
  Cpu,
  Shield,
  Star
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Help = () => {
  const navigate = useNavigate();

  const resources = [
    {
      icon: <Book size={28} />,
      title: "Guides & Docs",
      desc: "Simple guides for creating quizzes and managing student progress.",
      link: "/docs",
      color: "var(--primary)"
    },
    {
      icon: <Video size={28} />,
      title: "Video Tutorials",
      desc: "Quick walkthroughs to help you use each feature with confidence.",
      link: "/tutorials",
      color: "var(--accent)"
    },
    {
      icon: <FileText size={28} />,
      title: "FAQ",
      desc: "Find fast answers to common questions.",
      link: "/faqs",
      color: "var(--secondary)"
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
            padding: '120px 60px',
            borderRadius: '40px',
            marginBottom: '80px',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center'
          }}>
            <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', background: 'radial-gradient(circle at 50% 50%, rgba(109, 40, 217, 0.15) 0%, transparent 80%)', zIndex: 0 }}></div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '99px', marginBottom: '32px', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                <Cpu size={16} className="text-primary" /> <span>Help Center</span>
              </div>
              <h1 style={{ margin: '0 0 24px', fontSize: '72px', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>How can we <br /><span style={{ background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>help</span> you?</h1>
              <p style={{ margin: '0 auto 48px', opacity: 0.7, fontSize: '20px', maxWidth: '650px', lineHeight: 1.6, fontWeight: 500 }}>
                Find quick help, learn features, and solve issues without the guesswork.
              </p>

              <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
                <Search size={22} style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                <input
                  type="text"
                  placeholder="Search your question..."
                  style={{
                    width: '100%',
                    padding: '24px 24px 24px 64px',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 500,
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </div>
            </div>

            <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', opacity: 0.05 }}>
              <Shield size={500} color="white" />
            </div>
          </section>

          {/* RESOURCE GRID */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '100px' }}>
            {resources.map((r, i) => (
              <div key={i} className="glass-card hover-lift" style={{ padding: '60px 48px', borderRadius: '40px', border: '1px solid var(--border)', background: 'var(--white)' }}>
                <div style={{
                  background: `${r.color}15`,
                  color: r.color,
                  width: '72px',
                  height: '72px',
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '32px'
                }}>
                  {r.icon}
                </div>
                <h3 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.02em' }}>{r.title}</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: '16px', lineHeight: 1.7, marginBottom: '32px', minHeight: '3.4em' }}>{r.desc}</p>
                <Link to={r.link} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', color: r.color, fontWeight: 900, textDecoration: 'none', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Open Guide <ChevronRight size={18} />
                </Link>
              </div>
            ))}
          </section>

          {/* HELP TOPICS (MAKING IT LENGTHY) */}
          <section style={{ marginBottom: '120px' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <h2 style={{ fontSize: '42px', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.03em' }}>Popular Help Topics</h2>
              <p style={{ color: 'var(--gray-400)', fontSize: '18px', fontWeight: 600 }}>Choose a topic and get clear next steps.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>
              <div className="glass-card" style={{ padding: '48px', borderRadius: '40px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'start' }}>
                  <div style={{ color: 'var(--primary)', padding: '12px', background: 'rgba(109, 40, 217, 0.1)', borderRadius: '16px' }}><Star size={24} /></div>
                  <div>
                    <h4 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '16px' }}>Teacher Workflows</h4>
                    <p style={{ color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: '24px' }}>Learn how to create quizzes quickly, review results, and track class progress with less effort.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {['Question Generator', 'Quiz Setup', 'Grading Rules'].map(t => (
                        <div key={t} style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%' }}></div> {t}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '48px', borderRadius: '40px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'start' }}>
                  <div style={{ color: 'var(--accent)', padding: '12px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '16px' }}><Zap size={24} /></div>
                  <div>
                    <h4 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '16px' }}>Student Learning</h4>
                    <p style={{ color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: '24px' }}>Learn how to take quizzes smoothly, understand your results, and keep improving over time.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {['Session Persistence', 'Analytics Interpretation', 'Badging System'].map(t => (
                        <div key={t} style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%' }}></div> {t}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FINAL CTA: DIRECT SUPPORT */}
          <section className="glass-card" style={{
            padding: '100px 60px',
            borderRadius: '48px',
            textAlign: 'center',
            marginBottom: '100px',
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--card-bg)'
          }}>
            <div style={{ position: 'absolute', top: '-10%', left: '-5%', opacity: 0.05 }}><MessageCircle size={300} color="var(--primary)" /></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: '38px', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.02em', color: 'var(--text-color)' }}>Still need help?</h2>
              <p style={{ color: 'var(--gray-500)', maxWidth: '600px', margin: '0 auto 48px', fontSize: '18px', lineHeight: 1.6 }}>
                If the guides did not solve your issue, our support team is ready to help directly.
              </p>
              <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
                <button className="btn" onClick={() => navigate('/contact')} style={{ background: 'var(--primary)', color: 'white', fontWeight: 900, padding: '20px 48px', borderRadius: '20px', border: 'none', fontSize: '16px', boxShadow: '0 20px 40px rgba(109, 40, 217, 0.3)' }}>
                  Contact Support
                </button>
                <button className="btn" style={{ background: 'var(--gray-100)', color: 'var(--gray-900)', border: '1px solid var(--border)', padding: '20px 48px', borderRadius: '20px', fontSize: '16px', fontWeight: 800 }}>
                  Visit Community
                </button>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Help;
