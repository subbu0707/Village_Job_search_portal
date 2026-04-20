// backend_mysql/controllers/complaintController.js
const complaintModel = require('../models/complaintModel');

// Create a new complaint
exports.createComplaint = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { jobId, complaintType, subject, description, priority } = req.body;

    if (!subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Subject and description are required'
      });
    }

    const complaintId = await complaintModel.createComplaint({
      userId,
      jobId,
      complaintType: complaintType || 'other',
      subject,
      description,
      priority: priority || 'medium'
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully. We will investigate and respond soon.',
      data: { id: complaintId }
    });
  } catch (error) {
    next(error);
  }
};

// Get complaint by ID
exports.getComplaintById = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const complaint = await complaintModel.getComplaintById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Only allow user to see their own complaints (unless admin)
    if (userRole !== 'admin' && complaint.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this complaint'
      });
    }

    res.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// Get user's complaints
exports.getMyComplaints = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const complaints = await complaintModel.getComplaintsByUser(userId);

    res.json({
      success: true,
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

// Get complaints for a specific job (employer only)
exports.getJobComplaints = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Verify job ownership if not admin
    if (userRole !== 'admin') {
      const jobModel = require('../models/jobModel');
      const job = await jobModel.getJobById(jobId);
      
      if (!job || job.employerId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view complaints for this job'
        });
      }
    }

    const complaints = await complaintModel.getComplaintsByJob(jobId);

    res.json({
      success: true,
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

// Get all complaints (admin only)
exports.getAllComplaints = async (req, res, next) => {
  try {
    const { status, complaintType, priority } = req.query;

    const complaints = await complaintModel.getAllComplaints({
      status,
      complaintType,
      priority
    });

    res.json({
      success: true,
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

// Update complaint status (admin only)
exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const { status, adminNotes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    await complaintModel.updateComplaintStatus(complaintId, status, adminNotes);

    res.json({
      success: true,
      message: 'Complaint status updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete complaint
exports.deleteComplaint = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const complaint = await complaintModel.getComplaintById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Only allow user to delete their own complaints or admin
    if (userRole !== 'admin' && complaint.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this complaint'
      });
    }

    await complaintModel.deleteComplaint(complaintId);

    res.json({
      success: true,
      message: 'Complaint deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get complaint statistics (admin only)
exports.getComplaintStats = async (req, res, next) => {
  try {
    const stats = await complaintModel.getComplaintStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
