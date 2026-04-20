// backend_mysql/routes/jobQuestionRoutes.js
const express = require("express");
const router = express.Router();
const jobQuestionController = require("../controllers/jobQuestionController");
const { authenticate } = require("../middlewares/auth");

// All routes require authentication
router.use(authenticate);

// Ask a question about a job
router.post("/", jobQuestionController.askQuestion);

// Get all questions for a job
router.get("/job/:jobId", jobQuestionController.getJobQuestions);

// Get questions asked by current user
router.get("/my-questions", jobQuestionController.getMyQuestions);

// Answer a question (employer)
router.patch("/:questionId/answer", jobQuestionController.answerQuestion);

// Delete a question
router.delete("/:questionId", jobQuestionController.deleteQuestion);

// Get unanswered questions count
router.get("/unanswered/count", jobQuestionController.getUnansweredCount);

module.exports = router;
