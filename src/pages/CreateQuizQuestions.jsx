import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { api } from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Plus,
  Save,
  Trash2,
  AlertCircle,
  Sparkles,
  Zap,
  File,
  Loader2,
  Upload
} from "lucide-react";

const CreateQuizQuestions = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const quizDetails = location.state;

  /* ---------------- SAFETY CHECK ---------------- */
  useEffect(() => {
    if (!quizDetails) {
      navigate("/create-quiz");
    }
  }, [quizDetails, navigate]);

  /* ---------------- QUESTIONS STATE ---------------- */
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: null,
      timeLimit: quizDetails?.enableQuestionTimeLimit
        ? quizDetails.questionTimeLimit
        : null,
    },
  ]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------------- AI STATES ---------------- */
  const [difficulty, setDifficulty] = useState("Medium");
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [activeTab, setActiveTab] = useState("manual"); // manual, ai-forge, pdf-scan
  const [mergeAI, setMergeAI] = useState(false);

  /* ---------------- QUESTION HANDLERS ---------------- */

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: null,
        category: "General",
        timeLimit: quizDetails?.enableQuestionTimeLimit
          ? quizDetails.questionTimeLimit
          : null,
      },
    ]);
    setErrors({});
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
      setErrors({});
    }
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);

    if (errors[index]) {
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  /* ---------------- AI GENERATE ---------------- */

  const handleGenerateAI = async () => {
    setIsGenerating(true);

    try {
      const res = await api.post("/ai/generate-quiz", {
        topic: quizDetails.subject,
        difficulty,
        totalQuestions,
      });

      if (!res.data?.questions?.length) {
        alert("AI returned no questions");
        return;
      }

      // Attach per-question timer if enabled
      const aiQuestions = res.data.questions.map((q) => ({
        ...q,
        timeLimit: quizDetails.enableQuestionTimeLimit
          ? quizDetails.questionTimeLimit
          : null,
      }));

      setQuestions(mergeAI ? [...questions, ...aiQuestions] : aiQuestions);
      setErrors({});
      setActiveTab("manual");
    } catch (err) {
      console.error("AI generation failed:", err);
      alert("AI service unavailable. Try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  /* ---------------- GENERATE FROM PDF ---------------- */

  const handleGenerateFromPDF = async () => {
    if (!pdfFile) {
      alert("Please select a PDF file first");
      return;
    }

    setIsGenerating(true);
    const formData = new FormData();
    formData.append("pdf", pdfFile);
    formData.append("difficulty", difficulty);
    formData.append("totalQuestions", totalQuestions);

    try {
      const res = await api.post("/ai/generate-from-pdf", formData);

      if (!res.data?.questions?.length) {
        alert("AI could not generate questions from this PDF");
        return;
      }

      const aiQuestions = res.data.questions.map((q) => ({
        ...q,
        timeLimit: quizDetails.enableQuestionTimeLimit
          ? quizDetails.questionTimeLimit
          : null,
      }));

      if (mergeAI) {
        setQuestions(prev => [...prev, ...aiQuestions]);
      } else {
        setQuestions(aiQuestions);
      }
      setErrors({});
      setPdfFile(null); // Clear after success
      setActiveTab("manual");
    } catch (err) {
      console.error("PDF AI generation failed details:", err.response?.data || err.message);
      const msg = err.response?.data?.message || err.response?.data?.error || "Failed to process PDF. Make sure it's a valid PDF with text.";
      const details = err.response?.data?.details ? ` (${err.response.data.details})` : "";
      alert(`Error: ${msg}${details}`);
    } finally {
      setIsGenerating(false);
    }
  };

  /* ---------------- VALIDATION ---------------- */

  const validateQuestions = () => {
    const newErrors = {};

    questions.forEach((q, index) => {
      if (!q.question.trim()) {
        newErrors[index] = { question: "Question is required" };
      }

      if (q.options.filter((o) => o.trim()).length < 2) {
        newErrors[index] = {
          ...newErrors[index],
          options: "At least 2 options required",
        };
      }

      if (q.correctAnswer === null) {
        newErrors[index] = {
          ...newErrors[index],
          correctAnswer: "Select correct answer",
        };
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    if (!validateQuestions()) return;

    setIsSubmitting(true);

    try {
      await api.post("/quizzes", {
        ...quizDetails,
        questions,
      });

      navigate("/quiz-success");
    } catch (error) {
      console.error(error);
      alert("Failed to create quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container min-h-screen bg-slate-50 dark:bg-black">
      <Navbar />

      <main className="dashboard-main pt-28 pb-20 px-4 md:px-10">
        <div className="max-w-[1600px] mx-auto">

          {/* NAVIGATION TABS / MODE SELECTOR */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button
              onClick={() => setActiveTab("manual")}
              className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === "manual" ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'bg-white dark:bg-white/5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
            >
              <File size={22} /> Manual Workspace
            </button>
            <button
              onClick={() => setActiveTab("ai-forge")}
              className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === "ai-forge" ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'bg-white dark:bg-white/5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
            >
              <Sparkles size={22} /> AI Forge
            </button>
            <button
              onClick={() => setActiveTab("pdf-scan")}
              className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === "pdf-scan" ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'bg-white dark:bg-white/5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
            >
              <Upload size={22} /> PDF Intelligence
            </button>
            <div className="flex-1"></div>
            <button
              onClick={() => setQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: null }])}
              className="px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-all"
            >
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">

            {/* LEFT SIDE: THE STUDIO WORKSPACE */}
            <div className="xl:col-span-8 space-y-12">
              {activeTab === "manual" ? (
                <>
                  {questions.map((q, i) => (
                    <div key={i} className="relative group animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className="card-premium relative overflow-hidden backdrop-blur-xl p-0 shadow-xl hover:shadow-2xl transition-all">
                        {/* CARD HEADER */}
                        <div className="px-8 py-6 bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-primary/20">
                              {i + 1}
                            </div>
                            <span className="text-xxs font-black uppercase tracking-widest text-gray-400">Card Type: Multiple Choice</span>
                          </div>
                          {questions.length > 1 && (
                            <button
                              onClick={() => removeQuestion(i)}
                              className="p-3 text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-2xl transition-all hover:scale-110 active:scale-90"
                              title="Remove Question"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>

                        <div className="p-8 md:p-12 text-left">
                          {/* QUESTION INPUT */}
                          <div className="mb-12 relative">
                            <textarea
                              placeholder="Type your question prompt here..."
                              className="w-full text-2xl md:text-3xl font-black bg-transparent border-none focus:ring-0 p-0 placeholder-gray-200 dark:placeholder-white/10 resize-none min-h-[100px] leading-tight outline-none"
                              value={q.question}
                              onChange={(e) => updateQuestion(i, "question", e.target.value)}
                            />
                            <div className="h-1 w-20 bg-primary/20 rounded-full mt-4"></div>
                          </div>

                          {/* OPTIONS GRID */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {q.options.map((opt, idx) => (
                              <div
                                key={idx}
                                className={`p-1 rounded-[32px] transition-all duration-500 ${q.correctAnswer === idx ? 'bg-gradient-to-br from-primary to-accent shadow-xl shadow-primary/20 scale-[1.02]' : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10'}`}
                              >
                                <div className="bg-white dark:bg-gray-900 rounded-[31px] p-5 flex items-center gap-4">
                                  <button
                                    onClick={() => updateQuestion(i, "correctAnswer", idx)}
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all ${q.correctAnswer === idx ? 'bg-primary text-white shadow-lg' : 'bg-gray-50 dark:bg-white/10 text-gray-400'}`}
                                  >
                                    {String.fromCharCode(65 + idx)}
                                  </button>
                                  <input
                                    className="flex-1 bg-transparent border-none focus:ring-0 font-bold text-gray-700 dark:text-gray-200 placeholder-gray-300 outline-none text-sm"
                                    placeholder={`Potential Answer ${idx + 1}`}
                                    value={opt}
                                    onChange={(e) => updateOption(i, idx, e.target.value)}
                                  />
                                  {q.correctAnswer === idx && <Zap size={18} className="text-primary animate-pulse" />}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* CARD FOOTER */}
                          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                              {/* Knowledge Tag Removed */}
                            </div>

                            {errors[i] && (
                              <div className="flex items-center gap-3 px-6 py-3 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 animate-pulse">
                                <AlertCircle size={18} />
                                <span className="text-xxs font-black uppercase tracking-widest">Logic Missing</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    className="w-full py-16 rounded-[40px] border-4 border-dashed border-gray-200 dark:border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-4 group"
                    onClick={addQuestion}
                  >
                    <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-3xl shadow-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Plus size={32} />
                    </div>
                    <span className="font-black uppercase tracking-mega text-xs text-gray-400 group-hover:text-primary transition-colors">Add New Question Card</span>
                  </button>
                </>
              ) : activeTab === "ai-forge" ? (
                <div className="card-premium animate-fade-in p-12 text-center space-y-10">
                  <div className="w-24 h-24 bg-primary/10 text-primary rounded-[40px] flex items-center justify-center mx-auto shadow-inner">
                    <Sparkles size={48} />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black tracking-tighter mb-4">AI Intelligence Forge</h2>
                    <p className="text-gray-400 font-bold max-w-md mx-auto">Leverage our neural networks to synthesize high-quality questions based on your subject: <span className="text-primary">{quizDetails.subject}</span></p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto text-left">
                    <div className="space-y-4">
                      <label className="text-xxs font-black uppercase tracking-widest text-primary ml-2">Intelligence Level</label>
                      <div className="flex gap-2 bg-gray-50 dark:bg-white/5 p-2 rounded-3xl">
                        {['Easy', 'Medium', 'Hard'].map(lvl => (
                          <button
                            key={lvl}
                            onClick={() => setDifficulty(lvl)}
                            className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase transition-all ${difficulty === lvl ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-xxs font-black uppercase tracking-widest text-primary ml-2">Extraction Count ({totalQuestions})</label>
                      <div className="bg-gray-50 dark:bg-white/5 p-2 rounded-3xl flex items-center gap-4 px-6">
                        <input
                          type="range"
                          min="1"
                          max="20"
                          value={totalQuestions}
                          onChange={(e) => setTotalQuestions(Number(e.target.value))}
                          className="flex-1 accent-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-6 pt-10 border-t border-gray-100 dark:border-white/10">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${mergeAI ? 'bg-primary border-primary' : 'border-gray-200'}`} onClick={() => setMergeAI(!mergeAI)}>
                        {mergeAI && <Plus size={14} className="text-white" />}
                      </div>
                      <span className="text-xs font-black uppercase text-gray-500 group-hover:text-primary transition-colors">Append to existing questions (instead of replacing)</span>
                    </label>

                    <button
                      onClick={handleGenerateAI}
                      disabled={isGenerating}
                      className="w-full max-w-md btn btn-primary py-8 rounded-[35px] text-xl font-black italic tracking-tighter group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-4">
                        {isGenerating ? <Loader2 className="animate-spin" /> : <><Zap size={24} /> Initialize Neural Forge</>}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card-premium animate-fade-in p-12 text-center space-y-10">
                  <div className="w-24 h-24 bg-accent/10 text-accent rounded-[40px] flex items-center justify-center mx-auto shadow-inner">
                    <Upload size={48} />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black tracking-tighter mb-4">Deep PDF Intel</h2>
                    <p className="text-gray-400 font-bold max-w-md mx-auto">Upload a research paper, textbook chapter, or PDF notes. Our AI will scan every line to extract the most critical insights.</p>
                  </div>

                  <div className="max-w-md mx-auto">
                    <label className={`w-full h-48 rounded-[40px] border-4 border-dashed transition-all flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-accent/5 ${pdfFile ? 'border-accent bg-accent/5' : 'border-gray-200 dark:border-white/10'}`}>
                      {pdfFile ? (
                        <>
                          <div className="w-16 h-16 bg-accent text-white rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20">
                            <File size={32} />
                          </div>
                          <span className="font-black text-xs uppercase tracking-widest text-accent max-w-[200px] truncate">{pdfFile.name}</span>
                          <span className="text-[10px] text-gray-400 font-bold" onClick={(e) => { e.preventDefault(); setPdfFile(null); }}>Click to Remove</span>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 text-gray-400 rounded-2xl flex items-center justify-center">
                            <Plus size={32} />
                          </div>
                          <span className="font-black text-xs uppercase tracking-widest text-gray-400">Select Source Artifact</span>
                        </>
                      )}
                      <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setPdfFile(e.target.files[0])} />
                    </label>
                  </div>

                  <div className="flex flex-col items-center gap-6 pt-10 border-t border-gray-100 dark:border-white/10">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${mergeAI ? 'bg-accent border-accent' : 'border-gray-200'}`} onClick={() => setMergeAI(!mergeAI)}>
                        {mergeAI && <Plus size={14} className="text-white" />}
                      </div>
                      <span className="text-xs font-black uppercase text-gray-500 group-hover:text-accent transition-colors">Merge intelligence with manual cards</span>
                    </label>

                    <button
                      onClick={handleGenerateFromPDF}
                      disabled={isGenerating || !pdfFile}
                      className={`w-full max-w-md py-8 rounded-[35px] text-xl font-black italic tracking-tighter transition-all flex items-center justify-center gap-4 ${pdfFile ? 'bg-accent text-white shadow-2xl shadow-accent/40 hover:scale-[1.02] active:scale-[0.98]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    >
                      {isGenerating ? <Loader2 className="animate-spin" /> : <><Sparkles size={24} /> Execute Deep Scan</>}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDE: THE COMMAND CENTER */}
            <div className="xl:col-span-4 space-y-8 sticky top-32">
              <div className="card-premium p-8 shadow-2xl bg-white/70 backdrop-blur-3xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black tracking-tighter">Mission Stats</h3>
                  <div className="px-2 py-0.5 bg-primary/10 text-primary rounded-lg text-xxs font-black uppercase tracking-widest">Live Sync</div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Questions Count</span>
                    <span className="text-xl font-black italic text-primary">{questions.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Difficulty Bias</span>
                    <span className="text-xs font-black uppercase text-gray-800 dark:text-gray-200">{difficulty}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full btn btn-primary py-6 rounded-[30px] text-lg font-black italic tracking-tighter shadow-2xl shadow-primary/40 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {isSubmitting ? <Loader2 className="animate-spin" /> : <><Save size={24} /> Deploy Mission</>}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                  <p className="text-center font-black uppercase text-[10px] tracking-mega text-gray-400">Locked & Loaded</p>
                </div>
              </div>

              {/* QUICK NAV FOR MANY QUESTIONS */}
              {questions.length > 5 && (
                <div className="card-premium p-6 overflow-y-auto max-h-[300px] flex flex-wrap gap-2 justify-center">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all cursor-pointer ${errors[i] ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-primary'}`}
                      onClick={() => {
                        setActiveTab("manual");
                        setTimeout(() => {
                          const el = document.querySelectorAll('.animate-fade-in')[i];
                          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 100);
                      }}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateQuizQuestions;
