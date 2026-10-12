# SATUOS
**Satu Aplikasi, Banyak Solusi.**

SATUOS adalah aplikasi Android local-first berbasis Expo, React Native, TypeScript, dan SQLite. Fitur lokal tidak memerlukan akun cloud atau API key berbayar. Semua antarmuka dan dokumentasi pengguna menggunakan Bahasa Indonesia.

## Identitas aplikasi

| Properti | Nilai |
|---|---|
| Package Android | `id.mazkiplay.satuos` |
| Versi awal | `1.0.0` |
| Mata uang | Rupiah (IDR) |
| Zona waktu | Asia/Jakarta |
| Mode | Offline-capable, online-enhanced, modular |

## Modul

SATUOS menyediakan dashboard dan modul **SATU Money**, **SATU Business**, **SATU Social**, **SATU Trust**, **SATU AI lokal**, **Family & Team**, **Tugas & Tim**, **SATU Wealth**, **SATU Automation**, **Laporan SATUOS**, dan **Pengaturan**. Modul inti membaca serta menulis data melalui repository SQLite lokal, bukan data hardcoded pada dashboard.

## Intro first launch

Pada instalasi pertama, SATUOS memutar intro anime portrait selama tepat 7 detik dengan logo SATUOS dan motif mata bercahaya. Intro berjalan otomatis tanpa tombol pause, stop, skip, atau lewati. Penanda lokal disimpan setelah video selesai sehingga intro tidak diulang pada pembukaan berikutnya.

## Struktur repository

```text
app/                 Layar Expo Router dan modul aplikasi
components/          Komponen UI lintas layar, termasuk intro first-launch
lib/                 Database, format angka, dan helper platform
assets/              Ikon launcher, splash, dan video intro
__tests__/            Tes unit
.github/workflows/   Quality gate dan build APK Android
docs/                Status implementasi dan release
plan.md              Rencana arsitektur dan keputusan desain
TODO.md              Pekerjaan dan batasan yang masih terbuka
CHANGELOG.md         Riwayat perubahan
LICENSE              Lisensi MIT
```

## Menjalankan lokal

Memerlukan Node.js LTS dan npm:

```bash
npm install
npx expo install --check
npx tsc --noEmit
npm test -- --passWithNoTests
npx expo start
```

## Build dan unduh APK

Workflow [`.github/workflows/android-apk.yml`](.github/workflows/android-apk.yml) berjalan pada push ke `main`, tag `v*`, atau manual melalui GitHub Actions. Workflow memeriksa TypeScript, tes otomatis, kompatibilitas dependency Expo, lalu membuat APK debug dan mengunggahnya sebagai artifact.

APK **release bertanda tangan** hanya dibuat jika tiga repository secrets signing telah dikonfigurasi: `SATUOS_KEYSTORE_BASE64`, `SATUOS_KEYSTORE_PASSWORD`, dan `SATUOS_KEY_PASSWORD`. Workflow menemukan alias key langsung dari keystore, jadi secret alias lama tidak digunakan. Setelah secrets valid, tag versi seperti `v1.0.1` akan memublikasikan `app-release.apk` di [GitHub Releases](https://github.com/jambudio336-hue/SATUOS/releases). Panduan lengkap tersedia di [`docs/RELEASE-APK.md`](docs/RELEASE-APK.md).

## Batasan yang diketahui

Sinkronisasi antarperangkat, autentikasi cloud, OAuth, AI generatif, integrasi penerbitan media sosial otomatis, pembayaran, dan integrasi bank belum aktif. Konektor sosial hanya membuka layanan resmi atau berbagi secara eksplisit. Pemeriksaan Trust bersifat heuristik lokal. Jangan commit keystore, kata sandi, token, atau kredensial server ke repository.

## Dokumen proyek

Lihat [`plan.md`](plan.md), [`TODO.md`](TODO.md), [`CHANGELOG.md`](CHANGELOG.md), [`docs/STATUS.md`](docs/STATUS.md), dan [`docs/RELEASE-APK.md`](docs/RELEASE-APK.md).
