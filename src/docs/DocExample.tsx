import { type ReactNode } from 'react'

/**
 * Kartu contoh: area preview di atas, cuplikan kode opsional di bawah.
 * Port dari `x-doc-example` (resources/views/components/doc-example.blade.php).
 *
 * `code` sengaja bertipe ReactNode agar halaman bisa menyorot bagian tertentu
 * lewat <span className="text-primary-300">…</span>, seperti versi Blade.
 */
export function DocExample({
  title,
  code,
  children,
}: {
  title?: string
  code?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="ds-card overflow-hidden">
      {title && (
        <div className="border-b border-border px-5 py-3">
          <p className="text-sm font-black text-gray-900">{title}</p>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3 bg-surface-subtle p-6">{children}</div>
      {code && (
        <pre className="ds-scroll-x overflow-x-auto border-t border-border bg-gray-900 p-5 text-xs leading-6 text-gray-300">
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}
