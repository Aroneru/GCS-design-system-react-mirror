import { useState } from 'react'
import { InfoCircle } from 'flowbite-react-icons/outline'
import { Icon, Popover, type PopoverSide } from '../../../lib'
import { PropsTable, type PropRow } from '../../PropsTable'
import { H, Hl, Segmented } from '../../pageKit'
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

const body = 'Popover Body Text, Popover Body Text, Popover Body Text'

const sides: { value: PopoverSide; label: string }[] = [
  { value: 'right', label: 'Right' },
  { value: 'left', label: 'Left' },
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
]

const positionSides: { value: PopoverSide; label: string }[] = [
  { value: 'top', label: 'Top' },
  { value: 'right', label: 'Right' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
]

const staticPanelClasses: Record<PopoverSide, string> = {
  top: 'bottom-[calc(50%+26px)] left-1/2 -translate-x-1/2',
  right: 'top-1/2 left-[calc(50%+28px)] -translate-y-1/2',
  bottom: 'top-[calc(50%+26px)] left-1/2 -translate-x-1/2',
  left: 'top-1/2 right-[calc(50%+28px)] -translate-y-1/2',
}

const staticArrowClasses: Record<PopoverSide, string> = {
  top: 'bottom-[-8px] left-1/2 -translate-x-1/2 rotate-180',
  right: 'top-1/2 left-[-8px] -translate-y-1/2 -rotate-90',
  bottom: 'top-[-8px] left-1/2 -translate-x-1/2',
  left: 'top-1/2 right-[-8px] -translate-y-1/2 rotate-90',
}

function StaticPositionPreview({ side }: { side: PopoverSide }) {
  const arrowUsesHeader = side === 'bottom'

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface-subtle">
      <div className="relative h-80 min-w-[600px]">
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 inline-flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md text-gray-500"
        >
          <Icon>
            <InfoCircle />
          </Icon>
        </span>

        <div
          aria-hidden="true"
          className={`absolute w-[255px] shrink-0 [filter:drop-shadow(0_1px_2px_rgb(0_0_0/0.08))] ${staticPanelClasses[side]}`}
        >
          <span
            className={`pointer-events-none absolute z-30 size-4 ${staticArrowClasses[side]}`}
          >
            <span
              className={`absolute top-[3.25px] left-[3px] size-2.5 rotate-45 border-t border-l border-popover-border ${
                arrowUsesHeader ? 'bg-popover-header-surface' : 'bg-popover-surface'
              }`}
            />
          </span>

          <div className="relative z-10 overflow-hidden rounded-md bg-popover-surface">
            <div className="border-b border-popover-border bg-popover-header-surface px-3 py-1.5 text-sm leading-[1.5] font-semibold text-popover-header-content">
              Popover
            </div>
            <div className="bg-popover-surface px-3 py-2 text-sm leading-[1.5] font-medium text-popover-body-content">
              {body}
            </div>
            <span className="pointer-events-none absolute inset-0 z-20 rounded-md border border-popover-border" />
          </div>
        </div>
      </div>
    </div>
  )
}

function PositionCode() {
  return (
    <SectionCode flush>
      {"import { Icon, Popover } from '@ceplok-ui/design-kit-react'\n"}
      {"import { InfoCircle } from '@ceplok-ui/design-kit-react/icons/outline'\n\n"}
      {'<Popover\n  trigger={\n    <button type="button" aria-label="Buka informasi">\n      <Icon><InfoCircle /></Icon>\n    </button>\n  }\n  title="Popover"\n  '}
      <H>{'side="top"'}</H>
      {'\n>\n  Popover Body Text\n</Popover>'}
    </SectionCode>
  )
}

