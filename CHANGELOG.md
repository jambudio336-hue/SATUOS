## 1.2.0 — 2026-10-13

- Identitas M4zk1pL4y.Dev ditampilkan pada dashboard dan seluruh modul, dengan versi Android dinaikkan ke versionCode 3.
- Penyegaran aksen premium bernuansa emas, animasi tekan/ripple pada kartu dan tombol utama, serta navigasi bawah yang lebih responsif.
- Catatan keluarga dapat dihapus per item setelah konfirmasi; transaksi tetap mendukung penghapusan.
- Status koneksi platform sosial tetap dinyatakan apa adanya: layanan dapat dibuka dan konten dibagikan, tetapi OAuth/sinkronisasi akun belum dikonfigurasi.

# Changelog SATUOS

Perubahan penting dicatat di sini.

## [1.1.0] — 2026-10-12

- Merombak dashboard dengan kartu ringkasan, aktivitas terbaru, pencarian modul, status koneksi, dan aksi cepat.
- Menambahkan generator laporan PDF bertajuk pilihan pengguna, tabel terstruktur untuk seluruh kategori data lokal, escaping aman untuk konten pengguna, dan opsi menyimpan berkas.
- Mengganti pemutar usang `expo-av` dengan `expo-audio` dan `expo-video`; intro audio diputar sekali selama 10 detik pada first launch.
- Memperbarui proyek dari Expo SDK 53 ke SDK 57, React Native 0.86, router, storage, notifikasi, modul native, dan tooling yang kompatibel.
- Memperbarui Android `versionCode` menjadi 2 serta memperbaiki konfigurasi splash screen dan TypeScript untuk SDK baru.
- Memperkuat tes unit laporan PDF, validasi HTML dinamis, dokumentasi atribusi audio, dan panduan signing APK.

## [1.0.0]

- Dashboard local-first dan modul SATU Money, SATU Business, SATU Social, SATU Trust, SATU AI, Family & Team, SATU Wealth, SATU Automation, Laporan, dan Pengaturan.
- SQLite lokal, ekspor CSV/JSON, backup dan pemulihan lokal.
- GitHub Actions untuk quality checks dan build APK Android.
