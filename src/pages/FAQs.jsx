import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  User,
  ShieldCheck,
  BarChart3,
  Moon,
  Lock
} from "lucide-react";

const faqsData = [
  {
    icon: <BookOpen size={22} />,
    question: "How do I create a quiz on EduTrack?",
    answer:
      "If you are a teacher, go to the Dashboard and click on 'Create Quiz'. You can add questions, options, correct answers, time limits, and points. Once published, the quiz becomes instantly available for students."
  },
  {
    icon: <User size={22} />,
    question: "How can students attempt a quiz?",
    answer:
      "Students can browse available quizzes from the Quizzes page. Click on any quiz, read the instructions, and start attempting. Make sure to submit before the timer runs out to save your result."
  },
  {
    icon: <BarChart3 size={22} />,
    question: "Where can I see my quiz results?",
    answer:
      "Students can view their performance from the Profile or Results section. Teachers can access detailed analytics for each quiz, including scores, percentages, and submission history."
  },
  {
    icon: <Moon size={22} />,
    question: "Does EduTrack support dark mode?",
    answer:
      "Yes! EduTrack supports both light and dark modes. You can toggle the theme using the icon in the navbar. Your preference is saved automatically for future visits."
  },
  {
    icon: <Lock size={22} />,
    question: "Is my data safe on EduTrack?",
    answer:
      "Absolutely. We use secure authentication, encrypted passwords, and protected APIs to ensure your data remains safe and private at all times."
  },
  {
    icon: <ShieldCheck size={22} />,
    question: "What should I do if I forget my password?",
    answer:
      "Simply go to the login page and use the 'Forgot Password' option. Follow the instructions sent to your registered email to reset your password securely."
  }
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      <main className="dashboard-main">
        <div className="dashboard-section">

          {/* HEADER */}
          <div className="page-header">
            <div className="header-content">
              <div className="header-icon">
                <HelpCircle size={32} />
              </div>
              <div>
                <h1 className="page-title">Frequently Asked Questions</h1>
                <p className="page-subtitle">
                  Everything you need to know about using EduTrack effectively
                </p>
              </div>
            </div>
          </div>

          {/* FAQ CARDS */}
          <div
            style={{
              display: "grid",
              gap: "16px",
              maxWidth: "900px",
              margin: "0 auto"
            }}
          >
            {faqsData.map((faq, index) => (
              <div
                key={index}
                className="card hover-lift"
                style={{
                  padding: "20px",
                  cursor: "pointer",
                  borderRadius: "16px"
                }}
                onClick={() => toggleFAQ(index)}
              >
                {/* QUESTION */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      fontWeight: 600,
                      fontSize: "16px"
                    }}
                  >
                    <span
                      style={{
                        background: "rgba(99,102,241,0.12)",
                        padding: "10px",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      {faq.icon}
                    </span>
                    {faq.question}
                  </div>

                  {openIndex === index ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>

                {/* ANSWER */}
                {openIndex === index && (
                  <div
                    style={{
                      marginTop: "14px",
                      paddingLeft: "54px",
                      color: "var(--gray-600)",
                      lineHeight: "1.7",
                      animation: "fadeIn 0.3s ease"
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQs;
