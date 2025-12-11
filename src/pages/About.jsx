import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { GraduationCap, Users, BookOpen, Award, Target, TrendingUp, Heart, Star } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <BookOpen size={32} />,
      title: "Interactive Quizzes",
      description: "Create engaging quizzes with multiple choice questions, instant feedback, and detailed analytics."
    },
    {
      icon: <Users size={32} />,
      title: "Role-Based Access",
      description: "Separate interfaces for teachers and students with appropriate permissions and features."
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Performance Analytics",
      description: "Comprehensive reporting and insights to track learning progress and identify areas for improvement."
    },
    {
      icon: <Award size={32} />,
      title: "Gamification",
      description: "Make learning fun with scores, badges, and progress tracking to motivate students."
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Students" },
    { number: "500+", label: "Teachers" },
    { number: "50K+", label: "Quizzes Created" },
    { number: "95%", label: "Satisfaction Rate" }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "Former educator with 10+ years experience in edtech innovation."
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "Full-stack developer passionate about creating scalable learning platforms."
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Education",
      bio: "Curriculum specialist focused on effective assessment strategies."
    }
  ];

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        <div className="dashboard-section">
          {/* Hero Section */}
          <div className="about-hero">
            <div className="hero-content">
              <div className="hero-icon">
                <GraduationCap size={64} />
              </div>
              <h1 className="hero-title">About EduTrack</h1>
              <p className="hero-subtitle">
                Transforming education through innovative assessment tools and comprehensive learning analytics.
                We're building the future of education, one quiz at a time.
              </p>
            </div>
          </div>

          {/* Mission Section */}
          <div className="mission-section">
            <div className="mission-content">
              <h2 className="section-title">Our Mission</h2>
              <p className="mission-text">
                At EduTrack, we believe that effective assessment is the cornerstone of successful education.
                Our platform empowers educators to create engaging quizzes while providing students with
                immediate feedback and detailed insights into their learning progress.
              </p>
              <div className="mission-values">
                <div className="value-item">
                  <Target size={24} />
                  <span>Excellence in Education</span>
                </div>
                <div className="value-item">
                  <Heart size={24} />
                  <span>Student-Centered Design</span>
                </div>
                <div className="value-item">
                  <Star size={24} />
                  <span>Innovation & Quality</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="features-section">
            <h2 className="section-title">What We Offer</h2>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="stats-section">
            <h2 className="section-title">Our Impact</h2>
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="team-section">
            <h2 className="section-title">Meet Our Team</h2>
            <div className="team-grid">
              {team.map((member, index) => (
                <div key={index} className="team-card">
                  <div className="team-avatar">
                    <Users size={32} />
                  </div>
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="about-cta">
            <div className="cta-content">
              <h2>Ready to Transform Your Teaching?</h2>
              <p>Join thousands of educators who are already using EduTrack to enhance their assessment strategies.</p>
              <a href="/signup" className="btn btn-primary">
                Get Started Today
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
