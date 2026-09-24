import { CAMERA_FOLLOW_SPEED, VIEW_HEIGHT } from "../config.js";

export function createCamera(k, player, levelSize) {
  let cameraX;
  const update = () => {
    const zoom = k.height() / VIEW_HEIGHT;
    const visibleWidth = k.width() / zoom;
    const half = visibleWidth / 2;
    const minX = Math.min(half, levelSize.width / 2);
    const maxX = Math.max(minX, levelSize.width - half);
    const targetX = k.clamp(player.pos.x, minX, maxX);
    cameraX = cameraX === undefined ? targetX : k.clamp(k.lerp(cameraX, targetX, Math.min(1, CAMERA_FOLLOW_SPEED * k.dt())), minX, maxX);
    k.setCamScale(zoom);
    k.setCamPos(cameraX, VIEW_HEIGHT / 2);
  };
  k.onUpdate(update);
  update();
  return () => cameraX;
}
