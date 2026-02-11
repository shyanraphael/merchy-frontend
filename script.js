// ================== PRODUCT DATA ==================
const products = [
    { id: 1, name: "Black Elegance Dress", category: "Dress", price: 12000, image: "images/dress_1.jpg", description: "A refined black dress designed for elegant occasions.", sizes: ["XS", "S", "M", "L", "XL"] },
    { id: 2, name: "Royal Violet Skirt", category: "Skirt", price: 6000, image: "images/skirt_1.jpg", description: "A royal violet skirt with a graceful modern silhouette.", sizes: ["XS", "S", "M", "L", "XL"] },
    { id: 3, name: "Blush Chic Suit", category: "Suit", price: 17000, image: "images/suit_1.jpg", description: "A blush-toned suit combining comfort and sophistication.", sizes: ["XS", "S", "M", "L", "XL"] },
    { id: 4, name: "Sky Glow Dress", category: "Dress", price: 9000, image: "images/dress_2.jpg", description: "A soft sky-blue dress with a glowing finish.", sizes: ["XS", "S", "M", "L", "XL"] },
    { id: 5, name: "Ivory Wool Grace Set", category: "Dress", price: 11000, image: "images/dress_3.jpg", description: "An ivory wool ensemble crafted for timeless elegance.", sizes: ["XS", "S", "M", "L", "XL"] },
    { id: 6, name: "Ashwood Classic Ensemble", category: "Dress", price: 9500, image: "images/dress_4.jpg", description: "A classic ashwood-toned dress with a premium feel.", sizes: ["XS", "S", "M", "L", "XL"] },
    { id: 7, name: "Pearl Silhouette Skirt", category: "Skirt", price: 7500, image: "images/skirt_2.jpg", description: "A pearl-inspired skirt with a clean silhouette.", sizes: ["XS", "S", "M", "L", "XL"] },
    { id: 8, name: "Alabaster Muse Skirt", category: "Skirt", price: 7000, image: "images/skirt_3.jpg", description: "A minimalist alabaster skirt for everyday elegance.", sizes: ["XS", "S", "M", "L", "XL"] },
    { id: 9, name: "Noir Sovereign Coat Suit", category: "Suit", price: 12500, image: "images/suit_2.jpg", description: "A bold noir coat suit with sharp tailoring.", sizes: ["XS", "S", "M", "L", "XL"] },
    { id: 10, name: "Desert Bloom Suit", category: "Suit", price: 14000, image: "images/suit_3.jpg", description: "A desert-toned suit inspired by natural elegance.", sizes: ["XS", "S", "M", "L", "XL"] },
    { id: 11, name: "Linen Dune Suit", category: "Suit", price: 16500, image: "images/suit_4.jpg", description: "A breathable linen suit perfect for warm climates.", sizes: ["XS", "S", "M", "L", "XL"] },
    { id: 12, name: "Starlit Floré Dress", category: "Dress", price: 10000, image: "images/dress_5.png", description: "A floral-inspired dress with a starlit finish.", sizes: ["XS", "S", "M", "L", "XL"] }
];

function createCartItem(product, size) {
    return {
        id: product.id,
        name: product.name,
        price: product.price,
        imgSrc: product.image,
        size,
        qty: 1
    };
}

// ================== CORE INITIALIZATION ==================
document.addEventListener("DOMContentLoaded", () => {
    initLenis();
    
    // Check which page we are on
    if (document.getElementById("items-shop")) {
        initShop();
    }
    
    if (document.getElementById("product-name")) {
        initProductPage();
    }
});

