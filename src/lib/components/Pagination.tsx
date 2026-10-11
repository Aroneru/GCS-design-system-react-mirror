import { type HTMLAttributes } from "react";
import { ChevronLeft, ChevronRight } from "../icons/outline";
import { cn } from "../utils/cn";

export type PaginationTheme = "default" | "primary" | "simaya";

/**
 * `base` kotak 40px, `s` kotak 32px untuk layar sempit. `responsive` memakai `s`
 * lalu berganti ke `base` saat container terdekat ≥ 512px — wajib ada induk
 * ber-`@container`, seperti di dalam Table.
 */
export type PaginationSize = "base" | "s" | "responsive";

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  theme?: PaginationTheme;
  /** Bawaannya `base`. */
  size?: PaginationSize;
  darkMode?: boolean;
}

/** Tinggi bar, ukuran tiap kotak, dan ikon chevron per ukuran. */
const sizeClasses: Record<PaginationSize, { nav: string; cell: string; icon: string }> = {
  base: { nav: "h-10", cell: "h-10 w-10", icon: "size-7" },
  // Lebar minimum, bukan tetap, supaya angka tiga digit seperti "100" tidak berdesakan.
  s: { nav: "h-8", cell: "h-8 min-w-8 px-2", icon: "size-5" },
  responsive: {
    nav: "h-8 @lg:h-10",
    cell: "h-8 min-w-8 px-2 @lg:h-10 @lg:min-w-10",
    icon: "size-5 @lg:size-7",
  },
};

const themeClasses: Record<
  PaginationTheme,
  {
    active: string;
    activeText: string;
    darkActive: string;
    darkActiveText: string;
  }
> = {
  default: {
    active: "bg-gray-50",
    activeText: "text-gray-500",
    darkActive: "bg-gray-700",
    darkActiveText: "text-gray-300",
  },

  primary: {
    active: "bg-primary-50",
    activeText: "text-primary-500",
    darkActive: "bg-gray-700",
    darkActiveText: "text-primary-500",
  },

  simaya: {
    active: "bg-purple-50",
    activeText: "text-purple-500",
    darkActive: "bg-gray-700",
    darkActiveText: "text-purple-400",
  },
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  theme = "primary",
  size = "base",
  darkMode = false,
  className,
  ...props
}: PaginationProps) {
  const colors = themeClasses[theme];
  const sizing = sizeClasses[size];

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    onPageChange(page);
  };

  const pages = getPaginationPages(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "inline-flex overflow-hidden rounded-lg",
        sizing.nav,
        darkMode ? "border border-gray-700 bg-gray-800" : "border border-gray-300 bg-white",
        className,
      )}
      {...props}
    >
      {/* Previous */}
      <button
        type="button"
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
        className={cn(
          "flex shrink-0 items-center justify-center transition-colors",
          sizing.cell,
          darkMode
            ? "border-r border-gray-700 text-gray-400 hover:bg-gray-700"
            : "border-r border-gray-300 text-gray-500 hover:bg-gray-50",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <ChevronLeft className={sizing.icon} />
      </button>

      {/* Pages */}
      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className={cn(
                "flex shrink-0 items-center justify-center text-sm",
                sizing.cell,
                darkMode
                  ? "border-r border-gray-700 text-gray-400"
                  : "border-r border-gray-300 text-gray-500",
              )}
            >
              ...
            </span>
          );
        }

        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={() => goToPage(page)}
            className={cn(
              "flex shrink-0 items-center justify-center text-sm font-normal transition-colors",
              sizing.cell,
              darkMode
                ? "border-r border-gray-700 hover:bg-gray-700"
                : "border-r border-gray-300 hover:bg-gray-50",
              isActive && (darkMode ? colors.darkActive : colors.active),
              isActive
                ? (darkMode ? colors.darkActiveText : colors.activeText)
                : (darkMode ? "text-gray-400" : "text-gray-500"),
            )}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        type="button"
        aria-label="Next page"
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className={cn(
          "flex shrink-0 items-center justify-center transition-colors",
          sizing.cell,
          darkMode
            ? "border-r border-gray-700 text-gray-400 hover:bg-gray-700"
            : "border-r border-gray-300 text-gray-500 hover:bg-gray-50",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <ChevronRight className={sizing.icon} />
      </button>
    </nav>
  );
}

function getPaginationPages(currentPage: number, totalPages: number): Array<number | "..."> {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  // First page
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages];
  }

  // Last pages
  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // Middle
  return [1, "...", currentPage, "...", totalPages];
}

export default Pagination;
