import { useState } from 'react'
import { Upload, type UploadApplication, type UploadPlatform, type UploadType } from '../../../lib'
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

const applications: { value: UploadApplication; label: string; token: string }[] = [
  { value: 'default', label: 'Default', token: 'primary-700' },
  { value: 'simaya', label: 'simaya', token: 'purple-500' },
]

const uploadProps: PropRow[] = [
  ['label', 'ReactNode', 'undefined', 'Teks label di atas kontrol.'],
  ['helperText', 'ReactNode', 'undefined', 'Caption di bawah kontrol.'],
  ['buttonLabel', 'string', 'Pilih File', 'Label tombol pilih berkas.'],
  ['placeholder', 'string', 'Belum ada file yang dipilih', 'Teks kolom nama berkas saat masih kosong.'],
  ['type', "'default' | 'attach'", 'default', 'Bentuk kontrol: satu baris tombol + nama berkas, atau area seret-lepas.'],
  ['platform', "'default' | 'mobile'", 'default', 'Tinggi dan ukuran teks baris pemilih berkas. Tidak berpengaruh pada type attach.'],
  ['application', "'default' | 'simaya'", 'default', 'Warna tombol; pada type attach hanya terlihat saat berkas sedang diseret.'],
  ['attachLabel', 'ReactNode', 'Click to upload or drag and drop', 'Baris ajakan di dalam area seret-lepas.'],
  ['attachHint', 'ReactNode', 'SVG, PNG, JPG or GIF (MAX. 800x400px)', 'Baris keterangan format di dalam area seret-lepas.'],
  ['onFilesChange', '(files: FileList | null) => void', 'undefined', 'Dipanggil setiap berkas berganti, lewat dialog maupun seret-lepas.'],
  ['…props', 'InputHTMLAttributes', '—', 'Seluruh atribut <input type="file"> diteruskan (accept, multiple, required, name, …).'],
]

const toc: TocEntry[] = [
  { id: 'upload-form', label: 'Upload Form' },
  { id: 'platform', label: 'Platform' },
  { id: 'attach-form', label: 'Attach Form' },
  { id: 'application', label: 'Application' },
  { id: 'playground', label: 'Playground' },
  { id: 'penggunaan', label: 'Penggunaan' },
  { id: 'properties', label: 'Properties' },
]

