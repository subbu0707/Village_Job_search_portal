-- Main seed file to populate database
const db = require('../config/database');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...\n');

    // 1. Create sample users
    console.log('👥 Creating sample users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      {
        email: 'employer@example.com',
        phone: '9876543210',
        name: 'ABC Corporation',
        role: 'employer',
        password: hashedPassword,
        skills: 'Management',
        bio: 'Leading tech corporation in Bangalore'
      },
      {
        email: 'seeker@example.com',
        phone: '9876543211',
        name: 'John Seeker',
        role: 'seeker',
        password: hashedPassword,
        skills: 'Java,Python,MySQL',
        bio: 'Experienced software developer'
      },
      {
        email: 'admin@example.com',
        phone: '9876543212',
        name: 'Admin User',
        role: 'admin',
        password: hashedPassword,
        skills: 'Administration',
        bio: 'Platform administrator'
      }
    ];

    for (const user of users) {
      try {
        await db.query(
          'INSERT INTO users (email, phone, name, role, password, skills, bio) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [user.email, user.phone, user.name, user.role, user.password, user.skills, user.bio]
        );
      } catch (err) {
        if (err.code !== 'ER_DUP_ENTRY') {
          throw err;
        }
      }
    }
    console.log('✅ Sample users created\n');

    // 2. Insert locations
    console.log('📍 Inserting locations...');
    const locations = [
      // Karnataka
      ['Karnataka', 'Bangalore', 'Whitefield'],
      ['Karnataka', 'Bangalore', 'Electronic City'],
      ['Karnataka', 'Bangalore', 'Marathahalli'],
      ['Karnataka', 'Mysore', 'Chamundi Nagar'],
      // Maharashtra
      ['Maharashtra', 'Mumbai', 'Bandra'],
      ['Maharashtra', 'Mumbai', 'Andheri'],
      ['Maharashtra', 'Pune', 'Hinjewadi'],
      // Tamil Nadu
      ['Tamil Nadu', 'Chennai', 'T Nagar'],
      ['Tamil Nadu', 'Coimbatore', 'Peelamedu'],
      // Uttar Pradesh
      ['Uttar Pradesh', 'Lucknow', 'Gomti Nagar'],
      ['Uttar Pradesh', 'Noida', 'Sector 62'],
      // Gujarat
      ['Gujarat', 'Ahmedabad', 'Thaltej'],
      ['Gujarat', 'Surat', 'Adajan'],
      // West Bengal
      ['West Bengal', 'Kolkata', 'Salt Lake'],
      // Rajasthan
      ['Rajasthan', 'Jaipur', 'C Scheme'],
      // Punjab
      ['Punjab', 'Chandigarh', 'Sector 35'],
      // Haryana
      ['Haryana', 'Gurgaon', 'Sector 44'],
      // Telangana
      ['Telangana', 'Hyderabad', 'HITEC City'],
      // Jharkhand
      ['Jharkhand', 'Jamshedpur', 'Bistupur']
    ];

    for (const [state, city, village] of locations) {
      try {
        await db.query(
          'INSERT INTO locations (state, city, village) VALUES (?, ?, ?)',
          [state, city, village]
        );
      } catch (err) {
        if (err.code !== 'ER_DUP_ENTRY') {
          throw err;
        }
      }
    }
    console.log('✅ Locations inserted\n');

    // 3. Execute seed SQL files
    console.log('🎯 Adding sample jobs...');
    const seedFiles = [
      'add_all_india_jobs.sql',
      'add_more_jobs_fixed.sql'
    ];

    for (const file of seedFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        const sql = fs.readFileSync(filePath, 'utf8');
        const statements = sql.split(';').filter(s => s.trim());

        for (const statement of statements) {
          if (statement.trim()) {
            try {
              await db.query(statement);
            } catch (err) {
              console.warn(`⚠️ Warning: ${err.message}`);
            }
          }
        }
      }
    }
    console.log('✅ Sample jobs added\n');

    console.log('✨ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   - 3 sample users created');
    console.log('   - 19 locations added');
    console.log('   - 40+ sample jobs added');
    console.log('   - Ready for testing!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
