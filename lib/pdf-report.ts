import { rupiah } from './format';

type Cell = string | number;
export type PdfSection = { title: string; columns: string[]; rows: Cell[][] };
export type ReportTables = Record<string, Record<string, unknown>[]>;
export type ReportMetrics = {
  income: number; expense: number; balance: number;
  revenue: number; grossProfit: number; units: number; lowStock: number;
  assets: number; liabilities: number; receivables: number; netWorth: number;
};

const text = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Ya' : 'Tidak';
  return String(value);
};
const money = (value: unknown): string => rupiah(typeof value === 'number' ? value : Number(value) || 0);
const rowsFor = (table: ReportTables, key: string) => Array.isArray(table[key]) ? table[key] : [];

export function buildReportSections(tables: ReportTables, metrics: ReportMetrics): PdfSection[] {
  const transactions = rowsFor(tables, 'transactions');
  const sections: PdfSection[] = [
    { title: 'Ringkasan utama', columns: ['Indikator', 'Nilai'], rows: [
      ['Pemasukan tercatat', money(metrics.income)], ['Pengeluaran tercatat', money(metrics.expense)], ['Saldo bersih transaksi', money(metrics.balance)],
      ['Omzet penjualan usaha', money(metrics.revenue)], ['Perkiraan laba kotor', money(metrics.grossProfit)], ['Unit terjual', String(metrics.units)],
      ['Produk dengan stok rendah (≤ 3)', String(metrics.lowStock)], ['Total aset', money(metrics.assets)], ['Utang aktif', money(metrics.liabilities)],
      ['Piutang aktif', money(metrics.receivables)], ['Perkiraan kekayaan bersih', money(metrics.netWorth)], ['Jumlah transaksi', String(transactions.length)],
    ] },
    { title: 'Transaksi keuangan', columns: ['ID', 'Tanggal', 'Jenis', 'Judul / keterangan', 'Kategori', 'Nominal', 'ID dompet'], rows: transactions.map((r) => [text(r.id), text(r.created_at), text(r.kind), text(r.title), text(r.category), money(r.amount), text(r.wallet_id)]) },
    { title: 'Produk dan persediaan', columns: ['ID', 'Nama produk', 'Harga jual', 'Harga modal', 'Stok', 'Diperbarui'], rows: rowsFor(tables, 'products').map((r) => [text(r.id), text(r.name), money(r.price), money(r.cost), text(r.stock), text(r.updated_at)]) },
    { title: 'Penjualan', columns: ['ID', 'Tanggal', 'Produk', 'Jumlah', 'Harga/unit', 'Modal/unit'], rows: rowsFor(tables, 'sales').map((r) => [text(r.id), text(r.created_at), text(r.product_name), text(r.quantity), money(r.unit_price), money(r.unit_cost)]) },
    { title: 'Pembelian stok', columns: ['ID', 'Tanggal', 'ID produk', 'Jumlah', 'Modal/unit'], rows: rowsFor(tables, 'purchases').map((r) => [text(r.id), text(r.created_at), text(r.product_id), text(r.quantity), money(r.unit_cost)]) },
    { title: 'Anggaran bulanan', columns: ['ID', 'Bulan', 'Kategori', 'Batas'], rows: rowsFor(tables, 'budgets').map((r) => [text(r.id), text(r.month), text(r.category), money(r.amount)]) },
    { title: 'Dompet', columns: ['ID', 'Nama', 'Saldo awal', 'Dibuat'], rows: rowsFor(tables, 'wallets').map((r) => [text(r.id), text(r.name), money(r.opening_balance), text(r.created_at)]) },
    { title: 'Utang dan piutang', columns: ['ID', 'Jenis', 'Judul', 'Nominal', 'Jatuh tempo', 'Lunas'], rows: rowsFor(tables, 'debts').map((r) => [text(r.id), text(r.kind), text(r.title), money(r.amount), text(r.due_date), r.paid === 1 || r.paid === true ? 'Ya' : 'Tidak']) },
    { title: 'Aset', columns: ['ID', 'Judul', 'Jenis', 'Nilai'], rows: rowsFor(tables, 'assets').map((r) => [text(r.id), text(r.title), text(r.kind), money(r.value)]) },
    { title: 'Tugas', columns: ['ID', 'Judul', 'Status', 'Dibuat'], rows: rowsFor(tables, 'tasks').map((r) => [text(r.id), text(r.title), r.done === 1 || r.done === true ? 'Selesai' : 'Belum selesai', text(r.created_at)]) },
    { title: 'Kontak usaha', columns: ['ID', 'Nama', 'Jenis', 'Telepon', 'Catatan'], rows: rowsFor(tables, 'contacts').map((r) => [text(r.id), text(r.name), text(r.kind), text(r.phone), text(r.notes)]) },
    { title: 'Draf konten sosial', columns: ['ID', 'Platform', 'Status', 'Caption', 'Dibuat'], rows: rowsFor(tables, 'drafts').map((r) => [text(r.id), text(r.platform), text(r.status), text(r.caption), text(r.created_at)]) },
    { title: 'Pemeriksaan SATU Trust', columns: ['ID', 'Target', 'Kesimpulan', 'Alasan', 'Diperiksa'], rows: rowsFor(tables, 'trust_checks').map((r) => [text(r.id), text(r.target), text(r.verdict), text(r.reasons), text(r.created_at)]) },
    { title: 'Pengingat', columns: ['ID', 'Judul', 'Waktu', 'Selesai'], rows: rowsFor(tables, 'reminders').map((r) => [text(r.id), text(r.title), text(r.due_at), r.done === 1 || r.done === true ? 'Ya' : 'Tidak']) },
    { title: 'Catatan keluarga', columns: ['ID', 'Judul', 'Isi', 'Jenis', 'Dibuat'], rows: rowsFor(tables, 'notes').map((r) => [text(r.id), text(r.title), text(r.body), text(r.kind), text(r.created_at)]) },
    { title: 'Riwayat aktivitas', columns: ['ID', 'Aksi', 'Detail', 'Tanggal'], rows: rowsFor(tables, 'activity_log').map((r) => [text(r.id), text(r.action), text(r.detail), text(r.created_at)]) },
  ];
  return sections;
}

