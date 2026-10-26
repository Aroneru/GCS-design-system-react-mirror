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
  type DropdownHandle,
  type DropdownGroup,
  type DropdownItem,
} from '../../../lib'
import { PropsTable, type PropRow } from '../../PropsTable'
import { Demo, H, Hl, Segmented } from '../../pageKit'
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
type DropdownMode = 'action' | 'selection'

const modes: { value: DropdownMode; label: string }[] = [
  { value: 'action', label: 'Action' },
  { value: 'selection', label: 'Selection' },
]

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
const darkSelectionRowClassName = 'w-full rounded-md px-2 hover:bg-gray-700'

/** Pemisah untuk panel berisi kontrol bebas — daftar aksi memakai `groups`. */
const hrClassName = 'my-1 border-0 border-t border-border'
const darkHrClassName = 'my-1 border-0 border-t border-gray-700'
const darkScrollClassName = [
  'ds-scroll-y',
  '[&::-webkit-scrollbar-track]:bg-gray-800',
  '[&::-webkit-scrollbar-thumb]:bg-gray-600',
  '[&::-webkit-scrollbar-thumb:hover]:bg-gray-500',
  '[&::-webkit-scrollbar-button]:hidden',
  '[@supports_not_selector(::-webkit-scrollbar)]:[scrollbar-color:var(--color-gray-600)_var(--color-gray-800)]',
].join(' ')

