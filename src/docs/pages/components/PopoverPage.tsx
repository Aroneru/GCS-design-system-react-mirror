import { useState } from 'react'
import { InfoCircle } from 'flowbite-react-icons/outline'
import { Icon, Popover, type PopoverSide } from '../../../lib'
import { PropsTable, type PropRow } from '../../PropsTable'
import { H, Segmented } from '../../pageKit'
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

const popoverProps: PropRow[] = [
  [
    'trigger',
    'ReactElement',
    'required',
    'Satu elemen button-like yang meneruskan id, onClick, dan atribut ARIA ke elemen DOM fokusabel.',
  ],
  ['title', 'ReactNode', 'required', 'Konten judul pada header Popover.'],
  ['children', 'ReactNode', 'required', 'Konten body Popover.'],
  [
    'side',
    "'top' | 'right' | 'bottom' | 'left'",
    "'right'",
    'Preferensi posisi panel terhadap trigger; posisi dapat berbalik agar aman di viewport.',
  ],
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

function infoTrigger(label: string, darkMode = false) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex size-9 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 ${
        darkMode
          ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-50'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
      }`}
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
          Gunakan Popover untuk informasi kontekstual yang perlu dibuka dari satu elemen button-like.
          Ikon informasi di bawah hanya contoh; trigger dapat berupa tombol lain yang sesuai konteks.
        </Lead>
        <Stage maxWidth="max-w-[640px]">
          <div className="flex min-h-32 items-center justify-center gap-3 p-6">
            <span className="text-sm font-medium text-gray-900">Nomor referensi</span>
            <Popover
              trigger={infoTrigger('Informasi nomor referensi')}
              title="Nomor referensi"
            >
              Nomor referensi digunakan untuk melacak status pengajuan.
            </Popover>
          </div>
        </Stage>
      </FlowSection>

      <FlowSection id="positions" title="Positions">
        <Lead>
          <H>side</H> menentukan preferensi posisi panel terhadap trigger. Popover dapat berbalik ke
          sisi berlawanan ketika ruang viewport tidak cukup.
        </Lead>
        <div className="grid gap-8">
          {sides.map((item) => (
            <article key={item.value}>
              <h3 className="mb-3 text-sm font-black text-gray-900">{item.label}</h3>
              <div className="flex min-h-32 items-center justify-center rounded-xl border border-border bg-surface-subtle p-6">
                <Popover
                  trigger={infoTrigger(`Buka Popover ${item.label}`)}
                  title="Popover"
                  side={item.value}
                >
                  {body}
                </Popover>
              </div>
            </article>
          ))}
        </div>
      </FlowSection>

      <FlowSection id="dark-mode" title="Dark mode">
        <Lead>
          Prop <H>darkMode</H> menggunakan header gray-700, body gray-800, judul gray-50, dan teks
          body gray-400. Arrow mengikuti surface yang bersentuhan dengannya.
        </Lead>
        <Stage maxWidth="max-w-[640px]" dark>
          <div className="flex min-h-32 items-center justify-center p-6">
            <Popover
              darkMode
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
          {'<Popover\n  '}
          <H>darkMode</H>
          {'\n  '}
          <H>trigger</H>
          {'={\n    <button\n      type="button"\n      aria-label="Buka informasi"\n      className="inline-flex size-9 items-center justify-center text-gray-400 focus-visible:outline-2"\n    >\n      <Icon><InfoCircle /></Icon>\n    </button>\n  }\n  '}
          <H>title</H>
          {'="Popover"\n  '}
          <H>side</H>
          {'="top"\n>\n  Popover Body Text\n</Popover>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Pilih preferensi posisi dan tampilan, lalu buka Popover melalui trigger untuk menguji
          lifecycle komponen yang sebenarnya.
        </Lead>
        <Stage maxWidth="max-w-[640px]" dark={darkMode}>
          <div className="flex min-h-32 items-center justify-center p-6">
            <Popover
              trigger={infoTrigger('Buka Popover Playground')}
              title="Popover"
              side={side}
              darkMode={darkMode}
            >
              {body}
            </Popover>
          </div>
        </Stage>
        <Controls>
          <Control label="Side">
            <Segmented
              label="Pilih preferensi posisi Popover"
              value={side}
              onChange={(value) => setSide(value as PopoverSide)}
              wrap
              options={sides}
            />
          </Control>
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
        </Controls>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Kode mengikuti pilihan Playground. Nilai default <H>right</H> dan tampilan light tidak
          ditulis. Trigger harus meneruskan prop native dan ARIA yang disuntikkan Popover ke satu
          elemen DOM fokusabel.
        </Lead>
        <SectionCode flush>
          {"import { Icon, Popover } from '@ceplok-ui/design-kit-react'\n"}
          {"import { InfoCircle } from '@ceplok-ui/design-kit-react/icons/outline'\n\n"}
          {'<Popover'}
          {darkMode && (
            <>
              {' '}
              <H>darkMode</H>
            </>
          )}
          {'\n  '}
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
        </SectionCode>

        <h3 className="mt-8 text-sm font-black text-gray-900">Accessibility</h3>
        <p className="mt-1 max-w-2xl text-body-sm text-gray-500">
          Popover menambahkan <H>aria-expanded</H> dan <H>aria-controls</H> pada trigger, sedangkan
          trigger tetap harus memiliki nama aksesibel. Panel bersifat non-modal dan tidak memindahkan
          atau mengunci fokus. Role dan atribut ARIA tambahan dapat diteruskan sesuai isi panel.
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
