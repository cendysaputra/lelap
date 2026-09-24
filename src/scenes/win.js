import { createButton, enableButtonNavigation } from "../ui/button.js";
import { createPanel } from "../ui/panel.js";
import { addGameText } from "../ui/text.js";
import { COLORS } from "../config.js";
import { fadeTo } from "./shared.js";

export function registerWinScene(k) {
  k.scene("win", () => {
    k.setBackground(...COLORS.night);
    createPanel(k);
    addGameText(k, "BONEKA DITEMUKAN", k.vec2(k.width() / 2, k.height() * 0.38), { size: 38, z: 90, color: COLORS.warm });
    addGameText(k, "Cendi keluar dari mimpi buruk...", k.vec2(k.width() / 2, k.height() * 0.48), { size: 26, z: 90 });
    const menu = createButton(k, { label: "MENU", pos: k.vec2(k.width() / 2, k.height() * 0.68), z: 90, onPress: () => fadeTo(k, "menu") });
    enableButtonNavigation(k, [menu]);
  });
}
