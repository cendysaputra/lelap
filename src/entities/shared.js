import { COLORS, GHOST_LAMP_BOUNDARY_MARGIN, LAMP_RADIUS, LAMP_LIGHT_OFFSET_X, LAMP_LIGHT_OFFSET_Y } from "../config.js";
import { hasAsset } from "../manifest.js";

export const lampCenter = (lamp) => lamp.pos.add(LAMP_LIGHT_OFFSET_X, LAMP_LIGHT_OFFSET_Y);

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
  shadow.onUpdate(() => {
    shadow.hidden = owner.isHidden ?? false;
    shadow.pos = k.vec2(owner.pos.x, owner.pos.y + offsetY);
  });
  owner.onDestroy(() => k.destroy(shadow));
  return shadow;
}

export function moveOutsideLamp(k, ghost, intended) {
  const current = ghost.pos;
  const lamp = k.get("lamp").find((item) => {
    const boundary = (item.radius ?? LAMP_RADIUS) + GHOST_LAMP_BOUNDARY_MARGIN;
    const center = lampCenter(item);
    return intended.dist(center) < boundary && intended.dist(center) <= current.dist(center);
  });
  return { position: lamp ? current : intended, blocked: Boolean(lamp), lamp };
}

export function setVisualFrame(k, visual, name) {
  if (!hasAsset(name)) {
    if (hasAsset(visual.currentFrame)) return;
    const group = name.substring(0, name.lastIndexOf("/"));
    name = ["idle", "jalan-1", "lompat", "sembunyi", "melayang-1", "melayang-2", "diam", "maju", "muncul"]
      .map((frame) => `${group}/${frame}`).find(hasAsset);
    if (!name) return;
  }
  if (visual.currentFrame === name) return;
  if (visual.is("rect")) visual.unuse("rect");
  visual.currentFrame = name;
  visual.use(k.sprite(name));
}
