# Changelog

Perubahan penting pada `@ceplok-ui/design-kit-react` dicatat di berkas ini.

Formatnya mengikuti [Keep a Changelog](https://keepachangelog.com/id/1.1.0/) dan
penomorannya mengikuti [Semantic Versioning](https://semver.org/lang/id/).

> Selama versi masih di bawah `1.0.0`, semver mengizinkan perubahan yang memutus
> kompatibilitas masuk di rilis **minor**. Jadi jangan anggap `0.x` aman dinaikkan
> begitu saja — baca bagian **Diubah** sebelum memperbarui.

## [Belum dirilis]

Perubahan di bawah ini sudah ada di kode tetapi belum diterbitkan ke npm.
Isinya menjadikan rilis berikutnya `0.2.0`, bukan `0.1.1`: ada sembilan komponen
publik baru, dan dua perubahan yang memutus.

### Diubah

- **`Footer`: logo dibesarkan** dari 40px (44px saat footer ≥ 768px) jadi 64px
  (80px). Ukuran lama dipatok untuk logo yang isinya cuma mark; begitu logonya
  berupa lockup dengan baris nama instansi, baris itu jatuh ke sekitar 6px dan
  berhenti terbaca. Consumer yang logonya mark polos akan melihatnya membesar —
  pakai `logoContent` bila ukuran lamanya memang disengaja.
- **`Select`: daftar pilihannya kini panel Dropdown**, bukan popup milik sistem
  operasi, jadi rupanya seragam dengan menu lain di kit ini. API-nya tidak
  berubah: nilainya tetap dibawa elemen `<select>` yang dirender tersembunyi,
  sehingga `value`, `onChange`, `name`, dan pengiriman formulir bekerja seperti
  sebelumnya, dan `<option>` maupun `<optgroup>` yang ditulis sebagai `children`
  dibaca lalu tampil di panel yang sama. Dua hal yang akan terasa berbeda: di
  ponsel tidak lagi muncul pemilih layar penuh milik sistem, dan `ref` masih
  menunjuk `<select>` yang kini tersembunyi — memanggil `.focus()` padanya tidak
  lagi memfokuskan field yang terlihat.

### Ditambahkan

- **`Alert`: prop `darkMode`** — tampilan gelap: latar gray-800 untuk semua
  variant, dengan ikon, heading, dan tombol tutup -300 serta isi pesan -400.
  Isi `actions` tidak ikut diubah, jadi pilih warna tombol yang kontras di atas
  gray-800. Bawaannya `false`, jadi Alert yang sudah ada tetap terang.
- **`Avatar`** — lingkaran identitas berisi foto (`src`) atau inisial
  (`initials`) dalam tiga ukuran lewat `size` (`small` 24px, `default` 32px,
  `large` 80px). Gambar yang gagal dimuat jatuh sendiri ke inisial.
- **`Breadcrumb`: prop `darkMode`** — tampilan gelap: teks menu aktif menjadi gray-300, teks menu inaktif dan separator ikon menjadi gray-400, serta dukungan properti navigasi yang dinonaktifkan (`onClick` preventDefault) untuk dokumentasi.
- **`Datepicker`** — pemilih tanggal dengan kalender di panel melayang, dalam
  tiga bentuk lewat `type`: `single` (satu tanggal, dengan tombol Hari ini dan
  Hapus), `period` (satu kalender dengan pintasan Hari ini, Minggu ini, Bulan
  ini, Hapus, dan Semua Waktu), dan `multiple` (dua kotak — mulai dan selesai —
  dengan dua kalender berdampingan yang bisa digeser sendiri-sendiri, bertombol
  Hari ini dan Hapus; prop `shortcuts` menambahkan pintasan periode milik
  `period`). Nilai `single` berupa `Date`; `period` dan `multiple` berupa
  `DateRange` (`{ start, end }`). Pada keduanya rentang dipilih dengan dua klik
  — tanggal mulai, lalu tanggal selesai — dan panel baru tertutup setelah klik
  kedua. Lebar bawaannya sama dengan panelnya (284px, 325px, dan 600px), jadi
  tepi kotak dan kalendernya segaris.

  Prop `min` dan `max` menandai awal dan akhir data — misalnya tiket pesawat
  dari hari ini sampai tanggal yang sama tahun depan. Tanggal di luarnya tidak
  bisa dipilih, pintasan periode dipotong ke rentang itu (atau dimatikan bila
  seluruhnya di luar), dan Semua Waktu memilih seluruh rentang data,
  `{ start: min, end: max }`. Sisi yang tidak diberi batas bernilai `null`, jadi
  tanpa keduanya Semua Waktu bernilai `{ start: null, end: null }`.

  Seperti Dropdown, panelnya memakai HTML Popover API, dan kalendernya bisa
  ditelusuri dengan panah, Home/End, serta PageUp/PageDown. Dengan `name`,
  tanggalnya ikut terkirim bersama formulir sebagai `YYYY-MM-DD`.

  Prop `darkMode` memberinya tampilan gelap. Untuk saat ini baru Alert, Breadcrumb,
  Datepicker, FloatingLabel, InputField, Radio, Search, Select, Sidebar, TextArea, Toast, dan Upload
  yang memilikinya; komponen lain menyusul.

  Tipe pendukung `DatepickerType`, `DateRange`, `DatepickerSingleProps`, dan
  `DatepickerRangeProps` ikut diekspor.
- **`Dropdown`** — panel yang dibuka dari sebuah tombol (`trigger`), memakai
  HTML Popover API sehingga browser yang mengurus penutupan, top layer, dan
  urutan fokus. Barisnya diisi lewat `items`, atau `groups` bila perlu dipisah
  — `separator` di sana artinya sama persis dengan pada Sidebar. Panel yang
  isinya bukan daftar baris diisi lewat `children` dan diberi jarak lewat
  `contentClassName`.

  Punya dua peran. Bawaannya menu aksi: tiap baris sebuah tombol atau tautan,
  ditelusuri dengan Tab. Begitu ada baris yang memakai `selected`, ia jadi
  daftar pilihan — `listbox` berisi `option` yang ditelusuri dengan panah,
  Home/End, atau dengan mengetik huruf awalnya. Rupa panelnya sama persis di
  kedua peran; `selected` menandai baris aktif bagi pembaca layar dan menaruh
  fokus di sana saat panel dibuka, tanpa warna baru. Prop `attached` menempelkannya
  pada tombol pemicunya: selebar tombol itu, dan ikut bergerak saat halaman
  digulir. `contentLabel` memberi panelnya nama bagi pembaca layar. Ketiga prop
  itulah yang dipakai Select dan Search untuk daftar pilihannya, jadi panel
  melayang di seluruh kit ini hanya ada satu.

  Tipe pendukung `DropdownItem` dan `DropdownGroup` ikut diekspor.
- **`FloatingLabel`: prop `darkMode`** — tampilan gelap sesuai desain: kotak
  gray-800 dengan teks, ikon, dan tombol hapus gray-400. Garis aksen tidak
  berubah, tetapi label yang naik satu tingkat lebih terang (primary-500,
  purple-400 untuk simaya). Pada `error` hanya garis dan label yang merah.
- **`InputField`: prop `darkMode`** — tampilan gelap sesuai desain: field
  gray-800 dengan label putih; garisnya menyatu dengan latar kecuali saat
  `typing` (warna aplikasi) dan `failed` (red-500). Teks yang diketik putih,
  placeholder dan caption abu-abu.
- **`Modal`** — dialog berbasis elemen `<dialog>` native, jadi top layer,
  penguncian fokus, dan latar inert diurus browser. Dikendalikan lewat `open` +
  `onClose`. Susunannya diisi prop — `title` untuk header, `children` untuk
  badannya, `footer` untuk kakinya — dengan pilihan ukuran lewat `size` dan
  tombol tutup yang bisa dimatikan lewat `dismissible`.
- **`Popover`** — panel informasi ringkas dengan arrow pada empat pilihan sisi
  (`side`: `top`, `right`, `bottom`, `left`).
- **`Radio`: prop `darkMode`** — tampilan gelap sesuai desain: lingkaran
  gray-300 bergaris gray-400, label gray-50, dan caption gray-400. Cincin
  pilihan aktif tetap memakai warna aplikasi. `inactive` memakai lingkaran
  gray-800 dengan teks gray-600.
- **`Search`: prop `darkMode`** — kolom pencarian dengan tombol cari. Tampilan gelap: field berlatar gray-800 dengan teks terang, sementara dropdown kategori menggunakan latar gray-700. Dua ukuran lewat
  `platform` (`default` 54px, `mobile` 50px). Mengisi prop `categories` akan
  mengubahnya jadi varian tiga ruas: dropdown kategori, isian, lalu tombol
  ikon. Daftar kategorinya panel Dropdown, sama dengan daftar pilihan Select.
  Tipe pendukung `SearchCategory` ikut diekspor.
- **`Select`: prop `darkMode`** — tampilan gelap sesuai desain: field gray-800
  dengan label terang dan placeholder gray-400. Garis state default menyatu
  dengan latar (baru terlihat saat difokus); `inactive` bergaris gray-300
  dengan teks dan panah gray-500. Panel daftar pilihannya tetap terang.
- **`Sidebar`** — navigasi samping dengan menu tunggal (`items`) atau
  terkelompok (`groups`), submenu, area profil (`user`), dan mode ringkas
  (`collapsed` + `onCollapse`). Dilengkapi dengan prop `darkMode` untuk tampilan gelap (latar belakang gray-800, menu aktif & profil gray-700, teks menu & ikon aktif gray-50, serta ikon inaktif gray-400). Tipe pendukung `SidebarItem`, `SidebarSubItem`,
  `SidebarGroup`, dan `SidebarUser` ikut diekspor.
- **`Spinner`** — indikator proses dalam ukuran `default` dan `large`.
- **`TextArea`: prop `darkMode`** — tampilan gelap sesuai desain: kotak,
  toolbar, dan area isian gray-800 dengan label putih. Bingkai editor dan garis
  pemisah toolbar tetap gray-300; tombol kirim memakai -600 (hover -700).
- **`Toast`: prop `darkMode`** — tampilan gelap sesuai desain: kartu gray-800,
  heading gray-300, teks lainnya gray-400, dan badge ikon berlatar gelap (-800;
  success -900) dengan ikon -400. Tombol tutup dan tombol di `actions` tidak
  berubah. Bawaannya `false`, jadi Toast yang sudah ada tetap terang.
- **`Upload`: prop `darkMode`** — pemilih berkas dalam dua bentuk lewat `type`: `default`
  (tombol pilih berkas + nama berkas terpilih, dua ukuran lewat `platform`) dan
  `attach` (area seret-lepas bergaris putus-putus setinggi 230px). Tampilan gelap menyesuaikan warna latar (`gray-800`), teks, batas komponen (`gray-700`), serta status interaksi `drag`. Membungkus
  `<input type="file">` sungguhan, jadi dialog berkas dan pengiriman formulir
  bekerja apa adanya.
- Tipe **`NavbarContextItem`**, dipakai sebagai bentuk dasar item kontekstual
  pada Navbar.
- Kelas **`.ds-scroll-y`** — scrollbar vertikal tipis untuk panel yang digulir:
  batang 6px membulat berwarna gray-300 (gray-400 saat kursor di atasnya),
  tanpa tombol panah. Pasangan `.ds-scroll-x`.

### Diubah

- **Memutus — `contextualItems` pada Navbar tidak lagi menerima `false`.**

  ```diff
  - contextualItems?: NavbarSubItem[] | false
  + contextualItems?: NavbarContextItem[]
  ```

  Berlaku pada `NavbarItem` maupun `NavbarSubItem`. Kode yang menulis
  `contextualItems={false}` untuk mematikan item kontekstual akan gagal
  dikompilasi. Penggantinya: hilangkan propnya, atau isi array kosong.

  `NavbarSubItem` kini merupakan turunan `NavbarContextItem` dengan tambahan
  `contextualItems`, dan `onNavigate` menerima ketiga bentuk item tersebut.

- **Memutus — aksi toolbar `upload` pada TextArea kini `download`.**

  ```diff
  - | 'upload'
  + | 'download'
  ```

  Alat terakhir toolbar editor di desain adalah unduh (panah turun ke baki),
  bukan unggah, jadi nama aksi dan labelnya ikut diganti (`Unduh`). Di
  TypeScript, kode yang memeriksa `'upload'` di `onToolbarAction` akan gagal
  dikompilasi; di JavaScript cabangnya tidak pernah terpanggil lagi. Ganti
  dengan `'download'`.

### Diperbaiki

- **`Sidebar`: logo tidak lagi meleset dari sumbu saat ringkas.** Pembungkus
  logonya satu-satunya yang dirapatkan ke kanan di dalam kotak isi 40px, jadi
  mark 32px duduk 4px di sebelah kanan tombol lipat dan avatar yang sudah di
  tengah. Hanya berpengaruh pada keadaan `collapsed`.
- **`TextArea`: ikon toolbar editor kini sesuai desain.** Sebelumnya ikon garis
  dari pustaka yang lebih kecil di dalam kotak 16px-nya; kini ikon berisi yang
  disalin dari desain, dengan jarak antarikon 15px.

## [0.1.0] - 2026-09-01

Rilis pertama ke npm.

### Ditambahkan

- **Sembilan belas komponen**: `Alert`, `Badge`, `Breadcrumb`, `Button`, `Card`,
  `Checkbox`, `Container`, `FloatingLabel`, `Footer`, `Hero`, `Icon`,
  `InputField`, `Navbar`, `Pagination`, `Radio`, `Select`, `TextArea`, `Toast`,
  dan `Toggle`.
- **Subpath ikon**: `@ceplok-ui/design-kit-react/icons/outline` dan
  `.../icons/solid`, meneruskan ikon `flowbite-react-icons` sebagai impor
  bernama yang tetap bisa di-tree-shake.
- **CSS sumber**, bukan CSS terkompilasi: `@ceplok-ui/design-kit-react/styles.css`
  (token `@theme`, font Lato, base layer, dan kelas `.ds-*`) serta
  `.../tokens.css` bila hanya tokennya yang dibutuhkan.
- Utilitas `cn` dan kumpulan `brandIcons`.
- Peer dependency: `react >=18`, `react-dom >=18`, `tailwindcss ^4`. React dan
  Tailwind sengaja tidak ikut di-bundle.

### Catatan pemasangan

Consumer wajib menambahkan baris `@source` yang menunjuk `dist` package ini —
Tailwind v4 tidak memindai `node_modules` secara otomatis. Tanpa baris itu
komponen tetap ter-render, tetapi tanpa satu pun class utility-nya, dan tidak
ada pesan error apa pun. Rinciannya ada di README bagian **Pakai**.
