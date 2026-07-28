import { useEffect, useState } from 'react'

/** Router hash minimalis: #/foundations/colors -> "/foundations/colors". */
export function useHashRoute(): [string, (path: string) => void] {
  const read = () => window.location.hash.replace(/^#/, '') || '/'
  const [path, setPath] = useState(read)

  useEffect(() => {
    const onChange = () => {
      setPath(read())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = (to: string) => {
    window.location.hash = to
  }

  return [path, navigate]
}
