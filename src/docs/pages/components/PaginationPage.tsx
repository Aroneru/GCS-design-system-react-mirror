import { useState } from "react";
import { Pagination, type PaginationTheme } from "../../../lib";
import { PropsTable, type PropRow } from "../../PropsTable";
import { Demo, H, Segmented } from "../../pageKit";
import {
  Control,
  Controls,
  FlowSection,
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
];

const toc: TocEntry[] = [
  // { id: "pagination", label: "Pagination" },
  { id: "states", label: "States" },
  { id: "themes", label: "Themes" },
  { id: "playground", label: "Playground" },
  { id: "penggunaan", label: "Penggunaan" },
  { id: "properties", label: "Properties" },
];

export function PaginationPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [theme, setTheme] = useState<PaginationTheme>("primary");
  const [totalPages, setTotalPages] = useState(100);
  return (
    <UsulanPage
      eyebrow="Components · Pagination"
      title="Pagination"
      description="Navigasi untuk berpindah antar halaman pada data atau konten yang terbagi ke dalam beberapa halaman."
      toc={toc}
    >
      <FlowSection id="states" title="States">
        <p className="mb-4 text-body-sm text-gray-500">
          Pagination memiliki state aktif untuk menunjukkan halaman yang sedang dipilih. Tombol
          halaman lainnya dapat digunakan untuk berpindah ke halaman yang berbeda.
        </p>

        <div className="mb-4 grid gap-5 sm:grid-cols-2">
          <Demo label="First Page">
            <Pagination currentPage={1} totalPages={100} onPageChange={() => {}} theme="primary" />
          </Demo>

          <Demo label="Active Page">
            <Pagination currentPage={2} totalPages={100} onPageChange={() => {}} theme="primary" />
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
          {"/>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="themes" title="Themes">
        <p className="mb-6 text-body-sm text-gray-500">
          Theme digunakan untuk menyesuaikan warna halaman aktif pada Pagination sesuai dengan
          konteks visual aplikasi.
        </p>

        <div className="mb-4 flex flex-col gap-6">
          <Demo>
            <div>
              <Pagination
                currentPage={1}
                totalPages={100}
                onPageChange={() => {}}
                theme="default"
              />

              <p className="mt-2 mb-5 text-sm text-gray-600">
                <H>Default</H> menggunakan gray sebagai warna utama pagination.
              </p>
            </div>
            <div>
              <Pagination
                currentPage={1}
                totalPages={100}
                onPageChange={() => {}}
                theme="primary"
              />

              <p className="mt-2 mb-5 text-sm text-gray-600">
                <H>Primary</H> digunakan sebagai warna utama lain pagination.
              </p>
            </div>

            <div>
              <Pagination currentPage={1} totalPages={100} onPageChange={() => {}} theme="purple" />

              <p className="mt-2 mb-5 text-sm text-gray-600">
                <H>Purple</H> digunakan ketika pagination membutuhkan aksen ungu.
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
          {"/>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="playground" title="Playground">
        <p className="mb-6 text-body-sm text-gray-500">
          Coba konfigurasi Pagination secara langsung melalui kontrol di bawah ini untuk melihat
          perubahan halaman dan theme.
        </p>

        <Stage maxWidth="max-w-[700px]">
          <div className="flex min-h-[160px] items-center justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              theme={theme}
            />
          </div>
        </Stage>

        <Controls>
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
        <p className="mb-6 text-body-sm text-gray-500">
          Bagian ini menampilkan contoh kode penggunaan Pagination berdasarkan konfigurasi yang
          dipilih pada Playground.
        </p>

        <SectionCode flush>
          {"import { Pagination } from '@stasi/design-kit-react'\n"}
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
          {"/>"}
        </SectionCode>
      </FlowSection>

      <FlowSection id="properties" title="Properties">
        <p className="mb-6 text-body-sm text-gray-500">
          Referensi semua prop yang tersedia pada komponen Pagination.
        </p>

        <PropsTable rows={paginationProps} minWidth="46rem" />
      </FlowSection>
    </UsulanPage>
  );
}
