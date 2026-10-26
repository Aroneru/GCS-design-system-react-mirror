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
    // Referensi desktop S: isi mulai pada x=20, pin 24px pada y=14,
    // divider y=52, dan metrik berakhir 12px sebelum sisi bawah.
    container: "w-full max-w-[410px] min-h-[140px] px-4 pt-3.5 pb-3",
    decorationPadding: "pl-5",
    headerGap: "gap-2",
    subject: "text-xs font-semibold",
    category: "text-xs font-normal",
    timestamp: "text-[11px]",
    pinBadge: "size-6",
    pinIcon: "size-4",
    dividerMargin: "mt-3.5 mb-2.5",
    title: "text-sm font-semibold leading-snug",
    titleSpacing: "mb-3",
    metricsGap: "gap-4",
    metricsText: "text-xs font-medium",
    metricIcon: "size-3.5",
  },
  m: {
    // Referensi desktop M: isi mulai pada x=30, pin 24px, divider y=58.
    container: "w-full max-w-[514px] min-h-[159px] pr-6 pt-4 pb-4",
    decorationPadding: "pl-[30px]",
    headerGap: "gap-2.5",
    subject: "text-sm font-semibold",
    category: "text-xs font-normal",
    timestamp: "text-xs",
    pinBadge: "size-6",
    pinIcon: "size-4",
    dividerMargin: "mt-4 mb-3",
    title: "text-base font-semibold leading-snug",
    titleSpacing: "mb-3.5",
    metricsGap: "gap-5.5",
    metricsText: "text-sm font-medium",
    metricIcon: "size-4",
  },
  l: {
    // L dan XL memakai header ringkas yang sama: divider berada di y=44.
    container: "w-full max-w-[728px] min-h-[149px] pr-5 pt-3 pb-3.5",
    decorationPadding: "pl-9",
    headerGap: "gap-3",
    subject: "text-sm font-semibold",
    category: "text-xs sm:text-sm font-normal",
    timestamp: "text-xs",
    pinBadge: "size-6",
    pinIcon: "size-4",
    dividerMargin: "mt-2 mb-3.5",
    title: "text-lg font-semibold leading-snug",
    titleSpacing: "mb-4",
    metricsGap: "gap-5.5",
    metricsText: "text-sm font-medium",
    metricIcon: "size-4",
  },
  xl: {
    container: "w-full max-w-[1028px] min-h-[149px] pr-5 pt-3 pb-3.5",
    decorationPadding: "pl-9",
    headerGap: "gap-3.5",
    subject: "text-sm font-semibold",
    category: "text-sm font-normal",
    timestamp: "text-xs sm:text-sm",
    pinBadge: "size-6",
    pinIcon: "size-4",
    dividerMargin: "mt-2 mb-4",
    title: "text-xl font-semibold leading-snug",
    titleSpacing: "mb-4.5",
    metricsGap: "gap-5.5",
    // Referensi XL tetap memakai metrik 14px dan ikon 16px; hanya konten
    // artikelnya yang membesar.
    metricsText: "text-sm font-medium",
    metricIcon: "size-4",
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
          "group relative flex flex-col justify-between overflow-hidden rounded-[8px] border-t border-r border-b border-border bg-surface text-content transition-all",
          "data-[theme=dark]:border-gray-600 in-data-[theme=dark]:border-gray-600 data-[theme=dark]:bg-gray-700 in-data-[theme=dark]:bg-gray-700",
          currentSize.container,
          currentSize.decorationPadding,
          isInteractive &&
            "cursor-pointer hover:border-primary-400/80 hover:shadow-soft active:scale-[0.998]",
          className,
        )}
        {...props}
      >
        <span
          className="absolute inset-y-0 left-0 w-1 bg-primary-700"
          aria-hidden="true"
        />

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
                    "text-content in-data-[theme=dark]:text-gray-100 truncate",
                    currentSize.subject,
                  )}
                >
                  {subject}
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
              {(category || timestamp) && (
                <div className="text-left">
                  {category && (
                    <div
                      className={cn(
                        "text-content-muted in-data-[theme=dark]:text-gray-100 leading-none",
                        currentSize.category,
                      )}
                    >
                      {category}
                    </div>
                  )}
                  {timestamp && (
                    <div
                      className={cn(
                        "text-content-muted in-data-[theme=dark]:text-gray-100 mt-1 leading-none",
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
                    "in-data-[theme=dark]:bg-transparent in-data-[theme=dark]:text-primary-600 in-data-[theme=dark]:border-primary-800",
                    onPin &&
                      "cursor-pointer hover:bg-primary-100 in-data-[theme=dark]:hover:bg-primary-900/30",
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
                    className={cn(currentSize.pinIcon, "shrink-0 -rotate-45")}
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Garis Pemisah (Divider) */}
          <div
            className={cn(
              "w-full border-b border-gray-200 in-data-[theme=dark]:border-gray-500",
              currentSize.dividerMargin,
            )}
          />

          {/* Judul Utama Artikel / Topik */}
          <h4
            className={cn(
              "text-content in-data-[theme=dark]:text-gray-200",
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
              "flex items-center justify-end text-content-muted in-data-[theme=dark]:text-gray-300 select-none",
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
