import { useState } from 'react'
import { Avatar, type AvatarFallback, type AvatarSize } from '../../../lib'
import { asset } from '../../asset'
import { PropsTable, type PropRow } from '../../PropsTable'
import { Demo, H, Hl, Segmented } from '../../pageKit'
import { tocForDarkDocs, useDarkModeSnippet, useDocsDark, usePlaygroundDark } from '../../docsTheme'
import { Control, Controls, FlowSection, Lead, ModeSection, SectionCode, Stage, UsulanPage, type TocEntry } from '../../usulanKit'

const FOTO = asset('/images/avatar-sample.svg')

const ukuran: { value: AvatarSize; label: string; diameter: string; teks: string }[] = [
  { value: 'small', label: 'S', diameter: '24px', teks: '12px' },
  { value: 'default', label: 'M', diameter: '32px', teks: '16px' },
  { value: 'large', label: 'L', diameter: '80px', teks: '30px' },
]

const avatarProps: PropRow[] = [
  ['src', 'string', 'undefined', 'Alamat foto. Bila kosong atau gagal dimuat, Avatar menampilkan fallback.'],
  ['name', 'string', 'undefined', 'Nama untuk accessible name dan inisial otomatis.'],
  ['alt', 'string', 'name atau ""', 'Override accessible name. String kosong menjadikan Avatar dekoratif.'],
  ['initials', 'ReactNode', 'undefined', 'Override isi inisial ketika foto tidak tersedia.'],
  ['fallback', "'initials' | 'female' | 'male'", 'initials', 'Memilih fallback secara eksplisit; initials memerlukan name atau initials.'],
  ['size', "'small' | 'default' | 'large'", 'default (M)', 'Diameter lingkaran: 24px, 32px, atau 80px.'],
  ['darkMode', 'boolean', 'false', 'Mengaktifkan tampilan gelap. Tanpa prop ini, Avatar mengikuti tema pembungkusnya.'],
  ['ref', 'Ref<HTMLDivElement>', '—', 'Diteruskan ke elemen <div> root.'],
  ['…props', 'HTMLAttributes<HTMLDivElement>', '—', 'Atribut root diteruskan; role, aria-label, dan data-theme dapat meng-override nilai terhitung. className digabungkan.'],
]

