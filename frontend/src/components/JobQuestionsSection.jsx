import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import '../styles/JobQuestionsSection.css';

const JobQuestionsSection = ({ jobId, isEmployer = false }) => {
  const { t } = useTranslation();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAskForm, setShowAskForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [answerText, setAnswerText] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [jobId]);

  const fetchQuestions = async () => {
    try {
      const response = await api.get(`/job-questions/job/${jobId}`);
      setQuestions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setSubmitting(true);
    try {
      await api.post('/job-questions', {
        jobId,
        question: newQuestion,
        isPublic: true
      });
      
      setNewQuestion('');
      setShowAskForm(false);
      fetchQuestions();
    } catch (error) {
      alert(error.response?.data?.message || t('Failed to submit question'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswerQuestion = async (questionId) => {
    const answer = answerText[questionId];
    if (!answer?.trim()) return;

    setSubmitting(true);
    try {
      await api.patch(`/job-questions/${questionId}/answer`, { answer });
      setAnswerText({ ...answerText, [questionId]: '' });
      fetchQuestions();
    } catch (error) {
      alert(error.response?.data?.message || t('Failed to submit answer'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="questions-loading">{t('Loading questions...')}</div>;
  }

  return (
    <div className="job-questions-section">
      <div className="questions-header">
        <h3>❓ {t('Questions & Answers')}</h3>
        {!isEmployer && (
          <button 
            className="btn-ask-question"
            onClick={() => setShowAskForm(!showAskForm)}
          >
            ➕ {t('Ask Question')}
          </button>
        )}
      </div>

      {showAskForm && (
        <form className="ask-question-form" onSubmit={handleAskQuestion}>
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder={t('Type your question here...')}
            rows={4}
            required
          />
          <div className="form-actions">
            <button type="button" onClick={() => setShowAskForm(false)}>
              {t('Cancel')}
            </button>
            <button type="submit" disabled={submitting}>
              {submitting ? t('Submitting...') : t('Submit Question')}
            </button>
          </div>
        </form>
      )}

      <div className="questions-list">
        {questions.length === 0 ? (
          <div className="no-questions">
            <p>💭 {t('No questions yet. Be the first to ask!')}</p>
          </div>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="question-card">
              <div className="question-header">
                <div className="asker-info">
                  <span className="asker-icon">👤</span>
                  <span className="asker-name">{q.seekerName}</span>
                  <span className="question-date">
                    {new Date(q.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="question-text">
                <strong>Q:</strong> {q.question}
              </div>

              {q.answer ? (
                <div className="answer-text">
                  <strong>A:</strong> {q.answer}
                  <span className="answered-date">
                    {t('Answered on')} {new Date(q.answeredAt).toLocaleDateString()}
                  </span>
                </div>
              ) : isEmployer ? (
                <div className="answer-form">
                  <textarea
                    value={answerText[q.id] || ''}
                    onChange={(e) => setAnswerText({ ...answerText, [q.id]: e.target.value })}
                    placeholder={t('Type your answer...')}
                    rows={3}
                  />
                  <button
                    onClick={() => handleAnswerQuestion(q.id)}
                    disabled={submitting || !answerText[q.id]?.trim()}
                  >
                    {submitting ? t('Submitting...') : t('Submit Answer')}
                  </button>
                </div>
              ) : (
                <div className="no-answer">
                  <em>{t('Waiting for employer to answer...')}</em>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobQuestionsSection;
