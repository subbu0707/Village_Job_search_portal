// Create users table in village_jobs database
require("dotenv").config();
const mysql = require("mysql2/promise");

async function createUsersTable() {
  let connection;

  try {
    console.log("\n🔍 Connecting to MySQL...");

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("✅ Connected to database:", process.env.DB_NAME);

    // Drop table if exists (optional - comment out if you want to keep existing data)
    // await connection.query('DROP TABLE IF EXISTS users');
    // console.log('🗑️  Dropped existing users table (if any)');

    // Create users table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        name VARCHAR(255) NOT NULL,
        role ENUM('seeker', 'employer', 'admin') DEFAULT 'seeker',
        password VARCHAR(255) NOT NULL,
        skills TEXT,
        bio TEXT,
        location VARCHAR(255),
        profile_image VARCHAR(255),
        is_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_phone (phone)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.query(createTableQuery);
    console.log("✅ Users table created successfully!");

    // Show table structure
    const [columns] = await connection.query("DESCRIBE users");
    console.log("\n📋 Users table structure:");
    console.log("┌─────────────────┬──────────────────┬──────────┬─────────┐");
    console.log("│ Field           │ Type             │ Null     │ Key     │");
    console.log("├─────────────────┼──────────────────┼──────────┼─────────┤");
    columns.forEach((col) => {
      const field = col.Field.padEnd(15);
      const type = col.Type.padEnd(16);
      const nullable = col.Null.padEnd(8);
      const key = col.Key.padEnd(7);
      console.log(`│ ${field} │ ${type} │ ${nullable} │ ${key} │`);
    });
    console.log("└─────────────────┴──────────────────┴──────────┴─────────┘");

    // Check if table has any data
    const [rows] = await connection.query(
      "SELECT COUNT(*) as count FROM users"
    );
    console.log(`\n📊 Current records in users table: ${rows[0].count}`);

    console.log("\n✅ Setup completed successfully!\n");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error("Error code:", error.code);

    if (error.code === "ER_TABLE_EXISTS_ERROR") {
      console.log("\n💡 Table already exists. No changes made.\n");
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Database connection closed\n");
    }
  }
}

createUsersTable();
