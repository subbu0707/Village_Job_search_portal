import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.logo} onClick={() => navigate('/')}>
          <h1 style={styles.logoText}>🌾 Village Jobs Hub</h1>
        </div>

        <nav style={styles.nav}>
          {user ? (
            <>
              <span style={styles.userName}>👤 {user.name}</span>
              <button
                onClick={() => navigate('/profile')}
                style={styles.navBtn}
              >
                {t('Profile')}
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                style={{ ...styles.navBtn, backgroundColor: '#EF4444' }}
              >
                {t('Logout')}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                style={styles.navBtn}
              >
                {t('Login')}
              </button>
              <button
                onClick={() => navigate('/register')}
                style={{ ...styles.navBtn, backgroundColor: '#F59E0B' }}
              >
                {t('Register')}
              </button>
            </>
          )}
          <LanguageSelector />
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#4F46E5',
    color: 'white',
    padding: '15px 20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    cursor: 'pointer',
  },
  logoText: {
    margin: 0,
    fontSize: '24px',
  },
  nav: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  userName: {
    fontSize: '14px',
    fontWeight: 'bold',
  },
  navBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
};

export default Header;
