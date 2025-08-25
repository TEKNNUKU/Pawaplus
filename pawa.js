// This script is the core logic for the SolarHub e-commerce website.
// It handles product data, cart management, UI interactions, and event listeners.

// --- UI Components for dynamic messaging and modals ---

// This is the HTML for the toast message component.
const toastHTML = `
  <div id="toastMessage" style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background-color: rgba(0, 0, 0, 0.75); color: white; padding: 15px 25px; border-radius: 10px; font-size: 1rem; z-index: 1000; opacity: 0; transition: opacity 0.5s ease; display: none; text-align: center; white-space: nowrap;">
  </div>
`;
document.body.insertAdjacentHTML('beforeend', toastHTML);

const showToastMessage = (message) => {
    const toastElement = document.getElementById('toastMessage');
    if (!toastElement) return;

    toastElement.innerText = message;
    toastElement.style.display = 'block';
    toastElement.style.opacity = '1';

    setTimeout(() => {
        toastElement.style.opacity = '0';
        setTimeout(() => {
            toastElement.style.display = 'none';
        }, 500);
    }, 3000);
};

// HTML for the new checkout/contact modal
const checkoutModalHTML = `
  <div id="checkoutModal" class="modal-overlay" style="display: none;">
    <div class="modal-content">
      <span class="close-btn" id="checkoutCloseBtn">&times;</span>
      <h3 id="checkoutTitle">Checkout</h3>
      <p id="checkoutDescription"></p>
      <form id="checkoutForm">
        <div class="form-group">
          <label for="name">Full Name:</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="phone">Phone Number:</label>
          <input type="tel" id="phone" name="phone" required>
        </div>
        <div class="form-group">
          <label for="address">Delivery Address:</label>
          <textarea id="address" name="address" required></textarea>
        </div>
        <div class="form-group" id="swapInfoGroup" style="display:none;">
          <label for="swapInfo">Further Information for Swap:</label>
          <textarea id="swapInfo" name="swapInfo" placeholder="e.g., condition of your old device, preferred pick-up time, etc."></textarea>
        </div>
        <div class="form-group">
          <label for="deliveryOption">Delivery Option:</label>
          <select id="deliveryOption" name="deliveryOption">
            <option value="free">Free Delivery (Lagos Only, up to 48hrs) - ₦0</option>
            <option value="same-day">Same Day Delivery (Lagos Only) - ₦4,000</option>
            <option value="outside-lagos">Delivery Outside Lagos - ₦10,000</option>
          </select>
        </div>
        <div class="form-group">
          <input type="checkbox" id="saveDetails" name="saveDetails">
          <label for="saveDetails">Save my details for future use</label>
        </div>
        <div class="form-group total-display">
          <span>Total:</span>
          <span id="finalAmount">₦0</span>
        </div>
        <button type="submit" class="btn btn-primary" id="placeOrderBtn">Make Payment</button>
      </form>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', checkoutModalHTML);

// Mock data for demonstration. In a real application, this would be fetched from a database.
const products = [
    { id: 'solar-kit-1kva', name: '1kVA Solar Kit', description: 'Complete solar system for small homes and offices. Powers lights, fans, and a TV.', price: 450000, original_price: 500000, stock: 15, ratings: 4.8, category: 'complete-systems', imageUrl: 'https://pink-quiet-wolf-922.mypinata.cloud/ipfs/bafybeidxjelml6mvd2x233vxpgg3ycdh6odix6sh2ugijsyjiqbfkvd3lq', isHotDeal: true, paySmallSmall: true, swapAvailable: false },
    { id: 'power-bank-500w', name: '500W Solar Power Bank', description: 'Portable power bank for charging laptops, phones, and small appliances.', price: 120000, original_price: 135000, stock: 8, ratings: 4.5, category: 'power-banks', imageUrl: 'https://pink-quiet-wolf-922.mypinata.cloud/ipfs/bafybeicicd2k5s2ilg3y22wp67n6l2smfxuoch3yquxxhu64a6jiys7m3q', isHotDeal: false, paySmallSmall: true, swapAvailable: true },
    { id: 'inverter-3kva', name: '3kVA Pure Sine Wave Inverter', description: 'High-quality inverter for seamless power conversion. Perfect for home use.', price: 280000, original_price: null, stock: 22, ratings: 4.9, category: 'inverters', imageUrl: 'https://pink-quiet-wolf-922.mypinata.cloud/ipfs/bafybeigz6gxhmfkwjnkk3vs2m7n662bhxr6l3igxx5wzl5i4x2yc47gwbm', isHotDeal: true, paySmallSmall: true, swapAvailable: false },
    { id: 'solar-panel-300w', name: '300W Solar Panel', description: 'High-efficiency monocrystalline solar panel for residential use.', price: 85000, original_price: 90000, stock: 5, ratings: 4.7, category: 'accessories', imageUrl: 'https://pink-quiet-wolf-922.mypinata.cloud/ipfs/bafybeidcvnuylhjlbtwncjfyvxmzuejsozuuzql3wld36luu4sqxbkmoti', isHotDeal: false, paySmallSmall: false, swapAvailable: false }
];

let cart = JSON.parse(localStorage.getItem('solarhubCart')) || {};

// --- UI Toggles ---
const toggleCart = () => {
    document.getElementById('cartSidebar').classList.toggle('open');
};

const showAdminLogin = () => {
    document.getElementById('adminModal').style.display = 'flex';
};

const hideAdminLogin = () => {
    document.getElementById('adminModal').style.display = 'none';
};

const toggleMenu = () => {
    document.getElementById('navLinks').classList.toggle('active');
};

const showProductModal = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById('modalImage').src = product.imageUrl;
        document.getElementById('modalTitle').innerText = product.name;
        document.getElementById('modalDescription').innerText = product.description;
        document.getElementById('modalRating').innerText = `(${product.ratings} ratings)`;
        document.getElementById('modalPrice').innerText = `₦${product.price.toLocaleString()}`;
        if (product.original_price) {
            document.getElementById('modalOriginalPrice').innerText = `₦${product.original_price.toLocaleString()}`;
        } else {
            document.getElementById('modalOriginalPrice').innerText = '';
        }
        const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
        modalAddToCartBtn.onclick = () => {
            addToCart(productId);
            hideProductModal();
        };
        document.getElementById('productModal').style.display = 'flex';
    }
};

const hideProductModal = () => {
    document.getElementById('productModal').style.display = 'none';
};

// New function to show the checkout/contact modal
const showCheckoutModal = (action, productId = null) => {
    const modal = document.getElementById('checkoutModal');
    const title = document.getElementById('checkoutTitle');
    const description = document.getElementById('checkoutDescription');
    const swapInfoGroup = document.getElementById('swapInfoGroup');
    const form = document.getElementById('checkoutForm');
    const finalAmount = document.getElementById('finalAmount');

    // Load saved user details if available
    const savedUserDetails = JSON.parse(localStorage.getItem('solarhubUserDetails'));
    if (savedUserDetails) {
        document.getElementById('name').value = savedUserDetails.name || '';
        document.getElementById('email').value = savedUserDetails.email || '';
        document.getElementById('phone').value = savedUserDetails.phone || '';
        document.getElementById('address').value = savedUserDetails.address || '';
    }

    // Update modal content based on the action
    swapInfoGroup.style.display = 'none';
    form.onsubmit = null;
    let productsToCheckout = [];
    let baseAmount = 0;

    if (action === 'buyNow' && productId) {
        const product = products.find(p => p.id === productId);
        title.innerText = `Buy Now: ${product.name}`;
        description.innerText = "Please provide your details to complete your order.";
        productsToCheckout.push(product);
        baseAmount = product.price;
        form.onsubmit = (e) => handleFlutterwavePayment(e, productsToCheckout, baseAmount);
    } else if (action === 'checkout') {
        title.innerText = "Checkout";
        description.innerText = "Please provide your details to complete your cart's order.";
        productsToCheckout = Object.values(cart);
        baseAmount = productsToCheckout.reduce((total, item) => total + (item.price * item.quantity), 0);
        form.onsubmit = (e) => handleFlutterwavePayment(e, productsToCheckout, baseAmount);
    } else if (action === 'paySmallSmall' && productId) {
        const product = products.find(p => p.id === productId);
        title.innerText = `Pay Small-Small: ${product.name}`;
        description.innerText = "Provide your details to initiate a payment plan. You will be contacted shortly.";
        baseAmount = product.price;
        form.onsubmit = (e) => {
            e.preventDefault();
            const userData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
            };
            // Save details if selected
            if (document.getElementById('saveDetails').checked) {
                localStorage.setItem('solarhubUserDetails', JSON.stringify(userData));
            }
            showToastMessage("Thank you! A representative will contact you shortly to set up your payment plan.");
            hideCheckoutModal();
        };
    } else if (action === 'swapAvailable' && productId) {
        const product = products.find(p => p.id === productId);
        title.innerText = `Swap Available: ${product.name}`;
        description.innerText = "Provide your details and information about your device for a swap evaluation. A representative will contact you shortly.";
        swapInfoGroup.style.display = 'block';
        baseAmount = 0; // No initial payment for swap evaluation
        form.onsubmit = (e) => {
            e.preventDefault();
            const userData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                swapInfo: document.getElementById('swapInfo').value
            };
            // Save details if selected
            if (document.getElementById('saveDetails').checked) {
                localStorage.setItem('solarhubUserDetails', JSON.stringify(userData));
            }
            showToastMessage("Thank you! We have received your swap request and will contact you shortly.");
            hideCheckoutModal();
        };
    }

    // Update total amount on delivery option change
    const deliveryOption = document.getElementById('deliveryOption');
    deliveryOption.onchange = () => {
        const deliveryFees = { 'free': 0, 'same-day': 4000, 'outside-lagos': 10000 };
        const selectedFee = deliveryFees[deliveryOption.value];
        const total = baseAmount + selectedFee;
        finalAmount.innerText = `₦${total.toLocaleString()}`;
    };

    // Initial total amount calculation
    deliveryOption.onchange();

    modal.style.display = 'flex';
};

const hideCheckoutModal = () => {
    document.getElementById('checkoutModal').style.display = 'none';
};

// --- User Actions ---
const handleAdminLogin = (e) => {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;

    if (password === "admin123") {
        showToastMessage("Login successful! Redirecting to Admin Dashboard.");
        sessionStorage.setItem('is_admin', 'true');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
    } else {
        showToastMessage("Incorrect password.");
    }
};

const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
        if (cart[productId]) {
            cart[productId].quantity++;
        } else {
            cart[productId] = { ...product, quantity: 1 };
        }
        updateCartUI();
        showToastMessage(`${product.name} added to cart!`);
    }
};

const buyNow = (productId) => {
    // Show checkout modal with 'buyNow' action
    showCheckoutModal('buyNow', productId);
};

const paySmallSmall = (productId) => {
    // Show checkout modal with 'paySmallSmall' action
    showCheckoutModal('paySmallSmall', productId);
};

const swapAvailable = (productId) => {
    // Show checkout modal with 'swapAvailable' action
    showCheckoutModal('swapAvailable', productId);
};

const updateQuantity = (productId, change) => {
    if (cart[productId]) {
        cart[productId].quantity += change;
        if (cart[productId].quantity <= 0) {
            delete cart[productId];
        }
        updateCartUI();
    }
};

const checkout = () => {
    if (Object.keys(cart).length === 0) {
        showToastMessage("Your cart is empty!");
        return;
    }
    // Show checkout modal with 'checkout' action
    showCheckoutModal('checkout');
};

const scrollToProducts = () => {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
};

// --- Payment Logic with Flutterwave ---
const handleFlutterwavePayment = (e, productsToCheckout, baseAmount) => {
    e.preventDefault();
    
    // Check if the Flutterwave script is loaded by
    if (typeof FlutterwaveCheckout !== 'function') {
        showToastMessage('Payment gateway not loaded. Please try refreshing the page.');
        console.error('Flutterwave script not loaded.');
        return;
    }

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const deliveryOption = document.getElementById('deliveryOption').value;

    // Save user details if checked
    if (document.getElementById('saveDetails').checked) {
        const userData = { name, email, phone, address };
        localStorage.setItem('solarhubUserDetails', JSON.stringify(userData));
    }

    // Calculate final amount with delivery fee
    const deliveryFees = { 'free': 0, 'same-day': 4000, 'outside-lagos': 10000 };
    const deliveryFee = deliveryFees[deliveryOption];
    const finalAmount = baseAmount + deliveryFee;

    // Initiate payment
    FlutterwaveCheckout({
        public_key: "FLWPUBK-05bb86af711fd1998eb529cb0bc4e0f4-X",
        tx_ref: "solarhub-" + Math.floor(Math.random() * 1000000), // Generate a unique transaction reference
        amount: finalAmount,
        currency: "NGN",
        country: "NG",
        customer: {
            email: email,
            phone_number: phone,
            name: name,
        },
        customizations: {
            title: "SolarHub",
            description: "Payment for your solar products",
        },
        callback: (response) => {
            // This function is called after the payment is completed
            if (response.status === 'successful') {
                showToastMessage("Payment Successful! Your order has been placed.");
                // Clear the cart on successful payment
                cart = {};
                updateCartUI();
                hideCheckoutModal();
            } else {
                showToastMessage("Payment Failed. Please try again.");
            }
        },
        onclose: () => {
            // Modal closed by user
            showToastMessage("Payment was cancelled.");
        }
    });
};

// --- UI Updates ---
const updateCartUI = () => {
    const cartContent = document.getElementById('cartItems');
    if (!cartContent) return;

    cartContent.innerHTML = '';
    let total = 0;

    const cartItems = Object.values(cart);
    if (cartItems.length === 0) {
        cartContent.innerHTML = `<p style="text-align:center; padding: 2rem;">Your cart is empty.</p>`;
    } else {
        cartItems.forEach(item => {
            total += item.price * item.quantity;
            const cartItemHTML = `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.imageUrl}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">₦${item.price.toLocaleString()}</div>
                        <div class="quantity-controls">
                            <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                        </div>
                    </div>
                </div>
            `;
            cartContent.innerHTML += cartItemHTML;
        });
    }

    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.innerText = itemCount;
    }

    const totalAmountElement = document.getElementById('totalAmount');
    if (totalAmountElement) {
        totalAmountElement.innerText = `₦${total.toLocaleString()}`;
    }

    localStorage.setItem('solarhubCart', JSON.stringify(cart));
};

const renderProducts = (productsToRender) => {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';
    const productsToDisplay = productsToRender || products;

    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = '<p style="text-align:center; padding: 2rem;">No products found.</p>';
        return;
    }

    const productsHTML = productsToDisplay.map(product => `
        <div class="product-card animate__animated animate__fadeInUp" data-id="${product.id}">
            ${product.stock < 10 ? `<span class="product-badge">Limited Stock!</span>` : ''}
            ${product.isHotDeal ? `<span class="hot-deal-badge">🔥 Hot Deal</span>` : ''}
            <div class="product-image">
                <img src="${product.imageUrl}" alt="${product.name}" style="width:100%; height:100%; object-fit: cover; border-radius: 15px 15px 0 0;">
            </div>
            <div class="product-info">
                <h4 class="product-title">${product.name}</h4>
                <div class="product-rating">
                    <span class="stars">★★★★★</span>
                    <span class="rating-count">(${product.ratings} ratings)</span>
                </div>
                <div class="product-price">
                    <span class="current-price">₦${product.price.toLocaleString()}</span>
                    ${product.original_price ? `<span class="original-price">₦${product.original_price.toLocaleString()}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn btn-secondary buy-now-btn" data-id="${product.id}">Buy Now</button>
                </div>
                <div class="payment-options">
                    ${product.paySmallSmall ? `<button class="btn btn-link pay-small-small-btn" data-id="${product.id}">Pay Small-Small</button>` : ''}
                    ${product.swapAvailable ? `<button class="btn btn-link swap-btn" data-id="${product.id}">Swap Available</button>` : ''}
                </div>
            </div>
        </div>
    `).join('');

    productsGrid.innerHTML = productsHTML;
};

