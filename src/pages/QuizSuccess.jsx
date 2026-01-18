import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const QuizSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/dashboard"), 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="auth-page flex items-center justify-center" style={{ minHeight: '90vh' }}>
      <div className="glass-card text-center" style={{ padding: '60px 50px', maxWidth: '550px', width: '90%', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
        <div style={{
          background: 'rgba(34, 197, 94, 0.1)',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px',
          animation: 'bounce 2s infinite'
        }}>
          <CheckCircle size={70} color="#22c55e" strokeWidth={2.5} />
        </div>

        <h1 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '16px', color: 'var(--gray-900)' }}>
          Quiz Created!
        </h1>

        <p style={{ fontSize: '18px', color: 'var(--gray-500)', lineHeight: '1.6', marginBottom: '40px' }}>
          Your challenge is now live and ready for students. We're setting everything up on your dashboard.
        </p>

        <div className="flex flex-col gap-4">
          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: '16px', borderRadius: '16px', fontWeight: 800, fontSize: '16px' }}
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard Now
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <div className="loading-spinner-small" style={{ width: '14px', height: '14px', border: '2px solid var(--gray-200)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <span style={{ fontSize: '13px', color: 'var(--gray-400)', fontWeight: 600 }}>Redirecting in 4s...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSuccess;
