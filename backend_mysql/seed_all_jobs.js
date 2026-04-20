// Seed comprehensive jobs across all locations
require("dotenv").config();
const mysql = require("mysql2/promise");
const locationsData = require("./data/locations");

async function seedJobs() {
  let connection;

  try {
    console.log("\n🌱 Starting comprehensive job seeding...\n");

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("✅ Connected to database:", process.env.DB_NAME);

    // First, create a default employer if not exists
    const [employers] = await connection.query(
      "SELECT id FROM users WHERE role = 'employer' LIMIT 1"
    );

    let employerId;
    if (employers.length === 0) {
      console.log("\n📝 Creating default employer...");
      const bcrypt = require("bcrypt");
      const hashedPassword = await bcrypt.hash("Employer123", 10);

      const [result] = await connection.query(
        `INSERT INTO users (email, password, name, role, phone, created_at, updated_at) 
         VALUES ('employer@villagejobs.com', ?, 'Village Jobs Employer', 'employer', '9876543210', NOW(), NOW())`,
        [hashedPassword]
      );
      employerId = result.insertId;
      console.log("✅ Default employer created with ID:", employerId);
    } else {
      employerId = employers[0].id;
      console.log("✅ Using existing employer ID:", employerId);
    }

    // Job titles and descriptions
    const jobTemplates = [
      {
        title: "Farm Worker",
        description:
          "Looking for hardworking individuals for agricultural work. Daily wage basis.",
        category: "Agriculture",
        jobType: "daily-wage",
        salary_min: 400,
        salary_max: 600,
        requirements: "Physical fitness, willingness to work outdoors",
      },
      {
        title: "Construction Helper",
        description:
          "Need helpers for construction work. Experience preferred but not mandatory.",
        category: "Construction",
        jobType: "daily-wage",
        salary_min: 500,
        salary_max: 800,
        requirements: "Physical fitness, basic construction knowledge",
      },
      {
        title: "Domestic Help",
        description: "Looking for reliable domestic help for household chores.",
        category: "Domestic",
        jobType: "part-time",
        salary_min: 5000,
        salary_max: 8000,
        requirements: "Trustworthy, experience in household work",
        womenOnly: 1,
      },
      {
        title: "Driver",
        description:
          "Need experienced driver with valid license. Good salary package.",
        category: "Transportation",
        jobType: "full-time",
        salary_min: 12000,
        salary_max: 18000,
        requirements: "Valid driving license, 2+ years experience",
      },
      {
        title: "Security Guard",
        description:
          "Security guard needed for night shift. Accommodation provided.",
        category: "Security",
        jobType: "full-time",
        salary_min: 10000,
        salary_max: 15000,
        requirements: "Alert, physically fit, night shift ready",
      },
      {
        title: "Cook",
        description:
          "Experienced cook required for restaurant. Multiple positions available.",
        category: "Hospitality",
        jobType: "full-time",
        salary_min: 10000,
        salary_max: 20000,
        requirements: "Cooking experience, food handling knowledge",
      },
      {
        title: "Tailor",
        description:
          "Skilled tailor needed for garment work. Work from home option available.",
        category: "Textile",
        jobType: "part-time",
        salary_min: 8000,
        salary_max: 15000,
        requirements: "Tailoring skills, own sewing machine preferred",
        womenOnly: 1,
      },
      {
        title: "Shop Assistant",
        description:
          "Assistant needed for retail shop. Morning and evening shifts available.",
        category: "Retail",
        jobType: "full-time",
        salary_min: 8000,
        salary_max: 12000,
        requirements: "Basic education, good communication skills",
      },
      {
        title: "Delivery Executive",
        description:
          "Delivery persons needed with own vehicle. Per delivery basis payment.",
        category: "Delivery",
        jobType: "contract",
        salary_min: 10000,
        salary_max: 25000,
        requirements: "Own two-wheeler, valid license, smartphone",
      },
      {
        title: "Electrician",
        description:
          "Experienced electrician required for residential and commercial work.",
        category: "Technical",
        jobType: "contract",
        salary_min: 15000,
        salary_max: 25000,
        requirements: "Electrical work experience, ITI certificate preferred",
      },
      {
        title: "Plumber",
        description:
          "Skilled plumber needed for maintenance work in residential complex.",
        category: "Technical",
        jobType: "full-time",
        salary_min: 12000,
        salary_max: 20000,
        requirements: "Plumbing experience, tool kit available",
      },
      {
        title: "Gardener",
        description: "Gardener required for maintaining gardens and lawns.",
        category: "Horticulture",
        jobType: "part-time",
        salary_min: 6000,
        salary_max: 10000,
        requirements: "Knowledge of plants and gardening",
      },
      {
        title: "Beautician",
        description: "Beautician required for beauty parlor. Flexible timings.",
        category: "Beauty & Wellness",
        jobType: "part-time",
        salary_min: 10000,
        salary_max: 18000,
        requirements: "Beauty course certificate, customer handling skills",
        womenOnly: 1,
      },
      {
        title: "Data Entry Operator",
        description:
          "Computer operator needed for data entry work. Office based.",
        category: "Office Work",
        jobType: "full-time",
        salary_min: 10000,
        salary_max: 15000,
        requirements: "Computer knowledge, typing speed 30+ wpm",
      },
      {
        title: "Warehouse Worker",
        description:
          "Workers needed for warehouse operations. Loading and unloading work.",
        category: "Warehouse",
        jobType: "full-time",
        salary_min: 10000,
        salary_max: 15000,
        requirements: "Physical fitness, shift work ready",
      },
    ];

    console.log(
      "\n📊 Creating jobs across all states, cities, and villages...\n"
    );

    let totalJobs = 0;

    // Iterate through all states
    for (const state of locationsData.states) {
      console.log(`\n📍 State: ${state.name}`);

      // Iterate through cities in the state
      for (const city of state.cities) {
        console.log(`  📍 City: ${city.name}`);

        // Create jobs for each village
        for (const village of city.villages) {
          // Add 2-3 jobs per village
          const numJobs = Math.floor(Math.random() * 2) + 2; // 2-3 jobs

          for (let i = 0; i < numJobs; i++) {
            const template =
              jobTemplates[Math.floor(Math.random() * jobTemplates.length)];

            await connection.query(
              `INSERT INTO jobs (
                employer_id, title, description, job_type, salary_min, salary_max,
                state, city, village, category, skills_required, is_active,
                status, created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'open', NOW(), NOW())`,
              [
                employerId,
                template.title,
                template.description,
                template.jobType,
                template.salary_min,
                template.salary_max,
                state.name,
                city.name,
                village,
                template.category,
                template.requirements,
              ]
            );

            totalJobs++;
          }
        }

        console.log(`    ✅ Created jobs for ${city.villages.length} villages`);
      }
    }

    // Get total count
    const [countResult] = await connection.query(
      "SELECT COUNT(*) as total FROM jobs"
    );
    const totalInDb = countResult[0].total;

    console.log("\n" + "=".repeat(60));
    console.log("✅ Job seeding completed!");
    console.log("=".repeat(60));
    console.log(`📊 Jobs added in this session: ${totalJobs}`);
    console.log(`📊 Total jobs in database: ${totalInDb}`);
    console.log(`📍 States covered: ${locationsData.states.length}`);
    console.log(`📍 Total locations with jobs: ${totalJobs / 2} (approx)`);
    console.log("\n🎉 Users can now search for jobs by location!\n");

    // Show sample jobs from different states
    console.log("📋 Sample jobs from different states:\n");
    const [sampleJobs] = await connection.query(`
      SELECT title, state, city, village, jobType, salary_min, salary_max
      FROM jobs
      ORDER BY RAND()
      LIMIT 10
    `);

    sampleJobs.forEach((job, index) => {
      console.log(
        `${index + 1}. ${job.title} - ${job.village}, ${job.city}, ${job.state}`
      );
      console.log(
        `   Type: ${job.jobType} | Salary: ₹${job.salary_min}-${job.salary_max}`
      );
      console.log("");
    });
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error(error);
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Database connection closed\n");
    }
  }
}

seedJobs();
