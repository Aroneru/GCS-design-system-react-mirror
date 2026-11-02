import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { User } from 'flowbite-react-icons/outline'
import femaleDark from '../assets/avatar/Female-Dark.svg'
import femaleLight from '../assets/avatar/Female-Light.svg'
import maleDark from '../assets/avatar/Male-Dark.svg'
import maleLight from '../assets/avatar/Male-Light.svg'
import { cn } from '../utils/cn'

/** Tiga diameter lingkaran: 24px, 32px, dan 80px. */
export type AvatarSize = 'small' | 'default' | 'large'
export type AvatarGender = 'male' | 'female'
export type AvatarFallback = 'initials' | 'profile'

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
  /** Nama pemilik Avatar, dipakai untuk nama aksesibel dan inisial otomatis. */
  name?: string
  /**
   * Isi lingkaran saat tidak ada gambar — umumnya satu atau dua huruf inisial.
   * Bisa juga diisi ikon kecil bila memang tidak ada nama yang bisa disingkat.
   */
  initials?: ReactNode
  size?: AvatarSize
  /** Ilustrasi profil yang dipakai ketika fallback tidak menghasilkan inisial. */
  gender?: AvatarGender
  /** Memilih fallback inisial atau langsung menampilkan ilustrasi profil. */
  fallback?: AvatarFallback
  /** @deprecated Gunakan scope ambient `data-theme="dark"`. */
  darkMode?: boolean
}

const profileAssets = {
  male: { light: maleLight, dark: maleDark },
  female: { light: femaleLight, dark: femaleDark },
} satisfies Record<AvatarGender, { light: string; dark: string }>

function graphemes(value: string): string[] {
  if (typeof Intl.Segmenter === 'function') {
    return Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(value), ({ segment }) => segment)
  }

  return Array.from(value)
}

function initialsFromName(name?: string): string {
  const words = name?.trim().split(/\s+/u).filter(Boolean) ?? []
  if (words.length === 0) return ''

  if (words.length === 1) return graphemes(words[0]).slice(0, 2).join('').toLocaleUpperCase()

  const first = graphemes(words[0])[0] ?? ''
  const last = graphemes(words.at(-1) ?? '')[0] ?? ''
  return `${first}${last}`.toLocaleUpperCase()
}

function hasInitials(value: ReactNode): boolean {
  return value !== undefined && value !== null && value !== false && value !== ''
}

function ProfileFallback({ gender }: { gender?: AvatarGender }) {
  if (!gender) {
    return <User className="size-[60%]" aria-hidden="true" />
  }

  const assets = profileAssets[gender]
  return (
    <>
      <img
        src={assets.light}
        alt=""
        className="size-full [display:var(--avatar-profile-light-display)]"
        aria-hidden="true"
      />
      <img
        src={assets.dark}
        alt=""
        className="size-full [display:var(--avatar-profile-dark-display)]"
        aria-hidden="true"
      />
    </>
  )
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
  {
    src,
    alt,
    name,
    initials,
    size = 'default',
    gender,
    fallback = 'initials',
    darkMode = false,
    className,
    ...props
  },
  ref,
) {
  // Yang diingat adalah alamat yang gagal, bukan sekadar "pernah gagal", supaya
  // pergantian src berikutnya tetap dicoba lagi.
  const [gagal, setGagal] = useState<string | null>(null)
  const pakaiGambar = Boolean(src) && gagal !== src
  const inisialOtomatis = initialsFromName(name)
  const isiInisial = hasInitials(initials) ? initials : inisialOtomatis
  const pakaiProfil = !pakaiGambar && (fallback === 'profile' || !hasInitials(isiInisial))

  const namaAksesibel = alt ?? name ?? ''

  return (
    <div
      ref={ref}
      role={!pakaiGambar && namaAksesibel ? 'img' : undefined}
      aria-label={!pakaiGambar && namaAksesibel ? namaAksesibel : undefined}
      data-theme={darkMode ? 'dark' : undefined}
      className={cn(
        'grid shrink-0 place-items-center overflow-hidden rounded-full bg-avatar-surface font-sans font-normal text-avatar-content',
        sizes[size],
        className,
      )}
      {...props}
    >
      {pakaiGambar ? (
        <img
          src={src}
          alt={namaAksesibel}
          className="size-full object-cover"
          onError={() => setGagal(src ?? null)}
        />
      ) : pakaiProfil ? (
        <span className="grid size-full place-items-center" aria-hidden="true">
          <ProfileFallback gender={gender} />
        </span>
      ) : (
        // Inisial disembunyikan dari pembaca layar: dieja huruf per huruf ia
        // tidak berarti apa-apa, dan namanya sudah diwakili aria-label di atas.
        <span className="leading-none" aria-hidden="true">
          {isiInisial}
        </span>
      )}
    </div>
  )
})

Avatar.displayName = 'Avatar'