const popoverProps: PropRow[] = [
  [
    'trigger',
    "ReactElement<ButtonHTMLAttributes<HTMLButtonElement>, 'button'>",
    'required',
    'Satu elemen native <button>. Elemen non-interaktif, wrapper, Fragment, dan custom component tidak didukung.',
  ],
  ['title', 'ReactNode', 'required', 'Konten judul pada header Popover.'],
  ['children', 'ReactNode', 'required', 'Konten body Popover.'],
  [
    'side',
    "'top' | 'right' | 'bottom' | 'left'",
    "'right'",
    'Preferensi posisi panel terhadap trigger; posisi dapat berbalik agar aman di viewport.',
  ],
  ['data-theme', "'light' | 'dark'", 'inherit', 'Boundary tema eksplisit. Tanpa prop ini Popover mengikuti data-theme ancestor; darkMode={true} tetap memaksa dark.'],
  ['darkMode', 'boolean', 'false', 'Menggunakan tampilan gelap pada panel Popover.'],
  ['open', 'boolean', '—', 'Mengontrol visibilitas Popover dari luar.'],
  ['defaultOpen', 'boolean', 'false', 'Menentukan visibilitas awal saat Popover tidak dikontrol.'],
  [
    'onOpenChange',
    '(open: boolean) => void',
    '—',
    'Dipanggil ketika interaksi meminta atau menghasilkan perubahan visibilitas.',
  ],
  [
    '…props',
    'HTMLAttributes<HTMLDivElement>',
    '—',
    'Atribut <div> native yang relevan diteruskan. Native title, popover, dan onBeforeToggle tidak tersedia karena judul serta lifecycle native dikelola oleh Popover.',
  ],
]

