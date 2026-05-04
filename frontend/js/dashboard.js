let allUsers = []; // Master list for searching

// 1. MAIN FETCH FUNCTION
async function fetchUsers() {
    try {
        const res = await fetch('http://localhost:5000/api/users');
        allUsers = await res.json();
        
        displayUsers(allUsers); // Initially show everyone
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// 2. RENDER FUNCTION (The "Step 3" injection)
function displayUsers(users) {
    const container = document.getElementById('userList');
    if (!container) return; // Safety check
    
    container.innerHTML = ''; // Clear the "John Doe" static data

    users.forEach(user => {
        const div = document.createElement('div');
        div.className = 'card p-3 mb-2 shadow-sm';
        div.innerHTML = `
            <h5>${user.name}</h5>
            <p class="text-muted mb-2">${user.email}</p>
            <div class="d-flex justify-content-between align-items-center">
                <span class="badge bg-info">${user.role || 'User'}</span>
                <button onclick="deleteUser('${user._id}')" class="btn btn-danger btn-sm">
                    Delete
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

// 3. SEARCH LISTENER (Task 4)
const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("input", function() {
        const searchTerm = this.value.toLowerCase();
        const filtered = allUsers.filter(u => 
            u.name.toLowerCase().includes(searchTerm)
        );
        displayUsers(filtered);
    });
}

// 4. DELETE FUNCTION
async function deleteUser(id) {
    if (confirm("Are you sure you want to delete this user?")) {
        await fetch(`http://localhost:5000/api/users/${id}`, {
            method: 'DELETE'
        });
        fetchUsers(); // Refresh the list automatically
    }
}

// START EVERYTHING
fetchUsers();