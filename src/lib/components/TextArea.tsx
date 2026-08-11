import {
  Fragment,
  forwardRef,
  useId,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'
import { CalendarMonth, Code, Cog, FaceGrin, List, PaperClip, Upload } from 'flowbite-react-icons/outline'
import { cn } from '../utils/cn'
import { Button } from './Button'

/** Type mengikuti varian Figma: Default = kotak polos, Editor = kotak dengan toolbar. */
export type TextAreaType = 'default' | 'editor'

/** Platform mengikuti varian Figma. Hanya mengubah tinggi kotak pada type `default`. */
export type TextAreaPlatform = 'default' | 'mobile'

/** Warna aksen per aplikasi — dipakai garis saat difokus dan tombol kirim. */
export type TextAreaApplication = 'default' | 'simaya'

/** Tinggi kotak isian pada type `default`: 162px di desktop, 120px di mobile. */
const boxes: Record<TextAreaPlatform, string> = {
  default: 'h-40.5',
  mobile: 'h-30',
}

const accents: Record<TextAreaApplication, { focus: string; submit: string }> = {
  default: {
    focus: 'focus-within:border-primary-600',
    submit: 'bg-primary-700 hover:bg-primary-800 focus-visible:outline-primary-700',
  },
  simaya: {
    focus: 'focus-within:border-purple-700',
    submit: 'bg-purple-700 hover:bg-purple-800 focus-visible:outline-purple-700',
  },
}

/** Tombol toolbar editor — dikirim ke `onToolbarAction` lewat namanya. */
export type TextAreaToolbarAction =
  | 'attachment'
  | 'code'
  | 'emoji'
  | 'list'
  | 'settings'
  | 'date'
  | 'upload'

const toolbarItems: { action: TextAreaToolbarAction; label: string; Icon: typeof PaperClip }[] = [
  { action: 'attachment', label: 'Lampirkan berkas', Icon: PaperClip },
  { action: 'code', label: 'Sisipkan kode', Icon: Code },
  { action: 'emoji', label: 'Sisipkan emoji', Icon: FaceGrin },
  { action: 'list', label: 'Daftar berpoin', Icon: List },
  { action: 'settings', label: 'Pengaturan', Icon: Cog },
  { action: 'date', label: 'Sisipkan tanggal', Icon: CalendarMonth },
  { action: 'upload', label: 'Unggah berkas', Icon: Upload },
]

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'> {
  /** Teks label di atas kotak. */
  label?: ReactNode
  /** Teks kecil di kanan label, mis. penghitung karakter. */
  hint?: ReactNode
  /** Caption di bawah kotak. */
  helperText?: ReactNode
  type?: TextAreaType
  platform?: TextAreaPlatform
  application?: TextAreaApplication
  /** Isi toolbar editor; bila diisi, menggantikan tombol bawaan. */
  toolbar?: ReactNode
  /** Dipanggil saat tombol toolbar bawaan ditekan. */
  onToolbarAction?: (action: TextAreaToolbarAction) => void
  /** Label tombol kirim di bawah editor. Tombol hanya muncul bila prop ini diisi. */
  submitLabel?: ReactNode
  onSubmit?: () => void
  /** Kelas untuk pembungkus terluar (label + kotak + caption + tombol). */
  className?: string
}

/**
 * Text Area — isian teks banyak baris.
 *
 * Type `default` menampilkan kotak polos setinggi 162px (120px di mobile),
 * sedangkan `editor` menambahkan toolbar 40px di atas area isian dan tombol
 * kirim opsional di bawahnya. Warna garis saat difokus dan tombol kirim
 * mengikuti prop `application`.
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  {
    label,
    hint,
    helperText,
    type = 'default',
    platform = 'default',
    application = 'default',
    toolbar,
    onToolbarAction,
    submitLabel,
    onSubmit,
    className,
    id,
    disabled,
    ...props
  },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const helperId = `${fieldId}-helper`

  const accent = accents[application]
  const isEditor = type === 'editor'

  const field = (
    <textarea
      ref={ref}
      id={fieldId}
      disabled={disabled}
      aria-describedby={helperText ? helperId : undefined}
      className={cn(
        'block w-full resize-none p-4 text-sm text-gray-900 outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:text-gray-400',
        // Editor: tinggi area isian 166px, di bawah toolbar 40px (total 206px).
        isEditor ? 'h-41.5 bg-surface' : cn('rounded-lg border border-gray-300 bg-surface-subtle transition-colors', boxes[platform], accent.focus),
      )}
      {...props}
    />
  )

  return (
    <div className={cn('w-full', className)}>
      {(label || hint) && (
        <div className="mb-2 flex items-baseline justify-between gap-3">
          {label && (
            <label htmlFor={fieldId} className="text-sm font-bold text-gray-900">
              {label}
            </label>
          )}
          {hint && <span className="text-sm text-gray-500">{hint}</span>}
        </div>
      )}

      {isEditor ? (
        <div
          className={cn(
            'overflow-hidden rounded-lg border border-gray-300 transition-colors',
            accent.focus,
          )}
        >
          <div className="flex h-10 items-center gap-4 bg-surface-subtle px-4">
            {toolbar ?? (
              <>
                {toolbarItems.map(({ action, label: title, Icon }, i) => (
                  <Fragment key={action}>
                    {/* Garis pemisah memisahkan alat teks dari alat sisipan, sesuai Figma. */}
                    {i === 3 && <span aria-hidden="true" className="h-4 w-px bg-gray-300" />}
                    <button
                      type="button"
                      onClick={() => onToolbarAction?.(action)}
                      disabled={disabled}
                      aria-label={title}
                      title={title}
                      className="shrink-0 text-gray-500 transition-colors hover:text-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Icon className="size-4" />
                    </button>
                  </Fragment>
                ))}
              </>
            )}
          </div>
          {field}
        </div>
      ) : (
        field
      )}

      {helperText && (
        <p id={helperId} className="mt-2 text-xs text-gray-500">
          {helperText}
        </p>
      )}

      {isEditor && submitLabel && (
        <div className="mt-2">
          <Button onClick={onSubmit} disabled={disabled} className={accent.submit}>
            {submitLabel}
          </Button>
        </div>
      )}
    </div>
  )
})
