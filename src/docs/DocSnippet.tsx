import { type ReactNode } from 'react'
import { useCopy } from './useCopy'

/**
 * Baris cuplikan: kartu kode gelap + tombol salin, contoh render di sampingnya,
 * dan penjelasan singkat di bawah.
 * Port dari `x-doc-snippet` (resources/views/components/doc-snippet.blade.php).
 */
export function DocSnippet({
  code,
  description,
  preview,
}: {
  code: string
  description?: ReactNode
  preview?: ReactNode
}) {
  const trimmed = code.trim()
  const [copied, copy] = useCopy(trimmed)

  return (
    <article className="ds-card overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Kartu gelap: kode + tombol salin */}
        <div className="relative min-w-0 flex-1 bg-gray-900">
          <button
            type="button"
            onClick={copy}
            className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-1 text-[11px] font-bold text-gray-300 transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label={copied ? 'Kode tersalin' : 'Salin kode'}
          >
            {copied ? (
              <svg className="size-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4.5 4.5L19 7" />
              </svg>
            ) : (
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V5.5A1.5 1.5 0 0 1 10.5 4h8A1.5 1.5 0 0 1 20 5.5v8a1.5 1.5 0 0 1-1.5 1.5H15M5.5 9h8A1.5 1.5 0 0 1 15 10.5v8a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 4 18.5v-8A1.5 1.5 0 0 1 5.5 9Z" />
              </svg>
            )}
            <span>{copied ? 'Tersalin!' : 'Salin'}</span>
          </button>

          <pre className="ds-scroll-x overflow-x-auto py-4 pr-24 pl-4 text-xs leading-6 text-gray-300">
            <code>{trimmed}</code>
          </pre>
        </div>

        {/* Contoh hasil render, di samping kode */}
        {preview && (
          <div className="grid shrink-0 place-items-center border-t border-border bg-surface-subtle px-6 py-5 sm:w-32 sm:border-t-0 sm:border-l">
            {preview}
          </div>
        )}
      </div>

      {description && (
        <div className="border-t border-border px-4 py-3">
          <p className="text-xs leading-5 text-gray-500">{description}</p>
        </div>
      )}
    </article>
  )
}
