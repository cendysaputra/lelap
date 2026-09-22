# 02 — Aset & Animasi

## Aturan wajib untuk SEMUA gambar (kecuali background)

1. **Latar transparan.** Tidak ada warna latar, tidak ada lantai, tidak ada bayangan di bawah objek.
2. **Rapat / fit.** Objek menyentuh atau hampir menyentuh keempat sisi gambar. Tidak ada ruang kosong di kiri, kanan, atas, atau bawah.
3. **Satu objek per gambar.**
4. **Tidak ada teks** (kecuali logo).

Setiap prompt di bawah sudah diakhiri kalimat penegas. Kalau hasilnya masih punya latar atau jarak:
- Latar kotak-kotak abu-abu (transparansi palsu) → minta ulang: *"real transparent background, not a checkerboard pattern"*.
- Masih ada jarak di sisi → minta ulang: *"crop tightly, the object must touch the edges of the image"*.

Sebagai pengaman, `npm run assets` juga memotong sisa ruang transparan secara otomatis. Tapi latar berwarna tidak bisa dibuang otomatis — itu harus benar dari GPT.

## Konsistensi gaya

- **Satu percakapan ChatGPT untuk semua aset.** Jangan buka chat baru.
- Buat `bg/title` paling pertama. Setelah jadi, lampirkan di setiap permintaan berikutnya dengan kalimat *"match the style, colors and lighting of the attached image"*.
- Untuk frame animasi: buat frame pertama, lalu frame berikutnya dibuat dengan **melampirkan frame pertama dan meminta edit**.

---

## Prompt pembuka

Kirim pertama kali:

```
I'm making a 2D side-scrolling platformer, side view like Super Mario. A
little child is having a nightmare: their house has turned into a creepy
dream world full of ghosts. The child cannot fight, only run, jump, hide
and stay in the light.

Art style for EVERY image in this conversation:
- Pixel art, clean and readable, slightly chunky pixels
- Spooky and eerie but suitable for all ages: no blood, no gore
- Dark dreamlike night mood, but main characters and objects must stay
  clearly readable with strong silhouettes
- Side view, cold moonlight from the upper left, warm light only from lamps
- Dark outline on characters and objects (very dark indigo, not pure black)
- No text unless I ask

Palette:
  deep night indigo   #151326
  shadow purple       #2B2446
  dusty violet        #4A3F6B
  moon blue           #7F9BC9
  pale moonlight      #C9D6F0
  sickly ghost green  #9FE3C1
  ghost white         #EEF2F7
  warm lamp orange    #F2A541
  lamp glow yellow    #FFD98A
  old wood brown      #6B4A3A
  dark wood           #3E2B25
  pajama yellow       #F6D04D
  pajama stripe blue  #4F7CC4
  eye red             #E0474C

EVERY image except backgrounds: transparent background, no floor, no
shadow, the object cropped tightly so it touches the edges of the image,
one object only.

Reply "ready" and I'll ask for images one at a time.
```

---

## Daftar aset Level 1

