# Analisis Mantserra dan kerangka Maka

Tanggal pemeriksaan: 12 November 2026.

Status terbaru: implementasi keenam section telah diminta pengguna dan dikerjakan. Dokumen ini menyimpan analisis awal; keputusan aktual dan hasil verifikasi ada di `implementation.md` serta README proyek.

## Sumber yang diperiksa

- Lokal: `/Users/macbook-oww/Documents/maka`, termasuk package, README, AGENTS, bootstrap dan core lifecycle/scroll/animation.
- Figma: https://www.figma.com/design/C2rhn7BP2nXA0LyByRDn09/Speedtest?node-id=3915-352&m=dev
- Konteks desain, screenshot dan metadata node target berhasil diakses lewat koneksi Primary. Koneksi lain tidak memiliki akses sesi.
- Frame target berukuran 1440 × 6144, berisi enam frame 1440 × 1024 yang ditumpuk. Tinggi tersebut adalah referensi desktop, bukan ketentuan fixed-height untuk semua perangkat.

## Stack Maka dan keputusan reuse

| Bagian | Temuan | Keputusan Mantserra |
| --- | --- | --- |
| Runtime | HTML, CSS, JavaScript vanilla ES modules | Sama; tanpa React, router atau backend |
| Bundler | Vite 8.3.5 | Versi sama dan npm lockfile |
| Motion | GSAP 3.15.0 + ScrollTrigger | Reuse konfigurasi core; motion visual dibuat setelah layout |
| Scroll | Lenis 1.3.27 pada ticker GSAP | Reuse adapter; belum diaktifkan pada scaffold |
| Slider | Swiper 14.4.0 | Tersedia, tanpa import sampai diperlukan |
| Lifecycle | LandingPage, AbortController, matchMedia, cleanup HMR, refresh setelah font | Pola sama dengan initializer baru yang hanya memuat fondasi |
| Style | CSS BEM dan hook data-* | Konvensi sama; token visual baru |
| Aset dan section | Foto fashion, merah, Bricolage, proyek dan statistik Maka | Tidak disalin |

Maka mengimpor `js/interactions/clock.js`, tetapi file itu tidak ditemukan dalam inventaris source lokal. Menyalin bootstrap lengkap akan membawa import yang hilang dan ketergantungan DOM Maka. Karena itu initializer Mantserra dibuat ringkas dengan kontrak lifecycle yang sama. Ini temuan inspeksi, bukan hasil menjalankan build Maka.

## Pemetaan desain

| Node | Section | Struktur teramati | Rencana modul ketika build |
| --- | --- | --- | --- |
| 3915:353 | Hero + header | Foto konser full bleed, navigasi overlay, judul serif besar, tiket tengah, metadata bawah | Hero dan navigation; kartu tiket sebagai komponen markup bersama |
| 3915:386 | Experiences | Latar hitam, grid empat kolom 332px pada desktop, foto, kategori pill, metadata | Experiences; filter hanya bila perilakunya sudah ditentukan |
| 3915:425 | Artist feature | Latar cream, dua kolom, foto tinggi dan tiket, heading campuran serif, foto pendamping | Artist feature; reuse markup kartu tiket |
| 3915:453 | Schedule | Empat slot waktu, Headliner terbuka, tiga gambar dan detail | Schedule accordion dengan button, aria-expanded, keyboard |
| 3915:508 | Editorial updates | Hitam, heading terpusat, gambar dan metadata editorial, satu artikel tampil detail | Updates; kebutuhan carousel belum terbukti |
| 3915:543 | Footer | Navigasi, deskripsi platform, email/SEND, heading besar, wordmark SVG | Footer; submit baru dihubungkan setelah endpoint tersedia |

## Arah visual yang terukur

- Latar hitam/putih dan cream `#FCF4E6`; fotografi konser bernuansa hangat.
- Gutter desktop umumnya 32px, empat kolom 332px dengan gap 16px, serta susunan dua kolom 680px pada bagian tertentu. Ini hasil referensi 1440px; aturan layar lebar akan ditetapkan saat layout.
- Font dalam konteks: Inter Variable (Light/Regular/Medium), Inter Display Regular, Instrument Serif Regular/Italic, Awesome Serif Italic dengan beberapa nama style. Jangan menganggap font Inter statis Maka identik dengan semua face ini.
- Judul hero 320px dan 160px; heading editorial 64px, line-height 62px; copy pengantar 32px. Nilai ini baseline desktop, perlu fluid sizing dan komposisi ulang mobile.
- Tiket utama 413 × 575px. Bentuk tiket, wordmark dan ikon tersedia sebagai aset SVG; gunakan aset asli saat implementasi.
- Layer kosong/transparan ada pada grid dan editorial. Jangan mengisi dengan foto atau konten rekaan tanpa membaca konteks section secara rinci.

## Yang belum diputuskan oleh desain statis

- Node target tidak memuat frame mobile. Adaptasi 360/390/768/1024px perlu dirancang dari hierarki desktop.
- URL pembelian tiket, artikel, destinasi Playlists/Placements, endpoint email, serta perilaku filter tidak tersedia dalam referensi yang diperiksa.
- Copy memuat ejaan seperti “Eentertainment”, “conic performers”, dan variasi nama Simmons. Pertahankan sumber sampai ada keputusan editorial; jangan koreksi diam-diam.
- Font sudah diperiksa pada tahap persiapan aset: Inter Variable, Inter Display Regular, serta Instrument Serif Regular/Italic tersedia di `assets/fonts/` beserta lisensi dan deklarasi CSS. Awesome Serif Italic (Light Regular, Regular, Extra Tall) masih memerlukan file berlisensi. Detail sumber dan status: `assets/fonts/README.md`.
- Rencana accordion berasal dari tampilan Headliner terbuka; perilaku interaksi merupakan usulan implementasi, bukan prototipe Figma yang sudah diverifikasi.

## Batas tahap ini dan langkah berikutnya

Scaffold menyediakan entry, core services, folder aset, dependency, lockfile dan instruksi. Belum ada section visual, download aset desain, slider, efek hero, filter atau form aktif. Smooth scrolling sengaja belum diaktifkan agar tahap awal memakai native scrolling.

Saat masuk build: ambil konteks detail keenam section, inventarisasi dan unduh aset/font, bangun layout statis sesuai urutan, verifikasi desktop dan adaptasi mobile, kemudian tambahkan interaksi fungsional dan motion beserta cleanup. Terakhir jalankan build dan pemeriksaan browser untuk resize, keyboard, reduced motion, HMR, scroll, aset dan overflow.

## Verifikasi tahap scaffold

- `npm run build` berhasil: 15 modul diproses, output produksi tersedia pada `dist/`.
- Instalasi bersih melalui registry belum berhasil diverifikasi: cache tidak lengkap dan akses registry gagal `ENOTFOUND`. Build lokal menggunakan salinan dependency yang sudah terpasang di Maka dengan versi yang sama; tidak ada symlink ketergantungan runtime ke folder Maka.
- Belum dilakukan pemeriksaan browser/interaksi dan fidelity karena implementasi desain belum dimulai.
