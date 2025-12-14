import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import Navbar from "../components/Navbar";

const StudentResults = () => {
  const { id } = useParams(); // quizId
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get("/results/student");
        const results = res.data || [];

        const found = results.find(
          (r) => r.quiz?._id?.toString() === id
        );

        if (!found) return;

        setResult(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  if (!result)
    return (
      <>
        <Navbar />
        <h2 style={{ textAlign: "center" }}>
          ❌ Result not found
        </h2>
      </>
    );

  const { quiz } = result;

  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        <h2>📊 {quiz.title}</h2>
        <p>Subject: {quiz.subject}</p>

        <p>
          Score: <strong>{result.score}/{result.total}</strong>
        </p>
        <p>
          Percentage: <strong>{result.percentage}%</strong>
        </p>
        <p>
          Time Spent: <strong>{result.timeSpent} min</strong>
        </p>

        <hr />

        <h3>📝 Question Review</h3>

        {quiz.questions.map((q, index) => {
          const ans = result.answers.find(
            (a) => a.questionIndex === index
          );

          return (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <p><strong>{index + 1}. {q.question}</strong></p>
              {q.options.map((opt, i) => (
                <p
                  key={i}
                  style={{
                    color:
                      i === q.correctAnswer
                        ? "green"
                        : ans?.selectedAnswer === i
                        ? "red"
                        : "black",
                  }}
                >
                  {opt}
                </p>
              ))}
            </div>
          );
        })}

        <button onClick={() => navigate("/my-results")}>
          Back to My Results
        </button>
      </main>
    </div>
  );
};

export default StudentResults;
