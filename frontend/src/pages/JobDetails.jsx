import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import ComplaintModal from '../components/ComplaintModal';
import JobQuestionsSection from '../components/JobQuestionsSection';

const JobDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  useEffect(() => {
    loadJobDetails();
  }, [id]);

  const loadJobDetails = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data.data);
      
      // Check if user has already applied
      if (user && user.role === 'seeker') {
        try {
          const appsResponse = await api.get('/applications/my');
          const hasApplied = appsResponse.data.data?.some(app => app.jobId == id);
          setApplied(hasApplied);
        } catch {
          setApplied(false);
        }
      }
    } catch (error) {
      console.error('Error loading job:', error);
      alert('Error loading job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await api.post('/applications', { jobId: parseInt(id) });
      alert(t('Application submitted successfully!'));
      setApplied(true);
    } catch (error) {
      console.error('Error applying:', error);
      alert(error.response?.data?.message || t('Failed to apply. Please try again.'));
    }
  };

  if (loading) return <div style={styles.container}>{t('Loading...')}</div>;
  if (!job) return <div style={styles.container}>{t('Job not found')}</div>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        ← {t('Back to Jobs')}
      </button>

      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>{job.title}</h1>
          {job.womenOnly && (
            <span style={styles.womenBadge}>👩 {t('Women Only')}</span>
          )}
        </div>
        
        <div style={styles.details}>
          <div style={styles.detailRow}>
            <strong>{t('Company')}:</strong>
            <span>{job.employerName || 'Not specified'}</span>
          </div>

          <div style={styles.detailRow}>
            <strong>{t('Category')}:</strong>
            <span>{job.category || 'General'}</span>
          </div>
          
          <div style={styles.detailRow}>
            <strong>{t('Job Type')}:</strong>
            <span>{job.jobType || 'Full Time'}</span>
          </div>
          
          <div style={styles.detailRow}>
            <strong>{t('Salary Range')}:</strong>
            <span>
              {job.salary_min && job.salary_max 
                ? `₹${job.salary_min.toLocaleString()} - ₹${job.salary_max.toLocaleString()}` 
                : 'Negotiable'}
            </span>
          </div>

          <div style={styles.detailRow}>
            <strong>{t('Location')}:</strong>
            <span>
              {[job.village, job.city, job.state].filter(Boolean).join(', ') || 'Not specified'}
            </span>
          </div>

          <div style={styles.detailRow}>
            <strong>{t('Posted Date')}:</strong>
            <span>{new Date(job.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div style={styles.section}>
          <h2>{t('Job Description')}</h2>
          <p style={styles.description}>{job.description || 'No description provided'}</p>
        </div>

        {job.requirements && (
          <div style={styles.section}>
            <h2>{t('Requirements')}</h2>
            <p style={styles.description}>{job.requirements}</p>
          </div>
        )}

        {job.womenOnly && (
          <div style={styles.womenOnly}>
            👩 {t('This position is specifically reserved for women candidates')}
          </div>
        )}

        <div style={styles.actions}>
          {user?.role === 'seeker' ? (
            applied ? (
              <div style={styles.appliedMsg}>
                ✅ {t('You have already applied for this job')}
              </div>
            ) : (
              <button onClick={handleApply} style={styles.applyBtn}>
                📝 {t('Apply Now')}
              </button>
            )
          ) : (
            <div style={styles.loginMsg}>
              {t('Please')}{' '}
              <span onClick={() => navigate('/login')} style={styles.loginLink}>
                {t('login')}
              </span>{' '}
              {t('as a job seeker to apply')}
            </div>
          )}
        </div>

        {/* Additional Actions */}
        {user && (
          <div style={styles.additionalActions}>
            <button onClick={() => setShowComplaintModal(true)} style={styles.reportBtn}>
              🚨 {t('Report Job')}
            </button>
            {user.role === 'seeker' && job.contact_email && (
              <button 
                onClick={() => window.location.href = `mailto:${job.contact_email}`}
                style={styles.contactBtn}
              >
                💬 {t('Contact Employer')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Job Questions Section */}
      {user && (
        <div style={styles.card}>
          <JobQuestionsSection 
            jobId={job.id} 
            isEmployer={user.role === 'employer' && job.employerId === user.id}
          />
        </div>
      )}

      {/* Complaint Modal */}
      <ComplaintModal
        isOpen={showComplaintModal}
        onClose={() => setShowComplaintModal(false)}
        jobId={job.id}
        jobTitle={job.title}
      />
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  backBtn: {
    backgroundColor: '#6B7280',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.3s',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '900px',
    margin: '0 auto',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1F2937',
    margin: 0,
  },
  womenBadge: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
  },
  details: {
    backgroundColor: '#F9FAFB',
    padding: '25px',
    borderRadius: '10px',
    marginBottom: '30px',
    border: '1px solid #E5E7EB',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    fontSize: '16px',
    padding: '8px 0',
  },
  section: {
    marginBottom: '30px',
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#4B5563',
    whiteSpace: 'pre-wrap',
  },
  womenOnly: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    padding: '15px 20px',
    borderRadius: '8px',
    marginBottom: '25px',
    fontSize: '15px',
    fontWeight: '500',
  },
  actions: {
    display: 'flex',
    gap: '15px',
    marginTop: '30px',
  },
  applyBtn: {
    backgroundColor: '#10B981',
    color: 'white',
    border: 'none',
    padding: '16px 48px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)',
  },
  appliedMsg: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
    padding: '16px 24px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  loginMsg: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    padding: '16px 24px',
    borderRadius: '8px',
    fontSize: '16px',
  },
  loginLink: {
    color: '#4F46E5',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  additionalActions: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px',
    flexWrap: 'wrap',
  },
  reportBtn: {
    backgroundColor: '#EF4444',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.3s',
  },
  contactBtn: {
    backgroundColor: '#3B82F6',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.3s',
  },
};

export default JobDetails;
