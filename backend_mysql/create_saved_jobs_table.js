// Create saved_jobs table for like functionality
require("dotenv").config();
const mysql = require("mysql2/promise");

async function createSavedJobsTable() {
  let connection;

  try {
    console.log("\n❤️  Creating saved_jobs table...\n");

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("✅ Connected to database");

    // Check if table exists
    const [tables] = await connection.query("SHOW TABLES LIKE 'saved_jobs'");

    if (tables.length > 0) {
      console.log("ℹ️  saved_jobs table already exists");

      // Verify structure
      const [columns] = await connection.query("DESCRIBE saved_jobs");
      console.log("\n📊 Current table structure:");
      columns.forEach((col) => {
        console.log(
          `   ${col.Field} (${col.Type}) ${
            col.Null === "NO" ? "NOT NULL" : "NULL"
          } ${col.Key ? "[" + col.Key + "]" : ""}`
        );
      });
    } else {
      // Create saved_jobs table
      const createTableSQL = `
        CREATE TABLE saved_jobs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          userId INT NOT NULL,
          jobId INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (jobId) REFERENCES jobs(id) ON DELETE CASCADE,
          UNIQUE KEY unique_saved_job (userId, jobId)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `;

      await connection.query(createTableSQL);
      console.log("✅ saved_jobs table created successfully!");

      // Verify table structure
      const [columns] = await connection.query("DESCRIBE saved_jobs");
      console.log("\n📊 Table structure:");
      columns.forEach((col) => {
        console.log(
          `   ${col.Field} (${col.Type}) ${
            col.Null === "NO" ? "NOT NULL" : "NULL"
          } ${col.Key ? "[" + col.Key + "]" : ""}`
        );
      });
    }

    console.log("\n✅ saved_jobs table is ready!\n");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Database connection closed\n");
    }
  }
}

createSavedJobsTable();
