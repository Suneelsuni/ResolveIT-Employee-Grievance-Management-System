# 🚀 How to Run ResolveIT Project

## Prerequisites Checklist

Before running, ensure you have:
- ✅ **Java 21** installed (`java -version`)
- ✅ **Maven 3.6+** installed (`mvn -version`)
- ✅ **MySQL 8.0+** installed and running
- ✅ **VS Code** or any code editor
- ✅ **Live Server extension** (VS Code) or any local web server

---

## Step-by-Step Instructions

### Step 1: Start MySQL Database

**Windows:**
```powershell
# Option 1: Start MySQL service
net start MySQL80

# Option 2: Use MySQL Workbench or Command Line
mysql -u root -p
```

**Verify MySQL is running:**
- Open MySQL Workbench
- Or test connection: `mysql -u root -p`

---

### Step 2: Update Database Credentials (If Needed)

Open: `backend/resolveit-backend/src/main/resources/application.properties`

**Current settings:**
```properties
spring.datasource.username=root
spring.datasource.password=root
```

**If your MySQL password is different, update line 7:**
```properties
spring.datasource.password=YOUR_ACTUAL_MYSQL_PASSWORD
```

**Note:** The database `resolveit_db` will be created automatically when you run the backend.

---

### Step 3: Run the Backend (Spring Boot)

**Open Terminal/PowerShell in the project root:**

```powershell
# Navigate to backend directory
cd backend\resolveit-backend

# Build and run the project
mvn spring-boot:run
```

**What to expect:**
- Maven will download dependencies (first time only - takes 2-5 minutes)
- You'll see: `Started ResolveItApplication in X.XXX seconds`
- Backend will run on: **http://localhost:8080**

**Keep this terminal window open!** The backend must stay running.

**Verify backend is running:**
- Open browser: http://localhost:8080
- You should see a Whitelabel Error Page (this is normal - means server is running)

---

### Step 4: Run the Frontend

**Option A: Using VS Code Live Server (Recommended)**

1. Open VS Code
2. Install "Live Server" extension (if not installed)
3. Open the `frontend` folder in VS Code
4. Right-click on `index.html`
5. Select **"Open with Live Server"**
6. Browser will open automatically at `http://localhost:5500` (or similar port)

**Option B: Using Python HTTP Server**

```powershell
# Navigate to frontend directory
cd frontend

# Run Python server (Python 3)
python -m http.server 5500

# Or if you have Python 2
python -m SimpleHTTPServer 5500
```

Then open browser: **http://localhost:5500**

**Option C: Using Node.js http-server**

```powershell
# Install http-server globally (one time)
npm install -g http-server

# Navigate to frontend directory
cd frontend

# Run server
http-server -p 5500
```

Then open browser: **http://localhost:5500**

---

### Step 5: Test the Application

1. **Register a User:**
   - Click "Register here" on login page
   - Fill in:
     - Name: Admin User
     - Email: admin@example.com
     - Password: password123
     - Role: **ADMIN**
   - Click "Register"
   - You'll be redirected to Admin Dashboard

2. **Register More Users:**
   - Logout (click Logout button)
   - Register:
     - **Employee**: employee@example.com / password123 / Role: EMPLOYEE
     - **Team Lead**: teamlead@example.com / password123 / Role: TEAM_LEAD

3. **Test Features:**
   - **As Employee**: Login → Submit a grievance
   - **As Team Lead**: Login → View grievances → Update status
   - **As Admin**: Login → View all grievances in table

---

## 🎯 Quick Command Summary

```powershell
# Terminal 1: Backend
cd backend\resolveit-backend
mvn spring-boot:run

# Terminal 2: Frontend (if using Python)
cd frontend
python -m http.server 5500
```

---

## ✅ Verification Checklist

- [ ] MySQL is running
- [ ] Database credentials updated in `application.properties`
- [ ] Backend started successfully (see "Started ResolveItApplication")
- [ ] Backend accessible at http://localhost:8080
- [ ] Frontend running (Live Server or other)
- [ ] Frontend accessible at http://localhost:5500
- [ ] Can see login page in browser
- [ ] Can register a user
- [ ] Can login successfully

---

## 🐛 Troubleshooting

### Backend won't start?

**Error: "Port 8080 already in use"**
```powershell
# Find what's using port 8080 (Windows)
netstat -ano | findstr :8080

# Kill the process or change port in application.properties
server.port=8081
```

**Error: "Access denied for user 'root'@'localhost'"**
- Check MySQL username/password in `application.properties`
- Verify MySQL service is running
- Test connection: `mysql -u root -p`

**Error: "Could not find or load main class"**
- Make sure you're in: `backend\resolveit-backend` directory
- Run: `mvn clean install` first
- Then: `mvn spring-boot:run`

### Frontend can't connect to backend?

**Error: "Network error" or "Failed to fetch"**
- Verify backend is running: http://localhost:8080
- Check browser console (F12) for errors
- Verify `API_BASE_URL` in `frontend/js/app.js` is: `http://localhost:8080/api`

**Error: "CORS policy" error**
- Backend CORS is configured, but verify:
  - Frontend URL matches allowed origins in `SecurityConfig.java`
  - Check `application.properties` CORS settings

### Database issues?

**Tables not created?**
- Check `spring.jpa.hibernate.ddl-auto=update` in `application.properties`
- Restart Spring Boot application
- Check MySQL connection logs in backend console

---

## 📱 Access URLs

- **Frontend**: http://localhost:5500 (or port shown by Live Server)
- **Backend API**: http://localhost:8080/api
- **Backend Root**: http://localhost:8080

---

## 🎓 Next Steps

1. **Explore the Application:**
   - Submit grievances as Employee
   - Update status as Team Lead
   - View all as Admin

2. **Test with Postman:**
   - See `README.md` for API endpoint documentation
   - Test API calls directly

3. **Customize:**
   - Modify UI in `frontend/css/style.css`
   - Add features in backend controllers
   - Extend database models

---

## 💡 Pro Tips

- **Keep both terminals open**: Backend and Frontend must run simultaneously
- **Check console logs**: Backend shows SQL queries and errors
- **Use browser DevTools**: F12 to see JavaScript errors and network requests
- **First run takes time**: Maven downloads dependencies (only first time)

---

**Need help?** Check `README.md` for detailed documentation and troubleshooting.



