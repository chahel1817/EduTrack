import { useState } from 'react';
import { api } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const CreateQuiz = () => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Quiz title is required');
      return false;
    }
    if (!formData.subject.trim()) {
      setError('Subject is required');
      return false;
    }
    if (formData.questions.length === 0) {
      setError('At least one question is required');
      return false;
    }
    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.question.trim()) {
        setError(`Question ${i + 1} text is required`);
        return false;
      }
      const validOptions = q.options.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        setError(`Question ${i + 1} must have at least 2 options`);
        return false;
      }
      if (q.correctAnswer >= validOptions.length) {
        setError(`Please select a valid correct answer for question ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Filter out empty options and adjust correctAnswer indices
      const processedQuestions = formData.questions.map(q => {
        const validOptions = q.options.filter(opt => opt.trim() !== '');
        const correctAnswerIndex = q.correctAnswer;
        // Find the new index of the correct answer in the filtered options
        const newCorrectAnswer = validOptions.findIndex((opt, idx) => idx === correctAnswerIndex);
        return {
          ...q,
          options: validOptions,
          correctAnswer: newCorrectAnswer
        };
      });

      const processedFormData = {
        ...formData,
        questions: processedQuestions
      };

      await api.post('/quiz', processedFormData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    if (field === 'options') {
      newQuestions[index][field][value.index] = value.value;
    } else {
      newQuestions[index][field] = value;
    }
    setFormData({ ...formData, questions: newQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, var(--black), var(--red-dark))' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="card">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="auth-title mb-4">Create New Quiz</h2>
            {error && <div className="auth-error mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2" style={{ color: 'var(--black)' }}>
                    Quiz Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="auth-input"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter quiz title"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2" style={{ color: 'var(--black)' }}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    required
                    className="auth-input"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g., Mathematics, Science"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2" style={{ color: 'var(--black)' }}>
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  id="description"
                  className="auth-input"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the quiz content"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 className="text-lg font-medium" style={{ color: 'var(--black)' }}>Questions ({formData.questions.length})</h3>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="btn btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    ➕ Add Question
                  </button>
                </div>
                
                {formData.questions.map((question, index) => (
                  <div key={index} className="card mb-6" style={{ border: '2px solid var(--border-gray)', position: 'relative' }}>
                    <div className="flex justify-between items-center mb-4">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          background: 'linear-gradient(135deg, var(--red), var(--blue))', 
                          color: 'white', 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontWeight: '600',
                          fontSize: '14px'
                        }}>
                          {index + 1}
                        </div>
                        <h4 className="text-md font-medium" style={{ color: 'var(--black)' }}>Question {index + 1}</h4>
                      </div>
                      {formData.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(index)}
                          className="btn btn-primary"
                          style={{ padding: '8px 12px', fontSize: '12px', background: 'var(--red)' }}
                        >
                          🗑️ Remove
                        </button>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--black)' }}>
                        Question Text *
                      </label>
                      <textarea
                        required
                        className="auth-input"
                        rows="3"
                        value={question.question}
                        onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                        placeholder="Enter your question here..."
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--black)' }}>
                        Answer Options *
                      </label>
                      <div style={{ display: 'grid', gap: '12px' }}>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-3" style={{ 
                            padding: '12px', 
                            border: '2px solid var(--border-gray)', 
                            borderRadius: '10px',
                            background: question.correctAnswer === optionIndex ? 'rgba(5, 150, 105, 0.05)' : 'var(--gray-light)',
                            borderColor: question.correctAnswer === optionIndex ? 'var(--green)' : 'var(--border-gray)'
                          }}>
                            <input
                              type="radio"
                              name={`correct-${index}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() => handleQuestionChange(index, 'correctAnswer', optionIndex)}
                              style={{ accentColor: 'var(--red)', transform: 'scale(1.2)' }}
                            />
                            <span style={{ 
                              fontWeight: '600', 
                              color: question.correctAnswer === optionIndex ? 'var(--green)' : 'var(--black)',
                              minWidth: '60px'
                            }}>
                              Option {optionIndex + 1}:
                            </span>
                            <input
                              type="text"
                              required
                              placeholder={`Enter option ${optionIndex + 1}...`}
                              className="auth-input flex-1"
                              style={{ margin: 0, background: 'transparent', border: 'none' }}
                              value={option}
                              onChange={(e) => handleQuestionChange(index, 'options', { index: optionIndex, value: e.target.value })}
                            />
                            {question.correctAnswer === optionIndex && (
                              <span style={{ color: 'var(--green)', fontWeight: '600', fontSize: '14px' }}>
                                ✓ Correct Answer
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px solid var(--border-gray)' }}>
                <div style={{ fontSize: '14px', color: '#64748b' }}>
                  <strong>{formData.questions.length}</strong> questions • <strong>{formData.questions.reduce((total, q) => total + q.options.filter(opt => opt.trim()).length, 0)}</strong> total options
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="btn btn-outline"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    {loading ? (
                      <>
                        <div style={{ 
                          width: '16px', 
                          height: '16px', 
                          border: '2px solid transparent', 
                          borderTop: '2px solid white', 
                          borderRadius: '50%', 
                          animation: 'spin 1s linear infinite' 
                        }}></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        📝 Create Quiz
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
