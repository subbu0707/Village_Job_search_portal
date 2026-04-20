require('dotenv').config();
const pool = require('./config/db');

async function addSavedJobsTable() {
  try {
    console.log('Creating saved_jobs table...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS saved_jobs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        userId INT NOT NULL,
        jobId INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (jobId) REFERENCES jobs(id) ON DELETE CASCADE,
        UNIQUE KEY unique_saved_job (userId, jobId),
        INDEX idx_user_saved (userId),
        INDEX idx_job_saved (jobId)
      )
    `);
    
    console.log('✅ saved_jobs table created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating saved_jobs table:', error.message);
  } finally {
    process.exit();
  }
}

addSavedJobsTable();
