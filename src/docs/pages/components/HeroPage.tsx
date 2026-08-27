import { useState, type ReactNode } from "react";
import { Hero, type HeroImageOrientation, type HeroType } from "../../../lib";
import { PropsTable, type PropRow } from "../../PropsTable";
import { C, Mark, Segmented } from "../../pageKit";
import {
  Control,
  Controls,
  FlowSection,
  Lead,
  SectionCode,
  Stage,
  UsulanPage,
  type TocEntry,
} from "../../usulanKit";
import { adaTidakAda } from "../../usulanOptions";
import { asset } from "../../asset";

/**
 * Susunan halaman: alur naratif (tampilan dasar → variasi → ukuran → responsif)
 * ditambah beberapa bagian properti, dengan daftar isi menempel di kanan.
 *
 * Yang diberi bagian sendiri hanya properti yang keputusannya ada di tangan
 * pemakai dan tidak selesai dijelaskan satu baris di tabel — dikelompokkan
 * menurut bagian hero yang diaturnya (teks, tombol, gambar), bukan satu bagian
 * per prop. Prop yang bentuknya sudah jelas dari tabel, seperti `className` dan
 * `onButtonClick`, cukup ada di tabel Properties; menaikkan semuanya jadi
 * bagian membuat daftar isi kehilangan gunanya sebagai peta halaman.
 */

/** Isi contoh diambil apa adanya dari frame Hero di Figma. */
const heroText = "Hero Design system Stasi";
const heroSubHeading = "Hero Design system Stasi";
const heroDesc =
  "Design System Stasi adalah sebuah kumpulan standar desain terpadu yang digunakan untuk memastikan seluruh produk digital di lingkungan Kementerian Komunikasi dan Informatika (Stasi)";

const heroImage = asset("/images/hero-sample.svg");
const heroImageLandscape = asset("/images/hero-sample-landscape.svg");

const heroProps: PropRow[] = [
  [
    "type",
    "'horizontal-image-left' | 'horizontal-image-right' | 'centered'",
    "'horizontal-image-left'",
    'Susunan hero, sama dengan properti "Hero Type" di Figma. Dua tipe horizontal menaruh gambar di kiri atau di kanan teks; centered melepas gambar, memusatkan teks, dan memakai latar primary-50.',
  ],
  [
    "platform",
    "'desktop' | 'mobile'",
    "'desktop'",
    'Properti "Platform" di Figma. desktop membiarkan susunannya mengikuti lebar hero; mobile memaksa bertumpuk satu kolom dan menahan judul di ukuran heading-1 berapa pun lebar ruangnya.',
  ],
  [
    "heading",
    "ReactNode",
    "undefined",
    'Judul utama — Figma: "Hero Text". Dirender sebagai <h1>, jadi satu halaman sebaiknya hanya punya satu Hero ber-heading.',
  ],
  [
    "subHeading",
    "ReactNode",
    "undefined",
    'Baris kecil berwarna primary-600 tepat di bawah judul — Figma: "Hero sub heading". Hanya tampil bila showHeading bernilai true.',
  ],
  [
    "description",
    "ReactNode",
    "undefined",
    'Paragraf penjelas — Figma: "Hero Desc". Lebarnya dibatasi max-w-2xl agar panjang barisnya tetap nyaman dibaca.',
  ],
  [
    "showHeading",
    "boolean",
    "true",
    'Figma: "Show Heading". Yang dikendalikan adalah baris sub heading; judul utama tidak pernah disembunyikan karena hero tanpa judul membuat halaman kehilangan penanda utamanya.',
  ],
  [
    "showButton",
    "boolean",
    "true",
    'Figma: "Show Button". Bila false, tombol beserta jarak atasnya tidak dirender sama sekali.',
  ],
  [
    "buttonLabel",
    "string",
    "'Lihat Lebih Lanjut'",
    "Teks tombol; panah kanan ditambahkan otomatis.",
  ],
  [
    "buttonHref",
    "string",
    "undefined",
    "Bila diisi, tombolnya dirender sebagai <a href> — dipakai untuk tautan navigasi. Bila kosong, tombolnya <button> yang memanggil onButtonClick.",
  ],
  [
    "onButtonClick",
    "() => void",
    "undefined",
    "Penangan klik; hanya dipakai bila buttonHref kosong.",
  ],
  [
    "image",
    "string",
    "undefined",
    'URL gambar pendamping. Tingginya mengikuti rasio asli berkasnya — tidak dikunci aspect-ratio — dan lebarnya 320px saat hero ≥ 768px, melebar ke 386px saat ≥ 1024px. Diabaikan pada type="centered".',
  ],
  [
    "imageOrientation",
    "'portrait' | 'landscape'",
    "'portrait'",
    "Orientasi kolom gambar — di Figma tiap tipe horizontal punya frame potret dan frame lanskap. Hanya mengatur lebar kolomnya (potret 386px, lanskap 435px); tinggi gambar tetap mengikuti rasio asli berkasnya, jadi kirim berkas yang orientasinya memang cocok.",
  ],
  [
    "imageAlt",
    "string",
    "''",
    "Teks alternatif gambar. Biarkan kosong bila gambarnya hanya hiasan, supaya tidak dibacakan dua kali bersama judul.",
  ],
  [
    "imageContent",
    "ReactNode",
    "undefined",
    "Gambar berupa elemen — ilustrasi <svg> inline atau komposisi sendiri. Dipakai hanya bila prop image kosong.",
  ],
  [
    "className",
    "string",
    "undefined",
    "Kelas tambahan untuk elemen <section> terluar — umumnya untuk mengganti warna latar. Elemen ini sekaligus titik ukur @container, jadi hindari memberinya lebar tetap.",
  ],
];

