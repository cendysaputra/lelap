# Status Pengerjaan LELAP

Dokumen ini adalah handoff untuk agent berikutnya. Selalu baca `AGENTS.md`
terlebih dahulu karena file tersebut merupakan sumber aturan utama proyek.

## Urutan dokumen yang wajib dibaca

1. `AGENTS.md`
2. `plan/03-build.md`, terutama Tahap 1 sampai Tahap 4
3. `plan/04-finalisasi.md`
4. File sumber yang berhubungan langsung dengan tugas yang akan dikerjakan

Jangan mengerjakan Level 2, save game, kontrol mobile, deployment, test suite,
TypeScript, dependency baru, audio tambahan selain musik menu `deep-pulse`,
atau refactor di luar masalah yang sedang diperbaiki tanpa instruksi pengguna.

## Posisi proyek saat ini

Proyek telah mencapai **`plan/03-build.md` Tahap 4** dan mendapat beberapa
penyempurnaan menu serta aset pada **23 September 2026**, tetapi belum memenuhi
seluruh definisi selesai pada Tahap 1 dan Tahap 4. `plan/04-finalisasi.md`
belum selesai dan proyek belum boleh dianggap siap deploy.

Pipeline aset dan build production terakhir berhasil:

```text
npm run assets
43 diproses, 0 dilewati, 0 peringatan

npm run build
31 modules transformed
build selesai tanpa error
```

## Yang sudah tersedia

- Setup KAPLAY, Vite, JavaScript, dan Sharp.
- Pemrosesan aset melalui `tools/assets.js`.
- `public/manifest.json` berisi 41 sprite/background dan 1 musik streaming.
  Favicon diproses terpisah oleh pipeline menjadi `public/favicon.png`.
- Loading scene, menu, panel Cara Main, fullscreen, dan UI dasar.
- Loader level berbasis simbol, validasi baris, tile, solid, platform satu
  arah, dekor deterministik, dan Level 1 bernama "Mimpi Buruk".
- Player: jalan, lari, stamina, lompat, coyote time, lemari, kalah karena
  hantu atau jatuh, dan menang saat menyentuh boneka. Walk cycle telah memakai
  8 frame pada 6 FPS saat berjalan dan 10 FPS saat berlari.
- Background tiga lapis, kamera, dan darkness overlay.
- Ketiga hantu: Pengembara, Pengintai, dan Bayangan.
- Lemari, lampu sebagai zona aman, boneka sebagai tujuan, game over, win,
  dan pause.
- Menu memakai asap animasi 30 frame pada 10 FPS, gerakan background halus,
  cahaya bulan berdenyut, serta lima cahaya lampu yang berkedip tidak serempak.
- Musik `deep-pulse` dimainkan berulang di menu setelah interaksi pertama
  pengguna, di-pause ketika tombol `MULAI` ditekan, dan dapat dilanjutkan saat
  kembali ke menu tanpa membuat instance ganda.
- Logo menu diperbesar dengan skala `0.30`. Favicon bulan dan hantu 128×128
  tersedia dan terhubung dari `index.html`.
- Aset musik dan favicon sudah dipindahkan dari root ke `assets-src/` serta
  diproses otomatis ke `public/`.
- Semua file di dalam `src/` masih di bawah 200 baris; file terpanjang saat
  audit terakhir adalah `src/entities/player.js` dengan 124 baris.

## Kekurangan yang sudah diketahui

### Penyesuaian kesulitan Level 1 — 23 September 2026

Revisi lanjutan berdasarkan feedback objek terlalu rapat dan hantu terlalu
rendah: dekor kecil/besar serta meja kedua dikeluarkan dari peta; jarak
horizontal minimum antar tepi objek sekarang 256 unit (4 tile), berdasarkan
ukuran manifest. Rak kedua dipindah setelah jurang kedua. Pengembara naik
1 tile, sehingga posisi kakinya 128 unit di atas lantai; player di lantai
tidak langsung masuk batas deteksi vertikal patrol. Patroli 80, kejar 300,
jangkauan patroli/penglihatan 256, peringatan 0,8 detik. Pengintai memiliki
jangkauan 384 dan kecepatan 140. Validasi peta, dukungan lantai, jarak objek,
dan build berhasil; revisi lanjutan ini belum dimainkan ulang di browser.
Catatan di bawah merekam pemeriksaan sebelum revisi lanjutan tersebut.

- Jurang pertama 1 tile, kedua 2 tile; area ancang-ancang dan pendaratan kosong.
- Rak berada 89 unit di atas lantai. Meja berdiri di lantai (permukaan
  117,75 unit), bukan di atas jurang. Dekor, lampu, dan lemari diberi ruang.
- Collision rak/meja memakai aturan pendaratan dari atas karena effector
  bawaan KAPLAY 3001 menolak body yang sedang jatuh.
- Pengembara mengejar dengan kecepatan 330 dan peringatan 0,6 detik;
  Pengintai bergerak 160; Bayangan memberi peringatan 0,7 detik.
- Sesuai permintaan terbaru pengguna, hantu bergerak menjauh dari lampu
  tanpa berhenti di tepinya. Gerakan mundur dipertahankan sampai keluar
  dari radius tolak ditambah 128 unit agar tidak bergetar di batas cahaya.
- Verifikasi browser terarah: keempat platform berhasil diinjak setelah
  melompat dari bawah; jurang 1 tile lolos sambil berjalan; jurang 2 tile
  lolos sambil berlari; Pengembara dan Pengintai menjauh saat dekat lampu.
  Tidak ada error browser yang dilaporkan. Build production berhasil.
