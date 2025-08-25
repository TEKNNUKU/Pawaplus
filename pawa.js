// This script is the core logic for the SolarHub e-commerce website.
// It handles product data, cart management, UI interactions, and event listeners.

// --- UI Components for dynamic messaging and modals ---

// This is the HTML for the toast message component.
const toastHTML = `
  <div id="toastMessage" style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: linear-gradient(90deg, #f7931a, #e5820a); color: white; padding: 15px 25px; border-radius: 10px; font-size: 1rem; z-index: 10000; opacity: 0; transition: opacity 0.5s ease; display: none; text-align: center; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
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

// --- MODAL HTML DEFINITIONS ---

// Checkout/Buy Now Modal
const checkoutModalHTML = `
<style>
/* Modal and Form Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000; /* Increased z-index to be on top of the cart sidebar */
}
.modal-content {
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
    position: relative;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    overflow-y: auto;
    max-height: 90vh;
    font-family: 'Inter', sans-serif;
}
.close-btn {
    position: absolute;
    top: 15px;
    right: 25px;
    font-size: 2rem;
    cursor: pointer;
    color: #333;
}
.modal-title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #333;
}
.form-group {
    margin-bottom: 1rem;
}
.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
}
.form-group input, .form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-sizing: border-box;
}
.delivery-options-group {
    margin-bottom: 1.5rem;
}
.delivery-option {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
}
.delivery-option:hover {
    background-color: #f5f5f5;
}
.delivery-option input[type="radio"] {
    margin-right: 1rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #ccc;
    border-radius: 50%;
    outline: none;
    transition: border-color 0.3s;
    cursor: pointer;
}
.delivery-option input[type="radio"]:checked {
    border-color: #f7931a;
    background-color: #f7931a;
}
.delivery-option input[type="radio"]:checked::after {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    margin: 3px;
    background-color: #fff;
    border-radius: 50%;
}
.delivery-option-text {
    flex-grow: 1;
}
.summary-line {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-top: 1px solid #eee;
    font-weight: 500;
}
.summary-line.total {
    font-weight: 700;
    font-size: 1.25rem;
    color: #f7931a;
    margin-top: 1rem;
}
.summary-line span:last-child {
    font-weight: 700;
}
.btn-proceed {
    width: 100%;
    padding: 1rem;
    background-color: #f7931a;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
}
.btn-proceed:hover {
    background-color: #e5820a;
}
.save-details-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
}
</style>
  <div id="checkoutModal" class="modal-overlay" style="display: none;">
    <div class="modal-content">
      <span class="close-btn checkout-close-btn">&times;</span>
      <h3 class="modal-title" id="checkoutTitle">Complete Your Order</h3>
      <form id="checkoutForm">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone" required>
        </div>
        <div class="form-group">
          <label for="address">Delivery Address</label>
          <textarea id="address" name="address" required></textarea>
        </div>

        <div class="delivery-options-group">
          <label>Select Delivery Option</label>
          <div class="delivery-option">
            <input type="radio" id="delivery-free" name="deliveryOption" value="free" checked>
            <div class="delivery-option-text">
              <strong>Free Delivery</strong> (Lagos Only, up to 48hrs)
              <span>₦0</span>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio" id="delivery-same-day" name="deliveryOption" value="same-day">
            <div class="delivery-option-text">
              <strong>Same Day Delivery</strong> (Lagos Only)
              <span>₦4,000</span>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio" id="delivery-outside" name="deliveryOption" value="outside-lagos">
            <div class="delivery-option-text">
              <strong>Delivery Outside Lagos</strong>
              <span>₦10,000</span>
            </div>
          </div>
        </div>

        <div class="summary-line">
          <span>Subtotal:</span>
          <span id="subtotalAmount">₦0</span>
        </div>
        <div class="summary-line">
          <span>Delivery Fee:</span>
          <span id="deliveryFeeAmount">₦0</span>
        </div>
        <div class="summary-line total">
          <span>Total:</span>
          <span id="finalAmount">₦0</span>
        </div>
        
        <div class="save-details-checkbox">
          <input type="checkbox" id="saveDetails" name="saveDetails">
          <label for="saveDetails">Save my details for future purchases</label>
        </div>
        
        <button type="submit" class="btn-proceed" id="placeOrderBtn">Proceed to Payment</button>
      </form>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', checkoutModalHTML);

