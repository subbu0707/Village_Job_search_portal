import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const OTPLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    navigate('/seeker-dashboard');
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>{t('OTP Login')}</h1>
        <p style={styles.message}>{t('Feature coming soon')}</p>
        <button onClick={() => navigate('/login')} style={styles.btn}>
          {t('Go to Regular Login')}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '40px',
    textAlign: 'center',
  },
  message: {
    color: '#6b7280',
    marginBottom: '20px',
  },
  btn: {
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default OTPLogin;
