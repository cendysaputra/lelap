# AGENTS.md — LELAP

Pondasi utama proyek. Semua agent (Claude Code, Codex, Cursor, dll) wajib membaca file ini sebelum mengerjakan apa pun. Untuk Claude Code, copy file ini jadi `CLAUDE.md` di root repo.

Kalau ada aturan di prompt yang bertentangan dengan file ini, **file ini yang menang**, kecuali prompt secara eksplisit bilang mengubah AGENTS.md.

---

## Konsep

Seorang anak kecil sedang bermimpi. Setiap level adalah satu mimpi. **Level 1: Mimpi Buruk** — rumah yang berubah jadi tempat menyeramkan, penuh hantu.

Anak itu **tidak bisa melawan**. Dia hanya bisa lari, melompat, bersembunyi di lemari, dan berlindung di cahaya lampu tidur. Tujuannya: menemukan boneka beruang kesayangannya di ujung mimpi.

Game 2D side-scroller tampak samping, seperti Mario. Gaya visual: pixel art. Target: browser desktop.

**Saat ini hanya Level 1 yang dikerjakan.** Kode disusun supaya level berikutnya bisa ditambah nanti tanpa merombak.

## Stack

- **KAPLAY** (npm `kaplay`) + **Vite** + **JavaScript biasa**.
- **sharp** sebagai devDependency, hanya untuk `tools/assets.js`.
- Tidak ada dependency lain.

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm run dev` | jalankan game di localhost |
| `npm run assets` | proses gambar dari `assets-src/` ke `public/` |
| `npm run build` | build production ke `dist/` |

---

## Struktur

```
/assets-src          # gambar asli dari GPT (susunan sama dengan public/)
/public              # hasil npm run assets — jangan diedit manual
  manifest.json
  /ui                logo, button, panel
  /bg                title, far, mid, near
  /player            idle, jalan-1, jalan-2, lompat, sembunyi
  /hantu/pengembara  melayang-1, melayang-2
  /hantu/pengintai   diam, maju
  /hantu/bayangan    sembunyi, muncul
  /objek             lemari, lampu, boneka
  /pijakan           rak, buku, kotak, meja
  /tiles             lantai, fondasi
  /dekor             kecil-1, kecil-2, …, besar-1, besar-2, …
  /fonts             PixelifySans.ttf
/tools
  assets.js
/src
  main.js            # init, layar, daftar scene
  config.js          # SEMUA angka tuning
  manifest.js        # muat aset dari manifest, fallback kotak warna
  levels.js          # data level
  /scenes            loading, menu, game, gameover, win
  /entities          player, pengembara, pengintai, bayangan, lampu, lemari
  /systems           camera, background, darkness
  /ui                button, text, panel
