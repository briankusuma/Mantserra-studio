# Font Mantserra

Diperiksa dari konteks desain Figma node `3915:352`, 12 November 2026.

| Font/style di Figma | File lokal | Status |
| --- | --- | --- |
| Inter Variable Light / Regular / Medium | `inter-variable.woff2` | Siap; weight 300 / 400 / 500 dari variable font 100–900 |
| Inter Display Regular | `inter-display-regular.woff2` | Siap; weight 400 |
| Instrument Serif Regular | `instrument-serif-regular.ttf` | Siap; weight 400 normal |
| Instrument Serif Italic | `instrument-serif-italic.ttf` | Siap; weight 400 italic |
| Awesome Serif Italic Light Regular | Belum tersedia | Memerlukan file berlisensi yang sesuai |
| Awesome Serif Italic Extra Tall | Belum tersedia | Memerlukan file berlisensi yang sesuai |
| Awesome Serif Italic Regular | Belum tersedia | Memerlukan file berlisensi yang sesuai |

## Sumber unduhan

- Inter v4.1: https://github.com/rsms/inter/releases/download/v4.1/Inter-4.1.zip — file `web/InterVariable.woff2`, `web/InterDisplay-Regular.woff2`, dan `LICENSE.txt`. Lisensi lokal: `inter-LICENSE.txt`.
- Instrument Serif: https://github.com/google/fonts/tree/main/ofl/instrumentserif — kedua TTF dan `OFL.txt`. Lisensi lokal: `instrument-serif-OFL.txt`.
- Awesome Serif: https://nickylaatz.com/shop/308-awesome-serif-family — sumber resmi font komersial. Tidak diunduh dari situs redistribusi tidak resmi. Tidak ditemukan file yang cocok dalam inventaris Documents, Downloads, dan folder Fonts lokal yang diperiksa.

Figma menyediakan nama family/style, bukan binary font atau nomor versi sumber desain. File open-source di atas cocok secara family/style; kesamaan versi binary dengan font yang dipakai desainer belum dapat dipastikan.

## Pemakaian saat build desain

`fonts.css` menyediakan deklarasi lokal `@font-face` dan sekarang sudah diimpor ke `style.css` setelah Lenis:

```css
@import './assets/fonts/fonts.css';
```

Gunakan `font-family: 'Inter Variable'` dengan weight 300/400/500. Untuk Inter Display gunakan family terpisah dan weight 400. Instrument Serif italic memakai `font-style: italic`, bukan italic sintetis. Jangan memetakan Awesome Serif ke Instrument Serif tanpa keputusan desain. Awesome Serif Extra Tall adalah nama style desain, jangan menafsirkannya sebagai weight numerik tanpa metadata file asli.

Verifikasi unduhan: header dan ukuran WOFF2 valid; tabel nama TTF terbaca sebagai Instrument Serif Regular dan Italic. File lisensi disertakan. Wordmark footer adalah aset SVG di Figma, tidak perlu diganti dengan font.

Implementasi landing mempertahankan empat heading campuran Awesome Serif sebagai export outline SVG asli (`assets/icons/heading-387.svg`, `heading-431.svg`, `heading-463.svg`, `heading-540.svg`). Ini bukan file font atau font pengganti. Teks HTML untuk aksesibilitas tetap disertakan; pengeditan copy visual membutuhkan export ulang atau file Awesome Serif berlisensi.
