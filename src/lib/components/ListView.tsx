import {
  forwardRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { FileLines } from "flowbite-react-icons/outline";
import { cn } from "../utils/cn";
import { Button, type ButtonSize } from "./Button";

export type ListViewSize = "sm" | "default" | "lg" | "s" | "m" | "l";

export type ListViewPlatform = "default" | "mobile";

export const normalizeListViewSize = (
  size: ListViewSize = "default",
): "sm" | "default" | "lg" => {
  if (size === "s") return "sm";
  if (size === "m") return "default";
  if (size === "l") return "lg";
  return size;
};

const mobileClasses = {
  container: "px-3.5 py-2.5 gap-3 min-h-[58px]",
  iconBox: "size-10 rounded-xl",
  iconSize: "size-5",
  title: "text-sm font-bold",
  description: "text-xs",
  defaultButtonSize: "xs" as ButtonSize,
};

const sizeClasses: Record<
  "sm" | "default" | "lg",
  {
    container: string;
    iconBox: string;
    iconSize: string;
    title: string;
    description: string;
    defaultButtonSize: ButtonSize;
  }
> = {
  sm: {
    container: "p-3 gap-3",
    iconBox: "size-9 rounded-lg",
    iconSize: "size-4.5",
    title: "text-sm font-semibold",
    description: "text-xs",
    defaultButtonSize: "xs",
  },
  default: {
    container: "px-4 py-3 sm:px-5 sm:py-3.5 gap-3.5 sm:gap-4",
    iconBox: "size-11 sm:size-12 rounded-xl",
    iconSize: "size-5 sm:size-6",
    title: "text-base font-bold",
    description: "text-sm",
    defaultButtonSize: "s",
  },
  lg: {
    container: "p-5 sm:p-6 gap-4 sm:gap-5",
    iconBox: "size-13 sm:size-14 rounded-2xl",
    iconSize: "size-6 sm:size-7",
    title: "text-lg font-bold",
    description: "text-sm sm:text-base",
    defaultButtonSize: "base",
  },
};

export interface ListViewItemProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Judul utama item (misalnya: "Project brief"). */
  title: ReactNode;
  /** Keterangan atau deskripsi tambahan di bawah judul. */
  description?: ReactNode;
  /**
   * Daftar metadata ringkas yang otomatis digabung dengan tanda pemisah (·).
   * Contoh: `['PDF', '2.4 MB', 'Updated Oct 10, 2026']`
   */
  metadata?: ReactNode[];
  /**
   * Ikon atau elemen visual di sebelah kiri.
   * Bawaannya menggunakan ikon dokumen (`FileLines`).
   * Isi `null` jika tidak ingin menampilkan wadah ikon sama sekali.
   */
  icon?: ReactNode | null;
  /** ClassName kustom untuk wadah ikon. */
  iconContainerClassName?: string;
  /** Label untuk tombol aksi cepat bawaan (misalnya `"Open"`). */
  actionLabel?: ReactNode;
  /** Callback saat tombol aksi bawaan diklik. */
  onAction?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Tautan untuk tombol aksi bawaan. */
  actionHref?: string;
  /** Ukuran tombol aksi bawaan. Mengikuti `size` item bila tidak diisi. */
  actionButtonSize?: ButtonSize;
  /** Tautan jika seluruh item bertindak sebagai tautan. */
  href?: string;
  /** Target tautan jika `href` diisi. */
  target?: string;
  /** Rel tautan jika `href` diisi. */
  rel?: string;
  /** Kerapatan/ukuran item. Bawaannya `'default'`. */
  size?: ListViewSize;
  /** Platform target: `'default'` (desktop) atau `'mobile'` (tampilan ringkas responsif 58px). */
  platform?: ListViewPlatform;
  /** Menampilkan garis dekorasi aksen warna primary pada sisi kiri kartu. */
  decoration?: boolean;
  /**
   * Memaksa item bertema gelap. Tanpa prop ini item ikut tema pembungkusnya
   * (mis. `<section data-theme="dark">`).
   */
  darkMode?: boolean;
  /** Elemen HTML yang dirender (default: `'article'`, atau `'a'` jika ada `href`). */
  as?: ElementType;
}

/**
 * ListViewItem — kartu baris individual yang menampilkan ikon/media di kiri,
 * judul dan metadata/deskripsi di tengah, serta aksi di sebelah kanan.
 */
