/**
 * Menyusun URL berkas di folder public/ dengan menghormati base path build.
 *
 * Situs dokumentasi ini bisa disajikan dari sub-path — GitHub Pages project
 * site menyajikannya di https://<org>.github.io/<repo>/, bukan di root domain.
 * Path absolut seperti "/images/x.svg" selalu diukur dari root, jadi di sana
 * akan 404. Vite hanya menulis ulang URL di index.html dan di import modul,
 * bukan string literal di dalam kode, jadi rujukan aset harus lewat sini.
 *
 * Saat base "/" (dev server dan user/org Pages site) hasilnya sama persis
 * dengan path aslinya, jadi fungsi ini aman dipakai di mana pun.
 */
export function asset(path: string): string {
  // BASE_URL dijamin Vite selalu berakhiran "/", jadi garis miring di depan
  // path dibuang supaya tidak jadi dobel.
  return import.meta.env.BASE_URL + path.replace(/^\//, "");
}
