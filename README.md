# @ceplok-ui/design-kit-react

Design tokens, tipografi, dan komponen **React (Tailwind v4)** untuk
Ceplok Design System. Dipindahkan 1:1 dari versi Laravel/Blade
(`tpl/design-kit`) ke komponen React yang bisa dipublish lewat NPM.

## Isi

- **Tokens** (`@theme`): palet warna (primary, gray, red, orange, yellow, green,
  purple), semantic aliases (`brand`, `feedback-*`, `content`,
  `surface`, `border`), skala tipografi (`display` → `caption`), spacing, radius,
  shadow, font Lato.
- **Komponen umum**: `Alert`, `Avatar`, `Badge`, `Breadcrumb`, `Button`, `Card`,
  `Clipboard`, `Container`, `Drawer`, `Dropdown`, `Footer`, `Hero`, `Icon`,
  `Modal`, `Navbar`, `Pagination`, `Popover`, `Sidebar`, `Spinner`, `Table`,
  `Toast`.
- **Komponen form**: `InputField`, `FloatingLabel`, `TextArea`, `Select`,
  `Search`, `Datepicker`, `Upload`, `Radio`, `Toggle`, `Checkbox`.
- **Ikon**: logo brand & sosial (`Github`, `Instagram`, …) dari barrel utama,
  plus ikon UI lewat subpath `icons/outline` dan `icons/solid`.

## Install

```bash
npm install @ceplok-ui/design-kit-react
```

Peer deps: `react >=18`, `react-dom >=18`, `tailwindcss ^4`. Ketiganya disediakan
consumer — package ini tidak mem-bundle React maupun Tailwind.

## Pakai

Package mengirim **CSS sumber**, bukan CSS yang sudah dikompilasi. Artinya
consumer wajib memakai Tailwind v4, dan setup-nya cuma dua baris di file CSS
kamu:

```css
/* src/index.css */
@import '@ceplok-ui/design-kit-react/styles.css';
@source '../node_modules/@ceplok-ui/design-kit-react/dist/**/*.js';
```

Jangan menambahkan `@import 'tailwindcss'` lagi — `styles.css` sudah memanggilnya
berikut token `@theme`, font Lato, base layer, dan class `.ds-*`.

```tsx
// main.tsx
import './index.css'
import { Button, Card, InputField } from '@ceplok-ui/design-kit-react'
import { User } from '@ceplok-ui/design-kit-react/icons/outline'

export default function App() {
  return (
    <Card title="Halo" description="Kartu dari design kit">
      <InputField label="Nama lengkap" icon={<User className="size-4" />} />
      <Button>Simpan</Button>
    </Card>
  )
}
```

### Wajib: baris `@source`

Tailwind v4 **tidak memindai `node_modules`** saat mendeteksi sumber class secara
otomatis. Tanpa baris `@source` di atas, komponen tetap ter-render tetapi tanpa
satu pun class utility-nya — tidak ada error, hanya tampilan yang berantakan.
Bedanya terukur:

| Setup            | Ukuran CSS | `h-9.25` (Select) | `size-3.5` | `bg-brand` |
| ---------------- | ---------- | ----------------- | ---------- | ---------- |
| tanpa `@source`  | 13,6 kB    | hilang            | hilang     | hilang     |
| dengan `@source` | 27,3 kB    | ada               | ada        | ada        |

### Alternatif: hanya token, tanpa base style kit

Kalau project kamu sudah punya base style sendiri dan hanya butuh token:

```css
@import 'tailwindcss';
@import '@ceplok-ui/design-kit-react/tokens.css';
@source '../node_modules/@ceplok-ui/design-kit-react/dist/**/*.js';
```

Token dan seluruh utility komponen tetap ter-generate, tapi kamu **kehilangan**
font Lato, base layer (`body`, focus ring global), dan class `.ds-card` /
`.ds-eyebrow` / `.ds-nav-link` / `.ds-scroll-x` / `.ds-scroll-y`.

## Komponen & props

### Umum

