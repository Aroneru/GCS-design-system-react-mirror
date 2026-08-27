import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Container, type ContainerSize } from "../../../lib";
import { PropsTable, type PropRow } from "../../PropsTable";
import { C, H, Mark, Segmented } from "../../pageKit";
import {
  Control,
  Controls,
  FlowSection,
  Lead,
  SectionCode,
  UsulanPage,
  type TocEntry,
} from "../../usulanKit";

/**
 * Susunan halaman: varian dulu — pertanyaan pertama pemakai selalu "yang mana
 * yang saya pakai", bukan "bagaimana cara kerjanya" — lalu ringkasan cara
 * kerjanya, bagian per properti, angka per ambang, playground, dan tabel
 * lengkap. Daftar isi menempel di kanan.
 *
 * Seluruh prop Container dapat bagiannya sendiri karena propnya cuma enam dan
 * tiap prop mengubah satu keputusan tata letak yang berbeda.
 */

const containerProps: PropRow[] = [
  [
    "size",
    "'prose' | 'default' | 'wide' | 'full'",
    "default",
    "Batas lebar konten: 720px, 1126px, 1440px, atau tanpa batas. Hanya angka itu yang berubah antar varian.",
  ],
  [
    "as",
    "ElementType",
    "div",
    "Elemen HTML pembungkus. Pakai section, main, atau footer agar struktur halaman tetap semantik.",
  ],
  [
    "padded",
    "boolean",
    "true",
    "Padding horizontal bawaan (20px → 56px). Matikan bila elemen induk sudah punya padding sendiri.",
  ],
  [
    "className",
    "string",
    "—",
    "Kelas untuk elemen luar: jarak vertikal (py-*), flex-1, atau max-w-* bila ingin batas yang lebih sempit.",
  ],
  [
    "children",
    "ReactNode",
    "—",
    "Konten yang dibatasi lebarnya — teks, grid, maupun komponen lain.",
  ],
  [
    "…props",
    "HTMLAttributes",
    "—",
    "Seluruh atribut HTML standar diteruskan (id, aria-*, data-*, …).",
  ],
];

/** Tiga hal yang benar-benar dikerjakan Container di balik layar. */
const howItWorks: [string, string, string][] = [
  [
    "Membatasi lebar",
    "max-w-[380px] · @[640px]:max-w-[1126px]",
    "Konten berhenti di angka itu. Di ruang yang lebih lebar, sisanya dibiarkan kosong supaya baris teks tidak melar dan tetap enak dibaca.",
  ],
  [
    "Memusatkan",
    "mx-auto · w-full",
    "Margin kiri-kanan otomatis membagi sisa ruang rata. Selama ruangnya masih lebih sempit dari batas, container ikut menyusut penuh.",
  ],
  [
    "Memberi padding",
    "px-5 → @[1280px]:px-14",
    "Jarak ke tepi tumbuh bertahap mengikuti ambang, jadi konten tidak pernah menempel di pinggir pada layar kecil.",
  ],
];

const containerSpecs: [string, string, string][] = [
  [
    "Sempit",
    "< 640px",
    'max-w 380px · rounded-xl · padding kiri-kanan 20px (kecuali size="full")',
  ],
  [
    "Sedang",
    "≥ 640px",
    "max-w mengikuti varian — bawaan 1126px · sudut rata · padding 32px",
  ],
  [
    "Lebar",
    "≥ 1024px / 1280px",
    "max-w varian tetap · padding 48px, lalu 56px di ≥ 1280px",
  ],
  [
    "Lebar isi",
    "Semua ukuran",
    "w-full sampai batas max-w — tidak pernah melebihi ruangnya",
  ],
  ["Posisi", "Semua ukuran", "mx-auto — selalu terpusat di ruang yang tersedia"],
  [
    "Tinggi",
    "Semua ukuran",
    "auto — mengikuti tinggi konten, tidak pernah dipaksa",
  ],
];

