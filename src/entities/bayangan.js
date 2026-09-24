import {
  SHADOW_COOLDOWN, SHADOW_TRIGGER_RANGE, SHADOW_UP_TIME, SHADOW_WARN_TIME,
} from "../config.js";
import { hasAsset } from "../manifest.js";
import { addGroundShadow, lampCenter, setVisualFrame } from "./shared.js";

export function createShadow(k, position) {
  const ghost = k.add([
    k.pos(position), k.area({ shape: new k.Rect(k.vec2(-28, -124), 56, 124) }),
    k.z(19), "ghost", "shadowGhost", "gameplay",
    { dangerous: false, state: "hidden", timer: 0, originX: position.x },
  ]);
  const visual = ghost.add([
    hasAsset("hantu/bayangan/sembunyi") ? k.sprite("hantu/bayangan/sembunyi") : k.rect(224, 96),
    k.anchor("bot"), k.scale(0.25), { currentFrame: "hantu/bayangan/sembunyi" },
  ]);
  setVisualFrame(k, visual, "hantu/bayangan/sembunyi");
  addGroundShadow(k, ghost, 32);

  ghost.onUpdate(() => {
    const player = k.get("player")[0];
    if (!player || player.dead) return;
    if (k.get("lamp").some((lamp) => ghost.pos.dist(lampCenter(lamp)) <= lamp.radius)) return;
    ghost.timer += k.dt();
    if (ghost.state === "hidden" && !player.isHidden && Math.abs(player.pos.x - ghost.pos.x) <= SHADOW_TRIGGER_RANGE) {
      ghost.state = "warn";
      ghost.timer = 0;
    } else if (ghost.state === "warn") {
      ghost.pos.x = ghost.originX + Math.sin(ghost.timer * 65) * 5;
      if (ghost.timer >= SHADOW_WARN_TIME) {
        ghost.pos.x = ghost.originX;
        ghost.state = "up";
        ghost.timer = 0;
        ghost.dangerous = true;
        setVisualFrame(k, visual, "hantu/bayangan/muncul");
        if (visual.is("rect")) visual.height = 512;
      }
    } else if (ghost.state === "up" && ghost.timer >= SHADOW_UP_TIME) {
      ghost.state = "cooldown";
      ghost.timer = 0;
      ghost.dangerous = false;
      setVisualFrame(k, visual, "hantu/bayangan/sembunyi");
      if (visual.is("rect")) visual.height = 96;
    } else if (ghost.state === "cooldown" && ghost.timer >= SHADOW_COOLDOWN) {
      ghost.state = "hidden";
      ghost.timer = 0;
    }
  });
  return ghost;
}
