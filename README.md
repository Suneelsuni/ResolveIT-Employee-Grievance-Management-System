# ResolveIT – Smart Grievance & Feedback Management System

A complete full-stack web application for managing IT employee grievances with role-based access control.

## 📋 Project Overview

**ResolveIT** is a comprehensive grievance management system designed for IT organizations. It allows employees to submit grievances, team leads to manage and update their status, and admins to view all grievances across the organization.

### Features
- ✅ User Registration & Authentication (JWT-based)
- ✅ Role-based Access Control (Employee, Team Lead, Admin)
- ✅ Grievance Submission & Tracking
- ✅ Status Management (OPEN, IN_PROGRESS, RESOLVED)
- ✅ Modern, Responsive UI
- ✅ RESTful API Architecture
- ✅ MySQL Database Integration

## 🛠️ Technology Stack

### Frontend
- HTML5
- CSS3 (Modern UI with Gradients)
- Vanilla JavaScript (ES6+)

### Backend
- Java 21
- Spring Boot 3.2.0
- Spring Security
- Spring Data JPA
- JWT Authentication
- Maven

### Database
- MySQL 8.0+

## 📁 Project Structure

```
ResolveIT/
├── frontend/
│   ├── index.html          # Login page
│   ├── register.html       # Registration page
│   ├── employee.html       # Employee dashboard
│   ├── teamlead.html       # Team Lead dashboard
│   ├── admin.html          # Admin dashboard
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   └── js/
│       └── app.js         # Main JavaScript logic
│
├── backend/
│   └── resolveit-backend/
│       ├── pom.xml
│       └── src/
│           ├── main/
│           │   ├── java/com/resolveit/
│           │   │   ├── ResolveItApplication.java
│           │   │   ├── controller/
│           │   │   │   ├── AuthController.java
│           │   │   │   └── GrievanceController.java
│           │   │   ├── model/
│           │   │   │   ├── User.java
│           │   │   │   └── Grievance.java
│           │   │   ├── repository/
│           │   │   │   ├── UserRepository.java
│           │   │   │   └── GrievanceRepository.java
│           │   │   └── security/
│           │   │       ├── JwtUtil.java
│           │   │       ├── JwtAuthenticationFilter.java
│           │   │       └── SecurityConfig.java
│           │   └── resources/
│           │       └── application.properties
│           └── test/
│
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

1. **Java Development Kit (JDK) 21**
   - Download from: https://www.oracle.com/java/technologies/downloads/#java21
   - Verify installation: `java -version`

2. **Maven 3.6+**
   - Download from: https://maven.apache.org/download.cgi
   - Verify installation: `mvn -version`

3. **MySQL 8.0+**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Install and start MySQL service

4. **VS Code / Any Code Editor**
   - For editing code

5. **Live Server Extension (VS Code)**
   - For running frontend locally
   - Or use any local web server

6. **Postman (Optional)**
   - For API testing: https://www.postman.com/downloads/

### Step 1: Database Setup

1. **Start MySQL Service**
   ```bash
   # Windows (Run as Administrator)
   net start MySQL80
   
   # Or use MySQL Workbench / Command Line
   ```

2. **Create Database**
   ```sql
   CREATE DATABASE resolveit_db;
   USE resolveit_db;
   ```

   **OR** The database will be created automatically when you run the Spring Boot application (if `createDatabaseIfNotExist=true` is set in `application.properties`).

3. **Update Database Credentials**
   
   Edit `backend/resolveit-backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
   
   Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL root password.

### Step 2: Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd backend/resolveit-backend
   ```

2. **Build the Project**
   ```bash
   mvn clean install
   ```

3. **Run the Application**
   ```bash
   mvn spring-boot:run
   ```
   
   **OR** using Java directly:
   ```bash
   java -jar target/resolveit-backend-1.0.0.jar
   ```

4. **Verify Backend is Running**
   - Open browser: http://localhost:8080
   - You should see a Whitelabel Error Page (this is normal - it means the server is running)
   - Or test with Postman: `GET http://localhost:8080/api/auth/register` (should return error, but confirms server is up)

### Step 3: Frontend Setup

1. **Open Frontend Folder**
   - Navigate to `frontend/` directory

2. **Run Frontend**

   **Option A: Using VS Code Live Server**
   - Install "Live Server" extension in VS Code
   - Right-click on `index.html` → "Open with Live Server"
   - Frontend will open at `http://localhost:5500` or similar

   **Option B: Using Python HTTP Server**
   ```bash
   cd frontend
   python -m http.server 5500
   ```
   
   **Option C: Using Node.js http-server**
   ```bash
   npm install -g http-server
   cd frontend
   http-server -p 5500
   ```

3. **Access the Application**
   - Open browser: `http://localhost:5500`
   - You should see the login page

### Step 4: Initial Setup & Testing

1. **Register a User**
   - Click "Register here" on login page
   - Fill in details:
     - Name: John Doe
     - Email: john@example.com
     - Password: password123
     - Role: ADMIN (for testing)
   - Click "Register"
   - You'll be redirected to Admin Dashboard

2. **Register More Users**
   - Logout and register:
     - Employee: employee@example.com
     - Team Lead: teamlead@example.com

3. **Test Features**
   - Login as Employee → Submit grievance
   - Login as Team Lead → View and update grievance status
   - Login as Admin → View all grievances in table

