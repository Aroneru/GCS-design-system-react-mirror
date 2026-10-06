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
  darkMode = false,
  className,
  ...props
}: SidebarProps) {
  const allItems = groups?.length ? groups.flatMap((g) => g.items) : items;
  const hasMenuIcons = allItems.some(
    (item) => Boolean(item.icon) || Boolean(item.children?.some((child) => Boolean(child.icon))),
  );
  const hasCollapseButton = hasMenuIcons && Boolean(onCollapse || showCollapseButton);
  const hasHeader = Boolean(logo || collapsedLogo || hasCollapseButton);
  const visibleLogo = collapsed ? (collapsedLogo ?? logo) : logo;

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
                // justify-center, bukan justify-end: saat ringkas, kotak isi
                // header hanya 40px (72 - padding) sedangkan logonya 32px, jadi
                // merapat ke kanan menggeser logo 4px dari sumbu rail — meleset
                // dari tombol lipat dan avatar di bawahnya yang sudah di tengah.
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
          <a
            href={user.href ?? "#"}
            onClick={(e) => {
              if (!user.href || user.href === "#") {
                e.preventDefault();
              }
              user.onClick?.(e);
            }}
            className={cn(
              "flex",
              collapsed
                ? "justify-center"
                : cn("items-center gap-3 rounded-lg px-3 py-2.5", darkMode ? "bg-gray-700" : "bg-primary-50"),
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
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  darkMode ? "bg-primary-900 text-primary-300" : "bg-primary-100 text-primary-700"
                )}
                aria-hidden="true"
              >
                {user.name.slice(0, 1).toUpperCase()}
              </span>
            )}

            {!collapsed && (
              <div className="min-w-0">
                <p className={cn("truncate text-sm font-medium", darkMode ? "text-gray-50" : "text-gray-900")}>{user.name}</p>

                <p className={cn("mt-0.5 text-xs", darkMode ? "text-primary-400" : "text-primary-700")}>
                  {user.profileLabel ?? "Lihat Profil"}
                </p>
              </div>
            )}
          </a>
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
