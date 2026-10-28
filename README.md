# @ceplok-ui/design-kit-react

Design tokens, tipografi, dan komponen **React (Tailwind v4)** untuk
Ceplok Design System. Dipindahkan 1:1 dari versi Laravel/Blade
(`tpl/design-kit`) ke komponen React yang bisa dipublish lewat NPM.

## Isi

- **Tokens** (`@theme`): palet warna (primary, gray, red, orange, yellow, green,
  purple), semantic aliases (`brand`, `feedback-*`, `content`,
  `surface`, `border`), skala tipografi (`display` → `caption`), spacing, radius,
  shadow, font Lato, serta font alternatif Inter (`font-alt`) dan Arial
  (`font-alt-2`). Panduan lengkap token dan tema gelap ada di [COLOR.md](COLOR.md).
- **Komponen umum**: `Alert`, `Avatar`, `Badge`, `Breadcrumb`, `Button`, `Card`,
  `Clipboard`, `Container`, `Drawer`, `Dropdown`, `Footer`, `Hero`, `Icon`,
  `ListView`, `Modal`, `Navbar`, `Pagination`, `Popover`, `Sidebar`, `Spinner`,
  `Table`, `Timeline` (eksperimental, desainnya belum final), `Toast`.
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

## Tema gelap & token warna

Komponen Ceplok Design Kit dirancang menggunakan sistem token warna semantik
yang didefinisikan di `tokens.css`. Tema gelap diatur secara deklaratif lewat
atribut `data-theme="dark"` alih-alih class `dark:` per elemen:

- **Prop `darkMode`**: Memasang `darkMode={true}` pada komponen akan menyetel
  atribut `data-theme="dark"` pada elemen terluarnya.
- **Pewarisan tema otomatis**: Jika sebuah elemen pembungkus memiliki atribut
  `data-theme="dark"` (misalnya `<div data-theme="dark">`), semua komponen di
  dalamnya otomatis beradaptasi ke tema gelap tanpa perlu memberikan prop
  `darkMode` satu per satu.
- **Kembali ke tema terang**: Bagian di dalam area gelap dapat dikembalikan ke
  tema terang dengan `data-theme="light"` atau kelas `.ds-theme-light`.
- **Komponen yang mendukung `data-theme`**: `Card`, `Hero`, `Container`,
  `Sidebar`, `Search`, `Alert`, `Toast`, `InputField`, `FloatingLabel`,
  `TextArea`, `Select`, `Toggle`, `Radio`, `Checkbox`, `Breadcrumb`, dan
  `Timeline`, serta `Avatar` dan `Clipboard`.
- **Token komponen**: Warna latar dan elemen khusus komponen disediakan melalui token yang
  dapat ditimpa di CSS aplikasi consumer, seperti `--color-sidebar-surface` (Sidebar),
  `--color-search-category-surface` dan `--color-search-field-surface` (Search),
  `--color-breadcrumb-*` (Breadcrumb), `--color-clipboard-*` (Clipboard), serta
  `--color-timeline-*` (Timeline). Panduan lengkap token dan cara kerjanya ada di [COLOR.md](COLOR.md).

## Komponen & props

### Umum

