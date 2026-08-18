import { type HTMLAttributes, type ReactNode } from "react";
import { ChevronRight } from "flowbite-react-icons/outline";
import { Home } from "flowbite-react-icons/solid";
import { cn } from "../utils/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

export type BreadcrumbSize = "sm" | "base";

export type BreadcrumbBackground = "bg" | "none";

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  size?: BreadcrumbSize;
  background?: BreadcrumbBackground;
}

const sizeClasses: Record<
  BreadcrumbSize,
  {
    text: string;
    separator: string;
  }
> = {
  sm: {
    text: "text-xs",
    separator: "text-xs",
  },
  base: {
    text: "text-sm",
    separator: "text-sm",
  },
};

export function Breadcrumb({
  items,
  separator = <ChevronRight />,
  size = "base",
  background = "none",
  className,
  ...props
}: BreadcrumbProps) {
  const currentSize = sizeClasses[size];

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center",
        background === "bg" && "rounded-lg bg-gray-100 px-4 py-3",
        className,
      )}
      {...props}
    >
      <ol className="flex items-center gap-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isHome = item.label.toLowerCase() === "home";
          const itemIcon = item.icon ?? (isHome ? <Home className="size-4" /> : null);

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-0">
              {!isLast && item.href ? (
                <a
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2",
                    currentSize.text,
                    "text-gray-500 transition-colors hover:text-primary-700",
                  )}
                >
                  {itemIcon && (
                    <span className="flex shrink-0 items-center justify-center">{itemIcon}</span>
                  )}

                  {item.label}
                </a>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    currentSize.text,
                    isLast ? "font-medium text-gray-900" : "text-gray-500",
                  )}
                >
                  {itemIcon && (
                    <span className="flex shrink-0 items-center justify-center">{itemIcon}</span>
                  )}

                  {item.label}
                </span>
              )}

              {!isLast && (
                <span aria-hidden="true" className={cn(currentSize.separator, "text-gray-400")}>
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
