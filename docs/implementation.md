# Implementasi Mantserra

12 November 2026. Implementasi lokal, tanpa deployment.

## Sumber dan scope

Figma file `C2rhn7BP2nXA0LyByRDn09`, frame induk `3915:352`. Konteks detail dan screenshot diperiksa per section: `353`, `386`, `425`, `453`, `508`, `543` (prefix node `3915:`). Komposisi desktop 1440 × 6144 menjadi baseline. Header terbaru memiliki wrapper background serta signature bawah yang sudah diperbarui di Figma.

HTML/CSS baru memakai organisasi Maka. Tidak membawa efek cursor, preloader, foto, brand merah, atau markup Maka. Seluruh konten berada dalam HTML, bukan dihasilkan JavaScript. Layout memakai grid/flex untuk section biasa; posisi absolut dibatasi pada layering hero, tiket, dan crop foto sesuai referensi.

## Pemetaan aset

Nama hash asli dipertahankan untuk penelusuran. Semua file di bawah sudah diunduh lokal; root dimension SVG asli tidak diedit. Aset dekoratif berupa garis/heading/wordmark digunakan sebagai background CSS dengan wrapper sesuai slot, bukan digambar ulang.

| Slot / node | Aset lokal | Geometry utama pada desktop |
| --- | --- | --- |
| Hero photo 3915:354 | images/cf64c.png | 1779 × 1186, offset -147 / -61 pada baseline 1440 |
| Hero shade 3915:356 | images/e9544.png | Full width × 124, bawah hero |
| Kedua kartu tiket 3915:371 / 438 | icons/d5cc4.svg | 413 × 575; kartu diskalakan sebagai satu wrapper di mobile |
| Ikon kartu | icons/c8ec7.svg, 23c4a.svg | 26 × 26 dan 52 × 26, slot bawah tiket |
| Experiences 3915:389 / 390 / 391 | images/5e450.png, 111c6.png, 76b71.png | Grid empat kolom, slot 332 × 332; foto tengah mengikuti crop sumber |
| Experiences swatch 3915:394 | images/ac682.png | 108 × 108 |
| Experiences divider / indikator | icons/ae8f8.svg, f45f9.svg, 16c88.svg | Divider 1376 × 1; indikator 26 × 26 |
| Artist photo 3915:426 | images/673a9.png | Slot 680 × 908, crop asli |
| Artist secondary 3915:433 | images/1d03e.png | Slot 304 × 359, crop asli |
| Artist/schedule rails | icons/66b07.svg, dbeac.svg | Garis vertikal pada gutter |
| Schedule 3915:499 / 500 / 501 | images/01044.png, 59cbf.png, 4a52d.png | Tiga slot persegi 215/216px |
| Schedule divider | icons/507bc.svg | Full width × 1 |
| Updates 3915:509 / 510 / 512 | images/cc2b4.png, 40305.png, a5866.png | Slot 360 × 426, crop object-fit cover |
| Updates ruler / tick | icons/2641a.svg, c8650.svg | SVG asli 2314 × 38.5938 dan 1 × 9.5 |
| Footer wordmark 3915:552 | icons/80d8d.svg | Rasio asli 1375 / 320 |
| Footer divider 3915:560 | icons/35bea.svg | 332 × 1 |

Empat heading yang memakai Awesome Serif diekspor sebagai SVG outline dari node teks asli: `heading-387.svg` (466 × 102), `heading-431.svg` (569 × 185), `heading-463.svg` (646 × 122), `heading-540.svg` (647 × 184). Ukuran export adalah batas tinta SVG, berbeda dengan frame teks yang juga memuat whitespace. Tidak ada font alternatif yang menyamar sebagai Awesome Serif. Setiap heading tetap memiliki teks HTML untuk pembaca layar. Konsekuensinya, perubahan copy visual membutuhkan export ulang atau font berlisensi.

Layer kosong pada experiences dan editorial tetap kosong sesuai konteks Figma. Tidak diisi foto tambahan. Copy sumber, termasuk ejaan yang tidak konsisten, dipertahankan.

## Interaksi

- Menu desktop dan mobile menuju section nyata. Menu mobile menutup setelah navigasi atau Escape; state dan listener dibersihkan saat HMR.
- Schedule memakai native details/summary, satu panel terbuka. Panel Headliner berisi gambar dan copy sumber. Slot lain hanya memuat judul/waktu yang tersedia.
- Filter mempertahankan All sebagai state awal. Event yang ada hanya memiliki label kategori Experiences; genre yang belum memiliki data menampilkan empty state. Categories menampilkan seluruh event.
- Dialog header menampilkan Brookly Simmons, sedangkan CTA experiences menampilkan Simmons Wellington. Harga/waktu tidak ditambahkan pada event yang tidak memiliki data tersebut. Escape dan tombol Close mengembalikan fokus ke pemicu.
- Tidak ada URL tiket atau backend email yang diberikan. Form tidak mengirim/menyimpan alamat dan tidak mengklaim sukses. Playlists/Placements tidak dijadikan link palsu.
- Lenis dan ScrollTrigger memakai satu ticker GSAP. Reveal melalui matchMedia, dikembalikan ke state statis untuk reduced motion. Semua module memiliki cleanup.

