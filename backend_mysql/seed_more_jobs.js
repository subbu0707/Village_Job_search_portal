const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Lokesh',
  database: 'village_jobs'
};

// Extended locations data with more villages
const locationsData = {
  'Delhi': {
    cities: {
      'Central Delhi': ['Connaught Place', 'Karol Bagh', 'Chandni Chowk', 'Paharganj', 'Kashmere Gate', 'Sadar Bazaar', 'Daryaganj', 'Rajendra Place'],
      'South Delhi': ['Hauz Khas', 'Saket', 'Greater Kailash', 'Nehru Place', 'Lajpat Nagar', 'Defence Colony', 'Malviya Nagar', 'Vasant Kunj'],
      'North Delhi': ['Model Town', 'Civil Lines', 'Kamla Nagar', 'GTB Nagar', 'Kingsway Camp', 'Vijay Nagar', 'Shakti Nagar', 'Timarpur'],
      'East Delhi': ['Mayur Vihar', 'Preet Vihar', 'Laxmi Nagar', 'Gandhi Nagar', 'Vivek Vihar', 'Shakarpur', 'Krishna Nagar', 'Dilshad Garden'],
      'West Delhi': ['Janakpuri', 'Rajouri Garden', 'Tilak Nagar', 'Punjabi Bagh', 'Vikaspuri', 'Paschim Vihar', 'Dwarka', 'Uttam Nagar']
    }
  },
  'Maharashtra': {
    cities: {
      'Mumbai': ['Andheri', 'Bandra', 'Dadar', 'Worli', 'Colaba', 'Powai', 'Vikhroli', 'Mulund', 'Thane', 'Borivali'],
      'Pune': ['Kothrud', 'Hadapsar', 'Shivajinagar', 'Hinjewadi', 'Baner', 'Viman Nagar', 'Wakad', 'Aundh'],
      'Nagpur': ['Sitabuldi', 'Dharampeth', 'Sadar', 'Wardha Road', 'Kamptee', 'Hingna', 'Koradi', 'Kalmeshwar'],
      'Nashik': ['Panchavati', 'College Road', 'Satpur', 'Deolali', 'Nashik Road', 'Pathardi', 'Trimbak', 'Igatpuri'],
      'Aurangabad': ['Cidco', 'Jalna Road', 'Beed Bypass', 'Garkheda', 'Waluj', 'Paithan', 'Gangapur', 'Khuldabad']
    }
  },
  'Karnataka': {
    cities: {
      'Bangalore': ['Whitefield', 'Koramangala', 'Indiranagar', 'HSR Layout', 'Electronic City', 'Jayanagar', 'Marathahalli', 'BTM Layout'],
      'Mysore': ['Chamundipuram', 'Kuvempunagar', 'Hebbal', 'VV Mohalla', 'Gokulam', 'Jayalakshmipuram', 'Yadavagiri', 'Srirangapatna'],
      'Mangalore': ['Kadri', 'Bunder', 'Hampankatta', 'Bejai', 'Kankanady', 'Surathkal', 'Ullal', 'Mulki'],
      'Hubli': ['Unkal', 'Gokul Road', 'Club Road', 'Vidyanagar', 'Navanagar', 'Keshwapur', 'Shirur Park', 'Dharwad'],
      'Belgaum': ['Camp Area', 'Tilakwadi', 'Hindwadi', 'Angol', 'Shahapur', 'Udyambag', 'Khanapur', 'Ramdurg']
    }
  },
  'Tamil Nadu': {
    cities: {
      'Chennai': ['T Nagar', 'Anna Nagar', 'Velachery', 'Adyar', 'Mylapore', 'Tambaram', 'Porur', 'Guindy'],
      'Coimbatore': ['RS Puram', 'Gandhipuram', 'Peelamedu', 'Saravanampatti', 'Singanallur', 'Kuniyamuthur', 'Pollachi', 'Mettupalayam'],
      'Madurai': ['Anna Nagar', 'KK Nagar', 'Thirunagar', 'Villapuram', 'Avaniyapuram', 'Tirumangalam', 'Usilampatti', 'Melur'],
      'Salem': ['Fairlands', 'Suramangalam', 'Anna Nagar', 'Shevapet', 'Hasthampatti', 'Attur', 'Mettur', 'Omalur'],
      'Tiruchirappalli': ['Srirangam', 'Thillai Nagar', 'K K Nagar', 'Cantonment', 'Palpannai', 'Manachanallur', 'Lalgudi', 'Musiri']
    }
  },
  'Telangana': {
    cities: {
      'Hyderabad': ['Banjara Hills', 'Jubilee Hills', 'Hitech City', 'Madhapur', 'Gachibowli', 'Kukatpally', 'Miyapur', 'Uppal'],
      'Warangal': ['Hanamkonda', 'Kazipet', 'Subedari', 'Nakkalagutta', 'Parkal', 'Jangaon', 'Narsampet', 'Mahabubabad'],
      'Nizamabad': ['Santhnagar', 'Dichpally', 'Cantonment', 'Old City', 'Bodhan', 'Armoor', 'Kamareddy', 'Banswada'],
      'Karimnagar': ['Rajeev Nagar', 'Bhagathnagar', 'Mankammathota', 'Kothirampur', 'Huzurabad', 'Jammikunta', 'Peddapalli', 'Manthani'],
      'Khammam': ['Wyra', 'Sathupalli', 'Kothagudem', 'Madhira', 'Bhadrachalam', 'Yellandu', 'Manuguru', 'Palvancha']
    }
  }
};

