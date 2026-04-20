require("dotenv").config();
const mysql = require("mysql2/promise");

async function testTables() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("✅ Testing table structures:");

    const [msgs] = await conn.query('SHOW TABLES LIKE "messages"');
    console.log("📩 messages table:", msgs.length > 0 ? "EXISTS" : "MISSING");

    const [jobs] = await conn.query('SHOW TABLES LIKE "jobs"');
    console.log("💼 jobs table:", jobs.length > 0 ? "EXISTS" : "MISSING");

    const [qa] = await conn.query('SHOW TABLES LIKE "job_questions"');
    console.log(
      "❓ job_questions table:",
      qa.length > 0 ? "EXISTS" : "MISSING"
    );

    // Test search functionality
    const [searchResults] = await conn.query(
      `
            SELECT id, title, company, description 
            FROM jobs 
            WHERE title LIKE ? OR description LIKE ? OR company LIKE ? 
            LIMIT 3
        `,
      ["%developer%", "%developer%", "%developer%"]
    );
    console.log(
      "🔍 Search test (developer):",
      searchResults.length,
      "results found"
    );

    await conn.end();
    console.log("\n✅ All tests completed successfully!");
  } catch (error) {
    console.log("❌ Error:", error.message);
  }
}

testTables();
