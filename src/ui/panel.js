import { assetData, hasAsset } from "../manifest.js";
import { VIEW_HEIGHT } from "../config.js";
import { makeResponsive } from "./responsive.js";

export function createPanel(k, options = {}) {
  const uiScale = k.height() / VIEW_HEIGHT;
  const panelScale = options.scale ?? 1;
  const data = assetData("ui/panel");
  const visual = hasAsset("ui/panel")
    ? [k.sprite("ui/panel"), k.scale(0.25 * uiScale * panelScale)]
    : [k.rect((data?.width ?? 680) * uiScale * panelScale, (data?.height ?? 440) * uiScale * panelScale), k.color(62, 43, 37)];
  return makeResponsive(k, k.add([
    ...visual,
    k.pos(options.pos ?? k.center()),
    k.anchor("center"),
    k.fixed(),
    k.z(options.z ?? 80),
    "panel",
  ]));
}
