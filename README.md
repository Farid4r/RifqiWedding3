# Rifki & Natasha Wedding Invitation

Fondasi website undangan digital Rifki & Natasha versi 2.0. Proyek ini dimulai
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

## Informasi yang masih dibutuhkan

Data acara seperti nama lengkap pasangan, tanggal, lokasi, jadwal, tautan maps,
dan detail keluarga belum diberikan. Data tersebut sengaja belum dibuat atau
diisi dengan contoh fiktif.
