// Reusable Navbar Component
function loadNavbar() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role;
    const userName = user.name || 'User';
    
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let navLinks = '';
    
    if (role === 'EMPLOYEE') {
        navLinks = `
            <a href="dashboard.html">Dashboard</a>
            <a href="raise-complaint.html">Raise Complaint</a>
            <a href="my-complaints.html">My Complaints</a>
            <a href="track-complaint.html">Track Complaint</a>
            <a href="profile.html">Profile</a>
            <a href="#" onclick="logout(); return false;">Logout</a>
        `;
    } else if (role === 'TEAM_LEAD') {
        navLinks = `
            <a href="dashboard.html">Dashboard</a>
            <a href="manage-complaints.html">Manage Complaints</a>
            <a href="profile.html">Profile</a>
            <a href="#" onclick="logout(); return false;">Logout</a>
        `;
    } else if (role === 'ADMIN') {
        navLinks = `
            <a href="dashboard.html">Dashboard</a>
            <a href="all-complaints.html">All Complaints</a>
            <a href="users.html">Users</a>
            <a href="profile.html">Profile</a>
            <a href="#" onclick="logout(); return false;">Logout</a>
        `;
    }
    
    navbar.innerHTML = `
        <div class="nav-container">
            <div class="nav-brand">
                <h1>ResolveIT</h1>
            </div>
            <div class="nav-user-info">
                <span class="nav-username">Welcome, ${userName}</span>
                <span class="nav-role">${role || ''}</span>
            </div>
            <nav class="nav-links">
                ${navLinks}
            </nav>
        </div>
    `;
}

// Load navbar when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadNavbar();
});

