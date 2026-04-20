// Test MySQL connection
require("dotenv").config();
const mysql = require("mysql2/promise");

async function testConnection() {
  try {
    console.log("\n🔍 Testing MySQL Connection...");
    console.log("Host:", process.env.DB_HOST);
    console.log("User:", process.env.DB_USER);
    console.log("Database:", process.env.DB_NAME);
    console.log(
      "Password:",
      process.env.DB_PASSWORD
        ? "***" + process.env.DB_PASSWORD.slice(-3)
        : "NOT SET"
    );

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log("✅ Connected to MySQL successfully!\n");

    // Create database if not exists
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );
    console.log(`✅ Database '${process.env.DB_NAME}' ready\n`);

    // Show databases
    const [databases] = await connection.query("SHOW DATABASES");
    console.log("📋 Available databases:");
    databases.forEach((db) => console.log("  -", db.Database));

    await connection.end();
    console.log("\n✅ Connection test completed successfully!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Connection failed:", error.message);
    console.error("Error code:", error.code);
    console.error("\n💡 Please check:");
    console.error("  1. MySQL is running");
    console.error("  2. Username and password are correct");
    console.error("  3. MySQL port 3306 is accessible\n");
    process.exit(1);
  }
}

testConnection();