| # | File | Rasio GPT | Isi |
|---|---|---|---|
| **UI** ||||
| 1 | `bg/title.png` | 3:2 | layar judul — **buat paling pertama** |
| 2 | `ui/logo.png` | 3:2 | logo "LELAP" |
| 3 | `ui/button.png` | 3:2 | tombol kosong |
| 4 | `ui/panel.png` | 3:2 | panel kosong |
| **Player** ||||
| 5 | `player/idle.png` | 1:1 | anak berdiri — **frame acuan** |
| 6 | `player/jalan-1.png` | 1:1 | edit dari idle |
| 7 | `player/jalan-2.png` | 1:1 | edit dari idle |
| 8 | `player/lompat.png` | 1:1 | edit dari idle |
| 9 | `player/sembunyi.png` | 1:1 | edit dari idle |
| **Hantu** ||||
| 10 | `hantu/pengembara/melayang-1.png` | 1:1 | hantu seprai — **frame acuan** |
| 11 | `hantu/pengembara/melayang-2.png` | 1:1 | edit dari melayang-1 |
| 12 | `hantu/pengintai/diam.png` | 2:3 | hantu boneka menutup wajah — **frame acuan** |
| 13 | `hantu/pengintai/maju.png` | 2:3 | edit dari diam |
| 14 | `hantu/bayangan/muncul.png` | 2:3 | bayangan berdiri — **frame acuan** |
| 15 | `hantu/bayangan/sembunyi.png` | 3:2 | edit dari muncul |
| **Objek** ||||
| 16 | `objek/lemari.png` | 2:3 | lemari tempat sembunyi |
| 17 | `objek/lampu.png` | 2:3 | lampu tidur |
| 18 | `objek/boneka.png` | 1:1 | boneka beruang (tujuan) |
| **Pijakan** ||||
| 19 | `pijakan/rak.png` | 3:2 | rak dinding mengambang |
| 20 | `pijakan/meja.png` | 3:2 | meja kecil |
| 21 | `pijakan/buku.png` | 1:1 | tumpukan buku |
| 22 | `pijakan/kotak.png` | 1:1 | kotak mainan |
| **Tile** ||||
| 23 | `tiles/lantai.png` | 1:1 | lantai kayu (permukaan) |
| 24 | `tiles/fondasi.png` | 1:1 | bagian bawah lantai |
| **Background** ||||
| 25 | `bg/far.png` | 3:2 | lapis jauh |
| 26 | `bg/mid.png` | 3:2 | lapis tengah |
| 27 | `bg/near.png` | 3:2 | lapis depan |
| **Dekor** ||||
| 28 | `dekor/kecil-1.png` … `kecil-4.png` | 1:1 | hiasan kecil |
| 29 | `dekor/besar-1.png` … `besar-3.png` | 2:3 | hiasan besar |

Total **33 gambar** (dengan 4 dekor kecil dan 3 besar). Dekor boleh lebih atau kurang — game mendeteksi jumlahnya otomatis.

---

## Prompt

### UI

**1. bg/title.png**
```
Title screen illustration, landscape. A little child in yellow striped
pajamas stands in a dark dreamlike hallway of their house, seen from behind,
looking down a long corridor where doors float slightly crooked, picture
frames tilt, and faint ghost silhouettes glow far away. A big pale moon shines through a
tall window from the upper left. Eerie but beautiful. Leave calm dark empty
space in the upper-middle third for a logo and keep the lower-middle calm
for buttons. No text. This image fills the whole frame, no transparency.
```

**2. ui/logo.png**
```
Game logo text "LELAP" in chunky pixel art letters, match the style of the
attached image. Letters look like old wood with pale moonlight on top
edges, soft ghost-green glow behind them, dark indigo outline. A tiny sheet
ghost peeks from behind the letter P. Spell it exactly L-E-L-A-P, one word,
all caps. Transparent background, the logo cropped tightly to the edges,
nothing else.
```

**3. ui/button.png**
```
A blank game menu button: a horizontal old wooden plank with rounded
corners, dark wood grain, pale moonlit edge on top and darker edge on the
bottom so it looks raised, a small cobweb in one corner. Dark indigo
outline. About 3 times wider than tall. Completely blank center, NO text.
Transparent background, cropped tightly to the edges.
```

**4. ui/panel.png**
```
A blank information panel: a wide old wooden board with a pale parchment
inner area, small cobwebs on the top corners, rounded corners, dark indigo
outline. Completely blank inner area, NO text. Transparent background,
cropped tightly to the edges.
```

### Player

**5. player/idle.png**
```
The hero: a little child around 6 years old in bright yellow pajamas with
blue stripes, messy dark hair, barefoot, slightly scared expression. Side
view facing right, standing, full body. Dark indigo outline, the yellow
pajamas stand out strongly against dark scenes. Transparent background, no
shadow, cropped tightly so the child touches the edges of the image.
```

**6. player/jalan-1.png** — lampirkan idle:
```
Edit this image: same child, same size, same colors, same direction, now in
a walking pose mid-stride with the LEFT leg forward and the right arm
swinging forward. Keep everything else identical. Transparent background,
cropped tightly to the edges.
```

