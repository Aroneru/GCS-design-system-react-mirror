import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { Upload as UploadIcon } from 'flowbite-react-icons/solid'
import { cn } from '../utils/cn'

/** Bentuk kontrol: `default` = baris tombol + nama berkas, `attach` = area seret-lepas. */
export type UploadType = 'default' | 'attach'

/** Ukuran baris pemilih berkas: `default` 44px (desktop), `mobile` 40px. */
export type UploadPlatform = 'default' | 'mobile'

/** Warna aksen per aplikasi — dipakai tombol pilih berkas dan sorotan saat seret. */
export type UploadApplication = 'default' | 'simaya'

/**
 * Tinggi kotak, ukuran teks, dan jarak samping tombol per platform.
 *
 * Jarak sampingnya nilai lepas (22px dan 21px), bukan langkah skala terdekat:
 * tombolnya harus jadi selebar 94px dan 86px, dan `px-5` membuatnya kurang
 * 4px dari itu.
 */
const platforms: Record<UploadPlatform, { field: string; text: string; button: string }> = {
  default: { field: 'h-11', text: 'text-sm', button: 'px-[22px] text-sm' },
  mobile: { field: 'h-10', text: 'text-xs', button: 'px-[21px] text-xs' },
}

/**
 * Aksen per aplikasi. `solid` untuk tombol pilih berkas, `drag` untuk sorotan
 * area attach selama berkas ditahan di atasnya. Keduanya ditulis utuh karena
 * Tailwind memindai nama kelas secara harfiah.
 */
const accents: Record<UploadApplication, { solid: string; drag: string }> = {
  default: {
    solid: 'bg-primary-700 hover:bg-primary-800 focus-visible:outline-primary-700',
    drag: 'border-primary-500 bg-primary-50',
  },
  simaya: {
    solid: 'bg-purple-500 hover:bg-purple-600 focus-visible:outline-purple-500',
    drag: 'border-purple-500 bg-purple-50',
  },
}

export interface UploadProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value'> {
  /** Teks label di atas kontrol. */
  label?: ReactNode
  /** Caption di bawah kontrol. */
  helperText?: ReactNode
  /** Label tombol pilih berkas. */
  buttonLabel?: string
  /** Teks kolom nama berkas saat belum ada yang dipilih. */
  placeholder?: string
  type?: UploadType
  /**
   * Ukuran baris pemilih berkas. Tidak berpengaruh pada type `attach`: isinya
   * sama di kedua ukuran, yang berbeda hanya lebar kotaknya — dan lebar itu
   * datang dari wadahnya, karena komponen ini selebar ruang yang diberikan.
   */
  platform?: UploadPlatform
  /** Warna tombol; pada type `attach` hanya terlihat saat berkas sedang diseret. */
  application?: UploadApplication
  /** Baris ajakan pada varian attach. */
  attachLabel?: ReactNode
  /** Baris keterangan format pada varian attach. */
  attachHint?: ReactNode
  /** Dipanggil setiap berkas berganti, baik lewat dialog maupun seret-lepas. */
  onFilesChange?: (files: FileList | null) => void
  /** Kelas untuk pembungkus terluar (label + kontrol + caption). */
  className?: string
}

/**
 * Upload Form — pemilih berkas.
 *
 * Type `default` berupa satu baris: tombol pilih berkas di kiri dan nama
 * berkas terpilih di kanan. Type `attach` berupa area seret-lepas bergaris
 * putus-putus setinggi 230px yang melebar mengikuti wadahnya.
 *
 * Di dalamnya tetap ada `<input type="file">` sungguhan yang hanya
 * disembunyikan secara visual, jadi dialog berkas, fokus keyboard, dan
 * pengiriman formulir bekerja apa adanya — bukan tombol yang meniru input.
 */
