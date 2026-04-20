// Seed daily wage jobs into the database
const mysql = require('mysql2/promise');

const dailyWageJobs = [
  // Construction & Labor
  { title: 'Construction Worker', category: 'Construction', jobType: 'Daily Wage', salary_min: 500, salary_max: 800 },
  { title: 'Mason Helper', category: 'Construction', jobType: 'Daily Wage', salary_min: 400, salary_max: 600 },
  { title: 'Painter', category: 'Construction', jobType: 'Daily Wage', salary_min: 600, salary_max: 1000 },
  { title: 'Electrician Helper', category: 'Construction', jobType: 'Daily Wage', salary_min: 500, salary_max: 800 },
  { title: 'Plumber Helper', category: 'Construction', jobType: 'Daily Wage', salary_min: 500, salary_max: 800 },
  { title: 'Carpenter', category: 'Construction', jobType: 'Daily Wage', salary_min: 700, salary_max: 1200 },
  { title: 'Tile Worker', category: 'Construction', jobType: 'Daily Wage', salary_min: 600, salary_max: 1000 },
  { title: 'Welder', category: 'Construction', jobType: 'Daily Wage', salary_min: 800, salary_max: 1500 },
  
  // Agriculture & Farming
  { title: 'Farm Worker', category: 'Agriculture', jobType: 'Daily Wage', salary_min: 300, salary_max: 500 },
  { title: 'Harvesting Labor', category: 'Agriculture', jobType: 'Daily Wage', salary_min: 350, salary_max: 550 },
  { title: 'Plantation Worker', category: 'Agriculture', jobType: 'Daily Wage', salary_min: 300, salary_max: 500 },
  { title: 'Dairy Farm Worker', category: 'Agriculture', jobType: 'Daily Wage', salary_min: 400, salary_max: 600 },
  { title: 'Irrigation Worker', category: 'Agriculture', jobType: 'Daily Wage', salary_min: 350, salary_max: 550 },
  { title: 'Tractor Driver', category: 'Agriculture', jobType: 'Daily Wage', salary_min: 800, salary_max: 1200 },
  
  // Domestic & Household
  { title: 'House Maid', category: 'Domestic Services', jobType: 'Daily Wage', salary_min: 200, salary_max: 400, womenOnly: true },
  { title: 'Cook', category: 'Domestic Services', jobType: 'Daily Wage', salary_min: 300, salary_max: 600 },
  { title: 'Gardener', category: 'Domestic Services', jobType: 'Daily Wage', salary_min: 300, salary_max: 500 },
  { title: 'Cleaning Staff', category: 'Domestic Services', jobType: 'Daily Wage', salary_min: 250, salary_max: 450 },
  { title: 'Laundry Worker', category: 'Domestic Services', jobType: 'Daily Wage', salary_min: 200, salary_max: 400 },
  { title: 'Nanny/Babysitter', category: 'Domestic Services', jobType: 'Daily Wage', salary_min: 300, salary_max: 600, womenOnly: true },
  
  // Loading & Transportation
  { title: 'Loading Worker', category: 'Logistics', jobType: 'Daily Wage', salary_min: 400, salary_max: 700 },
  { title: 'Warehouse Helper', category: 'Logistics', jobType: 'Daily Wage', salary_min: 400, salary_max: 600 },
  { title: 'Delivery Boy', category: 'Logistics', jobType: 'Daily Wage', salary_min: 300, salary_max: 500 },
  { title: 'Auto Driver', category: 'Transportation', jobType: 'Daily Wage', salary_min: 500, salary_max: 800 },
  { title: 'Tempo Driver', category: 'Transportation', jobType: 'Daily Wage', salary_min: 600, salary_max: 1000 },
  { title: 'Packing Worker', category: 'Logistics', jobType: 'Daily Wage', salary_min: 350, salary_max: 550 },
  
  // Hospitality & Service
  { title: 'Waiter/Waitress', category: 'Hospitality', jobType: 'Daily Wage', salary_min: 300, salary_max: 500 },
  { title: 'Kitchen Helper', category: 'Hospitality', jobType: 'Daily Wage', salary_min: 300, salary_max: 500 },
  { title: 'Dishwasher', category: 'Hospitality', jobType: 'Daily Wage', salary_min: 250, salary_max: 400 },
  { title: 'Room Service Staff', category: 'Hospitality', jobType: 'Daily Wage', salary_min: 300, salary_max: 500 },
  { title: 'Catering Helper', category: 'Hospitality', jobType: 'Daily Wage', salary_min: 400, salary_max: 600 },
  
  // Manufacturing & Production
  { title: 'Factory Worker', category: 'Manufacturing', jobType: 'Daily Wage', salary_min: 400, salary_max: 700 },
  { title: 'Machine Operator', category: 'Manufacturing', jobType: 'Daily Wage', salary_min: 500, salary_max: 900 },
  { title: 'Assembly Line Worker', category: 'Manufacturing', jobType: 'Daily Wage', salary_min: 400, salary_max: 700 },
  { title: 'Quality Control Helper', category: 'Manufacturing', jobType: 'Daily Wage', salary_min: 450, salary_max: 750 },
  
  // Retail & Sales
  { title: 'Shop Assistant', category: 'Retail', jobType: 'Daily Wage', salary_min: 300, salary_max: 500 },
  { title: 'Salesperson', category: 'Retail', jobType: 'Daily Wage', salary_min: 350, salary_max: 600 },
  { title: 'Stock Boy', category: 'Retail', jobType: 'Daily Wage', salary_min: 300, salary_max: 500 },
  { title: 'Cashier', category: 'Retail', jobType: 'Daily Wage', salary_min: 350, salary_max: 550 },
  
  // Skilled Trades
  { title: 'Tailor', category: 'Skilled Trade', jobType: 'Daily Wage', salary_min: 400, salary_max: 800 },
  { title: 'Cobbler', category: 'Skilled Trade', jobType: 'Daily Wage', salary_min: 300, salary_max: 600 },
  { title: 'Barber', category: 'Skilled Trade', jobType: 'Daily Wage', salary_min: 400, salary_max: 700 },
  { title: 'Beautician', category: 'Skilled Trade', jobType: 'Daily Wage', salary_min: 400, salary_max: 800, womenOnly: true },
  { title: 'Mechanic Helper', category: 'Automotive', jobType: 'Daily Wage', salary_min: 400, salary_max: 700 },
  
  // Security & Guard
  { title: 'Security Guard', category: 'Security', jobType: 'Daily Wage', salary_min: 400, salary_max: 700 },
  { title: 'Watchman', category: 'Security', jobType: 'Daily Wage', salary_min: 350, salary_max: 600 },
  
  // Event & Temporary
  { title: 'Event Staff', category: 'Events', jobType: 'Daily Wage', salary_min: 400, salary_max: 800 },
  { title: 'Promoter', category: 'Marketing', jobType: 'Daily Wage', salary_min: 500, salary_max: 1000 },
  { title: 'Survey Collector', category: 'Research', jobType: 'Daily Wage', salary_min: 400, salary_max: 700 },
];

