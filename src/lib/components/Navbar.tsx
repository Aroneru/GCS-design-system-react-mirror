import {
  type HTMLAttributes,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  type MouseEventHandler,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Bell } from "flowbite-react-icons/solid";
import { ArrowRightToBracket, Bars, Edit, List } from "../icons/outline";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { cn } from "../utils/cn";
import { NavbarNavigation } from "./navbar/NavbarNavigation";
import { NavbarMobilePanel } from "./navbar/NavbarMobilePanel";
import { NavbarUserMenu } from "./navbar/NavbarUserMenu";

interface NavbarItemBase {
  id: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
}

export interface NavbarSubItem extends NavbarItemBase {
  href: string;
  external?: boolean;
}

export type NavbarItem =
  | (NavbarItemBase & {
      href: string;
      external?: boolean;
      children?: never;
    })
  | (NavbarItemBase & {
      href: string;
      external?: boolean;
      children: NavbarSubItem[];
    })
  | (NavbarItemBase & {
      href?: never;
      external?: never;
      children: NavbarSubItem[];
    });

interface NavbarSearchBase {
  onSubmit: (query: string, event: FormEvent<HTMLFormElement>) => void;
  onValueChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  autoComplete?: string;
}

export type NavbarSearchConfig = NavbarSearchBase &
  (
    | {
        value: string;
        defaultValue?: never;
      }
    | {
        value?: never;
        defaultValue?: string;
      }
  );

interface NavbarActionBase {
  label: string;
}

export type NavbarAction =
  | (NavbarActionBase & {
      href: string;
      external?: boolean;
      onClick?: never;
    })
  | (NavbarActionBase & {
      href?: never;
      external?: never;
      onClick: MouseEventHandler<HTMLButtonElement>;
    });

export interface NavbarGuestActions {
  login?: NavbarAction;
  register?: NavbarAction;
}

export interface NavbarUser {
  name: string;
  avatarSrc?: string;
  avatarAlt?: string;
  initials?: string;
  items?: NavbarSubItem[];
}

interface NavbarNotificationBase {
  unread: boolean | number;
  label?: string;
}

export type NavbarNotification =
  | (NavbarNotificationBase & {
      href: string;
      external?: boolean;
      onClick?: never;
    })
  | (NavbarNotificationBase & {
      href?: never;
      external?: never;
      onClick: MouseEventHandler<HTMLButtonElement>;
    });

export type NavbarMenuPosition = "left" | "right";

const mobileNavigationTriggerClasses =
  "grid size-10 shrink-0 place-items-center rounded-lg text-content transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600";

type NavbarSectionItem = Extract<NavbarItem, { children: NavbarSubItem[] }>;
type NavbarContextItem = Extract<
  NavbarItem,
  { href: string; children: NavbarSubItem[] }
>;

function isNavbarSectionItem(item: NavbarItem): item is NavbarSectionItem {
  return Array.isArray(item.children) && item.children.length > 0;
}

function isNavbarContextItem(item: NavbarItem): item is NavbarContextItem {
  return typeof item.href === "string" && isNavbarSectionItem(item);
}

function findActivePrimaryItem(items: NavbarItem[], activeHref?: string) {
  return items.find((item) => {
    if (item.disabled) return false;
    if (item.active) return true;
    if (typeof item.href === "string" && item.href === activeHref) return true;

    return (
      isNavbarSectionItem(item) &&
      item.children.some((child) => !child.disabled && child.href === activeHref)
    );
  });
}

interface NavbarPropsBase extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  brand: ReactNode;
  brandLabel: string;
  brandHref?: string;
  items: NavbarItem[];
  activeHref?: string;
  search?: NavbarSearchConfig;
  guestActions?: NavbarGuestActions;
  user?: NavbarUser;
  notification?: NavbarNotification;
  menuPosition?: NavbarMenuPosition;
  ariaLabel?: string;
  onNavigate?: (
    item: NavbarItem | NavbarSubItem,
    event: ReactMouseEvent<HTMLAnchorElement>,
  ) => void;
  onMobileOpenChange?: (open: boolean) => void;
}

export type NavbarProps = NavbarPropsBase &
  (
    | {
        mobileOpen: boolean;
        defaultMobileOpen?: never;
      }
    | {
        mobileOpen?: never;
        defaultMobileOpen?: boolean;
      }
  );

