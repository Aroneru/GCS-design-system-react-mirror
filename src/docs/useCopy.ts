import { useState } from 'react'

/**
 * Logika tombol "Salin" — port dari komponen Alpine `copy(code, id)` di Blade.
 * Mengembalikan status `copied` yang otomatis reset setelah 1,6 detik.
 */
export function useCopy(text: string): [boolean, () => void] {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard tidak tersedia */
    }
  }

  return [copied, copy]
}