| Komponen     | Props utama                                                                                                          |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| `Button`     | `variant`: `filled \| outline`, `theme`, `tone`, `size`, `type`: `button \| iconOnly`, `as`: `button \| anchor`      |
| `Badge`      | `variant`: `gray \| brand \| danger \| warning \| success`, `size`: `sm \| lg`, `icon`, `dismissible`, `onDismiss`, `open`, `darkMode` |
| `Avatar`     | `src`, `alt`, `initials`, `size`: `small \| default \| large`, `darkMode`                                            |
| `Spinner`    | `size`: `default \| large`                                                                                           |
| `Clipboard`  | `value`, `variant`: `default \| segmented`, `prefix`, `label`, `helperText`, `platform`, `onCopySuccess`, `darkMode` |
| `Alert`      | `variant`, `heading`, `icon`, `dismissible`, `actions`, `darkMode`                                                   |
| `Toast`      | `variant`, `heading`, `icon`, `dismissible`, `actions`, `darkMode`                                                   |
| `Card`       | `image`, `title`, `description`, `href`, `linkLabel`, `actions`, `darkMode`                                          |
| `Container`  | `as` (default `div`), `padded` (default `true`), `darkMode`                                                          |
| `Icon`       | `children` (SVG dengan `currentColor`)                                                                               |
| `Popover`    | `trigger`, `title`, `side`, `open`/`defaultOpen`/`onOpenChange`, `darkMode`                                          |
| `Dropdown`   | `trigger`, `items`/`groups`, `attached`, `contentLabel`, `darkMode`                                                  |
| `Modal`      | `trigger`, `title`, `footer`, `variant`: `default \| popup`, `size`: `s \| m`, `closeOnBackdrop`, `closeOnEscape`    |
| `Drawer`     | `open`, `onClose`, `position`, `size`, `closeOnOverlayClick`, `closeOnEsc`, `header`, `items`, `theme`, `darkMode`   |
| `Breadcrumb` | `items`, `separator`, `size`, `background`, `darkMode`                                                               |
| `Pagination` | `currentPage`, `totalPages`, `onPageChange`, `theme`, `size`, `darkMode`                                             |
| `Navbar`     | `brand`, `items`, `search`, `guestActions`, `menuPosition`, `user`                                                   |
| `Hero`       | `type`, `centeredContent`, `platform`, `heading`, `description`, `image`, `showButton`, `buttonLabel`, `darkMode`    |
| `Sidebar`    | `items`, `groups`, `logo`, `collapsedLogo`, `user`, `collapsed`, `onCollapse`, `showCollapseButton`, `sticky`, `footer`, `darkMode` |
| `Footer`     | `logo`/`logoContent`, `menus`, `copyright`, `socials`                                                                |
| `Table`      | `columns`, `data`, `rowKey`, `search`, `filter`, `selectable`, `sort`, `headerAlign`, `pagination`, `sticky`, `size`, `loading` |

Warna Button diatur `theme` (`primary | green | gray | simaya | orange |
yellow`) dan `tone` (`light | dark`), bukan lewat `variant` — `variant` hanya
memilih terisi atau bergaris. Ukuran: `xs | s | base | l | xl`. Ikon di kiri
atau kanan teks lewat `leftIcon`/`rightIcon`; `type="iconOnly"` membuat tombol
bundar berisi ikon saja. Untuk tautan pakai `as="anchor"` bersama `href`, maka
Button dirender sebagai `<a>`.

### Form

Semua komponen form meneruskan atribut elemen aslinya (`value`, `onChange`,
`name`, `required`, …) dan mengaitkan `label` ke `id` serta caption ke
`aria-describedby` secara otomatis.

