// Check and fix jobs table structure
require("dotenv").config();
const mysql = require("mysql2/promise");

async function checkAndFixJobsTable() {
  let connection;

  try {
    console.log("\n🔍 Checking jobs table structure...\n");

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("✅ Connected to database");

    // Check current structure
    const [columns] = await connection.query("DESCRIBE jobs");

    console.log("\n📋 Current jobs table structure:");
    columns.forEach((col) => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });

    // Check if we need to rename or add columns
    const columnNames = columns.map((col) => col.Field);

    console.log("\n🔧 Fixing column names and adding missing columns...\n");

    // Rename employerId to employer_id if needed
    if (
      columnNames.includes("employerId") &&
      !columnNames.includes("employer_id")
    ) {
      await connection.query(
        "ALTER TABLE jobs CHANGE employerId employer_id INT"
      );
      console.log("✅ Renamed employerId to employer_id");
    } else if (
      !columnNames.includes("employer_id") &&
      !columnNames.includes("employerId")
    ) {
      await connection.query(
        "ALTER TABLE jobs ADD COLUMN employer_id INT AFTER id"
      );
      console.log("✅ Added employer_id column");
    }

    // Add missing columns
    const columnsToAdd = [
      { name: "title", sql: "ADD COLUMN title VARCHAR(255) NOT NULL" },
      { name: "description", sql: "ADD COLUMN description TEXT" },
      {
        name: "jobType",
        sql: "ADD COLUMN jobType VARCHAR(50) DEFAULT 'Full-time'",
      },
      { name: "salary_min", sql: "ADD COLUMN salary_min INT" },
      { name: "salary_max", sql: "ADD COLUMN salary_max INT" },
      { name: "state", sql: "ADD COLUMN state VARCHAR(100)" },
      { name: "city", sql: "ADD COLUMN city VARCHAR(100)" },
      { name: "village", sql: "ADD COLUMN village VARCHAR(100)" },
      {
        name: "category",
        sql: "ADD COLUMN category VARCHAR(100) DEFAULT 'General'",
      },
      { name: "requirements", sql: "ADD COLUMN requirements TEXT" },
      { name: "womenOnly", sql: "ADD COLUMN womenOnly BOOLEAN DEFAULT FALSE" },
      { name: "isActive", sql: "ADD COLUMN isActive BOOLEAN DEFAULT TRUE" },
      {
        name: "created_at",
        sql: "ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
      },
      {
        name: "updated_at",
        sql: "ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
      },
    ];

    for (const col of columnsToAdd) {
      if (!columnNames.includes(col.name)) {
        try {
          await connection.query(`ALTER TABLE jobs ${col.sql}`);
          console.log(`✅ Added column: ${col.name}`);
        } catch (error) {
          if (error.code !== "ER_DUP_FIELDNAME") {
            console.log(`⚠️  Error adding ${col.name}:`, error.message);
          }
        }
      }
    }

    // Show final structure
    const [finalColumns] = await connection.query("DESCRIBE jobs");
    console.log("\n📋 Final jobs table structure:");
    console.log("┌─────────────────────┬──────────────────────┬──────────┐");
    console.log("│ Field               │ Type                 │ Null     │");
    console.log("├─────────────────────┼──────────────────────┼──────────┤");
    finalColumns.forEach((col) => {
      const field = col.Field.padEnd(19);
      const type = col.Type.substring(0, 20).padEnd(20);
      const nullable = col.Null.padEnd(8);
      console.log(`│ ${field} │ ${type} │ ${nullable} │`);
    });
    console.log("└─────────────────────┴──────────────────────┴──────────┘");

    console.log("\n✅ Jobs table is now ready for seeding!\n");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Database connection closed\n");
    }
  }
}

checkAndFixJobsTable();
