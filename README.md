# SATUOS
**Satu Aplikasi, Banyak Solusi.**

SATUOS adalah aplikasi Android local-first berbasis Expo, React Native, dan TypeScript. Fondasi awal ini memprioritaskan pencatatan keuangan, tugas, aset, pemeriksaan tautan, draf konten, dan konektor berbagi yang dapat digunakan tanpa akun cloud.

## Status saat ini
- Fondasi aplikasi dan modul lokal: implementasi awal.
- Database SQLite: penyimpanan lokal persisten melalui migrasi.
- Koneksi platform: membuka tautan resmi dan berbagi melalui menu berbagi perangkat; bukan integrasi publikasi otomatis.
- Sinkronisasi cloud, OAuth, AI generatif online, serta API sosial: belum dikonfigurasi.
- APK release: dibuat oleh workflow GitHub Actions; periksa tab Actions untuk hasil nyata.

## Menjalankan
Memerlukan Node.js LTS dan npm:
```bash
npm install
npx expo start
```

## Build APK
Workflow `.github/workflows/android-apk.yml` menjalankan pemeriksaan TypeScript dan membuat APK Android melalui EAS Build dengan profil internal. Konfigurasi EAS perlu disiapkan pada akun build yang sah; jangan simpan kredensial atau keystore di repository.

## Privasi
Data inti disimpan di perangkat. Berbagi ke aplikasi lain hanya terjadi setelah pengguna memilih tindakan berbagi. Jangan masukkan PIN bank atau kata sandi platform sosial.
