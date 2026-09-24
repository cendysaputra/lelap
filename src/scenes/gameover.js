import { createButton, enableButtonNavigation } from "../ui/button.js";
import { createPanel } from "../ui/panel.js";
import { addGameText } from "../ui/text.js";
import {
  COLORS, GAME_OVER_ART_MAX_HEIGHT, GAME_OVER_ART_MAX_WIDTH,
  GAME_OVER_ART_Y, GAME_OVER_BUTTON_OFFSET, GAME_OVER_BUTTON_Y,
  GAME_OVER_PANEL_MARGIN, GAME_OVER_PANEL_SCALE, GAME_OVER_TITLE_Y, VIEW_HEIGHT,
} from "../config.js";
import { assetData, hasAsset } from "../manifest.js";
import { fadeTo } from "./shared.js";

const ILLUSTRATIONS = {
  "DITELAN BAYANGAN": "ui/game-over/game-over-ditelan-bayangan",
  "JATUH KE KEGELAPAN": "ui/game-over/game-over-jatuh",
  TERTANGKAP: "ui/game-over/game-over-tertangkap-pengembara",
};

function addDefeatIllustration(k, reason) {
  const name = ILLUSTRATIONS[reason] ?? ILLUSTRATIONS.TERTANGKAP;
  if (!hasAsset(name)) return null;
  const data = assetData(name);
  const fit = Math.min(GAME_OVER_ART_MAX_WIDTH / data.width, GAME_OVER_ART_MAX_HEIGHT / data.height);
  return k.add([
    k.sprite(name),
    k.pos(k.width() / 2, k.height() * GAME_OVER_ART_Y),
    k.anchor("center"),
    k.scale(0.25 * (k.height() / VIEW_HEIGHT) * fit),
    k.fixed(),
    k.z(90),
  ]);
}

export function registerGameOverScene(k) {
  k.scene("gameover", ({ reason = "TERTANGKAP" } = {}) => {
    k.setBackground(...COLORS.night);
    const uiScale = k.height() / VIEW_HEIGHT;
    const panelWidth = assetData("ui/panel")?.width ?? 680;
    const availableWorldWidth = k.width() / uiScale - GAME_OVER_PANEL_MARGIN * 2;
    createPanel(k, { scale: Math.min(GAME_OVER_PANEL_SCALE, availableWorldWidth / panelWidth) });
    addDefeatIllustration(k, reason);
    addGameText(k, reason, k.vec2(k.width() / 2, k.height() * GAME_OVER_TITLE_Y), { size: 48, z: 90, color: COLORS.red });
    const buttonY = k.height() * GAME_OVER_BUTTON_Y;
    const buttonOffset = GAME_OVER_BUTTON_OFFSET * uiScale;
    const retry = createButton(k, { label: "ULANG", pos: k.vec2(k.width() / 2 - buttonOffset, buttonY), z: 90, onPress: () => fadeTo(k, "game") });
    const menu = createButton(k, { label: "MENU", pos: k.vec2(k.width() / 2 + buttonOffset, buttonY), z: 90, onPress: () => fadeTo(k, "menu") });
    enableButtonNavigation(k, [retry, menu]);
  });
}
