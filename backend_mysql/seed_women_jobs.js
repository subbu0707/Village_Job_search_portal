const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Lokesh',
  database: 'village_jobs'
};

// Women-focused jobs
const womenSpecificJobs = [
  // Education
  { title: 'Preschool Teacher', category: 'Education', salaryMin: 12000, salaryMax: 25000 },
  { title: 'Primary School Teacher', category: 'Education', salaryMin: 15000, salaryMax: 30000 },
  { title: 'Special Education Teacher', category: 'Education', salaryMin: 18000, salaryMax: 35000 },
  { title: 'Tutor', category: 'Education', salaryMin: 10000, salaryMax: 20000 },
  { title: 'Education Counselor', category: 'Education', salaryMin: 16000, salaryMax: 32000 },
  
  // Healthcare
  { title: 'Nurse', category: 'Healthcare', salaryMin: 15000, salaryMax: 35000 },
  { title: 'Medical Receptionist', category: 'Healthcare', salaryMin: 12000, salaryMax: 22000 },
  { title: 'Pharmacist', category: 'Healthcare', salaryMin: 18000, salaryMax: 40000 },
  { title: 'Physiotherapist', category: 'Healthcare', salaryMin: 20000, salaryMax: 45000 },
  { title: 'Lab Technician', category: 'Healthcare', salaryMin: 14000, salaryMax: 28000 },
  
  // Beauty & Wellness
  { title: 'Beautician', category: 'Beauty & Wellness', salaryMin: 10000, salaryMax: 25000 },
  { title: 'Makeup Artist', category: 'Beauty & Wellness', salaryMin: 12000, salaryMax: 30000 },
  { title: 'Hair Stylist', category: 'Beauty & Wellness', salaryMin: 11000, salaryMax: 28000 },
  { title: 'Spa Therapist', category: 'Beauty & Wellness', salaryMin: 13000, salaryMax: 27000 },
  { title: 'Nail Technician', category: 'Beauty & Wellness', salaryMin: 9000, salaryMax: 20000 },
  
  // Customer Service
  { title: 'Customer Service Representative', category: 'Customer Service', salaryMin: 12000, salaryMax: 25000 },
  { title: 'Receptionist', category: 'Customer Service', salaryMin: 10000, salaryMax: 20000 },
  { title: 'Front Desk Executive', category: 'Customer Service', salaryMin: 11000, salaryMax: 22000 },
  { title: 'Telecaller', category: 'Customer Service', salaryMin: 10000, salaryMax: 18000 },
  
  // HR & Admin
  { title: 'HR Executive', category: 'Human Resources', salaryMin: 15000, salaryMax: 32000 },
  { title: 'HR Coordinator', category: 'Human Resources', salaryMin: 13000, salaryMax: 26000 },
  { title: 'Recruitment Specialist', category: 'Human Resources', salaryMin: 18000, salaryMax: 38000 },
  
  // Finance & Accounting
  { title: 'Accountant', category: 'Finance & Accounting', salaryMin: 16000, salaryMax: 35000 },
  { title: 'Accounts Executive', category: 'Finance & Accounting', salaryMin: 14000, salaryMax: 28000 },
  { title: 'Bank Teller', category: 'Banking', salaryMin: 13000, salaryMax: 25000 },
  
  // Design & Creative
  { title: 'Fashion Designer', category: 'Design & Creative', salaryMin: 15000, salaryMax: 40000 },
  { title: 'Interior Designer', category: 'Design & Creative', salaryMin: 18000, salaryMax: 45000 },
  { title: 'Graphic Designer', category: 'Design & Creative', salaryMin: 16000, salaryMax: 38000 },
  { title: 'Content Writer', category: 'Sales & Marketing', salaryMin: 14000, salaryMax: 32000 },
  { title: 'Social Media Manager', category: 'Sales & Marketing', salaryMin: 17000, salaryMax: 40000 },
  
  // Retail
  { title: 'Store Manager', category: 'Retail', salaryMin: 16000, salaryMax: 32000 },
  { title: 'Sales Associate', category: 'Retail', salaryMin: 10000, salaryMax: 20000 },
  { title: 'Cashier', category: 'Retail', salaryMin: 9000, salaryMax: 16000 },
  
  // Hospitality
  { title: 'Hotel Receptionist', category: 'Hospitality', salaryMin: 11000, salaryMax: 22000 },
  { title: 'Housekeeping Supervisor', category: 'Hospitality', salaryMin: 12000, salaryMax: 24000 },
  { title: 'Restaurant Manager', category: 'Hospitality', salaryMin: 18000, salaryMax: 38000 }
];

// States to add women-specific jobs
const targetStates = {
  'Delhi': ['Central Delhi', 'South Delhi', 'North Delhi', 'East Delhi', 'West Delhi'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
  'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Asansol'],
  'Punjab': ['Chandigarh', 'Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala'],
  'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Karnal'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar']
};

