// Test job retrieval with location filters
require("dotenv").config();
const mysql = require("mysql2/promise");

async function testJobRetrieval() {
  let connection;

  try {
    console.log("\n🔍 Testing job retrieval with location filters...\n");

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("✅ Connected to database");

    // Test 1: Get all jobs
    console.log("\n📊 Test 1: Get all active jobs");
    const [allJobs] = await connection.query(
      "SELECT COUNT(*) as count FROM jobs WHERE is_active = 1"
    );
    console.log(`   Total active jobs: ${allJobs[0].count}`);

    // Test 2: Get jobs by state
    console.log("\n📍 Test 2: Get jobs by state (Tamil Nadu)");
    const [stateJobs] = await connection.query(
      "SELECT COUNT(*) as count FROM jobs WHERE is_active = 1 AND state = ?",
      ["Tamil Nadu"]
    );
    console.log(`   Jobs in Tamil Nadu: ${stateJobs[0].count}`);

    // Test 3: Get jobs by state and city
    console.log(
      "\n🏙️ Test 3: Get jobs by state and city (Tamil Nadu, Chennai)"
    );
    const [cityJobs] = await connection.query(
      "SELECT COUNT(*) as count FROM jobs WHERE is_active = 1 AND state = ? AND city = ?",
      ["Tamil Nadu", "Chennai"]
    );
    console.log(`   Jobs in Chennai: ${cityJobs[0].count}`);

    // Test 4: Get jobs by village
    console.log(
      "\n🏘️ Test 4: Get jobs by village (Tamil Nadu, Chennai, Tambaram)"
    );
    const [villageJobs] = await connection.query(
      "SELECT * FROM jobs WHERE is_active = 1 AND state = ? AND city = ? AND village = ? LIMIT 5",
      ["Tamil Nadu", "Chennai", "Tambaram"]
    );
    console.log(`   Jobs in Tambaram: ${villageJobs.length}`);
    if (villageJobs.length > 0) {
      console.log("\n   Sample jobs:");
      villageJobs.forEach((job, index) => {
        console.log(
          `   ${index + 1}. ${job.title} - ${job.category} (${job.job_type})`
        );
        console.log(`      Salary: ₹${job.salary_min}-${job.salary_max}`);
      });
    }

    // Test 5: Check column names
    console.log("\n📋 Test 5: Checking column existence");
    const [columns] = await connection.query("DESCRIBE jobs");
    const columnNames = columns.map((col) => col.Field);

    console.log("   Looking for active status column...");
    if (columnNames.includes("is_active")) {
      console.log("   ✅ Found: is_active");
    }
    if (columnNames.includes("isActive")) {
      console.log("   ✅ Found: isActive");
    }

    // Test 6: Sample data from different states
    console.log("\n🗺️ Test 6: Jobs distribution by state");
    const [stateDist] = await connection.query(`
      SELECT state, COUNT(*) as count 
      FROM jobs 
      WHERE is_active = 1 
      GROUP BY state 
      ORDER BY count DESC 
      LIMIT 10
    `);
    stateDist.forEach((row) => {
      console.log(`   ${row.state}: ${row.count} jobs`);
    });

    console.log("\n✅ All tests completed!\n");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Database connection closed\n");
    }
  }
}

testJobRetrieval();
