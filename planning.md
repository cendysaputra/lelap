# Status Pengerjaan LELAP

Dokumen ini adalah handoff untuk agent berikutnya. Selalu baca `AGENTS.md`
terlebih dahulu karena file tersebut merupakan sumber aturan utama proyek.

## Urutan dokumen yang wajib dibaca

1. `AGENTS.md`
2. `plan/03-build.md`, terutama Tahap 1 sampai Tahap 4
3. `plan/04-finalisasi.md`
4. File sumber yang berhubungan langsung dengan tugas yang akan dikerjakan

Jangan mengerjakan Level 2, audio, save game, kontrol mobile, deployment,
test suite, TypeScript, dependency baru, atau refactor di luar masalah yang
sedang diperbaiki.

## Posisi proyek saat ini

Proyek telah mencapai **`plan/03-build.md` Tahap 4**, tetapi belum memenuhi
seluruh definisi selesai pada Tahap 1 dan Tahap 4. `plan/04-finalisasi.md`
belum selesai dan proyek belum boleh dianggap siap deploy.

Build production terakhir berhasil:

```text
npm run build
29 modules transformed
build selesai tanpa error
```

## Yang sudah tersedia

- Setup KAPLAY, Vite, JavaScript, dan Sharp.
- Pemrosesan aset melalui `tools/assets.js`.
- `public/manifest.json` berisi seluruh 34 aset yang tercantum dalam daftar
  aset. Catatan: `plan/02-aset.md` menulis total 33, tetapi jumlah itemnya
  sebenarnya 34.
- Loading scene, menu, panel Cara Main, fullscreen, dan UI dasar.
- Loader level berbasis simbol, validasi baris, tile, solid, platform satu
  arah, dekor deterministik, dan Level 1 bernama "Mimpi Buruk".
- Player: jalan, lari, stamina, lompat, coyote time, animasi, lemari, kalah
  karena hantu atau jatuh, dan menang saat menyentuh boneka.
- Background tiga lapis, kamera, dan darkness overlay.
- Ketiga hantu: Pengembara, Pengintai, dan Bayangan.
- Lemari, lampu sebagai zona aman, boneka sebagai tujuan, game over, win,
  dan pause.
- Semua file di dalam `src/` masih di bawah 200 baris.

## Kekurangan yang sudah diketahui

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
- Pembersihan log, kode tidak terpakai, dan aset tidak terpakai belum selesai.
- Ukuran `dist/` dan lima file terbesarnya belum dilaporkan sebagai hasil
  finalisasi.

## Kondisi Git yang perlu dijaga

Saat audit terakhir terdapat dua file untracked:

```text
public/bg/title-asap.png
title-asap.webp
```

Keduanya milik pengguna sampai terbukti sebaliknya. Jangan hapus, pindahkan,
atau memasukkannya ke manifest tanpa instruksi pengguna. `public/bg/title-asap.png`
akan ikut tersalin ke `dist/` oleh Vite walaupun tidak ada di manifest.

## Langkah yang disarankan untuk agent berikutnya

1. Baca `AGENTS.md` dan bagian terkait di `plan/03-build.md` secara penuh.
2. Perbaiki kekurangan Tahap 1 yang dapat diverifikasi dari kode: resize UI,
   navigasi keyboard panel Cara Main, dan navigasi keyboard scene win.
3. Perbaiki kekurangan Tahap 4 yang eksplisit: fade masuk dan kilau boneka.
4. Jalankan `npm run build` dan pastikan tidak ada error baru.
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

