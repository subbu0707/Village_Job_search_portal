// backend_mysql/routes/applicationRoutes.js
const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const { authenticate } = require("../middlewares/auth");

// Protected routes (all require authentication)
router.post("/", authenticate, applicationController.createApplication);
router.get("/my", authenticate, applicationController.getApplicationsBySeeker);
router.get(
  "/seeker/applications",
  authenticate,
  applicationController.getApplicationsBySeeker,
);
router.get(
  "/employer/all",
  authenticate,
  applicationController.getApplicationsByEmployer,
);
router.get(
  "/job/:jobId/applications",
  authenticate,
  applicationController.getApplicationsByJob,
);
router.get(
  "/status-count",
  authenticate,
  applicationController.getApplicationCountByStatus,
);
router.get("/:appId", authenticate, applicationController.getApplicationById);
router.patch(
  "/:appId/status",
  authenticate,
  applicationController.updateApplicationStatus,
);
router.delete("/:appId", authenticate, applicationController.deleteApplication);

module.exports = router;
