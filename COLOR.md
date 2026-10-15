# Warna di Ceplok Design Kit

Panduan singkat cara kerja warna dan cara memakainya. Semua warna diatur di satu file: `src/lib/tokens.css`.

## Ringkasan

- Warna disimpan sebagai **token**, yaitu variabel CSS seperti `--color-surface`.
- Komponen tidak menulis warna langsung (`#ffffff`, `bg-gray-700`). Komponen memakai token.
- Mau ganti warna? Timpa tokennya di CSS project. Tidak perlu mengubah komponen.
- Tema gelap diatur lewat atribut `data-theme="dark"`.

## Tiga lapis token

```
Palet       --color-gray-700: #374151      warna mentah
   ↓
Semantik    --color-surface                 peran: latar kartu
   ↓
Komponen    <Card> memakai bg-surface        hasil akhir
```

### 1. Palet

Warna mentah dengan skala 50 sampai 900.

| Nama | Dipakai untuk |
|---|---|
| `primary` | warna utama brand |
| `gray` | teks, garis, latar |
| `red` | error, hapus |
| `orange` | peringatan, aksi berisiko |
| `yellow` | peringatan ringan |
| `green` | sukses |
| `purple` | aksen aplikasi Simaya |

Contoh: `--color-primary-600`, `--color-gray-200`.

Palet boleh dipakai langsung untuk kebutuhan khusus. Untuk warna latar, teks, dan garis, pakai token semantik.

### 2. Token semantik

Nama token menjelaskan **fungsinya**, bukan warnanya.

| Token | Class Tailwind | Fungsi | Terang | Gelap |
|---|---|---|---|---|
| `--color-surface` | `bg-surface` | latar utama (kartu, panel) | putih | gray-700 |
| `--color-surface-subtle` | `bg-surface-subtle` | latar pembeda (header, footer) | gray-50 | gray-800 |
| `--color-border` | `border-border` | garis | gray-200 | gray-700 |
| `--color-content` | `text-content` | teks utama, judul | gray-900 | putih |
| `--color-content-subtle` | `text-content-subtle` | teks pendukung | gray-500 | gray-300 |
| `--color-brand` | `text-brand`, `bg-brand` | tautan, aksen | primary-600 | primary-400 |
| `--color-brand-hover` | `hover:text-brand-hover` | aksen saat hover | primary-700 | primary-300 |
| `--color-content-muted` | `text-content-muted` | caption, placeholder, ikon field | gray-500 | gray-400 |
| `--color-content-disabled` | `text-content-disabled` | teks dan isian nonaktif | gray-400 | gray-500 |
| `--color-field` | `bg-field` | latar field dan kotak kontrol | gray-50 | gray-700 |
| `--color-field-border` | `border-field-border` | garis field | gray-300 | gray-700 |
| `--color-field-disabled` | `bg-field-disabled` | latar field nonaktif | gray-100 | gray-700 |
| `--color-border-strong` | `border-border-strong` | garis yang tetap terlihat di tema gelap | gray-300 | gray-600 |

Token feedback (sama di terang dan gelap, kecuali error):

| Token | Fungsi |
|---|---|
| `--color-feedback-error` | pesan error; red-600, di tema gelap red-500 |
| `--color-feedback-warning` | peringatan |
| `--color-feedback-success` | sukses |

### 3. Palet gelap

Nilai yang dipakai token semantik saat tema gelap. Komponen tidak memakainya langsung.

| Token | Bawaan |
|---|---|
| `--color-surface-dark` | gray-700 |
| `--color-surface-subtle-dark` | gray-800 |
| `--color-border-dark` | gray-700 |
| `--color-content-dark` | putih |
| `--color-content-dark-subtle` | gray-300 |
| `--color-brand-dark` | primary-400 |
| `--color-brand-dark-hover` | primary-300 |
| `--color-content-muted-dark` | gray-400 |
| `--color-content-disabled-dark` | gray-500 |
| `--color-field-dark` | gray-700 |
| `--color-field-border-dark` | gray-700 |
| `--color-field-disabled-dark` | gray-700 |
| `--color-border-strong-dark` | gray-600 |
| `--color-feedback-error-dark` | red-500 |