// ================== LENIS SMOOTH SCROLL ==================
function initLenis() {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    function raf(t) {
        lenis.raf(t);

        // Parallax Effect: Move the track slightly based on scroll position
        const scrollY = window.scrollY;
        const track = document.querySelector('.checkout-track');
        if (track) {
            // This moves the track as you scroll down
            track.style.transform = `translateX(calc(-50% + ${scrollY * 0.5}px))`;
        }

        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

// ================== SHOP LOGIC ==================
function initShop() {
    const originalProducts = [...products];
    const shopContainer = document.getElementById("items-shop");
    const searchInput = document.getElementById("srch");
    const categoryButtons = document.querySelectorAll(".button-value");
    const sortLinks = document.querySelectorAll("[data-sort]");
    const sortBtn = document.querySelector(".sortBtn");
    const dropdown = document.querySelector(".dropdown");

    let currentProducts = [...products];

    function renderShop(list) {
        shopContainer.innerHTML = "";
        list.forEach(p => {
            const productHTML = `
              <a href="product.html?id=${p.id}" class="product-link">
                <div class="item-card">
                  <div class="item-image">
                    <img src="${p.image}" alt="${p.name}">
                  </div>
                  <h3 class="item-name">${p.name}</h3>
                  <p class="item-price">Rs.${p.price.toLocaleString()}</p>
                  <button class="add-cart" onclick="event.preventDefault(); event.stopPropagation(); addToCartDirectly(${p.id})">
                    <span>Add to Cart</span>
                  </button>
                </div>
              </a>
            `;
            shopContainer.insertAdjacentHTML('beforeend', productHTML);
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const q = e.target.value.toLowerCase();
            const filtered = products.filter(p => p.name.toLowerCase().includes(q));
            renderShop(filtered);
        });
    }

    categoryButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const cat = btn.textContent.trim();
            currentProducts = cat === "All" ? [...products] : products.filter(p => p.category === cat);
            renderShop(currentProducts);
        });
    });

    sortLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const type = link.dataset.sort;
            if (type === "default") currentProducts = [...originalProducts];
            if (type === "low") currentProducts = [...currentProducts].sort((a, b) => a.price - b.price);
            if (type === "high") currentProducts = [...currentProducts].sort((a, b) => b.price - a.price);
            renderShop(currentProducts);
            dropdown.classList.remove("show");
        });
    });

    if (sortBtn) {
        sortBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("show");
        });
    }

    renderShop(products);
}

// ================== PRODUCT PAGE LOGIC ==================
function initProductPage() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));
    const product = products.find(p => p.id === id);

    if (!product) {
        document.getElementById("product-name").textContent = "Product Not Found";
        return;
    }

    document.getElementById("product-img").src = product.image;
    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-description").textContent = product.description;
    document.getElementById("product-price").textContent = `Rs. ${product.price.toLocaleString()}`;

    const sizeSelect = document.getElementById("size-select");
    sizeSelect.innerHTML = product.sizes.map(s => `<option value="${s}">${s}</option>`).join("");

    document.getElementById("add-to-cart").addEventListener("click", (e) => {
        e.preventDefault();
        const size = sizeSelect.value;
        saveToCart(product, size);
        openCartPanel();
    });

    const modal = document.getElementById("size-guide-modal");
    document.getElementById("size-guide-btn").onclick = () => modal.style.display = "block";
    document.querySelector(".close-btn").onclick = () => modal.style.display = "none";
}

// ================== CART CORE FUNCTIONS ==================
function saveToCart(product, size) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(i => i.id === product.id && i.size === size);

    if (existing) {
        existing.qty++;
    } else {
        cart.push(createCartItem(product, size));
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    initCart(); // Refresh the list
}

function addToCartDirectly(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const defaultSize = product.sizes[0];
    saveToCart(product, defaultSize);
    openCartPanel();
}

function openCartPanel() {
    const cartPanel = document.querySelector(".cart-panel");
    if (cartPanel) {
        cartPanel.classList.add("active");
        // Prevents the background (Lenis) from scrolling while cart is open
        document.body.style.overflow = "hidden"; 
    }
}

