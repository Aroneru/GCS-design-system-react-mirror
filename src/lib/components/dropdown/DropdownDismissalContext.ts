import { createContext } from 'react'

export interface DropdownDismissalScopeValue {
  register: (close: () => void) => () => void
}

/** @internal Koordinasi dismissal antar-komponen tanpa mengekspos DOM Dropdown. */
export const DropdownDismissalContext = createContext<DropdownDismissalScopeValue | null>(null)
