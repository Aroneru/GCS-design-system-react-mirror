import { useState } from 'react'
import { User } from '../../../../lib/icons/solid'
import {
  InputField,
  type InputFieldApplication,
  type InputFieldPlatform,
  type InputFieldState,
} from '../../../../lib'
import { PropsTable, type PropRow } from '../../../PropsTable'
import { Demo, H, Hl, Segmented } from '../../../pageKit'
import {
  Control,
  Controls,
  FlowSection,
  Lead,
  SectionCode,
  Stage,
  UsulanPage,
  type TocEntry,
} from '../../../usulanKit'
import { adaTidakAda } from '../../../usulanOptions'

const states: { value: InputFieldState; label: string; desc: string }[] = [
  { value: 'default', label: 'Default', desc: 'Belum disentuh — garis abu-abu netral.' },
  { value: 'typing', label: 'Typing', desc: 'Sedang diisi/difokus — garis memakai warna aplikasi.' },
  { value: 'inactive', label: 'Inactive', desc: 'Tidak bisa diisi; seluruh teks meredup.' },
  { value: 'failed', label: 'Failed', desc: 'Isian ditolak validasi — latar dan teks merah.' },
]

const applications: { value: InputFieldApplication; label: string; token: string }[] = [
  { value: 'default', label: 'Default', token: 'primary-500' },
  { value: 'simaya', label: 'simaya', token: 'purple-500' },
]

/** Contoh password: desktop dan mobile, lalu failed. Bagian Dark mode memakai daftar yang sama, tanpa mobile. */
const passwordDemos: { label: string; platform: InputFieldPlatform; state: InputFieldState }[] = [
  { label: 'Desktop', platform: 'default', state: 'default' },
  { label: 'Mobile', platform: 'mobile', state: 'default' },
  { label: 'Failed', platform: 'default', state: 'failed' },
]

function PasswordDemoField({
  platform,
  state,
  dark = false,
}: {
  platform: InputFieldPlatform
  state: InputFieldState
  dark?: boolean
}) {
  return (
    <InputField
      type="password"
      platform={platform}
      state={state}
      darkMode={dark}
      label="Kata sandi"
      placeholder="••••••••"
      helperText={state === 'failed' ? 'Kata sandi minimal 8 karakter.' : 'Gunakan minimal 8 karakter.'}
      autoComplete="current-password"
    />
  )
}

const inputProps: PropRow[] = [
  ['label', 'ReactNode', 'undefined', 'Teks label di atas field.'],
  ['helperText', 'ReactNode', 'undefined', 'Caption di bawah field; jadi pesan error saat state failed.'],
  ['icon', 'ReactNode', 'undefined', 'Ikon di sisi kiri field. Pada type password bawaannya gembok; null menghilangkannya.'],
  ['type', "'text' | 'password' | …", 'text', "'password' menyamarkan isian, memasang ikon gembok, dan menambahkan tombol mata untuk menampilkannya."],
  ['platform', "'default' | 'mobile'", 'default', 'Tinggi field: 52px (default) atau 40px (mobile).'],
  ['state', "'default' | 'typing' | 'inactive' | 'failed'", 'default', 'Kondisi visual field.'],
  ['application', "'default' | 'simaya'", 'default', 'Warna garis aksen saat field aktif.'],
  ['onClear', '() => void', 'undefined', 'Bila diisi, tombol hapus (×) muncul di kanan field.'],
  ['darkMode', 'boolean', 'false', 'Tampilan gelap: field gray-800, label putih, garis baru terlihat saat typing dan failed.'],
  ['…props', 'InputHTMLAttributes', '—', 'Seluruh atribut <input> standar diteruskan (value, onChange, autoComplete, …).'],
]

