import { useState } from 'react'
import { Avatar, type AvatarFallback, type AvatarGender, type AvatarSize } from '../../../lib'
import { asset } from '../../asset'
import { PropsTable, type PropRow } from '../../PropsTable'
import { Demo, H, Hl, Segmented } from '../../pageKit'
import { Control, Controls, FlowSection, Lead, SectionCode, Stage, UsulanPage, type TocEntry } from '../../usulanKit'

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
  ['fallback', "'initials' | 'profile'", 'initials', 'Gunakan inisial atau langsung ilustrasi profil.'],
  ['gender', "'male' | 'female'", 'undefined', 'Ilustrasi profil gender; tidak pernah ditebak dari name.'],
  ['size', "'small' | 'default' | 'large'", 'default (M)', 'Diameter lingkaran: 24px, 32px, atau 80px.'],
  ['darkMode', 'boolean', 'false', 'Deprecated. Gunakan scope ambient data-theme="dark".'],
  ['…props', 'HTMLAttributes<HTMLDivElement>', '—', 'Atribut <div> standar diteruskan, termasuk className.'],
]

const toc: TocEntry[] = [
  { id: 'avatar', label: 'Avatar' },
  { id: 'inisial', label: 'Inisial' },
  { id: 'profile', label: 'Default profile' },
  { id: 'sizes', label: 'Sizes' },
  { id: 'dark-mode', label: 'Dark mode' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

export function AvatarPage() {
  const [size, setSize] = useState<AvatarSize>('default')
  const [content, setContent] = useState<'photo' | 'auto' | 'override' | 'profile'>('auto')
  const [gender, setGender] = useState<AvatarGender>('female')
  const [name, setName] = useState('Putri Handayani')
  const [dark, setDark] = useState(false)
  const fallback: AvatarFallback = content === 'profile' ? 'profile' : 'initials'

  return (
    <UsulanPage
      eyebrow="Components"
      title="Avatar"
      description="Lingkaran identitas berisi foto, inisial otomatis, atau ilustrasi profil."
      toc={toc}
    >
      <FlowSection id="avatar" title="Avatar">
        <Lead>
          Foto dari <Hl>src</Hl> selalu menjadi pilihan pertama. Jika kosong atau gagal dimuat,
          Avatar berpindah ke fallback tanpa mengubah ukuran, crop, atau bentuk lingkarannya.
        </Lead>
        <Demo label="Default Avatar / foto">
          <div className="flex items-center gap-4">
            <Avatar src={FOTO} name="Putri Handayani" size="large" />
            <Avatar src={FOTO} name="Putri Handayani" />
            <Avatar src={FOTO} name="Putri Handayani" size="small" />
          </div>
        </Demo>
        <SectionCode>
          {'<Avatar '}
          <H>src</H>
          {'={user.avatarUrl} '}
          <H>name</H>
          {'={user.name} />'}
        </SectionCode>
        <p className="mt-4 text-body-sm text-gray-500">
          Bila nama sudah ditampilkan sebagai teks di dekat Avatar, gunakan <Hl>alt=&quot;&quot;</Hl>{' '}
          agar tidak dibacakan dua kali.
        </p>
        <SectionCode>
          {'<Avatar '}
          <H>name</H>
          {'="Putri Handayani" '}
          <H>alt</H>
          {'="" />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="inisial" title="Inisial">
        <Lead>
          Tanpa foto, <Hl>name</Hl> menghasilkan inisial otomatis. Nama satu kata memakai dua
          karakter awal; nama beberapa kata memakai karakter awal kata pertama dan terakhir.
        </Lead>
        <Demo label="Otomatis dari name">
          <div className="flex items-center gap-4">
            <Avatar name="Putri Handayani" size="large" />
            <Avatar name="Putri Handayani" />
            <Avatar name="Putri Handayani" size="small" />
          </div>
        </Demo>
        <SectionCode>
          {'<Avatar '}
          <H>name</H>
          {'="Putri Handayani" />'}
        </SectionCode>
        <div className="mt-5">
          <Demo label="Override initials">
            <div className="flex items-center gap-4">
              <Avatar name="Putri Handayani" initials="UI" size="large" />
              <Avatar name="Putri Handayani" initials="UI" />
              <Avatar name="Putri Handayani" initials="UI" size="small" />
            </div>
          </Demo>
        </div>
        <SectionCode>
          {'<Avatar '}
          <H>name</H>
          {'="Putri Handayani" '}
          <H>initials</H>
          {'="PT" />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="profile" title="Default profile">
        <Lead>
          <Hl>fallback=&quot;profile&quot;</Hl> menampilkan ilustrasi walaupun <Hl>name</Hl>{' '}
          tersedia. Gender dipilih eksplisit dan tidak pernah ditebak dari nama. Tanpa gender,
          Avatar memakai ikon User netral.
        </Lead>
        <div className="grid gap-5 sm:grid-cols-3">
          <Demo label="Female">
            <Avatar name="Putri Handayani" fallback="profile" gender="female" size="large" />
          </Demo>
          <Demo label="Male">
            <Avatar name="Rafli Arandhana" fallback="profile" gender="male" size="large" />
          </Demo>
          <Demo label="Neutral">
            <Avatar name="Pengguna" fallback="profile" size="large" />
          </Demo>
        </div>
        <SectionCode>
          {'<Avatar '}
          <H>gender</H>
          {'="female" '}
          <H>fallback</H>
          {'="profile" />\n<Avatar '}
          <H>gender</H>
          {'="male" '}
          <H>fallback</H>
          {'="profile" />'}
        </SectionCode>
        <SectionCode>
          {'<Avatar '}
          <H>name</H>
          {'="Putri Handayani" '}
          <H>gender</H>
          {'="female" '}
          <H>fallback</H>
          {'="profile" />'}
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
                <Avatar name="Putri Handayani" size={u.value} />
                <Avatar name="Putri Handayani" fallback="profile" gender="female" size={u.value} />
              </div>
            </Demo>
          ))}
        </div>
        <p className="mt-4 text-body-sm text-gray-500">
          Ukuran teks inisial S, M, dan L berturut-turut {ukuran.map((u) => u.teks).join(', ')}.
        </p>
        <SectionCode>
          {'<Avatar '}
          <H>size</H>
          {'="small" name="Putri Handayani" />\n<Avatar name="Putri Handayani" />\n<Avatar '}
          <H>size</H>
          {'="large" name="Putri Handayani" />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="dark-mode" title="Dark mode">
        <Lead>
          Avatar mengikuti scope ambient <Hl>data-theme</Hl>. Inisial dan ilustrasi profile berpindah
          otomatis, termasuk dalam nested theme scope; foto pengguna tidak diberi tint.
        </Lead>
        <Stage maxWidth="max-w-full" dark>
          <div data-theme="dark" className="flex flex-wrap items-center gap-4">
            <Avatar name="Putri Handayani" size="large" />
            <Avatar name="Putri Handayani" fallback="profile" gender="female" size="large" />
            <Avatar name="Rafli Arandhana" fallback="profile" gender="male" size="large" />
          </div>
        </Stage>
        <SectionCode>
          {'<section '}
          <H>data-theme</H>
          {'="dark">\n  <Avatar name="Putri Handayani" />\n</section>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>Ubah tema, ukuran, isi, gender, dan nama. Preview memakai komponen production yang sama.</Lead>
        <Stage maxWidth="max-w-[360px]" dark={dark}>
          <div
            data-theme={dark ? 'dark' : 'light'}
            className="flex min-h-30 items-center justify-center gap-3"
          >
            <Avatar
              size={size}
              src={content === 'photo' ? FOTO : undefined}
              name={name}
              alt=""
              initials={content === 'override' ? 'UI' : undefined}
              fallback={fallback}
              gender={content === 'profile' ? gender : undefined}
            />
            <span className="text-sm text-content">{name || 'Tanpa nama'}</span>
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
          <Control label="Gender">
            <Segmented
              label="Pilih gender profile"
              value={gender}
              onChange={setGender}
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
          </Control>
        </Controls>

      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Gunakan urutan berikut untuk memilih konfigurasi Avatar yang sesuai kebutuhan consumer.
        </Lead>
        <ol className="mb-4 list-decimal space-y-2 pl-5 text-body-sm text-gray-500">
          <li>Tentukan apakah Avatar memakai foto melalui <Hl>src</Hl> atau tanpa foto.</li>
          <li>Berikan <Hl>name</Hl> untuk identitas dan inisial otomatis.</li>
          <li>
            Untuk ilustrasi Male/Female, gunakan <Hl>gender</Hl> bersama{' '}
            <Hl>fallback=&quot;profile&quot;</Hl>.
          </li>
          <li>Gunakan <Hl>initials</Hl> hanya saat membutuhkan override.</li>
          <li>
            Atur <Hl>size</Hl> bila bukan M, dan pilih <Hl>alt</Hl> sesuai konteks aksesibilitas.
          </li>
        </ol>
        <SectionCode flush>
          {"import { Avatar } from '@ceplok-ui/design-kit-react'\n\n"}
          {dark && '<section data-theme="dark">\n'}
          {dark && '  '}
          {'<Avatar\n'}
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
          {name && (
            <>
              {'    '}
              <H>name</H>
              {'=' + JSON.stringify(name) + '\n'}
            </>
          )}
          {content === 'override' && (
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
              {'="profile"\n'}
              {'    '}
              <H>gender</H>
              {'="' + gender + '"\n'}
            </>
          )}
          {dark ? '  />\n</section>' : '/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Seluruh prop public Avatar. Native attributes dan ref tetap diteruskan ke wrapper{' '}
          <Hl>&lt;div&gt;</Hl>.
        </Lead>
        <PropsTable rows={avatarProps} minWidth="52rem" />
      </FlowSection>
    </UsulanPage>
  )
}
