# Konteks Project untuk Tugas Akhir

Dokumen ini merangkum project **Ceplok Design Kit React** sebagai bahan Tugas Akhir (TA).
Isinya diambil langsung dari codebase, README, CHANGELOG, COLOR.md, dan riwayat git
per 18 November 2026.

Bagian yang ditandai **[isi sendiri]** perlu dilengkapi sesuai arahan dosen pembimbing.

---

## 1. Identitas Project

| Hal | Isi |
|---|---|
| Nama project | Ceplok Design System (design kit React) |
| Nama paket NPM | `@ceplok-ui/design-kit-react` (sebelumnya `@stasi/design-kit-react`) |
| Versi terakhir rilis | `0.6.0` (16 November 2026), ada perubahan "Belum dirilis" sesudahnya |
| Lisensi | MIT |
| Repo utama | GitLab `intern-tpl-ipb/react-design-system` |
| Mirror + dokumentasi | GitHub `Aroneru/GCS-design-system-react-mirror`, situs docs di GitHub Pages |
| Mulai dikerjakan | 27 Juli 2026 |
| Konteks | Project magang, dikerjakan tim 5 orang |
| Bahasa | TypeScript, CSS |

---

## 2. Latar Belakang

- Project ini awalnya berupa design system berbasis **Laravel Blade**.
  Commit 28 Juli 2026: "transfer from laravel blade to react vite".
- Komponen Blade lalu ditulis ulang menjadi **komponen React**. Beberapa jejaknya masih terlihat
  di kode, misalnya `cn()` di `src/lib/utils` yang meniru pola `$attributes->merge` di Blade,
  dan hook buka/tutup Alert/Toast yang menjadi padanan `dkDisclosure` di versi Blade.
- Masalah yang ingin diselesaikan:
  - Tiap aplikasi membuat ulang tombol, form, tabel, navbar, dan lain-lain dengan gaya berbeda.
  - Warna, tipografi, dan jarak tidak konsisten antar aplikasi.
  - Desain di Figma sulit diterjemahkan secara seragam ke kode.
  - Dukungan tema gelap (dark mode) harus dibuat manual per aplikasi.
- Solusinya: satu **design system** yang berisi token desain, komponen siap pakai,
  dan dokumentasi interaktif, lalu didistribusikan lewat NPM.

---

## 3. Tujuan

### Tujuan umum
Membangun design system berbasis React dan Tailwind CSS v4 yang dapat dipasang
lewat NPM, sehingga aplikasi web di lingkungan organisasi punya tampilan dan perilaku
yang konsisten.

### Tujuan khusus
1. Menyediakan **design token** (warna, tipografi, spacing, radius, shadow) sebagai sumber tunggal gaya.
2. Menyediakan **komponen React** yang reusable, aksesibel, dan bertipe (TypeScript).
3. Menyediakan **tema gelap** yang deklaratif lewat token, bukan class per elemen.
4. Menyediakan **situs dokumentasi** dengan pratinjau langsung, playground, dan cuplikan kode.
5. Membuat proses **rilis dan deploy** yang terdokumentasi (CHANGELOG, semver, CI).

### Manfaat
- Developer: tidak perlu membuat komponen dari nol, cukup `npm install`.
- Desainer: hasil di kode mengikuti Figma dan token yang sama.
- Organisasi: tampilan antar aplikasi seragam, biaya pengembangan lebih rendah.

---

## 4. Ruang Lingkup

Yang termasuk:
- Library komponen UI untuk web (React 18 ke atas).
- Token desain dan tema terang/gelap.
- Situs dokumentasi dan contoh aplikasi.

Yang tidak termasuk:
- Backend, API, atau database.
- Versi mobile native (React Native, Flutter).
- Framework lain (Vue, Angular). Versi Laravel Blade adalah pendahulu, bukan bagian repo ini.

---

## 5. Teknologi

| Teknologi | Versi | Fungsi |
|---|---|---|
| React | 19 (peer: >= 18) | Library UI |
| TypeScript | ~6.0 | Tipe data dan keamanan kode |
| Tailwind CSS | v4 | Styling utility-first, token lewat `@theme` |
| Vite | 8 | Dev server dan bundler (situs docs dan library) |
| vite-plugin-dts | 5 | Membuat file tipe `.d.ts` untuk paket NPM |
| clsx | 2 | Menggabungkan className |
| flowbite-react-icons | 1.3 | Sumber ikon outline dan solid |
| GSAP | 3 | Animasi di situs dokumentasi saja |
| ESLint | 10 | Pengecekan kualitas kode |
| GitHub Actions | - | Build dan deploy docs ke GitHub Pages |

