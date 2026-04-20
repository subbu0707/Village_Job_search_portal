import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/TermsModal.css';

const TermsModal = ({ isOpen, onClose, onAccept }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="terms-modal-overlay" onClick={onClose}>
      <div className="terms-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="terms-modal-header">
          <h2>{t('Terms and Conditions')}</h2>
          <button className="terms-close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="terms-modal-body">
          <section>
            <h3>{t('1. Acceptance of Terms')}</h3>
            <p>{t('By accessing and using Village Jobs Hub, you accept and agree to be bound by the terms and provision of this agreement.')}</p>
          </section>

          <section>
            <h3>{t('2. Use of Service')}</h3>
            <p>{t('This platform connects job seekers with employers for daily wage jobs. You agree to use the service only for lawful purposes and in accordance with these terms.')}</p>
          </section>

          <section>
            <h3>{t('3. User Accounts')}</h3>
            <p>{t('You are responsible for maintaining the confidentiality of your account credentials. You agree to accept responsibility for all activities that occur under your account.')}</p>
          </section>

          <section>
            <h3>{t('4. Job Postings and Applications')}</h3>
            <p>{t('Employers must provide accurate job information. Job seekers must provide truthful information in their profiles and applications. False or misleading information may result in account termination.')}</p>
          </section>

          <section>
            <h3>{t('5. Payment and Fees')}</h3>
            <p>{t('Our platform is currently free to use. We reserve the right to introduce fees with prior notice. Direct payment arrangements between employers and job seekers are their own responsibility.')}</p>
          </section>

          <section>
            <h3>{t('6. Privacy and Data Protection')}</h3>
            <p>{t('We collect and process your personal data in accordance with our Privacy Policy. By using this service, you consent to such processing and warrant that all data provided is accurate.')}</p>
          </section>

          <section>
            <h3>{t('7. User Conduct')}</h3>
            <p>{t('You agree not to: (a) post false or misleading information, (b) harass or abuse other users, (c) violate any laws or regulations, (d) attempt to gain unauthorized access to the platform.')}</p>
          </section>

          <section>
            <h3>{t('8. Content Ownership')}</h3>
            <p>{t('You retain ownership of content you post. By posting content, you grant us a license to use, display, and distribute that content on our platform.')}</p>
          </section>

          <section>
            <h3>{t('9. Limitation of Liability')}</h3>
            <p>{t('Village Jobs Hub is not liable for any disputes, damages, or losses arising from interactions between users. We are a platform facilitating connections only.')}</p>
          </section>

          <section>
            <h3>{t('10. Termination')}</h3>
            <p>{t('We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activities.')}</p>
          </section>

          <section>
            <h3>{t('11. Changes to Terms')}</h3>
            <p>{t('We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.')}</p>
          </section>

          <section>
            <h3>{t('12. Contact Information')}</h3>
            <p>{t('For questions about these terms, please contact us through our support channels.')}</p>
          </section>

          <div className="terms-important-note">
            <h4>⚠️ {t('Important Notice')}</h4>
            <p>{t('By clicking "I Accept", you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.')}</p>
          </div>
        </div>

        <div className="terms-modal-footer">
          <button className="terms-decline-btn" onClick={onClose}>
            {t('Decline')}
          </button>
          <button className="terms-accept-btn" onClick={onAccept}>
            {t('I Accept Terms & Conditions')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
