// backend_mysql/controllers/applicationController.js
const applicationModel = require("../models/applicationModel");

// Create new application
exports.createApplication = async (req, res, next) => {
  try {
    const seekerId = req.user.id;
    const { job_id, jobId } = req.body;
    const finalJobId = job_id || jobId;

    if (!finalJobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    // Check if already applied
    const hasApplied = await applicationModel.hasApplied(finalJobId, seekerId);
    if (hasApplied) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const appId = await applicationModel.createApplication({
      job_id: finalJobId,
      seeker_id: seekerId,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: { id: appId },
    });
  } catch (error) {
    next(error);
  }
};

// Get application by ID
exports.getApplicationById = async (req, res, next) => {
  try {
    const { appId } = req.params;
    const application = await applicationModel.getApplicationById(appId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// Get applications for a job (employer only)
exports.getApplicationsByJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    console.log("🔍 Getting applications for job:", jobId);

    const applications = await applicationModel.getApplicationsByJob(jobId);
    console.log("📊 Found", applications.length, "applications");

    res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("❌ Error in getApplicationsByJob controller:", error);
    next(error);
  }
};

// Get applications by seeker
exports.getApplicationsBySeeker = async (req, res, next) => {
  try {
    const seekerId = req.user.id;
    console.log("🔍 Getting applications for seeker:", seekerId);

    const applications =
      await applicationModel.getApplicationsBySeeker(seekerId);
    console.log("📊 Found", applications.length, "applications");

    res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("❌ Error in getApplicationsBySeeker controller:", error);
    next(error);
  }
};

// Get all applications across employer's jobs
exports.getApplicationsByEmployer = async (req, res, next) => {
  try {
    const employerId = req.user.id;
    console.log("🔍 Getting all applications for employer:", employerId);

    const applications =
      await applicationModel.getApplicationsByEmployer(employerId);
    console.log("📊 Found", applications.length, "employer applications");

    res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("❌ Error in getApplicationsByEmployer controller:", error);
    next(error);
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { appId } = req.params;
    const { status } = req.body;

    console.log("🔄 Updating application status:", { appId, status });

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const validStatuses = [
      "pending",
      "shortlisted",
      "accepted",
      "rejected",
      "withdrawn",
      "completed",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const updatedApplication = await applicationModel.updateApplicationStatus(
      appId,
      status,
    );

    console.log("✅ Application status updated successfully");

    res.json({
      success: true,
      message: "Application status updated successfully",
      data: updatedApplication,
    });
  } catch (error) {
    console.error("❌ Error updating application status:", error);
    next(error);
  }
};

// Delete application
exports.deleteApplication = async (req, res, next) => {
  try {
    const { appId } = req.params;

    await applicationModel.deleteApplication(appId);

    res.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get applications count by status
exports.getApplicationCountByStatus = async (req, res, next) => {
  try {
    const { jobId, status } = req.query;

    if (!jobId || !status) {
      return res.status(400).json({
        success: false,
        message: "Job ID and status are required",
      });
    }

    const count = await applicationModel.countByStatus(jobId, status);

    res.json({
      success: true,
      data: { count, status, jobId },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