Catatan desain penting:
- React dan Tailwind **tidak di-bundle**. Keduanya jadi `peerDependencies`, disediakan aplikasi pemakai.
- Paket mengirim **CSS sumber**, bukan CSS hasil kompilasi. Aplikasi pemakai wajib memakai
  Tailwind v4 dan menambahkan baris `@source` ke folder `dist` paket.

---

## 6. Arsitektur

### Struktur folder

```
src/
  lib/          kode library yang dipublish ke NPM
    components/ komponen React
    icons/      subpath ikon outline dan solid
    utils/      helper (cn, context dark mode, disclosure)
    fonts/      font Lato
    tokens.css  semua design token
    styles.css  entry CSS (Tailwind + token + base layer + class .ds-*)
    index.ts    entry point library
  docs/         situs dokumentasi (tidak ikut dipublish)
    pages/      halaman Components, Form, Foundations, Example, Portal
    motion/     komponen animasi khusus docs
tests/          tes runtime lewat Chrome DevTools Protocol
.github/        workflow deploy docs
```

### Dua hasil build
1. **Library NPM**: `npm run build:lib` memakai `vite.lib.config.ts`.
   - Format ES Module, multi-entry: `index`, `icons/outline`, `icons/solid`.
   - Menghasilkan `.d.ts` untuk TypeScript.
   - `tokens.css`, `styles.css`, dan font disalin ke `dist`.
2. **Situs dokumentasi**: `npm run build` memakai `vite.config.ts`.
   - Didahului `tsc -b`, jadi error tipe menggagalkan build.
   - Dideploy otomatis ke GitHub Pages setiap push ke `main`.

### Ukuran kode (perkiraan)
- Library (`src/lib`): sekitar 15.300 baris TS/TSX.
- Dokumentasi (`src/docs`): sekitar 31.400 baris TS/TSX.

---

## 7. Design Token

Semua token ada di `src/lib/tokens.css` (sekitar 890 baris). Token dibagi tiga lapis:

```
Palet      --color-gray-700          warna mentah (skala 50 sampai 900)
   |
Semantik   --color-surface           peran warna (latar kartu)
   |
Komponen   --color-card-surface      warna khusus satu komponen
```

- **Palet**: `primary`, `gray`, `red`, `orange`, `yellow`, `green`, `purple`.
- **Semantik**: `surface`, `content`, `border`, `brand`, `field`, `feedback-*`, dan lainnya.
- **Komponen**: misalnya `--color-card-*`, `--color-footer-*`, `--color-table-*`,
  `--color-sidebar-*`, `--color-timeline-*`.
- **Tipografi**: skala `display` sampai `caption`, font utama Lato, alternatif Inter (`font-alt`)
  dan Arial (`font-alt-2`), plus token font-weight.
- Juga ada spacing, radius, dan shadow (elevation).

Keuntungannya: aplikasi pemakai cukup menimpa token di CSS-nya sendiri untuk mengganti warna,
tanpa mengubah kode komponen.

---

## 8. Tema Gelap (Dark Mode)

- Tema gelap memakai atribut `data-theme="dark"`, bukan class `dark:` di tiap elemen.
- Di dalam `[data-theme='dark']`, nilai token semantik dan token komponen diganti.
  Komponen tetap memakai class yang sama, misalnya `bg-surface`.
- Cara pakai:
  - Prop `darkMode` di komponen memasang `data-theme="dark"` di elemen terluarnya.
  - Pembungkus dengan `data-theme="dark"` membuat semua komponen di dalamnya ikut gelap.
  - Area di dalam bagian gelap bisa dikembalikan terang dengan `data-theme="light"` atau `.ds-theme-light`.
- **Pewarisan lewat React Context**: `DarkModeContext` di `src/lib/utils`. Contoh: `Table` dengan
  `darkMode` membuat Button dan Badge di dalamnya ikut gelap. Prop `darkMode` yang diisi langsung tetap menang.
