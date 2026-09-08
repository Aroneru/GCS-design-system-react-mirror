import { useState } from 'react'
import {
  Search,
  type SearchApplication,
  type SearchCategory,
  type SearchPlatform,
} from '../../../lib'
import { PropsTable, type PropRow } from '../../PropsTable'
import { Demo, H, Segmented } from '../../pageKit'
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
import { adaTidakAda } from '../../usulanOptions'

const applications: { value: SearchApplication; label: string; token: string }[] = [
  { value: 'default', label: 'Default', token: 'primary-700' },
  { value: 'simaya', label: 'simaya', token: 'purple-500' },
]

/** Placeholder dan daftar kategori yang dipakai contoh-contoh di halaman ini. */
const PLACEHOLDER = 'Search Civitas, Organisasi…'

const kategori: SearchCategory[] = [
  { value: 'civitas', label: 'Civitas' },
  { value: 'organisasi', label: 'Organisasi' },
  { value: 'berita', label: 'Berita' },
  { value: 'layanan', label: 'Layanan' },
]

const searchProps: PropRow[] = [
  ['label', 'ReactNode', 'undefined', 'Teks label di atas field.'],
  ['helperText', 'ReactNode', 'undefined', 'Caption di bawah field.'],
  ['buttonLabel', 'string', 'Cari', 'Label tombol; pada varian kategori jadi label aksesibilitas tombol ikon.'],
  ['onSearch', '(value, category) => void', 'undefined', 'Dipanggil saat tombol ditekan atau Enter di dalam field.'],
  ['platform', "'default' | 'mobile'", 'default', 'Tinggi, ukuran ikon, teks, dan tombol. Tidak berlaku pada varian kategori.'],
  ['application', "'default' | 'simaya'", 'default', 'Warna tombol cari dan garis saat field difokus.'],
  ['categories', 'SearchCategory[]', 'undefined', 'Bila diisi, komponen berpindah ke varian dengan kategori.'],
  ['categoryPlaceholder', 'string', 'Kategori', 'Teks dropdown saat kategori belum dipilih.'],
  ['category / defaultCategory', 'string', 'undefined', 'Kategori terpilih, terkendali maupun tidak.'],
  ['onCategoryChange', '(value: string) => void', 'undefined', 'Dipanggil saat kategori berganti.'],
  ['…props', 'InputHTMLAttributes', '—', 'Seluruh atribut <input> standar diteruskan (value, onChange, placeholder, name, …).'],
]

