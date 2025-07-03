document.addEventListener('DOMContentLoaded', () => {
  const produkPopulerContainer = document.getElementById('produk-populer');
  const produkSemuaContainer = document.getElementById('produk-semua');

  const nomorWA = "6281234567890"; // Ganti nomor WhatsApp kamu
  const baseUrlGambar = "https://fatimaazhr.psl17.my.id/uploads/produk/";

  // Fungsi bikin kartu produk
  function buatCardProduk(produk) {
    const hargaFormat = Number(produk.price).toLocaleString('id-ID');
    const pesanWA = `Halo kak, saya mau beli produk *${produk.name}* dengan harga Rp ${hargaFormat}.`;
    const linkWA = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesanWA)}`;

    const card = document.createElement('div');
    card.classList.add('produk-card');

    card.innerHTML = `
      <img src="${baseUrlGambar + produk.photo}" alt="${produk.name}" />
      <div class="produk-info">
        <h3>${produk.name}</h3>
        <p>Rp ${hargaFormat}</p>
        <a href="${linkWA}" target="_blank" rel="noopener">Beli Lewat WhatsApp</a>
      </div>
    `;

    return card;
  }

  // Fetch semua produk
  fetch("https://fatimaazhr.psl17.my.id/api/products")
    .then(res => res.json())
    .then(data => {
      // data adalah array produk langsung
      if (!Array.isArray(data) || data.length === 0) {
        produkSemuaContainer.innerHTML = "<p>Tidak ada produk.</p>";
        produkPopulerContainer.innerHTML = "<p>Tidak ada produk populer.</p>";
        return;
      }

      // Pisah produk populer & biasa
      const populer = data.filter(p => p.is_popular === 1);
      const biasa = data.filter(p => p.is_popular === 0);

      // Render produk populer
      if (populer.length > 0) {
        populer.forEach(p => produkPopulerContainer.appendChild(buatCardProduk(p)));
      } else {
        produkPopulerContainer.innerHTML = "<p>Tidak ada produk populer.</p>";
      }

      // Render produk biasa
      if (biasa.length > 0) {
        biasa.forEach(p => produkSemuaContainer.appendChild(buatCardProduk(p)));
      } else {
        produkSemuaContainer.innerHTML = "<p>Tidak ada produk.</p>";
      }
    })
    .catch(err => {
      produkSemuaContainer.innerHTML = "<p style='color:#f66;'>Gagal memuat produk.</p>";
      produkPopulerContainer.innerHTML = "<p style='color:#f66;'>Gagal memuat produk populer.</p>";
      console.error("Error fetch produk:", err);
    });
});

