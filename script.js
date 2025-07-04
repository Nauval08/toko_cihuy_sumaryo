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
    document.getElementById("products").innerHTML = "<p class='text-danger'>Waduh... Gagal muat produk 😢 Coba refresh dulu deh.</p>";
  }
}

function renderProducts(products) {
  const container = document.getElementById('products');
  let html = '<div class="row g-4">';

  products.forEach(product => {
    html += `
      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
          <img src="${product.gambar}" class="card-img-top" alt="${product.nama_produk}" style="height:250px; object-fit:cover;">
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <h5 class="card-title">${product.nama_produk}</h5>
              <p class="card-text fw-bold text-primary">Rp ${formatRupiah(product.harga)}</p>
            </div><br>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary w-100" onclick="buyNow(${product.id})">Langsung Gas 💥</button>
              <button class="btn btn-primary w-100" onclick="addToCart(${product.id})">Masukin Dulu 🛒</button>
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
    container.innerHTML = "<p>Belum ada isinya, gengs. Jangan cuma liatin doang 😆</p>";
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
      <span>Total Semua:</span>
      <span>${formatRupiah(total)}</span>
    </div>
  `;

  let waText = "Halo Cihuy Sumaryo 👋, ane mau checkout nih:%0A";
  cart.forEach(item => {
    waText += `- ${item.nama_produk} x${item.qty} (Total: ${formatRupiah(item.harga * item.qty)})%0A`;
  });
  waText += `%0ATotal belanja: ${formatRupiah(total)}%0AGaskeun, kirim ke alamat biasa ya 😎`;

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

  const waText = `Bang Cihuy! Gue mau beli ini langsung:%0A- ${product.nama_produk} x1 (Harga: ${formatRupiah(product.harga)})`;
  const waLink = `https://wa.me/6285810475301?text=${waText}`;
  window.open(waLink, "_blank");
}

fetchProducts();
updateCartUI();
