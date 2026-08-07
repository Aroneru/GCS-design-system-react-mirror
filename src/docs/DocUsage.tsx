import { type ReactNode } from 'react'
import { useCopy } from './useCopy'
import { nodeText } from './nodeText'

/**
 * Kartu cuplikan kode dengan tombol salin — port dari `x-doc-usage`.
 * Tanpa `title` komponen tampil ringkas: hanya kartu kode, cocok disisipkan
 * tepat di bawah masing-masing section.
 *
 * `code` boleh berupa string biasa atau JSX — JSX dipakai saat sebagian kode
 * perlu disorot. Isi clipboard selalu diturunkan dari `code` yang sama supaya
 * yang tersalin persis dengan yang terlihat.
 */
export function DocUsage({
  code,
  label = 'React',
  title,
  description,
  flush,
}: {
  code: ReactNode
  label?: string
  title?: string
  description?: ReactNode
  /** Tanpa margin atas — dipakai bila section pemanggil sudah mengatur jaraknya. */
  flush?: boolean
}) {
  const text = nodeText(code).trim()
  const [copied, copy] = useCopy(text)

  return (
    <div className={flush ? undefined : title ? 'mt-8' : 'mt-4'}>
      {title && (
        <div className="mb-5">
          <p className="ds-eyebrow">Cara pakai</p>
          <h3 className="mt-2 text-heading-3 font-black text-gray-900">{title}</h3>
          {description && <p className="mt-2 max-w-2xl text-body-sm text-gray-500">{description}</p>}
        </div>
      )}

      <article className="ds-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border bg-surface-subtle px-4 py-2.5">
          <span className="text-[11px] font-black tracking-[0.14em] text-gray-400 uppercase">{label}</span>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            aria-label={copied ? 'Kode tersalin' : 'Salin kode'}
          >
            {copied ? (
              <svg className="size-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4.5 4.5L19 7" />
              </svg>
            ) : (
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V5.5A1.5 1.5 0 0 1 10.5 4h8A1.5 1.5 0 0 1 20 5.5v8a1.5 1.5 0 0 1-1.5 1.5H15M5.5 9h8A1.5 1.5 0 0 1 15 10.5v8a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 4 18.5v-8A1.5 1.5 0 0 1 5.5 9Z" />
              </svg>
            )}
            <span>{copied ? 'Tersalin!' : 'Salin'}</span>
          </button>
        </div>
        <pre className="ds-scroll-x overflow-x-auto bg-gray-900 p-5 text-xs leading-6 text-gray-300">
          <code>{typeof code === 'string' ? text : code}</code>
        </pre>
      </article>
    </div>
  )
}