const toc: TocEntry[] = [
  { id: 'input-field', label: 'Input Field' },
  { id: 'states', label: 'States' },
  { id: 'application', label: 'Application' },
  { id: 'password', label: 'Password' },
  { id: 'dark-mode', label: 'Dark mode' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

export function InputFieldPage() {
  const [platform, setPlatform] = useState<InputFieldPlatform>('default')
  const [state, setState] = useState<InputFieldState>('default')
  const [application, setApplication] = useState<InputFieldApplication>('default')
  const [withIcon, setWithIcon] = useState(true)
  const [withHelper, setWithHelper] = useState(true)
  const [withClear, setWithClear] = useState(true)
  const [value, setValue] = useState('')
  const [dark, setDark] = useState(false)
  const [kind, setKind] = useState<'text' | 'password'>('text')

  const isPassword = kind === 'password'
  // Password tidak memakai state inactive: pilihannya dimatikan, dan selama
  // tipe password field tampil default. Kembali ke teks, pilihan semula berlaku lagi.
  const fieldState = isPassword && state === 'inactive' ? 'default' : state
  const isFailed = fieldState === 'failed'
  const fieldLabel = isPassword ? 'Kata sandi' : 'Nama lengkap'
  const fieldPlaceholder = isPassword ? '••••••••' : 'Masukkan nama lengkap'
  const helper = isPassword
    ? isFailed
      ? 'Kata sandi minimal 8 karakter.'
      : 'Gunakan minimal 8 karakter.'
    : isFailed
      ? 'Nama lengkap wajib diisi.'
      : 'Sesuai yang tertera pada KTP.'

  return (
    <UsulanPage
      eyebrow="Form · Input Field Form"
      title="Input Field"
      description="Isian teks satu baris dengan label di atas field. Tinggi, warna, dan jaraknya memakai token yang sama dengan Foundations. Tersedia juga versi kata sandi dan tampilan gelap."
      toc={toc}
    >
      <FlowSection id="input-field" title="Input Field">
        <Lead>
          Label di atas, field dengan ikon opsional dan tombol hapus, lalu caption di bawah. Tinggi field
          mengikuti platform — 52px di desktop, 40px di mobile.
        </Lead>
        <div className="grid gap-5 sm:grid-cols-2">
          <Demo label="Desktop · 52px">
            <InputField
              label="Nama lengkap"
              placeholder="Masukkan nama lengkap"
              helperText="Sesuai yang tertera pada KTP."
              icon={<User className="size-4" />}
            />
          </Demo>
          <Demo label="Mobile · 40px">
            <InputField
              platform="mobile"
              label="Nama lengkap"
              placeholder="Masukkan nama lengkap"
              helperText="Sesuai yang tertera pada KTP."
              icon={<User className="size-4" />}
            />
          </Demo>
        </div>
        <SectionCode>
          {"import { InputField } from '@ceplok-ui/design-kit-react'\n"}
          {"import { User } from '@ceplok-ui/design-kit-react/icons/solid'\n\n"}
          {'<InputField\n'}
          {'    label="Nama lengkap"\n'}
          {'    placeholder="Masukkan nama lengkap"\n'}
          {'    helperText="Sesuai yang tertera pada KTP."\n'}
          {'    icon={<User className="size-4" />}\n'}
          {'/>\n\n'}
          {'{/* Mobile — field 40px */}\n'}
          {'<InputField '}
          <H>platform</H>
          {'="mobile" label="Nama lengkap" />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="states" title="States">
        <Lead>
          Empat kondisi visual field. <Hl>inactive</Hl> otomatis menonaktifkan input dan <Hl>failed</Hl>{' '}
          menandainya <Hl>aria-invalid</Hl>, jadi tampilan dan makna aksesibilitasnya selalu sejalan.
        </Lead>
        <div className="grid gap-5 sm:grid-cols-2">
          {states.map((s) => (
            <Demo key={s.value} label={s.label}>
              <InputField
                state={s.value}
                label="Nama lengkap"
                placeholder="Masukkan nama lengkap"
                helperText={s.value === 'failed' ? 'Nama lengkap wajib diisi.' : s.desc}
                icon={<User className="size-4" />}
              />
            </Demo>
          ))}
        </div>
        <SectionCode>
          {'{/* Pesan error — failed sekaligus menandai aria-invalid */}\n'}
          {'<InputField\n'}
          {'    '}
          <H>state</H>
          {'="failed"\n'}
          {'    label="Nama lengkap"\n'}
          {'    helperText="Nama lengkap wajib diisi."\n'}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="application" title="Application">
        <Lead>
          Warna garis saat field aktif mengikuti aplikasi yang memakainya — memakai token warna yang sama
          dengan palet Foundations.
        </Lead>
        <div className="grid gap-5 sm:grid-cols-2">
          {applications.map((a) => (
            <Demo key={a.value} label={a.label}>
              <InputField
                application={a.value}
                state="typing"
                label="Nama lengkap"
                placeholder="Masukkan nama lengkap"
                helperText={`border-${a.token}`}
                icon={<User className="size-4" />}
              />
            </Demo>
          ))}
        </div>
        <SectionCode>
          {'<InputField\n'}
          {'    '}
          <H>application</H>
          {'="simaya"\n'}
          {'    state="typing"\n'}
          {'    label="Nama lengkap"\n'}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="password" title="Password">
        <Lead>
          Dengan <Hl>type="password"</Hl> isiannya disamarkan, ikon gembok tampil di kiri, dan tombol mata di
          kanan menampilkan atau menyembunyikan kata sandi. Gembok bisa diganti lewat <Hl>icon</Hl>, atau
          dihilangkan dengan <Hl>{'icon={null}'}</Hl>. Sesuai desainnya, di mobile label, isian, dan caption-nya
          12px. Saat <Hl>failed</Hl>, garis, latar, gembok, dan caption-nya memerah seperti type teks, tetapi
          tombol matanya tetap abu-abu. Isi <Hl>autoComplete</Hl> sesuai pemakaiannya —{' '}
          <Hl>current-password</Hl> untuk masuk, <Hl>new-password</Hl> untuk mendaftar — supaya pengelola kata
          sandi browser ikut bekerja.
        </Lead>
        <div className="grid gap-5 sm:grid-cols-2">
          {passwordDemos.map((d) => (
            <Demo key={d.label} label={d.label}>
              <PasswordDemoField platform={d.platform} state={d.state} />
            </Demo>
          ))}
        </div>
        <SectionCode>
          {'<InputField\n'}
          {'    '}
          <H>type</H>
          {'="password"\n'}
          {'    label="Kata sandi"\n'}
          {'    placeholder="••••••••"\n'}
          {'    helperText="Gunakan minimal 8 karakter."\n'}
          {'    autoComplete="current-password"\n'}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="dark-mode" title="Dark mode">
        <Lead>
          Prop <Hl>darkMode</Hl> mengganti field ke gray-800 dengan label putih. Garisnya menyatu dengan latar
          dan baru terlihat saat <Hl>typing</Hl> (warna aplikasi) atau <Hl>failed</Hl> (red-500). Teks yang
          diketik putih, sedangkan placeholder, ikon, dan caption abu-abu. Pada type password, tombol matanya
          gray-600, dan saat <Hl>failed</Hl> gembok, placeholder, serta caption-nya red-500.
        </Lead>
        <div className="grid gap-5 sm:grid-cols-2">
          {states.map((s) => (
            <Demo key={s.value} label={s.label} dark>
              <InputField
                darkMode
                state={s.value}
                label="Nama lengkap"
                placeholder="Masukkan nama lengkap"
                helperText={s.value === 'failed' ? 'Nama lengkap wajib diisi.' : s.desc}
                icon={<User className="size-4" />}
                onClear={() => {}}
              />
            </Demo>
          ))}
          {passwordDemos
            .filter((d) => d.platform !== 'mobile')
            .map((d) => (
              <Demo key={`password-${d.label}`} label={`Password · ${d.label}`} dark>
                <PasswordDemoField platform={d.platform} state={d.state} dark />
              </Demo>
            ))}
        </div>
        <SectionCode>
          {'<InputField\n'}
          {'    '}
          <H>darkMode</H>
          {'\n'}
          {'    label="Nama lengkap"\n'}
          {'    placeholder="Masukkan nama lengkap"\n'}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Satu komponen yang bisa Anda utak-atik lewat kontrol di bawahnya. Setiap perubahan langsung
          terlihat di sini, dan bagian Penggunaan menuliskan kodenya.
        </Lead>

        <Stage maxWidth={platform === 'mobile' ? 'max-w-[326px]' : 'max-w-[364px]'} dark={dark}>
          <InputField
            type={isPassword ? 'password' : undefined}
            platform={platform}
            state={fieldState}
            application={application}
            darkMode={dark}
            label={fieldLabel}
            placeholder={fieldPlaceholder}
            helperText={withHelper ? helper : undefined}
            // Password selalu memakai gembok bawaannya dan tidak pernah bertombol hapus.
            icon={isPassword ? undefined : withIcon ? <User className="size-4" /> : null}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onClear={withClear && !isPassword ? () => setValue('') : undefined}
          />
        </Stage>

        <Controls>
          <Control label="Tipe">
            <Segmented
              label="Pilih tipe"
              value={kind}
              onChange={setKind}
              options={[
                { value: 'text', label: 'Teks' },
                { value: 'password', label: 'Password' },
              ]}
            />
          </Control>

          <Control label="Platform">
            <Segmented
              label="Pilih platform"
              value={platform}
              onChange={setPlatform}
              options={[
                { value: 'mobile', label: 'Mobile' },
                { value: 'default', label: 'Desktop' },
              ]}
            />
          </Control>

          <Control label="State">
            <Segmented
              label="Pilih state"
              value={fieldState}
              onChange={setState}
              itemClassName="px-2.5"
              wrap
              options={states.map((s) => ({
                value: s.value,
                label: s.label,
                disabled: isPassword && s.value === 'inactive',
              }))}
            />
          </Control>

          <Control label="Application">
            <Segmented
              label="Pilih aplikasi"
              value={application}
              onChange={setApplication}
              itemClassName="px-2.5"
              options={applications.map((a) => ({ value: a.value, label: a.label }))}
            />
          </Control>

          <Control label="Ikon kiri">
            {/* Mati pada password: gemboknya selalu ada, sesuai desain. */}
            <Segmented
              label="Tampilkan ikon kiri"
              value={isPassword || withIcon}
              onChange={setWithIcon}
              disabled={isPassword}
              options={adaTidakAda}
            />
          </Control>

          <Control label="Helper text">
            <Segmented
              label="Tampilkan helper text"
              value={withHelper}
              onChange={setWithHelper}
              options={adaTidakAda}
            />
          </Control>

          <Control label="Tombol hapus">
            {/* Mati saat inactive — field yang tidak bisa diisi tidak perlu tombol hapus — dan pada
                password, yang selalu tanpa tombol hapus karena sisi kanannya dipakai tombol mata. */}
            <Segmented
              label="Tampilkan tombol hapus"
              value={withClear && !isPassword}
              onChange={setWithClear}
              disabled={isPassword || fieldState === 'inactive'}
              options={adaTidakAda}
            />
          </Control>

          <Control label="Tampilan">
            <Segmented
              label="Pilih tampilan"
              value={dark}
              onChange={setDark}
              options={[
                { value: false, label: 'Light' },
                { value: true, label: 'Dark' },
              ]}
            />
          </Control>
        </Controls>

        <p className="mt-4 text-body-sm text-gray-500">
          Ketik pada field di atas untuk melihat state <em>typing</em> yang sesungguhnya — garisnya berubah
          lewat <Hl>focus-within</Hl>, tanpa perlu mengubah prop. Pada state <em>failed</em>, helper text
          otomatis berganti jadi pesan kesalahan.
        </p>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Blok ini mengikuti kontrol di Playground — ubah kontrolnya, kodenya ikut berubah. Prop yang
          nilainya masih bawaan sengaja tidak ditulis.
        </Lead>
        <SectionCode flush>
          {"import { InputField } from '@ceplok-ui/design-kit-react'\n"}
          {withIcon && !isPassword && "import { User } from '@ceplok-ui/design-kit-react/icons/solid'\n"}
          {'\n'}
          {'<InputField\n'}
          {isPassword && (
            <>
              {'    '}
              <H>type</H>
              {'="password"\n'}
            </>
          )}
          {platform === 'mobile' && (
            <>
              {'    '}
              <H>platform</H>
              {'="mobile"\n'}
            </>
          )}
          {fieldState !== 'default' && (
            <>
              {'    '}
              <H>state</H>
              {`="${fieldState}"\n`}
            </>
          )}
          {application !== 'default' && (
            <>
              {'    '}
              <H>application</H>
              {`="${application}"\n`}
            </>
          )}
          {dark && (
            <>
              {'    '}
              <H>darkMode</H>
              {'\n'}
            </>
          )}
          {`    label="${fieldLabel}"\n`}
          {`    placeholder="${fieldPlaceholder}"\n`}
          {withHelper && (
            <>
              {'    '}
              <H>helperText</H>
              {`="${helper}"\n`}
            </>
          )}
          {withIcon && !isPassword && (
            <>
              {'    '}
              <H>icon</H>
              {'={<User className="size-4" />}\n'}
            </>
          )}
          {'    value={value}\n'}
          {'    onChange={(e) => setValue(e.target.value)}\n'}
          {withClear && !isPassword && fieldState !== 'inactive' && (
            <>
              {'    '}
              <H>onClear</H>
              {"={() => setValue('')}\n"}
            </>
          )}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Seluruh prop yang diterima komponen, beserta tipe dan nilai bawaannya. Atribut <Hl>&lt;input&gt;</Hl>{' '}
          standar juga diteruskan apa adanya.
        </Lead>
        <PropsTable rows={inputProps} minWidth="46rem" />
      </FlowSection>
    </UsulanPage>
  )
}
