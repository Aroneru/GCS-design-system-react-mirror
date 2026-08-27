/**
 * Menyisipkan berkas SVG sebagai markup inline agar warnanya mengikuti
 * currentColor — port dari logika `x-dk::icon` (icon.blade.php).
 *
 * Blok <mask>, <clipPath>, dan <defs> sengaja dilindungi: warna di dalamnya
 * bersifat teknis (menentukan area tampil), bukan warna yang terlihat.
 * Menggantinya akan merusak bentuk ikon.
 */
function toCurrentColor(svg: string): string {
  const protectedBlocks: string[] = []

  let out = svg.replace(/<(mask|clipPath|defs)\b[\s\S]*?<\/\1>/gi, (m) => {
    protectedBlocks.push(m)
    return `@@ICON_PROTECTED_${protectedBlocks.length - 1}@@`
  })

  out = out.replace(
    /(fill|stroke)="(?!none")(?:#[0-9a-f]{3,8}|white|black)"/gi,
    '$1="currentColor"',
  )

  out = out.replace(/@@ICON_PROTECTED_(\d+)@@/g, (_, i) => protectedBlocks[Number(i)])

  // Ukuran ditentukan oleh class pembungkus, bukan atribut bawaan berkas.
  return out.replace(/<svg\b([^>]*)>/i, (_, attrs: string) => {
    const cleaned = attrs.replace(/\s(?:width|height|class)="[^"]*"/gi, '')
    return `<svg${cleaned} aria-hidden="true" focusable="false">`
  })
}

function load(modules: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [path, raw] of Object.entries(modules)) {
    const name = path.split('/').pop()!.replace(/\.svg$/, '')
    out[name] = toCurrentColor(raw)
  }
  return out
}

// Logo brand/sosial milik design kit sendiri (packages/php/resources/svg/brands).
export const brandSvgs = load(
  import.meta.glob('./brands/*.svg', { query: '?raw', import: 'default', eager: true }),
)

// Ikon UI dari public/icons pada versi Laravel.
export const uiSvgs = load(
  import.meta.glob('./icons/*.svg', { query: '?raw', import: 'default', eager: true }),
)

export const brandNames = Object.keys(brandSvgs).sort()