const filterProducts = () => {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');

    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const category = categoryFilter ? categoryFilter.value : 'all';
    const priceRange = priceFilter ? priceFilter.value : 'all';

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || product.category === category;

        let matchesPrice = true;
        if (priceRange !== 'all') {
            const price = product.price;
            if (priceRange === 'low') matchesPrice = price <= 500000;
            if (priceRange === 'medium') matchesPrice = price > 500000 && price <= 1000000;
            if (priceRange === 'high') matchesPrice = price > 1000000;
        }

        return matchesSearch && matchesCategory && matchesPrice;
    });

    renderProducts(filteredProducts);
};

// Countdown Timer Logic
const countdown = () => {
    const timerElement = document.getElementById('countdown');
    if (!timerElement) return;

    let totalSeconds = 48 * 60 * 60; // 48 hours in seconds

    const interval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(interval);
            timerElement.innerHTML = "EXPIRED";
            return;
        }
        totalSeconds--;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        timerElement.innerHTML = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
};

// --- Initial calls and Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on a category page and filter products
    const pageCategory = document.body.dataset.category;
    if (pageCategory) {
        const filtered = products.filter(p => p.category === pageCategory);
        renderProducts(filtered);
        // Add active class to the correct category link
        const categoryLinks = document.querySelectorAll('.category-nav a');
        categoryLinks.forEach(link => {
            if (link.href.includes(pageCategory)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    } else {
        renderProducts(products);
    }

    updateCartUI();
    countdown();

    // Event listeners for UI Toggles
    document.getElementById('menuIcon')?.addEventListener('click', toggleMenu);
    document.getElementById('cartIcon')?.addEventListener('click', toggleCart);
    document.getElementById('cartCloseBtn')?.addEventListener('click', toggleCart);
    document.getElementById('adminLink')?.addEventListener('click', showAdminLogin);
    document.getElementById('adminCloseBtn')?.addEventListener('click', hideAdminLogin);
    document.getElementById('shopNowBtn')?.addEventListener('click', scrollToProducts);
    document.getElementById('checkoutBtn')?.addEventListener('click', checkout);
    document.getElementById('checkoutCloseBtn')?.addEventListener('click', hideCheckoutModal);

    // Event delegation for product card buttons
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        productsGrid.addEventListener('click', (event) => {
            const target = event.target;
            const productCard = target.closest('.product-card');
            if (!productCard) return;

            const productId = productCard.dataset.id;

            if (target.closest('.add-to-cart-btn')) {
                event.stopPropagation();
                addToCart(productId);
            } else if (target.closest('.buy-now-btn')) {
                event.stopPropagation();
                buyNow(productId);
            } else if (target.closest('.pay-small-small-btn')) {
                event.stopPropagation();
                paySmallSmall(productId);
            } else if (target.closest('.swap-btn')) {
                event.stopPropagation();
                swapAvailable(productId);
            } else {
                showProductModal(productId);
            }
        });
    }

    // Event listeners for modal and search functionality
    document.getElementById('modalCloseBtn')?.addEventListener('click', hideProductModal);
    document.getElementById('searchInput')?.addEventListener('keyup', filterProducts);
    document.getElementById('categoryFilter')?.addEventListener('change', filterProducts);
    document.getElementById('priceFilter')?.addEventListener('change', filterProducts);
    document.getElementById('adminLoginForm')?.addEventListener('submit', handleAdminLogin);

    // Event delegation for category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            window.location.href = `${category}.html`;
        });
    });
});
