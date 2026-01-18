
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Trophy, Medal, Award, TrendingUp, Clock, ArrowLeft, Users, Target } from 'lucide-react';

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

  if (loading) return null;

  return (
    <div className="dashboard-container">
      <Navbar />
      <main>
        <section className="dashboard-section hero-pro">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Trophy size={60} color="var(--button)" />
            <div>
              <h1 className="hero-pro-title">Quiz Leaderboard</h1>
              <p className="hero-pro-sub">{quiz?.title} • {quiz?.subject}</p>
            </div>
          </div>
          <button className="btn btn-outline" onClick={() => navigate('/quizzes')} style={{ color: 'white', borderColor: 'white' }}>
            <ArrowLeft size={18} /> Back
          </button>
        </section>

        <div className="stats-grid" style={{ marginBottom: '40px' }}>
          <div className="stat-card">
            <div className="stat-icon-wrapper"><Users size={24} /></div>
            <div className="stat-value">{leaderboard.length}</div>
            <div className="stat-label">Participants</div>
          </div>
          {leaderboard.length > 0 && (
            <>
              <div className="stat-card">
                <div className="stat-icon-wrapper"><Target size={24} /></div>
                <div className="stat-value">{leaderboard[0].percentage}%</div>
                <div className="stat-label">Top Score</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrapper"><TrendingUp size={24} /></div>
                <div className="stat-value">
                  {Math.round(leaderboard.reduce((sum, l) => sum + parseFloat(l.percentage), 0) / leaderboard.length)}%
                </div>
                <div className="stat-label">Average Performance</div>
              </div>
            </>
          )}
        </div>

        <section className="dashboard-section" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="table-container" style={{ margin: 0, border: 'none' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--gray-50)', textAlign: 'left' }}>
                  <th style={{ padding: '20px', textAlign: 'center' }}>Rank</th>
                  <th style={{ padding: '20px' }}>Student</th>
                  <th style={{ padding: '20px', textAlign: 'center' }}>Score</th>
                  <th style={{ padding: '20px', textAlign: 'center' }}>Accuracy</th>
                  <th style={{ padding: '20px', textAlign: 'center' }}><Clock size={16} /> Time</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '20px', textAlign: 'center' }}>
                      <span style={{
                        fontSize: '20px',
                        fontWeight: 800,
                        color: entry.rank === 1 ? 'var(--button)' : entry.rank === 2 ? '#C0C0C0' : entry.rank === 3 ? '#CD7F32' : 'var(--gray-400)'
                      }}>
                        #{entry.rank}
                      </span>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="user-avatar" style={{ width: '40px', height: '40px', fontSize: '16px' }}>
                          {entry.studentName?.charAt(0)}
                        </div>
                        <span style={{ fontWeight: 600 }}>{entry.studentName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '20px', textAlign: 'center' }}>{entry.score}/{entry.total}</td>
                    <td style={{ padding: '20px', textAlign: 'center' }}>
                      <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '18px' }}>{entry.percentage}%</span>
                    </td>
                    <td style={{ padding: '20px', textAlign: 'center' }}>{entry.timeSpent} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Leaderboard;
