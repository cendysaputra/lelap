import { createButton, enableButtonNavigation } from "../ui/button.js";
import { createPanel } from "../ui/panel.js";
import { addGameText } from "../ui/text.js";
import { COLORS } from "../config.js";
import { fadeTo } from "./shared.js";

export function registerGameOverScene(k) {
  k.scene("gameover", ({ reason = "TERTANGKAP" } = {}) => {
    k.setBackground(...COLORS.night);
    createPanel(k);
    addGameText(k, reason, k.vec2(k.width() / 2, k.height() * 0.39), { size: 48, z: 90, color: COLORS.red });
    const retry = createButton(k, { label: "ULANG", pos: k.vec2(k.width() / 2, k.height() * 0.58), z: 90, onPress: () => fadeTo(k, "game") });
    const menu = createButton(k, { label: "MENU", pos: k.vec2(k.width() / 2, k.height() * 0.72), z: 90, onPress: () => fadeTo(k, "menu") });
    enableButtonNavigation(k, [retry, menu]);
  });
}
