import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, Lock, Eye, Database, Mail, UserCheck } from 'lucide-react';

const Privacy = () => {
  const sections = [
    {
      icon: <Database size={24} />,
      title: "Information We Collect",
      content: [
        "Personal information (name, email, role) provided during registration",
        "Quiz performance data and results",
        "Usage analytics and platform interaction data",
        "Device and browser information for security purposes"
      ]
    },
    {
      icon: <Lock size={24} />,
      title: "How We Use Your Information",
      content: [
        "To provide and maintain our educational platform services",
        "To personalize your learning experience and track progress",
        "To communicate important updates and support messages",
        "To ensure platform security and prevent unauthorized access",
        "To analyze usage patterns and improve our services"
      ]
    },
    {
      icon: <Eye size={24} />,
      title: "Information Sharing",
      content: [
        "We do not sell or rent your personal information to third parties",
        "Limited sharing with service providers for platform operation",
        "Legal compliance when required by law",
        "Aggregate, anonymized data for research and improvement purposes"
      ]
    },
    {
      icon: <Shield size={24} />,
      title: "Data Security",
      content: [
        "Industry-standard encryption for data transmission and storage",
        "Regular security audits and vulnerability assessments",
        "Access controls and authentication measures",
        "Secure data centers with physical and digital protections"
      ]
    },
    {
      icon: <UserCheck size={24} />,
      title: "Your Rights",
      content: [
        "Access and review your personal data",
        "Request correction of inaccurate information",
        "Delete your account and associated data",
        "Opt-out of non-essential communications",
        "Data portability for your information"
      ]
    },
    {
      icon: <Mail size={24} />,
      title: "Contact Us",
      content: [
        "For privacy-related questions or concerns",
        "To exercise your data rights",
        "To report privacy incidents",
        "Email: privacy@edutrack.com"
      ]
    }
  ];

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        <div className="dashboard-section">
          {/* Header */}
          <div className="page-header">
            <div className="header-content">
              <div className="header-icon">
                <Shield size={32} />
              </div>
              <div>
                <h1 className="page-title">Privacy Policy</h1>
                <p className="page-subtitle">How we protect and handle your data</p>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="policy-meta">
            <p>Last updated: January 2024</p>
          </div>

          {/* Introduction */}
          <div className="policy-intro">
            <p>
              At EduTrack, we are committed to protecting your privacy and ensuring the security of your personal information.
              This Privacy Policy explains how we collect, use, and safeguard your data when you use our educational platform.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="policy-sections">
            {sections.map((section, index) => (
              <div key={index} className="policy-section">
                <div className="section-header">
                  <div className="section-icon">
                    {section.icon}
                  </div>
                  <h2 className="section-title">{section.title}</h2>
                </div>
                <ul className="section-list">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="section-item">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="policy-cta">
            <div className="cta-content">
              <h2>Questions about your privacy?</h2>
              <p>If you have any questions about this Privacy Policy or our data practices, please don't hesitate to contact us.</p>
              <a href="/contact" className="btn btn-primary">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
