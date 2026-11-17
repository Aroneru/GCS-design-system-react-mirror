import { useState } from "react";
import { Pagination, type PaginationTheme } from "../../../lib";
import {
  tocForDarkDocs,
  useDarkModeSnippet,
  useDocsDark,
  usePlaygroundDark,
} from "../../docsTheme";
import { PropsTable, type PropRow } from "../../PropsTable";
import { Demo, H, Hl, Segmented } from "../../pageKit";
import {
  Control,
  Controls,
  FlowSection,
  Lead,
  ModeSection,
  SectionCode,
  Stage,
  UsulanPage,
  type TocEntry,
} from "../../usulanKit";

const themeOptions: { value: PaginationTheme; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "primary", label: "Primary" },
  { value: "purple", label: "Purple" },
];

const totalPageOptions = [25, 50, 75, 100].map((value) => ({
  value,
  label: String(value),
}));

const paginationProps: PropRow[] = [
  ["currentPage", "number", "—", "Menentukan halaman yang sedang aktif."],
  ["totalPages", "number", "—", "Menentukan jumlah halaman yang tersedia."],
  [
    "onPageChange",
    "(page: number) => void",
    "—",
    "Callback yang dijalankan ketika pengguna berpindah halaman.",
  ],
  ["theme", '"default" | "primary" | "purple"', "primary", "Menentukan warna pagination."],
  ["size", '"base" | "s" | "responsive"', "base", "Ukuran kotak: 40px atau 32px. `responsive` memakai 32px lalu 40px saat container induk ≥ 512px; butuh induk ber-`@container`, seperti di Table."],
  ["darkMode", "boolean", "false", "Menentukan apakah pagination dirender dalam mode gelap."],
];

const toc: TocEntry[] = [
  // { id: "pagination", label: "Pagination" },
  { id: "states", label: "States" },
  { id: "themes", label: "Themes" },
  { id: "dark-mode", label: "Dark mode" },
  { id: "playground", label: "Playground" },
  { id: "penggunaan", label: "Penggunaan" },
  { id: "properties", label: "Properties" },
];

const tocDark = tocForDarkDocs(toc, true);