/** Angka-angka dari panel Layout di Figma, berpasangan dengan wujudnya di kode. */
const spacingSpec: [string, string][] = [
  ["Lebar bingkai", "Fixed 1,440px → max-w-[1440px] lalu dipusatkan"],
  ["Padding atas-bawah", "24px → py-6, sama di ketiga tipe"],
  [
    "Padding kiri-kanan",
    "0px di Figma — isinya ditahan wadah 1290px yang dipusatkan. Di kode jadi jarak tepi bertingkat 20 → 32 → 48 → 76px, supaya di layar sempit teks tidak menempel ke tepi",
  ],
  ["Tinggi tipe horizontal", "Fixed 762px → min-h-[762px] mulai lebar 1024px"],
  [
    "Tinggi tipe centered",
    "Hug (474px) → tumbuh dari isinya; rongga atas-bawah teks 64px, 96px mulai 768px",
  ],
  [
    "Jarak teks ↔ gambar",
    "72px saat bertumpuk, 48px mulai 768px, melebar jadi 96px mulai 1280px",
  ],
  [
    "Jarak antar elemen teks",
    "sub heading 8px, deskripsi 16px, tombol 32px dari elemen di atasnya",
  ],
  [
    "Lebar gambar potret",
    "maks 270px dan dipusatkan saat bertumpuk, 320px mulai 768px, 386px mulai 1024px — tinggi selalu mengikuti rasio aslinya",
  ],
  [
    "Lebar gambar lanskap",
    'selebar ruang saat bertumpuk, 380px mulai 768px, 435px mulai 1024px — dipilih lewat imageOrientation="landscape"',
  ],
  [
    "Susunan mobile",
    "teks rata tengah dan tombol selebar penuh; keduanya berbalik ke rata kiri dan lebar isi mulai 768px. Tipe centered tetap rata tengah dengan tombol seukuran isinya",
  ],
];

