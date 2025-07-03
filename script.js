document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("produk-container");

  fetch("https://rifkira.psl17.my.id/api/produk")
    .then(res => res.json())
    .then(data => {
      data.data.forEach(produk => {
        const card = document.createElement("div");
        card.className = "produk-card";

        // Format harga
        const hargaFormat = Number(produk.harga).toLocaleString("id-ID");

        // Nomor WA Sumaryo (ganti sesuai kebutuhan)
        const noWA = "6281234567890";

        // Format pesan WhatsApp
        const pesan = `Halo kak, saya mau beli produk *${produk.nama}* dengan harga Rp ${hargaFormat}`;
        const linkWA = `https://wa.me/${noWA}?text=${encodeURIComponent(pesan)}`;

        card.innerHTML = `
          <img src="${produk.foto}" alt="${produk.nama}" />
          <div class="info">
            <h3>${produk.nama}</h3>
            <p>Rp ${hargaFormat}</p>
            <a href="${linkWA}" target="_blank">Beli Sekarang</a>
          </div>
        `;

        container.appendChild(card);
      });
    })
    .catch(error => {
      container.innerHTML = `<p style="color: red;">Gagal memuat produk.</p>`;
      console.error("Error:", error);
    });
});