/**
 * Empat varian lebar. `ratio` dipakai untuk menggambar bilah perbandingan —
 * skalanya relatif terhadap varian terlebar (1440px) supaya selisih antar
 * varian langsung terlihat tanpa membaca angkanya satu per satu.
 */
const REFERENCE_WIDTH = 1440;

const containerSizes: {
  value: ContainerSize;
  max: string;
  ratio: number;
  headline: string;
  use: string;
}[] = [
  {
    value: "prose",
    max: "720px",
    ratio: 720 / REFERENCE_WIDTH,
    headline: "Teks panjang & formulir",
    use: "Baris berhenti di sekitar 75 karakter, jarak yang paling nyaman dibaca. Pakai untuk artikel, syarat layanan, dan formulir satu kolom.",
  },
  {
    value: "default",
    max: "1126px",
    ratio: 1126 / REFERENCE_WIDTH,
    headline: "Bawaan — halaman layanan",
    use: "Angka dari spec Figma. Dipakai bila tidak ada alasan khusus untuk berbeda, supaya semua halaman berhenti di garis yang sama.",
  },
  {
    value: "wide",
    max: "1440px",
    ratio: 1,
    headline: "Tabel & dasbor",
    use: "Ruang tambahan untuk tabel berkolom banyak atau grid empat kartu ke atas yang terasa sesak di 1126px.",
  },
  {
    value: "full",
    max: "tanpa batas",
    ratio: 1,
    headline: "Mengisi penuh induk",
    use: "Tidak ada batas lebar — yang tersisa hanya padding kiri-kanan. Untuk hero berwarna, peta, atau kanvas yang memang harus melebar.",
  },
];

const toc: TocEntry[] = [
  { id: "size", label: "size" },
  { id: "cara-kerja", label: "Cara kerja" },
  { id: "children", label: "children" },
  { id: "as", label: "as" },
  { id: "padded", label: "padded" },
  { id: "class-name", label: "className" },
  { id: "spesifikasi", label: "Angka per ambang" },
  // Playground di urutan belakang: pembaca tahu dulu apa yang diatur Container,
  // baru mencobanya sendiri.
  { id: "playground", label: "Playground" },
  { id: "penggunaan", label: "Penggunaan" },
  { id: "properties", label: "Properties" },
];

type View = "mobile" | "desktop" | "custom";

const MIN_WIDTH = 320;
const MAX_WIDTH = 1600;

/** Lebar preset per mode; mode `custom` memakai angka dari input pengguna. */
const presetWidth: Record<Exclude<View, "custom">, number> = {
  mobile: 380,
  desktop: 1126,
};

/** Isi contoh: kotak putus-putus supaya batas konten terlihat jelas. */
function Isi({ label }: { label: string }) {
  return (
    <div className="rounded-lg border-2 border-dashed border-primary-300 bg-surface px-4 py-6 text-center">
      <p className="text-sm font-black text-primary-700">{label}</p>
    </div>
  );
}

/** Kotak "ruang yang tersedia" berlatar biru muda. */
function Ruang({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-subtle p-4 sm:p-6">
      <div className="rounded-xl bg-primary-50 ring-1 ring-primary-100">
        {children}
      </div>
    </div>
  );
}