export const ListViewItem = forwardRef<HTMLElement, ListViewItemProps>(
  (
    {
      title,
      description,
      metadata,
      icon,
      iconContainerClassName,
      actionLabel,
      onAction,
      actionHref,
      actionButtonSize,
      href,
      target,
      rel,
      size = "default",
      platform = "default",
      decoration = false,
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
    const isMobile = platform === "mobile";
    const currentSize = isMobile
      ? mobileClasses
      : (sizeClasses[normalizeListViewSize(size)] ?? sizeClasses.default);

    const hasIcon = icon !== null;
    const renderedIcon =
      icon ?? <FileLines className={cn(currentSize.iconSize, "shrink-0")} aria-hidden="true" />;

    const renderedAction = actionLabel ? (
      actionHref ? (
        <Button
          as="anchor"
          href={actionHref}
          size={actionButtonSize ?? currentSize.defaultButtonSize}
          theme="primary"
          variant="filled"
        >
          {actionLabel}
        </Button>
      ) : (
        <Button
          size={actionButtonSize ?? currentSize.defaultButtonSize}
          theme="primary"
          variant="filled"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )
    ) : null;

    return (
      <Component
        ref={ref as any}
        href={href}
        target={target}
        rel={target === "_blank" ? (rel ?? "noreferrer noopener") : rel}
        onClick={onClick}
        data-theme={darkMode ? "dark" : undefined}
        className={cn(
          "group relative flex items-center justify-between overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-surface text-content transition-all",
          currentSize.container,
          decoration && "pl-4 sm:pl-4.5",
          isInteractive &&
            "cursor-pointer hover:border-primary-400/80 hover:shadow-soft active:scale-[0.998]",
          className,
        )}
        {...props}
      >
        {decoration && (
          <span
            className="absolute inset-y-0 left-0 w-1 sm:w-1.5 bg-primary-600 in-data-[theme=dark]:bg-primary-500"
            aria-hidden="true"
          />
        )}
        <div className="flex min-w-0 flex-1 items-center gap-3.5 sm:gap-4">
          {hasIcon && (
            <div
              className={cn(
                "flex shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 in-data-[theme=dark]:bg-primary-950/60 in-data-[theme=dark]:text-primary-400 transition-colors",
                currentSize.iconBox,
                iconContainerClassName,
              )}
            >
              {renderedIcon}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h4 className={cn("text-content truncate leading-snug", currentSize.title)}>
              {title}
            </h4>

            {description && (
              <div className={cn("text-content-muted mt-0.5 truncate leading-normal", currentSize.description)}>
                {description}
              </div>
            )}

            {metadata && metadata.length > 0 && (
              <div className={cn("text-content-muted mt-0.5 flex flex-wrap items-center gap-1.5 leading-normal", currentSize.description)}>
                {metadata.map((item, index) => (
                  <span key={index} className="inline-flex items-center gap-1.5">
                    {index > 0 && (
                      <span className="text-content-muted/60 select-none" aria-hidden="true">
                        &middot;
                      </span>
                    )}
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            )}

            {children}
          </div>
        </div>

        {renderedAction && (
          <div className="shrink-0 flex items-center pl-2">
            {renderedAction}
          </div>
        )}
      </Component>
    );
  },
);

ListViewItem.displayName = "ListViewItem";

export interface ListViewProps extends HTMLAttributes<HTMLElement> {
  /** Daftar data item ListView jika ingin dirender otomatis. */
  items?: ListViewItemProps[];
  /** Jarak vertikal antar item. Bawaannya `'md'` (gap-3). */
  gap?: "sm" | "md" | "lg" | "none";
  /** Kerapatan/ukuran bawaan untuk item di dalamnya. */
  size?: ListViewSize;
  /** Platform bawaan untuk seluruh item di dalamnya: `'default'` atau `'mobile'`. */
  platform?: ListViewPlatform;
  /** Garis dekorasi aksen bawaan untuk seluruh item di dalamnya. */
  decoration?: boolean;
  /**
   * Memaksa seluruh daftar bertema gelap. Item di dalamnya otomatis mewarisi
   * tema ini lewat CSS `data-theme="dark"`.
   */
  darkMode?: boolean;
  /** Elemen pembungkus HTML (default: `'div'`, atau `'ul'`). */
  as?: ElementType;
}

const gapClasses: Record<NonNullable<ListViewProps["gap"]>, string> = {
  none: "space-y-0",
  sm: "space-y-2",
  md: "space-y-3",
  lg: "space-y-4",
};

/**
 * ListView — pembungkus daftar yang menampung kumpulan `ListViewItem`.
 * Dapat menerima array `items` atau `children` secara deklaratif.
 */
export const ListView = forwardRef<HTMLElement, ListViewProps>(
  (
    {
      items,
      gap = "md",
      size = "default",
      platform = "default",
      decoration = false,
      darkMode = false,
      as: Component = "div",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Component
        ref={ref as any}
        data-theme={darkMode ? "dark" : undefined}
        className={cn("w-full", gapClasses[gap], className)}
        {...props}
      >
        {items
          ? items.map((item, index) => (
              <ListViewItem
                key={index}
                size={size}
                platform={item.platform ?? platform}
                decoration={item.decoration ?? decoration}
                {...item}
              />
            ))
          : children}
      </Component>
    );
  },
) as React.ForwardRefExoticComponent<
  ListViewProps & React.RefAttributes<HTMLElement>
> & {
  Item: typeof ListViewItem;
};

ListView.displayName = "ListView";
ListView.Item = ListViewItem;
