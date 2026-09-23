import { COLORS, GHOST_LAMP_BOUNDARY_MARGIN, LAMP_RADIUS } from "../config.js";

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

export function moveOutsideLamp(k, ghost, intended) {
  const current = ghost.pos;
  const lamp = k.get("lamp").find((item) => {
    const boundary = (item.radius ?? LAMP_RADIUS) + GHOST_LAMP_BOUNDARY_MARGIN;
    return intended.dist(item.pos) < boundary && intended.dist(item.pos) <= current.dist(item.pos);
  });
  return { position: lamp ? current : intended, blocked: Boolean(lamp), lamp };
}

export function setVisualFrame(k, visual, name) {
  if (visual.currentFrame === name) return;
  visual.currentFrame = name;
  visual.use(k.sprite(name));
}