export function PaginationPage() {
  const docsDark = useDocsDark();
  const dm = useDarkModeSnippet();
  const [currentPage, setCurrentPage] = useState(1);
  const [theme, setTheme] = useState<PaginationTheme>("primary");
  const [totalPages, setTotalPages] = useState(100);
  const [dark, setDark] = usePlaygroundDark();
  return (
    <UsulanPage
      eyebrow="Components · Pagination"
      title="Pagination"
      description="Navigasi untuk berpindah antar halaman pada data atau konten yang terbagi ke dalam beberapa halaman."
      toc={docsDark ? tocDark : toc}
    >
      <FlowSection id="states" title="States">
        <Lead>
          Pagination memiliki state aktif untuk menunjukkan halaman yang sedang dipilih. Tombol
          halaman lainnya dapat digunakan untuk berpindah ke halaman yang berbeda.
        </Lead>

        <div className="mb-4 grid gap-5 sm:grid-cols-2">
          <Demo label="First Page">
            <Pagination darkMode={docsDark} currentPage={1} totalPages={100} onPageChange={() => {}} theme="primary" />
          </Demo>

          <Demo label="Active Page">
            <Pagination darkMode={docsDark} currentPage={2} totalPages={100} onPageChange={() => {}} theme="primary" />
          </Demo>
        </div>

        <SectionCode>
          {"const [currentPage, setCurrentPage] = useState(2)\n"}
          {"\n"}
          {"<Pagination\n"}
          {"    "}
          <H>currentPage</H>
          {"={currentPage}\n"}
          {"    totalPages={100}\n"}
          {"    onPageChange={setCurrentPage}\n"}
          {dm.line}
          {"/>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="themes" title="Themes">
        <Lead>
          Theme digunakan untuk menyesuaikan warna halaman aktif pada Pagination sesuai dengan
          konteks visual aplikasi.
        </Lead>

        <div className="mb-4 flex flex-col gap-6">
          <Demo>
            <div>
              <Pagination
                currentPage={1}
                totalPages={100}
                onPageChange={() => {}}
                theme="default"
                darkMode={docsDark}
              />

              <p className="mt-2 mb-5 text-sm text-gray-600 dark:text-gray-300">
                <Hl>Default</Hl> menggunakan gray sebagai warna utama pagination.
              </p>
            </div>
            <div>
              <Pagination
                currentPage={1}
                totalPages={100}
                onPageChange={() => {}}
                theme="primary"
                darkMode={docsDark}
              />

              <p className="mt-2 mb-5 text-sm text-gray-600 dark:text-gray-300">
                <Hl>Primary</Hl> digunakan sebagai warna utama lain pagination.
              </p>
            </div>

            <div>
              <Pagination darkMode={docsDark} currentPage={1} totalPages={100} onPageChange={() => {}} theme="purple" />

              <p className="mt-2 mb-5 text-sm text-gray-600 dark:text-gray-300">
                <Hl>Purple</Hl> digunakan ketika pagination membutuhkan aksen ungu.
              </p>
            </div>
          </Demo>
        </div>

        <SectionCode>
          {"const [currentPage, setCurrentPage] = useState(1)\n"}
          {"\n"}
          {"<Pagination\n"}
          {"    currentPage={currentPage}\n"}
          {"    totalPages={100}\n"}
          {"    onPageChange={setCurrentPage}\n"}
          {"    "}
          <H>theme</H>
          {'="primary"\n'}
          {dm.line}
          {"/>"}
        </SectionCode>
      </FlowSection>

      <ModeSection
        name="Pagination"
        stayDark
        lead={
          <>
            Prop <H>darkMode</H> dapat digunakan untuk mengaktifkan warna gelap secara manual pada Pagination. Komponen secara otomatis menyesuaikan warna latar, teks, batas, dan tema yang aktif.
          </>
        }
      >

        <div className="mb-4 grid gap-5 sm:grid-cols-2">
          <Demo label="Default" dark>
            <Pagination currentPage={2} totalPages={100} onPageChange={() => {}} theme="default" darkMode />
          </Demo>

          <Demo label="Primary" dark>
            <Pagination currentPage={2} totalPages={100} onPageChange={() => {}} theme="primary" darkMode />
          </Demo>

          <Demo label="Purple" dark>
            <Pagination currentPage={2} totalPages={100} onPageChange={() => {}} theme="purple" darkMode />
          </Demo>
        </div>

        <SectionCode>
          {'<Pagination\n'}
          {'    currentPage={2}\n'}
          {'    totalPages={100}\n'}
          {'    onPageChange={setCurrentPage}\n'}
          {'    theme="primary"\n'}
          {'    '}<H>darkMode</H>{'\n'}
          {'/>'}
        </SectionCode>
      </ModeSection>

      <FlowSection id="playground" title="Playground">
        <Lead>
          Coba konfigurasi Pagination secara langsung melalui kontrol di bawah ini untuk melihat
          perubahan halaman dan theme.
        </Lead>

        <Stage maxWidth="max-w-[700px]" dark={dark}>
          <div className="flex min-h-[160px] items-center justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              theme={theme}
              darkMode={dark}
            />
          </div>
        </Stage>

        <Controls>
          <Control label="Tampilan">
            <Segmented
              label="Pilih mode"
              value={dark}
              onChange={(value) => setDark(Boolean(value))}
              options={[
                { value: false, label: "Light" },
                { value: true, label: "Dark" },
              ]}
            />
          </Control>
          <Control label="Theme">
            <Segmented
              label="Pilih theme"
              value={theme}
              onChange={(value) => setTheme(value as PaginationTheme)}
              options={themeOptions}
            />
          </Control>
          <Control label="Total pages">
            <Segmented
              label="Pilih jumlah halaman"
              value={totalPages}
              onChange={(value) => {
                setTotalPages(value);
                setCurrentPage((page) => Math.min(page, value));
              }}
              options={totalPageOptions}
            />
          </Control>
        </Controls>
      </FlowSection>

      <FlowSection id="penggunaan" title="Penggunaan">
        <Lead>
          Bagian ini menampilkan contoh kode penggunaan Pagination berdasarkan konfigurasi yang
          dipilih pada Playground.
        </Lead>

        <SectionCode flush>
          {"import { Pagination } from '@ceplok-ui/design-kit-react'\n"}
          {"\n"}
          {"const [currentPage, setCurrentPage] = useState(1)\n"}
          {"\n"}
          {"<Pagination\n"}
          <>
            {"    "}
            <H>currentPage</H>
            {"={currentPage}\n"}
          </>
          <>
            {"    "}
            <H>totalPages</H>
            {`={${totalPages}}\n`}
          </>
          <>
            {"    "}
            <H>onPageChange</H>
            {"={setCurrentPage}\n"}
          </>
          <>
            {"    "}
            <H>theme</H>
            {`="${theme}"\n`}
          </>
          {dark && (
            <>
              {"    "}
              <H>darkMode</H>
              {"\n"}
            </>
          )}
          {"/>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <Lead>
          Referensi semua prop yang tersedia pada komponen Pagination.
        </Lead>

        <PropsTable rows={paginationProps} minWidth="46rem" />
      </FlowSection>
    </UsulanPage>
  );
}
