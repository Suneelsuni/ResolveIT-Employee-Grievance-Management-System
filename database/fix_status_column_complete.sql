-- Complete fix for status column and add updated_by_role column
-- Run this SQL script to fix the database

USE resolveit_db;

-- Fix status column size (increase to VARCHAR(20))
ALTER TABLE grievances MODIFY COLUMN status VARCHAR(20) NOT NULL;

-- Add updated_by_role column if it doesn't exist
ALTER TABLE grievances ADD COLUMN updated_by_role VARCHAR(50);

-- Update existing data if needed (optional - only if you have old status values)
UPDATE grievances SET status = 'ACCEPT' WHERE status = 'RESOLVED';
UPDATE grievances SET status = 'REJECT' WHERE status = 'REJECTED';

-- Verify the changes
DESCRIBE grievances;
SELECT DISTINCT status FROM grievances;

