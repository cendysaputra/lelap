# 04 — Finalisasi & Cek Bug

Dikerjakan setelah Tahap 4 di `03-build.md` selesai. Tujuannya: memastikan Level 1 siap dimainkan orang lain sebelum deploy.

---

## 1. Checklist main manual

Mainkan Level 1 dari menu sampai selesai minimal dua kali. Centang yang sudah benar, catat yang belum.

**Layar & menu**
- [ ] Menu penuh satu layar, tidak ada bingkai atau scrollbar
- [ ] Logo, tombol, dan panel memakai gambar, bukan kotak warna
- [ ] Tombol bereaksi saat hover dan ditekan, bisa dipakai dengan keyboard
- [ ] MULAI masuk layar penuh; F menyalakan/mematikan layar penuh
- [ ] Resize window atau keluar layar penuh tidak merusak tampilan
- [ ] Panel CARA MAIN bisa dibuka dan ditutup
- [ ] HUD atas tidak menutupi player: profil/stamina rata di kiri, timer di
      tengah, dan tiga ikon boneka di kanan
- [ ] Timer berhenti saat jeda dan lanjut kembali setelah LANJUT

**Gambar**
- [ ] Semua gambar tanpa latar berwarna dan tanpa kotak-kotak abu-abu
- [ ] Tidak ada gambar yang gepeng atau tertarik
- [ ] Karakter tidak bergeser atau berubah ukuran saat ganti frame
- [ ] Lantai bersambung tanpa garis atau celah
- [ ] Background tiga lapis bergerak berlapis tanpa jahitan

**Player**
- [ ] Jalan, lari, lompat terasa enak, tidak licin dan tidak lengket
- [ ] Stamina habis → hanya bisa jalan sampai pulih
- [ ] Animasi jalan, lompat, dan sembunyi tampil di saat yang benar
- [ ] Masuk dan keluar lemari lancar

**Hantu**
- [ ] Pengembara berpatroli, muncul "!", mengejar, lalu kembali
- [ ] Pengembara menoleh saat player lari di dekatnya
- [ ] Pengintai hanya bergerak saat dibelakangi, membeku saat dilihat
- [ ] Bayangan memberi peringatan sebelum muncul dan bisa dilewati dengan mengatur waktu
- [ ] Tidak ada hantu yang masuk ke cahaya lampu
- [ ] Sembunyi di lemari membuat pengembara kehilangan jejak

**Alur**
- [ ] Tersentuh hantu → panel "TERTANGKAP"
- [ ] Jatuh ke jurang → panel "JATUH KE KEGELAPAN"
- [ ] ULANG memulai level dari awal dengan semua hantu di posisi awal
- [ ] P membuka jeda; LANJUT melanjutkan, MENU kembali ke menu
- [ ] Setiap boneka mengubah satu ikon grayscale menjadi warna asli
- [ ] Tiga boneka terkumpul → portal muncul; menyentuh portal → layar menang
- [ ] Tidak ada cara terjebak (tempat yang tidak bisa dilompati keluar)

**Rasa**
- [ ] Gelap dan menyeramkan, tapi player dan hantu selalu terlihat
- [ ] Setiap kematian terasa adil — ada tanda sebelum bahaya datang
- [ ] Level bisa diselesaikan dalam sekitar 2 menit oleh orang yang baru pertama main

---

## 2. Melaporkan bug ke agent

Satu bug per pesan. Makin spesifik, makin cepat beres. Pakai template ini:

```
Baca AGENTS.md dulu. Ada bug:

Yang terjadi: [apa yang kamu lihat]
Yang seharusnya: [apa yang diharapkan, sebut aturan di AGENTS.md kalau ada]
Cara mengulang: [langkah-langkah sampai bug muncul]
Console: [tulisan merah di F12 → Console, kalau ada]

Cari penyebabnya dulu dan jelaskan, baru perbaiki. Jangan ubah hal lain
di luar bug ini.
```

Sertakan screenshot kalau bugnya visual. Tekan F1 dulu sebelum screenshot kalau masalahnya soal tabrakan atau hitbox.

