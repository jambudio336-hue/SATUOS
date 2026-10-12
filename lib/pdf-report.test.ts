import { buildReportSections, escapeHtml, renderPdfReport } from './pdf-report';

const metrics = { income: 10000, expense: 2500, balance: 7500, revenue: 6000, grossProfit: 2000, units: 2, lowStock: 1, assets: 50000, liabilities: 3000, receivables: 500, netWorth: 47500 };

describe('laporan PDF SATUOS', () => {
  test('meng-escape teks yang dapat berisi HTML dari data pengguna', () => {
    expect(escapeHtml('<script>alert("x")</script> &')).toBe('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp;');
  });

  test('menghasilkan tabel ringkasan dan tabel transaksi dari data lokal', () => {
    const sections = buildReportSections({ transactions: [{ id: 7, created_at: '2026-10-12', kind: 'pemasukan', title: 'Jual <produk>', category: 'Usaha', amount: 10000, wallet_id: null }] }, metrics);
    const html = renderPdfReport('Laporan SATUOS', '12 Oktober 2026', sections);
    expect(html).toContain('<table>');
    expect(html).toContain('Ringkasan utama');
    expect(html).toContain('Saldo bersih transaksi');
    expect(html).toContain('Jual &lt;produk&gt;');
    expect(html).not.toContain('Jual <produk>');
    expect(html).toContain('Belum ada data');
  });

  test('mengganti judul dan nilai sel khusus dengan teks aman', () => {
    const html = renderPdfReport('<Laporan pribadi>', 'hari ini', [{ title: 'Catatan', columns: ['Judul'], rows: [['"privat" & aman']] }]);
    expect(html).toContain('&lt;Laporan pribadi&gt;');
    expect(html).toContain('&quot;privat&quot; &amp; aman');
    expect(html).toContain('lang="id"');
  });
});
