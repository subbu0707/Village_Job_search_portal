import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/SupportContact.css';

const SupportContact = ({ inline = false }) => {
  const { t } = useTranslation();

  const contacts = [
    {
      icon: '📱',
      type: t('Phone Support'),
      value: '+91-1800-123-4567',
      link: 'tel:+911800123456',
      description: t('Available 24/7 for all your queries')
    },
    {
      icon: '💬',
      type: t('WhatsApp Support'),
      value: '+91-98765-43210',
      link: 'https://wa.me/919876543210',
      description: t('Chat with us on WhatsApp')
    },
    {
      icon: '📧',
      type: t('Email Support'),
      value: 'support@villagejobshub.com',
      link: 'mailto:support@villagejobshub.com',
      description: t('Write to us for detailed queries')
    },
    {
      icon: '🚨',
      type: t('Complaints Email'),
      value: 'complaints@villagejobshub.com',
      link: 'mailto:complaints@villagejobshub.com',
      description: t('Send your complaints and grievances')
    }
  ];

  if (inline) {
    return (
      <div className="support-contact-inline">
        <h4>📞 {t('Need Help?')}</h4>
        <div className="contact-grid">
          {contacts.map((contact, index) => (
            <a key={index} href={contact.link} className="contact-item" target="_blank" rel="noopener noreferrer">
              <span className="contact-icon">{contact.icon}</span>
              <span className="contact-value">{contact.value}</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="support-contact-section">
      <div className="support-header">
        <h2>📞 {t('Contact Support')}</h2>
        <p>{t('We are here to help you 24/7')}</p>
      </div>

      <div className="support-cards">
        {contacts.map((contact, index) => (
          <a key={index} href={contact.link} className="support-card" target="_blank" rel="noopener noreferrer">
            <div className="card-icon">{contact.icon}</div>
            <h3>{contact.type}</h3>
            <p className="contact-value">{contact.value}</p>
            <p className="contact-desc">{contact.description}</p>
            <span className="action-btn">{t('Contact Now')} →</span>
          </a>
        ))}
      </div>

      <div className="support-hours">
        <div className="hours-card">
          <span className="clock-icon">🕐</span>
          <div>
            <strong>{t('Working Hours')}</strong>
            <p>{t('Monday to Sunday: 24/7 Support')}</p>
          </div>
        </div>
        <div className="hours-card">
          <span className="clock-icon">⚡</span>
          <div>
            <strong>{t('Response Time')}</strong>
            <p>{t('We typically respond within 2-4 hours')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportContact;