| Komponen        | Props khas                                                                                                                      | Ukuran (desktop / mobile) |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `InputField`    | `label`, `helperText`, `icon`, `onClear`, `type="password"`, `darkMode`, `state`: `default \| typing \| inactive \| failed`     | 52 / 40 px                |
| `FloatingLabel` | `label`, `helperText`, `icon`, `onClear`, `darkMode`, `state`: `default \| active \| error`                                     | 58 / 50 px                |
| `TextArea`      | `label`, `hint`, `helperText`, `type`: `default \| editor`, `toolbar`, `onToolbarAction`, `submitLabel`, `onSubmit`, `darkMode` | 162 / 120 px              |
| `Select`        | `label`, `info`, `helperText`, `placeholder`, `options`, `darkMode`                                                             | 37 px                     |
| `Search`        | `label`, `helperText`, `buttonLabel`, `onSearch`, `categories`, `onCategoryChange`, `darkMode`                                  | 54 / 50 px                |
| `Datepicker`    | `label`, `type`: `single \| period \| multiple`, `shortcuts`, `min`/`max`, `darkMode`, `name` — nilai `Date` / `DateRange`      | 42 / 42 px                |
| `Upload`        | `label`, `helperText`, `buttonLabel`, `replaceLabel`, `removeLabel`, `placeholder`, `type`: `default \| attach`, `onFilesChange`, `darkMode` | 44 / 40 px                |
| `Radio`         | `label`, `helperText`, `darkMode`                                                                                               | 16 / 14 px                |
| `Toggle`        | `label`, `helperText`, `darkMode`                                                                                               | 40×20 / 36×18 px          |
| `Checkbox`      | `label`, `helperText`, `darkMode`                                                                                               | 16 / 14 px                |

Prop yang dipakai bersama seluruh komponen form:

- `platform`: `default | mobile` — mengubah ukuran. Pada `Datepicker` ia juga
  mengubah tata letak: panelnya selebar kotak, `single` menaruh kisinya di
  tengah, `period` memuat empat pintasannya dalam satu baris, dan `multiple`
  menumpuk kotak serta kalendernya. Pada `Select`, varian Mobile cuma
  menyempitkan wadahnya, jadi prop ini memang tidak ada; pada `Upload` ia tidak
  berpengaruh untuk `type="attach"`, karena alasan yang sama. `Search` punya
  ukuran ketiga, `compact` (37px), untuk dipasang di navbar.
- `application`: `default | simaya` — warna aksen per aplikasi.
- `state`: `default | inactive` (`InputField` dan `FloatingLabel` punya state
  tambahan, lihat tabel). `inactive` sekaligus menonaktifkan kontrolnya.
- Kondisi tercentang/menyala pada `Radio`, `Toggle`, dan `Checkbox` memakai
  `checked`/`defaultChecked` biasa, bukan prop `state`.

> **Catatan konsistensi:** tampilan `inactive` masih berbeda antar komponen
> karena mengikuti rancangannya apa adanya — `Checkbox` tidak meredupkan
> kotaknya, `Radio` memakai latar gray-100, `Toggle` justru menggelapkan
> jalurnya ke gray-300. Perlu diselaraskan di rancangannya lebih dulu.

### Navbar

```tsx
import { Navbar } from '@ceplok-ui/design-kit-react'

<Navbar
  brand={<img src="/logo.svg" alt="" />}
  brandLabel="CEPLOK — Beranda"
  items={[
    {
      id: 'menu-1',
      label: 'Menu 1',
      children: [{ id: 'menu-1-overview', label: 'Ringkasan', href: '/menu-1' }],
    },
  ]}
  search={{
    placeholder: 'Search Civitas, Organisasi ...',
    onSubmit: (query) => console.log(query),
  }}
  guestActions={{
    login: { label: 'Masuk', href: '/login' },
    register: { label: 'Daftar', href: '/register' },
  }}
/>
```

Navbar bersifat router-agnostic dan responsive mulai breakpoint `lg`. Pada
mobile, search tetap terlihat pada baris kedua di luar panel navigasi, termasuk
ketika panel tertutup. Panel mobile bersifat inline dan non-modal.

Authenticated state diberikan melalui prop `user`. Notification merupakan
API/config Navbar yang dapat dipakai bersama authenticated state:

