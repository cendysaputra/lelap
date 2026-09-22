import { assetData, hasAsset } from "../manifest.js";

const LAYERS = [
  { name: "bg/far", factor: 0.15, z: -100 },
  { name: "bg/mid", factor: 0.4, z: -90 },
  { name: "bg/near", factor: 0.7, z: 70 },
];

export function createBackground(k, cameraX) {
  for (const layer of LAYERS) {
    if (!hasAsset(layer.name)) continue;
    const data = assetData(layer.name);
    const scale = k.height() / (data.height * 4);
    const imageWidth = data.width * 4 * scale;
    for (let index = -1; index <= Math.ceil(k.width() / imageWidth) + 1; index += 1) {
      const image = k.add([
        k.sprite(layer.name), k.pos(0, 0), k.scale(scale),
        k.fixed(), k.z(layer.z), { repeatIndex: index },
      ]);
      image.onUpdate(() => {
        const offset = ((cameraX() * layer.factor * (k.height() / 768)) % imageWidth + imageWidth) % imageWidth;
        image.pos.x = image.repeatIndex * imageWidth - offset;
      });
    }
  }
}
