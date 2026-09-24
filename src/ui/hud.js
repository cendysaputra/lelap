import {
  BEARS_REQUIRED, COLORS, HUD_BAR_HEIGHT, HUD_BAR_WIDTH, HUD_BEAR_GAP,
  HUD_BEAR_PANEL_PADDING, HUD_BEAR_SIZE, HUD_CONTENT_GAP, HUD_EMBLEM_SIZE,
  HUD_BAR_BORDER, HUD_MARGIN, HUD_NAME_SIZE, HUD_PANEL_HEIGHT, HUD_PANEL_OPACITY,
  HUD_PANEL_RADIUS, HUD_PROFILE_GAP, HUD_PROFILE_PADDING, HUD_STAMINA_COLOR,
  HUD_TEXT_Z, HUD_TIMER_HEIGHT, HUD_TIMER_SIZE, HUD_TIMER_WIDTH, HUD_Z,
  STAMINA_MAX, VIEW_HEIGHT,
} from "../config.js";
import { assetData, hasAsset } from "../manifest.js";
import { addGameText } from "./text.js";

export function createHud(k, player) {
  let items = [];
  let bar;
  let bearIcons = [];
  let timer;
  let elapsed = 0;
  const rebuild = () => {
    items.forEach((item) => item.destroy?.());
    items = [];
    const scale = k.height() / VIEW_HEIGHT;
    const panelWidth = HUD_PROFILE_PADDING * 2 + HUD_EMBLEM_SIZE + HUD_BAR_WIDTH + HUD_PROFILE_GAP;
    const panelX = HUD_MARGIN * scale;
    const panelY = HUD_MARGIN * scale;
    const x = panelX + HUD_PROFILE_PADDING * scale;
    const emblemSize = HUD_EMBLEM_SIZE * scale;
    const emblemData = assetData("ui/emblem-player");
    const emblemHeight = emblemSize * (emblemData?.height ?? HUD_EMBLEM_SIZE)
      / (emblemData?.width ?? HUD_EMBLEM_SIZE);
    const emblemY = panelY + (HUD_PANEL_HEIGHT * scale - emblemHeight) / 2;
    const contentX = x + emblemSize + HUD_PROFILE_GAP * scale;
    const contentHeight = HUD_NAME_SIZE + HUD_CONTENT_GAP + HUD_BAR_HEIGHT;
    const contentY = panelY + (HUD_PANEL_HEIGHT - contentHeight) * scale / 2;
    const nameY = contentY + HUD_NAME_SIZE * scale / 2;
    const barY = contentY + (HUD_NAME_SIZE + HUD_CONTENT_GAP) * scale;
    const bearPanelWidth = BEARS_REQUIRED * HUD_BEAR_SIZE
      + (BEARS_REQUIRED - 1) * HUD_BEAR_GAP + HUD_BEAR_PANEL_PADDING * 2;
    const bearPanelHeight = HUD_BEAR_SIZE + HUD_BEAR_PANEL_PADDING * 2;
    const bearPanelX = k.width() - (HUD_MARGIN + bearPanelWidth) * scale;
    const bearPanelY = HUD_MARGIN * scale;
    const timerPanelX = (k.width() - HUD_TIMER_WIDTH * scale) / 2;
    const timerPanelY = HUD_MARGIN * scale;
    const add = (components) => {
      const item = k.add([...components, k.fixed(), k.z(HUD_Z)]);
      items.push(item);
      return item;
    };
    add([
      k.rect(panelWidth * scale, HUD_PANEL_HEIGHT * scale, { radius: HUD_PANEL_RADIUS * scale }),
      k.pos(panelX, panelY), k.color(...COLORS.night), k.opacity(HUD_PANEL_OPACITY),
    ]);
    const emblem = hasAsset("ui/emblem-player")
      ? [k.sprite("ui/emblem-player"), k.scale(emblemSize / ((assetData("ui/emblem-player")?.width ?? HUD_EMBLEM_SIZE) * 4))]
      : [k.rect(emblemSize, emblemSize), k.color(...COLORS.moon)];
    add([...emblem, k.pos(x, emblemY)]);
    const name = addGameText(k, "CENDI", k.vec2(contentX, nameY), {
      size: HUD_NAME_SIZE, anchor: "left", z: HUD_TEXT_Z,
    });
    items.push(name);
    add([
      k.rect((HUD_BAR_WIDTH + HUD_BAR_BORDER * 2) * scale, (HUD_BAR_HEIGHT + HUD_BAR_BORDER * 2) * scale, { radius: HUD_PANEL_RADIUS * scale / 2 }),
      k.pos(contentX - HUD_BAR_BORDER * scale, barY - HUD_BAR_BORDER * scale), k.color(...COLORS.shadow),
    ]);
    bar = add([
      k.rect(HUD_BAR_WIDTH * scale, HUD_BAR_HEIGHT * scale, { radius: HUD_BAR_HEIGHT * scale / 2 }),
      k.pos(contentX, barY), k.color(...HUD_STAMINA_COLOR),
    ]);
    add([
      k.rect(HUD_TIMER_WIDTH * scale, HUD_TIMER_HEIGHT * scale, { radius: HUD_PANEL_RADIUS * scale }),
      k.pos(timerPanelX, timerPanelY), k.color(...COLORS.night), k.opacity(HUD_PANEL_OPACITY),
    ]);
    timer = addGameText(k, formatTime(elapsed), k.vec2(
      k.width() / 2,
      timerPanelY + HUD_TIMER_HEIGHT * scale / 2,
    ), { size: HUD_TIMER_SIZE, z: HUD_TEXT_Z });
    items.push(timer);
    add([
      k.rect(bearPanelWidth * scale, bearPanelHeight * scale, { radius: HUD_PANEL_RADIUS * scale }),
      k.pos(bearPanelX, bearPanelY), k.color(...COLORS.night), k.opacity(HUD_PANEL_OPACITY),
    ]);
    bearIcons = Array.from({ length: BEARS_REQUIRED }, (_, index) => {
      const collected = index < player.bears;
      const name = collected ? "objek/boneka" : "ui/boneka-grayscale";
      const data = assetData(name) ?? assetData("objek/boneka");
      const components = hasAsset(name)
        ? [k.sprite(name), k.scale(HUD_BEAR_SIZE * scale / ((data?.height ?? HUD_BEAR_SIZE) * 4))]
        : [k.rect(HUD_BEAR_SIZE * scale, HUD_BEAR_SIZE * scale), k.color(...COLORS.moon)];
      return add([
        ...components,
        k.pos(
          bearPanelX + (HUD_BEAR_PANEL_PADDING + index * (HUD_BEAR_SIZE + HUD_BEAR_GAP)) * scale,
          bearPanelY + HUD_BEAR_PANEL_PADDING * scale,
        ),
        k.opacity(collected ? 1 : HUD_PANEL_OPACITY),
        { collected },
      ]);
    });
  };
  rebuild();
  k.onResize(rebuild);
  k.onUpdate(() => {
    if (!player.exists()) return;
    if (!player.paused && !player.dead) elapsed += k.dt();
    const scale = k.height() / VIEW_HEIGHT;
    bar.width = HUD_BAR_WIDTH * scale * player.stamina / STAMINA_MAX;
    const time = formatTime(elapsed);
    timer.label.text = time;
    timer.shadow.text = time;
    bearIcons.forEach((icon, index) => {
      if (icon.collected || index >= player.bears || !hasAsset("objek/boneka")) return;
      icon.use(k.sprite("objek/boneka"));
      icon.opacity = 1;
      icon.collected = true;
    });
  });
}

function formatTime(seconds) {
  const total = Math.floor(seconds);
  const minutes = String(Math.floor(total / 60)).padStart(2, "0");
  return `${minutes}:${String(total % 60).padStart(2, "0")}`;
}
