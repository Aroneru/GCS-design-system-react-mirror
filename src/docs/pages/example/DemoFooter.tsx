import { Footer } from '../../../lib'
import { asset } from '../../asset'
import { FacebookIcon, InstagramIcon, XIcon } from '../../socialIcons'
import { JUDUL_HALAMAN, type HalamanDemo } from './data'

/**
 * Footer khusus aplikasi demo.
 *
 * Bedanya dari footer situs dokumentasi ada di isinya, bukan bentuknya:
 * menunya menunjuk rute-dalam demo, bukan rail dokumentasi, dan hak ciptanya
 * menyatakan bahwa ini contoh — halaman ini menampilkan nama pemohon dan nomor
 * pengajuan yang seluruhnya karangan, jadi footernya tidak pantas meniru
 * footer instansi sungguhan.
 *
 * Seperti `DemoApp`, berkas ini hanya mengimpor dari `../../../lib`. Dua
 * pengecualiannya bukan pustaka: `asset()` adalah helper path milik situs
 * docs, dan `socialIcons` adalah SVG inline biasa.
 */

/** Urutan menu mengikuti Sidebar supaya dua navigasi itu tidak saling bertentangan. */
const RUTE_FOOTER: HalamanDemo[] = [
  'dasbor',
  'pengajuan',
  'pemohon',
  'layanan',
  'simaya',
  'modifikasi',
  'pengaturan',
]

const href = (h: HalamanDemo) => (h === 'dasbor' ? '#/example/app' : `#/example/app/${h}`)

export function DemoFooter() {
  return (
    <Footer
      // fluid: footer kini membentang penuh selebar layar, sedangkan konten di
      // atasnya bergeser ke kanan mengikuti Sidebar. Tanpa fluid, isinya akan
      // dipusatkan pada 1280px terhadap viewport — melenceng dari kolom konten.
      fluid
      logo={asset('/images/stasi-logo.svg')}
      logoAlt="STASI — Ministerium Fur Staatssicherheit"
      menus={RUTE_FOOTER.map((h) => ({ label: JUDUL_HALAMAN[h], url: href(h) }))}
      copyright={`© ${new Date().getFullYear()} STASI — contoh aplikasi, bukan layanan sungguhan`}
      socials={[
        { label: 'Instagram', url: '#', icon: InstagramIcon },
        { label: 'X', url: '#', icon: XIcon },
        { label: 'Facebook', url: '#', icon: FacebookIcon },
      ]}
    />
  )
}
