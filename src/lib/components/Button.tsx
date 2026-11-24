import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { useInheritedDarkMode, useKeepFilledColor } from "../utils/darkModeContext";

export type ButtonVariant = "filled" | "outline";

export type ButtonSize = "xs" | "s" | "base" | "l" | "xl";

export type ButtonTheme = "primary" | "green" | "gray" | "purple" | "orange" | "yellow";

/** @deprecated Gunakan `darkMode` untuk memilih palet pada permukaan gelap. */
export type ButtonTone = "light" | "dark";

interface CommonProps {
  children?: ReactNode;
  iconOnly?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  theme?: ButtonTheme;
  /**
   * @deprecated Gunakan `darkMode`. Selama masa transisi, `tone="dark"`
   * diperlakukan sama dengan `darkMode={true}`.
   */
  tone?: ButtonTone;
  /**
   * Menyesuaikan Button untuk permukaan gelap. Filled memakai versi gelap dari
   * enam theme bawaan, outline menjadi putih, dan filled tanpa palet khusus
   * memakai tombol putih sebagai fallback. Jika tidak diisi, mode diwarisi
   * dari konteks tema terdekat.
   */
  darkMode?: boolean;
}

type AsButton = CommonProps & {
  as?: "button";
  type?: "button" | "submit" | "reset";
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps | "type">;

type AsAnchor = CommonProps & {
  as: "anchor";
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps>;

export type ButtonProps = AsButton | AsAnchor;
const sizeClasses: Record<
  ButtonSize,
  {
    button: string;
    icon: string;
    iconOnly: string;
  }
> = {
  xs: {
    button: "h-[34px] px-4 gap-2 rounded-lg text-xs",
    icon: "size-3",
    iconOnly: "h-[34px] w-[34px] rounded-full p-0",
  },

  s: {
    button: "h-[38px] px-4 gap-2 rounded-lg text-sm",
    icon: "size-3",
    iconOnly: "h-[38px] w-[38px] rounded-full p-0",
  },

  base: {
    button: "h-[40px] px-4 gap-2 rounded-lg text-base",
    icon: "size-3.5",
    iconOnly: "h-[40px] w-[40px] rounded-full p-0",
  },

  l: {
    button: "h-[43px] px-5 gap-2 rounded-lg text-lg",
    icon: "size-3.5",
    iconOnly: "h-[43px] w-[43px] rounded-full p-0",
  },

  xl: {
    button: "h-[46px] px-6 gap-2 rounded-lg text-xl",
    icon: "size-4",
    iconOnly: "h-[46px] w-[46px] rounded-full p-0",
  },
};

const lightClasses: Record<ButtonTheme, Record<ButtonVariant, string>> = {
  primary: {
    filled: "bg-primary-700 text-white hover:bg-primary-800",
    outline: "border border-primary-700 text-primary-700 hover:bg-primary-50",
  },

  green: {
    filled: "bg-green-700 text-white hover:bg-green-800",
    outline: "border border-green-700 text-green-700 hover:bg-green-50",
  },

  gray: {
    filled: "bg-gray-500 text-white hover:bg-gray-700",
    outline: "border border-gray-500 text-gray-500 hover:border-gray-700 hover:bg-gray-100 hover:text-gray-700",
  },

  purple: {
    filled: "bg-purple-700 text-white hover:bg-purple-800",
    outline: "border border-purple-700 text-purple-700 hover:bg-purple-50",
  },

  orange: {
    filled: "bg-orange-600 text-white hover:bg-orange-700",
    outline: "border border-orange-600 text-orange-600 hover:bg-orange-50",
  },

  yellow: {
    filled: "bg-yellow-700 text-white hover:bg-yellow-800",
    outline: "border border-yellow-700 text-yellow-700 hover:bg-yellow-50",
  },
};

/**
 * `Partial` disengaja: theme baru yang belum mempunyai palet gelap akan jatuh
 * ke tombol putih, bukan tanpa sengaja memakai warna light mode.
 */
const darkFilledClasses: Partial<Record<ButtonTheme, string>> = {
  primary: "bg-primary-800 text-white hover:bg-primary-700",
  green: "bg-green-800 text-white hover:bg-green-700",
  gray: "bg-gray-700 text-white hover:bg-gray-500",
  purple: "bg-purple-800 text-white hover:bg-purple-700",
  orange: "bg-orange-700 text-white hover:bg-orange-700",
  yellow: "bg-yellow-800 text-white hover:bg-yellow-700",
};

const darkFilledFallback = "bg-gray-50 text-gray-700 hover:bg-white hover:text-gray-700";
const darkOutlineClass =
  "border border-gray-50 text-gray-50 hover:border-gray-50 hover:bg-white hover:text-gray-700";

function resolveColorClasses(theme: ButtonTheme | undefined, variant: ButtonVariant, darkMode: boolean) {
  const resolvedTheme = theme ?? "primary";

  if (!darkMode) return lightClasses[resolvedTheme][variant];
  if (variant === "outline") return darkOutlineClass;
  if (!theme) return darkFilledFallback;
  return darkFilledClasses[theme] ?? darkFilledFallback;
}

export function Button({
  children,
  iconOnly = false,
  variant = "filled",
  size = "base",
  theme,
  tone,
  darkMode: darkModeProp,
  leftIcon,
  rightIcon,
  className,
  ...props
}: ButtonProps) {
  const currentSize = sizeClasses[size];
  const inheritedDark = useInheritedDarkMode();
  const keepFilledColor = useKeepFilledColor();
  // Di Table gelap, Button filled berwarna tetap memakai warna terangnya
  // (mis. "Tambah Data" primary-700). Tanpa `theme`, Button dihitung primary.
  const keepsColor = keepFilledColor && variant === "filled" && (theme ?? "primary") !== "gray";
  const darkMode = darkModeProp ?? (tone === "dark" || (inheritedDark && !keepsColor));

  const classes = cn(
    "inline-flex items-center justify-center",
    "font-medium",
    "transition-colors duration-200",
    "focus:outline-none",
    "focus:ring-2 focus:ring-primary-400",
    "disabled:pointer-events-none disabled:opacity-50",
    resolveColorClasses(theme, variant, darkMode),
    iconOnly ? currentSize.iconOnly : currentSize.button,
    className,
  );

  const content = (
    <>
      {/* Left Icon */}
      {!iconOnly && leftIcon && (
        <span className={cn("flex shrink-0 items-center justify-center", currentSize.icon)}>
          {leftIcon}
        </span>
      )}

      {/* Content / Icon Only */}
      {iconOnly ? (
        <span className={cn("flex items-center justify-center", currentSize.icon)}>{children}</span>
      ) : (
        children
      )}

      {/* Right Icon */}
      {!iconOnly && rightIcon && (
        <span className={cn("flex shrink-0 items-center justify-center", currentSize.icon)}>
          {rightIcon}
        </span>
      )}
    </>
  );

  if (props.as === "anchor") {
    const { as: _as, ...anchorProps } = props;

    return (
      <a className={classes} {...anchorProps}>
        {content}
      </a>
    );
  }

  const { as: _as, type = "button", ...buttonProps } = props as AsButton;

  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}

export default Button;
