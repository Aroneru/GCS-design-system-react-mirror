import { useRef, useState, type MouseEvent } from 'react'
import { TableOfContents, type TableOfContentsItem } from '../../../lib'
import { DocExample } from '../../DocExample'
import { PropsTable, type PropRow } from '../../PropsTable'
import { CodeBlock, ControlLabel, H, Hl, Segmented } from '../../pageKit'
import { FlowSection, Lead, UsulanPage, type TocEntry } from '../../usulanKit'

const tocProps: PropRow[] = [
  ['items', '{ id: string; label: ReactNode; href?: string }[]', '—', 'Daftar bagian. id sama dengan id elemen bagian yang dituju.'],
  ['title', 'ReactNode', "'On this page'", 'Judul di atas daftar. Isi null untuk menyembunyikan.'],
  ['activeId', 'string', '—', 'Mode terkontrol: entri yang disorot. Tanpa prop ini scroll-spy yang menentukan.'],
  ['onActiveChange', '(id: string) => void', '—', 'Dipanggil saat scroll-spy memindahkan sorotan.'],
  ['scrollSpy', 'boolean', 'true', 'Menyorot otomatis bagian yang sedang dibaca.'],
  ['offset', 'number', '96', 'Jarak (px) dari tepi atas layar tempat bagian dianggap mulai dibaca, mis. tinggi navbar.'],
  ['getHref', '(id: string) => string', '`#${id}`', 'Membentuk alamat tiap entri, mis. untuk router hash.'],
  ['onItemClick', '(item, event) => void', '—', 'Dipanggil saat entri diklik, sebelum tautan berjalan.'],
  ['darkMode', 'boolean', 'false', 'Sama dengan data-theme="dark". Latar jadi gray-800.'],
  ['maxHeight', 'number | string', '—', 'Tinggi maksimum daftar. Daftar yang lebih panjang bisa digulir dan mengikuti entri aktif.'],
  ['layout', "'auto' | 'list' | 'drawer'", "'auto'", 'auto: daftar biasa (teks 12px) mulai 1024px, di bawahnya tombol yang membuka Drawer dari kanan (teks 14px). list dan drawer memaksa salah satunya.'],
  ['drawerContained', 'boolean', 'false', 'Drawer muncul di dalam pembungkus terdekat yang relative, bukan menutupi seluruh layar. Untuk pratinjau di dalam bingkai, mis. playground.'],
  ['scrollContainer', 'RefObject<HTMLElement>', '—', 'Wadah gulir isi halaman bila bukan window. Scroll-spy dan klik entri bekerja di dalam wadah ini.'],
  ['…props', 'HTMLAttributes<HTMLElement>', '—', 'Atribut lain diteruskan ke elemen <nav>, termasuk className dan aria-label.'],
]

