import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';
import '../styles/RoleSelection.css';

const RoleSelection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleContinue = () => {
    if (selectedRole) {
      navigate('/register', { state: { role: selectedRole } });
    }
  };

  return (
    <div className="role-container">
      {/* Floating decorative elements */}
      <div className="role-circle role-circle-1"></div>
      <div className="role-circle role-circle-2"></div>
      <div className="role-circle role-circle-3"></div>

      {/* Language Selector at top */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}>
        <LanguageSelector />
      </div>

      <div className="role-card">
        <div className="role-header">
          <h1 className="role-title">Choose Your Path</h1>
          <p className="role-subtitle">Select how you want to use Village Jobs Hub</p>
        </div>

        <div className="roles-grid">
          {/* Job Seeker Card */}
          <div
            className={`role-option ${selectedRole === 'seeker' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('seeker')}
          >
            <div className="role-icon seeker-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="role-name">Job Seeker</h3>
            <p className="role-description">I am looking for job opportunities</p>
            <ul className="role-features">
              <li>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Browse available jobs
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Filter by location
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Apply for jobs
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Chat with employers
              </li>
            </ul>
            <div className="role-badge">Select</div>
          </div>

          {/* Employer Card */}
          <div
            className={`role-option ${selectedRole === 'employer' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('employer')}
          >
            <div className="role-icon employer-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="2" y="7" width="20" height="14" rx="2" strokeWidth="2"/>
                <path d="M16 7V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="role-name">Employer</h3>
            <p className="role-description">I want to post job openings</p>
            <ul className="role-features">
              <li>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Post job listings
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Receive applications
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Manage applicants
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Chat with candidates
              </li>
            </ul>
            <div className="role-badge">Select</div>
          </div>
        </div>

        <div className="role-buttons">
          <button
            onClick={handleContinue}
            className={`continue-btn ${!selectedRole ? 'disabled' : ''}`}
            disabled={!selectedRole}
          >
            Continue
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
          <button onClick={() => navigate('/login')} className="back-btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
