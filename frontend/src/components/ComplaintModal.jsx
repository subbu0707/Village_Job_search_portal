import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import '../styles/ComplaintModal.css';

const ComplaintModal = ({ isOpen, onClose, jobId = null, jobTitle = null }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    complaintType: 'job_issue',
    subject: '',
    description: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const complaintTypes = [
    { value: 'job_issue', label: t('Job Issue') },
    { value: 'user_behavior', label: t('User Behavior') },
    { value: 'payment_dispute', label: t('Payment Dispute') },
    { value: 'fraud', label: t('Fraud/Scam') },
    { value: 'technical', label: t('Technical Issue') },
    { value: 'other', label: t('Other') }
  ];

  const priorities = [
    { value: 'low', label: t('Low') },
    { value: 'medium', label: t('Medium') },
    { value: 'high', label: t('High') },
    { value: 'urgent', label: t('Urgent') }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.description.trim()) {
      setError(t('Please fill in all required fields'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/complaints', {
        ...formData,
        jobId: jobId
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          complaintType: 'job_issue',
          subject: '',
          description: '',
          priority: 'medium'
        });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || t('Failed to submit complaint'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="complaint-modal-overlay" onClick={onClose}>
        <div className="complaint-modal-content success-message" onClick={(e) => e.stopPropagation()}>
          <div className="success-icon">✅</div>
          <h2>{t('Complaint Submitted Successfully')}</h2>
          <p>{t('We will review your complaint and respond soon.')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="complaint-modal-overlay" onClick={onClose}>
      <div className="complaint-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="complaint-modal-header">
          <h2>🚨 {t('File a Complaint')}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {jobTitle && (
          <div className="job-context">
            <strong>{t('Regarding Job')}:</strong> {jobTitle}
          </div>
        )}

        <form onSubmit={handleSubmit} className="complaint-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>{t('Complaint Type')} *</label>
            <select
              name="complaintType"
              value={formData.complaintType}
              onChange={handleChange}
              required
            >
              {complaintTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{t('Priority')} *</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
            >
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{t('Subject')} *</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder={t('Brief description of the issue')}
              required
              maxLength={255}
            />
          </div>

          <div className="form-group">
            <label>{t('Description')} *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t('Please provide detailed information about your complaint')}
              required
              rows={6}
            />
            <small>{formData.description.length} {t('characters')}</small>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              {t('Cancel')}
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? t('Submitting...') : t('Submit Complaint')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintModal;
