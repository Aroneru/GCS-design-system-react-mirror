import { useRef, useState, type MouseEvent, type ReactNode, type RefObject } from 'react'
import {
  TableOfContents,
  type TableOfContentsItem,
  type TableOfContentsItemElement,
} from '../../../lib'
import { DocExample } from '../../DocExample'
import { PropsTable, type PropRow } from '../../PropsTable'
import { adaTidakAda } from '../../usulanOptions'
import { CodeBlock, H, Hl, Segmented } from '../../pageKit'
import {
  Control,
  Controls,
  FlowSection,
  Lead,
  SectionCode,
  Stage,
  UsulanPage,
  type TocEntry,
} from '../../usulanKit'

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
  ['anchor', 'boolean', 'true', 'Entri berupa tautan <a href> yang melompat ke bagiannya, dengan scroll-spy. false menjadikan entri <button>: klik hanya memindahkan sorotan, tanpa berpindah atau menggulir.'],
  ['drawerContained', 'boolean', 'false', 'Drawer muncul di dalam pembungkus terdekat yang relative, bukan menutupi seluruh layar. Untuk pratinjau di dalam bingkai, mis. playground.'],
  ['scrollContainer', 'RefObject<HTMLElement>', '—', 'Wadah gulir isi halaman bila bukan window. Scroll-spy dan klik entri bekerja di dalam wadah ini.'],
  ['…props', 'HTMLAttributes<HTMLElement>', '—', 'Atribut lain diteruskan ke elemen <nav>, termasuk className dan aria-label.'],
]

