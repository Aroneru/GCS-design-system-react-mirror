import { useState, type ReactNode } from "react";
import { Button, Card } from "../../../lib";
import { PropsTable, type PropRow } from "../../PropsTable";
import { C, Demo, Mark, Segmented } from "../../pageKit";
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
 * Susunan halaman: varian dulu sebagai gambaran utuh, lalu bagian per properti,
 * lalu lebar kartu, playground, dan tabel lengkap — dengan daftar isi menempel
 * di kanan.
 *
 * Seluruh prop Card memang dapat bagiannya sendiri di sini, bukan karena tiap
 * prop otomatis layak, tapi karena propnya cuma tujuh dan sudah berpasangan
 * sendiri: gambar, teks, tautan, aksi.
 */

const cardTitle = "Komdigi Card Desktop";
const cardDesc =
  "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.";

type CardAction = "two" | "one" | "link" | "none";

const actionChoices: { value: CardAction; label: string }[] = [
  { value: "two", label: "Dua tombol" },
  { value: "one", label: "Satu tombol" },
  { value: "link", label: "Tautan" },
  { value: "none", label: "Tanpa aksi" },
];

const cardProps: PropRow[] = [
  [
    "image",
    "string | undefined",
    "undefined",
    "URL gambar. Dikosongkan untuk varian tanpa gambar.",
  ],
  ["imageAlt", "string", "''", "Teks alternatif gambar."],
  ["title", "ReactNode", "undefined", "Judul kartu."],
  ["description", "ReactNode", "undefined", "Deskripsi singkat."],
  [
    "href",
    "string | undefined",
    "undefined",
    "Mengaktifkan varian tautan bila diisi.",
  ],
  [
    "linkLabel",
    "string | undefined",
    "Selengkapnya",
    "Teks tautan, dipakai bersama href.",
  ],
  ["actions", "ReactNode", "—", "Slot untuk satu atau beberapa tombol."],
];

const toc: TocEntry[] = [
  { id: "varian", label: "Varian" },
  { id: "image", label: "image · imageAlt" },
  { id: "title", label: "title · description" },
  { id: "href", label: "href · linkLabel" },
  { id: "actions", label: "actions" },
  { id: "lebar", label: "Lebar kartu" },
  // Playground di urutan belakang: tiap prop dan penjelasannya dibaca dulu,
  // baru pembaca menggabungkannya sendiri.
  { id: "playground", label: "Playground" },
  { id: "penggunaan", label: "Penggunaan" },
  { id: "properties", label: "Properties" },
];

const SampleButton = ({ variant }: { variant: "primary" | "secondary" }) => {
  if (variant === "primary") {
    return (
      <Button variant="filled" theme="primary" tone="light" size="s">
        Button text
      </Button>
    );
  }

  return (
    <Button variant="filled" theme="primary" tone="light" size="s">
      Button text
    </Button>
  );
};

function cardActions(action: CardAction): ReactNode {
  if (action === "two")
    return (
      <>
        <SampleButton variant="secondary" />
        <SampleButton variant="primary" />
      </>
    );
  if (action === "one") return <SampleButton variant="primary" />;
  return undefined;
}

