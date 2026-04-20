import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';
import '../styles/Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="landing">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="logo">
            <span className="logo-icon">🏢</span>
            <span className="logo-text">Village Jobs Hub</span>
          </div>
          <div className="nav-buttons">
            <LanguageSelector />
            <button 
              className="btn-nav-login"
              onClick={() => navigate('/login')}
            >
              {t('Login')}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            {t('Find Daily Wage Jobs Near You')}
          </h1>
          <p className="hero-subtitle">
            {t('Connect with employers and secure employment opportunities in your state, city, and village')}
          </p>
          
          <div className="hero-cta">
            <button 
              className="btn-primary-large"
              onClick={() => navigate('/role-selection')}
            >
              {t('Get Started')}
              <span className="btn-icon">→</span>
            </button>
            <button 
              className="btn-secondary-large"
              onClick={() => navigate('/login')}
            >
              {t('Already have an account? Login')}
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">233+</span>
              <span className="stat-label">{t('Active Jobs')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">{t('Cities')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">11</span>
              <span className="stat-label">{t('Indian States')}</span>
            </div>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="hero-illustration">
            <div className="circle-1"></div>
            <div className="circle-2"></div>
            <div className="circle-3"></div>
            <span className="hero-emoji">👔</span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>{t('How It Works')}</h2>
          <p>{t('Three simple steps to find your dream job')}</p>
        </div>

        <div className="steps-container">
          {/* Step 1 */}
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-icon">📝</div>
            <h3>{t('Create Account')}</h3>
            <p>{t('Sign up as a job seeker or employer in just 2 minutes with your basic information')}</p>
            <div className="step-features">
              <span className="feature-tag">{t('Email')}</span>
              <span className="feature-tag">{t('Phone')}</span>
              <span className="feature-tag">{t('Password')}</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-icon">🔍</div>
            <h3>{t('Browse Jobs')}</h3>
            <p>{t('Explore job opportunities filtered by location, salary, and job type that match your skills')}</p>
            <div className="step-features">
              <span className="feature-tag">{t('Filter by State')}</span>
              <span className="feature-tag">{t('Filter by City')}</span>
              <span className="feature-tag">{t('Filter by Salary')}</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-icon">✅</div>
            <h3>{t('Apply & Connect')}</h3>
            <p>{t('Apply for jobs and chat directly with employers to discuss opportunities')}</p>
            <div className="step-features">
              <span className="feature-tag">Apply Now</span>
              <span className="feature-tag">Direct Chat</span>
              <span className="feature-tag">Track Status</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2>Why Choose Village Jobs Hub?</h2>
          <p>Everything you need to find the perfect job</p>
        </div>

        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-box">
            <div className="feature-icon-large">📍</div>
            <h3>Location Based</h3>
            <p>Find jobs in your state, city, and village with precise location filtering</p>
          </div>

          {/* Feature 2 */}
          <div className="feature-box">
            <div className="feature-icon-large">💬</div>
            <h3>Direct Communication</h3>
            <p>Chat directly with employers and candidates in real-time</p>
          </div>

          {/* Feature 3 */}
          <div className="feature-box">
            <div className="feature-icon-large">🌐</div>
            <h3>Multi-Language Support</h3>
            <p>Access the platform in English and Hindi for better accessibility</p>
          </div>

          {/* Feature 4 */}
          <div className="feature-box">
            <div className="feature-icon-large">👩‍💼</div>
            <h3>Women Opportunities</h3>
            <p>Special opportunities and safe environment for women professionals</p>
          </div>

          {/* Feature 5 */}
          <div className="feature-box">
            <div className="feature-icon-large">⚡</div>
            <h3>Fast & Easy</h3>
            <p>Simple registration and quick job search process</p>
          </div>

          {/* Feature 6 */}
          <div className="feature-box">
            <div className="feature-icon-large">🔒</div>
            <h3>Secure & Safe</h3>
            <p>Your data is protected with enterprise-grade security</p>
          </div>
        </div>
      </section>

      {/* For Job Seekers Section */}
      <section className="for-seekers">
        <div className="seekers-content">
          <div className="seekers-text">
            <h2>For Job Seekers</h2>
            <p>Looking for daily wage or permanent work?</p>
            <ul className="benefits-list">
              <li>✓ Browse thousands of job listings</li>
              <li>✓ Filter by location, salary, and job type</li>
              <li>✓ Apply in one click</li>
              <li>✓ Chat with employers directly</li>
              <li>✓ Track your applications in real-time</li>
              <li>✓ Get notifications for new opportunities</li>
            </ul>
            <button 
              className="btn-primary-large"
              onClick={() => navigate('/role-selection')}
            >
              Start Searching Jobs
            </button>
          </div>
          <div className="seekers-visual">
            <div className="visual-box">👨‍💼</div>
          </div>
        </div>
      </section>

      {/* For Employers Section */}
      <section className="for-employers">
        <div className="employers-content">
          <div className="employers-visual">
            <div className="visual-box">👔</div>
          </div>
          <div className="employers-text">
            <h2>For Employers</h2>
            <p>Need to hire skilled workers quickly?</p>
            <ul className="benefits-list">
              <li>✓ Post jobs in seconds</li>
              <li>✓ Reach local talent in your area</li>
              <li>✓ Review applications easily</li>
              <li>✓ Chat with candidates directly</li>
              <li>✓ Manage your job postings</li>
              <li>✓ Find qualified workers fast</li>
            </ul>
            <button 
              className="btn-primary-large"
              onClick={() => navigate('/role-selection')}
            >
              Start Posting Jobs
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="section-header">
          <h2>Join Our Growing Community</h2>
          <p>Connecting employers and workers across rural India</p>
        </div>

        <div className="stats-grid">
          <div className="stat-large">
            <span className="stat-value">1000+</span>
            <span className="stat-desc">Active Users</span>
          </div>
          <div className="stat-large">
            <span className="stat-value">233+</span>
            <span className="stat-desc">Job Listings</span>
          </div>
          <div className="stat-large">
            <span className="stat-value">500+</span>
            <span className="stat-desc">Successful Placements</span>
          </div>
          <div className="stat-large">
            <span className="stat-value">11</span>
            <span className="stat-desc">Indian States</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of job seekers and employers finding success on Village Jobs Hub</p>
          <div className="cta-buttons">
            <button 
              className="btn-primary-large"
              onClick={() => navigate('/role-selection')}
            >
              Get Started Now
            </button>
            <button 
              className="btn-outline-large"
              onClick={() => navigate('/login')}
            >
              Login to Your Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Village Jobs Hub</h4>
            <p>Connecting rural employment opportunities</p>
          </div>
          <div className="footer-section">
            <h5>Quick Links</h5>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#jobs">Jobs</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h5>Support</h5>
            <ul>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#feedback">Feedback</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h5>Legal</h5>
            <ul>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms & Conditions</a></li>
              <li><a href="#disclaimer">Disclaimer</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Village Jobs Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
