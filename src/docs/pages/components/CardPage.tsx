import { useState, type ReactNode } from "react";
import { Button, Card } from "../../../lib";
import { PropsTable, type PropRow } from "../../PropsTable";
import { CodeBlock, ComponentPage, ControlLabel, H, Section, Segmented } from "../../pageKit";

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
  ["href", "string | undefined", "undefined", "Mengaktifkan varian tautan bila diisi."],
  ["linkLabel", "string | undefined", "Selengkapnya", "Teks tautan, dipakai bersama href."],
  ["actions", "ReactNode", "—", "Slot untuk satu atau beberapa tombol."],
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

export function CardPage() {
  const [view, setView] = useState<"mobile" | "desktop">("desktop");
  const [hasImage, setHasImage] = useState(true);
  const [action, setAction] = useState<CardAction>("two");

  return (
    <ComponentPage
      title="Card"
      description="Wadah ringkas untuk menampilkan satu unit informasi: gambar, judul, deskripsi, dan aksi. Setiap bagian bersifat opsional, sehingga seluruh varian pada desain terbentuk dari komponen yang sama."
    >
      <section>
        <h2 className="mb-4 text-heading-3 font-black text-gray-900">Playground</h2>

        <div className="grid place-items-center rounded-2xl border border-border bg-surface-subtle p-6 sm:p-10">
          <div
            className={`w-full transition-[max-width] duration-300 ease-out ${
              view === "mobile" ? "max-w-[238px]" : "max-w-[384px]"
            }`}
          >
            <Card
              image={hasImage ? "/images/card-sample.svg" : undefined}
              imageAlt="Suasana kerja tim"
              title={cardTitle}
              description={cardDesc}
              href={action === "link" ? "#" : undefined}
              linkLabel={action === "link" ? "See our guideline" : undefined}
              actions={cardActions(action)}
            />
          </div>
        </div>

        {/* Kontrol */}
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <ControlLabel>Lebar</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Pilih lebar kartu"
                value={view}
                onChange={setView}
                options={[
                  { value: "mobile", label: "Mobile" },
                  { value: "desktop", label: "Desktop" },
                ]}
              />
            </div>
          </div>

          <div>
            <ControlLabel>Gambar</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Tampilkan gambar"
                value={hasImage}
                onChange={setHasImage}
                options={[
                  { value: true, label: "Ada" },
                  { value: false, label: "Tanpa" },
                ]}
              />
            </div>
          </div>

          <div>
            <ControlLabel>Aksi</ControlLabel>
            <div className="mt-2">
              <Segmented
                label="Pilih jenis aksi"
                value={action}
                onChange={setAction}
                options={actionChoices}
                itemClassName="px-2.5"
                wrap
              />
            </div>
          </div>
        </div>

        <p className="mt-4 text-body-sm text-gray-500">
          Ukuran judul dan jarak dalam kartu memakai <em>container query</em>, sehingga menyesuaikan
          lebar kartu itu sendiri — bukan lebar layar. Kartu yang sama otomatis tampil ringkas di
          kolom sempit.
        </p>
      </section>

      <Section title="Varian">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-black text-gray-900">Default</p>
            <Card
              image="/images/card-sample.svg"
              imageAlt=""
              title={cardTitle}
              description={cardDesc}
              actions={<SampleButton variant="primary" />}
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-black text-gray-900">Tanpa gambar</p>
            <Card
              title={cardTitle}
              description={cardDesc}
              actions={<SampleButton variant="primary" />}
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-black text-gray-900">Tanpa tombol</p>
            <Card
              image="/images/card-sample.svg"
              imageAlt=""
              title={cardTitle}
              description={cardDesc}
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-black text-gray-900">Dengan tautan</p>
            <Card
              image="/images/card-sample.svg"
              imageAlt=""
              title={cardTitle}
              description={cardDesc}
              href="#"
              linkLabel="See our guideline"
            />
          </div>
        </div>
      </Section>

      <Section title="Penggunaan">
        <CodeBlock>
          {"{/* Default: gambar + judul + deskripsi + tombol */}\n"}
          {"<Card\n"}
          {'    image="/images/artikel.jpg"\n'}
          {'    imageAlt="Suasana kerja tim"\n'}
          {'    title="Komdigi Card Desktop"\n'}
          {'    description="Here are the biggest enterprise technology acquisitions of 2021."\n'}
          {"    "}
          <H>actions</H>
          {"={\n"}
          {"        <>\n"}
          {'            <Button variant="secondary">Button text</Button>\n'}
          {'            <Button variant="primary">Button text</Button>\n'}
          {"        </>\n"}
          {"    }\n"}
          {"/>\n\n"}
          {"{/* Tanpa gambar: cukup hilangkan image */}\n"}
          {'<Card title="..." description="..." />\n\n'}
          {"{/* Dengan tautan: isi href + linkLabel */}\n"}
          {"<Card\n"}
          {'    title="..."\n'}
          {'    description="..."\n'}
          {"    "}
          <H>href</H>
          {'="/panduan"\n'}
          {"    "}
          <H>linkLabel</H>
          {'="See our guideline"\n'}
          {"/>"}
        </CodeBlock>
      </Section>

      <Section title="Properties">
        <PropsTable rows={cardProps} />
      </Section>
    </ComponentPage>
  );
}
