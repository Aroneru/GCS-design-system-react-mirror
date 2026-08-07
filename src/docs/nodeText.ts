import { Children, isValidElement, type ReactNode } from 'react'

/**
 * Mengambil teks polos dari sebuah ReactNode.
 *
 * Blok kode pada halaman dokumentasi ditulis sebagai JSX supaya sebagian
 * potongannya bisa disorot (<H>…</H>). Supaya isi clipboard persis sama dengan
 * yang terlihat — seperti pasangan `{{ $code }}` dan `@js($code)` di Blade —
 * teks untuk tombol salin diturunkan dari node yang sama, bukan ditulis ulang.
 */
export function nodeText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return ''
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)

  if (Array.isArray(node)) return node.map(nodeText).join('')

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return Children.toArray(node.props.children).map(nodeText).join('')
  }

  return ''
}
