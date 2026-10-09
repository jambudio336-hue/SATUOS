# Status implementasi SATUOS

## Modul lokal yang telah ditambahkan
- Dashboard responsif dengan status koneksi dasar.
- SQLite lokal dengan migrasi versi 1 dan 2.
- SATU Money: pemasukan/pengeluaran, kategori, riwayat, hapus transaksi, ekspor CSV, beberapa dompet, anggaran bulanan, dan catatan utang/piutang.
- SATU Business: katalog produk, penjualan satuan, pembelian stok satuan, pencatatan biaya pembelian, pelanggan, pemasok, serta pencatatan harga pokok pada saat penjualan.
- SATU Social: draf caption lokal, tautan platform resmi, dan berbagi teks melalui menu native.
- SATU Trust: pemeriksaan pola lokal untuk permintaan kode rahasia, hadiah yang meminta pembayaran, tautan pendek, dan HTTP tanpa TLS.
- SATU AI: asisten berbasis aturan untuk ringkasan keuangan, stok, dan tugas; bukan model generatif.
- Family & Team: tugas dan catatan keluarga lokal.
- SATU Wealth: pencatatan aset serta ringkasan aset, utang, piutang, dan kekayaan bersih.\n- Laporan SATUOS: omzet penjualan, estimasi harga pokok barang terjual, estimasi laba kotor, pembelian stok, dan peringatan stok rendah.
- SATU Automation: pengingat disimpan secara lokal dan mencoba menjadwalkan notifikasi lokal setelah izin diberikan.
- Pengaturan: ekspor JSON, pemulihan JSON dengan konfirmasi, dan ekspor transaksi CSV.
- GitHub Actions untuk pemeriksaan TypeScript, tes helper, pemeriksaan dependensi Expo, dan build APK debug.

## Keterbatasan yang masih memerlukan konfigurasi atau pengembangan
- Sinkronisasi multi-perangkat dan autentikasi cloud belum dibuat. Ini memerlukan backend yang dikonfigurasi serta autentikasi/otorisasi.
- OAuth, penerbitan otomatis, pesan bisnis otomatis, dan analitik sosial belum aktif; konektor saat ini hanya membuka situs resmi dan berbagi secara eksplisit.
- Integrasi Gmail/Drive/Calendar, pembayaran, pengiriman, faktur lengkap, dan pembelian multi-item belum tersedia.
- Notifikasi lokal memerlukan izin pengguna dan perlu diverifikasi di perangkat Android sebenarnya.
- Dompet dapat menyimpan saldo awal dan menampilkan transaksi yang ditautkan ke dompet; alokasi transaksi ke dompet belum tersedia di formulir transaksi.
- Pemeriksaan Trust bersifat heuristik lokal, bukan pemeriksaan reputasi atau jaminan keamanan.
- Build dan tes belum boleh dinyatakan lulus sampai hasil Actions aktual menunjukkan keberhasilan.\n- Faktur lengkap, pembelian multi-item, dan laporan akuntansi/pajak resmi belum tersedia.

## Menjalankan
```bash
npm install
npx expo install --check
npx tsc --noEmit
npm test -- --passWithNoTests
npx expo start
```

## Build APK
Buka tab Actions dan jalankan workflow **Build APK Android SATUOS**. Workflow membangun APK debug dan mengunggahnya sebagai artefak jika seluruh langkah berhasil. APK debug untuk pengujian tidak sama dengan APK release bertanda tangan untuk distribusi publik. Jangan commit keystore, kata sandi, atau token.