const toc: TocEntry[] = [
  { id: 'popover', label: 'Popover' },
  { id: 'positions', label: 'Positions' },
  { id: 'dark-mode', label: 'Dark mode' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

function infoTrigger(label: string, darkMode = false, className = '') {
  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex size-9 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 ${
        darkMode
          ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-50'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
      } ${className}`}
    >
      <Icon>
        <InfoCircle />
      </Icon>
    </button>
  )
}

export function PopoverPage() {
  const [side, setSide] = useState<PopoverSide>('right')
  const [darkMode, setDarkMode] = useState(false)

  return (
    <UsulanPage
      eyebrow="Components"
      title="Popover"
      description="Panel informasi non-modal yang dibuka dari trigger dan ditempatkan secara aman di sekitar trigger."
      toc={toc}
    >
      <FlowSection id="popover" title="Popover">
        <Lead>
          Gunakan Popover untuk informasi kontekstual yang perlu dibuka dari native{' '}
          <Hl>&lt;button&gt;</Hl>. Ikon informasi di bawah hanya contoh; trigger dapat berupa tombol
          native lain yang sesuai konteks.
        </Lead>
        <Stage maxWidth="max-w-[640px]">
          <div className="flex min-h-32 items-center justify-center gap-0 p-6">
            <span className="text-sm font-medium text-gray-900">Nomor referensi</span>
            <Popover
              trigger={infoTrigger('Informasi nomor referensi', false, '-ml-1')}
              title="Nomor referensi"
            >
              Nomor referensi digunakan untuk melacak status pengajuan.
            </Popover>
          </div>
        </Stage>
      </FlowSection>

      <FlowSection id="positions" title="Positions">
        <Lead>
          <Hl>side</Hl> menentukan preferensi posisi panel terhadap trigger. Popover dapat berbalik ke
          sisi berlawanan ketika ruang viewport tidak cukup.
        </Lead>
        <div className="grid gap-8">
          {positionSides.map((item) => (
            <article key={item.value}>
              <h3 className="mb-3 text-sm font-black text-gray-900">{item.label}</h3>
              <StaticPositionPreview side={item.value} />
            </article>
          ))}
        </div>
        <h3 className="mt-8 mb-3 text-sm font-black text-gray-900">Code Example</h3>
        <PositionCode />
      </FlowSection>

      <FlowSection id="dark-mode" title="Dark mode">
        <Lead>
          Popover mewarisi <Hl>data-theme</Hl> dari consumer boundary. Pada Dark, header memakai
          gray-700, body gray-800, judul gray-50, dan teks body gray-400. Prop <Hl>darkMode</Hl> tetap
          tersedia sebagai override kompatibilitas. Arrow mengikuti surface yang bersentuhan dengannya.
        </Lead>
        <Stage maxWidth="max-w-[640px]" dark>
          <div data-theme="dark" className="flex min-h-32 items-center justify-center p-6">
            <Popover
              trigger={infoTrigger('Buka Popover dark mode', true)}
              title="Popover"
              side="top"
            >
              {body}
            </Popover>
          </div>
        </Stage>
        <SectionCode>
          {"import { Icon, Popover } from '@ceplok-ui/design-kit-react'\n"}
          {"import { InfoCircle } from '@ceplok-ui/design-kit-react/icons/outline'\n\n"}
          {'<div '}<H>data-theme</H>{'="dark">\n  <Popover\n    '}
          <H>trigger</H>
          {'={\n      <button\n        type="button"\n        aria-label="Buka informasi"\n        className="inline-flex size-9 items-center justify-center text-gray-400 focus-visible:outline-2"\n      >\n        <Icon><InfoCircle /></Icon>\n      </button>\n    }\n    '}
          <H>title</H>
          {'="Popover"\n    '}
          <H>side</H>
          {'="top"\n  >\n    Popover Body Text\n  </Popover>\n</div>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Pilih preferensi posisi dan tampilan, lalu buka Popover melalui trigger untuk menguji
          lifecycle komponen yang sebenarnya.
        </Lead>
        <Stage maxWidth="max-w-[640px]" dark={darkMode}>
          <div data-theme={darkMode ? 'dark' : 'light'} className="flex min-h-32 items-center justify-center p-6">
            <Popover
              trigger={infoTrigger('Buka Popover Playground', darkMode)}
              title="Popover"
              side={side}
            >
              {body}
            </Popover>
          </div>
        </Stage>
        <Controls>
          <Control label="Tampilan">
            <Segmented
              label="Pilih tampilan Popover"
              value={darkMode}
              onChange={setDarkMode}
              options={[
                { value: false, label: 'Light' },
                { value: true, label: 'Dark' },
              ]}
            />
          </Control>
          <Control label="Side">
            <Segmented
              label="Pilih preferensi posisi Popover"
              value={side}
              onChange={(value) => setSide(value as PopoverSide)}
              wrap
              options={sides}
            />
          </Control>
        </Controls>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Kode mengikuti pilihan Playground. Nilai default <Hl>right</Hl> dan tampilan light tidak
          ditulis. Trigger harus berupa satu native <Hl>&lt;button&gt;</Hl>; semantik native memastikan
          trigger dapat menerima fokus serta diaktifkan dengan Enter dan Space.
        </Lead>
        <SectionCode flush>
          {"import { Icon, Popover } from '@ceplok-ui/design-kit-react'\n"}
          {"import { InfoCircle } from '@ceplok-ui/design-kit-react/icons/outline'\n\n"}
          {darkMode && <>{'<div '}<H>data-theme</H>{'="dark">\n  '}</>}
          {'<Popover\n  '}
          <H>trigger</H>
          {'={\n    <button\n      type="button"\n      aria-label="Buka informasi"\n      className="inline-flex size-9 items-center justify-center rounded-md '}
          {darkMode ? 'text-gray-400' : 'text-gray-500'}
          {' focus-visible:outline-2"\n    >\n      <Icon><InfoCircle /></Icon>\n    </button>\n  }\n  '}
          <H>title</H>
          {'="Popover"'}
          {side !== 'right' && (
            <>
              {'\n  '}
              <H>side</H>
              {`="${side}"`}
            </>
          )}
          {'\n>\n  Popover Body Text, Popover Body Text, Popover Body Text\n</Popover>'}
          {darkMode && '\n</div>'}
        </SectionCode>

        <h3 className="mt-8 text-sm font-black text-gray-900">Accessibility</h3>
        <p className="mt-1 max-w-2xl text-body-sm text-gray-500">
          Popover menambahkan <Hl>aria-expanded</Hl> dan <Hl>aria-controls</Hl> pada trigger, sedangkan
          trigger tetap harus memiliki nama aksesibel. Panel bersifat non-modal dan tidak memindahkan
          atau mengunci fokus. Elemen non-interaktif, Fragment, button yang dibungkus elemen lain,
          dan custom component tidak dapat digunakan sebagai trigger. Role dan atribut ARIA tambahan
          dapat diteruskan sesuai isi panel.
        </p>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Seluruh prop yang diterima komponen, beserta tipe dan nilai bawaannya. Atribut HTML native
          yang relevan juga dapat diteruskan.
        </Lead>
        <PropsTable rows={popoverProps} minWidth="46rem" />
      </FlowSection>
    </UsulanPage>
  )
}
