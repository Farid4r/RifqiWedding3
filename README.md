# Rifqi & Natashya Wedding Invitation

Fondasi website undangan digital Rifqi & Natashya versi 2.0. Proyek ini dimulai
dari struktur baru dan saat ini hanya berisi kerangka aplikasi serta design
system awal.

## Teknologi

- React 19.3.1 dengan JavaScript dan JSX
- Vite 7.3.7
- Tailwind CSS 4.3.4 melalui plugin resmi Vite
- Framer Motion 14.9.1 untuk fondasi animasi React
- Lucide React 1.69.0 untuk ikon
- Git untuk version control
- Vercel sebagai target deployment

Versi dependency dikunci secara tepat di `package.json` dan `package-lock.json`.
Node.js 20.19 atau lebih baru diperlukan oleh Vite; versi lokal proyek adalah
Node.js 24.14.1.

Vite 7 dipasangkan dengan plugin React 5. Vite 8.3.6 sempat dicoba, tetapi
Rolldown native binding-nya gagal dimuat di Windows pada workspace ini; Vite 7
lulus production build lokal.

## Instalasi

```bash
npm ci
```

## Development server

```bash
npm run dev
```

Vite menampilkan alamat lokal di terminal, biasanya `http://localhost:5173`.

## Pemeriksaan dependency

```bash
npm run check:deps
```

## Production build

```bash
npm run build
```

Hasil build disimpan di `dist/`. Untuk melihat hasil build secara lokal:

```bash
npm run preview
```

Vercel dapat mendeteksi Vite secara otomatis dan menjalankan `npm run build`
dengan folder output `dist`. Belum ada deployment yang dilakukan.

## Struktur kode

`src/` memisahkan komponen, layout, section halaman, hooks, data, utilitas,
styles, dan aset. Isi folder yang belum dipakai dijelaskan melalui README lokal
agar kerangka awal tidak memuat abstraksi atau fitur kosong.

## Data undangan

Informasi resmi tersimpan di [src/data/invitation.js](src/data/invitation.js):

- Pengantin wanita: Natashya Zahra N, S.A.B. (Natashya).
- Pengantin pria: M. Rifqi Subakti, S.Ars. (Rifqi).
- Akad telah selesai pada 16 Januari 2026 dan hanya disimpan sebagai riwayat.
- Undangan ini hanya untuk Resepsi Pernikahan pada Ahad, 20 Desember 2026,
  pukul 10.00 WIB sampai selesai, zona waktu `Asia/Jakarta`.
- Lokasi: Jl. Raya Cipanas No.53B, Sindangmulya, Kec. Maja, Kabupaten Lebak,
  Banten 42381.

Jangan gunakan tanggal akad sebagai agenda undangan atau target countdown.

### Mengubah data

- Ubah nama pasangan atau nama orang tua di `couple`. Nama orang tua saat ini
  `null` karena belum diberikan.
- Ubah tanggal, waktu, atau zona waktu resepsi di `wedding.reception`.
- Ubah nama venue, alamat, atau Google Maps URL di `location`. Nama tempat dan
  URL maps tetap `null` sampai tersedia.
- Cerita, galeri, musik, RSVP, dan hadiah tersimpan di `sections`; nilai kosong
  menunjukkan belum ada konten atau integrasi yang disiapkan.

### Foto dan musik

Letakkan foto di direktori `public/images/couple/`, `bride/`, `groom/`,
`loading/`, atau `gallery/` sesuai kelompoknya. Gunakan WebP teroptimasi dan pola
nama seperti `couple-01.webp`, `bride-01.webp`, `groom-01.webp`, `loading-01.webp`,
dan `gallery-01.webp`. Pola ini adalah rekomendasi, bukan file yang sudah ada.
Daftarkan hanya file yang benar-benar ditambahkan di `src/data/assets.js`.

Letakkan audio MP3 terkompresi di `public/music/`, lalu isi `sections.music`
dan `invitationAssets.music` setelah file dan kebutuhan pemutaran ditentukan.
Favicon proyek berada di `public/favicon/favicon.svg`.

### Google Maps

Isi `location.googleMapsUrl` hanya setelah tautan lokasi yang benar tersedia.
Belum ada alamat koordinat atau URL Google Maps yang dibuat dari alamat teks.

### Menguji nama tamu

Buka URL development seperti `http://localhost:5173/?to=John%20Doe`. Untuk
memeriksa hasil utility di console browser:

```js
const { getGuestName } = await import('/src/utils/guestName.js')
getGuestName(window.location.search)
```

Hasil kosong atau parameter yang tidak valid menghasilkan `Tamu Undangan`.
Utility ini belum ditampilkan di UI karena cover belum dibuat.

### Menguji countdown resepsi

Utility mengambil tanggal dari `wedding.reception`, mengubah waktu lokal
`Asia/Jakarta` ke timestamp, dan menerima waktu saat ini agar hasilnya dapat
diuji deterministik:

```bash
node --input-type=module -e "import { getReceptionCountdown, getReceptionTimestamp } from './src/utils/countdown.js'; console.log(new Date(getReceptionTimestamp()).toISOString()); console.log(getReceptionCountdown(Date.parse('2026-12-20T02:59:59.000Z')))"
```

Timestamp target yang diharapkan adalah `2026-12-20T03:00:00.000Z`.
