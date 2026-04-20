require('dotenv').config();
const pool = require('./config/db');
const bcrypt = require('bcrypt');

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with sample data...');
    
    // Create sample employers
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const employers = [
      { email: 'employer1@example.com', password: hashedPassword, name: 'ABC Construction Ltd', role: 'employer', phone: '9876543210', city: 'Mumbai', state: 'Maharashtra' },
      { email: 'employer2@example.com', password: hashedPassword, name: 'XYZ Agriculture Farm', role: 'employer', phone: '9876543211', city: 'Pune', state: 'Maharashtra' },
      { email: 'employer3@example.com', password: hashedPassword, name: 'Tech Solutions Pvt Ltd', role: 'employer', phone: '9876543212', city: 'Bangalore', state: 'Karnataka' },
      { email: 'employer4@example.com', password: hashedPassword, name: 'Healthcare Plus', role: 'employer', phone: '9876543213', city: 'Delhi', state: 'Delhi' },
      { email: 'employer5@example.com', password: hashedPassword, name: 'Retail Mart', role: 'employer', phone: '9876543214', city: 'Chennai', state: 'Tamil Nadu' }
    ];
    
    console.log('Creating sample employers...');
    const employerIds = [];
    for (const employer of employers) {
      const [result] = await pool.query(
        'INSERT INTO users (email, password, name, role, phone, city, state, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [employer.email, employer.password, employer.name, employer.role, employer.phone, employer.city, employer.state]
      );
      employerIds.push(result.insertId);
    }
    
    // Create sample jobs
    const jobs = [
      // Related Jobs
      { title: 'Construction Worker', description: 'Seeking experienced construction workers for ongoing projects. Good pay and safe working environment.', employerId: employerIds[0], state: 'Maharashtra', city: 'Mumbai', salary_min: 15000, salary_max: 25000, jobType: 'Full-time', category: 'Construction', womenOnly: false },
      { title: 'Assistant Supervisor', description: 'Supervise construction activities and ensure quality work. Experience required.', employerId: employerIds[0], state: 'Maharashtra', city: 'Mumbai', salary_min: 20000, salary_max: 30000, jobType: 'Full-time', category: 'Construction', womenOnly: false },
      
      // Fresher Jobs
      { title: 'Fresher Data Entry Operator', description: 'No experience required. Basic computer knowledge needed. Training provided.', employerId: employerIds[2], state: 'Karnataka', city: 'Bangalore', salary_min: 12000, salary_max: 18000, jobType: 'Full-time', category: 'Administration', womenOnly: false },
      { title: 'Trainee Software Developer', description: 'Fresher position for graduates. Learn and grow with our team. Training provided.', employerId: employerIds[2], state: 'Karnataka', city: 'Bangalore', salary_min: 25000, salary_max: 35000, jobType: 'Full-time', category: 'Software Development', womenOnly: false },
      { title: 'Junior Sales Executive - Fresher', description: 'Looking for enthusiastic freshers to join our sales team. Good communication skills required.', employerId: employerIds[4], state: 'Tamil Nadu', city: 'Chennai', salary_min: 15000, salary_max: 22000, jobType: 'Full-time', category: 'Sales & Marketing', womenOnly: false },
      
      // Women's Jobs
      { title: 'Nurse - Women Only', description: 'Experienced nurses needed for our hospital. Night shifts available.', employerId: employerIds[3], state: 'Delhi', city: 'Delhi', salary_min: 25000, salary_max: 35000, jobType: 'Full-time', category: 'Healthcare', womenOnly: true },
      { title: 'Beauty Parlour Staff - Women', description: 'Beauticians and hair stylists needed. Flexible timings.', employerId: employerIds[0], state: 'Maharashtra', city: 'Pune', salary_min: 12000, salary_max: 20000, jobType: 'Part-time', category: 'Other', womenOnly: true },
      { title: 'Tailoring Work - Women Only', description: 'Home-based tailoring work available. Flexible hours, work from home option.', employerId: employerIds[1], state: 'Maharashtra', city: 'Pune', salary_min: 10000, salary_max: 18000, jobType: 'Part-time', category: 'Manufacturing', womenOnly: true },
      
      // Agriculture Jobs
      { title: 'Farm Worker', description: 'Seeking workers for seasonal farming activities. Daily wage basis.', employerId: employerIds[1], state: 'Maharashtra', city: 'Pune', salary_min: 400, salary_max: 600, jobType: 'Daily Wage', category: 'Agriculture', womenOnly: false },
      { title: 'Tractor Operator', description: 'Experienced tractor operators needed. Must have valid driving license.', employerId: employerIds[1], state: 'Maharashtra', city: 'Pune', salary_min: 18000, salary_max: 25000, jobType: 'Full-time', category: 'Agriculture', womenOnly: false },
      
      // City/District Jobs
      { title: 'Delivery Executive', description: 'Deliver packages in your city. Own vehicle required.', employerId: employerIds[4], state: 'Tamil Nadu', city: 'Chennai', salary_min: 15000, salary_max: 22000, jobType: 'Full-time', category: 'Transportation', womenOnly: false },
      { title: 'Store Keeper', description: 'Manage store inventory and customer service. Retail experience preferred.', employerId: employerIds[4], state: 'Tamil Nadu', city: 'Chennai', salary_min: 14000, salary_max: 20000, jobType: 'Full-time', category: 'Retail', womenOnly: false },
      
      // Government Jobs
      { title: 'Govt School Teacher', description: 'Teaching position in government school. B.Ed required.', employerId: employerIds[3], state: 'Delhi', city: 'Delhi', salary_min: 30000, salary_max: 45000, jobType: 'Full-time', category: 'Education', womenOnly: false },
      { title: 'Government Hospital Staff', description: 'Various positions available in government hospital. Apply with resume.', employerId: employerIds[3], state: 'Delhi', city: 'Delhi', salary_min: 20000, salary_max: 35000, jobType: 'Full-time', category: 'Healthcare', womenOnly: false },
      
      // More varied jobs
      { title: 'Customer Service Representative', description: 'Handle customer queries via phone and email. Good communication skills required.', employerId: employerIds[2], state: 'Karnataka', city: 'Bangalore', salary_min: 16000, salary_max: 24000, jobType: 'Full-time', category: 'Customer Service', womenOnly: false },
      { title: 'Security Guard', description: 'Night shift security guard for residential complex. Experience preferred.', employerId: employerIds[0], state: 'Maharashtra', city: 'Mumbai', salary_min: 14000, salary_max: 18000, jobType: 'Full-time', category: 'Other', womenOnly: false },
      { title: 'Cook/Chef', description: 'Experienced cook needed for restaurant. South Indian cuisine expertise required.', employerId: employerIds[4], state: 'Tamil Nadu', city: 'Chennai', salary_min: 18000, salary_max: 28000, jobType: 'Full-time', category: 'Hospitality', womenOnly: false },
      { title: 'Electrician', description: 'Skilled electrician for residential and commercial work. Valid license required.', employerId: employerIds[0], state: 'Maharashtra', city: 'Mumbai', salary_min: 20000, salary_max: 30000, jobType: 'Contract', category: 'Construction', womenOnly: false },
      { title: 'Plumber', description: 'Experienced plumber for maintenance work. Immediate joining.', employerId: employerIds[0], state: 'Maharashtra', city: 'Pune', salary_min: 18000, salary_max: 28000, jobType: 'Contract', category: 'Construction', womenOnly: false },
      { title: 'Housekeeping Staff', description: 'Housekeeping staff for hotel. Multiple positions available.', employerId: employerIds[4], state: 'Tamil Nadu', city: 'Chennai', salary_min: 12000, salary_max: 16000, jobType: 'Full-time', category: 'Hospitality', womenOnly: false }
    ];
    
    console.log('Creating sample jobs...');
    for (const job of jobs) {
      await pool.query(
        'INSERT INTO jobs (title, description, employerId, state, city, salary_min, salary_max, jobType, category, womenOnly, isActive, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, NOW(), NOW())',
        [job.title, job.description, job.employerId, job.state, job.city, job.salary_min, job.salary_max, job.jobType, job.category, job.womenOnly]
      );
    }
    
    console.log('✅ Database seeded successfully!');
    console.log(`   - Created ${employers.length} employers`);
    console.log(`   - Created ${jobs.length} jobs`);
    console.log('\n📝 Sample Employer Credentials:');
    console.log('   Email: employer1@example.com');
    console.log('   Password: password123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  } finally {
    process.exit();
  }
}

seedDatabase();
