/**
 * Ikon outline — dipakai lewat subpath `@stasi/design-kit-react/icons/outline`.
 *
 * Sengaja tidak digabung ke barrel utama: nama ikon outline dan solid banyak
 * yang sama persis (mis. Home, Bell), sehingga re-export datar keduanya dari
 * satu berkas akan bentrok. Subpath terpisah juga menjaga tree-shaking —
 * consumer hanya ikut membawa ikon yang benar-benar diimpor.
 *
 * JANGAN dipakai dari dalam src/lib. Berkas ini adalah entry point
 * tersendiri, jadi bundler mengubah `export *`-nya menjadi satu objek
 * namespace berisi SELURUH ikon; komponen yang mengimpornya lewat sini
 * membuat objek itu ikut terbawa ke dist/index.js dan tree-shaking di
 * sisi consumer mati. Komponen di src/lib/components harus mengimpor
 * langsung dari 'flowbite-react-icons/*'.
 */
export * from 'flowbite-react-icons/outline'
