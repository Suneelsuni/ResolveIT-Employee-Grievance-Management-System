# Status System Update

## ✅ Status System Changed

### New Status Options:
- **OPEN** - Initial status when complaint is created
- **IN_PROGRESS** - Complaint is being worked on
- **ACCEPT** - Complaint is accepted/resolved (replaces RESOLVED)
- **REJECT** - Complaint is rejected (replaces REJECTED)

### Who Can Change Status:
- **Admin (Manager)** - Can change status
- **Team Lead (TL)** - Can change status
- **Employee** - Cannot change status

### Status Change Tracking:
- Shows **who changed** the status (Manager or Team Lead)
- Shows **email** of person who changed
- Shows **timestamp** of change

## 📋 Status Change Flow

1. **Complaint Created** → Status: OPEN
2. **Manager/TL Actions:**
   - Can set to: IN_PROGRESS, ACCEPT, or REJECT
3. **From IN_PROGRESS:**
   - Can set to: ACCEPT or REJECT
4. **From ACCEPT/REJECT:**
   - Can reopen to: OPEN

## 🔄 Database Update Required

If you have existing data with old statuses (RESOLVED, REJECTED), run:

```sql
USE resolveit_db;
UPDATE grievances SET status = 'ACCEPT' WHERE status = 'RESOLVED';
UPDATE grievances SET status = 'REJECT' WHERE status = 'REJECTED';
```

## ✨ UI Updates

### Status Badges:
- **OPEN** - Yellow/Warning
- **IN_PROGRESS** - Blue/Info
- **ACCEPT** - Green/Success
- **REJECT** - Red/Danger

### Status Change Display:
- Shows: "Status Changed By: Manager (email@example.com)"
- Or: "Status Changed By: Team Lead (email@example.com)"
- Shows timestamp of change

### Dashboard Stats:
- Total Complaints
- Open Complaints
- In Progress Complaints
- Accepted Complaints
- Rejected Complaints

## 🎯 Feedback System

- Feedback can only be provided on **ACCEPT** status (not RESOLVED)
- Employee can provide feedback on accepted complaints
- Manager and TL can view all feedbacks

## 📁 Files Updated

### Backend:
- `model/Grievance.java` - Status enum updated, added updatedByRole
- `controller/GrievanceController.java` - Both Admin and TL can update
- `controller/DashboardController.java` - Stats updated for new statuses
- `controller/FeedbackController.java` - Feedback for ACCEPT status

### Frontend:
- All JS files updated with new status options
- Dashboard shows Accepted instead of Resolved
- Status change info displayed everywhere
- Status buttons show for both Admin and TL

---

**Status system updated successfully!**