```

Satu file satu tanggung jawab, maksimal ~200 baris.

---

## Aset

- Semua aset selain background: **PNG transparan dan rapat** — tidak ada warna latar, tidak ada jarak antara objek dan sisi gambar.
- `tools/assets.js` memastikan ini: memotong semua ruang transparan di sekeliling gambar (trim), lalu mengubah ukuran. Kalau GPT memberi sedikit jarak, script yang membereskan.
- Background: `bg/title` dan `bg/far` disimpan JPG (tidak butuh transparansi). `bg/mid` dan `bg/near` PNG transparan.
- Game hanya memuat aset lewat `public/manifest.json`. Aset yang tidak ada digambar sebagai kotak warna — game tidak boleh error.

### Ukuran dunia

**1 tile = 64 unit.** Satu dimensi ditetapkan, dimensi lain mengikuti proporsi gambar setelah di-trim.

| Aset | Ukuran dunia |
|---|---|
| player (semua frame) | tinggi 64 |
| hantu/pengembara | tinggi 72 |
| hantu/pengintai | tinggi 112 |
| hantu/bayangan | tinggi 128 (frame muncul) |
| objek/lemari | tinggi 128 |
| objek/lampu | tinggi 96 |
| objek/boneka | tinggi 56 |
| pijakan/rak, meja | lebar 128 |
| pijakan/buku, kotak | lebar 64 |
| tiles/lantai, fondasi | 64×64 |
| dekor/kecil | tinggi 48 |
| dekor/besar | tinggi 128 |
| ui/logo | lebar 600 |
| ui/button | lebar 256 |
| ui/panel | lebar 680 |
| bg | memenuhi tinggi layar |

File hasil disimpan **4× ukuran dunia** (player → 256 piksel tinggi) supaya tajam sampai monitor 4K.

### Grup

Frame dalam satu grup diproses dengan **skala yang sama** dan ditampilkan dengan **jangkar rata bawah-tengah**, supaya saat ganti frame karakter tidak berubah ukuran atau bergeser:
- semua frame `player/`
- semua frame `hantu/pengembara/`
- semua frame `hantu/pengintai/`
- semua frame `hantu/bayangan/`

Skala grup dihitung dari frame acuan: `player/idle`, `pengembara/melayang-1`, `pengintai/diam`, `bayangan/muncul`.

---

## Layar

- Canvas **memenuhi seluruh layar**, tanpa bingkai, margin, atau scrollbar. Latar halaman hitam.
- **Tinggi dunia yang terlihat selalu 768 unit (12 tile).** Skala = tinggi layar ÷ 768. Lebar yang terlihat mengikuti layar. Gambar tidak boleh gepeng.
- Hitung ulang saat resize dan saat masuk/keluar layar penuh.
- UI memakai skala yang sama dengan dunia; posisinya dihitung dari ukuran layar. Klik harus tepat sasaran.
- **Layar penuh monitor** (Fullscreen API): diminta saat tombol MULAI ditekan, bisa di-toggle dengan F. Kalau browser menolak, game tetap jalan.
- Esc milik browser untuk keluar layar penuh — jangan dipakai untuk fungsi game.

## Suasana

- Gelap dan menyeramkan, tapi **player dan hantu selalu terbaca jelas**.
- `src/systems/darkness.js`: vignette gelap di tepi layar, ditambah cahaya lembut di sekitar player (radius ~2 tile) dan cahaya hangat di sekitar setiap lampu tidur. Pakai lingkaran bercahaya dengan blend additive kalau KAPLAY mendukung; hindari shader rumit.
- Background tiga lapis: far (scroll 0.15), mid (scroll 0.4), near (scroll 0.7), berulang horizontal.
- Setiap karakter dan objek yang menapak lantai punya bayangan elips tipis di bawahnya.

## Teks & UI

- Judul: gambar `ui/logo`.
- Teks lain: font Pixelify Sans, dengan outline gelap dan bayangan tipis.
- Tombol: gambar `ui/button` + teks di atasnya. Hover: membesar sedikit dan lebih terang. Ditekan: mengecil sedikit. Mouse dan keyboard (panah + Enter).
- Panel (cara main, jeda, kalah, menang): gambar `ui/panel`.

---

## Animasi

Karakter memakai frame gambar, ditambah efek kode.

| Karakter | Keadaan | Frame |
|---|---|---|
| player | diam | idle |
| player | jalan / lari | jalan-1 ⇄ jalan-2 (6 fps jalan, 10 fps lari) |
| player | di udara | lompat |
| player | di dalam lemari | sembunyi |
| pengembara | selalu | melayang-1 ⇄ melayang-2 (4 fps) + melayang naik-turun pelan |
| pengintai | membeku | diam |
| pengintai | bergerak | maju |
| bayangan | di lantai | sembunyi |
| bayangan | menyerang | muncul |

Efek kode: flip horizontal sesuai arah, squash & stretch player saat lompat dan mendarat. Frame yang belum ada: pakai frame lain yang ada.

---

## Aturan main

### Player

- Jalan pelan dan sunyi. Lari (tahan Shift) cepat tapi **berisik** dan memakai stamina: penuh 2,5 detik, pulih dalam 3 detik. Habis = hanya bisa jalan sampai penuh.
- Lompat dengan coyote time 0,1 detik.
- **Lemari**: tahan S di depan lemari untuk masuk. Player tidak terlihat dan tidak bisa bergerak. Lepas S untuk keluar.
- **Lampu tidur**: di dalam lingkaran cahayanya player aman — tidak ada hantu yang bisa masuk.
- Tersentuh hantu → kalah ("TERTANGKAP"). Jatuh ke jurang → kalah ("JATUH KE KEGELAPAN"). Kalah = ulang level dari awal.
- Menyentuh boneka beruang → level selesai.

### Hantu 1 — Pengembara

Hantu seprai klasik yang berpatroli.
- Melayang horizontal di ketinggian awalnya, bolak-balik. Berbalik saat menabrak solid atau setelah 6 tile dari titik awal.
- **Melihat** player di depannya dalam 5 tile (beda tinggi < 2 tile, tidak terhalang solid, player tidak di lemari). Tanda "!" 0,4 detik, lalu **mengejar** — terbang langsung ke arah player, bisa naik-turun, sedikit lebih lambat dari lari player.
- **Mendengar** player yang lari dalam 4 tile → menoleh ke arahnya.
- Tidak melihat player selama 2 detik → kembali ke jalur patroli.

### Hantu 2 — Pengintai

Hantu boneka pucat yang hanya bergerak saat tidak dilihat.
- Diam di titik awalnya.
- Kalau player dalam 8 tile **dan membelakanginya**, dia bergerak mendekat (frame maju).
- Begitu player menghadap ke arahnya, dia langsung membeku (frame diam).
- Player di lemari → dia berhenti lalu perlahan kembali ke titik awal.

### Hantu 3 — Bayangan

Bayangan yang bersembunyi di lantai.
- Diam di lantai, hanya matanya yang terlihat (frame sembunyi). Tidak bisa disentuh dalam keadaan ini.
- Player mendekat dalam 1,5 tile (horizontal) → gemetar 0,5 detik sebagai peringatan → **muncul** setinggi 2 tile selama 1 detik → tenggelam lagi → jeda 2 detik sebelum bisa muncul lagi.
- Menyentuhnya saat muncul → kalah.
- Tidak bergerak dari tempatnya. Player harus mengatur waktu: lewat cepat sebelum dia muncul, atau tunggu dia tenggelam.

### Aturan bersama hantu

- Tidak ada hantu yang bisa masuk ke lingkaran cahaya lampu tidur. Pengembara dan pengintai berhenti di tepinya.
- Masuk lemari saat pengembara yang sedang mengejar sudah dalam 1 tile → tetap ketahuan.

---

## Level

Level ditulis di `src/levels.js`:

```js
{ name: "Mimpi Buruk", map: [ "....", "####" ] }
```

Semua baris harus sama panjang. Loader menolak baris tidak rata (sebut nomor barisnya) dan memperingatkan simbol tidak dikenal.

### Simbol

| Simbol | Arti | Jenis |
|---|---|---|
| `.` | kosong | |
| `#` | lantai | solid |
| `=` | rak mengambang, 2 tile | platform satu arah |
| `m` | meja, 2 tile | platform satu arah |
| `b` | tumpukan buku, 1 tile | solid |
| `k` | kotak mainan, 1 tile | solid |
| `P` | posisi awal player | |
| `1` | hantu pengembara | |
| `2` | hantu pengintai | |
| `3` | hantu bayangan | |
| `H` | lemari (tempat sembunyi) | |
| `L` | lampu tidur (zona aman) | |
| `*` | boneka beruang (tujuan) | |
| `f` | dekorasi kecil acak | tanpa collision |
| `F` | dekorasi besar acak | tanpa collision |

