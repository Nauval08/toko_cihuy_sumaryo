document.addEventListener('DOMContentLoaded', () => {
  const produkContainer = document.getElementById('produk-container');

  // Ganti ini dengan nomor WA penjual (pakai format internasional tanpa +)
  const nomorWA = "6281234567890";

  fetch("https://rifkira.psl17.my.id/api/products")
    .then(response => response.json())
    .then(data => {
      if (!data.data || data.data.length === 0) {
        produkContainer.innerHTML = "<p>Produk tidak tersedia.</p>";
        return;
      }

      data.data.forEach(produk => {
        const hargaFormat = Number(produk.price).toLocaleString('id-ID');

        // Buat pesan WA otomatis
        const pesanWA = `Halo kak, saya mau beli produk *${produk.name}* dengan harga Rp ${hargaFormat}.`;

        const linkWA = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesanWA)}`;

        // Buat kartu produk
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
    })
    .catch(err => {
      produkContainer.innerHTML = '<p style="color: #f66;">Gagal memuat produk. Coba lagi nanti.</p>';
      console.error("Error fetch produk:", err);
    });
});
