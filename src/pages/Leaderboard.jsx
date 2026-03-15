import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Trophy, Medal, Award, TrendingUp, Clock, ArrowLeft, Users, Target, Zap, Shield, Sparkles, Globe } from 'lucide-react';

const Leaderboard = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leaderboardRes, quizRes] = await Promise.all([
          api.get(`/results/leaderboard/${quizId}`),
          api.get(`/quizzes/${quizId}`)
        ]);
        setLeaderboard(leaderboardRes.data || []);
        setQuiz(quizRes.data);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    if (quizId) fetchData();
  }, [quizId]);

  if (loading) return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main"><div className="loading">Initializing Leaderboard...</div></main>
    </div>
  );

  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        <div style={{ padding: '0 24px' }}>

          {/* ELITE HERO */}
          <section className="hero-pro" style={{
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

            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 30% 20%, rgba(109, 40, 217, 0.3) 0%, transparent 70%)', zIndex: 0 }}></div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '99px', marginBottom: '32px', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                <Trophy size={16} fill="var(--primary)" /> <span>The Top Standings</span>
              </div>
              <h1 style={{ margin: '0 0 16px', fontSize: '64px', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>{quiz?.title} <br /><span style={{ color: 'rgba(255,255,255,0.7)' }}>Elite Rankings.</span></h1>
              <p style={{ margin: '0 auto 40px', opacity: 0.8, fontSize: '20px', maxWidth: '600px', lineHeight: 1.6, fontWeight: 500 }}>
                Only the top 1% achieve absolute platform mastery. Observe the current learning leaders in <strong>{quiz?.subject}</strong>.
              </p>
              <button
                className="btn btn-outline"
                onClick={() => navigate('/quizzes')}
                style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 800, padding: '16px 32px', borderRadius: '16px' }}
              >
                <ArrowLeft size={18} /> Exit Arena
              </button>
            </div>

            <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', opacity: 0.1 }}>
              <Sparkles size={400} color="white" />
            </div>
          </section >

          {/* PODIUM SECTION */}
          {
            topThree.length > 0 && (
              <section style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '32px', marginBottom: '80px', paddingTop: '40px' }}>

                {/* 2nd PLACE */}
                {topThree[1] && (
                  <div style={{ textAlign: 'center', width: '220px' }}>
                    <div style={{ position: 'relative', marginBottom: '24px' }}>
                      <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--gray-200)', border: '6px solid white', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 900, color: 'var(--gray-500)', boxShadow: 'var(--shadow-lg)' }}>
                        {topThree[1].studentName?.charAt(0)}
                      </div>
                      <div style={{ position: 'absolute', bottom: '-10px', right: '50%', transform: 'translateX(60px)', background: 'var(--gray-400)', color: 'white', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid white', fontWeight: 900 }}>2</div>
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '8px' }}>{topThree[1].studentName}</h3>
                    <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '24px', margin: 0 }}>{topThree[1].percentage}%</p>
                  </div>
                )}

                {/* 1st PLACE */}
                <div style={{ textAlign: 'center', width: '260px', transform: 'translateY(-20px)' }}>
                  <div style={{ position: 'relative', marginBottom: '32px' }}>
                    <div style={{ width: '130px', height: '130px', borderRadius: '50%', background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', border: '8px solid white', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px', fontWeight: 900, color: 'white', boxShadow: '0 20px 40px rgba(217, 119, 6, 0.3)', position: 'relative' }}>
                      {topThree[0].studentName?.charAt(0)}
                      <Zap size={32} fill="white" style={{ position: 'absolute', top: '-15px', right: '-15px', color: '#fbbf24' }} className="pulse-sync" />
                    </div>
                    <div style={{ position: 'absolute', bottom: '-15px', right: '50%', transform: 'translateX(80px)', background: '#fbbf24', color: 'white', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid white', fontWeight: 900, fontSize: '20px' }}>1</div>
                  </div>
                  <h3 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '8px' }}>{topThree[0].studentName}</h3>
                  <p style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '32px', margin: 0 }}>{topThree[0].percentage}%</p>
                </div>

                {/* 3rd PLACE */}
                {topThree[2] && (
                  <div style={{ textAlign: 'center', width: '220px' }}>
                    <div style={{ position: 'relative', marginBottom: '24px' }}>
                      <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#cd7f32', border: '6px solid white', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 900, color: 'white', boxShadow: 'var(--shadow-lg)', opacity: 0.9 }}>
                        {topThree[2].studentName?.charAt(0)}
                      </div>
                      <div style={{ position: 'absolute', bottom: '-10px', right: '50%', transform: 'translateX(60px)', background: '#cd7f32', color: 'white', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid white', fontWeight: 900 }}>3</div>
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '8px' }}>{topThree[2].studentName}</h3>
                    <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '24px', margin: 0 }}>{topThree[2].percentage}%</p>
                  </div>
                )}
              </section>
            )
          }

          {/* MAIN LEADERBOARD LIST */}
          <section className="glass-card" style={{ padding: '0', borderRadius: '48px', border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--white)', marginBottom: '100px' }}>
            <div style={{ padding: '40px', background: 'var(--gray-50)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Users size={24} className="text-primary" />
                <h2 style={{ fontSize: '22px', fontWeight: 900, margin: 0 }}>Full Ranking Matrix</h2>
              </div>
              <div style={{ padding: '8px 16px', background: 'white', borderRadius: '12px', fontSize: '13px', fontWeight: 700, color: 'var(--gray-500)', border: '1px solid var(--border)' }}>
                Total Participants: <strong>{leaderboard.length}</strong>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', background: 'var(--gray-50)' }}>
                  <th style={{ padding: '24px 40px', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--gray-400)', letterSpacing: '0.1em' }}>Rank</th>
                  <th style={{ padding: '24px 40px', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--gray-400)', letterSpacing: '0.1em' }}>quiz Identity</th>
                  <th style={{ padding: '24px 40px', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--gray-400)', letterSpacing: '0.1em', textAlign: 'center' }}>Accuracy</th>
                  <th style={{ padding: '24px 40px', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--gray-400)', letterSpacing: '0.1em', textAlign: 'center' }}>learning Flux (Score)</th>
                  <th style={{ padding: '24px 40px', fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--gray-400)', letterSpacing: '0.1em', textAlign: 'center' }}>Temporal Sync (Time)</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={index} className="hover-lift" style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.3s ease' }}>
                    <td style={{ padding: '28px 40px' }}>
                      <span style={{
                        fontSize: '18px',
                        fontWeight: 900,
                        color: entry.rank === 1 ? '#fbbf24' : entry.rank === 2 ? '#94a3b8' : entry.rank === 3 ? '#cd7f32' : 'var(--gray-300)'
                      }}>
                        #{entry.rank}
                      </span>
                    </td>
                    <td style={{ padding: '28px 40px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '18px' }}>
                          {entry.studentName?.charAt(0)}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 800, fontSize: '17px', color: 'var(--gray-900)' }}>{entry.studentName}</p>
                          <p style={{ margin: 0, fontSize: '12px', color: 'var(--gray-400)', fontWeight: 600 }}>Active quiz</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '28px 40px', textAlign: 'center' }}>
                      <div style={{ maxWidth: '140px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: 900, color: 'var(--primary)' }}>
                          <span>{entry.percentage}%</span>
                        </div>
                        <div className="mastery-gauge">
                          <div className="mastery-gauge-fill" style={{ width: `${entry.percentage}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '28px 40px', textAlign: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '18px', color: 'var(--gray-700)' }}>{entry.score}</span>
                      <span style={{ color: 'var(--gray-300)', fontSize: '14px', marginLeft: '4px' }}>/ {entry.total}</span>
                    </td>
                    <td style={{ padding: '28px 40px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'var(--gray-50)', borderRadius: '10px', fontSize: '14px', fontWeight: 750, color: 'var(--gray-500)' }}>
                        <Clock size={16} /> {entry.timeSpent}m
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* GLOBAL PERFORMANCE CARD */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '60px' }}>
            <div className="glass-card" style={{ padding: '48px', borderRadius: '40px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <Globe size={48} className="text-primary" style={{ margin: '0 auto 24px' }} />
              <h3 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '12px' }}>Global Percentile</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '15px', lineHeight: 1.6 }}>This leaderboard is updated across 150+ active school quizzes.</p>
            </div>
            <div className="glass-card" style={{ padding: '48px', borderRadius: '40px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <Target size={48} className="text-accent" style={{ margin: '0 auto 24px' }} />
              <h3 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '12px' }}>Curated Difficulty</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '15px', lineHeight: 1.6 }}>Difficulty coefficients are adjusted in real-time to ensure maximum competitive integrity.</p>
            </div>
            <div className="glass-card" style={{ padding: '48px', borderRadius: '40px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <TrendingUp size={48} className="text-success" style={{ margin: '0 auto 24px' }} />
              <h3 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '12px' }}>Future Trajectory</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '15px', lineHeight: 1.6 }}>Top performers are automatically flagged for accelerated pedagogical track consideration.</p>
            </div>
          </section>

        </div >
      </main >
      <Footer />
    </div >
  );
};

export default Leaderboard;

