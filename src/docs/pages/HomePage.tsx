import { useEffect, useRef, useState, type ReactNode } from 'react'
// Footer tidak diimpor: DocsLayout sudah memasangnya untuk seluruh halaman.
import { Badge, Button, Card, Checkbox, Container, InputField, Toggle } from '../../lib'
import * as OutlineIcons from '../../lib/icons/outline'
import * as SolidIcons from '../../lib/icons/solid'
import { brandIcons } from '../../lib/brandIconRegistry'
import { sidebars } from '../navigation'
import { asset } from '../asset'
import { DocUsage } from '../DocUsage'
import { useCopy } from '../useCopy'
import {
  Aurora,
  CountUp,
  gsap,
  Magnetic,
  Reveal,
  ScrollProgress,
  SplitWords,
  SpotlightCard,
  TiltCard,
  useGsap,
} from '../motion'

const INSTALL = 'npm install @stasi/design-kit-react'

/**
 * Angka pada halaman ini diturunkan dari sumber aslinya — daftar navigasi dan
 * modul ikon — supaya tidak pernah basi saat halaman baru ditambahkan.
 */
const countLeaves = (key: string) =>
  sidebars[key].items
    .filter((i) => i.label !== 'Overview' && !i.soon && !i.alt)
    .reduce((n, i) => n + (i.children?.length ?? 1), 0)

/** Logo brand sudah termasuk di dalam set solid/outline, jadi tidak dijumlah lagi. */
const iconTotal = Object.keys(OutlineIcons).length + Object.keys(SolidIcons).length

/** Nilainya angka, bukan string, karena `CountUp` menghitung naik ke sana. */
const stats: { value: number; label: string; desc: string }[] = [
  { value: countLeaves('components'), label: 'Komponen', desc: 'Siap pakai dari satu package' },
  {
    value: countLeaves('form'),
    label: 'Elemen form',
    desc: 'Input, select, radio, toggle, checkbox',
  },
  {
    value: countLeaves('foundations'),
    label: 'Foundations',
    desc: 'Warna, tipografi, spacing, dan lainnya',
  },
  {
    value: iconTotal,
    label: 'Ikon',
    desc: `Set solid dan outline, plus ${brandIcons.length} logo brand`,
  },
]

/* ---------- Kenapa memakai design kit ini ---------- */

type Feature = { icon: string; title: string; desc: string }

const features: Feature[] = [
  {
    icon: 'M12 3.5c3.8 3.2 6.5 6 6.5 9.5a6.5 6.5 0 1 1-13 0c0-3.5 2.7-6.3 6.5-9.5Z',
    title: 'Satu sumber token',
    desc: 'Warna, jarak, radius, dan bayangan hidup di Foundations. Komponen tidak pernah memakai nilai lepas, jadi perubahan token langsung terasa di seluruh produk.',
  },
  {
    icon: 'M4 5.5h16v13H4v-13Zm5 0v13M4 10h5',
    title: 'Menyesuaikan ruangnya',
    desc: 'Card, Footer, dan Container memakai container query — tata letaknya mengikuti lebar kolom tempatnya berada, bukan lebar layar.',
  },
  {
    icon: 'M12 4.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15Zm-3 7.5 2 2 4-4',
    title: 'Aksesibilitas bawaan',
    desc: 'Dibangun di atas elemen HTML asli, lengkap dengan label, aria-invalid, dan fokus yang terlihat — tanpa perlu ditambahkan ulang di setiap halaman.',
  },
  // {
  //   icon: 'M4 7h16M4 12h16M4 17h10',
  //   title: 'Sejalan dengan Figma',
  //   desc: 'Setiap halaman menyebut angka aslinya — 52px, 380px, 1126px — sehingga desainer dan developer membaca spesifikasi yang sama.',
  // },
]

/* ---------- Bagian yang bisa dijelajahi ---------- */

const sections: { route: string; name: string; desc: string; badge: string }[] = [
  {
    route: '/foundations',
    name: 'Foundations',
    desc: 'Warna, tipografi, spacing, border, elevation, dan ikon — dasar visual seluruh produk.',
    badge: `${countLeaves('foundations')} halaman`,
  },
  {
    route: '/components',
    name: 'Components',
    desc: 'Container, Button, Badge, Alert, Toast, Card, Navbar, dan Footer beserta playground-nya.',
    badge: `${countLeaves('components')} komponen`,
  },
  {
    route: '/form',
    name: 'Form',
    desc: 'Input field, select, radio, toggle, dan checkbox dengan state serta varian aplikasi.',
    badge: `${countLeaves('form')} elemen`,
  },
  {
    route: '/example',
    name: 'Example',
    desc: 'Satu halaman layanan utuh yang dirakit hanya dari komponen di design kit ini.',
    badge: 'Halaman utuh',
  },
]

/* ---------- Tiga langkah pemasangan ---------- */

const steps: { title: string; desc: string; label?: string; code: string }[] = [
  {
    title: 'Pasang package-nya',
    desc: 'Satu dependensi. React dan Tailwind v4 sudah ada di proyekmu sebagai peer.',
    label: 'Terminal',
    code: INSTALL,
  },
  {
    title: 'Sambungkan stylesheet-nya',
    desc: 'Sekali saja di stylesheet utama. Baris @source yang membuat Tailwind ikut memindai berkas package.',
    label: 'CSS',
    code: `/* Sekali saja, di stylesheet utama proyek */
@import '@stasi/design-kit-react/styles.css';

/* Tailwind v4 perlu memindai berkas package agar
   utility yang dipakai komponen ikut ter-generate */
@source '../node_modules/@stasi/design-kit-react/dist/**/*.js';`,
  },
  {
    title: 'Impor komponennya',
    desc: 'Tidak ada provider yang perlu dibungkus dan tidak ada konfigurasi tambahan.',
    code: `import { Button, Badge, InputField } from '@stasi/design-kit-react'

export function FormPermohonan() {
  return (
    <form className="space-y-4">
      <InputField label="Nama lengkap" placeholder="Masukkan nama lengkap" />
      <div className="flex items-center gap-3">
        <Button variant="filled">Simpan</Button>
        <Badge variant="success">Draf tersimpan</Badge>
      </div>
    </form>
  )
}`,
  },
]

