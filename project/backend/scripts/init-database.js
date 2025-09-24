const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🚀 Initializing DevBoma database...');

    // Read and execute schema
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schemaSql = await fs.readFile(schemaPath, 'utf8');
    
    console.log('📊 Creating database schema...');
    await pool.query(schemaSql);

    console.log('✅ Database schema created successfully!');

    // Optional: Run seed data
    const seedPath = path.join(__dirname, '../database/seed.sql');
    try {
      const seedSql = await fs.readFile(seedPath, 'utf8');
      console.log('🌱 Seeding database with sample data...');
      await pool.query(seedSql);
      console.log('✅ Database seeded successfully!');
    } catch (seedError) {
      console.log('ℹ️ No seed file found or error in seeding:', seedError.message);
    }

    console.log('🎉 Database initialization complete!');

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;