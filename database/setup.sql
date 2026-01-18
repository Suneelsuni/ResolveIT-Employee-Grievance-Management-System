-- ResolveIT Database Setup Script
-- Run this script to create the database and verify setup

-- Create Database (if not exists)
CREATE DATABASE IF NOT EXISTS resolveit_db;
USE resolveit_db;

-- Note: Tables will be auto-created by JPA/Hibernate
-- But you can verify the structure after running the Spring Boot application

-- Verify Database Creation
SHOW DATABASES LIKE 'resolveit_db';

-- After running Spring Boot, verify tables:
-- SHOW TABLES;
-- DESCRIBE users;
-- DESCRIBE grievances;

-- Sample Data (Optional - for testing)
-- Insert sample users (passwords are hashed with BCrypt)
-- Default password for all: "password123"
-- Use the registration API to create users instead

-- Verify Users Table Structure
-- SELECT * FROM users;

-- Verify Grievances Table Structure
-- SELECT * FROM grievances;



