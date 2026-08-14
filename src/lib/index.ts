// @tpl/design-kit-react — entry point library.
// Import token/CSS terpisah: import '@tpl/design-kit-react/styles.css'

export { Button } from "./components/Button";

export type {
  ButtonProps,
  ButtonSize,
  ButtonVariant,
  ButtonTheme,
  ButtonTone,
} from "./components/Button";

export { Badge } from "./components/Badge";
export type { BadgeProps, BadgeVariant } from "./components/Badge";

export { Alert } from "./components/Alert";
export type { AlertProps, AlertVariant, AlertSurface } from "./components/Alert";

export { Toast } from "./components/Toast";
export type { ToastProps, ToastVariant } from "./components/Toast";

export { Card } from "./components/Card";
export type { CardProps } from "./components/Card";

export { Container } from "./components/Container";
export type { ContainerProps } from "./components/Container";

export { Icon } from "./components/Icon";
export type { IconProps } from "./components/Icon";

export { InputField } from "./components/InputField";
export type {
  InputFieldProps,
  InputFieldPlatform,
  InputFieldState,
  InputFieldApplication,
} from "./components/InputField";

export { TextArea } from "./components/TextArea";
export type {
  TextAreaProps,
  TextAreaType,
  TextAreaPlatform,
  TextAreaApplication,
  TextAreaToolbarAction,
} from "./components/TextArea";

export { FloatingLabel } from "./components/FloatingLabel";
export type {
  FloatingLabelProps,
  FloatingLabelPlatform,
  FloatingLabelState,
  FloatingLabelApplication,
} from "./components/FloatingLabel";

export { Select } from "./components/Select";
export type {
  SelectProps,
  SelectOption,
  SelectState,
  SelectApplication,
} from "./components/Select";

export { Radio } from "./components/Radio";
export type { RadioProps, RadioPlatform, RadioState, RadioApplication } from "./components/Radio";

export { Toggle } from "./components/Toggle";
export type {
  ToggleProps,
  TogglePlatform,
  ToggleState,
  ToggleApplication,
} from "./components/Toggle";

export { Checkbox } from "./components/Checkbox";
export type {
  CheckboxProps,
  CheckboxPlatform,
  CheckboxState,
  CheckboxApplication,
} from "./components/Checkbox";

// Logo brand & sosial — dipakai sebagai <Github className="size-5" />.
export * from "./brandIcons";
export { brandIcons } from "./brandIconRegistry";

export { Footer } from "./components/Footer";
export type { FooterProps, FooterMenu, FooterSocial } from "./components/Footer";

export { Navbar } from "./components/Navbar";
export type {
  NavbarProps,
  NavbarItem,
  NavbarContextItem,
  NavbarSubItem,
  NavbarSearchConfig,
  NavbarAction,
  NavbarGuestActions,
  NavbarUser,
  NavbarNotification,
  NavbarMenuPosition,
  NavbarVariant,
} from "./components/Navbar";

export { cn } from "./utils/cn";
