import {
  GHOST_BOB, WANDERER_ALERT_TIME, WANDERER_CHASE_SPEED,
  WANDERER_HEAR_RANGE, WANDERER_LOSE_TIME, WANDERER_PATROL_RANGE,
  WANDERER_PATROL_SPEED, WANDERER_SIGHT_HEIGHT, WANDERER_SIGHT_RANGE,
} from "../config.js";
import { hasAsset } from "../manifest.js";
import { addGroundShadow, blockedByLamp, setVisualFrame } from "./shared.js";

function lineBlocked(solids, from, to) {
  const left = Math.min(from.x, to.x);
  const right = Math.max(from.x, to.x);
  return solids.some((solid) => {
    const box = solid.worldArea?.().bbox();
    if (!box) return false;
    const crossesX = box.pos.x < right && box.pos.x + box.width > left;
    const lineY = from.y - 36;
    return crossesX && lineY > box.pos.y && lineY < box.pos.y + box.height;
  });
}

export function createWanderer(k, position) {
  const ghost = k.add([
    k.pos(position), k.area({ shape: new k.Rect(k.vec2(-28, -66), 56, 62) }),
    k.z(21), "ghost", "wanderer", "gameplay",
    {
      dangerous: true, state: "patrol", facing: 1, origin: position.clone(),
      stateTime: 0, lostTime: 0, animationTime: 0,
    },
  ]);
  const visual = ghost.add([
    hasAsset("hantu/pengembara/melayang-1") ? k.sprite("hantu/pengembara/melayang-1") : k.rect(56, 72),
    k.anchor("bot"), k.scale(0.25), k.pos(0, 0),
    { currentFrame: "hantu/pengembara/melayang-1" },
  ]);
  const alert = ghost.add([
    k.text("!", { size: 42, font: "pixelify" }), k.color(224, 71, 76),
    k.outline(3, k.rgb(21, 19, 38)), k.anchor("center"), k.pos(0, -100), k.opacity(0),
  ]);
  addGroundShadow(k, ghost, 30, 4);

  ghost.onUpdate(() => {
    const player = k.get("player")[0];
    if (!player || player.dead) return;
    const solids = ghost.solids ??= (k.get("level")[0]?.get("solid") ?? []);
    ghost.animationTime += k.dt();
    const frame = Math.floor(ghost.animationTime * 4) % 2 + 1;
    setVisualFrame(k, visual, `hantu/pengembara/melayang-${frame}`);
    visual.pos.y = Math.sin(k.time() * 2 + ghost.origin.x) * GHOST_BOB;
    visual.scale.x = Math.abs(visual.scale.x) * ghost.facing;

    const dx = player.pos.x - ghost.pos.x;
    const dy = player.pos.y - ghost.pos.y;
    const inFront = Math.sign(dx || ghost.facing) === ghost.facing;
    const sees = !player.isHidden && Math.abs(dx) <= WANDERER_SIGHT_RANGE
      && Math.abs(dy) < WANDERER_SIGHT_HEIGHT && inFront
      && !lineBlocked(solids, ghost.pos, player.pos);
    if (ghost.state === "patrol") {
      if (sees) {
        ghost.state = "alert";
        ghost.stateTime = 0;
        alert.opacity = 1;
        alert.scale = k.vec2(0.2);
      } else {
        if (player.isRunning && Math.abs(dx) <= WANDERER_HEAR_RANGE) ghost.facing = Math.sign(dx) || ghost.facing;
        const next = ghost.pos.add(k.vec2(ghost.facing * WANDERER_PATROL_SPEED * k.dt(), 0));
        const hitsWall = solids.some((solid) => solid.hasPoint?.(next.add(ghost.facing * 34, -34)));
        if (hitsWall || Math.abs(next.x - ghost.origin.x) > WANDERER_PATROL_RANGE || blockedByLamp(k, next)) ghost.facing *= -1;
        else ghost.pos = next;
      }
    } else if (ghost.state === "alert") {
      ghost.stateTime += k.dt();
      alert.scale = k.vec2(Math.min(1, alert.scale.x + k.dt() * 6));
      if (ghost.stateTime >= WANDERER_ALERT_TIME) {
        ghost.state = "chase";
        alert.opacity = 0;
      }
    } else if (ghost.state === "chase") {
      ghost.facing = Math.sign(dx) || ghost.facing;
      ghost.lostTime = sees ? 0 : ghost.lostTime + k.dt();
      const direction = player.pos.sub(ghost.pos).unit();
      const next = ghost.pos.add(direction.scale(WANDERER_CHASE_SPEED * k.dt()));
      if (!blockedByLamp(k, next)) ghost.pos = next;
      if (ghost.lostTime >= WANDERER_LOSE_TIME) ghost.state = "return";
    } else {
      const delta = ghost.origin.sub(ghost.pos);
      if (delta.len() < 8) {
        ghost.pos = ghost.origin.clone();
        ghost.state = "patrol";
      } else ghost.pos = ghost.pos.add(delta.unit().scale(WANDERER_PATROL_SPEED * k.dt()));
      if (sees) ghost.state = "alert";
    }
  });
  return ghost;
}