// Pay Small-Small Modal
const paySmallSmallModalHTML = `
  <div id="paySmallSmallModal" class="modal-overlay" style="display: none;">
    <div class="modal-content">
      <span class="close-btn pss-close-btn">&times;</span>
      <h3 class="modal-title">Request a Payment Plan</h3>
      <p style="text-align: center; margin-bottom: 1.5rem;">Please provide your details and a representative will contact you shortly to set up a flexible payment plan.</p>
      <form id="paySmallSmallForm">
        <div class="form-group">
          <label for="pss-name">Full Name</label>
          <input type="text" id="pss-name" name="name" required>
        </div>
        <div class="form-group">
          <label for="pss-email">Email</label>
          <input type="email" id="pss-email" name="email" required>
        </div>
        <div class="form-group">
          <label for="pss-phone">Phone Number</label>
          <input type="tel" id="pss-phone" name="phone" required>
        </div>
        <div class="form-group">
          <label for="pss-address">Delivery Address</label>
          <textarea id="pss-address" name="address" required></textarea>
        </div>
        <div class="save-details-checkbox">
            <input type="checkbox" id="pss-saveDetails" name="saveDetails">
            <label for="pss-saveDetails">Save my details</label>
        </div>
        <button type="submit" class="btn-proceed">Submit Request</button>
      </form>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', paySmallSmallModalHTML);

// Swap Available Modal
const swapModalHTML = `
  <div id="swapModal" class="modal-overlay" style="display: none;">
    <div class="modal-content">
      <span class="close-btn swap-close-btn">&times;</span>
      <h3 class="modal-title">Request a Product Swap</h3>
      <p style="text-align: center; margin-bottom: 1.5rem;">Please provide your details and information about the device you'd like to swap.</p>
      <form id="swapForm">
        <div class="form-group">
          <label for="swap-name">Full Name</label>
          <input type="text" id="swap-name" name="name" required>
        </div>
        <div class="form-group">
          <label for="swap-email">Email</label>
          <input type="email" id="swap-email" name="email" required>
        </div>
        <div class="form-group">
          <label for="swap-phone">Phone Number</label>
          <input type="tel" id="swap-phone" name="phone" required>
        </div>
        <div class="form-group">
          <label for="swap-address">Delivery Address</label>
          <textarea id="swap-address" name="address" required></textarea>
        </div>
        <div class="form-group">
          <label for="swapInfo">Details of your device for swapping</label>
          <textarea id="swapInfo" name="swapInfo" required placeholder="e.g., Device type (e.g., 2kva inverter), condition (e.g., used for 2 years, works well), any known issues."></textarea>
        </div>
        <div class="save-details-checkbox">
            <input type="checkbox" id="swap-saveDetails" name="saveDetails">
            <label for="swap-saveDetails">Save my details</label>
        </div>
        <button type="submit" class="btn-proceed">Submit Swap Request</button>
      </form>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', swapModalHTML);

// Mock data for demonstration. In a real application, this would be fetched from a database.
const products = [
    { id: 'solar-kit-1kva', name: '1kVA Solar Kit', description: 'Complete solar system for small homes and offices. Powers lights, fans, and a TV.', price: 450000, original_price: 500000, stock: 15, ratings: 4.8, category: 'complete-systems', imageUrl: 'https://pink-quiet-wolf-922.mypinata.cloud/ipfs/bafybeidxjelml6mvd2x233vxpgg3ycdh6odix6sh2ugijsyjiqbfkvd3lq', isHotDeal: true, paySmallSmall: true, swapAvailable: false },
    { id: 'power-bank-500w', name: '500W Solar Power Bank', description: 'Portable power bank for charging laptops, phones, and small appliances.', price: 120000, original_price: 135000, stock: 8, ratings: 4.5, category: 'power-banks', imageUrl: 'https://pink-quiet-wolf-922.mypinata.cloud/ipfs/bafybeicicd2k5s2ilg3y22wp67n6l2smfxuoch3yquxxhu64a6jiys7m3q', isHotDeal: false, paySmallSmall: true, swapAvailable: true },
    { id: 'inverter-3kva', name: '3kVA Pure Sine Wave Inverter', description: 'High-quality inverter for seamless power conversion. Perfect for home use.', price: 280000, original_price: null, stock: 22, ratings: 4.9, category: 'inverters', imageUrl: 'https://pink-quiet-wolf-922.mypinata.cloud/ipfs/bafybeigz6gxhmfkwjnkk3vs2m7n662bhxr6l3igxx5wzl5i4x2yc47gwbm', isHotDeal: true, paySmallSmall: true, swapAvailable: false },
    { id: 'solar-panel-300w', name: '300W Solar Panel', description: 'High-efficiency monocrystalline solar panel for residential use.', price: 85000, original_price: 90000, stock: 5, ratings: 4.7, category: 'accessories', imageUrl: 'https://pink-quiet-wolf-922.mypinata.cloud/ipfs/bafybeidcvnuylhjlbtwncjfyvxmzuejsozuuzql3wld36luu4sqxbkmoti', isHotDeal: false, paySmallSmall: false, swapAvailable: false }
];