const responsiveBehaviour: [string, string][] = [
  [
    "Sempit (< 768px)",
    "Susunan mobile: bertumpuk satu kolom, teks rata tengah, tombol selebar penuh, lalu gambar dipusatkan dengan lebar maksimum 270px. Jarak tombol ke gambar 72px, judul memakai ukuran heading-1, dan batas tinggi 762px dilepas — di susunan bertumpuk tinggi itu hanya jadi rongga kosong.",
  ],
  [
    "Lebar (≥ 768px)",
    "Susunan jadi dua kolom seperti di Figma: teks pindah ke rata kiri, tombol menyusut ke selebar isinya, gambar 320px menempel di tepi luar, dan keduanya rata tengah secara vertikal. Ambangnya sama dengan Footer, jadi kedua komponen berganti susunan di titik yang sama.",
  ],
  [
    "Sangat lebar (≥ 1024px)",
    "Gambar melebar ke 386px, judul naik ke ukuran display (48px), dan tinggi minimum 762px sesuai Figma mulai berlaku. Mulai 1280px jarak antarkolom melebar jadi 96px dan jarak tepi jadi 76px — sama dengan jarak isi ke tepi pada bingkai 1440px di Figma. Lebar isi dibatasi 1440px lalu dipusatkan.",
  ],
];

const toc: TocEntry[] = [
  { id: "dasar", label: "Tampilan dasar" },
  { id: "variasi", label: "Variasi" },
  { id: "platform", label: "platform" },
  { id: "teks", label: "heading · subHeading · description" },
  { id: "tombol", label: "showButton · buttonLabel · buttonHref" },
  { id: "gambar", label: "image · imageOrientation · imageContent" },
  { id: "ukuran", label: "Ukuran & jarak" },
  { id: "responsif", label: "Perilaku responsif" },
  // Playground di urutan belakang: variasi dan penjelasan propnya dibaca dulu,
  // baru pembaca menggabungkannya sendiri.
  { id: "playground", label: "Playground" },
  { id: "penggunaan", label: "Penggunaan" },
  { id: "properties", label: "Properties" },
];

/**
 * Bingkai pratinjau: Hero selalu selebar wadahnya, jadi sudutnya dirapikan.
 * `label` dipakai di bagian Variasi supaya tiap frame Figma punya namanya.
 */
function Preview({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div>
      {label && (
        <p className="mb-2 text-sm font-black text-gray-900">{label}</p>
      )}
      <div className="rounded-2xl border border-border bg-surface-subtle p-4 sm:p-5">
        <div className="overflow-hidden rounded-xl shadow-soft">{children}</div>
      </div>
    </div>
  );
}

/** Ilustrasi inline untuk bagian imageContent — bukan berkas gambar. */
const InlineIllustration = () => (
  <div className="flex aspect-[3/4] w-full items-center justify-center rounded-xl border-2 border-dashed border-primary-300 bg-primary-50">
    <span className="text-sm font-black text-primary-700">Ilustrasi inline</span>
  </div>
);

