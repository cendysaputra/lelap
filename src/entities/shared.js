import {
  COLORS, GHOST_LAMP_REPEL_MARGIN, GHOST_LAMP_RETREAT_DISTANCE,
  GHOST_LAMP_RETREAT_SPEED, LAMP_RADIUS,
} from "../config.js";

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

export function moveWithLampRepel(k, ghost, intended) {
  const current = ghost.pos;
  const retreat = ghost.lampRetreat;
  if (retreat && current.dist(retreat.lamp.pos) >= retreat.releaseRadius) {
    ghost.lampRetreat = null;
  }
  const lamp = ghost.lampRetreat?.lamp ?? k.get("lamp").find((item) => {
    const safeRadius = (item.radius ?? LAMP_RADIUS) + GHOST_LAMP_REPEL_MARGIN;
    return current.dist(item.pos) < safeRadius || intended.dist(item.pos) < safeRadius;
  });
  if (!lamp) return { position: intended, repelled: false, direction: null };
  if (!ghost.lampRetreat) {
    ghost.lampRetreat = {
      lamp,
      direction: k.vec2(Math.sign(current.x - lamp.pos.x) || -ghost.facing || 1, 0),
      releaseRadius: (lamp.radius ?? LAMP_RADIUS) + GHOST_LAMP_REPEL_MARGIN + GHOST_LAMP_RETREAT_DISTANCE,
    };
  }
  const { direction } = ghost.lampRetreat;
  return {
    position: current.add(direction.scale(GHOST_LAMP_RETREAT_SPEED * k.dt())),
    repelled: true,
    direction,
  };
}

export function setVisualFrame(k, visual, name) {
  if (visual.currentFrame === name) return;
  visual.currentFrame = name;
  visual.use(k.sprite(name));
}
