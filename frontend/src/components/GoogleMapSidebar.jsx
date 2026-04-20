import React from 'react';
import { useTranslation } from 'react-i18next';

const GoogleMapSidebar = ({ onLocationSelect }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && onLocationSelect) {
      onLocationSelect({
        query: searchQuery,
        type: 'search'
      });
    }
  };

  return (
    <div style={styles.sidebar}>
      <h3 style={styles.title}>🗺️ {t('Location Search')}</h3>
      
      <form onSubmit={handleSearch} style={styles.form}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('Search village, city, or state')}
          style={styles.input}
        />
        <button type="submit" style={styles.searchBtn}>
          {t('Search')}
        </button>
      </form>

      <div style={styles.infoBox}>
        <h4>{t('About This Map')}</h4>
        <p style={styles.infoText}>
          {t('Use this map to explore job opportunities in your area. Search for a specific location to see available positions.')}
        </p>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  title: {
    margin: '0 0 20px 0',
    fontSize: '18px',
    color: '#1f2937',
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  searchBtn: {
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#f9fafb',
    padding: '15px',
    borderRadius: '4px',
    borderLeft: '4px solid #4F46E5',
  },
  infoText: {
    margin: '10px 0 0 0',
    fontSize: '13px',
    color: '#6b7280',
    lineHeight: '1.5',
  },
};

export default GoogleMapSidebar;
