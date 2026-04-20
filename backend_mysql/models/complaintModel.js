// backend_mysql/models/complaintModel.js
const pool = require('../config/db');

// Create a new complaint
exports.createComplaint = async (complaintData) => {
  const { userId, jobId, complaintType, subject, description, priority } = complaintData;
  
  const [result] = await pool.execute(
    `INSERT INTO complaints (userId, jobId, complaintType, subject, description, priority, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [userId, jobId || null, complaintType, subject, description, priority || 'medium']
  );
  
  return result.insertId;
};

// Get complaint by ID
exports.getComplaintById = async (complaintId) => {
  const [rows] = await pool.execute(
    `SELECT c.*, 
            u.name as userName, u.email as userEmail, u.phone as userPhone,
            j.title as jobTitle
     FROM complaints c
     LEFT JOIN users u ON c.userId = u.id
     LEFT JOIN jobs j ON c.jobId = j.id
     WHERE c.id = ?`,
    [complaintId]
  );
  
  return rows[0] || null;
};

// Get complaints by user
exports.getComplaintsByUser = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT c.*, j.title as jobTitle
     FROM complaints c
     LEFT JOIN jobs j ON c.jobId = j.id
     WHERE c.userId = ?
     ORDER BY c.createdAt DESC`,
    [userId]
  );
  
  return rows;
};

// Get complaints by job
exports.getComplaintsByJob = async (jobId) => {
  const [rows] = await pool.execute(
    `SELECT c.*, u.name as userName, u.email as userEmail
     FROM complaints c
     LEFT JOIN users u ON c.userId = u.id
     WHERE c.jobId = ?
     ORDER BY c.createdAt DESC`,
    [jobId]
  );
  
  return rows;
};

// Get all complaints (admin)
exports.getAllComplaints = async (filters = {}) => {
  let query = `SELECT c.*, 
                      u.name as userName, u.email as userEmail,
                      j.title as jobTitle
               FROM complaints c
               LEFT JOIN users u ON c.userId = u.id
               LEFT JOIN jobs j ON c.jobId = j.id
               WHERE 1=1`;
  const params = [];
  
  if (filters.status) {
    query += ' AND c.status = ?';
    params.push(filters.status);
  }
  
  if (filters.complaintType) {
    query += ' AND c.complaintType = ?';
    params.push(filters.complaintType);
  }
  
  if (filters.priority) {
    query += ' AND c.priority = ?';
    params.push(filters.priority);
  }
  
  query += ' ORDER BY c.createdAt DESC';
  
  const [rows] = await pool.execute(query, params);
  return rows;
};

// Update complaint status
exports.updateComplaintStatus = async (complaintId, status, adminNotes = null) => {
  const resolvedAt = status === 'resolved' || status === 'closed' ? 'NOW()' : 'NULL';
  
  await pool.execute(
    `UPDATE complaints 
     SET status = ?, adminNotes = ?, resolvedAt = ${resolvedAt}, updatedAt = NOW()
     WHERE id = ?`,
    [status, adminNotes, complaintId]
  );
};

// Delete complaint
exports.deleteComplaint = async (complaintId) => {
  const [result] = await pool.execute('DELETE FROM complaints WHERE id = ?', [complaintId]);
  return result.affectedRows;
};

// Get complaint statistics
exports.getComplaintStats = async () => {
  const [stats] = await pool.execute(
    `SELECT 
       COUNT(*) as total,
       SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
       SUM(CASE WHEN status = 'investigating' THEN 1 ELSE 0 END) as investigating,
       SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
       SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed,
       SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) as urgent
     FROM complaints`
  );
  
  return stats[0];
};

module.exports = exports;
