import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";

/** Platform mengikuti varian Figma: Default = 16px, Mobile = 14px. */
export type CheckboxPlatform = "default" | "mobile";

/** State mengikuti varian Figma. `inactive` sekaligus menonaktifkan kontrol. */
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

const accents: Record<CheckboxApplication, string> = {
  default: "checked:border-primary-700 checked:bg-primary-700 focus-visible:outline-primary-700",
  simaya: "checked:border-purple-500 checked:bg-purple-500 focus-visible:outline-purple-500",
};

/** Centang 10px, digambar sendiri agar titik sudutnya persis seperti Figma. */
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
  /** Kelas untuk pembungkus terluar (kotak + label + caption). */
  className?: string;
}

/**
 * Checkbox — pilihan ganda yang bisa dicentang secara mandiri.
 *
 * Kotaknya adalah `<input type="checkbox">` yang digambar ulang, dengan centang
 * menumpang di atasnya lewat varian `peer` — jadi tak ada state di React dan
 * elemen bawaannya tetap utuh untuk keyboard maupun pembaca layar. State
 * tercentang di Figma sama dengan `checked`, jadi ia dikendalikan lewat
 * `checked`/`defaultChecked` biasa, bukan prop tersendiri.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    label,
    helperText,
    platform = "default",
    state = "default",
    application = "default",
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
          "peer absolute inset-0 size-full appearance-none rounded border border-gray-300 bg-gray-50 transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          "disabled:cursor-not-allowed",
          // Figma tidak meredupkan kotaknya saat inactive — hanya teksnya.
          isInactive
            ? "checked:border-gray-400 checked:bg-gray-400"
            : cn("cursor-pointer", accents[application]),
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
              isInactive ? "cursor-not-allowed text-gray-400" : "cursor-pointer text-gray-900",
            )}
          >
            {label}
          </label>
        )}

        {helperText && (
          <p
            id={helperId}
            className={cn("mt-0.5 text-xs", isInactive ? "text-gray-400" : "text-gray-500")}
          >
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
});
