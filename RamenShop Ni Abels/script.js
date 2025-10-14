// Sample products array
const products = [
  { id: 1, name: "Classic Shoyu Ramen", price: 12, img: "https://img.freepik.com/premium-photo/top-down-shot-classic-bowl-shoyu-ramen-white-background_975188-71959.jpg", desc: "A soy-based broth with rich umami flavor and tender noodles." },
  { id: 2, name: "Spicy Miso Ramen", price: 14, img: "https://dishingouthealth.com/wp-content/uploads/2022/01/SpicyMisoRamen_Square.jpg", desc: "A hearty, spicy broth that warms your soul with each bite." },
  { id: 3, name: "Tonkotsu Ramen", price: 15, img: "https://1.bp.blogspot.com/-gv6ye0TV1rQ/X3ys7dH30vI/AAAAAAABcJo/pnZ1xx4LdxwCkcO-ICJHoOc1Nn8e0_fIwCLcBGAsYHQ/s1920/tonkotsu-ramen.jpg", desc: "Rich and creamy pork broth simmered for 12 hours." },
  { id: 4, name: "Shio Ramen", price: 13, img: "https://www.chopstickchronicles.com/wp-content/uploads/2017/11/Shio-Ramen-10-e1666179173996.jpg", desc: "Light, clear sea salt broth with delicate chicken flavors." }
];

// Function to display products on the page (products.html)
if (document.getElementById("product-list")) {
  const list = document.getElementById("product-list");
  console.log("Product list found!"); // Debugging log

  products.forEach(p => {
    console.log(`Rendering product: ${p.name}`);  // Debugging log
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

// CART functionality - Display cart items on the cart.html page
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Display cart items in the Cart page
if (document.getElementById("cart-items")) {
  const itemsContainer = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("cart-total");
  let total = 0;

  // Add each item in the cart to the cart display
  cart.forEach(item => {
    total += item.price;
    itemsContainer.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${item.name}
        <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Delete</button>
        <span>$${item.price}</span>
      </li>`;
  });

  // Update the total
  totalDisplay.textContent = total;
}

// Function to add a product to the cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));

    // Optional: Show a confirmation (toast, alert, etc.)
    alert(`${product.name} added to cart!`);
  }
}

// Function to remove an item from the cart
function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));

  // Refresh the cart page
  location.reload();
}

// Function to refresh the cart (called when the page is loaded)
function refreshCart() {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  const itemsContainer = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("cart-total");
  let total = 0;

  itemsContainer.innerHTML = ""; // Clear existing items

  cart.forEach(item => {
    total += item.price;
    itemsContainer.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${item.name}
        <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Delete</button>
        <span>$${item.price}</span>
      </li>`;
  });

  totalDisplay.textContent = total;
}

// Automatically refresh the cart when cart.html is loaded
if (document.getElementById("cart-items")) {
  refreshCart();
}
