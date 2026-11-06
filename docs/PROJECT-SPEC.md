# Project Specification

## Tujuan

Membangun undangan digital pernikahan Rifqi & Natashya versi 2.0 yang elegan,
mudah dibuka dari ponsel, dan dapat dikembangkan bertahap dengan React.

## Konsep desain

- Elegant editorial wedding dengan nuansa minimalist luxury.
- Burgundy dan maroon sebagai warna utama; ivory, cream, dan champagne sebagai
  warna pendukung.
- Serif elegan untuk judul dan sans-serif modern untuk teks isi.
- Animasi halus dan moderat, dengan dukungan pengaturan reduced motion.
- Mobile-first dan responsif.

## User journey

Undangan digital hanya mengajak tamu ke resepsi. Akad nikah telah dilaksanakan
dan dicatat sebagai riwayat, bukan acara mendatang.

1. Tamu membuka tautan undangan.
2. Tamu membaca informasi resepsi dan detail yang diberikan pasangan.
3. Tamu dapat mengikuti tautan atau tindakan yang benar-benar disediakan setelah
   kebutuhan dan implementasinya disepakati.

Jadwal resepsi utama: Ahad, 20 Desember 2026, pukul 10.00 WIB sampai selesai,
zona waktu `Asia/Jakarta`. Lokasi: Jl. Raya Cipanas No.53B, Sindangmulya, Kec.
Maja, Kabupaten Lebak, Banten 42381.

Riwayat akad: 16 Januari 2026, status selesai. Tanggal ini tidak boleh dipakai
sebagai countdown atau agenda yang akan berlangsung.

## Fitur yang direncanakan

- Data pasangan, jadwal resepsi, lokasi, dan section dipusatkan di
  `src/data/invitation.js`.
- File aset yang tersedia dicatat di `src/data/assets.js`.
- Utility nama tamu membaca parameter URL `to` dan menampilkan nilai teks biasa.
- Utility countdown memakai waktu resepsi dan timezone `Asia/Jakarta`.
- Tampilan undangan, aksi RSVP, peta, galeri, musik, dan hadiah belum dibuat.

Tidak ada backend, RSVP, peta, buku tamu, musik, atau data pengantin yang dibuat
pada fase fondasi data ini.

## Identitas dan sumber data

- Wanita: Natashya Zahra N, S.A.B. (Natashya).
- Pria: M. Rifqi Subakti, S.Ars. (Rifqi).
- Perbarui nama dan orang tua hanya pada objek `couple` di `src/data/invitation.js`.
- Perbarui tanggal, waktu, atau timezone hanya di `wedding.reception` pada file
  yang sama. Field akad berstatus `completed` dan tetap terpisah.
- Perbarui alamat, nama tempat, atau tautan peta di objek `location`.
- Detail orang tua, nama tempat, Google Maps URL, foto, musik, RSVP, dan hadiah
  menunggu informasi dari pemilik proyek; field yang belum tersedia `null` atau
  array kosong.

## Asset

Foto pasangan, Natashya, Rifqi, slideshow editorial, galeri, dan musik belum
tersedia di folder proyek. Simpan file di kelompok `public/images/couple/`,
`public/images/bride/`, `public/images/groom/`, `public/images/loading/`,
`public/images/gallery/`, dan `public/music/`, lalu daftarkan file aktual melalui
`src/data/assets.js`. Gunakan WebP untuk foto dan MP3 terkompresi untuk musik.
Favicon SVG yang tersedia ada di `public/favicon/favicon.svg`.

## Informasi lanjutan yang dibutuhkan

- Nama orang tua dan nama venue jika ingin ditampilkan.
- Tautan Google Maps yang terverifikasi.
- Foto pilihan pasangan dan keputusan musik.
- Keputusan apakah RSVP atau hadiah digital dibutuhkan serta mekanismenya.
