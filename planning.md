# Status Pengerjaan LELAP

Dokumen ini adalah handoff proyek per 23 September 2026. `AGENTS.md` adalah
sumber aturan utama. Catatan di bawah berasal dari pemeriksaan source dan build;
hasil uji browser lama disebut terpisah agar tidak dianggap verifikasi terbaru.

## Urutan baca

1. `AGENTS.md`
2. `plan/03-build.md`, terutama Tahap 1–4
3. `plan/04-finalisasi.md`
4. Source yang terkait pekerjaan berikutnya

Fokus tetap Level 1. Jangan menambah Level 2, save game, kontrol mobile, audio
baru, konfigurasi deploy, test suite, TypeScript, dependency, atau refactor di
luar tugas tanpa permintaan pengguna.

## Status saat ini

Implementasi telah mencapai Tahap 4, tetapi acceptance criteria Tahap 1 dan 4
belum seluruhnya terpenuhi. Finalisasi pada `plan/04-finalisasi.md` belum selesai;
Level 1 belum dinyatakan siap deploy.

- Stack KAPLAY, Vite, JavaScript, dan Sharp tersedia. `npm run assets`,
  `npm run dev`, dan `npm run build` tercantum di `package.json`.
- `public/manifest.json` memuat 41 aset visual dan satu musik. Favicon dihasilkan
  terpisah ke `public/favicon.png`.
- Scene loading, menu, game, gameover, dan win sudah ada. Menu memiliki panel
  Cara Main, tombol fullscreen, musik `deep-pulse`, animasi asap 30 frame,
  gerakan background, cahaya bulan, dan lima kedip lampu.
- Level 1 `Mimpi Buruk` berukuran 96 × 12 tile, dengan dua jurang (1 dan 2 tile),
  dua rak, satu meja, satu buku, satu kotak, tiga Pengembara, satu Pengintai,
  dua Bayangan, dua lemari, tiga lampu, dan boneka tujuan. Peta saat ini tidak
  menempatkan simbol dekor, walau loader dan aset dekor sudah tersedia.
- Player memiliki jalan, lari, stamina, lompatan, coyote time, delapan frame
  jalan, lemari, dan alur kalah/menang. Background tiga lapis, kamera, darkness,
  ketiga hantu, serta zona aman lampu sudah diimplementasikan.
- Semua file JavaScript di `src/` di bawah 200 baris. Terpanjang saat audit ini
  `src/entities/pengembara.js` (149 baris).
- `npm run build` berhasil pada pemeriksaan ini: 31 modul, tanpa error build.
  `dist/` berisi 48 file, total 24.973.858 byte (sekitar 23,8 MiB).

## Perubahan level dan hasil uji sebelumnya

Level pernah direvisi agar objek lebih renggang dan hantu lebih tinggi. Dekor
serta meja kedua dikeluarkan; rak kedua dipindah setelah jurang kedua.
Pengembara ditempatkan dengan kaki 128 unit di atas lantai. Nilai konfigurasi
yang **berlaku di source sekarang**: Pengembara patroli 80, kejar 300, jangkauan
patroli/penglihatan 256, peringatan 0,4 detik; Pengintai jangkauan 384 dan
kecepatan 140; Bayangan peringatan 0,7 detik.

Sebelum revisi lanjutan tersebut, uji browser terarah pernah mencatat empat
platform bisa diinjak dari bawah, kedua jurang bisa diseberangi, dan kedua
hantu bergerak menjauh dari lampu. Uji itu memakai penempatan player terkontrol,
bukan dua sesi permainan penuh dari menu sampai menang. Revisi level terbaru
belum diuji ulang di browser.

Perilaku lampu di source saat ini: Pengembara berhenti di batas saat jalurnya
terhalang lampu, menunggu hingga 2 detik, lalu bergerak kembali ke arah titik
patroli; Pengintai berhenti di batas. `AGENTS.md` menyebut keduanya berhenti di
tepi, sedangkan catatan perubahan sebelumnya meminta hantu menjauh. Pastikan
perilaku yang diinginkan saat uji gameplay sebelum mengubahnya lagi.

