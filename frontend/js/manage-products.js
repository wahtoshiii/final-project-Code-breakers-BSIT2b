document.addEventListener('DOMContentLoaded', () => {
    
    // Grab all the HTML elements we need to interact with
    const productGrid = document.querySelector('main .row.g-3');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartBadge = document.getElementById('cartBadge');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const emptyCartMsg = document.getElementById('emptyCartMsg');

    // This array holds the user's shopping cart items
    let cart = [];

    // ─── 1. FETCH & DISPLAY PRODUCTS FROM MONGODB ───
    async function loadProducts() {
        if (!productGrid) return;
        try {
            const response = await fetch('/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');

            const products = await response.json();
            productGrid.innerHTML = ''; // Clear hardcoded items

            if (products.length === 0) {
                productGrid.innerHTML = '<div class="col-12 text-center text-muted mt-4">No products available right now.</div>';
                return;
            }

            products.forEach(product => {
                const price = parseFloat(product.price || 0).toFixed(2);
                const stock = product.stock || 0;
                const inStock = stock > 0;
                const displayName = product.productName || product.name || "Unnamed Item";
                const id = product._id;

                // Only show the "+" button if the item is in stock
                const buttonHTML = inStock
                    ? `<button class="btn btn-sm btn-orange rounded-circle shadow-sm d-flex align-items-center justify-content-center add-to-cart-btn" style="width: 32px; height: 32px;" data-id="${id}" data-name="${displayName}" data-price="${price}">
                           <i class="bi bi-plus-lg pointer-events-none"></i>
                       </button>`
                    : `<span class="badge bg-secondary" style="font-size:0.65rem;">Out of Stock</span>`;

                const cardHTML = `
                    <div class="col-6 col-md-4">
                        <div class="card h-100 shadow-sm border-0 rounded-4 p-2 action-card">
                            <div class="card-body p-2 d-flex flex-column">
                                <div class="bg-light rounded-3 mb-3 d-flex align-items-center justify-content-center" style="height: 100px;">
                                    <i class="bi bi-bag text-muted fs-2"></i>
                                </div>
                                <h6 class="card-title fw-bold text-dark mb-1" style="font-size: 0.9rem;">${displayName}</h6>
                                <p class="card-text text-muted mb-3 flex-grow-1" style="font-size: 0.75rem;">
                                    ${inStock ? `Stock: ${stock}` : 'Currently unavailable'}
                                </p>
                                
                                <div class="d-flex justify-content-between align-items-center mt-auto">
                                    <h6 class="text-success fw-bold mb-0">₱${price}</h6>
                                    ${buttonHTML}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                productGrid.insertAdjacentHTML('beforeend', cardHTML);
            });
        } catch (error) {
            console.error('Error loading products:', error);
            productGrid.innerHTML = '<div class="col-12 text-center text-danger mt-4">Failed to connect to database.</div>';
        }
    }

    loadProducts(); // Run on page load


    // ─── 2. ADD TO CART LOGIC ───
    if (productGrid) {
        productGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.add-to-cart-btn');
            if (!btn) return;

            // Grab the data we attached to the button
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));

            // Check if item is already in the cart
            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity += 1; // Just add 1 to quantity
            } else {
                cart.push({ id, name, price, quantity: 1 }); // Add new item
            }

            updateCartUI();

            // Cool visual effect: Change '+' to a Checkmark for 1 second!
            const icon = btn.querySelector('i');
            icon.className = 'bi bi-check-lg pointer-events-none';
            btn.classList.replace('btn-orange', 'btn-success');
            setTimeout(() => {
                icon.className = 'bi bi-plus-lg pointer-events-none';
                btn.classList.replace('btn-success', 'btn-orange');
            }, 1000);
        });
    }


    // ─── 3. UPDATE CART UI (Side Panel) ───
    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalItems = 0;

        // If cart is empty, show the message and hide badge
        if (cart.length === 0) {
            if (emptyCartMsg) emptyCartMsg.style.display = 'block';
            checkoutBtn.disabled = true;
            cartBadge.style.display = 'none';
            cartTotalEl.textContent = '₱0.00';
            return;
        }

        // If cart has items, hide empty message and show badge
        if (emptyCartMsg) emptyCartMsg.style.display = 'none';
        checkoutBtn.disabled = false;
        cartBadge.style.display = 'block';

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            totalItems += item.quantity;

            const itemHTML = `
                <div class="d-flex justify-content-between align-items-center mb-3 p-2 bg-white rounded-3 shadow-sm border">
                    <div>
                        <h6 class="mb-0 fw-bold text-dark" style="font-size: 0.85rem;">${item.name}</h6>
                        <small class="text-success fw-bold">₱${item.price.toFixed(2)}</small>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge bg-light text-dark border">Qty: ${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-danger py-0 px-1 remove-btn" data-index="${index}">
                            <i class="bi bi-x"></i>
                        </button>
                    </div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        // Update Text
        cartTotalEl.textContent = `₱${total.toFixed(2)}`;
        cartBadge.textContent = totalItems;
    }

    // Handle removing items from cart
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.remove-btn');
            if (!removeBtn) return;

            const index = parseInt(removeBtn.getAttribute('data-index'));
            cart.splice(index, 1); // Remove from array
            updateCartUI(); // Refresh UI
        });
    }


    // ─── 4. CHECKOUT (Send Orders to MongoDB) ───
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            
            // Turn button into a loading spinner
            const originalText = checkoutBtn.innerHTML;
            checkoutBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Processing...';
            checkoutBtn.disabled = true;

            try {
                // Loop through the cart and send each item to the database as an Order
                const orderPromises = cart.map(item => {
                    const orderData = {
                        customerName: "Grace Ann Carilla", // Just a placeholder until you add login sessions!
                        productName: item.name,
                        quantity: item.quantity,
                        totalPrice: item.price * item.quantity,
                        status: "Pending"
                    };

                    return fetch('/api/orders', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(orderData)
                    });
                });

                // Wait for all orders to hit the database
                const results = await Promise.all(orderPromises);
                const failed = results.filter(res => !res.ok);
                
                if (failed.length > 0) throw new Error('Some items failed to process');

                // Success! 
                alert('Order placed successfully! The seller has received your request.');
                
                // 1. Empty the cart
                cart = [];
                updateCartUI();
                
                // 2. Automatically close the slide-out panel
                const offcanvasElement = document.getElementById('cartOffcanvas');
                const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
                if (offcanvasInstance) offcanvasInstance.hide();

            } catch (error) {
                console.error("Checkout Error:", error);
                alert("Failed to process checkout. Is the backend running?");
            } finally {
                // Restore button state
                checkoutBtn.innerHTML = originalText;
                checkoutBtn.disabled = false;
            }
        });
    }
});