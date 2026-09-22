import { LAMP_RADIUS } from "../config.js";
import { worldSprite } from "../manifest.js";
import { addGroundShadow } from "./shared.js";

export function createLamp(k, position) {
  const lamp = k.add([
    ...worldSprite(k, "objek/lampu", { width: 60, height: 96 }),
    k.pos(position), k.anchor("botleft"), k.area(), k.z(16),
    "lamp", "gameplay", { radius: LAMP_RADIUS, baseOpacity: 1 },
  ]);
  lamp.onUpdate(() => { lamp.opacity = 0.95 + Math.sin(k.time() * 2.3 + lamp.pos.x) * 0.035; });
  addGroundShadow(k, lamp, 26);
  return lamp;
}
