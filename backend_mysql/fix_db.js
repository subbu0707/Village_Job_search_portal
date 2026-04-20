require('dotenv').config();
const pool = require('./config/db');

async function fixDatabase() {
  try {
    // Drop and recreate users table with correct structure
    console.log('Fixing database structure...');
    
    // Disable foreign key checks
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    
    await pool.query('DROP TABLE IF EXISTS saved_jobs');
    await pool.query('DROP TABLE IF EXISTS notifications');
    await pool.query('DROP TABLE IF EXISTS messages');
    await pool.query('DROP TABLE IF EXISTS applications');
    await pool.query('DROP TABLE IF EXISTS jobs');
    await pool.query('DROP TABLE IF EXISTS users');
    
    // Re-enable foreign key checks
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Creating users table...');
    await pool.query(`
      CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role ENUM('seeker', 'employer', 'admin') DEFAULT 'seeker',
        phone VARCHAR(20),
        state VARCHAR(100),
        city VARCHAR(100),
        language VARCHAR(10) DEFAULT 'en',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      )
    `);
    
    console.log('Creating jobs table...');
    await pool.query(`
      CREATE TABLE jobs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        employerId INT NOT NULL,
        state VARCHAR(100),
        city VARCHAR(100),
        village VARCHAR(100),
        salary_min INT,
        salary_max INT,
        jobType VARCHAR(50),
        category VARCHAR(100),
        requirements TEXT,
        isActive BOOLEAN DEFAULT TRUE,
        womenOnly BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (employerId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_state (state),
        INDEX idx_city (city),
        INDEX idx_employer (employerId)
      )
    `);
    
    console.log('Creating applications table...');
    await pool.query(`
      CREATE TABLE applications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        jobId INT NOT NULL,
        seekerId INT NOT NULL,
        status ENUM('pending', 'shortlisted', 'accepted', 'rejected') DEFAULT 'pending',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (jobId) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (seekerId) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_application (jobId, seekerId),
        INDEX idx_status (status)
      )
    `);
    
    console.log('Creating messages table...');
    await pool.query(`
      CREATE TABLE messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        senderId INT NOT NULL,
        receiverId INT NOT NULL,
        message TEXT,
        isRead BOOLEAN DEFAULT FALSE,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiverId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_receiver (receiverId)
      )
    `);
    
    console.log('Creating notifications table...');
    await pool.query(`
      CREATE TABLE notifications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        userId INT NOT NULL,
        message TEXT,
        type VARCHAR(50),
        isRead BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user (userId)
      )
    `);
    
    console.log('✅ Database structure fixed successfully!');
    console.log('You can now register users.');
    
  } catch (error) {
    console.error('❌ Error fixing database:', error.message);
  } finally {
    process.exit();
  }
}

fixDatabase();
