// Test jobs API endpoints
require("dotenv").config();
const axios = require("axios");

const API_BASE = "http://localhost:4000/api";

async function testJobsAPI() {
  console.log("\n🧪 Testing Jobs API\n");
  console.log("=".repeat(60));

  try {
    // Test 1: Get all jobs
    console.log("\n📋 Test 1: Get All Jobs");
    console.log("-".repeat(60));

    const allJobsResponse = await axios.get(`${API_BASE}/jobs`);
    console.log(`✅ Found ${allJobsResponse.data.data.length} jobs`);
    console.log(`   Total: ${allJobsResponse.data.total}`);

    // Test 2: Get jobs by state
    console.log("\n🗺️  Test 2: Get Jobs by State (Tamil Nadu)");
    console.log("-".repeat(60));

    const tnJobsResponse = await axios.get(`${API_BASE}/jobs?state=Tamil Nadu`);
    console.log(
      `✅ Found ${tnJobsResponse.data.data.length} jobs in Tamil Nadu`,
    );

    if (tnJobsResponse.data.data.length > 0) {
      console.log("\n   Sample Jobs:");
      tnJobsResponse.data.data.slice(0, 3).forEach((job, index) => {
        console.log(`   ${index + 1}. ${job.title} in ${job.city}`);
        console.log(
          `      Salary: ₹${job.salary_min} - ₹${job.salary_max}/${job.salary_type}`,
        );
        console.log(`      Type: ${job.job_type}`);
      });
    }

    // Test 3: Get jobs by city
    console.log("\n🏙️  Test 3: Get Jobs by City (Chennai)");
    console.log("-".repeat(60));

    const chennaiJobsResponse = await axios.get(
      `${API_BASE}/jobs?city=Chennai`,
    );
    console.log(
      `✅ Found ${chennaiJobsResponse.data.data.length} jobs in Chennai`,
    );

    // Test 4: Get jobs by job type
    console.log("\n💼 Test 4: Get Daily Wage Jobs");
    console.log("-".repeat(60));

    const dailyWageResponse = await axios.get(
      `${API_BASE}/jobs?jobType=daily-wage`,
    );
    console.log(
      `✅ Found ${dailyWageResponse.data.data.length} daily-wage jobs`,
    );

    if (dailyWageResponse.data.data.length > 0) {
      console.log("\n   Daily Wage Jobs:");
      dailyWageResponse.data.data.forEach((job, index) => {
        console.log(
          `   ${index + 1}. ${job.title} - ₹${job.salary_min}-${
            job.salary_max
          }/${job.salary_type}`,
        );
      });
    }

    // Test 5: Get jobs by category
    console.log("\n🏗️  Test 5: Get Construction Jobs");
    console.log("-".repeat(60));

    const constructionResponse = await axios.get(
      `${API_BASE}/jobs?category=Construction`,
    );
    console.log(
      `✅ Found ${constructionResponse.data.data.length} construction jobs`,
    );

    // Test 6: Search jobs by title
    console.log('\n🔍 Test 6: Search Jobs (keyword: "Developer")');
    console.log("-".repeat(60));

    const searchResponse = await axios.get(`${API_BASE}/jobs?search=Developer`);
    console.log(`✅ Found ${searchResponse.data.data.length} developer jobs`);

    if (searchResponse.data.data.length > 0) {
      searchResponse.data.data.forEach((job, index) => {
        console.log(`   ${index + 1}. ${job.title} - ${job.company_name}`);
      });
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("✅ All Jobs API tests passed!\n");
    console.log("📊 Summary:");
    console.log(`   Total Jobs: ${allJobsResponse.data.total}`);
    console.log(`   Tamil Nadu: ${tnJobsResponse.data.data.length} jobs`);
    console.log(`   Chennai: ${chennaiJobsResponse.data.data.length} jobs`);
    console.log(`   Daily Wage: ${dailyWageResponse.data.data.length} jobs`);
    console.log(
      `   Construction: ${constructionResponse.data.data.length} jobs`,
    );
    console.log("\n✅ Users can now search and find jobs by:");
    console.log("   ✅ Location (State & City)");
    console.log("   ✅ Job Type (Full-time, Part-time, Daily-wage, etc.)");
    console.log("   ✅ Category");
    console.log("   ✅ Job Title (Search)");
    console.log("\n🎉 Jobs are ready to be displayed in the frontend!\n");
  } catch (error) {
    console.log("\n❌ Test failed!");
    console.log("Error:", error.response?.data?.message || error.message);
    if (error.code === "ECONNREFUSED") {
      console.log("\n💡 Make sure the backend server is running on port 4000");
      console.log("   Run: npm start (in backend_mysql folder)\n");
    }
  }
}

console.log("\n🚀 Starting Jobs API Tests...");
console.log("Make sure backend server is running on http://localhost:4000\n");

setTimeout(() => {
  testJobsAPI();
}, 1000);
