import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { buildAnimatedBackground } from "./animated-background.js";
import { copyMusicAsset } from "./audio-assets.js";
import { buildFavicon } from "./favicon.js";

const SOURCE = path.resolve("assets-src");
const OUTPUT = path.resolve("public");
const SCALE = 4;

const expected = [
  "favicon.png", "bg/title.png", "bg/title-asap.webp", "ui/logo.png", "ui/button.png", "ui/panel.png",
  "music/deep-pulse.mp3",
  "player/idle.png", ...Array.from({ length: 8 }, (_, index) => `player/jalan-${index + 1}.png`),
  "player/lompat.png", "player/sembunyi.png",
  "hantu/pengembara/melayang-1.png", "hantu/pengembara/melayang-2.png",
  "hantu/pengintai/diam.png", "hantu/pengintai/maju.png",
  "hantu/bayangan/muncul.png", "hantu/bayangan/sembunyi.png",
  "objek/lemari.png", "objek/lampu.png", "objek/boneka.png",
  "pijakan/rak.png", "pijakan/meja.png", "pijakan/buku.png",
  "pijakan/kotak.png", "tiles/lantai.png", "tiles/fondasi.png",
  "bg/far.png", "bg/mid.png", "bg/near.png",
  ...Array.from({ length: 4 }, (_, index) => `dekor/kecil-${index + 1}.png`),
  ...Array.from({ length: 3 }, (_, index) => `dekor/besar-${index + 1}.png`),
];

const fixedRules = [
  [/^player\//, "height", 64],
  [/^hantu\/pengembara\//, "height", 72],
  [/^hantu\/pengintai\//, "height", 112],
  [/^hantu\/bayangan\//, "height", 128],
  [/^objek\/lemari\.png$/, "height", 128],
  [/^objek\/lampu\.png$/, "height", 96],
  [/^objek\/boneka\.png$/, "height", 56],
  [/^pijakan\/(rak|meja)\.png$/, "width", 128],
  [/^pijakan\/(buku|kotak)\.png$/, "width", 64],
  [/^dekor\/kecil-\d+\.png$/, "height", 48],
  [/^dekor\/besar-\d+\.png$/, "height", 128],
  [/^ui\/logo\.png$/, "width", 600],
  [/^ui\/button\.png$/, "width", 256],
  [/^ui\/panel\.png$/, "width", 680],
];

const groups = [
  { prefix: "player/", reference: "player/idle.png" },
  { prefix: "hantu/pengembara/", reference: "hantu/pengembara/melayang-1.png" },
  { prefix: "hantu/pengintai/", reference: "hantu/pengintai/diam.png" },
  { prefix: "hantu/bayangan/", reference: "hantu/bayangan/muncul.png" },
];

const manifest = { assets: {}, music: {}, decor: { kecil: 0, besar: 0 } };
let processed = 0;
let skipped = 0;
let warnings = 0;

const relative = (file) => path.relative(SOURCE, file).replaceAll("\\", "/");
const assetKey = (file) => file.replace(/\.[^.]+$/, "");

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : fullPath;
  }));
  return nested.flat();
}

function warn(message) {
  warnings += 1;
  console.warn(`Peringatan: ${message}`);
}

async function checkTransparency(file, name) {
  const image = sharp(file);
  const metadata = await image.metadata();
  if (!metadata.hasAlpha) {
    warn(`${name}: latar tidak transparan — minta ulang ke GPT`);
    return;
  }
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const corners = [[0, 0], [info.width - 1, 0], [0, info.height - 1], [info.width - 1, info.height - 1]];
  const opaqueCorner = corners.some(([x, y]) => data[(y * info.width + x) * 4 + 3] > 8);
  if (opaqueCorner) warn(`${name}: latar tidak transparan — minta ulang ke GPT`);
}

function findRule(name) {
  return fixedRules.find(([pattern]) => pattern.test(name));
}

async function trimmedInfo(file) {
  const { info } = await sharp(file).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png().toBuffer({ resolveWithObject: true });
  return info;
}

async function groupScales() {
  const result = new Map();
  for (const group of groups) {
    const rule = findRule(group.reference);
    const info = await trimmedInfo(path.join(SOURCE, group.reference));
    const dimension = rule[1] === "width" ? info.width : info.height;
    result.set(group.prefix, rule[2] * SCALE / dimension);
  }
  return result;
}

