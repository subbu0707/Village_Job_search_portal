// backend_mysql/models/jobQuestionModel.js
const pool = require("../config/db");

// Create a new job question
exports.createQuestion = async (questionData) => {
  const { jobId, seekerId, employerId, question } = questionData;

  const [result] = await pool.execute(
    `INSERT INTO job_questions (job_id, user_id, employer_id, question, status, created_at)
     VALUES (?, ?, ?, ?, 'pending', NOW())`,
    [jobId, seekerId, employerId, question]
  );

  return result.insertId;
};

// Get question by ID
exports.getQuestionById = async (questionId) => {
  const [rows] = await pool.execute(
    `SELECT jq.*, 
            u.name as seekerName, u.email as seekerEmail,
            j.title as jobTitle, j.employer_id as employerId
     FROM job_questions jq
     LEFT JOIN users u ON jq.user_id = u.id
     LEFT JOIN jobs j ON jq.job_id = j.id
     WHERE jq.id = ?`,
    [questionId]
  );

  return rows[0] || null;
};

// Get all questions for a job
exports.getQuestionsByJob = async (jobId, includePrivate = false) => {
  let query = `SELECT jq.*, u.name as seekerName, u.email as seekerEmail
               FROM job_questions jq
               LEFT JOIN users u ON jq.user_id = u.id
               WHERE jq.job_id = ?`;

  query += " ORDER BY jq.created_at DESC";

  const [rows] = await pool.execute(query, [jobId]);
  return rows;
};

// Get questions by seeker
exports.getQuestionsBySeeker = async (seekerId) => {
  const [rows] = await pool.execute(
    `SELECT jq.*, j.title as jobTitle, j.employer_id as employerId
     FROM job_questions jq
     LEFT JOIN jobs j ON jq.job_id = j.id
     WHERE jq.user_id = ?
     ORDER BY jq.created_at DESC`,
    [seekerId]
  );

  return rows;
};

// Answer a question
exports.answerQuestion = async (questionId, answer) => {
  await pool.execute(
    `UPDATE job_questions 
     SET answer = ?, answered_at = NOW(), status = 'answered'
     WHERE id = ?`,
    [answer, questionId]
  );
};

// Delete question
exports.deleteQuestion = async (questionId) => {
  const [result] = await pool.execute(
    "DELETE FROM job_questions WHERE id = ?",
    [questionId]
  );
  return result.affectedRows;
};

// Get unanswered questions count for employer
exports.getUnansweredCount = async (employerId) => {
  const [rows] = await pool.execute(
    `SELECT COUNT(*) as count
     FROM job_questions jq
     INNER JOIN jobs j ON jq.job_id = j.id
     WHERE j.employer_id = ? AND jq.answer IS NULL`,
    [employerId]
  );

  return rows[0]?.count || 0;
};

module.exports = exports;
