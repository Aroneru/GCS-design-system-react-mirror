import { useState } from 'react'
import {
  Select,
  type SelectApplication,
  type SelectOption,
  type SelectState,
} from '../../../lib'
import { PropsTable, type PropRow } from '../../PropsTable'
import { CodeBlock, ComponentPage, ControlLabel, Demo, H, Section, Segmented } from '../../pageKit'

const applications: { value: SelectApplication; label: string; token: string }[] = [
  { value: 'default', label: 'Default', token: 'primary-500' },
  { value: 'simaya', label: 'simaya', token: 'purple-500' },
]

/** Contoh isi dropdown — dipakai berulang di seluruh halaman. */
const provinsi: SelectOption[] = [
  { value: 'dki', label: 'DKI Jakarta' },
  { value: 'jabar', label: 'Jawa Barat' },
  { value: 'jateng', label: 'Jawa Tengah' },
  { value: 'jatim', label: 'Jawa Timur' },
]

const selectProps: PropRow[] = [
  ['label', 'ReactNode', 'undefined', 'Teks label di atas field.'],
  ['info', 'string', 'undefined', 'Keterangan pada ikon info di samping label; ikon muncul bila diisi.'],
  ['helperText', 'ReactNode', 'undefined', 'Caption di bawah field.'],
  ['placeholder', 'string', 'undefined', 'Teks saat belum ada pilihan, mis. "Pilih Apapun Itu".'],
  ['options', 'SelectOption[]', 'undefined', 'Daftar pilihan { value, label, disabled }. Bila kosong, children yang dipakai.'],
  ['state', "'default' | 'inactive'", 'default', 'Inactive meredupkan tampilan sekaligus menonaktifkan kontrol.'],
  ['application', "'default' | 'simaya'", 'default', 'Warna ikon info dan garis saat difokus.'],
  ['…props', 'SelectHTMLAttributes', '—', 'Seluruh atribut <select> standar diteruskan (value, onChange, required, name, …).'],
]

