import { ComponentPage, NotReadyPreview } from '../pageKit'

/** Halaman sementara untuk entri navigasi yang dokumentasinya belum diporting. */
export function PlaceholderPage({ title, eyebrow }: { title: string; eyebrow: string }) {
  return (
    <ComponentPage
      eyebrow={eyebrow}
      title={title}
      description="Halaman ini menyusul — token dasarnya sudah tersedia di stylesheet."
    >
      <div className="ds-card grid place-items-center p-14 text-center">
        <NotReadyPreview name={title} />
        <p className="mt-6 text-sm font-bold text-gray-500">Segera hadir</p>
        <p className="mt-1 max-w-sm text-xs leading-5 text-gray-400">
          Konten dokumentasi untuk “{title}” belum diporting. Token/utility-nya sudah bisa dipakai langsung.
        </p>
      </div>
    </ComponentPage>
  )
}
