let allUsers = []; 

window.deleteUser = async function(id) {
    if (confirm("Are you sure you want to delete this user?")) {
        try {
            await fetch(`/api/users/${id}`, { method: 'DELETE' });
            fetchUsers(); 
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user. Check server connection.");
        }
    }
};

// Add this global function so any button can trigger it
window.updateOrderStatus = async function(orderId, newStatus) {
    try {
        const response = await fetch(`/api/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
            alert(`Order updated to: ${newStatus}`);
            // If you have a fetchOrders() function, call it here to refresh the screen!
            // fetchOrders(); 
        } else {
            alert("Failed to update order status.");
        }
    } catch (err) {
        console.error("Error updating order:", err);
    }
};

async function fetchUsers() {
    try {
        const res = await fetch('/api/users');
        allUsers = await res.json();
        displayUsers(allUsers); 
    } catch (error) {
        console.error("Fetch error:", error);
        const container = document.getElementById('userList');
        if (container) {
            container.innerHTML = `<div class="text-danger text-center">Failed to load users from the server.</div>`;
        }
    }
}

function displayUsers(users) {
    const container = document.getElementById('userList');
    if (!container) return; 
    
    container.innerHTML = ''; 

    users.forEach(user => {
        const div = document.createElement('div');
        div.className = 'card border-0 rounded-4 shadow-sm p-3 mb-3 action-card';
        div.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="fw-bold mb-0 text-dark">${user.name}</h6>
                    <small class="text-muted" style="font-size: 0.8rem;">${user.email}</small>
                </div>
                <div class="text-end">
                    <span class="badge bg-info rounded-pill px-3 py-1 mb-2 d-block shadow-sm">${user.role || 'User'}</span>
                    <button onclick="deleteUser('${user._id}')" class="btn btn-danger btn-sm rounded-pill px-3 shadow-sm fw-bold">
                        Delete
                    </button>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

// ==========================================
// 2. SPA ROUTER & DOM INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');

    async function loadPage(pageUrl) {
        if (!appContent) return;
        
        try {
            // Show loading spinner
            appContent.innerHTML = `<div class="d-flex justify-content-center mt-5"><div class="spinner-border text-orange" role="status"></div></div>`;
            
            const response = await fetch(pageUrl);
            if (!response.ok) throw new Error(`Could not load ${pageUrl}`);
            
            const htmlText = await response.text();
            
            // --- THE UPGRADE: Parse the HTML so we don't duplicate the header/nav ---
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            
            // Extract ONLY the content inside the <main> tag of the fetched page
            const newMainContent = doc.querySelector('main');
            
            if (newMainContent) {
                appContent.innerHTML = newMainContent.innerHTML;
            } else {
                // Fallback just in case there is no <main> tag
                appContent.innerHTML = htmlText; 
            }
            
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Re-initialize specific page logic now that the new DOM exists
            initDynamicContent();

        } catch (error) {
            appContent.innerHTML = `<div class="alert alert-danger text-center mt-5 rounded-4 shadow-sm border-0">Error loading view. Ensure you are running a local server.</div>`;
        }
    }

    function initDynamicContent() {
        if (document.getElementById('userList')) {
            fetchUsers();
        }

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
    }

    // Global Click Listener for Navigation
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.nav-trigger');
        if (trigger) {
            e.preventDefault();
            const targetPage = trigger.getAttribute('data-target');
            if (targetPage) loadPage(targetPage);

            // Update bottom nav highlights
            if (trigger.classList.contains('nav-item')) {
                bottomNavItems.forEach(nav => nav.classList.remove('active'));
                trigger.classList.add('active');
            }
        }
    });
});