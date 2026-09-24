# 03 — Build UI & Game

Kirim ke agent satu prompt per sesi, berurutan. Setelah tiap tahap: `npm run dev`, cek di browser, commit, baru lanjut.

Selama gambar belum ada, semua objek tampil sebagai kotak warna — itu normal.

## Revisi aktif — 24 September 2026

- Kecepatan lari diturunkan menjadi 340 unit/detik agar tetap lebih cepat
  dari jalan, tetapi tidak melompati terlalu banyak tantangan level.
- HUD atas memakai aset `ui/emblem-player`, nama Cendi, dan bar stamina ringkas
  di kiri; timer di tengah; serta tiga ikon boneka yang lebih besar di kanan.
  Ikon belum ditemukan tampil grayscale dan ikon yang ditemukan kembali ke
  warna asli.
- Level 1 memakai lane bawah dan lane tinggi yang panjang. Lane tinggi dibentuk
  dari modul vertikal solid yang berdiri dari dasar, bukan kumpulan tanah
  melayang atau platform tipis yang dapat ditembus dari samping.
- Ada tiga boneka. Portal akhir baru terlihat dan aktif setelah semuanya
  ditemukan.
- Pengembara memakai empat frame `melayang-1` sampai `melayang-4` pada
  10 fps agar animasi aset terbaru terbaca halus.

---

## Tahap 0 — Setup & pemroses aset

```
Baca AGENTS.md dulu, terutama bagian "Aset". Kerjakan:

1. Setup proyek KAPLAY + Vite + JavaScript di folder ini. Jangan hapus atau
   timpa assets-src/, public/fonts/, dan file .md yang ada. Buat struktur
   folder sesuai AGENTS.md.

2. Tambahkan sharp sebagai devDependency, buat tools/assets.js, dan script
   "assets": "node tools/assets.js" di package.json.

3. tools/assets.js membaca semua PNG di assets-src/ dan menulis hasilnya ke
   public/ dengan path yang sama. Aturan ukuran diambil dari tabel "Ukuran
   dunia" di AGENTS.md, ditulis sebagai satu objek aturan per pola path.

   Untuk semua gambar selain tiles dan bg:
   a. Trim semua ruang transparan di sekeliling gambar.
   b. Ubah ukuran dengan lanczos3 sehingga dimensi yang ditetapkan = 4x
      ukuran dunia, dimensi lain mengikuti proporsi. Contoh: player tinggi
      64 -> tinggi file 256.
   c. Grup (lihat AGENTS.md): hitung skala dari frame acuan, pakai skala
      yang SAMA untuk semua frame di grup itu. Tiap frame tetap di-trim
      sendiri.
   d. Simpan PNG lossless. Jangan kurangi jumlah warna.

   Tiles: potong tengah jadi persegi, ubah ke 256x256, PNG.

   Background:
   - Potong tengah ke rasio 16:9, ubah ke 1920x1080 (boleh diperbesar).
   - bg/title dan bg/far: simpan JPG kualitas 95, chroma subsampling 4:4:4.
   - bg/mid dan bg/near: PNG transparan.

4. Tulis public/manifest.json: daftar semua file hasil beserta ukuran
   dunianya (lebar dan tinggi dalam unit = ukuran file / 4), dan jumlah
   dekor kecil dan besar.

5. Peringatan di console, tanpa menghentikan proses:
   - gambar yang harusnya transparan tapi tidak punya alpha, atau keempat
     sudutnya tidak transparan: "latar tidak transparan — minta ulang ke
     GPT"
   - file tidak dikenal: dilewati
   - file yang tercantum di 02-aset.md tapi belum ada
   Ringkasan di akhir: diproses, dilewati, peringatan.

6. Tanyakan di akhir jawaban apakah assets-src/ perlu masuk .gitignore.

Selesai kalau: npm run assets berjalan, semua gambar di public/ rapat tanpa
ruang kosong, manifest.json lengkap, dan npm run dev jalan tanpa error.
```

---

## Tahap 1 — Layar penuh & menu

