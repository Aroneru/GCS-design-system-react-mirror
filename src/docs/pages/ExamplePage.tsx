import { useState, type FormEvent } from "react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Container,
  FloatingLabel,
  Footer,
  InputField,
  Radio,
  Select,
  TextArea,
  Toggle,
  type SelectOption,
} from "../../lib";
import { Envelope, Globe, User } from "../../lib/icons/outline";
import { FacebookIcon, InstagramIcon, XIcon } from "../socialIcons";

/**
 * Halaman contoh — satu formulir layanan yang memakai seluruh komponen kit
 * pada tempatnya, bukan sebagai etalase. Isinya sengaja realistis: pendaftaran
 * Penyelenggara Sistem Elektronik dengan aturan validasi yang benar-benar jalan.
 */

const provinsi: SelectOption[] = [
  { value: "dki", label: "DKI Jakarta" },
  { value: "jabar", label: "Jawa Barat" },
  { value: "jateng", label: "Jawa Tengah" },
  { value: "jatim", label: "Jawa Timur" },
  { value: "bali", label: "Bali" },
];

const kategori: SelectOption[] = [
  { value: "marketplace", label: "Perdagangan elektronik" },
  { value: "fintech", label: "Layanan keuangan digital" },
  { value: "media", label: "Media & konten digital" },
  { value: "edu", label: "Pendidikan & pelatihan" },
];

const berkasWajib = [
  { value: "akta", label: "Akta pendirian", caption: "PDF, maksimal 2 MB." },
  { value: "npwp", label: "NPWP badan usaha", caption: "PDF atau JPG, maksimal 2 MB." },
  { value: "domain", label: "Bukti kepemilikan domain", caption: "Tangkapan layar panel domain." },
];

const footerMenus = [
  { label: "Tentang tpl", url: "#" },
  { label: "Layanan", url: "#" },
  { label: "Pengaduan", url: "#" },
  { label: "Kebijakan privasi", url: "#" },
];

const footerSocials = [
  { label: "Instagram", url: "#", icon: InstagramIcon },
  { label: "X", url: "#", icon: XIcon },
  { label: "Facebook", url: "#", icon: FacebookIcon },
];

