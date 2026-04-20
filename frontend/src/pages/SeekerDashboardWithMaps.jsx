import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import ChatWidget from '../components/ChatWidget';
import './SeekerDashboardWithMaps.css';

// Google Maps API Key - Replace with your actual key
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

function SeekerDashboardWithMaps() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // States
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [likedJobs, setLikedJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Location states
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedEmployer, setSelectedEmployer] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedState) {
      loadCities(selectedState);
    } else {
      setCities([]);
      setSelectedCity('');
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedCity) {
      loadVillages(selectedState, selectedCity);
    } else {
      setVillages([]);
      setSelectedVillage('');
    }
  }, [selectedCity]);

  useEffect(() => {
    applyFilters();
  }, [jobs, selectedState, selectedCity, selectedVillage, categoryFilter, jobTypeFilter]);

  useEffect(() => {
    if (filteredJobs.length > 0) {
      updateMapMarkers();
    }
  }, [filteredJobs]);

  const loadGoogleMaps = () => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  };

  const initializeMap = () => {
    const mapElement = document.getElementById('google-map');
    if (mapElement && window.google) {
      const map = new window.google.maps.Map(mapElement, {
        center: mapCenter,
        zoom: mapZoom,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
      window.jobMap = map;
    }
  };

  const updateMapMarkers = async () => {
    if (!window.jobMap || !window.google) return;

    // Clear existing markers
    if (window.jobMarkers) {
      window.jobMarkers.forEach(marker => marker.setMap(null));
    }
    window.jobMarkers = [];

    // Get unique locations from filtered jobs
    const locationMap = {};
    filteredJobs.forEach(job => {
      const key = `${job.state}_${job.city}`;
      if (!locationMap[key]) {
        locationMap[key] = { state: job.state, city: job.city, jobs: [] };
      }
      locationMap[key].jobs.push(job);
    });

    // Fetch coordinates and create markers
    try {
      const response = await api.get('/locations/coordinates');
      const coordinates = response.data.data;

      Object.values(locationMap).forEach(location => {
        const coord = coordinates.find(c => c.state === location.state && c.city === location.city);
        if (coord) {
          const marker = new window.google.maps.Marker({
            position: { lat: parseFloat(coord.latitude), lng: parseFloat(coord.longitude) },
            map: window.jobMap,
            title: `${location.city}, ${location.state} (${location.jobs.length} jobs)`,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#667eea',
              fillOpacity: 0.8,
              strokeColor: '#764ba2',
              strokeWeight: 2
            }
          });

          marker.addListener('click', () => {
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 10px;">
                  <h3 style="margin: 0 0 10px 0; color: #667eea;">${location.city}, ${location.state}</h3>
                  <p style="margin: 0 0 5px 0;"><strong>${location.jobs.length}</strong> jobs available</p>
                  <button onclick="document.dispatchEvent(new CustomEvent('filterByLocation', {detail: {state: '${location.state}', city: '${location.city}'}}))" 
                          style="padding: 5px 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 4px; cursor: pointer;">
                    View Jobs
                  </button>
                </div>
              `
            });
            infoWindow.open(window.jobMap, marker);
          });

          window.jobMarkers.push(marker);
        }
      });

      // Adjust map bounds to show all markers
      if (window.jobMarkers.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        window.jobMarkers.forEach(marker => bounds.extend(marker.getPosition()));
        window.jobMap.fitBounds(bounds);
      }
    } catch (error) {
      console.error('Error updating map markers:', error);
    }
  };

  // Listen for map filter events
  useEffect(() => {
    const handleFilterByLocation = (event) => {
      setSelectedState(event.detail.state);
      setSelectedCity(event.detail.city);
    };
    document.addEventListener('filterByLocation', handleFilterByLocation);
    return () => document.removeEventListener('filterByLocation', handleFilterByLocation);
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadJobs(),
        loadMyApplications(),
        loadLikedJobs(),
        loadStates()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadJobs = async () => {
    try {
      const response = await api.get('/jobs');
      setJobs(response.data.data || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
      setJobs([]);
    }
  };

  const loadMyApplications = async () => {
    try {
      const response = await api.get('/applications/my');
      setMyApplications(response.data.data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
      setMyApplications([]);
    }
  };

  const loadLikedJobs = async () => {
    try {
      const response = await api.get('/jobs/liked/all');
      setLikedJobs(response.data.data || []);
    } catch (error) {
      console.error('Error loading liked jobs:', error);
      setLikedJobs([]);
    }
  };

  const loadStates = async () => {
    try {
      const response = await api.get('/locations/states');
      setStates(response.data.data || []);
    } catch (error) {
      console.error('Error loading states:', error);
      setStates([]);
    }
  };

  const loadCities = async (state) => {
    try {
      const response = await api.get(`/locations/cities?state=${state}`);
      setCities(response.data.data || []);
    } catch (error) {
      console.error('Error loading cities:', error);
      setCities([]);
    }
  };

  const loadVillages = async (state, city) => {
    try {
      const response = await api.get(`/locations/villages?state=${state}&city=${city}`);
      setVillages(response.data.data || []);
    } catch (error) {
      console.error('Error loading villages:', error);
      setVillages([]);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    // Location filters
    if (selectedState) {
      filtered = filtered.filter(job => job.state === selectedState);
    }
    if (selectedCity) {
      filtered = filtered.filter(job => job.city === selectedCity);
    }
    if (selectedVillage) {
      filtered = filtered.filter(job => job.village === selectedVillage);
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(job => job.category === categoryFilter);
    }

    // Job type filter
    if (jobTypeFilter) {
      filtered = filtered.filter(job => job.jobType === jobTypeFilter);
    }

    setFilteredJobs(filtered);
  };

  const handleApplyJob = async (jobId) => {
    try {
      await api.post('/applications', { jobId });
      alert('Application submitted successfully!');
      loadMyApplications();
    } catch (error) {
      console.error('Error applying to job:', error);
      alert('Failed to apply. Please try again.');
    }
  };

  const handleLikeJob = async (jobId) => {
    try {
      const response = await api.post(`/jobs/${jobId}/like`);
      const liked = response.data.data.liked;
      
      if (liked) {
        setLikedJobs([...likedJobs, jobs.find(j => j.id === jobId)]);
      } else {
        setLikedJobs(likedJobs.filter(j => j.id !== jobId));
      }
    } catch (error) {
      console.error('Error liking job:', error);
    }
  };

  const handleChatWithEmployer = (employerId, employerName) => {
    setSelectedEmployer({ id: employerId, name: employerName });
    setChatOpen(true);
  };

  const isJobLiked = (jobId) => {
    return likedJobs.some(j => j.id === jobId);
  };

  const hasApplied = (jobId) => {
    return myApplications.some(app => app.jobId === jobId);
  };

  const clearLocationFilters = () => {
    setSelectedState('');
    setSelectedCity('');
    setSelectedVillage('');
  };

  const renderJobCard = (job) => {
    const liked = isJobLiked(job.id);
    const applied = hasApplied(job.id);

    return (
      <div key={job.id} className="job-card">
        <div className="job-header">
          <div className="job-icon">🏢</div>
          <div className="job-title-section">
            <h3>{job.title}</h3>
            {job.womenOnly && <span className="women-only-badge">Women Only</span>}
          </div>
          <button 
            className={`like-btn ${liked ? 'liked' : ''}`}
            onClick={() => handleLikeJob(job.id)}
          >
            {liked ? '❤️' : '🤍'}
          </button>
        </div>

        <div className="job-info">
          <p className="job-location">📍 {job.village}, {job.city}, {job.state}</p>
          <p className="job-salary">
            💰 ₹{job.salary_min?.toLocaleString()} - ₹{job.salary_max?.toLocaleString()}
            {job.jobType === 'Daily Wage' ? '/day' : '/month'}
          </p>
          <p className="job-type">⏱️ {job.jobType} | 📂 {job.category}</p>
          <p className="job-description">{job.description}</p>
        </div>

        <div className="job-actions">
          <button 
            className="apply-btn"
            onClick={() => handleApplyJob(job.id)}
            disabled={applied}
          >
            {applied ? '✓ Applied' : 'Apply'}
          </button>
          <button 
            className="chat-btn"
            onClick={() => handleChatWithEmployer(job.employerId, `Employer (${job.city})`)}
          >
            💬 Chat
          </button>
          <button 
            className="details-btn"
            onClick={() => navigate(`/job/${job.id}`)}
          >
            View Details
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-with-maps">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>👋 Welcome, {user?.name}!</h1>
          <p>Find your perfect job near you</p>
        </div>
        <div className="header-actions">
          <button className="notification-bell">🔔</button>
          <button className="profile-btn" onClick={() => navigate('/profile')}>👤</button>
          <button className="logout-btn" onClick={logout}>⏏️ Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Left Side - Job Listings */}
        <div className="jobs-section">
          {/* Location Selector */}
          <div className="location-selector">
            <h2>📍 Select Location</h2>
            <div className="location-filters">
              <select 
                value={selectedState} 
                onChange={(e) => setSelectedState(e.target.value)}
                className="location-select"
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>

              {selectedState && (
                <select 
                  value={selectedCity} 
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="location-select"
                >
                  <option value="">Select City</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              )}

              {selectedCity && (
                <select 
                  value={selectedVillage} 
                  onChange={(e) => setSelectedVillage(e.target.value)}
                  className="location-select"
                >
                  <option value="">Select Village/Area</option>
                  {villages.map(village => (
                    <option key={village} value={village}>{village}</option>
                  ))}
                </select>
              )}

              {selectedState && (
                <button className="clear-location-btn" onClick={clearLocationFilters}>
                  ✕ Clear
                </button>
              )}
            </div>

            {/* Additional Filters */}
            <div className="additional-filters">
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Categories</option>
                <option value="Construction">Construction</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Retail">Retail</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Security">Security</option>
                <option value="Transportation">Transportation</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="IT & Software">IT & Software</option>
              </select>

              <select 
                value={jobTypeFilter} 
                onChange={(e) => setJobTypeFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Daily Wage">Daily Wage</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
          </div>

          {/* Job Results */}
          <div className="jobs-list">
            <div className="jobs-header">
              <h2>
                {filteredJobs.length} Jobs Found
                {selectedVillage && ` in ${selectedVillage}`}
                {!selectedVillage && selectedCity && ` in ${selectedCity}`}
                {!selectedVillage && !selectedCity && selectedState && ` in ${selectedState}`}
              </h2>
            </div>

            <div className="jobs-grid">
              {filteredJobs.length === 0 ? (
                <div className="no-jobs">
                  <p>No jobs found matching your filters</p>
                  <button onClick={clearLocationFilters}>Clear Filters</button>
                </div>
              ) : (
                filteredJobs.map(job => renderJobCard(job))
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Google Maps */}
        <div className="map-section">
          <div className="map-container">
            <div id="google-map" className="google-map"></div>
            <div className="map-legend">
              <h4>Map Legend</h4>
              <p><span className="legend-marker"></span> Job locations</p>
              <p>Click markers to see jobs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      {chatOpen && selectedEmployer && (
        <ChatWidget
          receiverId={selectedEmployer.id}
          receiverName={selectedEmployer.name}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}

export default SeekerDashboardWithMaps;
