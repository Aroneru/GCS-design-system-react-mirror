import { Badge, TableOfContents } from "../../../../lib";
import { BERITA_LAYANAN_DIGITAL_TOC } from "./BeritaLayananDigitalToc";

/** Artikel dummy panjang; ID bagian disiapkan sebagai target TableOfContents. */
export function BeritaLayananDigital() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row lg:items-start">
      <TableOfContents
        items={BERITA_LAYANAN_DIGITAL_TOC}
        layout="list"
        className="order-first hidden shrink-0 lg:order-last lg:sticky lg:top-6 lg:block"
      />

    <article className="min-w-0 flex-1 [&_p]:text-justify">
      <header className="border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="brand">Berita layanan</Badge>
          <span className="text-body-sm text-content-muted">12 November 2026</span>
          <span className="text-content-disabled" aria-hidden="true">&middot;</span>
          <span className="text-body-sm text-content-muted">6 menit baca</span>
        </div>
        <h2 className="mt-5 text-heading-2 font-black tracking-tight text-gray-900 sm:text-heading-1">
          Layanan Digital Terpadu Memudahkan Warga Mengurus Pengajuan dari Satu Portal
        </h2>
        <p className="mt-5 text-body leading-8 text-content-muted">
          Portal Layanan Terpadu terus dikembangkan agar warga dapat mengajukan, memantau,
          dan menyelesaikan kebutuhan administrasi tanpa berpindah-pindah aplikasi.
        </p>
      </header>

      <div className="space-y-12 py-10 text-body leading-8 text-gray-700">
        <section id="latar-belakang" aria-labelledby="latar-belakang-title">
          <h3 id="latar-belakang-title" className="text-heading-3 font-black text-gray-900">Latar belakang pembaruan</h3>
          <p className="mt-4">
            Sebelumnya, informasi layanan tersebar di beberapa kanal. Warga perlu mencari
            syarat pada satu halaman, mengisi formulir pada halaman lain, lalu menunggu kabar
            melalui media yang berbeda. Pola tersebut membuat proses sederhana terasa panjang,
            terutama bagi pemohon yang baru pertama kali menggunakan layanan daring.
          </p>
          <p className="mt-4">
            Tim layanan menghimpun masukan dari pemohon, petugas loket, dan unit pengelola.
            Hasilnya menjadi dasar penyederhanaan alur: setiap layanan kini memiliki ringkasan
            yang sama, daftar dokumen yang mudah diperiksa, serta status pengajuan yang dapat
            dipantau tanpa menghubungi petugas.
          </p>
        </section>

        <section id="perubahan-utama" aria-labelledby="perubahan-utama-title">
          <h3 id="perubahan-utama-title" className="text-heading-3 font-black text-gray-900">Perubahan utama yang tersedia</h3>
          <p className="mt-4">
            Halaman layanan kini menampilkan estimasi waktu, biaya, persyaratan, dan langkah
            pengajuan dalam urutan yang konsisten. Informasi ini dapat dibaca sebelum pemohon
            memulai formulir sehingga dokumen dapat disiapkan lebih dahulu.
          </p>
          <h4 id="formulir-bertahap" className="mt-7 text-heading-4 font-black text-gray-900">Formulir yang bertahap</h4>
          <p className="mt-3">
            Formulir dibagi menjadi beberapa tahap pendek. Sistem menjelaskan data yang diperlukan
            di setiap tahap dan menyimpan isian selama pengguna masih berada dalam proses. Pendekatan
            ini membantu pemohon memeriksa kembali informasi penting sebelum mengirimkan pengajuan.
          </p>
          <h4 id="status-terpadu" className="mt-7 text-heading-4 font-black text-gray-900">Status pengajuan yang terpadu</h4>
          <p className="mt-3">
            Setelah pengajuan dikirim, statusnya tampil pada Dasbor dan halaman Pengajuan. Pemohon
            dapat melihat apakah berkas sedang diperiksa, membutuhkan perbaikan, atau sudah selesai.
            Bila ada tindakan yang perlu dilakukan, pesan dari petugas tampil pada konteks pengajuan.
          </p>
        </section>

        <aside className="rounded-xl border border-primary-100 bg-primary-50 p-6 text-content">
          <h3 className="text-body font-black text-primary-800">Yang perlu disiapkan</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-body-sm leading-6 text-primary-900">
            <li>akun dengan alamat surel yang masih aktif;</li>
            <li>dokumen persyaratan dalam format yang tercantum pada layanan; dan</li>
            <li>nomor pengajuan untuk memantau proses yang sudah berjalan.</li>
          </ul>
        </aside>

        <section id="dampak-bagi-warga" aria-labelledby="dampak-bagi-warga-title">
          <h3 id="dampak-bagi-warga-title" className="text-heading-3 font-black text-gray-900">Dampak bagi warga dan petugas</h3>
          <p className="mt-4">
            Bagi warga, informasi yang lebih terstruktur mengurangi kebutuhan untuk datang hanya
            untuk menanyakan syarat atau perkembangan berkas. Bagi petugas, data yang masuk lebih
            lengkap karena pemohon sudah memperoleh panduan pada tahap yang tepat. Waktu pelayanan
            dapat difokuskan untuk verifikasi dan pendampingan kasus yang benar-benar memerlukan bantuan.
          </p>
          <p className="mt-4">
            Pembaruan juga membuat riwayat pengajuan lebih mudah ditelusuri. Setiap perubahan status
            tercatat sebagai bagian dari proses layanan, sehingga pemohon dan unit pengelola memiliki
            rujukan yang sama saat menindaklanjuti sebuah permohonan.
          </p>
        </section>

        <section id="tahap-selanjutnya" aria-labelledby="tahap-selanjutnya-title">
          <h3 id="tahap-selanjutnya-title" className="text-heading-3 font-black text-gray-900">Tahap pengembangan selanjutnya</h3>
          <p className="mt-4">
            Dalam pengembangan berikutnya, portal akan menambahkan panduan kontekstual berdasarkan
            jenis layanan dan rangkuman aktivitas pada halaman Dasbor. Tim juga menyiapkan perbaikan
            aksesibilitas agar seluruh informasi tetap mudah digunakan dengan keyboard maupun pembaca layar.
          </p>
          <p className="mt-4">
            Masukan dari pengguna tetap menjadi bagian penting dari pengembangan. Apabila menemukan
            informasi yang belum jelas atau alur yang perlu disederhanakan, sampaikan melalui kanal
            bantuan di portal. Setiap masukan akan ditinjau untuk pembaruan layanan berikutnya.
          </p>
        </section>
      </div>
    </article>
    </div>
  );
}
