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