import { InputField } from '../../../lib'
import { ChevronDown, Search, Upload, User } from '../../../lib/icons/outline'
import { OverviewCard, OverviewPage } from '../../pageKit'

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
          <InputField
            label="Nama lengkap"
            placeholder="Masukkan nama lengkap"
            icon={<User className="size-4" />}
          />
        </Preview>
      </OverviewCard>

      <OverviewCard
        route="/form/select"
        name="Regular Select Form"
        desc="Daftar pilihan tunggal dengan tampilan yang selaras dengan Input Field."
      >
        <Preview>
          <div className="flex h-13 items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-4">
            <span className="text-sm text-gray-500">Pilih provinsi</span>
            <ChevronDown className="size-4 text-gray-500" />
          </div>
        </Preview>
      </OverviewCard>

      <OverviewCard
        route="/form/search"
        name="Search Form"
        desc="Kolom pencarian dengan ikon dan tombol aksi opsional."
      >
        <Preview>
          <div className="flex h-13 items-center gap-3 rounded-lg border border-gray-300 bg-gray-50 px-4">
            <Search className="size-4 shrink-0 text-gray-500" />
            <span className="text-sm text-gray-500">Cari layanan…</span>
          </div>
        </Preview>
      </OverviewCard>

      <OverviewCard
        route="/form/upload"
        name="Upload Form"
        desc="Area unggah berkas dengan status proses dan validasi ukuran."
        wide
      >
        <Preview>
          <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-surface px-4 py-6 text-center">
            <Upload className="size-5 text-gray-500" />
            <span className="text-sm text-gray-500">Seret berkas ke sini atau klik untuk memilih</span>
          </div>
        </Preview>
      </OverviewCard>

      <OverviewCard
        route="/form/radio"
        name="Radio Button"
        desc="Pilihan tunggal dari beberapa opsi yang saling meniadakan."
      >
        <Preview>
          <div className="space-y-3">
            <span className="flex items-center gap-2.5">
              <span className="grid size-5 place-items-center rounded-full border-2 border-primary-600">
                <span className="size-2.5 rounded-full bg-primary-600" />
              </span>
              <span className="text-sm text-gray-900">Warga negara Indonesia</span>
            </span>
            <span className="flex items-center gap-2.5">
              <span className="size-5 rounded-full border-2 border-gray-300" />
              <span className="text-sm text-gray-500">Warga negara asing</span>
            </span>
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
            <span className="flex items-center gap-3">
              <span className="flex h-6 w-11 items-center rounded-full bg-primary-600 p-0.5">
                <span className="ml-auto size-5 rounded-full bg-white shadow-sm" />
              </span>
              <span className="text-sm text-gray-900">Notifikasi aktif</span>
            </span>
            <span className="flex items-center gap-3">
              <span className="flex h-6 w-11 items-center rounded-full bg-gray-300 p-0.5">
                <span className="size-5 rounded-full bg-white shadow-sm" />
              </span>
              <span className="text-sm text-gray-500">Notifikasi nonaktif</span>
            </span>
          </div>
        </Preview>
      </OverviewCard>

      <OverviewCard
        route="/form/checkbox"
        name="Checkbox"
        desc="Pilihan ganda yang bisa dicentang secara mandiri."
        wide
      >
        <Preview>
          <div className="flex flex-wrap gap-6">
            <span className="flex items-center gap-2.5">
              <span className="grid size-5 place-items-center rounded-sm bg-primary-600">
                <svg className="size-3 text-white" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M1 5.9 5.7 10.5 15 1.5" />
                </svg>
              </span>
              <span className="text-sm text-gray-900">Saya menyetujui syarat</span>
            </span>
            <span className="flex items-center gap-2.5">
              <span className="size-5 rounded-sm border-2 border-gray-300" />
              <span className="text-sm text-gray-500">Kirim salinan ke email</span>
            </span>
          </div>
        </Preview>
      </OverviewCard>
    </OverviewPage>
  )
}
