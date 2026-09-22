import kaplay from "kaplay";
import "./style.css";
import { VIEW_HEIGHT } from "./config.js";
import { loadManifest } from "./manifest.js";
import { registerLoadingScene } from "./scenes/loading.js";
import { registerMenuScene } from "./scenes/menu.js";
import { registerGameScene } from "./scenes/game.js";
import { registerGameOverScene } from "./scenes/gameover.js";
import { registerWinScene } from "./scenes/win.js";

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

k.onKeyPress("f", async () => {
  try { await k.setFullscreen(!k.isFullscreen()); }
  catch (error) { console.warn("Layar penuh tidak tersedia.", error); }
});

k.onResize(() => {
  document.documentElement.style.setProperty("--world-scale", String(k.height() / VIEW_HEIGHT));
});

k.go("loading");
