/** Satu baris tabel: [nama, tipe, default, keterangan]. */
export type PropRow = [name: string, type: string, defaultValue: string, description: string]

/**
 * Tabel "Properties" pada halaman komponen — markup identik dengan blok
 * <table> yang diulang di setiap halaman komponen versi Blade.
 */
export function PropsTable({ rows, minWidth = '40rem' }: { rows: PropRow[]; minWidth?: string }) {
  return (
    <div className="ds-card overflow-hidden">
      <div className="ds-scroll-x overflow-x-auto">
        <table className="w-full text-left text-sm" style={{ minWidth }}>
          <thead className="border-b border-border bg-surface-subtle text-xs font-black tracking-wide text-gray-500 uppercase">
            <tr>
              <th className="px-5 py-3">Prop</th>
              <th className="px-5 py-3">Tipe</th>
              <th className="px-5 py-3">Default</th>
              <th className="px-5 py-3">Keterangan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map(([name, type, def, desc]) => (
              <tr key={name}>
                <td className="px-5 py-3">
                  <code className="text-xs font-bold text-primary-700">{name}</code>
                </td>
                <td className="px-5 py-3 text-gray-500">{type}</td>
                <td className="px-5 py-3">
                  <code className="text-xs text-gray-500">{def}</code>
                </td>
                <td className="px-5 py-3 text-gray-600">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