### 4. Token komponen

Warna yang hanya dipakai satu komponen dan tidak cocok dengan token semantik mana pun. Di `tokens.css` tiap komponen punya satu bagian berisi nilai terang dan gelapnya berdampingan.

| Komponen | Token |
|---|---|
| Toggle | `--color-toggle-track`, `-track-inactive`, `-knob` |
| Radio | `--color-radio-border`, `-surface`, `-border-inactive`, `-ring-inactive`, `-label`, `-content-inactive` |
| Select | `--color-select-label`, `-content-inactive` |
| Input Field | `--color-input-field-surface-failed`, `-border-inactive`, `-label-inactive`, `-content-failed`, `-action-inactive` |
| Floating Label | `--color-floating-label-content`, `-icon-error`, `-accent`, `-accent-simaya` |
| Text Area | `--color-text-area-tool-hover`, `-helper`, `-submit`, `-submit-hover`, `-submit-simaya`, `-submit-simaya-hover` |
| Toast | `--color-toast-heading`, `-body`, `-close-hover`, lalu `-{variant}-surface` dan `-{variant}-icon` |
| Alert | `--color-alert-{variant}-surface`, `-icon`, `-heading`, `-body`, `-close` |
| Hero | `--color-hero`, `-centered`, `-dark` |
| Container | `--color-container` |
| Sidebar | `--color-sidebar-surface` |
| Search | `--color-search-category-surface`, `--color-search-field-surface` |

`{variant}` adalah `success`, `danger`, `warning`, `info`, atau `purple`.

Catatan Hero dan Container:

- `--color-hero` adalah latar hero (putih). `--color-hero-centered` latar hero tipe centered (primary-50).
- Di tema gelap keduanya memakai `--color-hero-dark` (gray-800). Ini satu-satunya token komponen yang punya pasangan `-dark`, jadi cukup timpa `--color-hero-dark` di `:root`.
- `--color-container` adalah latar bagian dalam Container di tema gelap (gray-700). Di tema terang Container tidak berlatar.

Token komponen lainnya tidak punya pasangan `-dark`. Untuk mengganti nilai gelapnya, timpa di blok `[data-theme='dark']` CSS project:

```css
[data-theme='dark'] {
  --color-alert-danger-close: var(--color-red-300);
}
```


## Cara kerja tema gelap

- Token semantik punya **nama yang sama** di tema terang dan gelap. Yang berubah hanya nilainya.
- Di dalam elemen yang punya `data-theme="dark"`, token semantik dialihkan ke palet gelap.
- Jadi komponen cukup memakai satu set class. Contoh `bg-surface` otomatis putih di area terang dan abu tua di area gelap.

```css
/* tokens.css (disederhanakan) */
:root {
  --color-surface: #ffffff;
}

[data-theme='dark'] {
  --color-surface: var(--color-surface-dark);
}
```

Analogi: `data-theme="dark"` adalah saklar lampu ruangan. Semua komponen di dalam ruangan itu ikut gelap.

## Pemakaian

### Satu komponen gelap

```tsx
<Card darkMode title="Ringkasan" />
```

Prop `darkMode` hanya memasang `data-theme="dark"` di komponen itu.

### Satu bagian halaman gelap

```tsx
<section data-theme="dark" className="bg-gray-900 p-8">
  <Card title="Gelap" />
  <Card title="Gelap juga" />
</section>
```

Tidak perlu menulis `darkMode` di setiap komponen.

### Bagian terang di dalam area gelap

```tsx
<section data-theme="dark">
  <Card title="Gelap" />
  <div data-theme="light">
    <Card title="Terang" />
  </div>
</section>
```

