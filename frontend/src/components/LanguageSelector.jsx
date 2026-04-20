import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
    setIsOpen(false);
  };

  return (
    <div style={styles.container}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={styles.button}
        onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
        onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
      >
        <span style={styles.flag}>{currentLanguage.flag}</span>
        <span style={styles.langName}>{currentLanguage.name}</span>
        <span style={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div style={styles.dropdown}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              style={{
                ...styles.dropdownItem,
                backgroundColor: currentLanguage.code === lang.code ? '#f3f4f6' : 'white'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => {
                if (currentLanguage.code !== lang.code) {
                  e.target.style.backgroundColor = 'white';
                }
              }}
            >
              <span style={styles.flag}>{lang.flag}</span>
              <span style={styles.langName}>{lang.name}</span>
              {currentLanguage.code === lang.code && <span style={styles.checkmark}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: '#f3f4f6',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#e5e7eb',
    borderColor: '#667eea',
  },
  flag: {
    fontSize: '20px',
  },
  langName: {
    fontSize: '15px',
  },
  arrow: {
    fontSize: '10px',
    marginLeft: '4px',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: '0',
    marginTop: '8px',
    backgroundColor: 'white',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    minWidth: '180px',
    zIndex: 1000,
    overflow: 'hidden',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    color: '#374151',
    textAlign: 'left',
    transition: 'all 0.2s ease',
  },
  checkmark: {
    marginLeft: 'auto',
    color: '#667eea',
    fontWeight: 'bold',
    fontSize: '16px',
  }
};

export default LanguageSelector;
