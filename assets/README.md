# Aset Mantserra

Nama file menggunakan `kebab-case` dan menjelaskan isi atau fungsi aset. Foto dikelompokkan menurut section. Nomor urutan dipakai untuk rangkaian foto accordion.

```text
assets/
├── fonts/          Font lokal, deklarasi CSS, dan lisensi
├── icons/          Indikator dan titik dekorasi tiket
└── images/         Foto, grafik, heading SVG, dan wordmark
    ├── artists/
    ├── experiences/
    ├── hero/
    ├── schedule/
    └── updates/
```

Contoh: `images/hero/concert-crowd.png`, `images/schedule/opening-02-synthesizer.png`, dan `images/ticket-frame.svg`.

Grafik, heading outline, dan logo SVG digabung langsung di `images/`. Folder `graphics/`, `headings/`, dan `logos/` tidak digunakan lagi.

Garis pemisah dan rail sederhana dibuat dengan CSS pada elemen `div`, pseudo-element, atau inset shadow 1px. Folder `dividers/` serta SVG garis tunggal dihapus. Dekorasi penggaris updates tetap SVG karena berisi banyak tanda ukur.

Pemetaan nama lama ke nama baru beserta SHA-256 tercatat di [asset-renames.json](../docs/asset-renames.json). Bagian `css_replacements` mencatat aset garis yang diganti CSS. Referensi HTML, CSS, dan dokumentasi mengikuti struktur baru.

`icons/experience-indicator-light.svg` dan `icons/experience-indicator-dark.svg` adalah sumber indikator Figma sebelumnya. Keduanya disimpan untuk referensi; halaman saat ini memakai grup `icons/experiences-indicators.svg`.

Folder kosong tidak dipertahankan dengan `.gitkeep`. Buat folder baru ketika sudah ada aset yang menggunakannya. Nama hash pada hasil build Vite di `dist/` dikelola bundler dan tidak perlu diubah manual.
