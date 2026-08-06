import { Button } from '../../../lib'
import { DocExample } from '../../DocExample'
import { PropsTable, type PropRow } from '../../PropsTable'
import { ComponentPage, H, Section } from '../../pageKit'

const buttonProps: PropRow[] = [
  ['variant', 'string', 'primary', 'primary · secondary · danger · ghost'],
  ['as', "'button' | 'a'", 'button', "Elemen yang dirender, mis. 'a' untuk link"],
]

export function ButtonPage() {
  return (
    <ComponentPage
      title="Button"
      description="Memicu aksi utama pada sebuah halaman atau form. Empat variant untuk tingkat penekanan yang berbeda."
    >
      <Section title="Variants">
        <DocExample
          code={
            <>
              {'<Button variant="'}
              <H>primary</H>
              {'">Simpan perubahan</Button>\n'}
              {'<Button variant="secondary">Batal</Button>\n'}
              {'<Button variant="danger">Hapus</Button>\n'}
              {'<Button variant="ghost">Lewati</Button>'}
            </>
          }
        >
          <Button variant="primary">Simpan perubahan</Button>
          <Button variant="secondary">Batal</Button>
          <Button variant="danger">Hapus</Button>
          <Button variant="ghost">Lewati</Button>
        </DocExample>
      </Section>

      <Section title="States">
        <DocExample
          code={
            <>
              {'<Button variant="primary" '}
              <H>disabled</H>
              {'>Nonaktif</Button>'}
            </>
          }
        >
          <Button variant="primary">Normal</Button>
          <Button variant="primary" disabled>
            Nonaktif
          </Button>
        </DocExample>
      </Section>

      <Section title="Sebagai link">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Gunakan prop <code className="text-xs font-bold text-gray-700">as="a"</code> agar dirender sebagai
          anchor tanpa kehilangan gaya tombol.
        </p>
        <DocExample
          code={
            <>
              {'<Button as="'}
              <H>a</H>
              {'" href="/foundations/colors" variant="secondary">\n'}
              {'    Buka Foundations\n'}
              {'</Button>'}
            </>
          }
        >
          <Button as="a" href="#/foundations/colors" variant="secondary">
            Buka Foundations
          </Button>
        </DocExample>
      </Section>

      <Section title="Properties">
        <PropsTable rows={buttonProps} minWidth="36rem" />
      </Section>
    </ComponentPage>
  )
}
