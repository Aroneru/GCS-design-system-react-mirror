import { useState } from 'react'
import { Avatar, type AvatarSize } from '../../../lib'
import { asset } from '../../asset'
import { PropsTable, type PropRow } from '../../PropsTable'
import { Demo, H, Segmented } from '../../pageKit'
import {
  Control,
  Controls,
  FlowSection,
  Lead,
  SectionCode,
  Stage,
  UsulanPage,
  type TocEntry,
} from '../../usulanKit'
import { adaTidakAda } from '../../usulanOptions'

/** Foto contoh untuk demo di halaman ini. */
const FOTO = asset('/images/avatar-sample.svg')

const ukuran: { value: AvatarSize; label: string; diameter: string; teks: string }[] = [
  { value: 'small', label: 'Small', diameter: '24px', teks: '12px' },
  { value: 'default', label: 'Default', diameter: '32px', teks: '16px' },
  { value: 'large', label: 'Large', diameter: '80px', teks: '30px' },
]

const avatarProps: PropRow[] = [
  ['src', 'string', 'undefined', 'Alamat gambar. Bila kosong atau gagal dimuat, isian teks yang tampil.'],
  ['alt', 'string', "''", 'Nama pemiliknya. Jadi alt gambar, atau nama aksesibilitas saat yang tampil hanya inisial.'],
  ['initials', 'ReactNode', 'undefined', 'Isi lingkaran saat tidak ada gambar — umumnya satu atau dua huruf.'],
  ['size', "'small' | 'default' | 'large'", 'default', 'Diameter lingkaran: 24px, 32px, atau 80px.'],
  ['…props', 'HTMLAttributes<HTMLDivElement>', '—', 'Atribut <div> standar diteruskan (className, onClick, title, …).'],
]

