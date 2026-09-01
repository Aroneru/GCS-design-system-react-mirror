import { useState } from "react";
import { ChevronDown } from "flowbite-react-icons/outline";
import { cn } from "../../utils/cn";
import type { SidebarGroup, SidebarItem } from "./SidebarTypes";

interface SidebarNavigationProps {
  /** `groups` diprioritaskan bila kedua prop tersedia. */
  groups?: SidebarGroup[];
  items?: SidebarItem[];
  collapsed: boolean;
}

function MenuItem({ item, collapsed }: { item: SidebarItem; collapsed: boolean }) {
  const hasChildren = Boolean(item.children?.length);
  const [open, setOpen] = useState(Boolean(item.defaultOpen || item.active));
  const itemId = item.id ?? item.label;
  const className = cn(
    "flex w-full rounded-lg text-sm font-medium text-gray-700 transition-colors",
    "hover:bg-gray-50 hover:text-gray-900",
    collapsed ? "justify-center px-2 py-2.5" : "items-center gap-3 px-3 py-2.5",
    item.active && "bg-gray-50 text-gray-900",
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
      >
        {item.icon && (
          <span className="flex size-5 shrink-0 items-center justify-center">{item.icon}</span>
        )}
        {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
        {!collapsed && item.badge != null && (
          <span className="flex min-w-5 shrink-0 items-center justify-center rounded-full bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-600">
            {item.badge}
          </span>
        )}
      </a>
    );
  }

  return (
    <div>
      <button
        type="button"
        className={className}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={`sidebar-submenu-${itemId}`}
        disabled={item.disabled || item.submenuToggleDisabled}
        aria-disabled={item.disabled || item.submenuToggleDisabled || undefined}
        title={collapsed ? item.label : undefined}
      >
        {item.icon && (
          <span className="flex size-5 shrink-0 items-center justify-center">{item.icon}</span>
        )}
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
            {item.badge != null && (
              <span className="flex min-w-5 shrink-0 items-center justify-center rounded-full bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-600">
                {item.badge}
              </span>
            )}
            <ChevronDown className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")} />
          </>
        )}
      </button>

      {!collapsed && open && (
        <ul id={`sidebar-submenu-${itemId}`} className="mt-1 space-y-1 pl-8">
          {item.children?.map((child) => (
            <li key={child.id ?? child.label}>
              <a
                href={child.disabled ? undefined : child.href ?? "#"}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors",
                  "hover:bg-gray-50 hover:text-gray-900",
                  child.active && "bg-gray-50 font-medium text-gray-900",
                  child.disabled && "pointer-events-none cursor-not-allowed opacity-50",
                )}
                aria-current={child.active ? "page" : undefined}
                aria-disabled={child.disabled || undefined}
              >
                {child.icon && <span className="flex size-4 shrink-0 items-center justify-center">{child.icon}</span>}
                <span className="truncate">{child.label}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Navigasi Sidebar, termasuk grup menu dan separator antarkonten. */
export function SidebarNavigation({ groups, items, collapsed }: SidebarNavigationProps) {
  const resolvedGroups: SidebarGroup[] = groups?.length
    ? groups
    : [{ id: "default", items: items ?? [] }];

  return (
    <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-3" aria-label="Navigasi sidebar">
      {resolvedGroups.map((group) => (
        <section
          key={group.id}
          className={cn(group.separator && "mt-3 border-t border-gray-200 pt-3")}
          aria-label={group.label}
        >
          {!collapsed && group.label && (
            <h2 className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {group.label}
            </h2>
          )}
          <ul className="space-y-1">
            {group.items.map((item) => (
              <li key={item.id ?? item.label}>
                <MenuItem item={item} collapsed={collapsed} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
