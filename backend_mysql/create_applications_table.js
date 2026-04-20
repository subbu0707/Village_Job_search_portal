// Create applications table
require("dotenv").config();
const mysql = require("mysql2/promise");

async function createApplicationsTable() {
  let connection;

  try {
    console.log("\n📋 Creating applications table...\n");

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("✅ Connected to database");

    // Drop table if exists (for clean creation)
    await connection.query("DROP TABLE IF EXISTS applications");
    console.log("🗑️  Dropped old applications table (if existed)");

    // Create applications table
    const createTableSQL = `
      CREATE TABLE applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NOT NULL,
        user_id INT NOT NULL,
        status ENUM('pending', 'accepted', 'rejected', 'withdrawn') DEFAULT 'pending',
        cover_letter TEXT,
        resume_url VARCHAR(500),
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_application (job_id, user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.query(createTableSQL);
    console.log("✅ Applications table created successfully!");

    // Verify table structure
    const [columns] = await connection.query("DESCRIBE applications");
    console.log("\n📊 Table structure:");
    columns.forEach((col) => {
      console.log(
        `   ${col.Field} (${col.Type}) ${
          col.Null === "NO" ? "NOT NULL" : "NULL"
        } ${col.Key ? "[" + col.Key + "]" : ""}`
      );
    });

    console.log("\n✅ Applications table is ready!\n");
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

createApplicationsTable();
