# Panduan APK release SATUOS

## Persyaratan dan quality gate

Proyek menggunakan Expo SDK 57, Node.js 22, dan Java 17 pada GitHub Actions. Workflow memeriksa dependency Expo, Expo Doctor, TypeScript, dan tes otomatis sebelum prebuild Android. Setiap push ke `main` membangun APK debug. Tag versi seperti `v1.1.0` membangun APK release bertanda tangan apabila repository secrets tersedia.

## Menjaga signing key

Keystore menentukan identitas pembaruan aplikasi. Kehilangan kunci dapat membuat APK berikutnya tidak dapat memperbarui instalasi yang ditandatangani dengan key tersebut. Simpan keystore dan password di tempat privat yang aman; jangan commit, kirim ke issue, atau tampilkan di log.

Contoh pembuatan keystore lokal dengan JDK:

```bash
keytool -genkeypair -v -keystore satuos-release.jks -alias satuos -keyalg RSA -keysize 2048 -validity 10000
```

Konversi ke Base64 tanpa memecah baris:

```bash
# Linux
base64 -w 0 satuos-release.jks

# macOS
base64 < satuos-release.jks | tr -d '\n'
```

## GitHub Actions secrets

Di repository SATUOS buka **Settings → Secrets and variables → Actions** lalu simpan tiga secrets berikut: `SATUOS_KEYSTORE_BASE64` (isi Base64 `.jks`), `SATUOS_KEYSTORE_PASSWORD`, dan `SATUOS_KEY_PASSWORD`. Alias pertama dibaca workflow dari keystore; password key harus cocok dengan alias tersebut. Jangan menyimpan password dalam README atau file workflow.

## Build dan unduh

1. Pastikan quality workflow berhasil di branch `main`.
2. Push tag versi yang belum pernah digunakan, misalnya `v1.1.0`.
3. Pantau tab **Actions** sampai build release bertanda tangan sukses.
4. Unduh APK dari artifact workflow untuk debug, atau buka **Releases** untuk APK release publik.

Workflow tidak memublikasikan APK release ketika secret signing tidak tersedia atau build gagal. APK debug bukan pengganti release bertanda tangan.
