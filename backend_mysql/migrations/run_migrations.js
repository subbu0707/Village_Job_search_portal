// Run database migrations
const db = require('../config/database');
const fs = require('fs');
const path = require('path');

const runMigrations = async () => {
  try {
    console.log('🔄 Running database migrations...\n');

    // Read and execute create_tables.sql
    console.log('📋 Creating tables...');
    const createTablesSql = fs.readFileSync(
      path.join(__dirname, 'create_tables.sql'),
      'utf8'
    );
    
    // Split by semicolon and execute each statement
    const statements = createTablesSql.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await db.query(statement);
      }
    }
    console.log('✅ Tables created successfully\n');

    // Read and execute add_location_fields.sql
    console.log('📍 Adding location fields...');
    const addLocationSql = fs.readFileSync(
      path.join(__dirname, 'add_location_fields.sql'),
      'utf8'
    );
    
    const locationStatements = addLocationSql.split(';').filter(s => s.trim());
    
    for (const statement of locationStatements) {
      if (statement.trim()) {
        await db.query(statement);
      }
    }
    console.log('✅ Location fields added successfully\n');

    console.log('✨ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;
