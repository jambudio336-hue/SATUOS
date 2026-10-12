# Status implementasi SATUOS

Status dokumen: 12 Oktober 2026 · rilis kode 1.1.0.

## Implementasi yang tersedia

- Dashboard responsif dengan status jaringan, ringkasan keuangan, pencarian modul, aktivitas terakhir, dan aksi cepat.
- SQLite lokal dengan migrasi additive; SATU Money mendukung transaksi, kategori, dompet, anggaran, utang/piutang, riwayat, dan ekspor CSV.
- SATU Business menyediakan katalog produk, stok, penjualan/pembelian satuan, kontak, dan perhitungan harga pokok/laba kotor perkiraan.
- SATU Wealth menghitung aset, utang, piutang, dan kekayaan bersih perkiraan.
- SATU Social menyimpan draf dan membuka situs resmi; SATU Trust menjalankan pemeriksaan pola lokal; Jarvis menjawab pertanyaan sederhana dari data perangkat.
- Family & Team, tugas, dan pengingat lokal dengan notifikasi opsional setelah izin diberikan.
- Backup/pemulihan JSON, ekspor CSV, dan laporan PDF yang berisi ringkasan serta tabel dari semua tabel data yang diekspor aplikasi.
- Intro first-launch menampilkan video dan audio selama 10 detik pada instalasi pertama; audio berhenti saat timer selesai.
- Expo SDK 57, React Native 0.86, Android prebuild, dan workflow GitHub Actions untuk pemeriksaan serta APK.

## Hasil audit dependency

Pada 12 Oktober 2026, `npm audit` menandai 65 advisori (17 moderate, 48 high, 0 critical); `npm audit --omit=dev` menandai 43 advisori pada dependency graph non-dev. Banyak isu bersumber dari toolchain upstream dan versi native terbaru yang masih dibatasi SDK57. `npm audit fix --force` akan menurunkan Expo ke SDK44 atau mengganti dependency native yang tidak kompatibel, sehingga tidak diterapkan. Detail ada di [SECURITY.md](SECURITY.md); hasil pemeriksaan bukan klaim bebas kerentanan.

## Batasan dan perhatian

- PDF dapat mencakup data sensitif seperti kontak, catatan, draf, transaksi, dan aktivitas. Pengguna memilih lokasi simpan dan harus memeriksa penerima sebelum membagikan.
- Audio pihak ketiga yang disediakan pemilik proyek bukan bagian dari lisensi MIT. Hak distribusi harus dipastikan oleh pemilik proyek sebelum publikasi.
- Sinkronisasi multi-perangkat, cloud login, OAuth, penerbitan sosial otomatis, bank, pembayaran, kalender, dan AI generatif belum diimplementasikan.
- Konektor sosial hanya membuka layanan; tidak ada pengakuan bahwa akun telah terhubung.
- Pemeriksaan Trust bersifat heuristik lokal, bukan pemeriksaan reputasi daring atau jaminan keamanan.
- Estimasi laba/kekayaan bukan laporan pajak atau akuntansi resmi. Dompet hanya menghitung transaksi yang benar-benar ditautkan.
- APK release hanya dinyatakan berhasil setelah workflow signing di GitHub Actions sukses dan file release tersedia.

## Pemeriksaan lokal

```bash
npm ci
npx expo install --check
npx --yes expo-doctor
npm run typecheck
npm test
```
