# Mantserra Studio

Landing Mantserra berdasarkan Figma `C2rhn7BP2nXA0LyByRDn09`, frame induk `3915:352` dan hero `3915:353`. Seluruh enam bagian sudah dibangun: hero/header, experiences, artist feature, schedule, editorial updates, dan footer.

Stack mengikuti project Maka: HTML semantik, CSS BEM, JavaScript ES modules, Vite, GSAP/ScrollTrigger, dan Lenis. Swiper tetap tersedia sebagai dependency, tetapi tidak dimuat karena desain ini tidak memerlukan slider.

## Menjalankan

Node mengikuti Vite: `^20.19.0 || >=22.12.0`.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Gunakan URL Local yang ditampilkan Vite. Jika port 5173 terpakai, Vite dapat memilih port berikutnya. `dist/` merupakan hasil build, bukan source untuk diedit.

## Struktur

- `index.html`: markup, copy, anchor, dan dialog tiket.
- `style.css`: token, layout desktop, dan adaptasi responsif.
- `script.js`: bootstrap dan HMR cleanup.
- `js/core/`: lifecycle LandingPage, GSAP, konfigurasi fitur, dan adapter Lenis.
- `js/sections/`: filter experiences dan accordion schedule.
- `js/interactions/`: navigasi, dialog tiket, form kontak, dan motion reveal.
- `assets/`: foto/SVG asli Figma, font lokal, dan lisensi.
- `docs/`: analisis awal serta catatan implementasi dan verifikasi.

## Interaksi dan batas data

Header dan footer memakai anchor nyata. Menu mobile memiliki state buka/tutup, Escape, dan cleanup saat HMR. Schedule memakai elemen native details/summary dan satu panel terbuka. Headliner menjadi panel awal. Semua panel memakai tiga gambar persegi dan baris informasi yang mengikuti Figma node `3928:360`. Panel 1, 3, dan 4 memakai sembilan foto ilustratif yang dibuat dengan built-in image_gen; judul serta waktunya mengikuti data sumber, tanpa nama artis rekaan. Prompt dan daftar file ada di [docs/schedule-imagery.md](docs/schedule-imagery.md).

Filter kategori bekerja pada event yang tersedia. Figma hanya memberi kategori Experiences untuk Simmons Wellington; kategori genre lain menampilkan empty state sampai data event tersedia. Categories mengembalikan daftar lengkap. Indikator lingkaran di desain dipertahankan sebagai dekorasi, bukan tombol carousel tanpa data.

Get Tickets membuka detail konser asli. URL pemesanan belum diberikan sehingga tidak ada transaksi/pembelian. Form email memvalidasi format secara native dan memberi tahu bahwa pendaftaran belum dibuka; tidak mengirim atau menyimpan alamat email. Playlists dan Placements tetap teks karena destinasi belum diberikan. Tidak ada link artikel rekaan.

## Typography dan aset

Inter Variable, Inter Display, serta Instrument Serif dimuat lokal. Empat heading campuran Awesome Serif memakai export outline SVG dari node teks aslinya, dengan teks HTML tersembunyi secara visual untuk pembaca layar. File font Awesome Serif sendiri belum tersedia; ganti pendekatan outline dengan live text hanya setelah file font berlisensi tersedia. Wordmark footer adalah SVG asli.

Tidak ada URL aset Figma sementara pada runtime. Semua foto di bawah hero memakai lazy loading; aset PNG asli tetap beresolusi besar, termasuk hero sekitar 15 MB. Kompresi/format web modern belum dilakukan dan performa jaringan belum diprofilkan.

## Motion dan verifikasi

Lenis memakai ticker GSAP yang sama dengan ScrollTrigger. Reduced motion menggunakan scroll native dan menghilangkan reveal dekoratif. Semua konten utama tetap ada tanpa JavaScript; navigasi dan details/summary juga tetap tersedia.

Build produksi, sintaks JavaScript, referensi aset, dimensi/alt gambar, validitas SVG, ID unik, dan target anchor telah diperiksa. Preview Chrome desktop serta emulasi iPhone 393px diperiksa untuk komposisi dan interaksi menu, accordion, filter, dialog/Escape, serta status form. Belum mencakup pengujian semua browser, semua breakpoint, reduced-motion secara manual, audit performa, atau klaim pixel-perfect.

Detail sumber dan pemetaan: [docs/analysis.md](docs/analysis.md), [docs/implementation.md](docs/implementation.md), serta [assets/fonts/README.md](assets/fonts/README.md).
