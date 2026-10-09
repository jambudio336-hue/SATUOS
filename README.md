# SATUOS
**Satu Aplikasi, Banyak Solusi.**

SATUOS adalah aplikasi Android local-first berbasis Expo, React Native, TypeScript, dan SQLite. Fitur lokal tidak memerlukan akun cloud atau API key berbayar.

## Modul saat ini
- **SATU Money:** pemasukan/pengeluaran, riwayat transaksi, dompet lokal, anggaran bulanan, utang/piutang, dan ekspor CSV.
- **SATU Business:** katalog produk, stok, penjualan/pembelian satuan, pelanggan, pemasok, dan pencatatan biaya.
- **SATU Social:** draf caption, tautan layanan resmi, dan berbagi native.
- **SATU Trust:** pemeriksaan pola mencurigakan berbasis aturan lokal.
- **SATU AI:** asisten lokal berbasis aturan untuk saldo, stok, dan tugas; bukan AI generatif.
- **Family & Team:** tugas dan catatan keluarga.
- **SATU Wealth:** pencatatan aset dan perhitungan ringkasan kekayaan bersih.
- **SATU Automation:** pengingat lokal dan notifikasi jika izin perangkat diberikan.
- **Pengaturan:** ekspor JSON dan pemulihan cadangan JSON.

## Menjalankan lokal
Memerlukan Node.js LTS dan npm:
```bash
npm install
npx expo install --check
npx tsc --noEmit
npm test -- --passWithNoTests
npx expo start
```

## Build APK
Workflow `.github/workflows/android-apk.yml` menjalankan Expo prebuild dan Gradle `assembleDebug`, lalu mengunggah APK debug sebagai artefak jika berhasil. Jalankan melalui tab **Actions** atau push tag versi. APK debug untuk pengujian bukan APK release bertanda tangan untuk distribusi publik.

## Batasan yang diketahui
- Sinkronisasi antarperangkat, akun cloud, OAuth, AI generatif, dan integrasi penerbitan media sosial otomatis belum aktif.
- Konektor sosial membuka layanan resmi atau memunculkan menu berbagi; tidak membaca pesan privat atau menerbitkan konten diam-diam.
- Pemeriksaan Trust bersifat heuristik, bukan pemeriksaan reputasi real-time.
- Notifikasi memerlukan izin pengguna dan perlu diuji di perangkat Android.
- Jangan commit keystore, kata sandi, token, atau kredensial server ke repository.

Periksa tab **Actions** untuk status build yang sebenarnya. Jangan menganggap APK berhasil dibuat sebelum artefak tersedia.
