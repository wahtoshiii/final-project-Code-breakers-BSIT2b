document.addEventListener('DOMContentLoaded', () => {
    // 1. Check if user is actually logged in
    const userData = localStorage.getItem('currentUser');
    
    if (!userData) {
        // If there's no data, kick them back to login!
        window.location.href = 'login.html';
        return;
    }

    // 2. Parse the saved user data
    const user = JSON.parse(userData);

    // 3. Generate Initials (e.g., "Juan Dela Cruz" -> "JD")
    const nameParts = user.name.split(' ');
    let initials = '';
    if (nameParts.length > 0) {
        initials += nameParts[0].charAt(0).toUpperCase(); // First letter of first name
        if (nameParts.length > 1) {
            initials += nameParts[1].charAt(0).toUpperCase(); // First letter of second name/surname
        }
    }

    // 4. Format the Role (Capitalize first letter)
    const formattedRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);

    // 5. Inject the data into the HTML
    document.getElementById('profileInitials').textContent = initials;
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileRole').textContent = `${formattedRole} • BSIT • BUP`;

    // 6. Handle Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        // Ask for confirmation
        if(confirm("Are you sure you want to log out?")) {
            // Clear the saved user session
            localStorage.removeItem('currentUser');
            // Redirect to login page
            window.location.href = 'login.html';
        }
    });
});