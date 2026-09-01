# Changelog

Perubahan penting pada `@stasi/design-kit-react` dicatat di berkas ini.

Formatnya mengikuti [Keep a Changelog](https://keepachangelog.com/id/1.1.0/) dan
penomorannya mengikuti [Semantic Versioning](https://semver.org/lang/id/).

> Selama versi masih di bawah `1.0.0`, semver mengizinkan perubahan yang memutus
> kompatibilitas masuk di rilis **minor**. Jadi jangan anggap `0.x` aman dinaikkan
> begitu saja — baca bagian **Diubah** sebelum memperbarui.

## [Belum dirilis]

Perubahan di bawah ini sudah ada di kode tetapi belum diterbitkan ke npm.
Isinya menjadikan rilis berikutnya `0.2.0`, bukan `0.1.1`: ada empat komponen
publik baru, dan satu perubahan yang memutus.

### Ditambahkan

- **`Modal`**, beserta `ModalHeader`, `ModalBody`, dan `ModalFooter`. Dialog
  berbasis elemen `<dialog>` native, jadi top layer, penguncian fokus, dan latar
  inert diurus browser. Dikendalikan lewat `open` + `onClose`, dengan pilihan
  ukuran melalui `size`.
- **`Popover`** — panel informasi ringkas dengan arrow pada empat pilihan sisi
  (`side`: `top`, `right`, `bottom`, `left`).
- **`Sidebar`** — navigasi samping dengan menu tunggal (`items`) atau
  terkelompok (`groups`), submenu, area profil (`user`), dan mode ringkas
  (`collapsed` + `onCollapse`). Tipe pendukung `SidebarItem`, `SidebarSubItem`,
  `SidebarGroup`, dan `SidebarUser` ikut diekspor.
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

Rilis pertama ke npm.

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
