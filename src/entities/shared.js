import { COLORS, LAMP_RADIUS } from "../config.js";

export function addGroundShadow(k, owner, radius = 28, offsetY = 2) {
  const shadow = k.add([
    k.pos(owner.pos.x, owner.pos.y + offsetY),
    k.z((owner.z ?? 10) - 1),
    {
      id: "groundShadow",
      draw() {
        k.drawEllipse({
          radiusX: radius,
          radiusY: 7,
          color: k.rgb(...COLORS.night),
          opacity: 0.48,
        });
      },
    },
  ]);
  shadow.onUpdate(() => { shadow.pos = k.vec2(owner.pos.x, owner.pos.y + offsetY); });
  owner.onDestroy(() => k.destroy(shadow));
  return shadow;
}

export function blockedByLamp(k, position) {
  return k.get("lamp").some((lamp) => position.dist(lamp.pos) < (lamp.radius ?? LAMP_RADIUS));
}

export function setVisualFrame(k, visual, name) {
  if (visual.currentFrame === name) return;
  visual.currentFrame = name;
  visual.use(k.sprite(name));
}
