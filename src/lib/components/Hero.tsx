import { type ReactNode } from 'react'
import { cn } from '../utils/cn'
import { Button } from './Button'

/**
 * Susunan hero — nama nilainya mengikuti properti "Hero Type" di Figma:
 * gambar di kiri, gambar di kanan, atau tanpa gambar dengan teks terpusat.
 */
export type HeroType = 'horizontal-image-left' | 'horizontal-image-right' | 'centered'

/**
 * Properti "Platform" di Figma. `desktop` membiarkan susunannya mengikuti lebar
 * ruang yang tersedia; `mobile` memaksa susunan bertumpuk berapa pun lebarnya.
 */
export type HeroPlatform = 'desktop' | 'mobile'

/**
 * Orientasi gambar pendamping. Di Figma tiap tipe horizontal punya dua frame —
 * satu dengan gambar potret, satu dengan gambar lanskap — dan yang berbeda hanya
 * lebar kolom gambarnya. Rasio gambarnya sendiri tetap milik berkasnya.
 */
export type HeroImageOrientation = 'portrait' | 'landscape'

export interface HeroProps {
  /** Susunan hero (default: `horizontal-image-left`). */
  type?: HeroType
  /** Paksa susunan bertumpuk lewat `mobile` (default: `desktop`). */
  platform?: HeroPlatform
  /** Judul utama — Figma: "Hero Text". Dirender sebagai <h1>. */
  heading?: ReactNode
  /** Baris kecil berwarna primary di bawah judul — Figma: "Hero sub heading". */
  subHeading?: ReactNode
  /** Paragraf penjelas — Figma: "Hero Desc". */
  description?: ReactNode
  /**
   * Figma: "Show Heading". Yang dikendalikan adalah baris **sub heading**;
   * judul utama tidak pernah disembunyikan karena hero tanpa judul tidak punya
   * penanda halaman untuk pembaca layar.
   */
  showHeading?: boolean
  /** Figma: "Show Button". */
  showButton?: boolean
  buttonLabel?: string
  /** Bila diisi, tombolnya dirender sebagai <a>; kalau tidak, sebagai <button>. */
  buttonHref?: string
  onButtonClick?: () => void
  /** URL gambar. Diabaikan pada `type="centered"`. */
  image?: string
  imageAlt?: string
  /**
   * Orientasi kolom gambar (default: `portrait`). Hanya mengatur lebar kolomnya;
   * tinggi gambar tetap mengikuti rasio asli berkasnya, jadi kirim berkas yang
   * orientasinya memang cocok.
   */
  imageOrientation?: HeroImageOrientation
  /** Dipakai bila `image` kosong — misal ilustrasi <svg> inline. */
  imageContent?: ReactNode
  className?: string
}

/** Panah pada tombol — mengisi kotak ikon yang sudah diukur <Button>. */
const ArrowRight = () => (
  <svg
    className="size-full"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
)

/**
 * Hero — blok pembuka halaman: judul, sub heading, deskripsi, satu tombol, dan
 * (untuk dua tipe horizontal) satu gambar pendamping.
 *
 * Spec Figma: bingkai 1440px dengan padding 24px atas-bawah dan 0 kiri-kanan.
 * Tipe horizontal tingginya tetap 762px; tipe centered "Hug" ke ±474px.
 *
 * Padding kiri-kanan 0 itu tidak diturunkan apa adanya: di Figma isinya ditahan
 * wadah selebar 1290px yang dipusatkan, dan wadah itu tidak ada artinya di layar
 * yang lebih sempit dari 1290px. Yang dipakai di sini padding bertingkat sampai
 * 76px — jarak tepi yang sama pada bingkai 1440px — supaya di layar sempit teks
 * tidak menempel ke tepi.
 *
 * Tinggi 762px dipasang sebagai `min-height`, bukan tinggi tetap, supaya teks
 * yang lebih panjang menambah tinggi hero — bukan meluber ke luar bingkainya.
 *
 * Memakai `@container` seperti Footer dan Container: ambang susunannya diukur
 * dari lebar hero itu sendiri, bukan lebar viewport. Efeknya sama di pemakaian
 * normal, tapi hero jadi bisa dipratinjau di kotak sempit.
 *
 * Gambarnya sengaja tidak dikunci rasio apa pun (tanpa `aspect-*`, tanpa
 * `object-cover`): tingginya mengikuti rasio asli berkasnya. Mengunci rasio di
 * sini membuat ilustrasi potret ikut dipipihkan — teks di dalamnya jadi ikut
 * gepeng, dan itu tidak bisa diperbaiki dari sisi pemakai.
 */
