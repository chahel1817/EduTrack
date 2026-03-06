import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  BookOpen,
  Layers,
  BarChart3,
  Shield,
  Code,
  CheckCircle,
  Cpu,
  Zap,
  Lock,
  Globe,
  Database,
  Terminal,
  Server
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Documentation = () => {
  const navigate = useNavigate();
  const categories = [
    {
      id: "architecture",
      title: "Platform Overview",
      icon: <Layers size={22} />,
      points: [
        "React frontend built for a fast and smooth user experience.",
        "Node.js backend that handles quiz and result requests.",
        "MongoDB storage for quizzes, users, and scores.",
        "Role-based access so students and teachers see the right tools."
      ]
    },
    {
      id: "ai-forge",
      title: "Question Generator",
      icon: <Cpu size={22} />,
      points: [
        "Generate questions from a topic in seconds.",
        "Create questions from uploaded PDF notes.",
        "Set difficulty and question count quickly.",
        "Review and edit all generated questions before publishing."
      ]
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: <BarChart3 size={22} />,
      points: [
        "Instant score and accuracy updates after each quiz.",
        "Subject-wise performance tracking.",
        "Progress trends for students and classes.",
        "Quick view of areas that need improvement."
      ]
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
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
            color: 'white'
          }}>
            <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', background: 'radial-gradient(circle at 30% 70%, rgba(109, 40, 217, 0.2) 0%, transparent 70%)', zIndex: 0 }}></div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '99px', marginBottom: '32px', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                <Terminal size={16} className="text-primary" /> <span>Product Documentation</span>
              </div>
              <h1 style={{ margin: '0 0 24px', fontSize: '64px', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>Platform <br /><span style={{ background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Guide</span></h1>
              <p style={{ margin: '0 auto', opacity: 0.7, fontSize: '20px', maxWidth: '650px', lineHeight: 1.6, fontWeight: 500 }}>
                A clear guide to how EduTrack works, from quiz creation to reports.
              </p>
            </div>

            <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', opacity: 0.05 }}>
              <Server size={400} color="white" />
            </div>
          </section>

          {/* DOCS NAVIGATION (MOCK) */}
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '60px', marginBottom: '120px' }}>

            {/* SIDEBAR */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div className="glass-card" style={{ padding: '32px', borderRadius: '32px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.2em', marginBottom: '24px' }}>Basics</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {['Getting Started', 'Roles', 'Account Setup', 'Security'].map(item => (
                    <div key={item} style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gray-600)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '4px', height: '4px', background: 'var(--gray-200)', borderRadius: '50%' }}></div> {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '32px', borderRadius: '32px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.2em', marginBottom: '24px' }}>Tools</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {['Question Generator', 'Quiz Rules', 'Data Export', 'Integrations'].map(item => (
                    <div key={item} style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gray-600)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '4px', height: '4px', background: 'var(--gray-200)', borderRadius: '50%' }}></div> {item}
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* CONTENT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>

              {categories.map((cat, i) => (
                <section key={i} id={cat.id} className="glass-card" style={{ padding: '60px', borderRadius: '48px', border: '1px solid var(--border)', background: 'var(--white)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                    <div style={{ color: 'var(--primary)', padding: '16px', background: 'rgba(109, 40, 217, 0.1)', borderRadius: '20px' }}>{cat.icon}</div>
                    <h2 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-0.03em' }}>{cat.title}</h2>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
                    {cat.points.map((p, j) => (
                      <div key={j} style={{ display: 'flex', gap: '16px', background: 'var(--gray-50)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border)' }}>
                        <CheckCircle size={20} className="text-primary" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ margin: 0, color: 'var(--gray-600)', fontSize: '15px', lineHeight: 1.6, fontWeight: 500 }}>{p}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}

              {/* API CODE BLOCK EXAMPLE */}
              <section className="glass-card" style={{ padding: '60px', borderRadius: '48px', background: 'var(--black)', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                  <div style={{ color: 'var(--primary)', padding: '16px', background: 'rgba(109, 40, 217, 0.2)', borderRadius: '20px' }}><Code size={24} /></div>
                  <h2 style={{ fontSize: '36px', fontWeight: 900 }}>API Initialization</h2>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px', marginBottom: '32px', maxWidth: '600px' }}>
                  Connect your own tools with EduTrack using our REST API.
                </p>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '32px', borderRadius: '24px', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <pre style={{ margin: 0, color: 'var(--primary-light)', fontSize: '14px', fontFamily: '"Fira Code", monospace', lineHeight: 1.6 }}>
                    <code>{`// Create a new quiz
const response = await fetch('https://api.edutrack.io/v1/assessments', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_SECURE_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'JavaScript Basics Quiz',
    subject: 'Computer Science',
    questions: [...]
  })
});

const data = await response.json();
console.log('Quiz created:', data.syncId);`}</code>
                  </pre>
                  <div style={{ position: 'absolute', top: '16px', right: '16px', padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}>javascript</div>
                </div>
              </section>

            </div>
          </div>

          {/* FINAL CTA */}
          <section style={{ textAlign: 'center', marginBottom: '120px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '24px' }}>Need more help?</h2>
            <button className="btn" onClick={() => navigate("/contact")} style={{ background: 'var(--primary)', color: 'white', fontWeight: 900, padding: '20px 48px', borderRadius: '20px', border: 'none', fontSize: '16px', boxShadow: '0 20px 40px rgba(109, 40, 217, 0.3)' }}>
              Contact Support
            </button>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Documentation;
