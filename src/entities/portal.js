import { PORTAL_ANIMATION_FPS, PORTAL_FRAME_COUNT, PORTAL_HEIGHT, PORTAL_WIDTH } from "../config.js";
import { hasAsset, worldSprite } from "../manifest.js";
import { setVisualFrame } from "./shared.js";

export function createPortal(k, position) {
  const portal = k.add([
    k.pos(position),
    k.area({ shape: new k.Rect(k.vec2(22, -PORTAL_HEIGHT + 12), PORTAL_WIDTH - 44, PORTAL_HEIGHT - 24) }),
    k.z(18), "portal", "gameplay",
    { active: false, animationTime: 0 },
  ]);
  const visual = portal.add([
    ...worldSprite(k, "objek/portal/portal-1", { width: PORTAL_WIDTH, height: PORTAL_HEIGHT }),
    k.anchor("botleft"), k.opacity(0),
    { currentFrame: "objek/portal/portal-1" },
  ]);
  portal.activate = () => { portal.active = true; visual.opacity = 1; };
  portal.onUpdate(() => {
    if (!portal.active) return;
    portal.animationTime += k.dt();
    const frame = Math.floor(portal.animationTime * PORTAL_ANIMATION_FPS) % PORTAL_FRAME_COUNT + 1;
    const name = `objek/portal/portal-${frame}`;
    if (hasAsset(name)) setVisualFrame(k, visual, name);
  });
  return portal;
}
