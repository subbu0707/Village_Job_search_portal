import React, { createContext } from 'react';
import i18n from '../i18n/config';

export const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };

  const currentLanguage = i18n.language;

  return (
    <I18nContext.Provider value={{ changeLanguage, currentLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

export default I18nContext;
