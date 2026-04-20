import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LocationSelector = ({ 
  states = [], 
  cities = [], 
  villages = [],
  onStateChange,
  onCityChange,
  onVillageChange,
  selectedState,
  selectedCity,
  selectedVillage
}) => {
  const { t } = useTranslation();

  return (
    <div style={styles.container}>
      <div style={styles.selectGroup}>
        <label style={styles.label}>{t('State')}</label>
        <select
          value={selectedState || ''}
          onChange={(e) => onStateChange(e.target.value)}
          style={styles.select}
        >
          <option value="">{t('Select State')}</option>
          {states.map(state => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.selectGroup}>
        <label style={styles.label}>{t('City')}</label>
        <select
          value={selectedCity || ''}
          onChange={(e) => onCityChange(e.target.value)}
          style={styles.select}
          disabled={!selectedState}
        >
          <option value="">{t('Select City')}</option>
          {cities.map(city => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.selectGroup}>
        <label style={styles.label}>{t('Village')}</label>
        <select
          value={selectedVillage || ''}
          onChange={(e) => onVillageChange(e.target.value)}
          style={styles.select}
          disabled={!selectedCity}
        >
          <option value="">{t('Select Village')}</option>
          {villages.map(village => (
            <option key={village.id} value={village.id}>
              {village.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  selectGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#374151',
  },
  select: {
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
};

export default LocationSelector;
