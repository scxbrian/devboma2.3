-- DevBoma Database Initialization Script
-- This script creates the database and user if they don't exist

-- Create database (run this as postgres superuser)
SELECT 'CREATE DATABASE devboma_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'devboma_db')\gexec

-- Connect to the database
\c devboma_db;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a dedicated user for the application (optional)
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'devboma_user') THEN

      CREATE ROLE devboma_user LOGIN PASSWORD 'devboma_password';
   END IF;
END
$do$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE devboma_db TO devboma_user;
GRANT ALL ON SCHEMA public TO devboma_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO devboma_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO devboma_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO devboma_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO devboma_user;