- **Situs dokumentasi** punya mode gelap sendiri (`data-docs-theme`, di `src/docs/docsTheme.ts`),
  terpisah dari tema komponen. Tujuannya agar mode gelap docs tidak membuat komponen gelap
  setengah-setengah. Halaman yang sudah mendukung didaftarkan di `darkPages`.

---

## 9. Daftar Komponen

### Komponen umum
Alert, Avatar, Badge, Breadcrumb, Button, Card, Clipboard, Container, Drawer, Dropdown,
Footer, Hero, Icon, ListView, Modal, Navbar, Pagination, Popover, Sidebar, Spinner, Table,
TableOfContents, Timeline, Toast.

### Komponen form
InputField, FloatingLabel, TextArea, Select, Search, Datepicker, Upload, Radio, Toggle, Checkbox.

### Ikon
- Logo brand dan sosial media dari entry utama.
- Ikon UI lewat `@ceplok-ui/design-kit-react/icons/outline` dan `/icons/solid`.

### Contoh fitur yang menonjol
- **Table**: search, filter, sort, pilih baris, pagination, zebra rows, sticky header,
  kolom file dengan pratinjau PDF, otomatis `compact` bila lebar tabel di bawah 640px, dark mode.
- **Modal**: memakai elemen `<dialog>` bawaan browser, sehingga fokus dan latar inert diurus browser.
- **Navbar**: varian Back Office dan Front Office, menu mobile lewat Drawer, daftar isi responsif.
- **TableOfContents**: scroll-spy, tautan anchor, mode `collapsible`.
- **Avatar**: fallback inisial (mendukung Unicode) atau ilustrasi Female/Male.

---

## 10. Situs Dokumentasi

Bagian utama (lihat `src/docs/navigation.ts`):
- **Home**: halaman pembuka.
- **Components**: satu halaman per komponen.
- **Form**: halaman komponen form.
- **Foundations**: Colors, Typography, Spacing, Border, Elevation, Icons.
- **Example**: contoh aplikasi layanan (Dasbor, Layanan, Pengajuan, Pemohon, Pengaturan, Berita).
- **Portal**: Portal Dashboard yang hanya memakai komponen kit.

Fitur docs:
- Pratinjau komponen langsung dan **Playground** (ubah props, font, dan mode gelap).
- Cuplikan kode yang ikut berubah sesuai pilihan di playground.
- Tabel props, daftar isi "On this page", pencarian halaman (Ctrl K / Cmd K).
- Router hash sederhana (`useHashRoute`) sehingga tautan bagian bisa disalin dan dibuka ulang.
- Mode gelap docs yang tersimpan di browser.

---

## 11. Alur Kerja Tim

- **Tim**: 5 kontributor. Jumlah commit kurang lebih: Fahri R (156), keisharmdh (121),
  Muhammad Yermi Rachman (120), Falin (84), Faliana Alifia (5).
- **Branch**: tiap anggota punya branch sendiri (`fahri`, `keisha`, `yermi`, `falinnn`),
  digabung ke `staging` lewat Merge Request, lalu `staging` ke `main`.
- **Deploy**: push ke `main` memicu GitHub Actions untuk build dan deploy docs ke GitHub Pages.
- **Versi**: Semantic Versioning, dicatat di `CHANGELOG.md` dengan format Keep a Changelog.
- **Pesan commit**: gaya Conventional Commits, misalnya `feat(table): ...`, `fix(dark mode): ...`.

---

## 12. Riwayat Rilis

| Versi | Tanggal | Catatan utama |
|---|---|---|
| 0.1.0 | 1 Sep 2026 | Rilis pertama ke NPM sebagai `@stasi/design-kit-react`, 19 komponen |
| 0.2.0 | 1 Sep 2026 | Modal, Popover, Sidebar, Spinner |
| 0.3.0 | 6 Okt 2026 | Ganti nama paket ke `@ceplok-ui/design-kit-react` |
| 0.3.1 | 8 Okt 2026 | Penyesuaian tampilan komponen, README npm diperbarui |
| 0.4.0 | 15 Okt 2026 | Font alternatif Inter (`font-alt`) dan Arial (`font-alt-2`) |
| 0.5.0 | 3 Nov 2026 | Tema `simaya` jadi `purple`, Navbar V2, Avatar V2, ListView, Timeline, TableOfContents |
| 0.5.1 | 3 Nov 2026 | Perbaikan kontrol Typography di Playground |
| 0.6.0 | 16 Nov 2026 | Dark mode Table, token `--color-table-*`, mode gelap docs (uji coba) |
| Belum dirilis | - | Token `--color-card-*` dan `--color-footer-*`, mode gelap docs meluas |

