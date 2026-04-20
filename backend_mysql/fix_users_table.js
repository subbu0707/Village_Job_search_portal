// Check and fix users table structure
require("dotenv").config();
const mysql = require("mysql2/promise");

async function fixUsersTable() {
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

    // Check current structure
    console.log("\n📋 Current users table structure:");
    const [currentColumns] = await connection.query("DESCRIBE users");
    currentColumns.forEach((col) => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });

    // Add missing columns
    console.log("\n🔧 Adding missing columns...");

    const columnsToAdd = [
      {
        name: "state",
        sql: "ADD COLUMN state VARCHAR(100) AFTER location",
      },
      {
        name: "city",
        sql: "ADD COLUMN city VARCHAR(100) AFTER state",
      },
      {
        name: "village",
        sql: "ADD COLUMN village VARCHAR(100) AFTER city",
      },
      {
        name: "pincode",
        sql: "ADD COLUMN pincode VARCHAR(10) AFTER village",
      },
      {
        name: "address",
        sql: "ADD COLUMN address TEXT AFTER pincode",
      },
      {
        name: "experience",
        sql: "ADD COLUMN experience TEXT AFTER skills",
      },
      {
        name: "education",
        sql: "ADD COLUMN education VARCHAR(255) AFTER experience",
      },
      {
        name: "preferred_job_type",
        sql: "ADD COLUMN preferred_job_type ENUM('full-time', 'part-time', 'contract', 'daily-wage') AFTER education",
      },
    ];

    for (const column of columnsToAdd) {
      try {
        await connection.query(`ALTER TABLE users ${column.sql}`);
        console.log(`  ✅ Added column: ${column.name}`);
      } catch (error) {
        if (error.code === "ER_DUP_FIELDNAME") {
          console.log(`  ⏭️  Column already exists: ${column.name}`);
        } else {
          console.log(`  ⚠️  Error adding ${column.name}:`, error.message);
        }
      }
    }

    // Show updated structure
    console.log("\n📋 Updated users table structure:");
    const [updatedColumns] = await connection.query("DESCRIBE users");
    console.log("┌─────────────────────┬──────────────────────┬──────────┐");
    console.log("│ Field               │ Type                 │ Null     │");
    console.log("├─────────────────────┼──────────────────────┼──────────┤");
    updatedColumns.forEach((col) => {
      const field = col.Field.padEnd(19);
      const type = col.Type.substring(0, 20).padEnd(20);
      const nullable = col.Null.padEnd(8);
      console.log(`│ ${field} │ ${type} │ ${nullable} │`);
    });
    console.log("└─────────────────────┴──────────────────────┴──────────┘");

    console.log("\n✅ Users table structure updated successfully!\n");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Database connection closed\n");
    }
  }
}

fixUsersTable();
