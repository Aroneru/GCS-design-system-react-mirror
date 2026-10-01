import { useState } from 'react'
import { Datepicker, type DateRange, type DatepickerType } from '../../../lib'
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

// Tanggal contoh sengaja tetap, supaya pratinjau tidak berubah dari hari ke hari.
const TANGGAL = new Date(2021, 5, 25)
const SEPEKAN: DateRange = { start: new Date(2021, 5, 20), end: new Date(2021, 5, 26) }
const RENTANG: DateRange = { start: new Date(2021, 5, 25), end: new Date(2021, 6, 12) }
const SEMUA_WAKTU: DateRange = { start: null, end: null }

const types: { value: DatepickerType; label: string }[] = [
  { value: 'single', label: 'Single' },
  { value: 'period', label: 'Period' },
  { value: 'multiple', label: 'Multiple' },
]

/** Nama state contoh per bentuk, dipakai blok Penggunaan. */
const namaState: Record<DatepickerType, [string, string]> = {
  single: ['tanggal', 'setTanggal'],
  period: ['periode', 'setPeriode'],
  multiple: ['rentang', 'setRentang'],
}

/** Lebar panggung Playground — sama dengan lebar bawaan tiap bentuk. */
const lebarStage: Record<DatepickerType, string> = {
  single: 'max-w-[284px]',
  period: 'max-w-[325px]',
  multiple: 'max-w-[600px]',
}

const dua = (n: number) => String(n).padStart(2, '0')
const iso = (d: Date | null) =>
  d ? `${d.getFullYear()}-${dua(d.getMonth() + 1)}-${dua(d.getDate())}` : 'null'

const datepickerProps: PropRow[] = [
  ['type', "'single' | 'period' | 'multiple'", 'single', 'Bentuk pemilih: satu tanggal, satu kalender dengan pintasan periode, atau rentang dengan dua kalender.'],
  ['shortcuts', 'boolean', 'false', 'Khusus multiple: menambahkan Minggu ini, Bulan ini, dan Semua Waktu di samping Hari ini dan Hapus. Period selalu memilikinya.'],
  ['label', 'ReactNode', 'undefined', 'Teks label di atas kotak tanggal.'],
  ['placeholder', 'string', "'Pilih Tanggal'", 'Teks saat belum ada tanggal. Pada multiple dipakai kedua kotak, kecuali endPlaceholder diisi.'],
  ['endPlaceholder', 'string', 'placeholder', 'Teks kotak kedua pada multiple.'],
  ['value', 'Date | DateRange | null', 'undefined', 'Nilai terkendali: Date untuk single, DateRange untuk period dan multiple.'],
  ['defaultValue', 'Date | DateRange | null', 'undefined', 'Nilai awal bila tidak dikendalikan.'],
  ['onChange', '(value) => void', 'undefined', 'Dipanggil setiap tanggal atau pintasan dipilih. Pada period dan multiple juga saat baru tanggal mulai yang terisi.'],
  ['darkMode', 'boolean', 'false', 'Tampilan gelap untuk kotak, panel, kalender, dan tombolnya.'],
  ['disabled', 'boolean', 'false', 'Menonaktifkan kotak tanggal sehingga panel tidak bisa dibuka.'],
  ['name', 'string', 'undefined', 'Nama field formulir. Period dan multiple mengirim dua field: nama[start] dan nama[end].'],
  ['id', 'string', 'otomatis', 'id kotak pertama; label menunjuk ke sana.'],
  ['…props', 'HTMLAttributes<div>', '—', 'Diteruskan ke pembungkus terluar (className, style, data-*, …). Lebarnya dibatasi selebar panel; max-w-none melepasnya.'],
]

