require('dotenv').config();
const pool = require('./config/db');
const bcrypt = require('bcrypt');

// Comprehensive location data with coordinates for Google Maps
const locations = {
  'Maharashtra': {
    'Mumbai': {
      villages: ['Andheri', 'Bandra', 'Borivali', 'Dadar', 'Goregaon', 'Juhu', 'Kurla', 'Malad', 'Santacruz', 'Vile Parle'],
      coordinates: { lat: 19.0760, lng: 72.8777 }
    },
    'Pune': {
      villages: ['Aundh', 'Baner', 'Deccan', 'Hinjewadi', 'Kothrud', 'Pimpri', 'Shivajinagar', 'Viman Nagar', 'Wakad', 'Yerawada'],
      coordinates: { lat: 18.5204, lng: 73.8567 }
    },
    'Nagpur': {
      villages: ['Sitabuldi', 'Dharampeth', 'Sadar', 'Mahal', 'Kamptee', 'Hingna', 'Khapa', 'Umred', 'Katol', 'Narkhed'],
      coordinates: { lat: 21.1458, lng: 79.0882 }
    },
    'Nashik': {
      villages: ['College Road', 'Gangapur Road', 'Panchavati', 'Satpur', 'MIDC', 'Adgaon', 'Deolali', 'Igatpuri', 'Sinnar', 'Dindori'],
      coordinates: { lat: 19.9975, lng: 73.7898 }
    },
    'Aurangabad': {
      villages: ['Cantonment', 'Garkheda', 'Jawaharnagar', 'Shahganj', 'Waluj', 'Cidco', 'Sillegaon', 'Paithan', 'Vaijapur', 'Kannad'],
      coordinates: { lat: 19.8762, lng: 75.3433 }
    }
  },
  'Karnataka': {
    'Bangalore': {
      villages: ['Whitefield', 'Electronic City', 'Koramangala', 'Indiranagar', 'HSR Layout', 'Marathahalli', 'Yelahanka', 'Jayanagar', 'BTM Layout', 'Bannerghatta'],
      coordinates: { lat: 12.9716, lng: 77.5946 }
    },
    'Mysore': {
      villages: ['Vijayanagar', 'Hebbal', 'Kuvempunagar', 'Gokulam', 'Jayalakshmipuram', 'Srirangapatna', 'Mandya', 'Hunsur', 'K.R. Nagar', 'Periyapatna'],
      coordinates: { lat: 12.2958, lng: 76.6394 }
    },
    'Mangalore': {
      villages: ['Kadri', 'Kankanady', 'Bejai', 'Bondel', 'Kodialbail', 'Ullal', 'Surathkal', 'Mulki', 'Bantwal', 'Puttur'],
      coordinates: { lat: 12.9141, lng: 74.8560 }
    }
  },
  'Tamil Nadu': {
    'Chennai': {
      villages: ['T Nagar', 'Anna Nagar', 'Velachery', 'Tambaram', 'Adyar', 'Porur', 'Guindy', 'Perungudi', 'Sholinganallur', 'OMR'],
      coordinates: { lat: 13.0827, lng: 80.2707 }
    },
    'Coimbatore': {
      villages: ['RS Puram', 'Gandhipuram', 'Saibaba Colony', 'Peelamedu', 'Singanallur', 'Podanur', 'Pollachi', 'Mettupalayam', 'Sulur', 'Kinathukadavu'],
      coordinates: { lat: 11.0168, lng: 76.9558 }
    },
    'Madurai': {
      villages: ['Anna Nagar', 'K.K. Nagar', 'Sellur', 'Thiruparankundram', 'Avaniyapuram', 'Melur', 'Usilampatti', 'Vadipatti', 'Sholavandan', 'Thirumangalam'],
      coordinates: { lat: 9.9252, lng: 78.1198 }
    }
  },
  'Delhi': {
    'New Delhi': {
      villages: ['Connaught Place', 'Karol Bagh', 'Dwarka', 'Rohini', 'Pitampura', 'Janakpuri', 'Saket', 'Vasant Kunj', 'Nehru Place', 'Lajpat Nagar'],
      coordinates: { lat: 28.6139, lng: 77.2090 }
    },
    'South Delhi': {
      villages: ['Hauz Khas', 'Greater Kailash', 'Defence Colony', 'Green Park', 'Malviya Nagar', 'Mehrauli', 'Vasant Vihar', 'Chhatarpur', 'Safdarjung', 'RK Puram'],
      coordinates: { lat: 28.5244, lng: 77.2066 }
    },
    'East Delhi': {
      villages: ['Mayur Vihar', 'Preet Vihar', 'Laxmi Nagar', 'Karkardooma', 'Shahdara', 'Patparganj', 'Vivek Vihar', 'Dilshad Garden', 'Gandhi Nagar', 'Krishna Nagar'],
      coordinates: { lat: 28.6271, lng: 77.3072 }
    }
  },
  'Gujarat': {
    'Ahmedabad': {
      villages: ['Navrangpura', 'Satellite', 'Maninagar', 'Vastrapur', 'Chandkheda', 'Gota', 'Naroda', 'Bapunagar', 'Sarkhej', 'Bopal'],
      coordinates: { lat: 23.0225, lng: 72.5714 }
    },
    'Surat': {
      villages: ['Adajan', 'Vesu', 'Piplod', 'Katargam', 'Athwa', 'Udhna', 'Sachin', 'Kamrej', 'Bardoli', 'Kadodara'],
      coordinates: { lat: 21.1702, lng: 72.8311 }
    }
  }
};

