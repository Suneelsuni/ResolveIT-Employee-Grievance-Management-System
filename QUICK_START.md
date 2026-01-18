# ResolveIT - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Database Setup
```sql
-- Open MySQL and run:
CREATE DATABASE resolveit_db;
```

### Step 2: Update Database Credentials
Edit `backend/resolveit-backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### Step 3: Start Backend
```bash
cd backend/resolveit-backend
mvn spring-boot:run
```
Wait for: "Started ResolveItApplication"

### Step 4: Start Frontend
- Open `frontend/index.html` in VS Code
- Right-click → "Open with Live Server"
- Or use: `python -m http.server 5500` in frontend folder

### Step 5: Test
1. Register: http://localhost:5500/register.html
2. Login: http://localhost:5500/index.html
3. Submit grievance (as Employee)
4. Update status (as Team Lead)
5. View all (as Admin)

## 📝 Default Test Users

After registration, you can create:
- **Admin**: admin@example.com / password123
- **Team Lead**: teamlead@example.com / password123  
- **Employee**: employee@example.com / password123

## ⚠️ Troubleshooting

**Backend won't start?**
- Check MySQL is running
- Verify port 8080 is free
- Check database credentials

**Frontend can't connect?**
- Verify backend is running on http://localhost:8080
- Check browser console for errors
- Verify CORS settings

**Database errors?**
- Check MySQL service is running
- Verify database name: `resolveit_db`
- Check username/password in application.properties

## 📚 Full Documentation

See `README.md` for complete documentation.