const toc: TocEntry[] = [
  { id: 'avatar', label: 'Avatar' },
  { id: 'inisial', label: 'Inisial' },
  { id: 'sizes', label: 'Sizes' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

export function AvatarPage() {
  const [size, setSize] = useState<AvatarSize>('default')
  const [withFoto, setWithFoto] = useState(true)
  const [withNama, setWithNama] = useState(true)

  return (
    <UsulanPage
      eyebrow="Components"
      title="Avatar"
      description="Lingkaran identitas berisi foto profil, atau inisial namanya bila fotonya tidak ada. Tersedia dalam tiga ukuran, dari yang menempel di daftar sampai yang jadi kepala halaman profil."
      toc={toc}
    >
      <FlowSection id="avatar" title="Avatar">
        <Lead>
          Isinya yang menentukan bentuknya, bukan prop terpisah: begitu <H>src</H> diisi, avatarnya
          menampilkan foto; tanpa itu ia jatuh ke inisial. Fotonya selalu dipotong ke lingkaran dan
          diratakan di tengah, jadi gambar apa pun bisa masuk tanpa disiapkan lebih dulu.
        </Lead>
        <Demo label="Dengan foto">
          <div className="flex items-center gap-4">
            <Avatar src={FOTO} alt="Putri Handayani" size="large" />
            <Avatar src={FOTO} alt="Putri Handayani" />
            <Avatar src={FOTO} alt="Putri Handayani" size="small" />
          </div>
        </Demo>
        <SectionCode>
          {"import { Avatar } from '@stasi/design-kit-react'\n\n"}
          {'<Avatar src="/foto/putri.jpg" alt="Putri Handayani" />'}
        </SectionCode>
        <p className="mt-4 text-body-sm text-gray-500">
          Beri <H>alt</H> berisi nama pemiliknya. Kalau namanya sudah tertulis persis di sebelah
          avatar — seperti pada daftar anggota atau menu profil — kosongkan saja: avatarnya akan
          terbaca sebagai hiasan dan pembaca layar tidak menyebut nama yang sama dua kali.
        </p>
      </FlowSection>

      <FlowSection id="inisial" title="Inisial">
        <Lead>
          Tanpa <H>src</H>, lingkarannya diisi teks yang Anda beri lewat <H>initials</H> di atas latar
          abu-abu. Satu atau dua huruf adalah takaran yang aman; lebih dari itu mulai berdesakan di
          ukuran kecil.
        </Lead>
        <Demo label="Tanpa foto">
          <div className="flex items-center gap-4">
            <Avatar initials="PH" alt="Putri Handayani" size="large" />
            <Avatar initials="PH" alt="Putri Handayani" />
            <Avatar initials="PH" alt="Putri Handayani" size="small" />
          </div>
        </Demo>
        <SectionCode>
          {'<Avatar '}
          <H>initials</H>
          {'="PH" alt="Putri Handayani" />'}
        </SectionCode>
        <p className="mt-4 text-body-sm text-gray-500">
          Inisial juga jadi jaring pengaman: bila <H>src</H> diisi tapi gambarnya gagal dimuat,
          avatarnya berpindah sendiri ke inisial. Alamat foto profil biasanya datang dari sistem lain
          dan bisa mati kapan saja — tanpa ini yang tersisa di halaman hanya ikon gambar rusak.
        </p>
        <Demo label="Foto rusak → jatuh ke inisial">
          <div className="flex items-center gap-4">
            <Avatar src="/foto/tidak-ada.jpg" initials="PH" alt="Putri Handayani" size="large" />
            <Avatar src="/foto/tidak-ada.jpg" initials="PH" alt="Putri Handayani" />
            <Avatar src="/foto/tidak-ada.jpg" initials="PH" alt="Putri Handayani" size="small" />
          </div>
        </Demo>
      </FlowSection>

      <FlowSection id="sizes" title="Sizes">
        <Lead>
          Tiga ukuran, dan teks inisialnya ikut naik bersamanya supaya porsi isian di dalam lingkaran
          tetap terasa sama. <H>small</H> untuk baris daftar yang padat, <H>default</H> untuk navbar
          dan menu profil, <H>large</H> untuk kepala halaman profil.
        </Lead>
        <div className="grid gap-5 sm:grid-cols-3">
          {ukuran.map((u) => (
            <Demo key={u.value} label={`${u.label} — ${u.diameter}`}>
              <div className="flex items-center gap-3">
                <Avatar src={FOTO} alt="Putri Handayani" size={u.value} />
                <Avatar initials="PH" alt="Putri Handayani" size={u.value} />
              </div>
            </Demo>
          ))}
        </div>
        <SectionCode>
          {'<Avatar '}
          <H>size</H>
          {'="large" src="/foto/putri.jpg" alt="Putri Handayani" />'}
        </SectionCode>
        <p className="mt-4 text-body-sm text-gray-500">
          Ukuran teks inisialnya berturut-turut{' '}
          {ukuran.map((u, i) => (
            <span key={u.value}>
              {i > 0 ? ', ' : ''}
              <H>{u.teks}</H>
            </span>
          ))}
          . Avatar tidak pernah ikut menyusut oleh flexbox, jadi aman diletakkan di samping teks
          panjang tanpa takut gepeng.
        </p>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Satu avatar yang bisa Anda utak-atik lewat kontrol di bawahnya. Matikan fotonya untuk
          melihat inisialnya mengambil alih.
        </Lead>

        {/*
          Tinggi minimumnya dikunci supaya kotaknya tidak ikut naik-turun saat
          ukuran avatar diganti — 120px cukup untuk melapangi yang 80px.
        */}
        <Stage maxWidth="max-w-[320px]">
          <div className="flex min-h-30 items-center justify-center gap-3">
            <Avatar
              size={size}
              src={withFoto ? FOTO : undefined}
              initials="PH"
              alt={withNama ? 'Putri Handayani' : ''}
            />
            <span className="text-sm text-gray-900">Putri Handayani</span>
          </div>
        </Stage>

        <Controls>
          <Control label="Size">
            <Segmented
              label="Pilih ukuran"
              value={size}
              onChange={setSize}
              options={ukuran.map((u) => ({ value: u.value, label: u.label }))}
            />
          </Control>

          <Control label="Foto">
            <Segmented
              label="Tampilkan foto"
              value={withFoto}
              onChange={setWithFoto}
              options={adaTidakAda}
            />
          </Control>

          <Control label="Nama (alt)">
            <Segmented
              label="Isi nama"
              value={withNama}
              onChange={setWithNama}
              options={adaTidakAda}
            />
          </Control>
        </Controls>

        <p className="mt-4 text-body-sm text-gray-500">
          Contoh di atas sengaja menaruh nama di sebelah avatarnya — susunan yang paling sering
          dipakai. Dalam keadaan itu <em>Nama (alt)</em> justru lebih baik dikosongkan, karena
          namanya sudah terbaca dari teks di sampingnya.
        </p>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Blok ini mengikuti kontrol di Playground — ubah kontrolnya, kodenya ikut berubah. Prop yang
          nilainya masih bawaan sengaja tidak ditulis.
        </Lead>
        <SectionCode flush>
          {"import { Avatar } from '@stasi/design-kit-react'\n\n"}
          {'<Avatar\n'}
          {size !== 'default' && (
            <>
              {'    '}
              <H>size</H>
              {`="${size}"\n`}
            </>
          )}
          {withFoto && (
            <>
              {'    '}
              <H>src</H>
              {'="/foto/putri.jpg"\n'}
            </>
          )}
          {'    initials="PH"\n'}
          {withNama && (
            <>
              {'    '}
              <H>alt</H>
              {'="Putri Handayani"\n'}
            </>
          )}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Seluruh prop yang diterima komponen, beserta tipe dan nilai bawaannya. Atribut{' '}
          <H>&lt;div&gt;</H> standar juga diteruskan apa adanya.
        </Lead>
        <PropsTable rows={avatarProps} minWidth="48rem" />
      </FlowSection>
    </UsulanPage>
  )
}
