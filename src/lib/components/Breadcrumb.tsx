import { type HTMLAttributes, type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { ChevronRight } from "../icons/outline";
import { Home } from "../icons/solid";
import { cn } from "../utils/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  icon?: ReactNode;
}

export type BreadcrumbSize = "sm" | "base";

export type BreadcrumbBackground = "bg" | "none";

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  size?: BreadcrumbSize;
  background?: BreadcrumbBackground;
  darkMode?: boolean;
}

type BreadcrumbDisplayEntry =
  | { type: "item"; item: BreadcrumbItem; originalIndex: number }
  | { type: "ellipsis" };

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

const MOBILE_MAX_LABEL_LENGTH = 12;
const DESKTOP_MAX_LABEL_LENGTH = 17;

function truncateLabel(label: string, maxLength: number) {
  return label.length > maxLength
    ? `${label.slice(0, maxLength)}…`
    : label;
}

function ResponsiveLabel({ label }: { label: string }) {
  return (
    <>
      <span className="lg:hidden">{truncateLabel(label, MOBILE_MAX_LABEL_LENGTH)}</span>
      <span className="hidden lg:inline">{truncateLabel(label, DESKTOP_MAX_LABEL_LENGTH)}</span>
    </>
  );
}

export function Breadcrumb({
  items,
  separator = <ChevronRight />,
  size = "base",
  background = "none",
  darkMode = false,
  className,
  ...props
}: BreadcrumbProps) {
  const currentSize = sizeClasses[size];
  const navRef = useRef<HTMLElement>(null);
  const measurementRef = useRef<HTMLOListElement>(null);
  const [collapseMiddle, setCollapseMiddle] = useState(false);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const measurement = measurementRef.current;
    if (!nav || !measurement) return;

    const updateCollapse = () => {
      const style = window.getComputedStyle(nav);
      const horizontalPadding = Number.parseFloat(style.paddingLeft) + Number.parseFloat(style.paddingRight);
      const availableWidth = nav.clientWidth - horizontalPadding;
      const shouldCollapse = items.length > 2 && measurement.scrollWidth > availableWidth;

      setCollapseMiddle((current) => current === shouldCollapse ? current : shouldCollapse);
    };

    updateCollapse();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(updateCollapse);
    observer.observe(nav);
    observer.observe(measurement);

    return () => observer.disconnect();
  }, [items]);

  const displayEntries: BreadcrumbDisplayEntry[] = collapseMiddle && items.length > 2
    ? [
        { type: "item", item: items[0], originalIndex: 0 },
        { type: "ellipsis" },
        { type: "item", item: items[items.length - 1], originalIndex: items.length - 1 },
      ]
    : items.map((item, originalIndex) => ({ type: "item", item, originalIndex }));
  const hiddenLabels = items.slice(1, -1).map((item) => item.label).join(" / ");

  return (
    <nav
      ref={navRef}
      aria-label="Breadcrumb"
      data-theme={darkMode ? "dark" : undefined}
      className={cn(
        "relative flex min-w-0 max-w-full items-center",
        background === "bg" && "rounded-lg bg-breadcrumb-surface px-4 py-3",
        className,
      )}
      {...props}
    >
      <ol className="flex min-w-0 max-w-full items-center gap-0 overflow-hidden">
        {displayEntries.map((entry, displayIndex) => {
          const isLastDisplayItem = displayIndex === displayEntries.length - 1;

          if (entry.type === "ellipsis") {
            return (
              <li key="collapsed-middle" className="flex shrink-0 items-center gap-0">
                <span
                  aria-label={`Menu tersembunyi: ${hiddenLabels}`}
                  title={hiddenLabels}
                  className={cn(currentSize.text, "text-content-muted")}
                >
                  …
                </span>
                {!isLastDisplayItem && (
                  <span aria-hidden="true" className={cn(currentSize.separator, "shrink-0 text-gray-400")}>
                    {separator}
                  </span>
                )}
              </li>
            );
          }

          const { item, originalIndex } = entry;
          const isLast = originalIndex === items.length - 1;
          const isHome = item.label.toLowerCase() === "home";
          const itemIcon = item.icon ?? (isHome ? <Home className="size-4" /> : null);
          const labelWasTruncated = item.label.length > MOBILE_MAX_LABEL_LENGTH;

          return (
            <li key={`${item.label}-${originalIndex}`} className="flex shrink-0 items-center gap-0">
              {!isLast && item.href ? (
                <a
                  href={item.href}
                  onClick={item.onClick}
                  aria-label={labelWasTruncated ? item.label : undefined}
                  title={labelWasTruncated ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap transition-colors",
                    currentSize.text,
                    "text-content-muted hover:text-breadcrumb-link-hover",
                  )}
                >
                  {itemIcon && (
                    <span className="flex shrink-0 items-center justify-center">{itemIcon}</span>
                  )}

                  <ResponsiveLabel label={item.label} />
                </a>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  aria-label={labelWasTruncated ? item.label : undefined}
                  title={labelWasTruncated ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap",
                    currentSize.text,
                    isLast ? "font-medium text-breadcrumb-active" : "text-content-muted",
                  )}
                >
                  {itemIcon && (
                    <span className="flex shrink-0 items-center justify-center">{itemIcon}</span>
                  )}

                  <ResponsiveLabel label={item.label} />
                </span>
              )}

              {!isLastDisplayItem && (
                <span aria-hidden="true" className={cn(currentSize.separator, "shrink-0 text-gray-400")}>
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <ol
        ref={measurementRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 invisible flex w-max items-center gap-0 whitespace-nowrap"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isHome = item.label.toLowerCase() === "home";
          const itemIcon = item.icon ?? (isHome ? <Home className="size-4" /> : null);

          return (
            <li key={`measurement-${item.label}-${index}`} className="flex shrink-0 items-center gap-0">
              <span className={cn("flex items-center gap-2", currentSize.text)}>
                {itemIcon && (
                  <span className="flex shrink-0 items-center justify-center">{itemIcon}</span>
                )}
                <ResponsiveLabel label={item.label} />
              </span>
              {!isLast && (
                <span className={cn(currentSize.separator, "shrink-0")}>{separator}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
