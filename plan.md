# Rencana SATUOS v1.0.0

## Tujuan
SATUOS adalah aplikasi Android local-first berbahasa Indonesia untuk produktivitas, keuangan, usaha, keluarga, keamanan digital, dan asisten pribadi.

## Arsitektur
- **Mobile:** Expo Router, React Native, TypeScript strict, NativeWind-compatible styling.
- **Data:** SQLite lokal melalui repository di `lib/database.ts`; data inti tetap tersedia offline.
- **Platform:** Android package `id.mazkiplay.satuos`.
- **Build:** GitHub Actions melakukan typecheck, test, pemeriksaan Expo, prebuild Android, dan upload APK.
- **Branding:** aset logo tersimpan di `assets/images/`; intro video lokal di `assets/intro-satuos.mp4`.

## Desain
- **Gerakan desain:** premium dark cyber-productivity dengan nuansa neon violet/blue.
- **Prinsip:** fokus pada keterbacaan, satu tangan, kartu informatif, dan feedback status yang jelas.
- **Warna:** navy-hitam sebagai ruang tenang; oranye sebagai aksi; violet/biru sebagai identitas teknologi dan intro.
- **Layout:** dashboard berbasis ruang kerja dan kartu modular, dengan navigasi bawah yang mudah dijangkau.
- **Elemen khas:** logo play-metallic, garis cahaya neon, dan kartu gelap dengan aksen oranye.
- **Interaksi:** setiap aksi penting harus eksplisit, bisa dipulihkan, dan memberi status sukses/gagal/offline.
- **Animasi:** intro first-launch 7 detik autoplay tanpa kontrol; animasi aplikasi tetap singkat dan tidak mengganggu.
- **Tipografi:** sans-serif sistem, heading tegas, label ringkas, angka finansial besar dan mudah dipindai.
- **Esensi merek:** satu ruang kerja praktis untuk banyak kebutuhan harian; tepercaya, modular, dan membumi.
- **Suara merek:** langsung dan membantu. Contoh: “Semua yang penting, dalam satu ruang kerja.” dan “Data tetap milikmu, bahkan saat offline.”

## Struktur utama
```text
app/                 Layar Expo Router dan modul aplikasi
components/          Komponen UI lintas layar, termasuk intro first-launch
lib/                 Database, format angka, helper platform
assets/              Ikon launcher, splash, dan video intro
__tests__/            Tes unit
.github/workflows/   Quality gate dan build APK Android
docs/                Status, release, dan catatan operasional
```

## Keputusan perilaku intro
Intro hanya ditampilkan saat key `@satuos/intro-seen-v1` belum tersimpan. Video berjalan otomatis, tidak menampilkan kontrol, tidak menyediakan pause/skip/stop, dan selesai setelah playback berakhir. Fallback 7,5 detik mencegah aplikasi terkunci bila decoder perangkat gagal.

## Batasan release
APK release bertanda tangan membutuhkan secrets signing di GitHub Actions. APK debug tetap dibuat otomatis untuk pengujian. Nilai secret tidak pernah dimasukkan ke source code.
