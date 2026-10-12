# Catatan pemeriksaan keamanan

Diperiksa pada 12 Oktober 2026 menggunakan `npm audit` setelah dependency lock bersih.

Audit melaporkan **65 advisori pada seluruh dependency tree: 17 moderate, 48 high, 0 critical**. `npm audit --omit=dev` melaporkan 43 advisori pada graf package non-dev (17 moderate, 26 high); angka ini bukan berarti semuanya masuk ke binary Android. Sebagian temuan berada pada toolchain Expo CLI/Metro/Jest, sementara beberapa terkait React Native/Worklets dan modul build.

Perbaikan aman otomatis (`npm audit fix`) tidak dapat menyelesaikan seluruh temuan. `npm audit fix --force` menawarkan perubahan mayor yang menurunkan Expo ke SDK 44 atau mengganti paket native ke versi yang tidak cocok dengan SDK57, sehingga **tidak diterapkan**. Versi SDK57 yang dipilih adalah versi Expo stable/latest yang tersedia saat pemeriksaan (`expo@57.0.27`, `expo-router@57.0.25`); Expo Doctor lulus 21/21 dan dependency Expo berada pada versi yang kompatibel. Jest30 juga dikecualikan dari pemeriksaan versi Expo karena versi ini lulus tes tetapi SDK57 menyarankan Jest29.

Dampak: proyek telah diperiksa, tetapi **tidak dinyatakan bebas kerentanan**. Tinjau kembali advisory upstream dan jalankan `npm audit` sebelum setiap rilis; perbarui Expo/RN ketika patch yang kompatibel tersedia. Jangan menjalankan `npm audit fix --force` tanpa mengulang seluruh tes, pemeriksaan native, dan build.
