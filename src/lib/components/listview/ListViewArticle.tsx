import {
  forwardRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import {
  Eye,
  Heart,
  MessageCaption,
  Thumbtack,
} from "flowbite-react-icons/outline";
import { cn } from "../../utils/cn";

export type ListViewArticleSize =
  | "s"
  | "m"
  | "l"
  | "xl"
  | "sm"
  | "default"
  | "lg";

const normalizeArticleSize = (
  size: ListViewArticleSize = "m",
): "s" | "m" | "l" | "xl" => {
  if (size === "sm" || size === "s") return "s";
  if (size === "default" || size === "m") return "m";
  if (size === "lg" || size === "l") return "l";
  if (size === "xl") return "xl";
  return "m";
};

const sizeClasses: Record<
  "s" | "m" | "l" | "xl",
  {
    container: string;
    decorationPadding: string;
    headerGap: string;
    subject: string;
    category: string;
    timestamp: string;
    pinBadge: string;
    pinIcon: string;
    dividerMargin: string;
    title: string;
    titleSpacing: string;
    metricsGap: string;
    metricsText: string;
    metricIcon: string;
  }
> = {
  s: {
    container: "px-4 py-3.5 min-h-[140px]",
    decorationPadding: "pl-5",
    headerGap: "gap-2",
    subject: "text-sm font-semibold",
    category: "text-xs font-normal",
    timestamp: "text-[11px]",
    pinBadge: "size-7",
    pinIcon: "size-3.5",
    dividerMargin: "my-2.5",
    title: "text-sm font-bold leading-snug",
    titleSpacing: "mb-3",
    metricsGap: "gap-3.5",
    metricsText: "text-xs font-medium",
    metricIcon: "size-4",
  },
  m: {
    container: "px-5 py-4 min-h-[155px]",
    decorationPadding: "pl-6",
    headerGap: "gap-2.5",
    subject: "text-base font-semibold",
    category: "text-xs font-normal",
    timestamp: "text-xs",
    pinBadge: "size-8",
    pinIcon: "size-4",
    dividerMargin: "my-3",
    title: "text-base font-bold leading-snug",
    titleSpacing: "mb-3.5",
    metricsGap: "gap-4",
    metricsText: "text-sm font-medium",
    metricIcon: "size-4.5",
  },
  l: {
    container: "px-6 py-4.5 min-h-[170px]",
    decorationPadding: "pl-7",
    headerGap: "gap-3",
    subject: "text-base sm:text-lg font-semibold",
    category: "text-xs sm:text-sm font-normal",
    timestamp: "text-xs",
    pinBadge: "size-8.5",
    pinIcon: "size-4",
    dividerMargin: "my-3.5",
    title: "text-lg font-bold leading-snug",
    titleSpacing: "mb-4",
    metricsGap: "gap-4.5",
    metricsText: "text-sm font-medium",
    metricIcon: "size-4.5",
  },
  xl: {
    container: "px-7 py-5 min-h-[185px]",
    decorationPadding: "pl-8",
    headerGap: "gap-3.5",
    subject: "text-lg font-semibold",
    category: "text-sm font-normal",
    timestamp: "text-xs sm:text-sm",
    pinBadge: "size-9",
    pinIcon: "size-4.5",
    dividerMargin: "my-4",
    title: "text-xl font-bold leading-snug",
    titleSpacing: "mb-4.5",
    metricsGap: "gap-5",
    metricsText: "text-base font-medium",
    metricIcon: "size-5",
  },
};

export interface ListViewArticleProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Nama subjek / pengirim / penulis di kiri atas (mis. "subject Name"). */
  subject?: ReactNode;
  /** Kategori artikel / topik di kanan atas (mis. "Category"). */
  category?: ReactNode;
  /** Tanggal / waktu publikasi di kanan atas (mis. "12 Okt 2026 09:59 WIB"). */
  timestamp?: ReactNode;
  /** Judul utama artikel / topik bahasan. */
  title: ReactNode;
  /** Jumlah tayangan / views (mis. 609). */
  views?: ReactNode;
  /** Jumlah komentar / tanggapan (mis. 3). */
  comments?: ReactNode;
  /** Jumlah suka / likes (mis. 16). */
  likes?: ReactNode;
  /** Menampilkan lencana pin (thumbtack) di kanan atas. Bawaannya `true`. */
  pinned?: boolean;
  /** Callback saat tombol pin diklik. */
  onPin?: (e: React.MouseEvent<HTMLElement>) => void;
  /** Menampilkan garis dekorasi aksen warna primary pada sisi kiri kartu. Bawaannya `true`. */
  decoration?: boolean;
  /** Varian ukuran kartu: 's', 'm', 'l', 'xl'. Bawaannya 'm'. */
  size?: ListViewArticleSize;
  /** Tautan jika seluruh kartu bertindak sebagai link interaktif. */
  href?: string;
  /** Target tautan jika `href` diisi. */
  target?: string;
  /** Rel tautan jika `href` diisi. */
  rel?: string;
  /** Memaksa kartu bertema gelap. */
  darkMode?: boolean;
  /** Elemen HTML pembungkus (default: 'article', atau 'a' jika ada `href`). */
  as?: ElementType;
}

