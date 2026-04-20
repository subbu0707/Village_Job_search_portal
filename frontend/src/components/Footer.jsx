import React from 'react';
import { useTranslation } from 'react-i18next';
import SupportContact from './SupportContact';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer style={styles.footer}>
      <div style={styles.content}>
        <div style={styles.section}>
          <h4>🌾 Village Jobs Hub</h4>
          <p>{t('Connecting rural employment opportunities')}</p>
        </div>
        <div style={styles.section}>
          <h4>{t('Quick Links')}</h4>
          <ul style={styles.list}>
            <li><a href="/" style={styles.link}>{t('Home')}</a></li>
            <li><a href="/jobs" style={styles.link}>{t('Browse Jobs')}</a></li>
            <li><a href="/about" style={styles.link}>{t('About Us')}</a></li>
            <li><a href="/contact" style={styles.link}>{t('Contact')}</a></li>
          </ul>
        </div>
        <div style={styles.section}>
          <h4>{t('Support')}</h4>
          <ul style={styles.list}>
            <li><a href="/faq" style={styles.link}>{t('FAQ')}</a></li>
            <li><a href="/help" style={styles.link}>{t('Help Center')}</a></li>
            <li><a href="/terms" style={styles.link}>{t('Terms')}</a></li>
            <li><a href="/privacy" style={styles.link}>{t('Privacy')}</a></li>
          </ul>
        </div>
      </div>
      
      {/* Support Contact Section */}
      <div style={styles.supportSection}>
        <SupportContact inline={true} />
      </div>

      <div style={styles.bottom}>
        <p>&copy; 2025 Village Jobs Hub. {t('All rights reserved')}.</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#2D3748',
    color: 'white',
    padding: '40px 20px 20px',
    marginTop: '60px',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    marginBottom: '30px',
  },
  section: {
    textAlign: 'left',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '10px 0 0 0',
  },
  link: {
    color: '#cbd5e0',
    textDecoration: 'none',
    fontSize: '14px',
    display: 'block',
    marginBottom: '8px',
  },
  supportSection: {
    maxWidth: '1200px',
    margin: '30px auto',
    padding: '20px',
    backgroundColor: '#374151',
    borderRadius: '12px',
  },
  bottom: {
    textAlign: 'center',
    borderTop: '1px solid #4a5568',
    paddingTop: '20px',
    color: '#a0aec0',
    fontSize: '14px',
  },
};

export default Footer;
