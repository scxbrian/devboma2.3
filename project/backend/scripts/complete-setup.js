const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function completeSetup() {
  console.log('🚀 Setting up complete DevBoma SaaS platform...');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/devboma_db'
  });

  try {
    // Test connection
    console.log('🔍 Testing database connection...');
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    client.release();

    // Read and execute complete schema
    console.log('📊 Creating complete database schema...');
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schemaSql = await fs.readFile(schemaPath, 'utf8');
    await pool.query(schemaSql);
    console.log('✅ Database schema created successfully!');

    // Read and execute seed data
    console.log('🌱 Seeding database with sample data...');
    const seedPath = path.join(__dirname, '../database/seed.sql');
    const seedSql = await fs.readFile(seedPath, 'utf8');
    await pool.query(seedSql);
    console.log('✅ Database seeded successfully!');

    // Verify setup
    console.log('🔍 Verifying setup...');
    
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Tables created:');
    tablesResult.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });

    // Check sample data
    const usersResult = await pool.query('SELECT email, role FROM users');
    console.log('\n👥 Sample users created:');
    usersResult.rows.forEach(user => {
      console.log(`   ✓ ${user.email} (${user.role})`);
    });

    const clientsResult = await pool.query('SELECT name, service_tier FROM clients');
    console.log('\n🏢 Sample clients created:');
    clientsResult.rows.forEach(client => {
      console.log(`   ✓ ${client.name} (${client.service_tier})`);
    });

    const shopsResult = await pool.query('SELECT name, design_theme FROM shops');
    console.log('\n🏪 Sample shops created:');
    shopsResult.rows.forEach(shop => {
      console.log(`   ✓ ${shop.name} (${shop.design_theme})`);
    });

    console.log('\n🎉 Complete DevBoma SaaS platform setup successful!');
    console.log('\n📝 Login credentials:');
    console.log('   Admin: admin@devboma.com / password');
    console.log('   Demo Client: demo@devboma.com / password');
    console.log('   Artisan Crafts: contact@artisancrafts.co.ke / password');
    console.log('\n🌐 API Server: http://localhost:3001');
    console.log('🖥️  Frontend: http://localhost:5173');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

completeSetup();