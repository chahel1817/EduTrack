import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FileText, Clock, ArrowRight, Sparkles, Zap } from "lucide-react";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const clampNumber = (value, min, max) => {
    const n = Number(value);
    if (Number.isNaN(n)) return min;
    return Math.min(max, Math.max(min, n));
  };

  /* ---------------- STATE ---------------- */
  const [quiz, setQuiz] = useState({
    title: "",
    subject: "",
    description: "",
    timeLimit: 30, // whole quiz (minutes)
    enableQuestionTimeLimit: false,
    questionTimeLimit: null, // per-question (seconds)
    allowMultipleAttempts: false,
    allowBack: true,
  });

  /* ---------------- RESTORE STATE WHEN COMING BACK ---------------- */
  useEffect(() => {
    if (location.state) {
      setQuiz(location.state);
    }
  }, []);

  /* ---------------- NEXT HANDLER ---------------- */
  const handleNext = () => {
    if (!quiz.title.trim() || !quiz.subject.trim()) {
      alert("Title & Subject are required");
      return;
    }

    if (quiz.enableQuestionTimeLimit && (!quiz.questionTimeLimit || quiz.questionTimeLimit < 5)) {
      alert("Per-question time must be at least 5 seconds");
      return;
    }

    navigate("/create/quiz/questions", {
      state: quiz,
    });
  };

  return (
    <div className="dashboard-container min-h-screen bg-white dark:bg-black overflow-x-hidden">
      <Navbar />

      <main className="dashboard-main relative pt-32 pb-20">
        {/* DECORATIVE BACKGROUND ELEMENTS */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>

        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-start">

            {/* LEFT SIDE: THE HERO & GUIDANCE */}
            <div className="lg:w-1/3 sticky top-32 text-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/40 rotate-12 transition-transform">
                  <Sparkles size={24} />
                </div>
                <span className="text-sm font-black uppercase tracking-[0.3em] text-primary">Creator Hub</span>
              </div>

              <h1 className="text-5xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tighter mb-6">
                Design your <span className="gradient-text">Masterpiece</span> quiz.
              </h1>

              <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                Transform your knowledge into an interactive challenge. Set the rules, define the pace, and watch your students excel.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <ArrowRight size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">Global Settings</h4>
                    <p className="text-sm text-gray-500">Define timers, subject categories, and attempt rules.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <ArrowRight size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">AI Assistance</h4>
                    <p className="text-sm text-gray-500">Enable modern AI to forge questions in seconds on the next step.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: THE ENHANCED FORM */}
            <div className="lg:w-2/3 w-full">
              <div className="card-premium relative overflow-hidden backdrop-blur-xl">
                {/* FORM TITLE */}
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">Quiz Foundations</h2>
                  <div className="stage-badge">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                    <span className="text-xxs font-black uppercase tracking-widest text-primary">Stage 1/2</span>
                  </div>
                </div>

                <div className="space-y-10">
                  {/* TITLE & SUBJECT GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div className="group">
                      <label className="text-xxs font-black uppercase text-gray-400 mb-2 block tracking-mega ml-2">Exam Title</label>
                      <input
                        className="input-premium"
                        placeholder="e.g. Modern Web Architecture"
                        value={quiz.title}
                        onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                      />
                    </div>
                    <div className="group">
                      <label className="text-xxs font-black uppercase text-gray-400 mb-2 block tracking-mega ml-2">Subject</label>
                      <input
                        className="input-premium"
                        placeholder="e.g. Computer Science"
                        value={quiz.subject}
                        onChange={(e) => setQuiz({ ...quiz, subject: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div className="group text-left">
                    <label className="text-xxs font-black uppercase text-gray-400 mb-2 block tracking-mega ml-2">Description (Optional)</label>
                    <textarea
                      className="input-premium h-auto py-5 resize-none min-h-[120px]"
                      placeholder="What should the students know before they begin?"
                      value={quiz.description}
                      onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                    />
                  </div>

                  <hr className="border-gray-100 dark:border-white/5" />

                  {/* SIMPLE TIMER PANEL */}
                  <div className="bg-gray-50 dark:bg-white/5 rounded-[40px] p-8 md:p-12 border border-gray-100 dark:border-white/10 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-stretch">
                      {/* DURATION CARD */}
                      <div className="bg-white/70 dark:bg-black/30 rounded-[34px] p-7 md:p-8 border border-gray-100 dark:border-white/10 shadow-sm flex flex-col justify-between text-left">
                        <div>
                          <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-1 flex items-center gap-2">
                            <Clock size={16} className="text-primary" />
                            Quiz Duration
                          </h4>
                          <p className="text-xs font-bold text-gray-400 dark:text-gray-500">Total time for the entire quiz.</p>
                        </div>

                        <div className="mt-6 flex items-center gap-4">
                          <div className="relative">
                            <input
                              type="number"
                              inputMode="numeric"
                              className="w-28 h-20 text-4xl font-black text-primary bg-white dark:bg-black/40 rounded-3xl border-2 border-gray-100 dark:border-white/10 focus:border-primary text-center outline-none transition-all shadow-sm"
                              min="1"
                              max="300"
                              value={quiz.timeLimit}
                              onChange={(e) => setQuiz({ ...quiz, timeLimit: clampNumber(e.target.value, 1, 300) })}
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="text-sm font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest leading-tight">
                              Minutes
                            </div>
                            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 leading-tight">
                              Recommended: 10–60
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* PER-QUESTION CARD */}
                      <div className="bg-white/70 dark:bg-black/30 rounded-[34px] p-7 md:p-8 border border-gray-100 dark:border-white/10 shadow-sm flex flex-col justify-between text-left">
                        <div>
                          <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-1 flex items-center gap-2">
                            <Zap size={16} className="text-primary" />
                            Per-Question Timer
                          </h4>
                          <p className="text-xs font-bold text-gray-400 dark:text-gray-500">Limit time allowed for each question.</p>
                        </div>

                        <button
                          type="button"
                          aria-pressed={quiz.enableQuestionTimeLimit}
                          onClick={() =>
                            setQuiz({
                              ...quiz,
                              enableQuestionTimeLimit: !quiz.enableQuestionTimeLimit,
                              questionTimeLimit: !quiz.enableQuestionTimeLimit ? 30 : null,
                            })
                          }
                          className={`mt-6 w-full h-20 px-6 rounded-3xl flex items-center justify-between gap-4 transition-all border-2 shadow-sm ${quiz.enableQuestionTimeLimit
                              ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                              : "bg-white dark:bg-black/40 border-gray-100 dark:border-white/10 text-gray-500 dark:text-gray-300 hover:border-gray-200 dark:hover:border-white/20"
                            }`}
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${quiz.enableQuestionTimeLimit ? "bg-white/15" : "bg-gray-50 dark:bg-white/5"
                                }`}
                            >
                              <Zap size={18} className={quiz.enableQuestionTimeLimit ? "text-white" : "text-primary"} />
                            </div>
                            <div className="min-w-0">
                              <div className="font-black uppercase tracking-widest leading-tight text-gray-800 dark:text-gray-50">
                                {quiz.enableQuestionTimeLimit ? "Active" : "Disabled"}
                              </div>
                              <div className={`text-xs font-bold leading-tight ${quiz.enableQuestionTimeLimit ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}>
                                {quiz.enableQuestionTimeLimit ? `${quiz.questionTimeLimit ?? 30}s per question` : "Use overall duration only"}
                              </div>
                            </div>
                          </div>

                          <div className={`w-12 h-7 rounded-full relative flex-shrink-0 ${quiz.enableQuestionTimeLimit ? "bg-white/25" : "bg-gray-100 dark:bg-white/10"}`}>
                            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${quiz.enableQuestionTimeLimit ? "left-6" : "left-1"}`} />
                          </div>
                        </button>
                      </div>
                    </div>

                    {quiz.enableQuestionTimeLimit && (
                      <div className="bg-white/70 dark:bg-black/30 rounded-[30px] p-8 border border-gray-100 dark:border-white/10 space-y-6 text-left shadow-sm">
                        <div className="flex items-center justify-between gap-6">
                          <span className="text-[10px] font-black uppercase text-primary tracking-[0.4em]">
                            Pace: {quiz.questionTimeLimit}s / question
                          </span>
                          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase italic">Pace Control</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="180"
                          step="5"
                          className="w-full accent-primary h-2 bg-gray-100 dark:bg-white/10 rounded-full appearance-none cursor-pointer"
                          value={quiz.questionTimeLimit ?? 30}
                          onChange={(e) => setQuiz({ ...quiz, questionTimeLimit: clampNumber(e.target.value, 5, 180) })}
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        onClick={() => setQuiz({ ...quiz, allowMultipleAttempts: !quiz.allowMultipleAttempts })}
                        className={`flex items-center gap-4 p-6 rounded-3xl cursor-pointer transition-all border-2 ${quiz.allowMultipleAttempts ? 'bg-primary/5 border-primary text-primary' : 'bg-white dark:bg-black/40 border-gray-100 dark:border-white/5 text-gray-400 hover:border-gray-200'}`}
                      >
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${quiz.allowMultipleAttempts ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                          {quiz.allowMultipleAttempts && <ArrowRight size={14} strokeWidth={4} />}
                        </div>
                        <span className="font-black text-[10px] uppercase tracking-[0.2em] text-left">Unlimited Retakes</span>
                      </div>

                      <div
                        onClick={() => setQuiz({ ...quiz, allowBack: !quiz.allowBack })}
                        className={`flex items-center gap-4 p-6 rounded-3xl cursor-pointer transition-all border-2 ${quiz.allowBack ? 'bg-primary/5 border-primary text-primary' : 'bg-white dark:bg-black/40 border-gray-100 dark:border-white/5 text-gray-500 hover:border-gray-200'}`}
                      >
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${quiz.allowBack ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                          {quiz.allowBack && <ArrowRight size={14} strokeWidth={4} />}
                        </div>
                        <span className="font-black text-[10px] uppercase tracking-[0.2em] text-left">Allow Going Back</span>
                      </div>
                    </div>
                  </div>

                  {/* FINAL ACTION */}
                  <button
                    className="w-full btn btn-primary py-6 rounded-3xl text-xl font-black italic tracking-tighter group hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/40 relative overflow-hidden mt-8"
                    onClick={handleNext}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-4">
                      Next Step <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform duration-500" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateQuiz;