**7. player/jalan-2.png** — lampirkan idle:
```
Edit this image: same child, same size, same colors, same direction, now in
a walking pose mid-stride with the RIGHT leg forward and the left arm
swinging forward. Keep everything else identical. Transparent background,
cropped tightly to the edges.
```

**8. player/lompat.png** — lampirkan idle:
```
Edit this image: same child, same size, same colors, same direction, now
jumping: knees tucked up, arms raised, eyes wide. Keep everything else
identical. Transparent background, cropped tightly to the edges.
```

**9. player/sembunyi.png** — lampirkan idle:
```
Edit this image: same child, same colors, same direction, now crouching
small and hugging their knees, peeking nervously. Keep everything else
identical. Transparent background, cropped tightly to the edges.
```

### Hantu 1 — Pengembara

**10. hantu/pengembara/melayang-1.png**
```
Ghost enemy: a classic floating bedsheet ghost, slightly tattered hem,
two hollow dark eye holes and a small open mouth, faint ghost-green glow on
its edges. No legs, the bottom of the sheet flows backward. Side view
facing right, floating. Dark indigo outline. Transparent background, no
shadow, cropped tightly to the edges.
```

**11. hantu/pengembara/melayang-2.png** — lampirkan melayang-1:
```
Edit this image: same ghost, same size, same colors, same direction, but
the tattered bottom of the sheet waves in the opposite direction, like the
next moment of a floating animation. Keep everything else identical.
Transparent background, cropped tightly to the edges.
```

### Hantu 2 — Pengintai

**12. hantu/pengintai/diam.png**
```
Ghost enemy: a tall thin pale ghost that looks like an old porcelain doll
in a long faded nightgown, floating slightly above the ground, both hands
covering its face as if hiding. Creepy but not gory. Side view facing
right. Dark indigo outline, pale colors that glow softly. Transparent
background, no shadow, cropped tightly to the edges.
```

**13. hantu/pengintai/maju.png** — lampirkan diam:
```
Edit this image: same ghost, same size, same colors, same direction, but
now its hands are lowered and reaching forward, revealing a pale doll face
with two empty dark eyes. Keep everything else identical. Transparent
background, cropped tightly to the edges.
```

### Hantu 3 — Bayangan

**14. hantu/bayangan/muncul.png**
```
Ghost enemy: a tall living shadow rising up from the floor, pure dark
purple-black smoky body, two glowing red eyes, long thin arms raised with
wispy clawed fingers, the bottom dissolving into a shadow puddle. Side view
facing right. Transparent background, no floor, cropped tightly to the
edges.
```

**15. hantu/bayangan/sembunyi.png** — lampirkan muncul:
```
Edit this image: the same shadow creature almost fully sunk into the floor,
only a flat dark shadow puddle is visible with the two glowing red eyes
peeking out of it. Same colors and style. Transparent background, no floor
line, cropped tightly to the edges.
```

### Objek

**16. objek/lemari.png**
```
An old tall wooden wardrobe, side-front view, doors slightly ajar with a
thin dark gap, small round knobs, a little dusty, a safe hiding place.
Dark indigo outline. Transparent background, no shadow, cropped tightly to
the edges.
```

**17. objek/lampu.png**
```
A small child's night lamp shaped like a crescent moon on a short stand,
glowing warm orange-yellow, the brightest object in the scene. Dark indigo
outline. Transparent background, no glow halo, no shadow, cropped tightly
to the edges.
```

**18. objek/boneka.png**
```
A soft, well-loved brown teddy bear sitting, one ear slightly worn, a small
red ribbon around its neck, a faint warm sparkle on it. Dark indigo outline.
Transparent background, no shadow, cropped tightly to the edges.
```

### Pijakan

**19. pijakan/rak.png**
```
A floating wooden wall shelf, horizontal, seen from the side, flat top, old
dark wood with two small metal brackets underneath. Dark indigo outline.
Transparent background, cropped tightly to the edges.
```

