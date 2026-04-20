import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import api from '../api/api';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadStats();
  }, [user, navigate]);

  const loadStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data.data || stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.container}>{t('Loading...')}</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>{t('Admin Dashboard')}</h1>
        <button onClick={logout} style={styles.logoutBtn}>
          {t('Logout')}
        </button>
      </header>

      <div style={styles.content}>
        <h2>{t('Platform Statistics')}</h2>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3>{t('Total Users')}</h3>
            <p style={styles.number}>{stats.totalUsers}</p>
          </div>
          <div style={styles.statCard}>
            <h3>{t('Total Jobs')}</h3>
            <p style={styles.number}>{stats.totalJobs}</p>
          </div>
          <div style={styles.statCard}>
            <h3>{t('Total Applications')}</h3>
            <p style={styles.number}>{stats.totalApplications}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4F46E5',
    color: 'white',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutBtn: {
    backgroundColor: '#EF4444',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '30px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  number: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#4F46E5',
    margin: '10px 0',
  },
};

export default AdminDashboard;