| Komponen     | Props utama                                                                                                          |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| `Button`     | `variant`: `filled \| outline`, `theme`, `tone`, `size`, `type`: `button \| submit \| reset`, `iconOnly`, `as`: `button \| anchor`, `darkMode` |
| `Badge`      | `variant`: `gray \| brand \| danger \| warning \| success`, `size`: `sm \| lg`, `icon`, `dismissible`, `onDismiss`, `open`, `darkMode` |
| `Avatar`     | `src`, `name`, `alt`, `initials`, `fallback`: `initials \| profile`, `gender`: `male \| female`, `size`: `small \| default \| large`, `darkMode` (deprecated) |
| `Spinner`    | `size`: `default \| large`                                                                                           |
| `Clipboard`  | `value`, `variant`: `default \| segmented`, `prefix`, `label`, `helperText`, `platform`, `disabled`, `onCopySuccess`, `onCopyError`, `darkMode` (deprecated) |
| `Alert`      | `variant`, `heading`, `icon`, `dismissible`, `actions`, `darkMode`                                                   |
| `Toast`      | `variant`, `heading`, `icon`, `dismissible`, `actions`, `darkMode`                                                   |
| `Card`       | `image`, `title`, `description`, `href`, `linkLabel`, `actions`, `darkMode`                                          |
| `ListView`   | `items` atau `children`, `variant`: `simple \| article`, `size`, `platform`: `desktop \| mobile`, `decoration`, `darkMode` |
| `Container`  | `as` (default `div`), `padded` (default `true`), `darkMode`                                                          |
| `Icon`       | `children` (SVG dengan `currentColor`)                                                                               |
| `Popover`    | `trigger`, `title`, `side`, `open`/`defaultOpen`/`onOpenChange`, `darkMode`                                          |
| `Dropdown`   | `trigger`, `items`/`groups` atau `children`, `align`, `closeOnSelect`, `actionsRef`, `contentLabel`, `contentClassName`, `data-theme`, `darkMode` |
| `Modal`      | `trigger` atau `open`/`onOpenChange`, `title`, `footer`, `variant`: `default \| popup`, `size`: `s \| m`, `closeOnBackdrop`, `closeOnEscape`, `showCloseButton`, `closeLabel` |
| `Drawer`     | `open`, `onClose`, `position`, `size`, `closeOnOverlayClick`, `closeOnEsc`, `header`, `items`, `theme`, `darkMode`   |
| `Breadcrumb` | `items`, `separator`, `size`, `background`, `darkMode`                                                               |
| `Pagination` | `currentPage`, `totalPages`, `onPageChange`, `theme`, `size`, `darkMode`                                             |
| `Navbar`     | `platform`, `brand`, `items`, `search`, `guestActions` (FO), `account`, `notificationTrigger` (FO authenticated), `mobileNavigationOpen`, `onMobileNavigationOpenChange`, `mobileDrawer` (BO) |
| `Hero`       | `type`, `centeredContent`, `platform`, `heading`, `description`, `image`, `showButton`, `buttonLabel`, `darkMode`    |
| `Sidebar`    | `items`, `groups`, `logo`, `collapsedLogo`, `user` (profil + menu dropdown), `collapsed`, `onCollapse`, `showCollapseButton`, `sticky`, `footer`, `darkMode` |
| `Footer`     | `logo`/`logoContent`, `menus`, `copyright`, `socials`                                                                |
| `Table`      | `columns`, `data`, `rowKey`, `search`, `filter`, `selectable`, `sort`, `headerAlign`, `pagination`, `striped`, `sticky`, `size`, `loading` |
| `Timeline`   | Eksperimental. `items` (`name`, `role`, `time` (`Date`, ditulis `01 Jan 2026 · 09:05`), `elapsed`, `description`, `details`, `attachments` (`name`, `href`, `target`, `download`), `status` (prop `Badge` + `label`), `avatar`, `initials`), `platform`: `desktop \| mobile`, `size`: `large \| small`, `labels` (`elapsed`, `details`, `attachments`, `months`), `darkMode` |

Warna Button diatur `theme` (`primary | green | gray | purple | orange |
yellow`) dan `tone` (`light | dark`), bukan lewat `variant` — `variant` hanya
memilih terisi atau bergaris. Ukuran: `xs | s | base | l | xl`. Ikon di kiri
atau kanan teks lewat `leftIcon`/`rightIcon`; `iconOnly` membuat tombol
persegi berisi ikon saja. Prop `type` (`button | submit | reset`, bawaan `button`)
meneruskan atribut HTML native ke elemen `<button>`, memungkinkan tombol dipakai
untuk submit form. Untuk tautan pakai `as="anchor"` bersama `href`, maka
Button dirender sebagai `<a>`.

#### Avatar

Avatar memprioritaskan foto dari `src`. Bila foto tidak ada atau gagal dimuat,
fallback bawaannya adalah `initials` manual, lalu inisial Unicode-aware dari
`name`, ilustrasi `gender`, dan akhirnya ikon User netral. `initials` tetap
tersedia untuk override:

```tsx
<Avatar src={user.avatarUrl} name={user.name} />
<Avatar name="Putri Handayani" initials="PT" />
```

