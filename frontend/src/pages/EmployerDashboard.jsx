import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api/api";
import { useTranslation } from "react-i18next";
import ChatWidget from "../components/ChatWidget";
import { indianStates, citiesByState, villagesByCity } from "../data/locations";

const EmployerDashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [myJobs, setMyJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [showApplicants, setShowApplicants] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    jobType: "full-time",
    salary: "",
    location: "",
    city: "",
    village: "",
    requirements: "",
    womensOnly: false,
    selectedStateId: "",
    selectedCityId: "",
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [villages, setVillages] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedChatApplicant, setSelectedChatApplicant] = useState(null);
  const [jobFilter, setJobFilter] = useState("all"); // 'all', 'active', 'completed'
  const [loading, setLoading] = useState(false);

  // Rating states
  const [showRatings, setShowRatings] = useState(false);
  const [pendingRatings, setPendingRatings] = useState([]);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [selectedRatingApplicant, setSelectedRatingApplicant] = useState(null);
  const [ratingFormData, setRatingFormData] = useState({
    rating: 5,
    review: "",
    punctuality: 5,
    workQuality: 5,
    communication: 5,
    professionalism: 5,
  });

  // Applications section states
  const [showAllApplications, setShowAllApplications] = useState(false);
  const [allApplications, setAllApplications] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "employer") {
      navigate("/login");
      return;
    }
    console.log("🔵 Component mounted - loading jobs and states");
    loadMyJobs();
    loadStates();
    loadPendingRatings();
  }, [user, navigate]);

  // Force reload jobs when returning to job list view
  useEffect(() => {
    if (!showJobForm && !showApplicants) {
      console.log("🔵 Returned to job list - reloading jobs");
      loadMyJobs();
    }
  }, [showJobForm, showApplicants]);

  const loadMyJobs = async () => {
    try {
      setLoading(true);
      console.log("📞 Calling API: /jobs/my/posted");
      console.log("👤 Current user:", user);
      const response = await api.get("/jobs/my/posted");
      console.log("✅ Jobs response:", response.data);
      const jobs = response.data.data || [];
      console.log("📊 Loaded jobs count:", jobs.length);
      console.log("📋 Jobs details:", jobs);

      // Debug: Check isActive values
      if (jobs.length > 0) {
        console.log("🔍 Checking isActive values:");
        jobs.forEach((job, index) => {
          console.log(`  Job ${index + 1}: ${job.title}`);
          console.log(
            `    - isActive: ${job.isActive} (type: ${typeof job.isActive})`,
          );
          console.log(
            `    - is_active: ${job.is_active} (type: ${typeof job.is_active})`,
          );
        });
      }

      setMyJobs(jobs);

      if (jobs.length === 0) {
        console.log("⚠️ No jobs found for employer");
      }
    } catch (error) {
      console.error("❌ Error loading jobs:", error);
      console.error("❌ Error details:", error.response?.data);
      alert("Error loading jobs. Please check console and try refreshing.");
    } finally {
      setLoading(false);
    }
  };

  const loadStates = () => {
    setStates(indianStates);
  };

  const loadCities = (stateId) => {
    const stateCities = citiesByState[stateId] || [];
    setCities(stateCities);
    setVillages([]);
  };

  const loadVillages = (cityId) => {
    const cityVillages = villagesByCity[cityId] || [];
    setVillages(cityVillages);
  };

  const handleStateChange = (e) => {
    const stateId = e.target.value;
    const stateName = indianStates.find((s) => s.id == stateId)?.name || "";
    setFormData({
      ...formData,
      location: stateName,
      city: "",
      village: "",
      selectedStateId: stateId,
      selectedCityId: "",
    });
    loadCities(stateId);
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    const cityName = cities.find((c) => c.id == cityId)?.name || "";
    setFormData({
      ...formData,
      city: cityName,
      village: "",
      selectedCityId: cityId,
    });
    loadVillages(cityId);
  };

  const handleVillageChange = (e) => {
    const villageId = e.target.value;
    const villageName = villages.find((v) => v.id == villageId)?.name || "";
    setFormData({ ...formData, village: villageName });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();
    try {
      const jobPayload = {
        title: formData.title,
        description: formData.description,
        jobType: formData.jobType,
        salary_min: parseInt(formData.salary) || 0,
        salary_max: parseInt(formData.salary) || 0,
        location_state: formData.location,
        location_city: formData.city,
        village: formData.village,
        category: "General",
        required_skills: formData.requirements,
        women_only: formData.womensOnly ? 1 : 0,
      };

      await api.post("/jobs", jobPayload);
      alert("Job posted successfully!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        jobType: "full-time",
        salary: "",
        location: "",
        city: "",
        village: "",
        requirements: "",
        womensOnly: false,
        selectedStateId: "",
        selectedCityId: "",
      });
      setCities([]);
      setVillages([]);

      // Close form and reload jobs
      setShowJobForm(false);
      setShowApplicants(false);

      // Reload jobs with a small delay to ensure backend has processed
      setTimeout(() => {
        loadMyJobs();
      }, 500);
    } catch (error) {
      console.error("Error posting job:", error);
      alert(
        "Failed to post job: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const handleViewApplicants = async (jobId) => {
    try {
      console.log("📋 Loading applicants for job:", jobId);
      setSelectedJobId(jobId);
      const response = await api.get(`/applications/job/${jobId}/applications`);
      console.log("✅ Applicants response:", response.data);
      setApplicants(response.data.data || []);
      setShowApplicants(true);
    } catch (error) {
      console.error("❌ Error loading applicants:", error);
      console.error("❌ Error details:", error.response?.data);
      alert(
        "Failed to load applicants: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const handleDeleteJob = async (jobId) => {
    console.log("🔵 Delete button clicked for job:", jobId);
    console.log("👤 Current user:", user);
    console.log(
      "🔑 Token:",
      localStorage.getItem("token") ? "Present" : "Missing",
    );

    if (
      !window.confirm(
        "Are you sure you want to delete this job? This action cannot be undone.",
      )
    ) {
      console.log("⚠️ User cancelled deletion");
      return;
    }

    try {
      console.log("🗑️ Sending DELETE request to:", `/jobs/${jobId}`);
      const response = await api.delete(`/jobs/${jobId}`);
      console.log("✅ Delete response:", response.data);
      alert("Job deleted successfully!");

      console.log("🔄 Reloading jobs list...");
      await loadMyJobs();
      console.log("✅ Jobs list reloaded");
    } catch (error) {
      console.error("❌ Error deleting job:", error);
      console.error("📋 Error response:", error.response?.data);
      console.error("🔴 Status code:", error.response?.status);
      const errorMsg =
        error.response?.data?.message || error.message || "Unknown error";
      alert("Failed to delete job: " + errorMsg);
    }
  };

  const handleCloseJob = async (jobId) => {
    console.log("🔵 Close button clicked for job:", jobId);
    console.log("👤 Current user:", user);
    console.log(
      "🔑 Token:",
      localStorage.getItem("token") ? "Present" : "Missing",
    );

    if (
      !window.confirm(
        "Are you sure you want to close this job? It will no longer accept applications.",
      )
    ) {
      console.log("⚠️ User cancelled closing");
      return;
    }

    try {
      console.log("🚫 Sending PATCH request to:", `/jobs/${jobId}/close`);
      const response = await api.patch(`/jobs/${jobId}/close`);
      console.log("✅ Close response:", response.data);
      alert("Job closed successfully!");

      console.log("🔄 Reloading jobs list...");
      await loadMyJobs();
      console.log("✅ Jobs list reloaded");
    } catch (error) {
      console.error("❌ Error closing job:", error);
      console.error("📋 Error response:", error.response?.data);
      console.error("🔴 Status code:", error.response?.status);
      const errorMsg =
        error.response?.data?.message || error.message || "Unknown error";
      alert("Failed to close job: " + errorMsg);
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await api.patch(`/applications/${applicationId}/status`, {
        status: newStatus,
      });
      alert(`Status updated to ${newStatus}`);

      // Reload the appropriate list
      if (selectedJobId) {
        handleViewApplicants(selectedJobId);
      }
      if (showAllApplications) {
        loadAllApplications();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handleChatWithApplicant = (applicant) => {
    setSelectedChatApplicant(applicant);
    setChatOpen(true);
  };

  // Load pending ratings (accepted applicants not yet rated)
  const loadPendingRatings = async () => {
    try {
      console.log("📊 Loading pending ratings...");
      const response = await api.get("/ratings/pending");
      console.log("✅ Pending ratings response:", response.data);
      setPendingRatings(response.data || []);
    } catch (error) {
      console.error("❌ Error loading pending ratings:", error);
      setPendingRatings([]);
    }
  };

  // Load all applications across all jobs
  const loadAllApplications = async () => {
    try {
      console.log("📋 Loading all applications...");
      setLoading(true);

      const response = await api.get("/applications/employer/all");
      const applicationsData = response.data?.data || [];

      // Sort by applied date (newest first)
      applicationsData.sort(
        (a, b) =>
          new Date(b.applied_at || b.appliedAt) -
          new Date(a.applied_at || a.appliedAt),
      );

      console.log("✅ Loaded total applications:", applicationsData.length);
      console.log("📋 All applications data:", applicationsData);
      setAllApplications(applicationsData);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error loading all applications:", error);
      setAllApplications([]);
      setLoading(false);
    }
  };

  // Handle opening rating form for a seeker
  const handleRateSeeker = (applicant) => {
    console.log("⭐ Opening rating form for:", applicant);
    setSelectedRatingApplicant(applicant);
    setShowRatingForm(true);
    setRatingFormData({
      rating: 5,
      review: "",
      punctuality: 5,
      workQuality: 5,
      communication: 5,
      professionalism: 5,
    });
  };

  // Handle rating form input changes
  const handleRatingFormChange = (e) => {
    const { name, value } = e.target;
    setRatingFormData({
      ...ratingFormData,
      [name]: name === "review" ? value : parseInt(value),
    });
  };

  // Submit rating for a job seeker
  const handleSubmitRating = async (e) => {
    e.preventDefault();

    if (!selectedRatingApplicant) {
      alert("No applicant selected");
      return;
    }

    try {
      console.log("📤 Submitting rating:", {
        ...ratingFormData,
        jobId: selectedRatingApplicant.jobId,
        seekerId: selectedRatingApplicant.seekerId,
      });

      const response = await api.post("/ratings", {
        jobId: selectedRatingApplicant.jobId,
        seekerId: selectedRatingApplicant.seekerId,
        ...ratingFormData,
      });

      console.log("✅ Rating submitted:", response.data);

      // Safely handle averageRating (might be null or undefined)
      const avgRating = response.data.averageRating
        ? Number(response.data.averageRating).toFixed(1)
        : "N/A";
      const totalRatings = response.data.totalRatings || 0;

      alert(
        `✨ Rating submitted successfully!\n\nSeeker's new average: ${avgRating} ⭐\nTotal ratings: ${totalRatings}\n\nThank you for your feedback!`,
      );

      // Close form and reload pending ratings
      setShowRatingForm(false);
      setSelectedRatingApplicant(null);
      setShowRatings(false);
      setShowApplicants(true); // Return to applicants view
      loadPendingRatings();

      // Reload the applicants list to show updated status
      if (selectedJobId) {
        handleViewApplicants(selectedJobId);
      }
    } catch (error) {
      console.error("❌ Error submitting rating:", error);
      console.error("📋 Error details:", error.response?.data);
      alert(
        "Failed to submit rating: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  // Mark job as completed (so it can be rated)
  const handleMarkCompleted = async (jobId, seekerId, applicant) => {
    try {
      console.log("✅ Marking job as completed:", { jobId, seekerId });
      await api.post("/ratings/complete-job", { jobId, seekerId });

      // Success message
      alert("Job marked as completed! 🎉\nPlease rate the job seeker now.");

      // Reload pending ratings to get the updated list
      await loadPendingRatings();

      // Find the job details for the rating form
      const job = myJobs.find((j) => j.id === jobId);

      // Immediately open the rating form
      const ratingApplicant = {
        applicationId: applicant.id,
        jobId: jobId,
        seekerId: seekerId,
        seekerName: applicant.seeker_name,
        jobTitle: job?.title || "Completed Job",
        completedAt: new Date().toISOString(),
      };

      console.log("🌟 Opening rating form for:", ratingApplicant);
      setSelectedRatingApplicant(ratingApplicant);
      setShowRatingForm(true);
      setShowApplicants(false); // Close applicants view
      setShowRatings(true); // Show ratings section
    } catch (error) {
      console.error("❌ Error marking job as completed:", error);
      alert(
        "Failed to mark job as completed: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  // Helper function to get status-specific styles
  const getStatusStyle = (status) => {
    const styles = {
      pending: { backgroundColor: "#FFA500", color: "#fff" },
      shortlisted: { backgroundColor: "#9C27B0", color: "#fff" },
      accepted: { backgroundColor: "#4CAF50", color: "#fff" },
      rejected: { backgroundColor: "#f44336", color: "#fff" },
      withdrawn: { backgroundColor: "#757575", color: "#fff" },
      completed: { backgroundColor: "#2196F3", color: "#fff" },
    };
    return styles[status] || { backgroundColor: "#999", color: "#fff" };
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>{t("Employer Dashboard")}</h1>
        <button onClick={logout} style={styles.logoutBtn}>
          {t("Logout")}
        </button>
      </header>

      <div style={styles.content}>
        {!showJobForm &&
          !showApplicants &&
          !showRatings &&
          !showAllApplications && (
            <div>
              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => setShowJobForm(true)}
                  style={styles.primaryBtn}
                >
                  + {t("Post New Job")}
                </button>
                <button
                  onClick={() => {
                    setShowAllApplications(true);
                    loadAllApplications();
                  }}
                  style={styles.applicationsBtn}
                >
                  📋 {t("All Applications")}
                  {allApplications.length > 0 && (
                    <span style={styles.ratingBadge}>
                      {allApplications.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowRatings(true);
                    loadPendingRatings();
                  }}
                  style={styles.ratingBtn}
                >
                  ⭐ {t("Rate Job Seekers")}
                  {pendingRatings.length > 0 && (
                    <span style={styles.ratingBadge}>
                      {pendingRatings.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    console.log("🔄 Force reloading jobs...");
                    loadMyJobs();
                  }}
                  style={styles.refreshBtn}
                >
                  🔄 {t("Refresh Jobs")}
                </button>
              </div>

              {/* Filter Buttons */}
              <div style={styles.filterContainer}>
                <button
                  onClick={() => setJobFilter("all")}
                  style={
                    jobFilter === "all"
                      ? styles.filterBtnActive
                      : styles.filterBtn
                  }
                >
                  📋 {t("All Jobs")}
                </button>
                <button
                  onClick={() => setJobFilter("active")}
                  style={
                    jobFilter === "active"
                      ? styles.filterBtnActive
                      : styles.filterBtn
                  }
                >
                  ✅ {t("Active Jobs")}
                </button>
                <button
                  onClick={() => setJobFilter("completed")}
                  style={
                    jobFilter === "completed"
                      ? styles.filterBtnActive
                      : styles.filterBtn
                  }
                >
                  ✔️ {t("Closed Jobs")}
                </button>
              </div>

              <h2>
                {t("My Posted Jobs")} (
                {
                  myJobs.filter((job) => {
                    const isActive = job.isActive ?? job.is_active;
                    if (jobFilter === "active")
                      return isActive === 1 || isActive === true;
                    if (jobFilter === "completed")
                      return isActive === 0 || isActive === false;
                    return true;
                  }).length
                }
                )
              </h2>

              <div style={styles.jobsList}>
                {loading ? (
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "18px",
                      color: "#667eea",
                    }}
                  >
                    ⏳ Loading jobs...
                  </p>
                ) : myJobs.filter((job) => {
                    const isActive = job.isActive ?? job.is_active;
                    if (jobFilter === "active")
                      return isActive === 1 || isActive === true;
                    if (jobFilter === "completed")
                      return isActive === 0 || isActive === false;
                    return true;
                  }).length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px" }}>
                    <p style={{ fontSize: "18px", color: "#6B7280" }}>
                      {t("No jobs found")}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#9CA3AF",
                        marginTop: "10px",
                      }}
                    >
                      Click "🔄 Refresh Jobs" to reload or "Post New Job" to
                      create one
                    </p>
                  </div>
                ) : (
                  myJobs
                    .filter((job) => {
                      const isActive = job.isActive ?? job.is_active;
                      if (jobFilter === "active")
                        return isActive === 1 || isActive === true;
                      if (jobFilter === "completed")
                        return isActive === 0 || isActive === false;
                      return true;
                    })
                    .map((job) => (
                      <div key={job.id} style={styles.jobCard}>
                        <div style={styles.jobHeader}>
                          <h3>{job.title}</h3>
                          <span
                            style={{
                              ...styles.badge,
                              backgroundColor:
                                (job.isActive ?? job.is_active)
                                  ? "#4CAF50"
                                  : "#757575",
                            }}
                          >
                            {(job.isActive ?? job.is_active)
                              ? "✅ Active"
                              : "✔️ Closed"}
                          </span>
                        </div>
                        <p>
                          <strong>{t("Type")}:</strong> {job.jobType}
                        </p>
                        <p>
                          <strong>{t("Location")}:</strong> {job.state},{" "}
                          {job.city}
                          {job.village ? `, ${job.village}` : ""}
                        </p>
                        <p>
                          <strong>{t("Salary")}:</strong> ₹{job.salary_min} - ₹
                          {job.salary_max}
                        </p>
                        <p>
                          <strong>{t("Posted")}:</strong>{" "}
                          {new Date(job.created_at).toLocaleDateString()}
                        </p>

                        <div style={styles.jobActions}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewApplicants(job.id);
                            }}
                            style={styles.secondaryBtn}
                          >
                            👥 {t("View Applicants")}
                          </button>
                          {((job.isActive ?? job.is_active) === 1 ||
                            (job.isActive ?? job.is_active) === true) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("🔵 Close button clicked!");
                                handleCloseJob(job.id);
                              }}
                              style={styles.warningBtn}
                              title="Close this job"
                            >
                              🚫 {t("Close Job")}
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("🔵 Delete button clicked!");
                              handleDeleteJob(job.id);
                            }}
                            style={styles.dangerBtn}
                            title="Delete this job permanently"
                          >
                            🗑️ {t("Delete")}
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

        {showJobForm && (
          <div style={styles.formContainer}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>✨ {t("Post New Job")}</h2>
              <p style={styles.formSubtitle}>
                Fill in the details below to post your job
              </p>
            </div>
            <form onSubmit={handleSubmitJob} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>💼</span>
                  {t("Job Title")}:
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="e.g., Construction Worker, Farm Worker"
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>📝</span>
                  {t("Description")}:
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Describe the job role, responsibilities, and work environment..."
                  required
                  style={styles.textarea}
                  rows="4"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>⏰</span>
                  {t("Job Type")}:
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleFormChange}
                  style={styles.select}
                >
                  <option value="Full-time">{t("Full-time")}</option>
                  <option value="Part-time">{t("Part-time")}</option>
                  <option value="Contract">{t("Contract")}</option>
                  <option value="Daily Wage">{t("Daily Wage")}</option>
                  <option value="Internship">{t("Internship")}</option>
                  <option value="Freelance">{t("Freelance")}</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>💰</span>
                  {t("Salary")}:
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleFormChange}
                  placeholder="Enter amount in ₹"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>📍</span>
                  {t("State")}:
                </label>
                <select
                  name="location"
                  value={formData.selectedStateId || ""}
                  onChange={handleStateChange}
                  style={styles.select}
                  required
                >
                  <option value="">{t("Select State")}</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>🏙️</span>
                  {t("City")}:
                </label>
                <select
                  name="city"
                  value={formData.selectedCityId || ""}
                  onChange={handleCityChange}
                  style={styles.select}
                  required
                  disabled={!formData.selectedStateId}
                >
                  <option value="">{t("Select City")}</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>🏘️</span>
                  {t("Village")}:
                </label>
                <select
                  name="village"
                  value={formData.village || ""}
                  onChange={handleVillageChange}
                  style={styles.select}
                  disabled={!formData.selectedCityId}
                >
                  <option value="">{t("Select Village (Optional)")}</option>
                  {villages.map((village) => (
                    <option key={village.id} value={village.name}>
                      {village.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>📋</span>
                  {t("Requirements")}:
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleFormChange}
                  placeholder="List the required skills, experience, or qualifications..."
                  style={styles.textarea}
                  rows="3"
                />
              </div>

              <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="womensOnly"
                    checked={formData.womensOnly}
                    onChange={handleFormChange}
                    style={styles.checkbox}
                  />
                  <span style={styles.checkboxText}>
                    👩 {t("Women Only Position")}
                  </span>
                </label>
              </div>

              <div style={{ ...styles.formButtons, gridColumn: "1 / -1" }}>
                <button type="submit" style={styles.submitBtn}>
                  <span style={{ marginRight: "8px" }}>✨</span>
                  {t("Post Job")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowJobForm(false)}
                  style={styles.cancelBtn}
                >
                  {t("Cancel")}
                </button>
              </div>
            </form>
          </div>
        )}

        {showApplicants && (
          <div style={styles.applicantsContainer}>
            <h2>{t("Applicants")}</h2>
            <button
              onClick={() => setShowApplicants(false)}
              style={styles.backBtn}
            >
              ← {t("Back")}
            </button>

            {applicants.length === 0 ? (
              <p>{t("No applicants yet")}</p>
            ) : (
              <div style={styles.applicantsList}>
                {applicants.map((applicant) => (
                  <div key={applicant.id} style={styles.applicantCard}>
                    <h3>{applicant.seeker_name}</h3>
                    <p>
                      <strong>{t("Phone")}:</strong> {applicant.seeker_phone}
                    </p>
                    <p>
                      <strong>{t("Status")}:</strong> {applicant.status}
                    </p>
                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => handleChatWithApplicant(applicant)}
                        style={styles.chatBtn}
                      >
                        💬 {t("Chat")}
                      </button>
                      {applicant.status === "accepted" && (
                        <button
                          onClick={() =>
                            handleMarkCompleted(
                              selectedJobId,
                              applicant.seeker_id,
                              applicant,
                            )
                          }
                          style={styles.completeBtn}
                        >
                          ✅ {t("Mark Completed")}
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleUpdateStatus(applicant.id, "shortlisted")
                        }
                        style={styles.actionBtn}
                      >
                        ⭐ {t("Shortlist")}
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(applicant.id, "accepted")
                        }
                        style={styles.acceptBtn}
                      >
                        ✅ {t("Accept")}
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(applicant.id, "rejected")
                        }
                        style={styles.rejectBtn}
                      >
                        ❌ {t("Reject")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* All Applications Section */}
      {showAllApplications && (
        <div style={styles.applicationsContainer}>
          <div style={styles.applicationsHeader}>
            <h2>📋 All Applications</h2>
            <button
              onClick={() => setShowAllApplications(false)}
              style={styles.backBtn}
            >
              ← {t("Back to Dashboard")}
            </button>
          </div>

          {loading ? (
            <div style={styles.loadingMessage}>
              <p>Loading applications...</p>
            </div>
          ) : allApplications.length === 0 ? (
            <div style={styles.noApplicationsMessage}>
              <h3>📭 No Applications Yet</h3>
              <p>You haven't received any applications yet.</p>
              <p>Post more jobs to attract job seekers!</p>
            </div>
          ) : (
            <div style={styles.applicationsList}>
              <div style={styles.applicationsStats}>
                <p>
                  <strong>Total Applications:</strong> {allApplications.length}
                </p>
                <p>
                  <strong>Pending:</strong>{" "}
                  {allApplications.filter((a) => a.status === "pending").length}
                </p>
                <p>
                  <strong>Shortlisted:</strong>{" "}
                  {
                    allApplications.filter((a) => a.status === "shortlisted")
                      .length
                  }
                </p>
                <p>
                  <strong>Accepted:</strong>{" "}
                  {
                    allApplications.filter((a) => a.status === "accepted")
                      .length
                  }
                </p>
              </div>

              {allApplications.map((application) => (
                <div key={application.id} style={styles.applicationCard}>
                  <div style={styles.applicationHeader}>
                    <div style={styles.applicantInfo}>
                      <img
                        src={
                          application.seeker_profile_picture ||
                          application.seekerProfilePicture ||
                          "https://via.placeholder.com/50"
                        }
                        alt={application.seeker_name || application.seekerName}
                        style={styles.applicantAvatar}
                      />
                      <div>
                        <h3 style={styles.applicantName}>
                          {application.seeker_name || application.seekerName}
                        </h3>
                        <p style={styles.applicantPhone}>
                          📞{" "}
                          {application.seeker_phone || application.seekerPhone}
                        </p>
                      </div>
                    </div>
                    <span
                      style={{
                        ...styles.statusBadge,
                        ...getStatusStyle(application.status),
                      }}
                    >
                      {application.status}
                    </span>
                  </div>

                  <div style={styles.jobInfo}>
                    <h4 style={styles.jobTitle}>💼 {application.jobTitle}</h4>
                    <p style={styles.jobDetails}>
                      📍 {application.jobLocation}
                    </p>
                    <p style={styles.jobDetails}>💰 {application.jobSalary}</p>
                    <p style={styles.jobDetails}>🕒 {application.jobType}</p>
                    <p style={styles.appliedDate}>
                      📅 Applied:{" "}
                      {new Date(
                        application.applied_at || application.appliedAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div style={styles.applicationActions}>
                    {application.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleUpdateStatus(application.id, "shortlisted")
                          }
                          style={styles.shortlistBtn}
                        >
                          ⭐ Shortlist
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(application.id, "accepted")
                          }
                          style={styles.acceptBtn}
                        >
                          ✅ Accept
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(application.id, "rejected")
                          }
                          style={styles.rejectBtn}
                        >
                          ❌ Reject
                        </button>
                      </>
                    )}
                    {application.status === "shortlisted" && (
                      <>
                        <button
                          onClick={() =>
                            handleUpdateStatus(application.id, "accepted")
                          }
                          style={styles.acceptBtn}
                        >
                          ✅ Accept
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(application.id, "rejected")
                          }
                          style={styles.rejectBtn}
                        >
                          ❌ Reject
                        </button>
                      </>
                    )}
                    {application.status === "accepted" && (
                      <button
                        onClick={() =>
                          handleMarkCompleted(
                            application.job_id || application.jobId,
                            application.seeker_id || application.seekerId,
                            application,
                          )
                        }
                        style={styles.completeBtn}
                      >
                        ✅ Mark Completed
                      </button>
                    )}
                    <button
                      onClick={() => handleChatWithApplicant(application)}
                      style={styles.chatBtn}
                    >
                      💬 Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ratings Section */}
      {showRatings && !showRatingForm && (
        <div style={styles.ratingsContainer}>
          <div style={styles.ratingsHeader}>
            <h2>⭐ Rate Job Seekers</h2>
            <button
              onClick={() => setShowRatings(false)}
              style={styles.backBtn}
            >
              ← {t("Back to Dashboard")}
            </button>
          </div>

          {pendingRatings.length === 0 ? (
            <div style={styles.noRatingsMessage}>
              <h3>🎉 All caught up!</h3>
              <p>No pending ratings at the moment.</p>
              <p
                style={{
                  marginTop: "10px",
                  fontSize: "14px",
                  color: "#6B7280",
                }}
              >
                Accepted applicants who complete their jobs will appear here for
                you to rate.
              </p>
            </div>
          ) : (
            <div style={styles.ratingsGrid}>
              {pendingRatings.map((applicant) => (
                <div key={applicant.applicationId} style={styles.ratingCard}>
                  <div style={styles.ratingCardHeader}>
                    <h3>{applicant.seekerName}</h3>
                    <span style={styles.jobTitleBadge}>
                      {applicant.jobTitle}
                    </span>
                  </div>

                  <div style={styles.ratingCardBody}>
                    <p>
                      <strong>📅 Completed:</strong>{" "}
                      {applicant.completedAt
                        ? new Date(applicant.completedAt).toLocaleDateString()
                        : "Recently"}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#6B7280",
                        marginTop: "8px",
                      }}
                    >
                      Rate this job seeker's performance to help them build
                      their reputation
                    </p>
                  </div>

                  <button
                    onClick={() => handleRateSeeker(applicant)}
                    style={styles.rateNowBtn}
                  >
                    ⭐ Rate Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rating Form */}
      {showRatingForm && selectedRatingApplicant && (
        <div style={styles.ratingFormContainer}>
          <div style={styles.ratingFormHeader}>
            <h2>⭐ Rate {selectedRatingApplicant.seekerName}</h2>
            <p style={{ color: "rgba(255, 255, 255, 0.9)", marginTop: "8px" }}>
              Job: {selectedRatingApplicant.jobTitle}
            </p>
          </div>

          <form onSubmit={handleSubmitRating} style={styles.ratingForm}>
            <div style={styles.ratingFormGroup}>
              <label style={styles.ratingLabel}>
                ⭐ Overall Rating (1-5 stars)
              </label>
              <div style={styles.starRatingInput}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setRatingFormData({ ...ratingFormData, rating: star })
                    }
                    style={{
                      ...styles.starButton,
                      color:
                        star <= ratingFormData.rating ? "#FFC107" : "#E5E7EB",
                    }}
                  >
                    ★
                  </button>
                ))}
                <span style={styles.ratingText}>{ratingFormData.rating}/5</span>
              </div>
            </div>

            <div style={styles.ratingFormGroup}>
              <label style={styles.ratingLabel}>📝 Review (Optional)</label>
              <textarea
                name="review"
                value={ratingFormData.review}
                onChange={handleRatingFormChange}
                placeholder="Share your experience working with this job seeker..."
                style={styles.reviewTextarea}
                rows="4"
              />
            </div>

            <div style={styles.metricsGrid}>
              <div style={styles.metricItem}>
                <label style={styles.metricLabel}>⏰ Punctuality</label>
                <input
                  type="range"
                  name="punctuality"
                  min="1"
                  max="5"
                  value={ratingFormData.punctuality}
                  onChange={handleRatingFormChange}
                  style={styles.rangeInput}
                />
                <span style={styles.metricValue}>
                  {ratingFormData.punctuality}/5
                </span>
              </div>

              <div style={styles.metricItem}>
                <label style={styles.metricLabel}>💼 Work Quality</label>
                <input
                  type="range"
                  name="workQuality"
                  min="1"
                  max="5"
                  value={ratingFormData.workQuality}
                  onChange={handleRatingFormChange}
                  style={styles.rangeInput}
                />
                <span style={styles.metricValue}>
                  {ratingFormData.workQuality}/5
                </span>
              </div>

              <div style={styles.metricItem}>
                <label style={styles.metricLabel}>💬 Communication</label>
                <input
                  type="range"
                  name="communication"
                  min="1"
                  max="5"
                  value={ratingFormData.communication}
                  onChange={handleRatingFormChange}
                  style={styles.rangeInput}
                />
                <span style={styles.metricValue}>
                  {ratingFormData.communication}/5
                </span>
              </div>

              <div style={styles.metricItem}>
                <label style={styles.metricLabel}>🎯 Professionalism</label>
                <input
                  type="range"
                  name="professionalism"
                  min="1"
                  max="5"
                  value={ratingFormData.professionalism}
                  onChange={handleRatingFormChange}
                  style={styles.rangeInput}
                />
                <span style={styles.metricValue}>
                  {ratingFormData.professionalism}/5
                </span>
              </div>
            </div>

            <div style={styles.ratingFormButtons}>
              <button type="submit" style={styles.submitRatingBtn}>
                ✨ Submit Rating
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRatingForm(false);
                  setSelectedRatingApplicant(null);
                  setShowRatings(false);
                  setShowApplicants(true); // Return to applicants view
                }}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {chatOpen && selectedChatApplicant && (
        <ChatWidget
          recipientId={selectedChatApplicant.seeker_id}
          recipientName={selectedChatApplicant.seeker_name}
          jobId={selectedJobId}
          onClose={() => {
            setChatOpen(false);
            setSelectedChatApplicant(null);
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
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "25px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
  },
  content: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "30px 20px",
  },
  primaryBtn: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    padding: "15px 30px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "25px",
    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
    transition: "all 0.3s ease",
  },
  secondaryBtn: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "15px",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
    transition: "all 0.3s ease",
    fontWeight: "600",
  },
  logoutBtn: {
    backgroundColor: "#EF4444",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  jobsList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "25px",
    marginTop: "30px",
  },
  jobCard: {
    background: "white",
    border: "2px solid #e5e7eb",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 25px rgba(102, 126, 234, 0.2)",
      borderColor: "#667eea",
    },
  },
  formContainer: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 20px 60px rgba(102, 126, 234, 0.3)",
    marginBottom: "30px",
  },
  formHeader: {
    marginBottom: "30px",
    textAlign: "center",
  },
  formTitle: {
    color: "white",
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "10px",
    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  formSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "16px",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "25px",
    background: "white",
    padding: "35px",
    borderRadius: "15px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    color: "#374151",
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  labelIcon: {
    fontSize: "18px",
  },
  input: {
    padding: "12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "15px",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
    "&:focus": {
      outline: "none",
      borderColor: "#667eea",
      boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
    },
  },
  select: {
    padding: "12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "15px",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
    backgroundColor: "white",
    cursor: "pointer",
  },
  textarea: {
    padding: "12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "15px",
    fontFamily: "inherit",
    resize: "vertical",
    transition: "all 0.3s ease",
    "&:focus": {
      outline: "none",
      borderColor: "#667eea",
      boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
    },
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px",
    background: "#f9fafb",
    borderRadius: "10px",
    cursor: "pointer",
    border: "2px solid #e5e7eb",
    transition: "all 0.3s ease",
  },
  checkbox: {
    width: "20px",
    height: "20px",
    cursor: "pointer",
  },
  checkboxText: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#374151",
  },
  formButtons: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    marginTop: "10px",
  },
  submitBtn: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    padding: "15px 40px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 12px 28px rgba(102, 126, 234, 0.5)",
    },
  },
  cancelBtn: {
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "2px solid #e5e7eb",
    padding: "15px 40px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#e5e7eb",
    },
  },
  applicantsContainer: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  applicantsList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  applicantCard: {
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "15px",
  },
  actionButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "10px",
  },
  chatBtn: {
    backgroundColor: "#4F46E5",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  actionBtn: {
    backgroundColor: "#F59E0B",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  acceptBtn: {
    backgroundColor: "#10B981",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  rejectBtn: {
    backgroundColor: "#EF4444",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  completeBtn: {
    backgroundColor: "#10B981",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
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
  filterContainer: {
    display: "flex",
    gap: "15px",
    marginTop: "20px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  filterBtn: {
    padding: "12px 24px",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    backgroundColor: "white",
    color: "#374151",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  filterBtnActive: {
    padding: "12px 24px",
    border: "2px solid #667eea",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  jobHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  badge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    color: "white",
  },
  jobActions: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
    flexWrap: "wrap",
  },
  warningBtn: {
    backgroundColor: "#F59E0B",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  dangerBtn: {
    backgroundColor: "#EF4444",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  refreshBtn: {
    backgroundColor: "#10B981",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  ratingBtn: {
    background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    color: "white",
    border: "none",
    padding: "15px 30px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    boxShadow: "0 6px 20px rgba(245, 158, 11, 0.4)",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    position: "relative",
  },
  applicationsBtn: {
    background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
    color: "white",
    border: "none",
    padding: "15px 30px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    position: "relative",
  },
  ratingBadge: {
    backgroundColor: "#EF4444",
    color: "white",
    borderRadius: "50%",
    padding: "4px 8px",
    fontSize: "12px",
    fontWeight: "bold",
    marginLeft: "8px",
  },
  applicationsContainer: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "30px 20px",
  },
  applicationsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  applicationsStats: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "25px",
    padding: "20px",
    backgroundColor: "#f0f9ff",
    borderRadius: "12px",
    border: "2px solid #3B82F6",
  },
  applicationsList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "25px",
  },
  applicationCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
  },
  applicationHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px",
  },
  applicantInfo: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  applicantAvatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #3B82F6",
  },
  applicantName: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
    color: "#1f2937",
  },
  applicantPhone: {
    margin: "4px 0 0 0",
    fontSize: "13px",
    color: "#6b7280",
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  jobInfo: {
    backgroundColor: "#f9fafb",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "15px",
  },
  jobTitle: {
    margin: "0 0 10px 0",
    fontSize: "15px",
    fontWeight: "600",
    color: "#374151",
  },
  jobDetails: {
    margin: "6px 0",
    fontSize: "13px",
    color: "#6b7280",
  },
  appliedDate: {
    margin: "8px 0 0 0",
    fontSize: "12px",
    color: "#9ca3af",
    fontStyle: "italic",
  },
  applicationActions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  shortlistBtn: {
    backgroundColor: "#9C27B0",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
  completeBtn: {
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
  noApplicationsMessage: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    border: "2px dashed #d1d5db",
  },
  loadingMessage: {
    textAlign: "center",
    padding: "60px 20px",
    fontSize: "16px",
    color: "#6b7280",
  },
  ratingsContainer: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "30px 20px",
  },
  ratingsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  ratingsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "25px",
  },
  ratingCard: {
    background: "white",
    border: "2px solid #e5e7eb",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
  },
  ratingCardHeader: {
    marginBottom: "15px",
  },
  jobTitleBadge: {
    display: "inline-block",
    backgroundColor: "#667eea",
    color: "white",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "bold",
    marginTop: "8px",
  },
  ratingCardBody: {
    marginBottom: "20px",
  },
  rateNowBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
  },
  noRatingsMessage: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "white",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  },
  ratingFormContainer: {
    maxWidth: "900px",
    margin: "30px auto",
    background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 20px 60px rgba(245, 158, 11, 0.3)",
  },
  ratingFormHeader: {
    marginBottom: "30px",
    textAlign: "center",
    color: "white",
  },
  ratingForm: {
    background: "white",
    padding: "35px",
    borderRadius: "15px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },
  ratingFormGroup: {
    marginBottom: "25px",
  },
  ratingLabel: {
    display: "block",
    color: "#374151",
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "12px",
  },
  starRatingInput: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  starButton: {
    background: "none",
    border: "none",
    fontSize: "40px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    padding: "0",
  },
  ratingText: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#374151",
    marginLeft: "15px",
  },
  reviewTextarea: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "15px",
    fontFamily: "inherit",
    resize: "vertical",
    transition: "all 0.3s ease",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "25px",
  },
  metricItem: {
    padding: "15px",
    backgroundColor: "#f9fafb",
    borderRadius: "10px",
    border: "2px solid #e5e7eb",
  },
  metricLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "10px",
  },
  rangeInput: {
    width: "100%",
    cursor: "pointer",
    marginBottom: "8px",
  },
  metricValue: {
    display: "block",
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#667eea",
  },
  ratingFormButtons: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    marginTop: "30px",
  },
  submitRatingBtn: {
    background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    color: "white",
    border: "none",
    padding: "15px 40px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    boxShadow: "0 8px 20px rgba(245, 158, 11, 0.4)",
    transition: "all 0.3s ease",
  },
};

export default EmployerDashboard;
