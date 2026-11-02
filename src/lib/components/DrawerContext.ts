import { createContext } from 'react'

export interface DrawerContextValue {
  onClose: () => void
  titleId: string
  descriptionId: string
  registerTitle: (id: string, isMounted: boolean) => void
  registerDescription: (id: string, isMounted: boolean) => void
  darkMode?: boolean
}

export const DrawerContext = createContext<DrawerContextValue | null>(null)