// Job categories with realistic data
const jobCategories = [
  { category: 'Construction', titles: ['Construction Worker', 'Mason', 'Electrician', 'Plumber', 'Painter', 'Welder', 'Carpenter', 'Helper', 'Site Supervisor', 'Labour'] },
  { category: 'Agriculture', titles: ['Farm Worker', 'Tractor Driver', 'Supervisor', 'Crop Manager', 'Harvester', 'Dairy Worker', 'Poultry Worker', 'Gardener'] },
  { category: 'Retail', titles: ['Sales Executive', 'Cashier', 'Store Keeper', 'Delivery Boy', 'Stock Manager', 'Customer Service'] },
  { category: 'Hospitality', titles: ['Cook', 'Waiter', 'Housekeeping', 'Kitchen Helper', 'Hotel Staff', 'Restaurant Manager'] },
  { category: 'Healthcare', titles: ['Nurse', 'Attendant', 'Pharmacy Assistant', 'Medical Representative', 'Lab Technician'] },
  { category: 'Education', titles: ['Teacher', 'Tutor', 'Teaching Assistant', 'School Administrator', 'Computer Instructor'] },
  { category: 'Security', titles: ['Security Guard', 'Watchman', 'Security Supervisor', 'Bouncer'] },
  { category: 'Transportation', titles: ['Driver', 'Delivery Person', 'Auto Driver', 'Tempo Driver', 'Logistics Helper'] },
  { category: 'Manufacturing', titles: ['Machine Operator', 'Quality Inspector', 'Packing Worker', 'Assembly Worker', 'Warehouse Worker'] },
  { category: 'IT & Software', titles: ['Data Entry', 'Computer Operator', 'Junior Developer', 'Support Engineer', 'Tester'] }
];

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Daily Wage', 'Freelance'];

