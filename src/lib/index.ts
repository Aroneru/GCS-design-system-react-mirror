// @ceplok-ui/design-kit-react — entry point library.
// Import token/CSS terpisah: import '@ceplok-ui/design-kit-react/styles.css'

export { Button } from "./components/Button";

export type {
  ButtonProps,
  ButtonSize,
  ButtonVariant,
  ButtonTheme,
  ButtonTone,
} from "./components/Button";

export { Clipboard } from "./components/Clipboard";
export type { ClipboardProps, ClipboardVariant, ClipboardPlatform } from "./components/Clipboard";

export { Avatar } from "./components/Avatar";
export type { AvatarProps, AvatarSize } from "./components/Avatar";

export { Badge } from "./components/Badge";
export type { BadgeProps, BadgeSize, BadgeVariant } from "./components/Badge";

export { Spinner } from "./components/Spinner";
export type { SpinnerProps, SpinnerSize } from "./components/Spinner";

export { Popover } from "./components/Popover";
export type { PopoverProps, PopoverSide } from "./components/Popover";

export { Dropdown } from "./components/Dropdown";
export type {
  DropdownProps,
  DropdownItem,
  DropdownGroup,
  DropdownItemTone,
} from "./components/Dropdown";

export { Modal } from "./components/Modal";
export type { ModalProps, ModalSize, ModalVariant } from "./components/Modal";

export {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerNavItem,
  DrawerSubItem,
  DrawerTrigger,
} from "./components/Drawer";
export type {
  DrawerProps,
  DrawerPosition,
  DrawerSize,
  DrawerNavItemTheme,
  DrawerHeaderProps,
  DrawerTitleProps,
  DrawerDescriptionProps,
  DrawerBodyProps,
  DrawerFooterProps,
  DrawerNavItemProps,
  DrawerSubItemProps,
  DrawerTriggerProps,
  DrawerMenuItem,
  DrawerMenuSubItem,
} from "./components/Drawer";

export { Alert } from "./components/Alert";
export type { AlertProps, AlertVariant } from "./components/Alert";

export { Toast } from "./components/Toast";
export type { ToastProps, ToastVariant } from "./components/Toast";

export { Card } from "./components/Card";
export type { CardProps } from "./components/Card";

export { Container } from "./components/Container";
export type { ContainerProps, ContainerSize } from "./components/Container";

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

export { Search } from "./components/Search";
export type {
  SearchProps,
  SearchCategory,
  SearchPlatform,
  SearchApplication,
} from "./components/Search";

export { Datepicker } from "./components/Datepicker";
export type {
  DatepickerProps,
  DatepickerSingleProps,
  DatepickerRangeProps,
  DatepickerType,
  DatepickerPlatform,
  DateRange,
} from "./components/Datepicker";

export { Upload } from "./components/Upload";
export type {
  UploadProps,
  UploadType,
  UploadPlatform,
  UploadApplication,
} from "./components/Upload";

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

export { Hero } from "./components/Hero";
export type {
  HeroProps,
  HeroType,
  HeroPlatform,
  HeroImageOrientation,
  HeroCenteredContent,
} from "./components/Hero";

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

export { Breadcrumb } from "./components/Breadcrumb";
export type {
  BreadcrumbProps,
  BreadcrumbItem,
  BreadcrumbSize,
  BreadcrumbBackground,
} from "./components/Breadcrumb";

export { Pagination } from "./components/Pagination";
export type { PaginationProps, PaginationSize, PaginationTheme } from "./components/Pagination";

export { Table, TableImage } from "./components/Table";
export type {
  TableProps,
  TableColumn,
  TableColumnImage,
  TableImageProps,
  TableAlign,
  TableSort,
  TableSortDirection,
  TableSortIcon,
  TableRowAction,
  TableActionTheme,
  TableActionVariant,
  TableActionTone,
  TableActionIconSize,
  TableActionRadius,
  TableSize,
  TableSticky,
  TableSearchConfig,
  TableFilterConfig,
  TablePaginationConfig,
} from "./components/Table";

export { Sidebar } from "./components/sidebar/Sidebar";
export type {
  SidebarGroup,
  SidebarItem,
  SidebarProps,
  SidebarSubItem,
  SidebarUser,
} from "./components/sidebar/Sidebar";

export { cn } from "./utils/cn";
