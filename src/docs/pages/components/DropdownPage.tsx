import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type Ref } from 'react'
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

type DropdownExample = 'actions' | 'icons' | 'radio' | 'checkbox' | 'scroll'

const examples: { value: DropdownExample; label: string }[] = [
  { value: 'actions', label: 'Tanpa ikon' },
  { value: 'icons', label: 'Dengan ikon' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'scroll', label: 'Dengan scroll' },
]

const variationMinHeights: Record<DropdownExample, string> = {
  actions: 'min-h-72',
  icons: 'min-h-72',
  radio: 'min-h-56',
  checkbox: 'min-h-56',
  scroll: 'min-h-72',
}

const triggerClassName =
  'inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary-700 px-4 text-base font-medium text-white transition-colors duration-200 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:pointer-events-none disabled:opacity-50'

const selectionRowClassName = 'w-full rounded-md px-2 hover:bg-gray-100'
const disabledSelectionRowClassName = 'w-full rounded-md px-2'

const toc: TocEntry[] = [
  { id: 'dropdown', label: 'Dropdown' },
  { id: 'separator', label: 'Separator' },
  { id: 'keterangan', label: 'Keterangan' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

const dropdownProps: PropRow[] = [
  ['children', 'ReactNode', 'required', 'Susunan trigger dan content Dropdown.'],
  ['className', 'string', 'undefined', 'Class tambahan pada pembungkus terluar.'],
]

const triggerProps: PropRow[] = [
  ['children', 'ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>', 'required', 'Satu button milik consumer yang menerima wiring popover.'],
]

const contentProps: PropRow[] = [
  ['children', 'ReactNode', 'undefined', 'Aksi atau kontrol yang ditampilkan.'],
  ['className', 'string', 'undefined', 'Class tambahan untuk menyusun isi Dropdown.'],
  [
    '…props',
    'HTMLAttributes<HTMLDivElement>',
    '—',
    'Atribut <div> native yang relevan diteruskan.',
  ],
]

const itemProps: PropRow[] = [
  ['children', 'ReactNode', 'undefined', 'Label dan ikon opsional untuk aksi.'],
  ['tone', "'default' | 'danger'", "'default'", 'Warna semantik aksi.'],
  ['className', 'string', 'undefined', 'Class tambahan nonstruktural pada item.'],
  [
    '…props',
    'ButtonHTMLAttributes<HTMLButtonElement>',
    '—',
    'Atribut <button> native yang relevan diteruskan.',
  ],
]

const separatorProps: PropRow[] = [
  ['className', 'string', 'undefined', 'Class tambahan nonstruktural pada separator.'],
  ['…props', 'HTMLAttributes<HTMLHRElement>', '—', 'Atribut <hr> native yang relevan diteruskan.'],
]

function Trigger({ label = 'Dropdown button' }: { label?: string }) {
  return (
    <Dropdown.Trigger>
      <button type="button" className={triggerClassName}>
        {label}
        <Icon className="!size-3.5">
          <ChevronDown />
        </Icon>
      </button>
    </Dropdown.Trigger>
  )
}
function ActionLabel({ children, description }: { children: string; description?: string }) {
  if (!description) return children

  return (
    <span className="flex flex-col items-start">
      <span>{children}</span>
      <span className="text-xs font-normal text-gray-500">{description}</span>
    </span>
  )
}
function ScrollContentItems({ withSeparator, withDescription }: VariationOptions) {
  return (
    <>
      <Checkbox className={selectionRowClassName} label="Email" helperText={withDescription ? 'Notifikasi melalui email.' : undefined} defaultChecked />
      <Checkbox className={selectionRowClassName} label="Push notification" helperText={withDescription ? 'Notifikasi pada perangkat.' : undefined} />
      <Checkbox className={selectionRowClassName} label="SMS" helperText={withDescription ? 'Notifikasi melalui SMS.' : undefined} />
      <Checkbox className={selectionRowClassName} label="WhatsApp" defaultChecked />
      <Checkbox className={selectionRowClassName} label="Pembaruan produk" />
      <Checkbox className={selectionRowClassName} label="Aktivitas akun" />
      {withSeparator && <Dropdown.Separator />}
      <Checkbox className={disabledSelectionRowClassName} label="Keamanan" disabled />
      <Checkbox className={selectionRowClassName} label="Promosi" />
      <Checkbox className={selectionRowClassName} label="Laporan mingguan" />
      <Checkbox className={selectionRowClassName} label="Pengingat" defaultChecked />
      <Checkbox className={selectionRowClassName} label="Integrasi" />
      <Checkbox className={selectionRowClassName} label="Sistem" />
    </>
  )
}

interface VariationOptions {
  withSeparator: boolean
  withDescription: boolean
}

interface ExampleContentProps extends VariationOptions {
  example: DropdownExample
  groupName: string
  contentRef?: Ref<HTMLDivElement>
}

function ExampleContent({ example, groupName, withSeparator, withDescription, contentRef }: ExampleContentProps) {
  if (example === 'scroll') {
    return (
      <Dropdown.Content ref={contentRef} className="p-4" aria-label="Pilih notifikasi dengan scroll">
        <div className="flex max-h-48 flex-col gap-4 overflow-y-auto overscroll-y-contain">
          <ScrollContentItems withSeparator={withSeparator} withDescription={withDescription} />
        </div>
      </Dropdown.Content>
    )
  }

  if (example === 'icons') {
    return (
      <Dropdown.Content ref={contentRef} className="py-1" aria-label="Daftar aksi">
        <Dropdown.Item>
          <Icon className="!size-3.5 text-gray-500"><User /></Icon>
          <ActionLabel description={withDescription ? 'Lihat dan ubah profil.' : undefined}>Profil</ActionLabel>
        </Dropdown.Item>
        <Dropdown.Item>
          <Icon className="!size-3.5 text-gray-500"><Cog /></Icon>
          <ActionLabel description={withDescription ? 'Atur preferensi akun.' : undefined}>Pengaturan</ActionLabel>
        </Dropdown.Item>
        <Dropdown.Item>
          <Icon className="!size-3.5 text-gray-500"><QuestionCircle /></Icon>
          Bantuan
        </Dropdown.Item>
        {withSeparator && <Dropdown.Separator />}
        <Dropdown.Item tone="danger">
          <Icon className="!size-3.5"><ArrowRightToBracket /></Icon>
          Keluar
        </Dropdown.Item>
      </Dropdown.Content>
    )
  }

  if (example === 'radio') {
    return (
      <Dropdown.Content ref={contentRef} className="p-4" aria-label="Pilih akses">
        <div className="flex flex-col gap-4">
          <Radio className={selectionRowClassName} name={groupName} value="viewer" label="Viewer" />
          <Radio className={selectionRowClassName} name={groupName} value="editor" label="Editor" helperText={withDescription ? 'Dapat mengubah konten.' : undefined} defaultChecked />
          {withSeparator && <Dropdown.Separator />}
          <Radio className={disabledSelectionRowClassName} name={groupName} value="admin" label="Admin" disabled />
        </div>
      </Dropdown.Content>
    )
  }

  if (example === 'checkbox') {
    return (
      <Dropdown.Content ref={contentRef} className="p-4" aria-label="Pilih notifikasi">
        <div className="flex flex-col gap-4">
          <Checkbox className={selectionRowClassName} label="Email" helperText={withDescription ? 'Kirim pembaruan melalui email.' : undefined} />
          <Checkbox className={selectionRowClassName} label="Push notification" helperText={withDescription ? 'Tampilkan pada perangkat.' : undefined} defaultChecked />
          {withSeparator && <Dropdown.Separator />}
          <Checkbox className={disabledSelectionRowClassName} label="SMS" disabled />
        </div>
      </Dropdown.Content>
    )
  }

  return (
    <Dropdown.Content ref={contentRef} className="py-1" aria-label="Daftar aksi">
      <Dropdown.Item><ActionLabel description={withDescription ? 'Lihat dan ubah profil.' : undefined}>Profil</ActionLabel></Dropdown.Item>
      <Dropdown.Item><ActionLabel description={withDescription ? 'Atur preferensi akun.' : undefined}>Pengaturan</ActionLabel></Dropdown.Item>
      <Dropdown.Item>Bantuan</Dropdown.Item>
      {withSeparator && <Dropdown.Separator />}
      <Dropdown.Item tone="danger">Keluar</Dropdown.Item>
    </Dropdown.Content>
  )
}

function DescriptionCode({
  label,
  description,
  multiline = false,
}: {
  label: string
  description: string
  multiline?: boolean
}) {
  return (
    <>
      {multiline
        ? `\n      <span className="flex flex-col items-start">\n        <span>${label}</span>\n        <span `
        : `<span className="flex flex-col items-start"><span>${label}</span><span `}
      <H>className</H>
      {'="text-xs font-normal text-gray-500">'}
      {description}
      {multiline ? '</span>\n      </span>\n    ' : '</span></span>'}
    </>
  )
}

function ExampleCode({
  example,
  withSeparator,
  withDescription,
}: VariationOptions & { example: DropdownExample }) {
  const componentImports = new Set(['Dropdown'])
  if (example === 'checkbox' || example === 'scroll') componentImports.add('Checkbox')
  if (example === 'radio') componentImports.add('Radio')
  if (example === 'icons') componentImports.add('Icon')
  const sortedComponentImports = [...componentImports].sort((a, b) => a.localeCompare(b))

  return (
    <>
      {`import { ${sortedComponentImports.join(', ')} } from '@ceplok-ui/design-kit-react'\n`}
      {example === 'icons' &&
        "import { ArrowRightToBracket, Cog, QuestionCircle, User } from '@ceplok-ui/design-kit-react/icons/outline'\n"}
      {'\n<Dropdown>\n  <Dropdown.Trigger>\n    <button\n      type="button"\n      className="\n        inline-flex h-10 items-center justify-center gap-2 rounded-lg\n        bg-primary-700 px-4 text-base font-medium text-white transition-colors\n        duration-200 hover:bg-primary-800 focus:outline-none focus:ring-2\n        focus:ring-primary-400 disabled:pointer-events-none disabled:opacity-50\n      "\n    >\n      Dropdown button\n    </button>\n  </Dropdown.Trigger>\n'}
      {example === 'actions' ? (
        <>
          {'  <Dropdown.Content className="py-1">\n    <Dropdown.Item>'}
          {withDescription ? <DescriptionCode label="Profil" description="Lihat dan ubah profil." multiline /> : 'Profil'}
          {'</Dropdown.Item>\n    <Dropdown.Item>'}
          {withDescription ? <DescriptionCode label="Pengaturan" description="Atur preferensi akun." multiline /> : 'Pengaturan'}
          {'</Dropdown.Item>\n    <Dropdown.Item>Bantuan</Dropdown.Item>\n'}
          {withSeparator && <>{'    <'}<H>Dropdown.Separator</H>{' />\n'}</>}
          {'    <Dropdown.Item tone="danger">Keluar</Dropdown.Item>\n  </Dropdown.Content>'}
        </>
      ) : example === 'icons' ? (
        <>
          {'  <Dropdown.Content className="py-1">\n    <Dropdown.Item>\n      <'}
          <H>Icon</H>
          {' className="!size-3.5 text-gray-500"><User /></'}
          <H>Icon</H>
          {'>\n      '}
          {withDescription ? <DescriptionCode label="Profil" description="Lihat dan ubah profil." /> : 'Profil'}
          {'\n    </Dropdown.Item>\n    <Dropdown.Item>\n      <'}
          <H>Icon</H>
          {' className="!size-3.5 text-gray-500"><Cog /></'}
          <H>Icon</H>
          {'>\n      '}
          {withDescription ? <DescriptionCode label="Pengaturan" description="Atur preferensi akun." /> : 'Pengaturan'}
          {'\n    </Dropdown.Item>\n    <Dropdown.Item><'}
          <H>Icon</H>
          {' className="!size-3.5 text-gray-500"><QuestionCircle /></'}
          <H>Icon</H>
          {'>Bantuan</Dropdown.Item>\n'}
          {withSeparator && <>{'    <'}<H>Dropdown.Separator</H>{' />\n'}</>}
          {'    <Dropdown.Item tone="danger"><'}
          <H>Icon</H>
          {' className="!size-3.5"><ArrowRightToBracket /></'}
          <H>Icon</H>
          {'>Keluar</Dropdown.Item>\n  </Dropdown.Content>'}
        </>
      ) : example === 'scroll' ? (
        <>
          {'  <Dropdown.Content className="p-4">\n    <div '}
          <H>className</H>
          {'="flex max-h-48 flex-col gap-4 overflow-y-auto overscroll-y-contain">\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="Email" '}
          {withDescription && <><H>helperText</H>{'="Notifikasi melalui email." '}</>}
          {'defaultChecked />\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="Push notification" '}
          {withDescription && <><H>helperText</H>{'="Notifikasi pada perangkat." '}</>}
          {'/>\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="SMS" '}
          {withDescription && <><H>helperText</H>{'="Notifikasi melalui SMS." '}</>}
          {'/>\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="WhatsApp" defaultChecked />\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="Pembaruan produk" />\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="Aktivitas akun" />\n'}
          {withSeparator && <>{'      <'}<H>Dropdown.Separator</H>{' />\n'}</>}
          {'      <Checkbox className="w-full rounded-md px-2" label="Keamanan" disabled />\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="Promosi" />\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="Laporan mingguan" />\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="Pengingat" defaultChecked />\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="Integrasi" />\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="Sistem" />\n    </div>\n  </Dropdown.Content>'}
        </>
      ) : example === 'radio' ? (
        <>
          {'  <Dropdown.Content className="p-4">\n    <div className="flex flex-col gap-4">\n      <'}
          <H>Radio</H>
          {' className="w-full rounded-md px-2 hover:bg-gray-100" name="access" value="viewer" label="Viewer" />\n      <'}
          <H>Radio</H>
          {' className="w-full rounded-md px-2 hover:bg-gray-100" name="access" value="editor" label="Editor" '}
          {withDescription && <><H>helperText</H>{'="Dapat mengubah konten." '}</>}
          {'defaultChecked />\n'}
          {withSeparator && <>{'      <'}<H>Dropdown.Separator</H>{' />\n'}</>}
          {'      <'}
          <H>Radio</H>
          {' className="w-full rounded-md px-2" name="access" value="admin" label="Admin" disabled />\n    </div>\n  </Dropdown.Content>'}
        </>
      ) : (
        <>
          {'  <Dropdown.Content className="p-4">\n    <div className="flex flex-col gap-4">\n      <'}
          <H>Checkbox</H>
          {' className="w-full rounded-md px-2 hover:bg-gray-100" label="Email" '}
          {withDescription && <><H>helperText</H>{'="Kirim pembaruan melalui email." '}</>}
          {'/>\n      <'}
          <H>Checkbox</H>
          {' className="w-full rounded-md px-2 hover:bg-gray-100" label="Push notification" '}
          {withDescription && <><H>helperText</H>{'="Tampilkan pada perangkat." '}</>}
          {'defaultChecked />\n'}
          {withSeparator && <>{'      <'}<H>Dropdown.Separator</H>{' />\n'}</>}
          {'      <'}
          <H>Checkbox</H>
          {' className="w-full rounded-md px-2" label="SMS" disabled />\n    </div>\n  </Dropdown.Content>'}
        </>
      )}
      {'\n</Dropdown>'}
    </>
  )
}

function CompositionDemo({
  example,
  label,
  groupName,
  withSeparator,
  withDescription,
}: ExampleContentProps & { label: string }) {
  return (
    <Demo label={label}>
      <div className={`flex ${variationMinHeights[example]} items-start justify-center pt-3`}>
        <Dropdown>
          <Trigger />
          <ExampleContent
            example={example}
            groupName={groupName}
            withSeparator={withSeparator}
            withDescription={withDescription}
          />
        </Dropdown>
      </div>
    </Demo>
  )
}

export function DropdownPage() {
  const [example, setExample] = useState<DropdownExample>('actions')
  const [withSeparator, setWithSeparator] = useState(false)
  const [withDescription, setWithDescription] = useState(false)
  const playgroundTriggerRef = useRef<HTMLButtonElement>(null)
  const playgroundContentRef = useRef<HTMLDivElement>(null)
  const playgroundOpenRef = useRef(false)
  const restoreAfterExampleChangeRef = useRef(false)
  const didInitiallyOpenRef = useRef(false)
  const reopenFrameRef = useRef(0)

  useEffect(() => {
    const trigger = playgroundTriggerRef.current
    const content = playgroundContentRef.current
    if (!trigger || !content) return

    const handleToggle = (event: Event) => {
      playgroundOpenRef.current = (event as ToggleEvent).newState === 'open'
    }

    content.addEventListener('toggle', handleToggle)

    if (!didInitiallyOpenRef.current) {
      didInitiallyOpenRef.current = true
      if (!content.matches(':popover-open')) content.showPopover({ source: trigger })
    }
    playgroundOpenRef.current = content.matches(':popover-open')

    return () => {
      content.removeEventListener('toggle', handleToggle)
      if (reopenFrameRef.current) window.cancelAnimationFrame(reopenFrameRef.current)
      reopenFrameRef.current = 0
    }
  }, [])

  const rememberPlaygroundVisibility = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    const isOpen = playgroundContentRef.current?.matches(':popover-open') ?? false
    playgroundOpenRef.current = isOpen
    restoreAfterExampleChangeRef.current = playgroundOpenRef.current
  }

  const updatePlayground = (update: () => void) => {
    const shouldRestore = restoreAfterExampleChangeRef.current
    restoreAfterExampleChangeRef.current = false
    update()

    if (!shouldRestore) return
    if (reopenFrameRef.current) window.cancelAnimationFrame(reopenFrameRef.current)

    reopenFrameRef.current = window.requestAnimationFrame(() => {
      reopenFrameRef.current = 0
      const currentContent = playgroundContentRef.current
      const currentTrigger = playgroundTriggerRef.current
      if (currentContent?.isConnected && currentTrigger && !currentContent.matches(':popover-open')) {
        currentContent.showPopover({ source: currentTrigger })
      }
    })
  }

  const changeExample = (nextExample: DropdownExample) => {
    updatePlayground(() => setExample(nextExample))
  }

  return (
    <UsulanPage
      eyebrow="Components · Dropdown"
      title="Dropdown"
      description="Menampilkan kumpulan aksi atau kontrol tambahan dari sebuah trigger."
      toc={toc}
    >
      <FlowSection id="dropdown" title="Dropdown">
        <Lead>
          Dropdown menampilkan panel dari sebuah trigger. Panel dapat ditutup melalui trigger, klik di luar,
          atau Escape; membuka Dropdown lain yang terpisah menutup panel sebelumnya. Dropdown.Item menutup
          panel setelah aktivasi, kecuali handler memanggil <H>event.preventDefault()</H>. Radio dan Checkbox
          tetap terbuka saat pilihan berubah, dan panel mengikuti trigger ketika halaman digulir atau viewport
          berubah.
        </Lead>
      </FlowSection>

      <FlowSection id="separator" title="Separator">
        <Lead>
          Gunakan separator untuk memisahkan kelompok aksi di dalam panel Dropdown.
        </Lead>
        <div className="grid gap-6 sm:grid-cols-2">
          <CompositionDemo example="actions" label="Tanpa separator" groupName="separator-none" withSeparator={false} withDescription={false} />
          <CompositionDemo example="actions" label="Dengan separator" groupName="separator-with" withSeparator withDescription={false} />
        </div>
        <SectionCode>
          {'<Dropdown.Content className="py-1">\n  <Dropdown.Item>Profil</Dropdown.Item>\n  <Dropdown.Item>Pengaturan</Dropdown.Item>\n\n  <'}
          <H>Dropdown.Separator</H>
          {' />\n\n  <Dropdown.Item tone="danger">Keluar</Dropdown.Item>\n</Dropdown.Content>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="keterangan" title="Keterangan">
        <Lead>
          Tambahkan keterangan pada kontrol di dalam Dropdown ketika pengguna memerlukan konteks tambahan.
        </Lead>
        <div className="grid gap-6 sm:grid-cols-2">
          <CompositionDemo example="radio" label="Tanpa keterangan" groupName="description-none" withSeparator={false} withDescription={false} />
          <CompositionDemo example="radio" label="Dengan keterangan" groupName="description-with" withSeparator={false} withDescription />
        </div>
        <SectionCode>
          {'<Radio\n  name="access"\n  value="editor"\n  label="Editor"\n  '}
          <H>helperText</H>
          {'="Dapat mengubah konten."\n/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Preview dibuka saat halaman dimuat agar setiap variasi mudah dibandingkan. Gunakan kontrol di bawah
          untuk mengganti susunan Dropdown.
        </Lead>

        <Stage maxWidth="max-w-xl">
          <div className="flex min-h-80 items-start justify-center pt-10">
            <Dropdown>
              <Dropdown.Trigger>
                <button ref={playgroundTriggerRef} type="button" className={triggerClassName}>
                  Dropdown button
                  <Icon className="!size-3.5"><ChevronDown /></Icon>
                </button>
              </Dropdown.Trigger>
              <ExampleContent
                contentRef={playgroundContentRef}
                example={example}
                groupName="playground-dropdown"
                withSeparator={withSeparator}
                withDescription={withDescription}
              />
            </Dropdown>
          </div>
        </Stage>

        <Controls>
          <Control label="Contoh">
            <div onPointerDownCapture={rememberPlaygroundVisibility}>
              <Segmented
                label="Pilih contoh Dropdown"
                value={example}
                onChange={changeExample}
                options={examples}
                itemClassName="basis-1/2 justify-center px-2.5 sm:basis-1/3"
                wrap
              />
            </div>
          </Control>
          <Control label="Separator">
            <div onPointerDownCapture={rememberPlaygroundVisibility}>
              <Segmented
                label="Tampilkan separator"
                value={withSeparator}
                onChange={(value) => updatePlayground(() => setWithSeparator(value))}
                options={adaTidakAda}
              />
            </div>
          </Control>
          <Control label="Keterangan">
            <div onPointerDownCapture={rememberPlaygroundVisibility}>
              <Segmented
                label="Tampilkan keterangan"
                value={withDescription}
                onChange={(value) => updatePlayground(() => setWithDescription(value))}
                options={adaTidakAda}
              />
            </div>
          </Control>
        </Controls>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Bungkus button milik consumer dengan Dropdown.Trigger dan gunakan Dropdown.Content sebagai panel.
          Dropdown.Item digunakan untuk aksi, sedangkan Dropdown.Separator memisahkan kelompok aksi.
          Radio atau Checkbox dapat disusun langsung di dalam panel. Kode berikut
          mengikuti pilihan Contoh di Playground.
        </Lead>
        <p className="mt-2 max-w-2xl text-body-sm text-gray-500">
          Jika memakai komponen trigger kustom, pastikan atribut native button diteruskan ke elemen{' '}
          <H>&lt;button&gt;</H> yang dirender.
        </p>
        <SectionCode flush>
          <ExampleCode
            example={example}
            withSeparator={withSeparator}
            withDescription={withDescription}
          />
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>Setiap primitive memiliki tanggung jawab dan atribut native masing-masing.</Lead>

        <div className="space-y-8">
          <div>
            <h3 className="mb-3 text-heading-4 font-bold text-gray-900">Dropdown</h3>
            <PropsTable rows={dropdownProps} minWidth="42rem" />
          </div>
          <div>
            <h3 className="mb-3 text-heading-4 font-bold text-gray-900">Dropdown.Trigger</h3>
            <PropsTable rows={triggerProps} minWidth="42rem" />
          </div>
          <div>
            <h3 className="mb-3 text-heading-4 font-bold text-gray-900">Dropdown.Content</h3>
            <PropsTable rows={contentProps} minWidth="42rem" />
          </div>
          <div>
            <h3 className="mb-3 text-heading-4 font-bold text-gray-900">Dropdown.Item</h3>
            <PropsTable rows={itemProps} minWidth="42rem" />
          </div>
          <div>
            <h3 className="mb-3 text-heading-4 font-bold text-gray-900">Dropdown.Separator</h3>
            <PropsTable rows={separatorProps} minWidth="42rem" />
          </div>
        </div>
      </FlowSection>
    </UsulanPage>
  )
}
