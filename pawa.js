// Mock data for demonstration. In a real application, this would be fetched from a database.
const products = [
    { id: 'solar-kit-1kva', name: '1kVA Solar Kit', description: 'Complete solar system for small homes and offices. Powers lights, fans, and a TV.', price: 450000, original_price: 500000, stock: 15, ratings: 4.8, category: 'complete-systems', imageUrl: 'https://pink-quiet-wolf-922.mypinata.cloud/ipfs/bafybeidxjelml6mvd2x233vxpgg3ycdh6odix6sh2ugijsyjiqbfkvd3lq', isHotDeal: true, paySmallSmall: true, swapAvailable: false },
    { id: 'power-bank-500w', name: '500W Solar Power Bank', description: 'Portable power bank for charging laptops, phones, and small appliances.', price: 120000, original_price: 135000, stock: 8, ratings: 4.5, category: 'power-banks', imageUrl: 'https://pink-quiet-wolf-922.mypinata.cloud/ipfs/bafybeicicd2k5s2ilg3y22wp67n6l2smfxuoch3yquxxhu64a6jiys7m3q', isHotDeal: false, paySmallSmall: true, swapAvailable: true },
    { id: 'inverter-3kva', name: '3kVA Pure Sine Wave Inverter', description: 'High-quality inverter for seamless power conversion. Perfect for home use.', price: 280000, original_price: null, stock: 22, ratings: 4.9, category: 'inverters', imageUrl: 'https://pink-quiet-wolf-922.mypinata.cloud/ipfs/bafybeigz6gxhmfkwjnkk3vs2m7n662bhxr6l3igxx5wzl5i4x2yc47gwbm', isHotDeal: true, paySmallSmall: true, swapAvailable: false },
    { id: 'solar-panel-300w', name: '300W Solar Panel', description: 'High-efficiency monocrystalline solar panel for residential use.', price: 85000, original_price: 90000, stock: 5, ratings: 4.7, category: 'accessories', imageUrl: 'https://pink-quiet-wolf-922.mypinata.cloud/ipfs/bafybeidcvnuylhjlbtwncjfyvxmzuejsozuuzql3wld36luu4sqxbkmoti', isHotDeal: false, paySmallSmall: false, swapAvailable: false },
    { id: 'battery-100ah', name: '100Ah Deep Cycle Battery', description: 'Reliable deep cycle battery for solar energy storage.', price: 150000, original_price: null, stock: 30, ratings: 4.6, category: 'accessories', imageUrl: 'https://placehold.co/500x350/f0f4f8/333?text=Battery+Image', isHotDeal: false, paySmallSmall: true, swapAvailable: false },
    { id: 'solar-fan', name: '12-inch Solar Rechargeable Fan', description: 'Portable fan with built-in solar panel for charging.', price: 25000, original_price: null, stock: 50, ratings: 4.2, category: 'accessories', imageUrl: 'https://placehold.co/500x350/f0f4f8/333?text=Fan+Image', isHotDeal: true, paySmallSmall: false, swapAvailable: false },
    { id: 'solar-kit-5kva', name: '5kVA Solar Kit', description: 'Robust solar system for powering large homes and businesses.', price: 950000, original_price: 1000000, stock: 10, ratings: 4.9, category: 'complete-systems', imageUrl: 'https://placehold.co/500x350/f0f4f8/333?text=5kVA+Solar+Kit', isHotDeal: false, paySmallSmall: true, swapAvailable: true },
    { id: 'power-bank-1000w', name: '1000W Solar Power Bank', description: 'High-capacity power bank for heavy-duty appliances and tools.', price: 250000, original_price: null, stock: 12, ratings: 4.7, category: 'power-banks', imageUrl: 'https://placehold.co/500x350/f0f4f8/333?text=1000W+Bank', isHotDeal: true, paySmallSmall: false, swapAvailable: false }
];

let cart = JSON.parse(localStorage.getItem('solarhubCart')) || {};
let userDetails = JSON.parse(localStorage.getItem('solarhubUser')) || {};
const FLUTTERWAVE_PUBLIC_KEY = "FLWPUBK-05bb86af711fd1998eb529cb0bc4e0f4-X";

// UI Toggles
const toggleCart = () => {
    document.getElementById('cartSidebar').classList.toggle('open');
};

const showAdminLogin = () => {
    document.getElementById('adminModal').classList.add('open');
};

const hideAdminLogin = () => {
    document.getElementById('adminModal').classList.remove('open');
};

const toggleMenu = () => {
    document.getElementById('navLinks').classList.toggle('active');
};