export function UploadPage() {
  const [application, setApplication] = useState<UploadApplication>('default')
  const [platform, setPlatform] = useState<UploadPlatform>('default')
  const [type, setType] = useState<UploadType>('default')
  const [withLabel, setWithLabel] = useState(true)
  const [withHelper, setWithHelper] = useState(true)
  const [banyak, setBanyak] = useState(false)

  return (
    <UsulanPage
      eyebrow="Form"
      title="Upload Form"
      description="Pemilih berkas dalam dua bentuk: satu baris tombol dengan nama berkas di sampingnya, atau area seret-lepas yang mengambil ruang lebih besar. Keduanya membungkus input berkas bawaan, jadi dialog, penyaringan accept, dan pengiriman formulir bekerja apa adanya."
      toc={toc}
    >
      <FlowSection id="upload-form" title="Upload Form">
        <Lead>
          Bentuk yang paling hemat tempat: tombol pilih berkas di kiri, nama berkas yang terpilih di
          kanan. Tingginya sama dengan satu baris isian biasa, jadi pakai ini ketika unggahan hanyalah
          salah satu isian di antara isian lain dan tidak perlu menonjol.
        </Lead>
        <Demo label="Default">
          <Upload label="Unggah dokumen" helperText="PDF atau JPG, maksimal 2 MB." />
        </Demo>
        <SectionCode>
          {"import { Upload } from '@stasi/design-kit-react'\n\n"}
          {'<Upload\n'}
          {'    label="Unggah dokumen"\n'}
          {'    helperText="PDF atau JPG, maksimal 2 MB."\n'}
          {'    name="dokumen"\n'}
          {'    accept="application/pdf,image/jpeg"\n'}
          {'/>'}
        </SectionCode>
        <p className="mt-4 text-body-sm text-gray-500">
          Yang dibungkus komponen ini <H>&lt;input type="file"&gt;</H> sungguhan — ia hanya
          disembunyikan secara visual, bukan diganti tombol tiruan. Cukup beri <H>name</H> seperti
          isian lain lalu kirim formulirnya seperti biasa; <H>onFilesChange</H> baru diperlukan kalau
          Anda memang ingin membaca berkasnya di sisi klien, misalnya untuk pratinjau.
        </p>
      </FlowSection>

      <FlowSection id="platform" title="Platform">
        <Lead>
          Dua ukuran untuk bentuk ini. <H>default</H> setinggi 44px dengan teks 14px; <H>mobile</H>{' '}
          setinggi 40px dengan teks 12px. Label dan captionnya tidak ikut mengecil, jadi yang berubah
          hanya barisnya sendiri.
        </Lead>
        <div className="grid gap-5">
          <Demo label="Default — 44px">
            <Upload label="Unggah dokumen" helperText="PDF atau JPG, maksimal 2 MB." />
          </Demo>
          <Demo label="Mobile — 40px">
            <div className="max-w-[382px]">
              <Upload
                platform="mobile"
                label="Unggah dokumen"
                helperText="PDF atau JPG, maksimal 2 MB."
              />
            </div>
          </Demo>
        </div>
        <SectionCode>
          {'<Upload '}
          <H>platform</H>
          {'="mobile" label="Unggah dokumen" />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="attach-form" title="Attach Form">
        <Lead>
          Bentuk kedua mengambil ruang jauh lebih besar: kotak setinggi 230px bergaris putus-putus,
          berisi ikon unggah dan dua baris keterangan. Pakai ini kalau mengunggah berkas memang
          pekerjaan utama di halaman atau modal tersebut — kotak selebar ini mengundang orang
          menyeret berkasnya ke dalam, dan jalan pintas itu memang tersedia.
        </Lead>
        <div className="grid gap-5">
          <Demo label="Default — 538px">
            <div className="max-w-[538px]">
              <Upload type="attach" />
            </div>
          </Demo>
          <Demo label="Mobile — 382px">
            <div className="max-w-[382px]">
              <Upload type="attach" platform="mobile" />
            </div>
          </Demo>
        </div>
        <SectionCode>
          {'<Upload\n'}
          {'    '}
          <H>type</H>
          {'="attach"\n'}
          {'    accept="image/png,image/jpeg"\n'}
          {'    attachLabel="Klik untuk memilih atau seret berkas ke sini"\n'}
          {'    attachHint="PNG atau JPG, maksimal 2 MB"\n'}
          {'/>'}
        </SectionCode>
        <p className="mt-4 text-body-sm text-gray-500">
          Isi kotaknya sama persis di kedua platform — ikon 20px, ajakan 14px, keterangan format 12px.
          Yang berbeda hanya lebarnya, dan lebar itu datang dari wadahnya: komponen ini selebar ruang
          yang Anda beri, sama seperti isian form lain. Kedua demo di atas hanya membatasi wadahnya di
          538px dan 382px.
        </p>
        <p className="mt-3 text-body-sm text-gray-500">
          Berkas yang dijatuhkan dititipkan ke input aslinya, bukan sekadar disimpan di state, jadi ia
          ikut terkirim saat formulirnya di-submit. Begitu ada berkas terpilih, namanya menggantikan
          baris ajakan supaya jelas bahwa areanya sudah terpakai. Dua baris teks di dalamnya bisa
          diganti lewat <H>attachLabel</H> dan <H>attachHint</H>.
        </p>
      </FlowSection>

      <FlowSection id="application" title="Application">
        <Lead>
          Warna tombol mengikuti aplikasi yang memakainya: <H>primary-700</H> untuk default dan{' '}
          <H>purple-500</H> untuk simaya. Pilih sekali di tingkat halaman, lalu biarkan sama untuk
          seluruh form di aplikasi itu.
        </Lead>
        <div className="grid gap-5">
          {applications.map((a) => (
            <Demo key={a.value} label={a.label}>
              {/*
                Kedua bentuk berdampingan, susunan yang sama dengan kartu di
                halaman Overview: baris pemilih berkas di kiri, area seret-lepas
                di kanan. Barisnya dipusatkan vertikal karena tingginya jauh di
                bawah area attach di sebelahnya.
              */}
              <div className="grid gap-5 md:grid-cols-2">
                <div className="flex flex-col justify-center">
                  <Upload
                    application={a.value}
                    label="Unggah dokumen"
                    helperText={`bg-${a.token}`}
                  />
                </div>
                <Upload type="attach" application={a.value} />
              </div>
            </Demo>
          ))}
        </div>
        <SectionCode>
          {'<Upload '}
          <H>application</H>
          {'="simaya" label="Unggah dokumen" />'}
        </SectionCode>
        <p className="mt-4 text-body-sm text-gray-500">
          Kedua kotak attach di atas memang terlihat sama persis, dan itu bukan kekeliruan: dalam
          keadaan diam bentuk ini tidak punya satu pun elemen berwarna aksen. Warnanya baru muncul
          saat berkas ditahan di atas areanya — garis dan latarnya menyala mengikuti aplikasi yang
          sama. Seret sebuah berkas ke salah satunya untuk melihat bedanya.
        </p>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Satu komponen yang bisa Anda utak-atik lewat kontrol di bawahnya. Pilih berkas, atau seret
          satu ke area attach, untuk melihat namanya muncul.
        </Lead>

        <Stage maxWidth={platform === 'mobile' ? 'max-w-[382px]' : 'max-w-[538px]'}>
          <Upload
            type={type}
            platform={platform}
            application={application}
            multiple={banyak}
            label={withLabel ? 'Unggah dokumen' : undefined}
            helperText={withHelper ? 'PDF atau JPG, maksimal 2 MB.' : undefined}
          />
        </Stage>

        <Controls>
          <Control label="Type">
            <Segmented
              label="Pilih bentuk"
              value={type}
              onChange={setType}
              options={[
                { value: 'default', label: 'Upload' },
                { value: 'attach', label: 'Attach' },
              ]}
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

          <Control label="Platform">
            <Segmented
              label="Pilih platform"
              value={platform}
              onChange={setPlatform}
              options={[
                { value: 'default', label: 'Default' },
                { value: 'mobile', label: 'Mobile' },
              ]}
            />
          </Control>

          <Control label="Banyak berkas">
            <Segmented
              label="Izinkan banyak berkas"
              value={banyak}
              onChange={setBanyak}
              options={adaTidakAda}
            />
          </Control>

          <Control label="Label">
            <Segmented
              label="Tampilkan label"
              value={withLabel}
              onChange={setWithLabel}
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
        </Controls>

        <p className="mt-4 text-body-sm text-gray-500">
          Pada bentuk Attach, <em>Platform</em> hanya menyempitkan wadah pratinjaunya dan{' '}
          <em>Application</em> baru terlihat saat berkas diseret ke atas kotak — isi kotaknya sendiri
          tidak berubah.
        </p>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Blok ini mengikuti kontrol di Playground — ubah kontrolnya, kodenya ikut berubah. Prop yang
          nilainya masih bawaan sengaja tidak ditulis.
        </Lead>
        <SectionCode flush>
          {"import { Upload } from '@stasi/design-kit-react'\n\n"}
          {'<Upload\n'}
          {type !== 'default' && (
            <>
              {'    '}
              <H>type</H>
              {'="attach"\n'}
            </>
          )}
          {application !== 'default' && (
            <>
              {'    '}
              <H>application</H>
              {`="${application}"\n`}
            </>
          )}
          {platform !== 'default' && type === 'default' && (
            <>
              {'    '}
              <H>platform</H>
              {'="mobile"\n'}
            </>
          )}
          {banyak && (
            <>
              {'    '}
              <H>multiple</H>
              {'\n'}
            </>
          )}
          {withLabel && (
            <>
              {'    '}
              <H>label</H>
              {'="Unggah dokumen"\n'}
            </>
          )}
          {withHelper && (
            <>
              {'    '}
              <H>helperText</H>
              {'="PDF atau JPG, maksimal 2 MB."\n'}
            </>
          )}
          {'    name="dokumen"\n'}
          {'    onFilesChange={(files) => simpan(files)}\n'}
          {'/>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Seluruh prop yang diterima komponen, beserta tipe dan nilai bawaannya. Atribut{' '}
          <H>&lt;input type="file"&gt;</H> standar juga diteruskan apa adanya.
        </Lead>
        <PropsTable rows={uploadProps} minWidth="52rem" />
      </FlowSection>
    </UsulanPage>
  )
}