export function ExamplePage() {
  const [jenis, setJenis] = useState("badan");
  const [nama, setNama] = useState("");
  const [nik, setNik] = useState("");
  const [nikDisentuh, setNikDisentuh] = useState(false);
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");
  const [wilayah, setWilayah] = useState("");
  const [namaSistem, setNamaSistem] = useState("");
  const [domain, setDomain] = useState("");
  const [jenisLayanan, setJenisLayanan] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [berkas, setBerkas] = useState<string[]>(["akta"]);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifWa, setNotifWa] = useState(false);
  const [setuju, setSetuju] = useState(false);
  const [terkirim, setTerkirim] = useState(false);

  // NIK baru dinilai setelah pengguna meninggalkan kolomnya, supaya tak memerahi
  // orang yang baru mengetik digit pertama.
  const nikSalah = nikDisentuh && nik.length !== 16;

  const toggleBerkas = (value: string) =>
    setBerkas((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );

  const kirim = (event: FormEvent) => {
    event.preventDefault();
    setTerkirim(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* ══ Kepala halaman ══ */}
      <header className="border-b border-border bg-surface">
        <Container className="py-8 sm:py-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="brand">Layanan digital</Badge>
                <Badge variant="warning">Draf tersimpan</Badge>
              </div>
              <h1 className="mt-3 text-heading-2 font-black text-gray-900">
                Pendaftaran Penyelenggara Sistem Elektronik
              </h1>
              <p className="mt-2 text-body-sm leading-6 text-gray-500">
                Lengkapi data pemohon dan sistem elektronik yang didaftarkan. Permohonan
                diverifikasi paling lama 5 hari kerja setelah seluruh berkas diterima.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button variant="filled" as="a" href="#/form">
                Panduan
              </Button>
              <Button variant="outline">Simpan draf</Button>
            </div>
          </div>
        </Container>
      </header>

      {/* ══ Isi ══ */}
      <Container className="flex-1 py-8 sm:py-10">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <form className="space-y-6" onSubmit={kirim}>
            {/* ── 1. Pemohon ── */}
            <Card
              title="1. Data pemohon"
              description="Isi sesuai dokumen resmi yang masih berlaku."
            >
              <fieldset className="mt-1">
                <legend className="mb-3 text-sm font-bold text-gray-900">Jenis pemohon</legend>
                <div className="flex flex-wrap gap-8">
                  <Radio
                    name="jenis-pemohon"
                    label="Badan usaha"
                    helperText="PT, CV, yayasan, atau koperasi."
                    checked={jenis === "badan"}
                    onChange={() => setJenis("badan")}
                  />
                  <Radio
                    name="jenis-pemohon"
                    label="Perorangan"
                    helperText="Atas nama pribadi, bukan entitas."
                    checked={jenis === "perorangan"}
                    onChange={() => setJenis("perorangan")}
                  />
                </div>
              </fieldset>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <InputField
                  label="Nama lengkap"
                  placeholder="Sesuai KTP"
                  icon={<User className="size-4" />}
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  onClear={nama ? () => setNama("") : undefined}
                />

                <InputField
                  label="NIK"
                  placeholder="16 digit tanpa spasi"
                  inputMode="numeric"
                  maxLength={16}
                  state={nikSalah ? "failed" : "default"}
                  helperText={
                    nikSalah ? "NIK harus tepat 16 digit." : "Dipakai untuk verifikasi Dukcapil."
                  }
                  value={nik}
                  onChange={(e) => setNik(e.target.value.replace(/\D/g, ""))}
                  onBlur={() => setNikDisentuh(true)}
                />

                <InputField
                  label="Email"
                  type="email"
                  placeholder="nama@instansi.go.id"
                  icon={<Envelope className="size-4" />}
                  helperText="Seluruh pemberitahuan dikirim ke alamat ini."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <FloatingLabel
                  label="Nomor telepon"
                  placeholder="08xxxxxxxxxx"
                  inputMode="tel"
                  helperText="Aktif di WhatsApp bila ingin menerima pembaruan status."
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                />

                <div className="sm:col-span-2 sm:max-w-xs">
                  <Select
                    label="Provinsi"
                    info="Wilayah kedudukan pemohon sesuai dokumen."
                    placeholder="Pilih provinsi"
                    options={provinsi}
                    value={wilayah}
                    onChange={(e) => setWilayah(e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {/* ── 2. Sistem elektronik ── */}
            <Card
              title="2. Sistem elektronik"
              description="Satu permohonan berlaku untuk satu sistem. Daftarkan terpisah bila punya lebih dari satu."
            >
              <div className="mt-1 grid gap-5 sm:grid-cols-2">
                <InputField
                  label="Nama sistem"
                  placeholder="Nama layanan yang dikenal publik"
                  value={namaSistem}
                  onChange={(e) => setNamaSistem(e.target.value)}
                />

                <FloatingLabel
                  label="Domain utama"
                  placeholder="contoh.co.id"
                  icon={<Globe className="size-4" />}
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />

                <div className="sm:col-span-2 sm:max-w-sm">
                  <Select
                    label="Kategori layanan"
                    placeholder="Pilih kategori"
                    options={kategori}
                    helperText="Menentukan tingkat pengawasan yang berlaku."
                    value={jenisLayanan}
                    onChange={(e) => setJenisLayanan(e.target.value)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <TextArea
                    label="Deskripsi layanan"
                    hint={`${deskripsi.length}/500`}
                    placeholder="Jelaskan fungsi utama sistem, siapa penggunanya, dan data apa saja yang diproses…"
                    helperText="Ditampilkan pada tanda daftar yang terbit."
                    maxLength={500}
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {/* ── 3. Berkas & persetujuan ── */}
            <Card title="3. Kelengkapan & persetujuan">
              <fieldset className="mt-1">
                <legend className="mb-3 text-sm font-bold text-gray-900">
                  Berkas yang dilampirkan
                </legend>
                <div className="space-y-4">
                  {berkasWajib.map((b) => (
                    <Checkbox
                      key={b.value}
                      label={b.label}
                      helperText={b.caption}
                      checked={berkas.includes(b.value)}
                      onChange={() => toggleBerkas(b.value)}
                    />
                  ))}
                </div>
              </fieldset>

              <div className="mt-6 space-y-4 border-t border-border pt-6">
                <Toggle
                  label="Pemberitahuan email"
                  helperText="Ringkasan status permohonan setiap ada perubahan."
                  checked={notifEmail}
                  onChange={(e) => setNotifEmail(e.target.checked)}
                />
                <Toggle
                  label="Pembaruan via WhatsApp"
                  helperText={
                    telepon
                      ? "Dikirim ke nomor yang Anda isi di atas."
                      : "Isi nomor telepon dulu untuk mengaktifkan."
                  }
                  state={telepon ? "default" : "inactive"}
                  checked={notifWa}
                  onChange={(e) => setNotifWa(e.target.checked)}
                />
              </div>

              <div className="mt-6 border-t border-border pt-6">
                <Checkbox
                  label="Saya menyatakan data yang diisi benar"
                  helperText="Pernyataan palsu dapat berakibat pencabutan tanda daftar."
                  checked={setuju}
                  onChange={(e) => setSetuju(e.target.checked)}
                />
              </div>
            </Card>

            {/* ── Aksi ── */}
            {terkirim ? (
              <div className="flex flex-col gap-3 rounded-lg border border-green-200 bg-green-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Terkirim</Badge>
                    <p className="text-sm font-bold text-gray-900">Permohonan diterima</p>
                  </div>
                  <p className="mt-1 text-body-sm text-gray-600">
                    Nomor tiket <strong className="font-bold text-gray-900">PSE-2026-0481</strong> —
                    pantau statusnya lewat email.
                  </p>
                </div>
                <Button variant="filled" onClick={() => setTerkirim(false)}>
                  Ajukan permohonan lain
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" disabled={!setuju}>
                  Kirim permohonan
                </Button>
                <Button variant="filled">Simpan sebagai draf</Button>
                <Button variant="outline">Batal</Button>
                {!setuju && (
                  <p className="text-body-sm text-gray-500">
                    Centang pernyataan kebenaran data untuk mengirim.
                  </p>
                )}
              </div>
            )}
          </form>

          {/* ── Panel samping ── */}
          <aside className="space-y-5 lg:sticky lg:top-6">
            <Card title="Status permohonan">
              <dl className="mt-1 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-gray-500">Tahap</dt>
                  <dd>
                    <Badge variant={terkirim ? "success" : "gray"}>
                      {terkirim ? "Menunggu verifikasi" : "Draf"}
                    </Badge>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-gray-500">Berkas</dt>
                  <dd className="font-bold text-gray-900">
                    {berkas.length} dari {berkasWajib.length}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-gray-500">Pemohon</dt>
                  <dd className="font-bold text-gray-900">
                    {jenis === "badan" ? "Badan usaha" : "Perorangan"}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 border-t border-border pt-4">
                <Button variant="filled" className="w-full">
                  Hapus draf
                </Button>
              </div>
            </Card>

            <Card
              title="Panduan pendaftaran"
              description="Syarat, alur verifikasi, dan contoh pengisian untuk tiap jenis pemohon."
              href="#/form"
              linkLabel="Buka panduan"
            />

            <Card
              title="Butuh bantuan?"
              description="Layanan pengaduan siap membantu pada hari kerja, pukul 08.00–16.00 WIB."
              actions={
                <Button variant="outline" as="a" href="#/">
                  Hubungi kami
                </Button>
              }
            />
          </aside>
        </div>
      </Container>

      <Footer
        logo="/images/komdigi-logo.svg"
        logoAlt="tpl — Kementerian Komunikasi dan Digital"
        menus={footerMenus}
        copyright="© 2026 Kementerian Komunikasi dan Digital"
        socials={footerSocials}
      />
    </div>
  );
}