/* ---------- Jendela kode di hero ---------- */

/**
 * Easter egg: klip suara di balik tombol pengeras suara di title bar jendela.
 *
 * Diputar bergantian, bukan acak. Acak berarti klip yang sama bisa keluar dua
 * kali berturut-turut — dan lelucon yang diulang persis terdengar seperti tombol
 * yang rusak, bukan seperti giliran berikutnya.
 */
const EGG_CLIPS = [
  { src: '/icons/5d31a94b3f09a18ca28485339e47d67492b8f26443db53f0bdd352655438cba4b2d45e4920d2578f5c538ff0c44b63a417646e1e1db10e50cc2068a34374cb3d.mp3', label: 'Hey, antek-antek asing' },
  { src: '/icons/fd6c085a954ccdeae8b4afe94b06a34b1de98c7ba942c778121a4fd88f0e20b1ff06bc594f81defe832a6a8a14067fdb.mp3', label: 'Hidup Jokowi' },
]

/**
 * Pola kedip lampu rusak untuk latar jendela kode.
 *
 * Ditulis sebagai data, bukan diacak saat berjalan. Angka acak membuat tiap
 * putaran berbeda — kedengarannya bagus, tapi hasilnya justru kehilangan bentuk:
 * yang bikin sebuah kedipan terasa "rusak" adalah iramanya yang timpang tapi
 * DIKENALI, bukan sekadar tak beraturan. Pola tetap juga berarti apa yang dilihat
 * saat menyetel angkanya sama persis dengan yang dilihat pengguna.
 *
 * `on` selalu jauh lebih pendek dari `off` — total menyala kurang dari sepertiga
 * putaran, dan sebagian besar hanya sekelebat. Gelap adalah keadaan normalnya;
 * fotonya cuma tertangkap sesekali.
 *
 * `clip` memotong gambar jadi pita horizontal, meniru baris pindai yang putus —
 * itu yang membedakan ini dari sekadar lampu berkedip. Dipakai hemat: dua-tiga
 * kali per putaran sudah cukup, lebih dari itu terbaca sebagai animasi rusak,
 * bukan gambar yang rusak.
 */
const FLICKER: { on: number; off: number; opacity: number; x?: number; clip?: string }[] = [
  { on: 0.05, off: 0.13, opacity: 0.55 },
  { on: 0.04, off: 0.05, opacity: 0.8, x: -3 },
  { on: 0.03, off: 0.42, opacity: 0.35 },
  { on: 0.07, off: 0.06, opacity: 0.7, clip: 'inset(28% 0 44% 0)' },
  { on: 0.04, off: 0.09, opacity: 0.85, x: 4 },
  { on: 0.02, off: 0.7, opacity: 0.5 },
  // Satu tarikan panjang di tengah — matanya sempat bertemu, lalu putus lagi.
  { on: 0.85, off: 0.16, opacity: 0.75 },
  { on: 0.05, off: 0.07, opacity: 0.6, x: -5, clip: 'inset(9% 0 61% 0)' },
  { on: 0.03, off: 0.05, opacity: 0.9 },
  { on: 0.12, off: 0.9, opacity: 0.45, clip: 'inset(52% 0 12% 0)' },
  { on: 0.03, off: 0.06, opacity: 0.8, x: 3 },
  { on: 0.06, off: 1.4, opacity: 0.4 },
]

/** Titik-titik ala jendela macOS. */
const WindowDots = () => (
  <span className="flex gap-1.5" aria-hidden="true">
    <span className="size-3 rounded-full bg-red-500" />
    <span className="size-3 rounded-full bg-yellow-300" />
    <span className="size-3 rounded-full bg-green-500" />
  </span>
)

/**
 * Potongan kode di jendela hero, dinyatakan sebagai data alih-alih markup.
 *
 * Bentuk ini yang membuat efek mengetik mungkin: animasinya perlu tahu ada
 * berapa karakter di tiap baris agar bisa mengungkap — dan menarik kembali —
 * teksnya per karakter. Kalau potongan ini ditulis sebagai JSX bersarang,
 * jumlah itu hanya bisa didapat dengan membaca DOM, dan menghapus karakter
 * berarti membongkar node.
 *
 * `cls` kosong berarti warna teks bawaan jendela.
 */
type Token = { t: string; cls?: string }

const KEY = 'text-primary-300'
const STR = 'text-green-300'
const PROP = 'text-purple-300'

type Snippet = { file: string; lines: Token[][] }

/**
 * Kalimat pembuka yang tetap di setiap potongan.
 *
 * Bagian inilah yang menyampaikan janji halamannya — tulis sekali, pakai di mana
 * saja, token Foundations langsung jadi utility Tailwind. Yang berganti-ganti di
 * bawahnya hanya komponen contohnya; pembukanya justru harus tinggal supaya tiap
 * giliran tetap punya konteks, bukan sekadar potongan JSX lepas.
 */
const PREAMBLE: Token[][] = [
  [
    { t: '<h3>', cls: KEY },
    { t: 'Tulis sekali. Pakai di mana saja.' },
    { t: '</h3>', cls: KEY },
  ],
  [
    { t: '<p ', cls: KEY },
    { t: 'className', cls: PROP },
    { t: '=' },
    { t: '"text-body-sm text-gray-500"', cls: STR },
    { t: '>', cls: KEY },
  ],
  [{ t: '  Token Foundations → Tailwind v4' }],
  [{ t: '</p>', cls: KEY }],
  [],
]

