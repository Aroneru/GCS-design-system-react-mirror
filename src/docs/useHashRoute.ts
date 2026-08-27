import { useEffect, useState } from 'react'

/**
 * Router hash minimalis: `#/foundations/colors` -> "/foundations/colors".
 *
 * Hash boleh diakhiri penanda bagian: `#/components/footer#menus`.
 * Bagian setelah `#` kedua bukan rute — itu id <FlowSection> yang dituju, jadi
 * ia dipotong dari path (supaya rutenya tetap cocok) dan dipakai untuk
 * menggulir ke bagiannya. Dengan begitu daftar isi "On this page" bisa berupa
 * tautan biasa: bisa diklik, disalin, dibuka di tab baru, dan tetap hidup
 * setelah halaman dimuat ulang.
 */
function parse(): { path: string; section: string } {
  const raw = window.location.hash.replace(/^#/, '')
  const i = raw.indexOf('#')
  if (i === -1) return { path: raw || '/', section: '' }
  return { path: raw.slice(0, i) || '/', section: raw.slice(i + 1) }
}

/** Menggulir ke bagian ber-id tersebut setelah elemennya sempat dirender. */
function scrollToSection(id: string) {
  requestAnimationFrame(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  })
}

export function useHashRoute(): [string, (path: string) => void] {
  const [path, setPath] = useState(() => parse().path)

  useEffect(() => {
    // Tautan yang dibuka langsung dengan penanda bagian.
    const { section } = parse()
    if (section) scrollToSection(section)
  }, [])

  useEffect(() => {
    const onChange = () => {
      const next = parse()
      setPath(next.path)
      if (next.section) scrollToSection(next.section)
      else window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = (to: string) => {
    window.location.hash = to
  }

  return [path, navigate]
}
