// Track Complaint functionality - Search by ID only
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
});

let allGrievances = [];

async function handleSearch(e) {
    e.preventDefault();
    const complaintId = document.getElementById('complaintId').value;
    const resultDiv = document.getElementById('searchResult');
    
    resultDiv.innerHTML = '<p>Searching...</p>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/grievances/${complaintId}`, {
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const g = data;
            
            // Load feedbacks for this complaint
            let feedbacksHtml = '';
            if (g.status === 'ACCEPT') {
                try {
                    const feedbackResponse = await fetch(`${API_BASE_URL}/feedback/grievance/${g.id}`, {
                        headers: getAuthHeaders()
                    });
                    const feedbackData = await feedbackResponse.json();
                    if (feedbackData.feedbacks && feedbackData.feedbacks.length > 0) {
                        feedbacksHtml = `
                            <div style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 5px;">
                                <h5>Feedbacks:</h5>
                                ${feedbackData.feedbacks.map(f => `
                                    <div style="background: white; padding: 10px; margin: 5px 0; border-radius: 5px;">
                                        <p><strong>${f.userName}</strong> <small>(${new Date(f.createdAt).toLocaleString()})</small></p>
                                        <p>${f.message}</p>
                                    </div>
                                `).join('')}
                            </div>
                        `;
                    }
                } catch (err) {
                    // Silently fail
                }
            }
            
            resultDiv.innerHTML = `
                <div class="grievance-item" style="background: #e8f5e9;">
                    <h4>Complaint #${g.id}: ${g.title || g.category}</h4>
                    <p><strong>Category:</strong> ${g.category}</p>
                    <p><strong>Description:</strong> ${g.description}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${g.status}">${g.status}</span></p>
                    <p><strong>Created:</strong> ${new Date(g.createdAt).toLocaleString()}</p>
                    ${g.updatedAt ? `<p><strong>Last Updated:</strong> ${new Date(g.updatedAt).toLocaleString()}</p>` : ''}
                    ${g.updatedBy && g.updatedByRole ? `<p><strong>Status Changed By:</strong> ${g.updatedByRole} (${g.updatedBy})</p>` : g.updatedBy ? `<p><strong>Status Changed By:</strong> ${g.updatedBy}</p>` : ''}
                    ${g.assignedTo ? `<p><strong>Assigned To:</strong> ${g.assignedTo}</p>` : ''}
                    ${g.imagePath ? `<p><strong>Image:</strong> <a href="http://localhost:8080${g.imagePath}" target="_blank">View Image</a></p>` : ''}
                    ${feedbacksHtml}
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<div class="error-message" style="display: block;">${data.error || 'Complaint not found'}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = '<div class="error-message" style="display: block;">Error searching complaint. Please check if backend is running.</div>';
    }
}

