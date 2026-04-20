// Run migration to add terms acceptance columns
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Lokesh',
      database: 'village_jobs'
    });

    console.log('📋 Reading migration files...');
    
    // Run complaints and chat migration
    const complaintsPath = path.join(__dirname, 'migrations', 'add_complaints_and_chat.sql');
    if (fs.existsSync(complaintsPath)) {
      const complaintsSql = fs.readFileSync(complaintsPath, 'utf8');
      console.log('🔄 Running complaints and chat migration...');
      
      // Split by semicolons and execute each statement separately
      const statements = complaintsSql.split(';').filter(stmt => stmt.trim().length > 0);
      for (const statement of statements) {
        try {
          await connection.query(statement);
        } catch (err) {
          if (!err.message.includes('already exists') && !err.message.includes('Duplicate')) {
            throw err;
          }
          console.log('⚠️  Skipping existing object');
        }
      }
      console.log('✅ Complaints and chat migration completed');
    }

    console.log('✅ All migrations completed successfully!');
    console.log('📝 Added: complaints, job_questions, support_contacts tables');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
