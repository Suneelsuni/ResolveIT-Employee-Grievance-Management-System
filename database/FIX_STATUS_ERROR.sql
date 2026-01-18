-- FIX: Data truncated for column 'status' error
-- Run this SQL script in MySQL to fix the issue

USE resolveit_db;

-- Step 1: Fix status column size (increase to VARCHAR(20))
ALTER TABLE grievances MODIFY COLUMN status VARCHAR(20) NOT NULL;

-- Step 2: Add updated_by_role column if it doesn't exist
-- Check if column exists first, if error occurs, column already exists (ignore error)
ALTER TABLE grievances ADD COLUMN updated_by_role VARCHAR(50);

-- Step 3: Verify the changes
DESCRIBE grievances;

-- Step 4: Check current status values
SELECT DISTINCT status FROM grievances;

-- If you see old status values (RESOLVED, REJECTED), update them:
-- UPDATE grievances SET status = 'ACCEPT' WHERE status = 'RESOLVED';
-- UPDATE grievances SET status = 'REJECT' WHERE status = 'REJECTED';

