-- Update status enum values in database
-- Run this SQL script to update existing data

USE resolveit_db;

-- Update RESOLVED to ACCEPT
UPDATE grievances SET status = 'ACCEPT' WHERE status = 'RESOLVED';

-- Update REJECTED to REJECT
UPDATE grievances SET status = 'REJECT' WHERE status = 'REJECTED';

-- Verify the changes
SELECT DISTINCT status FROM grievances;