// Comprehensive job categories with MORE variety
const jobCategories = [
  'Software Development', 'Healthcare', 'Education', 'Construction', 'Agriculture',
  'Manufacturing', 'Retail', 'Hospitality', 'Transportation', 'Security',
  'Government', 'IT Services', 'Banking', 'Real Estate', 'Telecommunications',
  'Food Processing', 'Textile', 'Automobile', 'Pharmaceuticals', 'Engineering',
  'Customer Service', 'Sales & Marketing', 'Design & Creative', 'Finance & Accounting',
  'Human Resources', 'Legal Services', 'Media & Entertainment', 'Beauty & Wellness',
  'Sports & Fitness', 'Environmental Services'
];

// Job titles by category - EXPANDED
const jobTitlesByCategory = {
  'Software Development': [
    'Software Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
    'Mobile App Developer', 'QA Engineer', 'DevOps Engineer', 'Data Scientist',
    'UI/UX Designer', 'Python Developer', 'Java Developer', 'React Developer'
  ],
  'Healthcare': [
    'Nurse', 'Medical Assistant', 'Pharmacist', 'Lab Technician', 'Ward Boy',
    'Hospital Attendant', 'Physiotherapist', 'Radiographer', 'Dental Assistant',
    'Medical Receptionist', 'Healthcare Administrator', 'Paramedic'
  ],
  'Education': [
    'Teacher', 'Tutor', 'School Administrator', 'Librarian', 'Education Counselor',
    'Preschool Teacher', 'Special Education Teacher', 'Computer Teacher', 'Math Teacher',
    'English Teacher', 'Science Teacher', 'Physical Education Teacher'
  ],
  'Construction': [
    'Site Engineer', 'Mason', 'Construction Laborer', 'Foreman', 'Carpenter',
    'Electrician', 'Plumber', 'Painter', 'Welder', 'Civil Engineer',
    'Construction Supervisor', 'Safety Officer'
  ],
  'Agriculture': [
    'Farm Worker', 'Agricultural Laborer', 'Tractor Driver', 'Crop Manager',
    'Dairy Farm Worker', 'Irrigation Technician', 'Agricultural Supervisor',
    'Horticulturist', 'Poultry Farm Worker', 'Livestock Handler'
  ],
  'Customer Service': [
    'Customer Service Representative', 'Call Center Executive', 'Customer Support Specialist',
    'Help Desk Officer', 'Client Relations Manager', 'Telecaller', 'Front Desk Executive',
    'Customer Care Executive', 'Technical Support Executive', 'Service Coordinator'
  ],
  'Sales & Marketing': [
    'Sales Executive', 'Marketing Manager', 'Business Development Manager', 'Digital Marketing Executive',
    'Sales Manager', 'Marketing Coordinator', 'Brand Manager', 'Retail Sales Associate',
    'Territory Sales Manager', 'Marketing Analyst', 'Social Media Manager', 'Content Writer'
  ],
  'Design & Creative': [
    'Graphic Designer', 'Web Designer', 'Interior Designer', 'Fashion Designer',
    'Video Editor', 'Photographer', 'Animator', 'Art Director', 'Creative Director',
    'Illustrator', '3D Artist', 'Motion Graphics Designer'
  ],
  'Finance & Accounting': [
    'Accountant', 'Financial Analyst', 'Tax Consultant', 'Auditor', 'Bookkeeper',
    'Financial Manager', 'Investment Analyst', 'Payroll Specialist', 'Budget Analyst',
    'Treasury Officer', 'Credit Analyst', 'Accounts Executive'
  ],
  'Human Resources': [
    'HR Manager', 'Recruitment Specialist', 'HR Executive', 'Talent Acquisition Specialist',
    'Training Manager', 'HR Coordinator', 'Employee Relations Manager', 'Compensation Analyst',
    'HR Generalist', 'Recruiter', 'HRIS Specialist', 'Payroll Manager'
  ],
  'Banking': [
    'Bank Teller', 'Loan Officer', 'Bank Manager', 'Credit Officer', 'Banking Associate',
    'Branch Manager', 'Relationship Manager', 'Investment Banker', 'Treasury Officer',
    'Risk Analyst', 'Compliance Officer', 'Operations Manager'
  ],
  'Retail': [
    'Store Manager', 'Sales Associate', 'Cashier', 'Inventory Manager', 'Visual Merchandiser',
    'Retail Manager', 'Stock Clerk', 'Customer Service Associate', 'Department Manager',
    'Loss Prevention Officer', 'Retail Sales Executive', 'Store Supervisor'
  ],
  'Hospitality': [
    'Hotel Manager', 'Chef', 'Waiter', 'Receptionist', 'Housekeeping Staff',
    'Restaurant Manager', 'Bartender', 'Cook', 'Room Service Attendant',
    'Front Office Manager', 'Banquet Manager', 'Guest Relations Officer'
  ],
  'IT Services': [
    'System Administrator', 'Network Engineer', 'IT Support Specialist', 'Database Administrator',
    'Cloud Engineer', 'Security Analyst', 'IT Manager', 'Help Desk Technician',
    'Network Administrator', 'Systems Analyst', 'IT Consultant', 'Infrastructure Engineer'
  ],
  'Manufacturing': [
    'Production Supervisor', 'Quality Control Inspector', 'Machine Operator', 'Assembly Worker',
    'Production Manager', 'Maintenance Technician', 'Industrial Engineer', 'Plant Manager',
    'Production Planner', 'Quality Assurance Manager', 'Manufacturing Engineer', 'Shift Supervisor'
  ],
  'Transportation': [
    'Driver', 'Delivery Boy', 'Logistics Coordinator', 'Transport Manager', 'Warehouse Worker',
    'Fleet Manager', 'Dispatcher', 'Truck Driver', 'Delivery Executive', 'Supply Chain Manager',
    'Courier', 'Delivery Partner'
  ],
  'Security': [
    'Security Guard', 'Security Supervisor', 'Security Manager', 'Bouncer', 'CCTV Operator',
    'Security Officer', 'Safety Officer', 'Security Analyst', 'Fire Safety Officer',
    'Security Coordinator', 'Watchman', 'Security Personnel'
  ],
  'Government': [
    'Clerk', 'Assistant', 'Officer', 'Inspector', 'Administrator',
    'Government Teacher', 'Revenue Officer', 'Public Relations Officer', 'Supervisor',
    'Government Engineer', 'Lab Assistant', 'Data Entry Operator'
  ],
  'Beauty & Wellness': [
    'Beautician', 'Hair Stylist', 'Makeup Artist', 'Spa Therapist', 'Nail Technician',
    'Beauty Consultant', 'Massage Therapist', 'Salon Manager', 'Cosmetologist',
    'Wellness Coach', 'Aesthetician', 'Aromatherapist'
  ],
  'Media & Entertainment': [
    'Content Creator', 'Video Producer', 'Radio Jockey', 'News Reporter', 'Anchor',
    'Film Editor', 'Sound Engineer', 'Cameraman', 'Production Assistant', 'Script Writer',
    'Media Planner', 'Event Coordinator'
  ]
};

