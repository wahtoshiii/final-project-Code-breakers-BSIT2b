document.addEventListener('DOMContentLoaded', () => {

    // Password Visibility Toggle Logic
    const togglePassword = document.querySelector('#togglePassword');
    const passwordInput = document.querySelector('#passwordInput');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            // Toggle the type attribute
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle the icon
            this.querySelector('i').classList.toggle('bi-eye');
            this.querySelector('i').classList.toggle('bi-eye-slash');
        });
    }

    const loginForm = document.getElementById('loginForm'); 
    const errorBox = document.getElementById('login-error');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // 1. Define the inputs and the button (This fixes the ReferenceError!)
            const email = document.getElementById('emailInput').value; 
            const password = document.getElementById('passwordInput').value; 
            const submitBtn = document.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            // 2. Reset the UI
            errorBox.style.display = 'none';
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Authenticating...';
            submitBtn.disabled = true;

            try {
                // 3. Talk to the backend
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                // 4. Safely parse the JSON
                let data = {};
                try {
                    data = await response.json();
                } catch (parseError) {
                    console.log("Backend sent plain text instead of JSON.");
                }

                // 5. Catch backend rejections (401, 404, etc.)
                if (!response.ok) {
                    throw new Error(data.message || 'Invalid email or password. Please try again.');
                }

                // 6. SUCCESS FLOW
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                if (data.token) localStorage.setItem('token', data.token);

                if (data.user.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else if (data.user.role === 'owner' || data.user.role === 'seller') {
                    window.location.href = 'owner-dashboard.html';
                } else {
                    window.location.href = 'manage-products.html';
                }

            } catch (err) {
                // 7. Show the red error box
                errorBox.textContent = err.message;
                errorBox.style.display = 'block';
            } finally {
                // 8. Put the button back to normal
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});