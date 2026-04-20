import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/api';

const MapSidebar = ({ onLocationSelect }) => {
  const { t } = useTranslation();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/locations/states');
      setStates(response.data.data || []);
    } catch (error) {
      console.error('Error loading states:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = async (stateId) => {
    setSelectedState(stateId);
    setSelectedCity('');
    setSelectedVillage('');
    setCities([]);
    setVillages([]);

    if (!stateId) return;

    try {
      setLoading(true);
      const response = await api.get(`/locations/states/${stateId}/cities`);
      setCities(response.data.data || []);
    } catch (error) {
      console.error('Error loading cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = async (cityId) => {
    setSelectedCity(cityId);
    setSelectedVillage('');
    setVillages([]);

    if (!cityId) return;

    try {
      setLoading(true);
      const response = await api.get(`/locations/cities/${cityId}/villages`);
      setVillages(response.data.data || []);
    } catch (error) {
      console.error('Error loading villages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVillageChange = (villageId) => {
    setSelectedVillage(villageId);
    if (onLocationSelect) {
      onLocationSelect({
        stateId: selectedState,
        cityId: selectedCity,
        villageId: villageId,
      });
    }
  };

  return (
    <div style={styles.sidebar}>
      <h3 style={styles.title}>📍 {t('Select Location')}</h3>

      <div style={styles.selectGroup}>
        <label style={styles.label}>{t('State')}</label>
        <select
          value={selectedState}
          onChange={(e) => handleStateChange(e.target.value)}
          style={styles.select}
          disabled={loading}
        >
          <option value="">{t('Select State')}</option>
          {states.map(state => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      {selectedState && (
        <div style={styles.selectGroup}>
          <label style={styles.label}>{t('City')}</label>
          <select
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            style={styles.select}
            disabled={loading || cities.length === 0}
          >
            <option value="">{t('Select City')}</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedCity && (
        <div style={styles.selectGroup}>
          <label style={styles.label}>{t('Village')}</label>
          <select
            value={selectedVillage}
            onChange={(e) => handleVillageChange(e.target.value)}
            style={styles.select}
            disabled={loading || villages.length === 0}
          >
            <option value="">{t('Select Village')}</option>
            {villages.map(village => (
              <option key={village.id} value={village.id}>
                {village.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading && <p style={styles.loading}>{t('Loading...')}</p>}
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
  selectGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#374151',
  },
  select: {
    width: '100%',
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: 'white',
  },
  loading: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '13px',
  },
};

export default MapSidebar;
