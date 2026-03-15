import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Video, PlayCircle, Clock, Star, Zap, Cpu, Globe, ArrowRight, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Tutorials = () => {
  const navigate = useNavigate();
  const briefings = [
    {
      title: "Getting Started",
      duration: "4:20",
      difficulty: "Beginner",
      desc: "A quick walkthrough of the dashboard and account setup.",
      color: "var(--primary)"
    },
    {
      title: "Question Generator",
      duration: "8:45",
      difficulty: "Intermediate",
      desc: "Learn how to generate questions and build quizzes from PDF notes.",
      color: "var(--accent)"
    },
    {
      title: "Reading Analytics",
      duration: "6:12",
      difficulty: "Advanced",
      desc: "Understand performance reports and spot areas that need improvement.",
      color: "var(--secondary)"
    },
    {
      title: "Account Security",
      duration: "3:50",
      difficulty: "Beginner",
      desc: "Best practices to keep your account secure and protected.",
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
            padding: '60px 60px',
            borderRadius: '40px',
            marginBottom: '80px',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)',
            color: 'white'
          }}>
            <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', background: 'radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 60%)', zIndex: 0 }}></div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)', borderRadius: '99px', marginBottom: '32px', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                <Video size={16} fill="white" /> <span>Tutorial Center</span>
              </div>
              <h1 style={{ margin: '0 0 24px', fontSize: '64px', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>Video <br /><span style={{ color: 'rgba(255,255,255,0.7)' }}>Tutorials</span></h1>
              <p style={{ margin: '0 auto', opacity: 0.9, fontSize: '20px', maxWidth: '650px', lineHeight: 1.6, fontWeight: 500 }}>
                Learn faster with practical walkthroughs and easy step-by-step videos.
              </p>
            </div>

            <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', opacity: 0.15 }}>
              <PlayCircle size={400} color="white" />
            </div>
          </section>

          {/* BRIEFING GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px', marginBottom: '100px' }}>
            {briefings.map((b, i) => (
              <div key={i} className="glass-card hover-lift" style={{ borderRadius: '40px', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--white)' }}>
                {/* MOCK VIDEO THUMBNAIL */}
                <div style={{ height: '240px', background: 'var(--gray-900)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `linear-gradient(45deg, ${b.color}, transparent)`, opacity: 0.2 }}></div>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.3s ease', cursor: 'pointer' }} className="pulse-sync">
                    <PlayCircle size={40} color="white" fill="white" />
                  </div>
                  <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 900, color: 'white' }}>{b.duration}</div>
                </div>

                <div style={{ padding: '40px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: b.color, background: `${b.color}15`, padding: '4px 12px', borderRadius: '99px', letterSpacing: '0.1em' }}>{b.difficulty}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--gray-300)' }}>
                      <Star size={14} fill="var(--gray-300)" />
                      <Star size={14} fill="var(--gray-300)" />
                      <Star size={14} fill="var(--gray-300)" />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.02em' }}>{b.title}</h3>
                  <p style={{ color: 'var(--gray-500)', fontSize: '15px', lineHeight: 1.7, marginBottom: '32px', minHeight: '5.1em' }}>{b.desc}</p>

                  <button className="btn" style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'var(--gray-50)', color: 'var(--gray-900)', fontWeight: 800, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer' }}>
                    Watch Tutorial <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ADVANCED TRACK SECTION */}
          <section className="glass-card" style={{ padding: '80px', borderRadius: '48px', background: 'var(--gray-950)', color: 'white', marginBottom: '60px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', background: 'var(--primary)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.1 }}></div>
            <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '42px', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.04em' }}>Advanced Track</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px', lineHeight: 1.6, marginBottom: '40px' }}>
                  Level up with advanced guides for larger classes, deeper reporting, and better workflow management.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {[
                    { title: "Class Strategy", icon: <Globe size={24} /> },
                    { title: "Progress Insights", icon: <Cpu size={24} /> },
                    { title: "Account Control", icon: <Shield size={24} /> }
                  ].map(t => (
                    <div key={t.title} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ color: 'var(--primary)' }}>{t.icon}</div>
                      <span style={{ fontWeight: 800, fontSize: '18px' }}>{t.title}</span>
                      <ArrowRight size={20} style={{ marginLeft: 'auto', opacity: 0.3 }} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', height: '100%', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <Zap size={80} color="var(--primary)" fill="var(--primary)" style={{ marginBottom: '24px', filter: 'drop-shadow(0 0 20px var(--primary))' }} className="pulse-sync" />
                  <h4 style={{ fontWeight: 900, fontSize: '24px' }}>Locked Resources</h4>
                  <p style={{ color: 'var(--gray-500)', fontSize: '14px' }}>Complete all beginner tutorials to unlock.</p>
                </div>
              </div>
            </div>
          </section>

          {/* FINAL CTA */}
          <section style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '24px' }}>Need a personalized walkthrough?</h2>
            <button className="btn" onClick={() => navigate("/contact")} style={{ background: 'var(--primary)', color: 'white', fontWeight: 900, padding: '20px 48px', borderRadius: '20px', border: 'none', fontSize: '16px', boxShadow: '0 20px 40px rgba(109, 40, 217, 0.3)' }}>
              Request 1-on-1 Help
            </button>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tutorials;