```
Baca AGENTS.md dulu, terutama "Layar" dan "Teks & UI". Kerjakan:

1. src/main.js: canvas memenuhi seluruh layar, tinggi dunia terlihat 768
   unit, skala boleh pecahan, gambar tidak gepeng, dihitung ulang saat
   resize dan saat masuk/keluar layar penuh. Latar halaman hitam, tanpa
   margin dan scrollbar. Layar penuh monitor diminta saat MULAI ditekan dan
   bisa di-toggle dengan F. Kalau browser menolak, tetap jalan.

2. src/config.js isi awal:
   TILE = 64, VIEW_HEIGHT = 768,
   GRAVITY = 3600, WALK_SPEED = 220, RUN_SPEED = 340, JUMP_FORCE = 1040,
   COYOTE_TIME = 0.1, STAMINA_MAX = 2.5, STAMINA_REGEN_TIME = 3

3. src/manifest.js: muat public/manifest.json dan semua gambarnya dengan
   ukuran dunia masing-masing. Aset yang tidak ada = kotak warna.

4. Scene "loading": muat manifest, semua gambar, dan font Pixelify Sans
   dengan progress bar, lalu ke menu.

5. src/ui/text.js: teks Pixelify Sans dengan outline gelap dan bayangan
   tipis, ukuran mengikuti skala dunia.

6. src/ui/button.js: tombol dengan gambar ui/button, teks terang di tengah.
   Hover: membesar 6% dan sedikit lebih terang, transisi halus. Ditekan:
   mengecil 4% selama 0.1 detik, lalu menjalankan aksinya. Navigasi panah
   + Enter; tombol terfokus tampil seperti hover.

7. src/ui/panel.js: panel dengan gambar ui/panel, untuk isi teks dan tombol.

8. Scene "menu":
   - bg/title menutupi layar (cover).
   - ui/logo di tengah horizontal sekitar 28% dari atas, melayang naik-turun
     pelan. Fallback: teks "LELAP".
   - Tombol MULAI dan CARA MAIN bertumpuk sekitar 65% dan 78% dari atas.
   - Beberapa titik debu pucat melayang pelan di layar.
   - CARA MAIN membuka panel berisi tabel kontrol dari AGENTS.md dan tombol
     TUTUP.
   - MULAI: minta layar penuh, fade gelap, masuk scene game.

9. Scene "game", "gameover", "win" sebagai placeholder dengan tombol MENU.
   Di scene game, P membuka panel jeda (LANJUT, MENU) dan menghentikan game.

Selesai kalau: menu penuh satu layar tanpa bingkai, logo dan tombol memakai
gambar dari GPT, tombol bereaksi saat hover dan ditekan, bisa dipakai
dengan mouse dan keyboard, dan layar penuh aktif saat MULAI ditekan.
```

---

## Tahap 2 — Level, background, player

```
Baca AGENTS.md dulu, terutama "Level", "Suasana", dan "Animasi". Kerjakan:

1. Loader level dengan addLevel() dan SELURUH tabel simbol di AGENTS.md:
   - Lantai, rak, meja, buku, kotak berfungsi penuh (solid atau platform
     satu arah sesuai tabel).
   - Objek ditaruh di tile kiri bawah, ukuran dari manifest.
   - Hantu, lemari, lampu, boneka: untuk sekarang cukup tampil dengan tag
     yang benar, belum ada perilaku.
   - f dan F: dekor acak berdasarkan hash posisi, di belakang player.
   - Validasi baris tidak rata dan simbol tidak dikenal.

2. Lantai: tiles/lantai untuk # paling atas, tiles/fondasi di bawahnya,
   kotak gelap penuh di belakang setiap #.

3. src/systems/background.js: tiga layer far, mid, near dengan scroll 0.15,
   0.4, 0.7, tinggi = tinggi layar, berulang horizontal.

4. src/systems/camera.js: mengikuti player dengan halus, tidak keluar batas
   level, tidak menampilkan lebih dari 2 tile di bawah lantai terendah.

5. Player (src/entities/player.js):
   - Jalan, lari dengan Shift (pakai stamina), lompat dengan coyote time.
   - Hitbox sekitar 36x56, lebih kecil dari gambar.
   - Jatuh keluar peta: scene gameover dengan penyebab "JATUH KE
     KEGELAPAN".
   - HUD kiri atas memakai aset emblem player, nama Cendi, dan bar stamina
     ringkas yang rata tengah. Jangan tampilkan bar stamina kedua di atas
     kepala player. Timer permainan berada di tengah atas dan berhenti saat
     jeda.
   - Tampilkan tiga ikon boneka berukuran jelas di kanan atas: grayscale
     sebelum ditemukan dan warna asli setelah ditemukan.
   - Animasi frame sesuai tabel "Animasi" di AGENTS.md: idle, jalan-1/2
     (6 fps jalan, 10 fps lari), lompat. Flip horizontal sesuai arah,
     squash & stretch saat lompat dan mendarat. Semua frame jangkar rata
     bawah-tengah.
   - Bayangan elips tipis di bawah kaki.

6. src/levels.js: satu level uji sampai 96 tile panjang, 12 tile tinggi,
   dengan lantai, satu jurang kecil, rak, meja, buku, kotak, dan beberapa
   f dan F. Siapkan juga lane tinggi yang tersambung dan dapat dinaiki lewat
   beberapa tingkat modul. Modul tinggi memiliki collider solid penuh agar
   membentuk elevasi medan, bukan sekadar pijakan tanah yang melayang.

7. Scene gameover menerima penyebab sebagai parameter, tampil di panel
   dengan tombol ULANG dan MENU.

8. Log saat level dimuat: ukuran peta, posisi spawn, simbol tidak dikenal
   (harus kosong).

Selesai kalau: player bisa jalan, lari, lompat ke semua pijakan dengan
animasi yang terlihat hidup, tidak bergeser atau berubah ukuran saat
ganti frame, background tiga lapis bergerak berlapis, dan jatuh ke jurang
menampilkan layar kalah.
```

