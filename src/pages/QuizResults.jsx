import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api';

const QuizResults = () => {
  const { id } = useParams();
  const [results, setResults] = useState([]);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    fetchResults();
    fetchQuiz();
  }, [id]);

  const fetchResults = async () => {
    try {
      const res = await api.get(`/results/quiz/${id}`);
      setResults(res.data);
    } catch (err) {
      console.error('Failed to fetch results:', err);
    }
  };

  const fetchQuiz = async () => {
    try {
      const res = await api.get(`/quiz/${id}`);
      setQuiz(res.data);
    } catch (err) {
      console.error('Failed to fetch quiz:', err);
    }
  };

  if (!quiz) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="min-h-screen py-6" style={{ background: 'linear-gradient(135deg, var(--black), var(--red-dark))' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="auth-title text-lg mb-4">
              Results for: {quiz.title}
            </h2>
            <p className="text-sm mb-6" style={{ color: '#6b7280' }}>{quiz.subject}</p>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result._id}>
                      <td>{result.student?.name}</td>
                      <td>{result.student?.email}</td>
                      <td className="score">{result.score}/{result.total}</td>
                      <td className="score">{((result.score / result.total) * 100).toFixed(1)}%</td>
                      <td className="date">
                        {new Date(result.submittedAt).toLocaleDateString()} {new Date(result.submittedAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {results.length === 0 && (
              <p className="text-center mt-6" style={{ color: '#6b7280' }}>No results submitted yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