Untuk langsung memakai ilustrasi profile, pilih gender secara eksplisit — kami
menyediakan asset Male/Female untuk tema terang dan gelap:

```tsx
<Avatar gender="female" fallback="profile" />
<Avatar gender="male" fallback="profile" />
```

Avatar mengikuti `data-theme` dari pembungkusnya, termasuk scope bertingkat.
Prop `darkMode` masih didukung untuk kompatibilitas tetapi deprecated. Pakai
`alt=""` bila nama pemilik sudah tertulis di dekat Avatar agar pembaca layar
tidak mengumumkannya dua kali. Ukuran API tetap `small` (S, 24px), `default`
(M, 32px), dan `large` (L, 80px); M adalah bawaan.

#### Clipboard

`Clipboard` menampilkan `value` melalui input hanya-baca dan menyalin string
persisnya dengan aksi native browser. Bentuk `default` memakai tombol teks
Copy; `variant="segmented"` menyatukan nilai dengan tombol ikon dan dapat
menampilkan `prefix` kontekstual yang **tidak** ikut disalin. `platform` bernilai
`default` atau `mobile`: keduanya preset eksplisit, bukan hasil deteksi viewport.
Desktop memakai teks 14px; Mobile mempertahankan ukuran ringkasnya. Ukuran,
weight, dan line-height mengikuti preset tersebut, sedangkan keluarga font tetap
mewarisi pilihan consumer: Lato, Inter, atau Arial.

```tsx
import { Clipboard } from '@ceplok-ui/design-kit-react'

<Clipboard value="INV-2026-001" label="Nomor referensi" />

<Clipboard
  value="https://komdigi.go.id/"
  label="Alamat situs"
  variant="segmented"
  prefix="URL"
/>
```

Setelah `navigator.clipboard.writeText(value)` berhasil, Clipboard menampilkan
feedback Copied sementara; aksi bersegmen mengganti ikon Clipboard menjadi
Check tanpa mengubah ukuran tombol. Tooltip ikon “Copy to clipboard” berada di
tengah tombol, muncul untuk hover atau fokus keyboard, dapat ditutup dengan
Escape, dan tidak muncul kembali sepanjang status Copied. Setelah reset, tooltip
menunggu hover atau fokus baru.

Saat `disabled`, aksi Copy, tooltip, pemilihan teks, serta copy/cut melalui UI
dinonaktifkan; ini bukan mekanisme keamanan data yang sudah berada di browser.
`onCopySuccess` hanya berjalan setelah salin berhasil dan `onCopyError` menerima
kegagalan Clipboard API. Tampilan mengikuti scope ambient `data-theme`, termasuk
scope bertingkat:

```tsx
<section data-theme="dark">
  <Clipboard value="INV-2026-001" label="Nomor referensi" />
</section>
```

`darkMode` masih tersedia sebagai override kompatibilitas, tetapi deprecated;
gunakan `data-theme="dark"` untuk kode baru.

#### Modal

`Modal` memakai native `<dialog>`. Tanpa `open`, berikan `trigger` berupa
elemen `<button>` dan Modal mengelola visibilitas internal. Dengan `open`, Modal
menjadi controlled; `onOpenChange` menerima permintaan buka/tutup dan `trigger`
boleh dihilangkan. Render function pada `footer` menerima `close()` untuk aksi
eksplisit:

```tsx
<Modal
  trigger={<Button>Buka</Button>}
  title="Konfirmasi"
  footer={({ close }) => <Button size="xs" onClick={close}>Selesai</Button>}
>
  <p>Isi dialog milik consumer.</p>
</Modal>
```

Default mendukung `size="s"` dan `size="m"`; body menggulir saat konten
melebihi viewport, sementara header dan footer tetap di panel. Popup memakai
ukuran ringkas bawaannya dan tidak menerima `title` atau `size`; berikan
`aria-label` atau `aria-labelledby` untuk nama aksesibelnya.

