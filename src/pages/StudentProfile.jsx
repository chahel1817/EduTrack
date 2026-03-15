
import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  User,
  Mail,
  Target,
  Award,
  TrendingUp,
  CheckCircle2,
  Clock,
  Phone,
  Globe,
  Linkedin,
  Github,
  MapPin,
  Edit3,
  Save,
  X,
  Briefcase,
  Code2,
  Zap
} from "lucide-react";

const StudentProfile = () => {
  const { user, setAuth } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    bio: "",
    location: "",
    linkedin: "",
    github: "",
    skills: "",
    photo: "",
  });

  useEffect(() => {
    if (!user) return;
    setFormData({
      name: user.name || "",
      age: user.age || "",
      phone: user.phone || "",
      bio: user.bio || "",
      location: user.location || "",
      linkedin: user.linkedin || "",
      github: user.github || "",
      skills: user.skills ? user.skills.join(", ") : "",
      photo: user.photo || "",
    });

    const fetchData = async () => {
      try {
        const res = await api.get("/results/student");
        setResults(res.data || []);
      } catch (err) {
        console.error("Profile error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");

      const res = await api.put("/auth/profile", {
        ...formData,
        skills: skillsArray,
      });

      // Update local context user data
      setAuth(localStorage.getItem("token"), res.data.user);
      setIsEditing(false);
    } catch (err) {
      console.error("Update profile error:", err);
      alert("Failed to update profile");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Numeric only, max 10 digits
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: cleaned });
      return;
    }

    if (name === "age") {
      // Numeric only
      const cleaned = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: cleaned });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const totalCompleted = results.length;
  const avgPercentage = totalCompleted > 0
    ? Math.round(results.reduce((sum, r) => sum + ((r.score / r.total) * 100), 0) / totalCompleted)
    : 0;
  const bestScore = totalCompleted > 0
    ? Math.max(...results.map(r => Math.round((r.score / r.total) * 100)))
    : 0;

  if (loading) return (
    <div className="dashboard-container">
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="loading-spinner"></div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        {/* PROFILE HERO */}
        <div style={{ padding: '0 24px' }}>
          <section className="hero-pro" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '60px',
            borderRadius: '32px',
            marginBottom: '32px',
            position: 'relative',
            overflow: 'hidden',
            flexWrap: 'wrap',
            gap: '30px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '140px',
                height: '140px',
                borderRadius: '40px',
                fontSize: '56px',
                border: '8px solid rgba(255,255,255,0.2)',
                backgroundImage: user.photo ? `url(${user.photo})` : 'none',
                backgroundColor: 'rgba(255,255,255,0.1)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontWeight: 900,
                transform: 'rotate(-3deg)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
              }}>
                {!user.photo && user.name.charAt(0)}
              </div>

              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '99px', marginBottom: '16px', fontSize: '13px', fontWeight: 700 }}>
                  <TrendingUp size={14} /> <span>{user.role === 'student' ? 'Master Learner' : 'Elite Educator'}</span>
                </div>
                <h1 className="hero-pro-title" style={{ margin: '0 0 8px', fontSize: '48px', fontWeight: 900 }}>{user.name}</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={18} /> {user.email}</div>
                  {user.location && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={18} /> {user.location}</div>}
                </div>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn"
                style={{
                  background: 'white',
                  color: 'var(--primary)',
                  fontWeight: 800,
                  padding: '16px 32px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <Edit3 size={18} /> Edit Profile
              </button>
            )}
          </section>

          {isEditing ? (
            <div className="glass-card" style={{ padding: '60px', borderRadius: '32px', marginBottom: '32px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
                <div>
                  <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '8px' }}>Account Settings</h2>
                  <p style={{ color: 'var(--gray-500)', margin: 0 }}>Update your public profile and contact preferences</p>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{ background: 'var(--gray-100)', border: 'none', padding: '12px', borderRadius: '14px', cursor: 'pointer', color: 'var(--gray-600)' }}
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', tracking: '0.1em', color: 'var(--gray-400)', marginBottom: '12px', display: 'block' }}>Full Legal Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-premium" style={{ background: 'var(--gray-50)' }} />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', tracking: '0.1em', color: 'var(--gray-400)', marginBottom: '12px', display: 'block' }}>Chronological Age</label>
                  <input type="text" name="age" value={formData.age} onChange={handleChange} className="input-premium" style={{ background: 'var(--gray-50)' }} />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', tracking: '0.1em', color: 'var(--gray-400)', marginBottom: '12px', display: 'block' }}>Contact Connection</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="input-premium" style={{ background: 'var(--gray-50)' }} />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', tracking: '0.1em', color: 'var(--gray-400)', marginBottom: '12px', display: 'block' }}>Geographic Base</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className="input-premium" style={{ background: 'var(--gray-50)' }} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', tracking: '0.1em', color: 'var(--gray-400)', marginBottom: '12px', display: 'block' }}>Profile Image URL</label>
                  <input type="text" name="photo" value={formData.photo} onChange={handleChange} className="input-premium" style={{ background: 'var(--gray-50)' }} placeholder="https://images.unsplash.com/..." />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', tracking: '0.1em', color: 'var(--gray-400)', marginBottom: '12px', display: 'block' }}>LinkedIn Profile</label>
                  <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} className="input-premium" style={{ background: 'var(--gray-50)' }} />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', tracking: '0.1em', color: 'var(--gray-400)', marginBottom: '12px', display: 'block' }}>GitHub Repository</label>
                  <input type="text" name="github" value={formData.github} onChange={handleChange} className="input-premium" style={{ background: 'var(--gray-50)' }} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', tracking: '0.1em', color: 'var(--gray-400)', marginBottom: '12px', display: 'block' }}>Technical Arsenal (Expertise)</label>
                  <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="input-premium" style={{ background: 'var(--gray-50)' }} placeholder="React, Python, Machine Learning..." />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', tracking: '0.1em', color: 'var(--gray-400)', marginBottom: '12px', display: 'block' }}>Intellectual Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} className="input-premium" style={{ background: 'var(--gray-50)', height: '140px', resize: 'none', padding: '20px' }}></textarea>
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '16px', marginTop: '16px' }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '16px 48px', borderRadius: '16px', fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Save size={20} /> Deploy Changes
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline" style={{ padding: '16px 32px', borderRadius: '16px', fontWeight: 700 }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '40px', marginBottom: '32px' }}>

              {/* LEFT: INFO COL */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '24px', letterSpacing: '0.1em' }}>About</h3>
                  <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--gray-600)', marginBottom: '24px' }}>
                    {user.bio || "No professional bio provided yet. Update your profile to share your journey."}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                      <Briefcase size={18} style={{ color: 'var(--gray-400)' }} />
                      <span style={{ fontWeight: 600 }}>{user.role === 'student' ? 'Lifelong Learner' : 'Professional Educator'}</span>
                    </div>
                    {user.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                        <Phone size={18} style={{ color: 'var(--gray-400)' }} />
                        <span style={{ fontWeight: 600 }}>{user.phone}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                      <Globe size={18} style={{ color: 'var(--gray-400)' }} />
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <a href={user.linkedin} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>LinkedIn</a>
                        <a href={user.github} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>GitHub</a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '24px', letterSpacing: '0.1em' }}>Mastery Pulse</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {user.skills?.length > 0 ? user.skills.map(skill => (
                      <span key={skill} style={{ background: 'var(--gray-100)', color: 'var(--gray-700)', padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 700 }}>
                        {skill}
                      </span>
                    )) : <p style={{ color: 'var(--gray-400)', fontSize: '14px', margin: 0 }}>No skills indexed</p>}
                  </div>
                </div>

                {/* ACHIEVEMENTS MOVED TO LEFT FOR BALANCE */}
                <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '24px', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={16} /> Academic Distinctions
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: 'var(--gray-50)', padding: '20px', borderRadius: '20px', textAlign: 'center', border: '1px solid var(--border)' }}>
                      <div style={{ width: '48px', height: '48px', background: 'rgba(234, 179, 8, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                        <Award size={24} color="var(--warning)" />
                      </div>
                      <h4 style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 800 }}>Early Adopter</h4>
                      <p style={{ margin: 0, fontSize: '11px', color: 'var(--gray-500)' }}>Elite Pioneer Class</p>
                    </div>
                    {totalCompleted >= 5 && (
                      <div style={{ background: 'var(--gray-50)', padding: '20px', borderRadius: '20px', textAlign: 'center', border: '1px solid var(--border)' }}>
                        <div style={{ width: '48px', height: '48px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                          <Zap size={24} color="var(--accent)" />
                        </div>
                        <h4 style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 800 }}>Steady Pulse</h4>
                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--gray-500)' }}>5+ Active Goals</p>
                      </div>
                    )}
                    {avgPercentage >= 90 && (
                      <div style={{ background: 'var(--gray-50)', padding: '20px', borderRadius: '20px', textAlign: 'center', border: '1px solid var(--border)' }}>
                        <div style={{ width: '48px', height: '48px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                          <CheckCircle2 size={24} color="var(--success)" />
                        </div>
                        <h4 style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 800 }}>Perfect Score</h4>
                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--gray-500)' }}>Precision Master</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT: PROGRESS COL */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

                {/* STATS OVERVIEW */}
                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                  <div className="stat-card" style={{ padding: '32px' }}>
                    <div className="stat-icon-wrapper" style={{ background: 'rgba(109, 40, 217, 0.1)', color: 'var(--primary)' }}><CheckCircle2 size={24} /></div>
                    <h3 className="stat-value">{totalCompleted}</h3>
                    <p className="stat-label">Concepts Mastered</p>
                  </div>
                  <div className="stat-card" style={{ padding: '32px' }}>
                    <div className="stat-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent)' }}><TrendingUp size={24} /></div>
                    <h3 className="stat-value">{avgPercentage}%</h3>
                    <p className="stat-label">Average Precision</p>
                  </div>
                  <div className="stat-card" style={{ padding: '32px' }}>
                    <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}><Target size={24} /></div>
                    <h3 className="stat-value">{bestScore}%</h3>
                    <p className="stat-label">Maximum Peak</p>
                  </div>
                </div>


                {/* ACTIVITY HISTORY */}
                <div className="glass-card" style={{ padding: '0', borderRadius: '32px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>Activity History</h3>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Recent Activity</span>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: 'var(--gray-50)', textAlign: 'left' }}>
                          <th style={{ padding: '20px 40px', fontSize: '13px', color: 'var(--gray-500)', fontWeight: 800 }}>ASSESSMENT</th>
                          <th style={{ padding: '20px 40px', fontSize: '13px', color: 'var(--gray-500)', fontWeight: 800 }}>DOMAIN</th>
                          <th style={{ padding: '20px 40px', fontSize: '13px', color: 'var(--gray-500)', fontWeight: 800, textAlign: 'center' }}>PRECISION</th>
                          <th style={{ padding: '20px 40px', fontSize: '13px', color: 'var(--gray-500)', fontWeight: 800, textAlign: 'right' }}>DATE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.length > 0 ? results.slice(0, 5).map(r => (
                          <tr key={r._id} style={{ transition: 'background 0.2s', borderBottom: 'none' }}>
                            <td style={{ padding: '24px 40px', fontWeight: 700 }}>{r.quiz?.title || "Classified Quiz"}</td>
                            <td style={{ padding: '24px 40px' }}><span style={{ padding: '4px 12px', background: 'var(--gray-100)', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>{r.quiz?.subject || "Core"}</span></td>
                            <td style={{ padding: '24px 40px', textAlign: 'center' }}>
                              <span style={{
                                fontWeight: 900,
                                fontSize: '16px',
                                color: (r.score / r.total) >= 0.8 ? 'var(--success)' : (r.score / r.total) >= 0.5 ? 'var(--warning)' : 'var(--error)'
                              }}>
                                {Math.round((r.score / r.total) * 100)}%
                              </span>
                            </td>
                            <td style={{ padding: '24px 40px', textAlign: 'right', color: 'var(--gray-400)', fontSize: '14px' }}>
                              {new Date(r.createdAt || r.submittedAt).toLocaleDateString()}
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-400)' }}>Zero mission data available. Begin a challenge to start tracking.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentProfile;
