import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react'
import { InfoCircle } from 'flowbite-react-icons/solid'
import { cn } from '../utils/cn'
import { Dropdown, type DropdownItem } from './Dropdown'

/** Warna aksen per aplikasi — dipakai ikon info dan garis saat field difokus. */
export type SelectApplication = 'default' | 'simaya'

/** State mengikuti varian Figma. `inactive` sekaligus menonaktifkan kontrol. */
export type SelectState = 'default' | 'inactive'

/** Bentuk daftar pilihan: popup bawaan sistem, atau panel bergaya kit. */
export type SelectMenuMode = 'native' | 'panel'

/** Satu pilihan pada dropdown. */
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

const accents: Record<SelectApplication, { icon: string; focus: string }> = {
  default: { icon: 'text-primary-500', focus: 'focus-within:border-primary-500' },
  simaya: { icon: 'text-purple-500', focus: 'focus-within:border-purple-500' },
}

/**
 * Menyetel `<select>` seolah pengguna yang memilihnya sendiri: nilainya
 * disetel lewat setter bawaan, lalu event `change` sungguhan dilepas supaya
 * React memanggil `onChange` seperti biasa.
 *
 * Itu yang membuat bentuk `panel` tidak punya jalur pemberitahuan sendiri:
 * apa pun bentuk daftarnya, kabar perubahan tetap berangkat dari `<select>`
 * yang sama, lengkap dengan `ChangeEvent` yang dijanjikan `onChange`.
 */
function setelSelect(el: HTMLSelectElement | null, nilai: string) {
  if (!el) return
  const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set
  if (setter) setter.call(el, nilai)
  else el.value = nilai
  el.dispatchEvent(new Event('change', { bubbles: true }))
}

/**
 * Panah dropdown 8×4 di dalam kotak ikon 12px, digambar sendiri supaya
 * ukurannya persis seperti Figma — ikon panah dari pustaka jauh lebih kecil.
 */
const ChevronIcon = () => (
  <svg
    className="size-3"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 4.5 6 8.5l4-4" />
  </svg>
)

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Teks label di atas field. */
  label?: ReactNode
  /** Keterangan singkat pada ikon info di samping label. Ikon muncul bila prop ini diisi. */
  info?: string
  /** Caption/pesan bantuan di bawah field. */
  helperText?: ReactNode
  /** Teks saat belum ada pilihan, mis. "Pilih Apapun Itu". */
  placeholder?: string
  /** Daftar pilihan. Bila kosong, `children` (<option> sendiri) yang dipakai. */
  options?: SelectOption[]
  /**
   * Bentuk daftar pilihannya. `native` memakai popup bawaan sistem: paling
   * ringan, dan di ponsel muncul sebagai pemilih layar penuh yang sudah akrab.
   * `panel` menggantinya dengan panel bergaya kit — sama rupanya dengan
   * Dropdown — untuk halaman yang tampilannya harus seragam sampai ke daftar
   * pilihan. Hanya berlaku bila `options` diisi; daftar yang ditulis sebagai
   * `children` tidak bisa dibaca komponen, jadi di situ ia tetap memakai popup
   * bawaan. Selain rupanya tidak ada yang berubah: `value`, `onChange`,
   * `name`, dan pengiriman formulir sama persis di kedua bentuk.
   */
  menu?: SelectMenuMode
  application?: SelectApplication
  state?: SelectState
  /** Kelas untuk pembungkus terluar (label + field + caption). */
  className?: string
}