---

## Tahap 3 — Tiga hantu

```
Baca AGENTS.md dulu, terutama "Aturan main" bagian hantu dan "Animasi".
Kerjakan:

1. Tambahkan ke config.js:
   WANDERER_PATROL_SPEED = 100, WANDERER_CHASE_SPEED = 380,
   WANDERER_PATROL_RANGE = 384, WANDERER_SIGHT_RANGE = 320,
   WANDERER_SIGHT_HEIGHT = 128, WANDERER_HEAR_RANGE = 256,
   WANDERER_ALERT_TIME = 0.4, WANDERER_LOSE_TIME = 2, GHOST_BOB = 6,
   PEEKER_RANGE = 512, PEEKER_SPEED = 200, PEEKER_RETURN_SPEED = 80,
   SHADOW_TRIGGER_RANGE = 96, SHADOW_WARN_TIME = 0.5, SHADOW_UP_TIME = 1,
   SHADOW_COOLDOWN = 2

2. Pengembara (src/entities/pengembara.js):
   - PATROL: melayang horizontal di ketinggian awal, berbalik saat menabrak
     solid atau setelah WANDERER_PATROL_RANGE dari titik awal. Tidak
     terpengaruh gravitasi.
   - Melihat player (di depan arah hadap, dalam SIGHT_RANGE, beda tinggi
     < SIGHT_HEIGHT, tidak terhalang solid, player tidak di lemari):
     diam, tanda "!" muncul dengan efek pop selama ALERT_TIME, lalu CHASE.
   - CHASE: terbang langsung ke arah player dengan CHASE_SPEED, boleh
     naik-turun.
   - Player yang lari dalam HEAR_RANGE membuat pengembara yang patroli
     menoleh.
   - Tidak melihat player selama LOSE_TIME: kembali ke ketinggian dan jalur
     patroli awal.
   - Animasi melayang-1 sampai melayang-4 bergantian 10 fps, plus naik-turun
     GHOST_BOB unit dengan gelombang sinus.

3. Pengintai (src/entities/pengintai.js):
   - Diam di titik awal (frame diam).
   - Kalau player dalam PEEKER_RANGE DAN membelakanginya (arah hadap player
     menjauhi pengintai), bergerak ke arah player dengan PEEKER_SPEED,
     frame maju.
   - Begitu player menghadap ke arahnya: berhenti seketika, frame diam.
   - Player di lemari: berhenti, lalu kembali ke titik awal dengan
     RETURN_SPEED.
   - Melayang, tidak terpengaruh gravitasi.

4. Bayangan (src/entities/bayangan.js):
   - Frame sembunyi di lantai, tidak punya collision berbahaya.
   - Player dalam SHADOW_TRIGGER_RANGE secara horizontal: gemetar
     kiri-kanan selama WARN_TIME, lalu frame muncul selama UP_TIME dengan
     collision berbahaya, lalu kembali sembunyi, lalu jeda COOLDOWN.
   - Tidak berpindah tempat.

5. Menyentuh hantu yang sedang berbahaya: scene gameover dengan penyebab
   "TERTANGKAP".

6. Semua hantu: bayangan elips tipis di lantai di bawahnya, flip sesuai
   arah gerak.

7. Tambahkan satu hantu dari setiap jenis ke level uji.

Selesai kalau: pengembara berpatroli dan mengejar dengan jeda "!",
pengintai hanya bergerak saat player membelakanginya, bayangan muncul
dengan peringatan dan bisa dilewati dengan mengatur waktu, dan ketiganya
bisa membuat player kalah.
```

