import { assetData, hasAsset } from "../manifest.js";
import { COLORS, VIEW_HEIGHT } from "../config.js";
import { createButton, enableButtonNavigation } from "../ui/button.js";
import { createPanel } from "../ui/panel.js";
import { addGameText } from "../ui/text.js";
import { fadeTo, requestFullscreen } from "./shared.js";

function addCover(k, name) {
  if (!hasAsset(name)) return k.add([k.rect(k.width(), k.height()), k.color(...COLORS.night), k.fixed()]);
  const data = assetData(name);
  const fileScale = Math.max(k.width() / (data.width * 4), k.height() / (data.height * 4));
  return k.add([k.sprite(name), k.pos(k.center()), k.anchor("center"), k.scale(fileScale), k.fixed(), k.z(-100)]);
}

function showControls(k) {
  const panel = createPanel(k);
  const uiScale = k.height() / VIEW_HEIGHT;
  const lines = [
    "CARA MAIN", "A / D  atau  ← / →    BERGERAK", "SHIFT                  BERLARI",
    "SPACE / W              MELOMPAT", "S                      BERSEMBUNYI",
    "P                      JEDA", "F                      LAYAR PENUH",
  ].join("\n");
  const copy = addGameText(k, lines, k.vec2(k.width() / 2, k.height() / 2 - 35 * uiScale), {
    size: 24, lineSpacing: 10, z: 82,
  });
  const close = createButton(k, {
    label: "TUTUP", pos: k.vec2(k.width() / 2, k.height() / 2 + 180 * uiScale), z: 83,
    onPress: () => { k.destroy(panel); copy.destroy(); k.destroy(close); },
  });
}

export function registerMenuScene(k) {
  k.scene("menu", () => {
    k.setBackground(...COLORS.night);
    addCover(k, "bg/title");
    const uiScale = k.height() / VIEW_HEIGHT;
    if (hasAsset("ui/logo")) {
      const logo = k.add([
        k.sprite("ui/logo"), k.pos(k.width() / 2, k.height() * 0.28),
        k.anchor("center"), k.scale(0.25 * uiScale), k.fixed(), k.z(10),
        { originY: k.height() * 0.28 },
      ]);
      logo.onUpdate(() => { logo.pos.y = logo.originY + Math.sin(k.time() * 1.5) * 7 * uiScale; });
    } else addGameText(k, "LELAP", k.vec2(k.width() / 2, k.height() * 0.28), { size: 86 });
    for (let index = 0; index < 24; index += 1) {
      const dust = k.add([
        k.circle((1 + index % 3) * uiScale), k.pos(k.rand(0, k.width()), k.rand(0, k.height())),
        k.color(...COLORS.moon), k.opacity(k.rand(0.12, 0.42)), k.fixed(), k.z(2),
        { speed: k.rand(4, 12) * uiScale },
      ]);
      dust.onUpdate(() => { dust.pos.y -= dust.speed * k.dt(); if (dust.pos.y < 0) dust.pos.y = k.height(); });
    }
    const start = createButton(k, {
      label: "MULAI", pos: k.vec2(k.width() / 2, k.height() * 0.65),
      onPress: async () => { await requestFullscreen(k); fadeTo(k, "game"); },
    });
    const controls = createButton(k, {
      label: "CARA MAIN", pos: k.vec2(k.width() / 2, k.height() * 0.78), onPress: () => showControls(k),
    });
    enableButtonNavigation(k, [start, controls]);
  });
}
