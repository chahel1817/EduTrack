import { useEffect, useState } from "react";
import { api } from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    BarChart3,
    TrendingUp,
    Target,
    Award,
    BookOpen,
    PieChart,
    Activity,
    Zap
} from "lucide-react";

const Analytics = () => {
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

    if (loading) {
        return (
            <div className="dashboard-container">
                <Navbar />
                <main className="dashboard-main">
                    <div className="loading" style={{ textAlign: "center", padding: "100px" }}>
                        <Activity className="animate-spin" size={48} color="var(--primary)" />
                        <p style={{ marginTop: '20px', fontWeight: 600 }}>Analyzing your performance...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <Navbar />
            <main className="dashboard-main">
                {/* HEADER */}
                <section className="dashboard-section hero-pro" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '40px', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div className="header-icon" style={{ background: 'rgba(255,255,255,0.2)', width: '64px', height: '64px' }}>
                            <PieChart size={36} color="white" />
                        </div>
                        <div>
                            <h1 className="hero-pro-title" style={{ margin: 0, fontSize: '32px' }}>Skill Breakdown</h1>
                            <p className="hero-pro-sub" style={{ margin: 0, opacity: 0.9 }}>
                                Deep dive into your strengths and areas for improvement
                            </p>
                        </div>
                    </div>
                    <BarChart3 size={100} style={{ opacity: 0.15, color: 'white' }} />
                </section>

                {categories.length === 0 ? (
                    <section className="dashboard-section">
                        <div className="empty-state enhanced">
                            <Target size={64} color="var(--primary)" />
                            <h3>No Data for Analytics</h3>
                            <p>Take some quizzes with category data to see your skill breakdown here.</p>
                        </div>
                    </section>
                ) : (
                    <div className="dashboard-section">
                        {/* OVERALL STATS */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                            <div className="stat-card-pro" style={{ background: 'white', padding: '30px', borderRadius: '24px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ background: 'rgba(109, 40, 217, 0.1)', padding: '15px', borderRadius: '16px', color: 'var(--primary)' }}>
                                    <TrendingUp size={28} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, color: 'var(--gray-500)', fontSize: '14px', fontWeight: 600 }}>Overall Accuracy</h4>
                                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>{overallAccuracy}%</p>
                                </div>
                            </div>

                            <div className="stat-card-pro" style={{ background: 'white', padding: '30px', borderRadius: '24px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '15px', borderRadius: '16px', color: 'var(--accent)' }}>
                                    <BookOpen size={28} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, color: 'var(--gray-500)', fontSize: '14px', fontWeight: 600 }}>Questions Answered</h4>
                                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>{totalQuestions}</p>
                                </div>
                            </div>

                            <div className="stat-card-pro" style={{ background: 'white', padding: '30px', borderRadius: '24px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ background: 'rgba(234, 179, 8, 0.1)', padding: '15px', borderRadius: '16px', color: 'var(--warning)' }}>
                                    <Award size={28} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, color: 'var(--gray-500)', fontSize: '14px', fontWeight: 600 }}>Correct Hits</h4>
                                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>{totalCorrect}</p>
                                </div>
                            </div>
                        </div>

                        {/* SKILL PROGRESS BARS */}
                        <div className="glass-card" style={{ padding: '40px' }}>
                            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Zap size={24} color="var(--primary)" /> Mastery by Category
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                {categories.map(cat => {
                                    const accuracy = Math.round((analytics[cat].correct / analytics[cat].total) * 100);
                                    return (
                                        <div key={cat}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '12px' }}>
                                                <div>
                                                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{cat}</h4>
                                                    <span style={{ fontSize: '12px', color: 'var(--gray-500)' }}>{analytics[cat].correct} correct out of {analytics[cat].total} questions</span>
                                                </div>
                                                <span style={{ fontSize: '18px', fontWeight: 800, color: accuracy >= 80 ? 'var(--success)' : accuracy >= 50 ? 'var(--warning)' : 'var(--error)' }}>
                                                    {accuracy}%
                                                </span>
                                            </div>
                                            <div style={{ width: '100%', height: '12px', background: 'var(--gray-100)', borderRadius: '6px', overflow: 'hidden' }}>
                                                <div
                                                    style={{
                                                        width: `${accuracy}%`,
                                                        height: '100%',
                                                        background: accuracy >= 80 ? 'var(--success)' : accuracy >= 50 ? 'var(--warning)' : 'var(--error)',
                                                        borderRadius: '6px',
                                                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Analytics;
