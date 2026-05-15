document.addEventListener('DOMContentLoaded', () => {

    // 1. Password Visibility Toggle Logic
    const togglePassword = document.querySelector('#togglePassword');
    // ✨ FIX 1: Updated to match your HTML ID! ✨
    const passwordField = document.querySelector('#passwordInput'); 

    if (togglePassword && passwordField) {
        togglePassword.addEventListener('click', function () {
            // Toggle the type attribute between 'password' and 'text'
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            
            // Toggle the eye icon classes
            this.querySelector('i').classList.toggle('bi-eye');
            this.querySelector('i').classList.toggle('bi-eye-slash');
        });
    }

    // 2. Register Form Submission Logic
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            // ✨ FIX 2: Updated to match your HTML ID! ✨
            const password = document.getElementById('passwordInput').value; 
            
            // This grabs the 'student' or 'seller' value from your dropdown
            const role = document.getElementById('roleSelect').value; 

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password, role })
                });

                const data = await response.json();

                if (response.ok) {
                    alert(`Account created as a ${role}! Redirecting to login...`);
                    window.location.href = 'login.html';
                } else {
                    // Fallback to data.message if data.error isn't what the backend sends
                    alert(data.error || data.message || "Registration failed."); 
                }
            } catch (error) {
                console.error("Registration error:", error);
                alert("Server connection failed.");
            }
        });
    }
});