## Pemeriksaan yang dilakukan

- Build produksi Vite berhasil; semua modul JavaScript lolos pemeriksaan sintaks.
- Pemeriksaan source: ID unik, target anchor ada, semua gambar memiliki alt/width/height, semua aset rujukan non-empty, semua SVG valid XML, dan tidak ada URL Figma sementara di HTML/CSS runtime.
- Respons preview lokal mengembalikan HTTP 200.
- Chrome desktop: komposisi hero dan artist feature serta layering tiket diperiksa secara visual; dialog header dibuka, Escape menutup, dan fokus kembali ke pemicu.
- Chrome emulasi iPhone 16 (393 × 852): artist feature, hero/menu, schedule, experiences, updates dan footer diperiksa pada viewport. Navigasi mobile menutup setelah memilih section. Accordion berpindah dari Headliner ke Opening Set. Filter Alternative menampilkan empty state, All memulihkan gallery. Submit alamat uji menampilkan status belum dikirim.
- Koreksi dari pemeriksaan: tracking intro hero, grid metadata schedule, posisi indikator experiences mobile, dan background menu mobile.

Belum diverifikasi secara manual: semua browser/breakpoint, toggle reduced motion, browser tanpa JS, profiling performa, dan fidelity setiap piksel pada setiap section. PNG asli berukuran besar (hero sekitar 15 MB); format/kompresi web belum dioptimalkan. Header dan detail ilustratif siap ditinjau, sedangkan pembelian tiket, langganan email, dan tujuan eksternal memerlukan data/layanan asli sebelum aktivasi produksi.

## Koreksi section 2 terhadap Figma terbaru

Node `3915:386` diperiksa ulang setelah permintaan revisi pengguna. Penyebab utama galeri memanjang adalah atribut HTML `height` foto yang masih menentukan tinggi elemen ketika CSS hanya mengatur width dan aspect-ratio. CSS section kini menetapkan `height: auto` sehingga preferred aspect-ratio 1:1 membentuk slot persegi; foto close-up tetap mengikuti crop persentase Figma. Koreksi ini dibatasi pada experiences.

Section desktop memakai flex column dengan baris kategori/swatch di bagian bawah min-height 1024px, gutter 32px, dan padding bawah 32px. Filter dibagi menjadi dua baris eksplisit dengan tombol setinggi 37px. Indikator lama dua SVG diganti aset grup asli terbaru `assets/icons/experience-indicators.svg` (node `3928:357`, 56 × 26). Jarak lokasi dibuat 16px dan posisi indikator mengikuti inset kanan referensi. Spacing tablet/mobile tetap memakai flow responsif, dengan slot foto persegi.

Perbaikan utama galeri diperiksa langsung di Chrome desktop: ketiga foto kini sejajar, persegi dan tidak memanjangkan section seperti sebelumnya. Build produksi diperiksa kembali. Pemeriksaan ulang mobile visual untuk revisi ini belum dilakukan; pemeriksaan mobile pada implementasi sebelumnya tidak dianggap sebagai bukti untuk CSS revisi ini.

## Revisi accordion 3928:360

Panel konten schedule diperbarui ke komposisi Figma terbaru: tiga foto 215/216/215px pada baseline, gap 16px, radius 12px, lalu baris informasi dengan jarak 24px. Kolom metadata 214px dan deskripsi 332px dipisahkan gap 132px dalam wrapper 678px. Foto sekarang memakai height auto dan aspect-ratio 1 agar atribut dimensi intrinsik tidak memanjangkan panel.

Headliner mempertahankan ketiga foto, nama Chris Stussy, dan deskripsi asli. Panel Opening Set, Late Night Session, dan Closing Act masing-masing memiliki tiga gambar baru yang dibuat dengan built-in image_gen, disimpan di `assets/images/schedule/` dan sudah terhubung ke HTML. Sembilan file final berukuran 1254 × 1254px meskipun prompt meminta 1024px; atribut HTML mengikuti dimensi file aktual. Tidak ada gambar yang disalin antar panel. Prompt lengkap dan path final dicatat dalam `schedule-imagery.md`. Semua output diperiksa secara visual sebelum dipakai.

Verifikasi revisi: empat panel masing-masing memiliki tiga aset lokal non-empty, sembilan gambar generated memiliki hash berbeda, dan gambar Headliner tetap asli. Build produksi berhasil. Di Chrome desktop, panel 1/2/3/4 dibuka bergantian dan screenshot memperlihatkan foto persegi serta baris metadata yang baru. Pergantian panel menutup panel sebelumnya. Emulasi iPhone 16 393px diperiksa untuk panel Closing Act dan struktur Headliner; tiga foto tetap sejajar dan metadata tetap terbaca. Semua breakpoint/browser belum diuji.
