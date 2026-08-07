import { uiSvgs } from './svgAssets'

/** Merender markup SVG inline dengan ukuran diatur lewat className. */
export function RawIcon({ svg, className = 'size-5' }: { svg: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center [&>svg]:size-full ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

/** Ikon "messages" — dipakai pada tombol contoh di halaman Card. */
export function MessagesIcon({ className = 'size-4' }: { className?: string }) {
  return <RawIcon svg={uiSvgs.messages} className={className} />
}
