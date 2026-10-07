import { useState } from 'react'
import { Clock } from '../../../lib/icons/solid'
import { Badge, type BadgeSize, type BadgeVariant } from '../../../lib'
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
import { adaTidakAda } from '../../usulanOptions'

const variants: { value: BadgeVariant; label: string }[] = [
  { value: 'gray', label: 'Gray' },
  { value: 'danger', label: 'Danger' },
  { value: 'warning', label: 'Warning' },
  { value: 'success', label: 'Success' },
  { value: 'brand', label: 'Brand' },
]

const sizes: { value: BadgeSize; label: string }[] = [
  { value: 'sm', label: 'Small' },
  { value: 'lg', label: 'Large' },
]

const badgeProps: PropRow[] = [
  ['variant', "'gray' | 'danger' | 'warning' | 'success' | 'brand'", 'gray', 'Warna semantik badge.'],
  ['size', "'sm' | 'lg'", 'sm', 'Ukuran teks, ikon, dan tombol tutup.'],
  ['icon', 'ReactNode', 'undefined', 'Ikon di kiri label. Pakai SVG dengan currentColor.'],
  ['dismissible', 'boolean', 'false', 'Menampilkan tombol tutup (×) di kanan label.'],
  ['onDismiss', '() => void', 'undefined', 'Dipanggil saat tombol tutup diklik.'],
  ['open', 'boolean', 'undefined', 'Kendalikan tampil/sembunyi dari luar; tanpa ini Badge mengurusnya sendiri.'],
  ['darkMode', 'boolean', 'false', 'Tampilan gelap: latar -900 dengan teks -300.'],
  ['children', 'ReactNode', 'undefined', 'Label badge.'],
  ['…props', 'HTMLAttributes', '—', 'Seluruh atribut <span> diteruskan (className, id, …).'],
]

