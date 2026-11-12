# Perbaikan blur lokal dan produksi

12 November 2026. Sumber pembanding: Figma hero `3915:353`, artist feature `3915:425`, glass CTA `3915:420`, screenshot pengguna, serta stylesheet yang diambil dari https://mantserra-studio.vercel.app/.

## Penyebab yang dikonfirmasi

Stylesheet Vercel `assets/index-BgUWXc6_.css` berisi `.ticket__window` dengan `-webkit-backdrop-filter:blur(12px)` saja. Deklarasi standar `backdrop-filter` tidak ada. Di source lama, properti standar ditulis sebelum alias WebKit; hasil minifikasi mempertahankan hanya alias terakhir. Source development masih memuat keduanya sehingga tampilan development dan produksi berbeda.

Masalah visual terpisah: lapisan kaca berada di bawah SVG putih tiket. Akibatnya foto berhenti pada batas lubang SVG dengan garis potong keras. Susunan Figma menempatkan rectangle kaca 365 × 378px di atas boolean putih 413 × 575px, sehingga frost juga menyampel area putih di bawah lubang dan menciptakan transisi halus.

## Perubahan

- Semua surface CSS dengan backdrop blur memakai urutan `-webkit-backdrop-filter` lalu `backdrop-filter` agar kedua deklarasi bertahan pada build.
- SVG tiket berada pada z-index 0, kaca pada 1, dan waktu/teks/ikon pada 2. SVG asli tidak diubah; transisi putih berasal dari blur terhadap lapisan putih di belakangnya.
- Kekuatan frost tiket dan CTA disesuaikan menjadi blur CSS 16.5px dengan membandingkan referensi. Figma menggunakan efek GLASS dengan frost radius 33; implementasi CSS ini mengikuti tampilan frost/fade, bukan implementasi penuh shader refraksi Figma.
- Hero mempertahankan tint putih 10%; tiket artist memakai fill transparan sesuai properti Figma. Backdrop dialog mempertahankan blur 6px.
- `npm run build` sekarang menjalankan `scripts/check-production-css.mjs` setelah Vite. Pemeriksaan memastikan ketiga surface tetap memiliki deklarasi standar dan WebKit pada CSS hasil minifikasi.

## Verifikasi

- Pemeriksaan regresi sengaja dijalankan terhadap CSS rusak yang diambil dari Vercel: gagal dengan pesan deklarasi standar hilang, sesuai harapan.
- CSS build baru lolos pemeriksaan untuk tiket, CTA experiences, dan backdrop dialog.
- Hasil build minifikasi dijalankan melalui Vite preview dan diperiksa langsung di Chrome desktop: blur hero aktif dan memudar ke putih; tiket artist juga memperlihatkan frost dan fade. Teks di atas kaca tetap tajam.
- Build produksi dan `git diff --check` berhasil. Pengujian Safari/Firefox dan setiap breakpoint belum dilakukan.

Perubahan belum di-push atau di-deploy ke Vercel pada tahap ini. Deployment lama tetap memakai CSS lama sampai source baru diterbitkan.
