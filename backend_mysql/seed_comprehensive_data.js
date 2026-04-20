// Comprehensive Database Seeding with All Indian States, Cities, Villages and Jobs
const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Lokesh',
  database: 'village_jobs'
};

// Comprehensive Indian locations data
const locationsData = {
  // Northern States
  'Delhi': {
    cities: {
      'Central Delhi': ['Connaught Place', 'Karol Bagh', 'Paharganj', 'Chandni Chowk', 'Daryaganj', 'Rajinder Nagar', 'Patel Nagar'],
      'South Delhi': ['Hauz Khas', 'Saket', 'Malviya Nagar', 'Lajpat Nagar', 'Greater Kailash', 'Defence Colony', 'Vasant Vihar'],
      'North Delhi': ['Model Town', 'Civil Lines', 'Kamla Nagar', 'Shakti Nagar', 'Rohini', 'Pitampura', 'Shalimar Bagh'],
      'East Delhi': ['Mayur Vihar', 'Preet Vihar', 'Laxmi Nagar', 'Shahdara', 'Gandhi Nagar', 'Krishna Nagar', 'Anand Vihar'],
      'West Delhi': ['Janakpuri', 'Rajouri Garden', 'Tilak Nagar', 'Vikaspuri', 'Punjabi Bagh', 'Paschim Vihar', 'Uttam Nagar']
    },
    coordinates: { lat: 28.7041, lng: 77.1025 }
  },
  'Punjab': {
    cities: {
      'Chandigarh': ['Sector 17', 'Sector 22', 'Sector 35', 'Sector 43', 'Sector 8', 'Mani Majra', 'Burail'],
      'Amritsar': ['Golden Temple Area', 'Ranjit Avenue', 'Lawrence Road', 'Mall Road', 'Chheharta', 'Batala Road', 'Majitha Road'],
      'Ludhiana': ['Model Town', 'Civil Lines', 'Sarabha Nagar', 'Pakhowal Road', 'Ferozepur Road', 'Gill Road', 'BRS Nagar'],
      'Jalandhar': ['Civil Lines', 'Model Town', 'Rama Mandi', 'Basti Bawa Khel', 'Nakodar Road', 'Central Town', 'Preet Nagar'],
      'Patiala': ['Old City', 'Urban Estate', 'Tripuri', 'Rajpura Road', 'Sangrur Road', 'Leela Bhawan', 'Bahadurgarh']
    },
    coordinates: { lat: 30.9010, lng: 75.8573 }
  },
  'Haryana': {
    cities: {
      'Gurugram': ['Cyber City', 'DLF Phase 1', 'Sector 14', 'Sector 29', 'Sohna Road', 'Golf Course Road', 'MG Road'],
      'Faridabad': ['Old Faridabad', 'NIT', 'Sector 16', 'Sector 21', 'Ballabhgarh', 'NHPC Chowk', 'Sector 37'],
      'Panipat': ['Model Town', 'GT Road', 'Huda Sector', 'Sanauli Road', 'Tehsil Camp', 'Amar Colony', 'Civil Lines'],
      'Ambala': ['Ambala Cantt', 'Ambala City', 'Baldev Nagar', 'Sarsehri', 'Mahesh Nagar', 'Defence Colony', 'Model Town'],
      'Karnal': ['Model Town', 'Kunjpura Road', 'GT Road', 'Sector 13', 'Old City', 'Gharaunda Road', 'Namaste Chowk']
    },
    coordinates: { lat: 29.0588, lng: 76.0856 }
  },
  'Uttar Pradesh': {
    cities: {
      'Lucknow': ['Hazratganj', 'Gomti Nagar', 'Aliganj', 'Indira Nagar', 'Alambagh', 'Aminabad', 'Chowk'],
      'Kanpur': ['Civil Lines', 'Kidwai Nagar', 'Swaroop Nagar', 'Govind Nagar', 'Kakadeo', 'Arya Nagar', 'Birhana Road'],
      'Agra': ['Taj Ganj', 'Sadar Bazaar', 'Civil Lines', 'Dayalbagh', 'Kamla Nagar', 'Sikandra', 'Fatehabad Road'],
      'Varanasi': ['Cantonment', 'Sigra', 'Lanka', 'Nadesar', 'Sunderpur', 'Bhelupur', 'Mahmoorganj'],
      'Noida': ['Sector 18', 'Sector 62', 'Sector 15', 'Sector 37', 'Greater Noida', 'Sector 50', 'Film City']
    },
    coordinates: { lat: 26.8467, lng: 80.9462 }
  },
  // Western States
  'Maharashtra': {
    cities: {
      'Mumbai': ['Andheri', 'Bandra', 'Dadar', 'Worli', 'Colaba', 'Powai', 'Vikhroli', 'Mulund', 'Thane', 'Borivali'],
      'Pune': ['Kothrud', 'Hadapsar', 'Shivajinagar', 'Wakad', 'Hinjewadi', 'Viman Nagar', 'Aundh', 'Kharadi', 'Pimpri', 'Chinchwad'],
      'Nagpur': ['Sitabuldi', 'Dharampeth', 'Sadar', 'Civil Lines', 'Laxmi Nagar', 'Manish Nagar', 'Pratap Nagar', 'Wardhaman Nagar'],
      'Nashik': ['Panchavati', 'College Road', 'Satpur', 'CIDCO', 'Gangapur Road', 'Dwarka', 'Mumbai Naka', 'Ashok Stambh'],
      'Aurangabad': ['Cidco', 'Jalna Road', 'Beed Bypass', 'Kranti Chowk', 'N-Town', 'Garkheda', 'Waluj', 'Osmanpura']
    },
    coordinates: { lat: 19.0760, lng: 72.8777 }
  },
  'Gujarat': {
    cities: {
      'Ahmedabad': ['Satellite', 'Navrangpura', 'Vastrapur', 'Maninagar', 'Naranpura', 'Paldi', 'CG Road', 'SG Highway', 'Bopal'],
      'Surat': ['Adajan', 'Vesu', 'Rander', 'Athwalines', 'Nanpura', 'Piplod', 'Katargam', 'Udhna', 'Varachha'],
      'Vadodara': ['Alkapuri', 'Sayajigunj', 'Manjalpur', 'Vasna Road', 'Akota', 'Productivity Road', 'Gorwa', 'Waghodia Road'],
      'Rajkot': ['Race Course', 'Kalavad Road', 'Raiya Road', 'University Road', 'Kalawad Road', 'Mavdi', 'Kotecha Chowk'],
      'Gandhinagar': ['Sector 1', 'Sector 7', 'Sector 11', 'Sector 21', 'Kudasan', 'Sargasan', 'Raysan']
    },
    coordinates: { lat: 23.0225, lng: 72.5714 }
  },
  'Rajasthan': {
    cities: {
      'Jaipur': ['C Scheme', 'Vaishali Nagar', 'Malviya Nagar', 'Mansarovar', 'Jagatpura', 'Tonk Road', 'Raja Park', 'MI Road'],
      'Jodhpur': ['Sardarpura', 'Ratanada', 'Chopasni', 'Shastri Nagar', 'Paota', 'Residency Road', 'Circuit House'],
      'Udaipur': ['City Palace Area', 'Hiran Magri', 'Fateh Sagar', 'Sukhadia Circle', 'Sector 14', 'Sector 4', 'Ambamata'],
      'Kota': ['Civil Lines', 'Vigyan Nagar', 'Talwandi', 'Dadabari', 'Mahaveer Nagar', 'Rangbari', 'Gumanpura'],
      'Ajmer': ['Civil Lines', 'Vaishali Nagar', 'Pushkar Road', 'Jaipur Road', 'Nasirabad Road', 'Kaiser Ganj', 'Anasagar']
    },
    coordinates: { lat: 26.9124, lng: 75.7873 }
  },
  // Southern States
  'Karnataka': {
    cities: {
      'Bangalore': ['Whitefield', 'Indiranagar', 'Koramangala', 'HSR Layout', 'Electronic City', 'Marathahalli', 'Jayanagar', 'BTM Layout'],
      'Mysore': ['Kuvempunagar', 'Jayalakshmipuram', 'VV Mohalla', 'Saraswathipuram', 'Vijayanagar', 'Hebbal', 'Bannimantap'],
      'Hubli': ['Vidyanagar', 'Gokul Road', 'Unkal', 'Navanagar', 'Keshwapur', 'Old Hubli', 'Shirur Park'],
      'Mangalore': ['Kankanady', 'Kadri', 'Hampankatta', 'Bejai', 'Kodialbail', 'Pandeshwar', 'Balmatta'],
      'Belgaum': ['Tilakwadi', 'Camp', 'Hindwadi', 'Ganeshpur', 'Angol', 'RPD Cross', 'Shahapur']
    },
    coordinates: { lat: 12.9716, lng: 77.5946 }
  },
  'Tamil Nadu': {
    cities: {
      'Chennai': ['T Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'Porur', 'Tambaram', 'Chrompet', 'Perungudi', 'Nungambakkam'],
      'Coimbatore': ['RS Puram', 'Gandhipuram', 'Saibaba Colony', 'Peelamedu', 'Singanallur', 'Saravanampatti', 'Kalapatti'],
      'Madurai': ['Anna Nagar', 'K Pudur', 'Goripalayam', 'Villapuram', 'Tallakulam', 'Pasumalai', 'Thirunagar'],
      'Trichy': ['Cantonment', 'Thillai Nagar', 'K K Nagar', 'Srirangam', 'Tennur', 'Anna Nagar', 'Puthur'],
      'Salem': ['Fairlands', 'Shevapet', 'Suramangalam', 'Ammapet', 'Hasthampatti', 'Junction', 'New Bus Stand']
    },
    coordinates: { lat: 13.0827, lng: 80.2707 }
  },
  'Kerala': {
    cities: {
      'Thiruvananthapuram': ['Kazhakootam', 'Pattom', 'Vazhuthacaud', 'Sasthamangalam', 'Peroorkada', 'Medical College', 'Palayam'],
      'Kochi': ['Edappally', 'Kakkanad', 'Marine Drive', 'Palarivattom', 'Vyttila', 'Fort Kochi', 'Ernakulam South'],
      'Kozhikode': ['Mavoor Road', 'Palayam', 'Tali', 'Medical College', 'Kannur Road', 'Beach Road', 'Kuttichira'],
      'Thrissur': ['Swaraj Round', 'East Fort', 'Olari', 'Poothole', 'Medical College', 'Cherpu Road', 'Mannuthy'],
      'Kannur': ['Fort Road', 'Talap', 'Thalassery Road', 'Burnassery', 'Chirakkal', 'Baby Beach', 'Thavakkara']
    },
    coordinates: { lat: 8.5241, lng: 76.9366 }
  },
  'Andhra Pradesh': {
    cities: {
      'Visakhapatnam': ['MVP Colony', 'Madhurawada', 'Gajuwaka', 'Dwaraka Nagar', 'NAD Junction', 'RK Beach', 'Siripuram'],
      'Vijayawada': ['Benz Circle', 'Governorpet', 'Moghalrajpuram', 'Payakapuram', 'Patamata', 'Auto Nagar', 'Gollapudi'],
      'Guntur': ['Brodipet', 'Arundelpet', 'Lakshmipuram', 'Kothapet', 'Pattabhipuram', 'Nallapadu', 'Gorantla'],
      'Tirupati': ['Tilak Road', 'AIR Bypass Road', 'Renigunta Road', 'Kapila Theertham', 'Alipiri', 'Korlagunta', 'Lakshmipuram'],
      'Kakinada': ['Suryarao Pet', 'Jagannaickpur', 'Sarpavaram', 'Turangi', 'Ramanayyapeta', 'Vakalapudi', 'RTC Complex']
    },
    coordinates: { lat: 17.6868, lng: 83.2185 }
  },
  'Telangana': {
    cities: {
      'Hyderabad': ['Banjara Hills', 'Jubilee Hills', 'Hitech City', 'Gachibowli', 'Madhapur', 'Kukatpally', 'Secunderabad', 'Ameerpet'],
      'Warangal': ['Hanamkonda', 'Kazipet', 'Subedari', 'Nakkalagutta', 'Lal Bahadur Nagar', 'Hunter Road', 'Chandra'],
      'Nizamabad': ['Navipet', 'Tilak Road', 'Dichpally', 'Armoor Road', 'Old Bus Stand', 'Ramagundam Road', 'Bodhan Road'],
      'Karimnagar': ['Manakondur', 'Mukarampura', 'Ramagundam', 'Godavarikhani', 'Bommakal', 'Civil Lines', 'Kaman'],
      'Khammam': ['Wyra Road', 'Balaji Nagar', 'Old City', 'Ganesh Nagar', 'Peddagattu', 'Kothagudem', 'Sathupalli']
    },
    coordinates: { lat: 17.3850, lng: 78.4867 }
  },
  // Eastern States
  'West Bengal': {
    cities: {
      'Kolkata': ['Salt Lake', 'Park Street', 'New Town', 'Alipore', 'Ballygunge', 'Jadavpur', 'Behala', 'Howrah'],
      'Siliguri': ['Matigara', 'Pradhan Nagar', 'Salugara', 'Bhaktinagar', 'Kawakhali', 'Champasari', 'Hill Cart Road'],
      'Durgapur': ['City Centre', 'Bengali More', 'Steel Township', 'Bidhannagar', 'Sahid Khudiram', 'Benachity', 'Muchipara'],
      'Asansol': ['Burnpur', 'Raniganj', 'Kulti', 'Hirapur', 'Neamatpur', 'Kalipahari', 'Sen Raleigh'],
      'Howrah': ['Shibpur', 'Santragachi', 'Liluah', 'Bally', 'Uttarpara', 'Belur', 'Kadamtala']
    },
    coordinates: { lat: 22.5726, lng: 88.3639 }
  },
  'Bihar': {
    cities: {
      'Patna': ['Boring Road', 'Kankarbagh', 'Rajendra Nagar', 'Patliputra', 'Fraser Road', 'Bailey Road', 'Danapur'],
      'Gaya': ['Sher Shah Suri Road', 'Civil Lines', 'Jhangi', 'Tekari Road', 'Rampur', 'Bodh Gaya', 'Manpur'],
      'Bhagalpur': ['Adampur', 'Sabzibagh', 'Khalifabagh', 'Champanagar', 'Tilkamanjhi', 'Tatarpur', 'Kahalgaon'],
      'Muzaffarpur': ['Mithanpura', 'Juran Chapra', 'Narayanpur', 'Saraiyaganj', 'Chowk Bazar', 'Kazi Mohalla', 'Ahiyapur'],
      'Darbhanga': ['Laheriasarai', 'Kankarbagh', 'Donar', 'Imli Chatti', 'Puraina', 'Shekhpura', 'Town Hall']
    },
    coordinates: { lat: 25.5941, lng: 85.1376 }
  },
  'Odisha': {
    cities: {
      'Bhubaneswar': ['Kharavel Nagar', 'Patia', 'Chandrasekharpur', 'Nayapalli', 'Saheed Nagar', 'Jaydev Vihar', 'Unit 1'],
      'Cuttack': ['Badambadi', 'Mangalabag', 'Buxi Bazaar', 'Jobra', 'Jagatpur', 'Bidanasi', 'CDA'],
      'Rourkela': ['Sector 1', 'Sector 19', 'Civil Township', 'Udit Nagar', 'Chhend', 'Panposh', 'Fertilizer Township'],
      'Berhampur': ['Gopalpur', 'Gandhi Nagar', 'Ankuli', 'Bijipur', 'Bada Bazaar', 'New Court', 'Hata Sahi'],
      'Sambalpur': ['Ainthapali', 'Modipara', 'Budharaja', 'Bareipali', 'Dhanupali', 'Remed', 'Naktideul']
    },
    coordinates: { lat: 20.2961, lng: 85.8245 }
  },
  'Jharkhand': {
    cities: {
      'Ranchi': ['Lalpur', 'Doranda', 'Harmu', 'Hinoo', 'Kanke Road', 'Morabadi', 'Main Road'],
      'Jamshedpur': ['Bistupur', 'Sakchi', 'Kadma', 'Sonari', 'Golmuri', 'Mango', 'Jugsalai'],
      'Dhanbad': ['Bank More', 'Hirapur', 'Bartand', 'Saraidhela', 'Jharia', 'Katras', 'Sindri'],
      'Bokaro': ['Sector 1', 'Sector 4', 'Chas', 'City Centre', 'Thermal', 'Gomia', 'Pindrajora'],
      'Hazaribagh': ['Chouparan', 'Demotand', 'Shahpur', 'Bada Bazar', 'Kotwali Road', 'Canary Hills', 'Ranchi Road']
    },
    coordinates: { lat: 23.3441, lng: 85.3096 }
  },
  // North-Eastern States
  'Assam': {
    cities: {
      'Guwahati': ['Panbazar', 'Fancy Bazaar', 'Ulubari', 'Beltola', 'Dispur', 'Six Mile', 'Ganeshguri'],
      'Dibrugarh': ['Mancotta', 'Chowkidinghee', 'Graham Bazaar', 'Khalihamari', 'Lahowal', 'Naharkatia', 'Duliajan'],
      'Jorhat': ['Gar Ali', 'Shiva Mandir', 'Baruah Ali', 'Tarajan', 'Dhodar Ali', 'Pulibor', 'Bhogdoi'],
      'Silchar': ['Jail Road', 'Link Road', 'Premtala', 'Tarapur', 'Rangirkhari', 'Itkhola', 'Malugram'],
      'Tezpur': ['Chowk Bazaar', 'Mission Chariali', 'Gohpur Road', 'North Tezpur', 'Pachim Tezpur', 'Bhomoraguri', 'Da Parbatia']
    },
    coordinates: { lat: 26.1445, lng: 91.7362 }
  },
  // Central States  
  'Madhya Pradesh': {
    cities: {
      'Indore': ['Vijay Nagar', 'MG Road', 'Rajwada', 'Palasia', 'Sapna Sangeeta', 'Bhawarkuan', 'Scheme 54'],
      'Bhopal': ['New Market', 'MP Nagar', 'Arera Colony', 'Koh-e-Fiza', 'Bairagarh', 'Habibganj', 'TT Nagar'],
      'Jabalpur': ['Napier Town', 'Civil Lines', 'Wright Town', 'Madan Mahal', 'Gwarighat', 'Gokalpur', 'Vijay Nagar'],
      'Gwalior': ['City Centre', 'Lashkar', 'Morar', 'Jhansi Road', 'Jayendraganj', 'Thatipur', 'Maharaj Bada'],
      'Ujjain': ['Freeganj', 'Nanakheda', 'Mahakal Road', 'Dewas Gate', 'Indore Road', 'Chimanganj', 'Agar Road']
    },
    coordinates: { lat: 22.7196, lng: 75.8577 }
  },
  'Chhattisgarh': {
    cities: {
      'Raipur': ['Civil Lines', 'Pandri', 'Shankar Nagar', 'Mowa', 'Devendra Nagar', 'Tatibandh', 'Gudhiyari'],
      'Bhilai': ['Sector 1', 'Sector 6', 'Supela', 'Nehru Nagar', 'Civic Centre', 'Khursipar', 'Power House'],
      'Bilaspur': ['Link Road', 'Nehru Nagar', 'Sarkanda', 'Vyapar Vihar', 'Ganjpara', 'Rajendra Nagar', 'Seepat Road'],
      'Korba': ['SECL Area', 'Power Plant', 'Darri Road', 'Rajwade Chowk', 'Pali Road', 'Balco Road', 'Civil Lines'],
      'Durg': ['Bhilai Road', 'Supela', 'Nehru Nagar', 'Mohan Nagar', 'Khursipar', 'Hirmi', 'Borsi']
    },
    coordinates: { lat: 21.2514, lng: 81.6296 }
  }
};

// Job categories with variations
const jobCategories = [
  'Construction', 'Agriculture', 'Software Development', 'Healthcare', 
  'Education', 'Manufacturing', 'Retail', 'Hospitality', 'Transportation',
  'Security', 'Government', 'IT Services', 'Banking', 'Real Estate',
  'Telecommunications', 'Food Processing', 'Textile', 'Automobile',
  'Pharmaceuticals', 'Engineering'
];

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Daily Wage', 'Freelance', 'Internship'];

// Specific job titles by category
const jobTitlesByCategory = {
  'Construction': ['Site Engineer', 'Mason', 'Construction Laborer', 'Foreman', 'Carpenter', 'Electrician', 'Plumber', 'Painter', 'Welder'],
  'Agriculture': ['Farm Worker', 'Agricultural Laborer', 'Tractor Driver', 'Crop Manager', 'Dairy Farm Worker', 'Poultry Farm Worker', 'Gardener'],
  'Software Development': ['Software Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'Mobile App Developer', 'QA Engineer', 'DevOps Engineer'],
  'Healthcare': ['Nurse', 'Medical Assistant', 'Pharmacist', 'Lab Technician', 'Ward Boy', 'Hospital Attendant', 'Healthcare Worker'],
  'Education': ['Teacher', 'Assistant Teacher', 'Tutor', 'School Administrator', 'Educational Counselor', 'Library Assistant', 'Lab Assistant'],
  'Manufacturing': ['Production Worker', 'Machine Operator', 'Quality Inspector', 'Assembly Line Worker', 'Packaging Worker', 'Warehouse Worker'],
  'Retail': ['Sales Associate', 'Store Manager', 'Cashier', 'Store Keeper', 'Shop Assistant', 'Inventory Manager', 'Customer Service'],
  'Hospitality': ['Hotel Staff', 'Waiter', 'Chef', 'Kitchen Helper', 'Housekeeping', 'Front Desk', 'Room Service'],
  'Transportation': ['Driver', 'Delivery Boy', 'Logistics Coordinator', 'Truck Driver', 'Cab Driver', 'Warehouse Manager'],
  'Security': ['Security Guard', 'Watchman', 'Security Supervisor', 'CCTV Operator', 'Bouncer'],
  'Government': ['Clerk', 'Peon', 'Data Entry Operator', 'Assistant', 'Government Officer'],
  'IT Services': ['IT Support', 'Network Engineer', 'System Administrator', 'Technical Support', 'IT Consultant'],
  'Banking': ['Bank Clerk', 'Cashier', 'Loan Officer', 'Customer Service Representative', 'Branch Manager'],
  'Real Estate': ['Property Consultant', 'Sales Executive', 'Real Estate Agent', 'Property Manager'],
  'Telecommunications': ['Telecom Engineer', 'Customer Care Executive', 'Network Technician', 'Field Engineer'],
  'Food Processing': ['Food Processing Worker', 'Quality Checker', 'Packaging Operator', 'Production Supervisor'],
  'Textile': ['Tailor', 'Textile Worker', 'Fabric Cutter', 'Embroidery Worker', 'Quality Inspector'],
  'Automobile': ['Auto Mechanic', 'Service Advisor', 'Auto Electrician', 'Parts Manager', 'Assembly Worker'],
  'Pharmaceuticals': ['Pharmaceutical Sales', 'Medical Representative', 'Production Worker', 'Quality Control'],
  'Engineering': ['Mechanical Engineer', 'Civil Engineer', 'Electrical Engineer', 'Design Engineer', 'Project Engineer']
};

// Fresher-specific keywords
const fresherKeywords = ['Fresher', 'Entry Level', 'Graduate', 'Trainee', 'Junior'];

async function seedDatabase() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Clear existing data
    await connection.query('DELETE FROM jobs WHERE id > 0');
    await connection.query('DELETE FROM users WHERE role = "employer" AND id > 1');
    await connection.query('DELETE FROM location_coordinates WHERE id > 0');
    console.log('🗑️  Cleared old data');

    let employerId = 1;
    let jobId = 1;
    const employers = [];
    const jobs = [];
    const coordinates = [];

    // Generate jobs for each state
    for (const [state, data] of Object.entries(locationsData)) {
      console.log(`\n📍 Processing ${state}...`);
      
      for (const [city, villages] of Object.entries(data.cities)) {
        // Add coordinates for this city
        const cityCoords = data.coordinates;
        // Offset coordinates slightly for each city
        const cityOffset = Object.keys(data.cities).indexOf(city) * 0.5;
        coordinates.push({
          state,
          city,
          latitude: (cityCoords.lat + (Math.random() - 0.5) * 0.5).toFixed(8),
          longitude: (cityCoords.lng + (Math.random() - 0.5) * 0.5).toFixed(8)
        });

        // Create employer for this city
        const employerEmail = `employer.${city.toLowerCase().replace(/\s+/g, '')}@example.com`;
        const employerName = `${city} Enterprises`;
        
        const [employerResult] = await connection.query(
          `INSERT INTO users (name, email, password, role, city, state, created_at) 
           VALUES (?, ?, ?, 'employer', ?, ?, NOW())`,
          [employerName, employerEmail, 'password123', city, state]
        );
        
        const currentEmployerId = employerResult.insertId;
        employers.push({ id: currentEmployerId, name: employerName, email: employerEmail });
        
        // Generate 8-15 jobs per city
        const numJobsForCity = Math.floor(Math.random() * 8) + 8;
        
        for (let i = 0; i < numJobsForCity; i++) {
          const village = villages[Math.floor(Math.random() * villages.length)];
          const category = jobCategories[Math.floor(Math.random() * jobCategories.length)];
          const jobType = jobTypes[Math.floor(Math.random() * jobTypes.length)];
          const titles = jobTitlesByCategory[category] || ['Worker'];
          
          // 20% chance of being a fresher job
          const isFresher = Math.random() < 0.2;
          let title = titles[Math.floor(Math.random() * titles.length)];
          if (isFresher) {
            const fresherPrefix = fresherKeywords[Math.floor(Math.random() * fresherKeywords.length)];
            title = `${fresherPrefix} ${title}`;
          }
          
          // 15% chance of being women-only
          const womenOnly = Math.random() < 0.15;
          
          // Salary ranges based on category and type
          let salaryMin, salaryMax;
          if (category === 'Software Development' || category === 'IT Services') {
            salaryMin = isFresher ? 15000 : 25000;
            salaryMax = isFresher ? 30000 : 60000;
          } else if (category === 'Healthcare' || category === 'Engineering') {
            salaryMin = isFresher ? 12000 : 20000;
            salaryMax = isFresher ? 25000 : 45000;
          } else if (jobType === 'Daily Wage') {
            salaryMin = 400;
            salaryMax = 800;
          } else {
            salaryMin = isFresher ? 8000 : 12000;
            salaryMax = isFresher ? 15000 : 25000;
          }
          
          const description = isFresher 
            ? `We are looking for ${womenOnly ? 'female' : ''} ${title.toLowerCase()} in ${village}, ${city}. Freshers are welcome. Training will be provided. This is a ${jobType.toLowerCase()} position.`
            : `Hiring ${womenOnly ? 'female' : ''} ${title.toLowerCase()} for ${category.toLowerCase()} work in ${village}, ${city}. This is a ${jobType.toLowerCase()} opportunity.`;
          
          const job = {
            title,
            description,
            category,
            jobType,
            salaryMin,
            salaryMax,
            village,
            city,
            state,
            employerId: currentEmployerId,
            womenOnly: womenOnly ? 1 : 0,
            isActive: 1
          };
          
          await connection.query(
            `INSERT INTO jobs (title, description, category, jobType, salary_min, salary_max, 
             village, city, state, employerId, womenOnly, isActive, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [job.title, job.description, job.category, job.jobType, job.salaryMin, job.salaryMax,
             job.village, job.city, job.state, job.employerId, job.womenOnly, job.isActive]
          );
          
          jobs.push(job);
        }
        
        console.log(`  ✅ ${city}: ${numJobsForCity} jobs created`);
      }
    }

    // Insert location coordinates
    console.log('\n📍 Adding location coordinates...');
    for (const coord of coordinates) {
      await connection.query(
        `INSERT INTO location_coordinates (state, city, latitude, longitude) 
         VALUES (?, ?, ?, ?)`,
        [coord.state, coord.city, coord.latitude, coord.longitude]
      );
    }

    console.log('\n\n🎉 DATABASE SEEDING COMPLETED!');
    console.log('═══════════════════════════════════════════════════');
    console.log(`✅ Total States: ${Object.keys(locationsData).length}`);
    console.log(`✅ Total Cities: ${coordinates.length}`);
    console.log(`✅ Total Villages: ${Object.values(locationsData).reduce((sum, state) => sum + Object.values(state.cities).flat().length, 0)}`);
    console.log(`✅ Total Employers: ${employers.length}`);
    console.log(`✅ Total Jobs: ${jobs.length}`);
    console.log('\n📊 Job Distribution:');
    
    const categoryCount = {};
    jobs.forEach(job => {
      categoryCount[job.category] = (categoryCount[job.category] || 0) + 1;
    });
    
    Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`   ${category}: ${count} jobs`);
      });
    
    const fresherCount = jobs.filter(j => fresherKeywords.some(k => j.title.includes(k))).length;
    const womenCount = jobs.filter(j => j.womenOnly).length;
    
    console.log(`\n💼 Fresher Jobs: ${fresherCount}`);
    console.log(`👩 Women-Only Jobs: ${womenCount}`);
    console.log('═══════════════════════════════════════════════════');
    console.log('\n🔐 Sample Login Credentials:');
    console.log(`   Email: ${employers[0].email}`);
    console.log(`   Password: password123`);
    console.log('\n✅ Ready to use! Start your servers and explore!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedDatabase();
