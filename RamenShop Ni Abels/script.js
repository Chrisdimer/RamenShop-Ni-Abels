// cart.js - COMPATIBLE version that works with product-details.html
console.log("Cart.js loaded"); // Debug line

// Products data
const products = [
  { id: 1, name: "Classic Shoyu Ramen", price: 12, img: "https://img.freepik.com/premium-photo/top-down-shot-classic-bowl-shoyu-ramen-white-background_975188-71959.jpg", desc: "A soy-based broth with rich umami flavor and tender noodles." },
  { id: 2, name: "Spicy Miso Ramen", price: 14, img: "https://dishingouthealth.com/wp-content/uploads/2022/01/SpicyMisoRamen_Square.jpg", desc: "A hearty, spicy broth that warms your soul with each bite." },
  { id: 3, name: "Tonkotsu Ramen", price: 15, img: "https://1.bp.blogspot.com/-gv6ye0TV1rQ/X3ys7dH30vI/AAAAAAABcJo/pnZ1xx4LdxwCkcO-ICJHoOc1Nn8e0_fIwCLcBGAsYHQ/s1920/tonkotsu-ramen.jpg", desc: "Rich and creamy pork broth simmered for 12 hours." },
  { id: 4, name: "Shio Ramen", price: 13, img: "https://www.chopstickchronicles.com/wp-content/uploads/2017/11/Shio-Ramen-10-e1666179173996.jpg", desc: "Light, clear sea salt broth with delicate chicken flavors." }
];

// Function to display products on the page (products.html)
if (document.getElementById("product-list")) {
  const list = document.getElementById("product-list");
  console.log("Product list found!");

  products.forEach(p => {
    console.log(`Rendering product: ${p.name}`);
    list.innerHTML += `
      <div class="col-md-4 col-lg-3">
        <div class="card h-100 ramen-card" onclick="viewProduct(${p.id})">
          <img src="${p.img}" class="card-img-top ramen-img" alt="${p.name}">
          <div class="card-body text-center">
            <h5>${p.name}</h5>
            <p class="text-muted">$${p.price}</p>
            <button class="btn btn-warning fw-bold">View Details</button>
          </div>
        </div>
      </div>`;
  });
}

// Function to view a product's details (click event)
function viewProduct(id) {
  const product = products.find(p => p.id === id);
  localStorage.setItem("selectedProduct", JSON.stringify(product));
  window.location.href = "product-details.html";
}

// COMPATIBLE addToCart function - This handles BOTH product-details.html and cart.js calls
function addToCart(productId) {
  console.log("addToCart called with ID:", productId);
  
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let product;
  
  // Try to find product in products array first
  product = products.find(p => p.id === productId);
  
  // If not found in products array, try to get from selectedProduct in localStorage
  if (!product) {
    const selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));
    if (selectedProduct && selectedProduct.id === productId) {
      product = selectedProduct;
    }
  }
  
  if (product) {
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex !== -1) {
      // Item exists, increase quantity
      cart[existingItemIndex].quantity += 1;
      console.log("Increased quantity for:", product.name);
    } else {
      // New item, add to cart with proper structure
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: "🍜"
      });
      console.log("Added new item:", product.name);
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Cart updated:", cart);
    alert(`${product.name} added to cart!`);
    
    // Update cart count
    updateCartCount();
  } else {
    console.error("Product not found with ID:", productId);
    // Fallback: try to add whatever is in selectedProduct
    const selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));
    if (selectedProduct) {
      console.log("Using selectedProduct as fallback");
      cart.push({
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: 1,
        image: "🍜"
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${selectedProduct.name} added to cart!`);
      updateCartCount();
    }
  }
}

// Update cart count in navigation
function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'inline' : 'none';
    console.log("Cart count updated:", totalItems);
  }
}

// Cart page specific functions
function renderCart() {
  console.log("renderCart called");
  
  const cartContainer = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');
  
  if (!cartContainer) return;
  
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log("Cart data to render:", cart);
  
  cartContainer.innerHTML = '';
  
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added any delicious ramen to your cart yet.</p>
        <a href="products.html" class="btn btn-primary">
          <i class="fas fa-utensils me-2"></i>Browse Our Menu
        </a>
      </div>`;
    if (cartTotalElement) cartTotalElement.textContent = '0.00';
    return;
  }
  
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    const cartElement = document.createElement('li');
    cartElement.className = 'list-group-item cart-item';
    cartElement.innerHTML = `
      <div class="item-image">${item.image || '🍜'}</div>
      <div class="item-details">
        <div class="item-name">${item.name}</div>
        <div class="item-price">$${item.price.toFixed(2)}</div>
      </div>
      <div class="quantity-controls">
        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
          <i class="fas fa-minus"></i>
        </button>
        <span class="quantity">${item.quantity}</span>
        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
          <i class="fas fa-plus"></i>
        </button>
      </div>
      <div class="item-total">$${itemTotal.toFixed(2)}</div>
      <button class="remove-btn ms-3" onclick="removeItem(${item.id})">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    cartContainer.appendChild(cartElement);
  });
  
  if (cartTotalElement) cartTotalElement.textContent = total.toFixed(2);
  console.log("Cart rendered successfully. Total:", total);
}

function updateQuantity(itemId, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const itemIndex = cart.findIndex(item => item.id === itemId);
  
  if (itemIndex !== -1) {
    cart[itemIndex].quantity += change;
    
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
  }
}

function removeItem(itemId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.id !== itemId);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function clearCart() {
  if (confirm("Are you sure you want to clear your cart?")) {
    localStorage.setItem("cart", JSON.stringify([]));
    renderCart();
    updateCartCount();
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded - Initializing cart");
  updateCartCount();
  
  // If we're on the cart page, render the cart
  if (document.getElementById('cart-items')) {
    console.log("Cart page detected - Rendering cart");
    renderCart();
    
    // Add event listeners for cart buttons
    const clearCartBtn = document.getElementById('clear-cart');
    const refreshCartBtn = document.getElementById('refresh-cart');
    
    if (clearCartBtn) {
      clearCartBtn.addEventListener('click', clearCart);
    }
    if (refreshCartBtn) {
      refreshCartBtn.addEventListener('click', renderCart);
    }
  }
  
  // Override the product-details.html addToCart function if it exists
  if (window.addToCart && window.addToCart.toString().includes('localStorage.getItem("cart")')) {
    console.log("Detected product-details.html addToCart - it will be overridden");
  }
});