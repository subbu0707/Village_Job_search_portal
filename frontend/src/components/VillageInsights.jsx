import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';

const VillageInsights = ({ villageId, cityId, stateId }) => {
  const { t } = useTranslation();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (villageId || cityId || stateId) {
      loadInsights();
    }
  }, [villageId, cityId, stateId]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      // Fetch jobs for this location
      const params = [];
      if (stateId) params.push(`state=${stateId}`);
      if (cityId) params.push(`city=${cityId}`);

      const response = await api.get(`/jobs/search?${params.join('&')}`);
      const jobs = response.data.data || [];

      // Calculate insights
      const jobsCount = jobs.length;
      const avgSalary = jobs.length > 0
        ? Math.round(
            jobs.reduce((sum, j) => sum + (j.salary_min || 0), 0) / jobs.length
          )
        : 0;

      const categories = {};
      jobs.forEach(job => {
        categories[job.category] = (categories[job.category] || 0) + 1;
      });

      setInsights({
        jobsCount,
        avgSalary,
        topCategories: Object.entries(categories)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([cat, count]) => ({ category: cat, count })),
      });
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.container}>{t('Loading...')}</div>;
  }

  if (!insights) {
    return <div style={styles.container}>{t('No data available')}</div>;
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📊 {t('Location Insights')}</h3>
      
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h4>{t('Total Jobs')}</h4>
          <p style={styles.number}>{insights.jobsCount}</p>
        </div>
        
        <div style={styles.statCard}>
          <h4>{t('Avg. Salary')}</h4>
          <p style={styles.number}>₹{insights.avgSalary}</p>
        </div>
      </div>

      {insights.topCategories.length > 0 && (
        <div style={styles.categoriesCard}>
          <h4>{t('Top Categories')}</h4>
          <ul style={styles.categoryList}>
            {insights.topCategories.map((cat, idx) => (
              <li key={idx} style={styles.categoryItem}>
                <span>{cat.category}</span>
                <span style={styles.count}>{cat.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  title: {
    margin: '0 0 20px 0',
    fontSize: '18px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginBottom: '20px',
  },
  statCard: {
    backgroundColor: '#f9fafb',
    padding: '15px',
    borderRadius: '6px',
    textAlign: 'center',
  },
  number: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#4F46E5',
    margin: '10px 0 0 0',
  },
  categoriesCard: {
    backgroundColor: '#f9fafb',
    padding: '15px',
    borderRadius: '6px',
  },
  categoryList: {
    listStyle: 'none',
    padding: 0,
    margin: '10px 0 0 0',
  },
  categoryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '14px',
  },
  count: {
    backgroundColor: '#4F46E5',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
  },
};

export default VillageInsights;
