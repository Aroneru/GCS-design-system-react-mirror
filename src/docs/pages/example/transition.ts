/**
 * Transisi gelembung antara `/example` dan `/example/app`.
 *
 * Routing di situs ini berbasis hash, jadi berpindah rute berarti kedua halaman
 * benar-benar di-unmount dan di-mount ulang — tidak ada elemen yang hidup
 * menyeberangi perpindahan. Kesinambungannya karena itu dipalsukan: halaman
 * asal menumbuhkan lingkaran dari titik yang diklik sampai menutup layar, lalu
 * halaman tujuan memulai dengan lingkaran yang sudah menutup dan mengempiskannya.
 * Warna, durasi, dan easing dipusatkan di sini supaya kedua sisi tidak mungkin
 * berbeda.
 */
import { gsap, prefersReducedMotion } from '../../motion'

/**
 * Lingkaran transisi.
 *
 * `left-0 top-0` + `w-[300vmax]` membuat keadaan diamnya sudah menutupi
 * viewport, sehingga halaman tujuan bisa merendernya dengan `scale-100` tanpa
 * perlu menghitung apa pun. 300vmax bukan angka asal: agar lingkaran yang
 * dipusatkan di sudut layar tetap menutup sudut terjauh, jari-jarinya harus
 * ≥ diagonal viewport, dan diagonal paling panjang adalah √2 × vmax ≈ 1,42vmax
 * — jadi diameternya perlu ≥ 2,83vmax.
 *
 * PENTING: elemen ini tidak boleh berada di dalam elemen yang membuat stacking
 * context (`isolate`, `transform`, `filter`, atau position + z-index). Kalau
 * ya, `z-[100]`-nya terkurung di sana dan elemen lain berlapis lebih tinggi —
 * misalnya rail `z-30` milik DocsLayout — akan tetap terlihat menembusnya.
 */
export const KELAS_TIRAI =
  'pointer-events-none fixed top-0 left-0 z-[100] aspect-square w-[300vmax] rounded-full ' +
  'bg-gradient-to-br from-primary-100 to-primary-300'

/**
 * Warna dan kecepatan di sini dipilih untuk kenyamanan mata, bukan untuk
 * mencolok. Yang membuat transisi layar penuh terasa menyakitkan adalah
 * lompatan luminansi: halaman terang tiba-tiba tertutup warna pekat berjenuh
 * tinggi. Karena itu gelembungnya memakai gradien biru muda dari palet brand
 * (primary-100 → primary-300) — masih biru, tetapi luminansinya berdekatan
 * dengan halaman putih di baliknya sehingga tidak ada kilatan. Bandingkan
 * dengan primary-700 (#1a56db) yang dipakai semula: warnanya sama, jenuhnya
 * yang menyakitkan.
 *
 * Easing-nya `sine.inOut`, bukan `power2.inOut`: kurva sinus tidak punya
 * puncak percepatan yang tajam, jadi bidang sebesar layar tidak pernah
 * bergerak menyentak. Durasinya sedikit lebih panjang dengan alasan yang sama
 * — makin luas area yang berubah, makin lambat ia boleh berubah.
 */
const DURASI_TUTUP = 1
const DURASI_BUKA = 0.95
const EASE = 'sine.inOut'

/** Titik pusat pertumbuhan gelembung, dalam koordinat viewport. */
export interface Titik {
  x: number
  y: number
}

const tengahLayar = (): Titik => ({
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
})

/**
 * Menumbuhkan gelembung dari `titik` sampai menutup layar, lalu menjalankan
 * `lalu` — biasanya navigasi.
 *
 * `lalu` dipanggil di `onComplete`, bukan lewat setTimeout terpisah, supaya
 * navigasi tidak pernah mendahului animasinya kalau frame-nya tersendat. Saat
 * gerak diminta dikurangi, animasinya dilewati sama sekali dan `lalu` langsung
 * dijalankan — bukan dijalankan setelah jeda kosong.
 */
export function tutupLalu(
  tirai: HTMLElement | null,
  konten: HTMLElement | null,
  titik: Titik | null,
  lalu: () => void,
) {
  if (!tirai || prefersReducedMotion()) {
    lalu()
    return
  }

  const { x, y } = titik ?? tengahLayar()
  const tl = gsap.timeline({ onComplete: lalu })

  // Konten menyusut sedikit sambil memudar, jadi terasa ditelan gelembung
  // alih-alih sekadar tertimpa.
  if (konten) {
    tl.to(konten, { opacity: 0, scale: 0.96, duration: 0.55, ease: 'sine.in' }, 0)
  }

  tl.fromTo(
    tirai,
    { left: x, top: y, xPercent: -50, yPercent: -50, scale: 0 },
    { scale: 1, duration: DURASI_TUTUP, ease: EASE },
    0.12,
  )
}

