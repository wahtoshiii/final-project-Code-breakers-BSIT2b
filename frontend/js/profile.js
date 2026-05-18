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

    // 7. Fetch and Display User's Orders (The Notification System)
    async function fetchMyOrders() {
        const container = document.getElementById('orderContainer');
        if (!container) return; // Safely skip if we aren't on the page with orders

        try {
            const response = await fetch('/api/orders');
            const allOrders = await response.json();
            
            // Filter to show ONLY the orders belonging to the logged-in student
            const myOrders = allOrders.filter(order => order.customerName === user.name);
            
            container.innerHTML = '';
            
            if (myOrders.length === 0) {
                container.innerHTML = '<p class="text-muted mt-3">You have no orders yet.</p>';
                return;
            }

            myOrders.forEach(order => {
                // ✨ THE MAGIC NOTIFICATION HIGHLIGHT ✨
                const isReady = order.status === 'Ready for Pickup';
                const statusClass = isReady ? 'bg-success text-white shadow' : 'bg-light text-muted border';
                const statusText = isReady ? '🚀 READY FOR PICKUP!' : order.status;

                container.insertAdjacentHTML('beforeend', `
                    <div class="card mb-3 border-0 shadow-sm rounded-4">
                        <div class="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="fw-bold mb-1 text-dark">${order.productName}</h6>
                                <small class="text-muted">Qty: ${order.quantity} | Total: ₱${order.totalPrice}</small>
                            </div>
                            <span class="badge rounded-pill ${statusClass} px-3 py-2">
                                ${statusText}
                            </span>
                        </div>
                    </div>
                `);
            });
        } catch (err) {
            console.error("Failed to load orders", err);
        }
    }
    
    fetchMyOrders(); // Call it when the profile loads
});