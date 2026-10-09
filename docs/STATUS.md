# Status implementasi SATUOS

## Source code yang sudah ditambahkan
- Expo Router + TypeScript dan dashboard responsif.
- SQLite lokal dengan tabel transaksi, produk, tugas, aset, draf sosial, dan pemeriksaan Trust.
- Pencatatan pemasukan/pengeluaran dan ringkasan saldo.
- Katalog produk dan pencatatan penjualan yang mengurangi stok serta mencatat pemasukan dalam transaksi database yang sama.
- Daftar tugas lokal dengan penanda selesai.
- Catatan aset manual.
- Draf sosial lokal, membuka tautan platform, dan berbagi teks native.
- Pemeriksaan URL/pesan berbasis pola lokal.
- Asisten lokal berbasis aturan.
- Ekspor cadangan JSON.
- Workflow GitHub Actions untuk pemeriksaan dan build APK debug.

## Belum diimplementasikan atau perlu konfigurasi
- Pemulihan/impor cadangan JSON.
- Anggaran, banyak dompet, pelanggan, pemasok, faktur, pembelian, piutang/utang terstruktur, grafik, dan laporan lengkap.
- Pengingat terjadwal dan notifikasi lokal.
- Sinkronisasi multi-perangkat dan autentikasi cloud.
- OAuth/API penerbitan media sosial resmi.
- AI generatif online atau model AI lokal.
- Build APK yang berhasil diverifikasi di perangkat nyata.

## Konektor platform
Konektor saat ini membuka URL resmi dan menggunakan menu berbagi native. Tidak ada status login palsu. Penerbitan otomatis, analitik, pembacaan pesan pribadi, dan sinkronisasi cloud belum aktif.

## Menjalankan secara lokal
```bash
npm install
npx expo install --check
npx tsc --noEmit
npx expo start
```

## Build
Jalankan workflow **Build APK Android SATUOS** dari tab Actions atau push tag versi. Artefak debug APK tersedia hanya setelah workflow berhasil. APK release untuk distribusi publik memerlukan proses signing dengan keystore yang disimpan aman, bukan di repository.
