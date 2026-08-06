// @tpl/design-kit-react — entry point library.
// Import token/CSS terpisah: import '@tpl/design-kit-react/styles.css'

export { Button } from './components/Button'
export type { ButtonProps, ButtonVariant } from './components/Button'

export { Badge } from './components/Badge'
export type { BadgeProps, BadgeVariant } from './components/Badge'

export { Card } from './components/Card'
export type { CardProps } from './components/Card'

export { Container } from './components/Container'
export type { ContainerProps } from './components/Container'

export { Icon } from './components/Icon'
export type { IconProps } from './components/Icon'

export { InputField } from './components/InputField'
export type {
  InputFieldProps,
  InputFieldPlatform,
  InputFieldState,
  InputFieldApplication,
} from './components/InputField'

export { FloatingLabel } from './components/FloatingLabel'
export type {
  FloatingLabelProps,
  FloatingLabelPlatform,
  FloatingLabelState,
  FloatingLabelApplication,
} from './components/FloatingLabel'

// Logo brand & sosial — dipakai sebagai <Github className="size-5" />.
export * from './brandIcons'
export { brandIcons } from './brandIconRegistry'

export { Footer } from './components/Footer'
export type { FooterProps, FooterMenu, FooterSocial } from './components/Footer'

export { cn } from './utils/cn'
