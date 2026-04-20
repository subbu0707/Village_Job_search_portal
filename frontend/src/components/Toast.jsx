import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Toast.css';

const Toast = ({ message, type = 'info', duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div className={`toast ${type}`}>
      <span>{t(message)}</span>
      <button onClick={() => setIsVisible(false)}>×</button>
    </div>
  );
};

export default Toast;
