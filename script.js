document.addEventListener('DOMContentLoaded', () => {
  const produkPopulerContainer = document.getElementById('produk-populer');
  const produkSemuaContainer = document.getElementById('produk-semua');

  const nomorWA = "6281234567890"; // Ganti dengan nomor WA penjual

  function buatCardProduk(produk) {
    const hargaFormat = Number(produk.price).toLocaleString('id-ID');
    const pesanWA = `Halo kak, saya mau beli produk *${produk.name}* dengan harga Rp ${hargaFormat}.`;
    const linkWA = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesanWA)}`;

    const card = document.createElement('div');
    card.classList.add('produk-card');

    // Jika produk.image_url cuma nama file, tambahkan base URL gambar
    // Contoh base URL: https://fatimaazhr.psl17.my.id/uploads/produk/
    // Kalau API sudah kasih full URL, tinggal pakai langsung
    const baseUrlGambar = "https://fatimaazhr.psl17.my.id/uploads/produk/";
    const srcGambar = produk.image_url.startsWith('http') ? produk.image_url : baseUrlGambar + produk.image_url;

    card.innerHTML = `
      <img src="${srcGambar}" alt="${produk.name}" />
      <div class="produk-info">
        <h3>${produk.name}</h3>
        <p>Rp ${hargaFormat}</p>
        <a href="${linkWA}" target="_blank" rel="noopener">Beli Lewat WhatsApp</a>
      </div>
    `;

    return card;
  }

  // Fetch produk populer
  fetch("https://fatimaazhr.psl17.my.id/api/products/popular/all")
    .then(res => res.json())
    .then(data => {
      if(data.data && data.data.length > 0){
        data.data.forEach(produk => {
          produkPopulerContainer.appendChild(buatCardProduk(produk));
        });
      } else {
        produkPopulerContainer.innerHTML = "<p>Tidak ada produk populer.</p>";
      }
    })
    .catch(err => {
      produkPopulerContainer.innerHTML = "<p style='color:#f66;'>Gagal memuat produk populer.</p>";
      console.error(err);
    });

  // Fetch semua produk biasa
  fetch("https://fatimaazhr.psl17.my.id/api/products")
    .then(res => res.json())
    .then(data => {
      if(data.data && data.data.length > 0){
        data.data.forEach(produk => {
          produkSemuaContainer.appendChild(buatCardProduk(produk));
        });
      } else {
        produkSemuaContainer.innerHTML = "<p>Tidak ada produk.</p>";
      }
    })
    .catch(err => {
      produkSemuaContainer.innerHTML = "<p style='color:#f66;'>Gagal memuat produk.</p>";
      console.error(err);
    });
});
