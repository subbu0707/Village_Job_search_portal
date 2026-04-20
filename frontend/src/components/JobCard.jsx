import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const JobCard = ({ job, onApply, onChat, showChat = true }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const salaryRange = () => {
    if (job.salary_min && job.salary_max) {
      return `₹${job.salary_min} - ₹${job.salary_max}`;
    } else if (job.salary_min) {
      return `₹${job.salary_min}+`;
    } else if (job.salary_max) {
      return `Up to ₹${job.salary_max}`;
    }
    return 'Salary not specified';
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>{job.title}</h3>
        {job.womensOnly && <span style={styles.badge}>👩 Women Only</span>}
      </div>

      <p style={styles.company}>{job.employer_name || 'Employer'}</p>

      <div style={styles.details}>
        <div style={styles.detailItem}>
          <span style={styles.label}>{t('Location')}:</span>
          <span>{job.location_state}, {job.location_city}</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.label}>{t('Salary')}:</span>
          <span>{salaryRange()}</span>
        </div>
        {job.category && (
          <div style={styles.detailItem}>
            <span style={styles.label}>{t('Category')}:</span>
            <span>{job.category}</span>
          </div>
        )}
      </div>

      <p style={styles.description}>
        {job.description.substring(0, 150)}...
      </p>

      <div style={styles.buttons}>
        <button
          onClick={() => navigate(`/job/${job.id}`)}
          style={styles.viewBtn}
        >
          {t('View Details')}
        </button>
        {onApply && (
          <button
            onClick={() => onApply(job.id)}
            style={styles.applyBtn}
          >
            ✅ {t('Apply')}
          </button>
        )}
        {onChat && showChat && (
          <button
            onClick={() => onChat(job)}
            style={styles.chatBtn}
          >
            💬 {t('Chat')}
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '15px',
    transition: 'box-shadow 0.3s',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '10px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
  },
  company: {
    margin: '5px 0 15px 0',
    color: '#6b7280',
    fontSize: '14px',
  },
  details: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '10px',
    marginBottom: '15px',
    fontSize: '13px',
  },
  detailItem: {
    display: 'flex',
    gap: '5px',
  },
  label: {
    fontWeight: 'bold',
    color: '#4b5563',
  },
  description: {
    margin: '15px 0',
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.5',
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  viewBtn: {
    flex: 1,
    minWidth: '100px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    padding: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  applyBtn: {
    flex: 1,
    minWidth: '100px',
    backgroundColor: '#10B981',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  chatBtn: {
    flex: 1,
    minWidth: '100px',
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default JobCard;
