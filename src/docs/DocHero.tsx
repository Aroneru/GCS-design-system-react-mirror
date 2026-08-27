import { type ReactNode } from 'react'

export function DocHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <header className="border-b border-border bg-white px-5 py-10 sm:px-8 lg:px-12 lg:py-12 xl:px-14">
      <div className="mx-auto max-w-5xl">
        {eyebrow && <p className="ds-eyebrow">{eyebrow}</p>}
        <h1 className="mt-2 text-heading-1 font-black tracking-tight text-gray-900">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-body text-gray-500">{description}</p>}
        {children}
      </div>
    </header>
  )
}
