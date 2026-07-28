# @tpl/design-kit-react

Design tokens, tipografi, dan komponen **React (Tailwind v4)** untuk produk TPL —
State Security Service Design System. Dipindahkan 1:1 dari versi Laravel/Blade
(`tpl/design-kit`) ke komponen React yang bisa dipublish lewat NPM.

## Isi

- **Tokens** (`@theme`): palet warna (primary, gray, red, orange, yellow, green,
  purple, blue-portal), semantic aliases (`brand`, `feedback-*`, `content`,
  `surface`, `border`), skala tipografi (`display` → `caption`), spacing, radius,
  shadow, font Lato.
- **Komponen**: `Button`, `Badge`, `Card`, `Container`, `Icon`, `Footer`.

## Install

```bash
npm install @tpl/design-kit-react
```

Peer deps: `react >=18`, `react-dom >=18`, `tailwindcss ^4`.

## Pakai

```tsx
// main.tsx — import stylesheet (token + font Lato) sekali
import '@tpl/design-kit-react/styles.css'
import { Button, Badge, Card } from '@tpl/design-kit-react'

export default function App() {
  return (
    <Card title="Halo" description="Kartu dari design kit" actions={
      <Button variant="primary">Simpan</Button>
    } />
  )
}
```

### Wajib: scan package di Tailwind consumer

Karena komponen memakai class utility Tailwind, project consumer perlu meng-scan
file package ini agar class-nya ikut ter-generate. Di CSS Tailwind kamu:

```css
@import 'tailwindcss';
@import '@tpl/design-kit-react/tokens.css';   /* jika belum via styles.css */

@source '../node_modules/@tpl/design-kit-react/dist/**/*.js';
```

> Kalau kamu sudah `import '@tpl/design-kit-react/styles.css'`, token & font
> sudah termuat — kamu hanya perlu baris `@source` di atas.

## Komponen & props

| Komponen    | Props utama                                                          |
| ----------- | ------------------------------------------------------------------- |
| `Button`    | `variant`: `primary \| secondary \| danger \| ghost`                |
| `Badge`     | `variant`: `gray \| brand \| danger \| warning \| success`          |
| `Card`      | `image`, `title`, `description`, `href`, `linkLabel`, `actions`     |
| `Container` | `as` (default `div`)                                                 |
| `Icon`      | `children` (SVG dengan `currentColor`)                              |
| `Footer`    | `logo`/`logoContent`, `menus`, `copyright`, `socials`               |

## Development

```bash
npm run dev        # situs dokumentasi (showcase) di http://localhost:5173
npm run build      # build situs dokumentasi
npm run build:lib  # build package -> dist/ (dipakai saat publish)
```

## Publish

`prepublishOnly` otomatis menjalankan `build:lib`, jadi cukup:

```bash
npm publish        # atau --dry-run untuk cek isi tarball
```

Versi mengikuti semver — lihat catatan versioning di repo Laravel (`packages/README.md`).
