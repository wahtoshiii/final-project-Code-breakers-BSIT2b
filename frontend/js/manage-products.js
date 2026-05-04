document.addEventListener('DOMContentLoaded', () => {
    // Cart Data Array
    let cart = [];

    // DOM Elements
    const badge = document.getElementById('cartBadge');
    const cartContainer = document.getElementById('cartItemsContainer');
    const emptyMsg = document.getElementById('emptyCartMsg');
    const cartTotalDisplay = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // 1. Listen for Add to Cart clicks
    // Using event delegation so it works even if you load pages dynamically via SPA
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart-btn');
        if (!btn) return;

        // Visual feedback: briefly turn the button green and change icon
        const originalIcon = btn.innerHTML;
        btn.classList.replace('btn-orange', 'btn-success');
        btn.innerHTML = '<i class="bi bi-check-lg"></i>';
        setTimeout(() => {
            btn.classList.replace('btn-success', 'btn-orange');
            btn.innerHTML = originalIcon;
        }, 800);

        // Get product data from the button's attributes
        const product = {
            id: btn.getAttribute('data-id'),
            name: btn.getAttribute('data-name'),
            price: parseFloat(btn.getAttribute('data-price')),
            qty: 1
        };

        addToCart(product);
    });

    // 2. Add Item Function
    function addToCart(product) {
        // Check if item already exists in cart
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.qty += 1; // Increase quantity
        } else {
            cart.push(product); // Add new item
        }

        updateCartUI();
    }

    // 3. Remove Item Function (Attached to window so inline HTML onclick can see it)
    window.removeFromCart = function(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
    }

    // 4. Update the UI
    function updateCartUI() {
        // Update Badge Count
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.style.display = 'block';
            emptyMsg.style.display = 'none';
            checkoutBtn.disabled = false;
        } else {
            badge.style.display = 'none';
            emptyMsg.style.display = 'block';
            checkoutBtn.disabled = true;
        }

        // Calculate Total Price
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        cartTotalDisplay.textContent = `₱${totalPrice.toFixed(2)}`;

        // Render Cart Items
        // First, clear existing items (but keep the empty message div)
        const items = cartContainer.querySelectorAll('.cart-item');
        items.forEach(item => item.remove());

        // Inject new items
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item d-flex justify-content-between align-items-center mb-3 p-2 bg-white rounded-3 border shadow-sm';
            itemDiv.innerHTML = `
                <div>
                    <h6 class="mb-0 fw-bold text-dark" style="font-size: 0.85rem;">${item.name}</h6>
                    <small class="text-muted">${item.qty} x ₱${item.price.toFixed(2)}</small>
                </div>
                <div class="d-flex align-items-center">
                    <span class="fw-bold text-success me-3">₱${(item.price * item.qty).toFixed(2)}</span>
                    <button class="btn btn-sm btn-outline-danger border-0" onclick="removeFromCart('${item.id}')">
                        <i class="bi bi-trash3"></i>
                    </button>
                </div>
            `;
            cartContainer.appendChild(itemDiv);
        });
    }

    // 5. Checkout Logic
    checkoutBtn.addEventListener('click', () => {
        alert("Order placed successfully! This will notify the seller.");
        cart = []; // Empty cart after checkout
        updateCartUI();
        
        // Close the offcanvas
        const offcanvasElement = document.getElementById('cartOffcanvas');
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
        offcanvasInstance.hide();
    });
});