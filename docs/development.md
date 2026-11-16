# Panduan Pengembangan Mantserra

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

`npm run build` juga memeriksa agar properti blur standar dan WebKit tetap ada pada CSS hasil minifikasi. Penjelasan regresi lokal/Vercel: [docs/blur-fix.md](blur-fix.md).

Gunakan URL Local yang ditampilkan Vite. Jika port 5173 terpakai, Vite dapat memilih port berikutnya. `dist/` merupakan hasil build, bukan source untuk diedit.

## Struktur

- `index.html`: markup, copy, anchor, dan dialog tiket.
- `style.css`: token, layout desktop, dan adaptasi responsif.
- `script.js`: bootstrap dan HMR cleanup.
- `js/core/`: lifecycle LandingPage, GSAP, konfigurasi fitur, dan adapter Lenis.
- `js/sections/`: filter experiences dan accordion schedule.
- `js/interactions/`: navigasi, dialog tiket, form kontak, dan motion reveal.
- `assets/`: foto, grafik, heading SVG, dan logo dalam `images/`; ikon dan font pada folder masing-masing. Divider sederhana dibuat dengan CSS. Lihat [panduan aset](../assets/README.md).
- `docs/`: analisis awal serta catatan implementasi dan verifikasi.

## Interaksi dan batas data

Header dan footer memakai anchor nyata. Menu mobile memiliki state buka/tutup, Escape, dan cleanup saat HMR. Schedule memakai elemen native details/summary dan satu panel terbuka. Headliner menjadi panel awal. Semua panel memakai tiga gambar persegi dan baris informasi yang mengikuti Figma node `3928:360`. Panel 1, 3, dan 4 memakai sembilan foto ilustratif yang dibuat dengan built-in image_gen; judul serta waktunya mengikuti data sumber, tanpa nama artis rekaan. Prompt dan daftar file ada di [docs/schedule-imagery.md](schedule-imagery.md).

Semua pill kategori Experiences menampilkan empat card yang sama. Sesuai permintaan, setiap klik mengacak urutannya dan menjamin urutan berubah dari sebelumnya, termasuk klik ulang pill aktif. Kotak hitam dipertahankan tanpa gambar dan tetap ikut diacak. Card dipindahkan sebagai node utuh agar tombol tiket tetap bekerja. Pill aktif memakai aria-pressed dan perubahan diumumkan melalui status pembaca layar. Indikator lingkaran di desain tetap dekoratif.

Keempat card memiliki tombol Get Ticket yang membuka dialog Experiences. Pada pointer presisi, hover card atau fokus keyboard menampilkan tombol dengan fade dan blur 12px ke 0 selama 750ms. Pada layar sentuh tombol selalu terlihat. Reduced motion menghilangkan transisi dan blur kemunculan; efek kaca latar tombol tetap dipertahankan.

Get Tickets membuka detail konser asli. URL pemesanan belum diberikan sehingga tidak ada transaksi/pembelian. Form email memvalidasi format secara native dan memberi tahu bahwa pendaftaran belum dibuka; tidak mengirim atau menyimpan alamat email. Playlists dan Placements tetap teks karena destinasi belum diberikan. Tidak ada link artikel rekaan.

## Typography dan aset

Inter Variable, Inter Display, serta Instrument Serif dimuat lokal. Empat heading campuran Awesome Serif memakai export outline SVG dari node teks aslinya, dengan teks HTML tersembunyi secara visual untuk pembaca layar. File font Awesome Serif sendiri belum tersedia; ganti pendekatan outline dengan live text hanya setelah file font berlisensi tersedia. Wordmark footer adalah SVG asli.

Tidak ada URL aset Figma sementara pada runtime. Semua foto di bawah hero memakai lazy loading; aset PNG asli tetap beresolusi besar, termasuk hero sekitar 15 MB. Kompresi/format web modern belum dilakukan dan performa jaringan belum diprofilkan.

## Motion dan verifikasi

Lenis memakai ticker GSAP yang sama dengan ScrollTrigger. Reduced motion menggunakan scroll native dan menghilangkan reveal dekoratif. Semua konten utama tetap ada tanpa JavaScript; navigasi dan details/summary juga tetap tersedia.

Penggaris Updates (`3915:531`) mengikuti scroll selama section masuk viewport: scroll turun menggeser gambar ke kiri hingga 640px, scroll naik mengembalikannya ke kanan. Jarak dibatasi oleh lebar gambar yang tersisa dan dihitung ulang saat refresh responsif. Modul `ruler-scroll.js` memakai ScrollTrigger yang sama, menonaktifkan gerakan pada reduced motion, dan membersihkan tween saat destroy/HMR.

Saat Updates masuk viewport, Schedule di belakangnya diberi offset vertikal hingga 32% tinggi viewport sehingga bergerak lebih lambat daripada scroll. Updates tetap di alur dokumen dengan background hitam opak dan lapisan di atas Schedule, memberi transisi menutupi section sebelumnya. Gerakan ini mengikuti arahan pengguna; frame Figma menyediakan komposisi statisnya. Efek berbalik saat scroll naik, dihitung ulang saat resize, dinonaktifkan pada reduced motion, dan dibersihkan oleh matchMedia milik modul `section-overlap.js`. Updates sendiri tidak ditransform agar pin card tetap stabil. Transisi yang sama diterapkan pada Artist (`3915:425`): background cream Artist menutupi Experiences yang bergerak lebih lambat. Kedua transisi berbagi modul `section-overlap.js` dengan hook `data-section-overlay`; urutan lapisan mengikuti urutan section.

Card Updates menampilkan gambar sebelum hover, lalu crossfade gambar ke judul dan ringkasan pada latar hitam selama 750ms. Fokus keyboard memberi state yang sama. Card 2 April memakai aset lokal headliner-01-sunset sebagai cover; teks artikel aslinya dipertahankan. Tujuh card lain memakai copy editorial sementara yang perlu ditinjau sebelum publikasi. Pada perangkat tanpa hover atau layar hingga 760px, ringkasan tampil di bawah gambar agar konten tetap terbaca. Reduced motion menonaktifkan transisi.

Updates berisi delapan card dalam satu track horizontal. ScrollTrigger menahan viewport card di tengah layar (`center center`) sambil scroll vertikal menggerakkan track menuju card di sebelah kanan. Setelah jarak overflow habis, pin dilepas dan halaman melanjutkan scroll ke footer; scroll ke atas membalik urutannya. Lebar dan jarak dihitung ulang saat resize. Fokus keyboard menggeser scroll ke card yang dituju. Reduced motion atau tanpa JavaScript memakai area horizontal native tanpa pin. Tween dan listener fokus dibersihkan melalui lifecycle LandingPage. Gerak maju, pelepasan pin menuju footer, dan gerak balik sudah diperiksa di Chrome desktop.

Build produksi, sintaks JavaScript, referensi aset, dimensi/alt gambar, validitas SVG, ID unik, dan target anchor telah diperiksa. Preview Chrome desktop serta emulasi iPhone 393px diperiksa untuk komposisi dan interaksi menu, accordion, filter, dialog/Escape, serta status form. Belum mencakup pengujian semua browser, semua breakpoint, reduced-motion secara manual, audit performa, atau klaim pixel-perfect.

Detail sumber dan pemetaan: [docs/analysis.md](analysis.md), [docs/implementation.md](implementation.md), serta [assets/fonts/README.md](../assets/fonts/README.md).