```tsx
<Navbar
  brand={<Logo />}
  brandLabel="CEPLOK — Beranda"
  items={items}
  search={{ onSubmit: (query) => console.log(query) }}
  user={{ name: 'User CEPLOK', avatarSrc: '/avatar.jpg' }}
  notification={{ unread: true, href: '/notifications' }}
/>
```

`notification.unread` tetap tersedia untuk kompatibilitas state API, tetapi
desain Navbar saat ini hanya menampilkan ikon notification solid tanpa badge,
dot, atau indikator unread visual.

Type publik utama meliputi `NavbarProps`, `NavbarItem`, `NavbarSubItem`,
`NavbarSearchConfig`, `NavbarGuestActions`, `NavbarUser`, `NavbarNotification`,
dan `NavbarMenuPosition`.

Consumer tetap wajib menambahkan `@source` package seperti dijelaskan pada
bagian instalasi di atas agar utility Navbar ikut dihasilkan oleh Tailwind v4.

### Table

```tsx
import { useState } from 'react'
import { Table, type TableColumn } from '@ceplok-ui/design-kit-react'

type Pemohon = { id: number; nama: string; layanan: string; tanggal: string }

const columns: TableColumn<Pemohon>[] = [
  { key: 'nama', header: 'Nama', emphasis: true, hideable: false, sortable: true },
  { key: 'layanan', header: 'Layanan' },
  { key: 'tanggal', header: 'Tanggal', sortable: true, sortDirections: ['desc', 'asc'] },
]

const [kata, setKata] = useState('')
const hasilCari = pemohon.filter((p) => p.nama.toLowerCase().includes(kata.toLowerCase()))

<Table
  columns={columns}
  data={hasilCari}
  rowKey="id"
  search={{ value: kata, onChange: (e) => setKata(e.target.value) }}
  filter={{}}
  selectable
  pagination={{ pageSize: 10 }}
/>
```

`search` hanya menyediakan kotaknya: atributnya diteruskan ke `<input>`, dan
`data` disaring sendiri seperti di atas. `filter` memunculkan tombol Filter Data
untuk memilih kolom yang tampil; kolom ber-`hideable: false` selalu tampil.
Pengurutan dan pembagian halaman dikerjakan tabel. Untuk data dari server pasang
`manual`: kirim baris halaman aktif saja beserta `pagination.total`, lalu
tangani `onSortChange` dan `pagination.onPageChange`.

## Ikon

```tsx
import { Github, Instagram } from '@ceplok-ui/design-kit-react'          // logo brand & sosial
import { User, Envelope } from '@ceplok-ui/design-kit-react/icons/outline'
import { User as UserSolid } from '@ceplok-ui/design-kit-react/icons/solid'
```

Outline dan solid sengaja dipisah ke subpath berbeda: banyak nama ikon sama
persis di kedua set, dan pemisahan ini menjaga tree-shaking.

## Development

```bash
npm run dev        # situs dokumentasi di http://localhost:5173
npm run build      # build situs dokumentasi (tsc -b + vite build)
npm run build:lib  # build package -> dist/
npm run lint       # eslint
```

Situs dokumentasinya berisi `/foundations/*` (token), `/components/*`,
`/form/*` (tiap komponen form beserta playground-nya), dan `/example` — contoh
aplikasi tujuh halaman (Dasbor, Layanan, Pengajuan, Pemohon, Modifikasi,
Pengaturan, dan Simaya) yang memakai komponen kit bersama-sama.

Seluruh halaman komponen dan form memakai susunan yang sama: judul ber-anchor,
blok kode menempel di tiap bagian, dan daftar isi "On this page" di kanan.
Kerangkanya di `docs/usulanKit.tsx`.

## Deploy dokumentasi

Situs dokumentasi terbit otomatis ke GitHub Pages lewat
`.github/workflows/deploy-docs.yml` setiap ada push ke `main`.

```
GitLab main  --push mirror-->  GitHub main  --Actions-->  GitHub Pages
```

Sumber kebenarannya tetap GitLab. Repo GitHub hanya cermin, jadi jangan commit
langsung ke sana — mirror akan menimpanya.

Penyiapan sekali jalan:

