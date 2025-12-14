import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const QuizSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => navigate("/dashboard"), 3000);
  }, []);

  return (
    <div className="auth-page flex items-center justify-center">
      <div className="glass-card text-center space-y-4">
        <CheckCircle size={64} color="#22c55e" />
        <h2>Quiz Created Successfully!</h2>
        <p>You’ll be redirected to dashboard</p>
      </div>
    </div>
  );
};

export default QuizSuccess;
