// API Base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // If on login/register page and already logged in, redirect
    if (window.location.pathname.includes('index.html') || window.location.pathname.includes('register.html')) {
        if (token && user.role) {
            redirectToDashboard(user.role);
        }
    } else {
        // If on protected page and not logged in, redirect to login
        if (!token || !user.role) {
            window.location.href = 'index.html';
        } else {
            // Set user name in navbar
            const userNameElements = document.querySelectorAll('#userName, #employeeName, #teamLeadName, #adminName');
            userNameElements.forEach(el => {
                if (el) el.textContent = user.name;
            });
            
            // Load page-specific content
            if (window.location.pathname.includes('employee.html')) {
                loadEmployeeGrievances();
            } else if (window.location.pathname.includes('teamlead.html')) {
                loadTeamLeadGrievances();
            } else if (window.location.pathname.includes('admin.html')) {
                loadAdminGrievances();
            }
        }
    }
    
    // Setup form handlers
    setupFormHandlers();
});

// Setup form handlers
function setupFormHandlers() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    const grievanceForm = document.getElementById('grievanceForm');
    if (grievanceForm) {
        grievanceForm.addEventListener('submit', handleGrievanceSubmit);
    }
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.style.display = 'none';
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            redirectToDashboard(data.user.role);
        } else {
            errorDiv.textContent = data.error || 'Login failed';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        errorDiv.textContent = 'Network error. Please check if backend is running.';
        errorDiv.style.display = 'block';
    }
}

// Handle Register
async function handleRegister(e) {
    e.preventDefault();
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.style.display = 'none';
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, role })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            redirectToDashboard(data.user.role);
        } else {
            errorDiv.textContent = data.error || 'Registration failed';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        errorDiv.textContent = 'Network error. Please check if backend is running.';
        errorDiv.style.display = 'block';
    }
}

// Redirect to dashboard based on role
function redirectToDashboard(role) {
    // All roles now use the unified dashboard
    window.location.href = 'dashboard.html';
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Get auth headers
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Handle Grievance Submit
async function handleGrievanceSubmit(e) {
    e.preventDefault();
    const messageDiv = document.getElementById('grievanceMessage');
    messageDiv.style.display = 'none';
    
    const titleElement = document.getElementById('title');
    const title = titleElement ? titleElement.value : '';
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    
    // Use category as title if title is not provided (backward compatibility)
    const finalTitle = title || category;
    
    try {
        const response = await fetch(`${API_BASE_URL}/grievances/add`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ title: finalTitle, category, description })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            messageDiv.textContent = 'Grievance submitted successfully!';
            messageDiv.style.display = 'block';
            document.getElementById('grievanceForm').reset();
            loadEmployeeGrievances();
        } else {
            messageDiv.textContent = data.error || 'Failed to submit grievance';
            messageDiv.style.display = 'block';
            messageDiv.className = 'error-message';
        }
    } catch (error) {
        messageDiv.textContent = 'Network error. Please check if backend is running.';
        messageDiv.style.display = 'block';
        messageDiv.className = 'error-message';
    }
}

// Load Employee Grievances
async function loadEmployeeGrievances() {
    const listDiv = document.getElementById('grievancesList');
    listDiv.innerHTML = '<p>Loading grievances...</p>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/grievances/all`, {
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        
        if (response.ok) {
            if (data.grievances.length === 0) {
                listDiv.innerHTML = '<p>No grievances submitted yet.</p>';
            } else {
                listDiv.innerHTML = data.grievances.map(g => `
                    <div class="grievance-item">
                        <h4>${g.title || g.category}</h4>
                        <p><strong>Description:</strong> ${g.description}</p>
                        <p><strong>Created:</strong> ${new Date(g.createdAt).toLocaleString()}</p>
                        <span class="status-badge status-${g.status}">${g.status}</span>
                    </div>
                `).join('');
            }
        } else {
            listDiv.innerHTML = `<p>Error: ${data.error}</p>`;
        }
    } catch (error) {
        listDiv.innerHTML = '<p>Error loading grievances. Please check if backend is running.</p>';
    }
}

