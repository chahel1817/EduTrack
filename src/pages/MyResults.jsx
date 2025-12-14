import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import Navbar from "../components/Navbar";

const MyResults = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get("/results/student");
        setResults(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        <h2>📊 My Test Results</h2>

        {results.length === 0 ? (
          <p>No quizzes attempted yet.</p>
        ) : (
          results.map((r) => (
            <div
              key={r._id}
              style={{
                padding: "1rem",
                marginBottom: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <h3>{r.quiz.title}</h3>
              <p>Subject: {r.quiz.subject}</p>
              <p>
                Score: {r.score}/{r.total} ({r.percentage}%)
              </p>

              <button
                className="btn btn-primary"
                onClick={() => navigate(`/my-results/${r.quiz._id}`)}
              >
                View Details
              </button>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default MyResults;
