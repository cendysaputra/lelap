import path from "node:path";

export const SOURCE = path.resolve("assets-src");
export const OUTPUT = path.resolve("public");
export const SCALE = 4;

export const expected = [
  "favicon.png", "bg/title.png", "bg/title-asap.webp", "ui/logo.png", "ui/button.png", "ui/panel.png",
  "music/deep-pulse.mp3",
  "player/idle.png", ...Array.from({ length: 8 }, (_, index) => `player/jalan-${index + 1}.png`),
  "player/lompat.png", "player/sembunyi.png",
  ...Array.from({ length: 4 }, (_, index) => `hantu/pengembara/melayang-${index + 1}.png`),
  "hantu/pengintai/diam.png", "hantu/pengintai/maju.png",
  "hantu/bayangan/muncul.png", "hantu/bayangan/sembunyi.png",
  "objek/lemari.png", "objek/lampu.png", "objek/boneka.png",
  ...Array.from({ length: 3 }, (_, index) => `objek/portal/portal-${index + 1}.png`),
  "pijakan/rak.png", "pijakan/meja.png", "pijakan/buku.png",
  "pijakan/kotak.png", "pijakan/pijakan-atas-tinggi.png",
  ...["pendek", "sedang", "tinggi", "penghubung"].map((name) => `pijakan/lane-vertikal/modul-${name}.png`),
  "ui/emblem-player.png",
  ...["jatuh", "tertangkap-pengembara", "ditelan-bayangan"].map((name) => `ui/game-over/game-over-${name}.png`),
  "tiles/lantai.png", "tiles/fondasi.png",
  "bg/far.png", "bg/mid.png", "bg/near.png",
];

export const fixedRules = [
  [/^player\//, "height", 64],
  [/^hantu\/pengembara\//, "height", 72],
  [/^hantu\/pengintai\//, "height", 112],
  [/^hantu\/bayangan\//, "height", 128],
  [/^objek\/lemari\.png$/, "height", 128],
  [/^objek\/lampu\.png$/, "height", 96],
  [/^objek\/boneka\.png$/, "height", 56],
  [/^objek\/portal\/portal-\d+\.png$/, "height", 128],
  [/^pijakan\/(rak|meja)\.png$/, "width", 128],
  [/^pijakan\/pijakan-atas-tinggi\.png$/, "width", 128],
  [/^pijakan\/lane-vertikal\/modul-penghubung\.png$/, "width", 192],
  [/^pijakan\/lane-vertikal\/modul-(pendek|sedang|tinggi)\.png$/, "width", 128],
  [/^pijakan\/(buku|kotak)\.png$/, "width", 64],
  [/^ui\/emblem-player\.png$/, "width", 64],
  [/^ui\/game-over\/game-over-.*\.png$/, "width", 400],
  [/^dekor\/kecil-\d+\.png$/, "height", 48],
  [/^dekor\/besar-\d+\.png$/, "height", 128],
  [/^ui\/logo\.png$/, "width", 600],
  [/^ui\/button\.png$/, "width", 256],
  [/^ui\/panel\.png$/, "width", 680],
];

export const groups = [
  { prefix: "player/", reference: "player/idle.png" },
  { prefix: "hantu/pengembara/", reference: "hantu/pengembara/melayang-1.png" },
  { prefix: "objek/portal/", reference: "objek/portal/portal-1.png" },
  { prefix: "hantu/pengintai/", reference: "hantu/pengintai/diam.png" },
  { prefix: "hantu/bayangan/", reference: "hantu/bayangan/muncul.png" },
];