/**
 * Lima potongan yang diputar bergantian di jendela hero.
 *
 * Urutannya selang-seling antara komponen tampilan dan elemen form — Select,
 * Button, InputField, Card, Checkbox — supaya yang lewat di layar terbaca
 * sebagai satu design kit yang lengkap, bukan sebagai satu komponen yang
 * ditulis lima cara.
 *
 * Nama berkasnya ikut berganti tiap giliran. Pergantiannya jatuh persis saat
 * jendela sedang kosong, jadi terbaca seperti membuka berkas berikutnya.
 *
 * Tiap `lines` di sini hanya bagian komponennya; pembukanya disambungkan di
 * bawah supaya tidak perlu ditulis ulang lima kali.
 */
const SNIPPETS: Snippet[] = [
  {
    file: 'pilih-aplikasi.tsx',
    lines: [
      [{ t: '<Select', cls: KEY }],
      [{ t: '  ' }, { t: 'label', cls: PROP }, { t: '=' }, { t: '"Pilih aplikasi"', cls: STR }],
      [
        { t: '  ' },
        { t: 'options', cls: PROP },
        { t: '={[' },
        { t: "'default'", cls: STR },
        { t: ', ' },
        { t: "'simaya'", cls: STR },
        { t: ']}' },
      ],
      [{ t: '/>', cls: KEY }],
    ],
  },
  {
    file: 'aksi-permohonan.tsx',
    lines: [
      [
        { t: '<Button ', cls: KEY },
        { t: 'variant', cls: PROP },
        { t: '=' },
        { t: '"filled"', cls: STR },
        { t: '>', cls: KEY },
        { t: 'Simpan' },
        { t: '</Button>', cls: KEY },
      ],
      [
        { t: '<Badge ', cls: KEY },
        { t: 'variant', cls: PROP },
        { t: '=' },
        { t: '"success"', cls: STR },
        { t: '>', cls: KEY },
        { t: 'Tersimpan' },
        { t: '</Badge>', cls: KEY },
      ],
    ],
  },
  {
    file: 'data-pemohon.tsx',
    lines: [
      [{ t: '<InputField', cls: KEY }],
      [{ t: '  ' }, { t: 'label', cls: PROP }, { t: '=' }, { t: '"Nama lengkap"', cls: STR }],
      [
        { t: '  ' },
        { t: 'placeholder', cls: PROP },
        { t: '=' },
        { t: '"Masukkan nama lengkap"', cls: STR },
      ],
      [{ t: '/>', cls: KEY }],
    ],
  },
  {
    file: 'ringkasan-layanan.tsx',
    lines: [
      [{ t: '<Card', cls: KEY }],
      [{ t: '  ' }, { t: 'title', cls: PROP }, { t: '=' }, { t: '"Kartu ringkas"', cls: STR }],
      [
        { t: '  ' },
        { t: 'description', cls: PROP },
        { t: '=' },
        { t: '"Judul dan deskripsi opsional."', cls: STR },
      ],
      [{ t: '/>', cls: KEY }],
    ],
  },
  {
    file: 'preferensi-notifikasi.tsx',
    lines: [
      [{ t: '<Checkbox', cls: KEY }],
      [
        { t: '  ' },
        { t: 'label', cls: PROP },
        { t: '=' },
        { t: '"Kirim salinan ke email"', cls: STR },
      ],
      [{ t: '  ' }, { t: 'defaultChecked', cls: PROP }],
      [{ t: '/>', cls: KEY }],
      [
        { t: '<Toggle ', cls: KEY },
        { t: 'label', cls: PROP },
        { t: '=' },
        { t: '"Notifikasi"', cls: STR },
        { t: ' />', cls: KEY },
      ],
    ],
  },
].map((s) => ({ ...s, lines: [...PREAMBLE, ...s.lines] }))

/**
 * Panjang tiap baris dalam karakter, posisi awal baris itu di seluruh potongan,
 * dan totalnya — dihitung sekali di muka untuk tiap potongan, karena animasinya
 * membacanya puluhan kali per detik.
 */
const METRICS = SNIPPETS.map(({ lines }) => {
  const len = lines.map((line) => line.reduce((n, tok) => n + tok.t.length, 0))
  const start = len.reduce<number[]>(
    (acc, _l, i) => [...acc, (acc[i - 1] ?? 0) + (len[i - 1] ?? 0)],
    [],
  )
  return { len, start, total: len.reduce((a, b) => a + b, 0) }
})

/**
 * Jumlah baris potongan terpanjang. Tinggi area kode dikunci ke angka ini,
 * kalau tidak jendelanya akan mengerut dan memuai tiap kali potongan berganti —
 * dan seluruh hero ikut bergeser bersamanya.
 */
const MAX_LINES = Math.max(...SNIPPETS.map((s) => s.lines.length))

/** Tinggi satu baris, dipakai bersama oleh kelas `leading-6` dan posisi kursor. */
const LINE_HEIGHT_REM = 1.5

/** Karakter per detik saat mengetik. Durasi diturunkan dari sini supaya potongan
 *  yang lebih panjang tidak terasa lebih cepat diketik. */
const TYPE_SPEED = 26

/**
 * Jendela kode yang mengetik sendiri isinya, menghapusnya, lalu berpindah ke
 * potongan berikutnya — terus berputar.
 *
 * Yang dianimasikan bukan isi DOM melainkan LEBAR tiap baris, dalam satuan `ch`.
 * Karena fontnya monospace, satu `ch` persis selebar satu karakter, jadi lebar
 * `n * 1ch` memotong baris tepat setelah karakter ke-n. Artinya seluruh teks
 * potongan yang aktif sudah ada di DOM sejak awal — tidak ada node yang dibuat
 * atau dibuang per karakter — dan menghapus hanya berarti menyusutkan lebar
 * kembali.
 *
 * Konsekuensinya, yang terbaca pembaca layar selalu potongan kode yang lengkap,
 * bukan teks separuh jadi yang berubah-ubah.
 *
 * Perputarannya digerakkan oleh `index`: timeline satu giliran diakhiri dengan
 * menaikkan index, yang membuat `useGsap` membangun timeline berikutnya untuk
 * potongan berikutnya. Karena itu tidak ada timeline tak terhingga yang harus
 * dijaga tetap sinkron dengan React — tiap giliran adalah timeline pendek yang
 * berdiri sendiri.
 *
 * Tanpa animasi (mode gerak dikurangi) tidak ada lebar yang pernah ditulis, jadi
 * tiap baris memakai lebarnya sendiri dan potongan pertama tampil utuh.
 */
