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
    allProducts = data;
    renderProducts(data);
  } catch (err) {
    document.getElementById("products").innerHTML = "<p class='text-danger'>Aduh euy... Gagal nyambung ka server, cobian deui nya 😢</p>";
  }
}

function renderProducts(products) {
  const container = document.getElementById('products');
  let html = '<div class="row g-4">';

  products.forEach(product => {
    html += `
      <div class="col-md-4">
        <div class="card h-100 shadow-lg border border-warning-subtle">
          <img src="${product.gambar}" class="card-img-top" alt="${product.nama_produk}" style="height:250px; object-fit:cover;">
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <h5 class="card-title fw-semibold text-dark">${product.nama_produk}</h5>
              <p class="card-text fw-bold text-warning">Harga: ${formatRupiah(product.harga)}</p>
            </div><br>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-warning w-100 fw-bold" onclick="buyNow(${product.id})">Beli Geura 🛍️</button>
              <button class="btn btn-warning w-100 fw-bold text-white" onclick="addToCart(${product.id})">Sok Tambahkeun 🧺</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}

document.getElementById("categoryFilter").addEventListener("click", e => {
  if (e.target.tagName === "BUTTON") {
    document.querySelectorAll("#categoryFilter .btn").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    const category = e.target.dataset.category;
    const filtered = category === "All" || category === "Semua Aja"
      ? allProducts
      : allProducts.filter(p => p.kategori === category);
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
  document.getElementById("cartCount").textContent = cart.length;

  const container = document.getElementById("cartItems");
  if (cart.length === 0) {
    container.innerHTML = "<p>Keranjang masih kosong, atuh euy 😅</p>";
    document.getElementById("checkoutBtn").href = "#";
    return;
  }

  container.innerHTML = "";
  cart.forEach(item => {
    container.innerHTML += `
      <div class="d-flex justify-content-between mb-2">
        <span>${item.nama_produk} (x${item.qty})</span>
        <span>${formatRupiah(item.harga * item.qty)}</span>
      </div>`;
  });

  const total = cart.reduce((sum, item) => sum + item.harga * item.qty, 0);
  container.innerHTML += `
    <hr>
    <div class="d-flex justify-content-between fw-bold">
      <span>Totalna:</span>
      <span>${formatRupiah(total)}</span>
    </div>
  `;

  let waText = "Mang Cihuy, abdi bade meser ieu barang:%0A";
  cart.forEach(item => {
    waText += `- ${item.nama_produk} x${item.qty} (${formatRupiah(item.harga * item.qty)})%0A`;
  });
  waText += `%0ATotal: ${formatRupiah(total)}%0AKirim ka bumi atuh, sok ah 😁`;

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

  const waText = `Mang Cihuy! Abdi hoyong meser langsung:%0A- ${product.nama_produk} (Harga: ${formatRupiah(product.harga)})`;
  const waLink = `https://wa.me/6285810475301?text=${waText}`;
  window.open(waLink, "_blank");
}

fetchProducts();
updateCartUI();