const toc: TocEntry[] = [
  { id: 'dropdown', label: 'Dropdown' },
  { id: 'kelompok', label: 'Kelompok' },
  { id: 'keterangan', label: 'Keterangan' },
  { id: 'disable', label: 'Disable' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'selection', label: 'Selection' },
  { id: 'dark-mode', label: 'Dark mode' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

const dropdownProps: PropRow[] = [
  ['trigger', 'ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>', 'required', 'Satu native <button>, Button dalam mode button, atau komponen tombol yang meneruskan atribut native ke <button> root-nya.'],
  ['items', 'DropdownItem[]', 'undefined', 'Daftar aksi tanpa pengelompokan.'],
  ['groups', 'DropdownGroup[]', 'undefined', 'Aksi terkelompok, lengkap dengan label dan pemisah antar-kelompok.'],
  ['children', 'ReactNode | (({ close }) => ReactNode)', 'undefined', 'Isi panel kustom. Render function menyediakan close() untuk dismissal eksplisit. Diabaikan selama items atau groups terisi.'],
  ['actionsRef', 'Ref<DropdownHandle>', 'undefined', 'Handle opsional untuk meminta close() dari kondisi eksternal tanpa mengakses DOM Popover.'],
  ['align', "'start' | 'center' | 'end'", "'start'", 'Menentukan perataan horizontal panel terhadap trigger sebelum penyesuaian batas viewport.'],
  ['closeOnSelect', 'boolean', 'true', 'Bila true, item generated yang enabled menutup panel setelah diaktifkan. Bila false, panel tetap terbuka.'],
  ['data-theme', "'light' | 'dark'", 'inherit', 'Boundary tema eksplisit. Jika tidak diisi, Dropdown mewarisi data-theme consumer terdekat. darkMode={true} selalu memaksa dark.'],
  ['darkMode', 'boolean', 'false', 'Override kompatibilitas yang memaksa boundary dark lokal, termasuk ketika data-theme="light" diberikan.'],
  ['className', 'string', 'undefined', 'Class tambahan pada pembungkus terluar.'],
  ['contentLabel', 'string', 'undefined', 'Nama panel bagi pembaca layar; hanya terpasang pada bentuk daftar pilihan.'],
  ['contentClassName', 'string', 'undefined', 'Class tambahan pada panelnya.'],
  ['…props', 'HTMLAttributes<HTMLDivElement>', '—', 'Atribut <div> standar diteruskan ke pembungkus.'],
]

const itemProps: PropRow[] = [
  ['label', 'ReactNode', 'required', 'Teks aksi.'],
  ['description', 'ReactNode', 'undefined', 'Baris kedua di bawah label.'],
  ['icon', 'ReactNode', 'undefined', 'Ikon kecil di kiri label; ukurannya diatur komponen.'],
  ['href', 'string', 'undefined', 'Bila diisi, aksinya dirender sebagai tautan.'],
  ['target', 'HTMLAttributeAnchorTarget', 'undefined', 'Target native untuk tautan aktif.'],
  ['rel', 'string', 'undefined', 'Relasi native tautan. target="_blank" memakai noopener noreferrer bila rel tidak diberikan.'],
  ['onClick', '(event: MouseEvent<HTMLElement>) => void', 'undefined', 'Menerima event klik asli sebelum kebijakan dismissal dijalankan.'],
  ['tone', "'default' | 'danger'", "'default'", 'Warna semantik aksi.'],
  ['disabled', 'boolean', 'false', 'Mematikan aksi.'],
  ['current', 'AriaAttributes[\'aria-current\']', 'undefined', 'Menandai tujuan navigasi saat ini tanpa mengaktifkan semantik listbox. true berarti page.'],
  ['selected', 'boolean', 'undefined', 'Menandai item sebagai opsi terpilih. Jika digunakan pada item, Dropdown menggunakan semantik daftar pilihan (listbox).'],
  ['id', 'string', 'undefined', 'Kunci React; bila kosong dipakai urutannya.'],
]

const groupProps: PropRow[] = [
  ['id', 'string', 'required', 'ID unik kelompok yang digunakan sebagai key React.'],
  ['label', 'string', 'undefined', 'Judul opsional yang ditampilkan di atas item dalam kelompok.'],
  ['separator', 'boolean', 'false', 'Menampilkan garis pemisah sebelum kelompok ini.'],
  ['items', 'DropdownItem[]', 'required', 'Daftar item yang ditampilkan di dalam kelompok.'],
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
  darkMode,
}: VariationOptions & { darkMode?: boolean }) {
  const rowClassName = darkMode ? darkSelectionRowClassName : selectionRowClassName
  return (
    <>
      <Checkbox darkMode={darkMode} className={rowClassName} label="Email" helperText={withDescription ? 'Notifikasi melalui email.' : undefined} defaultChecked />
      <Checkbox darkMode={darkMode} className={rowClassName} label="Push notification" helperText={withDescription ? 'Notifikasi pada perangkat.' : undefined} />
      <Checkbox darkMode={darkMode} className={rowClassName} label="SMS" helperText={withDescription ? 'Notifikasi melalui SMS.' : undefined} />
      <Checkbox darkMode={darkMode} className={rowClassName} label="WhatsApp" defaultChecked />
      {withSeparator && <hr className={darkMode ? darkHrClassName : hrClassName} />}
      <Checkbox darkMode={darkMode} className={rowClassName} label="Pembaruan produk" />
      <Checkbox darkMode={darkMode} className={rowClassName} label="Aktivitas akun" />
      <Checkbox
        darkMode={darkMode}
        className={withDisabled ? disabledSelectionRowClassName : rowClassName}
        label="Keamanan"
        disabled={withDisabled}
      />
      <Checkbox darkMode={darkMode} className={rowClassName} label="Promosi" />
      <Checkbox darkMode={darkMode} className={rowClassName} label="Laporan mingguan" />
      <Checkbox darkMode={darkMode} className={rowClassName} label="Pengingat" defaultChecked />
      <Checkbox darkMode={darkMode} className={rowClassName} label="Integrasi" />
      <Checkbox darkMode={darkMode} className={rowClassName} label="Sistem" />
    </>
  )
}

interface ContohProps extends VariationOptions {
  example: DropdownExample
  groupName: string
  label?: string
  darkMode?: boolean
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
  darkMode,
}: ContohProps) {
  const opsi = { withSeparator, withDescription, withDisabled }
  const rowClassName = darkMode ? darkSelectionRowClassName : selectionRowClassName

  if (example === 'actions' || example === 'icons') {
    const withIcons = example === 'icons'
    return withSeparator ? (
      <Dropdown darkMode={darkMode} trigger={trigger()} groups={kelompokAksi(opsi, withIcons)} aria-label="Daftar aksi" />
    ) : (
      <Dropdown darkMode={darkMode} trigger={trigger()} items={aksi(opsi, withIcons)} aria-label="Daftar aksi" />
    )
  }

  if (example === 'scroll') {
    return (
      <Dropdown darkMode={darkMode} trigger={trigger()} contentClassName="p-4" aria-label="Pilih notifikasi dengan scroll">
        <div className={`flex max-h-48 flex-col gap-4 overflow-y-auto overscroll-y-contain ${darkMode ? darkScrollClassName : ''}`}>
          <ScrollContentItems {...opsi} darkMode={darkMode} />
        </div>
      </Dropdown>
    )
  }

  if (example === 'radio') {
    return (
      <Dropdown darkMode={darkMode} trigger={trigger()} contentClassName="p-4" aria-label="Pilih akses">
        <div className="flex flex-col gap-4">
          <Radio darkMode={darkMode} className={rowClassName} name={groupName} value="viewer" label="Viewer" />
          <Radio darkMode={darkMode} className={rowClassName} name={groupName} value="editor" label="Editor" helperText={withDescription ? 'Dapat mengubah konten.' : undefined} defaultChecked />
          {withSeparator && <hr className={darkMode ? darkHrClassName : hrClassName} />}
          <Radio
            darkMode={darkMode}
            className={withDisabled ? disabledSelectionRowClassName : rowClassName}
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
    <Dropdown darkMode={darkMode} trigger={trigger()} contentClassName="p-4" aria-label="Pilih notifikasi">
      <div className="flex flex-col gap-4">
        <Checkbox darkMode={darkMode} className={rowClassName} label="Email" helperText={withDescription ? 'Kirim pembaruan melalui email.' : undefined} />
        <Checkbox darkMode={darkMode} className={rowClassName} label="Push notification" helperText={withDescription ? 'Tampilkan pada perangkat.' : undefined} defaultChecked />
        {withSeparator && <hr className={darkMode ? darkHrClassName : hrClassName} />}
        <Checkbox
          darkMode={darkMode}
          className={withDisabled ? disabledSelectionRowClassName : rowClassName}
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

function SelectionDemo({ darkMode = false }: { darkMode?: boolean }) {
  const [selected, setSelected] = useState('Terbaru')
  const options = ['Terbaru', 'Terlama', 'Nama A–Z']

  return (
    <Dropdown
      darkMode={darkMode}
      contentLabel="Urutan hasil"
      trigger={trigger(`Urutkan: ${selected}`)}
      items={options.map((label) => ({
        id: label,
        label,
        selected: label === selected,
        onClick: () => setSelected(label),
      }))}
    />
  )
}

function NavigationDemo() {
  const [message, setMessage] = useState('Pilih salah satu tujuan')

  return (
    <div className="space-y-3 text-center">
      <Dropdown
        trigger={trigger('Buka navigasi')}
        items={[
          { id: 'overview', label: 'Ringkasan', href: '#navigation', current: true },
          {
            id: 'settings',
            label: 'Pengaturan',
            href: '#properties',
            onClick: () => setMessage('Navigasi diterima'),
          },
          {
            id: 'protected',
            label: 'Tujuan dibatalkan',
            href: '#protected',
            onClick: (event) => {
              event.preventDefault()
              setMessage('Navigasi dibatalkan; Dropdown tetap ditutup otomatis')
            },
          },
          {
            id: 'external',
            label: 'Dokumentasi eksternal',
            href: 'https://example.com',
            target: '_blank',
          },
        ]}
      />
      <p className="text-sm text-gray-500" aria-live="polite">{message}</p>
    </div>
  )
}

function ManualCloseDemo() {
  const [message, setMessage] = useState('Belum diterapkan')

  return (
    <div className="space-y-3 text-center">
      <Dropdown trigger={trigger('Atur tampilan')} contentClassName="p-4">
        {({ close }) => (
          <div className="w-56 space-y-3">
            <p className="text-sm text-content">
              Konten interaktif tetap terbuka sampai aksinya selesai.
            </p>
            <button
              type="button"
              className="w-full rounded-md bg-primary-700 px-3 py-2 text-sm font-medium text-white hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              onClick={() => {
                setMessage('Pengaturan diterapkan')
                close()
              }}
            >
              Terapkan
            </button>
          </div>
        )}
      </Dropdown>
      <p className="text-sm text-gray-500" aria-live="polite">{message}</p>
    </div>
  )
}

function ExternalCloseTypeExample() {
  const actionsRef = useRef<DropdownHandle>(null)

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)')
    const closeForMobile = () => {
      if (mobile.matches) actionsRef.current?.close()
    }

    mobile.addEventListener('change', closeForMobile)
    return () => mobile.removeEventListener('change', closeForMobile)
  }, [])

  return (
    <Dropdown
      actionsRef={actionsRef}
      trigger={trigger('Navigasi akun')}
      items={[{ label: 'Profil', href: '/profil' }]}
    />
  )
}

