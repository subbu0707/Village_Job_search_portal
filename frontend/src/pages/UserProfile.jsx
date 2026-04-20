import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import api from '../api/api';

const UserProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    bio: '',
    skills: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadProfile();
  }, [user, navigate]);

  const loadProfile = async () => {
    try {
      const response = await api.get('/users/me');
      setProfileData(response.data.data || user);
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfileData(user);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.put('/users/me', {
        name: profileData.name,
        phone: profileData.phone,
        state: profileData.state,
        city: profileData.city,
        language: profileData.language,
        bio: profileData.bio,
        skills: profileData.skills
      });
      alert(t('Profile updated successfully!'));
      setProfileData(response.data.data);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(error.response?.data?.message || t('Failed to update profile'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={styles.container}>{t('Loading...')}</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>{t('My Profile')}</h1>
        <button onClick={logout} style={styles.logoutBtn}>
          🚪 {t('Logout')}
        </button>
      </header>

      <div style={styles.content}>
        <div style={styles.card}>
          <div style={styles.profileHeader}>
            <div style={styles.avatarCircle}>
              {profileData.name?.charAt(0)?.toUpperCase() || '👤'}
            </div>
            <h2 style={{ margin: '0 0 10px', color: '#1f2937', fontSize: '24px' }}>
              {profileData.name || t('User Profile')}
            </h2>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
              {profileData.role === 'seeker' ? '🎯 Job Seeker' : 
               profileData.role === 'employer' ? '🏢 Employer' : '👤 User'}
            </p>
          </div>

          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>👤 {t('Full Name')}</label>
              <input
                type="text"
                name="name"
                value={profileData.name || ''}
                onChange={handleChange}
                style={styles.input}
                placeholder={t('Enter your full name')}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>📧 {t('Email Address')}</label>
              <input
                type="email"
                name="email"
                value={profileData.email || ''}
                onChange={handleChange}
                disabled
                style={styles.disabledInput}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>📱 {t('Phone Number')}</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone || ''}
                onChange={handleChange}
                style={styles.input}
                placeholder={t('Enter phone number')}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>🎭 {t('Role')}</label>
              <input
                type="text"
                name="role"
                value={profileData.role || ''}
                disabled
                style={styles.disabledInput}
              />
            </div>
          </div>

          {profileData.role === 'seeker' && (
            <div style={{ marginTop: '30px' }}>
              <h3 style={{ marginBottom: '20px', color: '#374151', fontSize: '18px' }}>
                📝 {t('Additional Information')}
              </h3>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>💼 {t('About Me')}</label>
                  <textarea
                    name="bio"
                    value={profileData.bio || ''}
                    onChange={handleChange}
                    style={styles.textarea}
                    placeholder={t('Tell employers about yourself, your experience, and career goals...')}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>⚡ {t('Skills & Expertise')}</label>
                  <textarea
                    name="skills"
                    value={profileData.skills || ''}
                    onChange={handleChange}
                    style={styles.textarea}
                    placeholder={t('e.g., Communication, MS Office, Customer Service, etc.')}
                  />
                </div>
              </div>
            </div>
          )}

          <div style={styles.buttons}>
            <button 
              onClick={handleSave} 
              style={{
                ...styles.saveBtn,
                opacity: saving ? 0.7 : 1,
                cursor: saving ? 'not-allowed' : 'pointer'
              }} 
              disabled={saving}
            >
              {saving ? '⏳ ' + t('Saving...') : '💾 ' + t('Save Changes')}
            </button>
            <button onClick={() => navigate(-1)} style={styles.cancelBtn}>
              ← {t('Go Back')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '25px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '15px',
    marginBottom: '30px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    maxWidth: '900px',
    margin: '0 auto 30px',
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
  },
  logoutBtn: {
    backgroundColor: '#EF4444',
    color: 'white',
    border: 'none',
    padding: '12px 28px',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
  },
  content: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    backdropFilter: 'blur(10px)',
  },
  profileHeader: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  avatarCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    margin: '0 auto 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    color: 'white',
    fontWeight: 'bold',
    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px',
    marginBottom: '30px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  input: {
    padding: '14px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    backgroundColor: '#ffffff',
    outline: 'none',
  },
  disabledInput: {
    padding: '14px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '15px',
    backgroundColor: '#f9fafb',
    color: '#9ca3af',
    cursor: 'not-allowed',
  },
  textarea: {
    padding: '14px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '15px',
    minHeight: '120px',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    resize: 'vertical',
    backgroundColor: '#ffffff',
    outline: 'none',
  },
  buttons: {
    display: 'flex',
    gap: '15px',
    marginTop: '40px',
    justifyContent: 'center',
  },
  saveBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '16px 48px',
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
  },
  cancelBtn: {
    backgroundColor: 'white',
    color: '#667eea',
    border: '2px solid #667eea',
    padding: '16px 48px',
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'all 0.3s ease',
  },
};

export default UserProfile;