- Pemeriksaan ini memakai penempatan player terkontrol, bukan permainan
  lengkap dari awal sampai akhir; checklist finalisasi tetap belum selesai.

### Sebelum menyatakan Tahap 1 selesai

- UI dihitung hanya saat scene dibuat. Resize window atau toggle fullscreen
  saat scene sedang terbuka belum menghitung ulang posisi dan skala seluruh
  UI. `src/main.js` hanya mengubah CSS variable `--world-scale`, sedangkan
  komponen UI tidak menggunakannya.
- Panel Cara Main belum memasang navigasi keyboard untuk tombol `TUTUP`.
  Navigasi tombol menu di belakang panel juga masih aktif.
- Scene win membuat tombol `MENU`, tetapi belum memanggil navigasi keyboard.
- Background game membuat jumlah gambar berulang berdasarkan lebar awal;
  perubahan ukuran window yang lebih lebar perlu diperiksa agar tidak
  menampilkan ruang kosong.

### Sebelum menyatakan Tahap 4 selesai

- Transisi antarscene hanya fade keluar; belum ada fade masuk yang konsisten.
- Boneka sudah melayang, tetapi belum memiliki kilau kecil seperti instruksi.
- Durasi Level 1 sekitar dua menit belum diverifikasi dengan permainan nyata.
- Perilaku lemari, batas cahaya lampu, dan seluruh AI hantu masih perlu diuji
  langsung dari menu sampai menang.
- Keterbacaan player/hantu dalam darkness dan kualitas parallax belum
  diverifikasi secara visual.

### Plan 04 yang belum selesai

- Checklist manual di `plan/04-finalisasi.md` belum dijalankan dua kali dari
  menu sampai menang.
- Belum ada bukti pengujian minimal dua browser.
- `package.json` belum memiliki script `preview`, sehingga `npm run preview`
  belum tersedia.
- `README.md` belum berisi petunjuk install serta penggunaan `npm run assets`,
  `npm run dev`, `npm run build`, dan kontrol dalam format handoff teknis yang
  diminta finalisasi.
- Masih ada banyak angka tuning di luar `src/config.js`. Audit dahulu dan
  pindahkan hanya angka yang benar-benar merupakan tuning perilaku/visual.
- Pembersihan awal root sudah dilakukan: folder paket walk-cycle, folder
  `player-frame`, folder `backup`, serta duplikat root yang sudah dipindahkan
  ke pipeline aset telah dihapus. Audit akhir kode/aset tidak terpakai tetap
  belum selesai; `public/bg/title-asap.webp` masih perlu dinilai karena runtime
  memakai spritesheet `public/bg/title-asap.png`.

### Snapshot ukuran production terakhir

- Total `dist/`: 29.910.023 byte (sekitar 28,5 MiB), 49 file.
- Lima file terbesar:
  - `dist/bg/title-asap.png`: 5.942.598 byte
  - `dist/music/deep-pulse.mp3`: 5.333.611 byte
  - `dist/bg/title-asap.webp`: 3.408.774 byte
  - `dist/ui/logo.png`: 3.167.625 byte
  - `dist/ui/panel.png`: 2.891.252 byte

## Kondisi Git yang perlu dijaga

Working tree masih berisi perubahan aktif milik pengguna dan hasil pekerjaan
terbaru. Jangan me-reset atau mengembalikan perubahan tersebut. Perubahan yang
memang disengaja antara lain:

- penggantian `assets-src/bg/near.png`;
- walk cycle player 8 frame dan hasil prosesnya di `public/player/`;
- spritesheet asap menu, musik menu, serta favicon;
- penghapusan `player-frame/`, `deep-pulse.mp3`, dan `title-asap.webp` dari
  root setelah sumber resminya dipindah ke `assets-src/`;
- sistem suasana menu, sistem musik, dan helper pipeline aset baru.

Gunakan `git status --short` sebelum perubahan berikutnya dan pertahankan
semua perubahan di atas kecuali pengguna meminta lain.

## Langkah yang disarankan untuk agent berikutnya

1. Baca `AGENTS.md` dan bagian terkait di `plan/03-build.md` secara penuh.
2. Perbaiki kekurangan Tahap 1 yang dapat diverifikasi dari kode: resize UI,
   navigasi keyboard panel Cara Main, dan navigasi keyboard scene win.
3. Perbaiki kekurangan Tahap 4 yang eksplisit: fade masuk dan kilau boneka.
4. Jalankan `npm run assets` lalu `npm run build` dan pastikan tidak ada
   peringatan atau error baru.
5. Ikuti checklist manual `plan/04-finalisasi.md` dari awal sampai akhir.
   Catat hasil nyata; jangan mencentang berdasarkan keberadaan kode saja.
6. Perbaiki satu bug per perubahan agar tidak melebar dari scope.
7. Setelah gameplay lolos, lakukan bagian "Pembersihan akhir" Plan 04,
   tambahkan script preview dan dokumentasi teknis yang diminta, lalu uji
   versi production.

## Definisi selesai berikutnya

Tahap selanjutnya baru boleh disebut selesai apabila:

- Semua acceptance criteria Tahap 1 sampai Tahap 4 terbukti bekerja saat
  dimainkan.
- Seluruh checklist manual Plan 04 telah diperiksa, bukan diasumsikan.
- `npm run build` dan `npm run preview` berhasil.
- Versi preview berjalan sama dengan versi development tanpa error console.
- Game telah dicoba di minimal dua browser desktop.