function SelectionPlayground({
  selected,
  onSelectedChange,
  withSeparator,
  withDescription,
  withDisabled,
  darkMode,
}: VariationOptions & {
  selected: string
  onSelectedChange: (value: string) => void
  darkMode: boolean
}) {
  const items: DropdownItem[] = [
    {
      id: 'terbaru',
      label: 'Terbaru',
      description: withDescription ? 'Urutkan dari yang paling baru.' : undefined,
      selected: selected === 'Terbaru',
      onClick: () => onSelectedChange('Terbaru'),
    },
    {
      id: 'terlama',
      label: 'Terlama',
      description: withDescription ? 'Urutkan dari yang paling lama.' : undefined,
      selected: selected === 'Terlama',
      onClick: () => onSelectedChange('Terlama'),
    },
    {
      id: 'nama',
      label: 'Nama A–Z',
      disabled: withDisabled,
      selected: selected === 'Nama A–Z',
      onClick: () => onSelectedChange('Nama A–Z'),
    },
  ]

  return (
    <Dropdown
      darkMode={darkMode}
      contentLabel="Urutan hasil"
      trigger={trigger(`Urutkan: ${selected}`)}
      {...(withSeparator
        ? {
            groups: [
              { id: 'waktu', label: 'Waktu', items: items.slice(0, 2) },
              { id: 'nama', separator: true, items: items.slice(2) },
            ],
          }
        : { items })}
    />
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

function SelectionExampleCode({
  selected,
  withSeparator,
  withDescription,
  withDisabled,
  darkMode,
}: VariationOptions & { selected: string; darkMode: boolean }) {
  const item = (label: string, description?: string, disabled?: boolean) => (
    <>
      {'        {\n          label: '}
      {`'${label}'`}
      {',\n'}
      {description && (
        <>
          {'          '}
          <H>description</H>
          {': '}
          {`'${description}'`}
          {',\n'}
        </>
      )}
      {disabled && <>{'          '}<H>disabled</H>{': true,\n'}</>}
      {'          '}
      <H>selected</H>
      {': selected === '}
      {`'${label}'`}
      {',\n          '}
      <H>onClick</H>
      {': () => setSelected('}
      {`'${label}'`}
      {'),\n        },\n'}
    </>
  )

  const terbaru = item('Terbaru', withDescription ? 'Urutkan dari yang paling baru.' : undefined)
  const terlama = item('Terlama', withDescription ? 'Urutkan dari yang paling lama.' : undefined)
  const nama = item('Nama A–Z', undefined, withDisabled)

  return (
    <>
      {'import { '}
      {'useState'}
      {' } from '}
      {"'react'"}
      {'\nimport { '}
      {'Dropdown'}
      {' } from '}
      {"'@ceplok-ui/design-kit-react'"}
      {'\n\nfunction SortDropdown() {\n  const ['}
      {'selected'}
      {', setSelected] = '}
      {'useState'}
      {'('}
      {`'${selected}'`}
      {')\n\n  return (\n    <'}
      {'Dropdown'}
      {'\n'}
      {darkMode && <>{'      '}<H>darkMode</H>{'\n'}</>}
      {'      '}
      <H>contentLabel</H>
      {'='}
      {'"Urutan hasil"'}
      {'\n      '}
      <H>trigger</H>
      {'={<button type="button">Urutkan: {selected}</button>}\n'}
      {withSeparator ? (
        <>
          {'      '}<H>groups</H>{"={[\n        {\n          id: 'waktu',\n          label: 'Waktu',\n          items: [\n"}
          {terbaru}{terlama}
          {"          ],\n        },\n        {\n          id: 'nama',\n          "}
          <H>separator</H>
          {': true,\n          items: [\n'}
          {nama}
          {'          ],\n        },\n      ]}\n'}
        </>
      ) : (
        <>
          {'      '}<H>items</H>{'={[\n'}
          {terbaru}{terlama}{nama}
          {'      ]}\n'}
        </>
      )}
      {'    />\n  )\n}'}
    </>
  )
}

function ExampleCode({
  mode,
  selected,
  example,
  withSeparator,
  withDescription,
  withDisabled,
  darkMode,
}: VariationOptions & {
  mode: DropdownMode
  selected: string
  example: DropdownExample
  darkMode: boolean
}) {
  if (mode === 'selection') {
    return (
      <SelectionExampleCode
        selected={selected}
        withSeparator={withSeparator}
        withDescription={withDescription}
        withDisabled={withDisabled}
        darkMode={darkMode}
      />
    )
  }

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
      {'import { '}
      {daftarImport.join(', ')}
      {' } from '}
      {"'@ceplok-ui/design-kit-react'"}
      {'\n'}
      {withIcons && (
        <>
          {'import { '}
          {'ArrowRightToBracket, Cog, QuestionCircle, User'}
          {' } from '}
          {"'@ceplok-ui/design-kit-react/icons/outline'"}
          {'\n'}
        </>
      )}
      {triggerCode}

      {daftarAksi ? (
        withSeparator ? (
          <>
            {'\n<Dropdown\n'}
            {darkMode && <>{'  '}<H>darkMode</H>{'\n'}</>}
            {'  trigger={trigger}\n  '}
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
            {'\n<Dropdown\n'}
            {darkMode && <>{'  '}<H>darkMode</H>{'\n'}</>}
            {'  trigger={trigger}\n  items={[\n    '}
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
          {'\nconst darkMode = '}{darkMode ? 'true' : 'false'}{'\n\n<Dropdown '}
          <H>darkMode</H>{'={darkMode} '}
          {'trigger={trigger} '}
          <H>contentClassName</H>
          {'="p-4">\n'}
          {example === 'scroll' ? (
            <>
              {'  <div '}
              <H>className</H>
              {`="flex max-h-48 flex-col gap-4 overflow-y-auto overscroll-y-contain${darkMode ? ` ${darkScrollClassName}` : ''}">\n`}
              {'    <Checkbox '}<H>darkMode</H>{'={darkMode} label="Email" '}
              {withDescription && <><H>helperText</H>{'="Notifikasi melalui email." '}</>}
              {'defaultChecked />\n    <Checkbox darkMode={darkMode} label="Push notification" />\n    {/* … */}\n'}
              {withSeparator && (
                <>
                  {'    <hr '}
                  <H>className</H>
                  {`="${darkMode ? darkHrClassName : hrClassName}" />\n`}
                </>
              )}
              {'    <Checkbox darkMode={darkMode} label="Pembaruan produk" />\n    {/* … */}\n    <Checkbox darkMode={darkMode} label="Keamanan" '}
              {withDisabled && <><H>disabled</H>{' '}</>}
              {'/>\n    {/* … */}\n    <Checkbox darkMode={darkMode} label="Sistem" />\n  </div>\n</Dropdown>'}
            </>
          ) : example === 'radio' ? (
            <>
              {'  <div className="flex flex-col gap-4">\n    <'}
              <H>Radio</H>
              {' '}<H>darkMode</H>{'={darkMode} name="access" value="viewer" label="Viewer" />\n    <'}
              <H>Radio</H>
              {' '}<H>darkMode</H>{'={darkMode} name="access" value="editor" label="Editor" '}
              {withDescription && <><H>helperText</H>{'="Dapat mengubah konten." '}</>}
              {'defaultChecked />\n'}
              {withSeparator && (
                <>
                  {'    <hr '}
                  <H>className</H>
                  {`="${darkMode ? darkHrClassName : hrClassName}" />\n`}
                </>
              )}
              {'    <'}
              <H>Radio</H>
              {' '}<H>darkMode</H>{'={darkMode} name="access" value="admin" label="Admin" '}
              {withDisabled && <><H>disabled</H>{' '}</>}
              {'/>\n  </div>\n</Dropdown>'}
            </>
          ) : (
            <>
              {'  <div className="flex flex-col gap-4">\n    <'}
              <H>Checkbox</H>
              {' '}<H>darkMode</H>{'={darkMode} label="Email" '}
              {withDescription && <><H>helperText</H>{'="Kirim pembaruan melalui email." '}</>}
              {'/>\n    <'}
              <H>Checkbox</H>
              {' '}<H>darkMode</H>{'={darkMode} label="Push notification" defaultChecked />\n'}
              {withSeparator && (
                <>
                  {'    <hr '}
                  <H>className</H>
                  {`="${darkMode ? darkHrClassName : hrClassName}" />\n`}
                </>
              )}
              {'    <'}
              <H>Checkbox</H>
              {' '}<H>darkMode</H>{'={darkMode} label="SMS" '}
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
  const [mode, setMode] = useState<DropdownMode>('action')
  const [example, setExample] = useState<DropdownExample>('actions')
  const [withSeparator, setWithSeparator] = useState(false)
  const [withDescription, setWithDescription] = useState(false)
  const [withDisabled, setWithDisabled] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [selected, setSelected] = useState('Terbaru')
  const separatorDataDriven =
    mode === 'selection' || example === 'actions' || example === 'icons'
  const activeDarkMode = darkMode

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
          <Hl>trigger</Hl> menerima satu tombol milik Anda; <Hl>items</Hl> menerima daftar aksinya. Panel
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
          Aksi yang perlu dipisah disusun lewat <Hl>groups</Hl>. Prop <Hl>separator</Hl> menambahkan
          garis sebelum sebuah kelompok — artinya sama persis dengan <Hl>SidebarGroup</Hl>, jadi tidak
          ada yang perlu dihafal ulang. Untuk panel berisi kontrol bebas, pakai <Hl>&lt;hr&gt;</Hl>
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
          Aksi yang perlu konteks tambahan diberi <Hl>description</Hl> — baris kedua yang lebih kecil
          di bawah labelnya. Untuk panel berisi Radio atau Checkbox, yang dipakai <Hl>helperText</Hl>{' '}
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
          Tambahkan <Hl>disabled</Hl> pada item yang belum dapat dipilih. Pengaturan ini berlaku per
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

      <FlowSection id="navigation" title="Navigation">
        <Lead>
          Item dengan <Hl>href</Hl> menjadi anchor native. Gunakan <Hl>target</Hl> dan <Hl>rel</Hl>{' '}
          untuk tujuan eksternal, serta <Hl>current</Hl> untuk tujuan yang sedang aktif. Berbeda dari{' '}
          <Hl>selected</Hl>, current tidak mengubah koleksi menjadi listbox dan menghasilkan{' '}
          <Hl>aria-current</Hl> pada item tersebut.
        </Lead>
        <Stage maxWidth="max-w-xl">
          <div className="flex min-h-64 items-start justify-center pt-10">
            <NavigationDemo />
          </div>
        </Stage>
        <SectionCode>
          {'<Dropdown\n  trigger={trigger}\n  items={[\n    {\n      label: \'Ringkasan\',\n      href: \'/ringkasan\',\n      '}<H>current</H>{': true,\n    },\n    {\n      label: \'Dokumentasi\',\n      href: \'https://example.com\',\n      '}<H>target</H>{': \'_blank\',\n    },\n    {\n      label: \'Tujuan terlindungi\',\n      href: \'/terlindungi\',\n      '}<H>onClick</H>{': (event) => {\n        if (!canNavigate) event.preventDefault()\n      },\n    },\n  ]}\n/>'}
        </SectionCode>
        <div className="mt-6 max-w-3xl space-y-3 text-body-sm text-gray-500">
          <p>
            Nilai bawaan <Hl>closeOnSelect=true</Hl> menutup panel setelah item generated yang
            enabled diaktifkan. Nilai <Hl>false</Hl> membiarkan panel tetap terbuka.
          </p>
          <p>
            Kebijakan dismissal tidak menafsirkan <Hl>preventDefault()</Hl> sebagai keberhasilan atau
            kegagalan navigasi. Untuk penutupan bersyarat, gunakan <Hl>closeOnSelect=false</Hl> lalu
            minta penutupan secara eksplisit melalui <Hl>actionsRef.close()</Hl> ketika consumer
            memang menerimanya.
          </p>
        </div>
      </FlowSection>

      <FlowSection id="selection" title="Selection">
        <Lead>
          Gunakan Selection ketika Dropdown dipakai untuk memilih nilai. Saat item menggunakan{' '}
          <Hl>selected</Hl>, koleksinya memakai pola <Hl>listbox</Hl>, setiap baris menjadi{' '}
          <Hl>option</Hl>, dan pilihan aktif menerima fokus saat dibuka. Option dapat ditelusuri
          dengan tombol panah, Home, End, dan pencarian lewat ketikan. Typeahead menunggu rangkaian
          ketikan hingga 1 detik, mendukung beberapa kata, dan mengabaikan perbedaan diakritik.
          Perilaku pencarian yang sama juga tersedia pada menu Action. Gunakan{' '}
          <Hl>contentLabel</Hl> untuk menamai listbox tersebut. Action dan Selection tidak dapat
          dicampur dalam satu koleksi generated: koleksi yang memakai <Hl>selected</Hl> seluruhnya
          diperlakukan sebagai Selection, sedangkan <Hl>href</Hl> hanya untuk item Action.
        </Lead>
        <Stage maxWidth="max-w-xl">
          <div className="flex min-h-56 items-start justify-center pt-10">
            <SelectionDemo />
          </div>
        </Stage>
        <SectionCode>
          {"const [selected, setSelected] = useState('Terbaru')\n\n<Dropdown"}
          {'\n  '}<H>contentLabel</H>{'="Urutan hasil"'}
          {'\n  '}<H>trigger</H>{'={<button type="button">Urutkan: {selected}</button>}\n  '}
          <H>items</H>
          {"={['Terbaru', 'Terlama', 'Nama A–Z'].map((label) => ({\n    label,\n    "}
          <H>selected</H>{': label === selected,\n    '}<H>onClick</H>
          {': () => setSelected(label),\n  }))}\n/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="dark-mode" title="Dark mode">
        <Lead>
          Dropdown mewarisi <Hl>data-theme</Hl> dari consumer boundary; gunakan boundary eksplisit
          untuk satu area bila diperlukan. Prop <Hl>darkMode</Hl> tetap tersedia sebagai override
          kompatibilitas dan selalu memaksa dark, termasuk terhadap data-theme="light". Untuk konten
          kustom, tema komponen di dalam <Hl>children</Hl> tetap dikelola consumer.
        </Lead>
        <div className="grid gap-6 md:grid-cols-2">
          <Demo label="Action" dark>
            <div className="flex min-h-72 items-start justify-center pt-3">
              <ContohDropdown
                darkMode
                example="actions"
                groupName="dark-actions"
                withSeparator
                withDescription={false}
                withDisabled={false}
              />
            </div>
          </Demo>
          <Demo label="Action dengan ikon" dark>
            <div className="flex min-h-72 items-start justify-center pt-3">
              <ContohDropdown
                darkMode
                example="icons"
                groupName="dark-icons"
                withSeparator
                withDescription={false}
                withDisabled={false}
              />
            </div>
          </Demo>
          <Demo label="Selection" dark>
            <div className="flex min-h-56 items-start justify-center pt-3">
              <SelectionDemo darkMode />
            </div>
          </Demo>
        </div>
        <SectionCode>
          {"import { Dropdown } from '@ceplok-ui/design-kit-react'\n"}
          {"import { ArrowRightToBracket, User } from '@ceplok-ui/design-kit-react/icons/outline'\n\n"}
          {'<div '}<H>data-theme</H>{'="dark">\n  <Dropdown\n    '}<H>trigger</H>{'={trigger}\n    '}<H>items</H>{"={[\n      { label: 'Profil', icon: <User /> },\n      { label: 'Keluar', icon: <ArrowRightToBracket />, tone: 'danger' },\n    ]}\n  />\n</div>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Mode Action memakai button atau link native untuk menjalankan aksi dan navigasi. Mode
          Selection memakai <Hl>selected</Hl> untuk membentuk listbox berisi option yang dapat
          dinavigasi lewat keyboard. Pratinjaunya dibuka sejak halaman dimuat supaya tiap variasi
          mudah dibandingkan.
        </Lead>

        <Stage maxWidth="max-w-xl" dark={activeDarkMode}>
          <div ref={panggung} className="flex min-h-80 items-start justify-center pt-10">
            {mode === 'action' ? (
              <ContohDropdown
                example={example}
                groupName="playground-dropdown"
                withSeparator={withSeparator}
                withDescription={withDescription}
                withDisabled={withDisabled}
                darkMode={activeDarkMode}
              />
            ) : (
              <SelectionPlayground
                selected={selected}
                onSelectedChange={setSelected}
                withSeparator={withSeparator}
                withDescription={withDescription}
                withDisabled={withDisabled}
                darkMode={activeDarkMode}
              />
            )}
          </div>
        </Stage>

        <Controls>
          <Control label="Tampilan">
            <div onPointerDownCapture={ingatKeadaan}>
              <Segmented
                label="Pilih tampilan"
                value={darkMode}
                onChange={(value) => ubah(() => setDarkMode(value))}
                options={[
                  { value: false, label: 'Light' },
                  { value: true, label: 'Dark' },
                ]}
              />
            </div>
          </Control>
          <Control label="Mode">
            <div onPointerDownCapture={ingatKeadaan}>
              <Segmented
                label="Pilih mode Dropdown"
                value={mode}
                onChange={(value) => ubah(() => setMode(value))}
                options={modes}
              />
            </div>
          </Control>
          <Control label="Kelompok">
            <div onPointerDownCapture={ingatKeadaan}>
              <Segmented
                label="Tampilkan kelompok"
                value={withSeparator}
                onChange={(value) => ubah(() => setWithSeparator(value))}
                options={booleanOptions}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {separatorDataDriven
                ? 'Kelompok dibuat melalui groups dengan separator: true.'
                : 'Kelompok dibuat dengan garis pemisah (border) di antara custom children.'}
            </p>
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
                disabled={mode === 'selection'}
                wrap
              />
            </div>
            {mode === 'selection' && (
              <p className="mt-2 text-xs text-gray-500">
                Tidak tersedia pada mode Selection. Item dirender sebagai option dalam listbox.
              </p>
            )}
          </Control>
        </Controls>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Action cukup diisi lewat <Hl>items</Hl> atau <Hl>groups</Hl>. Selection memakai struktur yang
          sama dengan menambahkan <Hl>selected</Hl> dan pembaruan state pada setiap option. Panel
          yang berisi kontrol bebas diisi lewat <Hl>children</Hl> dan diberi jarak sendiri lewat{' '}
          <Hl>contentClassName</Hl>. Kode berikut mengikuti Mode dan kontrol Playground.
        </Lead>
        <p className="mt-2 max-w-2xl text-body-sm text-gray-500">
          Prop <Hl>trigger</Hl> harus menghasilkan satu <Hl>&lt;button&gt;</Hl> sebagai root DOM langsung.
          Native button, <Hl>&lt;Button&gt;</Hl> dalam mode button, dan komponen tombol kustom didukung
          selama seluruh atribut button native diteruskan. Trigger icon-only wajib memiliki nama
          aksesibel, misalnya lewat <Hl>aria-label</Hl>. Anchor, div/span, Fragment, button yang
          dibungkus elemen lain, dan komponen yang menelan atribut trigger tidak didukung.
        </p>
        <p className="mt-2 max-w-2xl text-body-sm text-gray-500">
          Panel memiliki lebar minimum mengikuti trigger dan dapat melebar sesuai konten atau class
          tambahan consumer melalui <Hl>contentClassName</Hl>, tetap dibatasi agar aman di viewport.
        </p>
        <SectionCode flush>
          <ExampleCode
            mode={mode}
            selected={selected}
            example={example}
            withSeparator={withSeparator}
            withDescription={withDescription}
            withDisabled={withDisabled}
            darkMode={activeDarkMode}
          />
        </SectionCode>
        <div className="mt-8">
          <h3 className="text-heading-4 font-bold text-gray-900">Menutup konten kustom</h3>
          <p className="mt-2 max-w-2xl text-body-sm text-gray-500">
            Item generated menutup panel otomatis setelah dijalankan. Kontrol kustom tetap terbuka
            agar form, Radio, atau Checkbox dapat digunakan berulang kali. Ketika aksi final perlu
            menutup panel, gunakan <Hl>close</Hl> dari render function. Fokus dikembalikan ke trigger
            bila penutupan terjadi saat fokus masih berada di panel; Escape dan klik di luar tetap
            ditangani Popover native.
          </p>
          <Stage maxWidth="max-w-xl">
            <div className="flex min-h-56 items-start justify-center pt-10">
              <ManualCloseDemo />
            </div>
          </Stage>
          <SectionCode>
            {'<Dropdown trigger={trigger}>\n  {({ '}<H>close</H>{' }) => (\n    <button\n      type="button"\n      onClick={() => {\n        applyChanges()\n        '}<H>close</H>{'()\n      }}\n    >\n      Terapkan\n    </button>\n  )}\n</Dropdown>'}
          </SectionCode>
        </div>
        <div className="mt-8">
          <h3 className="text-heading-4 font-bold text-gray-900">Menutup dari kondisi eksternal</h3>
          <p className="mt-2 max-w-2xl text-body-sm text-gray-500">
            Gunakan <Hl>actionsRef</Hl> ketika kondisi di luar Dropdown perlu menutup panel, misalnya
            trigger desktop disembunyikan setelah viewport berpindah ke mobile. Native Popover tetap
            menjadi sumber keadaan; <Hl>close()</Hl> hanya meminta dismissal dan aman dipanggil saat
            panel sudah tertutup.
          </p>
          <Stage maxWidth="max-w-xl">
            <div className="flex min-h-56 items-start justify-center pt-10">
              <ExternalCloseTypeExample />
            </div>
          </Stage>
          <SectionCode>
            {"const actionsRef = useRef<DropdownHandle>(null)\n\nuseEffect(() => {\n  const mobile = window.matchMedia('(max-width: 767px)')\n  const closeForMobile = () => {\n    if (mobile.matches) actionsRef.current?.close()\n  }\n\n  mobile.addEventListener('change', closeForMobile)\n  return () => mobile.removeEventListener('change', closeForMobile)\n}, [])\n\n<Dropdown\n  "}<H>actionsRef</H>{'={actionsRef}\n  trigger={trigger}\n  items={navigationItems}\n/>'}
          </SectionCode>
          <p className="mt-3 max-w-2xl text-body-sm text-gray-500">
            Forwarded <Hl>ref</Hl> lama tetap menunjuk wrapper <Hl>div</Hl>. Handle lifecycle tersedia
            terpisah agar integrasi yang sudah memakai DOM ref tidak berubah.
          </p>
        </div>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Seluruh prop yang diterima komponen, beserta tipe dan nilai bawaannya, diikuti bentuk data
          untuk <Hl>items</Hl> dan <Hl>groups</Hl>.
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
