# Panduan APK release SATUOS

## Status build

- Setiap push ke `main` menjalankan pemeriksaan dan membangun APK debug untuk pengujian.
- APK release bertanda tangan hanya dibuat jika empat GitHub Actions Secrets signing telah diatur.
- Tag versi seperti `v1.0.1` memublikasikan APK release ke halaman GitHub Releases apabila build release bertanda tangan berhasil.
- Jangan pernah commit keystore atau kata sandinya ke repository.

## Menyiapkan keystore dengan aman

Jalankan di komputer sendiri yang memasang JDK. Simpan berkas keystore di lokasi privat, bukan di folder repository:

```bash
keytool -genkeypair -v -keystore satuos-release.jks -alias satuos -keyalg RSA -keysize 2048 -validity 10000
```

Ingat dan simpan kata sandi serta alias dengan aman. Kehilangan keystore dapat menghalangi pembaruan aplikasi yang ditandatangani dengan identitas yang sama.

Ubah keystore menjadi Base64 untuk dimasukkan sebagai secret:

Linux:
```bash
base64 -w 0 satuos-release.jks
```

macOS:
```bash
base64 < satuos-release.jks | tr -d '\\n'
```

## Menambahkan GitHub Actions Secrets

Di repo SATUOS, buka **Settings → Secrets and variables → Actions → New repository secret**. Buat secret berikut:

- `SATUOS_KEYSTORE_BASE64`: hasil Base64 dari berkas `.jks`.
- `SATUOS_KEYSTORE_PASSWORD`: kata sandi keystore.
- `SATUOS_KEY_ALIAS`: alias, misalnya `satuos`.
- `SATUOS_KEY_PASSWORD`: kata sandi key.

Jangan kirim nilai secret ke chat, issue, log, atau source code.

## Build dan unduh

1. Pastikan workflow Actions sudah aktif.
2. Push perubahan ke branch `main` untuk menjalankan tes dan build APK debug.
3. Untuk release, setelah secret siap, buat tag versi baru, misalnya `v1.0.1`, lalu push tag tersebut.
4. Buka tab **Actions** dan pastikan seluruh job berstatus sukses.
5. Unduh APK debug dari bagian Artifacts pada workflow run untuk pengujian.
6. Untuk release, buka halaman **Releases** dan unduh `app-release.apk` setelah file benar-benar tersedia.

APK debug bukan pengganti APK release bertanda tangan. Jangan menyebut release berhasil sampai workflow sukses dan APK release tersedia.