`closeOnBackdrop`, `closeOnEscape`, dan `showCloseButton` bernilai `true` secara
bawaan dan dapat dimatikan secara independen. Jika semuanya dimatikan,
sediakan aksi footer yang memanggil `close()`. `closeLabel` memberi nama
aksesibel pada tombol X. Tema mengikuti wrapper ambient `data-theme="dark"`;
Modal tidak memiliki prop `darkMode`. Nested Modal adalah komposisi dua Modal
controlled dengan state terpisah: Default membuka Popup, penutupan Popup tidak
menutup Default, dan fokus kembali ke kontrol pembukanya.

`darkMode` pada Button menyesuaikan warna untuk permukaan gelap. Pada `tone="light"`,
filled memakai gray-50 dan outline memakai gray-50; pada `tone="dark"`, filled
tetap memakai gray-50 sedangkan outline memakai gray-500. Saat hover, seluruh
varian berubah menjadi latar putih dengan teks gray-700.

`ListView` menyediakan daftar item berukuran `S`, `M`, atau `L` untuk desktop
dan mobile. Varian `simple` dapat memakai ikon, badge, dekorasi aksen, dan aksi;
varian `article` tersedia hingga `XL`, selalu memakai garis aksen vertikal, dan
menampilkan subject, metadata, pin, judul, serta metrik interaksi. Gunakan
`darkMode` pada pembungkus atau item untuk tampilan gelap.

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
| `Search`        | `label`, `helperText`, `buttonLabel`, `onSearch`, `trigger`: `enter \| change \| auto`, `debounce`, `showButton`, `categories`, `onCategoryChange`, `darkMode` | 54 / 50 / 37 px           |
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
  ukuran ketiga, `compact` (37px), untuk dipasang di navbar tanpa tombol cari (`showButton=false`).
  Komponen ini juga mendukung live search via `trigger="change"` / `"auto"` dengan jeda `debounce`
  (bawaan 300ms) serta tema gelap berbasis token (`--color-search-category-surface` dan `--color-search-field-surface`).
- `Upload`: dibatasi khusus berkas tunggal (atribut `multiple` dinonaktifkan).
- `application`: `default | purple` — warna aksen per aplikasi.
- `state`: `default | inactive` (`InputField` dan `FloatingLabel` punya state
  tambahan, lihat tabel). `inactive` sekaligus menonaktifkan kontrolnya.
- Kondisi tercentang/menyala pada `Radio`, `Toggle`, dan `Checkbox` memakai
  `checked`/`defaultChecked` biasa, bukan prop `state`.

> **Catatan konsistensi:** tampilan `inactive` masih berbeda antar komponen
> karena mengikuti rancangannya apa adanya — `Checkbox` tidak meredupkan
> kotaknya, `Radio` memakai latar gray-100, `Toggle` justru menggelapkan
> jalurnya ke gray-300. Perlu diselaraskan di rancangannya lebih dulu.

### Navbar

Navbar memakai kontrak terdiskriminasi berdasarkan `platform`. Front Office
(FO) mendukung identitas guest atau account; Back Office (BO) memakai
`mobileDrawer` untuk menghubungkan tombol contextual Drawer milik consumer.
`brand` selalu berupa objek terstruktur, sedangkan `search` adalah slot
`ReactNode` yang disediakan consumer. Navbar merender `brand.content` sebagai
satu unit dan tidak memisahkan mark maupun wordmark secara otomatis. Brand
ditampilkan pada FO desktop/mobile dan BO mobile; BO desktop tidak
menampilkannya karena identitas aplikasi berada pada Sidebar desktop.

#### Front Office — guest

```tsx
import { Navbar, Search, type NavbarPrimaryItem } from '@ceplok-ui/design-kit-react'

const brand = {
  content: <img src="/logo.svg" alt="" />,
  href: '/',
  ariaLabel: 'CEPLOK — Beranda',
}

const items: NavbarPrimaryItem[] = [
  { id: 'beranda', type: 'destination', label: 'Beranda', href: '/', current: true },
  {
    id: 'layanan',
    type: 'disclosure',
    label: 'Layanan',
    children: [
      { id: 'layanan-ringkasan', type: 'destination', label: 'Ringkasan', href: '/layanan' },
    ],
  },
]

const guestActions = {
  signIn: { label: 'Masuk', href: '/masuk' },
  signUp: { label: 'Daftar', href: '/daftar' },
}

export function FrontOfficeNavbar() {
  return (
    <Navbar
      platform="front-office"
      brand={brand}
      items={items}
      search={<Search platform="compact" showButton={false} aria-label="Cari" />}
      guestActions={guestActions}
    />
  )
}
```