const toc: TocEntry[] = [
  { id: 'badge', label: 'Badge' },
  { id: 'opsional', label: 'Ikon dan tombol tutup' },
  { id: 'ukuran', label: 'Ukuran' },
  { id: 'dark-mode', label: 'Dark mode' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

/** Satu baris berisi kelima variant dengan pengaturan yang sama. */
function Baris({ size, darkMode }: { size: BadgeSize; darkMode?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {variants.map((v) => (
        <Badge key={v.value} variant={v.value} size={size} icon={<Clock />} dismissible darkMode={darkMode}>
          Badge
        </Badge>
      ))}
    </div>
  )
}

export function BadgePage() {
  const [variant, setVariant] = useState<BadgeVariant>('success')
  const [size, setSize] = useState<BadgeSize>('sm')
  const [pakaiIkon, setPakaiIkon] = useState(true)
  const [pakaiTutup, setPakaiTutup] = useState(true)
  const [dark, setDark] = useState(false)

  return (
    <UsulanPage
      eyebrow="Components"
      title="Badge"
      description="Label status ringkas untuk menandai kondisi sebuah entitas. Lima variant warna, dua ukuran, ikon dan tombol tutup opsional. Tersedia juga dalam tampilan gelap."
      toc={toc}
    >
      <FlowSection id="badge" title="Badge">
        <Lead>
          Label beradius 6px dengan padding 2px × 12px. Lima variant warnanya punya makna semantik yang sama
          dengan Alert dan token warna lain di design system ini.
        </Lead>
        <Demo>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="gray">Draf</Badge>
            <Badge variant="danger">Ditolak</Badge>
            <Badge variant="warning">Menunggu</Badge>
            <Badge variant="success">Aktif</Badge>
            <Badge variant="brand">Baru</Badge>
          </div>
        </Demo>
        <SectionCode>
          {"import { Badge } from '@ceplok-ui/design-kit-react'\n\n"}
          {'<Badge '}
          <H>variant</H>
          {'="success">Aktif</Badge>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="opsional" title="Ikon dan tombol tutup">
        <Lead>
          Ikon kiri dan tombol tutup sama-sama opsional. Ikon mengikuti warna teks, jadi cukup kirim SVG
          dengan <Hl>currentColor</Hl>. Tombol tutup menyembunyikan badge dengan transisi singkat.
        </Lead>
        <div className="grid gap-5 sm:grid-cols-3">
          <Demo label="Dengan ikon">
            <Badge variant="brand" icon={<Clock />}>
              Badge
            </Badge>
          </Demo>
          <Demo label="Dengan tombol tutup">
            <Badge variant="brand" dismissible>
              Badge
            </Badge>
          </Demo>
          <Demo label="Keduanya">
            <Badge variant="brand" icon={<Clock />} dismissible>
              Badge
            </Badge>
          </Demo>
        </div>
        <SectionCode>
          {'<Badge variant="brand" '}
          <H>icon</H>
          {'={<Clock />} '}
          <H>dismissible</H>
          {'>Badge</Badge>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="ukuran" title="Ukuran">
        <Lead>
          <Hl>sm</Hl> (bawaan) memakai teks 14px, cocok untuk tabel dan kartu. <Hl>lg</Hl> memakai teks 16px
          untuk area yang lebih lega. Padding dan radiusnya sama.
        </Lead>
        <Demo>
          <div className="flex flex-col gap-4">
            {sizes.map((s) => (
              <Baris key={s.value} size={s.value} />
            ))}
          </div>
        </Demo>
        <SectionCode>
          {'<Badge '}
          <H>size</H>
          {'="lg" variant="success" icon={<Clock />} dismissible>Badge</Badge>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="dark-mode" title="Dark mode">
        <Lead>
          Prop <Hl>darkMode</Hl> membalik pasangan warnanya: latar -900 (gray-700 untuk variant gray) dan
          teks -300, keduanya di atas 4,5:1.
        </Lead>
        <Demo dark>
          <div className="flex flex-col gap-4">
            {sizes.map((s) => (
              <Baris key={s.value} size={s.value} darkMode />
            ))}
          </div>
        </Demo>
        <SectionCode>
          {'<Badge '}
          <H>darkMode</H>
          {' variant="success" icon={<Clock />} dismissible>Badge</Badge>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Satu Badge yang bisa Anda utak-atik lewat kontrol di bawahnya. Bagian Penggunaan menuliskan
          kodenya. Setelah Badge ditutup, ubah kontrol mana saja untuk memunculkannya kembali.
        </Lead>

        <Stage maxWidth="max-w-full" dark={dark}>
          <div className="flex justify-center">
            <Badge
              key={`${variant}-${size}-${pakaiIkon}-${pakaiTutup}-${dark}`}
              variant={variant}
              size={size}
              darkMode={dark}
              icon={pakaiIkon ? <Clock /> : undefined}
              dismissible={pakaiTutup}
            >
              Badge
            </Badge>
          </div>
        </Stage>

        <Controls>
          <Control label="Variant">
            <Segmented
              label="Pilih variant"
              value={variant}
              onChange={setVariant}
              itemClassName="px-2.5"
              wrap
              options={variants}
            />
          </Control>

          <Control label="Ukuran">
            <Segmented label="Pilih ukuran" value={size} onChange={setSize} options={sizes} />
          </Control>

          <Control label="Icon kiri">
            <Segmented
              label="Tampilkan icon kiri"
              value={pakaiIkon}
              onChange={setPakaiIkon}
              options={adaTidakAda}
            />
          </Control>

          <Control label="Tombol tutup">
            <Segmented
              label="Tampilkan tombol tutup"
              value={pakaiTutup}
              onChange={setPakaiTutup}
              options={adaTidakAda}
            />
          </Control>

          <Control label="Tampilan">
            <Segmented
              label="Pilih tampilan"
              value={dark}
              onChange={setDark}
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
          Blok ini mengikuti kontrol di Playground. Prop yang nilainya masih bawaan sengaja tidak ditulis.
        </Lead>
        <SectionCode flush>
          {"import { Badge } from '@ceplok-ui/design-kit-react'\n\n"}
          {'<Badge'}
          {variant !== 'gray' && (
            <>
              {' '}
              <H>variant</H>
              {`="${variant}"`}
            </>
          )}
          {size !== 'sm' && (
            <>
              {' '}
              <H>size</H>
              {`="${size}"`}
            </>
          )}
          {dark && (
            <>
              {' '}
              <H>darkMode</H>
            </>
          )}
          {pakaiIkon && (
            <>
              {' '}
              <H>icon</H>
              {'={<Clock />}'}
            </>
          )}
          {pakaiTutup && (
            <>
              {' '}
              <H>dismissible</H>
            </>
          )}
          {'>\n'}
          {'    Badge\n'}
          {'</Badge>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Seluruh prop yang diterima komponen, beserta tipe dan nilai bawaannya. Atribut{' '}
          <Hl>&lt;span&gt;</Hl> standar juga diteruskan apa adanya.
        </Lead>
        <PropsTable rows={badgeProps} minWidth="52rem" />
      </FlowSection>
    </UsulanPage>
  )
}