- Objek ditaruh di tile **kiri bawah**, gambarnya tumbuh ke kanan dan ke atas. Tile lain yang tertutup diisi `.`.
- Solid: collision seluruh kotak gambar. Platform satu arah: collision 24 unit teratas, bisa dilompati dari bawah.
- `#` paling atas memakai `tiles/lantai`, `#` di bawahnya memakai `tiles/fondasi`. Di belakang setiap `#` ada kotak gelap penuh supaya celah tidak terlihat.
- Tidak ada lantai di bawah = jurang. Jatuh keluar peta = kalah.
- Dekorasi acak dipilih berdasarkan posisi (`hash(x, y) mod jumlah`), supaya level selalu terlihat sama. Digambar di belakang player.
- Buku dan kotak harus berdiri di atas lantai atau solid lain, tidak melayang.

---

## Aturan kode

- Semua angka tuning di `src/config.js` sebagai konstanta bernama.
- Tag KAPLAY: `"player"`, `"ghost"`, `"solid"`, `"platform"`, `"closet"`, `"lamp"`, `"goal"`, `"decor"`.
- Komponen yang dibaca harus sudah ditambahkan sebelum dibaca.
- Mode debug bawaan KAPLAY (F1) cukup untuk melihat hitbox.

## Jangan dikerjakan tanpa diminta

Level 2 dan seterusnya, save game, audio, kontrol mobile, checkpoint, health bar, konfigurasi deploy, test, TypeScript, refactor di luar tugas, dependency baru.

## Kontrol

| Tombol | Aksi |
|---|---|
| A / D atau ← → | jalan |
| Shift (tahan) | lari — berisik, pakai stamina |
| Space / W | lompat |
| S (tahan) | masuk lemari |
| P | jeda |
| F | layar penuh |
| Esc | keluar layar penuh (bawaan browser) |