Untuk FO authenticated, gunakan `account` sebagai pengganti `guestActions`.
`notificationTrigger` hanya valid bersama `account` dan merupakan slot yang
sepenuhnya dirender consumer:

```tsx
import { Navbar, type NavbarAccount, type NavbarPrimaryItem } from '@ceplok-ui/design-kit-react'

const brand = {
  content: <img src="/logo.svg" alt="" />,
  href: '/',
  ariaLabel: 'CEPLOK — Beranda',
}

const items: NavbarPrimaryItem[] = [
  { id: 'beranda', type: 'destination', label: 'Beranda', href: '/', current: true },
]

const account: NavbarAccount = {
  name: 'User CEPLOK',
  initials: 'UC',
  items: [
    { id: 'profil', type: 'destination', label: 'Profil', href: '/profil' },
    { id: 'keluar', type: 'action', label: 'Keluar', tone: 'danger', onClick: () => {} },
  ],
}

export function FrontOfficeAuthenticatedNavbar() {
  return (
    <Navbar
      platform="front-office"
      brand={brand}
      items={items}
      account={account}
      notificationTrigger={<a href="/notifikasi">Notifikasi</a>}
    />
  )
}
```

Navbar bersifat router-agnostic dan beralih ke komposisi mobile di bawah
breakpoint `lg`. Pada mobile, search tetap berada pada baris kedua di luar
navigasi. Navigasi utamanya dibuka sebagai dialog native modal; gunakan
`mobileNavigationOpen` dan `onMobileNavigationOpenChange` bila state navigasi
mobile perlu dikendalikan consumer.

`current` adalah state navigasi milik consumer: setelah route berubah,
consumer perlu merender ulang `items` dengan destination yang sesuai sebagai
`current`. Navbar meneruskannya sebagai `aria-current="page"`, tetapi primary
navigation desktop tidak memakai sorotan permanen; Breadcrumb menyediakan
konteks halaman. Sidebar mobile dan baris destination di Dropdown tetap memakai
tampilan current dari kontrak komponennya masing-masing.

Disclosure desktop dan Account destination diteruskan ke generated item
`Dropdown`; `current` tetap berbeda dari `selected`. `Lainnya` memakai konten
custom agar dapat memuat Disclosure bersarang. Pada Sidebar mobile,
`target="_blank"` diterjemahkan ke prop `external`, sehingga Sidebar menerapkan
target baru dan `rel` aman bawaan komponennya.

#### Back Office — contextual Drawer milik consumer

```tsx
import { useState } from 'react'
import { Drawer, Navbar, type NavbarPrimaryItem } from '@ceplok-ui/design-kit-react'

const brand = {
  content: <span>CEPLOK Admin</span>,
  href: '/',
  ariaLabel: 'CEPLOK Admin — Beranda',
}

const items: NavbarPrimaryItem[] = [
  { id: 'dashboard', type: 'destination', label: 'Dashboard', href: '/', current: true },
]

export function BackOfficeNavbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <Navbar
        platform="back-office"
        brand={brand}
        items={items}
        mobileDrawer={{
          open: drawerOpen,
          onOpenChange: setDrawerOpen,
          controls: 'contextual-drawer',
          ariaLabel: 'Buka navigasi kontekstual',
        }}
      />
      <Drawer
        id="contextual-drawer"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        position="right"
        size="s"
        items={[{ id: 'ringkasan', label: 'Ringkasan', href: '/ringkasan' }]}
      />
    </>
  )
}
```

`mobileDrawer` bukan isi Drawer. Consumer memiliki state, elemen `<Drawer>`,
serta kontennya; Navbar hanya mengendalikan trigger contextual dan menutup
navigasi mobile saat Drawer dibuka. `guestActions` dan `notificationTrigger`
tidak berlaku pada BO.