function GuestAction({
  action,
  variant,
  onAction,
}: {
  action: NavbarAction;
  variant: "primary" | "secondary";
  onAction?: () => void;
}) {
  const icon =
    variant === "secondary" ? (
      <Icon className="size-[14px]">
        <ArrowRightToBracket aria-hidden="true" focusable="false" />
      </Icon>
    ) : (
      <Icon className="size-[14px]">
        <Edit aria-hidden="true" focusable="false" />
      </Icon>
    );

  const buttonVariant = variant === "primary" ? "filled" : "outline";

  if (action.href !== undefined) {
    return (
      <Button
        as="a"
        href={action.href}
        variant={buttonVariant}
        theme="primary"
        tone="light"
        size="base"
        onClick={onAction}
        {...(action.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      >
        {icon}
        {action.label}
      </Button>
    );
  }

  return (
    <Button
      variant={buttonVariant}
      theme="primary"
      tone="light"
      size="base"
      onClick={(event) => {
        action.onClick(event);
        onAction?.();
      }}
    >
      {icon}
      {action.label}
    </Button>
  );
}

// Boundary internal: ganti dengan primitive Search resmi tanpa mengubah NavbarSearchConfig.
function NavbarSearchForm({
  search,
  inputId,
  value,
  className,
  onSubmit,
  onValueChange,
}: {
  search: NavbarSearchConfig;
  inputId: string;
  value: string;
  className?: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onValueChange: (value: string) => void;
}) {
  return (
    <form role="search" className={cn("relative", className)} onSubmit={onSubmit}>
      <label htmlFor={inputId} className="sr-only">
        {search.label ?? "Cari"}
      </label>
      <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-content-subtle">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="m16 16 4 4" />
        </svg>
      </Icon>
      <input
        id={inputId}
        type="search"
        name={search.name ?? "search"}
        value={value}
        placeholder={search.placeholder ?? "Search Civitas, Organisasi ..."}
        autoComplete={search.autoComplete ?? "off"}
        disabled={search.disabled}
        className="box-border h-[37px] w-full rounded-lg border border-gray-300 bg-surface-subtle py-0 pr-3 pl-9 text-sm leading-[21px] font-medium text-content placeholder:text-content-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
        onChange={(event) => onValueChange(event.currentTarget.value)}
      />
    </form>
  );
}

function NotificationControl({
  notification,
  className,
  onAction,
}: {
  notification: NavbarNotification;
  className?: string;
  onAction?: () => void;
}) {
  const accessibleLabel = notification.label?.trim() || "Notifikasi";
  const content = (
    <Icon className="size-5">
      <Bell aria-hidden="true" focusable="false" />
    </Icon>
  );
  const classes = cn(
    "inline-flex size-10 shrink-0 items-center justify-center text-content transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600",
    className,
  );

  if (notification.href !== undefined) {
    return (
      <a
        href={notification.href}
        className={classes}
        aria-label={accessibleLabel}
        onClick={onAction}
        {...(notification.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      aria-label={accessibleLabel}
      onClick={(event) => {
        notification.onClick(event);
        onAction?.();
      }}
    >
      {content}
    </button>
  );
}

/** Navbar utama dengan root full-width dan wrapper layout internal. */
export function Navbar({
  brand,
  brandLabel,
  brandHref = "/",
  items,
  activeHref,
  search,
  guestActions,
  user,
  notification,
  menuPosition = "right",
  ariaLabel = "Navigasi utama",
  onNavigate,
  mobileOpen,
  defaultMobileOpen = false,
  onMobileOpenChange,
  className,
  ...props
}: NavbarProps) {
  const searchInputId = useId();
  const mobileSearchInputId = useId();
  const navigationId = useId();
  const userMenuId = useId();
  const mobilePanelId = useId();
  const mobileDrawerId = useId();
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mobileDrawerTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileSidebarCloseRef = useRef<HTMLButtonElement>(null);
  const mobileDrawerCloseRef = useRef<HTMLButtonElement>(null);
  const previousUserPresentRef = useRef(user !== undefined);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [uncontrolledMobileOpen, setUncontrolledMobileOpen] = useState(defaultMobileOpen);
  const [openMobileDrawerItemId, setOpenMobileDrawerItemId] = useState<string | null>(null);
  const [uncontrolledSearchValue, setUncontrolledSearchValue] = useState(
    () => search?.defaultValue ?? "",
  );
  const searchValue = search?.value ?? uncontrolledSearchValue;
  const isMobileControlled = mobileOpen !== undefined;
  const isMobileOpen = isMobileControlled ? mobileOpen : uncontrolledMobileOpen;
  const showGuestActions = !user && Boolean(guestActions?.login || guestActions?.register);
  const activePrimaryItem = findActivePrimaryItem(items, activeHref);
  const activeMobileSection =
    activePrimaryItem && isNavbarContextItem(activePrimaryItem) ? activePrimaryItem : undefined;
  const openMobileDrawerItem = items.find(
    (item): item is NavbarContextItem =>
      isNavbarContextItem(item) && item.id === openMobileDrawerItemId && !item.disabled,
  );
  const mobileDrawerOpen = openMobileDrawerItem !== undefined;

  const handleNavigationMenuChange = useCallback((itemId: string | null) => {
    setOpenMenuId(itemId);
    if (itemId !== null) setUserMenuOpen(false);
  }, []);
  const handleUserMenuChange = useCallback((open: boolean) => {
    setUserMenuOpen(open);
    if (open) setOpenMenuId(null);
  }, []);
  const handleMobileOpenChange = useCallback(
    (open: boolean) => {
      if (open === isMobileOpen) return;

      if (!isMobileControlled) setUncontrolledMobileOpen(open);
      onMobileOpenChange?.(open);

      if (open) {
        setOpenMenuId(null);
        setUserMenuOpen(false);
        setOpenMobileDrawerItemId(null);
      }
    },
    [isMobileControlled, isMobileOpen, onMobileOpenChange],
  );
  const handleMobileDrawerClose = useCallback(() => {
    setOpenMobileDrawerItemId(null);
    window.setTimeout(() => mobileDrawerTriggerRef.current?.focus(), 50);
  }, []);
  const handleSearchSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const query = searchValue.trim();

      if (!search || search.disabled || query.length === 0) return;
      search.onSubmit(query, event);
    },
    [search, searchValue],
  );
  const handleSearchValueChange = useCallback(
    (value: string) => {
      if (!search) return;

      if (search.value === undefined) setUncontrolledSearchValue(value);
      search.onValueChange?.(value);
    },
    [search],
  );

  useEffect(() => {
    const userPresent = user !== undefined;
    const userWasRemoved = previousUserPresentRef.current && !userPresent;

    previousUserPresentRef.current = userPresent;
    if (!userWasRemoved) return;

    const closeUserMenuTimer = window.setTimeout(() => setUserMenuOpen(false), 0);
    return () => window.clearTimeout(closeUserMenuTimer);
  }, [user]);

  useEffect(() => {
    if (!isMobileOpen && !mobileDrawerOpen) return;

    const closeFromEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      event.preventDefault();
      if (mobileDrawerOpen) {
        handleMobileDrawerClose();
        return;
      }

      handleMobileOpenChange(false);
      hamburgerRef.current?.focus();
    };

    document.addEventListener("keydown", closeFromEscape);
    return () => document.removeEventListener("keydown", closeFromEscape);
  }, [handleMobileDrawerClose, handleMobileOpenChange, isMobileOpen, mobileDrawerOpen]);

  useEffect(() => {
    if (!isMobileOpen && !mobileDrawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileOpen, mobileDrawerOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    const synchronizeDesktop = () => {
      if (!desktopQuery.matches) return;

      if (isMobileOpen) handleMobileOpenChange(false);
      setOpenMobileDrawerItemId(null);
      setOpenMenuId(null);
      setUserMenuOpen(false);
    };

    synchronizeDesktop();
    desktopQuery.addEventListener("change", synchronizeDesktop);
    return () => desktopQuery.removeEventListener("change", synchronizeDesktop);
  }, [handleMobileOpenChange, isMobileOpen]);

  return (
    <header className={cn("w-full text-content", className)} {...props}>
      <div className="border-b border-border bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          <div className="flex w-full min-w-0 items-center pt-4 pb-0 lg:h-[93px] lg:gap-4 lg:py-0 2xl:gap-6">
          <a
            href={brandHref}
            className="inline-flex shrink-0 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            aria-label={brandLabel}
          >
            {brand}
          </a>
          {search && (
            <NavbarSearchForm
              search={search}
              inputId={searchInputId}
              value={searchValue}
              className="hidden w-[348px] shrink-0 lg:block"
              onSubmit={handleSearchSubmit}
              onValueChange={handleSearchValueChange}
            />
          )}
          <div
            className={cn(
              "ml-auto flex min-w-0 items-center lg:gap-4 2xl:gap-6",
              !user && menuPosition === "left" && "lg:flex-1 lg:justify-between",
            )}
          >
            <NavbarNavigation
              items={items}
              activeHref={activeHref}
              ariaLabel={ariaLabel}
              idPrefix={navigationId}
              openMenuId={openMenuId}
              onOpenMenuChange={handleNavigationMenuChange}
              onNavigate={onNavigate}
            />
            {showGuestActions && guestActions && (
              <div className="hidden shrink-0 items-center gap-2 lg:flex">
                {guestActions.login && (
                  <GuestAction action={guestActions.login} variant="secondary" />
                )}
                {guestActions.register && (
                  <GuestAction action={guestActions.register} variant="primary" />
                )}
              </div>
            )}
            {user && (
              <div className="flex min-w-0 shrink-0 items-center gap-1">
                {notification && (
                  <div className="hidden lg:block">
                    <NotificationControl notification={notification} />
                  </div>
                )}
                <NavbarUserMenu
                  user={user}
                  activeHref={activeHref}
                  menuId={userMenuId}
                  open={userMenuOpen}
                  onOpenChange={handleUserMenuChange}
                  onNavigate={onNavigate}
                />
              </div>
            )}
          </div>
          <button
            ref={hamburgerRef}
            type="button"
            className={cn(
              mobileNavigationTriggerClasses,
              "lg:hidden",
              user ? "ml-2" : "ml-auto",
            )}
            aria-label={isMobileOpen ? "Tutup navigasi utama" : "Buka navigasi utama"}
            aria-expanded={isMobileOpen}
            aria-controls={mobilePanelId}
            onClick={() => {
              const nextOpen = !isMobileOpen;
              handleMobileOpenChange(nextOpen);
              if (nextOpen) window.setTimeout(() => mobileSidebarCloseRef.current?.focus(), 50);
            }}
          >
            <Icon className="size-4">
              <Bars aria-hidden="true" focusable="false" />
            </Icon>
          </button>
          </div>

          {search && (
            <div className="mt-4 pb-4 lg:hidden">
              <NavbarSearchForm
                search={search}
                inputId={mobileSearchInputId}
                value={searchValue}
                className="w-full"
                onSubmit={handleSearchSubmit}
                onValueChange={handleSearchValueChange}
              />
            </div>
          )}
        </div>
      </div>

      {activeMobileSection && (
        <div className="mx-auto flex w-full max-w-7xl justify-end px-4 py-3 lg:hidden">
          <button
            ref={mobileDrawerTriggerRef}
            type="button"
            className={mobileNavigationTriggerClasses}
            aria-label={`${mobileDrawerOpen ? "Tutup" : "Buka"} navigasi sekunder ${activeMobileSection.label}`}
            aria-expanded={mobileDrawerOpen}
            aria-controls={mobileDrawerId}
            onClick={() => {
              if (mobileDrawerOpen) {
                handleMobileDrawerClose();
                return;
              }

              setOpenMobileDrawerItemId(activeMobileSection.id);
              window.setTimeout(() => mobileDrawerCloseRef.current?.focus(), 50);
            }}
          >
            <Icon className="size-5">
              <List aria-hidden="true" focusable="false" />
            </Icon>
          </button>
        </div>
      )}

      <NavbarMobilePanel
          sidebarId={mobilePanelId}
          drawerId={mobileDrawerId}
          sidebarOpen={isMobileOpen}
          drawerItem={openMobileDrawerItem}
          sidebarCloseRef={mobileSidebarCloseRef}
          drawerCloseRef={mobileDrawerCloseRef}
          items={items}
          activeHref={activeHref}
          ariaLabel={ariaLabel}
          onDrawerClose={handleMobileDrawerClose}
          onNavigate={onNavigate}
          onSidebarClose={() => {
            handleMobileOpenChange(false);
            hamburgerRef.current?.focus();
          }}
          guestActionsContent={
            showGuestActions && guestActions ? (
              <div className="flex flex-col gap-2 border-t border-border pt-4">
                {guestActions.login && (
                  <GuestAction
                    action={guestActions.login}
                    variant="secondary"
                    onAction={() => handleMobileOpenChange(false)}
                  />
                )}
                {guestActions.register && (
                  <GuestAction
                    action={guestActions.register}
                    variant="primary"
                    onAction={() => handleMobileOpenChange(false)}
                  />
                )}
              </div>
            ) : undefined
          }
          user={user}
      />
    </header>
  );
}
