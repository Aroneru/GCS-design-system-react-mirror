/**
 * Ikon solid — dipakai lewat subpath `@stasi/design-kit-react/icons/solid`.
 * Lihat catatan di ./outline.ts soal alasan pemisahan subpath.
 *
 * JANGAN dipakai dari dalam src/lib. Berkas ini adalah entry point
 * tersendiri, jadi bundler mengubah `export *`-nya menjadi satu objek
 * namespace berisi SELURUH ikon; komponen yang mengimpornya lewat sini
 * membuat objek itu ikut terbawa ke dist/index.js dan tree-shaking di
 * sisi consumer mati. Komponen di src/lib/components harus mengimpor
 * langsung dari 'flowbite-react-icons/*'.
 */
export * from 'flowbite-react-icons/solid'
