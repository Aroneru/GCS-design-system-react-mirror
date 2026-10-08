# Changelog

Perubahan penting pada `@ceplok-ui/design-kit-react` dicatat di berkas ini.

Formatnya mengikuti [Keep a Changelog](https://keepachangelog.com/id/1.1.0/) dan
penomorannya mengikuti [Semantic Versioning](https://semver.org/lang/id/).

> Selama versi masih di bawah `1.0.0`, semver mengizinkan perubahan yang memutus
> kompatibilitas masuk di rilis **minor**. Jadi jangan anggap `0.x` aman dinaikkan
> begitu saja — baca bagian **Diubah** sebelum memperbarui.

## [Belum dirilis]

### Diubah

- **Kotak `Datepicker` `single` kini selebar 325px, juga di desktop.** Desain
  desktop dan mobile-nya memakai kotak yang sama lebarnya. Panel desktopnya
  tetap 284px; sebelumnya kotaknya ikut 284px, selebar panel.

### Ditambahkan

- **`Datepicker`: `platform="mobile"`** — tata letak mobile sesuai desainnya.
  Ketiga bentuk selebar 325px dan panelnya selebar kotak. `single` menaruh
  kisi tanggalnya di tengah panel, `period` memuat Hari ini, Minggu ini, Bulan
  ini, dan Hapus dalam satu baris, dan `multiple` menumpuk kotak tanggal
  selesai di bawah kotak tanggal mulai serta kalender kedua di bawah yang
  pertama, dengan tombol dua kolom. Tipe `DatepickerPlatform` ikut diekspor.
- **`InputField`: `type="password"`** — isian kata sandi sesuai desain:
  isiannya disamarkan, ikon gembok tampil di kiri, dan tombol mata di kanan
  menampilkan atau menyembunyikan kata sandi (`aria-pressed` mengikuti
  keadaannya). Gembok bisa diganti lewat `icon`, atau dihilangkan dengan
  `icon={null}`. Mengikuti desainnya, di platform `mobile` label, isian, dan
  caption-nya 12px, dan saat `failed` di tampilan gelap ikon, placeholder, serta
  caption memakai red-500. Keduanya berbeda dari type teks.

### Diperbaiki

- **`Datepicker`: panel tidak lagi terpotong tepi layar.** Bila panel tidak
  muat di bawah maupun di atas kotaknya, tingginya kini dibatasi ruang di sisi
  yang lebih lapang dan isinya digulir di dalam panel. Sebelumnya bagian
  bawahnya terpotong sampai halaman digulir, atau, saat dibalik ke atas,
  panelnya menutupi kotak tanggal. Paling terasa di ponsel: panel `multiple`
  mobile tingginya 566–662px.

## [0.3.1] - 2026-10-06

Rilis perbaikan kecil. README di halaman npm ikut diperbarui: kini ada bagian
Table, dan baris props Button sudah dibetulkan (`type="iconOnly"`,
`as="anchor"`).

### Diperbaiki

- **`Footer`: ukuran teks menu dan hak cipta kini dipatok 16px.** Di 0.3.0
  keduanya memakai kelas `text-md`, yang tidak dikenal Tailwind, sehingga tidak
  menghasilkan CSS apa pun dan ukurannya ikut elemen induk: 16px di halaman
  biasa, tetapi bisa lain di dalam wadah yang mengatur ukuran teksnya sendiri.

## [0.3.0] - 2026-10-06

Rilis pertama dengan nama `@ceplok-ui/design-kit-react`. Sebelumnya paket ini
terbit sebagai `@stasi/design-kit-react`, yang kini ditandai deprecated.
Dibanding 0.2.0 ada enam perubahan yang memutus, termasuk nama paketnya.

### Diubah

- **Memutus — nama paket kini `@ceplok-ui/design-kit-react`.** Sebelumnya
  `@stasi/design-kit-react`. Pasang paket baru, hapus yang lama, lalu ganti
  namanya di setiap import — termasuk subpath ikon — dan di CSS:

  ```sh
  npm install @ceplok-ui/design-kit-react
  npm uninstall @stasi/design-kit-react
  ```

  ```diff
  - import { Button } from '@stasi/design-kit-react'
  - import { User } from '@stasi/design-kit-react/icons/outline'
  + import { Button } from '@ceplok-ui/design-kit-react'
  + import { User } from '@ceplok-ui/design-kit-react/icons/outline'
  ```

  ```diff
  - @import '@stasi/design-kit-react/styles.css';
  - @source '../node_modules/@stasi/design-kit-react/dist/**/*.js';
  + @import '@ceplok-ui/design-kit-react/styles.css';
  + @source '../node_modules/@ceplok-ui/design-kit-react/dist/**/*.js';
  ```

  Jangan lupa baris `@source`: kalau masih menunjuk folder lama, Tailwind tidak
  menemukan kelas milik komponen, sehingga tampilannya berantakan.

- **Memutus — `Modal` kini dibuka oleh tombol `trigger`, tanpa `open` dan
  `onClose`.** Modal mengurus sendiri buka-tutupnya: tombol yang diberikan lewat
  `trigger` membukanya, sedangkan tombol tutup, klik latar, dan Esc menutupnya —
  masing-masing bisa dimatikan lewat `showCloseButton`, `closeOnBackdrop`, dan
  `closeOnEscape`. `ModalHeader`, `ModalBody`, dan `ModalFooter` dihapus;
  isinya kini diisi lewat `title`, `children`, dan `footer`. `footer` boleh
  berupa fungsi yang menerima `close`, untuk tombol yang menutup Modal.

  ```diff
  - <Button onClick={() => setOpen(true)}>Buka</Button>
  - <Modal open={open} onClose={() => setOpen(false)}>
  -   <ModalHeader>Ketentuan Layanan</ModalHeader>
  -   <ModalBody>…</ModalBody>
  -   <ModalFooter>
  -     <Button onClick={() => setOpen(false)}>Setuju</Button>
  -   </ModalFooter>
  - </Modal>
  + <Modal
  +   trigger={<Button>Buka</Button>}
  +   title="Ketentuan Layanan"
  +   footer={({ close }) => <Button onClick={close}>Setuju</Button>}
  + >
  +   …
  + </Modal>
  ```

  Tidak ada lagi prop untuk membukanya dari kode, jadi Modal selalu dibuka oleh
  tombol `trigger`. Variant baru `popup` untuk konten ringkas: tanpa `title`
  dan `size`, dengan footer tanpa garis pemisah. Tipe pendukung `ModalVariant`
  ikut diekspor.

- **Memutus — `Popover` kini menempel pada `trigger`.** Di 0.2.0 Popover hanya
  panel diam yang ditempatkan sendiri; kini ia terbuka saat elemen `trigger`
  diklik dan melayang di sisi yang dipilih lewat `side`. Prop `trigger` wajib,
  jadi kode lama gagal dikompilasi. Buka-tutupnya bisa dikendalikan lewat
  `open` + `onOpenChange`, atau diberi nilai awal lewat `defaultOpen`.

  ```diff
  - <Popover title="Info" side="top">…</Popover>
  + <Popover trigger={<Button>Info</Button>} title="Info" side="top">
  +   …
  + </Popover>
  ```

- **Memutus — `theme="purple"` pada `Button` dan `Pagination` kini
  `theme="simaya"`.** Namanya kini sama dengan nilai `application` pada komponen
  form; warnanya tidak berubah.

  ```diff
  - <Button theme="purple">Kirim</Button>
  + <Button theme="simaya">Kirim</Button>
  ```

- **Memutus — `as="a"` pada `Button` kini `as="anchor"`.** Nilai lama tidak
  lagi dikenali. Di TypeScript kodenya gagal dikompilasi; di JavaScript Button
  jatuh ke `<button>` biasa, jadi `href`-nya tidak lagi membuka apa pun.

  ```diff
  - <Button as="a" href="/daftar">Daftar</Button>
  + <Button as="anchor" href="/daftar">Daftar</Button>
  ```

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

- **`Button`: hover varian `outline` bertema `gray` lebih tegas.** Latarnya kini
  gray-100 (sebelumnya gray-50), dan teks serta garisnya ikut menggelap:
  gray-700 pada `tone="light"`, gray-900 pada `tone="dark"`.
- **`Footer`: logo, teks, dan ikon dibesarkan; menu dipusatkan.** Logo dari 40px
  (44px saat footer ≥ 768px) jadi 48px (60px). Ukuran lama dipatok untuk logo
  yang isinya cuma mark; begitu logonya berupa lockup dengan baris nama
  instansi, baris itu jatuh ke sekitar 6px dan berhenti terbaca. Consumer yang
  logonya mark polos akan melihatnya membesar — pakai `logoContent` bila ukuran
  lamanya memang disengaja. Menu kini disusun per baris berisi paling banyak
  lima, dan setiap baris dipusatkan, termasuk baris sisa yang lebih pendek dan
  saat footer sempit. Teks menu dan hak cipta naik dari 14px ke 16px, ikon
  media sosial dari 22px ke 26px.
- **`Select`: daftar pilihannya kini panel Dropdown**, bukan popup milik sistem
  operasi, jadi rupanya seragam dengan menu lain di kit ini. API-nya tidak
  berubah: nilainya tetap dibawa elemen `<select>` yang dirender tersembunyi,
  sehingga `value`, `onChange`, `name`, dan pengiriman formulir bekerja seperti
  sebelumnya, dan `<option>` maupun `<optgroup>` yang ditulis sebagai `children`
  dibaca lalu tampil di panel yang sama. Dua hal yang akan terasa berbeda: di
  ponsel tidak lagi muncul pemilih layar penuh milik sistem, dan `ref` masih
  menunjuk `<select>` yang kini tersembunyi — memanggil `.focus()` padanya tidak
  lagi memfokuskan field yang terlihat.
- **`Sidebar`: rupa dan perilaku menu disesuaikan.** Latar menu aktif dan saat
  di-hover kini gray-100 (sebelumnya gray-50). Ikon menu diwarnai Sidebar —
  gray-500, lalu gray-900 saat aktif atau di-hover — dan dipatok 20px, termasuk
  ikon submenu yang sebelumnya 16px. Panah tombol lipat dan panah submenu
  membesar dari 16px ke 28px. Tombol lipat kini hanya muncul bila ada menu yang
  memakai ikon, karena saat ringkas hanya ikonnya yang tersisa. Menu, submenu,
  dan profil yang `href`-nya kosong atau `"#"` tidak lagi menavigasi saat
  diklik.

### Ditambahkan

- **`Alert`: prop `darkMode`** — tampilan gelap: latar gray-800 untuk semua
  variant, dengan ikon, heading, dan tombol tutup -300 serta isi pesan -400.
  Isi `actions` tidak ikut diubah, jadi pilih warna tombol yang kontras di atas
  gray-800. Bawaannya `false`, jadi Alert yang sudah ada tetap terang.
- **`Avatar`** — lingkaran identitas berisi foto (`src`) atau inisial
  (`initials`) dalam tiga ukuran lewat `size` (`small` 24px, `default` 32px,
  `large` 80px). Gambar yang gagal dimuat jatuh sendiri ke inisial. Prop
  `darkMode` hanya mengganti warna latar inisial; fotonya tidak diubah. Tipe
  pendukung `AvatarSize` ikut diekspor.
- **`Breadcrumb`: prop `darkMode`** — tampilan gelap: menu aktif gray-300, menu
  lain dan ikon pemisah gray-400. `BreadcrumbItem` kini juga menerima `onClick`,
  misalnya untuk menangani navigasi sendiri.
- **`Card`, `Container`, dan `Hero`: prop `darkMode`** — tampilan gelap. Card
  menjadi kartu gray-800 dengan judul putih, deskripsi gray-400, dan tautan
  primary-500; Container memberi latar gray-800 dan teks gray-300 pada elemen
  dalamnya; Hero hanya mengganti warna latar dan teks. Bawaannya `false`, jadi
  tampilan yang sudah ada tetap terang.
- **`Checkbox`: prop `darkMode`** — tampilan gelap sesuai desain: kotak
  gray-700 bergaris gray-600, label putih, dan caption gray-400. Kotak yang
  tercentang tetap memakai warna aplikasi. `inactive` meredupkan label dan
  caption ke gray-500.
- **`Clipboard`** — nilai hanya-baca dengan tombol salin. Dua bentuk lewat
  `variant`: `default` dan `segmented`, yang menambahkan `prefix` di depan nilai
  (hanya tampilan, tidak ikut tersalin). Dua ukuran lewat `platform`, tampilan
  gelap lewat `darkMode`, serta `onCopySuccess` dan `onCopyError` untuk
  menanggapi hasil salin. Tipe pendukung `ClipboardVariant` dan
  `ClipboardPlatform` ikut diekspor.
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

  Prop `darkMode` memberinya tampilan gelap.

  Tipe pendukung `DatepickerType`, `DateRange`, `DatepickerSingleProps`, dan
  `DatepickerRangeProps` ikut diekspor.
- **`Drawer`** — panel yang meluncur dari tepi layar, dikendalikan lewat
  `open` + `onClose`; klik latar dan Esc menutupnya, kecuali dimatikan lewat
  `closeOnOverlayClick` dan `closeOnEsc`. Sisinya dipilih lewat `position`
  (`right`, `left`, `top`, `bottom`) dan ukurannya lewat `size` (`s`, `m`, `l`,
  `xl`, `full`). Isinya menu navigasi lewat `items` — lengkap dengan submenu dan
  `badge` — atau susunan sendiri dari `DrawerHeader`, `DrawerTitle`,
  `DrawerDescription`, `DrawerBody`, dan `DrawerFooter`. Komponen pendukung
  `DrawerTrigger`, `DrawerNavItem`, dan `DrawerSubItem` serta tipe-tipenya ikut
  diekspor.
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

  Baris berisiko diberi `tone: 'danger'` agar tampil merah. Prop `darkMode`
  mengganti panel dan baris bawaannya; isi `children` mengatur warnanya sendiri.

  Tipe pendukung `DropdownItem`, `DropdownGroup`, dan `DropdownItemTone` ikut
  diekspor.
- **`FloatingLabel`: prop `darkMode`** — tampilan gelap sesuai desain: kotak
  gray-800 dengan teks, ikon, dan tombol hapus gray-400. Garis aksen tidak
  berubah, tetapi label yang naik satu tingkat lebih terang (primary-500,
  purple-400 untuk simaya). Pada `error` hanya garis dan label yang merah.
- **`InputField`: prop `darkMode`** — tampilan gelap sesuai desain: field
  gray-800 dengan label putih; garisnya menyatu dengan latar kecuali saat
  `typing` (warna aplikasi) dan `failed` (red-500). Teks yang diketik putih,
  placeholder dan caption abu-abu.
- **`Pagination`: prop `darkMode` dan `size`** — tampilan gelap: latar navigasi
  gray-800, garis tepi gray-700, teks dan panah yang tidak aktif gray-400; item
  yang di-hover berlatar gray-700, dan item aktif mengikuti `theme` di atas
  gray-700. `size` memilih kotak 40px (`base`, bawaan) atau 32px (`s`);
  `responsive` memakai 32px lalu 40px saat container terdekat ≥ 512px, jadi
  butuh induk ber-`@container` seperti di dalam Table. Tipe pendukung
  `PaginationSize` ikut diekspor.
- **`Popover`: prop `darkMode`** — tampilan gelap untuk panelnya.
- **`Radio`: prop `darkMode`** — tampilan gelap sesuai desain: lingkaran
  gray-300 bergaris gray-400, label gray-50, dan caption gray-400. Cincin
  pilihan aktif tetap memakai warna aplikasi. `inactive` memakai lingkaran
  gray-800 dengan teks gray-600.
- **`Search`** — kolom pencarian dengan tombol cari. Dua ukuran lewat `platform`
  (`default` 54px, `mobile` 50px) dan warna aksen lewat `application`. Mengisi
  prop `categories` mengubahnya jadi varian tiga ruas setinggi 39px: dropdown
  kategori, isian, lalu tombol ikon. Daftar kategorinya panel Dropdown, sama
  dengan daftar pilihan Select. Prop `darkMode` memberinya tampilan gelap: field
  gray-800 dengan teks terang, dan dropdown kategori berlatar gray-700. Tipe
  pendukung `SearchCategory`, `SearchPlatform`, dan `SearchApplication` ikut
  diekspor.
- **`Select`: prop `darkMode`** — tampilan gelap sesuai desain: field gray-800
  dengan label terang dan placeholder gray-400. Garis state default menyatu
  dengan latar (baru terlihat saat difokus); `inactive` bergaris gray-300
  dengan teks dan panah gray-500. Panel daftar pilihannya tetap terang.
- **`Sidebar`: prop `darkMode`, `sticky`, dan `footer`** — `darkMode` memberi
  tampilan gelap: latar gray-800, menu aktif dan profil gray-700, teks menu dan
  ikon aktif gray-50, ikon lain gray-400. `sticky` menempelkan Sidebar di atas
  viewport setinggi satu layar. `footer` mengisi kaki Sidebar di bawah daftar
  menu — versi aplikasi, tautan bantuan — dan tetap terlihat meski menunya
  panjang dan digulir. `SidebarItem`, `SidebarSubItem`, dan `SidebarUser` kini
  juga menerima `onClick`.
- **`Table`** — tabel data dari `columns` dan `data`, dengan `rowKey` sebagai
  kunci tiap baris; tanpa `columns`, kolomnya dibuat dari field baris pertama.
  Toolbar-nya bisa memuat kotak pencarian (`search`, yang meneruskan atributnya
  ke `<input>` — penyaringan `data` tetap urusan pemakai), tombol Filter Data
  (`filter`) untuk memilih kolom yang tampil, dan isi bebas di kanan
  (`actions`). Mendukung judul kolom bertingkat (`children` pada kolom), seleksi
  baris (`selectable`), pengurutan (`sortable` pada kolom, `sort`), pagination
  (`pagination`), kolom yang menempel saat digulir ke samping (`sticky`), dua
  kerapatan baris lewat `size` (`normal`, `compact`), serta keadaan `loading`
  dan `emptyText`. Pengurutan dan pembagian halaman dikerjakan tabel sendiri;
  untuk data dari server pasang `manual`. Sel bisa berisi deretan tombol aksi
  (`actions` pada kolom) dan gambar dengan pratinjau (`image` pada kolom, atau
  komponen `TableImage`). Toolbar dan pagination-nya menyesuaikan lebar tabel,
  bukan lebar layar. Tipe pendukungnya ikut diekspor, antara lain
  `TableColumn`, `TableRowAction`, `TableSort`, dan `TablePaginationConfig`.
- **`TextArea`: prop `darkMode`** — tampilan gelap sesuai desain: kotak,
  toolbar, dan area isian gray-800 dengan label putih. Bingkai editor dan garis
  pemisah toolbar tetap gray-300; tombol kirim memakai -600 (hover -700).
- **`Toast`: prop `darkMode`** — tampilan gelap sesuai desain: kartu gray-800,
  heading gray-300, teks lainnya gray-400, dan badge ikon berlatar gelap (-800;
  success -900) dengan ikon -400. Tombol tutup dan tombol di `actions` tidak
  berubah. Bawaannya `false`, jadi Toast yang sudah ada tetap terang.
- **`Toggle`: prop `darkMode`** — tampilan gelap sesuai desain: jalur gray-600
  dengan bulatan gray-400, label putih, dan caption gray-400. Saat menyala,
  jalurnya tetap memakai warna aplikasi dan bulatannya putih. `inactive` hanya
  meredupkan label ke gray-500.
- **`Upload`** — pemilih berkas dalam dua bentuk lewat `type`: `default` (tombol
  pilih berkas + nama berkas terpilih, dua ukuran lewat `platform`) dan `attach`
  (area seret-lepas bergaris putus-putus setinggi 230px). Warna tombolnya
  mengikuti `application`; pada `attach` warna itu hanya terlihat saat berkas
  sedang diseret. Membungkus `<input type="file">` sungguhan, jadi dialog berkas
  dan pengiriman formulir bekerja apa adanya. Prop `darkMode` menyesuaikan latar
  (gray-800), teks, garis (gray-700), dan tampilan saat berkas diseret. Tipe
  pendukung `UploadType`, `UploadPlatform`, dan `UploadApplication` ikut
  diekspor.
- Kelas **`.ds-scroll-y`** — scrollbar vertikal tipis untuk panel yang digulir:
  batang 6px membulat berwarna gray-300 (gray-400 saat kursor di atasnya),
  tanpa tombol panah. Pasangan `.ds-scroll-x`.

### Diperbaiki

- **`FloatingLabel`: label field yang nonaktif kini gray-400.** Sebelumnya
  kelas gray-500 bawaan ikut terpasang dan menang di urutan CSS, jadi labelnya
  tidak ikut meredup bersama isiannya.
- **`Sidebar`: logo tidak lagi meleset dari sumbu saat ringkas.** Pembungkus
  logonya satu-satunya yang dirapatkan ke kanan di dalam kotak isi 40px, jadi
  mark 32px duduk 4px di sebelah kanan tombol lipat dan avatar yang sudah di
  tengah. Hanya berpengaruh pada keadaan `collapsed`.
- **`TextArea`: ikon toolbar editor kini sesuai desain.** Sebelumnya ikon garis
  dari pustaka yang lebih kecil di dalam kotak 16px-nya; kini ikon berisi yang
  disalin dari desain, dengan jarak antarikon 15px.

## [0.2.0] - 2026-09-01

Terbit sebagai `@stasi/design-kit-react`. Catatannya disusun belakangan dari
paket yang terbit.

### Ditambahkan

- **`Modal`** — dialog berbasis elemen `<dialog>` bawaan, jadi top layer,
  penguncian fokus, dan latar inert diurus browser. Dikendalikan lewat `open` +
  `onClose`, dengan dua ukuran lewat `size` (`s`, `m`) dan susunan
  `ModalHeader`, `ModalBody`, `ModalFooter`. Bentuk ini diganti di 0.3.0.
- **`Popover`** — panel informasi ringkas berjudul (`title`) dengan arrow pada
  empat pilihan sisi (`side`: `top`, `right`, `bottom`, `left`).
- **`Sidebar`** — navigasi samping dengan menu tunggal (`items`) atau
  terkelompok (`groups`), submenu, logo (`logo`, `collapsedLogo`), area profil
  (`user`), dan mode ringkas (`collapsed` + `onCollapse`). Tipe pendukung
  `SidebarItem`, `SidebarSubItem`, `SidebarGroup`, dan `SidebarUser` ikut
  diekspor.
- **`Spinner`** — indikator proses dalam ukuran `default` dan `large`.
- Tipe **`NavbarContextItem`**, dipakai sebagai bentuk dasar item kontekstual
  pada Navbar.

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

## [0.1.0] - 2026-09-01

Rilis pertama ke npm, dengan nama `@stasi/design-kit-react`.

### Ditambahkan

- **Sembilan belas komponen**: `Alert`, `Badge`, `Breadcrumb`, `Button`, `Card`,
  `Checkbox`, `Container`, `FloatingLabel`, `Footer`, `Hero`, `Icon`,
  `InputField`, `Navbar`, `Pagination`, `Radio`, `Select`, `TextArea`, `Toast`,
  dan `Toggle`.
- **Subpath ikon**: `@stasi/design-kit-react/icons/outline` dan
  `.../icons/solid`, meneruskan ikon `flowbite-react-icons` sebagai impor
  bernama yang tetap bisa di-tree-shake.
- **CSS sumber**, bukan CSS terkompilasi: `@stasi/design-kit-react/styles.css`
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