## 🔌 API Endpoints

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "EMPLOYEE"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "EMPLOYEE"
  }
}
```

### Grievance Endpoints

#### Add Grievance (Employee)
```
POST /api/grievances/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "Technical",
  "description": "Unable to access company VPN"
}
```

#### Get All Grievances
```
GET /api/grievances/all
Authorization: Bearer <token>
```

#### Update Grievance Status (Team Lead/Admin)
```
PUT /api/grievances/update/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "IN_PROGRESS"
}
```

**Status Values:** `OPEN`, `IN_PROGRESS`, `RESOLVED`

## 🧪 Testing with Postman

### 1. Register User
- Method: `POST`
- URL: `http://localhost:8080/api/auth/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
  ```json
  {
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "role": "EMPLOYEE"
  }
  ```

### 2. Login
- Method: `POST`
- URL: `http://localhost:8080/api/auth/login`
- Headers: `Content-Type: application/json`
- Body:
  ```json
  {
    "email": "test@example.com",
    "password": "test123"
  }
  ```
- Copy the `token` from response

### 3. Add Grievance
- Method: `POST`
- URL: `http://localhost:8080/api/grievances/add`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <your_token>`
- Body:
  ```json
  {
    "category": "Technical",
    "description": "Test grievance description"
  }
  ```

### 4. Get All Grievances
- Method: `GET`
- URL: `http://localhost:8080/api/grievances/all`
- Headers: `Authorization: Bearer <your_token>`

### 5. Update Grievance
- Method: `PUT`
- URL: `http://localhost:8080/api/grievances/update/1`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <your_token>`
- Body:
  ```json
  {
    "status": "IN_PROGRESS"
  }
  ```

## 🐛 Common Issues & Solutions

### Issue 1: Backend won't start
**Error:** `Port 8080 already in use`
- **Solution:** Change port in `application.properties`: `server.port=8081`
- Update frontend `API_BASE_URL` in `app.js` accordingly

### Issue 2: Database Connection Error
**Error:** `Access denied for user 'root'@'localhost'`
- **Solution:** 
  - Check MySQL username/password in `application.properties`
  - Verify MySQL service is running
  - Test connection: `mysql -u root -p`

### Issue 3: CORS Error in Browser
**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`
- **Solution:** 
  - Check `SecurityConfig.java` has correct CORS configuration
  - Verify frontend URL matches allowed origins
  - Check `application.properties` CORS settings

### Issue 4: JWT Token Invalid
**Error:** `JWT expired` or `Invalid token`
- **Solution:**
  - Logout and login again to get new token
  - Check token expiration time in `application.properties`
  - Verify JWT secret key is consistent

### Issue 5: Frontend can't connect to backend
**Error:** `Network error` or `Failed to fetch`
- **Solution:**
  - Verify backend is running on `http://localhost:8080`
  - Check `API_BASE_URL` in `app.js`
  - Test backend directly: `http://localhost:8080/api/auth/register` (should return error, but confirms server is up)

### Issue 6: Tables not created
**Error:** No tables in database
- **Solution:**
  - Check `spring.jpa.hibernate.ddl-auto=update` in `application.properties`
  - Restart Spring Boot application
  - Check MySQL connection is successful

## 📝 User Roles & Permissions

| Role | Permissions |
|------|------------|
| **Employee** | - Submit grievances<br>- View own grievances<br>- View status of own grievances |
| **Team Lead** | - View all grievances<br>- Update grievance status (OPEN → IN_PROGRESS → RESOLVED) |
| **Admin** | - View all grievances in table format<br>- Update grievance status<br>- Full system access |

## 🎨 UI Features

- Modern gradient design
- Responsive layout (mobile-friendly)
- Status badges with color coding
- Clean card-based interface
- Real-time form validation
- Error and success messages

## 🔒 Security Features

- JWT-based authentication
- Password encryption (BCrypt)
- Role-based access control
- Secure API endpoints
- CORS configuration
- Token expiration handling

## 📊 Database Schema

### Users Table
- `id` (Primary Key)
- `email` (Unique)
- `password` (Encrypted)
- `name`
- `role` (EMPLOYEE, TEAM_LEAD, ADMIN)

### Grievances Table
- `id` (Primary Key)
- `description`
- `category`
- `status` (OPEN, IN_PROGRESS, RESOLVED)
- `created_at`
- `updated_at`
- `employee_id` (Foreign Key → Users)
- `assigned_to_id` (Foreign Key → Users)

## 🚀 Deployment

### Backend Deployment (Spring Boot)
1. Build JAR: `mvn clean package`
2. Run: `java -jar target/resolveit-backend-1.0.0.jar`
3. Or deploy to cloud platforms (Heroku, AWS, Azure)

### Frontend Deployment
1. Upload `frontend/` folder to web server
2. Update `API_BASE_URL` in `app.js` to production backend URL
3. Deploy to GitHub Pages, Netlify, Vercel, etc.

## 📚 Learning Resources

- Spring Boot Documentation: https://spring.io/projects/spring-boot
- JWT Guide: https://jwt.io/
- MySQL Documentation: https://dev.mysql.com/doc/
- JavaScript Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

## 👨‍💻 Development Notes

- **JWT Secret Key:** Change in production! Update `jwt.secret` in `application.properties`
- **Password Security:** Currently using BCrypt. For production, enforce strong password policies.
- **Database:** Using JPA auto-creation. For production, use proper migrations (Flyway/Liquibase).
- **CORS:** Configure allowed origins for production environment.

## 📄 License

This project is created for educational and demonstration purposes.

## 🤝 Support

For issues or questions:
1. Check "Common Issues & Solutions" section above
2. Verify all prerequisites are installed
3. Check backend logs for detailed error messages
4. Test API endpoints with Postman first

---

**Built with ❤️ for IT Employee Grievance Management**




