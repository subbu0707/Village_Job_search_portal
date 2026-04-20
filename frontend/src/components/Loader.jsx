import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Loader.css';

const Loader = ({ message = 'Loading...' }) => {
  const { t } = useTranslation();

  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>{t(message)}</p>
    </div>
  );
};

export default Loader;
