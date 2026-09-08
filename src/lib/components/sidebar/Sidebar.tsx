import { ChevronLeft } from "flowbite-react-icons/outline";
import { cn } from "../../utils/cn";
import { SidebarNavigation } from "./SidebarNavigation";
import type { SidebarProps } from "./SidebarTypes";

export type { SidebarGroup, SidebarItem, SidebarProps, SidebarSubItem, SidebarUser } from "./SidebarTypes";

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
  className,
  ...props
}: SidebarProps) {
  const hasCollapseButton = Boolean(onCollapse || showCollapseButton);
  const hasHeader = Boolean(logo || collapsedLogo || hasCollapseButton);
  const visibleLogo = collapsed ? (collapsedLogo ?? logo) : logo;

  return (
    <aside
      className={cn(
        "flex min-h-screen flex-col border-r border-gray-200 bg-white",
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
                collapsed && "order-2 w-full max-w-full justify-end",
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
                "flex size-8 shrink-0 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-default disabled:hover:bg-transparent",
                collapsed && "order-1",
              )}
            >
              <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
            </button>
          )}
        </header>
      )}

      {/* Profile */}
      {user && (
        <div className={cn("px-4 pb-3", !hasHeader && "pt-4")}>
          <a
            href={user.href ?? "#"}
            className={cn(
              "flex",
              collapsed
                ? "justify-center"
                : "items-center gap-3 rounded-lg bg-primary-50 px-3 py-2.5",
            )}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="size-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700"
                aria-hidden="true"
              >
                {user.name.slice(0, 1).toUpperCase()}
              </span>
            )}

            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>

                <p className="mt-0.5 text-xs text-primary-700">
                  {user.profileLabel ?? "Lihat Profil"}
                </p>
              </div>
            )}
          </a>
        </div>
      )}

      <SidebarNavigation groups={groups} items={items} collapsed={collapsed} />

      {/* `shrink-0`: navigasi di atasnya `flex-1`, jadi tanpa ini footer yang
          ikut menyusut duluan saat menunya panjang. */}
      {footer && <div className="shrink-0 border-t border-gray-200">{footer}</div>}
    </aside>
  );
}

export default Sidebar;
