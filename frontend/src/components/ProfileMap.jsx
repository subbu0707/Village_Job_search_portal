import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ProfileMap = ({ userLocation }) => {
  const { t } = useTranslation();
  const [mapUrl, setMapUrl] = useState('');

  useEffect(() => {
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      const url = `https://www.openstreetmap.org/export/embed.html?bbox=${userLocation.longitude - 0.01},${userLocation.latitude - 0.01},${userLocation.longitude + 0.01},${userLocation.latitude + 0.01}&layer=mapnik`;
      setMapUrl(url);
    }
  }, [userLocation]);

  if (!mapUrl) {
    return (
      <div style={styles.container}>
        <h3>📍 {t('Location')}</h3>
        <p style={styles.message}>{t('Location not set')}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3>📍 {t('Location')}</h3>
      <iframe
        src={mapUrl}
        style={styles.map}
        frameBorder="0"
        title="User Location Map"
      ></iframe>
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
  map: {
    width: '100%',
    height: '300px',
    borderRadius: '4px',
    border: '1px solid #e5e7eb',
  },
  message: {
    color: '#9ca3af',
    textAlign: 'center',
    padding: '40px 20px',
  },
};

export default ProfileMap;
