import { Badge, Button, Card, Container, Footer } from "../../lib";
import { FacebookIcon, InstagramIcon, XIcon } from "../socialIcons";

const summaryCards = [
  {
    name: "Foundations",
    desc: "Warna, tipografi, spacing, border, elevation, dan ikon — dasar visual seluruh produk.",
    route: "/foundations",
  },
  {
    name: "Components",
    desc: "Komponen React siap pakai dari @tpl/design-kit-react.",
    route: "/components",
  },
];

export function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary-50 to-white px-5 py-16 sm:px-8 lg:px-12 lg:py-24 xl:px-14">
        <Container className="px-0 sm:px-0 lg:px-0 xl:px-0">
          <h1 className="mt-5 max-w-3xl text-[clamp(2.25rem,6vw,3.75rem)] leading-[1.05] font-black tracking-tight text-gray-900">
            State Security Service Design System
          </h1>
          <p className="mt-5 max-w-2xl text-body-lg text-gray-600">
            Satu sumber visual dan komponen yang konsisten untuk membangun layanan digital yang
            jelas, inklusif, dan mudah dikenali.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as="a" href="#/foundations" variant="filled">
              Lihat Foundations
            </Button>
            <Button as="a" href="#/components" variant="outline">
              Jelajahi Components
            </Button>
          </div>
        </Container>
      </section>

      <Container className="py-12 lg:py-16">
        <div className="grid gap-5 sm:grid-cols-2">
          {summaryCards.map((c) => (
            <Card
              key={c.name}
              title={c.name}
              description={c.desc}
              href={`#${c.route}`}
              linkLabel="Buka"
              className="transition-shadow hover:shadow-md"
            />
          ))}
        </div>

        <div className="mt-12 overflow-hidden rounded-lg border border-border shadow-soft">
          <div className="flex items-center justify-between border-b border-white/10 bg-gray-900 px-5 py-3">
            <span className="text-xs font-bold text-gray-300">Mulai cepat</span>
            <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
              React + @tpl/design-kit-react
            </span>
          </div>
          <pre className="overflow-x-auto bg-gray-900 p-5 text-sm leading-7 text-gray-300">
            <code>
              {`import { Button, Badge } from '@tpl/design-kit-react'\n\n`}
              {`<Button variant="`}
              <span className="text-primary-300">primary</span>
              {`">Simpan</Button>\n`}
              {`<Badge variant="`}
              <span className="text-green-300">success</span>
              {`">Aktif</Badge>`}
            </code>
          </pre>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <Badge variant="brand">React</Badge>
          <Badge variant="success">v0.1.0</Badge>
          <Badge variant="gray">Tailwind v4</Badge>
        </div>
      </Container>

      <Footer
        logo="/images/komdigi-logo.svg"
        logoAlt="Komdigi — Kementerian Komunikasi dan Digital"
        menus={[
          { label: "Foundations", url: "#/foundations" },
          { label: "Components", url: "#/components" },
          { label: "Card", url: "#/components/card" },
          { label: "Footer", url: "#/components/footer" },
        ]}
        copyright="© 2025 Kementerian Komunikasi dan Digital"
        socials={[
          { label: "Instagram", url: "#", icon: InstagramIcon },
          { label: "X", url: "#", icon: XIcon },
          { label: "Facebook", url: "#", icon: FacebookIcon },
        ]}
      />
    </>
  );
}