Detail lengkap ada di `CHANGELOG.md`.

---

## 13. Kontribusi Penulis (Fahri R)

Ringkasan dari riwayat git. Silakan sesuaikan dengan peran resmi di tim.

- **Migrasi awal**: memindahkan design system dari Laravel Blade ke React + Vite (Juli-Agustus 2026).
- **Komponen**: Container, Footer, Card, Table, Badge (disesuaikan dengan Figma), Hero, TableOfContents.
- **Table**: versi awal, responsif, integrasi di halaman Example, header align, zebra rows,
  pilih semua, kolom file dan pratinjau PDF, hapus baris lewat modal, dark mode, mode compact di mobile.
- **Tipografi**: font alternatif Inter dan Arial, token font-weight, Lato 2.0, pilihan font di Playground.
- **Dark mode**: Container, Card, Hero, Footer, Table, serta penerapan mode gelap di situs docs
  dan token komponen `--color-card-*` dan `--color-footer-*`.
- **Situs docs**: redesign Home, halaman Overview, halaman Example, Playground, ToC.
- **Rilis**: memperbarui CHANGELOG dan versi paket (0.5.1, 0.6.0).

---

## 14. Pengujian dan Kualitas

- **Type check**: `tsc -b` dijalankan di setiap build. Build gagal bila ada error tipe.
- **Lint**: `npm run lint` (ESLint, aturan React Hooks).
- **Tes runtime** di folder `tests/` (Avatar, Clipboard, Modal, Popover). Tes ini memakai
  Chrome DevTools Protocol langsung tanpa library tes tambahan, dengan Vite dan Chrome headless berjalan.
- **Uji visual** manual lewat situs dokumentasi dan Playground.
- **Aksesibilitas**: memakai elemen native (`<dialog>`, `<button>`, `<a>`), label wajib di Clipboard,
  dan focus ring global di base layer.

Celah yang bisa dibahas di TA:
- Belum ada unit test otomatis untuk sebagian besar komponen.
- Tes runtime belum masuk CI.
- Belum ada pengukuran aksesibilitas formal (misalnya Lighthouse atau axe).

---

## 15. Ide Arah Pembahasan TA **[isi sendiri]**

Pilih atau gabungkan sesuai fokus TA:

1. **Rancang bangun design system** berbasis design token untuk konsistensi antarmuka aplikasi web.
2. **Migrasi** komponen UI dari Laravel Blade ke React: tantangan dan hasilnya.
3. **Implementasi tema gelap** berbasis token semantik dan atribut `data-theme`.
4. **Evaluasi** design system: konsistensi, waktu pengembangan, aksesibilitas, atau usability (SUS).

Contoh rumusan masalah:
- Bagaimana merancang design token agar satu komponen bisa mendukung tema terang dan gelap tanpa duplikasi kode?
- Bagaimana mendistribusikan komponen React dan token sebagai paket NPM yang dapat dipakai lintas aplikasi?
- Bagaimana dokumentasi interaktif membantu developer memakai komponen dengan benar?

Data yang perlu dilengkapi:
- Judul TA: **[isi sendiri]**
- Nama instansi magang dan pembimbing lapangan: **[isi sendiri]**
- Metode pengembangan (misalnya Agile/Scrum, Prototyping): **[isi sendiri]**
- Metode evaluasi dan hasilnya: **[isi sendiri]**

---

## 16. Referensi di Repo

- `README.md`: cara pasang, pakai, dan daftar props.
- `COLOR.md`: panduan token warna dan tema gelap.
- `CHANGELOG.md`: riwayat perubahan per versi.
- `src/lib/tokens.css`: sumber semua token.
- `src/lib/index.ts`: daftar komponen yang diekspor.
- `vite.lib.config.ts`: konfigurasi build library.
- `.github/workflows/deploy-docs.yml`: deploy dokumentasi.
