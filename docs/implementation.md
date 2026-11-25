# Implementasi Mantserra

12 November 2026. Implementasi lokal, tanpa deployment.

## Sumber dan scope

Figma file `C2rhn7BP2nXA0LyByRDn09`, frame induk `3915:352`. Konteks detail dan screenshot diperiksa per section: `353`, `386`, `425`, `453`, `508`, `543` (prefix node `3915:`). Komposisi desktop 1440 × 6144 menjadi baseline. Header terbaru memiliki wrapper background serta signature bawah yang sudah diperbarui di Figma.

HTML/CSS baru memakai organisasi Maka. Tidak membawa efek cursor, preloader, foto, brand merah, atau markup Maka. Seluruh konten berada dalam HTML, bukan dihasilkan JavaScript. Layout memakai grid/flex untuk section biasa; posisi absolut dibatasi pada layering hero, tiket, dan crop foto sesuai referensi.

## Pemetaan aset

Aset memakai nama deskriptif dan dikelompokkan per fungsi/section. Pemetaan hash nama lama ke path baru beserta checksum tersedia di `asset-renames.json`. Semua file di bawah sudah diunduh lokal; root dimension SVG asli tidak diedit. Heading dan wordmark tetap menggunakan aset SVG asli; garis sederhana memakai CSS dengan warna stroke sumber.

| Slot / node | Aset lokal | Geometry utama pada desktop |
| --- | --- | --- |
| Hero photo 3915:354 | images/hero/concert-crowd.png | 1779 × 1186, offset -147 / -61 pada baseline 1440 |
| Hero shade 3915:356 | images/hero/bottom-shade.png | Full width × 124, bawah hero |
| Kedua kartu tiket 3915:371 / 438 | images/ticket-frame.svg | 413 × 575; kartu diskalakan sebagai satu wrapper di mobile |
| Ikon kartu | icons/ticket-dot.svg, ticket-dots.svg | 26 × 26 dan 52 × 26, slot bawah tiket |
| Experiences 3915:389 / 390 / 391 | images/experiences/blue-light-artist.png, amber-live-performer.png, crowd-portrait.png | Grid empat kolom, slot 332 × 332; foto tengah mengikuti crop sumber |
| Experiences swatch 3915:394 | images/experiences/festival-performer-thumbnail.png | 108 × 108 |
| Experiences divider / indikator | CSS .experiences__divider, icons/experiences-indicators.svg | Divider 1376 × 1; grup indikator 56 × 26 |
| Artist photo 3915:426 | images/artists/concert-couple.png | Slot 680 × 908, crop asli |
| Artist secondary 3915:433 | images/artists/motion-portrait.png | Slot 304 × 359, crop asli |
| Artist/schedule rails | CSS pseudo-element rail | Garis vertikal pada gutter |
| Schedule 3915:499 / 500 / 501 | images/schedule/headliner-01-sunset.png, headliner-02-dancer.png, headliner-03-movement.png | Tiga slot persegi 215/216px |
| Schedule divider | CSS inset line 1px | Full width × 1 |
| Updates 3915:509 / 510 / 512 | images/updates/festival-crowd.png, artist-portrait.png, concert-crowd.png | Slot 360 × 426, crop object-fit cover |
| Updates ruler / tick | images/updates-ruler.svg dan CSS .updates__tick | SVG asli 2314 × 38.5938 dan 1 × 9.5 |
| Footer wordmark 3915:552 | images/mantserra-wordmark.svg | Rasio asli 1375 / 320 |
| Footer divider 3915:560 | CSS .contact__divider | 332 × 1 |

Empat heading yang memakai Awesome Serif diekspor sebagai SVG outline dari node teks asli: `experiences-introduction.svg` (466 × 102), `artists-feature.svg` (569 × 185), `schedule-showcase.svg` (646 × 122), `updates-announcement.svg` (647 × 184). Ukuran export adalah batas tinta SVG, berbeda dengan frame teks yang juga memuat whitespace. Tidak ada font alternatif yang menyamar sebagai Awesome Serif. Setiap heading tetap memiliki teks HTML untuk pembaca layar. Konsekuensinya, perubahan copy visual membutuhkan export ulang atau font berlisensi.

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

