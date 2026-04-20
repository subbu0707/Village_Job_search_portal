// backend_mysql/routes/jobRoutes.js
const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const { authenticate } = require("../middlewares/auth");

// Public routes
router.get("/", jobController.getAllJobs);
router.get("/public", jobController.getAllJobs);
router.get("/search", jobController.searchJobs);
router.get("/location", jobController.getJobsByLocation);
router.get("/category/:category", jobController.getJobsByCategory);

// Protected routes (employer)
router.post("/", authenticate, jobController.createJob);
router.put("/:jobId", authenticate, jobController.updateJob);
router.patch("/:jobId/close", authenticate, jobController.closeJob);
router.delete("/:jobId", authenticate, jobController.deleteJob);
router.get("/employer/jobs", authenticate, jobController.getJobsByEmployer);
router.get("/my/posted", authenticate, jobController.getJobsByEmployer);

// Protected routes (job seeker - liked jobs)
router.get("/liked/all", authenticate, jobController.getLikedJobs);
router.post("/:jobId/like", authenticate, jobController.toggleLikeJob);
router.get("/:jobId/liked", authenticate, jobController.isJobLiked);

// Keep dynamic route last so it does not capture static paths like /public, /my/posted, /liked/all
router.get("/:jobId", jobController.getJobById);

module.exports = router;
