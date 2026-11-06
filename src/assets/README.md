# Assets

File publik disimpan di `public/` agar dapat diakses dengan URL stabil:

- `public/images/couple/` untuk foto bersama.
- `public/images/bride/` untuk foto Natashya.
- `public/images/groom/` untuk foto Rifqi.
- `public/images/loading/` untuk foto editorial jika slideshow disetujui nanti.
- `public/images/gallery/` untuk foto galeri.
- `public/music/` untuk musik undangan.
- `public/favicon/` untuk favicon proyek.

Foto pasangan belum disalin ke proyek. Gunakan WebP yang dioptimalkan untuk
foto, pola nama seperti `couple-01.webp`, `bride-01.webp`, `groom-01.webp`,
`loading-01.webp`, dan `gallery-01.webp`, lalu daftarkan aset yang tersedia di
`src/data/assets.js`. Simpan audio dalam MP3 yang terkompresi, dengan pola nama
`invitation-theme.mp3`; daftarkan path setelah file benar-benar tersedia.

Slideshow loading memakai maksimal enam entri dari `invitationAssets.loading`.
Entri dapat berupa URL aset yang sudah ada atau objek berisi `src` dan opsional
`objectPosition` untuk mengatur titik fokus foto tanpa mendistorsi gambar.

Direktori gambar dan musik saat ini hanya berisi `.gitkeep`. Favicon SVG yang
sudah ada ditempatkan di `public/favicon/favicon.svg`.
