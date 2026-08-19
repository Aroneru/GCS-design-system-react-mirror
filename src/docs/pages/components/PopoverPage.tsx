import { useState } from 'react'
import { Popover, type PopoverSide } from '../../../lib'
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
  ['title', 'ReactNode', 'required', 'Konten judul pada header Popover.'],
  ['children', 'ReactNode', 'required', 'Konten body Popover.'],
  ['side', "'top' | 'right' | 'bottom' | 'left'", "'right'", 'Posisi arrow terhadap panel.'],
  [
    '…props',
    'HTMLAttributes<HTMLDivElement>',
    '—',
    'Atribut <div> native yang relevan diteruskan. Native title digantikan oleh prop title Popover.',
  ],
]

const toc: TocEntry[] = [
  { id: 'positions', label: 'Positions' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'properties', label: 'Properties' },
]

export function PopoverPage() {
  const [side, setSide] = useState<PopoverSide>('right')

  return (
    <UsulanPage
      eyebrow="Components"
      title="Popover"
      description="Panel informasi ringkas dengan header, body, dan arrow yang dapat ditempatkan pada empat sisi."
      toc={toc}
    >
      <FlowSection id="positions" title="Positions">
        <Lead>
          Arrow tersedia di kanan, kiri, atas, dan bawah. Panel mempertahankan lebar 255px sementara
          tingginya mengikuti isi.
        </Lead>
        <div className="grid gap-8 sm:grid-cols-2">
          {sides.map((item) => (
            <article key={item.value}>
              <h3 className="mb-3 text-sm font-black text-gray-900">{item.label}</h3>
              <div className="flex min-h-40 items-center justify-center rounded-xl border border-border bg-surface-subtle p-6">
                <Popover title="Popover" side={item.value}>
                  {body}
                </Popover>
              </div>
            </article>
          ))}
        </div>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>Pilih sisi untuk memindahkan arrow tanpa mengubah isi atau geometri panel.</Lead>
        <Stage maxWidth="max-w-[303px]">
          <div className="flex min-h-32 items-center justify-center px-6 py-4">
            <Popover title="Popover" side={side}>
              {body}
            </Popover>
          </div>
        </Stage>
        <Controls>
          <Control label="Side">
            <Segmented
              label="Pilih sisi arrow Popover"
              value={side}
              onChange={setSide}
              wrap
              options={sides}
            />
          </Control>
        </Controls>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Kode mengikuti pilihan Playground. Nilai default <H>right</H> tidak ditulis.
        </Lead>
        <SectionCode flush>
          {"import { Popover } from '@tpl/design-kit-react'\n\n"}
          {'<Popover title="Popover"'}
          {side !== 'right' && (
            <>
              {' '}
              <H>side</H>
              {`="${side}"`}
            </>
          )}
          {'>\n  Popover Body Text, Popover Body Text, Popover Body Text\n</Popover>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="accessibility" title="Accessibility">
        <Lead>
          Popover ini hanya menangani visual panel dan sengaja tidak menetapkan role. Consumer dapat
          meneruskan atribut ARIA yang sesuai konteks; trigger, fokus, dismissal, dan positioning tetap
          menjadi tanggung jawab integrasi yang menampilkannya.
        </Lead>
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