export function HeroPage() {
  const [type, setType] = useState<HeroType>("horizontal-image-left");
  const [view, setView] = useState<"mobile" | "desktop">("desktop");
  const [orientation, setOrientation] =
    useState<HeroImageOrientation>("portrait");
  const [withSubHeading, setWithSubHeading] = useState(true);
  const [withButton, setWithButton] = useState(true);

  // Turunan untuk cuplikan kode di bagian Penggunaan — satu sumber dengan Playground.
  const ind = view === "mobile" ? "    " : "";
  const summary = [
    `type "${type}"`,
    view === "mobile" ? "Mobile · dibatasi 390px" : "Desktop · lebar penuh",
    type === "centered" ? "tanpa gambar" : `gambar ${orientation}`,
    withSubHeading ? "dengan sub heading" : "tanpa sub heading",
    withButton ? "dengan tombol" : "tanpa tombol",
  ].join(" · ");

  return (
    <UsulanPage
      eyebrow="Components"
      title="Hero"
      description="Blok pembuka halaman: judul, sub heading, deskripsi, satu tombol, dan gambar pendamping. Susunannya mengikuti lebar hero itu sendiri, bukan lebar layar."
      toc={toc}
    >
      <FlowSection id="dasar" title="Tampilan dasar">
        <Lead>
          Susunan bawaan <C>horizontal-image-left</C>: gambar di kiri, teks di
          kanan. Isi contoh di bawah diambil apa adanya dari frame Hero di Figma
          — <C>Hero Text</C>, <C>Hero sub heading</C>, <C>Hero Desc</C>, dan
          tombol <em>Lihat Lebih Lanjut</em>. Semua bagiannya opsional: yang
          tidak diisi tidak dirender, bukan disembunyikan lewat CSS.
        </Lead>

        <Preview>
          <Hero
            type="horizontal-image-left"
            heading={heroText}
            subHeading={heroSubHeading}
            description={heroDesc}
            image={heroImage}
            imageAlt=""
            buttonHref="#/components/hero"
          />
        </Preview>

        <SectionCode>
          {"import { Hero } from '@tpl/design-kit-react'\n\n"}
          {"<Hero\n"}
          {'    type="horizontal-image-left"\n'}
          {'    heading="Hero Design system Stasi"\n'}
          {'    subHeading="Hero Design system Stasi"\n'}
          {`    description="${heroDesc}"\n`}
          {'    image="/images/hero-sample.svg"\n'}
          {'    buttonHref="/design-system"\n'}
          {"/>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="variasi" title="Variasi">
        <Lead>
          Ketiga nilai <C>type</C> memakai bagian isi yang sama; yang berbeda
          hanya letak gambar dan perataan teksnya. Nama tiap variasi di bawah
          sengaja disamakan dengan nama frame di Figma agar mudah dicocokkan.
          Dua tipe horizontal masing-masing punya versi gambar potret dan
          lanskap lewat <C>imageOrientation</C> — yang berubah hanya lebar kolom
          gambarnya, bukan rasio gambarnya. <C>centered</C> melepas gambar
          sepenuhnya — <C>image</C> dan <C>imageContent</C> diabaikan — lalu
          memusatkan teks di atas latar <C>primary-50</C>.
        </Lead>

        <div className="space-y-6">
          <Preview label="Hero Horizontal Image Left — bawaan">
            <Hero
              type="horizontal-image-left"
              heading={heroText}
              subHeading={heroSubHeading}
              description={heroDesc}
              image={heroImage}
              buttonHref="#/components/hero"
            />
          </Preview>

          <Preview label="Hero Horizontal Image Right">
            <Hero
              type="horizontal-image-right"
              heading={heroText}
              subHeading={heroSubHeading}
              description={heroDesc}
              image={heroImage}
              buttonHref="#/components/hero"
            />
          </Preview>

          <Preview label="Hero Horizontal Image Left — gambar lanskap">
            <Hero
              type="horizontal-image-left"
              imageOrientation="landscape"
              heading={heroText}
              subHeading={heroSubHeading}
              description={heroDesc}
              image={heroImageLandscape}
              buttonHref="#/components/hero"
            />
          </Preview>

          <Preview label="Hero Horizontal Image Right — gambar lanskap">
            <Hero
              type="horizontal-image-right"
              imageOrientation="landscape"
              heading={heroText}
              subHeading={heroSubHeading}
              description={heroDesc}
              image={heroImageLandscape}
              buttonHref="#/components/hero"
            />
          </Preview>

          <Preview label="Hero Centered — tanpa gambar, tanpa sub heading">
            <Hero
              type="centered"
              heading={heroText}
              showHeading={false}
              description={heroDesc}
              buttonHref="#/components/hero"
            />
          </Preview>
        </div>

        <SectionCode>
          {"{/* Gambar di kiri teks — nilai bawaan type */}\n"}
          {"<Hero "}
          <Mark>type</Mark>
          {'="horizontal-image-left"  image="/images/hero-sample.svg" … />\n\n'}
          {"{/* Gambar di kanan teks */}\n"}
          {"<Hero "}
          <Mark>type</Mark>
          {'="horizontal-image-right" image="/images/hero-sample.svg" … />\n\n'}
          {"{/* Tanpa gambar, teks terpusat, latar primary-50 */}\n"}
          {"<Hero "}
          <Mark>type</Mark>
          {'="centered"               showHeading={false} … />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="platform" title="platform">
        <Lead>
          <C>desktop</C> — bawaannya — membiarkan susunannya ditentukan lebar
          hero lewat <C>@container</C>: dua kolom mulai 768px, bertumpuk di
          bawahnya. <C>platform="mobile"</C> memaksa susunan bertumpuk itu
          berapa pun lebar ruangnya, sekaligus menahan judul di ukuran{" "}
          <C>heading-1</C> supaya tidak melompat ke <C>display</C>. Dipakai saat
          hero dirender di kerangka aplikasi mobile — bukan sekadar di jendela
          yang disempitkan, karena untuk kasus itu ambang <C>@container</C>{" "}
          sudah menanganinya sendiri.
        </Lead>

        {/* Dibingkai 390px — lebar ponsel — karena hero mobile yang dipratinjau
            selebar kotak dokumentasi terbaca melar, bukan seperti pemakaiannya. */}
        <Stage maxWidth="max-w-[390px]">
          <div className="overflow-hidden rounded-xl shadow-soft">
            <Hero
              type="horizontal-image-left"
              platform="mobile"
              heading={heroText}
              subHeading={heroSubHeading}
              description={heroDesc}
              image={heroImage}
              buttonHref="#/components/hero"
            />
          </div>
        </Stage>

        <SectionCode>
          {"<Hero "}
          <Mark>platform</Mark>
          {'="mobile" … />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="teks" title="heading · subHeading · description">
        <Lead>
          <C>heading</C> dirender sebagai <C>{"<h1>"}</C>, jadi satu halaman
          sebaiknya hanya memuat satu Hero ber-<C>heading</C>; hero kedua di
          halaman yang sama lebih baik dikosongkan judulnya. <C>subHeading</C>{" "}
          adalah baris kecil berwarna <C>primary-600</C> di bawahnya, dan{" "}
          <C>showHeading={"{false}"}</C> — namanya mengikuti properti{" "}
          <C>Show Heading</C> di Figma — melepas baris itu. Judul utamanya
          sendiri tidak pernah bisa disembunyikan: hero tanpa judul membuat
          halaman kehilangan penanda utamanya bagi pembaca layar dan mesin
          pencari.
        </Lead>
        <Lead>
          <C>description</C> ditahan <C>max-w-2xl</C> (672px) agar barisnya
          tidak terlalu panjang untuk dibaca; di kolom yang lebih sempit — dua
          kolom pada tipe horizontal — batas itu tidak pernah aktif. Ketiganya
          bertipe <C>ReactNode</C>, jadi sebagian katanya boleh diberi warna
          lain atau disisipi tautan.
        </Lead>

        <Preview>
          <Hero
            type="horizontal-image-right"
            heading={
              <>
                Hero <span className="text-primary-700">Design system</span>{" "}
                Stasi
              </>
            }
            subHeading={heroSubHeading}
            showHeading={false}
            description={
              <>
                {heroDesc}. Rinciannya ada di{" "}
                <a
                  href="#/foundations"
                  className="font-bold text-primary-700 underline"
                >
                  halaman Foundations
                </a>
                .
              </>
            }
            image={heroImage}
            showButton={false}
          />
        </Preview>

        <SectionCode>
          {"<Hero\n"}
          {"    "}
          <Mark>heading</Mark>
          {"={\n"}
          {
            '        <>Hero <span className="text-primary-700">Design system</span> Stasi</>\n'
          }
          {"    }\n"}
          {"    "}
          <Mark>showHeading</Mark>
          {"={false}   {/* baris subHeading tidak dirender */}\n"}
          {"    "}
          <Mark>description</Mark>
          {"={\n"}
          {
            '        <>Design System Stasi … <a href="/foundations">halaman Foundations</a>.</>\n'
          }
          {"    }\n"}
          {"/>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="tombol" title="showButton · buttonLabel · buttonHref">
        <Lead>
          Satu tombol saja — hero dengan dua tombol bersaing membuat pembaca
          ragu mana yang utama. <C>buttonLabel</C> bawaannya{" "}
          <C>"Lihat Lebih Lanjut"</C> dan panah kanannya ditambahkan otomatis.
          Isi <C>buttonHref</C> bila tombolnya berpindah halaman — komponennya
          jadi merender <C>{"<a href>"}</C> sehingga alamatnya bisa disalin dan
          dibuka di tab baru; kalau kosong, tombolnya <C>{"<button>"}</C> yang
          memanggil <C>onButtonClick</C>. <C>showButton={"{false}"}</C> melepas
          tombol beserta jarak atasnya.
        </Lead>

        <div className="space-y-6">
          <Preview label="buttonLabel diganti">
            <Hero
              type="horizontal-image-left"
              heading={heroText}
              subHeading={heroSubHeading}
              description={heroDesc}
              image={heroImage}
              buttonLabel="Mulai Pakai Design System"
              buttonHref="#/components"
            />
          </Preview>

          <Preview label="Tanpa tombol">
            <Hero
              type="horizontal-image-left"
              heading={heroText}
              subHeading={heroSubHeading}
              description={heroDesc}
              image={heroImage}
              showButton={false}
            />
          </Preview>
        </div>

        <SectionCode>
          {"<Hero\n"}
          {"    "}
          <Mark>buttonLabel</Mark>
          {'="Mulai Pakai Design System"\n'}
          {"    "}
          <Mark>buttonHref</Mark>
          {'="/components"\n'}
          {"/>\n\n"}
          {"<Hero "}
          <Mark>showButton</Mark>
          {"={false} … />"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="gambar" title="image · imageOrientation · imageContent">
        <Lead>
          <C>image</C> menerima URL berkas dan dirender{" "}
          <strong className="text-gray-900">tanpa kunci rasio</strong>:
          tingginya mengikuti rasio asli berkasnya. Ini disengaja — mengunci{" "}
          <C>aspect-ratio</C> di sini membuat ilustrasi potret ikut dipipihkan
          dan teks di dalamnya jadi gepeng. Karena itu{" "}
          <C>imageOrientation</C> pun tidak menyentuh rasio gambarnya sama
          sekali; yang diaturnya hanya lebar kolom — potret <C>386px</C>,
          lanskap <C>435px</C> — jadi kirim berkas yang orientasinya memang
          cocok.
        </Lead>
        <Lead>
          <C>imageAlt</C> diisi hanya bila gambarnya membawa informasi; kalau
          cuma hiasan, biarkan kosong supaya tidak dibacakan dua kali bersama
          judul. Bila pendampingnya bukan berkas gambar — ilustrasi{" "}
          <C>{"<svg>"}</C> inline, kartu statistik, komposisi sendiri — pakai{" "}
          <C>imageContent</C>; prop itu hanya berlaku saat <C>image</C> kosong,
          dan bila keduanya diisi <C>image</C> yang menang. Ketiganya diabaikan
          pada <C>type="centered"</C>.
        </Lead>

        <Preview label="imageContent — ilustrasi inline, bukan berkas">
          <Hero
            type="horizontal-image-left"
            heading={heroText}
            subHeading={heroSubHeading}
            description={heroDesc}
            imageContent={<InlineIllustration />}
            buttonHref="#/components/hero"
          />
        </Preview>

        <SectionCode>
          {"<Hero\n"}
          {"    "}
          <Mark>image</Mark>
          {'="/images/hero-sample-landscape.svg"\n'}
          {"    "}
          <Mark>imageOrientation</Mark>
          {'="landscape"\n'}
          {"    "}
          <Mark>imageAlt</Mark>
          {'="Sampul panduan Designing Interfaces"\n'}
          {"/>\n\n"}
          {"{/* Pendamping berupa elemen — hanya dipakai bila image kosong */}\n"}
          {"<Hero "}
          <Mark>imageContent</Mark>
          {'={<Ilustrasi className="w-full" />} … />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="ukuran" title="Ukuran & jarak">
        <Lead>
          Diambil dari panel <em>Layout</em> di Figma. Satu angka sengaja tidak
          diturunkan apa adanya: <C>padding kiri-kanan 0</C>. Di Figma isinya
          ditahan wadah selebar 1290px yang dipusatkan, dan wadah itu kehilangan
          artinya begitu layarnya lebih sempit dari 1290px — teks akan menempel
          ke tepi. Jadi jarak tepi yang sama (76px pada bingkai 1440px) dipasang
          sebagai padding bertingkat.
        </Lead>

        <div className="ds-card overflow-hidden">
          <dl className="divide-y divide-border">
            {spacingSpec.map(([term, value]) => (
              <div
                key={term}
                className="grid gap-1 px-5 py-3 sm:grid-cols-[13rem_1fr] sm:gap-4"
              >
                <dt className="text-sm font-black text-gray-900">{term}</dt>
                <dd className="text-body-sm leading-6 text-gray-600">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </FlowSection>

      <FlowSection id="responsif" title="Perilaku responsif">
        <Lead>
          Ambang di bawah ini diukur dari{" "}
          <strong className="text-gray-900">lebar hero itu sendiri</strong>,
          bukan lebar layar — elemen <C>{"<section>"}</C> dipasangi{" "}
          <C>@container</C>. Jadi hero yang ditaruh di kolom sempit pada layar
          desktop tetap tampil bertumpuk seperti di ponsel. Prop{" "}
          <C>platform="mobile"</C> memaksa susunan bertumpuk itu tanpa menunggu
          ambang lebarnya.
        </Lead>

        <div className="grid gap-4 sm:grid-cols-3">
          {responsiveBehaviour.map(([title, desc]) => (
            <article key={title} className="ds-card p-5">
              <h3 className="text-sm font-black text-gray-900">{title}</h3>
              <p className="mt-1.5 text-body-sm leading-6 text-gray-500">
                {desc}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-4 max-w-2xl text-body-sm leading-6 text-gray-500">
          Yang tidak berubah di ukuran mana pun: jarak atas-bawah 24px, judul{" "}
          <C>font-black</C>, sub heading <C>primary-600</C>, deskripsi ditahan{" "}
          <C>max-w-2xl</C>, dan teks selalu ditulis lebih dulu di DOM — letak
          gambar diatur arah barisnya, sehingga <C>{"<h1>"}</C> tetap jadi hal
          pertama yang dibacakan pembaca layar pada kedua tipe horizontal.
        </p>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Kelima kontrol di bawah panggung menggabungkan prop-prop di atas dalam
          satu tampilan, dan bagian Penggunaan menuliskan kodenya. Kontrol{" "}
          <em>Platform</em> mengubah dua hal sekaligus: prop <C>platform</C>{" "}
          pada hero dan lebar pembungkus pratinjaunya. Pada <C>centered</C>{" "}
          gambar memang tidak muncul walau <C>image</C> tetap diisi — itu bagian
          dari tipenya, bukan kekeliruan.
        </Lead>

        <Stage maxWidth={view === "mobile" ? "max-w-[390px]" : "max-w-full"}>
          <div className="overflow-hidden rounded-xl shadow-soft">
            <Hero
              type={type}
              platform={view}
              heading={heroText}
              subHeading={heroSubHeading}
              description={heroDesc}
              showHeading={withSubHeading}
              showButton={withButton}
              imageOrientation={orientation}
              image={
                orientation === "landscape" ? heroImageLandscape : heroImage
              }
              buttonHref="#/components/hero"
            />
          </div>
        </Stage>

        <Controls>
          <Control label="Tipe">
            <Segmented
              label="Pilih tipe hero"
              value={type}
              onChange={setType}
              wrap
              options={[
                { value: "horizontal-image-left", label: "Image Left" },
                { value: "horizontal-image-right", label: "Image Right" },
                { value: "centered", label: "Centered" },
              ]}
            />
          </Control>

          <Control label="Platform">
            <Segmented
              label="Pilih platform"
              value={view}
              onChange={setView}
              options={[
                {
                  value: "mobile",
                  label: "Mobile",
                  icon: "M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm4 15h2",
                },
                {
                  value: "desktop",
                  label: "Desktop",
                  icon: "M3 5h18v11H3V5Zm6 15h6m-3-4v4",
                },
              ]}
            />
          </Control>

          <Control label="Gambar">
            <Segmented
              label="Pilih orientasi gambar"
              value={orientation}
              onChange={setOrientation}
              disabled={type === "centered"}
              options={[
                { value: "portrait", label: "Potret" },
                { value: "landscape", label: "Lanskap" },
              ]}
            />
          </Control>

          <Control label="Sub heading">
            <Segmented
              label="Tampilkan sub heading"
              value={withSubHeading}
              onChange={setWithSubHeading}
              options={adaTidakAda}
            />
          </Control>

          <Control label="Tombol">
            <Segmented
              label="Tampilkan tombol"
              value={withButton}
              onChange={setWithButton}
              options={adaTidakAda}
            />
          </Control>
        </Controls>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Mengikuti kelima kontrol di Playground — tipe, platform, orientasi
          gambar, sub heading, dan tombol. Nama prop yang sedang dikendalikan
          kontrol ditandai dengan warna biru, dan tombol <em>Salin</em> selalu
          menyalin persis yang sedang tampil.
        </Lead>
        <SectionCode flush>
          {"import { Hero } from '@tpl/design-kit-react'\n\n"}
          {`{/* ${summary} */}\n`}
          {view === "mobile" && (
            <>
              {"{/* Hero tidak perlu tahu ini mobile — susunannya mengikuti\n"}
              {"    lebar pembungkusnya sendiri lewat container query. */}\n"}
              {'<div className="'}
              <Mark>max-w-[390px]</Mark>
              {'">\n'}
            </>
          )}
          {`${ind}<Hero\n`}
          {`${ind}    `}
          <Mark>type</Mark>
          {`="${type}"\n`}
          {`${ind}    `}
          <Mark>platform</Mark>
          {`="${view}"\n`}
          {`${ind}    heading="${heroText}"\n`}
          {withSubHeading && `${ind}    subHeading="${heroSubHeading}"\n`}
          {!withSubHeading && (
            <>
              {`${ind}    `}
              <Mark>showHeading</Mark>
              {"={false}\n"}
            </>
          )}
          {`${ind}    description="${heroDesc}"\n`}
          {!withButton && (
            <>
              {`${ind}    `}
              <Mark>showButton</Mark>
              {"={false}\n"}
            </>
          )}
          {withButton && `${ind}    buttonHref="/design-system"\n`}
          {type !== "centered" && orientation === "landscape" && (
            <>
              {`${ind}    `}
              <Mark>imageOrientation</Mark>
              {'="landscape"\n'}
              {`${ind}    image="/images/hero-sample-landscape.svg"\n`}
            </>
          )}
          {type !== "centered" &&
            orientation === "portrait" &&
            `${ind}    image="/images/hero-sample.svg"\n`}
          {`${ind}/>`}
          {view === "mobile" && "\n</div>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Rangkuman seluruh prop, termasuk yang tidak diberi bagian sendiri di
          atas. Semuanya opsional — <C>{"<Hero />"}</C> tanpa prop tetap
          merender kerangkanya beserta tombol bawaannya. Atribut HTML di luar
          daftar ini tidak diteruskan ke elemen <C>{"<section>"}</C>.
        </Lead>
        <PropsTable rows={heroProps} minWidth="52rem" />
      </FlowSection>
    </UsulanPage>
  );
}
