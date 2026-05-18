document.addEventListener('DOMContentLoaded', () => {
    
    const inventoryList = document.getElementById('inventory-list');
    const ordersList = document.getElementById('orders-list');
    const orderCount = document.getElementById('order-count');

    // ─── 1. FETCH INVENTORY FROM MONGODB ───
    async function loadInventory() {
        if (!inventoryList) return;
        try {
            const response = await fetch('/api/products');
            if (!response.ok) throw new Error('Database fetch failed');
            
            const products = await response.json();
            inventoryList.innerHTML = ''; 

            products.forEach(product => {
                const price = parseFloat(product.price || 0).toFixed(2);
                const stock = product.stock || 0;
                const inStock = stock > 0;
                const stockStatus = inStock ? `Stock: ${stock} units` : `<span class="text-danger fw-bold">Out of Stock!</span>`;
                const displayName = product.productName || product.name || "Unnamed Item";

                const cardHTML = `
                    <div class="card border-0 rounded-4 shadow-sm bg-white action-card mb-3">
                        <div class="card-body p-2 d-flex align-items-center">
                            <div class="bg-light rounded-3 d-flex align-items-center justify-content-center me-3" style="width: 60px; height: 60px;">
                                <i class="bi bi-box-seam text-muted fs-3"></i>
                            </div>
                            <div class="flex-grow-1">
                                <h6 class="mb-0 fw-bold text-dark" style="font-size: 0.9rem;">${displayName}</h6>
                                <small class="text-muted d-block">${stockStatus}</small>
                                <small class="text-success fw-bold">₱${price}</small>
                            </div>
                           <div class="pe-2 d-flex align-items-center gap-2">
                                <button class="btn btn-sm btn-outline-danger border-0 delete-product-btn" data-id="${product._id}">
                                    <i class="bi bi-trash3"></i>
                                </button>
                                <div class="form-check form-switch fs-4 mb-0">
                                    <input class="form-check-input" type="checkbox" role="switch" ${inStock ? 'checked' : ''}>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                inventoryList.insertAdjacentHTML('beforeend', cardHTML);
            });
        } catch (error) {
            console.error("Inventory Load Error:", error);
        }
    }

    // ─── 2. FETCH REAL ORDERS FROM MONGODB ───
    async function loadOrders() {
        if (!ordersList) return;
        try {
            const response = await fetch('/api/orders');
            if (!response.ok) throw new Error('Failed to fetch orders');
            const orders = await response.json();

            ordersList.innerHTML = '';
            let activeCount = 0;

            if (orders.length === 0) {
                ordersList.innerHTML = '<p class="text-muted small text-center mt-2">No pending orders right now.</p>';
                if(orderCount) orderCount.textContent = '0';
                return;
            }

            orders.forEach(order => {
                // Hide orders that are already done or cancelled
                if (order.status === 'Ready for Pickup' || order.status === 'Cancelled') return;
                
                activeCount++;
                let badgeColor = order.status === 'Pending' ? 'bg-warning text-dark' : 'bg-info text-white';
                let buttonsHTML = '';

                // Generate buttons based on the current status
                if (order.status === 'Pending') {
                    buttonsHTML = `
                        <button class="btn btn-sm btn-success w-50 rounded-pill fw-bold shadow-sm" data-action="Preparing" data-id="${order._id}">Accept</button>
                        <button class="btn btn-sm btn-outline-danger w-50 rounded-pill fw-bold" data-action="Cancelled" data-id="${order._id}">Decline</button>
                    `;
                } else if (order.status === 'Preparing') {
                    buttonsHTML = `
                        <button class="btn btn-sm btn-primary w-100 rounded-pill fw-bold shadow-sm" data-action="Ready for Pickup" data-id="${order._id}">Mark as Ready</button>
                    `;
                }

                const cardHTML = `
                    <div class="card border-0 rounded-4 shadow-sm bg-white border-start border-${order.status === 'Pending' ? 'warning' : 'info'} border-4 mb-3">
                        <div class="card-body p-3">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <span class="badge ${badgeColor} rounded-pill mb-1">${order.status || 'Pending'}</span>
                                    <h6 class="mb-0 fw-bold text-dark">${order.customerName || 'Student'}</h6>
                                    <small class="text-muted">${order.quantity || 1}x ${order.productName || 'Item'}</small>
                                </div>
                                <h6 class="text-success fw-bold mb-0">₱${parseFloat(order.totalPrice || 0).toFixed(2)}</h6>
                            </div>
                            <div class="d-flex gap-2 mt-3">
                                ${buttonsHTML}
                            </div>
                        </div>
                    </div>
                `;
                ordersList.insertAdjacentHTML('beforeend', cardHTML);
            });

            if(orderCount) orderCount.textContent = activeCount;

        } catch (error) {
            console.error("Order Load Error:", error);
            ordersList.innerHTML = '<p class="text-danger small text-center mt-2">Could not connect to order database.</p>';
        }
    }

    // Run both fetch functions when page loads
    loadInventory(); 
    loadOrders();


    // ─── 3. PROCESS ORDER BUTTON CLICKS (Send to DB) ───
    // ✨ THE FIX: Listen directly to the orders list instead of 'main' ✨
    if (ordersList) {
        ordersList.addEventListener('click', async (e) => {
            const btn = e.target.closest('.btn');
            if (!btn) return;

            // Grab the data attached to the button we clicked
            const newStatus = btn.getAttribute('data-action');
            const orderId = btn.getAttribute('data-id');
            
            if (!newStatus || !orderId) return; // Ignore clicks on things that aren't action buttons

            // Change button text to a spinner so you know it's loading
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
            btn.disabled = true;

            try {
                // Send the new status to the backend
                const response = await fetch(`/api/orders/${orderId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                });

                if (!response.ok) throw new Error('Failed to update order');

                // Refresh the orders list to show the new status
                loadOrders();

            } catch (error) {
                console.error("Order Update Error:", error);
                alert("Failed to update order. Check backend connection.");
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    // ─── 4. ADD ITEM TO MONGODB (Inventory) ───
    const addItemForm = document.getElementById('addItemForm');
    
    if (addItemForm) {
        addItemForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            const name = document.getElementById('itemName').value;
            const price = document.getElementById('itemPrice').value || "0";
            const stock = document.getElementById('itemStock').value || "0";
            const category = document.getElementById('itemCategory').value;

            const productData = { name: name, price: parseFloat(price), stock: parseInt(stock), category: category };

            try {
                const response = await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });

                if (!response.ok) throw new Error('Failed to save to database');

                const modalElement = document.getElementById('addItemModal');
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide();
                
                addItemForm.reset();
                loadInventory(); 

            } catch (error) {
                console.error("Save Error:", error);
                alert("Failed to save! Is the backend running?");
            }
        });
    }

    // ─── 5. DELETE ITEM FROM MONGODB ───
    if (inventoryList) {
        inventoryList.addEventListener('click', async (e) => {
            const deleteBtn = e.target.closest('.delete-product-btn');
            if (!deleteBtn) return; // If they didn't click the trash can, ignore it

            const productId = deleteBtn.getAttribute('data-id');
            
            // Ask for confirmation so you don't accidentally delete something
            const confirmDelete = confirm("Are you sure you want to delete this product? This will remove it from the marketplace.");
            if (!confirmDelete) return;

            // Turn button into a spinner while deleting
            const originalIcon = deleteBtn.innerHTML;
            deleteBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span>';
            deleteBtn.disabled = true;

            try {
                // Tell the backend to delete this specific ID
                const response = await fetch(`/api/products/${productId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) throw new Error('Failed to delete product');

                // Success! Refresh the seller inventory instantly
                loadInventory(); 

            } catch (error) {
                console.error("Delete Error:", error);
                alert("Failed to delete product. Check backend connection.");
                deleteBtn.innerHTML = originalIcon;
                deleteBtn.disabled = false;
            }
        });
    }
});

async function markOrderReady(orderId) {
    try {
        const response = await fetch(`/api/orders/${orderId}/ready`, {
            method: 'PUT'
        });
        if (response.ok) {
            alert("Order marked as ready! The student will see the update.");
            location.reload(); // Refresh to show the new status
        }
    } catch (err) {
        console.error("Failed to update order", err);
    }
}