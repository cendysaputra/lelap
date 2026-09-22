import { assetData, worldSprite } from "../manifest.js";
import { addGroundShadow } from "./shared.js";

export function createCloset(k, position) {
  const data = assetData("objek/lemari");
  const closet = k.add([
    ...worldSprite(k, "objek/lemari", { width: 72, height: 128 }),
    k.pos(position), k.anchor("botleft"), k.area(), k.z(18),
    "closet", { worldWidth: data?.width ?? 72 },
  ]);
  addGroundShadow(k, closet, 34);
  return closet;
}
