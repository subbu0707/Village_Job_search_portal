import React, { useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useTranslation } from 'react-i18next';

const MapLocationPicker = ({ onLocationPick }) => {
  const { t } = useTranslation();
  const { latitude, longitude, error, loading } = useGeolocation();

  useEffect(() => {
    if (latitude && longitude && onLocationPick) {
      onLocationPick({ latitude, longitude });
    }
  }, [latitude, longitude]);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📍 {t('Current Location')}</h3>
      
      {loading && <p style={styles.status}>{t('Getting your location...')}</p>}
      
      {error && <p style={styles.error}>{t('Error')}: {error}</p>}
      
      {latitude && longitude && (
        <div style={styles.locationInfo}>
          <p style={styles.label}>{t('Latitude')}: {latitude.toFixed(6)}</p>
          <p style={styles.label}>{t('Longitude')}: {longitude.toFixed(6)}</p>
          <p style={styles.success}>✓ {t('Location detected')}</p>
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
    margin: '0 0 15px 0',
    fontSize: '16px',
  },
  status: {
    color: '#6b7280',
    margin: 0,
  },
  error: {
    color: '#EF4444',
    backgroundColor: '#FEE2E2',
    padding: '10px',
    borderRadius: '4px',
    margin: 0,
  },
  locationInfo: {
    backgroundColor: '#f9fafb',
    padding: '15px',
    borderRadius: '4px',
  },
  label: {
    margin: '5px 0',
    fontSize: '13px',
  },
  success: {
    color: '#10B981',
    fontWeight: 'bold',
    margin: '10px 0 0 0',
  },
};

export default MapLocationPicker;
