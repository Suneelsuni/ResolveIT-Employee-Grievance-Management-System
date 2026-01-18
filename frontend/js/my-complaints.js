// My Complaints functionality
document.addEventListener('DOMContentLoaded', function() {
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
    
    loadEmployeeGrievances();
});

let allGrievances = [];

async function loadEmployeeGrievances() {
    const listDiv = document.getElementById('complaintsList');
    listDiv.innerHTML = '<p>Loading complaints...</p>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/grievances/all`, {
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        
        if (response.ok) {
            allGrievances = data.grievances;
            applyFilters();
        } else {
            listDiv.innerHTML = `<p>Error: ${data.error}</p>`;
        }
    } catch (error) {
        listDiv.innerHTML = '<p>Error loading complaints. Please check if backend is running.</p>';
    }
}

function applyFilters() {
    const listDiv = document.getElementById('complaintsList');
    const statusFilter = document.getElementById('statusFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;
    
    let filtered = [...allGrievances];
    
    // Filter by status
    if (statusFilter) {
        filtered = filtered.filter(g => g.status === statusFilter);
    }
    
    // Sort
    if (sortFilter === 'oldest') {
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    if (filtered.length === 0) {
        listDiv.innerHTML = '<p>No complaints found with the selected filters.</p>';
    } else {
        listDiv.innerHTML = filtered.map(g => {
            let feedbackSection = '';
            if (g.status === 'ACCEPT') {
                feedbackSection = `
                    <div style="margin-top: 15px; padding: 15px; background: #e8f5e9; border-radius: 5px;">
                        <h5>Provide Feedback</h5>
                        <textarea id="feedback-${g.id}" rows="3" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 5px;" placeholder="Share your feedback about the resolution..."></textarea>
                        <button onclick="submitFeedback(${g.id})" class="btn btn-success" style="margin-top: 10px;">Submit Feedback</button>
                        <div id="feedback-message-${g.id}" style="margin-top: 10px;"></div>
                    </div>
                `;
            }
            
            // Load existing feedbacks
            if (g.status === 'ACCEPT') {
                loadFeedbacks(g.id);
            }
            
            // Show who changed status
            let statusChangeInfo = '';
            if (g.updatedBy && g.updatedByRole) {
                statusChangeInfo = `<p><strong>Status Changed By:</strong> ${g.updatedByRole} (${g.updatedBy})</p>`;
            } else if (g.updatedBy) {
                statusChangeInfo = `<p><strong>Status Changed By:</strong> ${g.updatedBy}</p>`;
            }
            
            return `
                <div class="grievance-item">
                    <h4>#${g.id} - ${g.title || g.category}</h4>
                    <p><strong>Category:</strong> ${g.category}</p>
                    <p><strong>Description:</strong> ${g.description}</p>
                    <p><strong>Created:</strong> ${new Date(g.createdAt).toLocaleString()}</p>
                    ${g.updatedAt ? `<p><strong>Last Updated:</strong> ${new Date(g.updatedAt).toLocaleString()}</p>` : ''}
                    ${statusChangeInfo}
                    ${g.assignedTo ? `<p><strong>Assigned To:</strong> ${g.assignedTo}</p>` : ''}
                    ${g.imagePath ? `<p><strong>Image:</strong> <a href="http://localhost:8080${g.imagePath}" target="_blank">View Image</a></p>` : ''}
                    <span class="status-badge status-${g.status}">${g.status}</span>
                    ${feedbackSection}
                    <div id="feedbacks-${g.id}" style="margin-top: 15px;"></div>
                </div>
            `;
        }).join('');
    }
}

function clearFilters() {
    document.getElementById('statusFilter').value = '';
    document.getElementById('sortFilter').value = 'newest';
    applyFilters();
}

async function submitFeedback(grievanceId) {
    const feedbackText = document.getElementById(`feedback-${grievanceId}`).value;
    const messageDiv = document.getElementById(`feedback-message-${grievanceId}`);
    
    if (!feedbackText || feedbackText.trim() === '') {
        messageDiv.innerHTML = '<span style="color: red;">Please enter feedback</span>';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/feedback/add`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ 
                message: feedbackText,
                grievanceId: grievanceId
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            messageDiv.innerHTML = '<span style="color: green;">Feedback submitted successfully!</span>';
            document.getElementById(`feedback-${grievanceId}`).value = '';
            loadFeedbacks(grievanceId);
        } else {
            messageDiv.innerHTML = `<span style="color: red;">${data.error || 'Failed to submit feedback'}</span>`;
        }
    } catch (error) {
        messageDiv.innerHTML = '<span style="color: red;">Error submitting feedback</span>';
    }
}

async function loadFeedbacks(grievanceId) {
    const feedbacksDiv = document.getElementById(`feedbacks-${grievanceId}`);
    if (!feedbacksDiv) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/feedback/grievance/${grievanceId}`, {
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        
        if (response.ok && data.feedbacks && data.feedbacks.length > 0) {
            feedbacksDiv.innerHTML = `
                <h5>Previous Feedbacks:</h5>
                ${data.feedbacks.map(f => `
                    <div style="background: #f0f0f0; padding: 10px; margin: 5px 0; border-radius: 5px;">
                        <p><strong>${f.userName}</strong> <small>(${new Date(f.createdAt).toLocaleString()})</small></p>
                        <p>${f.message}</p>
                    </div>
                `).join('')}
            `;
        } else {
            feedbacksDiv.innerHTML = '';
        }
    } catch (error) {
        // Silently fail
    }
}

