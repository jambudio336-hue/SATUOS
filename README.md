# SATUOS

**Satu Aplikasi, Banyak Solusi.**

SATUOS adalah aplikasi Android local-first berbasis Expo, React Native, TypeScript, dan SQLite. Fitur inti tetap dapat digunakan tanpa akun cloud atau API key berbayar. Antarmuka aplikasi menggunakan Bahasa Indonesia.

## Yang baru di 1.1.0

- Dashboard baru dengan ringkasan keuangan, aktivitas terbaru, pencarian modul, dan aksi cepat.
- Laporan PDF bertajuk pilihan pengguna, berisi ringkasan dan tabel dari data seluruh modul lokal. Di Android, pengguna dapat memilih folder Unduhan atau folder lain; di iOS PDF dibagikan melalui lembar berbagi.
- Intro first-launch memakai video SATUOS dan potongan audio 10 detik. Intro tampil hanya pada pembukaan pertama setelah instalasi.
- Dependency aplikasi diselaraskan ke Expo SDK 57 dan modul audio/video Expo yang terpelihara.

## Identitas aplikasi

| Properti | Nilai |
|---|---|
| Package Android | `id.mazkiplay.satuos` |
| Versi | `1.1.0` |
| Mata uang | Rupiah (IDR) |
| Penyimpanan inti | SQLite lokal pada perangkat |
| Runtime | Expo SDK 57, React Native 0.86 |

## Modul

SATUOS mencakup dashboard; SATU Money; SATU Business; SATU Social; SATU Trust; Jarvis · SATU AI lokal; Family & Team; Tugas & Tim; SATU Wealth; SATU Automation; Laporan SATUOS; dan Pengaturan. Pencatatan bisnis/keuangan, pengingat lokal, draf sosial, backup JSON/CSV, dan laporan PDF bekerja dengan data pada perangkat.

Integrasi sosial hanya membuka layanan resmi dan berbagi secara eksplisit. Aplikasi tidak mengaku terhubung ke akun sosial, bank, kalender, atau cloud tanpa autentikasi dan konektor yang benar-benar dikonfigurasi.

## Laporan PDF dan privasi

Buka **Laporan SATUOS**, masukkan judul, lalu pilih **Buat dan unduh PDF**. PDF memuat seluruh tabel lokal yang tersedia, termasuk transaksi, stok, catatan, kontak, draf, pengingat, dan ringkasan keuangan/bisnis/kekayaan. Karena itu, periksa isinya dan simpan di folder privat sebelum membagikan. Dokumen ini bersifat informatif, bukan laporan pajak atau akuntansi resmi.

## Intro audio dan atribusi

Audio intro adalah potongan 10 detik dari audio yang diberikan pemilik proyek dan dicatat pada [`assets/audio/CREDITS.md`](assets/audio/CREDITS.md). Audio pihak ketiga tidak otomatis tercakup oleh lisensi MIT. Pastikan izin distribusi aset tersebut tersedia sebelum memublikasikan build publik.

## Menjalankan dan memeriksa

Memerlukan Node.js 22 dan npm:

```bash
npm ci
npx expo install --check
npx --yes expo-doctor
npm run typecheck
npm test
npm run lint
npx expo start
```

## Build dan unduh APK

GitHub Actions pada [`android-apk.yml`](.github/workflows/android-apk.yml) memeriksa proyek serta menghasilkan APK debug. APK release bertanda tangan memerlukan repository secrets `SATUOS_KEYSTORE_BASE64`, `SATUOS_KEYSTORE_PASSWORD`, dan `SATUOS_KEY_PASSWORD`. Workflow hanya mengunggah APK release ke GitHub Releases saat tag versi dipush dan signing berhasil.

Baca [panduan build APK](docs/RELEASE-APK.md). Jangan pernah menyimpan keystore, password, token, atau credential di source control.

## Lisensi

Kode SATUOS menggunakan MIT; lihat [`LICENSE`](LICENSE). Hak atas audio pihak ketiga mengikuti pemegang haknya dan bukan diberikan oleh lisensi proyek.

## Dokumen proyek

Baca [`CHANGELOG.md`](CHANGELOG.md), [`docs/STATUS.md`](docs/STATUS.md), [`docs/SECURITY.md`](docs/SECURITY.md), [`docs/RELEASE-APK.md`](docs/RELEASE-APK.md), [`plan.md`](plan.md), dan [`TODO.md`](TODO.md).
