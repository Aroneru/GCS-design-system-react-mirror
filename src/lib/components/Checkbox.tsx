import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";

/** Platform mengikuti varian desain: Default = 16px, Mobile = 14px. */
export type CheckboxPlatform = "default" | "mobile";

/** State mengikuti varian desain. `inactive` sekaligus menonaktifkan kontrol. */
export type CheckboxState = "default" | "inactive";

/** Warna aksen per aplikasi — dipakai kotak saat tercentang. */
export type CheckboxApplication = "default" | "simaya";

/**
 * Ukuran kotak, jarak turun agar sejajar tengah baris label, dan ukuran teks
 * label per platform. Centang tetap 10px di kedua platform.
 */
const platforms: Record<CheckboxPlatform, { box: string; offset: string; label: string }> = {
  default: { box: "size-4", offset: "mt-0.5", label: "text-sm" },
  mobile: { box: "size-3.5", offset: "mt-px", label: "text-xs" },
};

/** Warna kotak tercentang sama di tampilan terang dan gelap. */
const accents: Record<CheckboxApplication, string> = {
  default: "checked:border-primary-700 checked:bg-primary-700 focus-visible:outline-primary-700",
  simaya: "checked:border-purple-500 checked:bg-purple-500 focus-visible:outline-purple-500",
};

/** Warna kotak dan teks per tampilan, untuk state aktif dan `inactive`. */
const themes = {
  light: {
    box: "border-gray-300 bg-gray-50",
    boxInactive: "checked:border-gray-400 checked:bg-gray-400",
    label: "text-gray-900",
    labelInactive: "text-gray-400",
    helper: "text-gray-500",
    helperInactive: "text-gray-400",
  },
  /**
   * Dari desain gelap: kotak gray-700 bergaris gray-600, label putih, caption
   * gray-400; inactive meredupkan label dan caption ke gray-500. Kotak inactive
   * yang tercentang tidak digambar desain; gray-500 menyamai teksnya, seperti
   * gray-400 pada tampilan terang.
   */
  dark: {
    box: "border-gray-600 bg-gray-700",
    boxInactive: "checked:border-gray-500 checked:bg-gray-500",
    label: "text-white",
    labelInactive: "text-gray-500",
    helper: "text-gray-400",
    helperInactive: "text-gray-500",
  },
};

/**
 * Centang 10px, digambar sendiri agar titik sudutnya persis seperti desain.
 * Warnanya putih di tampilan terang maupun gelap.
 */
const CheckIcon = () => (
  <svg
    className="pointer-events-none relative size-2.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
    viewBox="0 0 10 10"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M1 5 3.6 8.2 9 1.8" />
  </svg>
);

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> {
  /** Teks di samping kotak. */
  label?: ReactNode;
  /** Caption 12px di bawah label. */
  helperText?: ReactNode;
  platform?: CheckboxPlatform;
  state?: CheckboxState;
  application?: CheckboxApplication;
  /** Tampilan gelap: kotak gray-700 bergaris gray-600, label putih, caption gray-400. */
  darkMode?: boolean;
  /** Kelas untuk pembungkus terluar (kotak + label + caption). */
  className?: string;
}

/**
 * Checkbox — pilihan ganda yang bisa dicentang secara mandiri.
 *
 * Kotaknya adalah `<input type="checkbox">` yang digambar ulang, dengan centang
 * menumpang di atasnya lewat varian `peer` — jadi tak ada state di React dan
 * elemen bawaannya tetap utuh untuk keyboard maupun pembaca layar. State
 * tercentang di desain sama dengan `checked`, jadi ia dikendalikan lewat
 * `checked`/`defaultChecked` biasa, bukan prop tersendiri. `darkMode` mengganti
 * warnanya ke tampilan gelap.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    label,
    helperText,
    platform = "default",
    state = "default",
    application = "default",
    darkMode = false,
    className,
    id,
    disabled,
    ...props
  },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const helperId = `${fieldId}-helper`;

  const isInactive = disabled || state === "inactive";
  const { box, offset, label: labelText } = platforms[platform];
  const t = darkMode ? themes.dark : themes.light;

  const control = (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        box,
        label || helperText ? offset : undefined,
      )}
    >
      <input
        ref={ref}
        type="checkbox"
        id={fieldId}
        disabled={isInactive}
        aria-describedby={helperText ? helperId : undefined}
        className={cn(
          "peer absolute inset-0 size-full appearance-none rounded border transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          "disabled:cursor-not-allowed",
          t.box,
          // Desain tidak meredupkan kotaknya saat inactive — hanya teksnya.
          isInactive ? t.boxInactive : cn("cursor-pointer", accents[application]),
        )}
        {...props}
      />

      <CheckIcon />
    </span>
  );

  if (!label && !helperText) {
    return <span className={cn("inline-flex", className)}>{control}</span>;
  }

  return (
    <div className={cn("flex items-start gap-2", className)}>
      {control}

      <div className="min-w-0">
        {label && (
          <label
            htmlFor={fieldId}
            className={cn(
              "block font-bold",
              labelText,
              isInactive ? cn("cursor-not-allowed", t.labelInactive) : cn("cursor-pointer", t.label),
            )}
          >
            {label}
          </label>
        )}

        {helperText && (
          <p
            id={helperId}
            className={cn("mt-0.5 text-xs", isInactive ? t.helperInactive : t.helper)}
          >
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
});
