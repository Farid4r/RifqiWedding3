# Assets

File publik disimpan di `public/` agar dapat diakses dengan URL stabil:

- `public/images/couple/` untuk foto bersama.
- `public/images/bride/` untuk foto Natashya.
- `public/images/groom/` untuk foto Rifqi.
- `public/images/loading/` untuk foto editorial jika slideshow disetujui nanti.
- `public/images/gallery/` untuk foto galeri.
- `public/music/` untuk musik undangan.
- `public/favicon/` untuk favicon proyek.

Gunakan aset asli yang sudah tersedia dan daftarkan path-nya di
`src/data/assets.js`. Foto, audio, dan favicon yang perlu disajikan langsung
dapat disimpan di direktori `public/` yang sesuai.

Video akad diputar dari URL Cloudinary yang dikonfigurasi di
`src/data/assets.js`. Salinan lokal sumber berukuran besar disimpan di
`src/assets/source/akad.mp4`, di luar direktori publik agar tidak ikut disalin
ke hasil build.

Slideshow loading memakai maksimal enam entri dari `invitationAssets.loading`.
Entri dapat berupa URL aset yang sudah ada atau objek berisi `src` dan opsional
`objectPosition` untuk mengatur titik fokus foto tanpa mendistorsi gambar.
