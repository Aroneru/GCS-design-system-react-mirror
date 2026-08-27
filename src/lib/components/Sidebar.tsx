import { type HTMLAttributes, type ReactNode } from "react";
import { ChevronLeft } from "flowbite-react-icons/outline";
import { cn } from "../utils/cn";

export interface SidebarItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface SidebarUser {
  name: string;
  profileLabel?: string;
  avatar?: string;
  href?: string;
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  items: SidebarItem[];
  logo?: ReactNode;
  user?: SidebarUser;
  collapsed?: boolean;
  onCollapse?: () => void;
}

export function Sidebar({
  items,
  logo,
  user,
  collapsed = false,
  onCollapse,
  className,
  ...props
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex min-h-screen flex-col border-r border-gray-200 bg-white",
        "transition-all duration-200",
        collapsed ? "w-[72px]" : "w-[280px]",
        className,
      )}
      {...props}
    >
      {/* Header */}
      <div
        className={cn(
          "flex h-[72px] items-center px-4",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        {!collapsed && <div className="flex items-center">{logo}</div>}

        <button
          type="button"
          aria-label={collapsed ? "Buka sidebar" : "Tutup sidebar"}
          onClick={onCollapse}
          className="flex size-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100"
        >
          <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* Profile */}
      {user && (
        <div className="px-4 pb-3">
          <a
            href={user.href ?? "#"}
            className={cn(
              "flex rounded-lg bg-primary-50",
              collapsed ? "justify-center p-2" : "items-center gap-3 px-3 py-2.5",
            )}
          >
            {user.avatar && (
              <img
                src={user.avatar}
                alt={user.name}
                className="size-9 shrink-0 rounded-full object-cover"
              />
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

      {/* Menu */}
      <nav className="flex-1 px-3 pb-4">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.label}>
              <a
                href={item.href ?? "#"}
                className={cn(
                  "flex rounded-lg text-sm font-medium text-gray-700",
                  "transition-colors hover:bg-gray-50 hover:text-gray-900",
                  collapsed ? "justify-center px-2 py-2.5" : "items-center px-3 py-2.5",
                  item.active && "bg-gray-50 text-gray-900",
                )}
              >
                {!collapsed && item.label}

                {collapsed && (
                  <span className="text-xs font-semibold">{item.label.slice(0, 1)}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