// Load Team Lead Grievances
async function loadTeamLeadGrievances() {
    const listDiv = document.getElementById('grievancesList');
    listDiv.innerHTML = '<p>Loading grievances...</p>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/grievances/all`, {
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        
        if (response.ok) {
            if (data.grievances.length === 0) {
                listDiv.innerHTML = '<p>No grievances to manage.</p>';
            } else {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const isAdmin = user.role === 'ADMIN';
                const isTeamLead = user.role === 'TEAM_LEAD';
                
                listDiv.innerHTML = data.grievances.map(g => {
                    let statusButtons = '';
                    // Show status buttons for both Admin and Team Lead
                    if (isAdmin || isTeamLead) {
                        if (g.status === 'OPEN') {
                            statusButtons = `
                                <button class="btn btn-warning" onclick="updateStatus(${g.id}, 'IN_PROGRESS')">Mark In Progress</button>
                                <button class="btn btn-success" onclick="updateStatus(${g.id}, 'ACCEPT')">Accept</button>
                                <button class="btn btn-danger" onclick="updateStatus(${g.id}, 'REJECT')">Reject</button>
                            `;
                        } else if (g.status === 'IN_PROGRESS') {
                            statusButtons = `
                                <button class="btn btn-success" onclick="updateStatus(${g.id}, 'ACCEPT')">Accept</button>
                                <button class="btn btn-danger" onclick="updateStatus(${g.id}, 'REJECT')">Reject</button>
                            `;
                        } else if (g.status === 'ACCEPT') {
                            statusButtons = `
                                <button class="btn btn-warning" onclick="updateStatus(${g.id}, 'OPEN')">Reopen</button>
                            `;
                        } else if (g.status === 'REJECT') {
                            statusButtons = `
                                <button class="btn btn-warning" onclick="updateStatus(${g.id}, 'OPEN')">Reopen</button>
                            `;
                        }
                    }
                    
                    // Show who changed the status
                    let statusChangeInfo = '';
                    if (g.updatedBy && g.updatedByRole) {
                        statusChangeInfo = `<p><strong>Status Changed By:</strong> ${g.updatedByRole} (${g.updatedBy})</p>`;
                    } else if (g.updatedBy) {
                        statusChangeInfo = `<p><strong>Status Changed By:</strong> ${g.updatedBy}</p>`;
                    }
                    
                    // Load feedbacks for accepted complaints (visible to TL and Admin)
                    let feedbacksSection = '';
                    if (g.status === 'ACCEPT') {
                        feedbacksSection = `<div id="feedbacks-${g.id}" style="margin-top: 15px;"></div>`;
                        // Load feedbacks asynchronously
                        setTimeout(() => loadFeedbacksForManager(g.id), 100);
                    }
                    
                    return `
                        <div class="grievance-item">
                            <h4>#${g.id} - ${g.title || g.category} - ${g.employeeName}</h4>
                            <p><strong>Description:</strong> ${g.description}</p>
                            <p><strong>Employee:</strong> ${g.employeeEmail}</p>
                            <p><strong>Created:</strong> ${new Date(g.createdAt).toLocaleString()}</p>
                            ${g.updatedAt ? `<p><strong>Last Updated:</strong> ${new Date(g.updatedAt).toLocaleString()}</p>` : ''}
                            ${statusChangeInfo}
                            ${g.imagePath ? `<p><strong>Image:</strong> <a href="http://localhost:8080${g.imagePath}" target="_blank">View Image</a></p>` : ''}
                            <span class="status-badge status-${g.status}">${g.status}</span>
                            ${statusButtons ? `<div style="margin-top: 15px;">${statusButtons}</div>` : ''}
                            ${feedbacksSection}
                        </div>
                    `;
                }).join('');
            }
        } else {
            listDiv.innerHTML = `<p>Error: ${data.error}</p>`;
        }
    } catch (error) {
        listDiv.innerHTML = '<p>Error loading grievances. Please check if backend is running.</p>';
    }
}

