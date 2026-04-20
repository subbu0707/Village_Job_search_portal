// Run migration to add rating system
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function runMigration() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "village_jobs",
    });

    console.log("📋 Reading ratings migration file...");

    const migrationPath = path.join(
      __dirname,
      "migrations",
      "add_ratings_system.sql"
    );
    if (fs.existsSync(migrationPath)) {
      const migrationSql = fs.readFileSync(migrationPath, "utf8");
      console.log("🔄 Running ratings system migration...");

      // Split by semicolons and execute each statement separately
      const statements = migrationSql
        .split(";")
        .filter((stmt) => stmt.trim().length > 0);
      for (const statement of statements) {
        try {
          await connection.query(statement);
          console.log("✅ Executed statement successfully");
        } catch (err) {
          if (
            !err.message.includes("already exists") &&
            !err.message.includes("Duplicate") &&
            !err.message.includes("duplicate column")
          ) {
            throw err;
          }
          console.log("⚠️  Skipping: Column or table already exists");
        }
      }
      console.log("✅ Ratings system migration completed!");
      console.log("📝 Added:");
      console.log("   - ratings table");
      console.log("   - users.averageRating, users.totalRatings columns");
      console.log(
        "   - applications.completedAt, applications.isRated columns"
      );
    } else {
      console.error("❌ Migration file not found:", migrationPath);
      process.exit(1);
    }

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
}

runMigration();