const toc: TocEntry[] = [
  { id: 'tampilan-dasar', label: 'Tampilan dasar' },
  { id: 'dark-mode', label: 'Dark mode' },
  { id: 'scrollable', label: 'Scrollable' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

/** Contoh isi daftar, mengikuti daftar isi halaman Hero di desain. */
const contoh: TableOfContentsItem[] = [
  { id: 'demo-dasar', label: 'Tampilan dasar' },
  { id: 'demo-variasi', label: 'Variasi' },
  { id: 'demo-platform', label: 'platform' },
  { id: 'demo-heading', label: 'heading · subHeading · description' },
  { id: 'demo-button', label: 'showButton · buttonLabel · buttonHref' },
  { id: 'demo-dark', label: 'Dark mode' },
  { id: 'demo-props', label: 'Properties' },
]

/** Bagian isi untuk demo wadah gulir. */
const bagianGulir: TableOfContentsItem[] = [
  'Pendahuluan',
  'Persyaratan',
  'Pemasangan',
  'Konfigurasi',
  'Tema gelap',
  'Aksesibilitas',
  'Tanya jawab',
].map((label, i) => ({ id: `gulir-${i}`, label }))

/** Daftar panjang untuk demo maxHeight. */
const daftarPanjang: TableOfContentsItem[] = Array.from({ length: 24 }, (_, i) => ({
  id: `panjang-${i}`,
  label: `Bagian ${i + 1}`,
}))

/** Isi halaman tiruan di Playground. Warnanya token, jadi ikut tema bingkainya. */
function Skeleton({ className }: { className?: string }) {
  const bar = 'rounded transition-colors duration-300'
  return (
    <div className={`space-y-3 ${className ?? ''}`} aria-hidden="true">
      <div className={`h-3 w-1/2 bg-border-strong ${bar}`} />
      <div className={`h-2 w-full bg-border ${bar}`} />
      <div className={`h-2 w-11/12 bg-border ${bar}`} />
      <div className={`h-2 w-4/6 bg-border ${bar}`} />
      <div className={`!mt-6 h-24 rounded-lg bg-border ${bar}`} />
      <div className={`!mt-6 h-3 w-1/3 bg-border-strong ${bar}`} />
      <div className={`h-2 w-full bg-border ${bar}`} />
      <div className={`h-2 w-5/6 bg-border ${bar}`} />
    </div>
  )
}

/**
 * Lapis isi bingkai Playground. Yang muncul memudar masuk sedikit setelah yang
 * lama mulai memudar keluar (delay 150ms), supaya keduanya tidak tampak
 * bertumpuk di tengah transisi.
 */
function layer(visible: boolean) {
  return `absolute inset-0 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
    visible ? 'translate-y-0 opacity-100 delay-150' : 'pointer-events-none translate-y-2 opacity-0'
  }`
}

/** Demo tidak boleh berpindah halaman; kliknya hanya memindahkan sorotan. */
function useDemo() {
  const [active, setActive] = useState(contoh[0].id)
  return {
    activeId: active,
    scrollSpy: false,
    onItemClick: (item: TableOfContentsItem, e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      setActive(item.id)
    },
  }
}

export function TableOfContentsPage() {
  const dasar = useDemo()
  const gelap = useDemo()
  const main = useDemo()
  const wadah = useRef<HTMLDivElement>(null)
  const [aktifPanjang, setAktifPanjang] = useState(daftarPanjang[18].id)
  const [tema, setTema] = useState<'light' | 'dark'>('light')
  const [judul, setJudul] = useState<'on' | 'off'>('on')
  const [tampilan, setTampilan] = useState<'list' | 'drawer'>('list')
  const mobile = tampilan === 'drawer'

  return (
    <UsulanPage
      eyebrow="Components"
      title="Table of Contents"
      description="Daftar isi “On this page” untuk halaman panjang. Menyorot bagian yang sedang dibaca secara otomatis."
      toc={toc}
    >
      <FlowSection id="tampilan-dasar" title="Tampilan dasar">
        <Lead>
          Lebar 208px dengan garis rel di kiri dan teks 12px. Entri aktif ditandai garis brand 2px.
          Klik entri di contoh ini untuk memindahkan sorotan. Di layar di bawah 1024px, daftar ini
          berubah jadi tombol yang membuka Drawer dari kanan dengan teks 14px; kecilkan jendela
          peramban untuk melihatnya.
        </Lead>
        <DocExample>
          <TableOfContents items={contoh} {...dasar} />
        </DocExample>
        <div className="mt-4">
          <CodeBlock>
            {"import { TableOfContents } from '@ceplok-ui/design-kit-react'\n\n"}
            {"<TableOfContents\n  className=\"sticky top-10\"\n  items={[\n    { id: 'dasar', label: 'Tampilan dasar' },\n    { id: 'variasi', label: 'Variasi' },\n  ]}\n/>"}
          </CodeBlock>
        </div>
      </FlowSection>

      <FlowSection id="dark-mode" title="Dark mode">
        <Lead>
          Hanya palet warnanya yang berubah: latar jadi gray-800, teks dan garis ikut token semantik.
          Pakai <Hl>darkMode</Hl>, atau letakkan di dalam pembungkus <Hl>data-theme=&quot;dark&quot;</Hl>.
        </Lead>
        <div className="rounded-2xl bg-gray-800 p-6 sm:p-10">
          <TableOfContents items={contoh} darkMode {...gelap} />
        </div>
        <div className="mt-4">
          <CodeBlock>
            {'<TableOfContents '}
            <H>darkMode</H>
            {' items={items} />'}
          </CodeBlock>
        </div>
      </FlowSection>

      <FlowSection id="scrollable" title="Scrollable">
        <Lead>
          Bila isi halaman digulir di dalam panel, bukan window, berikan ref panelnya lewat{' '}
          <Hl>scrollContainer</Hl>. Gulir panel di bawah: sorotan ikut berpindah, dan klik entri
          menggulir panelnya.
        </Lead>
        <div className="flex gap-6 rounded-2xl border border-border bg-surface-subtle p-6">
          <div
            ref={wadah}
            className="h-80 min-w-0 flex-1 space-y-8 overflow-y-auto rounded-xl border border-border bg-white p-6"
          >
            {bagianGulir.map((b) => (
              <section key={b.id} id={b.id}>
                <h3 className="text-heading-4 font-black text-gray-900">{b.label}</h3>
                <p className="mt-2 text-body-sm leading-6 text-gray-500">
                  Contoh isi bagian {b.label}. Paragraf ini sengaja dibuat cukup panjang supaya
                  panelnya bisa digulir dan perpindahan sorotan di daftar isi terlihat jelas saat
                  menggulir ke bawah maupun ke atas.
                </p>
                <div className="mt-3 h-24 rounded-lg bg-gray-50" />
              </section>
            ))}
          </div>
          <TableOfContents
            className="hidden shrink-0 sm:block"
            items={bagianGulir}
            scrollContainer={wadah}
            offset={24}
          />
        </div>

        <h3 className="mt-8 text-sm font-black text-gray-900">Daftar panjang</h3>
        <p className="mt-1 mb-3 max-w-2xl text-body-sm text-gray-500">
          Dengan <Hl>maxHeight</Hl>, daftar yang panjang bisa digulir sendiri dan entri aktif tetap
          terlihat. Contoh ini menyorot Bagian 19.
        </p>
        <DocExample>
          <TableOfContents
            items={daftarPanjang}
            maxHeight={256}
            activeId={aktifPanjang}
            onItemClick={(item, e) => {
              e.preventDefault()
              setAktifPanjang(item.id)
            }}
          />
        </DocExample>

        <div className="mt-4">
          <CodeBlock>
            {'const panel = useRef<HTMLDivElement>(null)\n\n'}
            {'<div ref={panel} className="h-80 overflow-y-auto">…</div>\n'}
            {'<TableOfContents items={items} '}
            <H>scrollContainer</H>
            {'={panel} '}
            <H>offset</H>
            {'={24} />\n\n'}
            {'<TableOfContents items={items} '}
            <H>maxHeight</H>
            {"=\"calc(100vh - 8rem)\" />"}
          </CodeBlock>
        </div>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Pilih Tampilan untuk melihat versi desktop (daftar, teks 12px) atau mobile (tombol yang
          membuka Drawer dari kanan, teks 14px). Di versi mobile, ketuk tombolnya untuk membuka
          Drawer.
        </Lead>
        {/*
          Panggung dan bingkainya ikut tema lewat data-theme, jadi skeleton
          memakai token (border, border-strong) dan tidak menyilaukan di tema
          gelap. Kedua tampilan memakai bingkai setinggi sama supaya kontrolnya
          tidak melompat saat Tampilan diganti.
        */}
        <div
          data-theme={tema === 'dark' ? 'dark' : 'light'}
          className="rounded-2xl border border-border bg-surface-subtle p-4 transition-colors duration-300 sm:p-8"
        >
          {/*
            Satu bingkai untuk kedua tampilan: lebar, sudut, dan tebal garisnya
            yang dianimasikan, jadi Desktop seperti menyusut jadi ponsel.
            Isinya dua lapis yang bertumpuk dan saling memudar; lapis yang
            tersembunyi diberi `inert` supaya tidak bisa difokus. `relative`
            di bingkai ini juga tempat Drawer muncul berkat drawerContained.
          */}
          <div
            className={`relative mx-auto h-[420px] overflow-hidden border-border-strong bg-toc-surface transition-[max-width,border-radius,border-width,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              mobile ? 'max-w-[360px] rounded-[1.75rem] border-4 shadow-lg' : 'max-w-full rounded-xl border shadow-none'
            }`}
          >
            <div className={layer(!mobile)} inert={mobile}>
              <div className="flex h-full gap-8 p-6">
                <Skeleton className="min-w-0 flex-1" />
                <TableOfContents
                  className="hidden shrink-0 sm:block"
                  items={contoh}
                  layout="list"
                  title={judul === 'on' ? undefined : null}
                  {...main}
                />
              </div>
            </div>
            <div className={layer(mobile)} inert={!mobile}>
              <div className="space-y-5 p-4">
                <TableOfContents
                  items={contoh}
                  layout="drawer"
                  drawerContained
                  title={judul === 'on' ? undefined : null}
                  {...main}
                />
                <Skeleton />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <ControlLabel>Tampilan</ControlLabel>
            <Segmented
              label="Pilih tampilan"
              value={tampilan}
              onChange={setTampilan}
              options={[
                { value: 'list', label: 'Desktop' },
                { value: 'drawer', label: 'Mobile' },
              ]}
            />
          </div>
          <div className="flex items-center gap-3">
            <ControlLabel>Tema</ControlLabel>
            <Segmented
              label="Pilih tema"
              value={tema}
              onChange={setTema}
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
              ]}
            />
          </div>
          <div className="flex items-center gap-3">
            <ControlLabel>Judul</ControlLabel>
            <Segmented
              label="Tampilkan judul"
              value={judul}
              onChange={setJudul}
              options={[
                { value: 'on', label: 'Tampil' },
                { value: 'off', label: 'Sembunyi' },
              ]}
            />
          </div>
        </div>

        <div className="mt-4">
          <CodeBlock>
            {'<TableOfContents\n  items={items}'}
            {tampilan === 'drawer' && (
              <>
                {'\n  '}
                <H>layout=&quot;drawer&quot;</H>
              </>
            )}
            {tema === 'dark' && (
              <>
                {'\n  '}
                <H>darkMode</H>
              </>
            )}
            {judul === 'off' && (
              <>
                {'\n  '}
                <H>title={'{null}'}</H>
              </>
            )}
            {'\n/>'}
          </CodeBlock>
          <p className="mt-2 text-body-sm text-gray-500">
            Di aplikasi, <Hl>layout</Hl> cukup dibiarkan <Hl>auto</Hl>: daftar di layar 1024px ke atas,
            Drawer di bawahnya.
          </p>
        </div>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Komponen ini tidak menempel sendiri; beri <Hl>sticky top-*</Hl> lewat className. Beri
          bagian yang dituju <Hl>scroll-mt-*</Hl> supaya judulnya tidak tertutup navbar. Untuk router
          hash, bentuk alamatnya lewat <Hl>getHref</Hl>.
        </Lead>
        <CodeBlock>
          {'<TableOfContents\n  items={items}\n  className="sticky top-10"\n  '}
          <H>offset</H>
          {'={80} // tinggi navbar\n  '}
          <H>getHref</H>
          {'={(id) => `#/panduan#${id}`}\n/>\n\n<section id="dasar" className="scroll-mt-24">…</section>'}
        </CodeBlock>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <PropsTable rows={tocProps} />
      </FlowSection>
    </UsulanPage>
  )
}
