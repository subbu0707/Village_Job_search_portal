require('dotenv').config();
const pool = require('./config/db');

async function checkJobs() {
  try {
    // Check table structure
    console.log('\n📋 Jobs Table Structure:');
    const [columns] = await pool.execute('DESCRIBE jobs');
    console.table(columns);

    // Check all jobs
    console.log('\n📊 All Jobs in Database:');
    const [allJobs] = await pool.execute('SELECT id, employerId, title, state, city, village, jobType, salary_min, salary_max, created_at FROM jobs ORDER BY created_at DESC LIMIT 10');
    console.table(allJobs);

    // Check employer IDs
    console.log('\n👥 Unique Employer IDs:');
    const [employers] = await pool.execute('SELECT DISTINCT employerId FROM jobs');
    console.table(employers);

    // Check users table
    console.log('\n👤 Users (Employers):');
    const [users] = await pool.execute('SELECT id, name, email, role FROM users WHERE role = "employer"');
    console.table(users);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkJobs();
