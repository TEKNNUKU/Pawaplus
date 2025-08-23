// Mock data for demonstration. In a real application, this would be fetched from a database.
const products = [
  { id: 'solar-kit-1kva', name: '1kVA Solar Kit', description: 'Complete solar system for small homes and offices. Powers lights, fans, and a TV.', price: 450000, original_price: 500000, stock: 15, ratings: 4.8, category: 'complete-systems', isHotDeal: false, paySmallSmall: true, swapAvailable: false, imageUrl: 'https://pink-quiet-wolf-922.mypinata.cloud/ipfs/bafybeidxjelml6mvd2x233vxpgg3ycdh6odix6sh2ugijsyjiqbfkvd3lq' },
  { id: 'power-bank-500w', name: '500W Solar Power Bank', description: 'Portable power bank for charging laptops, phones, and small appliances.', price: 120000, original_price: 135000, stock: 8, ratings: 4.5, category: 'power-banks', isHotDeal: true, paySmallSmall: true, swapAvailable: false, imageUrl: 'https://pink-quiet-wolf-922.mypinata.cloud/ipfs/bafybeicicd2k5s2ilg3y22wp67n6l2smfxuoch3yquxxhu64a6jiys7m3q' },
  { id: 'inverter-3kva', name: '3kVA Pure Sine Wave Inverter', description: 'High-quality inverter for seamless power conversion. Perfect for home use.', price: 280000, original_price: null, stock: 22, ratings: 4.9, category: 'inverters', isHotDeal: false, paySmallSmall: true, swapAvailable: true, imageUrl: 'https://pink-quiet-wolf-922.mypinata.cloud/ipfs/bafybeigz6gxhmfkwjnkk3vs2m7n662bhxr6l3igxx5wzl5i4x2yc47gwbm' },
  { id: 'solar-panel-300w', name: '300W Solar Panel', description: 'High-efficiency monocrystalline solar panel for residential use.', price: 85000, original_price: 90000, stock: 5, ratings: 4.7, category: 'accessories', isHotDeal: true, paySmallSmall: false, swapAvailable: false, imageUrl: 'https://pink-quiet-wolf-922.mypinata.cloud/ipfs/bafybeidcvnuylhjlbtwncjfyvxmzuejsozuuzql3wld36luu4sqxbkmoti' }
];

let cart = JSON.parse(localStorage.getItem('solarhubCart')) || {};

// UI Toggles
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

// User Actions
const handleAdminLogin = (e) => {
  e.preventDefault();
  const password = document.getElementById('adminPassword').value;
  
  if (password === "admin123") {
    alert("Login successful! Redirecting to Admin Dashboard.");
    sessionStorage.setItem('is_admin', 'true');
    window.location.href = 'admin.html';
  } else {
    alert("Incorrect password.");
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

// Functions for additional payment options
const buyNow = (productId) => {
    alert(`Initiating Buy Now for product ${productId}. This will immediately take you to checkout.`);
};

const paySmallSmall = (productId) => {
    alert(`Initiating Pay Small-Small option for product ${productId}. This will redirect you to a payment plan gateway.`);
};

const swapAvailable = (productId) => {
    alert(`Initiating Swap option for product ${productId}. You will be contacted by our swap service.`);
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
    alert("Your cart is empty!");
    return;
  }
  alert("Proceeding to checkout! (This is where a payment gateway would be integrated)");
};

const scrollToProducts = () => {
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
};

// UI Updates
const updateCartUI = () => {
  const cartContent = document.getElementById('cartItems');
  cartContent.innerHTML = '';
  let total = 0;

  if (Object.keys(cart).length === 0) {
    cartContent.innerHTML = `<p style="text-align:center; padding: 2rem;">Your cart is empty.</p>`;
  } else {
    for (const id in cart) {
      const item = cart[id];
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
              <button class="qty-btn" onclick="updateQuantity('${id}', -1)">-</button>
              <span>${item.quantity}</span>
              <button class="qty-btn" onclick="updateQuantity('${id}', 1)">+</button>
            </div>
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

const renderProducts = (productsToRender) => {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    const productsToDisplay = productsToRender || products;

    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = '<p style="text-align:center; padding: 2rem;">No products found.</p>';
        return;
    }

    productsToDisplay.forEach(product => {
      const hotDealBadge = product.isHotDeal ? `<span class="product-badge hot-deal">🔥 Hot Deal!</span>` : '';
      const limitedStockBadge = product.stock < 10 ? `<span class="product-badge limited-stock">Limited Stock!</span>` : '';
      
      const paymentOptionsHTML = `
        ${product.paySmallSmall ? `<button class="btn btn-link pay-small-small-btn" data-id="${product.id}">Pay Small-Small</button>` : ''}
        ${product.swapAvailable ? `<button class="btn btn-link swap-btn" data-id="${product.id}">Swap Available</button>` : ''}
      `;

      const productCard = `
          <div class="product-card animate__animated animate__fadeInUp" data-id="${product.id}">
            ${hotDealBadge}
            ${limitedStockBadge}
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
                  ${paymentOptionsHTML}
              </div>
            </div>
          </div>
      `;
      productsGrid.innerHTML += productCard;
    });
};

const filterProducts = () => {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter')?.value || null;
    const priceRange = document.getElementById('priceFilter').value;
    const pageCategory = document.body.dataset.category || 'all';

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = pageCategory === 'all' || product.category === pageCategory;
        const matchesGlobalCategory = category === 'all' || product.category === category;
        
        let matchesPrice = true;
        if (priceRange !== 'all') {
            const price = product.price;
            if (priceRange === 'low') matchesPrice = price <= 500000;
            if (priceRange === 'medium') matchesPrice = price > 500000 && price <= 1000000;
            if (priceRange === 'high') matchesPrice = price > 1000000;
        }

        return matchesSearch && matchesCategory && matchesGlobalCategory && matchesPrice;
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

// Initial calls and Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initial product rendering based on the page
    const pageCategory = document.body.dataset.category;
    if (pageCategory) {
        const filtered = products.filter(p => p.category === pageCategory);
        renderProducts(filtered);
    } else {
        renderProducts(products);
    }

    updateCartUI();
    countdown();

    // Navigation and UI buttons
    document.getElementById('menuIcon').addEventListener('click', toggleMenu);
    document.getElementById('cartIcon').addEventListener('click', toggleCart);
    document.getElementById('cartCloseBtn').addEventListener('click', toggleCart);
    document.getElementById('adminLink').addEventListener('click', showAdminLogin);
    document.getElementById('adminCloseBtn').addEventListener('click', hideAdminLogin);
    
    // Check if element exists before adding event listener
    const shopNowBtn = document.getElementById('shopNowBtn');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', scrollToProducts);
    }
    
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
    
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

    document.getElementById('modalCloseBtn')?.addEventListener('click', hideProductModal);
    
    // Search and Filters
    document.getElementById('searchInput')?.addEventListener('keyup', filterProducts);
    document.getElementById('categoryFilter')?.addEventListener('change', filterProducts);
    document.getElementById('priceFilter')?.addEventListener('change', filterProducts);
    
    // Category cards on homepage only
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            window.location.href = `${category}.html`;
        });
    });
    
    // Admin login
    document.getElementById('adminLoginForm')?.addEventListener('submit', handleAdminLogin);
});