let cart = JSON.parse(localStorage.getItem('solarhubCart')) || {};

// --- UI Toggles and Handlers ---
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

const showCheckoutModal = (action, productId = null) => {
    const modal = document.getElementById('checkoutModal');
    const title = document.getElementById('checkoutTitle');
    const subtotalAmount = document.getElementById('subtotalAmount');
    const deliveryFeeAmount = document.getElementById('deliveryFeeAmount');
    const finalAmount = document.getElementById('finalAmount');
    const deliveryOptionRadios = document.querySelectorAll('input[name="deliveryOption"]');

    // Load saved user details
    const savedUserDetails = JSON.parse(localStorage.getItem('solarhubUserDetails'));
    if (savedUserDetails) {
        document.getElementById('name').value = savedUserDetails.name || '';
        document.getElementById('email').value = savedUserDetails.email || '';
        document.getElementById('phone').value = savedUserDetails.phone || '';
        document.getElementById('address').value = savedUserDetails.address || '';
        document.getElementById('saveDetails').checked = true;
    } else {
        document.getElementById('saveDetails').checked = false;
    }

    // Set base amount based on action
    let baseAmount = 0;
    if (action === 'buyNow' && productId) {
        const product = products.find(p => p.id === productId);
        baseAmount = product.price;
        title.innerText = `Buy Now: ${product.name}`;
    } else if (action === 'checkout') {
        baseAmount = Object.values(cart).reduce((total, item) => total + (item.price * item.quantity), 0);
        title.innerText = `Complete Your Order`;
    }

    const updateFinalAmount = () => {
        const deliveryFees = { 'free': 0, 'same-day': 4000, 'outside-lagos': 10000 };
        const selectedOption = document.querySelector('input[name="deliveryOption"]:checked').value;
        const selectedFee = deliveryFees[selectedOption];
        const total = baseAmount + selectedFee;

        subtotalAmount.innerText = `₦${baseAmount.toLocaleString()}`;
        deliveryFeeAmount.innerText = `₦${selectedFee.toLocaleString()}`;
        finalAmount.innerText = `₦${total.toLocaleString()}`;
    };

    deliveryOptionRadios.forEach(radio => {
        radio.addEventListener('change', updateFinalAmount);
    });

    // Initial calculation
    updateFinalAmount();

    document.getElementById('checkoutForm').onsubmit = (e) => {
        e.preventDefault();
        handleFlutterwavePayment(baseAmount);
    };

    modal.style.display = 'flex';
};

const hideCheckoutModal = () => {
    document.getElementById('checkoutModal').style.display = 'none';
};

const showPaySmallSmallModal = (productId) => {
    const modal = document.getElementById('paySmallSmallModal');
    const form = document.getElementById('paySmallSmallForm');
    const savedUserDetails = JSON.parse(localStorage.getItem('solarhubUserDetails'));

    if (savedUserDetails) {
        document.getElementById('pss-name').value = savedUserDetails.name || '';
        document.getElementById('pss-email').value = savedUserDetails.email || '';
        document.getElementById('pss-phone').value = savedUserDetails.phone || '';
        document.getElementById('pss-address').value = savedUserDetails.address || '';
        document.getElementById('pss-saveDetails').checked = true;
    } else {
        form.reset();
        document.getElementById('pss-saveDetails').checked = false;
    }

    form.onsubmit = (e) => {
        e.preventDefault();
        const userData = {
            name: document.getElementById('pss-name').value,
            email: document.getElementById('pss-email').value,
            phone: document.getElementById('pss-phone').value,
            address: document.getElementById('pss-address').value,
        };
        if (document.getElementById('pss-saveDetails').checked) {
            localStorage.setItem('solarhubUserDetails', JSON.stringify(userData));
        }
        showToastMessage("Thank you! A representative will contact you shortly to set up your payment plan.");
        modal.style.display = 'none';
    };

    modal.style.display = 'flex';
};

