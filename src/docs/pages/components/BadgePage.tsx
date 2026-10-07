import { Clock } from 'flowbite-react-icons/solid'
import { Badge, type BadgeSize, type BadgeVariant } from '../../../lib'
import { DocExample } from '../../DocExample'
import { PropsTable, type PropRow } from '../../PropsTable'
import { ComponentPage, G, Section } from '../../pageKit'

const badgeProps: PropRow[] = [
  ['variant', 'string', 'gray', 'gray · danger · warning · success · brand'],
  ['size', 'string', 'sm', 'sm · lg'],
  ['icon', 'ReactNode', '-', 'Ikon di kiri label'],
  ['dismissible', 'boolean', 'false', 'Tampilkan tombol tutup (×)'],
  ['onDismiss', '() => void', '-', 'Dipanggil saat tombol tutup diklik'],
  ['open', 'boolean', '-', 'Kendalikan tampil/sembunyi dari luar'],
  ['darkMode', 'boolean', 'false', 'Tampilan gelap'],
]

const VARIANTS: BadgeVariant[] = ['gray', 'danger', 'warning', 'success', 'brand']
const SIZES: BadgeSize[] = ['sm', 'lg']

function Grid({ darkMode = false }: { darkMode?: boolean }) {
  return (
    <div className={darkMode ? 'flex flex-col gap-4 rounded-lg bg-gray-900 p-6' : 'flex flex-col gap-4'}>
      {SIZES.map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-4">
          {VARIANTS.map((v) => (
            <Badge key={v} variant={v} size={size} icon={<Clock />} dismissible darkMode={darkMode}>
              Badge
            </Badge>
          ))}
        </div>
      ))}
    </div>
  )
}

export function BadgePage() {
  return (
    <ComponentPage
      title="Badge"
      description="Label status ringkas untuk menandai kondisi sebuah entitas. Lima variant warna, dua ukuran, ikon dan tombol tutup opsional."
    >
      <Section title="Variants">
        <DocExample
          code={
            <>
              {'<Badge variant="'}
              <G>success</G>
              {'">Aktif</Badge>\n'}
              {'<Badge variant="warning">Menunggu</Badge>\n'}
              {'<Badge variant="danger">Ditolak</Badge>'}
            </>
          }
        >
          <Badge variant="gray">Draft</Badge>
          <Badge variant="danger">Ditolak</Badge>
          <Badge variant="warning">Menunggu</Badge>
          <Badge variant="success">Aktif</Badge>
          <Badge variant="brand">Baru</Badge>
        </DocExample>
      </Section>

      <Section title="Ikon, ukuran, dan tombol tutup">
        <DocExample
          code={
            <>
              {'<Badge size="'}
              <G>lg</G>
              {'" icon={<Clock />} dismissible>Badge</Badge>'}
            </>
          }
        >
          <Grid />
        </DocExample>
      </Section>

      <Section title="Dark mode">
        <DocExample
          code={
            <>
              {'<Badge variant="success" icon={<Clock />} dismissible '}
              <G>darkMode</G>
              {'>Badge</Badge>'}
            </>
          }
        >
          <Grid darkMode />
        </DocExample>
      </Section>

      <Section title="Dalam konteks">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Badge biasanya menyertai judul, baris tabel, atau kartu untuk menandai status tanpa memakan banyak
          ruang.
        </p>
        <DocExample>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-900">
            Pengajuan izin <Badge variant="warning">Menunggu</Badge>
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-900">
            Verifikasi data <Badge variant="success">Selesai</Badge>
          </span>
        </DocExample>
      </Section>

      <Section title="Properties">
        <PropsTable rows={badgeProps} minWidth="36rem" />
      </Section>
    </ComponentPage>
  )
}
