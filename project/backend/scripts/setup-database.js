const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  console.log('🚀 Setting up DevBoma database...');

  // First, connect to postgres database to create our database
  const adminPool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'password',
    database: 'postgres'
  });

  try {
    // Create database if it doesn't exist
    console.log('📊 Creating database...');
    await adminPool.query(`
      SELECT 'CREATE DATABASE devboma_db'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'devboma_db')
    `);
    
    console.log('✅ Database created or already exists');
  } catch (error) {
    console.log('ℹ️ Database might already exist:', error.message);
  } finally {
    await adminPool.end();
  }

  // Now connect to our database
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/devboma_db'
  });

  try {
    // Read and execute schema from Supabase migrations
    console.log('📋 Reading schema from migrations...');
    
    const schemaPath = path.join(__dirname, '../supabase/migrations/20250904094526_tender_wind.sql');
    const seedPath = path.join(__dirname, '../supabase/migrations/20250904094552_blue_temple.sql');
    
    // Check if migration files exist
    try {
      await fs.access(schemaPath);
      console.log('✅ Schema file found');
    } catch {
      console.log('❌ Schema file not found at:', schemaPath);
      console.log('📁 Looking for migration files in supabase folder...');
      
      // Try alternative path
      const altSchemaPath = path.join(__dirname, '../../supabase/migrations/20250904094526_tender_wind.sql');
      const altSeedPath = path.join(__dirname, '../../supabase/migrations/20250904094552_blue_temple.sql');
      
      try {
        const schemaSql = await fs.readFile(altSchemaPath, 'utf8');
        console.log('📊 Creating database schema...');
        await pool.query(schemaSql);
        console.log('✅ Database schema created successfully!');

        // Run seed data
        try {
          const seedSql = await fs.readFile(altSeedPath, 'utf8');
          console.log('🌱 Seeding database with sample data...');
          await pool.query(seedSql);
          console.log('✅ Database seeded successfully!');
        } catch (seedError) {
          console.log('⚠️ Seed file error:', seedError.message);
        }
      } catch (altError) {
        console.log('❌ Could not find migration files. Creating basic schema...');
        
        // Create basic schema if migration files not found
        await createBasicSchema(pool);
      }
    }

    console.log('🎉 Database setup complete!');
    console.log('📝 Connection string:', process.env.DATABASE_URL);

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

async function createBasicSchema(pool) {
  console.log('📊 Creating basic schema...');
  
  const basicSchema = `
    -- Enable UUID extension
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- Users table
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
        client_id UUID,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Clients table
    CREATE TABLE IF NOT EXISTS clients (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        company TEXT,
        service_tier TEXT NOT NULL DEFAULT 'lite' CHECK (service_tier IN ('lite', 'core', 'prime', 'titan', 'shop')),
        contract_value DECIMAL(10,2) DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Add foreign key constraint
    ALTER TABLE users ADD CONSTRAINT fk_users_client_id 
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

    -- Insert sample admin user
    INSERT INTO users (email, password_hash, name, role) 
    VALUES ('admin@devboma.com', '$2b$10$rOjLrS3PjkU5S1wQ9X.xfuFZVzK1J2LMnO3zY7vB8QwXrT6uI0pKS', 'DevBoma Admin', 'admin')
    ON CONFLICT (email) DO NOTHING;

    -- Insert sample client
    INSERT INTO clients (id, name, email, service_tier) 
    VALUES ('550e8400-e29b-41d4-a716-446655440001', 'Demo Client', 'demo@devboma.com', 'shop')
    ON CONFLICT (email) DO NOTHING;

    -- Insert sample client user
    INSERT INTO users (email, password_hash, name, role, client_id) 
    VALUES ('demo@devboma.com', '$2b$10$rOjLrS3PjkU5S1wQ9X.xfuFZVzK1J2LMnO3zY7vB8QwXrT6uI0pKS', 'Demo User', 'client', '550e8400-e29b-41d4-a716-446655440001')
    ON CONFLICT (email) DO NOTHING;
  `;

  await pool.query(basicSchema);
  console.log('✅ Basic schema created with sample data');
}

// Run if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;