---

## Tahap 4 — Lemari, lampu, boneka, suasana, Level 1

```
Baca AGENTS.md dulu, lalu kerjakan:

1. Tambahkan ke config.js:
   LAMP_RADIUS = 160, PLAYER_LIGHT_RADIUS = 128, CLOSET_SAFE_DISTANCE = 64

2. Lemari (src/entities/lemari.js): tahan S saat player menyentuh lemari
   untuk masuk — player tidak terlihat dan tidak bisa bergerak, frame
   sembunyi, digambar samar di depan lemari. Lepas S untuk keluar. Kalau
   pengembara yang sedang CHASE ada dalam CLOSET_SAFE_DISTANCE saat player
   masuk, tetap ketahuan.

3. Lampu tidur (src/entities/lampu.js): lingkaran aman radius LAMP_RADIUS.
   Pengembara dan pengintai tidak bisa masuk ke dalamnya — berhenti di
   tepinya. Lampu berkedip sangat halus sesekali.

4. Boneka beruang dan portal: tempatkan tiga boneka di rute berbeda.
   Menyentuh boneka menambah progres HUD dan mengubah satu ikon grayscale
   menjadi warna asli. Setelah ketiganya ditemukan, munculkan dan aktifkan
   portal keluar. Menyentuh portal melakukan fade ke scene win. Boneka
   melayang naik-turun pelan dengan kilau kecil.

5. src/systems/darkness.js sesuai bagian "Suasana" di AGENTS.md: vignette
   gelap di tepi layar, cahaya lembut di sekitar player (PLAYER_LIGHT_RADIUS)
   dan cahaya hangat di sekitar lampu (LAMP_RADIUS). Player dan hantu
   harus tetap terbaca jelas.

6. Ganti level uji dengan Level 1 final { name: "Mimpi Buruk", ... },
   sekitar 2 menit dimainkan, 12 tile tinggi. Urutan yang disarankan:
   - Awal: area aman dengan 1 lampu, jalan datar, beberapa dekor — belajar
     gerak.
   - Pengembara pertama dengan 1 lemari di dekatnya — belajar sembunyi.
   - Jurang kecil dan pijakan rak/meja — belajar melompat.
   - Beberapa bagian beralih ke lane tinggi yang panjang, ditopang modul
     vertikal dari dasar. Jurang di bawahnya membuat lane tinggi menjadi
     bagian rute, bukan dekorasi opsional atau tanah melayang.
   - Bayangan di lorong sempit — belajar mengatur waktu.
   - Pengintai di area terbuka yang panjang — belajar berjalan sambil
     menoleh ke belakang.
   - Akhir: 2 pengembara dan 1 bayangan sekaligus, 1 lemari dan 1 lampu
     sebagai penyelamat, boneka terakhir, lalu portal keluar.
   Buku dan kotak tidak boleh melayang. Dekor tersebar tanpa menutupi
   lemari atau jalur penting.

7. Fade singkat antar semua scene.

Selesai kalau: Level 1 bisa dimainkan dari menu sampai layar menang setelah
tiga boneka ditemukan dan portal dimasuki, perpindahan lane bawah/tinggi bisa
dilalui, tiap hantu punya bagian yang mengajarkan cara menghindarinya, lemari
dan lampu benar-benar menyelamatkan, dan suasananya gelap tapi semua tetap
terbaca.
```

---

## Kalau agent mulai melebar

Tempel di akhir prompt:

> Kerjakan hanya yang diminta di atas. Jangan tambah library, jangan refactor file lain, jangan tambah fitur di luar daftar ini.
