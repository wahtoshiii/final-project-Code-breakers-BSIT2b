document.addEventListener('DOMContentLoaded', () => {
    
    const shopList = document.getElementById('public-shop-list');

    // ─── 1. LOAD PRODUCTS FROM DATABASE ───
    async function loadShop() {
        if (!shopList) return;

        try {
            const response = await fetch('/api/products');
            if (!response.ok) throw new Error('Database fetch failed');
            
            const products = await response.json();
            shopList.innerHTML = ''; 

            if (products.length === 0) {
                shopList.innerHTML = '<p class="text-muted small text-center mt-3">The shop is currently empty.</p>';
                return;
            }

            products.forEach(product => {
                const price = parseFloat(product.price || 0).toFixed(2);
                const inStock = product.stock > 0;
                const displayName = product.productName || product.name || "Unnamed Item";
                
                // If stock is 0, disable the button
                const buttonHTML = inStock 
                    ? `<button class="btn btn-sm btn-orange rounded-pill w-100 fw-bold order-btn" 
                          data-name="${displayName}" 
                          data-price="${price}">Order Now</button>`
                    : `<button class="btn btn-sm btn-secondary rounded-pill w-100 fw-bold" disabled>Out of Stock</button>`;

                const cardHTML = `
                    <div class="card border-0 rounded-4 shadow-sm bg-white mb-3">
                        <div class="card-body p-3 d-flex align-items-center">
                            <div class="bg-light rounded-3 d-flex align-items-center justify-content-center me-3" style="width: 60px; height: 60px;">
                                <i class="bi bi-bag text-muted fs-3"></i>
                            </div>
                            <div class="flex-grow-1">
                                <h6 class="mb-0 fw-bold text-dark">${displayName}</h6>
                                <small class="text-success fw-bold">₱${price}</small>
                                <small class="text-muted d-block" style="font-size: 0.75rem;">${product.stock} available</small>
                            </div>
                            <div class="pe-2" style="width: 100px;">
                                ${buttonHTML}
                            </div>
                        </div>
                    </div>
                `;
                shopList.insertAdjacentHTML('beforeend', cardHTML);
            });
        } catch (error) {
            console.error("Shop Load Error:", error);
            shopList.innerHTML = '<p class="text-danger text-center mt-3">Could not load products.</p>';
        }
    }

    loadShop();

    // ─── 2. HANDLE "ORDER NOW" CLICKS ───
    if (shopList) {
        shopList.addEventListener('click', async (e) => {
            const btn = e.target.closest('.order-btn');
            if (!btn) return;

            // Prevent spam clicking
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span>';
            btn.disabled = true;

            // ✨ THE FIX: Check who is actually logged in! ✨
            const userData = localStorage.getItem('currentUser');
            const currentUser = userData ? JSON.parse(userData) : { name: "Guest Student" };

            // Package the order details
            const orderData = {
                customerName: currentUser.name, // Automatically uses the logged-in user's name
                productName: btn.getAttribute('data-name'),
                quantity: 1,
                totalPrice: parseFloat(btn.getAttribute('data-price')),
                status: "Pending"
            };

            try {
                // Send the order to the database
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });

                if (!response.ok) throw new Error('Order failed to send');

                // Success! Give visual feedback
                btn.innerHTML = '<i class="bi bi-check-lg"></i> Sent';
                btn.classList.replace('btn-orange', 'btn-success');
                
                alert(`Order for ${orderData.productName} placed successfully!`);

            } catch (error) {
                console.error("Order Error:", error);
                alert("Failed to place order. Is the backend running?");
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }
});