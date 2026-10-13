import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft } from "flowbite-react-icons/outline";
import { cn } from "../../utils/cn";
import { SidebarNavigation } from "./SidebarNavigation";
import type {
  SidebarProps,
  SidebarUser,
  SidebarUserGroup,
} from "./SidebarTypes";

export type {
  SidebarGroup,
  SidebarItem,
  SidebarProps,
  SidebarSubItem,
  SidebarUser,
  SidebarUserGroup,
  SidebarUserItem,
  SidebarUserItemTone,
} from "./SidebarTypes";

function renderUserAvatar(user: SidebarUser, collapsed: boolean, darkMode?: boolean) {
  const avatarSrc = user.avatarSrc ?? user.avatar;
  const initial = user.initials ?? (user.name ? user.name.slice(0, 1).toUpperCase() : "?");

  return avatarSrc ? (
    <img
      src={avatarSrc}
      alt={user.avatarAlt ?? user.name}
      className={cn(
        "size-9 shrink-0 rounded-full object-cover",
        collapsed && "ring-2 ring-transparent transition hover:ring-primary-500",
      )}
    />
  ) : (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition",
        darkMode ? "bg-primary-900 text-primary-300" : "bg-primary-100 text-primary-700",
        collapsed && "hover:ring-2 hover:ring-primary-500",
      )}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