/** Kolom sempit supaya kartu tidak melar memenuhi lebar halaman. */
function Column({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-[384px]">{children}</div>;
}

export function CardPage() {
  const [view, setView] = useState<"mobile" | "desktop">("desktop");
  const [hasImage, setHasImage] = useState(true);
  const [action, setAction] = useState<CardAction>("two");

  // Turunan untuk cuplikan kode di bagian Penggunaan — satu sumber dengan Playground.
  const widthClass = view === "mobile" ? "max-w-[238px]" : "max-w-[384px]";
  const withButton = action === "two" || action === "one";
  const summary = [
    view === "mobile" ? "Mobile 238px" : "Desktop 384px",
    hasImage ? "dengan gambar" : "tanpa gambar",
    actionChoices.find((a) => a.value === action)?.label.toLowerCase(),
  ].join(" · ");

  return (
    <UsulanPage
      eyebrow="Components"
      title="Card"
      description="Wadah ringkas untuk menampilkan satu unit informasi: gambar, judul, deskripsi, dan aksi. Setiap bagian bersifat opsional, sehingga seluruh varian pada desain terbentuk dari komponen yang sama."
      toc={toc}
    >
      <FlowSection id="varian" title="Varian">
        <Lead>
          Keempatnya komponen yang sama — tidak ada prop varian sama sekali. Yang
          membedakan hanya bagian mana yang diisi: lepas <C>image</C> untuk kartu
          tanpa gambar, lepas <C>actions</C> untuk kartu tanpa tombol, isi{" "}
          <C>href</C> untuk mengganti tombol dengan satu tautan. Bagian yang
          tidak diisi tidak dirender, bukan disembunyikan lewat CSS.
        </Lead>

        <div className="grid gap-5 sm:grid-cols-2">
          <Demo label="Default">
            <Card
              image={asset("/images/card-sample.svg")}
              imageAlt=""
              title={cardTitle}
              description={cardDesc}
              actions={<SampleButton variant="primary" />}
            />
          </Demo>

          <Demo label="Tanpa gambar">
            <Card
              title={cardTitle}
              description={cardDesc}
              actions={<SampleButton variant="primary" />}
            />
          </Demo>

          <Demo label="Tanpa tombol">
            <Card
              image={asset("/images/card-sample.svg")}
              imageAlt=""
              title={cardTitle}
              description={cardDesc}
            />
          </Demo>

          <Demo label="Dengan tautan">
            <Card
              image={asset("/images/card-sample.svg")}
              imageAlt=""
              title={cardTitle}
              description={cardDesc}
              href="#"
              linkLabel="See our guideline"
            />
          </Demo>
        </div>

        <SectionCode>
          {"import { Card } from '@tpl/design-kit-react'\n\n"}
          {'<Card image="…" title="…" description="…" actions={<Button … />} />\n'}
          {'<Card             title="…" description="…" actions={<Button … />} />\n'}
          {'<Card image="…" title="…" description="…" />\n'}
          {'<Card image="…" title="…" description="…" href="/panduan" />'}
        </SectionCode>
      </FlowSection>

      <FlowSection id="image" title="image · imageAlt">
        <Lead>
          <C>image</C> berisi URL gambar yang mengisi bagian atas kartu; rasionya
          mengikuti lebar kartu — 16:9 di kolom lebar, 5:4 di bawah 320px.{" "}
          <C>imageAlt</C> jadi teks alternatifnya, dan boleh string kosong bila
          gambarnya murni dekoratif. Tanpa <C>image</C>, kartu langsung dimulai
          dari judul.
        </Lead>
        <div className="grid gap-5 sm:grid-cols-2">
          <Demo label="Dengan gambar">
            <Card
              image={asset("/images/card-sample.svg")}
              imageAlt="Suasana kerja tim"
              title={cardTitle}
              description={cardDesc}
            />
          </Demo>
          <Demo label="Tanpa gambar">
            <Card title={cardTitle} description={cardDesc} />
          </Demo>
        </div>
        <SectionCode>
          {"<Card\n"}
          {"    "}
          <Mark>image</Mark>
          {'="/images/card-sample.svg"\n'}
          {"    "}
          <Mark>imageAlt</Mark>
          {'="Suasana kerja tim"\n'}
          {"/>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="title" title="title · description">
        <Lead>
          Dua-duanya <C>ReactNode</C>, jadi boleh disisipi elemen. Ukuran judul
          mengikuti lebar kartu: 20px di kolom lebar, turun ke 16px di kolom
          sempit. Deskripsi bersifat opsional — kartu dengan judul saja tetap
          rapi karena jaraknya diatur per bagian, bukan lewat margin tetap.
        </Lead>
        <Demo>
          <Column>
            <Card
              image={asset("/images/card-sample.svg")}
              imageAlt=""
              title={cardTitle}
              description={cardDesc}
            />
          </Column>
        </Demo>
        <SectionCode>
          {"<Card\n"}
          {"    "}
          <Mark>title</Mark>
          {'="Komdigi Card Desktop"\n'}
          {"    "}
          <Mark>description</Mark>
          {'="Here are the biggest enterprise technology acquisitions of 2021."\n'}
          {"/>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="href" title="href · linkLabel">
        <Lead>
          Mengisi <C>href</C> mengubah bagian bawah kartu jadi satu tautan, bukan
          deretan tombol. <C>linkLabel</C> menentukan teksnya dan berlaku hanya
          bersama <C>href</C>; bila dikosongkan, teksnya jatuh ke bawaan{" "}
          <C>Selengkapnya</C>.
        </Lead>
        <Demo>
          <Column>
            <Card
              image={asset("/images/card-sample.svg")}
              imageAlt=""
              title={cardTitle}
              description={cardDesc}
              href="#"
              linkLabel="See our guideline"
            />
          </Column>
        </Demo>
        <SectionCode>
          {"<Card\n"}
          {"    "}
          <Mark>href</Mark>
          {'="/panduan"\n'}
          {"    "}
          <Mark>linkLabel</Mark>
          {'="See our guideline"\n'}
          {"/>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="actions" title="actions">
        <Lead>
          Slot bebas di bagian bawah kartu — isi satu tombol, dua tombol, atau
          elemen lain. Card tidak mengatur ukuran maupun varian tombolnya, jadi
          keputusan itu tetap di tangan halaman yang memakainya. Bila kosong,
          bagian bawah kartu ditiadakan.
        </Lead>
        <div className="grid gap-5 sm:grid-cols-2">
          <Demo label="Satu tombol">
            <Card
              image={asset("/images/card-sample.svg")}
              imageAlt=""
              title={cardTitle}
              description={cardDesc}
              actions={<SampleButton variant="primary" />}
            />
          </Demo>
          <Demo label="Dua tombol">
            <Card
              image={asset("/images/card-sample.svg")}
              imageAlt=""
              title={cardTitle}
              description={cardDesc}
              actions={cardActions("two")}
            />
          </Demo>
        </div>
        <SectionCode>
          {"import { Card, Button } from '@tpl/design-kit-react'\n\n"}
          {"<Card\n"}
          {"    "}
          <Mark>actions</Mark>
          {"={\n"}
          {"        <>\n"}
          {'            <Button variant="filled" size="s">Button text</Button>\n'}
          {'            <Button variant="filled" size="s">Button text</Button>\n'}
          {"        </>\n"}
          {"    }\n"}
          {"/>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="lebar" title="Lebar kartu">
        <Lead>
          Card sengaja tidak punya prop ukuran dan tidak diberi lebar bawaan —
          lebarnya urusan tata letak. Empat kartu di bawah ini ditulis dengan
          props yang sama persis; yang berbeda hanya lebar kolomnya, dan kartu
          menyesuaikan diri lewat <em>container query</em>: di bawah 320px
          gambarnya jadi 5:4, padding menyusut ke 16px, judul turun ke 16px; di
          atasnya gambar 16:9, padding 24px, judul 20px.
        </Lead>

        <div className="rounded-2xl border border-border bg-surface-subtle p-5 sm:p-8">
          <div className="flex flex-wrap items-start justify-center gap-5">
            {[240, 300, 384, 520].map((w) => (
              <div key={w} style={{ width: `${w}px` }} className="max-w-full">
                <p className="mb-2 text-xs font-bold text-primary-700">
                  kolom {w}px
                </p>
                <Card
                  image={asset("/images/card-sample.svg")}
                  imageAlt=""
                  title={cardTitle}
                  description={cardDesc}
                  actions={<SampleButton variant="primary" />}
                />
              </div>
            ))}
          </div>
        </div>

        <p className="mt-3 text-body-sm text-gray-500">
          Di halaman formulir kartu perlu selebar kolomnya (lihat halaman{" "}
          <em>Example</em>), sementara di daftar ringkas ia perlu menyempit
          mengikuti grid. Menentukan lebar adalah tugas tata letak, bukan tugas
          kartu.
        </p>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Menggabungkan prop-prop di atas dalam satu tampilan. Ganti kontrolnya,
          dan bagian Penggunaan menuliskan kodenya. Kontrol <em>Lebar kolom</em>{" "}
          tidak mengirim prop apa pun ke kartu — yang berubah lebar pembungkusnya
          saja.
        </Lead>

        <Stage maxWidth={view === "mobile" ? "max-w-[238px]" : "max-w-[384px]"}>
          <Card
            image={hasImage ? asset("/images/card-sample.svg") : undefined}
            imageAlt="Suasana kerja tim"
            title={cardTitle}
            description={cardDesc}
            href={action === "link" ? "#" : undefined}
            linkLabel={action === "link" ? "See our guideline" : undefined}
            actions={cardActions(action)}
          />
        </Stage>

        <Controls>
          <Control label="Lebar kolom">
            <Segmented
              label="Pilih lebar kolom"
              value={view}
              onChange={setView}
              options={[
                { value: "mobile", label: "Mobile" },
                { value: "desktop", label: "Desktop" },
              ]}
            />
          </Control>

          <Control label="Gambar">
            <Segmented
              label="Tampilkan gambar"
              value={hasImage}
              onChange={setHasImage}
              options={adaTidakAda}
            />
          </Control>

          <Control label="Aksi">
            <Segmented
              label="Pilih jenis aksi"
              value={action}
              onChange={setAction}
              options={actionChoices}
              itemClassName="px-2.5"
              wrap
            />
          </Control>
        </Controls>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Mengikuti kontrol di Playground — nama prop yang sedang dikendalikan
          ditandai dengan warna biru. Tombol <em>Salin</em> selalu menyalin
          persis yang sedang tampil.
        </Lead>
        <SectionCode flush>
          {"import { Card"}
          {withButton && ", Button"}
          {" } from '@tpl/design-kit-react'\n\n"}
          {`{/* ${summary} */}\n`}
          {"{/* Kartu tidak punya prop ukuran — lebarnya mengikuti kolom\n"}
          {"    tempatnya berada. Yang berubah cuma kolomnya. */}\n"}
          {'<div className="'}
          <Mark>{widthClass}</Mark>
          {'">\n'}
          {"    <Card\n"}
          {hasImage && (
            <>
              {"        "}
              <Mark>image</Mark>
              {'="/images/card-sample.svg"\n'}
              {"        "}
              <Mark>imageAlt</Mark>
              {'="Suasana kerja tim"\n'}
            </>
          )}
          {'        title="Komdigi Card Desktop"\n'}
          {'        description="Here are the biggest enterprise technology acquisitions of 2021."\n'}
          {action === "link" && (
            <>
              {"        "}
              <Mark>href</Mark>
              {'="/panduan"\n'}
              {"        "}
              <Mark>linkLabel</Mark>
              {'="See our guideline"\n'}
            </>
          )}
          {action === "two" && (
            <>
              {"        "}
              <Mark>actions</Mark>
              {"={\n"}
              {"            <>\n"}
              {'                <Button variant="filled" size="s">Button text</Button>\n'}
              {'                <Button variant="filled" size="s">Button text</Button>\n'}
              {"            </>\n"}
              {"        }\n"}
            </>
          )}
          {action === "one" && (
            <>
              {"        "}
              <Mark>actions</Mark>
              {'={<Button variant="filled" size="s">Button text</Button>}\n'}
            </>
          )}
          {"    />\n"}
          {"</div>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Rangkuman seluruh prop. Semuanya opsional — bagian yang tidak diisi
          tidak dirender, bukan disembunyikan lewat CSS.
        </Lead>
        <PropsTable rows={cardProps} />
      </FlowSection>
    </UsulanPage>
  );
}
