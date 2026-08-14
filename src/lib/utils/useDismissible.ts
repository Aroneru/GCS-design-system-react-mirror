import { useEffect, useState } from 'react'

/**
 * Perilaku buka/tutup untuk Alert dan Toast — padanan `dkDisclosure` di versi
 * Blade, tapi ditulis ulang sebagai hook React.
 *
 * Dua keadaan dipisah dengan sengaja: `visible` menggerakkan class transisi,
 * sedangkan `tertunda` menahan elemen tetap di DOM sampai animasi keluar
 * selesai. Kalau digabung jadi satu, elemen sudah hilang sebelum animasinya
 * sempat terlihat.
 *
 * `open` opsional — bila diisi, visibilitas dikendalikan sepenuhnya dari luar
 * dan `close()` tak lagi berpengaruh; bila tidak, komponen mengurusnya sendiri.
 */
export function useDismissible(open?: boolean, duration = 200) {
  const [dibuka, setDibuka] = useState(true)
  const terlihat = open ?? dibuka

  const [visible, setVisible] = useState(false)
  const [tertunda, setTertunda] = useState(false)

  useEffect(() => {
    if (terlihat) {
      // Jeda satu frame supaya browser sempat merender keadaan awal (opacity 0)
      // sebelum class tujuan dipasang — tanpa ini transisinya dilewati.
      const frame = requestAnimationFrame(() => {
        setTertunda(true)
        setVisible(true)
      })
      return () => cancelAnimationFrame(frame)
    }

    const frame = requestAnimationFrame(() => setVisible(false))
    const timer = setTimeout(() => setTertunda(false), duration)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
    }
  }, [terlihat, duration])

  return { mounted: terlihat || tertunda, visible, close: () => setDibuka(false) }
}