function CodeWindow() {
  const [index, setIndex] = useState(0)
  const snippet = SNIPPETS[index]
  const metrics = METRICS[index]

  // Hanya giliran pertama yang menunggu; sesudahnya potongan berikutnya langsung
  // menyusul supaya jeda antarpotongan tidak terasa seperti animasi tersendat.
  const firstRun = useRef(true)

  const audio = useRef<HTMLAudioElement>(null)
  const [clip, setClip] = useState(0)
  const [playing, setPlaying] = useState(false)
  // Timeline "lampu menyala" di bawah, disimpan supaya tombol suara bisa
  // mengambil alih fotonya selagi klip berbunyi.
  const light = useRef<gsap.core.Timeline | null>(null)

  const ref = useGsap<HTMLDivElement>(({ q }) => {
    const lineEls = q('[data-line]')
    const caret = q('[data-caret]')[0]
    const counter = { n: 0 }

    const draw = () => {
      const n = counter.n
      let caretLine = 0
      let caretCol = 0

      lineEls.forEach((line, i) => {
        const visible = Math.min(Math.max(n - metrics.start[i], 0), metrics.len[i])
        line.style.width = `${visible}ch`

        // Kursor duduk di baris terakhir yang sudah tersentuh. Baris kosong ikut
        // tersentuh pada offset yang sama dengan baris sesudahnya, jadi baris
        // berikutnya menimpanya dan kursor tidak pernah tertinggal di ruang kosong.
        if (n >= metrics.start[i]) {
          caretLine = i
          caretCol = visible
        }
      })

      caret.style.transform = `translate(${caretCol}ch, ${caretLine * LINE_HEIGHT_REM}rem)`
    }

    // Digambar sekali sebelum timeline mulai. Tanpa ini, selama `delay` di bawah
    // belum ada satu pun lebar yang tertulis, jadi tiap baris memakai lebar
    // aslinya — kode utuh berkedip muncul lebih dulu, lalu hilang begitu frame
    // pertama animasi menimpanya.
    draw()

    const tl = gsap
      .timeline({ delay: firstRun.current ? 0.5 : 0.25 })
      .to(counter, {
        n: metrics.total,
        duration: metrics.total / TYPE_SPEED,
        ease: 'none',
        onUpdate: draw,
      })
      .to(counter, { duration: 1.8 })
      // Menghapus selalu lebih cepat daripada mengetik, dan makin cepat di
      // akhir — itu yang membuatnya terbaca sebagai backspace ditahan, bukan
      // sebagai animasi yang diputar mundur.
      .to(counter, { n: 0, duration: 0.7, ease: 'power2.in', onUpdate: draw })
      .call(() => {
        firstRun.current = false
        setIndex((i) => (i + 1) % SNIPPETS.length)
      })

    // `fromTo`, bukan `to`: kursor berangkat dari `opacity-0` di markup supaya
    // pada mode gerak dikurangi — ketika seluruh setup ini dilewati — ia tidak
    // tertinggal diam di pojok kiri atas menutupi karakter pertama.
    gsap.fromTo(
      caret,
      { opacity: 1 },
      { opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: 'steps(1)' },
    )

    return () => {
      tl.kill()
    }
  }, [
    // index]
  )
    
  /*
   * Lampu menyala.
   *
   * Jendela ini gelap sepanjang waktu, lalu sesekali "terang" — fotonya naik ke
   * opacity 75%, bertahan sebentar, lalu pudar lagi sampai habis.
   *
   * Naik dan turunnya tidak simetris, dan itu disengaja. Menyala pakai
   * `power2.out` (cepat di awal lalu melambat) supaya kemunculannya masih terasa
   * seperti lampu disentak, sementara padamnya pakai `power2.in` yang berangkat
   * pelan — jadi ia terbaca meredup, bukan dipotong. Fade dengan durasi dan easing
   * yang sama persis di kedua arah selalu terasa seperti animasi yang diputar
   * mundur.
   *
   * Timeline-nya sengaja terpisah dari timeline mengetik di atas. Yang itu
   * dibangun ulang tiap potongan kode berganti; kalau siklus lampu ikut menumpang
   * di sana, ia ter-reset setiap giliran dan iramanya jadi terikat pada panjang
   * potongan — bukan pada waktunya sendiri. Dependensi kosong membuatnya dibangun
   * sekali seumur komponen.
   *
   * Satu kedipan per ~6 detik (0,17Hz), jauh di bawah ambang 3Hz yang memicu
   * masalah fotosensitif. Jangan dipercepat sampai ke wilayah itu.
   */
  const shell = useGsap<HTMLDivElement>(({ q }) => {
    const wowo = q('[data-wowo]')

    // Semuanya `set`, tidak satu pun `to`. Kedipan lampu rusak tidak punya
    // easing — ia menyambung atau tidak sama sekali; begitu ada interpolasi,
    // yang terbaca langsung berubah jadi denyut lembut. Penahan waktunya tween
    // kosong: yang berjalan cuma waktunya, tidak ada properti yang ditulis.
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 5.5, delay: 1.5 })

    FLICKER.forEach((beat) => {
      tl.set(wowo, {
        opacity: beat.opacity,
        x: beat.x ?? 0,
        clipPath: beat.clip ?? 'inset(0%)',
      })
        .to({}, { duration: beat.on })
        // Padam berarti benar-benar bersih: geseran dan potongan ikut dinolkan,
        // kalau tidak sisa transform-nya menempel ke kedipan berikutnya dan
        // gambarnya terlihat merayap ke satu arah sepanjang putaran.
        .set(wowo, { opacity: 0, x: 0, clipPath: 'inset(0%)' })
        .to({}, { duration: beat.off })
    })

    light.current = tl

    return () => {
      tl.kill()
      light.current = null
    }
  }, [])

  /*
   * Tombol easter egg.
   *
   * Selagi klip berbunyi, siklus lampu dihentikan dan fotonya ditahan menyala.
   * Kalau tidak, timeline yang berjalan sendiri itu akan memudarkan wowo di
   * tengah kalimatnya — dua animasi menulis `opacity` pada elemen yang sama, dan
   * yang menang hanya yang kebetulan menulis paling akhir.
   *
   * `light.current` bisa null pada mode gerak dikurangi: di sana `useGsap`
   * melewati setup-nya sama sekali. Suaranya tetap boleh diputar — yang diminta
   * untuk dikurangi adalah gerak, bukan bunyi.
   */
  const wowoEl = () => shell.current?.querySelector('[data-wowo]') ?? null

  // Klip harus berhenti kalau halamannya ditinggalkan di tengah bunyi. Melepas
  // elemen <audio> dari DOM tidak dijamin menghentikan pemutarannya, dan suara
  // yang terus berbunyi dari halaman yang sudah tidak terlihat hanya membuat
  // orang mencari-cari tab mana yang bersuara.
  useEffect(() => {
    const el = audio.current
    return () => el?.pause()
  }, [])

  const stopEgg = () => {
    const el = audio.current
    if (el) {
      el.pause()
      el.currentTime = 0
    }
    setPlaying(false)

    const wowo = wowoEl()
    if (wowo) gsap.to(wowo, { opacity: 0, duration: 0.6, ease: 'power2.in' })
    // Diputar ulang dari nol, bukan dilanjutkan: melanjutkan berarti lampu
    // menyala lagi sepersekian detik setelah klipnya habis.
    light.current?.restart(true)
  }

  const toggleEgg = async () => {
    const el = audio.current
    if (!el) return

    if (playing) {
      stopEgg()
      return
    }

    el.src = asset(EGG_CLIPS[clip].src)
    el.volume = 0.8
    light.current?.pause()

    // `x` dan `clipPath` ikut dinolkan: timeline kedip bisa dijeda tepat di
    // tengah beat yang sedang menggeser atau memotong gambar, dan sisanya akan
    // menempel selama klip berbunyi.
    const wowo = wowoEl()
    if (wowo) {
      gsap.to(wowo, {
        opacity: 0.75,
        x: 0,
        clipPath: 'inset(0%)',
        duration: 0.35,
        ease: 'power2.out',
      })
    }

    try {
      // Dipanggil dari klik, jadi kebijakan autoplay browser tidak menghalangi.
      // Tetap dijaga: berkasnya bisa saja gagal dimuat, dan promise yang ditolak
      // tanpa penangan muncul sebagai error tak tertangani di konsol.
      await el.play()
      setPlaying(true)
      setClip((i) => (i + 1) % EGG_CLIPS.length)
    } catch {
      stopEgg()
    }
  }

  return (
    <div ref={shell} className="relative">
      {/*
        Ketinggian jendela dinyatakan lewat bayangan netral berlapis, bukan
        cahaya berwarna. Tiga lapis dengan jarak dan kelembutan yang menaik
        meniru cara benda nyata menahan bayangan: satu garis rapat di bawah
        tepinya, satu sedang, satu luas dan samar. Warnanya diambil dari keluarga
        yang sama dengan --shadow-soft di tokens.css (gray-900), jadi ia sekadar
        gelap — bukan aksen tersendiri yang ikut bersaing dengan isi halaman.
      */}
      <div
        ref={ref}
        className="group/window relative overflow-hidden rounded-2xl bg-gray-900 shadow-[0_2px_4px_rgb(17_24_39/0.06),0_12px_28px_rgb(17_24_39/0.12),0_36px_64px_rgb(17_24_39/0.16)] ring-1 ring-gray-900/10"
      >
        {/*
          Latar jendela kode. Murni dekoratif — karena itu aria-hidden dan alt
          kosong, biar tidak ikut dibacakan pembaca layar.

          Berangkat dari `opacity-0`, bukan dari nilai akhirnya. Pada mode gerak
          dikurangi seluruh setup GSAP dilewati, dan di sana justru itulah yang
          benar: kedipan terang-gelap adalah persis jenis gerak yang diminta
          untuk tidak dijalankan, jadi jendelanya tinggal gelap seperti biasa.
        */}
        {/* <img
          data-wowo
          src={asset('/images/87dabbda5bfc01063ce53720723e862b59576b383d1895913e03148d029525d264ebd1461d74ae3e29a50f303ef8a910.png')}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 size-full object-cover opacity-0 select-none"
        /> */}

        <div className="relative z-10 flex items-center gap-3 bg-gray-800/70 px-4 py-3">
          <WindowDots />
          <span className="ml-1 inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-1">
            <span className="font-mono text-[11px] font-black text-yellow-300">TSX</span>
            <span className="text-xs font-bold text-gray-200">{snippet.file}</span>
          </span>

          {/*
            Easter egg. Sengaja nyaris tak terlihat sampai jendelanya disentuh
            kursor — kalau ia menuntut perhatian seperti kontrol lain, ia berhenti
            jadi kejutan dan mulai terbaca sebagai fitur yang perlu dijelaskan.
            Tetap sebuah <button> sungguhan: bisa dicapai dengan Tab, punya nama
            yang dibacakan, dan cincin fokusnya membuatnya muncul sepenuhnya.
          */}
          <button
            type="button"
            onClick={toggleEgg}
            aria-pressed={playing}
            aria-label={playing ? 'Hentikan suara' : `Putar suara: ${EGG_CLIPS[clip].label}`}
            title={playing ? 'Hentikan' : EGG_CLIPS[clip].label}
            className={`ml-auto grid size-7 shrink-0 place-items-center rounded-md text-gray-400 transition-[opacity,color,background-color] duration-300 group-hover/window:opacity-100 hover:bg-gray-700/60 hover:text-yellow-300 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none ${
              playing ? 'text-yellow-300 opacity-100' : 'opacity-15'
            }`}
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5 6.5 9H4v6h2.5L11 19V5Z" />
              {playing ? (
                <>
                  <path strokeLinecap="round" d="M14.5 9.5c1.2 1.4 1.2 3.6 0 5" />
                  <path strokeLinecap="round" d="M17.5 7c2.4 2.6 2.4 7.4 0 10" />
                </>
              ) : (
                <path strokeLinecap="round" d="M14.5 9.5c1.2 1.4 1.2 3.6 0 5" />
              )}
            </svg>
          </button>

          {/*
            `preload="none"`: berkasnya tidak pernah diunduh sampai ada yang
            benar-benar menekan tombolnya. Easter egg tidak layak menambah beban
            unduhan halaman beranda bagi orang yang tak pernah menemukannya.
          */}
          <audio ref={audio} preload="none" onEnded={stopEgg} />
        </div>

        <pre className="ds-scroll-x relative z-10 overflow-x-auto p-5 font-mono text-xs leading-6 text-gray-300 sm:p-6">
          {/* Tinggi dikunci ke potongan terpanjang supaya jendela tidak berubah
              ukuran saat potongan berganti. */}
          <code
            className="relative block"
            style={{ height: `${MAX_LINES * LINE_HEIGHT_REM}rem` }}
          >
            {snippet.lines.map((line, i) => (
              // Tinggi baris dikunci di pembungkus luar supaya baris kosong dan
              // baris yang lebarnya sedang nol tetap menahan ruangnya.
              <span key={i} className="block h-6">
                <span data-line className="inline-block overflow-hidden align-top whitespace-pre">
                  {line.map((tok, j) => (
                    <span key={j} className={tok.cls}>
                      {tok.t}
                    </span>
                  ))}
                </span>
              </span>
            ))}

            {/*
              Kursor dipisah dari alur teks dan digeser dengan transform: satu
              elemen yang berpindah, bukan satu per baris yang saling dinyalakan.
            */}
            <span
              data-caret
              aria-hidden="true"
              className="absolute top-[0.2em] left-0 inline-block h-[1.05em] w-[0.5ch] bg-primary-300 opacity-0"
            />
          </code>
        </pre>
      </div>
    </div>
  )
}