/**
 * Mengempiskan gelembung di halaman tujuan.
 *
 * Titik pusatnya dipakai tengah layar, bukan titik klik: klik itu terjadi di
 * halaman sebelumnya yang sudah di-unmount, dan mewariskan koordinatnya lewat
 * URL atau storage jauh lebih berisik daripada nilainya.
 *
 * Lingkarannya dirender sudah menutup (kelas `scale-100`) supaya tidak ada
 * kedip konten sebelum efek sempat berjalan. Karena itu jalur "gerak dikurangi"
 * tetap harus menyingkirkannya — kalau tidak, ia menempel selamanya.
 */
export function bukaTirai(tirai: HTMLElement | null) {
  if (!tirai) return

  if (prefersReducedMotion()) {
    gsap.set(tirai, { scale: 0 })
    return
  }

  const { x, y } = tengahLayar()

  gsap.fromTo(
    tirai,
    { left: x, top: y, xPercent: -50, yPercent: -50, scale: 1 },
    { scale: 0, duration: DURASI_BUKA, ease: EASE, delay: 0.12 },
  )
}

/** Titik tengah sebuah elemen — dipakai supaya gelembung tumbuh dari tombolnya. */
export function titikTengah(el: HTMLElement | null): Titik | null {
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}

/* ────────────────────────────────────────────────────────────────────────────
   Arah pulang: sapuan panel ke atas
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * Panel persegi untuk transisi kembali ke dokumentasi.
 *
 * Arah pulang sengaja tidak memakai gelembung. Bukan demi variasi: gerakan
 * yang sama persis di kedua arah membuat "masuk" dan "keluar" terasa identik,
 * padahal maknanya berlawanan. Panel yang menyapu ke atas — masuk dari bawah
 * saat meninggalkan aplikasi, lalu lanjut keluar lewat atas saat dokumentasi
 * muncul — memberi satu arah gerak yang konsisten, sehingga perpindahannya
 * terbaca sebagai satu gerakan menaik, bukan dua kejadian terpisah.
 */
export const KELAS_PANEL =
  'pointer-events-none fixed inset-0 z-[100] bg-gradient-to-b from-primary-100 to-primary-300'

/**
 * Dari mana halaman yang sedang dimuat didatangi.
 *
 * Animasi transisi hanya boleh jalan kalau pengguna menekan tombolnya. Membuka
 * `/example` atau `/example/app` langsung dari URL, dari navigasi docs, atau
 * me-refresh halaman harus tampil apa adanya — tanpa layar biru penuh yang
 * mengempis entah kenapa.
 *
 * Nilainya hidup di level modul, jadi refresh apa pun mengembalikannya ke
 * `'langsung'` dengan sendirinya: modulnya ikut dimuat ulang. Tidak ada
 * sessionStorage, dan memang tidak boleh ada — penanda yang bertahan melewati
 * reload justru akan memutar animasi pada halaman yang dibuka dari nol.
 *
 * Disetel dari handler klik, bukan dari efek. Pembacaannya dilakukan saat
 * render (lewat lazy initializer `useState`) supaya keadaan awal tirai sudah
 * benar pada cat pertama; pembersihannya menyusul di dalam efek, setelah
 * nilainya aman tersimpan di state.
 */
export type Asal = 'langsung' | 'docs' | 'app'

let asal: Asal = 'langsung'

/** Dipanggil di handler klik tepat sebelum animasi keluar dimulai. */
export const tandaiAsal = (dari: Asal) => {
  asal = dari
}

export const ambilAsal = () => asal

/**
 * Dipanggil dari efek setelah asalnya tersimpan di state komponen. Tanpa ini,
 * meninggalkan lalu kembali ke halaman yang sama dalam satu sesi akan memutar
 * ulang animasinya padahal tidak ada tombol yang ditekan.
 */
export const lupakanAsal = () => {
  asal = 'langsung'
}

/** Menaikkan panel dari bawah sampai menutup layar, lalu menjalankan `lalu`. */
export function tutupKeAtas(
  panel: HTMLElement | null,
  konten: HTMLElement | null,
  lalu: () => void,
) {
  if (!panel || prefersReducedMotion()) {
    lalu()
    return
  }

  const tl = gsap.timeline({ onComplete: lalu })

  // Konten ikut terangkat sedikit, jadi terasa didorong panel — bukan sekadar
  // tertutup olehnya.
  if (konten) {
    tl.to(konten, { opacity: 0, y: -28, duration: 0.5, ease: 'sine.in' }, 0)
  }

  tl.fromTo(panel, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: EASE }, 0.08)
}

/**
 * Melanjutkan sapuan: panel keluar lewat atas, menyingkap dokumentasi.
 *
 * Panelnya dirender sudah menutup (lihat `pulangDariApp`), jadi tidak ada kedip
 * konten sebelum efek berjalan.
 */
export function bukaKeAtas(panel: HTMLElement | null) {
  if (!panel) return

  if (prefersReducedMotion()) {
    gsap.set(panel, { yPercent: -100 })
    return
  }

  gsap.to(panel, { yPercent: -100, duration: 0.8, ease: EASE, delay: 0.05 })
}
