// Create and populate jobs table with sample data
require("dotenv").config();
const mysql = require("mysql2/promise");

async function createAndPopulateJobs() {
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

    // Create jobs table
    console.log("\n📋 Creating jobs table...");
    const createJobsTable = `
      CREATE TABLE IF NOT EXISTS jobs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        employer_id INT,
        company_name VARCHAR(255),
        job_type ENUM('full-time', 'part-time', 'contract', 'daily-wage', 'temporary') DEFAULT 'full-time',
        category VARCHAR(100),
        salary_min DECIMAL(10,2),
        salary_max DECIMAL(10,2),
        salary_type ENUM('per_hour', 'per_day', 'per_month', 'per_year') DEFAULT 'per_month',
        experience_required VARCHAR(100),
        education_required VARCHAR(100),
        skills_required TEXT,
        state VARCHAR(100),
        city VARCHAR(100),
        village VARCHAR(100),
        pincode VARCHAR(10),
        address TEXT,
        location VARCHAR(255),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        openings INT DEFAULT 1,
        deadline DATE,
        status ENUM('open', 'closed', 'filled') DEFAULT 'open',
        is_active BOOLEAN DEFAULT TRUE,
        views_count INT DEFAULT 0,
        applications_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_state (state),
        INDEX idx_city (city),
        INDEX idx_job_type (job_type),
        INDEX idx_category (category),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.query(createJobsTable);
    console.log("✅ Jobs table created successfully!");

    // Check existing jobs
    const [existingJobs] = await connection.query(
      "SELECT COUNT(*) as count FROM jobs"
    );
    console.log(`\n📊 Current jobs in database: ${existingJobs[0].count}`);

    if (existingJobs[0].count > 0) {
      console.log("⏭️  Jobs already exist. Skipping insertion.");
      console.log("\n💡 To reset and add fresh data, run: DELETE FROM jobs;");
    } else {
      // Insert sample jobs
      console.log("\n🌱 Adding sample jobs...");

      const sampleJobs = [
        // Tamil Nadu - Chennai
        {
          title: "Software Developer",
          description:
            "Develop and maintain web applications using React and Node.js",
          company: "Tech Solutions Ltd",
          type: "full-time",
          category: "IT & Software",
          salaryMin: 30000,
          salaryMax: 50000,
          state: "Tamil Nadu",
          city: "Chennai",
          village: "T Nagar",
          experience: "1-3 years",
          education: "Bachelor Degree",
          skills: "React, Node.js, JavaScript",
          openings: 5,
        },
        {
          title: "Data Entry Operator",
          description: "Enter and manage data in company systems",
          company: "DataCorp",
          type: "full-time",
          category: "Administration",
          salaryMin: 15000,
          salaryMax: 20000,
          state: "Tamil Nadu",
          city: "Chennai",
          village: "Anna Nagar",
          experience: "Fresher",
          education: "12th Pass",
          skills: "MS Office, Typing",
          openings: 3,
        },
        {
          title: "Delivery Driver",
          description: "Deliver packages to customers on time",
          company: "FastDeliver",
          type: "daily-wage",
          category: "Logistics",
          salaryMin: 500,
          salaryMax: 800,
          salaryType: "per_day",
          state: "Tamil Nadu",
          city: "Chennai",
          village: "Velachery",
          experience: "0-1 year",
          education: "10th Pass",
          skills: "Driving License, Two-wheeler",
          openings: 10,
        },
        {
          title: "Construction Worker",
          description: "Assist in building construction work",
          company: "BuildCo",
          type: "daily-wage",
          category: "Construction",
          salaryMin: 600,
          salaryMax: 1000,
          salaryType: "per_day",
          state: "Tamil Nadu",
          city: "Chennai",
          village: "Porur",
          experience: "Any",
          education: "Any",
          skills: "Physical fitness",
          openings: 20,
        },
        {
          title: "Sales Executive",
          description: "Sell products and achieve monthly targets",
          company: "RetailMax",
          type: "full-time",
          category: "Sales & Marketing",
          salaryMin: 18000,
          salaryMax: 35000,
          state: "Tamil Nadu",
          city: "Chennai",
          village: "Adyar",
          experience: "0-2 years",
          education: "Bachelor Degree",
          skills: "Communication, Negotiation",
          openings: 7,
        },

        // Tamil Nadu - Coimbatore
        {
          title: "Textile Machine Operator",
          description: "Operate textile manufacturing machines",
          company: "Cotton Mills",
          type: "full-time",
          category: "Manufacturing",
          salaryMin: 12000,
          salaryMax: 18000,
          state: "Tamil Nadu",
          city: "Coimbatore",
          village: "Peelamedu",
          experience: "1-2 years",
          education: "10th Pass",
          skills: "Machine operation",
          openings: 15,
        },
        {
          title: "Accountant",
          description: "Manage accounts and financial records",
          company: "Finance Hub",
          type: "full-time",
          category: "Finance",
          salaryMin: 20000,
          salaryMax: 30000,
          state: "Tamil Nadu",
          city: "Coimbatore",
          village: "RS Puram",
          experience: "2-4 years",
          education: "B.Com",
          skills: "Tally, Excel",
          openings: 2,
        },
        {
          title: "Cook",
          description: "Prepare meals in restaurant kitchen",
          company: "Tasty Foods",
          type: "full-time",
          category: "Hospitality",
          salaryMin: 15000,
          salaryMax: 22000,
          state: "Tamil Nadu",
          city: "Coimbatore",
          village: "Gandhipuram",
          experience: "1-3 years",
          education: "Any",
          skills: "Cooking, South Indian cuisine",
          openings: 3,
        },
        {
          title: "Electrician",
          description: "Install and repair electrical systems",
          company: "Power Solutions",
          type: "contract",
          category: "Technical",
          salaryMin: 18000,
          salaryMax: 28000,
          state: "Tamil Nadu",
          city: "Coimbatore",
          village: "Singanallur",
          experience: "2-5 years",
          education: "ITI",
          skills: "Electrical work, Safety",
          openings: 4,
        },

        // Tamil Nadu - Madurai
        {
          title: "Teacher",
          description: "Teach students in primary school",
          company: "Bright Future School",
          type: "full-time",
          category: "Education",
          salaryMin: 20000,
          salaryMax: 30000,
          state: "Tamil Nadu",
          city: "Madurai",
          village: "Anna Nagar",
          experience: "1-3 years",
          education: "B.Ed",
          skills: "Teaching, Communication",
          openings: 5,
        },
        {
          title: "Security Guard",
          description: "Provide security for commercial building",
          company: "SafeGuard Services",
          type: "full-time",
          category: "Security",
          salaryMin: 12000,
          salaryMax: 16000,
          state: "Tamil Nadu",
          city: "Madurai",
          village: "KK Nagar",
          experience: "0-2 years",
          education: "10th Pass",
          skills: "Alert, Physical fitness",
          openings: 8,
        },
        {
          title: "Farm Worker",
          description: "Assist in agricultural farming activities",
          company: "Green Fields",
          type: "daily-wage",
          category: "Agriculture",
          salaryMin: 400,
          salaryMax: 600,
          salaryType: "per_day",
          state: "Tamil Nadu",
          city: "Madurai",
          village: "Thiruparankundram",
          experience: "Any",
          education: "Any",
          skills: "Farming knowledge",
          openings: 25,
        },

        // Karnataka - Bangalore
        {
          title: "Full Stack Developer",
          description: "Build complete web applications",
          company: "Tech Innovators",
          type: "full-time",
          category: "IT & Software",
          salaryMin: 40000,
          salaryMax: 70000,
          state: "Karnataka",
          city: "Bangalore",
          village: "Koramangala",
          experience: "2-5 years",
          education: "B.Tech/B.E",
          skills: "MERN Stack, AWS",
          openings: 10,
        },
        {
          title: "Customer Support Executive",
          description: "Handle customer queries and complaints",
          company: "Service Plus",
          type: "full-time",
          category: "Customer Service",
          salaryMin: 18000,
          salaryMax: 25000,
          state: "Karnataka",
          city: "Bangalore",
          village: "Indiranagar",
          experience: "0-2 years",
          education: "Bachelor Degree",
          skills: "Communication, English",
          openings: 12,
        },
        {
          title: "Warehouse Assistant",
          description: "Manage inventory in warehouse",
          company: "LogiStore",
          type: "full-time",
          category: "Logistics",
          salaryMin: 15000,
          salaryMax: 20000,
          state: "Karnataka",
          city: "Bangalore",
          village: "Whitefield",
          experience: "0-1 year",
          education: "12th Pass",
          skills: "Physical work, Basic English",
          openings: 8,
        },
        {
          title: "Graphic Designer",
          description: "Create visual designs for marketing",
          company: "Creative Agency",
          type: "contract",
          category: "Design",
          salaryMin: 25000,
          salaryMax: 40000,
          state: "Karnataka",
          city: "Bangalore",
          village: "HSR Layout",
          experience: "1-3 years",
          education: "Bachelor Degree",
          skills: "Photoshop, Illustrator",
          openings: 3,
        },

        // Maharashtra - Mumbai
        {
          title: "Marketing Manager",
          description: "Lead marketing campaigns and strategy",
          company: "Brand Masters",
          type: "full-time",
          category: "Marketing",
          salaryMin: 50000,
          salaryMax: 80000,
          state: "Maharashtra",
          city: "Mumbai",
          village: "Andheri",
          experience: "5-8 years",
          education: "MBA",
          skills: "Digital Marketing, Strategy",
          openings: 2,
        },
        {
          title: "Restaurant Waiter",
          description: "Serve customers in restaurant",
          company: "Fine Dine",
          type: "full-time",
          category: "Hospitality",
          salaryMin: 12000,
          salaryMax: 18000,
          state: "Maharashtra",
          city: "Mumbai",
          village: "Bandra",
          experience: "0-2 years",
          education: "10th Pass",
          skills: "Customer service",
          openings: 6,
        },
        {
          title: "Office Assistant",
          description: "Provide administrative support",
          company: "Corporate Services",
          type: "full-time",
          category: "Administration",
          salaryMin: 15000,
          salaryMax: 22000,
          state: "Maharashtra",
          city: "Mumbai",
          village: "Powai",
          experience: "1-2 years",
          education: "12th Pass",
          skills: "MS Office, Communication",
          openings: 4,
        },

        // Delhi
        {
          title: "Cab Driver",
          description: "Drive customers to their destinations",
          company: "RideEasy",
          type: "daily-wage",
          category: "Transportation",
          salaryMin: 800,
          salaryMax: 1200,
          salaryType: "per_day",
          state: "Delhi",
          city: "Delhi",
          village: "Connaught Place",
          experience: "1-3 years",
          education: "Any",
          skills: "Driving License, Delhi roads knowledge",
          openings: 15,
        },
        {
          title: "Receptionist",
          description: "Welcome guests and manage front desk",
          company: "Hotel Paradise",
          type: "full-time",
          category: "Hospitality",
          salaryMin: 18000,
          salaryMax: 25000,
          state: "Delhi",
          city: "Delhi",
          village: "Karol Bagh",
          experience: "0-2 years",
          education: "12th Pass",
          skills: "Communication, Computer basics",
          openings: 3,
        },
        {
          title: "Mechanic",
          description: "Repair and maintain vehicles",
          company: "Auto Care",
          type: "full-time",
          category: "Automobile",
          salaryMin: 20000,
          salaryMax: 30000,
          state: "Delhi",
          city: "Delhi",
          village: "Lajpat Nagar",
          experience: "2-5 years",
          education: "ITI",
          skills: "Vehicle repair, Tools handling",
          openings: 5,
        },

        // More Tamil Nadu jobs
        {
          title: "Plumber",
          description: "Install and repair plumbing systems",
          company: "Home Services",
          type: "contract",
          category: "Technical",
          salaryMin: 15000,
          salaryMax: 25000,
          state: "Tamil Nadu",
          city: "Chennai",
          village: "Tambaram",
          experience: "1-4 years",
          education: "Any",
          skills: "Plumbing work",
          openings: 6,
        },
        {
          title: "Beautician",
          description: "Provide beauty and grooming services",
          company: "Beauty Studio",
          type: "full-time",
          category: "Personal Care",
          salaryMin: 12000,
          salaryMax: 20000,
          state: "Tamil Nadu",
          city: "Chennai",
          village: "Nungambakkam",
          experience: "1-3 years",
          education: "Beautician Course",
          skills: "Hair styling, Makeup",
          openings: 4,
        },
        {
          title: "Carpenter",
          description: "Create and repair wooden furniture",
          company: "Wood Craft",
          type: "contract",
          category: "Construction",
          salaryMin: 18000,
          salaryMax: 28000,
          state: "Tamil Nadu",
          city: "Coimbatore",
          village: "Saibaba Colony",
          experience: "2-5 years",
          education: "Any",
          skills: "Carpentry, Wood work",
          openings: 3,
        },
        {
          title: "Tailor",
          description: "Stitch and alter garments",
          company: "Fashion Point",
          type: "full-time",
          category: "Textile",
          salaryMin: 10000,
          salaryMax: 18000,
          state: "Tamil Nadu",
          city: "Madurai",
          village: "Goripalayam",
          experience: "1-3 years",
          education: "Any",
          skills: "Stitching, Machine operation",
          openings: 5,
        },
        {
          title: "Cleaner",
          description: "Clean and maintain office premises",
          company: "CleanPro Services",
          type: "daily-wage",
          category: "Housekeeping",
          salaryMin: 300,
          salaryMax: 500,
          salaryType: "per_day",
          state: "Tamil Nadu",
          city: "Chennai",
          village: "Guindy",
          experience: "Any",
          education: "Any",
          skills: "Cleaning",
          openings: 10,
        },
      ];

      let inserted = 0;
      for (const job of sampleJobs) {
        try {
          await connection.query(
            `INSERT INTO jobs (
              title, description, company_name, job_type, category, 
              salary_min, salary_max, salary_type, experience_required, 
              education_required, skills_required, state, city, village, 
              openings, deadline, status, is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY), 'open', TRUE)`,
            [
              job.title,
              job.description,
              job.company,
              job.type,
              job.category,
              job.salaryMin,
              job.salaryMax,
              job.salaryType || "per_month",
              job.experience,
              job.education,
              job.skills,
              job.state,
              job.city,
              job.village,
              job.openings,
            ]
          );
          inserted++;
          console.log(`  ✅ Added: ${job.title} in ${job.city}, ${job.state}`);
        } catch (error) {
          console.log(`  ❌ Error adding ${job.title}:`, error.message);
        }
      }

      console.log(`\n✅ Successfully added ${inserted} jobs!`);
    }

    // Show summary
    const [totalJobs] = await connection.query(
      "SELECT COUNT(*) as count FROM jobs"
    );
    const [jobsByState] = await connection.query(`
      SELECT state, COUNT(*) as count 
      FROM jobs 
      WHERE is_active = TRUE AND status = 'open'
      GROUP BY state
      ORDER BY count DESC
    `);

    console.log("\n📊 Jobs Summary:");
    console.log("┌─────────────────────┬──────────┐");
    console.log("│ State               │ Jobs     │");
    console.log("├─────────────────────┼──────────┤");
    jobsByState.forEach((row) => {
      const state = row.state.padEnd(19);
      const count = String(row.count).padStart(8);
      console.log(`│ ${state} │ ${count} │`);
    });
    console.log("└─────────────────────┴──────────┘");
    console.log(`\nTotal Active Jobs: ${totalJobs[0].count}`);

    console.log("\n✅ Jobs database is ready!\n");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Database connection closed\n");
    }
  }
}

createAndPopulateJobs();