/**
 * ListViewArticle — varian kartu daftar bertipe Article/Thread/Discussion
 * yang menampilkan subject, kategori, tanggal, lencana pin di header,
 * judul topik di tengah, serta metrik interaksi (views, comments, likes) di footer.
 */
export const ListViewArticle = forwardRef<HTMLElement, ListViewArticleProps>(
  (
    {
      subject,
      category,
      timestamp,
      title,
      views,
      comments,
      likes,
      pinned = true,
      onPin,
      decoration = true,
      size = "m",
      href,
      target,
      rel,
      darkMode = false,
      as,
      className,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const isInteractive = Boolean(href || onClick);
    const Component = as ?? (href ? "a" : "article");
    const normalizedSize = normalizeArticleSize(size);
    const currentSize = sizeClasses[normalizedSize];

    return (
      <Component
        ref={ref as React.Ref<never>}
        href={href}
        target={target}
        rel={target === "_blank" ? (rel ?? "noreferrer noopener") : rel}
        onClick={onClick}
        data-theme={darkMode ? "dark" : undefined}
        className={cn(
          "group relative flex flex-col justify-between overflow-hidden rounded-lg border border-border bg-surface text-content transition-all",
          "data-[theme=dark]:border-gray-500 in-data-[theme=dark]:border-gray-500 data-[theme=dark]:bg-gray-700 in-data-[theme=dark]:bg-gray-700",
          currentSize.container,
          decoration && currentSize.decorationPadding,
          isInteractive &&
            "cursor-pointer hover:border-primary-400/80 hover:shadow-soft active:scale-[0.998]",
          className,
        )}
        {...props}
      >
        {decoration && (
          <span
            className="absolute inset-y-0 left-0 w-1 sm:w-1.5 bg-primary-700"
            aria-hidden="true"
          />
        )}

        <div>
          {/* Header Baris Atas */}
          <div
            className={cn(
              "flex items-start justify-between",
              currentSize.headerGap,
            )}
          >
            <div className="min-w-0 pr-2">
              {subject && (
                <div
                  className={cn(
                    "text-content in-data-[theme=dark]:text-white truncate",
                    currentSize.subject,
                  )}
                >
                  {subject}
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
              {(category || timestamp) && (
                <div className="text-right">
                  {category && (
                    <div
                      className={cn(
                        "text-content-muted in-data-[theme=dark]:text-gray-400 leading-none",
                        currentSize.category,
                      )}
                    >
                      {category}
                    </div>
                  )}
                  {timestamp && (
                    <div
                      className={cn(
                        "text-content-muted in-data-[theme=dark]:text-gray-400 mt-1 leading-none",
                        currentSize.timestamp,
                      )}
                    >
                      {timestamp}
                    </div>
                  )}
                </div>
              )}

              {pinned && (
                <div
                  className={cn(
                    "flex shrink-0 items-center justify-center rounded-full bg-primary-50 text-gray-800 border border-primary-100/80 transition-colors",
                    "in-data-[theme=dark]:bg-gray-600 in-data-[theme=dark]:text-gray-200 in-data-[theme=dark]:border-gray-700",
                    onPin &&
                      "cursor-pointer hover:bg-primary-100 in-data-[theme=dark]:hover:bg-gray-500",
                    currentSize.pinBadge,
                  )}
                  onClick={
                    onPin
                      ? (e) => {
                          e.stopPropagation();
                          onPin(e);
                        }
                      : undefined
                  }
                  role={onPin ? "button" : undefined}
                  tabIndex={onPin ? 0 : undefined}
                >
                  <Thumbtack
                    className={cn(currentSize.pinIcon, "shrink-0 rotate-45")}
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Garis Pemisah (Divider) */}
          <div
            className={cn(
              "w-full border-b border-gray-200 in-data-[theme=dark]:border-gray-600",
              currentSize.dividerMargin,
            )}
          />

          {/* Judul Utama Artikel / Topik */}
          <h4
            className={cn(
              "text-content in-data-[theme=dark]:text-white",
              currentSize.title,
              currentSize.titleSpacing,
            )}
          >
            {title}
          </h4>

          {children}
        </div>

        {/* Footer Baris Bawah: Metrik Interaksi */}
        {(views !== undefined ||
          comments !== undefined ||
          likes !== undefined) && (
          <div
            className={cn(
              "flex items-center justify-end text-content-muted in-data-[theme=dark]:text-gray-400 select-none",
              currentSize.metricsGap,
              currentSize.metricsText,
            )}
          >
            {views !== undefined && (
              <span className="inline-flex items-center gap-1.5">
                <Eye
                  className={cn(currentSize.metricIcon, "shrink-0")}
                  aria-hidden="true"
                />
                <span>{views}</span>
              </span>
            )}
            {comments !== undefined && (
              <span className="inline-flex items-center gap-1.5">
                <MessageCaption
                  className={cn(currentSize.metricIcon, "shrink-0")}
                  aria-hidden="true"
                />
                <span>{comments}</span>
              </span>
            )}
            {likes !== undefined && (
              <span className="inline-flex items-center gap-1.5">
                <Heart
                  className={cn(currentSize.metricIcon, "shrink-0")}
                  aria-hidden="true"
                />
                <span>{likes}</span>
              </span>
            )}
          </div>
        )}
      </Component>
    );
  },
);

ListViewArticle.displayName = "ListViewArticle";