export function Hero({
  type = 'horizontal-image-left',
  platform = 'desktop',
  heading,
  subHeading,
  description,
  showHeading = true,
  showButton = true,
  buttonLabel = 'Lihat Lebih Lanjut',
  buttonHref,
  onButtonClick,
  image,
  imageAlt = '',
  imageOrientation = 'portrait',
  imageContent,
  className,
}: HeroProps) {
  const centered = type === 'centered'
  const stacked = platform === 'mobile'
  const hasMedia = !centered && Boolean(image || imageContent)

  /**
   * Saat bertumpuk, tombol tipe horizontal melebar penuh: sasaran sentuh selebar
   * layar, dan itu memang yang digambar di frame mobile. Tipe centered tidak —
   * di frame-nya tombol tetap seukuran teksnya dan dipusatkan.
   */
  const buttonWidth = centered ? undefined : stacked ? 'w-full' : 'w-full @[768px]:w-auto'

  const button = showButton ? (
    buttonHref ? (
      <Button as="a" href={buttonHref} className={buttonWidth} rightIcon={<ArrowRight />}>
        {buttonLabel}
      </Button>
    ) : (
      <Button onClick={onButtonClick} className={buttonWidth} rightIcon={<ArrowRight />}>
        {buttonLabel}
      </Button>
    )
  ) : null

  /**
   * Bertumpuk = rata tengah, dua kolom = rata kiri. Aturannya sama untuk hero
   * yang dipaksa `platform="mobile"` maupun hero desktop di ruang sempit: yang
   * menentukan bentuknya adalah lebar yang tersedia, bukan jenis perangkatnya.
   */
  const alignLeftWhenWide = !centered && !stacked

  const text = (
    <div
      className={cn(
        'min-w-0 flex-1 text-center',
        alignLeftWhenWide && '@[768px]:text-left',
        // Tipe centered tidak punya gambar yang menahan tinggi, jadi rongga di
        // atas-bawah teks datang dari sini. Angkanya dipilih supaya tinggi total
        // frame mendekati 474px seperti "Height Hug (474px)" di Figma; padding
        // 24px milik bingkainya sendiri tetap terpisah di elemen luar.
        centered && 'mx-auto max-w-3xl py-16 @[768px]:py-24',
      )}
    >
      {heading && (
        <h1
          className={cn(
            'text-heading-1 font-black tracking-tight text-content',
            // Judul 48px baru dipakai saat kolomnya memang cukup lega; di kolom
            // sempit ukuran itu memecah judul jadi tiga baris.
            !stacked && '@[1024px]:text-display',
          )}
        >
          {heading}
        </h1>
      )}

      {showHeading && subHeading && (
        <p className="mt-2 text-body-lg font-bold text-primary-600">{subHeading}</p>
      )}

      {description && (
        <p
          className={cn(
            // 672px — lebar yang sama dengan paragraf pengantar di dokumentasi,
            // supaya blok teks panjang di seluruh produk terbaca satu ukuran.
            // Pada 18px isinya ±74 karakter per baris, masih di dalam rentang
            // yang nyaman dibaca. Di kolom yang lebih sempit — dua kolom pada
            // tipe horizontal — batas ini tidak pernah aktif, jadi deskripsi
            // tetap sebaris dengan judul dan tombolnya; yang ditahan hanya satu
            // kolom di ruang lebar.
            'mx-auto mt-4 max-w-2xl text-body-lg leading-relaxed text-content-subtle',
            alignLeftWhenWide && '@[768px]:mx-0',
          )}
        >
          {description}
        </p>
      )}

      {button && (
        <div
          className={cn('mt-8 flex justify-center', alignLeftWhenWide && '@[768px]:justify-start')}
        >
          {button}
        </div>
      )}
    </div>
  )

  /**
   * Lebar kolom gambar per orientasi, mengikuti kotak gambar di Figma:
   * potret 386px, lanskap 435px. Saat bertumpuk, gambar potret dijepit 270px dan
   * dipusatkan — di lebar ponsel kartu potret yang selebar layar jadi raksasa —
   * sedangkan gambar lanskap memang mengisi lebar yang tersedia.
   */
  const mediaWidth =
    imageOrientation === 'landscape'
      ? {
          stacked: 'w-full',
          wide: '@[768px]:w-[380px] @[1024px]:w-[435px]',
        }
      : {
          stacked: 'mx-auto w-full max-w-[270px]',
          wide: '@[768px]:mx-0 @[768px]:w-[320px] @[768px]:max-w-none @[1024px]:w-[386px]',
        }

  const media = hasMedia && (
    <div className={cn('shrink-0', mediaWidth.stacked, !stacked && mediaWidth.wide)}>
      {image ? (
        <img src={image} alt={imageAlt} className="h-auto w-full rounded-xl shadow-soft" />
      ) : (
        imageContent
      )}
    </div>
  )

  return (
    <section
      className={cn('@container w-full', centered ? 'bg-primary-50' : 'bg-surface', className)}
    >
      <div
        className={cn(
          // py-6 = padding 24px atas-bawah dari Figma; kiri-kanan di Figma 0
          // karena isinya ditahan wadah selebar 1290px yang dipusatkan — di sini
          // hal yang sama dicapai lewat padding, supaya di layar sempit isinya
          // tidak menempel ke tepi. px-19 = 76px, jarak tepi pada bingkai 1440px.
          'mx-auto flex w-full max-w-[1440px] flex-col justify-center px-5 py-6',
          '@[640px]:px-8 @[1024px]:px-12 @[1280px]:px-19',
          // Tinggi 762px dari Figma hanya berlaku saat hero benar-benar selebar
          // bingkai desainnya. Di susunan bertumpuk — dan di dua kolom yang
          // masih sempit — tinggi itu cuma jadi rongga kosong.
          hasMedia && !stacked && '@[1024px]:min-h-[762px]',
        )}
      >
        {hasMedia ? (
          <div
            className={cn(
              // 72px saat bertumpuk — frame mobile memberi jeda jelas antara
              // tombol dan gambar; kalau 40px, gambarnya terbaca menempel tombol.
              'flex flex-col gap-18',
              !stacked && '@[768px]:flex-row @[768px]:items-center @[768px]:gap-12 @[1280px]:gap-24',
              // Teks selalu ditulis lebih dulu di DOM supaya <h1> jadi hal
              // pertama yang dibacakan; letak gambar diatur arah barisnya.
              !stacked && type === 'horizontal-image-left' && '@[768px]:flex-row-reverse',
            )}
          >
            {text}
            {media}
          </div>
        ) : (
          text
        )}
      </div>
    </section>
  )
}
