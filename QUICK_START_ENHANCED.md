# Quick Start Guide - Enhanced Features

## 🚀 Running the Enhanced System

### 1. Start Backend
```bash
cd backend/resolveit-backend
mvn spring-boot:run
```

### 2. Start Frontend
- Open `frontend/home.html` in browser
- Or use Live Server extension in VS Code

## ✨ New Features to Try

### Track Complaint by ID
1. Login as Employee
2. Go to "Track Complaint"
3. Enter a complaint ID (e.g., 1, 2, 3)
4. Click "Search"
5. View detailed complaint information

### Filters and Sorting
1. Go to "My Complaints" or "Track Complaint"
2. Select status from dropdown (OPEN, IN_PROGRESS, RESOLVED, REJECTED)
3. Select sort order (Newest First / Oldest First)
4. See filtered results instantly
5. Click "Clear Filters" to reset

### Update Profile
1. Go to "Profile"
2. Change your name
3. Optionally change email
4. Click "Update Profile"
5. See success message

### Change Password
1. Go to "Profile"
2. Enter current password
3. Enter new password (min 6 characters)
4. Confirm new password
5. Click "Change Password"
6. See success message

### Upload Image with Complaint
1. Go to "Raise Complaint"
2. Fill in title, category, description
3. Click "Upload Image" and select a file
4. Submit complaint
5. View image link in complaint details

### Manager Status Updates
1. Login as Team Lead or Admin
2. Go to "Manage Complaints"
3. Click status buttons:
   - "Mark In Progress" (from OPEN)
   - "Mark Resolved" (from IN_PROGRESS)
   - "Reject" (from OPEN or IN_PROGRESS)
   - "Reopen" (from RESOLVED or REJECTED)
4. Confirm in dialog
5. Status updates with your email in "Updated By"

## 📊 Dashboard Stats
- View total, pending, in progress, resolved, and rejected counts
- All stats update automatically based on your role

## 🔍 Key Improvements
- ✅ REJECTED status option
- ✅ Search complaints by ID
- ✅ Real-time filters
- ✅ Profile management
- ✅ Image uploads
- ✅ Confirmation dialogs
- ✅ Better date tracking

---

**All features are working and ready to use!**