**20. pijakan/meja.png**
```
A small old wooden side table, seen from the side, flat top, four thin
legs, slightly crooked. Dark indigo outline. Transparent background, no
shadow, cropped tightly to the edges.
```

**21. pijakan/buku.png**
```
A stack of four old books, slightly uneven, faded covers in violet, blue
and brown. Side view. Dark indigo outline. Transparent background, no
shadow, cropped tightly to the edges.
```

**22. pijakan/kotak.png**
```
A wooden toy box, closed lid, faded painted stars on the side, a small
metal latch. Side view. Dark indigo outline. Transparent background, no
shadow, cropped tightly to the edges.
```

### Tile

**23. tiles/lantai.png**
```
A square floor tile for a platformer, side view: dark old wooden floorboards
on top with a pale moonlit top edge, darker wood beam underneath. Must tile
seamlessly left and right. Fills the entire image edge to edge, no
transparency, no border.
```

**24. tiles/fondasi.png**
```
A square tile of the dark wooden beams and shadows underneath a floor, very
dark indigo and brown. Must tile seamlessly in every direction. Fills the
entire image edge to edge, no transparency, no border.
```

### Background

Buat far dulu, lalu untuk mid dan near lampirkan far dan tambahkan *"same scene and lighting as the attached image, only this layer"*.

**25. bg/far.png**
```
Far background layer for a side-scrolling game, landscape: a dark dreamlike
night sky seen through an endless impossible house, a huge pale moon, faint
silhouettes of crooked rooftops and staircases floating upside down in the
distance, soft violet haze. Low contrast, calm. Fills the whole image, no
transparency. Left and right edges must connect seamlessly.
```

**26. bg/mid.png**
```
Middle background layer, landscape, same scene and lighting as the attached
image: the walls of a long haunted hallway — faded striped wallpaper, tall
windows with moonlight, crooked picture frames, a closed door. Slightly
hazy and darker than the foreground. Everything sits in the lower two
thirds; the upper third is transparent. No horizontal shelves or ledges
that look like platforms. Transparent background. Left and right edges
connect seamlessly.
```

**27. bg/near.png**
```
Near background layer, landscape, same scene and lighting as the attached
image: torn curtains and long cobwebs hanging from the top edge, a few
shadowy chair legs in the bottom corners. The whole middle band stays empty
and transparent so gameplay is visible. Transparent background. Left and
right edges connect seamlessly.
```

### Dekor

Hiasan yang cuma dilewati. Pola prompt:

```
A decorative prop for a spooky platformer, side view: [objek]. Dark indigo
outline, eerie dream mood. Transparent background, no shadow, cropped
tightly to the edges.
```

**Kecil** (`dekor/kecil-1.png` dst):
- *a small melted candle with a tiny flame*
- *a broken toy robot lying on its side*
- *a cracked porcelain teacup*
- *a single fallen playing card*
- *a small wind-up music box, lid open*
- *a knocked-over toy block with a letter carved on it*

**Besar** (`dekor/besar-1.png` dst):
- *a tall grandfather clock with a crooked face and no hands*
- *an empty rocking chair tilted slightly*
- *a tall standing mirror with a cracked glass, no reflection*
- *a coat rack with an old coat that looks like a figure*
- *a child's rocking horse with one missing eye*

---

## Catatan animasi

| Karakter | Frame | Dipakai saat |
|---|---|---|
| player | idle | diam |
| player | jalan-1, jalan-2 | jalan dan lari, bergantian |
| player | lompat | di udara |
| player | sembunyi | di dalam lemari |
| pengembara | melayang-1, melayang-2 | selalu, bergantian pelan |
| pengintai | diam | membeku saat dilihat player |
| pengintai | maju | bergerak saat player membelakangi |
| bayangan | sembunyi | menunggu di lantai |
| bayangan | muncul | menyerang |

Efek tambahan (goyang, flip arah, squash saat lompat, melayang naik-turun) dibuat lewat kode, tidak perlu gambar.

Frame yang sedikit beda antar gambar tidak masalah selama ukuran badan dan warnanya sama. Script memproses semua frame satu karakter dengan skala yang sama.
