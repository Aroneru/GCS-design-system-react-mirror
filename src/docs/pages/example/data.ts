/**
 * Data contoh untuk aplikasi demo.
 *
 * Dipisah dari komponennya karena dipakai lintas halaman — Dasbor menampilkan
 * lima pengajuan terbaru, Pengajuan menampilkan seluruhnya — dan karena berkas
 * komponen sebaiknya hanya mengekspor komponen (aturan react-refresh).
 */

/** Rute-dalam aplikasi demo, relatif terhadap `/example/app`. */
export type HalamanDemo =
  | 'dasbor'
  | 'pengajuan'
  | 'pemohon'
  | 'layanan'
  | 'simaya'
  | 'modifikasi'
  | 'pengaturan'

export const JUDUL_HALAMAN: Record<HalamanDemo, string> = {
  dasbor: 'Dasbor',
  pengajuan: 'Pengajuan',
  pemohon: 'Pemohon',
  layanan: 'Layanan',
  simaya: 'Simaya',
  modifikasi: 'Modifikasi',
  pengaturan: 'Pengaturan',
}

export type StatusPengajuan = 'Selesai' | 'Diproses' | 'Menunggu' | 'Ditolak'

/** Status dipetakan ke variant Badge yang maknanya sama. */
export const VARIAN_STATUS: Record<StatusPengajuan, 'success' | 'brand' | 'warning' | 'danger'> = {
  Selesai: 'success',
  Diproses: 'brand',
  Menunggu: 'warning',
  Ditolak: 'danger',
}

export interface Pengajuan {
  id: string
  nama: string
  layanan: string
  tanggal: string
  status: StatusPengajuan
}

export const PENGAJUAN: Pengajuan[] = [
  { id: 'PJ-2401', nama: 'Ahmad Fauzi', layanan: 'Perizinan Usaha', tanggal: '02 Sep 2026', status: 'Selesai' },
  { id: 'PJ-2402', nama: 'Siti Rahayu', layanan: 'Legalisasi Dokumen', tanggal: '02 Sep 2026', status: 'Diproses' },
  { id: 'PJ-2403', nama: 'Budi Santoso', layanan: 'Perizinan Usaha', tanggal: '01 Sep 2026', status: 'Menunggu' },
  { id: 'PJ-2404', nama: 'Dewi Lestari', layanan: 'Pengaduan Layanan', tanggal: '01 Sep 2026', status: 'Ditolak' },
  { id: 'PJ-2405', nama: 'Rizky Pratama', layanan: 'Legalisasi Dokumen', tanggal: '31 Agu 2026', status: 'Selesai' },
  { id: 'PJ-2406', nama: 'Nurul Aini', layanan: 'Perizinan Usaha', tanggal: '31 Agu 2026', status: 'Diproses' },
  { id: 'PJ-2407', nama: 'Hendra Wijaya', layanan: 'Pengaduan Layanan', tanggal: '30 Agu 2026', status: 'Menunggu' },
  { id: 'PJ-2408', nama: 'Maya Kusuma', layanan: 'Legalisasi Dokumen', tanggal: '30 Agu 2026', status: 'Selesai' },
  { id: 'PJ-2409', nama: 'Doni Saputra', layanan: 'Perizinan Usaha', tanggal: '29 Agu 2026', status: 'Selesai' },
  { id: 'PJ-2410', nama: 'Intan Permata', layanan: 'Pengaduan Layanan', tanggal: '29 Agu 2026', status: 'Diproses' },
]

/** Jumlah baris per halaman pada tabel Pengajuan; dipakai juga untuk menghitung totalPages. */
export const BARIS_PER_HALAMAN = 4

export interface Pemohon {
  nama: string
  surel: string
  instansi: string
  jumlah: number
  aktif: boolean
}

export const PEMOHON: Pemohon[] = [
  { nama: 'Ahmad Fauzi', surel: 'ahmad.fauzi@contoh.id', instansi: 'CV Karya Mandiri', jumlah: 8, aktif: true },
  { nama: 'Siti Rahayu', surel: 'siti.rahayu@contoh.id', instansi: 'PT Bina Sejahtera', jumlah: 5, aktif: true },
  { nama: 'Budi Santoso', surel: 'budi.santoso@contoh.id', instansi: 'UD Sumber Rejeki', jumlah: 3, aktif: false },
  { nama: 'Dewi Lestari', surel: 'dewi.lestari@contoh.id', instansi: 'Koperasi Maju Bersama', jumlah: 2, aktif: true },
]

export interface Layanan {
  slug: string
  judul: string
  deskripsi: string
  durasi: string
  biaya: string
}

export const LAYANAN: Layanan[] = [
  {
    slug: 'perizinan',
    judul: 'Perizinan Usaha',
    deskripsi: 'Pengajuan izin baru dan perpanjangan, seluruhnya daring tanpa perlu tatap muka.',
    durasi: '5 hari kerja',
    biaya: 'Gratis',
  },
  {
    slug: 'legalisasi',
    judul: 'Legalisasi Dokumen',
    deskripsi: 'Pengesahan salinan dokumen resmi dengan tanda tangan elektronik tersertifikasi.',
    durasi: '3 hari kerja',
    biaya: 'Rp25.000',
  },
  {
    slug: 'pengaduan',
    judul: 'Pengaduan Layanan',
    deskripsi: 'Sampaikan keluhan atau masukan, lalu pantau tindak lanjutnya secara terbuka.',
    durasi: '2 hari kerja',
    biaya: 'Gratis',
  },
]

export const JENIS_LAYANAN = LAYANAN.map((l) => ({ value: l.slug, label: l.judul }))