const toc: TocEntry[] = [
  { id: 'tampilan-dasar', label: 'Tampilan dasar' },
  { id: 'platform', label: 'Platform' },
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

/**
 * Tiruan halaman dokumentasi untuk contoh Tampilan dasar: jendela peramban,
 * judul halaman, lalu satu bagian per entri `contoh` dengan daftar isi di
 * kanan. Bagian yang sedang aktif di daftar isi ikut ditandai di halaman,
 * supaya hubungan keduanya langsung terbaca.
 */
function PagePreview({ active, children }: { active: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
      {/* Bilah jendela peramban. */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-2.5" aria-hidden="true">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-yellow-300" />
          <span className="size-2.5 rounded-full bg-green-400" />
        </span>
        <span className="mx-auto w-full max-w-xs truncate rounded-md bg-surface-subtle px-3 py-1 text-center text-[11px] text-content-muted">
          ceplok.go.id/components/hero
        </span>
        <span className="w-[42px]" />
      </div>

      <div className="flex gap-8 bg-toc-surface p-6 sm:p-8">
        <div className="min-w-0 flex-1" aria-hidden="true">
          <p className="text-[11px] font-bold tracking-[0.14em] text-content-disabled uppercase">
            Components
          </p>
          <p className="mt-1 text-heading-3 font-black text-content">Hero</p>
          <div className="mt-2 h-2 w-3/4 rounded bg-border" />

          <div className="mt-6 space-y-2">
            {contoh.map((item) => {
              const isActive = item.id === active
              return (
                <div
                  key={item.id}
                  className={`rounded-lg border-l-2 px-3 py-2.5 transition-colors duration-300 ${
                    isActive ? 'border-brand bg-primary-50' : 'border-transparent'
                  }`}
                >
                  <p
                    className={`truncate text-sm font-bold transition-colors duration-300 ${
                      isActive ? 'text-brand' : 'text-content'
                    }`}
                  >
                    {item.label}
                  </p>
                  <div className="mt-2 space-y-1.5">
                    <div className="h-1.5 w-full rounded bg-border" />
                    <div className="h-1.5 w-4/6 rounded bg-border" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="hidden shrink-0 sm:block">{children}</div>
      </div>
    </div>
  )
}

/**
 * Entri Playground. Kedua lapis (Desktop dan Mobile) dirender bersamaan saat
 * transisi, jadi id bagiannya diberi awalan berbeda supaya tidak bentrok.
 */
const itemsDesktop: TableOfContentsItem[] = contoh.map((c) => ({ ...c, id: `pg-d-${c.id}` }))
const itemsMobile: TableOfContentsItem[] = contoh.map((c) => ({ ...c, id: `pg-m-${c.id}` }))

/**
 * Bagian-bagian halaman tiruan di Playground, masing-masing dengan id dan
 * tautan `#` di judulnya seperti judul bagian di dokumentasi ini. Tautannya
 * menggulir wadahnya sendiri, bukan mengubah alamat halaman, karena dokumen
 * ini memakai router hash.
 */
function AnchoredSections({
  items,
  scrollRef,
  anchors,
}: {
  items: TableOfContentsItem[]
  scrollRef: RefObject<HTMLDivElement | null>
  /** Tanpa anchor bagian tetap tampil, hanya tautan `#` di judulnya yang hilang. */
  anchors: boolean
}) {
  const jumpTo = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const root = scrollRef.current
    const el = document.getElementById(id)
    if (!root || !el) return
    root.scrollTo({
      top: el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - 16,
      behavior: 'smooth',
    })
  }

  return (
    <div className="space-y-8 pb-[60%]">
      {items.map((item, i) => (
        <section key={item.id} id={item.id}>
          <h3 className="group flex items-baseline gap-2 text-base font-black text-content">
            <span className="min-w-0">{item.label}</span>
            {anchors && (
              <a
                href={`#${item.id}`}
                onClick={jumpTo(item.id)}
                aria-label={`Tautan ke bagian ${typeof item.label === 'string' ? item.label : i + 1}`}
                className="rounded text-brand opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              >
                #
              </a>
            )}
          </h3>
          <div className="mt-3 space-y-2" aria-hidden="true">
            <div className="h-2 w-full rounded bg-border transition-colors duration-300" />
            <div className="h-2 w-11/12 rounded bg-border transition-colors duration-300" />
            <div className="h-2 w-4/6 rounded bg-border transition-colors duration-300" />
            {i % 3 === 1 && <div className="!mt-4 h-20 rounded-lg bg-border transition-colors duration-300" />}
          </div>
        </section>
      ))}
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
    onItemClick: (item: TableOfContentsItem, e: MouseEvent<TableOfContentsItemElement>) => {
      e.preventDefault()
      setActive(item.id)
    },
  }
}

export function TableOfContentsPage() {
  const dasar = useDemo()
  const gelap = useDemo()
  const wadah = useRef<HTMLDivElement>(null)
  const deskScroll = useRef<HTMLDivElement>(null)
  const mobileScroll = useRef<HTMLDivElement>(null)
  const [aktifPanjang, setAktifPanjang] = useState(daftarPanjang[18].id)
  const [tema, setTema] = useState<'light' | 'dark'>('light')
  const [judul, setJudul] = useState(true)
  const [anchor, setAnchor] = useState(true)
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
          Daftar isi duduk di kanan isi halaman, lebar 208px dengan teks 12px. Entri aktif ditandai
          garis brand 2px. Klik entri di contoh ini: sorotannya pindah, dan bagian yang sesuai di
          halaman ikut ditandai. Di layar di bawah 1024px daftar ini berubah jadi tombol yang membuka
          Drawer dari kanan; lihat bagian Platform.
        </Lead>
        <PagePreview active={dasar.activeId}>
          <TableOfContents className="sticky top-0" items={contoh} layout="list" {...dasar} />
        </PagePreview>
        <div className="mt-4">
          <CodeBlock>
            {"import { TableOfContents } from '@ceplok-ui/design-kit-react'\n\n"}
            {"<TableOfContents\n  className=\"sticky top-10\"\n  items={[\n    { id: 'dasar', label: 'Tampilan dasar' },\n    { id: 'variasi', label: 'Variasi' },\n  ]}\n/>"}
          </CodeBlock>
        </div>
      </FlowSection>

      <FlowSection id="platform" title="Platform">
        <Lead>
          Ukuran teks mengikuti platform. Di desktop entri memakai teks 12px dalam daftar 208px. Di
          mobile daftar disimpan di Drawer yang muncul dari kanan, dengan teks 14px dan baris 40px
          supaya mudah disentuh. Dengan <Hl>layout</Hl> bawaan (<Hl>auto</Hl>) peralihannya terjadi
          sendiri di 1024px.
        </Lead>
        <div className="grid gap-4 md:grid-cols-2">
          <article>
            <h3 className="text-sm font-black text-gray-900">Desktop · 12px</h3>
            <p className="mt-1 mb-3 text-body-sm text-gray-500">
              Daftar biasa di kanan isi halaman, mulai lebar layar 1024px.
            </p>
            <DocExample>
              <TableOfContents items={contoh} layout="list" anchor={false} />
            </DocExample>
          </article>

          <article>
            <h3 className="text-sm font-black text-gray-900">Mobile · 14px</h3>
            <p className="mt-1 mb-3 text-body-sm text-gray-500">
              Tombol yang menampilkan bagian aktif. Ketuk untuk membuka Drawer berisi daftarnya.
            </p>
            {/* Bingkai `relative` supaya Drawer muncul di sini, bukan menutupi seluruh layar. */}
            <div className="relative h-[400px] overflow-hidden rounded-[1.75rem] border-4 border-border-strong bg-toc-surface p-4">
              <TableOfContents items={contoh} layout="drawer" drawerContained anchor={false} />
              <div className="mt-5 space-y-2.5 px-1" aria-hidden="true">
                <div className="h-3 w-1/2 rounded bg-border-strong" />
                <div className="h-2 w-full rounded bg-border" />
                <div className="h-2 w-5/6 rounded bg-border" />
                <div className="h-2 w-4/6 rounded bg-border" />
              </div>
            </div>
          </article>
        </div>
        <SectionCode>
          {'<TableOfContents items={items} />                 // auto: 12px di desktop, Drawer 14px di mobile\n'}
          {'<TableOfContents items={items} '}
          <H>layout</H>
          {'="list" />   // selalu daftar\n'}
          {'<TableOfContents items={items} '}
          <H>layout</H>
          {'="drawer" /> // selalu Drawer'}
        </SectionCode>
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
          Satu daftar isi yang bisa Anda utak-atik lewat kontrol di bawahnya; bagian Penggunaan
          menuliskan kodenya. Isi bingkai berupa bagian yang bisa digulir: klik entri untuk melompat,
          atau gulir isinya dan lihat sorotan ikut berpindah. Di platform Mobile, ketuk tombolnya
          untuk membuka Drawer.
        </Lead>

        {/*
          Stage yang menganimasikan lebar (desktop ke ponsel), sama seperti
          playground lain. Bingkai di dalamnya diberi data-theme supaya token
          isinya ikut Tampilan, dan `relative` supaya Drawer muncul di sini
          berkat drawerContained.
        */}
        <Stage maxWidth={mobile ? 'max-w-[360px]' : 'max-w-full'} dark={tema === 'dark'}>
          <div
            data-theme={tema === 'dark' ? 'dark' : 'light'}
            className={`relative h-[420px] overflow-hidden border-border-strong bg-toc-surface transition-[border-radius,border-width,box-shadow,background-color] duration-300 motion-reduce:transition-none ${
              mobile ? 'rounded-[1.75rem] border-4 shadow-lg' : 'rounded-xl border shadow-none'
            }`}
          >
            {/*
              Dua lapis bertumpuk yang saling memudar; lapis yang tersembunyi
              diberi `inert` supaya tidak bisa difokus.
            */}
            <div className={layer(!mobile)} inert={mobile}>
              <div className="flex h-full gap-8 pl-6">
                <div ref={deskScroll} className="min-w-0 flex-1 overflow-y-auto py-6 pr-2">
                  <AnchoredSections items={itemsDesktop} scrollRef={deskScroll} anchors={anchor} />
                </div>
                <TableOfContents
                  className="hidden shrink-0 pt-6 pr-6 sm:block"
                  items={itemsDesktop}
                  layout="list"
                  title={judul ? undefined : null}
                  scrollContainer={deskScroll}
                  anchor={anchor}
                  offset={24}
                />
              </div>
            </div>
            <div className={layer(mobile)} inert={!mobile}>
              {/*
                Tombol daftar isi di luar area gulir, bukan sticky: elemen
                sticky menjadi containing block, sehingga panel Drawer akan
                terkurung di tombolnya, bukan memenuhi bingkai ponsel.
              */}
              <div className="flex h-full flex-col">
                <div className="shrink-0 border-b border-border p-4">
                  <TableOfContents
                    items={itemsMobile}
                    layout="drawer"
                    drawerContained
                    title={judul ? undefined : null}
                    scrollContainer={mobileScroll}
                    anchor={anchor}
                    offset={16}
                  />
                </div>
                <div ref={mobileScroll} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                  <AnchoredSections items={itemsMobile} scrollRef={mobileScroll} anchors={anchor} />
                </div>
              </div>
            </div>
          </div>
        </Stage>

        <Controls>
          <Control label="Platform">
            <Segmented
              label="Pilih platform"
              value={tampilan}
              onChange={setTampilan}
              options={[
                { value: 'list', label: 'Desktop' },
                { value: 'drawer', label: 'Mobile' },
              ]}
            />
          </Control>

          <Control label="Tampilan">
            <Segmented
              label="Pilih tampilan"
              value={tema}
              onChange={setTema}
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
              ]}
            />
          </Control>

          <Control label="Judul">
            <Segmented label="Tampilkan judul" value={judul} onChange={setJudul} options={adaTidakAda} />
          </Control>

          <Control label="Anchor">
            <Segmented
              label="Entri berupa anchor"
              value={anchor}
              onChange={setAnchor}
              options={adaTidakAda}
            />
          </Control>
        </Controls>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Blok ini mengikuti kontrol di Playground. Prop yang nilainya masih bawaan sengaja tidak
          ditulis. Di aplikasi, <Hl>layout</Hl> cukup dibiarkan <Hl>auto</Hl>: daftar di layar 1024px
          ke atas, Drawer di bawahnya.
        </Lead>
        <SectionCode flush>
          {"import { TableOfContents } from '@ceplok-ui/design-kit-react'\n\n"}
          {'<TableOfContents\n  items={items}\n  className="sticky top-10"'}
          {mobile && (
            <>
              {'\n  '}
              <H>layout</H>
              {'="drawer"'}
            </>
          )}
          {tema === 'dark' && (
            <>
              {'\n  '}
              <H>darkMode</H>
            </>
          )}
          {!judul && (
            <>
              {'\n  '}
              <H>title</H>
              {'={null}'}
            </>
          )}
          {!anchor && (
            <>
              {'\n  '}
              <H>anchor</H>
              {'={false}'}
            </>
          )}
          {'\n/>'}
        </SectionCode>

        <h3 className="mt-8 text-sm font-black text-gray-900">Menempel dan offset</h3>
        <p className="mt-1 mb-3 max-w-2xl text-body-sm text-gray-500">
          Komponen ini tidak menempel sendiri; beri <Hl>sticky top-*</Hl> lewat className. Beri
          bagian yang dituju <Hl>scroll-mt-*</Hl> supaya judulnya tidak tertutup navbar. Untuk router
          hash, bentuk alamatnya lewat <Hl>getHref</Hl>.
        </p>
        <SectionCode flush>
          {'<TableOfContents\n  items={items}\n  className="sticky top-10"\n  '}
          <H>offset</H>
          {'={80} // tinggi navbar\n  '}
          <H>getHref</H>
          {'={(id) => `#/panduan#${id}`}\n/>\n\n<section id="dasar" className="scroll-mt-24">…</section>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <PropsTable rows={tocProps} />
      </FlowSection>
    </UsulanPage>
  )
}