Section desktop memakai flex column dengan baris kategori/swatch di bagian bawah min-height 1024px, gutter 32px, dan padding bawah 32px. Filter dibagi menjadi dua baris eksplisit dengan tombol setinggi 37px. Indikator lama dua SVG diganti aset grup asli terbaru `assets/icons/experiences-indicators.svg` (node `3928:357`, 56 × 26). Jarak lokasi dibuat 16px dan posisi indikator mengikuti inset kanan referensi. Spacing tablet/mobile tetap memakai flow responsif, dengan slot foto persegi.

Perbaikan utama galeri diperiksa langsung di Chrome desktop: ketiga foto kini sejajar, persegi dan tidak memanjangkan section seperti sebelumnya. Build produksi diperiksa kembali. Pemeriksaan ulang mobile visual untuk revisi ini belum dilakukan; pemeriksaan mobile pada implementasi sebelumnya tidak dianggap sebagai bukti untuk CSS revisi ini.

## Revisi accordion 3928:360

Panel konten schedule diperbarui ke komposisi Figma terbaru: tiga foto 215/216/215px pada baseline, gap 16px, radius 12px, lalu baris informasi dengan jarak 24px. Kolom metadata 214px dan deskripsi 332px dipisahkan gap 132px dalam wrapper 678px. Foto sekarang memakai height auto dan aspect-ratio 1 agar atribut dimensi intrinsik tidak memanjangkan panel.

Headliner mempertahankan ketiga foto, nama Chris Stussy, dan deskripsi asli. Panel Opening Set, Late Night Session, dan Closing Act masing-masing memiliki tiga gambar baru yang dibuat dengan built-in image_gen, disimpan di `assets/images/schedule/` dan sudah terhubung ke HTML. Sembilan file final berukuran 1254 × 1254px meskipun prompt meminta 1024px; atribut HTML mengikuti dimensi file aktual. Tidak ada gambar yang disalin antar panel. Prompt lengkap dan path final dicatat dalam `schedule-imagery.md`. Semua output diperiksa secara visual sebelum dipakai.

Verifikasi revisi: empat panel masing-masing memiliki tiga aset lokal non-empty, sembilan gambar generated memiliki hash berbeda, dan gambar Headliner tetap asli. Build produksi berhasil. Di Chrome desktop, panel 1/2/3/4 dibuka bergantian dan screenshot memperlihatkan foto persegi serta baris metadata yang baru. Pergantian panel menutup panel sebelumnya. Emulasi iPhone 16 393px diperiksa untuk panel Closing Act dan struktur Headliner; tiga foto tetap sejajar dan metadata tetap terbaca. Semua breakpoint/browser belum diuji.

## Penyederhanaan divider

