import {
  PEEKER_LANDING_GRACE, PEEKER_OVERHEAD_HEIGHT, PEEKER_OVERHEAD_RANGE,
  PEEKER_RANGE, PEEKER_RETURN_SPEED, PEEKER_SPEED,
} from "../config.js";
import { hasAsset } from "../manifest.js";
import { addGroundShadow, moveOutsideLamp, setVisualFrame } from "./shared.js";

export function createPeeker(k, position) {
  const ghost = k.add([
    k.pos(position), k.area({ shape: new k.Rect(k.vec2(-28, -108), 56, 104) }),
    k.z(21), "ghost", "peeker", "gameplay",
    { dangerous: true, origin: position.clone(), facing: 1, moving: false, landingGrace: 0 },
  ]);
  const visual = ghost.add([
    hasAsset("hantu/pengintai/diam") ? k.sprite("hantu/pengintai/diam") : k.rect(56, 112),
    k.anchor("bot"), k.scale(0.25), { currentFrame: "hantu/pengintai/diam" },
  ]);
  addGroundShadow(k, ghost, 28);

  ghost.onUpdate(() => {
    const player = k.get("player")[0];
    if (!player || player.dead) return;
    const dx = player.pos.x - ghost.pos.x;
    const playerFacesGhost = player.facing === Math.sign(ghost.pos.x - player.pos.x);
    ghost.landingGrace = Math.max(0, ghost.landingGrace - k.dt());
    if (!player.isGrounded() && Math.abs(dx) <= PEEKER_OVERHEAD_RANGE
      && player.pos.y <= ghost.pos.y - PEEKER_OVERHEAD_HEIGHT) {
      ghost.landingGrace = PEEKER_LANDING_GRACE;
    }
    if (ghost.landingGrace === 0) ghost.facing = Math.sign(dx) || ghost.facing;
    ghost.moving = false;
    if (player.isHidden) {
      const delta = ghost.origin.sub(ghost.pos);
      if (delta.len() > 2) {
        const next = ghost.pos.add(delta.unit().scale(PEEKER_RETURN_SPEED * k.dt()));
        const movement = moveOutsideLamp(k, ghost, next);
        ghost.pos = movement.position;
        ghost.moving = !movement.blocked;
      }
    } else if (ghost.landingGrace === 0 && Math.abs(dx) <= PEEKER_RANGE && !playerFacesGhost) {
      const next = ghost.pos.add(k.vec2(ghost.facing * PEEKER_SPEED * k.dt(), 0));
      const movement = moveOutsideLamp(k, ghost, next);
      ghost.pos = movement.position;
      ghost.moving = !movement.blocked;
    }
    setVisualFrame(k, visual, ghost.moving ? "hantu/pengintai/maju" : "hantu/pengintai/diam");
    visual.scale.x = Math.abs(visual.scale.x) * ghost.facing;
  });
  return ghost;
}
