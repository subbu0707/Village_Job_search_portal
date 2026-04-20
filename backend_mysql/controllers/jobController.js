// backend_mysql/controllers/jobController.js
const jobModel = require("../models/jobModel");

// Create new job
exports.createJob = async (req, res, next) => {
  try {
    const employerId = req.user.id;
    console.log("✨ Creating job for employer ID:", employerId);
    console.log("📝 Job data received:", req.body);

    const {
      title,
      description,
      jobType,
      salary_min,
      salary_max,
      location_state,
      location_city,
      village,
      category,
      required_skills,
      women_only,
      deadline,
    } = req.body;

    // Validation
    if (!title || !description || !location_state || !location_city) {
      return res.status(400).json({
        success: false,
        message: "Title, description, state, and city are required",
      });
    }

    const jobId = await jobModel.createJob({
      employer_id: employerId,
      title,
      description,
      jobType: jobType || "Full-time",
      salary_min: salary_min || null,
      salary_max: salary_max || null,
      location_state,
      location_city,
      village: village || null,
      category: category || "General",
      required_skills: required_skills || null,
      women_only: women_only || 0,
      deadline: deadline || null,
    });

    console.log("✅ Job created successfully with ID:", jobId);

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      data: { id: jobId },
    });
  } catch (error) {
    next(error);
  }
};

// Get all jobs
exports.getAllJobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5000; // Increased to show all jobs
    const offset = (page - 1) * limit;

    const jobs = await jobModel.getAllJobs(limit, offset);

    res.json({
      success: true,
      data: jobs,
      pagination: { page, limit, total: jobs.length },
    });
  } catch (error) {
    next(error);
  }
};

// Get job by ID
exports.getJobById = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const job = await jobModel.getJobById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// Get jobs by employer
exports.getJobsByEmployer = async (req, res, next) => {
  try {
    const employerId = req.user.id;
    console.log("🔍 Getting jobs for employer ID:", employerId);

    const jobs = await jobModel.getJobsByEmployer(employerId);
    console.log("📊 Found jobs:", jobs.length);
    console.log("📋 Jobs data:", JSON.stringify(jobs, null, 2));

    res.json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error("❌ Error in controller getting jobs:", error);
    next(error);
  }
};

// Get jobs by location
exports.getJobsByLocation = async (req, res, next) => {
  try {
    const { state, city } = req.query;

    if (!state || !city) {
      return res.status(400).json({
        success: false,
        message: "State and city are required",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const jobs = await jobModel.getJobsByLocation(state, city, limit, offset);

    res.json({
      success: true,
      data: jobs,
      pagination: { page, limit },
    });
  } catch (error) {
    next(error);
  }
};

// Search jobs
exports.searchJobs = async (req, res, next) => {
  try {
    const { keyword, state, city, category, salary_min, salary_max } =
      req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const filters = {};
    if (state) filters.state = state;
    if (city) filters.city = city;
    if (category) filters.category = category;
    if (salary_min) filters.salary_min = parseInt(salary_min);
    if (salary_max) filters.salary_max = parseInt(salary_max);
    if (keyword) filters.keyword = keyword;

    const jobs = await jobModel.searchJobs(filters, limit, offset);

    res.json({
      success: true,
      data: jobs,
      pagination: { page, limit },
    });
  } catch (error) {
    next(error);
  }
};

// Get jobs by category
exports.getJobsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const jobs = await jobModel.getJobsByCategory(category, limit, offset);

    res.json({
      success: true,
      data: jobs,
      pagination: { page, limit },
    });
  } catch (error) {
    next(error);
  }
};

// Update job
exports.updateJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const employerId = req.user.id;
    const updateData = req.body;

    const job = await jobModel.getJobById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.employer_id !== employerId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this job",
      });
    }

    const updatedJob = await jobModel.updateJob(jobId, updateData);

    res.json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    next(error);
  }
};

// Close job
exports.closeJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const employerId = req.user.id;

    console.log("🚫 Closing job:", jobId, "by employer:", employerId);

    const job = await jobModel.getJobById(jobId);
    if (!job) {
      console.log("❌ Job not found:", jobId);
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    console.log("📋 Job found:", job);
    console.log("🔍 Checking authorization...");
    console.log("   - job.employer_id:", job.employer_id);
    console.log("   - req.user.id:", employerId);

    // Check both camelCase and snake_case for compatibility
    const jobEmployerId = job.employer_id || job.employerId;

    if (jobEmployerId !== employerId) {
      console.log("❌ Authorization failed!");
      return res.status(403).json({
        success: false,
        message: "Not authorized to close this job",
      });
    }

    await jobModel.closeJob(jobId);

    console.log("✅ Job closed successfully");

    res.json({
      success: true,
      message: "Job closed successfully",
    });
  } catch (error) {
    console.error("❌ Error closing job:", error);
    next(error);
  }
};

// Delete job
exports.deleteJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const employerId = req.user.id;

    console.log("🗑️ Deleting job:", jobId, "by employer:", employerId);

    const job = await jobModel.getJobById(jobId);
    if (!job) {
      console.log("❌ Job not found:", jobId);
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    console.log("📋 Job found:", job);
    console.log("🔍 Checking authorization...");
    console.log("   - job.employer_id:", job.employer_id);
    console.log("   - req.user.id:", employerId);

    // Check both camelCase and snake_case for compatibility
    const jobEmployerId = job.employer_id || job.employerId;

    if (jobEmployerId !== employerId) {
      console.log("❌ Authorization failed!");
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this job",
      });
    }

    await jobModel.deleteJob(jobId);

    console.log("✅ Job deleted successfully");

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting job:", error);
    next(error);
  }
};

// Like/Unlike job
exports.toggleLikeJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const job = await jobModel.getJobById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const isLiked = await jobModel.toggleLikeJob(userId, jobId);

    res.json({
      success: true,
      message: isLiked ? "Job liked successfully" : "Job unliked successfully",
      data: { liked: isLiked },
    });
  } catch (error) {
    next(error);
  }
};

// Get liked jobs by user
exports.getLikedJobs = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const jobs = await jobModel.getLikedJobs(userId, limit, offset);

    res.json({
      success: true,
      data: jobs,
      pagination: { page, limit },
    });
  } catch (error) {
    next(error);
  }
};

// Check if job is liked by user
exports.isJobLiked = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const isLiked = await jobModel.isJobLiked(userId, jobId);

    res.json({
      success: true,
      data: { liked: isLiked },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
