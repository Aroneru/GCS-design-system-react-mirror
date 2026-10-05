import {
  Fragment,
  forwardRef,
  useId,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'
import { cn } from '../utils/cn'
import { Button } from './Button'
import {
  CalendarIcon,
  CodeIcon,
  CogIcon,
  DownloadIcon,
  FaceGrinIcon,
  ListIcon,
  PaperClipIcon,
} from './textarea/TextAreaToolbarIcons'

/** Type mengikuti varian desain: Default = kotak polos, Editor = kotak dengan toolbar. */
export type TextAreaType = 'default' | 'editor'

/** Platform mengikuti varian desain. Hanya mengubah tinggi kotak pada type `default`. */
export type TextAreaPlatform = 'default' | 'mobile'

/** Warna aksen per aplikasi — dipakai garis saat difokus dan tombol kirim. */
export type TextAreaApplication = 'default' | 'simaya'

/** Tinggi kotak isian pada type `default`: 162px di desktop, 120px di mobile. */
const boxes: Record<TextAreaPlatform, string> = {
  default: 'h-40.5',
  mobile: 'h-30',
}

/**
 * Tombol kirim gelap satu tingkat lebih terang (desain: primary-600). Button
 * sudah membawa `bg-primary-700 hover:bg-primary-800` sendiri, dan di antara
 * dua kelas untuk properti yang sama urutan CSS Tailwind yang menang — di sana
 * -700 jatuh setelah -600. Tanda `!` membuat warna gelap ini selalu menang.
 */
const accents: Record<TextAreaApplication, { focus: string; submit: string; submitDark: string }> = {
  default: {
    focus: 'focus-within:border-primary-600',
    submit: 'bg-primary-700 hover:bg-primary-800 focus-visible:outline-primary-700',
    submitDark: 'bg-primary-600! hover:bg-primary-700! focus-visible:outline-primary-600',
  },
  simaya: {
    focus: 'focus-within:border-purple-700',
    submit: 'bg-purple-700 hover:bg-purple-800 focus-visible:outline-purple-700',
    submitDark: 'bg-purple-600! hover:bg-purple-700! focus-visible:outline-purple-600',
  },
}

/** Warna tiap bagian untuk tampilan terang dan gelap. */
const themes = {
  light: {
    label: 'text-gray-900',
    hint: 'text-gray-500',
    field: 'text-gray-900 placeholder:text-gray-500 disabled:text-gray-400',
    box: 'border-gray-300 bg-surface-subtle',
    frame: 'border-gray-300',
    toolbar: 'bg-surface-subtle',
    tool: 'text-gray-500 hover:text-gray-800',
    divider: 'bg-gray-300',
    body: 'bg-surface',
    helper: 'text-gray-500',
  },
  /**
   * Dari desain gelap: kotak default tanpa garis yang terlihat, sedangkan
   * bingkai editor dan pemisah toolbarnya tetap gray-300. Toolbar dan area
   * isian editor sama-sama gray-800. Teks yang diketik putih seperti label.
   */
  dark: {
    label: 'text-white',
    hint: 'text-gray-500',
    field: 'text-white placeholder:text-gray-400 disabled:text-gray-500',
    box: 'border-gray-800 bg-gray-800',
    frame: 'border-gray-300',
    toolbar: 'bg-gray-800',
    tool: 'text-gray-400 hover:text-gray-200',
    divider: 'bg-gray-300',
    body: 'bg-gray-800',
    helper: 'text-gray-100',
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
  | 'download'

const toolbarItems: { action: TextAreaToolbarAction; label: string; Icon: typeof PaperClipIcon }[] = [
  { action: 'attachment', label: 'Lampirkan berkas', Icon: PaperClipIcon },
  { action: 'code', label: 'Sisipkan kode', Icon: CodeIcon },
  { action: 'emoji', label: 'Sisipkan emoji', Icon: FaceGrinIcon },
  { action: 'list', label: 'Daftar berpoin', Icon: ListIcon },
  { action: 'settings', label: 'Pengaturan', Icon: CogIcon },
  { action: 'date', label: 'Sisipkan tanggal', Icon: CalendarIcon },
  { action: 'download', label: 'Unduh', Icon: DownloadIcon },
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
  /** Tampilan gelap: kotak dan toolbar gray-800, label putih. */
  darkMode?: boolean
  /** Kelas untuk pembungkus terluar (label + kotak + caption + tombol). */
  className?: string
}

/**
 * Text Area — isian teks banyak baris.
 *
 * Type `default` menampilkan kotak polos setinggi 162px (120px di mobile),
 * sedangkan `editor` menambahkan toolbar 40px di atas area isian dan tombol
 * kirim opsional di bawahnya. Warna garis saat difokus dan tombol kirim
 * mengikuti prop `application`; `darkMode` mengganti sisanya ke tampilan gelap.
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
    darkMode = false,
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
  const t = darkMode ? themes.dark : themes.light
  const isEditor = type === 'editor'

  const field = (
    <textarea
      ref={ref}
      id={fieldId}
      disabled={disabled}
      aria-describedby={helperText ? helperId : undefined}
      className={cn(
        'block w-full resize-none p-4 text-sm outline-none disabled:cursor-not-allowed',
        t.field,
        // Editor: tinggi area isian 166px, di bawah toolbar 40px (total 206px).
        isEditor ? cn('h-41.5', t.body) : cn('rounded-lg border transition-colors', t.box, boxes[platform], accent.focus),
      )}
      {...props}
    />
  )

  return (
    <div className={cn('w-full', className)}>
      {(label || hint) && (
        <div className="mb-2 flex items-baseline justify-between gap-3">
          {label && (
            <label htmlFor={fieldId} className={cn('text-sm font-bold', t.label)}>
              {label}
            </label>
          )}
          {hint && <span className={cn('text-sm', t.hint)}>{hint}</span>}
        </div>
      )}

      {isEditor ? (
        <div className={cn('overflow-hidden rounded-lg border transition-colors', t.frame, accent.focus)}>
          {/* Jarak antarikon 15px, sesuai desain. */}
          <div className={cn('flex h-10 items-center gap-3.75 px-4', t.toolbar)}>
            {toolbar ?? (
              <>
                {toolbarItems.map(({ action, label: title, Icon }, i) => (
                  <Fragment key={action}>
                    {/* Garis pemisah memisahkan alat teks dari alat sisipan. Di desain ia
                        berjarak 16px dari ikon sebelumnya dan 15px dari ikon sesudahnya. */}
                    {i === 3 && <span aria-hidden="true" className={cn('ml-px h-4 w-px', t.divider)} />}
                    <button
                      type="button"
                      onClick={() => onToolbarAction?.(action)}
                      disabled={disabled}
                      aria-label={title}
                      title={title}
                      className={cn(
                        'shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current disabled:cursor-not-allowed disabled:opacity-50',
                        t.tool,
                      )}
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
        <p id={helperId} className={cn('mt-2 text-xs', t.helper)}>
          {helperText}
        </p>
      )}

      {isEditor && submitLabel && (
        <div className="mt-2">
          <Button onClick={onSubmit} disabled={disabled} className={darkMode ? accent.submitDark : accent.submit}>
            {submitLabel}
          </Button>
        </div>
      )}
    </div>
  )
})
