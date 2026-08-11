import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";

export type ButtonVariant = "filled" | "outline";

export type ButtonSize = "xs" | "s" | "base" | "l" | "xl";

export type ButtonTheme = "primary" | "green" | "gray" | "purple" | "orange" | "yellow";

export type ButtonTone = "light" | "dark";

interface CommonProps {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  iconOnly?: boolean;
  className?: string;
  theme?: ButtonTheme;
  tone?: ButtonTone;
}

type AsButton = CommonProps & {
  as?: "button";
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps>;

type AsAnchor = CommonProps & {
  as: "a";
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
    icon: "size-4",
    iconOnly: "h-[34px] w-[34px] rounded-full p-0",
  },

  s: {
    button: "h-[38px] px-4 gap-2 rounded-lg text-sm",
    icon: "size-4",
    iconOnly: "h-[38px] w-[38px] rounded-full p-0",
  },

  base: {
    button: "h-[40px] px-4 gap-2 rounded-lg text-base",
    icon: "size-5",
    iconOnly: "h-[40px] w-[40px] rounded-full p-0",
  },

  l: {
    button: "h-[43px] px-5 gap-2 rounded-lg text-lg",
    icon: "size-5",
    iconOnly: "h-[43px] w-[43px] rounded-full p-0",
  },

  xl: {
    button: "h-[46px] px-6 gap-2 rounded-lg text-xl",
    icon: "size-6",
    iconOnly: "h-[46px] w-[46px] rounded-full p-0",
  },
};

const colorClasses: Record<ButtonTheme, Record<ButtonTone, Record<ButtonVariant, string>>> = {
  primary: {
    light: {
      filled: "bg-primary-700 text-white hover:bg-primary-800",
      outline: "border border-primary-700 text-primary-700 hover:bg-primary-50",
    },
    dark: {
      filled: "bg-primary-800 text-white hover:bg-primary-700",
      outline: "border border-primary-800 text-primary-800 hover:bg-primary-50",
    },
  },

  green: {
    light: {
      filled: "bg-green-700 text-white hover:bg-green-800",
      outline: "border border-green-700 text-green-700 hover:bg-green-50",
    },
    dark: {
      filled: "bg-green-800 text-white hover:bg-green-700",
      outline: "border border-green-800 text-green-800 hover:bg-green-50",
    },
  },

  gray: {
    // Gray light menggunakan 500
    light: {
      filled: "bg-gray-500 text-white hover:bg-gray-700",
      outline: "border border-gray-500 text-gray-500 hover:bg-gray-50",
    },

    // Gray dark menggunakan 700
    dark: {
      filled: "bg-gray-700 text-white hover:bg-gray-500",
      outline: "border border-gray-700 text-gray-700 hover:bg-gray-50",
    },
  },

  purple: {
    light: {
      filled: "bg-purple-700 text-white hover:bg-purple-800",
      outline: "border border-purple-700 text-purple-700 hover:bg-purple-50",
    },
    dark: {
      filled: "bg-purple-800 text-white hover:bg-purple-700",
      outline: "border border-purple-800 text-purple-800 hover:bg-purple-50",
    },
  },

  orange: {
    light: {
      filled: "bg-orange-700 text-white hover:bg-orange-800",
      outline: "border border-orange-700 text-orange-700 hover:bg-orange-50",
    },
    dark: {
      filled: "bg-orange-800 text-white hover:bg-orange-700",
      outline: "border border-orange-800 text-orange-800 hover:bg-orange-50",
    },
  },

  yellow: {
    light: {
      filled: "bg-yellow-700 text-white hover:bg-yellow-800",
      outline: "border border-yellow-700 text-yellow-700 hover:bg-yellow-50",
    },
    dark: {
      filled: "bg-yellow-800 text-white hover:bg-yellow-700",
      outline: "border border-yellow-800 text-yellow-800 hover:bg-yellow-50",
    },
  },
};

export function Button({
  children,
  variant = "filled",
  size = "base",
  theme = "primary",
  tone = "light",
  leftIcon,
  rightIcon,
  iconOnly = false,
  className,
  ...props
}: ButtonProps) {
  const currentSize = sizeClasses[size];

  const classes = cn(
    "inline-flex items-center justify-center",
    "font-medium",
    "transition-colors duration-200",
    "focus:outline-none",
    "focus:ring-2 focus:ring-primary-400",
    "disabled:pointer-events-none disabled:opacity-50",
    colorClasses[theme][tone][variant],
    iconOnly ? currentSize.iconOnly : currentSize.button,
    className,
  );

  const content = (
    <>
      {/* Left Icon */}
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

  if (props.as === "a") {
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