**Bedakan dulu jenis masalahnya:**
- Gambar punya latar, buram, atau warnanya aneh → masalah **aset**. Perbaiki di ChatGPT, lalu `npm run assets`.
- Posisi melayang, hitbox kebesaran, hantu bergerak aneh → masalah **kode**. Laporkan ke agent.
- Terlalu susah atau terlalu gampang → masalah **angka**. Ubah sendiri di `src/config.js`.

---

## 3. Tuning cepat

Angka yang paling sering perlu diubah, semua di `src/config.js`:

| Terasa… | Ubah |
|---|---|
| pengembara terlalu cepat menangkap | turunkan `WANDERER_CHASE_SPEED` atau naikkan `WANDERER_ALERT_TIME` |
| pengembara terlalu gampang dihindari | naikkan `WANDERER_SIGHT_RANGE` |
| pengintai terlalu mengagetkan | turunkan `PEEKER_SPEED` |
| bayangan tidak bisa dilewati | naikkan `SHADOW_WARN_TIME` atau `SHADOW_COOLDOWN` |
| lampu terlalu menolong | turunkan `LAMP_RADIUS` |
| terlalu gelap | naikkan `PLAYER_LIGHT_RADIUS` |
| lompatan kurang tinggi | naikkan `JUMP_FORCE` |

---

## 4. Pembersihan akhir

Kirim ke agent setelah semua bug beres:

```
Baca AGENTS.md dulu. Lakukan pembersihan akhir tanpa mengubah perilaku game:

1. Hapus semua console.log yang tidak diperlukan. Pertahankan peringatan
   aset dan error.
2. Hapus kode, file, dan aset yang tidak dipakai.
3. Pastikan tidak ada angka tuning yang ditulis langsung di luar config.js.
4. Pastikan semua file di bawah ~200 baris; pecah yang terlalu panjang.
5. Tambahkan README.md singkat: cara install, npm run assets, npm run dev,
   npm run build, dan daftar kontrol.
6. Jalankan npm run build dan npm run preview, pastikan tidak ada error
   dan semua aset termuat di versi build.
7. Laporkan ukuran total folder dist/ dan 5 file terbesar di dalamnya.

Selesai kalau: build sukses, game di npm run preview berjalan sama persis
seperti di npm run dev, dan tidak ada error atau peringatan di console.
```

---

## 5. Siap deploy

Level 1 siap deploy kalau:
- Semua checklist di bagian 1 tercentang.
- `npm run build` sukses tanpa error.
- `npm run preview` berjalan normal.
- Sudah dicoba di minimal dua browser (misalnya Chrome dan Firefox atau Edge).

Deploy ke Vercel kamu urus sendiri. Output build ada di folder `dist/`.

---

## Status eksekusi — 24 September 2026

Pemeriksaan otomatis yang sudah selesai:

- [x] `npm run assets`: 57 aset diproses, tanpa file dilewati dan tanpa
      peringatan.
- [x] Log informasi level yang tidak diperlukan sudah dihapus; warning aset,
      fallback manifest, fullscreen, dan simbol level tetap dipertahankan.
- [x] Seluruh file JavaScript/CSS berada di bawah sekitar 200 baris.
- [x] README memuat langkah install, assets, dev, build, preview, dan kontrol.
- [x] `npm run build` berhasil tanpa error.
- [x] `npm run preview` aktif dan halaman, bundle, manifest, emblem, serta ikon
      boneka merespons HTTP 200.
- [x] Semua 57 entri manifest tersedia di dalam hasil build.
- [x] Ukuran `dist/`: 37.798.974 byte (36,05 MiB).

Lima file terbesar di `dist/`:

| File | Ukuran |
|---|---:|
| `bg/title-asap.png` | 5.942.598 byte |
| `music/deep-pulse.mp3` | 5.333.611 byte |
| `ui/logo.png` | 3.838.284 byte |
| `ui/panel.png` | 2.891.252 byte |
| `ui/game-over/game-over-ditelan-bayangan.png` | 2.773.659 byte |

Pemeriksaan yang tetap harus dilakukan manual:

- [ ] Mainkan Level 1 sampai selesai dua kali.
- [ ] Ulangi pemeriksaan visual dan kontrol di minimal dua browser.

`agent-browser` tidak tersedia di environment saat status ini dibuat, sehingga
dua pemeriksaan manual tersebut sengaja tidak ditandai selesai.