Dropdown tidak lagi memakai prop `attached`. Panelnya diposisikan relatif ke
trigger, menyesuaikan batas viewport, dan dapat diratakan dengan
`align="start" | "center" | "end"`. Gunakan `data-theme="light" | "dark"`
untuk batas tema eksplisit; tanpa prop tersebut Dropdown mewarisi tema consumer.
`darkMode={true}` tetap tersedia sebagai override kompatibilitas dan lebih
diutamakan daripada `data-theme`.

Type publik Navbar yang diekspor meliputi `NavbarProps`, `NavbarPlatform`,
`NavbarBrand`, `NavbarDestination`, `NavbarDisclosure`, `NavbarPrimaryItem`,
`NavbarAccount`, `NavbarAccountItem`, `NavbarGuestActions`, dan
`NavbarMobileDrawer`. Lihat type exports package untuk tipe item account serta
varian FO/BO yang lebih spesifik.

Consumer tetap wajib menambahkan `@source` package seperti dijelaskan pada
bagian instalasi di atas agar utility Navbar ikut dihasilkan oleh Tailwind v4.

### Sidebar

```tsx
import { Sidebar } from '@ceplok-ui/design-kit-react'
import { ChartPie, Inbox } from 'flowbite-react-icons/solid'

<Sidebar
  logo={<Logo />}
  collapsedLogo={<LogoMark />}
  user={{
    name: 'John Doe',
    profileLabel: 'Administrator',
    items: [
      { label: 'Profil Saya', href: '/profile' },
      { label: 'Pengaturan Akun', href: '/settings' },
      { label: 'Dokumentasi', href: 'https://docs.example.com', external: true },
      { label: 'Keluar', tone: 'danger', onClick: () => handleLogout() },
    ],
  }}
  items={[
    { label: 'Dasbor', href: '/dashboard', icon: <ChartPie className="size-5" />, active: true },
    { label: 'Pesan', href: '/messages', icon: <Inbox className="size-5" />, badge: 3 },
    { label: 'Portal Eksternal', href: 'https://ipb.ac.id', external: true },
  ]}
  sticky
  showCollapseButton
  onCollapse={() => setCollapsed((v) => !v)}
  collapsed={collapsed}
/>
```

Sidebar menyediakan navigasi vertikal yang mendukung pengelompokan menu
(`groups`), multi-level submenu accordion, indikator badge, dan mode rel ringkas
(`collapsed`).

Parent yang memiliki `children` selalu menjadi tombol pembuka submenu; `href`
pada parent tersebut sengaja diabaikan agar satu klik tidak sekaligus membuka
submenu dan bernavigasi. Group otomatis terbuka bila parent atau salah satu
subitem aktif. Saat Sidebar ringkas, klik ikon group membuka Sidebar terlebih
dahulu bila `onCollapse` tersedia.

Area profil (`user`) mendukung menu dropdown interaktif melalui prop `items`
atau `groups` (dengan dukungan pemisah `separator`). Pilihan aksi seperti
*Keluar* dapat diberi warna destruktif lewat `tone="danger"`. Menu item,
subitem, dan profil juga mendukung `external: true` untuk membuka tautan keluar
tab baru secara aman (`rel="noreferrer noopener"`).

Tema gelap (`darkMode`): `Sidebar` mengadopsi sistem token semantik dan token
komponen `--color-sidebar-surface` (putih di tema terang, gray-700 di tema
gelap). Tema dapat diaktifkan lewat prop `darkMode` maupun otomatis mewarisi
atribut `data-theme="dark"` dari kontainer pembungkusnya.

Type publik utama meliputi `SidebarProps`, `SidebarItem`, `SidebarSubItem`,
`SidebarGroup`, `SidebarUser`, `SidebarUserItem`, `SidebarUserGroup`, dan
`SidebarUserItemTone`.

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

`selectable` menambahkan checkbox per baris dan checkbox pilih semua di judul,
yang hanya mencakup halaman yang tampil. `pagination.pageSizeOptions` (mis.
`[10, 25, 50]`) memunculkan pemilih jumlah baris per halaman, dan `striped`
memberi baris zebra. Kolom berkas memakai `file`, mis.
`file: { name: (r) => r.berkas, href: (r) => r.url }`: gambar dan PDF dibuka di
pratinjau, berkas lain diunduh. Bentuk yang sama tersedia sebagai komponen
`TableFile` untuk dipakai di `cell` sendiri.

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
