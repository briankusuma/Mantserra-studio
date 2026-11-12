# Mantserra — Instruksi proyek

Baca `/Users/macbook-oww/.codex/RTK.md` jika tersedia.

## Scope

Landing berdasarkan Figma `C2rhn7BP2nXA0LyByRDn09`, node `3915:352`, dengan hero `3915:353`. Pengguna sudah mengizinkan implementasi seluruh landing. Enam section tersedia; pertahankan stack dan struktur yang mengikuti Maka.

## Konvensi

- HTML semantik, CSS BEM, JavaScript ES modules, Vite. Hook JavaScript memakai `data-*`.
- Root entry: `index.html`, `style.css`, `script.js`; modul pada `js/`, aset lokal pada `assets/`.
- Dua spasi, format source mudah dibaca. Jangan mengedit `dist/`.
- Class untuk resource/lifecycle; fungsi `init…(root, services)` untuk fitur dengan cleanup. Root yang tidak ditemukan harus aman.
- Satu ticker GSAP untuk Lenis, konversi detik ke milidetik; tanpa loop RAF tambahan.
- Tween dimiliki context/matchMedia. Bersihkan listener, observer, ticker dan callback async saat HMR/destroy. Jangan kill resource global milik modul lain.
- Konten tetap terbaca tanpa JavaScript. Reduced motion memakai state statis dan scroll native.
- Swiper hanya diimpor ketika kebutuhan slider terbukti; jangan mengubah grid menjadi carousel otomatis.
- Bangun dan verifikasi layout statis sebelum motion. Jangan menyalin layout, font, aset, preloader, cursor atau efek spesifik Maka.
- Sebelum implementasi visual, baca skill Figma design-to-code dan ambil konteks detail per section serta screenshot. Unduh aset asli secara lokal sesuai instruksi Figma.
- Mobile belum diberikan pada node target; dokumentasikan adaptasi responsif dan jangan mengklaim fidelity mobile terhadap frame yang belum diperiksa.
- Jangan mengarang tujuan tiket, endpoint email, tautan artikel, atau status pengiriman sukses.

Detail temuan dan pemetaan ada di `docs/analysis.md`.
