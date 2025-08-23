// Mock data for demonstration. In a real application, this would be fetched from a database.
const products = [
  { id: 'solar-kit-1kva', name: '1kVA Solar Kit', description: 'Complete solar system for small homes and offices. Powers lights, fans, and a TV.', price: 450000, original_price: 500000, stock: 15, ratings: 4.8, category: 'complete-systems', imageUrl: 'https://pink-quiet-wolf-922.mypinata.cloud/ipfs/bafybeidxjelml6mvd2x233vxpgg3ycdh6odix6sh2ugijsyjiqbfkvd3lq', isHotDeal: true, paySmallSmall: true, swapAvailable: false },
  { id: 'power-bank-500w', name: '500W Solar Power Bank', description: 'Portable power bank for charging laptops, phones, and small appliances.', price: 120000, original_price: 135000, stock: 8, ratings: 4.5, category: 'power-banks', imageUrl: 'https://pink-quiet-wolf-922.mypinata.cloud/ipfs/bafybeicicd2k5s2ilg3y22wp67n6l2smfxuoch3yquxxhu64a6jiys7m3q', isHotDeal: false, paySmallSmall: true, swapAvailable: true },
  { id: 'inverter-3kva', name: '3kVA Pure Sine Wave Inverter', description: 'High-quality inverter for seamless power conversion. Perfect for home use.', price: 280000, original_price: null, stock: 22, ratings: 4.9, category: 'inverters', imageUrl: 'https://pink-quiet-wolf-922.mypinata.cloud/ipfs/bafybeigz6gxhmfkwjnkk3vs2m7n662bhxr6l3igxx5wzl5i4x2yc47gwbm', isHotDeal: true, paySmallSmall: true, swapAvailable: false },
  { id: 'solar-panel-300w', name: '300W Solar Panel', description: 'High-efficiency monocrystalline solar panel for residential use.', price: 85000, original_price: 90000, stock: 5, ratings: 4.7, category: 'accessories', imageUrl: 'https://pink-quiet-wolf-922.mypinata.cloud/ipfs/bafybeidcvnuylhjlbtwncjfyvxmzuejsozuuzql3wld36luu4sqxbkmoti', isHotDeal: false, paySmallSmall: false, swapAvailable: false }
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

    // This is a simple mock. In a real app, this should be a secure API call.
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
    if (!productsGrid) return; // Exit if not on a products page

    productsGrid.innerHTML = '';
    const productsToDisplay = productsToRender || products;

    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = '<p style="text-align:center; padding: 2rem;">No products found.</p>';
        return;
    }

    productsToDisplay.forEach(product => {
      const productCard = `
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
      `;
      productsGrid.innerHTML += productCard;
    });
};

const filterProducts = () => {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const priceRange = document.getElementById('priceFilter').value;

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

// Initial calls and Event Listeners
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

  // Navigation and UI buttons
  const menuIcon = document.getElementById('menuIcon');
  if (menuIcon) menuIcon.addEventListener('click', toggleMenu);

  const cartIcon = document.getElementById('cartIcon');
  if (cartIcon) cartIcon.addEventListener('click', toggleCart);

  const cartCloseBtn = document.getElementById('cartCloseBtn');
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', toggleCart);

  const adminLink = document.getElementById('adminLink');
  if (adminLink) adminLink.addEventListener('click', showAdminLogin);

  const adminCloseBtn = document.getElementById('adminCloseBtn');
  if (adminCloseBtn) adminCloseBtn.addEventListener('click', hideAdminLogin);

  const shopNowBtn = document.getElementById('shopNowBtn');
  if (shopNowBtn) shopNowBtn.addEventListener('click', scrollToProducts);

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);
  
  // Product actions - Event delegation for multiple buttons
  const productsGrid = document.getElementById('productsGrid');
  if (productsGrid) {
    productsGrid.addEventListener('click', (event) => {
      const target = event.target;
      const productCard = target.closest('.product-card');
      if (!productCard) return;
  
      const productId = productCard.dataset.id;
      
      // Check which button was clicked
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
          // If the click is on the card but not a button, show modal
          showProductModal(productId);
      }
    });
  }

  const modalCloseBtn = document.getElementById('modalCloseBtn');
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', hideProductModal);
  
  // Search and Filters
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.addEventListener('keyup', filterProducts);

  const categoryFilter = document.getElementById('categoryFilter');
  if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);

  const priceFilter = document.getElementById('priceFilter');
  if (priceFilter) priceFilter.addEventListener('change', filterProducts);
  
  // Category cards
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      window.location.href = `${category}.html`;
    });
  });
  
  // Admin login
  const adminLoginForm = document.getElementById('adminLoginForm');
  if (adminLoginForm) adminLoginForm.addEventListener('submit', handleAdminLogin);
});
