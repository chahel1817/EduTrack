
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
      <main>
        {/* PROFILE HERO */}
        <section className={`profile-hero ${isEditing ? 'editing' : ''}`} style={{
          marginBottom: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          padding: '40px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Decorative Circles */}
          <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', bottom: '-20%', left: '-5%', width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>

          <div className="user-avatar" style={{
            width: '120px',
            height: '120px',
            fontSize: '48px',
            border: '6px solid rgba(255,255,255,0.3)',
            backgroundImage: user.photo ? `url(${user.photo})` : 'none',
            backgroundColor: user.photo ? 'transparent' : 'var(--gray-700)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            zIndex: 1
          }}>
            {!user.photo && user.name.charAt(0)}
          </div>

          <div style={{ flex: 1, zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ color: 'white', marginBottom: '8px', fontSize: '36px', fontWeight: 800 }}>{user.name}</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', color: 'rgba(255,255,255,0.9)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={18} /> {user.email}</div>
                  {user.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={18} /> {user.phone}</div>}
                  {user.location && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={18} /> {user.location}</div>}
                </div>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-glass"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                >
                  <Edit3 size={18} /> Edit Profile
                </button>
              )}
            </div>

            {user.bio && (
              <p style={{ marginTop: '16px', color: 'rgba(255,255,255,0.85)', fontSize: '16px', lineHeight: '1.6', maxWidth: '800px' }}>
                {user.bio}
              </p>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              {user.linkedin && (
                <a href={user.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'white', background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '50%', display: 'flex' }}>
                  <Linkedin size={20} />
                </a>
              )}
              {user.github && (
                <a href={user.github} target="_blank" rel="noopener noreferrer" style={{ color: 'white', background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '50%', display: 'flex' }}>
                  <Github size={20} />
                </a>
              )}
            </div>
          </div>
        </section>

        {isEditing && (
          <section className="dashboard-section glass-card" style={{ padding: '32px', marginBottom: '40px', border: '1px solid var(--primary-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Edit3 className="text-primary" /> Edit your profile details
              </h2>
              <button onClick={() => setIsEditing(false)} className="btn-icon">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="profile-edit-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                        e.preventDefault();
                      }
                    }}
                    placeholder="20"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={10}
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                        e.preventDefault();
                      }
                    }}
                    placeholder="10 digit number"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="City, Country" />
                </div>
                <div className="form-group" style={{ position: 'relative' }}>
                  <label>Profile Photo URL</label>
                  <input type="text" name="photo" value={formData.photo} onChange={handleChange} placeholder="https://example.com/photo.jpg" />
                  {formData.photo && (
                    <div style={{
                      marginTop: '10px',
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2px solid var(--primary)',
                      backgroundImage: `url(${formData.photo})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}></div>
                  )}
                  <small style={{ display: 'block', marginTop: '4px', fontSize: '11px', color: 'var(--gray-500)' }}>
                    Paste a direct image link (JPEG, PNG, etc.)
                  </small>
                </div>
                <div className="form-group">
                  <label>LinkedIn URL</label>
                  <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/username" />
                </div>
                <div className="form-group">
                  <label>GitHub URL</label>
                  <input type="text" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/username" />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Skills (comma separated)</label>
                  <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Python, CSS" />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us something about yourself..." rows="4" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white' }}></textarea>
                </div>
              </div>
              <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Save size={18} /> Save Changes
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline">
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* SKILLS SECTION (If not editing) */}
        {!isEditing && user.skills?.length > 0 && (
          <section className="dashboard-section" style={{ marginBottom: '40px' }}>
            <h2 className="dashboard-section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Code2 size={24} className="text-primary" /> My Skills
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {user.skills.map((skill, i) => (
                <span key={i} className="skill-tag" style={{
                  background: 'var(--primary-light)',
                  color: 'var(--primary-dark)',
                  padding: '8px 16px',
                  borderRadius: '100px',
                  fontWeight: 600,
                  fontSize: '14px',
                  border: '1px solid var(--primary-border)'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* STATS GRID */}
        <section className="dashboard-section">
          <h2 className="dashboard-section-title">Performance Overview</h2>
          <div className="stats-grid" style={{ marginBottom: '40px' }}>
            <div className="stat-card">
              <div className="stat-icon-wrapper"><CheckCircle2 size={24} /></div>
              <div className="stat-value">{totalCompleted}</div>
              <div className="stat-label">Quizzes Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrapper"><TrendingUp size={24} /></div>
              <div className="stat-value">{avgPercentage}%</div>
              <div className="stat-label">Average Accuracy</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrapper"><Target size={24} /></div>
              <div className="stat-value">{bestScore}%</div>
              <div className="stat-label">Highest Score</div>
            </div>
          </div>
        </section>

        {/* ACHIEVEMENTS */}
        <section className="dashboard-section">
          <h2 className="dashboard-section-title">Certifications & Badges</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
              <Award size={48} color="var(--button)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Early Adopter</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '14px' }}>One of the first 100 students</p>
            </div>
            {totalCompleted > 5 && (
              <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                <Award size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Consistent Learner</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: '14px' }}>Completed over 5 quizzes</p>
              </div>
            )}
          </div>
        </section>

        {/* RECENT ACTIVITY */}
        <section className="dashboard-section">
          <h2 className="dashboard-section-title">Recent Quiz Results</h2>
          <div className="table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--gray-50)', textAlign: 'left' }}>
                  <th style={{ padding: '16px' }}>Quiz</th>
                  <th style={{ padding: '16px' }}>Subject</th>
                  <th style={{ padding: '16px' }}>Score</th>
                  <th style={{ padding: '16px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {results.length > 0 ? (
                  results.map(r => (
                    <tr key={r._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px', fontWeight: 600 }}>{r.quiz?.title || "Quiz"}</td>
                      <td style={{ padding: '16px' }}>{r.quiz?.subject || "General"}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{Math.round((r.score / r.total) * 100)}%</span>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--gray-500)' }}>{new Date(r.createdAt || r.submittedAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: 'var(--gray-500)' }}>No activity yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default StudentProfile;