export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character);
}

export function renderPdfReport(title: string, generatedAt: string, sections: PdfSection[]): string {
  const content = sections.map((section, index) => {
    const headings = section.columns.map((column) => `<th scope="col">${escapeHtml(column)}</th>`).join('');
    const body = section.rows.length
      ? section.rows.map((row) => `<tr>${section.columns.map((_, columnIndex) => `<td>${escapeHtml(row[columnIndex] ?? '—')}</td>`).join('')}</tr>`).join('')
      : `<tr><td class="empty" colspan="${Math.max(section.columns.length, 1)}">Belum ada data</td></tr>`;
    return `<section class="report-section"><h2><span>${String(index + 1).padStart(2, '0')}</span>${escapeHtml(section.title)}</h2><table><thead><tr>${headings}</tr></thead><tbody>${body}</tbody></table></section>`;
  }).join('');

  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title><style>
    @page{size:A4;margin:16mm 14mm 18mm}*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#172033;font-size:9pt;line-height:1.42;margin:0}header{border-bottom:3px solid #f0a43a;padding:0 0 12px;margin-bottom:20px}.brand{color:#c57a17;font-size:9pt;font-weight:800;letter-spacing:2px}.title{font-size:23pt;line-height:1.15;margin:7px 0 6px;color:#101827}.subtitle{color:#667085;font-size:9pt}.meta{color:#667085;font-size:8pt;margin-top:8px}.summary-note{background:#fff7e9;border-left:3px solid #f0a43a;padding:9px 11px;margin:15px 0 21px;color:#604213;font-size:8pt}.report-section{margin:0 0 20px;break-inside:auto}.report-section h2{font-size:12pt;color:#152238;border-bottom:1px solid #dce2ea;padding:0 0 7px;margin:0 0 9px;break-after:avoid}.report-section h2 span{display:inline-block;color:#c57a17;font-size:8pt;letter-spacing:1px;margin-right:8px;vertical-align:2px}table{border-collapse:collapse;width:100%;table-layout:auto;font-size:7.5pt}thead{display:table-header-group}tr{break-inside:avoid}th{background:#edf2f7;color:#23344d;text-align:left;font-weight:700}th,td{border:1px solid #dbe2ea;padding:5px 6px;vertical-align:top;overflow-wrap:anywhere;word-break:break-word}tbody tr:nth-child(even){background:#f8fafc}.empty{text-align:center;color:#667085;font-style:italic;padding:10px}footer{margin-top:24px;padding-top:8px;border-top:1px solid #dce2ea;color:#7b8492;font-size:7pt}.legal{font-size:7pt;color:#667085;margin-top:4px}@media print{.report-section{break-inside:auto}tr{break-inside:avoid}}
    </style></head><body><header><div class="brand">SATUOS · LAPORAN LOKAL</div><h1 class="title">${escapeHtml(title.trim() || 'Laporan SATUOS')}</h1><div class="subtitle">Ringkasan dan tabel data dari seluruh modul yang tersimpan pada perangkat.</div><div class="meta">Dibuat: ${escapeHtml(generatedAt)} · Mode: semua data lokal</div></header><div class="summary-note">Dokumen ini dapat memuat data keuangan, kontak, catatan, draf, dan aktivitas pribadi. Simpan dan bagikan hanya kepada pihak yang Anda percaya.</div>${content}<footer>Dokumen dibuat oleh SATUOS · Angka dan isi mengikuti data lokal pada saat laporan dibuat.<div class="legal">Laporan ini adalah ringkasan aplikasi, bukan dokumen pajak atau laporan akuntansi resmi.</div></footer></body></html>`;
}
