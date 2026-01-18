-- Fix status column size issue
-- Run this SQL script if you get "Data truncated for column 'status'" error

USE resolveit_db;

-- Alter the status column to have proper length
ALTER TABLE grievances MODIFY COLUMN status VARCHAR(20) NOT NULL;

-- Verify the change
DESCRIBE grievances;

