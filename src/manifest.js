let manifest = { assets: {}, music: {}, decor: { kecil: 0, besar: 0 } };
let font = "monospace";
export const gameFont = () => font;

export async function loadManifest(k) {
  try {
    const response = await fetch("/manifest.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    manifest = { ...manifest, ...data, assets: data.assets ?? {}, decor: data.decor ?? {} };
  } catch (error) {
    console.warn("Manifest aset tidak dapat dimuat, fallback warna digunakan.", error);
  }
  for (const [name, data] of Object.entries(manifest.assets)) {
    const options = {};
    if (data.sliceX) options.sliceX = data.sliceX;
    if (data.sliceY) options.sliceY = data.sliceY;
    if (data.anims) options.anims = data.anims;
    k.loadSprite(name, `/${data.file}`, options).onError((error) => {
      delete manifest.assets[name];
      console.warn(`Aset ${name} gagal dimuat; memakai fallback.`, error);
    });
  }
  for (const [name, data] of Object.entries(manifest.music ?? {})) {
    k.loadMusic(name, `/${data.file}`);
  }
  if (manifest.fonts?.pixelify) {
    k.loadFont("pixelify", `/${manifest.fonts.pixelify.file}`)
      .onLoad(() => { font = "pixelify"; })
      .onError((error) => console.warn("Font gagal dimuat; memakai monospace.", error));
  }
  return manifest;
}

export const assetData = (name) => manifest.assets[name] ?? null;
export const hasAsset = (name) => Boolean(assetData(name));
export const hasMusic = (name) => Boolean(manifest.music?.[name]);
export const decorCount = (size) => manifest.decor[size] ?? 0;

export function worldSprite(k, name, fallback = {}) {
  if (hasAsset(name)) return [k.sprite(name), k.scale(0.25)];
  return [
    k.rect(fallback.width ?? 64, fallback.height ?? 64),
    k.color(...(fallback.color ?? [159, 227, 193])),
  ];
}