// Custom modal for messages (replaces `alert()`)
const showMessage = (message) => {
    document.getElementById('messageText').innerText = message;
    document.getElementById('messageModal').classList.add('open');
};

const hideMessage = () => {
    document.getElementById('messageModal').classList.remove('open');
};

const showProductModal = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById('modalImage').src = product.imageUrl;
        document.getElementById('modalTitle').innerText = product.name;
        document.getElementById('modalDescription').innerText = product.description;
        document.getElementById('modalRating').innerText = `(${product.ratings} ratings)`;
        document.getElementById('modalPrice').innerText = `₦${product.price.toLocaleString()}`;
        
        const originalPriceElem = document.getElementById('modalOriginalPrice');
        if (product.original_price) {
            originalPriceElem.innerText = `₦${product.original_price.toLocaleString()}`;
        } else {
            originalPriceElem.innerText = '';
        }
        
        const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
        modalAddToCartBtn.onclick = () => {
            addToCart(productId);
            hideProductModal();
        };
        document.getElementById('productModal').classList.add('open');
    }
};

const hideProductModal = () => {
    document.getElementById('productModal').classList.remove('open');
};

const showCheckoutModal = (action = 'checkout', productId = null) => {
    let subtotal = 0;
    if (action === 'checkout') {
        // Calculate total for all items in the cart
        subtotal = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    } else if (productId) {
        // Calculate total for a single product
        const product = products.find(p => p.id === productId);
        subtotal = product ? product.price : 0;
    }

    // Set the initial subtotal in the UI
    document.getElementById('subtotalAmount').innerText = `₦${subtotal.toLocaleString()}`;

    // Set the delivery fee to the default (Free) and calculate initial total
    const deliveryOptions = document.getElementsByName('delivery');
    for (const option of deliveryOptions) {
        if (option.checked) {
            document.getElementById('deliveryAmount').innerText = `₦${parseInt(option.value).toLocaleString()}`;
            document.getElementById('finalTotalAmount').innerText = `₦${(subtotal + parseInt(option.value)).toLocaleString()}`;
            break;
        }
    }
    
    // Check if user details are saved and show the option to use them
    if (Object.keys(userDetails).length > 0) {
        document.getElementById('savedDetailsSection').classList.remove('hidden');
        document.getElementById('savedUserName').innerText = userDetails.fullName;
    } else {
        document.getElementById('savedDetailsSection').classList.add('hidden');
    }

    // Prefill form if user details are loaded from localStorage
    if (userDetails.fullName) {
        document.getElementById('fullName').value = userDetails.fullName;
        document.getElementById('email').value = userDetails.email;
        document.getElementById('phoneNumber').value = userDetails.phoneNumber;
        document.getElementById('deliveryAddress').value = userDetails.deliveryAddress;
    }

    // Clear additional info for new orders unless it's a swap request
    const additionalInfoTextarea = document.getElementById('additionalInfo');
    if (action !== 'swap') {
        additionalInfoTextarea.value = '';
        additionalInfoTextarea.placeholder = 'Please provide any special delivery instructions...';
    } else {
        additionalInfoTextarea.placeholder = 'Please provide details about the product you want to swap, its condition, and any questions you have.';
    }

    document.getElementById('checkoutModal').classList.add('open');
};

const hideCheckoutModal = () => {
    document.getElementById('checkoutModal').classList.remove('open');
};

const calculateFinalTotal = () => {
    let subtotal = 0;
    // Calculate subtotal from cart
    if (Object.keys(cart).length > 0) {
        subtotal = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    } else {
        // This is a single product checkout, so get the price from the modal's product id
        const modalProductId = document.getElementById('modalAddToCartBtn').onclick.toString().match(/'(.*?)'/)[1];
        const product = products.find(p => p.id === modalProductId);
        if (product) subtotal = product.price;
    }

    const deliveryFee = parseInt(document.querySelector('input[name="delivery"]:checked').value);
    const finalTotal = subtotal + deliveryFee;

    document.getElementById('subtotalAmount').innerText = `₦${subtotal.toLocaleString()}`;
    document.getElementById('deliveryAmount').innerText = `₦${deliveryFee.toLocaleString()}`;
    document.getElementById('finalTotalAmount').innerText = `₦${finalTotal.toLocaleString()}`;
};

// User Actions
const handleAdminLogin = (e) => {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;
    const adminMessage = document.getElementById('adminMessage');

    // This is a simple mock. In a real app, this should be a secure API call.
    if (password === "admin123") {
        adminMessage.classList.add('hidden');
        sessionStorage.setItem('is_admin', 'true');
        showMessage("Login successful! Redirecting to Admin Dashboard.");
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 2000);
    } else {
        adminMessage.innerText = "Incorrect password.";
        adminMessage.classList.remove('hidden');
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
        toggleCart();
    }
};

