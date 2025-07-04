// ✅ WA: 6285810475301
// ✅ Sidebar Kategori <ul><li>
// ✅ Produk tampil di <section id="products">
// ✅ Keranjang tampil di <div id="cartItems">

const apiURL = 'https://crud-api-production-1baf.up.railway.app/api/products';
let allProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(angka);
}

async function fetchProducts() {
  try {
    const res = await fetch(apiURL);
    const data = await res.json();
    allProducts = Array.isArray(data) ? data : [];
    renderProducts(allProducts);
  } catch (err) {
    document.getElementById("products").innerHTML = `
      <p style="color: red; font-weight:bold;">
        Gagal nyambung ka server 😢 Mangga cobian deui engke.
      </p>`;
  }
}

function renderProducts(products) {
  const container = document.getElementById('products');
  if (products.length === 0) {
    container.innerHTML = "<p>Hese teangan produkna 😕</p>";
    return;
  }

  let html = '';

  products.forEach(product => {
    html += `
      <div class="card">
        <img src="${product.gambar}" alt="${product.nama_produk}">
        <h4>${product.nama_produk}</h4>
        <p>${formatRupiah(product.harga)}</p>
        <div class="btns">
          <button class="buy" onclick="buyNow(${product.id})">Beli Geura 🛍️</button>
          <button class="cart" onclick="addToCart(${product.id})">+ Keranjang</button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Kategori filter
document.getElementById("categoryFilter").addEventListener("click", e => {
  if (e.target.tagName === "LI") {
    // aktifkan tombol yang diklik
    document.querySelectorAll("#categoryFilter li").forEach(li => li.classList.remove("active"));
    e.target.classList.add("active");

    const category = e.target.dataset.category;
    const filtered = category === "All"
      ? allProducts
      : allProducts.filter(p => (p.kategori || '').toLowerCase() === category.toLowerCase());

    renderProducts(filtered);
  }
});

function addToCart(productId) {
  const product = allProducts.find(p => p.id === productId);
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  saveCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
  const container = document.getElementById("cartItems");

  if (cart.length === 0) {
    container.innerHTML = "<p>Keranjang kosong euy 😅</p>";
    document.getElementById("checkoutBtn").onclick = null;
    return;
  }

  container.innerHTML = "";
  cart.forEach(item => {
    container.innerHTML += `
      <div class="d-flex justify-content-between mb-1">
        <span>${item.nama_produk} (x${item.qty})</span>
        <span>${formatRupiah(item.harga * item.qty)}</span>
      </div>`;
  });

  const total = cart.reduce((sum, item) => sum + item.harga * item.qty, 0);
  container.innerHTML += `<hr><strong>Total: ${formatRupiah(total)}</strong>`;

  let waText = "Mang Cihuy, abdi bade meser:%0A";
  cart.forEach(item => {
    waText += `- ${item.nama_produk} x${item.qty} (${formatRupiah(item.harga * item.qty)})%0A`;
  });
  waText += `%0ATotal: ${formatRupiah(total)}%0AKirim ka bumi atuh 😁`;

  document.getElementById("checkoutBtn").onclick = () => {
    window.open(`https://wa.me/6285810475301?text=${waText}`, "_blank");
    cart = [];
    saveCart();
    updateCartUI();
  };
}

function buyNow(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  const waText = `Mang Cihuy! Abdi hoyong meser langsung:%0A- ${product.nama_produk} (${formatRupiah(product.harga)})`;
  const waLink = `https://wa.me/6285810475301?text=${waText}`;
  window.open(waLink, "_blank");
}

// Load pertama
fetchProducts();
updateCartUI();
