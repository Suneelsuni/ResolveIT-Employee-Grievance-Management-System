// Raise Complaint functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('complaintForm');
    if (form) {
        form.addEventListener('submit', handleComplaintSubmit);
    }
});

async function handleComplaintSubmit(e) {
    e.preventDefault();
    const messageDiv = document.getElementById('complaintMessage');
    messageDiv.style.display = 'none';
    messageDiv.className = 'success-message';
    
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const imageFile = document.getElementById('image').files[0];
    
    // Validation
    if (!title || !category || !description) {
        messageDiv.textContent = 'Please fill in all required fields';
        messageDiv.style.display = 'block';
        messageDiv.className = 'error-message';
        return;
    }
    
    try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('description', description);
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/grievances/add`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            messageDiv.textContent = 'Complaint submitted successfully!';
            messageDiv.style.display = 'block';
            document.getElementById('complaintForm').reset();
            setTimeout(() => {
                window.location.href = 'track-complaint.html';
            }, 1500);
        } else {
            messageDiv.textContent = data.error || 'Failed to submit complaint';
            messageDiv.style.display = 'block';
            messageDiv.className = 'error-message';
        }
    } catch (error) {
        messageDiv.textContent = 'Network error. Please check if backend is running.';
        messageDiv.style.display = 'block';
        messageDiv.className = 'error-message';
    }
}