1. **GitHub** — buat repo tujuan, lalu Settings -> Pages -> Build and deployment
   -> Source: **GitHub Actions** (bukan "Deploy from a branch"). Repo publik
   gratis; repo privat butuh GitHub Pro/Team.
2. **GitHub** — buat Personal Access Token yang boleh menulis ke repo itu
   (classic: scope `repo`, atau fine-grained: Contents = Read and write).
3. **GitLab** — Settings -> Repository -> Mirroring repositories -> Add:
   - URL: `https://<user-github>@github.com/<org>/<repo>.git`
   - Mirror direction: **Push**
   - Authentication method: Password -> tempel PAT dari langkah 2
   - Centang "Only mirror protected branches" bila cukup `main` yang ikut

Base path-nya otomatis: workflow mengisi `VITE_BASE` dari `base_path` milik
Pages dan `vite.config.ts` memakainya, jadi konfigurasi yang sama jalan baik di
`<org>.github.io/<repo>/` maupun di root domain.

Karena itu **rujukan berkas `public/` harus lewat `asset()`** (`docs/asset.ts`).
Path absolut seperti `/images/x.svg` diukur dari root domain dan akan 404 saat
situs disajikan dari sub-path; Vite hanya menulis ulang URL di `index.html` dan
di import modul, bukan string literal di dalam kode.

Routing situs ini berbasis hash (`#/components/alert`), jadi tidak perlu
`404.html` sebagai fallback SPA.

## Uji coba lokal sebelum publish

Cara paling mendekati install sungguhan — pakai tarball, **bukan** `npm link`
atau `file:../folder`: keduanya membuat symlink sehingga React termuat dua kali
dan memicu "invalid hook call".

```bash
# di package ini
npm run build:lib      # `npm pack` TIDAK menjalankan prepublishOnly, jadi build manual
npm pack               # -> ceplok-ui-design-kit-react-<versi>.tgz

# di project consumer
npm install ../react-design-system/ceplok-ui-design-kit-react-<versi>.tgz
```

Dependency `clsx` dan `flowbite-react-icons` ikut terpasang otomatis. Tarball
adalah snapshot: setiap kali package berubah, ulangi `build:lib` + `pack`, lalu
`npm install` lagi di consumer.

## Rilis & publish

Versi mengikuti semver: selama masih di bawah `1.0.0`, perubahan yang memutus
menaikkan versi **minor**. Semua langkah di bawah dijalankan manual oleh
maintainer, berurutan.

1. Pastikan `staging` sudah di-merge ke `main`, lalu cek dari `main`:

   ```bash
   npm run build        # tsc -b + build situs dokumentasi
   npm run build:lib    # build paket
   npm pack --dry-run   # isi tarball: hanya dist/, README, LICENSE, package.json
   ```

2. Di `CHANGELOG.md`, ganti judul `## [Belum dirilis]` menjadi
   `## [x.y.z] - YYYY-MM-DD`, lalu tambahkan `## [Belum dirilis]` kosong di
   atasnya.
3. Naikkan versi tanpa membuat commit; `package.json` dan `package-lock.json`
   ikut berubah:

   ```bash
   npm version x.y.z --no-git-tag-version
   ```

4. Commit, beri tag, push `main` beserta tag-nya, lalu samakan `staging` agar
   CHANGELOG-nya tidak tertinggal:

   ```bash
   git commit -am "x.y.z"
   git tag -a vx.y.z -m "x.y.z"
   git push origin main vx.y.z
   git push origin main:staging   # fast-forward; bila ditolak, merge main ke staging
   ```

5. Publish. `prepublishOnly` otomatis menjalankan `build:lib`, dan npm akan
   meminta OTP atau persetujuan lewat browser:

   ```bash
   npm login                     # bila sesi npm sudah kedaluwarsa
   npm publish --access public
   ```

6. Cek hasilnya. Versi baru bisa butuh satu-dua menit sebelum terlihat:

   ```bash
   npm view @ceplok-ui/design-kit-react version dist-tags
   ```
