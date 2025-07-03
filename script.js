document.addEventListener('DOMContentLoaded', () => {
  const produkContainer = document.getElementById('produk-container');
  const searchInput = document.getElementById('search');

  // Nomor WhatsApp penjual (ganti dengan nomor asli, tanpa +)
  const nomorWA = "085810475301";

  let produkList = [];

  function renderProduk(filter = "") {
    produkContainer.innerHTML = "";
    const filtered = produkList.filter(p =>
      p.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (filtered.length === 0) {
      produkContainer.innerHTML = "<p>Tidak ada produk yang cocok.</p>";
      return;
    }

    filtered.forEach(produk => {
      const hargaFormat = Number(produk.price).toLocaleString('id-ID');
      const pesanWA = `Halo kak, saya mau beli produk *${produk.name}* dengan harga Rp ${hargaFormat}.`;
      const linkWA = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesanWA)}`;

      const card = document.createElement('div');
      card.classList.add('produk-card');

      card.innerHTML = `
        <img src="${produk.image_url}" alt="${produk.name}" />
        <div class="produk-info">
          <h3>${produk.name}</h3>
          <p>Rp ${hargaFormat}</p>
          <a href="${linkWA}" target="_blank" rel="noopener">Beli Lewat WhatsApp</a>
        </div>
      `;
      produkContainer.appendChild(card);
    });
  }

  fetch("https://rifkira.psl17.my.id/api/products")
    .then(res => res.json())
    .then(data => {
      produkList = data.data || [];
      renderProduk();
    })
    .catch(err => {
      produkContainer.innerHTML = '<p style="color:#f66;">Gagal memuat produk. Coba lagi nanti.</p>';
      console.error("Error fetch produk:", err);
    });

  searchInput.addEventListener('input', () => {
    renderProduk(searchInput.value);
  });
});
