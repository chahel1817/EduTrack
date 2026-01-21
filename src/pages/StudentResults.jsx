import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  BarChart3,
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Award,
  Download,
  BrainCircuit,
  Loader2,
  Sparkles,
} from "lucide-react";

const StudentResults = () => {
  const { id } = useParams(); // quizId
  const navigate = useNavigate();
  const { user } = useAuth();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [explainingId, setExplainingId] = useState(null);
  const [explanations, setExplanations] = useState({});
  const certificateRef = useRef();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        console.log("🔍 Fetching student results for quiz:", id);

        const res = await api.get("/results/student");

        const results = res.data || [];

        const found = results.find(
          (r) => String(r.quiz?._id || r.quiz) === String(id)
        );

        if (found) setResult(found);
      } catch (err) {
        console.error("❌ Frontend error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  const handleExplain = async (qIndex) => {
    if (explainingId !== null) return;
    setExplainingId(qIndex);
    try {
      const question = result.quiz.questions[qIndex];
      const selected = question.options[result.answers.find(a => a.questionIndex === qIndex)?.selectedAnswer] || "None";
      const correct = question.options[question.correctAnswer];

      const res = await api.post("/ai/explain", {
        question: question.question,
        selectedOption: selected,
        correctOption: correct,
        context: result.quiz.title
      });

      setExplanations(prev => ({ ...prev, [qIndex]: res.data.explanation }));
    } catch (err) {
      console.error("AI Explanation error:", err);
    } finally {
      setExplainingId(null);
    }
  };

  const downloadCertificate = async () => {
    const element = certificateRef.current;
    if (!element) return;

    // Temporarily show it
    element.style.display = "block";
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${user.name}-EduTrack-Certificate.pdf`);
    element.style.display = "none";
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <div className="loading">Loading result...</div>
        </main>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <main className="dashboard-main">
          <div className="empty-state enhanced">
            <XCircle size={64} color="var(--error)" />
            <h3>Result Not Found</h3>
            <p>The result for this quiz could not be found.</p>
          </div>
        </main>
      </div>
    );
  }

  const { quiz } = result;
  const isEligibleForCert = result.percentage >= 80;

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">

        {/* HEADER */}
        <section className="dashboard-section">
          <div className="card" style={{ padding: "2rem", position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}>
              <Award size={200} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 className="section-heading">
                  <BarChart3 size={28} style={{ marginRight: 10 }} />
                  {quiz.title}
                </h2>
                <p style={{ color: "var(--gray-600)", marginTop: 4 }}>
                  <BookOpen size={14} /> Subject: {quiz.subject}
                </p>
              </div>

              {isEligibleForCert && (
                <button className="btn btn-primary" onClick={downloadCertificate} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Download size={18} /> Download Certificate
                </button>
              )}
            </div>

            {/* STATS */}
            <div className="stats-grid" style={{ marginTop: "2rem" }}>
              <div className="stat-card">
                <Award size={24} className="text-primary" />
                <h3>{result.score}/{result.total}</h3>
                <p>Total Score</p>
              </div>

              <div className="stat-card">
                <CheckCircle2 size={24} className="text-success" />
                <h3>{result.percentage}%</h3>
                <p>Accuracy</p>
              </div>

              <div className="stat-card">
                <Clock size={24} className="text-accent" />
                <h3>{Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s</h3>
                <p>Time Taken</p>
              </div>
            </div>

            {isEligibleForCert && (
              <div className="success-alert" style={{ marginTop: '20px', padding: '16px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--success)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Sparkles className="text-success" />
                <span style={{ color: '#065f46', fontWeight: 600 }}>Congratulations! You have earned an EduTrack Certification for this quiz.</span>
              </div>
            )}
          </div>
        </section>

        {/* QUESTION REVIEW */}
        <section className="dashboard-section">
          <h2 className="section-heading" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{ background: 'var(--primary)', color: 'white', padding: '10px', borderRadius: '12px', display: 'flex' }}>
              <BookOpen size={24} />
            </div>
            Detailed Analysis
          </h2>

          {quiz.questions.map((q, index) => {
            const ans = result.answers.find(
              (a) => a.questionIndex === index
            );

            const isNotAttempted = !ans || ans.selectedAnswer === -1;
            const isCorrect = ans && ans.isCorrect;

            return (
              <div key={index} className="card" style={{
                marginBottom: "2.5rem",
                padding: '32px',
                borderRadius: '24px',
                border: '1px solid var(--border)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* STATUS BADGE */}
                <div style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  padding: '10px 24px',
                  borderBottomLeftRadius: '24px',
                  fontSize: '13px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  background: isNotAttempted
                    ? 'var(--gray-200)'
                    : isCorrect
                      ? 'rgba(16,185,129,0.15)'
                      : 'rgba(239,68,68,0.15)',
                  color: isNotAttempted
                    ? 'var(--gray-600)'
                    : isCorrect
                      ? '#059669'
                      : '#dc2626'
                }}>
                  {isNotAttempted ? "Not Attempted" : isCorrect ? "Correct" : "Incorrect"}
                </div>

                <div style={{ paddingRight: '140px' }}>
                  <h3 style={{ marginBottom: "24px", fontSize: '20px', fontWeight: 700, lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--primary)', marginRight: '8px' }}>Q{index + 1}.</span> {q.question}
                  </h3>
                </div>

                <div style={{ display: 'grid', gap: '14px' }}>
                  {q.options.map((opt, i) => {
                    const isCorrectOption = i === q.correctAnswer;
                    const isSelected = ans?.selectedAnswer === i;

                    let bg = "var(--gray-50)";
                    let border = "1px solid var(--border)";
                    let textColor = "var(--gray-700)";

                    if (isCorrectOption) {
                      bg = "rgba(16,185,129,0.08)";
                      border = "2px solid #10b981";
                      textColor = "#065f46";
                    } else if (isSelected) {
                      bg = "rgba(239,68,68,0.08)";
                      border = "2px solid #ef4444";
                      textColor = "#991b1b";
                    }

                    return (
                      <div
                        key={i}
                        style={{
                          padding: "18px 24px",
                          borderRadius: "16px",
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          background: bg,
                          border: border,
                          color: textColor,
                          fontWeight: (isCorrectOption || isSelected) ? 600 : 400,
                          position: 'relative'
                        }}
                      >
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          border: '2px solid currentColor',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '14px',
                          fontWeight: 800,
                          flexShrink: 0
                        }}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span style={{ flex: 1 }}>{opt}</span>
                        {isCorrectOption && (
                          <CheckCircle2 size={22} color="#10b981" />
                        )}
                        {isSelected && !isCorrectOption && (
                          <XCircle size={22} color="#ef4444" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* AI EXPLAINER */}
                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px dashed var(--border)' }}>
                  {!explanations[index] ? (
                    <button
                      onClick={() => handleExplain(index)}
                      className="btn btn-outline"
                      style={{ border: 'none', background: 'var(--gray-100)', color: 'var(--primary)', fontWeight: 700, gap: '10px' }}
                      disabled={explainingId === index}
                    >
                      {explainingId === index ? <Loader2 className="animate-spin" size={18} /> : <BrainCircuit size={18} />}
                      Explain with AI Tutor
                    </button>
                  ) : (
                    <div className="ai-explanation" style={{ background: 'var(--gray-50)', padding: '20px', borderRadius: '16px', borderLeft: '4px solid var(--primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: 'var(--primary)', fontWeight: 800 }}>
                        <Sparkles size={18} /> AI TUTOR EXPLANATION
                      </div>
                      <p style={{ fontSize: '15px', color: 'var(--gray-700)', lineHeight: 1.7 }}>{explanations[index]}</p>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </section>

        {/* ACTION */}
        <section className="dashboard-section" style={{ textAlign: "center", marginTop: '40px' }}>
          <button
            className="btn btn-outline"
            onClick={() => navigate("/my-results")}
            style={{ padding: '14px 32px' }}
          >
            <ArrowLeft size={18} />
            Back to My Results
          </button>
        </section>

      </main>

      {/* HIDDEN CERTIFICATE FOR CAPTURE */}
      <div style={{ display: 'none' }}>
        <div ref={certificateRef} style={{
          width: '1000px',
          height: '700px',
          padding: '60px',
          background: 'white',
          border: '24px solid var(--primary)',
          textAlign: 'center',
          position: 'relative',
          fontFamily: 'Outfit, sans-serif'
        }}>
          <div style={{ position: 'absolute', top: '40px', left: '40px', color: 'var(--primary)', fontWeight: 800, fontSize: '32px' }}>EduTrack</div>
          <div style={{ marginTop: '60px' }}>
            <Award size={100} color="var(--primary)" style={{ marginBottom: '20px' }} />
            <h1 style={{ fontSize: '64px', margin: '0', color: 'var(--black)' }}>CERTIFICATE</h1>
            <p style={{ fontSize: '24px', color: 'var(--gray-500)', letterSpacing: '4px', margin: '10px 0 40px' }}>OF EXCELLENCE</p>

            <p style={{ fontSize: '20px', color: 'var(--gray-600)' }}>This is to certify that</p>
            <h2 style={{ fontSize: '56px', margin: '20px 0', color: 'var(--primary)', fontWeight: 800 }}>{user?.name}</h2>
            <p style={{ fontSize: '20px', color: 'var(--gray-600)', maxWidth: '700px', margin: '0 auto' }}>
              has successfully completed the <strong>{quiz.title}</strong> assessment on the EduTrack platform with an outstanding performance score of <strong>{result.percentage}%</strong>.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '100px', padding: '0 80px' }}>
              <div style={{ borderTop: '2px solid var(--border)', paddingTop: '10px', width: '200px' }}>
                <p style={{ fontWeight: 800 }}>{new Date().toLocaleDateString()}</p>
                <p style={{ fontSize: '14px', color: 'var(--gray-500)' }}>Date of Issue</p>
              </div>
              <div style={{ borderTop: '2px solid var(--border)', paddingTop: '10px', width: '200px' }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Jon_Kirsch_Signature.png" alt="Sig" style={{ height: '40px' }} />
                <p style={{ fontSize: '14px', color: 'var(--gray-500)' }}>Director, EduTrack</p>
              </div>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: '40px', right: '40px', opacity: 0.2 }}>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=verified-by-edutrack" alt="QR" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StudentResults;