const toc: TocEntry[] = [
  { id: 'single', label: 'Single' },
  { id: 'period', label: 'Period' },
  { id: 'multiple', label: 'Multiple' },
  { id: 'dark-mode', label: 'Dark mode' },
  { id: 'nilai', label: 'Nilai & formulir' },
  { id: 'papan-ketik', label: 'Papan ketik' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

export function DatepickerPage() {
  const [type, setType] = useState<DatepickerType>('single')
  const [dark, setDark] = useState(false)
  const [withLabel, setWithLabel] = useState(true)
  const [disabled, setDisabled] = useState(false)
  const [shortcuts, setShortcuts] = useState(false)
  const [tunggal, setTunggal] = useState<Date | null>(null)
  const [rentang, setRentang] = useState<DateRange | null>(null)

  const namaLabel = withLabel ? { label: 'Nama Tanggal' } : { 'aria-label': 'Nama Tanggal' }
  const nilaiTerakhir =
    type === 'single'
      ? tunggal
        ? `Date(${iso(tunggal)})`
        : 'null'
      : rentang
        ? `{ start: ${iso(rentang.start)}, end: ${iso(rentang.end)} }`
        : 'null'
  const [namaNilai, namaSetel] = namaState[type]

  return (
    <UsulanPage
      eyebrow="Form"
      title="Datepicker"
      description="Pemilih tanggal dengan kalender di panel melayang — satu tanggal, satu kalender dengan pintasan periode, atau rentang dengan dua kalender. Tersedia juga dalam tampilan gelap."
      toc={toc}
    >
      <FlowSection id="single" title="Single">
        <Lead>
          Kotak setinggi 42px dengan ikon kalender di kiri. Menekannya membuka kalender tepat di bawah kotak,
          lengkap dengan tombol <H>Hari ini</H> dan <H>Hapus</H>. Memilih tanggal langsung menutup panelnya.
        </Lead>
        <div className="grid gap-5 sm:grid-cols-2">
          <Demo label="Belum dipilih">
            <Datepicker label="Nama Tanggal" />
          </Demo>
          <Demo label="Sudah dipilih">
            <Datepicker label="Nama Tanggal" defaultValue={TANGGAL} />
          </Demo>
        </div>
        <SectionCode>
          {"import { Datepicker } from '@ceplok-ui/design-kit-react'\n\n"}
          {'const [tanggal, setTanggal] = useState<Date | null>(null)\n\n'}
          {'<Datepicker\n'}
          {'    label="Nama Tanggal"\n'}
          {'    '}
          <H>value</H>
          {'={tanggal}\n'}
          {'    '}
          <H>onChange</H>
          {'={setTanggal}\n'}
          {'/>'}
        </SectionCode>
        <p className="mt-4 text-body-sm text-gray-500">
          Lebar bawaannya sama dengan panelnya — 284px untuk single, 325px untuk period, dan 600px untuk
          multiple — supaya tepi kotak dan kalendernya segaris. Di wadah yang lebih sempit ia ikut menyusut;{' '}
          <H>className="max-w-none"</H> melepas batas itu.
        </p>
      </FlowSection>

      <FlowSection id="period" title="Period">
        <Lead>
          Satu kalender dengan lima pintasan — <H>Hari ini</H>, <H>Minggu ini</H>, <H>Bulan ini</H>,{' '}
          <H>Hapus</H>, dan <H>Semua Waktu</H> — untuk menyaring daftar berdasarkan waktu. Karena Minggu ini
          dan Bulan ini adalah rentang, nilainya berupa <H>DateRange</H>. Rentang lain dipilih langsung di
          kalendernya dengan dua klik: klik pertama mengisi tanggal mulai, klik kedua tanggal selesai, dan
          panel baru tertutup setelah klik kedua.
        </Lead>
        <div className="grid gap-5 sm:grid-cols-2">
          <Demo label="Satu minggu">
            <Datepicker type="period" label="Nama Tanggal" defaultValue={SEPEKAN} />
          </Demo>
          <Demo label="Semua Waktu">
            <Datepicker type="period" label="Nama Tanggal" defaultValue={SEMUA_WAKTU} />
          </Demo>
        </div>
        <SectionCode>
          {"import { Datepicker, type DateRange } from '@ceplok-ui/design-kit-react'\n\n"}
          {'const [periode, setPeriode] = useState<DateRange | null>(null)\n\n'}
          {'<Datepicker\n'}
          {'    '}
          <H>type</H>
          {'="period"\n'}
          {'    label="Nama Tanggal"\n'}
          {'    value={periode}\n'}
          {'    onChange={setPeriode}\n'}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="multiple" title="Multiple">
        <Lead>
          Dua kotak — tanggal mulai dan tanggal selesai — dengan dua kalender berdampingan. Seperti period,
          klik pertama mengisi tanggal mulai dan klik kedua tanggal selesai, baru panelnya tertutup; tanggal
          di antaranya diberi latar abu. Seperti single, tombolnya hanya <H>Hari ini</H> dan <H>Hapus</H>;
          prop <H>shortcuts</H> menambahkan <H>Minggu ini</H>, <H>Bulan ini</H>, dan <H>Semua Waktu</H>{' '}
          seperti pada period.
        </Lead>
        <div className="grid gap-5">
          <Demo label="Rentang terpilih">
            <Datepicker type="multiple" label="Nama Tanggal" defaultValue={RENTANG} />
          </Demo>
          <Demo label="Dengan shortcuts">
            <Datepicker type="multiple" shortcuts label="Nama Tanggal" />
          </Demo>
        </div>
        <SectionCode>
          {'<Datepicker\n'}
          {'    '}
          <H>type</H>
          {'="multiple"\n'}
          {'    label="Nama Tanggal"\n'}
          {'    value={rentang}\n'}
          {'    onChange={setRentang}\n'}
          {'/>\n\n'}
          {'// Dengan Minggu ini, Bulan ini, dan Semua Waktu\n'}
          {'<Datepicker type="multiple" '}
          <H>shortcuts</H>
          {' label="Nama Tanggal" />'}
        </SectionCode>
        <p className="mt-4 text-body-sm text-gray-500">
          Kedua kalender bisa digeser sendiri-sendiri, jadi rentang yang panjang tidak perlu melewati setiap
          bulan di antaranya. Kotak mana pun yang ditekan, pilihan selalu dimulai dari tanggal mulai; tanggal
          selesai yang jatuh sebelum tanggal mulai dianggap memulai rentang baru. Tanggal bulan sebelah yang
          ikut tampil di tepi kalender — misalnya 27–30 September di kalender Oktober — tidak disorot bila
          bulannya sudah tampil di kalender sebelah: sorotannya cukup di sana, tetapi tanggal itu tetap bisa
          ditekan. Di layar sempit kedua kalender bertumpuk.
        </p>
      </FlowSection>

      <FlowSection id="dark-mode" title="Dark mode">
        <Lead>
          Prop <H>darkMode</H> mengganti seluruh warnanya ke tampilan gelap: kotak dan panel gray-700,
          tanggal terpilih primary-600, dan tombol pintasan berisi. Untuk saat ini baru Alert, Datepicker,
          dan Toast yang memilikinya.
        </Lead>
        <div className="grid gap-5 sm:grid-cols-2">
          <Demo label="Single" dark>
            <Datepicker darkMode label="Nama Tanggal" defaultValue={TANGGAL} />
          </Demo>
          <Demo label="Period" dark>
            <Datepicker darkMode type="period" label="Nama Tanggal" />
          </Demo>
          <div className="sm:col-span-2">
            <Demo label="Multiple" dark>
              <Datepicker darkMode type="multiple" label="Nama Tanggal" defaultValue={RENTANG} />
            </Demo>
          </div>
        </div>
        <SectionCode>
          {'<Datepicker '}
          <H>darkMode</H>
          {' label="Nama Tanggal" />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="nilai" title="Nilai & formulir">
        <Lead>
          Single bernilai <H>Date</H>, sedangkan period dan multiple bernilai <H>DateRange</H> —{' '}
          <H>{'{ start, end }'}</H>. Jamnya selalu dibuang, jadi dua tanggal cukup dibandingkan harinya.
        </Lead>
        <ul className="max-w-2xl space-y-2 text-body-sm text-gray-600">
          <li>
            <H>null</H> — belum diisi, atau setelah <H>Hapus</H>.
          </li>
          <li>
            <H>{'{ start: Date, end: Date }'}</H> — rentang. Hari ini, Minggu ini (Minggu–Sabtu, mengikuti
            urutan hari di kalender), dan Bulan ini (tanggal 1 sampai terakhir) menghasilkan bentuk ini.
          </li>
          <li>
            <H>{'{ start: Date, end: null }'}</H> — period atau multiple yang baru terisi tanggal mulainya.
          </li>
          <li>
            <H>{'{ start: null, end: null }'}</H> — Semua Waktu: rentang tanpa batas, berbeda dari belum
            diisi.
          </li>
        </ul>
        <SectionCode>
          {'<Datepicker '}
          <H>name</H>
          {'="tanggal_lahir" />\n'}
          {'// terkirim: tanggal_lahir=2021-06-25\n\n'}
          {'<Datepicker type="multiple" '}
          <H>name</H>
          {'="periode" />\n'}
          {'// terkirim: periode[start]=2021-06-25 & periode[end]=2021-07-12'}
        </SectionCode>
        <p className="mt-4 text-body-sm text-gray-500">
          Dengan <H>name</H>, tanggalnya ikut terkirim bersama formulir dalam format <H>YYYY-MM-DD</H>. Semua
          Waktu dikirim sebagai dua field kosong.
        </p>
      </FlowSection>

      <FlowSection id="papan-ketik" title="Papan ketik">
        <Lead>
          Begitu panel terbuka, fokus langsung berada di tanggal terpilih — atau hari ini — sehingga kalender
          bisa ditelusuri tanpa tetikus.
        </Lead>
        <ul className="max-w-2xl space-y-2 text-body-sm text-gray-600">
          <li>
            <H>←</H> <H>→</H> hari sebelumnya dan berikutnya; <H>↑</H> <H>↓</H> minggu sebelumnya dan
            berikutnya.
          </li>
          <li>
            <H>Home</H> dan <H>End</H> ke awal dan akhir minggu.
          </li>
          <li>
            <H>PageUp</H> dan <H>PageDown</H> ke bulan sebelumnya dan berikutnya; bersama <H>Shift</H>, ke
            tahun sebelumnya dan berikutnya.
          </li>
          <li>
            <H>Enter</H> atau <H>Spasi</H> memilih tanggal; <H>Escape</H> atau klik di luar panel menutupnya,
            dan fokus kembali ke kotak tanggalnya.
          </li>
        </ul>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Satu komponen yang bisa Anda utak-atik lewat kontrol di bawahnya. Setiap perubahan langsung
          terlihat di sini, dan bagian Penggunaan menuliskan kodenya.
        </Lead>

        <Stage maxWidth={lebarStage[type]} dark={dark}>
          {type === 'single' ? (
            <Datepicker
              {...namaLabel}
              darkMode={dark}
              disabled={disabled}
              value={tunggal}
              onChange={setTunggal}
            />
          ) : (
            <Datepicker
              {...namaLabel}
              type={type}
              shortcuts={shortcuts}
              darkMode={dark}
              disabled={disabled}
              value={rentang}
              onChange={setRentang}
            />
          )}
        </Stage>

        <p className="mt-4 text-body-sm text-gray-500">
          Nilai terakhir dari <H>onChange</H>: <H>{nilaiTerakhir}</H>
        </p>

        <Controls>
          <Control label="Type">
            <Segmented label="Pilih bentuk" value={type} onChange={setType} options={types} />
          </Control>

          <Control label="Shortcuts">
            {/* Hanya multiple yang bisa memilih; period selalu punya pintasan, single tidak pernah. */}
            <Segmented
              label="Pintasan periode"
              value={type === 'multiple' ? shortcuts : type === 'period'}
              onChange={setShortcuts}
              disabled={type !== 'multiple'}
              options={[
                { value: false, label: 'Tidak' },
                { value: true, label: 'Ya' },
              ]}
            />
          </Control>

          <Control label="Tampilan">
            <Segmented
              label="Pilih tampilan"
              value={dark}
              onChange={setDark}
              options={[
                { value: false, label: 'Terang' },
                { value: true, label: 'Gelap' },
              ]}
            />
          </Control>

          <Control label="Label">
            <Segmented label="Tampilkan label" value={withLabel} onChange={setWithLabel} options={adaTidakAda} />
          </Control>

          <Control label="Disabled">
            <Segmented
              label="Nonaktifkan"
              value={disabled}
              onChange={setDisabled}
              options={[
                { value: false, label: 'Tidak' },
                { value: true, label: 'Ya' },
              ]}
            />
          </Control>
        </Controls>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Blok ini mengikuti kontrol di Playground — ubah kontrolnya, kodenya ikut berubah. Prop yang
          nilainya masih bawaan sengaja tidak ditulis.
        </Lead>
        <SectionCode flush>
          {type === 'single'
            ? "import { Datepicker } from '@ceplok-ui/design-kit-react'\n\n"
            : "import { Datepicker, type DateRange } from '@ceplok-ui/design-kit-react'\n\n"}
          {`const [${namaNilai}, ${namaSetel}] = useState<${type === 'single' ? 'Date' : 'DateRange'} | null>(null)\n\n`}
          {'<Datepicker\n'}
          {type !== 'single' && (
            <>
              {'    '}
              <H>type</H>
              {`="${type}"\n`}
            </>
          )}
          {type === 'multiple' && shortcuts && (
            <>
              {'    '}
              <H>shortcuts</H>
              {'\n'}
            </>
          )}
          {dark && (
            <>
              {'    '}
              <H>darkMode</H>
              {'\n'}
            </>
          )}
          {disabled && (
            <>
              {'    '}
              <H>disabled</H>
              {'\n'}
            </>
          )}
          {withLabel ? '    label="Nama Tanggal"\n' : '    aria-label="Nama Tanggal"\n'}
          {`    value={${namaNilai}}\n`}
          {`    onChange={${namaSetel}}\n`}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>Seluruh prop yang diterima komponen, beserta tipe dan nilai bawaannya.</Lead>
        <PropsTable rows={datepickerProps} minWidth="48rem" />
      </FlowSection>
    </UsulanPage>
  )
}
