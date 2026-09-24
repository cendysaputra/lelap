import { makeResponsive } from "../ui/responsive.js";
import { assetData, hasAsset } from "../manifest.js";
import { COLORS, MENU_LOGO_SCALE, VIEW_HEIGHT } from "../config.js";
import { createButton, enableButtonNavigation } from "../ui/button.js";
import { createPanel } from "../ui/panel.js";
import { addGameText } from "../ui/text.js";
import { fadeTo, requestFullscreen } from "./shared.js";
import { addMenuAtmosphere } from "../systems/menu-atmosphere.js";
import {
  isMenuMusicMuted, pauseMenuMusic, prepareMenuMusic, resumeMenuMusic, toggleMenuMusic,
} from "../systems/music.js";

function addCover(k, name) {
  if (!hasAsset(name)) return null;
  const data = assetData(name);
  const fileScale = Math.max(k.width() / (data.width * 4), k.height() / (data.height * 4));
  return k.add([k.sprite(name), k.pos(k.center()), k.anchor("center"), k.scale(fileScale), k.fixed(), k.z(-100)]);
}

function addBottomLayer(k, name) {
  if (!hasAsset(name)) return null;
  const data = assetData(name);
  const fileScale = k.width() / (data.width * 4);
  const layer = k.add([
    k.sprite(name, data.defaultAnim ? { anim: data.defaultAnim } : {}),
    k.pos(k.width() / 2, k.height()),
    k.anchor("bot"), k.scale(fileScale), k.fixed(), k.z(-90),
  ]);
  layer.onUpdate(() => {
    layer.pos = k.vec2(k.width() / 2, k.height());
    layer.scale = k.vec2(k.width() / (data.width * 4));
  });
  return layer;
}

function showControls(k, onClose) {
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
    onPress: () => { stopNavigation(); k.destroy(panel); copy.destroy(); k.destroy(close); onClose(); },
  });
  const stopNavigation = enableButtonNavigation(k, [close]);
}

export function registerMenuScene(k) {
  k.scene("menu", () => {
    k.setBackground(...COLORS.night);
    prepareMenuMusic(k);
    let leavingMenu = false;
    const unlockMusic = () => { if (!leavingMenu) resumeMenuMusic(k); };
    const mouseUnlock = k.onMousePress(unlockMusic);
    const keyUnlock = k.onKeyPress(unlockMusic);
    k.onSceneLeave(() => {
      mouseUnlock.cancel();
      keyUnlock.cancel();
    });
    const cover = addCover(k, "bg/title");
    addMenuAtmosphere(k, cover, assetData("bg/title"));
    addBottomLayer(k, "bg/title-asap");
    const uiScale = k.height() / VIEW_HEIGHT;
    if (hasAsset("ui/logo")) {
      makeResponsive(k, k.add([
        k.sprite("ui/logo"), k.pos(k.width() / 2, k.height() * 0.28),
        k.anchor("center"), k.scale(MENU_LOGO_SCALE * uiScale), k.fixed(), k.z(10),
      ]));
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
      onPress: async () => {
        if (leavingMenu) return;
        leavingMenu = true;
        buttons.forEach((button) => { button.enabled = false; });
        pauseMenuMusic();
        await requestFullscreen(k);
        fadeTo(k, "game");
      },
    });
    const controls = createButton(k, {
      label: "CARA MAIN", pos: k.vec2(k.width() / 2, k.height() * 0.78), onPress: () => {
        stopNavigation();
        buttons.forEach((button) => { button.enabled = false; });
        showControls(k, () => {
          buttons.forEach((button) => { button.enabled = true; });
          stopNavigation = enableButtonNavigation(k, buttons);
        });
      },
    });
    const music = createButton(k, {
      label: isMenuMusicMuted() ? "MUSIK: MATI" : "MUSIK: NYALA",
      pos: k.vec2(k.width() / 2, k.height() * 0.9),
      onPress: () => {
        const muted = toggleMenuMusic(k);
        music.setLabel(muted ? "MUSIK: MATI" : "MUSIK: NYALA");
      },
    });
    const buttons = [start, controls, music];
    let stopNavigation = enableButtonNavigation(k, buttons);
  });
}