const toc: TocEntry[] = [
  { id: 'search-form', label: 'Search Form' },
  { id: 'platform', label: 'Platform' },
  { id: 'kategori', label: 'Dengan kategori' },
  { id: 'application', label: 'Application' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

export function SearchPage() {
  const [application, setApplication] = useState<SearchApplication>('default')
  const [platform, setPlatform] = useState<SearchPlatform>('default')
  const [withCategory, setWithCategory] = useState(false)
  const [withLabel, setWithLabel] = useState(false)
  const [withHelper, setWithHelper] = useState(false)

  const [value, setValue] = useState('')
  const [category, setCategory] = useState('')
  const [terakhir, setTerakhir] = useState<string | null>(null)

  return (
    <UsulanPage
      eyebrow="Form"
      title="Search Form"
      description="Kolom pencarian dengan tombol cari. Tersedia sebagai satu kotak polos atau tiga ruas menyatu dengan dropdown kategori di kiri, memakai warna, radius, dan jarak dari Foundations."
      toc={toc}
    >
      <FlowSection id="search-form" title="Search Form">
        <Lead>
          Ikon kaca pembesar di kiri, isian di tengah, lalu tombol berlabel di kanan. Pakai bentuk
          ini saat pencarian berdiri sendiri di atas sebuah daftar atau tabel: tombolnya membuat
          jelas bahwa hasil baru berganti setelah ditekan, bukan sambil diketik.
        </Lead>
        <Demo label="Default">
          <Search placeholder={PLACEHOLDER} onSearch={(v) => setTerakhir(v)} />
        </Demo>
        <SectionCode>
          {"import { Search } from '@stasi/design-kit-react'\n\n"}
          {'<Search\n'}
          {'    placeholder="Search Civitas, Organisasi…"\n'}
          {'    '}
          <H>onSearch</H>
          {'={(value) => cari(value)}\n'}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="platform" title="Platform">
        <Lead>
          Dua ukuran, sama seperti Input Field. <H>default</H> setinggi 54px dengan ikon 18px dan teks
          16px; <H>mobile</H> setinggi 50px dengan ikon 14px dan teks 14px. Tombolnya ikut mengecil
          dari 38px ke 34px.
        </Lead>
        <div className="grid gap-5">
          <Demo label="Default — 54px">
            <Search placeholder={PLACEHOLDER} />
          </Demo>
          <Demo label="Mobile — 50px">
            <div className="max-w-[348px]">
              <Search platform="mobile" placeholder={PLACEHOLDER} />
            </div>
          </Demo>
        </div>
        <SectionCode>
          {'<Search '}
          <H>platform</H>
          {'="mobile" placeholder="Search Civitas, Organisasi…" />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="kategori" title="Dengan kategori">
        <Lead>
          Begitu prop <H>categories</H> diisi, komponen berpindah bentuk: dropdown kategori di kiri,
          isian di tengah, dan tombol ikon di kanan. Variannya dibuat implisit karena varian kategori
          tanpa daftar kategori tidak punya arti.
        </Lead>
        <div className="grid gap-5">
          <Demo label="Default — 882px">
            <div className="max-w-[882px]">
              <Search
                categories={kategori}
                placeholder={PLACEHOLDER}
                onSearch={(v, c) => setTerakhir(c ? `${v} · ${c}` : v)}
              />
            </div>
          </Demo>
          <Demo label="Mobile — 382px">
            <div className="max-w-[382px]">
              <Search
                categories={kategori}
                placeholder={PLACEHOLDER}
                onSearch={(v, c) => setTerakhir(c ? `${v} · ${c}` : v)}
              />
            </div>
          </Demo>
        </div>
        <SectionCode>
          {'<Search\n'}
          {'    '}
          <H>categories</H>
          {'={[{ value: "civitas", label: "Civitas" }]}\n'}
          {'    placeholder="Search Civitas, Organisasi…"\n'}
          {'    onSearch={(value, category) => cari(value, category)}\n'}
          {'/>'}
        </SectionCode>
        <p className="mt-4 text-body-sm text-gray-500">
          Kedua ukuran di atas isinya sama persis: tinggi 39px, ruas kategori 113px, dan tombol
          44px. Yang berbeda cuma isian di tengah — ia memanjang mengikuti wadahnya, dari 382px di
          ponsel sampai 882px di layar lebar. Karena itu prop <H>platform</H> tidak dipakai bentuk
          ini; cukup atur lebar wadahnya. Dropdown-nya <H>&lt;select&gt;</H> biasa, jadi di ponsel
          yang muncul pemilih bawaan sistem.
        </p>
      </FlowSection>

      <FlowSection id="application" title="Application">
        <Lead>
          Warna tombol cari — dan garis kotak saat difokus — mengikuti aplikasi yang memakainya,
          dengan token warna yang sama seperti pada Input Field dan Text Area. Pilih sekali di tingkat
          halaman, lalu biarkan sama untuk semua form di aplikasi itu.
        </Lead>
        <div className="grid gap-5">
          {applications.map((a) => (
            <Demo key={a.value} label={a.label}>
              <Search
                application={a.value}
                placeholder={PLACEHOLDER}
                helperText={`bg-${a.token}`}
              />
            </Demo>
          ))}
        </div>
        <SectionCode>
          {'<Search '}
          <H>application</H>
          {'="simaya" placeholder="Search Civitas, Organisasi…" />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Satu komponen yang bisa Anda utak-atik lewat kontrol di bawahnya. Tekan tombolnya atau Enter di
          dalam field untuk melihat nilai yang diteruskan ke <H>onSearch</H>.
        </Lead>

        <Stage
          maxWidth={
            withCategory
              ? platform === 'mobile'
                ? 'max-w-[382px]'
                : 'max-w-[882px]'
              : platform === 'mobile'
                ? 'max-w-[348px]'
                : 'max-w-[560px]'
          }
        >
          <Search
            application={application}
            platform={platform}
            categories={withCategory ? kategori : undefined}
            label={withLabel ? 'Cari data' : undefined}
            helperText={withHelper ? 'Tekan Enter atau tombol Cari.' : undefined}
            placeholder={PLACEHOLDER}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            category={withCategory ? category : undefined}
            onCategoryChange={setCategory}
            onSearch={(v, c) => setTerakhir(c ? `${v || '(kosong)'} · ${c}` : v || '(kosong)')}
          />
        </Stage>

        <Controls>
          <Control label="Application">
            <Segmented
              label="Pilih aplikasi"
              value={application}
              onChange={setApplication}
              itemClassName="px-2.5"
              options={applications.map((a) => ({ value: a.value, label: a.label }))}
            />
          </Control>

          <Control label="Platform">
            <Segmented
              label="Pilih platform"
              value={platform}
              onChange={setPlatform}
              options={[
                { value: 'default', label: 'Default' },
                { value: 'mobile', label: 'Mobile' },
              ]}
            />
          </Control>

          <Control label="Kategori">
            <Segmented
              label="Tampilkan kategori"
              value={withCategory}
              onChange={setWithCategory}
              options={adaTidakAda}
            />
          </Control>

          <Control label="Label">
            <Segmented
              label="Tampilkan label"
              value={withLabel}
              onChange={setWithLabel}
              options={adaTidakAda}
            />
          </Control>

          <Control label="Helper text">
            <Segmented
              label="Tampilkan helper text"
              value={withHelper}
              onChange={setWithHelper}
              options={adaTidakAda}
            />
          </Control>
        </Controls>

        <p className="mt-4 text-body-sm text-gray-500">
          Pencarian terakhir:{' '}
          {terakhir === null ? (
            <em>belum ada</em>
          ) : (
            <code className="text-xs font-bold text-gray-700">{terakhir}</code>
          )}
. Saat kategori dinyalakan, <em>Platform</em> hanya mengganti lebar wadah pratinjaunya — 882px
          atau 382px — sedangkan tinggi dan isi ruasnya tetap sama.
        </p>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Blok ini mengikuti kontrol di Playground — ubah kontrolnya, kodenya ikut berubah. Prop yang
          nilainya masih bawaan sengaja tidak ditulis.
        </Lead>
        <SectionCode flush>
          {"import { Search } from '@stasi/design-kit-react'\n\n"}
          {'<Search\n'}
          {application !== 'default' && (
            <>
              {'    '}
              <H>application</H>
              {`="${application}"\n`}
            </>
          )}
          {platform !== 'default' && !withCategory && (
            <>
              {'    '}
              <H>platform</H>
              {'="mobile"\n'}
            </>
          )}
          {withCategory && (
            <>
              {'    '}
              <H>categories</H>
              {'={kategori}\n'}
            </>
          )}
          {withLabel && (
            <>
              {'    '}
              <H>label</H>
              {'="Cari data"\n'}
            </>
          )}
          {withHelper && (
            <>
              {'    '}
              <H>helperText</H>
              {'="Tekan Enter atau tombol Cari."\n'}
            </>
          )}
          {'    placeholder="Search Civitas, Organisasi…"\n'}
          {'    value={value}\n'}
          {'    onChange={(e) => setValue(e.target.value)}\n'}
          {withCategory && '    onCategoryChange={setCategory}\n'}
          {'    onSearch={(value, category) => cari(value, category)}\n'}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Seluruh prop yang diterima komponen, beserta tipe dan nilai bawaannya. Atribut{' '}
          <H>&lt;input&gt;</H> standar juga diteruskan apa adanya.
        </Lead>
        <PropsTable rows={searchProps} minWidth="52rem" />
      </FlowSection>
    </UsulanPage>
  )
}