const states = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Uttar Pradesh', 'Gujarat', 'Rajasthan', 'West Bengal', 'Punjab', 'Haryana'];
const citiesByState = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
  'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
  'Delhi': ['New Delhi', 'Dwarka', 'Rohini', 'Karol Bagh'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
  'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala']
};

const descriptions = [
  'Looking for hardworking and reliable individuals for daily wage work. Payment on same day basis.',
  'Urgent requirement for daily wage workers. Good working conditions and timely payment guaranteed.',
  'Immediate hiring for daily wage positions. All necessary equipment will be provided.',
  'Daily wage job opportunity with flexible working hours. Fair wages and respectful work environment.',
  'Seeking dedicated workers for daily wage employment. Regular work and payment assured.',
  'Daily wage position available. Experience preferred but freshers can also apply with willingness to learn.',
];

async function seedDailyWageJobs() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Lokesh',
      database: 'village_jobs'
    });

    console.log('🔌 Connected to database');
    
    // Get a random employer ID
    const [employers] = await connection.execute(
      "SELECT id FROM users WHERE role = 'employer' LIMIT 1"
    );
    
    let employerId = 1;
    if (employers.length > 0) {
      employerId = employers[0].id;
    }

    let insertedCount = 0;

    for (const job of dailyWageJobs) {
      // For each job, create 2-3 instances in different locations
      const instances = Math.floor(Math.random() * 2) + 2;
      
      for (let i = 0; i < instances; i++) {
        const state = states[Math.floor(Math.random() * states.length)];
        const cities = citiesByState[state];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const description = descriptions[Math.floor(Math.random() * descriptions.length)];
        
        await connection.execute(
          `INSERT INTO jobs (
            employerId, title, description, category, jobType, 
            salary_min, salary_max, state, city, 
            womenOnly, isActive, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
          [
            employerId,
            job.title,
            `${description} ${job.title} needed in ${city}, ${state}.`,
            job.category,
            job.jobType,
            job.salary_min,
            job.salary_max,
            state,
            city,
            job.womenOnly ? 1 : 0
          ]
        );
        
        insertedCount++;
      }
    }

    console.log(`✅ Successfully inserted ${insertedCount} daily wage jobs!`);
    
    // Show summary
    const [summary] = await connection.execute(
      `SELECT jobType, COUNT(*) as count FROM jobs GROUP BY jobType`
    );
    
    console.log('\n📊 Job Type Summary:');
    summary.forEach(row => {
      console.log(`   ${row.jobType}: ${row.count} jobs`);
    });
    
    const [total] = await connection.execute('SELECT COUNT(*) as total FROM jobs');
    console.log(`\n📦 Total jobs in database: ${total[0].total}`);
    
  } catch (error) {
    console.error('❌ Error seeding daily wage jobs:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

seedDailyWageJobs();
