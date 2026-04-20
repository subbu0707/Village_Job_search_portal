// backend_mysql/controllers/jobQuestionController.js
const jobQuestionModel = require("../models/jobQuestionModel");
const jobModel = require("../models/jobModel");

// Ask a question about a job
exports.askQuestion = async (req, res, next) => {
  try {
    const seekerId = req.user.id;
    const { jobId, question } = req.body;

    if (!jobId || !question) {
      return res.status(400).json({
        success: false,
        message: "Job ID and question are required",
      });
    }

    // Verify job exists and get employer ID
    const job = await jobModel.getJobById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const questionId = await jobQuestionModel.createQuestion({
      jobId,
      seekerId,
      employerId: job.employer_id,
      question,
    });

    res.status(201).json({
      success: true,
      message:
        "Question submitted successfully. The employer will respond soon.",
      data: { id: questionId },
    });
  } catch (error) {
    next(error);
  }
};

// Get all questions for a job
exports.getJobQuestions = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    // Check if job exists
    const job = await jobModel.getJobById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const questions = await jobQuestionModel.getQuestionsByJob(jobId);

    res.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

// Get questions asked by current user
exports.getMyQuestions = async (req, res, next) => {
  try {
    const seekerId = req.user.id;
    const questions = await jobQuestionModel.getQuestionsBySeeker(seekerId);

    res.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

// Answer a question (employer only)
exports.answerQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { answer } = req.body;
    const userId = req.user.id;

    if (!answer) {
      return res.status(400).json({
        success: false,
        message: "Answer is required",
      });
    }

    const question = await jobQuestionModel.getQuestionById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Verify user is the employer
    if (question.employerId !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to answer this question",
      });
    }

    await jobQuestionModel.answerQuestion(questionId, answer);

    res.json({
      success: true,
      message: "Answer posted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Delete a question
exports.deleteQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const question = await jobQuestionModel.getQuestionById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Only seeker who asked or employer or admin can delete
    if (
      question.seekerId !== userId &&
      question.employerId !== userId &&
      userRole !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this question",
      });
    }

    await jobQuestionModel.deleteQuestion(questionId);

    res.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get unanswered questions count for employer
exports.getUnansweredCount = async (req, res, next) => {
  try {
    const employerId = req.user.id;
    const count = await jobQuestionModel.getUnansweredCount(employerId);

    res.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
