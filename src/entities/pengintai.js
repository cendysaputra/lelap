import { PEEKER_RANGE, PEEKER_RETURN_SPEED, PEEKER_SPEED } from "../config.js";
import { hasAsset } from "../manifest.js";
import { addGroundShadow, moveWithLampRepel, setVisualFrame } from "./shared.js";

export function createPeeker(k, position) {
  const ghost = k.add([
    k.pos(position), k.area({ shape: new k.Rect(k.vec2(-28, -108), 56, 104) }),
    k.z(21), "ghost", "peeker", "gameplay",
    { dangerous: true, origin: position.clone(), facing: 1, moving: false },
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
    ghost.facing = Math.sign(dx) || ghost.facing;
    const playerFacesGhost = player.facing === Math.sign(ghost.pos.x - player.pos.x);
    ghost.moving = false;
    const immediateRetreat = moveWithLampRepel(k, ghost, ghost.pos);
    if (immediateRetreat.repelled) {
      ghost.pos = immediateRetreat.position;
      ghost.facing = Math.sign(immediateRetreat.direction.x) || ghost.facing;
      ghost.moving = true;
    } else if (player.isHidden) {
      const delta = ghost.origin.sub(ghost.pos);
      if (delta.len() > 2) {
        const next = ghost.pos.add(delta.unit().scale(PEEKER_RETURN_SPEED * k.dt()));
        const movement = moveWithLampRepel(k, ghost, next);
        ghost.pos = movement.position;
        if (movement.repelled) {
          ghost.facing = Math.sign(movement.direction.x) || ghost.facing;
          ghost.moving = true;
        }
      }
    } else if (Math.abs(dx) <= PEEKER_RANGE && !playerFacesGhost) {
      const next = ghost.pos.add(k.vec2(ghost.facing * PEEKER_SPEED * k.dt(), 0));
      const movement = moveWithLampRepel(k, ghost, next);
      ghost.pos = movement.position;
      if (movement.repelled) ghost.facing = Math.sign(movement.direction.x) || ghost.facing;
      ghost.moving = true;
    }
    setVisualFrame(k, visual, ghost.moving ? "hantu/pengintai/maju" : "hantu/pengintai/diam");
    visual.scale.x = Math.abs(visual.scale.x) * ghost.facing;
  });
  return ghost;
}