Lima SVG divider/rail dan satu SVG tick updates diperiksa: semuanya hanya satu path garis lurus. Aset tersebut diganti CSS 1px dengan warna stroke asli (#34393A, #F4E9D6, #141414, dan #343434). Garis horizontal schedule memakai inset shadow agar tidak mengubah ukuran layout. Divider experiences/kontak memakai background-color; rail memakai pseudo-element dan tick updates memakai span dekoratif. Folder assets/dividers dihapus. Penggaris updates yang kompleks tetap memakai SVG asli. Pemetaan pengganti dicatat pada css_replacements di asset-renames.json.

### Animasi accordion — 17 November 2026

Schedule memakai animasi tinggi 700ms dan fade/gerak konten 500ms saat membuka (250ms saat menutup). Grup `name` native dilepas selama modul aktif agar penutupan sibling dapat dianimasikan; kontrol tetap berupa `details`/`summary` dan kembali native tanpa JavaScript. Klik berulang membalik arah dari tinggi saat itu. Reduced motion mengganti state langsung; resize menyelesaikan transisi dan mengembalikan tinggi otomatis. Tween dimiliki GSAP context, listener memakai AbortController, dan ScrollTrigger direfresh setelah layout stabil.

### Sambungan footer–hero dan scroll loop — 17 November 2026

Acuan Figma `4005:669` beserta ornamen `4005:343` dan wordmark `4005:618`. Ornamen memakai aset asli `hero/concert-crowd.png` yang sudah ada, di balik gradasi hitam 267px. Ukuran/crop mengikuti foto hero yang dirender; bagian foto tepat sebelum titik awal hero ditampilkan pada akhir footer, sehingga koordinat gambarnya berlanjut pada sambungan. Wordmark asli dipertahankan.

Lenis memakai `infinite: true` dan `syncTouch: true`, tetap pada satu ticker GSAP. Resource `ScrollLoop` menambahkan satu viewport salinan visual hero/header di akhir halaman. Karena batas scroll native adalah tinggi dokumen dikurangi tinggi viewport, salinan ini membuat titik wrap identik dengan tampilan awal. Hero salinan tetap `inert`/`aria-hidden` dan mengikuti state sisi kartu asli. Header salinan interaktif: efek hover CSS tetap berjalan, menu mobile diinisialisasi dengan ID navigasi unik, dan tombol tiket memakai listener terdelegasi yang sama dengan header asli. Resource dan listener dibuang saat destroy/HMR atau reduced motion aktif. ResizeObserver memperbarui tinggi dan crop saat breakpoint berubah. Updates mengizinkan gesture horizontal native melalui `data-lenis-prevent-horizontal`. Reduced motion tetap native dan tidak berputar otomatis.

Verifikasi: kecocokan aset diperiksa dengan SHA-256 terhadap pemetaan Figma, sambungan visual dan putaran dua arah diperiksa di Chrome lokal, build dan pemeriksaan CSS produksi lulus. Touch sync dikonfigurasi sesuai README Lenis versi lokal; belum diverifikasi pada perangkat iOS/Android fisik.

### Preloader kartu — 24 November 2026

Acuan Figma `4118:806` (`preload`), tiga frame berurutan: `4118:749` sisi belakang kartu di tengah layar hitam, `4118:670` sisi depan kartu di tengah dengan latar masih hitam, `4118:767` header lengkap dengan kartu di posisi hero. Kartu frame pertama di Figma berupa screenshot `ticket-back`; implementasi memakai markup `ticket-back` asli, bukan raster. Frame `4118:811` kosong sehingga tidak diimplementasikan. Figma tidak memuat data motion, jadi durasi dan easing merupakan keputusan implementasi.

Modul `js/interactions/preloader.js` memakai kartu hero asli. Script kecil di `<head>` memasang kelas `is-preloading` sebelum paint pertama. CSS menyembunyikan header, latar, teks hero dan section lain, serta mengunci scroll. Kunci Lenis diteruskan melalui service `setScrollLocked` milik `LandingPage`. Urutan: kartu belakang masuk ke tengah viewport, menunggu foto hero (`decode`) dan font (minimal 1,4 detik, maksimal 4 detik), flip edge-on ke sisi depan, lalu latar fade/scale masuk sementara kartu turun ke posisi hero, diikuti navbar, introduction dan signature. Di akhir, context GSAP di-revert tanpa lompatan karena semua nilai akhir sama dengan state CSS. Reveal hero di `reveal.js` dilewati ketika preloader berjalan.

Batas: preloader dilewati pada reduced motion dan deep link dengan hash selain `#home`. `scrollRestoration` diubah ke manual agar intro selalu dimulai dari atas. Tanpa JavaScript, gate tidak pernah dipasang. Jika modul gagal dimuat, gate membuka sendiri setelah 4 detik sehingga konten tetap terbaca. HMR membersihkan state dan tidak memutar ulang preloader.

Verifikasi: build produksi lulus. Headless Chrome 1440 × 1024 menghasilkan tiga state yang cocok dengan ketiga frame Figma. Pada iframe 393px kartu tetap di tengah lalu turun ke posisi hero mobile. Waktu nyata pada jaringan lambat dan perangkat fisik belum diperiksa.

#### Text reveal hero — 25 November 2026

Tahap ketiga preloader memakai GSAP SplitText (sudah ada di paket `gsap` 3.15.0, opsi `mask` membutuhkan 3.13+). Introduction dipecah per baris dengan `mask: 'lines'`. Judul "Laude Simmons" dipecah `lines,words`, lalu kata-katanya naik bergantian di dalam mask baris. Caption dan legal masuk dengan fade. Split dibuat setelah font siap dan dimiliki context GSAP preloader, sehingga revert di akhir intro mengembalikan markup asli, termasuk `<em>`. Wrapper `.hero-line-mask` diberi padding dengan margin negatif agar ekor huruf italic dan descender tidak terpotong tanpa mengubah layout. SplitText memasang `aria-label` pada elemen induk selama animasi.

Verifikasi: rekaman Chrome melalui DevTools Protocol menunjukkan baris introduction dan kata judul muncul dari mask. Frame sebelum dan sesudah revert identik, jadi tidak ada lompatan. Build produksi lulus. Belum diperiksa di Safari.

#### Text reveal semua section — 25 November 2026

Mask reveal dari hero diterapkan ke section lain melalui modul `js/interactions/text-reveal.js`, dipicu ScrollTrigger (`top 88%`, sekali jalan).

- `data-text-reveal`, untuk teks HTML yang dipecah per baris dengan SplitText `mask: 'lines'`: nama dan deskripsi event Experiences, paragraf Artist, empat nama slot Schedule, dua teks atas dan eyebrow Updates, deskripsi dan heading Footer.
- `data-mask-reveal`, untuk empat heading outline SVG (Experiences, Artist, Schedule, Updates). Elemen ini tidak bisa dipecah, sehingga naik sebagai satu blok di dalam `overflow: clip`.

`autoSplit` memecah ulang teks setelah font dimuat atau lebar berubah sebelum animasi berjalan. Setelah animasi selesai, `revert()` mengembalikan markup asli dan memutus observer, jadi teks tidak diputar ulang. Modul diinisialisasi setelah pin Updates agar posisi trigger footer memperhitungkan pin spacing. Class mask (`reveal-line`) sama dengan hero. Reduced motion tidak memecah teks. Kartu Updates (hover crossfade dan pin horizontal) serta isi panel accordion Schedule tidak diberi reveal agar tidak bentrok dengan animasi yang sudah ada. Gambar tetap memakai `data-reveal` di `reveal.js`.

Verifikasi: rekaman scroll Chrome melalui DevTools Protocol menunjukkan reveal pada Artist, Updates dan Footer. Jumlah mask turun ke 0 setelah semua reveal selesai, tanpa error console. Build produksi lulus.

### Scroll scene Artist — 25 November 2026

Acuan Figma `4187:1285` (`scroll-animation`), empat frame berurutan: sisi belakang kartu di tengah latar cream, flip ke sisi depan, foto Artist muncul dengan kartu masih di tengah (`4187:1305`), lalu layout final Artist (`4187:1326`) dengan teks. Frame 1–2 di Figma memakai konten kartu Brookly; implementasi memakai kartu Artist (Samantha) beserta sisi belakangnya sendiri, karena kartu itulah yang mendarat di section ini.

Modul `js/sections/artist.js` mem-pin section Artist sepanjang 1,8 × tinggi viewport dengan timeline scrub. Urutannya: kartu tertahan di tengah viewport dan flip edge-on dari belakang ke depan (`quickSetter`, dua arah); clip foto utama terbuka dari bawah dengan scale 1,15 → 1; foto kecil naik dari offset Figma (−16, +178); kartu bergeser ke slotnya. Setelah progres 0,86, metadata, heading SVG, pill dan paragraf (SplitText per baris) diputar sebagai satu reveal, dan berbalik saat scroll naik. Clip foto dipindah ke `.artist__photo-frame` agar kartu bisa keluar dari potret selama scene. Tilt dan klik-flip kartu dimatikan (`artist--staging`) sampai kartu mendarat. Pin memakai `refreshPriority: 1` agar trigger di bawahnya diukur dengan pin spacing.

Scene aktif pada `(min-width: 1024px)` tanpa reduced motion. Di bawah itu section statis, dan teksnya memakai reveal biasa dari `text-reveal.js` melalui query terpisah, sehingga melewati breakpoint tidak memutar ulang reveal section lain. `data-reveal` pada potret dihapus karena scene yang mengatur kemunculannya.

Verifikasi: rekaman scroll Chrome 1440 × 1024 melalui DevTools Protocol menghasilkan keempat state Figma secara berurutan. Scroll balik mengembalikan teks dan sisi belakang kartu, tanpa error console. Build produksi lulus. Mobile/tablet, Safari, dan trackpad fisik belum diperiksa.
