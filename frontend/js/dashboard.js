// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardStats();
    loadRecentComplaints();
});

async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('totalComplaints').textContent = data.totalComplaints || 0;
            const pendingEl = document.getElementById('pendingComplaints');
            if (pendingEl) pendingEl.textContent = data.openComplaints || data.pendingComplaints || 0;
            document.getElementById('inProgressComplaints').textContent = data.inProgressComplaints || 0;
            const acceptedEl = document.getElementById('acceptedComplaints');
            if (acceptedEl) {
                acceptedEl.textContent = data.acceptedComplaints || 0;
            } else {
                // Fallback for resolved
                const resolvedEl = document.getElementById('resolvedComplaints');
                if (resolvedEl) resolvedEl.textContent = data.acceptedComplaints || 0;
            }
            const rejectedEl = document.getElementById('rejectedComplaints');
            if (rejectedEl) {
                rejectedEl.textContent = data.rejectedComplaints || 0;
            }
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

async function loadRecentComplaints() {
    const listDiv = document.getElementById('recentComplaints');
    
    try {
        const response = await fetch(`${API_BASE_URL}/grievances/all`, {
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const grievances = data.grievances.slice(0, 5); // Show only 5 most recent
            if (grievances.length === 0) {
                listDiv.innerHTML = '<p>No complaints yet.</p>';
            } else {
                listDiv.innerHTML = grievances.map(g => {
                    let statusChangeInfo = '';
                    if (g.updatedByRole) {
                        statusChangeInfo = `<p><small><strong>Changed by:</strong> ${g.updatedByRole}</small></p>`;
                    }
                    return `
                        <div class="grievance-item">
                            <h4>${g.title || g.category}</h4>
                            <p><strong>Description:</strong> ${g.description}</p>
                            <p><strong>Created:</strong> ${new Date(g.createdAt).toLocaleString()}</p>
                            ${statusChangeInfo}
                            <span class="status-badge status-${g.status}">${g.status}</span>
                        </div>
                    `;
                }).join('');
            }
        }
    } catch (error) {
        listDiv.innerHTML = '<p>Error loading complaints.</p>';
    }
}

