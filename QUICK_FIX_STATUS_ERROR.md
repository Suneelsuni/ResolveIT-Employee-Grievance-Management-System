# Quick Fix: Status Column Error

## 🐛 Error Message
```
Error: could not execute statement [Data truncated for column 'status' at row 1]
```

## ✅ Solution

The database `status` column is too small. Fix it by running this SQL:

### Option 1: Using MySQL Command Line
```bash
mysql -u root -p
```

Then run:
```sql
USE resolveit_db;
ALTER TABLE grievances MODIFY COLUMN status VARCHAR(20) NOT NULL;
ALTER TABLE grievances ADD COLUMN updated_by_role VARCHAR(50);
```

### Option 2: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your database
3. Run the SQL script: `database/FIX_STATUS_ERROR.sql`

### Option 3: Quick SQL Commands
Copy and paste these commands in MySQL:

```sql
USE resolveit_db;
ALTER TABLE grievances MODIFY COLUMN status VARCHAR(20) NOT NULL;
ALTER TABLE grievances ADD COLUMN updated_by_role VARCHAR(50);
DESCRIBE grievances;
```

## 🔍 Verify Fix

After running the SQL, verify:
```sql
DESCRIBE grievances;
```

You should see:
- `status` column as `varchar(20)`
- `updated_by_role` column as `varchar(50)`

## 🚀 After Fix

1. **Restart Backend:**
   ```bash
   cd backend/resolveit-backend
   mvn spring-boot:run
   ```

2. **Test Status Change:**
   - Login as Admin or Team Lead
   - Try changing complaint status
   - Should work without error

## ⚠️ If Error Persists

If you still get errors:

1. **Drop and recreate table** (WARNING: This deletes all data):
   ```sql
   USE resolveit_db;
   DROP TABLE IF EXISTS grievances;
   ```
   Then restart Spring Boot - it will recreate the table automatically.

2. **Or manually fix column:**
   ```sql
   ALTER TABLE grievances CHANGE status status VARCHAR(20) NOT NULL;
   ```

---

**This will fix the status column error immediately!**

