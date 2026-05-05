document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    

    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    try {
        // 1. Send data to your Node.js backend
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // 2. Save the user data so the dashboard knows who is logged in
            localStorage.setItem('currentUser', JSON.stringify(data.user));

            if (data.user.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            }else if (data.user.role === 'seller') {
                // If MongoDB says they are a seller, send them to Seller Central
                window.location.href = 'owner-dashboard.html';
            } else {
                // Otherwise, send normal students to the main map/chat hub
                window.location.href = 'dashboard.html';
            }
        }
    } catch (error) {
        console.error("Login failed:", error);
    }
});