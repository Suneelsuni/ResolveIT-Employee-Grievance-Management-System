// Users page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadAllUsers();
});

async function loadAllUsers() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '<tr><td colspan="4">Loading users...</td></tr>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/all`, {
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        
        if (response.ok) {
            if (data.users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4">No users found.</td></tr>';
            } else {
                tbody.innerHTML = data.users.map(u => `
                    <tr>
                        <td>${u.id}</td>
                        <td>${u.name}</td>
                        <td>${u.email}</td>
                        <td><span class="status-badge status-${u.role}">${u.role}</span></td>
                    </tr>
                `).join('');
            }
        } else {
            tbody.innerHTML = `<tr><td colspan="4">Error: ${data.error}</td></tr>`;
        }
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="4">Error loading users. Please check if backend is running.</td></tr>';
    }
}

