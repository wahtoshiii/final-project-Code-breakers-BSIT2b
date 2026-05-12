document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. AUTHENTICATION CHECK ---
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        const user = JSON.parse(userData);
        if (user.role !== 'admin') {
            alert("Access Denied: Admins only.");
            window.location.href = 'dashboard.html'; 
            return;
        }
    } 
    // Note: If you don't have login fully working yet, comment out the auth block above so you can test the page!

    // --- 2. INITIALIZE DASHBOARD ---
    loadAdminData(); // <-- Now it fetches the users!
    fetchAllProducts();
    fetchAllTransactions();
});

// Fetch all registered users
async function loadAdminData() {
    const usersContainer = document.getElementById('registered-users-container');
    if (!usersContainer) return;

    try {
        const response = await fetch('/api/users/all');
        if (!response.ok) throw new Error('Failed to fetch users');
        
        const users = await response.json();
        usersContainer.innerHTML = ''; // Clear loading text

        if (users.length === 0) {
            usersContainer.innerHTML = '<p class="text-muted small text-center mt-3">No users found.</p>';
            return;
        }

        users.forEach(user => {
            // Determine badge color based on role
            let badgeClass = 'bg-secondary'; // Default for student
            if (user.role === 'admin') badgeClass = 'bg-primary';
            if (user.role === 'owner' || user.role === 'seller') badgeClass = 'bg-success';
            
            const roleLabel = user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Student';

            const userHTML = `
                <div class="d-flex justify-content-between border-bottom py-2 align-items-center">
                    <div>
                        <span class="fw-bold text-dark">${user.name || 'Unknown User'}</span>
                        <br>
                        <small class="text-muted">${user.email || 'No email'}</small>
                    </div>
                    <span class="badge ${badgeClass}">${roleLabel}</span>
                </div>
            `;
            usersContainer.insertAdjacentHTML('beforeend', userHTML);
        });
        
    } catch (error) {
        console.error("Error loading users:", error);
        usersContainer.innerHTML = '<p class="text-danger small text-center mt-3">Could not load users. Is the backend running?</p>';
    }
}

// Fetch all products for admin view
async function fetchAllProducts() {
    try {
        const res = await fetch('/api/products');
        const products = await res.json();
        
        const container = document.getElementById('adminProductList');
        const countBadge = document.getElementById('productCount');
        
        if (countBadge) countBadge.innerText = `${products.length} Products`;

        if (products.length === 0) {
            container.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-3">No products found.</td></tr>';
            return;
        }

        container.innerHTML = products.map(p => {
            const stock = p.stock || 0;
            const inStock = stock > 0;
            const displayName = p.productName || p.name || 'Unnamed Item';
            
            const statusBadge = inStock 
                ? `<span class="badge bg-success bg-opacity-10 text-success rounded-pill px-3">In Stock (${stock})</span>`
                : `<span class="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3">Out of Stock</span>`;

            return `
                <tr class="border-bottom">
                    <td class="py-3"><span class="fw-bold text-dark">${displayName}</span></td>
                    <td class="py-3"><small class="text-muted">Campus Store</small></td>
                    <td class="py-3 text-success fw-bold">₱${parseFloat(p.price || 0).toFixed(2)}</td>
                    <td class="py-3">${statusBadge}</td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        console.error("Error fetching products:", err);
        document.getElementById('adminProductList').innerHTML = '<tr><td colspan="4" class="text-center text-danger py-3">Failed to connect to database.</td></tr>';
    }
}

// Fetch all purchase logs for admin view
async function fetchAllTransactions() {
    try {
        // We use /api/orders here because that is where all checkouts are saved!
        const res = await fetch('/api/orders'); 
        const logs = await res.json();
        
        const container = document.getElementById('adminTransactionLog');

        if (logs.length === 0) {
            container.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-3">No transactions recorded yet.</td></tr>';
            return;
        }

        // We use .reverse() so the newest orders appear at the very top of the table
        container.innerHTML = logs.reverse().map(log => {
            const dateObj = new Date(log.createdAt || Date.now());
            const dateString = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            const buyerName = log.customerName || 'Student';
            const productName = log.productName || 'Unknown Item';
            const totalPrice = parseFloat(log.totalPrice || 0).toFixed(2);

            return `
                <tr class="border-bottom">
                    <td class="py-3"><small class="text-muted">${dateString}</small></td>
                    <td class="py-3"><span class="fw-bold text-primary">${buyerName}</span></td>
                    <td class="py-3 text-muted">${log.quantity || 1}x ${productName}</td>
                    <td class="py-3"><span class="text-orange fw-bold">Campus Store</span></td>
                    <td class="py-3 fw-bold text-success">₱${totalPrice}</td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        console.error("Error fetching logs:", err);
        document.getElementById('adminTransactionLog').innerHTML = '<tr><td colspan="5" class="text-center text-danger py-3">Failed to load transaction history.</td></tr>';
    }
}

// --- 3. LOGOUT BUTTON LOGIC ---
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Stops the link from jumping the page

            // Ask the user to confirm
            const confirmLogout = confirm("Are you sure you want to log out of the Admin Panel?");
            
            if (confirmLogout) {
                // Wipe the user from local storage so they are fully logged out
                localStorage.removeItem('currentUser'); 
                
                // Send them back to the login screen
                window.location.href = 'login.html';
            }
        });
    }