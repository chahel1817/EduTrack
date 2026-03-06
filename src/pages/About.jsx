import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { GraduationCap, Users, BookOpen, Award, Target, TrendingUp, Heart, Star, Sparkles, Zap, Shield, Globe } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: <BookOpen size={24} />,
      title: "Adaptive Quizzes",
      description: "Our quiz flow helps students practice at the right level and improve step by step."
    },
    {
      icon: <Zap size={24} />,
      title: "Instant Results",
      description: "Get quick feedback after every quiz so learners know where to improve."
    },
    {
      icon: <Users size={24} />,
      title: "Collaborative Ecosystem",
      description: "Teachers and students synchronize in a unified environment designed for maximum instructional efficiency."
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Progress Insights",
      description: "Track growth over time and identify strengths and gaps clearly."
    }
  ];

  const timeline = [
    { year: "2024", event: "EduTrack idea and early prototype launched.", icon: <Target size={18} /> },
    { year: "2025", event: "Smart question generation and PDF quiz creation added.", icon: <Sparkles size={18} /> },
    { year: "2026", event: "EduTrack grows with students and teachers worldwide.", icon: <Globe size={18} /> },
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
            textAlign: 'center',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            color: 'white'
          }}>
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', borderRadius: '99px', marginBottom: '32px', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <Star size={16} fill="white" /> <span>Built for Better Learning</span>
              </div>
              <h1 style={{ margin: '0 0 24px', fontSize: '72px', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em' }}>
                Helping <br /><span style={{ color: 'rgba(255,255,255,0.7)' }}>every learner grow.</span>
              </h1>
              <p style={{ margin: '0 auto 48px', opacity: 0.9, fontSize: '20px', lineHeight: 1.6, maxWidth: '650px', fontWeight: 500 }}>
                EduTrack is a practical learning platform for teachers and students to create quizzes, track results, and improve consistently.
              </p>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <button className="btn" onClick={() => navigate('/signup')} style={{ background: 'white', color: 'var(--primary)', fontWeight: 900, padding: '20px 48px', borderRadius: '20px', fontSize: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                  Get Started
                </button>
                <button className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', padding: '20px 48px', borderRadius: '20px', fontSize: '16px', fontWeight: 800 }}>
                  Learn More
                </button>
              </div>
            </div>

            {/* Visual element */}
            <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', opacity: 0.15 }}>
              <GraduationCap size={500} color="white" />
            </div>
            <div style={{ position: 'absolute', top: '10%', left: '-5%', opacity: 0.1 }}>
              <Shield size={300} color="white" />
            </div>
          </section>

          {/* VALUES SECTION */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '100px' }}>
            <div className="glass-card" style={{ padding: '48px', borderRadius: '40px', border: '1px solid var(--border)', background: 'var(--gray-50)' }}>
              <div style={{ background: 'var(--primary)', color: 'white', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', boxShadow: '0 12px 24px rgba(109, 40, 217, 0.2)' }}>
                <Target size={32} />
              </div>
              <h3 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.02em' }}>Focused Learning</h3>
              <p style={{ color: 'var(--gray-500)', lineHeight: 1.8, fontSize: '16px', margin: 0 }}>We believe assessments should help learners grow, not just measure memory.</p>
            </div>
            <div className="glass-card" style={{ padding: '48px', borderRadius: '40px', border: '1px solid var(--border)', background: 'var(--gray-50)' }}>
              <div style={{ background: 'var(--accent)', color: 'white', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', boxShadow: '0 12px 24px rgba(6, 182, 212, 0.2)' }}>
                <Heart size={32} />
              </div>
              <h3 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.02em' }}>Human-Centric</h3>
              <p style={{ color: 'var(--gray-500)', lineHeight: 1.8, fontSize: '16px', margin: 0 }}>Behind every score is a learner. We design the platform to stay simple, clear, and motivating.</p>
            </div>
            <div className="glass-card" style={{ padding: '48px', borderRadius: '40px', border: '1px solid var(--border)', background: 'var(--gray-50)' }}>
              <div style={{ background: 'var(--button)', color: 'white', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', boxShadow: '0 12px 24px rgba(249, 115, 22, 0.2)' }}>
                <Zap size={32} />
              </div>
              <h3 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.02em' }}>Quick Progress</h3>
              <p style={{ color: 'var(--gray-500)', lineHeight: 1.8, fontSize: '16px', margin: 0 }}>We keep the experience fast so students and teachers can focus on learning, not setup.</p>
            </div>
          </section>

          {/* TIMELINE */}
          <section style={{ marginBottom: '120px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '42px', fontWeight: 900, marginBottom: '60px', letterSpacing: '-0.03em' }}>Our Journey</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '40px', left: '10%', right: '10%', height: '2px', background: 'var(--gray-200)', zIndex: 0 }}></div>
              {timeline.map((item, i) => (
                <div key={i} style={{ flex: 1, position: 'relative', zIndex: 1, padding: '0 20px' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'white', border: '4px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--primary)', boxShadow: 'var(--shadow-lg)' }}>
                    {item.icon}
                  </div>
                  <h4 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '12px' }}>{item.year}</h4>
                  <p style={{ fontSize: '14px', color: 'var(--gray-500)', fontWeight: 600, maxWidth: '200px', margin: '0 auto' }}>{item.event}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FEATURE GRID */}
          <section style={{ marginBottom: '120px' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ fontSize: '42px', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.03em' }}>What You Get</h2>
              <p style={{ color: 'var(--gray-500)', fontSize: '18px', fontWeight: 500 }}>Practical tools that support better learning outcomes.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              {features.map((f, i) => (
                <div key={i} className="glass-card hover-lift" style={{ padding: '40px', borderRadius: '32px', border: '1px solid var(--border)', background: 'var(--gray-50)' }}>
                  <div style={{ color: 'var(--primary)', marginBottom: '24px', background: 'rgba(109, 40, 217, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{f.icon}</div>
                  <h4 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '16px' }}>{f.title}</h4>
                  <p style={{ fontSize: '15px', color: 'var(--gray-500)', lineHeight: 1.7, margin: 0 }}>{f.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* MISSION STATEMENT CTA */}
          <section className="glass-card" style={{
            padding: '100px 60px',
            borderRadius: '48px',
            background: 'var(--black)',
            color: 'white',
            textAlign: 'center',
            marginBottom: '100px',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '400px', height: '400px', background: 'var(--primary)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.1 }}></div>
            <h2 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.04em' }}>Ready to level up your learning?</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '700px', margin: '0 auto 48px', fontSize: '20px', lineHeight: 1.6 }}>
              Join learners and teachers using EduTrack to practice more effectively and improve results.
            </p>
            <button className="btn" onClick={() => navigate('/signup')} style={{ background: 'var(--primary)', color: 'white', fontWeight: 900, padding: '24px 72px', borderRadius: '24px', border: 'none', fontSize: '20px', boxShadow: '0 20px 40px rgba(109, 40, 217, 0.4)', cursor: 'pointer' }}>
              Create Your Account
            </button>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
