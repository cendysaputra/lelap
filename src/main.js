import kaplay from "kaplay";
import "./style.css";
import { VIEW_HEIGHT } from "./config.js";
import { loadManifest } from "./manifest.js";
import { registerLoadingScene } from "./scenes/loading.js";
import { registerMenuScene } from "./scenes/menu.js";
import { registerGameScene } from "./scenes/game.js";
import { registerGameOverScene } from "./scenes/gameover.js";
import { registerWinScene } from "./scenes/win.js";
import { toggleFullscreen } from "./scenes/shared.js";

const k = kaplay({
  background: [10, 9, 20],
  crisp: true,
  loadingScreen: false,
  texFilter: "nearest",
  debug: true,
});

await loadManifest(k);
registerLoadingScene(k);
registerMenuScene(k);
registerGameScene(k);
registerGameOverScene(k);
registerWinScene(k);

window.addEventListener("keydown", async (event) => {
  if (event.code !== "KeyF" || event.repeat) return;
  await toggleFullscreen(k);
});

const updateScale = () => {
  document.documentElement.style.setProperty("--world-scale", String(k.height() / VIEW_HEIGHT));
};
window.addEventListener("resize", updateScale);
document.addEventListener("fullscreenchange", updateScale);
updateScale();

k.go("loading");