const toc: TocEntry[] = [
  { id: 'avatar', label: 'Avatar' },
  { id: 'inisial', label: 'Inisial' },
  { id: 'profile', label: 'Profile fallback' },
  { id: 'sizes', label: 'Sizes' },
  { id: 'dark-mode', label: 'Dark mode' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

const tocDark = tocForDarkDocs(toc, true)

export function AvatarPage() {
  const docsDark = useDocsDark()
  const dm = useDarkModeSnippet()
  const [size, setSize] = useState<AvatarSize>('default')
  const [content, setContent] = useState<'photo' | 'auto' | 'override' | 'profile'>('auto')
  const [profileFallback, setProfileFallback] = useState<Exclude<AvatarFallback, 'initials'>>('female')
  const [name, setName] = useState('Putri Handayani')
  const [dark, setDark] = usePlaygroundDark()
  const nama = name.trim()
  const initialsPlayground = content === 'override' || (content !== 'profile' && !nama) ? 'UI' : undefined

  const previewAvatar = content === 'profile' ? (
    <Avatar size={size} name={nama || undefined} alt="" fallback={profileFallback} darkMode={dark} />
  ) : nama ? (
    <Avatar size={size} src={content === 'photo' ? FOTO : undefined} name={nama} alt="" initials={initialsPlayground} darkMode={dark} />
  ) : (
    <Avatar size={size} src={content === 'photo' ? FOTO : undefined} alt="" initials="UI" darkMode={dark} />
  )

  return (
    <div data-theme={docsDark ? 'dark' : undefined}>
      <UsulanPage
        eyebrow="Components"
        title="Avatar"
        description="Lingkaran identitas berisi foto, inisial otomatis, atau ilustrasi profil."
        toc={docsDark ? tocDark : toc}
      >
      <FlowSection id="avatar" title="Avatar">
        <Lead>
          Foto dari <Hl>src</Hl> selalu menjadi pilihan pertama. Jika kosong atau gagal dimuat,
          Avatar berpindah ke fallback tanpa mengubah ukuran dan bentuk lingkarannya.
          Foto memakai crop tengah <Hl>object-cover</Hl>, sehingga rasio tetap terjaga.
        </Lead>
        <Demo label="Default Avatar / foto">
          <div className="flex items-center gap-4">
            <Avatar src={FOTO} name="Putri Handayani" size="large" darkMode={docsDark} />
            <Avatar src={FOTO} name="Putri Handayani" darkMode={docsDark} />
            <Avatar src={FOTO} name="Putri Handayani" size="small" darkMode={docsDark} />
          </div>
        </Demo>
        <SectionCode>
          {'<Avatar '}
          <H>src</H>
          {'={user.avatarUrl} '}
          <H>name</H>
          {'={user.name}'}
          {dm.inline}
          {' />'}
        </SectionCode>
        <p className="mt-4 text-body-sm text-gray-500 dark:text-gray-400">
          Bila nama sudah ditampilkan sebagai teks di dekat Avatar, gunakan <Hl>alt=&quot;&quot;</Hl>{' '}
          agar tidak dibacakan dua kali.
        </p>
        <Demo>
          <div className="flex items-center gap-3">
            <Avatar name="Putri Handayani" alt="" darkMode={docsDark} />
            <span className="text-sm text-content">Putri Handayani</span>
          </div>
        </Demo>
        <SectionCode>
          {'<div className="flex items-center gap-3">\n  <Avatar '}
          <H>name</H>
          {'="Putri Handayani" '}
          <H>alt</H>
          {'=""'}
          {dm.inline}
          {' />\n  <span>Putri Handayani</span>\n</div>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="inisial" title="Inisial">
        <Lead>
          Tanpa foto, <Hl>name</Hl> menghasilkan inisial otomatis. Nama satu kata memakai dua
          karakter awal; nama beberapa kata memakai karakter awal kata pertama dan terakhir.
        </Lead>
        <Demo label="Otomatis dari name">
          <div className="flex items-center gap-4">
            <Avatar name="Putri Handayani" size="large" darkMode={docsDark} />
            <Avatar name="Putri Handayani" darkMode={docsDark} />
            <Avatar name="Putri Handayani" size="small" darkMode={docsDark} />
          </div>
        </Demo>
        <SectionCode>
          {'<Avatar '}
          <H>name</H>
          {'="Putri Handayani"'}
          {dm.inline}
          {' />'}
        </SectionCode>
        <div className="mt-5">
          <Demo label="Override initials">
            <div className="flex items-center gap-4">
              <Avatar name="Putri Handayani" initials="UI" size="large" darkMode={docsDark} />
              <Avatar name="Putri Handayani" initials="UI" darkMode={docsDark} />
              <Avatar name="Putri Handayani" initials="UI" size="small" darkMode={docsDark} />
            </div>
          </Demo>
        </div>
        <SectionCode>
          {'<Avatar '}
          <H>name</H>
          {'="Putri Handayani" '}
          <H>initials</H>
          {'="UI"'}
          {dm.inline}
          {' />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="profile" title="Profile fallback">
        <Lead>
          <Hl>fallback=&quot;female&quot;</Hl> atau <Hl>fallback=&quot;male&quot;</Hl> menampilkan
          ilustrasi profil walaupun <Hl>name</Hl> tersedia. Varian tidak pernah ditebak dari
          nama. <Hl>fallback=&quot;initials&quot;</Hl> adalah bawaan dan memerlukan name atau initials.
        </Lead>
        <div className="grid gap-5 sm:grid-cols-3">
          <Demo label="Female">
            <Avatar name="Putri Handayani" fallback="female" size="large" darkMode={docsDark} />
          </Demo>
          <Demo label="Male">
            <Avatar name="Rafli Arandhana" fallback="male" size="large" darkMode={docsDark} />
          </Demo>
          <Demo label="Default → initials">
            <Avatar name="Pengguna" size="large" darkMode={docsDark} />
          </Demo>
        </div>
        <SectionCode>
          {'<Avatar '}
          <H>name</H>
          {'="Putri Handayani" '}
          <H>fallback</H>
          {'="female"'}
          {dm.inline}
          {' />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="sizes" title="Sizes">
        <Lead>
          S berdiameter 24px, M 32px, dan L 80px. M adalah ukuran default, sehingga prop{' '}
          <Hl>size</Hl> tidak perlu ditulis untuk ukuran tersebut.
        </Lead>
        <div className="grid gap-5 sm:grid-cols-3">
          {ukuran.map((u) => (
            <Demo key={u.value} label={u.label + ' — ' + u.diameter}>
              <div className="flex items-center gap-3">
                <Avatar name="Putri Handayani" size={u.value} darkMode={docsDark} />
                <Avatar name="Putri Handayani" fallback="female" size={u.value} darkMode={docsDark} />
              </div>
            </Demo>
          ))}
        </div>
        <p className="mt-4 text-body-sm text-gray-500 dark:text-gray-400">
          Ukuran teks inisial S, M, dan L berturut-turut {ukuran.map((u) => u.teks).join(', ')}.
        </p>
        <SectionCode>
          {'<Avatar '}
          <H>size</H>
          {'="small" name="Putri Handayani"'}
          {dm.inline}
          {' />'}
        </SectionCode>
      </FlowSection>

      <ModeSection
        name="Avatar"
        stayDark
        lead={
          <>
            Prop <Hl>darkMode</Hl> mengubah warna inisial dan ilustrasi profile. Tanpa prop tersebut,
            Avatar mengikuti scope ambient <Hl>data-theme</Hl>; foto pengguna tidak diberi tint.
          </>
        }
      >
        <Demo dark>
          <div className="flex flex-wrap items-center gap-4">
            <Avatar name="Putri Handayani" size="large" darkMode />
            <Avatar name="Putri Handayani" fallback="female" size="large" darkMode />
            <Avatar name="Rafli Arandhana" fallback="male" size="large" darkMode />
          </div>
        </Demo>
        <SectionCode>
          {'<Avatar '}
          <H>darkMode</H>{' '}
          {'name="Putri Handayani" />'}
        </SectionCode>
      </ModeSection>

      <FlowSection id="playground" title="Playground">
        <Lead>Ubah tema, ukuran, isi, fallback profil, dan nama. Preview memakai komponen production yang sama.</Lead>
        <Stage maxWidth="max-w-[360px]" dark={dark}>
          <div className="flex min-h-30 items-center justify-center gap-3">
            {previewAvatar}
            <span className={`text-sm ${dark ? 'text-gray-300' : 'text-content'}`}>{nama || 'Tanpa nama'}</span>
          </div>
        </Stage>

        <Controls>
          <Control label="Theme">
            <Segmented
              label="Pilih theme"
              value={dark}
              onChange={setDark}
              options={[
                { value: false, label: 'Light' },
                { value: true, label: 'Dark' },
              ]}
            />
          </Control>
          <Control label="Size">
            <Segmented
              label="Pilih ukuran"
              value={size}
              onChange={setSize}
              options={ukuran.map((u) => ({ value: u.value, label: u.label }))}
            />
          </Control>
          <Control label="Isi">
            <Segmented
              label="Pilih isi Avatar"
              value={content}
              onChange={setContent}
              wrap
              options={[
                { value: 'photo', label: 'Foto' },
                { value: 'auto', label: 'Initials' },
                { value: 'override', label: 'Override' },
                { value: 'profile', label: 'Profile' },
              ]}
            />
          </Control>
          <Control label="Profile fallback">
            <Segmented
              label="Pilih ilustrasi profile"
              value={profileFallback}
              onChange={setProfileFallback}
              disabled={content !== 'profile'}
              options={[
                { value: 'female', label: 'Female' },
                { value: 'male', label: 'Male' },
              ]}
            />
          </Control>
          <Control label="Nama">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-label="Nama untuk preview Avatar"
              className="mt-1 w-full rounded-lg border border-field-border bg-field px-3 py-2 text-sm text-content outline-none focus:border-brand"
            />
            {content !== 'profile' && !nama && (
              <p className="mt-1 text-xs text-feedback-error" role="status">
                Nama kosong memakai initials UI agar fallback tetap valid.
              </p>
            )}
          </Control>
        </Controls>

      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Blok ini mengikuti kontrol di Playground. Prop yang masih memakai nilai bawaan sengaja
          tidak ditulis. Fallback <Hl>initials</Hl> selalu membutuhkan <Hl>name</Hl> atau{' '}
          <Hl>initials</Hl>.
        </Lead>
        <SectionCode flush>
          {"import { Avatar } from '@ceplok-ui/design-kit-react'\n\n"}
          {'<div className="flex items-center gap-3">\n  <Avatar\n'}
          {size !== 'default' && (
            <>
              {'    '}
              <H>size</H>
              {'="' + size + '"\n'}
            </>
          )}
          {content === 'photo' && (
            <>
              {'    '}
              <H>src</H>
              {'="/foto/putri.jpg"\n'}
            </>
          )}
          {nama && (
            <>
              {'    '}
              <H>name</H>
              {'=' + JSON.stringify(nama) + '\n'}
            </>
          )}
          {initialsPlayground && (
            <>
              {'    '}
              <H>initials</H>
              {'="UI"\n'}
            </>
          )}
          {content === 'profile' && (
            <>
              {'    '}
              <H>fallback</H>
              {'="' + profileFallback + '"\n'}
            </>
          )}
          {dark && (
            <>
              {'    '}
              <H>darkMode</H>
              {'\n'}
            </>
          )}
          {'    '}
          <H>alt</H>
          {'=""\n  />\n  <span>' + (nama || 'Tanpa nama') + '</span>\n</div>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Seluruh prop yang diterima Avatar, beserta tipe dan nilai bawaannya. Atribut{' '}
          <Hl>&lt;div&gt;</Hl> standar dan ref juga diteruskan; atribut root dapat meng-override
          nilai aksesibilitas atau tema yang dihitung komponen.
        </Lead>
        <PropsTable rows={avatarProps} minWidth="52rem" />
      </FlowSection>
      </UsulanPage>
    </div>
  )
}
