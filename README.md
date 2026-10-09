# SATUOS
**Satu Aplikasi, Banyak Solusi.**

SATUOS adalah aplikasi Android local-first berbasis Expo, React Native, TypeScript, dan SQLite. Fondasi awal memprioritaskan pencatatan keuangan, stok usaha, tugas, aset, pemeriksaan pola mencurigakan, draf konten, serta pembuka tautan platform.

## Status implementasi
- Dashboard dan modul awal sudah ditulis di repository.
- Data inti menggunakan SQLite lokal.
- Konektor sosial membuka situs resmi dan memakai menu berbagi perangkat; tidak mengklaim penerbitan otomatis.
- Sinkronisasi cloud, OAuth sosial, AI generatif, dan API penerbitan resmi belum diaktifkan.
- Build APK belum dianggap berhasil sampai workflow GitHub Actions selesai dan menghasilkan artefak.

## Menjalankan lokal
Memerlukan Node.js LTS dan npm:
```bash
npm install
npx expo install --check
npx tsc --noEmit
npx expo start
```

## Build APK
Workflow `.github/workflows/android-apk.yml` menjalankan Expo prebuild dan Gradle `assembleDebug`, lalu mengunggah APK debug sebagai artefak Actions jika berhasil. Jalankan melalui tab **Actions** atau push tag versi. APK debug untuk pengujian bukan APK release bertanda tangan untuk distribusi publik.

APK release membutuhkan konfigurasi signing yang aman. Jangan unggah keystore, kata sandi, atau token ke repository.

## Privasi
Data inti disimpan di perangkat. Berbagi ke aplikasi lain hanya terjadi setelah pengguna memilih tindakan berbagi. Jangan masukkan PIN bank atau kata sandi platform sosial.
