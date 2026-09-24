import { COLORS, GRAVITY } from "../config.js";
import { LEVELS, validateLevel } from "../levels.js";
import { buildLevel } from "../systems/level.js";
import { createBackground } from "../systems/background.js";
import { createCamera } from "../systems/camera.js";
import { createDarkness } from "../systems/darkness.js";
import { createPlayer } from "../entities/player.js";
import { createWanderer } from "../entities/pengembara.js";
import { createPeeker } from "../entities/pengintai.js";
import { createShadow } from "../entities/bayangan.js";
import { createCloset } from "../entities/lemari.js";
import { createLamp } from "../entities/lampu.js";
import { createGoal } from "../entities/goal.js";
import { createPortal } from "../entities/portal.js";
import { createHud } from "../ui/hud.js";
import { createButton, enableButtonNavigation } from "../ui/button.js";
import { createPanel } from "../ui/panel.js";
import { addGameText } from "../ui/text.js";
import { fadeTo } from "./shared.js";

export function registerGameScene(k) {
  k.scene("game", () => {
    k.setBackground(...COLORS.night);
    k.setGravity(GRAVITY);
    const level = LEVELS[0];
    const levelSize = validateLevel(level);
    let player;
    buildLevel(k, level, {
      player: (position) => { player = createPlayer(k, position, levelSize.height); return player; },
      wanderer: (position) => createWanderer(k, position),
      peeker: (position) => createPeeker(k, position),
      shadow: (position) => createShadow(k, position),
      closet: (position) => createCloset(k, position),
      lamp: (position) => createLamp(k, position),
      goal: (position) => createGoal(k, position),
      portal: (position) => createPortal(k, position),
    });
    if (!player) throw new Error("Level tidak memiliki posisi awal player (P).");
    const cameraX = createCamera(k, player, levelSize);
    createBackground(k, cameraX);
    createDarkness(k, player);
    createHud(k, player);

    let paused = false;
    let pauseItems = [];
    let stopNavigation = () => {};
    const setPaused = (value) => {
      paused = value;
      k.get("gameplay").forEach((object) => { object.paused = value; });
    };
    const closePause = () => {
      stopNavigation();
      setPaused(false);
      pauseItems.forEach((item) => item.destroy?.());
      pauseItems = [];
    };
    k.onKeyPress("p", () => {
      if (player.dead) return;
      if (paused) return closePause();
      setPaused(true);
      const panel = createPanel(k, { z: 200 });
      const title = addGameText(k, "JEDA", k.vec2(k.width() / 2, k.height() * 0.4), { size: 48, z: 210 });
      const resume = createButton(k, { label: "LANJUT", pos: k.vec2(k.width() / 2, k.height() * 0.58), z: 210, onPress: closePause });
      const menu = createButton(k, { label: "MENU", pos: k.vec2(k.width() / 2, k.height() * 0.72), z: 210, onPress: () => { setPaused(false); fadeTo(k, "menu"); } });
      pauseItems = [panel, title, resume, menu];
      stopNavigation = enableButtonNavigation(k, [resume, menu]);
    });
  });
}
