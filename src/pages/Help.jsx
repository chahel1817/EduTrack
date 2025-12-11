import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { HelpCircle, Book, MessageCircle, Video, FileText, ChevronRight } from 'lucide-react';

const Help = () => {
  const faqs = [
    {
      question: "How do I create a quiz?",
      answer: "As a teacher, navigate to the 'Create Quiz' page from the navbar. Fill in the quiz details, add questions with multiple choices, and set the correct answers. Your quiz will be available for students immediately."
    },
    {
      question: "How do I take a quiz?",
      answer: "Go to the 'Quizzes' page, browse available quizzes, and click 'Take Quiz' on any quiz you'd like to attempt. Answer all questions and submit when ready."
    },
    {
      question: "Can I see my quiz results?",
      answer: "Yes! Visit the 'Results' page to view your quiz performance, scores, and detailed analytics. Teachers can also view results for quizzes they've created."
    },
    {
      question: "How do I switch between light and dark mode?",
      answer: "Click the sun/moon icon in the top-right corner of the navbar to toggle between light and dark themes. Your preference will be saved automatically."
    },
    {
      question: "What should I do if I forget my password?",
      answer: "Click 'Forgot Password' on the login page, enter your email address, and follow the instructions sent to your email to reset your password."
    },
    {
      question: "Can I edit a quiz after creating it?",
      answer: "Currently, quizzes cannot be edited after creation. You can delete the quiz and create a new one with the updated content."
    }
  ];

  const resources = [
    {
      icon: <Book size={24} />,
      title: "Getting Started Guide",
      description: "Complete guide for new users",
      link: "#"
    },
    {
      icon: <Video size={24} />,
      title: "Video Tutorials",
      description: "Step-by-step video walkthroughs",
      link: "#"
    },
    {
      icon: <FileText size={24} />,
      title: "FAQ Documentation",
      description: "Detailed answers to common questions",
      link: "#"
    },
    {
      icon: <MessageCircle size={24} />,
      title: "Community Forum",
      description: "Connect with other users",
      link: "#"
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
                <HelpCircle size={32} />
              </div>
              <div>
                <h1 className="page-title">Help Center</h1>
                <p className="page-subtitle">Find answers and get the help you need</p>
              </div>
            </div>
          </div>

          {/* Quick Help */}
          <div className="help-grid">
            <div className="help-card">
              <div className="help-card-icon">
                <Book size={32} />
              </div>
              <h3>Documentation</h3>
              <p>Comprehensive guides and documentation for all features.</p>
              <a href="#" className="help-link">View Docs <ChevronRight size={16} /></a>
            </div>

            <div className="help-card">
              <div className="help-card-icon">
                <MessageCircle size={32} />
              </div>
              <h3>Contact Support</h3>
              <p>Need help? Our support team is here to assist you.</p>
              <a href="/contact" className="help-link">Get Support <ChevronRight size={16} /></a>
            </div>

            <div className="help-card">
              <div className="help-card-icon">
                <Video size={32} />
              </div>
              <h3>Video Tutorials</h3>
              <p>Watch step-by-step tutorials to master EduTrack.</p>
              <a href="#" className="help-link">Watch Videos <ChevronRight size={16} /></a>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="faq-section">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <details key={index} className="faq-item">
                  <summary className="faq-question">
                    <HelpCircle size={18} />
                    {faq.question}
                  </summary>
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Resources Section */}
          <div className="resources-section">
            <h2 className="section-title">Additional Resources</h2>
            <div className="resources-grid">
              {resources.map((resource, index) => (
                <div key={index} className="resource-card">
                  <div className="resource-icon">
                    {resource.icon}
                  </div>
                  <h3 className="resource-title">{resource.title}</h3>
                  <p className="resource-description">{resource.description}</p>
                  <a href={resource.link} className="resource-link">
                    Learn More <ChevronRight size={16} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="contact-cta">
            <div className="cta-content">
              <h2>Still need help?</h2>
              <p>Can't find what you're looking for? Our support team is ready to help.</p>
              <a href="/contact" className="btn btn-primary">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Help;
