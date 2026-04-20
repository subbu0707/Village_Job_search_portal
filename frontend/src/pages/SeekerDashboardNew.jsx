import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api/api";
import { useTranslation } from "react-i18next";
import ChatWidget from "../components/ChatWidget";
import StarRating from "../components/StarRating/StarRating";
import "../styles/SeekerDashboard.css";

const SeekerDashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Tab state
  const [activeTab, setActiveTab] = useState("home");

  // Jobs state
  const [jobs, setJobs] = useState([]);
  const [likedJobs, setLikedJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Location state (hierarchical)
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  // Leaflet Map state
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India center [lat, lng]
  const [mapZoom, setMapZoom] = useState(5);
  const [locationCoordinates, setLocationCoordinates] = useState([]);

  // Filters
  const [filters, setFilters] = useState({
    category: "",
    jobType: "",
    location: "",
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedEmployer, setSelectedEmployer] = useState(null);

  // Rating state
  const [userRating, setUserRating] = useState({
    averageRating: 0,
    totalRatings: 0,
  });
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [detailedRatings, setDetailedRatings] = useState([]);

  // Applications view state
  const [showApplicationsSection, setShowApplicationsSection] = useState(false);

  useEffect(() => {
    console.log(
      "🚀 SeekerDashboard mounting - user:",
      user?.name,
      "role:",
      user?.role
    );
    if (!user || user.role !== "seeker") {
      console.log("⚠️ Redirecting to login - no user or not a seeker");
      navigate("/login");
      return;
    }
    console.log("✅ User authenticated, loading dashboard data...");
    loadAllData();
    loadStates();
    loadLocationCoordinates();
    loadUserRating();
  }, [user, navigate]);

  // Load user's rating
  const loadUserRating = async () => {
    try {
      if (user?.id) {
        const response = await api.get(`/ratings/seeker/${user.id}`);
        console.log("📊 Rating API Response:", response.data);

        // Convert to numbers properly (handle string/buffer from DB)
        const avgRating = parseFloat(response.data.averageRating) || 0;
        const totalRatings = parseInt(response.data.totalRatings) || 0;

        console.log("⭐ Parsed ratings:", { avgRating, totalRatings });

        setUserRating({
          averageRating: avgRating,
          totalRatings: totalRatings,
        });

        // Store detailed ratings for modal
        setDetailedRatings(response.data.ratings || []);
      }
    } catch (error) {
      console.error("Error loading user rating:", error);
      // Set default values on error to prevent crashes
      setUserRating({
        averageRating: 0,
        totalRatings: 0,
      });
      setDetailedRatings([]);
    }
  };

  // Load states from API
  const loadStates = async () => {
    try {
      const response = await api.get("/locations/states");
      setStates(response.data.data || []);
    } catch (error) {
      console.error("Error loading states:", error);
    }
  };

  // Load cities when state is selected
  const loadCities = async (state) => {
    try {
      const response = await api.get(
        `/locations/cities?state=${encodeURIComponent(state)}`
      );
      setCities(response.data.data || []);
      setVillages([]);
      setSelectedCity("");
      setSelectedVillage("");
    } catch (error) {
      console.error("Error loading cities:", error);
    }
  };

  // Load villages when city is selected
  const loadVillages = async (state, city) => {
    try {
      const response = await api.get(
        `/locations/villages?state=${encodeURIComponent(
          state
        )}&city=${encodeURIComponent(city)}`
      );
      setVillages(response.data.data || []);
      setSelectedVillage("");
    } catch (error) {
      console.error("Error loading villages:", error);
    }
  };

  // Load location coordinates for map
  const loadLocationCoordinates = async () => {
    try {
      const response = await api.get("/locations/coordinates");
      const coords = response.data.data || [];
      console.log(
        "📍 Loaded coordinates:",
        coords.length,
        "Sample:",
        coords.slice(0, 3)
      );
      setLocationCoordinates(coords);
    } catch (error) {
      console.error("Error loading coordinates:", error);
    }
  };

  // Handle state selection
  const handleStateChange = (e) => {
    const state = e.target.value;
    console.log("🔴 handleStateChange called - state:", state);
    setSelectedState(state);
    setSelectedCity(""); // Reset city when state changes
    setSelectedVillage(""); // Reset village when state changes

    if (state) {
      loadCities(state);

      // Update map center to state - find any location in this state
      const stateCoords = locationCoordinates.find(
        (loc) => loc.state === state
      );
      console.log(
        "🔍 State selected:",
        state,
        "Total coords:",
        locationCoordinates.length,
        "Found:",
        stateCoords
      );

      if (stateCoords) {
        const newCenter = [
          parseFloat(stateCoords.latitude),
          parseFloat(stateCoords.longitude),
        ];
        console.log("✅ Setting map center to:", newCenter);
        setMapCenter(newCenter);
        setMapZoom(8); // State level zoom
      } else {
        console.warn("⚠️ No coordinates found for state:", state);
      }
    } else {
      setCities([]);
      setVillages([]);
      setMapCenter([20.5937, 78.9629]); // Reset to India center
      setMapZoom(5);
    }
  };

  // Handle city selection
  const handleCityChange = (e) => {
    const city = e.target.value;
    console.log(
      "🔵 handleCityChange called - city:",
      city,
      "state:",
      selectedState
    );
    setSelectedCity(city);
    setSelectedVillage(""); // Reset village when city changes

    if (city && selectedState) {
      loadVillages(selectedState, city);

      // Update map center to city
      const cityCoords = locationCoordinates.find(
        (loc) => loc.state === selectedState && loc.city === city
      );
      console.log("🔍 City selected:", city, "Found:", cityCoords);

      if (cityCoords) {
        const newCenter = [
          parseFloat(cityCoords.latitude),
          parseFloat(cityCoords.longitude),
        ];
        console.log("✅ Setting map center to city:", newCenter);
        setMapCenter(newCenter);
        setMapZoom(12); // City level zoom
      } else {
        console.warn(
          "⚠️ No coordinates found for city:",
          city,
          "state:",
          selectedState
        );
      }
    } else {
      setVillages([]);
    }
  };

  // Handle village selection
  const handleVillageChange = (e) => {
    setSelectedVillage(e.target.value);
  };

  // Clear all location filters
  const clearLocationFilters = () => {
    setSelectedState("");
    setSelectedCity("");
    setSelectedVillage("");
    setCities([]);
    setVillages([]);
    setMapCenter([20.5937, 78.9629]); // Reset to India center
    setMapZoom(5);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadJobs(), loadMyApplications(), loadLikedJobs()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadJobs = async () => {
    try {
      console.log("🔄 Fetching jobs from API...");
      const response = await api.get("/jobs");
      console.log("✅ API Response:", response.data);
      console.log("📊 Total jobs received:", response.data.data?.length || 0);

      const jobsData = response.data.data || [];
      setJobs(jobsData);

      if (jobsData.length === 0) {
        console.warn("⚠️ No jobs returned from API");
      } else {
        console.log("✅ Jobs loaded successfully:", jobsData.length);
      }
    } catch (error) {
      console.error("❌ Error loading jobs:", error);
      console.error("Error details:", error.response?.data || error.message);
      setJobs([]); // Set empty array on error
    }
  };

  const loadMyApplications = async () => {
    try {
      const response = await api.get("/applications/my");
      setMyApplications(response.data.data || []);
    } catch (error) {
      console.error("Error loading applications:", error);
    }
  };

  const loadLikedJobs = async () => {
    try {
      const response = await api.get("/jobs/liked/all");
      console.log("✅ Liked jobs loaded:", response.data);
      setLikedJobs(response.data.data || []);
    } catch (error) {
      console.error("❌ Error loading liked jobs:", error);
    }
  };

  const handleApplyJob = async (jobId) => {
    if (!user) {
      alert("Please login to apply for jobs");
      navigate("/login");
      return;
    }

    try {
      const response = await api.post("/applications", {
        jobId: parseInt(jobId),
      });
      alert("Application submitted successfully!");
      loadMyApplications();
      loadAllData(); // Refresh data
    } catch (error) {
      console.error("Error applying:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Failed to submit application. Please try again.";
      alert(errorMsg);
    }
  };

  const handleLikeJob = async (jobId, event) => {
    // Prevent event bubbling to parent elements
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    console.log("🔵 Like button clicked!");
    console.log("📝 Job ID:", jobId);
    console.log("👤 User:", user);
    console.log(
      "🔑 Token:",
      localStorage.getItem("token") ? "Present" : "Missing"
    );

    try {
      console.log("❤️ Sending like request to:", `/jobs/${jobId}/like`);
      const response = await api.post(`/jobs/${jobId}/like`);
      console.log("✅ Like response:", response.data);

      console.log("🔄 Reloading liked jobs...");
      await loadLikedJobs();
      console.log("✅ Liked jobs reloaded");

      // Show success message
      const isLiked = response.data.data?.liked;
      console.log("💚 Job is now:", isLiked ? "LIKED" : "UNLIKED");
    } catch (error) {
      console.error("❌ Error liking job:", error);
      console.error("📋 Error details:", error.response?.data || error.message);
      console.error("🔴 Status:", error.response?.status);
      alert(
        `Failed to like job: ${error.response?.data?.message || error.message}`
      );
    }
  };
  const handleChatWithEmployer = (job) => {
    setSelectedEmployer({
      id: job.employerId,
      name: job.employerName || "Employer",
    });
    setChatOpen(true);
  };

  const filterJobs = (jobsList, category = null) => {
    return jobsList.filter((job) => {
      // Category filter
      if (category && job.category !== category) return false;
      if (filters.category && job.category !== filters.category) return false;

      // Job type filter
      if (filters.jobType && job.jobType !== filters.jobType) return false;

      // Location hierarchical filter
      if (selectedState && job.state !== selectedState) return false;
      if (selectedCity && job.city !== selectedCity) return false;
      if (selectedVillage && job.village !== selectedVillage) return false;

      // Legacy location filter
      if (filters.location && !job.city?.includes(filters.location))
        return false;

      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = job.title?.toLowerCase().includes(query);
        const matchesDescription = job.description
          ?.toLowerCase()
          .includes(query);
        const matchesCompany = job.employerName?.toLowerCase().includes(query);
        const matchesLocation =
          job.city?.toLowerCase().includes(query) ||
          job.state?.toLowerCase().includes(query) ||
          job.village?.toLowerCase().includes(query);
        if (
          !matchesTitle &&
          !matchesDescription &&
          !matchesCompany &&
          !matchesLocation
        ) {
          return false;
        }
      }

      return true;
    });
  };

  const renderJobCard = (job) => (
    <div key={job.id} className="job-card">
      <div className="job-card-header">
        <div className="job-icon">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" strokeWidth="2" />
            <path d="M16 7V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3" strokeWidth="2" />
          </svg>
        </div>
        <div className="job-info">
          <h3>{job.title}</h3>
          <p className="company-name">{job.employerName || "Company Name"}</p>
        </div>
        <button
          className={`like-btn ${
            likedJobs.some((lj) => lj.id === job.id) ? "liked" : ""
          }`}
          onClick={(e) => handleLikeJob(job.id, e)}
          title="Like this job"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>

      <div className="job-details">
        <div className="detail-item">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
              strokeWidth="2"
            />
            <circle cx="12" cy="10" r="3" strokeWidth="2" />
          </svg>
          <span>
            {job.village && `${job.village}, `}
            {job.city}, {job.state}
          </span>
        </div>

        <div className="detail-item">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" strokeWidth="2" />
          </svg>
          <span>{job.jobType || "Full-time"}</span>
        </div>

        <div className="detail-item">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <line x1="12" y1="1" x2="12" y2="23" strokeWidth="2" />
            <path
              d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
              strokeWidth="2"
            />
          </svg>
          <span>
            ₹{job.salary_min} - ₹{job.salary_max}
          </span>
        </div>
      </div>

      <p className="job-description">{job.description}</p>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {job.womenOnly && <span className="women-only-badge">Women Only</span>}
        {job.jobType === "Daily Wage" && (
          <span
            style={{
              backgroundColor: "#f093fb",
              color: "white",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "bold",
              display: "inline-block",
              boxShadow: "0 2px 8px rgba(240, 147, 251, 0.4)",
            }}
          >
            💰 Daily Wage
          </span>
        )}
      </div>

      <div className="job-actions">
        <button
          className="apply-btn"
          onClick={() => handleApplyJob(job.id)}
          disabled={myApplications.some((app) => app.jobId === job.id)}
        >
          {myApplications.some((app) => app.jobId === job.id)
            ? "Applied"
            : "Apply Now"}
        </button>
        <button
          className="chat-btn"
          onClick={() => handleChatWithEmployer(job)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
              strokeWidth="2"
            />
          </svg>
          Chat
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

  const renderHomeTab = () => {
    // Show loading state
    if (loading) {
      return (
        <div className="tab-content">
          <div className="loading-message">
            <h3>🔄 Loading jobs...</h3>
            <p>Please wait while we fetch all available positions</p>
          </div>
        </div>
      );
    }

    // Show message if no jobs loaded
    if (jobs.length === 0) {
      return (
        <div className="tab-content">
          <div className="no-jobs-message">
            <h3>📋 No Jobs Available</h3>
            <p>Jobs database is empty or couldn't load jobs from the server.</p>
            <p>Total jobs in state: {jobs.length}</p>
            <button onClick={loadAllData} className="apply-btn">
              🔄 Retry Loading Jobs
            </button>
          </div>
        </div>
      );
    }

    const relatedJobs = filterJobs(jobs).slice(0, 12);

    // Fresher jobs - check for multiple keywords
    const fresherKeywords = [
      "fresher",
      "entry level",
      "graduate",
      "trainee",
      "junior",
      "beginner",
      "internship",
    ];
    const fresherJobs = filterJobs(
      jobs.filter((j) => {
        const title = j.title?.toLowerCase() || "";
        const desc = j.description?.toLowerCase() || "";
        return fresherKeywords.some(
          (keyword) => title.includes(keyword) || desc.includes(keyword)
        );
      })
    ).slice(0, 12);

    const womenJobs = filterJobs(jobs.filter((j) => j.womenOnly)).slice(0, 12);
    const likedJobsList = filterJobs(likedJobs).slice(0, 12);

    // Daily Wage Jobs - NEW!
    const dailyWageJobs = filterJobs(
      jobs.filter((j) => j.jobType === "Daily Wage")
    ).slice(0, 12);

    return (
      <div className="tab-content">
        <div className="stats-overview">
          <div className="stat-card">
            <h3>Total Jobs</h3>
            <p className="stat-number">{jobs.length}</p>
          </div>
          <div
            className="stat-card"
            style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            }}
          >
            <h3>💰 Daily Wage Jobs</h3>
            <p className="stat-number">
              {jobs.filter((j) => j.jobType === "Daily Wage").length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Fresher Jobs</h3>
            <p className="stat-number">
              {
                jobs.filter((j) => {
                  const title = j.title?.toLowerCase() || "";
                  const desc = j.description?.toLowerCase() || "";
                  return fresherKeywords.some(
                    (keyword) =>
                      title.includes(keyword) || desc.includes(keyword)
                  );
                }).length
              }
            </p>
          </div>
          <div className="stat-card">
            <h3>Women's Jobs</h3>
            <p className="stat-number">
              {jobs.filter((j) => j.womenOnly).length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Liked Jobs</h3>
            <p className="stat-number">{likedJobs.length}</p>
          </div>
        </div>

        <h2
          className="section-title"
          style={{
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            padding: "15px",
            borderRadius: "12px",
            color: "white",
            boxShadow: "0 4px 15px rgba(240, 147, 251, 0.4)",
          }}
        >
          💰 Daily Wage Jobs (
          {jobs.filter((j) => j.jobType === "Daily Wage").length} available)
        </h2>
        <div className="jobs-grid">
          {dailyWageJobs.length > 0 ? (
            dailyWageJobs.map(renderJobCard)
          ) : (
            <div className="no-jobs-message">
              <p>No daily wage jobs available at the moment.</p>
            </div>
          )}
        </div>

        <h2 className="section-title">📌 Related Jobs</h2>
        <div className="jobs-grid">
          {relatedJobs.length > 0 ? (
            relatedJobs.map(renderJobCard)
          ) : (
            <div className="no-jobs-message">
              <p>
                No jobs found matching your filters. Try adjusting your search
                criteria.
              </p>
            </div>
          )}
        </div>

        <h2 className="section-title">
          💼 Fresher Jobs (
          {
            jobs.filter((j) => {
              const title = j.title?.toLowerCase() || "";
              const desc = j.description?.toLowerCase() || "";
              return fresherKeywords.some(
                (keyword) => title.includes(keyword) || desc.includes(keyword)
              );
            }).length
          }{" "}
          available)
        </h2>
        <div className="jobs-grid">
          {fresherJobs.length > 0 ? (
            fresherJobs.map(renderJobCard)
          ) : (
            <div className="no-jobs-message">
              <p>No fresher jobs available at the moment.</p>
            </div>
          )}
        </div>

        <h2 className="section-title">
          👩 Women's Jobs ({jobs.filter((j) => j.womenOnly).length} available)
        </h2>
        <div className="jobs-grid">
          {womenJobs.length > 0 ? (
            womenJobs.map(renderJobCard)
          ) : (
            <div className="no-jobs-message">
              <p>No women-only jobs available at the moment.</p>
            </div>
          )}
        </div>

        <h2 className="section-title">❤️ Liked Jobs ({likedJobs.length})</h2>
        <div className="jobs-grid">
          {likedJobsList.length > 0 ? (
            likedJobsList.map(renderJobCard)
          ) : (
            <div className="no-jobs-message">
              <p>
                No liked jobs yet. Click the heart icon on jobs you're
                interested in!
              </p>
            </div>
          )}
        </div>

        <h2 className="section-title">Liked Jobs</h2>
        <div className="jobs-grid">
          {likedJobs.length > 0 ? (
            likedJobs.map(renderJobCard)
          ) : (
            <div className="no-jobs-message">
              <p>
                You haven't liked any jobs yet. Click the heart icon on jobs
                you're interested in!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLocalEmploymentTab = () => {
    const cityJobs = filterJobs(jobs)
      .filter((j) => j.city === user.city || j.city === selectedCity)
      .slice(0, 12);
    const districtJobs = filterJobs(jobs)
      .filter((j) => j.state === user.state || j.state === selectedState)
      .slice(0, 12);
    const stateJobs = filterJobs(jobs).filter(
      (j) => j.state === user.state || j.state === selectedState
    );
    const govtJobs = filterJobs(jobs)
      .filter(
        (j) =>
          j.category === "Government" ||
          j.title?.toLowerCase().includes("govt") ||
          j.title?.toLowerCase().includes("government")
      )
      .slice(0, 12);
    const interviewJobs = filterJobs(
      myApplications
        .map((app) => jobs.find((j) => j.id === app.jobId))
        .filter(Boolean)
    ).slice(0, 12);

    const locationText = selectedCity || user.city || "Your City";
    const stateText = selectedState || user.state || "Your State";

    return (
      <div className="tab-content">
        <div className="stats-overview">
          <div className="stat-card">
            <h3>City Jobs</h3>
            <p className="stat-number">{cityJobs.length}</p>
          </div>
          <div className="stat-card">
            <h3>State Jobs</h3>
            <p className="stat-number">{stateJobs.length}</p>
          </div>
          <div className="stat-card">
            <h3>Government Jobs</h3>
            <p className="stat-number">{govtJobs.length}</p>
          </div>
          <div
            className="stat-card clickable-card"
            onClick={() => setShowApplicationsSection(!showApplicationsSection)}
            style={{ cursor: "pointer" }}
          >
            <h3>Your Applications</h3>
            <p className="stat-number">{myApplications.length}</p>
            <small style={{ fontSize: "12px", color: "#667eea" }}>
              {showApplicationsSection ? "Hide ▲" : "Click to view ▼"}
            </small>
          </div>
        </div>

        {/* Your Applications Section */}
        {showApplicationsSection && (
          <div className="applications-section">
            <h2 className="section-title">
              📋 Your Applications ({myApplications.length})
            </h2>
            <div className="jobs-grid">
              {myApplications.length > 0 ? (
                myApplications.map((application) => {
                  // Backend returns snake_case field names
                  return (
                    <div
                      key={application.id}
                      className="job-card applied-job-card"
                    >
                      <div className="job-header">
                        <h3>{application.job_title || "Job Title"}</h3>
                        <span
                          className={`status-badge status-${application.status}`}
                        >
                          {application.status}
                        </span>
                      </div>
                      <div className="job-details">
                        <p className="job-company">
                          <strong>Employer:</strong>{" "}
                          {application.employer_name || "N/A"}
                        </p>
                        <p className="job-location">
                          <strong>📍 Location:</strong>{" "}
                          {application.location_city &&
                            `${application.location_city}, `}
                          {application.location_state || "N/A"}
                        </p>
                        <p className="job-salary">
                          <strong>💰 Salary:</strong> ₹
                          {application.salary_min && application.salary_max
                            ? `${application.salary_min} - ${application.salary_max}`
                            : application.salary_min ||
                              application.salary_max ||
                              "N/A"}
                        </p>
                        <p className="application-date">
                          <strong>Applied on:</strong>{" "}
                          {new Date(
                            application.applied_date
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-jobs-message">
                  <p>
                    You haven't applied to any jobs yet. Start exploring and
                    apply!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <h2 className="section-title">
          🏙️ City Jobs - {locationText} ({cityJobs.length})
        </h2>
        <div className="jobs-grid">
          {cityJobs.length > 0 ? (
            cityJobs.map(renderJobCard)
          ) : (
            <div className="no-jobs-message">
              <p>
                No jobs found in {locationText}. Try selecting a different city
                from the filters above!
              </p>
            </div>
          )}
        </div>

        <h2 className="section-title">
          📍 District/Region Jobs ({districtJobs.length})
        </h2>
        <div className="jobs-grid">
          {districtJobs.length > 0 ? (
            districtJobs.map(renderJobCard)
          ) : (
            <div className="no-jobs-message">
              <p>No district jobs available at the moment.</p>
            </div>
          )}
        </div>

        <h2 className="section-title">
          🗺️ State Jobs - {stateText} ({stateJobs.length})
        </h2>
        <div className="jobs-grid">
          {stateJobs.slice(0, 12).length > 0 ? (
            stateJobs.slice(0, 12).map(renderJobCard)
          ) : (
            <div className="no-jobs-message">
              <p>
                No jobs found in {stateText}. Try selecting a different state!
              </p>
            </div>
          )}
        </div>

        <h2 className="section-title">
          🏛️ Government Jobs ({govtJobs.length} available)
        </h2>
        <div className="jobs-grid">
          {govtJobs.length > 0 ? (
            govtJobs.map(renderJobCard)
          ) : (
            <div className="no-jobs-message">
              <p>No government jobs available at the moment.</p>
            </div>
          )}
        </div>

        <h2 className="section-title">
          📝 Interview Scheduled ({interviewJobs.length})
        </h2>
        <div className="jobs-grid">
          {interviewJobs.length > 0 ? (
            interviewJobs.map(renderJobCard)
          ) : (
            <div className="no-jobs-message">
              <p>
                You haven't applied to any jobs yet. Start applying to schedule
                interviews!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderForYouTab = () => {
    console.log("🎯 Rendering For You tab");
    console.log("📊 Liked Jobs:", likedJobs);
    console.log("📊 My Applications:", myApplications);

    // Personalized recommendations based on user profile
    let recommendedJobs = filterJobs(jobs);

    // Prioritize jobs matching user's location
    const locationMatch = recommendedJobs.filter(
      (job) =>
        job.city === (user.city || selectedCity) ||
        job.state === (user.state || selectedState)
    );

    // Get categories from applied and liked jobs
    const appliedCategories = myApplications
      .map((app) => jobs.find((j) => j.id === app.jobId)?.category)
      .filter(Boolean);

    const likedCategories = likedJobs.map((j) => j.category).filter(Boolean);

    console.log("📋 Applied Categories:", appliedCategories);
    console.log("❤️ Liked Categories:", likedCategories);

    const preferredCategories = [
      ...new Set([...appliedCategories, ...likedCategories]),
    ];

    console.log("✨ Preferred Categories:", preferredCategories);

    // Match with preferred categories
    const categoryMatch = recommendedJobs.filter((job) =>
      preferredCategories.includes(job.category)
    );

    // Combine and remove duplicates
    const uniqueRecommended = [
      ...new Map(
        [...locationMatch, ...categoryMatch].map((job) => [job.id, job])
      ).values(),
    ].slice(0, 24);

    // If no specific recommendations, show recent jobs
    const finalRecommendations =
      uniqueRecommended.length > 0
        ? uniqueRecommended
        : recommendedJobs.slice(0, 24);

    return (
      <div className="tab-content">
        <div className="for-you-header">
          <h2>🎯 Recommended For You</h2>
          <p>Based on your profile, location, and activity</p>
        </div>

        {/* Show Liked Jobs First */}
        {likedJobs.length > 0 && (
          <>
            <h3 className="section-subtitle">
              ❤️ Your Liked Jobs ({likedJobs.length})
            </h3>
            <div className="jobs-grid">{likedJobs.map(renderJobCard)}</div>
          </>
        )}

        {preferredCategories.length > 0 && (
          <div className="recommendation-info">
            <h4>📊 Your Interests:</h4>
            <div className="category-tags">
              {preferredCategories.map((cat) => (
                <span key={cat} className="category-tag">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        <h3 className="section-subtitle">
          💼 Recommended Jobs ({finalRecommendations.length})
        </h3>
        <div className="jobs-grid">
          {finalRecommendations.length > 0 ? (
            finalRecommendations.map(renderJobCard)
          ) : (
            <div className="no-jobs-message">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path d="M12 6v6l4 2" strokeWidth="2" />
              </svg>
              <h3>No recommendations yet</h3>
              <p>Like some jobs to get personalized recommendations!</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render Simple Map section (using iframe - more stable)
  const renderLeafletMap = () => {
    const getMapUrl = () => {
      const lat = mapCenter[0];
      const lng = mapCenter[1];
      return `https://www.openstreetmap.org/export/embed.html?bbox=${
        lng - 0.5
      },${lat - 0.5},${lng + 0.5},${
        lat + 0.5
      }&layer=mapnik&marker=${lat},${lng}`;
    };

    return (
      <div className="google-maps-container">
        <h3 className="map-title">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
              strokeWidth="2"
            />
            <circle cx="12" cy="10" r="3" strokeWidth="2" />
          </svg>
          Job Locations Map
          {selectedCity && selectedState && (
            <span
              style={{
                fontSize: "14px",
                fontWeight: "normal",
                marginLeft: "10px",
              }}
            >
              📍 {selectedCity}, {selectedState}
            </span>
          )}
        </h3>

        {/* Simple OpenStreetMap iframe */}
        <div
          className="map-container"
          style={{
            height: "400px",
            borderRadius: "12px",
            overflow: "hidden",
            border: "2px solid #e2e8f0",
          }}
        >
          <iframe
            key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src={getMapUrl()}
            style={{ border: 0 }}
            title="Job Locations Map"
          />
        </div>

        {/* Location Info */}
        <div className="location-info">
          <h4>📍 Available Locations</h4>
          <div className="location-chips">
            {locationCoordinates.slice(0, 6).map((loc) => {
              const jobCount = jobs.filter(
                (j) => j.state === loc.state && j.city === loc.city
              ).length;
              return (
                <button
                  key={`${loc.state}-${loc.city}`}
                  className="location-chip"
                  onClick={() => {
                    setSelectedState(loc.state);
                    setSelectedCity(loc.city);
                    setMapCenter([
                      parseFloat(loc.latitude),
                      parseFloat(loc.longitude),
                    ]);
                    setMapZoom(12);
                    loadCities(loc.state);
                    loadVillages(loc.state, loc.city);
                  }}
                >
                  <span className="chip-name">
                    {loc.city}, {loc.state}
                  </span>
                  <span className="chip-count">{jobCount} jobs</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="map-legend">
          <div className="legend-item">
            <span
              className="legend-marker"
              style={{ background: "#8B5CF6" }}
            ></span>
            <span>Cities with Jobs</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-marker"
              style={{ background: "#10B981" }}
            ></span>
            <span>Your Selected Location</span>
          </div>
        </div>
      </div>
    );
  };

  // Add loading check to prevent blank screen
  if (!user) {
    return (
      <div
        className="seeker-dashboard"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="seeker-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {user.name}!</h1>
          <div className="header-actions">
            {/* User Rating Button - Big Yellow Star */}
            {userRating && (
              <button
                className="rating-star-btn"
                onClick={() => setShowRatingModal(true)}
                title="View your ratings"
              >
                <span className="star-icon">⭐</span>
                <span className="rating-number">
                  {(Number(userRating.averageRating) || 0).toFixed(1)}
                </span>
              </button>
            )}
            <button className="notification-btn">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
                  strokeWidth="2"
                />
                <path d="M13.73 21a2 2 0 01-3.46 0" strokeWidth="2" />
              </svg>
              <span className="notification-badge">3</span>
            </button>
            <button
              className="profile-btn"
              onClick={() => navigate("/profile")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                  strokeWidth="2"
                />
                <circle cx="12" cy="7" r="4" strokeWidth="2" />
              </svg>
            </button>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                strokeWidth="2"
              />
              <polyline points="9 22 9 12 15 12 15 22" strokeWidth="2" />
            </svg>
            Home
          </button>
          <button
            className={`tab ${activeTab === "local" ? "active" : ""}`}
            onClick={() => setActiveTab("local")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
                strokeWidth="2"
              />
              <circle cx="12" cy="10" r="3" strokeWidth="2" />
            </svg>
            Local Employment
          </button>
          <button
            className={`tab ${activeTab === "foryou" ? "active" : ""}`}
            onClick={() => setActiveTab("foryou")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                strokeWidth="2"
              />
            </svg>
            For You
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-bar">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" strokeWidth="2" />
          </svg>
          <input
            type="text"
            placeholder="Search jobs by title, company, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Location-Based Filters (Hierarchical) */}
      <div className="location-filters-section">
        <h3 className="filter-section-title">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
              strokeWidth="2"
            />
            <circle cx="12" cy="10" r="3" strokeWidth="2" />
          </svg>
          Filter by Location
        </h3>
        <div className="location-selector">
          <div className="location-filter-group">
            <label>State</label>
            <select
              value={selectedState}
              onChange={handleStateChange}
              className="location-select"
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div className="location-filter-group">
            <label>City</label>
            <select
              value={selectedCity}
              onChange={handleCityChange}
              className="location-select"
              disabled={!selectedState}
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="location-filter-group">
            <label>Village/Area</label>
            <select
              value={selectedVillage}
              onChange={handleVillageChange}
              className="location-select"
              disabled={!selectedCity}
            >
              <option value="">All Villages</option>
              {villages.map((village) => (
                <option key={village} value={village}>
                  {village}
                </option>
              ))}
            </select>
          </div>

          {(selectedState || selectedCity || selectedVillage) && (
            <button
              className="clear-location-btn"
              onClick={clearLocationFilters}
            >
              Clear Location Filters
            </button>
          )}
        </div>
      </div>

      {/* Other Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="">All Categories</option>
            <option value="Construction">Construction</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Software Development">Software Development</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Retail">Retail</option>
            <option value="Hospitality">Hospitality</option>
            <option value="Transportation">Transportation</option>
            <option value="Security">Security</option>
            <option value="Government">Government</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Job Type</label>
          <select
            name="jobType"
            value={filters.jobType}
            onChange={(e) =>
              setFilters({ ...filters, jobType: e.target.value })
            }
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Daily Wage">Daily Wage</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>
      </div>

      {/* Main Content with Jobs and Map */}
      <div className="dashboard-main-grid">
        {/* Left Side: Tab Content */}
        <div className="dashboard-content">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading jobs...</p>
            </div>
          ) : (
            <>
              {activeTab === "home" && renderHomeTab()}
              {activeTab === "local" && renderLocalEmploymentTab()}
              {activeTab === "foryou" && renderForYouTab()}
            </>
          )}
        </div>

        {/* Right Side: Leaflet Maps */}
        <div className="map-sidebar">
          {renderLeafletMap()}

          {/* Job Statistics */}
          <div className="job-stats">
            <h4>📊 Quick Stats</h4>
            <div className="stat-item">
              <span className="stat-label">Total Jobs:</span>
              <span className="stat-value">{filterJobs(jobs).length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Liked Jobs:</span>
              <span className="stat-value">{likedJobs.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Applications:</span>
              <span className="stat-value">{myApplications.length}</span>
            </div>
            {selectedState && (
              <div className="stat-item">
                <span className="stat-label">📍 In {selectedState}:</span>
                <span className="stat-value">
                  {jobs.filter((j) => j.state === selectedState).length}
                </span>
              </div>
            )}
            {selectedCity && (
              <div className="stat-item">
                <span className="stat-label">🏙️ In {selectedCity}:</span>
                <span className="stat-value">
                  {jobs.filter((j) => j.city === selectedCity).length}
                </span>
              </div>
            )}
            {selectedVillage && (
              <div className="stat-item">
                <span className="stat-label">🏘️ In {selectedVillage}:</span>
                <span className="stat-value">
                  {jobs.filter((j) => j.village === selectedVillage).length}
                </span>
              </div>
            )}
          </div>

          {/* Location-Based Job Info */}
          {(selectedState || selectedCity || selectedVillage) && (
            <div className="location-job-info">
              <h4>📋 Jobs in Selected Location</h4>
              <div className="job-categories-breakdown">
                {(() => {
                  const locationJobs = jobs.filter((j) => {
                    if (selectedVillage && j.village !== selectedVillage)
                      return false;
                    if (selectedCity && j.city !== selectedCity) return false;
                    if (selectedState && j.state !== selectedState)
                      return false;
                    return true;
                  });

                  // Group by category
                  const byCategory = {};
                  locationJobs.forEach((job) => {
                    const cat = job.category || "Other";
                    byCategory[cat] = (byCategory[cat] || 0) + 1;
                  });

                  return Object.entries(byCategory)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([category, count]) => (
                      <div key={category} className="category-stat">
                        <span className="category-name">{category}</span>
                        <div className="category-bar">
                          <div
                            className="category-fill"
                            style={{
                              width: `${(count / locationJobs.length) * 100}%`,
                            }}
                          ></div>
                          <span className="category-count">{count}</span>
                        </div>
                      </div>
                    ));
                })()}
              </div>
            </div>
          )}
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

      {/* Rating Details Modal */}
      {showRatingModal && (
        <div
          className="rating-modal-overlay"
          onClick={() => setShowRatingModal(false)}
        >
          <div
            className="rating-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rating-modal-header">
              <h2>Your Ratings</h2>
              <button
                className="close-modal-btn"
                onClick={() => setShowRatingModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="rating-modal-body">
              {/* Summary */}
              <div className="rating-summary">
                <div className="big-star-display">
                  <span className="big-star">⭐</span>
                  <div className="rating-info">
                    <h3>
                      {(Number(userRating.averageRating) || 0).toFixed(1)}
                    </h3>
                    <p>
                      {Number(userRating.totalRatings) || 0}{" "}
                      {userRating.totalRatings === 1 ? "Rating" : "Ratings"}
                    </p>
                  </div>
                </div>

                {/* Star breakdown */}
                <div className="star-breakdown">
                  <StarRating
                    rating={Math.round(Number(userRating.averageRating) || 0)}
                    readOnly
                    size="large"
                  />
                </div>
              </div>

              {/* Individual Ratings List */}
              <div className="ratings-list">
                <h3>Reviews from Employers</h3>
                {detailedRatings.length === 0 ? (
                  <div className="no-ratings">
                    <p>No ratings yet. Complete jobs to receive ratings!</p>
                  </div>
                ) : (
                  detailedRatings.map((rating, index) => (
                    <div key={index} className="rating-item">
                      <div className="rating-item-header">
                        <div className="employer-info">
                          <strong>{rating.employerName}</strong>
                          <span className="job-title">{rating.jobTitle}</span>
                        </div>
                        <div className="rating-score">
                          <StarRating
                            rating={rating.rating}
                            readOnly
                            size="small"
                          />
                          <span className="rating-value">
                            {rating.rating}/5
                          </span>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      {(rating.punctuality ||
                        rating.workQuality ||
                        rating.communication ||
                        rating.professionalism) && (
                        <div className="performance-metrics">
                          {rating.punctuality && (
                            <div className="metric">
                              <span className="metric-label">Punctuality:</span>
                              <span className="metric-value">
                                {rating.punctuality}/5
                              </span>
                            </div>
                          )}
                          {rating.workQuality && (
                            <div className="metric">
                              <span className="metric-label">
                                Work Quality:
                              </span>
                              <span className="metric-value">
                                {rating.workQuality}/5
                              </span>
                            </div>
                          )}
                          {rating.communication && (
                            <div className="metric">
                              <span className="metric-label">
                                Communication:
                              </span>
                              <span className="metric-value">
                                {rating.communication}/5
                              </span>
                            </div>
                          )}
                          {rating.professionalism && (
                            <div className="metric">
                              <span className="metric-label">
                                Professionalism:
                              </span>
                              <span className="metric-value">
                                {rating.professionalism}/5
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Review Text */}
                      {rating.review && (
                        <div className="review-text">
                          <p>"{rating.review}"</p>
                        </div>
                      )}

                      <div className="rating-date">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeekerDashboard;