/**
 * Regular Select Form — dropdown satu pilihan.
 *
 * Selalu memakai elemen `<select>` bawaan sebagai kontrol sebenarnya, supaya
 * nilai, `name`, dan pengiriman formulir tidak pernah bergantung pada tampilan.
 * Dalam bentuk `native` ia juga yang terlihat dan hanya panahnya yang digambar
 * sendiri; dalam bentuk `panel` ia tetap ada di belakang layar sementara yang
 * terlihat adalah tombol dan panel bergaya kit.
 *
 * State `inactive` menonaktifkan kontrol sekaligus meredupkan tampilannya, dan
 * warna ikon info serta garis saat difokus mengikuti prop `application`.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    info,
    helperText,
    placeholder,
    options,
    menu = 'native',
    application = 'default',
    state = 'default',
    className,
    id,
    value,
    defaultValue,
    disabled,
    onChange,
    children,
    ...props
  },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const helperId = `${fieldId}-helper`
  const labelId = `${fieldId}-label`

  // Field tak terkendali tidak punya `value`, jadi pilihannya dicatat sendiri
  // agar teks placeholder tetap bisa dibedakan warnanya dari pilihan sungguhan.
  const [chosen, setChosen] = useState(() => String(defaultValue ?? ''))
  const current = value !== undefined ? String(value) : chosen

  const isInactive = disabled || state === 'inactive'
  const isPlaceholder = current === ''
  const accent = accents[application]
  const usePanel = menu === 'panel' && Boolean(options?.length)

  // Ref internal dipakai untuk menyetel nilai saat memilih dari panel; ref dari
  // luar tetap diteruskan supaya pemakai masih memegang `<select>` yang sama.
  const selectRef = useRef<HTMLSelectElement | null>(null)
  const attachSelect = (node: HTMLSelectElement | null) => {
    selectRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setChosen(event.target.value)
    onChange?.(event)
  }

  // Placeholder di panel adalah baris pilihan biasa, sama seperti ia jadi
  // <option value=""> pertama pada bentuk native.
  const menuOptions = placeholder
    ? [{ value: '', label: placeholder }, ...(options ?? [])]
    : (options ?? [])
  const chosenOption = menuOptions.find((option) => option.value === current)

  // `selected` inilah yang membuat panel Dropdown berpindah peran jadi
  // daftar pilihan; sisanya — penempatan, papan ketik, penutupan — sudah
  // jadi urusan Dropdown, jadi tidak ada panel kedua di kit ini.
  const menuItems: DropdownItem[] = menuOptions.map((option) => ({
    id: `opsi-${option.value}`,
    label: option.label,
    disabled: option.disabled,
    selected: option.value === current,
    onClick: () => setelSelect(selectRef.current, option.value),
  }))

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="mb-2 flex items-center gap-2">
          <label
            htmlFor={fieldId}
            id={usePanel ? labelId : undefined}
            className="text-sm font-bold text-gray-900"
          >
            {label}
          </label>
          {info && (
            <span
              title={info}
              aria-label={info}
              className={cn('flex shrink-0 items-center', isInactive ? 'text-gray-400' : accent.icon)}
            >
              <InfoCircle className="size-3" />
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          'relative flex items-center rounded-lg border border-gray-300 transition-colors',
          isInactive ? 'bg-gray-100' : cn('bg-gray-50', accent.focus),
        )}
      >
        <select
          ref={attachSelect}
          // Pada bentuk panel, tombollah yang memegang id dan ditunjuk label;
          // `<select>` tinggal jadi pembawa nilai.
          id={usePanel ? undefined : fieldId}
          value={value}
          defaultValue={defaultValue}
          disabled={isInactive}
          aria-describedby={helperText && !usePanel ? helperId : undefined}
          aria-hidden={usePanel || undefined}
          tabIndex={usePanel ? -1 : undefined}
          onChange={handleChange}
          className={cn(
            // Tinggi 37px mengikuti Figma; panah bawaan browser dimatikan dan
            // diganti ikon sendiri, jadi sisi kanan diberi ruang lebih.
            'h-9.25 w-full appearance-none bg-transparent pr-8 pl-2.5 text-sm outline-none disabled:cursor-not-allowed',
            usePanel
              ? // Pada bentuk panel ia keluar dari alur supaya tombollah yang
                // mengisi field, tapi tetap dirender: disembunyikan lewat
                // `opacity`, bukan `hidden`, supaya peramban masih bisa
                // memfokusnya untuk menampilkan pesan validasi `required`.
                'pointer-events-none absolute opacity-0'
              : isInactive
                ? 'text-gray-300'
                : isPlaceholder
                  ? 'text-gray-500'
                  : 'text-gray-900',
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options
            ? options.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))
            : children}
        </select>

        {usePanel && (
          <Dropdown
            attached
            contentLabel={typeof label === 'string' ? label : props['aria-label']}
            items={menuItems}
            trigger={
              <button
                type="button"
                id={fieldId}
                disabled={isInactive}
                aria-labelledby={label ? labelId : undefined}
                aria-label={label ? undefined : props['aria-label']}
                aria-describedby={helperText ? helperId : undefined}
                className={cn(
                  'flex h-9.25 w-full items-center pr-8 pl-2.5 text-left text-sm outline-none',
                  'disabled:cursor-not-allowed',
                  isInactive ? 'text-gray-300' : isPlaceholder ? 'text-gray-500' : 'text-gray-900',
                )}
              >
                <span className="truncate">{chosenOption?.label ?? placeholder ?? ''}</span>
              </button>
            }
          />
        )}

        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute right-2.5 flex items-center',
            isInactive ? 'text-gray-300' : 'text-gray-500',
          )}
        >
          <ChevronIcon />
        </span>
      </div>

      {helperText && (
        <p id={helperId} className={cn('mt-2 text-sm', isInactive ? 'text-gray-400' : 'text-gray-500')}>
          {helperText}
        </p>
      )}
    </div>
  )
})
