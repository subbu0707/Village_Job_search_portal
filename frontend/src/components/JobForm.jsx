import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const JobForm = ({ onSubmit, loading = false, states = [], cities = [], villages = [] }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salary_min: '',
    salary_max: '',
    location_state: '',
    location_city: '',
    location_village: '',
    category: 'General',
    required_skills: '',
    womensOnly: false,
    deadline: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.row}>
        <div style={styles.col}>
          <label style={styles.label}>{t('Job Title')} *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="e.g., Farm Laborer, Carpenter"
          />
        </div>
        <div style={styles.col}>
          <label style={styles.label}>{t('Category')}</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={styles.input}
          >
            <option>General</option>
            <option>Agriculture</option>
            <option>Construction</option>
            <option>Service</option>
            <option>Manufacturing</option>
          </select>
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.col}>
          <label style={styles.label}>{t('Description')} *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            style={styles.textarea}
            placeholder="Describe the job..."
            rows="4"
          />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.col}>
          <label style={styles.label}>{t('State')} *</label>
          <select
            name="location_state"
            value={formData.location_state}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">{t('Select State')}</option>
            {states.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div style={styles.col}>
          <label style={styles.label}>{t('City')} *</label>
          <select
            name="location_city"
            value={formData.location_city}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">{t('Select City')}</option>
            {cities.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.col}>
          <label style={styles.label}>{t('Salary Min')}</label>
          <input
            type="number"
            name="salary_min"
            value={formData.salary_min}
            onChange={handleChange}
            style={styles.input}
            placeholder="Minimum salary"
          />
        </div>
        <div style={styles.col}>
          <label style={styles.label}>{t('Salary Max')}</label>
          <input
            type="number"
            name="salary_max"
            value={formData.salary_max}
            onChange={handleChange}
            style={styles.input}
            placeholder="Maximum salary"
          />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.col}>
          <label style={styles.label}>{t('Required Skills')}</label>
          <input
            type="text"
            name="required_skills"
            value={formData.required_skills}
            onChange={handleChange}
            style={styles.input}
            placeholder="Comma separated skills"
          />
        </div>
        <div style={styles.col}>
          <label style={styles.label}>{t('Deadline')}</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.checkboxRow}>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="womensOnly"
            checked={formData.womensOnly}
            onChange={handleChange}
            style={styles.checkbox}
          />
          {t('Women Only Position')}
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={styles.submitBtn}
      >
        {loading ? `${t('Posting')}...` : t('Post Job')}
      </button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
    fontSize: '14px',
  },
  input: {
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  textarea: {
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  submitBtn: {
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
  },
};

export default JobForm;
