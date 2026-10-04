import {
  Children,
  forwardRef,
  Fragment,
  isValidElement,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type OptgroupHTMLAttributes,
  type OptionHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react'
import { InfoCircle } from 'flowbite-react-icons/solid'
import { cn } from '../utils/cn'
import { Dropdown, type DropdownGroup } from './Dropdown'

/** Warna aksen per aplikasi — dipakai ikon info dan garis saat field difokus. */
export type SelectApplication = 'default' | 'simaya'

/** State mengikuti varian Figma. `inactive` sekaligus menonaktifkan kontrol. */
export type SelectState = 'default' | 'inactive'

/** Satu pilihan pada dropdown. */
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

/** Satu baris panel. Labelnya ReactNode karena `<option>` tulisan sendiri boleh berisi apa saja. */
type Opsi = { value: string; label: ReactNode; disabled?: boolean }

/** Satu kelompok baris; berlabel bila asalnya `<optgroup>`. */
type KelompokOpsi = { label?: string; options: Opsi[] }

const accents: Record<SelectApplication, { icon: string; focus: string }> = {
  default: { icon: 'text-primary-500', focus: 'focus-within:border-primary-500' },
  simaya: { icon: 'text-purple-500', focus: 'focus-within:border-purple-500' },
}

/**
 * Menyetel `<select>` seolah pengguna yang memilihnya sendiri: nilainya
 * disetel lewat setter bawaan, lalu event `change` sungguhan dilepas supaya
 * React memanggil `onChange` seperti biasa.
 *
 * Itu yang membuat panel tidak punya jalur pemberitahuan sendiri: kabar
 * perubahan tetap berangkat dari `<select>`, lengkap dengan `ChangeEvent` yang
 * dijanjikan `onChange`.
 */
function setelSelect(el: HTMLSelectElement | null, nilai: string) {
  if (!el) return
  const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set
  if (setter) setter.call(el, nilai)
  else el.value = nilai
  el.dispatchEvent(new Event('change', { bubbles: true }))
}

/** Teks polos isi sebuah `<option>` — nilai cadangan bila `value` tidak ditulis. */
const teksDari = (node: ReactNode): string =>
  Children.toArray(node)
    .map((n) => (typeof n === 'string' || typeof n === 'number' ? String(n) : ''))
    .join('')
    .trim()

/**
 * Membaca `<option>` dan `<optgroup>` yang ditulis sebagai `children`, supaya
 * daftar tulisan sendiri pun tampil di panel yang sama dengan daftar lewat
 * `options`. Aturannya mengikuti HTML: tanpa `value`, teksnya yang jadi nilai,
 * dan `<optgroup disabled>` mematikan seluruh isinya. Baris `awal` (placeholder)
 * mendahului semuanya, seperti `<option value="">` pertama di `<select>`.
 */
function bacaOpsi(children: ReactNode, awal: Opsi[]): KelompokOpsi[] {
  const kelompok: KelompokOpsi[] = [{ options: [...awal] }]

  const opsiDari = (el: ReactElement<OptionHTMLAttributes<HTMLOptionElement>>, mati?: boolean): Opsi => ({
    value: el.props.value !== undefined ? String(el.props.value) : teksDari(el.props.children),
    label: el.props.children,
    disabled: mati || el.props.disabled,
  })

  const telusuri = (node: ReactNode) =>
    Children.forEach(node, (anak) => {
      if (!isValidElement<{ children?: ReactNode }>(anak)) return
      if (anak.type === Fragment) return telusuri(anak.props.children)

      if (anak.type === 'option') {
        kelompok[kelompok.length - 1].options.push(
          opsiDari(anak as ReactElement<OptionHTMLAttributes<HTMLOptionElement>>),
        )
      } else if (anak.type === 'optgroup') {
        const { label, disabled, children: isi } = (
          anak as ReactElement<OptgroupHTMLAttributes<HTMLOptGroupElement>>
        ).props
        const grup: KelompokOpsi = { label, options: [] }
        Children.forEach(isi, (o) => {
          if (isValidElement(o) && o.type === 'option') {
            grup.options.push(opsiDari(o as ReactElement<OptionHTMLAttributes<HTMLOptionElement>>, disabled))
          }
        })
        // `<option>` lepas sesudah sebuah `<optgroup>` masuk kelompok tanpa
        // label yang baru, bukan menempel ke kelompok sebelumnya.
        kelompok.push(grup, { options: [] })
      }
    })

  telusuri(children)
  return kelompok.filter((k) => k.options.length > 0)
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
  /**
   * Daftar pilihan. Bila kosong, `<option>` — dan `<optgroup>` — yang ditulis
   * sebagai `children` yang dipakai; keduanya tampil di panel yang sama.
   */
  options?: SelectOption[]
  application?: SelectApplication
  state?: SelectState
  /** Kelas untuk pembungkus terluar (label + field + caption). */
  className?: string
}

/**
 * Regular Select Form — dropdown satu pilihan.
 *
 * Daftar pilihannya panel Dropdown, bukan popup milik sistem operasi, jadi
 * rupanya seragam dengan menu lain di kit ini. Nilainya tetap dibawa elemen
 * `<select>` yang dirender tersembunyi di belakang tombolnya: `value`,
 * `onChange`, `name`, `ref`, dan pengiriman formulir bekerja seperti pada
 * `<select>` biasa.
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

  const awal: Opsi[] = placeholder ? [{ value: '', label: placeholder }] : []
  const kelompok = options ? [{ options: [...awal, ...options] }] : bacaOpsi(children, awal)
  const chosenOption = kelompok.flatMap((k) => k.options).find((o) => o.value === current)

  // `selected` inilah yang membuat panel Dropdown berperan sebagai daftar
  // pilihan; penempatan, papan ketik, dan penutupannya sudah urusan Dropdown.
  const menuGroups: DropdownGroup[] = kelompok.map((k, i) => ({
    id: `kelompok-${i}`,
    label: k.label,
    items: k.options.map((option) => ({
      id: `opsi-${option.value}`,
      label: option.label,
      disabled: option.disabled,
      selected: option.value === current,
      onClick: () => setelSelect(selectRef.current, option.value),
    })),
  }))

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="mb-2 flex items-center gap-2">
          <label htmlFor={fieldId} id={labelId} className="text-sm font-bold text-gray-900">
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
          value={value}
          defaultValue={defaultValue}
          disabled={isInactive}
          aria-hidden="true"
          tabIndex={-1}
          onChange={handleChange}
          // Pembawa nilai saja: tombol di bawahnya yang terlihat, memegang id,
          // dan ditunjuk label. Ia disembunyikan lewat `opacity`, bukan
          // `hidden`, supaya peramban masih bisa memfokusnya untuk menampilkan
          // pesan validasi `required` — dan menutupi field supaya pesan itu
          // muncul di tempat yang benar.
          className="pointer-events-none absolute inset-0 size-full opacity-0"
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

        <Dropdown
          attached
          contentLabel={typeof label === 'string' ? label : props['aria-label']}
          groups={menuGroups}
          trigger={
            <button
              type="button"
              id={fieldId}
              disabled={isInactive}
              aria-labelledby={label ? labelId : undefined}
              aria-label={label ? undefined : props['aria-label']}
              aria-describedby={helperText ? helperId : undefined}
              // Tinggi 37px mengikuti Figma; sisi kanan diberi ruang untuk panah.
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
