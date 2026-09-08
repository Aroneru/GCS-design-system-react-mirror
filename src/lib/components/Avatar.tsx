import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../utils/cn'

/** Tiga diameter lingkaran: 24px, 32px, dan 80px. */
export type AvatarSize = 'small' | 'default' | 'large'

/**
 * Diameter lingkaran beserta ukuran teks isinya.
 *
 * Teksnya ikut naik bertingkat — 12px, 16px, lalu 30px — supaya dua huruf
 * mengisi porsi ruang yang kira-kira sama di ketiga ukuran.
 */
const sizes: Record<AvatarSize, string> = {
  small: 'size-6 text-xs',
  default: 'size-8 text-base',
  large: 'size-20 text-3xl',
}

export interface AvatarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Alamat gambar. Bila kosong — atau gagal dimuat — isian teks yang tampil. */
  src?: string
  /**
   * Nama pemiliknya. Dipakai sebagai `alt` gambar, dan sebagai nama
   * aksesibilitas saat yang tampil hanya inisial. Biarkan kosong bila namanya
   * sudah tertulis tepat di sebelah avatar: dengan begitu avatarnya terbaca
   * sebagai hiasan dan tidak diumumkan dua kali.
   */
  alt?: string
  /**
   * Isi lingkaran saat tidak ada gambar — umumnya satu atau dua huruf inisial.
   * Bisa juga diisi ikon kecil bila memang tidak ada nama yang bisa disingkat.
   */
  initials?: ReactNode
  size?: AvatarSize
}

/**
 * Avatar — lingkaran identitas berisi foto atau inisial.
 *
 * Bentuknya ditentukan oleh isinya, bukan oleh prop terpisah: ada `src` berarti
 * foto, tidak ada berarti inisial. Memisahkannya jadi prop `type` sendiri hanya
 * akan membuka keadaan yang mustahil — "type foto tanpa gambar".
 *
 * Gambar yang gagal dimuat juga jatuh kembali ke inisial. Alamat foto profil
 * paling sering datang dari sistem lain dan bisa mati kapan saja; tanpa
 * penanganan ini yang tersisa hanya ikon gambar rusak.
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  { src, alt = '', initials, size = 'default', className, ...props },
  ref,
) {
  // Yang diingat adalah alamat yang gagal, bukan sekadar "pernah gagal", supaya
  // pergantian src berikutnya tetap dicoba lagi.
  const [gagal, setGagal] = useState<string | null>(null)
  const pakaiGambar = Boolean(src) && gagal !== src

  // Saat isinya cuma inisial, nama pemiliknya tidak punya tempat lain untuk
  // hidup selain di sini.
  const namanya = !pakaiGambar && alt ? alt : undefined

  return (
    <div
      ref={ref}
      role={namanya ? 'img' : undefined}
      aria-label={namanya}
      className={cn(
        'grid shrink-0 place-items-center overflow-hidden rounded-full bg-gray-100 font-normal text-gray-900',
        sizes[size],
        className,
      )}
      {...props}
    >
      {pakaiGambar ? (
        <img
          src={src}
          alt={alt}
          className="size-full object-cover"
          onError={() => setGagal(src ?? null)}
        />
      ) : (
        // Inisial disembunyikan dari pembaca layar: dieja huruf per huruf ia
        // tidak berarti apa-apa, dan namanya sudah diwakili aria-label di atas.
        <span aria-hidden="true">{initials}</span>
      )}
    </div>
  )
})

Avatar.displayName = 'Avatar'
