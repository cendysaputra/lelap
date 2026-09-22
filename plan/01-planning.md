# 01 — Planning & Kebutuhan

## Ringkasan

**LELAP** *(working title)* — game 2D side-scroller pixel art. Seorang anak kecil sedang bermimpi buruk dan harus melewati rumah yang berubah menyeramkan, menghindari tiga jenis hantu, sampai menemukan boneka beruang kesayangannya. Tidak bisa melawan — cuma lari, lompat, sembunyi di lemari, dan berlindung di cahaya lampu tidur.

**Scope sekarang: Level 1 saja** (sekitar 2 menit dimainkan). Level berikutnya menyusul.

Aturan main lengkap ada di `AGENTS.md`.

---

## Alur kerja

| Tahap | File | Dikerjakan oleh |
|---|---|---|
| Pondasi | `AGENTS.md` | dibaca semua agent |
| Planning & setup | `01-planning.md` (file ini) | kamu |
| Aset & animasi | `02-aset.md` | kamu + ChatGPT |
| Build UI & game | `03-build.md` | agent |
| Finalisasi & cek bug | `04-finalisasi.md` | kamu + agent |
| Deploy | — | kamu sendiri (Vercel) |

Tahap 02 dan 03 bisa jalan bersamaan. Selama gambar belum ada, game menampilkan kotak warna sebagai pengganti.

---

## Yang perlu diinstall

| Alat | Kegunaan | Catatan |
|---|---|---|
| **Node.js LTS** (v20 atau lebih baru) | menjalankan proyek | cek dengan `node -v` |
| **npm** | install paket | ikut terpasang bersama Node.js |
| **Git** | version control | cek dengan `git --version` |
| **Code editor** | VS Code, Cursor, dll | |
| **AI agent** | Claude Code, Codex, atau Cursor | salah satu cukup |
| **ChatGPT** | generate gambar | dengan fitur image generation |

Paket proyek (`kaplay`, `vite`, `sharp`) diinstall otomatis oleh agent di Tahap 0 build. Tidak perlu install manual.

## Yang perlu diunduh manual

**Font Pixelify Sans** (gratis, lisensi OFL):
1. Buka Google Fonts, cari "Pixelify Sans", unduh.
2. Ekstrak, buka folder `static`, ambil satu file `.ttf` (saran: Bold).
3. Rename jadi `PixelifySans.ttf`.
4. Taruh di `public/fonts/` setelah proyek dibuat.

---

## Persiapan folder

1. Buat folder proyek baru, misalnya `lelap/`.
2. Taruh `AGENTS.md` di root. Kalau pakai Claude Code, copy juga jadi `CLAUDE.md`.
3. Buat folder `assets-src/` dengan subfolder:

```
assets-src/
  ui/
  bg/
  player/
  hantu/pengembara/
  hantu/pengintai/
  hantu/bayangan/
  objek/
  pijakan/
  tiles/
  dekor/
```

4. `git init`, lalu commit pertama.

Gambar hasil ChatGPT disimpan ke `assets-src/` sesuai nama di `02-aset.md`. Setiap kali menambah atau mengganti gambar, jalankan `npm run assets`.

---

## Urutan kerja yang disarankan

1. Siapkan folder dan font.
2. Generate aset UI dulu (4 gambar di `02-aset.md` bagian 1).
3. Jalankan Tahap 0 dan 1 di `03-build.md` → menu sudah bisa dilihat.
4. Generate player dan tile → jalankan Tahap 2.
5. Generate ketiga hantu → jalankan Tahap 3.
6. Generate objek, pijakan, dekor, background → jalankan Tahap 4.
7. Main, catat masalah, lalu `04-finalisasi.md`.
8. Deploy.

---

## Definisi selesai untuk Level 1

- Menu tampil penuh layar dengan logo, tombol MULAI dan CARA MAIN.
- Level 1 bisa dimainkan dari awal sampai menemukan boneka beruang.
- Ketiga hantu bekerja sesuai aturan, masing-masing dengan cara menghindar yang berbeda.
- Kalah dan menang menampilkan panel dengan tombol yang benar.
- Tidak ada error di console, `npm run build` sukses.
