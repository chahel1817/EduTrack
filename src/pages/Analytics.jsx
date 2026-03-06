import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    TrendingUp,
    Target,
    PieChart,
    Activity,
    Zap,
    Cpu,
    Globe,
    Shield,
    Sparkles,
    MousePointer2,
    Lightbulb
} from "lucide-react";

const Analytics = () => {
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get("/results/analytics");
                setAnalytics(res.data || {});
            } catch (err) {
                console.error("Failed to load analytics:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const categories = Object.keys(analytics);
    const totalQuestions = categories.reduce((sum, cat) => sum + analytics[cat].total, 0);
    const totalCorrect = categories.reduce((sum, cat) => sum + analytics[cat].correct, 0);
    const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    if (loading) return (
        <div className="dashboard-container analytics-page">
            <Navbar />
            <main className="dashboard-main"><div className="loading">Loading your analytics...</div></main>
        </div>
    );

    return (
        <div className="dashboard-container analytics-page">
            <Navbar />
            <main className="dashboard-main">
                <div style={{ padding: '0 24px' }}>

                    {/* performance HERO */}
                    <section className="hero-pro analytics-hero" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '100px 60px',
                        borderRadius: '40px',
                        marginBottom: '60px',
                        position: 'relative',
                        overflow: 'hidden',
                        textAlign: 'center',
                        background: 'var(--vibrant-gradient)',
                        color: 'white'
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 70%)', zIndex: 0 }}></div>

                        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '99px', marginBottom: '32px', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                                <Cpu size={16} className="text-white" /> <span style={{ color: 'white' }}>learning Profile Analysis</span>
                            </div>
                            <h1 style={{ margin: '0 0 24px', fontSize: '64px', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color: 'white' }}>Learning <br /><span style={{ background: 'linear-gradient(to right, #fff, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Knowledge Map.</span></h1>
                            <p style={{ margin: '0 auto', fontSize: '20px', maxWidth: '650px', lineHeight: 1.6, fontWeight: 500, color: 'white' }}>
                                High-precision mapping of your intellectual domains. Our Learning engine deciphers your performance vectors to optimize your learning trajectory.
                            </p>
                        </div>

                        <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', opacity: 0.1 }}>
                            <PieChart size={400} color="white" />
                        </div>
                    </section>

                    {categories.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '120px 40px', background: 'var(--gray-50)', borderRadius: '48px', border: '1px dashed var(--border)' }}>
                            <Activity size={64} style={{ margin: '0 auto 32px', color: 'var(--gray-300)' }} />
                            <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '16px' }}>Insufficient Data Profile</h2>
                            <p style={{ color: 'var(--gray-500)', maxWidth: '400px', margin: '0 auto 48px' }}>Your knowledge map is currently unmapped. Complete at least one assessment trial to Start performance tracking.</p>
                            <button className="btn btn-primary" onClick={() => navigate("/quizzes")} style={{ padding: '20px 48px', borderRadius: '20px', fontWeight: 900 }}>
                                Start First Trial
                            </button>
                        </div>
                    ) : (
                        <div style={{ marginBottom: '120px' }}>

                            {/* CORE PERFORMANCE VECTORS */}
                            <div className="stats-grid" style={{ marginBottom: '80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                                <div className="glass-card" style={{ padding: '40px', borderRadius: '32px', border: '1px solid var(--border)', textAlign: 'center' }}>
                                    <div style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}><TrendingUp size={28} /></div>
                                    <p style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--gray-400)', letterSpacing: '0.1em', marginBottom: '8px' }}>Global Precision</p>
                                    <h2 style={{ fontSize: '40px', fontWeight: 900, color: 'var(--gray-900)' }}>{overallAccuracy}%</h2>
                                </div>
                                <div className="glass-card" style={{ padding: '40px', borderRadius: '32px', border: '1px solid var(--border)', textAlign: 'center' }}>
                                    <div style={{ background: 'rgba(109, 40, 217, 0.1)', color: 'var(--primary)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}><MousePointer2 size={28} /></div>
                                    <p style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--gray-400)', letterSpacing: '0.1em', marginBottom: '8px' }}>Queries Decrypted</p>
                                    <h2 style={{ fontSize: '40px', fontWeight: 900, color: 'var(--gray-900)' }}>{totalQuestions}</h2>
                                </div>
                                <div className="glass-card" style={{ padding: '40px', borderRadius: '32px', border: '1px solid var(--border)', textAlign: 'center' }}>
                                    <div style={{ background: 'rgba(249, 115, 22, 0.1)', color: 'var(--button)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}><Shield size={28} /></div>
                                    <p style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--gray-400)', letterSpacing: '0.1em', marginBottom: '8px' }}>Learning Hits</p>
                                    <h2 style={{ fontSize: '40px', fontWeight: 900, color: 'var(--gray-900)' }}>{totalCorrect}</h2>
                                </div>
                            </div>

                            {/* DOMAIN MASTERY MATRIX */}
                            <section style={{ marginBottom: '100px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                                    <div style={{ background: 'var(--primary)', padding: '16px', borderRadius: '20px', color: 'white' }}>
                                        <Zap size={28} fill="white" />
                                    </div>
                                    <div>
                                        <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--gray-900)' }}>Domain Mastery Matrix</h2>
                                        <p style={{ margin: 0, color: 'var(--gray-400)', fontSize: '16px', fontWeight: 600 }}>Deciphering performance across instructional hierarchies.</p>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
                                    {categories.map(cat => {
                                        const accuracy = Math.round((analytics[cat].correct / analytics[cat].total) * 100);
                                        return (
                                            <div key={cat} className="glass-card hover-lift" style={{ padding: '40px', borderRadius: '40px', border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                                    <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 900, letterSpacing: '-0.01em', color: 'var(--gray-900)' }}>{cat}</h3>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: accuracy >= 80 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(109, 40, 217, 0.1)', borderRadius: '12px' }}>
                                                        <span style={{ fontSize: '18px', fontWeight: 900, color: accuracy >= 80 ? 'var(--success)' : 'var(--primary)' }}>{accuracy}%</span>
                                                    </div>
                                                </div>

                                                <div className="mastery-gauge" style={{ marginBottom: '24px', background: 'var(--gray-100)' }}>
                                                    <div
                                                        className="mastery-gauge-fill"
                                                        style={{
                                                            width: `${accuracy}%`,
                                                            background: accuracy >= 80 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, var(--primary), var(--accent))'
                                                        }}
                                                    />
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                    <div style={{ padding: '16px', background: 'var(--gray-50)', borderRadius: '16px' }}>
                                                        <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 900, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Artifacts</p>
                                                        <p style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--gray-900)' }}>{analytics[cat].total} <span style={{ color: 'var(--gray-300)', fontSize: '12px' }}>Total Questions</span></p>
                                                    </div>
                                                    <div style={{ padding: '16px', background: 'var(--gray-50)', borderRadius: '16px' }}>
                                                        <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 900, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Precision</p>
                                                        <p style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--gray-900)' }}>{analytics[cat].correct} <span style={{ color: 'var(--gray-300)', fontSize: '12px' }}>Hits</span></p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* STRATEGIC RECOMMENDATIONS */}
                            <section className="glass-card analytics-insights-card" style={{ padding: '80px 40px', borderRadius: '48px', background: 'var(--gray-950)', color: 'white', marginBottom: '100px', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'var(--primary)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.1 }}></div>
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                                        <Lightbulb size={48} className="text-primary" style={{ margin: '0 auto 24px' }} />
                                        <h2 style={{ fontSize: '42px', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.04em', color: 'white' }}>Learning Recommendations</h2>
                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>Recommended focus quizzes based on your latest performance.</p>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                                        {[
                                            { title: "Target Focus", desc: "Prioritize " + (categories[0] || "General") + " assessment trials to stabilize your global accuracy vector.", icon: <Target size={24} /> },
                                            { title: "Engagement Flux", desc: "Your learning load is optimal. Recommended: 3 trials per 48-hour cycle for maximum retention.", icon: <Zap size={24} /> },
                                            { title: "Peer Synchronization", desc: "You are currently in the top 15% of the " + (categories[1] || "Core") + " performance cluster.", icon: <Globe size={24} /> }
                                        ].map((r, i) => (
                                            <div key={i} className="analytics-insight-item" style={{ padding: '32px', background: 'rgba(255,255,255,0.03)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <div style={{ color: 'var(--primary)', marginBottom: '16px' }}>{r.icon}</div>
                                                <h4 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '12px', color: 'white' }}>{r.title}</h4>
                                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>{r.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* ENGAGEMENT CTA */}
                            <section style={{ textAlign: 'center', marginBottom: '120px' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '16px 32px', background: 'var(--gray-50)', borderRadius: '24px', border: '1px solid var(--border)' }}>
                                    <Sparkles size={24} className="text-secondary" />
                                    <div style={{ textAlign: 'left' }}>
                                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 900, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Next Phase</p>
                                        <p style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--gray-900)' }}>Start Targeted Learning</p>
                                    </div>
                                    <button onClick={() => navigate("/quizzes")} style={{ marginLeft: '24px', padding: '12px 24px', background: 'var(--primary)', color: 'white', borderRadius: '14px', fontSize: '14px', fontWeight: 900, border: 'none', cursor: 'pointer' }}>
                                        Explore Library
                                    </button>
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Analytics;
