document.addEventListener('DOMContentLoaded', () => {
    
    // Grab all the HTML elements we need to interact with
    const productGrid = document.querySelector('main .row.g-3');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartBadge = document.getElementById('cartBadge');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const emptyCartMsg = document.getElementById('emptyCartMsg');

    // Shopping Cart & Master Product List
    let cart = [];
    let allMarketplaceProducts = []; // ✨ NEW: Holds all items for quick filtering

    // ─── 1. FETCH PRODUCTS FROM MONGODB ───
    async function loadProducts() {
        if (!productGrid) return;
        try {
            const response = await fetch('/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');

            allMarketplaceProducts = await response.json(); 
            renderProducts(allMarketplaceProducts); // Draw all of them initially
            
        } catch (error) {
            console.error('Error loading products:', error);
            productGrid.innerHTML = '<div class="col-12 text-center text-danger mt-4">Failed to connect to database.</div>';
        }
    }

    // ─── 2. RENDER PRODUCTS TO SCREEN ───
    function renderProducts(productsToDisplay) {
        productGrid.innerHTML = ''; 

        if (productsToDisplay.length === 0) {
            productGrid.innerHTML = '<div class="col-12 text-center text-muted mt-4">No products found in this category.</div>';
            return;
        }

        productsToDisplay.forEach(product => {
            const price = parseFloat(product.price || 0).toFixed(2);
            const stock = product.stock || 0;
            const inStock = stock > 0;
            const displayName = product.productName || product.name || "Unnamed Item";
            const id = product._id;
            const category = product.category || "Other"; 
            
            // ✨ 1. ADDED THE PHOTO URL VARIABLE HERE ✨
            const photoUrl = product.imageUrl || `https://placehold.co/400x300/FD7E14/FFFFFF?text=${encodeURIComponent(displayName)}`;

            const buttonHTML = inStock
                ? `<button class="btn btn-sm btn-orange rounded-circle shadow-sm d-flex align-items-center justify-content-center add-to-cart-btn" style="width: 32px; height: 32px;" data-id="${id}" data-name="${displayName}" data-price="${price}">
                       <i class="bi bi-plus-lg pointer-events-none"></i>
                   </button>`
                : `<span class="badge bg-secondary" style="font-size:0.65rem;">Out of Stock</span>`;

            const cardHTML = `
                <div class="col-6 col-md-4">
                    <div class="card h-100 shadow-sm border-0 rounded-4 p-2 action-card">
                        <div class="card-body p-2 d-flex flex-column">
                            
                            <div class="rounded-3 mb-2 overflow-hidden d-flex align-items-center justify-content-center" style="height: 120px; background-color: #f8f9fa;">
                                <img src="${photoUrl}" alt="${displayName}" class="img-fluid w-100 h-100" style="object-fit: cover;">
                            </div>
                            
                            <span class="badge bg-light text-secondary border mb-1 align-self-start" style="font-size: 0.6rem;">${category}</span>
                            
                            <h6 class="card-title fw-bold text-dark mb-1" style="font-size: 0.9rem;">${displayName}</h6>
                            <p class="card-text text-muted mb-2 flex-grow-1" style="font-size: 0.75rem;">
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
    }

    loadProducts(); // Run on page load


    // ─── 3. CATEGORY FILTER LOGIC ───
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Reset all buttons to gray
                filterBtns.forEach(b => {
                    b.classList.remove('btn-orange');
                    b.classList.add('btn-outline-secondary', 'bg-white');
                });
                
                // Make the clicked button orange
                e.target.classList.remove('btn-outline-secondary', 'bg-white');
                e.target.classList.add('btn-orange');

                // Filter the products array
                const selectedCategory = e.target.getAttribute('data-category');
                
                if (selectedCategory === 'All') {
                    renderProducts(allMarketplaceProducts);
                } else {
                    const filtered = allMarketplaceProducts.filter(p => (p.category || 'Other') === selectedCategory);
                    renderProducts(filtered);
                }
            });
        });
    }


    // ─── 4. ADD TO CART LOGIC ───
    if (productGrid) {
        productGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.add-to-cart-btn');
            if (!btn) return;

            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));

            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity += 1; 
            } else {
                cart.push({ id, name, price, quantity: 1 }); 
            }

            updateCartUI();

            // Visual effect
            const icon = btn.querySelector('i');
            icon.className = 'bi bi-check-lg pointer-events-none';
            btn.classList.replace('btn-orange', 'btn-success');
            setTimeout(() => {
                icon.className = 'bi bi-plus-lg pointer-events-none';
                btn.classList.replace('btn-success', 'btn-orange');
            }, 1000);
        });
    }


    // ─── 5. UPDATE CART UI (Side Panel) ───
    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            if (emptyCartMsg) emptyCartMsg.style.display = 'block';
            checkoutBtn.disabled = true;
            cartBadge.style.display = 'none';
            cartTotalEl.textContent = '₱0.00';
            return;
        }

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

        cartTotalEl.textContent = `₱${total.toFixed(2)}`;
        cartBadge.textContent = totalItems;
    }

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.remove-btn');
            if (!removeBtn) return;
            const index = parseInt(removeBtn.getAttribute('data-index'));
            cart.splice(index, 1);
            updateCartUI(); 
        });
    }


    // ─── 6. CHECKOUT (Send Orders to MongoDB) ───
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            const originalText = checkoutBtn.innerHTML;
            checkoutBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Processing...';
            checkoutBtn.disabled = true;

            const userData = localStorage.getItem('currentUser');
            const currentUser = userData ? JSON.parse(userData) : { name: "Guest Student" };

            try {
                const orderPromises = cart.map(item => {
                    const orderData = {
                        customerName: currentUser.name,
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

                const results = await Promise.all(orderPromises);
                const failed = results.filter(res => !res.ok);
                
                if (failed.length > 0) throw new Error('Some items failed to process');

                alert('Order placed successfully! The seller has received your request.');
                
                cart = [];
                updateCartUI();
                
                const offcanvasElement = document.getElementById('cartOffcanvas');
                const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
                if (offcanvasInstance) offcanvasInstance.hide();

            } catch (error) {
                console.error("Checkout Error:", error);
                alert("Failed to process checkout. Is the backend running?");
            } finally {
                checkoutBtn.innerHTML = originalText;
                checkoutBtn.disabled = false;
            }
        });
    }
});

// ─── 7. SEARCH BAR LOGIC ───
    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();

            // Filter our master list (allMarketplaceProducts)
            const filteredResults = allMarketplaceProducts.filter(product => {
                // Ensure we check against the correct field name from your DB
                const name = (product.name || "").toLowerCase();
                const category = (product.category || "").toLowerCase();
                
                return name.includes(searchTerm) || category.includes(searchTerm);
            });

            // Visually reset category buttons to 'All'
            const filterBtns = document.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => {
                btn.classList.remove('btn-orange');
                btn.classList.add('btn-outline-secondary', 'bg-white');
                if(btn.getAttribute('data-category') === 'All') {
                    btn.classList.add('btn-orange');
                    btn.classList.remove('btn-outline-secondary', 'bg-white');
                }
            });

            // Re-render the grid with the filtered items
            renderProducts(filteredResults);
        });
    }