export function SelectPage() {
  const [application, setApplication] = useState<SelectApplication>('default')
  const [state, setState] = useState<SelectState>('default')
  const [withInfo, setWithInfo] = useState(true)
  const [narrow, setNarrow] = useState(false)
  const [value, setValue] = useState('')

  return (
    <ComponentPage
      eyebrow="Form"
      title="Regular Select Form"
      description="Dropdown satu pilihan dengan label, ikon info, dan caption. Dibangun di atas elemen <select> bawaan supaya keyboard dan pembaca layar tetap berfungsi, dengan warna, radius, dan jarak dari Foundations."
    >
      <Section title="Select Input">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Label di atas field, kotak setinggi 37px berlatar abu muda dengan panah di sisi kanan, lalu caption
          opsional di bawahnya. Ikon info di samping label muncul begitu prop <H>info</H> diisi.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <Demo label="Belum dipilih">
            <Select
              label="Label"
              info="Pilih salah satu provinsi."
              placeholder="Pilih Apapun Itu"
              options={provinsi}
              helperText="Wajib diisi."
            />
          </Demo>
          <Demo label="Sudah dipilih">
            <Select
              label="Label"
              info="Pilih salah satu provinsi."
              placeholder="Pilih Apapun Itu"
              options={provinsi}
              defaultValue="jabar"
              helperText="Wajib diisi."
            />
          </Demo>
        </div>
      </Section>

      <Section title="State">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          State <H>inactive</H> memakai latar gray-100 dengan teks gray-300, dan sekaligus menonaktifkan
          kontrolnya — jadi tampilan dan perilakunya tak mungkin berbeda.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <Demo label="Default">
            <Select label="Label" info="Keterangan singkat." placeholder="Pilih Apapun Itu" options={provinsi} />
          </Demo>
          <Demo label="Inactive">
            <Select
              state="inactive"
              label="Label"
              info="Keterangan singkat."
              placeholder="Pilih Apapun Itu"
              options={provinsi}
            />
          </Demo>
        </div>
      </Section>

      <Section title="Application">
        <p className="mb-4 max-w-2xl text-body-sm text-gray-500">
          Warna ikon info — dan garis kotak saat difokus — mengikuti aplikasi yang memakainya, dengan token
          warna yang sama seperti pada Input Field.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {applications.map((a) => (
            <Demo key={a.value} label={a.label}>
              <Select
                application={a.value}
                label="Label"
                info="Keterangan singkat."
                placeholder="Pilih Apapun Itu"
                options={provinsi}
                helperText={`text-${a.token}`}
              />
            </Demo>
          ))}
        </div>
      </Section>

      <section>
        <h2 className="mb-4 text-heading-3 font-black text-gray-900">Playground</h2>

        <div className="rounded-2xl border border-border bg-surface-subtle p-6 sm:p-10">
          <div
            className={`mx-auto transition-[max-width] duration-300 ease-out ${
              narrow ? 'max-w-[340px]' : 'max-w-[348px]'
            }`}
          >
            <Select
              application={application}
              state={state}
              label="Label"
              info={withInfo ? 'Keterangan singkat tentang isian ini.' : undefined}
              placeholder="Pilih Apapun Itu"
              options={provinsi}
              helperText="Pilih salah satu provinsi."
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-start gap-6">
          <div>
            <ControlLabel>Application</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Pilih aplikasi"
                value={application}
                onChange={setApplication}
                itemClassName="px-2.5"
                options={applications.map((a) => ({ value: a.value, label: a.label }))}
              />
            </div>
          </div>

          <div>
            <ControlLabel>State</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Pilih state"
                value={state}
                onChange={setState}
                options={[
                  { value: 'default', label: 'Default' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
              />
            </div>
          </div>

          <div>
            <ControlLabel>Ikon info</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Tampilkan ikon info"
                value={withInfo}
                onChange={setWithInfo}
                options={[
                  { value: true, label: 'Ada' },
                  { value: false, label: 'Tanpa' },
                ]}
              />
            </div>
          </div>

          <div>
            <ControlLabel>Type</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Pilih lebar"
                value={narrow}
                onChange={setNarrow}
                options={[
                  { value: true, label: 'Mobile' },
                  { value: false, label: 'Default' },
                ]}
              />
            </div>
          </div>
        </div>

        <p className="mt-4 text-body-sm text-gray-500">
          Type <em>Mobile</em> di Figma hanya menyempitkan wadahnya (340px, dari 348px) — tinggi, jarak, dan
          ukuran teksnya sama persis. Karena itu lebarnya diatur wadah, bukan prop komponen.
        </p>
      </section>

      <Section title="Penggunaan">
        <CodeBlock>
          {"import { Select } from '@tpl/design-kit-react'\n\n"}
          {'{/* Dasar: label, ikon info, placeholder, dan caption */}\n'}
          {'<Select\n'}
          {'    label="Label"\n'}
          {'    '}
          <H>info</H>
          {'="Pilih salah satu provinsi."\n'}
          {'    '}
          <H>placeholder</H>
          {'="Pilih Apapun Itu"\n'}
          {'    '}
          <H>options</H>
          {'={[{ value: "dki", label: "DKI Jakarta" }]}\n'}
          {'    helperText="Wajib diisi."\n'}
          {'/>\n\n'}
          {'{/* Terkendali + warna aplikasi */}\n'}
          {'<Select\n'}
          {'    '}
          <H>application</H>
          {'="simaya"\n'}
          {'    value={value}\n'}
          {'    onChange={(e) => setValue(e.target.value)}\n'}
          {'    options={provinsi}\n'}
          {'/>\n\n'}
          {'{/* Inactive — meredup sekaligus nonaktif */}\n'}
          {'<Select '}
          <H>state</H>
          {'="inactive" label="Label" placeholder="Pilih Apapun Itu" />\n\n'}
          {'{/* Tanpa prop options: pakai <option> sendiri */}\n'}
          {'<Select label="Label" placeholder="Pilih Apapun Itu">\n'}
          {'    <option value="dki">DKI Jakarta</option>\n'}
          {'</Select>'}
        </CodeBlock>
      </Section>

      <Section title="Properties">
        <PropsTable rows={selectProps} minWidth="48rem" />
      </Section>
    </ComponentPage>
  )
}