## Kekurangan yang perlu ditangani

### Tahap 1 — layar dan UI

- UI menghitung posisi/skala saat scene dibuat. `src/main.js` memperbarui CSS
  variable `--world-scale` pada resize, tetapi komponen UI tidak memakainya.
  Periksa dan perbaiki tata letak serta hitbox tombol saat resize/fullscreen.
- Panel Cara Main belum memberi fokus keyboard ke `TUTUP`; navigasi tombol menu
  di belakang panel masih aktif. Scene win belum mengaktifkan navigasi keyboard
  untuk `MENU`.
- Background game membuat jumlah pengulangan dari lebar awal. Periksa resize
  ke jendela lebih lebar agar tidak ada ruang kosong.

### Tahap 4 — penyelesaian Level 1

- Transisi antarscene baru fade keluar; fade masuk yang konsisten belum ada.
- Boneka sudah melayang, tetapi belum punya kilau kecil.
- Mainkan ulang dari menu sampai menang untuk memeriksa lemari, batas lampu,
  seluruh AI hantu, keterbacaan dalam darkness, parallax, dan durasi sekitar
  dua menit. Penempatan serta tuning terbaru belum lolos pemeriksaan ini.

### Finalisasi

- Checklist manual `plan/04-finalisasi.md` belum diselesaikan dua kali dari menu
  sampai menang dan belum ada hasil uji dua browser desktop.
- `package.json` belum memiliki script `preview`; `npm run preview` belum bisa
  digunakan untuk memeriksa build production.
- `README.md` berisi pengenalan dan kontrol, tetapi belum memuat cara install
  serta perintah `npm run assets`, `npm run dev`, dan `npm run build`.
- Angka tuning masih tersebar di luar `src/config.js`; audit angka yang benar
  benar memengaruhi perilaku/visual, lalu pindahkan yang relevan.
- Audit akhir kode dan aset yang tidak dipakai belum selesai. Source asap
  `assets-src/bg/title-asap.webp` masih diperlukan oleh pipeline; output runtime
  yang tercatat di manifest adalah `public/bg/title-asap.png`.

## Urutan kerja berikutnya

1. Selesaikan isu Tahap 1 yang terlihat di kode: resize UI dan background,
   fokus keyboard panel Cara Main, lalu navigasi scene win.
2. Tambahkan fade masuk dan kilau boneka sesuai Tahap 4.
3. Jalankan `npm run assets` dan `npm run build`; catat jumlah pemrosesan dan
   peringatan aktual, karena hasil pipeline aset lama tidak diuji ulang di sini.
4. Mainkan checklist `plan/04-finalisasi.md` dari menu sampai menang minimal
   dua kali. Catat kegagalan yang benar benar terlihat dan perbaiki satu bug
   per perubahan.
5. Setelah gameplay lolos, lakukan pembersihan akhir, lengkapi README, tambah
   script `preview`, dan uji build production di dua browser desktop.

Tahap berikutnya selesai hanya setelah acceptance criteria Tahap 1–4 terbukti
saat dimainkan, checklist manual terisi berdasarkan hasil nyata, build dan
preview berhasil tanpa error console, serta uji dua browser selesai.

## Catatan Git dan ukuran build

`git status --short` bersih saat audit ini. Jangan me-reset atau menghapus aset
dan perubahan proyek tanpa memeriksa kebutuhan runtime/pipeline.

Lima file terbesar pada `dist/` hasil build saat audit:

| File | Byte |
|---|---:|
| `bg/title-asap.png` | 5.942.598 |
| `music/deep-pulse.mp3` | 5.333.611 |
| `ui/panel.png` | 2.891.252 |
| `bg/mid.png` | 2.104.593 |
| `ui/logo.png` | 1.638.079 |
