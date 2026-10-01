import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import {
  ArrowRightToBracket,
  ChevronDown,
  Cog,
  QuestionCircle,
  User,
} from '../../../lib/icons/outline'
import {
  Checkbox,
  Dropdown,
  Icon,
  Radio,
  type DropdownGroup,
  type DropdownItem,
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

type DropdownExample = 'actions' | 'icons' | 'radio' | 'checkbox' | 'scroll'

const examples: { value: DropdownExample; label: string }[] = [
  { value: 'actions', label: 'Tanpa ikon' },
  { value: 'icons', label: 'Dengan ikon' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'scroll', label: 'Dengan scroll' },
]

const booleanOptions = [
  { value: true, label: 'Ada' },
  { value: false, label: 'Tidak Ada' },
]

const variationMinHeights: Record<DropdownExample, string> = {
  actions: 'min-h-72',
  icons: 'min-h-72',
  radio: 'min-h-56',
  checkbox: 'min-h-56',
  scroll: 'min-h-72',
}

const triggerClassName = [
  'inline-flex h-10 items-center justify-center gap-2',
  'rounded-lg bg-primary-700 px-4',
  'text-base font-medium text-white',
  'transition-colors duration-200 hover:bg-primary-800',
  'focus:outline-none focus:ring-2 focus:ring-primary-400',
  'disabled:pointer-events-none disabled:opacity-50',
].join(' ')

const selectionRowClassName = 'w-full rounded-md px-2 hover:bg-gray-100'
const disabledSelectionRowClassName = 'w-full rounded-md px-2'

/** Pemisah untuk panel berisi kontrol bebas — daftar aksi memakai `groups`. */
const hrClassName = 'my-1 border-0 border-t border-border'

const toc: TocEntry[] = [
  { id: 'dropdown', label: 'Dropdown' },
  { id: 'kelompok', label: 'Kelompok' },
  { id: 'keterangan', label: 'Keterangan' },
  { id: 'disable', label: 'Disable' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

const dropdownProps: PropRow[] = [
  ['trigger', 'ReactElement', 'required', 'Satu <button> milik Anda. Komponen menyalinnya untuk memasang atribut Popover.'],
  ['items', 'DropdownItem[]', 'undefined', 'Daftar aksi tanpa pengelompokan.'],
  ['groups', 'DropdownGroup[]', 'undefined', 'Aksi terkelompok, lengkap dengan label dan pemisah antar-kelompok.'],
  ['children', 'ReactNode', 'undefined', 'Isi panel bila bukan daftar aksi. Diabaikan selama items atau groups terisi.'],
  ['className', 'string', 'undefined', 'Class tambahan pada pembungkus terluar.'],
  ['contentClassName', 'string', 'undefined', 'Class tambahan pada panelnya.'],
  ['…props', 'HTMLAttributes<HTMLDivElement>', '—', 'Atribut <div> standar diteruskan ke pembungkus.'],
]

const itemProps: PropRow[] = [
  ['label', 'ReactNode', 'required', 'Teks aksi.'],
  ['description', 'ReactNode', 'undefined', 'Baris kedua di bawah label.'],
  ['icon', 'ReactNode', 'undefined', 'Ikon kecil di kiri label; ukurannya diatur komponen.'],
  ['href', 'string', 'undefined', 'Bila diisi, aksinya dirender sebagai tautan.'],
  ['onClick', '() => void', 'undefined', 'Dipanggil saat aksi ditekan. Panel menutup sendiri setelahnya.'],
  ['tone', "'default' | 'danger'", "'default'", 'Warna semantik aksi.'],
  ['disabled', 'boolean', 'false', 'Mematikan aksi.'],
  ['id', 'string', 'undefined', 'Kunci React; bila kosong dipakai urutannya.'],
]

const groupProps: PropRow[] = [
  ['id', 'string', 'required', 'Kunci React untuk kelompok.'],
  ['label', 'string', 'undefined', 'Judul kecil di atas kelompok.'],
  ['separator', 'boolean', 'false', 'Menambahkan garis pemisah sebelum kelompok ini.'],
  ['items', 'DropdownItem[]', 'required', 'Aksi di dalam kelompok.'],
]

function trigger(label = 'Dropdown button') {
  return (
    <button type="button" className={triggerClassName}>
      {label}
      <Icon className="!size-3.5">
        <ChevronDown />
      </Icon>
    </button>
  )
}

interface VariationOptions {
  withSeparator: boolean
  withDescription: boolean
  withDisabled: boolean
}

/** Aksi yang dipakai contoh "Tanpa ikon" dan "Dengan ikon". */
function aksi(
  { withDescription, withDisabled }: VariationOptions,
  withIcons: boolean,
): DropdownItem[] {
  return [
    {
      label: 'Profil',
      icon: withIcons ? <User /> : undefined,
      description: withDescription ? 'Lihat dan ubah profil.' : undefined,
    },
    {
      label: 'Pengaturan',
      icon: withIcons ? <Cog /> : undefined,
      description: withDescription ? 'Atur preferensi akun.' : undefined,
    },
    {
      label: 'Bantuan',
      icon: withIcons ? <QuestionCircle /> : undefined,
      disabled: withDisabled ? true : undefined,
    },
    { label: 'Keluar', tone: 'danger', icon: withIcons ? <ArrowRightToBracket /> : undefined },
  ]
}

/** Aksi yang sama, dipecah dua kelompok supaya pemisahnya punya tempat. */
function kelompokAksi(options: VariationOptions, withIcons: boolean): DropdownGroup[] {
  const semua = aksi(options, withIcons)
  return [
    { id: 'utama', items: semua.slice(0, 3) },
    { id: 'keluar', separator: true, items: semua.slice(3) },
  ]
}

function ScrollContentItems({
  withSeparator,
  withDescription,
  withDisabled,
}: VariationOptions) {
  return (
    <>
      <Checkbox className={selectionRowClassName} label="Email" helperText={withDescription ? 'Notifikasi melalui email.' : undefined} defaultChecked />
      <Checkbox className={selectionRowClassName} label="Push notification" helperText={withDescription ? 'Notifikasi pada perangkat.' : undefined} />
      <Checkbox className={selectionRowClassName} label="SMS" helperText={withDescription ? 'Notifikasi melalui SMS.' : undefined} />
      <Checkbox className={selectionRowClassName} label="WhatsApp" defaultChecked />
      {withSeparator && <hr className={hrClassName} />}
      <Checkbox className={selectionRowClassName} label="Pembaruan produk" />
      <Checkbox className={selectionRowClassName} label="Aktivitas akun" />
      <Checkbox
        className={withDisabled ? disabledSelectionRowClassName : selectionRowClassName}
        label="Keamanan"
        disabled={withDisabled}
      />
      <Checkbox className={selectionRowClassName} label="Promosi" />
      <Checkbox className={selectionRowClassName} label="Laporan mingguan" />
      <Checkbox className={selectionRowClassName} label="Pengingat" defaultChecked />
      <Checkbox className={selectionRowClassName} label="Integrasi" />
      <Checkbox className={selectionRowClassName} label="Sistem" />
    </>
  )
}

interface ContohProps extends VariationOptions {
  example: DropdownExample
  groupName: string
  label?: string
}

/**
 * Satu Dropdown utuh untuk contoh mana pun.
 *
 * Dua contoh pertama memakai `items`/`groups` — Dropdown yang menyusun
 * daftarnya. Tiga sisanya memakai `children`, karena isinya kontrol form, bukan
 * daftar aksi.
 */
function ContohDropdown({
  example,
  groupName,
  withSeparator,
  withDescription,
  withDisabled,
}: ContohProps) {
  const opsi = { withSeparator, withDescription, withDisabled }

  if (example === 'actions' || example === 'icons') {
    const withIcons = example === 'icons'
    return withSeparator ? (
      <Dropdown trigger={trigger()} groups={kelompokAksi(opsi, withIcons)} aria-label="Daftar aksi" />
    ) : (
      <Dropdown trigger={trigger()} items={aksi(opsi, withIcons)} aria-label="Daftar aksi" />
    )
  }

  if (example === 'scroll') {
    return (
      <Dropdown trigger={trigger()} contentClassName="p-4" aria-label="Pilih notifikasi dengan scroll">
        <div className="flex max-h-48 flex-col gap-4 overflow-y-auto overscroll-y-contain">
          <ScrollContentItems {...opsi} />
        </div>
      </Dropdown>
    )
  }

  if (example === 'radio') {
    return (
      <Dropdown trigger={trigger()} contentClassName="p-4" aria-label="Pilih akses">
        <div className="flex flex-col gap-4">
          <Radio className={selectionRowClassName} name={groupName} value="viewer" label="Viewer" />
          <Radio className={selectionRowClassName} name={groupName} value="editor" label="Editor" helperText={withDescription ? 'Dapat mengubah konten.' : undefined} defaultChecked />
          {withSeparator && <hr className={hrClassName} />}
          <Radio
            className={withDisabled ? disabledSelectionRowClassName : selectionRowClassName}
            name={groupName}
            value="admin"
            label="Admin"
            disabled={withDisabled}
          />
        </div>
      </Dropdown>
    )
  }

  return (
    <Dropdown trigger={trigger()} contentClassName="p-4" aria-label="Pilih notifikasi">
      <div className="flex flex-col gap-4">
        <Checkbox className={selectionRowClassName} label="Email" helperText={withDescription ? 'Kirim pembaruan melalui email.' : undefined} />
        <Checkbox className={selectionRowClassName} label="Push notification" helperText={withDescription ? 'Tampilkan pada perangkat.' : undefined} defaultChecked />
        {withSeparator && <hr className={hrClassName} />}
        <Checkbox
          className={withDisabled ? disabledSelectionRowClassName : selectionRowClassName}
          label="SMS"
          disabled={withDisabled}
        />
      </div>
    </Dropdown>
  )
}

function CompositionDemo({
  example,
  label,
  groupName,
  withSeparator,
  withDescription,
  withDisabled,
}: ContohProps) {
  return (
    <Demo label={label}>
      <div className={`flex ${variationMinHeights[example]} items-start justify-center pt-3`}>
        <ContohDropdown
          example={example}
          groupName={groupName}
          withSeparator={withSeparator}
          withDescription={withDescription}
          withDisabled={withDisabled}
        />
      </div>
    </Demo>
  )
}

/** Satu entri `items` dalam bentuk kode, mengikuti kontrol Playground. */
function ItemCode({
  label,
  description,
  icon,
  tone,
  disabled,
}: {
  label: string
  description?: string
  icon?: string
  tone?: string
  disabled?: boolean
}) {
  const bagian: ReactNode[] = [`{ label: '${label}'`]
  if (icon) {
    bagian.push(
      <span key="icon">
        {', '}
        <H>icon</H>
        {`: <${icon} />`}
      </span>,
    )
  }
  if (description) {
    bagian.push(
      <span key="description">
        {', '}
        <H>description</H>
        {`: '${description}'`}
      </span>,
    )
  }
  if (tone) bagian.push(`, tone: '${tone}'`)
  if (disabled) bagian.push(<span key="disabled">{', '}<H>disabled</H>{': true'}</span>)
  bagian.push(' },')
  return <>{bagian}</>
}

function ExampleCode({
  example,
  withSeparator,
  withDescription,
  withDisabled,
}: VariationOptions & { example: DropdownExample }) {
  const imports = new Set(['Dropdown'])
  if (example === 'checkbox' || example === 'scroll') imports.add('Checkbox')
  if (example === 'radio') imports.add('Radio')
  const daftarImport = [...imports].sort((a, b) => a.localeCompare(b))

  const withIcons = example === 'icons'
  const daftarAksi = example === 'actions' || example === 'icons'

  const triggerCode =
    '\nconst trigger = (\n  <button type="button" className="...">\n    Dropdown button\n  </button>\n)\n'

  return (
    <>
      {`import { ${daftarImport.join(', ')} } from '@ceplok-ui/design-kit-react'\n`}
      {withIcons &&
        "import { ArrowRightToBracket, Cog, QuestionCircle, User } from '@ceplok-ui/design-kit-react/icons/outline'\n"}
      {triggerCode}

      {daftarAksi ? (
        withSeparator ? (
          <>
            {'\n<Dropdown\n  trigger={trigger}\n  '}
            <H>groups</H>
            {'={[\n    {\n      id: \'utama\',\n      items: [\n        '}
            <ItemCode
              label="Profil"
              icon={withIcons ? 'User' : undefined}
              description={withDescription ? 'Lihat dan ubah profil.' : undefined}
            />
            {'\n        '}
            <ItemCode
              label="Pengaturan"
              icon={withIcons ? 'Cog' : undefined}
              description={withDescription ? 'Atur preferensi akun.' : undefined}
            />
            {'\n        '}
            <ItemCode
              label="Bantuan"
              icon={withIcons ? 'QuestionCircle' : undefined}
              disabled={withDisabled}
            />
            {'\n      ],\n    },\n    {\n      id: \'keluar\',\n      '}
            <H>separator</H>
            {': true,\n      items: [\n        '}
            <ItemCode
              label="Keluar"
              icon={withIcons ? 'ArrowRightToBracket' : undefined}
              tone="danger"
            />
            {'\n      ],\n    },\n  ]}\n/>'}
          </>
        ) : (
          <>
            {'\n<Dropdown\n  trigger={trigger}\n  items={[\n    '}
            <ItemCode
              label="Profil"
              icon={withIcons ? 'User' : undefined}
              description={withDescription ? 'Lihat dan ubah profil.' : undefined}
            />
            {'\n    '}
            <ItemCode
              label="Pengaturan"
              icon={withIcons ? 'Cog' : undefined}
              description={withDescription ? 'Atur preferensi akun.' : undefined}
            />
            {'\n    '}
            <ItemCode
              label="Bantuan"
              icon={withIcons ? 'QuestionCircle' : undefined}
              disabled={withDisabled}
            />
            {'\n    '}
            <ItemCode
              label="Keluar"
              icon={withIcons ? 'ArrowRightToBracket' : undefined}
              tone="danger"
            />
            {'\n  ]}\n/>'}
          </>
        )
      ) : (
        <>
          {'\n<Dropdown trigger={trigger} '}
          <H>contentClassName</H>
          {'="p-4">\n'}
          {example === 'scroll' ? (
            <>
              {'  <div '}
              <H>className</H>
              {'="flex max-h-48 flex-col gap-4 overflow-y-auto overscroll-y-contain">\n'}
              {'    <Checkbox label="Email" '}
              {withDescription && <><H>helperText</H>{'="Notifikasi melalui email." '}</>}
              {'defaultChecked />\n    <Checkbox label="Push notification" />\n    {/* … */}\n'}
              {withSeparator && '    <hr className="my-1 border-0 border-t border-border" />\n'}
              {'    <Checkbox label="Pembaruan produk" />\n    {/* … */}\n    <Checkbox label="Keamanan" '}
              {withDisabled && <><H>disabled</H>{' '}</>}
              {'/>\n    {/* … */}\n    <Checkbox label="Sistem" />\n  </div>\n</Dropdown>'}
            </>
          ) : example === 'radio' ? (
            <>
              {'  <div className="flex flex-col gap-4">\n    <'}
              <H>Radio</H>
              {' name="access" value="viewer" label="Viewer" />\n    <'}
              <H>Radio</H>
              {' name="access" value="editor" label="Editor" '}
              {withDescription && <><H>helperText</H>{'="Dapat mengubah konten." '}</>}
              {'defaultChecked />\n'}
              {withSeparator && '    <hr className="my-1 border-0 border-t border-border" />\n'}
              {'    <'}
              <H>Radio</H>
              {' name="access" value="admin" label="Admin" '}
              {withDisabled && <><H>disabled</H>{' '}</>}
              {'/>\n  </div>\n</Dropdown>'}
            </>
          ) : (
            <>
              {'  <div className="flex flex-col gap-4">\n    <'}
              <H>Checkbox</H>
              {' label="Email" '}
              {withDescription && <><H>helperText</H>{'="Kirim pembaruan melalui email." '}</>}
              {'/>\n    <'}
              <H>Checkbox</H>
              {' label="Push notification" defaultChecked />\n'}
              {withSeparator && '    <hr className="my-1 border-0 border-t border-border" />\n'}
              {'    <'}
              <H>Checkbox</H>
              {' label="SMS" '}
              {withDisabled && <><H>disabled</H>{' '}</>}
              {'/>\n  </div>\n</Dropdown>'}
            </>
          )}
        </>
      )}
    </>
  )
}

export function DropdownPage() {
  const [example, setExample] = useState<DropdownExample>('actions')
  const [withSeparator, setWithSeparator] = useState(false)
  const [withDescription, setWithDescription] = useState(false)
  const [withDisabled, setWithDisabled] = useState(false)

  /*
   * Panelnya dibuka sejak halaman dimuat, dan dibuka lagi setelah kontrolnya
   * diganti — kalau tidak, setiap penggantian menutup panel dan variasinya
   * tidak bisa dibandingkan.
   *
   * Tombol dan panelnya dicari dari DOM pembungkus, bukan lewat ref ke
   * masing-masing: sejak API-nya rata, panel itu urusan dalam komponen dan
   * tidak lagi punya ref sendiri. Ini halaman dokumentasi yang mengintip
   * DOM-nya sendiri, bukan pemakaian yang dianjurkan.
   */
  const panggung = useRef<HTMLDivElement>(null)
  const bukaLagi = useRef(false)
  const frame = useRef(0)
  const sudahDibuka = useRef(false)

  const panel = () => panggung.current?.querySelector<HTMLDivElement>('[popover]') ?? null
  const triggerElement = () => panggung.current?.querySelector('button') ?? null

  useEffect(() => {
    if (sudahDibuka.current) return
    sudahDibuka.current = true

    const p = panel()
    const t = triggerElement()
    if (p && t && !p.matches(':popover-open')) p.showPopover({ source: t })

    return () => {
      if (frame.current) window.cancelAnimationFrame(frame.current)
      frame.current = 0
    }
  }, [])

  const ingatKeadaan = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    bukaLagi.current = panel()?.matches(':popover-open') ?? false
  }

  const ubah = (update: () => void) => {
    const perluDibuka = bukaLagi.current
    bukaLagi.current = false
    update()

    if (!perluDibuka) return
    if (frame.current) window.cancelAnimationFrame(frame.current)

    // Satu frame ditunggu supaya panel yang baru sudah terpasang sebelum
    // diminta terbuka.
    frame.current = window.requestAnimationFrame(() => {
      frame.current = 0
      const p = panel()
      const t = triggerElement()
      if (p?.isConnected && t && !p.matches(':popover-open')) p.showPopover({ source: t })
    })
  }

  return (
    <UsulanPage
      eyebrow="Components · Dropdown"
      title="Dropdown"
      description="Panel aksi yang dibuka dari sebuah tombol. Isinya ditentukan prop — trigger untuk tombolnya, items atau groups untuk daftarnya — seperti Sidebar dan Select."
      toc={toc}
    >
      <FlowSection id="dropdown" title="Dropdown">
        <Lead>
          <H>trigger</H> menerima satu tombol milik Anda; <H>items</H> menerima daftar aksinya. Panel
          ditutup lewat trigger, klik di luar, atau Escape — semuanya diurus HTML Popover API, jadi
          tidak ada state buka/tutup yang bisa melenceng. Aksi menutup panel setelah ditekan;
          kontrol seperti Radio dan Checkbox tetap terbuka saat pilihannya berubah.
        </Lead>
        <Stage maxWidth="max-w-xl">
          <div className="flex min-h-72 items-start justify-center pt-10">
            <ContohDropdown
              example="actions"
              groupName="overview-dropdown"
              withSeparator={false}
              withDescription={false}
              withDisabled={false}
            />
          </div>
        </Stage>
        <SectionCode>
          {"<Dropdown\n  trigger={<button type=\"button\">Dropdown button</button>}\n  items={[\n    { label: 'Profil' },\n    { label: 'Pengaturan' },\n    { label: 'Keluar', tone: 'danger' },\n  ]}\n/>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="kelompok" title="Kelompok">
        <Lead>
          Aksi yang perlu dipisah disusun lewat <H>groups</H>. Prop <H>separator</H> menambahkan
          garis sebelum sebuah kelompok — artinya sama persis dengan <H>SidebarGroup</H>, jadi tidak
          ada yang perlu dihafal ulang. Untuk panel berisi kontrol bebas, pakai <H>&lt;hr&gt;</H>
          biasa.
        </Lead>
        <div className="grid gap-6 sm:grid-cols-2">
          <CompositionDemo
            example="actions"
            label="Satu daftar"
            groupName="separator-none"
            withSeparator={false}
            withDescription={false}
            withDisabled={false}
          />
          <CompositionDemo
            example="actions"
            label="Dua kelompok"
            groupName="separator-with"
            withSeparator
            withDescription={false}
            withDisabled={false}
          />
        </div>
        <SectionCode>
          {'<Dropdown\n  trigger={trigger}\n  '}
          <H>groups</H>
          {"={[\n    {\n      id: 'utama',\n      items: [\n        { label: 'Profil' },\n        { label: 'Pengaturan' },\n      ],\n    },\n    {\n      id: 'keluar',\n      "}
          <H>separator</H>
          {": true,\n      items: [{ label: 'Keluar', tone: 'danger' }],\n    },\n  ]}\n/>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="keterangan" title="Keterangan">
        <Lead>
          Aksi yang perlu konteks tambahan diberi <H>description</H> — baris kedua yang lebih kecil
          di bawah labelnya. Untuk panel berisi Radio atau Checkbox, yang dipakai <H>helperText</H>{' '}
          milik komponen itu sendiri.
        </Lead>
        <div className="grid gap-6 sm:grid-cols-2">
          <CompositionDemo
            example="actions"
            label="Tanpa keterangan"
            groupName="description-none"
            withSeparator={false}
            withDescription={false}
            withDisabled={false}
          />
          <CompositionDemo
            example="actions"
            label="Dengan keterangan"
            groupName="description-with"
            withSeparator={false}
            withDescription
            withDisabled={false}
          />
        </div>
        <SectionCode>
          {'<Dropdown\n  trigger={trigger}\n  items={[\n    {\n      label: \'Editor\',\n      '}
          <H>description</H>
          {": 'Dapat mengubah konten.',\n    },\n  ]}\n/>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="disable" title="Disable">
        <Lead>
          Tambahkan <H>disabled</H> pada item yang belum dapat dipilih. Pengaturan ini berlaku per
          item, bukan untuk seluruh Dropdown.
        </Lead>
        <div className="grid gap-6 sm:grid-cols-2">
          <CompositionDemo
            example="actions"
            label="Tanpa disable"
            groupName="disable-none"
            withSeparator={false}
            withDescription={false}
            withDisabled={false}
          />
          <CompositionDemo
            example="actions"
            label="Dengan disable"
            groupName="disable-with"
            withSeparator={false}
            withDescription={false}
            withDisabled
          />
        </div>
        <SectionCode>
          {'<Dropdown\n  trigger={trigger}\n  items={[\n    {\n      label: \'Bantuan\',\n      '}
          <H>disabled</H>
          {': true,\n    },\n  ]}\n/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Pratinjaunya dibuka sejak halaman dimuat supaya tiap variasi mudah dibandingkan. Gunakan
          kontrol di bawah untuk mengganti susunannya.
        </Lead>

        <Stage maxWidth="max-w-xl">
          <div ref={panggung} className="flex min-h-80 items-start justify-center pt-10">
            <ContohDropdown
              example={example}
              groupName="playground-dropdown"
              withSeparator={withSeparator}
              withDescription={withDescription}
              withDisabled={withDisabled}
            />
          </div>
        </Stage>

        <Controls>
          <Control label="Kelompok">
            <div onPointerDownCapture={ingatKeadaan}>
              <Segmented
                label="Pisahkan jadi dua kelompok"
                value={withSeparator}
                onChange={(value) => ubah(() => setWithSeparator(value))}
                options={booleanOptions}
              />
            </div>
          </Control>
          <Control label="Keterangan">
            <div onPointerDownCapture={ingatKeadaan}>
              <Segmented
                label="Tampilkan keterangan"
                value={withDescription}
                onChange={(value) => ubah(() => setWithDescription(value))}
                options={booleanOptions}
              />
            </div>
          </Control>
          <Control label="Disable">
            <div onPointerDownCapture={ingatKeadaan}>
              <Segmented
                label="Matikan satu pilihan"
                value={withDisabled}
                onChange={(value) => ubah(() => setWithDisabled(value))}
                options={booleanOptions}
              />
            </div>
          </Control>
          <Control label="Contoh">
            <div onPointerDownCapture={ingatKeadaan}>
              <Segmented
                label="Pilih contoh Dropdown"
                value={example}
                onChange={(value) => ubah(() => setExample(value))}
                options={examples}
                itemClassName="basis-1/2 justify-center px-2.5 sm:basis-1/3"
                wrap
              />
            </div>
          </Control>
        </Controls>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Daftar aksi cukup diisi lewat <H>items</H> atau <H>groups</H>; panel yang isinya bukan
          daftar aksi — form kecil, daftar panjang yang digulir — diisi lewat <H>children</H> dan
          diberi jarak sendiri lewat <H>contentClassName</H>. Kode berikut mengikuti pilihan Contoh
          di Playground.
        </Lead>
        <p className="mt-2 max-w-2xl text-body-sm text-gray-500">
          Prop <H>trigger</H> harus berisi satu elemen tunggal, bukan teks atau pecahan — komponen
          menyalinnya untuk memasang atribut Popover. Kalau memakai komponen tombol sendiri,
          pastikan ia meneruskan atribut <H>&lt;button&gt;</H> standar ke elemen yang dirender.
        </p>
        <SectionCode flush>
          <ExampleCode
            example={example}
            withSeparator={withSeparator}
            withDescription={withDescription}
            withDisabled={withDisabled}
          />
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Seluruh prop yang diterima komponen, beserta tipe dan nilai bawaannya, diikuti bentuk data
          untuk <H>items</H> dan <H>groups</H>.
        </Lead>

        <div className="space-y-8">
          <div>
            <h3 className="mb-3 text-heading-4 font-bold text-gray-900">Dropdown</h3>
            <PropsTable rows={dropdownProps} minWidth="48rem" />
          </div>
          <div>
            <h3 className="mb-3 text-heading-4 font-bold text-gray-900">DropdownItem</h3>
            <PropsTable rows={itemProps} minWidth="46rem" />
          </div>
          <div>
            <h3 className="mb-3 text-heading-4 font-bold text-gray-900">DropdownGroup</h3>
            <PropsTable rows={groupProps} minWidth="42rem" />
          </div>
        </div>
      </FlowSection>
    </UsulanPage>
  )
}