export function ContainerPage() {
  const [view, setView] = useState<View>("desktop");
  const [size, setSize] = useState<ContainerSize>("default");
  const [customWidth, setCustomWidth] = useState(900);

  const width = view === "custom" ? customWidth : presetWidth[view];

  /** Varian aktif + label ruang: dipakai bersama oleh Lead dan contoh kode. */
  const activeSize = containerSizes.find((s) => s.value === size)!;
  const roomLabel =
    view === "custom"
      ? `ruang ${width}px`
      : view === "mobile"
        ? "ruang sempit (< 640px)"
        : "ruang lapang (≥ 640px)";

  /** Batasi input manual agar preview tidak pernah keluar dari rentang wajar. */
  const clamp = (n: number) => Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, n));

  /**
   * Angka pada playground diukur dari DOM yang benar-benar dirender, bukan
   * dihitung ulang di halaman ini — supaya dokumentasi mustahil berbeda dari
   * komponennya.
   */
  const availRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState({
    avail: 0,
    content: 0,
    padding: 0,
  });

  useLayoutEffect(() => {
    const avail = availRef.current;
    const content = contentRef.current;
    if (!avail || !content) return;

    const update = () => {
      // Elemen dalam milik Container-lah yang memegang max-width dan padding.
      const inner = content.parentElement;
      setMeasured({
        avail: Math.round(avail.getBoundingClientRect().width),
        content: Math.round(content.getBoundingClientRect().width),
        padding: inner
          ? Math.round(parseFloat(getComputedStyle(inner).paddingLeft))
          : 0,
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(avail);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  return (
    <UsulanPage
      eyebrow="Components"
      title="Container"
      description="Pembungkus paling luar untuk isi halaman. Tugasnya satu: menjaga konten berhenti di lebar yang sama di mana pun ia dipakai — 380px saat ruangnya sempit dan 1126px saat lapang — lalu memusatkannya. Tingginya selalu mengikuti konten."
      toc={toc}
    >
      <FlowSection id="size" title="size">
        <Lead>
          Memilih sampai mana konten boleh melar di ruang lapang — itu saja yang
          berbeda antar varian. Pemusatan, padding, dan perilaku di ruang sempit
          persis sama di keempatnya. Bilah di bawah digambar dengan skala yang
          sama, 1440px sebagai patokan penuh.
        </Lead>
        <ul className="ds-card divide-y divide-border">
          {containerSizes.map(({ value, max, ratio, headline, use }) => (
            <li
              key={value}
              className="grid gap-3 p-5 sm:grid-cols-[11rem_1fr] sm:gap-6"
            >
              <div>
                <p className="text-sm font-black text-gray-900">
                  size=&quot;{value}&quot;
                  {value === "default" && (
                    <span className="ml-2 align-middle text-[10px] font-bold tracking-wide text-gray-500 uppercase">
                      bawaan
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-xs font-bold text-primary-700">
                  {max}
                </p>
                <p className="mt-0.5 text-body-sm text-gray-500">{headline}</p>
              </div>
              <div>
                {/* Bilah perbandingan: dekoratif, angkanya sudah ditulis di kiri. */}
                <div
                  aria-hidden="true"
                  className="h-8 w-full overflow-hidden rounded-lg bg-surface-subtle ring-1 ring-border"
                >
                  <div
                    className={
                      value === "full"
                        ? "h-full rounded-lg bg-primary-100 ring-1 ring-primary-300"
                        : "h-full rounded-lg bg-primary-50 ring-1 ring-primary-300"
                    }
                    style={{ width: `${ratio * 100}%` }}
                  />
                </div>
                <p className="mt-2 text-body-sm leading-6 text-gray-500">
                  {use}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 max-w-2xl text-body-sm leading-6 text-gray-500">
          <C>wide</C> dan <C>full</C> menggambar bilah yang sama panjang karena
          patokannya 1440px — bedanya baru terasa di ruang yang lebih lebar dari
          itu: <C>wide</C> berhenti, <C>full</C> terus mengikuti induknya.
          Cobalah di Playground dengan lebar Custom di atas 1440px.
        </p>
        <SectionCode>
          {'{/* Bawaan — size="default" tidak perlu ditulis */}\n'}
          {"<Container>\n    ...\n</Container>\n\n"}
          {"{/* Teks panjang & formulir — berhenti di 720px */}\n"}
          {"<Container "}
          <Mark>size=&quot;prose&quot;</Mark>
          {">\n    ...\n</Container>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="cara-kerja" title="Cara kerja">
        <Lead>
          Tiga hal ini sudah menempel di komponen — tidak perlu ditulis ulang
          setiap kali dipakai. Di luar ketiganya Container tidak menyentuh apa
          pun: tidak ada grid, flex, warna, atau jarak antar-anak, jadi isinya
          tetap mengatur dirinya sendiri.
        </Lead>
        <div className="grid gap-4 sm:grid-cols-3">
          {howItWorks.map(([title, classes, detail]) => (
            <article key={title} className="ds-card p-5">
              <h3 className="text-sm font-black text-gray-900">{title}</h3>
              <p className="mt-1 text-xs font-bold text-primary-700">
                {classes}
              </p>
              <p className="mt-1.5 text-body-sm leading-6 text-gray-500">
                {detail}
              </p>
            </article>
          ))}
        </div>
      </FlowSection>

      <FlowSection id="children" title="children">
        <Lead>
          Isi yang lebarnya dibatasi — teks, grid, maupun komponen lain. Karena
          Container tidak mengatur tata letak isinya, apa pun yang dimasukkan
          tetap memegang susunannya sendiri; yang berubah cuma di mana ia
          berhenti.
        </Lead>
        <Ruang>
          <Container className="py-6">
            <Isi label="children" />
          </Container>
        </Ruang>
        <SectionCode>
          {"import { Container } from '@tpl/design-kit-react'\n\n"}
          {"<Container>\n"}
          {"    <h1>Pendaftaran Penyelenggara Sistem Elektronik</h1>\n"}
          {"    <p>Lengkapi data pemohon dan sistem elektronik yang didaftarkan.</p>\n"}
          {"</Container>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="as" title="as">
        <Lead>
          Mengganti elemen HTML terluar tanpa mengubah perilaku apa pun.
          Bawaannya <C>div</C>; pakai <C>header</C>, <C>main</C>, <C>section</C>,
          atau <C>footer</C> supaya struktur halaman tetap terbaca oleh pembaca
          layar dan mesin pencari — bukan tumpukan div tanpa makna.
        </Lead>
        <Ruang>
          <Container as="section" className="py-6">
            <Isi label='as="section"' />
          </Container>
        </Ruang>
        <SectionCode>
          {"<Container "}
          <Mark>as</Mark>
          {'="section">\n    ...\n</Container>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="padded" title="padded">
        <Lead>
          Mematikan padding kiri-kanan bawaan. Dipakai saat elemen induk sudah
          punya padding sendiri — kalau tidak, jaraknya jadi dobel dan konten
          menyempit tanpa disadari. Jangan menimpanya dengan <C>px-0</C> lewat{" "}
          <C>className</C>: paddingnya hidup di elemen dalam, bukan elemen luar
          yang menerima <C>className</C>.
        </Lead>
        <div className="grid gap-4 sm:grid-cols-2">
          <Ruang>
            <Container className="py-6">
              <Isi label="padded (bawaan)" />
            </Container>
          </Ruang>
          <Ruang>
            <Container padded={false} className="py-6">
              <Isi label="padded={false}" />
            </Container>
          </Ruang>
        </div>
        <SectionCode>
          {'<Container as="section" '}
          <Mark>padded={"{false}"}</Mark>
          {">\n    ...\n</Container>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="class-name" title="className">
        <Lead>
          Menempel di elemen luar, bukan elemen yang memegang lebar. Tiga
          pemakaian yang wajar: jarak vertikal (<C>py-*</C>) karena Container
          sengaja tidak punya jarak atas-bawah bawaan; warna latar yang ingin
          melebar penuh; dan <C>max-w-*</C> bila batasnya perlu lebih sempit dari
          bawaan.
        </Lead>
        <Ruang>
          <Container className="max-w-[720px] py-10">
            <Isi label='className="max-w-[720px] py-10"' />
          </Container>
        </Ruang>
        <SectionCode>
          {"{/* Jarak vertikal — Container tidak punya bawaannya */}\n"}
          {'<Container className="'}
          <H>py-12 lg:py-16</H>
          {'">\n    ...\n</Container>\n\n'}
          {"{/* Batas lebih sempit dari bawaan */}\n"}
          {'<Container className="'}
          <Mark>max-w-[720px]</Mark>
          {'">\n    ...\n</Container>'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="spesifikasi" title="Angka per ambang">
        <Lead>
          Nilai pasti yang dipakai komponen, diukur dari lebar ruang yang
          tersedia — bukan lebar jendela, karena Container memakai{" "}
          <em>container query</em> seperti Footer dan Hero. Di halaman biasa
          hasilnya sama saja, tapi di dalam kolom sempit atau split view,
          Container tetap tahu diri.
        </Lead>
        <div className="grid gap-4 sm:grid-cols-3">
          {containerSpecs.map(([title, range, detail]) => (
            <article key={title} className="ds-card p-5">
              <h3 className="text-sm font-black text-gray-900">{title}</h3>
              <p className="mt-1 text-xs font-bold text-primary-700">{range}</p>
              <p className="mt-1.5 text-body-sm leading-6 text-gray-500">
                {detail}
              </p>
            </article>
          ))}
        </div>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Kotak biru muda adalah ruang yang tersedia; garis putus-putus adalah
          tempat konten berhenti. Selisih keduanya itulah padding. Ganti{" "}
          <strong className="text-gray-900">Varian</strong> untuk melihat batas
          lebarnya, lalu <C>Mobile</C>/<C>Desktop</C> untuk melihat ambang
          bawaannya — atau <C>Custom</C> untuk mengetik lebar sendiri. Yang
          berganti di atas benar-benar komponen <C>Container</C>, bukan kotak
          tiruan: angkanya diukur langsung dari elemen yang dirender.
        </Lead>

        <div className="rounded-2xl border border-border bg-surface-subtle p-4 sm:p-6">
          <div
            ref={availRef}
            className="mx-auto max-w-full rounded-xl bg-primary-50 ring-1 ring-primary-100 transition-[width] duration-300 ease-out"
            style={{ width: `${width}px` }}
          >
            <Container size={size} className="py-6">
              <div
                ref={contentRef}
                className="rounded-lg border-2 border-dashed border-primary-300 bg-surface px-4 py-8 text-center"
              >
                <p className="text-sm font-black text-primary-700">
                  size=&quot;{size}&quot;
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  ruang {measured.avail}px · konten {measured.content}px ·
                  padding {measured.padding}px
                </p>
              </div>
            </Container>
          </div>
        </div>

        <Controls>
          <Control label="Varian">
            <Segmented
              label="Pilih varian lebar container"
              value={size}
              onChange={setSize}
              options={containerSizes.map(({ value }) => ({
                value,
                label: value,
              }))}
            />
          </Control>

          <Control label="Lebar">
            <Segmented
              label="Pilih lebar container"
              value={view}
              onChange={setView}
              options={[
                { value: "mobile", label: "Mobile" },
                { value: "desktop", label: "Desktop" },
                { value: "custom", label: "Custom" },
              ]}
            />
          </Control>

          {view === "custom" && (
            <Control label="Lebar Custom">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="range"
                  min={MIN_WIDTH}
                  max={MAX_WIDTH}
                  step={10}
                  value={customWidth}
                  onChange={(e) => setCustomWidth(clamp(Number(e.target.value)))}
                  aria-label="Geser lebar container"
                  className="h-1.5 w-40 cursor-pointer appearance-none rounded-full bg-border accent-primary-600"
                />
                <label className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5">
                  <input
                    type="number"
                    min={MIN_WIDTH}
                    max={MAX_WIDTH}
                    value={customWidth}
                    onChange={(e) =>
                      setCustomWidth(clamp(Number(e.target.value) || MIN_WIDTH))
                    }
                    aria-label="Lebar container dalam piksel"
                    className="w-16 bg-transparent text-sm font-bold text-gray-900 outline-none"
                  />
                  <span className="text-xs font-bold text-gray-500">px</span>
                </label>
                <span className="text-xs text-gray-500">
                  {MIN_WIDTH}–{MAX_WIDTH}px
                </span>
              </div>
            </Control>
          )}
        </Controls>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Contoh pertama bukan contoh tetap: ia dirakit ulang setiap kali pilihan
          di Playground berubah — saat ini varian <C>{size}</C> ({activeSize.max}
          ) pada {roomLabel}, dengan angka yang diambil dari hasil pengukuran
          preview, bukan ditulis tangan. Tiga pola berikutnya berlaku di semua
          ukuran.
        </Lead>
        <SectionCode flush>
          {"import { Container } from '@tpl/design-kit-react'\n\n"}

          {/* Contoh 1 dirakit dari state playground + angka hasil pengukuran,
              jadi yang dibaca selalu kode untuk preview yang sedang terlihat. */}
          {`{/* 1. ${activeSize.max === "tanpa batas" ? "Tanpa batas lebar" : `Batas ${activeSize.max}`} di ${roomLabel}.\n`}
          {`    Terukur sekarang: ruang ${measured.avail}px · konten ${measured.content}px · padding ${measured.padding}px. */}\n`}
          {"<Container"}
          {size !== "default" && (
            <>
              {" "}
              <Mark>{`size="${size}"`}</Mark>
            </>
          )}
          {view === "custom" && (
            <>
              {' className="'}
              <Mark>{`max-w-[${width}px]`}</Mark>
              {'"'}
            </>
          )}
          {">\n    ...\n</Container>\n\n"}

          {"{/* 2. Tambah jarak vertikal lewat className */}\n"}
          {'<Container className="'}
          <H>py-12 lg:py-16</H>
          {'">\n    ...\n</Container>\n\n'}
          {"{/* 3. Ganti elemen pembungkus & matikan padding\n"}
          {"    (mis. saat section sudah punya padding sendiri) */}\n"}
          {"<Container "}
          <H>as</H>
          {'="section" '}
          <H>padded={"{false}"}</H>
          {">\n    ...\n</Container>\n\n"}
          {"{/* 4. Latar penuh layar: warna di elemen luar,\n"}
          {"    Container di dalam agar isinya tetap sejajar */}\n"}
          {'<section className="bg-surface-subtle">\n'}
          {'    <Container className="py-12">\n        ...\n    </Container>\n'}
          {"</section>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Container merender elemen luar sebagai titik ukur <C>@container</C>,
          lalu elemen dalam yang memegang lebar dan padding. <C>className</C> dan
          atribut HTML menempel di elemen luar.
        </Lead>
        <PropsTable rows={containerProps} minWidth="44rem" />
      </FlowSection>

      {/* <Principles
        items={[
          <>
            Bungkus <strong className="text-gray-900">setiap section</strong>{" "}
            halaman dengan Container agar semua kolom berhenti di garis yang
            sama.
          </>,
          <>
            Pilih satu varian untuk satu halaman dan pakai terus. Berganti-ganti{" "}
            <C>size</C> antar section membuat garis kiri ikut bergeser — persis
            yang ingin dicegah Container.
          </>,
          <>
            Untuk halaman yang isinya teks panjang atau formulir,{" "}
            <C>size=&quot;prose&quot;</C> lebih terbaca daripada bawaan: baris
            berhenti sebelum mata kehilangan awal baris berikutnya.
          </>,
          <>
            Jangan menumpuk Container di dalam Container — paddingnya jadi dobel
            dan konten menyempit tanpa disadari.
          </>,
          <>
            Untuk banner atau hero berwarna penuh, beri warna pada elemen luar
            lalu taruh Container di dalamnya — bukan sebaliknya.
          </>,
          <>
            Jarak vertikal bukan urusan Container; atur lewat <C>py-*</C> saat
            dipakai supaya ritme tiap halaman bisa berbeda.
          </>,
          <>
            Bila induknya sudah punya padding, matikan lewat{" "}
            <C>padded={"{false}"}</C> — jangan menimpanya dengan <C>px-0</C>,
            karena padding hidup di elemen dalam.
          </>,
        ]}
      /> */}
    </UsulanPage>
  );
}
