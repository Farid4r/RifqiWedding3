# Design System

Token awal berada di `src/styles/tokens.css` dan diekspos ke utility Tailwind
CSS 4 melalui `@theme inline`. Komponen visual undangan belum dibuat.

## Palet warna

| Token | Nilai | Penggunaan awal |
| --- | --- | --- |
| Burgundy | `#641F32` | Warna utama dan teks berkontras tinggi |
| Maroon | `#8A394B` | Aksen utama |
| Ivory | `#F5EFE8` | Latar utama |
| Cream | `#FBF8F3` | Permukaan pendukung |
| Champagne | `#D6BD9B` | Aksen dekoratif terbatas |
| Ink muted | `#6F6260` | Teks sekunder |
| Border | `#E6DBD0` | Garis pemisah lembut |

Periksa kontras teks pada kombinasi warna sebelum menerapkannya ke komponen.

## Typography

- Display: Playfair Display, dengan fallback Georgia/serif.
- Body: DM Sans, dengan fallback Arial/sans-serif.
- Skala tersedia dari `--type-xs` sampai ukuran responsif `--type-5xl`.
- Judul memakai serif untuk karakter editorial; sans-serif menjaga teks isi
  tetap mudah dibaca.

Font web dimuat dari Google Fonts. Fallback lokal tetap disediakan bila font
eksternal tidak tersedia.

## Spacing

- Skala dasar `--space-unit` adalah 4px. Gunakan kelipatan skala Tailwind agar
  jarak konsisten dan responsif.
- Lebar konten: `--container-reading` 38rem, `--container-content` 72rem, dan
  `--container-wide` 80rem.

## Breakpoints

Tailwind: `sm` 40rem, `md` 48rem, `lg` 64rem, dan `xl` 80rem. Mulai dari tata
letak ponsel, lalu tambah ruang saat viewport membesar.

## Component guidelines

- Gunakan elemen HTML semantik dan kontrol native untuk interaksi.
- Saat tombol dibutuhkan, sediakan variant primary, secondary, dan text dengan
  fokus yang terlihat, keadaan disabled, serta target sentuh yang memadai.
- Hindari aksi visual tanpa fungsi nyata; jangan menambahkan kontrol placeholder.
- Gunakan token warna, radius, tipografi, dan container daripada nilai acak.

## Motion guidelines

- Gunakan Framer Motion untuk transisi yang punya tujuan interaksi atau hierarki.
- Token durasi awal: 150ms, 250ms, dan 400ms dengan easing standard.
- Hindari gerak dekoratif yang terus berulang; hormati preferensi reduced motion.
- `MotionConfig` global memakai `reducedMotion="user"`.