Elemen yang tidak bisa diberi atribut boleh memakai kelas `ds-theme-light` sebagai gantinya. Select memakainya lewat `contentClassName` Dropdown, supaya panel daftar pilihannya tetap terang walau field-nya gelap.

### Seluruh aplikasi gelap

```html
<html data-theme="dark">
```

### Tombol ganti tema sederhana

```tsx
function ThemeToggle() {
  const toggle = () => {
    const html = document.documentElement
    html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark'
  }
  return <Button onClick={toggle}>Ganti tema</Button>
}
```

### Memakai token di elemen buatan sendiri

Supaya elemen buatan project serasi dengan komponen dan ikut tema:

```tsx
<div className="rounded-lg border border-border bg-surface p-4 text-content">
  <p className="text-content-subtle">Keterangan</p>
</div>
```

Tanpa Tailwind:

```css
.panel {
  background: var(--color-surface);
  color: var(--color-content);
}
```

## Mengganti warna

Timpa token di CSS project, setelah import `styles.css`.

### Ganti warna gelap untuk semua komponen

```css
:root {
  --color-surface-dark: #1e293b;
  --color-content-dark-subtle: #cbd5e1;
}
```

### Ganti warna terang

```css
:root {
  --color-surface: #fafafa;
  --color-brand: #0e7490;
}
```

### Ganti warna hanya di satu bagian

```tsx
<div style={{ '--color-surface-dark': '#1e3a5f' } as React.CSSProperties}>
  <Card darkMode title="Biru tua" />
</div>
```

Atau lewat class:

```css
.halaman-laporan {
  --color-surface-dark: #1e3a5f;
}
```

## Aturan untuk tim pengembang library

- Jangan menulis warna langsung di komponen. Pakai token semantik.
- Pilih token berdasarkan fungsi. Latar kartu pakai `bg-surface`, bukan `bg-white`.
- Jangan membuat dua set class untuk terang dan gelap. Cukup satu set token, lalu tema diatur oleh `data-theme`.
- Prop `darkMode` cukup memasang `data-theme={darkMode ? 'dark' : undefined}` di elemen terluar.
- Untuk efek khusus di tema gelap (misalnya meredupkan gambar), pakai variant `in-data-[theme=dark]:`, contoh `in-data-[theme=dark]:brightness-90`.
- Butuh warna baru yang dipakai dua komponen atau lebih? Tambahkan token semantik baru di `tokens.css`, beserta nilai gelapnya di blok `[data-theme='dark']` dan nilai terangnya di blok `[data-theme='light']`.
- Warna yang hanya dipakai satu komponen boleh jadi token komponen, misalnya `--color-hero-overlay`. Nilai bawaannya sebaiknya menunjuk ke token semantik.
- Token yang nilainya berbeda di tema gelap wajib ditulis ulang di blok `[data-theme='dark']` dan `[data-theme='light']`, termasuk token komponen yang menunjuk ke token semantik. `var()` di sebuah token dihitung di elemen tempat token itu ditulis, lalu hasilnya yang diwarisi. Token yang hanya ditulis di `:root` akan tetap bernilai terang di area gelap.
- Cek kontras teks minimal 4,5:1 terhadap latarnya, di tema terang dan gelap.

## Status saat ini

- **Sudah memakai cara ini:** Card, Container, Hero, Toggle, Checkbox, Radio, Select, InputField, FloatingLabel, TextArea, Toast, Alert, Sidebar, dan Search.
- **Belum:** komponen lain yang punya `darkMode` (Popover, Drawer, Datepicker, dan lainnya) masih menulis warna gelapnya sendiri. Komponen ini akan dipindah bertahap.
- Selama belum dipindah, `data-theme="dark"` di pembungkus belum membuat komponen tersebut gelap. Pakai prop `darkMode` di komponennya.
