// backend_mysql/routes/complaintRoutes.js
const express = require("express");
const router = express.Router();
const complaintController = require("../controllers/complaintController");
const { authenticate, authorize } = require("../middlewares/auth");

// All routes require authentication
router.use(authenticate);

// Create complaint
router.post("/", complaintController.createComplaint);

// Get user's complaints
router.get("/my-complaints", complaintController.getMyComplaints);

// Get complaint by ID
router.get("/:complaintId", complaintController.getComplaintById);

// Get complaints for a specific job (employer/admin)
router.get("/job/:jobId", complaintController.getJobComplaints);

// Admin only routes
router.get("/", authorize("admin"), complaintController.getAllComplaints);
router.patch(
  "/:complaintId/status",
  authorize("admin"),
  complaintController.updateComplaintStatus
);
router.get(
  "/stats/all",
  authorize("admin"),
  complaintController.getComplaintStats
);

// Delete complaint
router.delete("/:complaintId", complaintController.deleteComplaint);

module.exports = router;