async function writeManifestEntry(name, outputName, info) {
  manifest.assets[assetKey(name)] = {
    file: outputName,
    width: info.width / SCALE,
    height: info.height / SCALE,
  };
}

async function processBackground(file, name) {
  const key = assetKey(name);
  const opaque = key === "bg/title" || key === "bg/far";
  const outputName = `${key}.${opaque ? "jpg" : "png"}`;
  const target = path.join(OUTPUT, outputName);
  await fs.mkdir(path.dirname(target), { recursive: true });
  let pipeline = sharp(file).resize(1920, 1080, { fit: "cover", position: "centre" });
  pipeline = opaque
    ? pipeline.jpeg({ quality: 95, chromaSubsampling: "4:4:4" })
    : pipeline.png({ compressionLevel: 9 });
  const info = await pipeline.toFile(target);
  await writeManifestEntry(name, outputName, info);
}

async function processAnimatedBackground(file, name) {
  const key = assetKey(name);
  const outputName = `${key}.png`;
  const target = path.join(OUTPUT, outputName);
  await fs.mkdir(path.dirname(target), { recursive: true });
  manifest.assets[key] = await buildAnimatedBackground(file, target, outputName, SCALE);
}

async function processTile(file, name) {
  const metadata = await sharp(file).metadata();
  const size = Math.min(metadata.width, metadata.height);
  const left = Math.floor((metadata.width - size) / 2);
  const top = Math.floor((metadata.height - size) / 2);
  const target = path.join(OUTPUT, name);
  await fs.mkdir(path.dirname(target), { recursive: true });
  const info = await sharp(file).extract({ left, top, width: size, height: size })
    .resize(256, 256, { kernel: sharp.kernel.lanczos3 }).png().toFile(target);
  await writeManifestEntry(name, name, info);
}

async function processSprite(file, name, scales) {
  await checkTransparency(file, name);
  const rule = findRule(name);
  const group = groups.find(({ prefix }) => name.startsWith(prefix));
  const sourceInfo = await trimmedInfo(file);
  const factor = group
    ? scales.get(group.prefix)
    : rule[2] * SCALE / sourceInfo[rule[1]];
  const width = Math.max(1, Math.round(sourceInfo.width * factor));
  const height = Math.max(1, Math.round(sourceInfo.height * factor));
  const target = path.join(OUTPUT, name);
  await fs.mkdir(path.dirname(target), { recursive: true });
  const info = await sharp(file).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .resize(width, height, { kernel: sharp.kernel.lanczos3 }).png().toFile(target);
  await writeManifestEntry(name, name, info);
  if (/^dekor\/kecil-/.test(name)) manifest.decor.kecil += 1;
  if (/^dekor\/besar-/.test(name)) manifest.decor.besar += 1;
}

async function main() {
  await fs.mkdir(OUTPUT, { recursive: true });
  const files = await walk(SOURCE);
  const names = new Set(files.map(relative));
  for (const missing of expected.filter((name) => !names.has(name))) warn(`${missing}: aset belum ada`);
  const scales = await groupScales();
  for (const file of files) {
    const name = relative(file);
    const extension = path.extname(file).toLowerCase();
    if (![".png", ".webp", ".mp3"].includes(extension)) {
      skipped += 1;
      console.warn(`Dilewati: ${name} (file tidak dikenal)`);
      continue;
    }
    try {
      if (name === "favicon.png") await buildFavicon(file, path.join(OUTPUT, name));
      else if (name.startsWith("music/") && extension === ".mp3") {
        manifest.music[assetKey(name)] = await copyMusicAsset(file, name, OUTPUT);
      } else if (name === "bg/title-asap.webp") await processAnimatedBackground(file, name);
      else if (name.startsWith("bg/")) await processBackground(file, name);
      else if (name.startsWith("tiles/")) await processTile(file, name);
      else if (findRule(name)) await processSprite(file, name, scales);
      else {
        skipped += 1;
        warn(`${name}: file tidak dikenal, dilewati`);
        continue;
      }
    } catch (error) {
      throw new Error(`Gagal memproses ${name}: ${error.message}`, { cause: error });
    }
    processed += 1;
  }
  await fs.writeFile(path.join(OUTPUT, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Selesai: ${processed} diproses, ${skipped} dilewati, ${warnings} peringatan.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