// Update Grievance Status with confirmation
async function updateStatus(id, status) {
    const statusText = status.replace('_', ' ');
    if (!confirm(`Are you sure you want to change the status to ${statusText}?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/grievances/update/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Status updated successfully!');
            // Reload based on current page
            if (window.location.pathname.includes('manage-complaints.html')) {
                loadTeamLeadGrievances();
            } else if (window.location.pathname.includes('all-complaints.html') || window.location.pathname.includes('admin.html')) {
                loadAdminGrievances();
            } else if (window.location.pathname.includes('teamlead.html')) {
                loadTeamLeadGrievances();
            } else if (window.location.pathname.includes('my-complaints.html')) {
                // Reload my complaints if on that page
                if (typeof applyFilters === 'function') {
                    applyFilters();
                }
            }
        } else {
            alert('Error: ' + (data.error || 'Failed to update status'));
        }
    } catch (error) {
        alert('Network error. Please check if backend is running.');
    }
}

// Load feedbacks for manager/admin view
async function loadFeedbacksForManager(grievanceId) {
    const feedbacksDiv = document.getElementById(`feedbacks-${grievanceId}`);
    if (!feedbacksDiv) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/feedback/grievance/${grievanceId}`, {
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        
        if (response.ok && data.feedbacks && data.feedbacks.length > 0) {
            feedbacksDiv.innerHTML = `
                <div style="margin-top: 15px; padding: 15px; background: #e8f5e9; border-radius: 5px;">
                    <h5>User Feedbacks:</h5>
                    ${data.feedbacks.map(f => `
                        <div style="background: white; padding: 10px; margin: 5px 0; border-radius: 5px;">
                            <p><strong>${f.userName}</strong> (${f.userEmail}) <small>${new Date(f.createdAt).toLocaleString()}</small></p>
                            <p>${f.message}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            feedbacksDiv.innerHTML = '<p style="color: #666; font-style: italic;">No feedback provided yet.</p>';
        }
    } catch (error) {
        // Silently fail
    }
}

// Load Admin Grievances
async function loadAdminGrievances() {
    const tbody = document.getElementById('grievancesTableBody');
    tbody.innerHTML = '<tr><td colspan="7">Loading grievances...</td></tr>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/grievances/all`, {
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        
        if (response.ok) {
            if (data.grievances.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7">No grievances found.</td></tr>';
            } else {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const isAdmin = user.role === 'ADMIN';
                const isTeamLead = user.role === 'TEAM_LEAD';
                
                tbody.innerHTML = data.grievances.map(g => {
                    let actionButtons = '';
                    // Show status buttons for both Admin and Team Lead
                    if (isAdmin || isTeamLead) {
                        if (g.status === 'OPEN') {
                            actionButtons = `
                                <button class="btn btn-warning btn-sm" onclick="updateStatus(${g.id}, 'IN_PROGRESS')">In Progress</button>
                                <button class="btn btn-success btn-sm" onclick="updateStatus(${g.id}, 'ACCEPT')">Accept</button>
                                <button class="btn btn-danger btn-sm" onclick="updateStatus(${g.id}, 'REJECT')">Reject</button>
                            `;
                        } else if (g.status === 'IN_PROGRESS') {
                            actionButtons = `
                                <button class="btn btn-success btn-sm" onclick="updateStatus(${g.id}, 'ACCEPT')">Accept</button>
                                <button class="btn btn-danger btn-sm" onclick="updateStatus(${g.id}, 'REJECT')">Reject</button>
                            `;
                        } else if (g.status === 'ACCEPT') {
                            actionButtons = `
                                <button class="btn btn-warning btn-sm" onclick="updateStatus(${g.id}, 'OPEN')">Reopen</button>
                                <button class="btn btn-info btn-sm" onclick="viewFeedbacks(${g.id})">View Feedbacks</button>
                            `;
                        } else if (g.status === 'REJECT') {
                            actionButtons = `
                                <button class="btn btn-warning btn-sm" onclick="updateStatus(${g.id}, 'OPEN')">Reopen</button>
                            `;
                        }
                    }
                    
                    let statusChangeInfo = '';
                    if (g.updatedByRole) {
                        statusChangeInfo = `${g.updatedByRole}`;
                    } else if (g.updatedBy) {
                        statusChangeInfo = g.updatedBy;
                    }
                    
                    return `
                        <tr>
                            <td>${g.id}</td>
                            <td>${g.title || 'N/A'}</td>
                            <td>${g.employeeName}<br><small>${g.employeeEmail}</small></td>
                            <td>${g.category}</td>
                            <td>${g.description}</td>
                            <td><span class="status-badge status-${g.status}">${g.status}</span></td>
                            <td>${new Date(g.createdAt).toLocaleString()}</td>
                            <td>${g.updatedAt ? new Date(g.updatedAt).toLocaleString() : '-'}</td>
                            <td>${statusChangeInfo ? `<small>Changed by: ${statusChangeInfo}</small><br>` : ''}${actionButtons}</td>
                        </tr>
                    `;
                }).join('');
            }
        } else {
            tbody.innerHTML = `<tr><td colspan="7">Error: ${data.error}</td></tr>`;
        }
        } catch (error) {
            tbody.innerHTML = '<tr><td colspan="9">Error loading grievances. Please check if backend is running.</p></td></tr>';
        }
    }
    
    // View feedbacks in modal or alert
    async function viewFeedbacks(grievanceId) {
        try {
            const response = await fetch(`${API_BASE_URL}/feedback/grievance/${grievanceId}`, {
                headers: getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (response.ok && data.feedbacks && data.feedbacks.length > 0) {
                const feedbacksText = data.feedbacks.map(f => 
                    `${f.userName} (${f.userEmail}) - ${new Date(f.createdAt).toLocaleString()}\n${f.message}`
                ).join('\n\n');
                alert('Feedbacks:\n\n' + feedbacksText);
            } else {
                alert('No feedbacks available for this complaint.');
            }
        } catch (error) {
            alert('Error loading feedbacks.');
        }
    }