export function Sidebar({
  items = [],
  groups,
  logo,
  collapsedLogo,
  user,
  sticky = false,
  collapsed = false,
  showCollapseButton = false,
  onCollapse,
  footer,
  darkMode = false,
  className,
  ...props
}: SidebarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userTriggerRef = useRef<HTMLButtonElement>(null);

  const allItems = groups?.length ? groups.flatMap((g) => g.items) : items;
  const hasMenuIcons = allItems.some(
    (item) => Boolean(item.icon) || Boolean(item.children?.some((child) => Boolean(child.icon))),
  );
  const hasCollapseButton = hasMenuIcons && Boolean(onCollapse || showCollapseButton);
  const hasHeader = Boolean(logo || collapsedLogo || hasCollapseButton);
  const visibleLogo = collapsed ? (collapsedLogo ?? logo) : logo;

  const userGroups: SidebarUserGroup[] = user?.groups?.length
    ? user.groups
    : user?.items?.length
      ? [{ id: "default", items: user.items }]
      : [];
  const hasUserMenu = Boolean(user && userGroups.some((g) => g.items.length > 0));

  useEffect(() => {
    if (!hasUserMenu && userMenuOpen) {
      setUserMenuOpen(false);
    }
  }, [hasUserMenu, userMenuOpen]);

  useEffect(() => {
    if (userMenuOpen) {
      setUserMenuOpen(false);
    }
  }, [collapsed]);

  useEffect(() => {
    if (!userMenuOpen || !hasUserMenu) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setUserMenuOpen(false);
        userTriggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasUserMenu, userMenuOpen]);

  return (
    <aside
      className={cn(
        "flex min-h-screen flex-col border-r",
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
        "transition-all duration-200",
        sticky && "sticky top-0 h-screen self-start",
        collapsed ? "w-[72px]" : "w-[280px]",
        className,
      )}
      {...props}
    >
      {hasHeader && (
        <header
          className={cn(
            "flex shrink-0 items-center px-4",
            collapsed ? "flex-col gap-3 py-4" : "h-[72px] justify-between",
          )}
        >
          {visibleLogo && (
            <div
              className={cn(
                "flex min-w-0 items-center",
                darkMode ? "text-gray-50" : "text-gray-900",
                collapsed && "order-2 w-full max-w-full justify-center",
              )}
            >
              {visibleLogo}
            </div>
          )}

          {hasCollapseButton && (
            <button
              type="button"
              aria-label={collapsed ? "Buka sidebar" : "Tutup sidebar"}
              onClick={onCollapse}
              disabled={!onCollapse}
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors disabled:cursor-default disabled:hover:bg-transparent",
                darkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100",
                collapsed && "order-1",
              )}
            >
              <ChevronLeft className={cn("w-[28px] h-[28px] shrink-0 text-gray-900 transition-transform", collapsed && "rotate-180")} />
            </button>
          )}
        </header>
      )}

      {/* Profile */}
      {user && (
        <div className={cn("px-4 pb-3", !hasHeader && "pt-4")}>
          <div ref={userMenuRef} className="relative">
            {!hasUserMenu ? (
              <a
                href={user.href ?? "#"}
                onClick={(e) => {
                  if (!user.href || user.href === "#") {
                    e.preventDefault();
                  }
                  user.onClick?.(e);
                }}
                {...(user.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                className={cn(
                  "flex transition-colors",
                  collapsed
                    ? "justify-center"
                    : cn(
                        "items-center gap-3 rounded-lg px-3 py-2.5",
                        darkMode ? "bg-gray-700 hover:bg-gray-600/80" : "bg-primary-50 hover:bg-primary-100/70",
                      ),
                )}
              >
                {renderUserAvatar(user, collapsed, darkMode)}

                {!collapsed && (
                  <div className="min-w-0 flex-1">
                    <p className={cn("truncate text-sm font-medium", darkMode ? "text-gray-50" : "text-gray-900")}>{user.name}</p>

                    <p className={cn("mt-0.5 truncate text-xs", darkMode ? "text-primary-400" : "text-primary-700")}>
                      {user.profileLabel ?? "Lihat Profil"}
                    </p>
                  </div>
                )}
              </a>
            ) : (
              <>
                <button
                  ref={userTriggerRef}
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                  aria-label={`Menu profil ${user.name}`}
                  onClick={(e) => {
                    user.onClick?.(e);
                    setUserMenuOpen((prev) => !prev);
                  }}
                  className={cn(
                    "flex w-full text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600",
                    collapsed
                      ? "justify-center p-0 rounded-full"
                      : cn(
                          "items-center gap-3 rounded-lg px-3 py-2.5",
                          darkMode
                            ? "bg-gray-700 hover:bg-gray-600/80 text-gray-50"
                            : "bg-primary-50 hover:bg-primary-100/70 text-gray-900",
                        ),
                  )}
                >
                  {renderUserAvatar(user, collapsed, darkMode)}

                  {!collapsed && (
                    <>
                      <div className="min-w-0 flex-1">
                        <p className={cn("truncate text-sm font-medium", darkMode ? "text-gray-50" : "text-gray-900")}>
                          {user.name}
                        </p>

                        <p className={cn("mt-0.5 truncate text-xs", darkMode ? "text-primary-400" : "text-primary-700")}>
                          {user.profileLabel ?? "Lihat Profil"}
                        </p>
                      </div>
                      <ChevronDown
                        className={cn(
                          "size-4 shrink-0 transition-transform motion-reduce:transition-none",
                          darkMode ? "text-gray-400" : "text-gray-500",
                          userMenuOpen && "rotate-180",
                        )}
                      />
                    </>
                  )}
                </button>

                {userMenuOpen && (
                  <div
                    role="menu"
                    aria-orientation="vertical"
                    className={cn(
                      "absolute z-50 rounded-lg border py-1.5 shadow-lg",
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-gray-200 shadow-black/40"
                        : "bg-white border-gray-200 text-gray-800 shadow-gray-300/50",
                      collapsed
                        ? "left-[calc(100%+16px)] top-0 w-60"
                        : "left-0 right-0 top-full mt-1.5 w-full",
                    )}
                  >
                    {collapsed && (
                      <div
                        className={cn(
                          "border-b px-3 py-2",
                          darkMode ? "border-gray-700" : "border-gray-100",
                        )}
                      >
                        <p className={cn("truncate text-sm font-semibold", darkMode ? "text-gray-50" : "text-gray-900")}>
                          {user.name}
                        </p>
                        {user.profileLabel && (
                          <p className={cn("mt-0.5 truncate text-xs", darkMode ? "text-gray-400" : "text-gray-500")}>
                            {user.profileLabel}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="py-1">
                      {userGroups.map((group, groupIdx) => (
                        <div key={group.id ?? groupIdx}>
                          {group.separator && (
                            <hr
                              className={cn(
                                "my-1 border-t",
                                darkMode ? "border-gray-700" : "border-gray-100",
                              )}
                            />
                          )}
                          {group.label && (
                            <div
                              className={cn(
                                "px-3 py-1 text-[11px] font-semibold uppercase tracking-wider",
                                darkMode ? "text-gray-400" : "text-gray-500",
                              )}
                            >
                              {group.label}
                            </div>
                          )}
                          {group.items.map((item, itemIdx) => {
                            const isDanger = item.tone === "danger";
                            const itemClasses = cn(
                              "group flex w-full items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors focus-visible:outline-none",
                              item.disabled
                                ? "cursor-not-allowed opacity-50 pointer-events-none"
                                : isDanger
                                ? darkMode
                                  ? "text-red-400 hover:bg-red-950/40 hover:text-red-300 focus-visible:bg-red-950/40"
                                  : "text-red-600 hover:bg-red-50 hover:text-red-700 focus-visible:bg-red-50"
                                : darkMode
                                ? "text-gray-200 hover:bg-gray-700 hover:text-white focus-visible:bg-gray-700"
                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100",
                            );

                            const content = (
                              <>
                                {item.icon && (
                                  <span
                                    className={cn(
                                      "flex size-5 shrink-0 items-center justify-center [&>svg]:size-4",
                                      isDanger
                                        ? darkMode ? "text-red-400" : "text-red-600"
                                        : darkMode ? "text-gray-400 group-hover:text-white" : "text-gray-500 group-hover:text-gray-900",
                                    )}
                                  >
                                    {item.icon}
                                  </span>
                                )}
                                <div className="min-w-0 flex-1">
                                  <span className="block truncate font-medium">{item.label}</span>
                                  {item.description && (
                                    <span
                                      className={cn(
                                        "block truncate text-xs",
                                        darkMode ? "text-gray-400" : "text-gray-500",
                                      )}
                                    >
                                      {item.description}
                                    </span>
                                  )}
                                </div>
                              </>
                            );

                            if (item.href) {
                              return (
                                <a
                                  key={item.id ?? itemIdx}
                                  href={item.disabled ? undefined : item.href}
                                  role="menuitem"
                                  aria-disabled={item.disabled || undefined}
                                  tabIndex={item.disabled ? -1 : 0}
                                  onClick={(e) => {
                                    if (item.disabled) {
                                      e.preventDefault();
                                      return;
                                    }
                                    item.onClick?.(e);
                                    setUserMenuOpen(false);
                                  }}
                                  {...(item.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                                  className={itemClasses}
                                >
                                  {content}
                                </a>
                              );
                            }

                            return (
                              <button
                                key={item.id ?? itemIdx}
                                type="button"
                                role="menuitem"
                                disabled={item.disabled}
                                onClick={(e) => {
                                  if (item.disabled) return;
                                  item.onClick?.(e);
                                  setUserMenuOpen(false);
                                }}
                                className={itemClasses}
                              >
                                {content}
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <SidebarNavigation groups={groups} items={items} collapsed={collapsed} darkMode={darkMode} />

      {/* `shrink-0`: navigasi di atasnya `flex-1`, jadi tanpa ini footer yang
          ikut menyusut duluan saat menunya panjang. */}
      {footer && <div className={cn("shrink-0 border-t", darkMode ? "border-gray-700" : "border-gray-200")}>{footer}</div>}
    </aside>
  );
}

export default Sidebar;
