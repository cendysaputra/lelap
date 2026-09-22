import { worldSprite } from "../manifest.js";
import { addGroundShadow } from "./shared.js";

export function createGoal(k, position) {
  const goal = k.add([
    ...worldSprite(k, "objek/boneka", { width: 56, height: 56 }),
    k.pos(position), k.anchor("botleft"), k.area(), k.z(18),
    "goal", "gameplay", { baseY: position.y },
  ]);
  goal.onUpdate(() => { goal.pos.y = goal.baseY + Math.sin(k.time() * 2) * 7; });
  addGroundShadow(k, goal, 22);
  return goal;
}
