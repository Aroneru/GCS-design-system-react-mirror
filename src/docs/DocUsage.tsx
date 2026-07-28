import { useState } from 'react'

/** Kartu cuplikan kode dengan tombol salin — port dari x-doc-usage. */
export function DocUsage({ code, label = 'React' }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const trimmed = code.trim()

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(trimmed)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard tidak tersedia */
    }
  }

  return (
    <div className="mt-4">
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
          <code>{trimmed}</code>
        </pre>
      </article>
    </div>
  )
}
