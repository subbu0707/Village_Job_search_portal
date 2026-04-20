// Create job_questions table for Q&A feature
require("dotenv").config();
const mysql = require("mysql2/promise");

async function createJobQuestionsTable() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("📊 Creating job_questions table...\n");

    // Create job_questions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS job_questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NOT NULL,
        user_id INT NOT NULL,
        employer_id INT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT,
        status ENUM('pending', 'answered') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        answered_at TIMESTAMP NULL,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_job_id (job_id),
        INDEX idx_user_id (user_id),
        INDEX idx_employer_id (employer_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log("✅ job_questions table created successfully!");
    console.log("\nTable Structure:");
    console.log("  - id: Question ID");
    console.log("  - job_id: Job this question is about");
    console.log("  - user_id: Job seeker who asked");
    console.log("  - employer_id: Employer who should answer");
    console.log("  - question: The question text");
    console.log("  - answer: The answer (NULL if not answered)");
    console.log("  - status: pending/answered");
    console.log("  - created_at: When question was asked");
    console.log("  - answered_at: When answer was provided");
  } catch (error) {
    console.error("❌ Error creating job_questions table:", error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the function
createJobQuestionsTable()
  .then(() => {
    console.log("\n✅ Database setup complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Setup failed:", error);
    process.exit(1);
  });
