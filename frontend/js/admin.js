const sessionUser = JSON.parse(localStorage.getItem('currentUser'));

if (!sessionUser || sessionUser.role !== 'admin') {
    alert("Unauthorized access! Admins only.");
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(userData);
    if (user.role !== 'admin') {
        alert("Access Denied: Admins only.");
        window.location.href = 'dashboard.html'; // Kick them back to the student area
    }
});

async function loadAdminData() {
    try {
        const response = await fetch('http://localhost:5000/api/users/all');
        const users = await response.json();
        
        const userTable = document.getElementById('userTableBody');
        userTable.innerHTML = ''; // Clear existing rows

        users.forEach(user => {
            userTable.innerHTML += `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td><span class="badge bg-info">${user.role}</span></td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="deleteUser('${user._id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        // Update stats
        document.getElementById('totalUsers').textContent = users.length;
    } catch (error) {
        console.error("Error loading admin data:", error);
    }
}

async function deleteUser(id) {
    if(confirm("Are you sure you want to remove this user?")) {
        await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' });
        loadAdminData(); // Refresh list
    }
}

document.addEventListener('DOMContentLoaded', loadAdminData);


document.addEventListener('DOMContentLoaded', () => {
    fetchAllProducts();
    fetchAllTransactions();
});

// 1. get all products for admin view (with seller info)
async function fetchAllProducts() {
    try {
        const res = await fetch('http://localhost:5000/api/products');
        const products = await res.json();
        const container = document.getElementById('adminProductList');
        document.getElementById('productCount').innerText = `${products.length} Products`;

        container.innerHTML = products.map(p => `
            <tr>
                <td><span class="fw-bold">${p.name}</span></td>
                <td><small>${p.sellerName || 'Unknown Seller'}</small></td>
                <td class="text-success fw-bold">₱${p.price}</td>
                <td><span class="badge bg-info">Active</span></td>
            </tr>
        `).join('');
    } catch (err) {
        console.error("Error fetching products:", err);
    }
}

// 2. Get all purchase logs for admin view (with buyer/seller/product details)
async function fetchAllTransactions() {
    try {
        const res = await fetch('http://localhost:5000/api/admin/all-history'); // Admin specific endpoint
        const logs = await res.json();
        const container = document.getElementById('adminTransactionLog');

        container.innerHTML = logs.map(log => `
            <tr>
                <td><small class="text-muted">${new Date(log.date).toLocaleDateString()}</small></td>
                <td><span class="fw-bold text-primary">${log.buyerName}</span></td>
                <td>${log.productName}</td>
                <td><span class="text-orange">${log.sellerName}</span></td>
                <td class="fw-bold">₱${log.price}</td>
            </tr>
        `).join('');
    } catch (err) {
        console.error("Error fetching logs:", err);
    }
}