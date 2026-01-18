// Profile functionality
document.addEventListener('DOMContentLoaded', function() {
    loadProfile();
    
    const updateForm = document.getElementById('updateProfileForm');
    if (updateForm) {
        updateForm.addEventListener('submit', handleUpdateProfile);
    }
    
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handleChangePassword);
    }
});

function loadProfile() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    document.getElementById('profileName').textContent = user.name || 'N/A';
    document.getElementById('profileEmail').textContent = user.email || 'N/A';
    document.getElementById('profileRole').textContent = user.role || 'N/A';
    
    // Pre-fill update form
    const updateName = document.getElementById('updateName');
    const updateEmail = document.getElementById('updateEmail');
    if (updateName) updateName.value = user.name || '';
    if (updateEmail) updateEmail.value = user.email || '';
}

async function handleUpdateProfile(e) {
    e.preventDefault();
    const messageDiv = document.getElementById('profileMessage');
    messageDiv.style.display = 'none';
    messageDiv.className = 'success-message';
    
    const name = document.getElementById('updateName').value;
    const email = document.getElementById('updateEmail').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/profile/update`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ name, email: email || null })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            messageDiv.textContent = 'Profile updated successfully!';
            messageDiv.style.display = 'block';
            
            // Update localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.name = data.user.name;
            if (data.user.email) user.email = data.user.email;
            localStorage.setItem('user', JSON.stringify(user));
            
            // Reload profile display
            loadProfile();
            
            // Update navbar
            if (typeof loadNavbar === 'function') {
                loadNavbar();
            }
        } else {
            messageDiv.textContent = data.error || 'Failed to update profile';
            messageDiv.style.display = 'block';
            messageDiv.className = 'error-message';
        }
    } catch (error) {
        messageDiv.textContent = 'Network error. Please check if backend is running.';
        messageDiv.style.display = 'block';
        messageDiv.className = 'error-message';
    }
}

async function handleChangePassword(e) {
    e.preventDefault();
    const messageDiv = document.getElementById('passwordMessage');
    messageDiv.style.display = 'none';
    messageDiv.className = 'success-message';
    
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Frontend validation
    if (newPassword !== confirmPassword) {
        messageDiv.textContent = 'New password and confirm password do not match';
        messageDiv.style.display = 'block';
        messageDiv.className = 'error-message';
        return;
    }
    
    if (newPassword.length < 6) {
        messageDiv.textContent = 'New password must be at least 6 characters';
        messageDiv.style.display = 'block';
        messageDiv.className = 'error-message';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/profile/change-password`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ oldPassword, newPassword })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            messageDiv.textContent = 'Password changed successfully!';
            messageDiv.style.display = 'block';
            document.getElementById('changePasswordForm').reset();
        } else {
            messageDiv.textContent = data.error || 'Failed to change password';
            messageDiv.style.display = 'block';
            messageDiv.className = 'error-message';
        }
    } catch (error) {
        messageDiv.textContent = 'Network error. Please check if backend is running.';
        messageDiv.style.display = 'block';
        messageDiv.className = 'error-message';
    }
}