async function seedRealtimeJobs() {
  try {
    console.log('🌱 Seeding real-time location-based jobs...\n');

    // First, create employers for each location
    const employers = [];
    let employerCount = 0;

    for (const [state, cities] of Object.entries(locations)) {
      for (const [city, data] of Object.entries(cities)) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const companyName = `${city} ${['Industries', 'Services', 'Corporation', 'Enterprises', 'Group'][Math.floor(Math.random() * 5)]}`;
        
        const [result] = await pool.query(
          `INSERT INTO users (email, password, name, role, phone, state, city, created_at, updated_at)
           VALUES (?, ?, ?, 'employer', ?, ?, ?, NOW(), NOW())`,
          [
            `employer.${city.toLowerCase().replace(/\s+/g, '')}@example.com`,
            hashedPassword,
            companyName,
            `+91${9000000000 + employerCount}`,
            state,
            city
          ]
        );
        
        employers.push({
          id: result.insertId,
          state,
          city,
          villages: data.villages,
          coordinates: data.coordinates
        });
        
        employerCount++;
      }
    }

    console.log(`✅ Created ${employerCount} employers across India\n`);

    // Now create diverse jobs for each location
    let jobCount = 0;

    for (const employer of employers) {
      // Create 8-12 jobs per employer
      const numJobs = Math.floor(Math.random() * 5) + 8;

      for (let i = 0; i < numJobs; i++) {
        // Random category
        const categoryData = jobCategories[Math.floor(Math.random() * jobCategories.length)];
        const title = categoryData.titles[Math.floor(Math.random() * categoryData.titles.length)];
        
        // Random village from employer's city
        const village = employer.villages[Math.floor(Math.random() * employer.villages.length)];
        
        // Random job type
        const jobType = jobTypes[Math.floor(Math.random() * jobTypes.length)];
        
        // Salary based on job type
        let salaryMin, salaryMax;
        if (jobType === 'Daily Wage') {
          salaryMin = 400 + Math.floor(Math.random() * 300);
          salaryMax = salaryMin + Math.floor(Math.random() * 400);
        } else {
          salaryMin = 10000 + Math.floor(Math.random() * 20000);
          salaryMax = salaryMin + Math.floor(Math.random() * 20000);
        }

        // Random special attributes
        const womenOnly = Math.random() < 0.15; // 15% women-only jobs
        const isGovt = categoryData.category === 'Education' && Math.random() < 0.3;

        const description = `Looking for ${title} in ${village}, ${employer.city}. ${
          womenOnly ? 'Only female candidates. ' : ''
        }${isGovt ? 'Government job. ' : ''}Experience preferred but freshers can apply.`;

        const requirements = `${categoryData.category === 'IT & Software' ? 'Basic computer knowledge, ' : ''}${
          Math.random() < 0.5 ? 'Communication skills, ' : ''
        }Local candidates preferred, ${Math.random() < 0.5 ? 'Own vehicle required, ' : ''}Immediate joining`;

        await pool.query(
          `INSERT INTO jobs 
           (title, description, employerId, state, city, village, salary_min, salary_max, 
            jobType, category, requirements, isActive, womenOnly, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true, ?, NOW(), NOW())`,
          [
            title,
            description,
            employer.id,
            employer.state,
            employer.city,
            village,
            salaryMin,
            salaryMax,
            jobType,
            categoryData.category,
            requirements,
            womenOnly
          ]
        );

        jobCount++;
      }
    }

    console.log(`✅ Created ${jobCount} real-time jobs across all locations\n`);

    // Create location coordinates table for Google Maps
    await pool.query(`
      CREATE TABLE IF NOT EXISTS location_coordinates (
        id INT PRIMARY KEY AUTO_INCREMENT,
        state VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_location (state, city),
        INDEX idx_state_city (state, city)
      )
    `);

    console.log('✅ Created location_coordinates table\n');

    // Insert location coordinates
    for (const [state, cities] of Object.entries(locations)) {
      for (const [city, data] of Object.entries(cities)) {
        await pool.query(
          `INSERT INTO location_coordinates (state, city, latitude, longitude)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE latitude = ?, longitude = ?`,
          [state, city, data.coordinates.lat, data.coordinates.lng, data.coordinates.lat, data.coordinates.lng]
        );
      }
    }

    console.log('✅ Inserted location coordinates for Google Maps\n');

    console.log('\n🎉 Real-time job seeding completed!\n');
    console.log('📊 Summary:');
    console.log(`   - States: ${Object.keys(locations).length}`);
    console.log(`   - Cities: ${employerCount}`);
    console.log(`   - Employers: ${employerCount}`);
    console.log(`   - Jobs: ${jobCount}`);
    console.log(`   - Location coordinates: ${employerCount}`);
    console.log('\n📝 Test Login:');
    console.log('   Email: employer.mumbai@example.com');
    console.log('   Password: password123\n');

  } catch (error) {
    console.error('❌ Error seeding jobs:', error);
  } finally {
    process.exit();
  }
}

seedRealtimeJobs();