const buyNow = (productId) => {
    showCheckoutModal('buy', productId);
};

const paySmallSmall = (productId) => {
    showCheckoutModal('pay-small-small', productId);
};

const swapAvailable = (productId) => {
    showCheckoutModal('swap', productId);
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
        showMessage("Your cart is empty!");
        return;
    }
    showCheckoutModal('checkout');
};

const scrollToProducts = () => {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
};

// Handle Flutterwave Payment
const makePayment = (amount, customerDetails) => {
    FlutterwaveCheckout({
        public_key: FLUTTERWAVE_PUBLIC_KEY,
        tx_ref: "pawa-" + Date.now(),
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

const handleCheckoutFormSubmit = (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const deliveryAddress = document.getElementById('deliveryAddress').value;
    const additionalInfo = document.getElementById('additionalInfo').value;
    const saveDetails = document.getElementById('saveDetails').checked;

    const finalTotal = parseInt(document.getElementById('finalTotalAmount').innerText.replace(/₦|,/g, ''));

    const customerDetails = {
        fullName,
        email,
        phoneNumber,
        deliveryAddress,
        additionalInfo
    };
    
    // Save details to localStorage if checkbox is checked
    if (saveDetails) {
        localStorage.setItem('solarhubUser', JSON.stringify(customerDetails));
    }

    // Initiate payment
    makePayment(finalTotal, customerDetails);
};

const useSavedDetails = () => {
    document.getElementById('fullName').value = userDetails.fullName;
    document.getElementById('email').value = userDetails.email;
    document.getElementById('phoneNumber').value = userDetails.phoneNumber;
    document.getElementById('deliveryAddress').value = userDetails.deliveryAddress;
};

const clearSavedDetails = () => {
    localStorage.removeItem('solarhubUser');
    userDetails = {};
    document.getElementById('savedDetailsSection').classList.add('hidden');
    document.getElementById('fullName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phoneNumber').value = '';
    document.getElementById('deliveryAddress').value = '';
};

// UI Updates
const updateCartUI = () => {
    const cartContent = document.getElementById('cartItems');
    cartContent.innerHTML = '';
    let total = 0;

    if (Object.keys(cart).length === 0) {
        cartContent.innerHTML = `<p class="text-center p-8 text-gray-500">Your cart is empty.</p>`;
    } else {
        for (const id in cart) {
            const item = cart[id];
            total += item.price * item.quantity;
            const cartItemHTML = `
                <div class="cart-item flex items-center space-x-4 p-4 border-b">
                    <div class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                        <img src="${item.imageUrl}" alt="${item.name}" class="w-full h-full object-cover">
                    </div>
                    <div class="flex-grow">
                        <div class="font-bold text-gray-800">${item.name}</div>
                        <div class="text-sm text-gray-600">₦${item.price.toLocaleString()}</div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="qty-btn bg-gray-200 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-300" onclick="updateQuantity('${id}', -1)">-</button>
                        <span class="font-bold">${item.quantity}</span>
                        <button class="qty-btn bg-gray-200 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-300" onclick="updateQuantity('${id}', 1)">+</button>
                    </div>
                </div>
            `;
            cartContent.innerHTML += cartItemHTML;
        }
    }

    const itemCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').innerText = itemCount;
    document.getElementById('totalAmount').innerText = `₦${total.toLocaleString()}`;
    localStorage.setItem('solarhubCart', JSON.stringify(cart));
};

const renderProducts = (productsToRender, elementId) => {
    const grid = document.getElementById(elementId);
    if (!grid) return;

    grid.innerHTML = '';
    const productsToDisplay = productsToRender || products;

    if (productsToDisplay.length === 0) {
        grid.innerHTML = '<p class="text-center p-8 text-gray-500">No products found.</p>';
        return;
    }

    productsToDisplay.forEach(product => {
        const productCard = `
            <div class="product-card bg-white rounded-2xl shadow-sm overflow-hidden relative cursor-pointer" data-id="${product.id}">
                ${product.stock < 10 ? `<span class="product-badge bg-red-400 text-red-900 absolute top-4 left-4 text-xs px-2 py-1 rounded-full font-bold z-10">Limited Stock!</span>` : ''}
                ${product.isHotDeal ? `<span class="hot-deal-badge bg-yellow-200 text-yellow-800 absolute top-4 right-4 text-xs px-2 py-1 rounded-full font-bold z-10">🔥 Hot Deal</span>` : ''}
                <div class="product-image w-full h-48 overflow-hidden">
                    <img src="${product.imageUrl}" alt="${product.name}" class="w-full h-full object-cover">
                </div>
                <div class="product-info p-6">
                    <h4 class="product-title text-lg font-bold mb-2">${product.name}</h4>
                    <div class="flex items-center text-sm text-gray-500 mb-2">
                        <span class="text-yellow-400 mr-1">★★★★★</span>
                        <span>(${product.ratings} ratings)</span>
                    </div>
                    <div class="flex items-center space-x-2 mb-4">
                        <span class="current-price text-xl font-bold text-orange-600">₦${product.price.toLocaleString()}</span>
                        ${product.original_price ? `<span class="original-price text-sm text-gray-400 line-through">₦${product.original_price.toLocaleString()}</span>` : ''}
                    </div>
                    <div class="flex flex-col space-y-2">
                        <button class="btn btn-primary bg-orange-600 text-white px-4 py-2 rounded-lg font-bold add-to-cart-btn" data-id="${product.id}">
                            <i class="fas fa-shopping-cart mr-2"></i> Add to Cart
                        </button>
                        <button class="btn btn-secondary bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-bold buy-now-btn" data-id="${product.id}">Buy Now</button>
                    </div>
                    <div class="flex justify-between mt-4">
                        ${product.paySmallSmall ? `<button class="btn btn-link text-sm text-orange-600 hover:underline pay-small-small-btn" data-id="${product.id}">Pay Small-Small</button>` : '<div></div>'}
                        ${product.swapAvailable ? `<button class="btn btn-link text-sm text-gray-600 hover:underline swap-btn" data-id="${product.id}">Swap Available</button>` : '<div></div>'}
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += productCard;
    });
};

const filterProducts = () => {
    const searchTerm = (document.getElementById('searchInput') || document.getElementById('searchInputMobile')).value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const priceRange = document.getElementById('priceFilter').value;

    const filtered = products.filter(product => {
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

    renderProducts(filtered, 'productsGrid');
};

const filterByCategory = (category) => {
    const filtered = products.filter(p => p.category === category);
    renderProducts(filtered, 'productsGrid');
    
    document.getElementById('categoryFilter').value = category;

    document.querySelectorAll('.category-nav a').forEach(link => link.classList.remove('active'));
    const clickedLink = document.querySelector(`.category-nav a[data-category="${category}"]`);
    if (clickedLink) clickedLink.classList.add('active');

    scrollToProducts();
};

const renderHotDeals = () => {
    const hotDeals = products.filter(p => p.isHotDeal);
    renderProducts(hotDeals, 'hotDealsGrid');
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

// Initial calls and Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products, 'productsGrid');
    renderHotDeals();
    updateCartUI();
    countdown();

    // UI Toggles
    document.getElementById('menuIcon').addEventListener('click', toggleMenu);
    document.getElementById('cartIcon').addEventListener('click', toggleCart);
    document.getElementById('cartCloseBtn').addEventListener('click', toggleCart);
    document.getElementById('adminLink').addEventListener('click', (e) => { e.preventDefault(); showAdminLogin(); });
    document.getElementById('adminCloseBtn').addEventListener('click', hideAdminLogin);
    document.getElementById('shopNowBtn').addEventListener('click', scrollToProducts);

    // Modals
    document.getElementById('modalCloseBtn').addEventListener('click', hideProductModal);
    document.getElementById('messageCloseBtn').addEventListener('click', hideMessage);
    document.getElementById('messageOkBtn').addEventListener('click', hideMessage);
    document.getElementById('checkoutCloseBtn').addEventListener('click', hideCheckoutModal);

    // Product actions - Event delegation for multiple buttons
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
    
    // Delivery option change listener
    const deliveryOptions = document.querySelectorAll('input[name="delivery"]');
    deliveryOptions.forEach(option => {
        option.addEventListener('change', calculateFinalTotal);
    });

    // Checkout button listener
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckoutFormSubmit);

    // User details management buttons
    document.getElementById('useSavedDetailsBtn').addEventListener('click', useSavedDetails);
    document.getElementById('clearSavedDetailsBtn').addEventListener('click', clearSavedDetails);

    // Search and Filters
    document.getElementById('searchInput').addEventListener('keyup', filterProducts);
    const searchInputMobile = document.getElementById('searchInputMobile');
    if (searchInputMobile) searchInputMobile.addEventListener('keyup', filterProducts);
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);
    document.getElementById('priceFilter').addEventListener('change', filterProducts);
    
    // Category links - Event delegation
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const category = card.dataset.category;
            filterByCategory(category);
        });
    });

    // Admin login
    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
});
