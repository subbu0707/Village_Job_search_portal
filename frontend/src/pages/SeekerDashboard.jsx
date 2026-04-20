import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api/api";
import { useTranslation } from "react-i18next";
import ChatWidget from "../components/ChatWidget";

const SeekerDashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [likedJobs, setLikedJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplications, setShowApplications] = useState(false);
  const [showForYou, setShowForYou] = useState(false);
  const [filters, setFilters] = useState({ state: "", city: "", village: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [villages, setVillages] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedChatEmployer, setSelectedChatEmployer] = useState(null);
  const [likedJobIds, setLikedJobIds] = useState(new Set());

  useEffect(() => {
    if (!user || user.role !== "seeker") {
      navigate("/login");
      return;
    }
    loadJobs();
    loadMyApplications();
    loadLikedJobs();
    loadStates();
  }, [user, navigate]);

  // Reload jobs when filters change
  useEffect(() => {
    loadJobs();
  }, [filters, searchQuery]);

  const loadJobs = async () => {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.state) params.append("state", filters.state);
      if (filters.city) params.append("city", filters.city);
      if (searchQuery.trim()) params.append("keyword", searchQuery.trim());

      const endpoint = params.toString()
        ? `/jobs/search?${params.toString()}`
        : "/jobs";
      console.log("📡 Fetching jobs from:", endpoint);

      const response = await api.get(endpoint);
      console.log("✅ Received jobs:", response.data);
      setJobs(response.data.data || []);
    } catch (error) {
      console.error("Error loading jobs:", error);
      setJobs([]);
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
      const liked = response.data.data || [];
      setLikedJobs(liked);
      // Create a set of liked job IDs for quick lookup
      setLikedJobIds(new Set(liked.map((job) => job.id)));
      console.log("❤️ Loaded liked jobs:", liked.length);
    } catch (error) {
      console.error("Error loading liked jobs:", error);
      setLikedJobs([]);
    }
  };

  const loadStates = async () => {
    try {
      const response = await api.get("/locations/states");
      console.log("📍 States loaded:", response.data);
      setStates(response.data.data || []);
    } catch (error) {
      console.error("Error loading states:", error);
    }
  };

  const loadCities = async (stateName) => {
    try {
      const response = await api.get(
        `/locations/cities?state=${encodeURIComponent(stateName)}`
      );
      console.log("🏙️ Cities loaded for", stateName, ":", response.data);
      setCities(response.data.data || []);
      setVillages([]); // Reset villages when state changes
    } catch (error) {
      console.error("Error loading cities:", error);
      setCities([]);
    }
  };

  const loadVillages = async (stateName, cityName) => {
    try {
      const response = await api.get(
        `/locations/villages?state=${encodeURIComponent(
          stateName
        )}&city=${encodeURIComponent(cityName)}`
      );
      console.log("🏘️ Villages loaded for", cityName, ":", response.data);
      setVillages(response.data.data || []);
    } catch (error) {
      console.error("Error loading villages:", error);
      setVillages([]);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      setFilters({ state: value, city: "", village: "" });
      setCities([]);
      setVillages([]);
      if (value) {
        loadCities(value);
      }
    } else if (name === "city") {
      setFilters({ ...filters, city: value, village: "" });
      setVillages([]);
      if (value) {
        loadVillages(filters.state, value);
      }
    } else if (name === "village") {
      setFilters({ ...filters, village: value });
    }
  };

  const handleApplyJob = async (jobId) => {
    try {
      await api.post(`/applications`, { jobId });
      alert(t("Applied successfully!"));
      loadMyApplications();
    } catch (error) {
      console.error("Error applying job:", error);
      alert(
        t("Failed to apply") +
          ": " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleLikeJob = async (jobId) => {
    try {
      const response = await api.post(`/jobs/${jobId}/like`);
      const isLiked = response.data.data.liked;

      // Update likedJobIds set
      setLikedJobIds((prev) => {
        const newSet = new Set(prev);
        if (isLiked) {
          newSet.add(jobId);
        } else {
          newSet.delete(jobId);
        }
        return newSet;
      });

      // Reload liked jobs to update "For You" section
      loadLikedJobs();

      console.log(isLiked ? "❤️ Job liked!" : "💔 Job unliked!");
    } catch (error) {
      console.error("Error liking job:", error);
      alert(
        t("Failed to like job") +
          ": " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleChatWithEmployer = (job) => {
    setSelectedChatEmployer(job);
    setChatOpen(true);
  };

  // Jobs are already filtered on backend via /jobs/search endpoint
  const displayedJobs = jobs;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>{t("Job Seeker Dashboard")}</h1>
        <div style={styles.headerRight}>
          <button
            onClick={() => navigate("/profile")}
            style={styles.profileBtn}
          >
            👤 {t("Profile")}
          </button>
          <button onClick={logout} style={styles.logoutBtn}>
            {t("Logout")}
          </button>
        </div>
      </header>

      <div style={styles.content}>
        {!showApplications && !showForYou && (
          <div>
            {/* Search Section */}
            <div style={styles.searchSection}>
              <h3>{t("Search Jobs")}</h3>
              <div style={styles.searchBar}>
                <input
                  type="text"
                  placeholder={t(
                    "Search by job title, company, or description..."
                  )}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={styles.clearSearch}
                    title={t("Clear search")}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div style={styles.filterSection}>
              <h3>{t("Filter Jobs")}</h3>
              <div style={styles.filterGrid}>
                <div>
                  <label>{t("State")}:</label>
                  <select
                    name="state"
                    value={filters.state}
                    onChange={handleFilterChange}
                    style={styles.select}
                  >
                    <option value="">{t("All States")}</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                {filters.state && (
                  <div>
                    <label>{t("City")}:</label>
                    <select
                      name="city"
                      value={filters.city}
                      onChange={handleFilterChange}
                      style={styles.select}
                    >
                      <option value="">{t("All Cities")}</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {filters.city && (
                  <div>
                    <label>{t("Village")}:</label>
                    <select
                      name="village"
                      value={filters.village}
                      onChange={handleFilterChange}
                      style={styles.select}
                    >
                      <option value="">{t("All Villages")}</option>
                      {villages.map((village) => (
                        <option key={village} value={village}>
                          {village}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div style={styles.actionButtonsRow}>
                <button
                  onClick={() => setShowApplications(true)}
                  style={styles.applicationsBtn}
                >
                  📋 {t("My Applications")} ({myApplications.length})
                </button>
                <button
                  onClick={() => setShowForYou(true)}
                  style={styles.forYouBtn}
                >
                  ❤️ {t("For You")} ({likedJobs.length})
                </button>
              </div>
            </div>

            <div style={styles.jobsList}>
              <h2>
                {t("Available Jobs")} ({displayedJobs.length})
              </h2>
              {displayedJobs.length === 0 ? (
                <p>{t("No jobs found")}</p>
              ) : (
                displayedJobs.map((job) => (
                  <div key={job.id} style={styles.jobCard}>
                    <h3>{job.title}</h3>
                    <p>
                      <strong>{t("Category")}:</strong> {job.category}
                    </p>
                    <p>
                      <strong>{t("Type")}:</strong>{" "}
                      {job.job_type || job.jobType}
                    </p>
                    <p>
                      <strong>{t("Salary")}:</strong> ₹{job.salary_min} - ₹
                      {job.salary_max}
                    </p>
                    <p>
                      <strong>{t("Location")}:</strong> {job.village},{" "}
                      {job.city}, {job.state}
                    </p>
                    <p style={styles.description}>{job.description}</p>
                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => handleLikeJob(job.id)}
                        style={{
                          ...styles.likeBtn,
                          backgroundColor: likedJobIds.has(job.id)
                            ? "#ff4757"
                            : "#dfe4ea",
                          color: likedJobIds.has(job.id) ? "white" : "#2f3542",
                        }}
                      >
                        {likedJobIds.has(job.id) ? "❤️" : "🤍"} {t("Like")}
                      </button>
                      <button
                        onClick={() => handleApplyJob(job.id)}
                        style={styles.applyBtn}
                      >
                        ✅ {t("Apply")}
                      </button>
                      <button
                        onClick={() => handleChatWithEmployer(job)}
                        style={styles.chatBtn}
                      >
                        💬 {t("Chat")}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {showApplications && (
          <div>
            <button
              onClick={() => setShowApplications(false)}
              style={styles.backBtn}
            >
              ← {t("Back")}
            </button>
            <h2>{t("My Applications")}</h2>
            {myApplications.length === 0 ? (
              <p>{t("No applications yet")}</p>
            ) : (
              <div style={styles.applicationsList}>
                {myApplications.map((app) => (
                  <div key={app.id} style={styles.appCard}>
                    <h3>{app.jobTitle}</h3>
                    <p>
                      <strong>{t("Status")}:</strong>{" "}
                      <span style={styles.statusBadge}>{app.status}</span>
                    </p>
                    <p>
                      <strong>{t("Applied on")}:</strong>{" "}
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showForYou && (
          <div>
            <button onClick={() => setShowForYou(false)} style={styles.backBtn}>
              ← {t("Back")}
            </button>
            <h2>❤️ {t("For You - Liked Jobs")}</h2>
            {likedJobs.length === 0 ? (
              <p>
                {t("No liked jobs yet. Start liking jobs to see them here!")}
              </p>
            ) : (
              <div style={styles.jobsList}>
                {likedJobs.map((job) => (
                  <div key={job.id} style={styles.jobCard}>
                    <h3>{job.title}</h3>
                    <p>
                      <strong>{t("Category")}:</strong> {job.category}
                    </p>
                    <p>
                      <strong>{t("Type")}:</strong>{" "}
                      {job.job_type || job.jobType}
                    </p>
                    <p>
                      <strong>{t("Salary")}:</strong> ₹{job.salary_min} - ₹
                      {job.salary_max}
                    </p>
                    <p>
                      <strong>{t("Location")}:</strong> {job.village},{" "}
                      {job.city}, {job.state}
                    </p>
                    <p style={styles.description}>{job.description}</p>
                    <p style={styles.savedDate}>
                      <strong>{t("Saved on")}:</strong>{" "}
                      {new Date(job.saved_at).toLocaleDateString()}
                    </p>
                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => handleLikeJob(job.id)}
                        style={{
                          ...styles.unlikeBtn,
                          backgroundColor: "#ff4757",
                          color: "white",
                        }}
                      >
                        ❤️ {t("Unlike")}
                      </button>
                      <button
                        onClick={() => handleApplyJob(job.id)}
                        style={styles.applyBtn}
                      >
                        ✅ {t("Apply")}
                      </button>
                      <button
                        onClick={() => handleChatWithEmployer(job)}
                        style={styles.chatBtn}
                      >
                        💬 {t("Chat")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {chatOpen && selectedChatEmployer && (
        <ChatWidget
          recipientId={selectedChatEmployer.employer_id}
          recipientName={selectedChatEmployer.employer_name}
          jobId={selectedChatEmployer.id}
          onClose={() => {
            setChatOpen(false);
            setSelectedChatEmployer(null);
          }}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#4F46E5",
    color: "white",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerRight: {
    display: "flex",
    gap: "10px",
  },
  profileBtn: {
    backgroundColor: "#6366F1",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  logoutBtn: {
    backgroundColor: "#EF4444",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },
  searchSection: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  searchBar: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    padding: "12px 40px 12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  clearSearch: {
    position: "absolute",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#9ca3af",
    padding: "4px",
    borderRadius: "4px",
  },
  filterSection: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginBottom: "15px",
  },
  select: {
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "14px",
    width: "100%",
  },
  actionButtonsRow: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },
  applicationsBtn: {
    backgroundColor: "#6366F1",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    flex: 1,
  },
  forYouBtn: {
    backgroundColor: "#ff4757",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    flex: 1,
  },
  jobsList: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  jobCard: {
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "20px",
    marginBottom: "20px",
  },
  description: {
    color: "#6B7280",
    marginTop: "10px",
  },
  savedDate: {
    color: "#9CA3AF",
    fontSize: "14px",
    fontStyle: "italic",
    marginTop: "8px",
  },
  actionButtons: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
    flexWrap: "wrap",
  },
  likeBtn: {
    border: "2px solid #dfe4ea",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  },
  unlikeBtn: {
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  applyBtn: {
    backgroundColor: "#10B981",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  chatBtn: {
    backgroundColor: "#4F46E5",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  backBtn: {
    backgroundColor: "#6B7280",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  applicationsList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  appCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  statusBadge: {
    display: "inline-block",
    backgroundColor: "#DBEAFE",
    color: "#1E40AF",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
  },
};

export default SeekerDashboard;