/* ---------- Bagian kecil ---------- */

/**
 * Judul section dengan kalimat pengantar yang menyala kata demi kata seiring
 * section-nya digulir melewati layar.
 *
 * Efeknya di-scrub, bukan dijalankan sekali: pembaca yang menggulir pelan
 * melihat kalimatnya terang perlahan, dan yang menggulir balik melihatnya
 * meredup lagi — gerakannya terikat pada posisi gulir, bukan pada waktu.
 *
 * Kata yang belum menyala TIDAK dibuat pucat. Versi umum efek ini berangkat
 * dari abu-abu muda seperti gray-300 (rasio ~1.6:1 di atas putih) — dan karena
 * scrub menahan kata di keadaan itu selama section masih di layar, teksnya
 * benar-benar dibaca orang dalam kondisi gagal kontras. Jadi kedua ujungnya
 * dibuat lolos WCAG AA: gray-500 (4.8:1) menyala menjadi gray-800. Yang
 * dianimasikan penekanan, bukan keterbacaan.
 */
function SectionTitle({
  eyebrow,
  title,
  children,
  center,
}: {
  eyebrow: string
  title: string
  children?: ReactNode
  center?: boolean
}) {
  const ref = useGsap<HTMLDivElement>(({ scope, q }) => {
    const words = q('[data-lit]')
    if (words.length === 0) return

    gsap.fromTo(
      words,
      { color: 'var(--color-gray-500)' },
      {
        color: 'var(--color-gray-800)',
        ease: 'none',
        stagger: 0.4,
        scrollTrigger: { trigger: scope, start: 'top 82%', end: 'bottom 55%', scrub: true },
      },
    )
  }, [children])

  return (
    <div ref={ref} className={`mb-8 max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      <Reveal stagger>
        <p className="ds-eyebrow">{eyebrow}</p>
        <h2 className="mt-2 text-heading-2 font-black tracking-tight text-gray-900">{title}</h2>
      </Reveal>
      {children && (
        <p className="mt-3 text-body-sm leading-6 text-gray-500">
          {/*
            Hanya string biasa yang dipecah per kata. Kalimat pengantar yang
            mengandung elemen (misalnya <code>) dibiarkan utuh — memecahnya akan
            merusak markup di dalamnya, dan tanpa `data-lit` efeknya tinggal
            dilewati begitu saja oleh setup di atas.
          */}
          {typeof children === 'string'
            ? children.split(' ').map((w, i) => (
                <span data-lit key={`${w}-${i}`}>
                  {w}{' '}
                </span>
              ))
            : children}
        </p>
      )}
    </div>
  )
}

/**
 * Kotak demo kecil: satu komponen hidup + tautan ke halaman detailnya.
 *
 * `span` menerima kelas rentang kolom, bukan boolean. Kelima kotak ini mengisi
 * kisi enam kolom dengan lebar yang berbeda-beda — komponen yang butuh ruang
 * lebih (Input Field, Card) mendapat setengah baris — jadi "lebar" di sini
 * bukan satu keadaan menyala/mati.
 */
function ShowcaseTile({
  name,
  route,
  span = '',
  children,
}: {
  name: string
  route: string
  span?: string
  children: ReactNode
}) {
  return (
    <SpotlightCard
      as="a"
      href={`#${route}`}
      className={`ds-card group flex flex-col gap-4 p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg ${span}`}
    >
      <div className="flex min-h-[92px] flex-wrap items-center gap-3 rounded-xl bg-surface-subtle p-4">
        {children}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-black text-gray-900">{name}</span>
        <span className="text-xs font-bold text-primary-700 transition-transform group-hover:translate-x-0.5">
          Lihat →
        </span>
      </div>
    </SpotlightCard>
  )
}

/* ---------- Angka ringkas ---------- */

/**
 * Baris angka yang tiap kolomnya naik berurutan lalu berhitung dari nol.
 * Dipisah jadi komponen sendiri karena butuh scope GSAP-nya sendiri untuk
 * meng-stagger kolom-kolomnya.
 */
function StatsRow() {
  const ref = useGsap<HTMLDListElement>(({ scope, q }) => {
    gsap.from(q('[data-stat]'), {
      opacity: 0,
      y: 28,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: { trigger: scope, start: 'top 88%', once: true },
    })
  }, [])

  return (
    // Pembatas vertikal hanya muncul saat keempatnya benar-benar sebaris.
    // Di bawah lg mereka terbungkus jadi dua baris, dan garis vertikal di situ
    // akan menunjuk hubungan antarkolom yang sudah tidak ada lagi.
    <dl
      ref={ref}
      className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4 lg:gap-y-0 lg:divide-x lg:divide-border"
    >
      {stats.map((s) => (
        <div
          key={s.label}
          data-stat
          className="group relative lg:px-8 lg:first:pl-0 lg:last:pr-0"
        >
          <dd className="text-heading-2 font-black tracking-tight text-primary-700">
            <CountUp value={s.value} />
          </dd>
          <dt className="mt-1 text-sm font-black text-gray-900">{s.label}</dt>
          <p className="mt-1 text-xs leading-5 text-gray-500">{s.desc}</p>
          {/* Garis yang memanjang saat kolomnya disentuh — penanda hover yang
              tidak menggeser apa pun di sekitarnya. */}
          <span
            aria-hidden="true"
            className="mt-3 block h-0.5 w-8 origin-left scale-x-100 rounded-full bg-primary-200 transition-transform duration-500 group-hover:scale-x-[3]"
          />
        </div>
      ))}
    </dl>
  )
}

export function HomePage() {
  const [copied, copy] = useCopy(INSTALL)

  return (
    <>
      <ScrollProgress />

      {/* ══ Hero ══ */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary-50 via-white to-white px-5 py-16 sm:px-8 lg:px-12 lg:py-24 xl:px-14">
        <Aurora />

        {/*
          Lencana STASI sebagai cap air di ujung kanan hero. Dekoratif penuh dan
          sengaja sangat samar — kehadirannya membangun kedalaman, bukan menuntut
          dibaca. Hanya muncul dari lebar xl ke atas; di bawah itu ia bertabrakan
          dengan jendela kode.
        */}
        <img
          src={asset('/stasi.svg')}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-40 hidden w-[38rem] opacity-[0.035] xl:block"
        />

        <Container padded={false} className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-16">
            <div>
              {/* <Reveal stagger className="flex flex-wrap items-center gap-2">
                <Badge variant="brand">React · Vite</Badge>
                <Badge variant="gray">Tailwind CSS v4</Badge>
                <Badge variant="success">v0.1.0</Badge>
              </Reveal> */}

              <SplitWords
                as="h1"
                delay={0.15}
                text="Menyatukan layanan digital lewat desain dan kode"
                className="mt-5 text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-black tracking-tight text-gray-900"
              />

              <Reveal delay={0.5}>
                <p className="mt-5 max-w-xl text-body-lg text-gray-600">
                  Satu sumber visual dan komponen yang konsisten untuk membangun layanan yang jelas,
                  inklusif, dan mudah dikenali. Token, komponen, dan dokumentasinya tinggal dipakai —
                  tidak perlu dirancang ulang tiap proyek.
                </p>
              </Reveal>

              <Reveal delay={0.65} className="mt-8 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <Button as="a" href="#/components" variant="filled">
                    Mulai pakai
                  </Button>
                </Magnetic>
                <Magnetic strength={12}>
                  <Button as="a" href="#/foundations" variant="outline">
                    Lihat Foundations
                  </Button>
                </Magnetic>
              </Reveal>

              {/* Perintah pasang dengan tombol salin */}
              <Reveal delay={0.75}>
                <button
                  type="button"
                  onClick={copy}
                  className="mt-4 inline-flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-2.5 font-mono text-sm text-gray-700 transition-colors hover:border-primary-300 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  aria-label={copied ? 'Perintah tersalin' : `Salin perintah: ${INSTALL}`}
                >
                  <span className="text-gray-400">$</span>
                  <span>{INSTALL}</span>
                  <span
                    className={`text-xs font-bold ${copied ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    {copied ? 'Tersalin!' : 'Salin'}
                  </span>
                </button>
              </Reveal>
            </div>

            <TiltCard>
              <CodeWindow />
            </TiltCard>
          </div>
        </Container>
      </section>

      {/* ══ Angka ringkas ══ */}
      <section className="border-b border-border bg-surface">
        <Container className="py-10">
          <StatsRow />
        </Container>
      </section>

      {/*
        ══ Rancang sekali ══

        Empat kartu seukuran berjajar membuat keempat prinsip terbaca sama
        penting dan sama sepintas — mata menyapunya tanpa berhenti. Di sini
        judulnya dipindah ke kolom kiri yang menempel selama digulir, dan
        prinsipnya turun menjadi daftar bernomor: satu kolom baca, urutan yang
        jelas, dan ruang yang cukup untuk paragraf penjelasnya benar-benar
        dibaca.
      */}
      <Container className="py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
          {/* `self-start` wajib: tanpa itu kolom ini meregang setinggi baris
              grid, dan elemen setinggi kontainernya tidak pernah bisa lengket. */}
          <div className="lg:sticky lg:top-12 lg:self-start">
            <SectionTitle eyebrow="Prinsip" title="Rancang sekali, pakai di mana saja">
              Empat keputusan yang membuat design kit ini tetap konsisten saat dipakai banyak tim
              sekaligus.
            </SectionTitle>
          </div>

          <Reveal stagger as="ol" className="border-t border-border">
            {features.map((f, i) => (
              <li
                key={f.title}
                className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 border-b border-border py-7"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                  <svg
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                </span>

                <div>
                  <div className="flex items-baseline gap-3">
                    {/* Nomor urut murni penanda visual — urutannya sudah dibawa
                        oleh <ol>, jadi menyuarakannya lagi hanya mengulang. */}
                    <span
                      aria-hidden="true"
                      className="font-mono text-xs font-black text-primary-400"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-heading-4 font-black text-gray-900">{f.title}</h3>
                  </div>
                  <p className="mt-2 max-w-2xl text-body-sm leading-6 text-gray-500">{f.desc}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </Container>

      {/* ══ Komponen hidup ══ */}
      <section className="border-y border-border bg-surface-subtle">
        <Container className="py-12 lg:py-16">
          <SectionTitle eyebrow="Komponen" title="Semuanya sungguhan, bukan gambar">
            Yang tampil di bawah ini adalah komponen yang benar-benar dirender dari{' '}
            <code className="text-xs font-bold text-gray-700">@stasi/design-kit-react</code> — sama
            persis dengan yang akan kamu impor. Klik untuk membuka playground-nya.
          </SectionTitle>

          {/*
            Enam kolom, bukan tiga. Dengan tiga kolom, lima kotak menyisakan satu
            sel menganga di ujung baris kedua — lubang yang terbaca sebagai
            kesalahan tata letak, bukan sebagai ruang. Pembagian 2+2+2 lalu 3+3
            mengisi dua baris itu tepat, sekaligus memberi Input Field dan Card
            lebar yang memang mereka butuhkan.
          */}
          <Reveal stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
            <ShowcaseTile name="Button" route="/components/button" span="lg:col-span-2">
              <Button variant="filled" size="s">
                Simpan
              </Button>
              <Button variant="outline" size="s">
                Batal
              </Button>
            </ShowcaseTile>

            <ShowcaseTile name="Badge" route="/components/badge" span="lg:col-span-2">
              <Badge variant="success">Aktif</Badge>
              <Badge variant="warning">Menunggu</Badge>
              <Badge variant="danger">Ditolak</Badge>
              <Badge variant="gray">Draf</Badge>
            </ShowcaseTile>

            <ShowcaseTile name="Checkbox & Toggle" route="/form/checkbox" span="lg:col-span-2">
              <div className="space-y-3">
                <Checkbox label="Kirim salinan ke email" defaultChecked />
                <Toggle label="Notifikasi permohonan" defaultChecked />
              </div>
            </ShowcaseTile>

            <ShowcaseTile
              name="Input Field"
              route="/form/input-field/input"
              span="sm:col-span-2 lg:col-span-3"
            >
              <div className="w-full max-w-sm">
                <InputField
                  label="Nama lengkap"
                  placeholder="Masukkan nama lengkap"
                  helperText="Sesuai yang tertera pada KTP."
                />
              </div>
            </ShowcaseTile>

            <ShowcaseTile name="Card" route="/components/card" span="sm:col-span-2 lg:col-span-3">
              <div className="w-full">
                <Card
                  title="Kartu ringkas"
                  description="Judul, deskripsi, dan aksi yang semuanya opsional."
                />
              </div>
            </ShowcaseTile>
          </Reveal>
        </Container>
      </section>

      {/*
        ══ Mulai cepat ══

        Sebelumnya tiga blok kode ditumpuk tanpa penanda apa pun, sehingga
        urutannya harus disimpulkan sendiri dari isinya. Sekarang ketiganya
        menjadi langkah bernomor pada satu garis vertikal: nomornya menyatakan
        urutan, judulnya menyatakan tujuan tiap langkah, dan garisnya menyatakan
        bahwa ketiganya satu rangkaian yang dikerjakan sekali di awal.
      */}
      <Container className="py-14 lg:py-20">
        <SectionTitle eyebrow="Mulai cepat" title="Tiga baris untuk komponen pertama">
          Pasang package-nya, sambungkan stylesheet-nya sekali di proyek, lalu impor komponen yang
          dibutuhkan dan pakai seperti elemen React biasa. Tidak ada provider atau konfigurasi
          tambahan.
        </SectionTitle>

        <ol className="relative ml-4 border-l border-border pl-8 sm:ml-5 sm:pl-10">
          {steps.map((step, i) => (
            <Reveal as="li" key={step.title} className="relative pb-10 last:pb-0">
              {/* Bulatan nomor duduk tepat di atas garis: setengah lebarnya
                  ditarik ke kiri dari tepi konten, ditambah 1px tebal garisnya. */}
              <span
                aria-hidden="true"
                className="absolute top-0 -left-[calc(2rem+1rem+0.5px)] inline-flex size-8 items-center justify-center rounded-full border border-border bg-surface font-mono text-xs font-black text-primary-700 sm:-left-[calc(2.5rem+1rem+0.5px)]"
              >
                {i + 1}
              </span>

              <h3 className="text-heading-4 font-black text-gray-900">{step.title}</h3>
              <p className="mt-1 mb-4 text-body-sm leading-6 text-gray-500">{step.desc}</p>
              <DocUsage flush label={step.label} code={step.code} />
            </Reveal>
          ))}
        </ol>
      </Container>

      {/* ══ Jelajahi ══ */}
      <section className="border-t border-border bg-surface-subtle">
        <Container className="py-12 lg:py-16">
          <SectionTitle eyebrow="Jelajahi" title="Mulai dari mana?">
            Empat pintu masuk, tergantung yang sedang kamu kerjakan.
          </SectionTitle>

          <Reveal stagger className="grid gap-5 sm:grid-cols-2">
            {sections.map((s) => (
              <SpotlightCard
                key={s.route}
                as="a"
                href={`#${s.route}`}
                className="ds-card group flex flex-col p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-heading-4 font-black text-gray-900">{s.name}</h3>
                  <Badge variant="gray">{s.badge}</Badge>
                </div>
                <p className="mt-2 flex-1 text-body-sm leading-6 text-gray-500">{s.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
                  Buka
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </SpotlightCard>
            ))}
          </Reveal>
        </Container>
      </section>
    </>
  )
}
