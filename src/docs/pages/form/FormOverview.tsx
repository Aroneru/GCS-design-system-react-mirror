import { Checkbox, FloatingLabel, InputField, Radio, Select, TextArea, Toggle } from '../../../lib'
import { Envelope, User } from '../../../lib/icons/outline'
import { NotReadyPreview, OverviewCard, OverviewPage } from '../../pageKit'

/** Pembungkus preview kartu overview — latar netral seragam. */
function Preview({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl bg-surface-subtle p-5">{children}</div>
}

export function FormOverview() {
  return (
    <OverviewPage
      eyebrow="Form · Overview"
      title="Form"
      description="Komponen isian formulir — teks, pilihan, unggahan, dan kontrol pilihan. Semuanya memakai token warna, radius, dan jarak yang sama dengan Foundations."
    >
      <OverviewCard
        route="/form/input-field"
        name="Input Field Form"
        desc="Isian teks satu baris, floating label, dan text area — lengkap dengan state dan warna per aplikasi."
        wide
      >
        <Preview>
          {/*
            Satu latar, dua kolom: Input Field dan Floating Label ditumpuk di
            kiri, Text Area mengisi kolom kanan sepenuhnya. `justify-between`
            mendorong kedua field kiri ke tepi atas dan bawah supaya tingginya
            berakhir sejajar dengan Text Area di sebelahnya, bukan menggantung
            di tengah.

            Floating Label diberi `defaultValue` dengan sengaja — dalam keadaan
            kosong ia tak terbedakan dari Input Field di atasnya, dan justru
            labelnya-yang-naik itulah yang membedakan keduanya.
          */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col justify-between gap-5">
              <InputField
                label="Nama lengkap"
                placeholder="Masukkan nama lengkap"
                helperText="Sesuai yang tertera pada KTP."
                icon={<User className="size-4" />}
              />
              <FloatingLabel
                label="Alamat surel"
                type="email"
                defaultValue="yermi@contoh.id"
                icon={<Envelope className="size-4" />}
              />
            </div>
            <TextArea
              label="Keterangan"
              placeholder="Tulis keterangan tambahan di sini…"
            />
          </div>
        </Preview>
      </OverviewCard>

      <OverviewCard
        route="/form/select"
        name="Regular Select Form"
        desc="Daftar pilihan tunggal dengan tampilan yang selaras dengan Input Field."
      >
        <Preview>
          <Select
            label="Provinsi"
            info="Pilih salah satu provinsi."
            placeholder="Pilih Apapun Itu"
            options={[
              { value: 'dki', label: 'DKI Jakarta' },
              { value: 'jabar', label: 'Jawa Barat' },
            ]}
          />
        </Preview>
      </OverviewCard>

      <OverviewCard
        route="/form/search"
        name="Search Form"
        desc="Kolom pencarian dengan ikon dan tombol aksi opsional."
        soon
      >
        <NotReadyPreview name="Search Form" />
      </OverviewCard>

      <OverviewCard
        route="/form/upload"
        name="Upload Form"
        desc="Area unggah berkas dengan status proses dan validasi ukuran."
        wide
        soon
      >
        <NotReadyPreview name="Upload Form" />
      </OverviewCard>

      <OverviewCard
        route="/form/radio"
        name="Radio Button"
        desc="Pilihan tunggal dari beberapa opsi yang saling meniadakan."
      >
        <Preview>
          <div className="space-y-3">
            <Radio name="ds-overview-radio" label="Warga negara Indonesia" defaultChecked />
            <Radio name="ds-overview-radio" label="Warga negara asing" />
          </div>
        </Preview>
      </OverviewCard>

      <OverviewCard
        route="/form/toggle"
        name="Toggle Button"
        desc="Sakelar untuk menyalakan atau mematikan satu pengaturan."
      >
        <Preview>
          <div className="space-y-3">
            <Toggle label="Notifikasi aktif" defaultChecked />
            <Toggle label="Notifikasi nonaktif" />
          </div>
        </Preview>
      </OverviewCard>

      <OverviewCard
        route="/form/checkbox"
        name="Checkbox"
        desc="Pilihan ganda yang bisa dicentang secara mandiri."
      >
        <Preview>
          <div className="flex flex-wrap gap-6">
            <Checkbox label="Saya menyetujui syarat" defaultChecked />
            <Checkbox label="Kirim salinan ke email" />
          </div>
        </Preview>
      </OverviewCard>
    </OverviewPage>
  )
}
