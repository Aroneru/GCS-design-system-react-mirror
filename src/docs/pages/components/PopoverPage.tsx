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
          Arrow tersedia di kanan, kiri, atas, dan bawah. Popover menggunakan lebar default 255px 
          dan tinggi yang menyesuaikan isi. Dalam layout flex, Popover tidak menyusut secara otomatis.
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
          <div className="flex min-h-40 items-center justify-center p-6">
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
          Kode mengikuti pilihan Playground. Nilai default <H>right</H> tidak ditulis. Gunakan
          <H>className</H> untuk styling tambahan pada root Popover. Untuk menyesuaikan lebar dari
          default 255px, gunakan atribut <H>style</H> agar override tetap konsisten. Perubahan lebar
          tidak mengubah padding internal header dan body.
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

        <h3 className="mt-8 text-sm font-black text-gray-900">Accessibility</h3>
        <p className="mt-1 max-w-2xl text-body-sm text-gray-500">
          Popover ini hanya menangani visual panel dan tidak menetapkan role secara default.
          Consumer dapat meneruskan atribut ARIA sesuai konteks; trigger, pengelolaan fokus,
          dan dismissal menjadi tanggung jawab integrasi yang menampilkannya.
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
