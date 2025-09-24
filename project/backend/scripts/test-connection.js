const { Pool } = require('pg');
require('dotenv').config();

async function testConnection() {
  console.log('🔍 Testing database connection...');
  console.log('📝 Connection string:', process.env.DATABASE_URL);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Database connection successful!');

    // Test query
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
    console.log('⏰ Current time:', result.rows[0].current_time);
    console.log('🐘 PostgreSQL version:', result.rows[0].postgres_version.split(' ')[0]);

    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Tables in database:');
    if (tablesResult.rows.length === 0) {
      console.log('   (No tables found - database needs to be initialized)');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }

    // Check users
    try {
      const usersResult = await client.query('SELECT email, role FROM users LIMIT 5');
      console.log('👥 Sample users:');
      usersResult.rows.forEach(user => {
        console.log(`   - ${user.email} (${user.role})`);
      });
    } catch (error) {
      console.log('ℹ️ Users table not found or empty');
    }

    client.release();
    console.log('🎉 Database test completed successfully!');

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check your DATABASE_URL in .env file');
    console.log('3. Verify database credentials');
    console.log('4. Run: npm run setup-db');
  } finally {
    await pool.end();
  }
}

testConnection();