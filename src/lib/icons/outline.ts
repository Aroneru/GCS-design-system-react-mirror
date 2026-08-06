/**
 * Ikon outline — dipakai lewat subpath `@tpl/design-kit-react/icons/outline`.
 *
 * Sengaja tidak digabung ke barrel utama: nama ikon outline dan solid banyak
 * yang sama persis (mis. Home, Bell), sehingga re-export datar keduanya dari
 * satu berkas akan bentrok. Subpath terpisah juga menjaga tree-shaking —
 * consumer hanya ikut membawa ikon yang benar-benar diimpor.
 */
export * from 'flowbite-react-icons/outline'
