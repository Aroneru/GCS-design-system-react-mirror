import { useEffect, useId, useState } from "react";
import { ChevronDown } from "flowbite-react-icons/outline";
import { cn } from "../../utils/cn";
import type { SidebarGroup, SidebarItem } from "./SidebarTypes";

interface SidebarNavigationProps {
  /** `groups` diprioritaskan bila kedua prop tersedia. */
  groups?: SidebarGroup[];
  items?: SidebarItem[];
  collapsed: boolean;
  /** Meminta Sidebar induk dibuka sebelum submenu dapat ditampilkan. */
  onExpandSidebar?: () => void;
  darkMode?: boolean;
}

function MenuItem({
  item,
  collapsed,
  onExpandSidebar,
}: {
  item: SidebarItem;
  collapsed: boolean;
  onExpandSidebar?: () => void;
  darkMode?: boolean;
}) {
  const hasChildren = Boolean(item.children?.length);
  const hasActiveChild = Boolean(item.children?.some((child) => child.active));
  const [open, setOpen] = useState(Boolean(item.defaultOpen || item.active || hasActiveChild));
  const submenuId = `sidebar-submenu-${useId()}`;

  // Ketika navigasi berubah (mis. setelah route change), lokasi aktif harus
  // tetap terlihat tanpa consumer perlu mengatur defaultOpen secara manual.
  useEffect(() => {
    if (item.active || hasActiveChild) setOpen(true);
  }, [hasActiveChild, item.active]);
  const className = cn(
    "group flex w-full rounded-lg text-sm font-medium transition-colors",
    "text-content hover:bg-gray-100 in-data-[theme=dark]:hover:bg-gray-600",
    collapsed ? "justify-center px-2 py-2.5" : "items-center gap-3 px-3 py-2.5",
    item.active && "bg-gray-100 in-data-[theme=dark]:bg-gray-600 text-content",
    item.disabled && "pointer-events-none cursor-not-allowed opacity-50",
  );

  if (!hasChildren) {
    return (
      <a
        href={item.disabled ? undefined : item.href ?? "#"}
        className={className}
        aria-current={item.active ? "page" : undefined}
        aria-disabled={item.disabled || undefined}
        title={collapsed ? item.label : undefined}
        onClick={(e) => {
          if (!item.href || item.href === "#") {
            e.preventDefault();
          }
          item.onClick?.(e);
        }}
        {...(item.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      >
        {item.icon && (
          <span
            className={cn(
              "flex size-5 shrink-0 items-center justify-center transition-colors [&>svg]:size-5",
              item.active 
                ? "text-content" 
                : "text-content-muted group-hover:text-content",
            )}
          >
            {item.icon}
          </span>
        )}
        {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
        {!collapsed && item.badge != null && (
          <span className="flex min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-600 in-data-[theme=dark]:bg-surface in-data-[theme=dark]:text-red-400">
            {item.badge}
          </span>
        )}
      </a>
    );
  }

  const toggleDisabled = Boolean(item.disabled || item.submenuToggleDisabled || (collapsed && !onExpandSidebar));
  const handleSubmenuToggle = () => {
    // Submenu tidak dirender saat ringkas. Bila Sidebar dapat dikendalikan,
    // buka dulu agar klik ikon memiliki hasil yang terlihat.
    if (collapsed) {
      onExpandSidebar?.();
      return;
    }
    setOpen((current) => !current);
  };

  return (
    <div>
      <button
        type="button"
        className={className}
        onClick={handleSubmenuToggle}
        aria-expanded={collapsed ? undefined : open}
        aria-controls={collapsed ? undefined : submenuId}
        aria-label={collapsed ? `Buka sidebar untuk melihat submenu ${item.label}` : undefined}
        disabled={toggleDisabled}
        aria-disabled={toggleDisabled || undefined}
        title={collapsed ? item.label : undefined}
      >
        {item.icon && (
          <span
            className={cn(
              "flex size-5 shrink-0 items-center justify-center transition-colors [&>svg]:size-5",
              item.active 
                ? "text-content" 
                : "text-content-muted group-hover:text-content",
            )}
          >
            {item.icon}
          </span>
        )}
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
            {item.badge != null && (
              <span className="flex min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-600 in-data-[theme=dark]:bg-surface in-data-[theme=dark]:text-red-400">
                {item.badge}
              </span>
            )}
            <ChevronDown
              className={cn(
                "w-[28px] h-[28px] shrink-0 text-content transition-transform",
                open && "rotate-180",
              )}
            />
          </>
        )}
      </button>

      {!collapsed && open && (
        <ul id={submenuId} className="mt-1 space-y-1 pl-8">
          {item.children?.map((child) => (
            <li key={child.id ?? child.label}>
              <a
                href={child.disabled ? undefined : child.href ?? "#"}
                className={cn(
                  "group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  "text-content-subtle hover:bg-gray-100 hover:text-content in-data-[theme=dark]:hover:bg-gray-600",
                  child.active && "bg-gray-100 font-medium text-content in-data-[theme=dark]:bg-gray-600",
                  child.disabled && "pointer-events-none cursor-not-allowed opacity-50",
                )}
                aria-current={child.active ? "page" : undefined}
                aria-disabled={child.disabled || undefined}
                onClick={(e) => {
                  if (!child.href || child.href === "#") {
                    e.preventDefault();
                  }
                  child.onClick?.(e);
                }}
                {...(child.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
              >
                {child.icon && (
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center transition-colors [&>svg]:size-5",
                      child.active 
                        ? "text-content" 
                        : "text-content-muted group-hover:text-content",
                    )}
                  >
                    {child.icon}
                  </span>
                )}
                <span className="truncate">{child.label}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SidebarNavigation({ groups, items, collapsed, onExpandSidebar, darkMode }: SidebarNavigationProps) {
  const resolvedGroups: SidebarGroup[] = groups?.length
    ? groups
    : [{ id: "default", items: items ?? [] }];

  return (
    <nav
      className="ds-scroll-y min-h-0 flex-1 overflow-y-auto px-3 py-3"
      aria-label="Navigasi sidebar"
    >
      {resolvedGroups.map((group) => (
        <section
          key={group.id}
          className={cn(group.separator && "mt-3 border-t border-border pt-3")}
          aria-label={group.label}
        >
          {!collapsed && group.label && (
            <h2 className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-content-muted">
              {group.label}
            </h2>
          )}
          <ul className="space-y-1">
            {group.items.map((item) => (
              <li key={item.id ?? item.label}>
                <MenuItem item={item} collapsed={collapsed} onExpandSidebar={onExpandSidebar} darkMode={darkMode} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
