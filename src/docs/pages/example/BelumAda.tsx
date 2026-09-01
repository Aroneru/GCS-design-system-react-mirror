import type { ReactNode } from 'react'

/**
 * Menandai bagian yang komponen aslinya belum ada di kit.
 *
 * Demo ini seluruhnya dirakit dari `@stasi/design-kit-react`, kecuali beberapa
 * bagian yang komponennya memang belum dibuat — tabel, misalnya, masih ditulis
 * sebagai markup biasa. Tanpa penanda, markup itu terbaca seolah berasal dari
 * kit, dan contohnya jadi menjanjikan sesuatu yang belum ada.
 *
 * Isinya diredupkan sekaligus dimatikan interaksinya: bagian ini tidak boleh
 * terasa bisa dipakai, karena memang bukan komponen. Teksnya tetap terbaca
 * pembaca layar — yang disembunyikan hanya kesan "ini siap pakai", bukan
 * informasinya.
 */
export function BelumAda({
  children,
  /** Untuk area sekecil satu field: label lebih kecil agar tidak melebihi isinya. */
  ringkas = false,
}: {
  children: ReactNode
  ringkas?: boolean
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none opacity-35 select-none">{children}</div>

      {/*
        z-20: di Pengajuan ada lapisan spinner ber-z-10 di dalam pembungkus yang
        sama, dan penanda ini harus tetap terbaca saat tabelnya sedang memuat.
      */}
      <div
        className={`pointer-events-none absolute inset-0 z-20 grid place-items-center ${
          ringkas ? 'p-1' : 'p-4'
        }`}
      >
        <p
          className={`rounded-lg border border-border bg-white/95 text-center font-black text-gray-900 shadow-soft ${
            ringkas ? 'px-2.5 py-1 text-xs' : 'px-4 py-2.5 text-sm'
          }`}
        >
          Contoh Saja (Component Asli belum ada)
        </p>
      </div>
    </div>
  )
}