export const Upload = forwardRef<HTMLInputElement, UploadProps>(function Upload(
  {
    label,
    helperText,
    buttonLabel = 'Pilih File',
    placeholder = 'Belum ada file yang dipilih',
    type = 'default',
    platform = 'default',
    application = 'default',
    attachLabel = 'Click to upload or drag and drop',
    attachHint = 'SVG, PNG, JPG or GIF (MAX. 800x400px)',
    onFilesChange,
    className,
    id,
    disabled,
    onChange,
    ...props
  },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const helperId = `${fieldId}-helper`

  const inputRef = useRef<HTMLInputElement>(null)
  const [nama, setNama] = useState<string[]>([])
  const [seret, setSeret] = useState(false)

  const size = platforms[platform]
  const accent = accents[application]

  // Ref internal dipakai untuk membuka dialog dari tombol dan menerima berkas
  // hasil seret-lepas; ref dari luar tetap diteruskan.
  const attachInput = (node: HTMLInputElement | null) => {
    inputRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  const catat = (files: FileList | null) => {
    setNama(files ? Array.from(files, (f) => f.name) : [])
    onFilesChange?.(files)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    catat(event.target.files)
    onChange?.(event)
  }

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setSeret(false)
    if (disabled) return
    // Berkas hasil seret dititipkan ke input aslinya, bukan hanya disimpan di
    // state, supaya ikut terkirim saat formulirnya di-submit.
    if (inputRef.current) inputRef.current.files = event.dataTransfer.files
    catat(event.dataTransfer.files)
  }

  const input = (
    <input
      ref={attachInput}
      id={fieldId}
      type="file"
      disabled={disabled}
      aria-describedby={helperText ? helperId : undefined}
      onChange={handleChange}
      className="sr-only"
      {...props}
    />
  )

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label htmlFor={fieldId} className="mb-2 block text-sm font-bold text-gray-900">
          {label}
        </label>
      )}

      {type === 'attach' ? (
        // Tinggi 230px sudah termasuk garisnya: kotaknya border-box, jadi
        // border 2px itu menyisakan 226px untuk isi.
        <label
          htmlFor={fieldId}
          onDragOver={(event) => event.preventDefault()}
          onDragEnter={() => !disabled && setSeret(true)}
          onDragLeave={() => setSeret(false)}
          onDrop={handleDrop}
          className={cn(
            'flex h-[230px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 text-center transition-colors',
            disabled
              ? 'cursor-not-allowed border-gray-200 bg-gray-100'
              : cn('cursor-pointer border-gray-200 bg-gray-50 hover:bg-gray-100', seret && accent.drag),
          )}
        >
          {input}

          {/*
            Isi dimatikan pointer-event-nya supaya dragenter/dragleave hanya
            terpicu oleh kotaknya sendiri; tanpa itu, melintasi teks di dalam
            akan terbaca sebagai keluar dari area dan sorotannya berkedip.
          */}
          <div className="pointer-events-none flex flex-col items-center">
            <UploadIcon className={cn('size-5', disabled ? 'text-gray-300' : 'text-gray-400')} />
            <span className={cn('mt-2 text-sm', disabled ? 'text-gray-400' : 'text-gray-500')}>
              {nama.length > 0 ? nama.join(', ') : attachLabel}
            </span>
            <span className={cn('mt-2 text-xs', disabled ? 'text-gray-400' : 'text-gray-500')}>
              {attachHint}
            </span>
          </div>
        </label>
      ) : (
        <div
          className={cn(
            'flex items-stretch overflow-hidden rounded-lg border border-gray-300',
            size.field,
          )}
        >
          {input}

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className={cn(
              'shrink-0 border-r border-gray-300 font-medium text-white transition-colors',
              'focus-visible:outline-2 focus-visible:-outline-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              size.button,
              accent.solid,
            )}
          >
            {buttonLabel}
          </button>

          <p
            className={cn(
              'flex min-w-0 flex-1 items-center bg-gray-50 px-4',
              size.text,
              disabled ? 'text-gray-400' : 'text-gray-900',
            )}
          >
            <span className="truncate">{nama.length > 0 ? nama.join(', ') : placeholder}</span>
          </p>
        </div>
      )}

      {helperText && (
        <p id={helperId} className={cn('mt-2 text-xs', disabled ? 'text-gray-400' : 'text-gray-500')}>
          {helperText}
        </p>
      )}
    </div>
  )
})