// Fresher keywords
const fresherKeywords = ['Fresher', 'Entry Level', 'Graduate', 'Trainee', 'Junior', 'Beginner', 'Internship'];

// Women-preferred job titles
const womenPreferredJobs = [
  'Teacher', 'Nurse', 'Receptionist', 'Customer Service Representative', 'HR Executive',
  'Beautician', 'Fashion Designer', 'Content Writer', 'Social Media Manager', 'Tutor',
  'Librarian', 'Medical Receptionist', 'Pharmacist', 'Interior Designer', 'Makeup Artist',
  'Preschool Teacher', 'Education Counselor', 'Spa Therapist', 'Accountant', 'Bank Teller'
];

// Job types
const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Daily Wage', 'Freelance', 'Internship', 'Work From Home', 'Temporary'];

async function seedMoreJobs() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Get existing employers
    const [employers] = await connection.execute('SELECT id, city, state FROM users WHERE role = "employer"');
    console.log(`📊 Found ${employers.length} existing employers`);

    let totalJobsAdded = 0;
    let fresherJobsAdded = 0;
    let womenJobsAdded = 0;

    // Add MORE jobs for each state
    for (const [state, stateData] of Object.entries(locationsData)) {
      console.log(`\n📍 Adding more jobs for ${state}...`);

      for (const [city, villages] of Object.entries(stateData.cities)) {
        // Find employer for this city
        const employer = employers.find(e => e.city === city && e.state === state);
        if (!employer) continue;

        // Add 20-30 jobs per city (increased from 8-15)
        const jobCount = Math.floor(Math.random() * 11) + 20; // 20-30 jobs

        for (let i = 0; i < jobCount; i++) {
          const category = jobCategories[Math.floor(Math.random() * jobCategories.length)];
          const titles = jobTitlesByCategory[category] || ['Worker', 'Staff', 'Employee'];
          let jobTitle = titles[Math.floor(Math.random() * titles.length)];

          // 30% chance for fresher job (increased from 20%)
          const isFresher = Math.random() < 0.3;
          if (isFresher) {
            const fresherWord = fresherKeywords[Math.floor(Math.random() * fresherKeywords.length)];
            jobTitle = `${fresherWord} ${jobTitle}`;
            fresherJobsAdded++;
          }

          // 25% chance for women-only job (increased from 15%)
          const isWomenOnly = womenPreferredJobs.includes(jobTitle.replace(/^(Fresher|Entry Level|Graduate|Trainee|Junior|Beginner|Internship)\s+/, '')) && Math.random() < 0.25;
          if (isWomenOnly) womenJobsAdded++;

          const jobType = jobTypes[Math.floor(Math.random() * jobTypes.length)];
          const village = villages[Math.floor(Math.random() * villages.length)];

          // Salary ranges based on category and experience
          let salaryMin, salaryMax;
          if (isFresher) {
            salaryMin = Math.floor(Math.random() * 5000) + 8000; // 8k-13k
            salaryMax = salaryMin + Math.floor(Math.random() * 12000) + 8000; // +8k to 20k
          } else if (category === 'Software Development' || category === 'IT Services') {
            salaryMin = Math.floor(Math.random() * 15000) + 20000; // 20k-35k
            salaryMax = salaryMin + Math.floor(Math.random() * 30000) + 20000; // +20k to 50k
          } else if (category === 'Healthcare' || category === 'Banking' || category === 'Finance & Accounting') {
            salaryMin = Math.floor(Math.random() * 10000) + 15000; // 15k-25k
            salaryMax = salaryMin + Math.floor(Math.random() * 20000) + 15000; // +15k to 35k
          } else if (jobType === 'Daily Wage') {
            salaryMin = Math.floor(Math.random() * 200) + 400; // 400-600 per day
            salaryMax = salaryMin + Math.floor(Math.random() * 300) + 200; // +200 to 500
          } else {
            salaryMin = Math.floor(Math.random() * 8000) + 10000; // 10k-18k
            salaryMax = salaryMin + Math.floor(Math.random() * 15000) + 10000; // +10k to 25k
          }

          const description = `We are looking for ${isFresher ? 'fresher' : 'experienced'} ${jobTitle.toLowerCase()} in ${village}, ${city}. ${
            isWomenOnly ? 'This position is exclusively for women candidates. ' : ''
          }${category} experience ${isFresher ? 'not required' : 'required'}. ${
            jobType === 'Work From Home' ? 'Work from home opportunity available. ' : ''
          }Good communication skills needed. Apply now!`;

          await connection.execute(
            `INSERT INTO jobs (title, description, category, jobType, salary_min, salary_max, village, city, state, employerId, womenOnly, isActive, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())`,
            [jobTitle, description, category, jobType, salaryMin, salaryMax, village, city, state, employer.id, isWomenOnly]
          );

          totalJobsAdded++;
        }

        console.log(`  ✅ ${city}: ${jobCount} more jobs added`);
      }
    }

    console.log('\n🎉 MORE JOBS ADDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════');
    console.log(`✅ Total NEW Jobs Added: ${totalJobsAdded}`);
    console.log(`💼 NEW Fresher Jobs: ${fresherJobsAdded} (${((fresherJobsAdded/totalJobsAdded)*100).toFixed(1)}%)`);
    console.log(`👩 NEW Women-Only Jobs: ${womenJobsAdded} (${((womenJobsAdded/totalJobsAdded)*100).toFixed(1)}%)`);
    console.log('═══════════════════════════════════════════════════');

    // Get total count
    const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM jobs');
    console.log(`\n📊 TOTAL Jobs in Database: ${countResult[0].total}`);

    const [fresherCount] = await connection.execute(
      `SELECT COUNT(*) as total FROM jobs WHERE title LIKE '%Fresher%' OR title LIKE '%Entry Level%' OR title LIKE '%Graduate%' OR title LIKE '%Trainee%' OR title LIKE '%Junior%' OR title LIKE '%Beginner%' OR title LIKE '%Internship%'`
    );
    console.log(`💼 TOTAL Fresher Jobs: ${fresherCount[0].total}`);

    const [womenCount] = await connection.execute('SELECT COUNT(*) as total FROM jobs WHERE womenOnly = 1');
    console.log(`👩 TOTAL Women-Only Jobs: ${womenCount[0].total}`);

    console.log('\n✅ Ready to use! Refresh your browser to see more jobs!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedMoreJobs();