async function addWomenAndRelatedJobs() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Get existing employers
    const [employers] = await connection.execute('SELECT id, city, state FROM users WHERE role = "employer"');
    console.log(`📊 Found ${employers.length} existing employers`);

    let womenJobsAdded = 0;
    let fresherWomenJobsAdded = 0;

    // Add women-specific jobs
    console.log('\n👩 Adding Women-Only Jobs...\n');
    
    for (const [state, cities] of Object.entries(targetStates)) {
      console.log(`📍 Processing ${state}...`);
      
      for (const city of cities) {
        // Find employer for this city
        const employer = employers.find(e => e.city === city && e.state === state);
        if (!employer) {
          console.log(`  ⚠️  No employer found for ${city}, ${state}`);
          continue;
        }

        // Add 8-12 women-specific jobs per city
        const jobCount = Math.floor(Math.random() * 5) + 8;
        
        for (let i = 0; i < jobCount; i++) {
          const jobTemplate = womenSpecificJobs[Math.floor(Math.random() * womenSpecificJobs.length)];
          
          // 40% chance for fresher position
          const isFresher = Math.random() < 0.4;
          const title = isFresher ? `Fresher ${jobTemplate.title}` : jobTemplate.title;
          
          if (isFresher) fresherWomenJobsAdded++;

          const jobTypes = ['Full-time', 'Part-time', 'Work From Home', 'Contract'];
          const jobType = jobTypes[Math.floor(Math.random() * jobTypes.length)];

          // Adjust salary for freshers
          const salaryMin = isFresher ? Math.floor(jobTemplate.salaryMin * 0.7) : jobTemplate.salaryMin;
          const salaryMax = isFresher ? Math.floor(jobTemplate.salaryMax * 0.7) : jobTemplate.salaryMax;

          const description = `Women-only position for ${title.toLowerCase()} in ${city}. ${
            isFresher ? 'Fresh graduates are encouraged to apply. No prior experience required. ' : ''
          }We offer a safe and supportive work environment for women professionals. ${
            jobType === 'Work From Home' ? 'Work from home facility available. ' : ''
          }Good communication skills and professional attitude required. Flexible timings available for part-time positions. Equal opportunity employer.`;

          // Get a random village for this city (we'll use placeholder since villages vary by city)
          const villages = ['Area 1', 'Area 2', 'Area 3', 'Main City', 'Downtown', 'Sector 1', 'Sector 2'];
          const village = villages[Math.floor(Math.random() * villages.length)];

          await connection.execute(
            `INSERT INTO jobs (title, description, category, jobType, salary_min, salary_max, village, city, state, employerId, womenOnly, isActive, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, NOW())`,
            [title, description, jobTemplate.category, jobType, salaryMin, salaryMax, village, city, state, employer.id]
          );

          womenJobsAdded++;
        }
        
        console.log(`  ✅ ${city}: ${jobCount} women-only jobs added`);
      }
    }

    console.log('\n🎉 WOMEN-ONLY JOBS ADDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════');
    console.log(`✅ Total Women-Only Jobs Added: ${womenJobsAdded}`);
    console.log(`💼 Fresher Women Jobs: ${fresherWomenJobsAdded} (${((fresherWomenJobsAdded/womenJobsAdded)*100).toFixed(1)}%)`);
    console.log('═══════════════════════════════════════════════════');

    // Get total counts
    const [totalCount] = await connection.execute('SELECT COUNT(*) as total FROM jobs');
    console.log(`\n📊 TOTAL Jobs in Database: ${totalCount[0].total}`);

    const [womenCount] = await connection.execute('SELECT COUNT(*) as total FROM jobs WHERE womenOnly = 1');
    console.log(`👩 TOTAL Women-Only Jobs: ${womenCount[0].total}`);

    const [fresherCount] = await connection.execute(
      `SELECT COUNT(*) as total FROM jobs WHERE title LIKE '%Fresher%' OR title LIKE '%Entry Level%' OR title LIKE '%Graduate%' OR title LIKE '%Trainee%'`
    );
    console.log(`💼 TOTAL Fresher Jobs: ${fresherCount[0].total}`);

    // Category breakdown for women jobs
    const [categoryBreakdown] = await connection.execute(
      `SELECT category, COUNT(*) as count FROM jobs WHERE womenOnly = 1 GROUP BY category ORDER BY count DESC LIMIT 10`
    );
    console.log('\n📋 Top Women Job Categories:');
    categoryBreakdown.forEach(cat => {
      console.log(`   ${cat.category}: ${cat.count} jobs`);
    });

    console.log('\n✅ Ready to use! Refresh your browser to see all women-only jobs!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addWomenAndRelatedJobs();