const showSwapModal = (productId) => {
    const modal = document.getElementById('swapModal');
    const form = document.getElementById('swapForm');
    const savedUserDetails = JSON.parse(localStorage.getItem('solarhubUserDetails'));

    if (savedUserDetails) {
        document.getElementById('swap-name').value = savedUserDetails.name || '';
        document.getElementById('swap-email').value = savedUserDetails.email || '';
        document.getElementById('swap-phone').value = savedUserDetails.phone || '';
        document.getElementById('swap-address').value = savedUserDetails.address || '';
        document.getElementById('swap-saveDetails').checked = true;
    } else {
        form.reset();
        document.getElementById('swap-saveDetails').checked = false;
    }

    form.onsubmit = (e) => {
        e.preventDefault();
        const userData = {
            name: document.getElementById('swap-name').value,
            email: document.getElementById('swap-email').value,
            phone: document.getElementById('swap-phone').value,
            address: document.getElementById('swap-address').value,
            swapInfo: document.getElementById('swapInfo').value
        };
        if (document.getElementById('swap-saveDetails').checked) {
            localStorage.setItem('solarhubUserDetails', JSON.stringify(userData));
        }
        showToastMessage("Thank you! We have received your swap request and will contact you shortly.");
        modal.style.display = 'none';
    };

    modal.style.display = 'flex';
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
    showCheckoutModal('buyNow', productId);
};

const paySmallSmall = (productId) => {
    showPaySmallSmallModal(productId);
};

const swapAvailable = (productId) => {
    showSwapModal(productId);
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
    showCheckoutModal('checkout');
};

const scrollToProducts = () => {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
};

// --- Payment Logic with Flutterwave ---
const handleFlutterwavePayment = (baseAmount) => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const deliveryOption = document.querySelector('input[name="deliveryOption"]:checked').value;

    // Robust validation for email
    if (!email || !email.includes('@')) {
        showToastMessage('Please enter a valid email address to proceed.');
        return;
    }

    if (document.getElementById('saveDetails').checked) {
        const userData = { name, email, phone, address };
        localStorage.setItem('solarhubUserDetails', JSON.stringify(userData));
    }

    const deliveryFees = { 'free': 0, 'same-day': 4000, 'outside-lagos': 10000 };
    const deliveryFee = deliveryFees[deliveryOption];
    const finalAmount = baseAmount + deliveryFee;
    
    // Check if the Flutterwave script is loaded
    if (typeof FlutterwaveCheckout !== 'function') {
        showToastMessage('Payment gateway not loaded. Please try refreshing the page.');
        console.error('Flutterwave script not loaded.');
        return;
    }

     FlutterwaveCheckout({
        public_key: "FLWPUBK-05bb86af711fd1998eb529cb0bc4e0f4-X",
        tx_ref: "pawa-" + Math.floor(Math.random() * 1000000),
        amount: amount,
        currency: "NGN",
        payment_options: "card,mobilemoney,ussd",
        redirect_url: "https://pawa9ja.ng/order-success", // Replace with your success URL
        customer: {
            email: customerDetails.email,
            phone_number: customerDetails.phoneNumber,
            name: customerDetails.fullName,
        },
        customizations: {
            title: "Pawa+9ja Order",
            description: "Payment for your solar products order",
            logo: "https://pawa9ja.ng/logo.png", // Replace with your logo URL
        },
        callback: function(data) {
            // Check for successful payment and redirect
            if (data.status === "successful") {
                showMessage("Payment successful! Your order has been placed.");
                // Clear cart after successful payment
                cart = {};
                updateCartUI();
                hideCheckoutModal();
            } else {
                showMessage("Payment failed. Please try again.");
            }
        },
        onClose: function() {
            // Modal closed by user
            showMessage("Payment was cancelled.");
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

    // Event listeners for closing the modals
    document.querySelector('.checkout-close-btn')?.addEventListener('click', hideCheckoutModal);
    document.querySelector('.pss-close-btn')?.addEventListener('click', () => document.getElementById('paySmallSmallModal').style.display = 'none');
    document.querySelector('.swap-close-btn')?.addEventListener('click', () => document.getElementById('swapModal').style.display = 'none');

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
