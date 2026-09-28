import { forwardRef, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
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
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownTrigger,
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

type DropdownExample = 'actions' | 'icons' | 'radio' | 'checkbox' | 'radio-caption' | 'scroll'

const examples: { value: DropdownExample; label: string }[] = [
  { value: 'actions', label: 'Default' },
  { value: 'icons', label: 'Dengan ikon' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio-caption', label: 'Radio dengan keterangan' },
  { value: 'scroll', label: 'Dengan scroll' },
]

const variationMinHeights: Record<DropdownExample, string> = {
  actions: 'min-h-72',
  icons: 'min-h-72',
  radio: 'min-h-56',
  checkbox: 'min-h-56',
  'radio-caption': 'min-h-64',
  scroll: 'min-h-72',
}

const triggerClassName =
  'h-10 !bg-primary-700 !text-base !text-white duration-200 hover:!bg-primary-800 focus:!outline-none focus:ring-2 focus:ring-primary-400 disabled:pointer-events-none'

const selectionRowClassName = 'w-full rounded-md px-2 hover:bg-gray-100'
const disabledSelectionRowClassName = 'w-full rounded-md px-2'

const toc: TocEntry[] = [
  { id: 'dropdown', label: 'Dropdown' },
  { id: 'variasi', label: 'Variasi' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

const dropdownProps: PropRow[] = [
  ['children', 'ReactNode', 'required', 'Susunan trigger dan content Dropdown.'],
  ['className', 'string', 'undefined', 'Class tambahan pada pembungkus terluar.'],
]

const triggerProps: PropRow[] = [
  ['children', 'ReactNode', 'undefined', 'Isi tombol trigger.'],
  ['className', 'string', 'undefined', 'Class tambahan nonstruktural pada tombol.'],
  [
    '…props',
    'ButtonHTMLAttributes<HTMLButtonElement>',
    '—',
    'Atribut <button> native yang relevan diteruskan.',
  ],
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
    <DropdownTrigger className={triggerClassName}>
      {label}
      <Icon className="!size-3.5">
        <ChevronDown />
      </Icon>
    </DropdownTrigger>
  )
}

function ScrollContentItems() {
  return (
    <>
      <Checkbox className={selectionRowClassName} label="Email" defaultChecked />
      <Checkbox className={selectionRowClassName} label="Push notification" />
      <Checkbox className={selectionRowClassName} label="SMS" />
      <Checkbox className={selectionRowClassName} label="WhatsApp" defaultChecked />
      <Checkbox className={selectionRowClassName} label="Pembaruan produk" />
      <Checkbox className={selectionRowClassName} label="Aktivitas akun" />
      <Checkbox className={disabledSelectionRowClassName} label="Keamanan" disabled />
      <Checkbox className={selectionRowClassName} label="Promosi" />
      <Checkbox className={selectionRowClassName} label="Laporan mingguan" />
      <Checkbox className={selectionRowClassName} label="Pengingat" defaultChecked />
      <Checkbox className={selectionRowClassName} label="Integrasi" />
      <Checkbox className={selectionRowClassName} label="Sistem" />
    </>
  )
}

function ExampleContent({ example, groupName }: { example: DropdownExample; groupName: string }) {
  if (example === 'scroll') {
    return (
      <DropdownContent className="p-4" aria-label="Pilih notifikasi dengan scroll">
        <div className="flex max-h-48 flex-col gap-4 overflow-y-auto overscroll-y-contain">
          <ScrollContentItems />
        </div>
      </DropdownContent>
    )
  }

  if (example === 'icons') {
    return (
      <DropdownContent className="py-1" aria-label="Daftar aksi">
        <DropdownItem>
          <Icon className="!size-3.5 text-gray-500"><User /></Icon>
          Profil
        </DropdownItem>
        <DropdownItem>
          <Icon className="!size-3.5 text-gray-500"><Cog /></Icon>
          Pengaturan
        </DropdownItem>
        <DropdownItem>
          <Icon className="!size-3.5 text-gray-500"><QuestionCircle /></Icon>
          Bantuan
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem tone="danger">
          <Icon className="!size-3.5"><ArrowRightToBracket /></Icon>
          Keluar
        </DropdownItem>
      </DropdownContent>
    )
  }

  if (example === 'radio') {
    return (
      <DropdownContent className="p-4" aria-label="Pilih akses">
        <div className="flex flex-col gap-4">
          <Radio className={selectionRowClassName} name={groupName} value="viewer" label="Viewer" />
          <Radio className={selectionRowClassName} name={groupName} value="editor" label="Editor" defaultChecked />
          <Radio className={disabledSelectionRowClassName} name={groupName} value="admin" label="Admin" disabled />
        </div>
      </DropdownContent>
    )
  }

  if (example === 'checkbox') {
    return (
      <DropdownContent className="p-4" aria-label="Pilih notifikasi">
        <div className="flex flex-col gap-4">
          <Checkbox className={selectionRowClassName} label="Email" />
          <Checkbox className={selectionRowClassName} label="Push notification" defaultChecked />
          <Checkbox className={disabledSelectionRowClassName} label="SMS" disabled />
        </div>
      </DropdownContent>
    )
  }

  if (example === 'radio-caption') {
    return (
      <DropdownContent className="p-4" aria-label="Pilih pengiriman">
        <div className="flex flex-col gap-4">
          <Radio
            className={selectionRowClassName}
            name={groupName}
            value="standard"
            label="Standar"
            helperText="Tiba dalam 3–5 hari kerja."
            defaultChecked
          />
          <Radio
            className={selectionRowClassName}
            name={groupName}
            value="express"
            label="Ekspres"
            helperText="Tiba pada hari kerja berikutnya."
          />
        </div>
      </DropdownContent>
    )
  }

  return (
    <DropdownContent className="py-1" aria-label="Daftar aksi">
      <DropdownItem>Profil</DropdownItem>
      <DropdownItem>Pengaturan</DropdownItem>
      <DropdownItem>Bantuan</DropdownItem>
      <DropdownSeparator />
      <DropdownItem tone="danger">Keluar</DropdownItem>
    </DropdownContent>
  )
}

function ExampleCode({ example }: { example: DropdownExample }) {
  const componentImports = ['Dropdown', 'DropdownContent', 'DropdownTrigger']
  if (example === 'actions' || example === 'icons') {
    componentImports.splice(2, 0, 'DropdownItem', 'DropdownSeparator')
  }
  const selectionImport =
    example === 'checkbox' || example === 'scroll'
      ? 'Checkbox'
      : example === 'radio' || example === 'radio-caption'
        ? 'Radio'
        : ''
  if (selectionImport) componentImports.push(selectionImport)
  if (example === 'icons') componentImports.push('Icon')

  return (
    <>
      {`import { ${componentImports.join(', ')} } from '@stasi/design-kit-react'\n`}
      {example === 'icons' &&
        "import { ArrowRightToBracket, Cog, QuestionCircle, User } from '@stasi/design-kit-react/icons/outline'\n"}
      {`\n<Dropdown>\n  <DropdownTrigger\n    className="\n      h-10 !bg-primary-700 !text-base !text-white\n      duration-200 hover:!bg-primary-800 focus:!outline-none\n      focus:ring-2 focus:ring-primary-400 disabled:pointer-events-none\n    "\n  >\n    Dropdown button\n  </DropdownTrigger>\n`}
      {example === 'actions' ? (
        <H>{'  <DropdownContent className="py-1">\n    <DropdownItem>Profil</DropdownItem>\n    <DropdownItem>Pengaturan</DropdownItem>\n    <DropdownItem>Bantuan</DropdownItem>\n    <DropdownSeparator />\n    <DropdownItem tone="danger">Keluar</DropdownItem>\n  </DropdownContent>'}</H>
      ) : example === 'icons' ? (
        <H>{'  <DropdownContent className="py-1">\n    <DropdownItem><Icon className="!size-3.5 text-gray-500"><User /></Icon>Profil</DropdownItem>\n    <DropdownItem><Icon className="!size-3.5 text-gray-500"><Cog /></Icon>Pengaturan</DropdownItem>\n    <DropdownItem><Icon className="!size-3.5 text-gray-500"><QuestionCircle /></Icon>Bantuan</DropdownItem>\n    <DropdownSeparator />\n    <DropdownItem tone="danger"><Icon className="!size-3.5"><ArrowRightToBracket /></Icon>Keluar</DropdownItem>\n  </DropdownContent>'}</H>
      ) : example === 'scroll' ? (
        <H>{'  <DropdownContent className="p-4">\n    <div className="flex max-h-48 flex-col gap-4 overflow-y-auto overscroll-y-contain">\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="Email" defaultChecked />\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="Push notification" />\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="SMS" />\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="WhatsApp" defaultChecked />\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="Pembaruan produk" />\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="Aktivitas akun" />\n      <Checkbox className="w-full rounded-md px-2" label="Keamanan" disabled />\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="Promosi" />\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="Laporan mingguan" />\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="Pengingat" defaultChecked />\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="Integrasi" />\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="Sistem" />\n    </div>\n  </DropdownContent>'}</H>
      ) : example === 'radio' ? (
        <H>{'  <DropdownContent className="p-4">\n    <div className="flex flex-col gap-4">\n      <Radio className="w-full rounded-md px-2 hover:bg-gray-100" name="access" value="viewer" label="Viewer" />\n      <Radio className="w-full rounded-md px-2 hover:bg-gray-100" name="access" value="editor" label="Editor" defaultChecked />\n      <Radio className="w-full rounded-md px-2" name="access" value="admin" label="Admin" disabled />\n    </div>\n  </DropdownContent>'}</H>
      ) : example === 'checkbox' ? (
        <H>{'  <DropdownContent className="p-4">\n    <div className="flex flex-col gap-4">\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="Email" />\n      <Checkbox className="w-full rounded-md px-2 hover:bg-gray-100" label="Push notification" defaultChecked />\n      <Checkbox className="w-full rounded-md px-2" label="SMS" disabled />\n    </div>\n  </DropdownContent>'}</H>
      ) : (
        <H>{'  <DropdownContent className="p-4">\n    <div className="flex flex-col gap-4">\n      <Radio\n        className="w-full rounded-md px-2 hover:bg-gray-100"\n        name="delivery"\n        value="standard"\n        label="Standar"\n        helperText="Tiba dalam 3–5 hari kerja."\n        defaultChecked\n      />\n      <Radio\n        className="w-full rounded-md px-2 hover:bg-gray-100"\n        name="delivery"\n        value="express"\n        label="Ekspres"\n        helperText="Tiba pada hari kerja berikutnya."\n      />\n    </div>\n  </DropdownContent>'}</H>
      )}
      {'\n</Dropdown>'}
    </>
  )
}

function CompositionDemo({ example, label, groupName }: { example: DropdownExample; label: string; groupName: string }) {
  return (
    <Demo label={label}>
      <div className={`flex ${variationMinHeights[example]} items-start justify-center pt-3`}>
        <Dropdown>
          <Trigger />
          <ExampleContent example={example} groupName={groupName} />
        </Dropdown>
      </div>
    </Demo>
  )
}

export function DropdownPage() {
  const [example, setExample] = useState<DropdownExample>('actions')
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

  const changeExample = (nextExample: DropdownExample) => {
    const shouldRestore = restoreAfterExampleChangeRef.current
    restoreAfterExampleChangeRef.current = false
    setExample(nextExample)

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
          atau Escape; membuka Dropdown lain yang terpisah menutup panel sebelumnya. DropdownItem menutup
          panel setelah aktivasi, kecuali handler memanggil <H>event.preventDefault()</H>. Radio dan Checkbox
          tetap terbuka saat pilihan berubah, dan panel mengikuti trigger ketika halaman digulir atau viewport
          berubah.
        </Lead>
      </FlowSection>

      <FlowSection id="variasi" title="Variasi">
        <Lead>Beberapa variasi susunan Dropdown untuk kebutuhan aksi dan pilihan.</Lead>
        <div className="grid gap-6 sm:grid-cols-2">
          {examples.map((item) => (
            <CompositionDemo
              key={item.value}
              example={item.value}
              label={item.label}
              groupName={`dropdown-${item.value}`}
            />
          ))}
        </div>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Preview dibuka saat halaman dimuat agar setiap variasi mudah dibandingkan. Gunakan kontrol di bawah
          untuk mengganti susunan Dropdown.
        </Lead>

        <Stage maxWidth="max-w-xl">
          <div className="flex min-h-80 items-start justify-center pt-10">
            <Dropdown>
              <DropdownTrigger ref={playgroundTriggerRef} className={triggerClassName}>
                Dropdown button
                <Icon className="!size-3.5"><ChevronDown /></Icon>
              </DropdownTrigger>
              <ExampleContentWithRef
                ref={playgroundContentRef}
                example={example}
                groupName="playground-dropdown"
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
        </Controls>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Gunakan DropdownTrigger sebagai pemicu dan DropdownContent sebagai panel. DropdownItem digunakan
          untuk aksi, sedangkan DropdownSeparator dapat digunakan untuk memisahkan kelompok aksi.
          Radio atau Checkbox dapat disusun langsung di dalam panel. Kode berikut
          mengikuti pilihan Contoh di Playground.
        </Lead>
        <SectionCode flush><ExampleCode example={example} /></SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>Setiap primitive memiliki tanggung jawab dan atribut native masing-masing.</Lead>

        <div className="space-y-8">
          <div>
            <h3 className="mb-3 text-heading-4 font-bold text-gray-900">Dropdown</h3>
            <PropsTable rows={dropdownProps} minWidth="42rem" />
          </div>
          <div>
            <h3 className="mb-3 text-heading-4 font-bold text-gray-900">DropdownTrigger</h3>
            <PropsTable rows={triggerProps} minWidth="42rem" />
          </div>
          <div>
            <h3 className="mb-3 text-heading-4 font-bold text-gray-900">DropdownContent</h3>
            <PropsTable rows={contentProps} minWidth="42rem" />
          </div>
          <div>
            <h3 className="mb-3 text-heading-4 font-bold text-gray-900">DropdownItem</h3>
            <PropsTable rows={itemProps} minWidth="42rem" />
          </div>
          <div>
            <h3 className="mb-3 text-heading-4 font-bold text-gray-900">DropdownSeparator</h3>
            <PropsTable rows={separatorProps} minWidth="42rem" />
          </div>
        </div>
      </FlowSection>
    </UsulanPage>
  )
}

const ExampleContentWithRef = forwardRef<HTMLDivElement, { example: DropdownExample; groupName: string }>(
  function ExampleContentWithRef({ example, groupName }, ref) {
    if (example === 'actions' || example === 'icons' || example === 'scroll') {
      return (
        <DropdownContent
          ref={ref}
          className={example === 'scroll' ? 'p-4' : 'py-1'}
          aria-label={example === 'scroll' ? 'Pilih notifikasi dengan scroll' : 'Daftar aksi'}
        >
          {example === 'scroll' ? (
            <div className="flex max-h-48 flex-col gap-4 overflow-y-auto overscroll-y-contain">
              <ScrollContentItems />
            </div>
          ) : example === 'icons' ? (
            <>
              <DropdownItem><Icon className="!size-3.5 text-gray-500"><User /></Icon>Profil</DropdownItem>
              <DropdownItem><Icon className="!size-3.5 text-gray-500"><Cog /></Icon>Pengaturan</DropdownItem>
              <DropdownItem><Icon className="!size-3.5 text-gray-500"><QuestionCircle /></Icon>Bantuan</DropdownItem>
              <DropdownSeparator />
              <DropdownItem tone="danger"><Icon className="!size-3.5"><ArrowRightToBracket /></Icon>Keluar</DropdownItem>
            </>
          ) : (
            <>
              <DropdownItem>Profil</DropdownItem>
              <DropdownItem>Pengaturan</DropdownItem>
              <DropdownItem>Bantuan</DropdownItem>
              <DropdownSeparator />
              <DropdownItem tone="danger">Keluar</DropdownItem>
            </>
          )}
        </DropdownContent>
      )
    }

    if (example === 'checkbox') {
      return (
        <DropdownContent ref={ref} className="p-4" aria-label="Pilih notifikasi">
          <div className="flex flex-col gap-4">
            <Checkbox className={selectionRowClassName} label="Email" />
            <Checkbox className={selectionRowClassName} label="Push notification" defaultChecked />
            <Checkbox className={disabledSelectionRowClassName} label="SMS" disabled />
          </div>
        </DropdownContent>
      )
    }

    if (example === 'radio-caption') {
      return (
        <DropdownContent ref={ref} className="p-4" aria-label="Pilih pengiriman">
          <div className="flex flex-col gap-4">
            <Radio className={selectionRowClassName} name={groupName} value="standard" label="Standar" helperText="Tiba dalam 3–5 hari kerja." defaultChecked />
            <Radio className={selectionRowClassName} name={groupName} value="express" label="Ekspres" helperText="Tiba pada hari kerja berikutnya." />
          </div>
        </DropdownContent>
      )
    }

    return (
      <DropdownContent ref={ref} className="p-4" aria-label="Pilih akses">
        <div className="flex flex-col gap-4">
          <Radio className={selectionRowClassName} name={groupName} value="viewer" label="Viewer" />
          <Radio className={selectionRowClassName} name={groupName} value="editor" label="Editor" defaultChecked />
          <Radio className={disabledSelectionRowClassName} name={groupName} value="admin" label="Admin" disabled />
        </div>
      </DropdownContent>
    )
  },
)

ExampleContentWithRef.displayName = 'ExampleContentWithRef'
