// Add missing columns for smooth authentication
require("dotenv").config();
const mysql = require("mysql2/promise");

async function addAuthColumns() {
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
    console.log("\n🔧 Adding authentication-related columns...\n");

    const columnsToAdd = [
      {
        name: "language",
        sql: "ADD COLUMN language VARCHAR(10) DEFAULT 'en' AFTER role",
      },
      {
        name: "terms_accepted",
        sql: "ADD COLUMN terms_accepted BOOLEAN DEFAULT FALSE AFTER is_active",
      },
      {
        name: "terms_accepted_at",
        sql: "ADD COLUMN terms_accepted_at TIMESTAMP NULL AFTER terms_accepted",
      },
      {
        name: "created_at",
        sql: "ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER terms_accepted_at",
      },
      {
        name: "updated_at",
        sql: "ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at",
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

    // Remove old createdAt and updatedAt if they exist
    try {
      await connection.query("ALTER TABLE users DROP COLUMN createdAt");
      console.log("  🗑️  Removed old createdAt column");
    } catch (error) {
      // Column doesn't exist, that's fine
    }

    try {
      await connection.query("ALTER TABLE users DROP COLUMN updatedAt");
      console.log("  🗑️  Removed old updatedAt column");
    } catch (error) {
      // Column doesn't exist, that's fine
    }

    // Show final structure
    console.log("\n📋 Final users table structure:");
    const [columns] = await connection.query("DESCRIBE users");
    console.log("┌─────────────────────┬──────────────────────┬──────────┐");
    console.log("│ Field               │ Type                 │ Null     │");
    console.log("├─────────────────────┼──────────────────────┼──────────┤");
    columns.forEach((col) => {
      const field = col.Field.padEnd(19);
      const type = col.Type.substring(0, 20).padEnd(20);
      const nullable = col.Null.padEnd(8);
      console.log(`│ ${field} │ ${type} │ ${nullable} │`);
    });
    console.log("└─────────────────────┴──────────────────────┴──────────┘");

    console.log("\n✅ Users table is now ready for registration and login!\n");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Database connection closed\n");
    }
  }
}

addAuthColumns();