// Handles UI updates and Event Listeners for the sidebar
function initCart() {
    const cartItemsEl = document.querySelector(".cart-items");
    const cartCountEl = document.querySelector(".cart-count");
    const cartTotalEl = document.querySelector(".cart-total");
    const checkoutBtn = document.querySelector(".checkout-btn");
    const emptyText = document.querySelector(".empty-cart");

    // Re-bind toggle listeners (for navbar.html fetch)
    const cartBtn = document.querySelector(".cart-btn");
    const cartPanel = document.querySelector(".cart-panel");
    const cartClose = document.querySelector(".cart-close");

    if (cartClose && !cartClose.dataset.listener) {
        cartClose.onclick = () => {
            cartPanel.classList.remove("active");
            document.body.style.overflow = ""; // Restores background scroll
        };
        cartClose.dataset.listener = "true";
    }

    if (cartBtn && !cartBtn.dataset.listener) {
        cartBtn.onclick = () => cartPanel.classList.add("active");
        cartBtn.dataset.listener = "true";
    }
    if (cartClose && !cartClose.dataset.listener) {
        cartClose.onclick = () => cartPanel.classList.remove("active");
        cartClose.dataset.listener = "true";
    }

    if (!cartItemsEl) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartItemsEl.innerHTML = "";
    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        if (emptyText) emptyText.style.display = "block";
        if (checkoutBtn) checkoutBtn.style.display = "none";
        if (cartTotalEl) cartTotalEl.textContent = "Total: Rs.0";
        if (cartCountEl) cartCountEl.textContent = "0";
        return;
    }

    if (emptyText) emptyText.style.display = "none";
    if (checkoutBtn) checkoutBtn.style.display = "block";

    cart.forEach((item, index) => {
        total += item.price * item.qty;
        count += item.qty;
        // Inside your cart.forEach loop in initCart()
        const li = document.createElement("li");
        li.className = "cart-item";
        li.innerHTML = `
            <img src="${item.imgSrc}" alt="${item.name}" style="width:70px; height: auto;">
            <div class="cart-item-details">
                <div class="cart-info-left">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-size">Size: ${item.size}</p>
                    <div class="qty-controls">
                        <button onclick="updateQuantity(${index}, -1)">−</button>
                        <span>${item.qty}</span>
                        <button onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <strong>Rs.${(item.price * item.qty).toLocaleString()}</strong>
                </div>
                
                <button class="remove-item-text" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
        cartItemsEl.appendChild(li);
    });

    if (cartTotalEl) cartTotalEl.textContent = `Total: Rs.${total.toLocaleString()}`;
    if (cartCountEl) cartCountEl.textContent = count;
}

function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    initCart();
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    initCart();
}

// Add this to your DOMContentLoaded listener or call it at the bottom of script.js
if (document.querySelector(".checkout-layout")) {
    initCheckoutPage();
}

function initCheckoutPage() {
    const checkoutItemsEl = document.querySelector(".checkout-items");
    const subtotalEl = document.querySelector(".subtotal-value");
    const totalEl = document.querySelector(".total-value");
    const shippingFee = 650; // As defined in your HTML

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        checkoutItemsEl.innerHTML = "<p>Your cart is empty.</p>";
        subtotalEl.textContent = "Rs. 0";
        totalEl.textContent = "Rs. 0";
        return;
    }

    let subtotal = 0;
    checkoutItemsEl.innerHTML = "";

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        const li = document.createElement("li");
        li.className = "checkout-item-row"; // Add styling for this in CSS
        li.innerHTML = `
            <div class="checkout-item-info">
                <div class="img-wrapper">
                    <img src="${item.imgSrc}" alt="${item.name}">
                    <span class="qty-badge">${item.qty}</span>
                </div>
                <div class="checkout-item-details">
                    <p class="name">${item.name}</p>
                    <p class="size">${item.size}</p>
                </div>
            </div>
            <span class="price">Rs. ${itemTotal.toLocaleString()}</span>
        `;
        checkoutItemsEl.appendChild(li);
    });

    const total = subtotal + shippingFee;

    subtotalEl.textContent = `Rs. ${subtotal.toLocaleString()}`;
    totalEl.textContent = `Rs. ${total.toLocaleString()}`;
}