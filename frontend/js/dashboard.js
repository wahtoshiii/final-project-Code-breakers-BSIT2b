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
            <div>
                <!-- Update Button with required class and data-id -->
                <button class="btn btn-warning btn-sm edit-btn" data-id="${user._id}">
                    Edit
                </button>
                <!-- Delete Button with required class and data-id -->
                <button class="btn btn-danger btn-sm delete-btn" data-id="${user._id}" onclick="deleteUser('${user._id}')">
                    Delete
                </button>
            </div>
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

// Listen for clicks on the Edit buttons
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('edit-btn')) {
        const id = e.target.getAttribute('data-id');
        
        // Fetch specific user data from your backend (Port 5000)
        const res = await fetch(`http://localhost:5000/api/users/${id}`);
        const user = await res.json();

        // Fill the modal inputs with the current data
        document.getElementById('editName').value = user.name;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editId').value = user._id;

        // Show the modal
        const editModal = new bootstrap.Modal(document.getElementById('editModal'));
        editModal.show();
    }
});

// Handle the form submission
document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('editId').value;
    const updatedData = {
        name: document.getElementById('editName').value,
        email: document.getElementById('editEmail').value
    };

    // Send the PUT request to your backend
    const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    });

    if (res.ok) {
        alert("User updated successfully!");
        location.reload(); // Refresh to see changes
    } else {
        alert("Failed to update user.");
    }
});