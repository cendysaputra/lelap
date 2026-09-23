import { assetData, hasAsset } from "../manifest.js";
import { COLORS, VIEW_HEIGHT } from "../config.js";

export function createButton(k, options) {
  const uiScale = k.height() / VIEW_HEIGHT;
  const data = assetData("ui/button");
  const width = (data?.width ?? 256) * uiScale;
  const height = (data?.height ?? 86) * uiScale;
  const visual = hasAsset("ui/button")
    ? [k.sprite("ui/button"), k.scale(0.25 * uiScale)]
    : [k.rect(width, height), k.color(62, 43, 37)];
  const button = k.add([
    ...visual,
    k.pos(options.pos),
    k.anchor("center"),
    k.area(),
    k.fixed(),
    k.z(options.z ?? 30),
    k.opacity(1),
    "uiButton",
    { focused: false, pressed: false, baseScale: 0.25 * uiScale },
  ]);
  const label = button.add([
    k.text(options.label, { size: 108, font: "pixelify" }),
    k.color(...COLORS.moon),
    k.outline(12, k.rgb(...COLORS.night)),
    k.anchor("center"),
    k.pos(0, -8),
    k.z(1),
  ]);
  button.setLabel = (value) => { label.text = value; };
  button.setFocused = (value) => { button.focused = value; };
  button.activate = () => {
    if (button.pressed) return;
    button.pressed = true;
    k.wait(0.1, () => {
      button.pressed = false;
      if (button.exists()) options.onPress();
    });
  };
  button.onHover(() => { button.focused = true; k.setCursor("pointer"); });
  button.onHoverEnd(() => { button.focused = false; k.setCursor("default"); });
  button.onClick(button.activate);
  button.onUpdate(() => {
    const target = button.pressed ? 0.96 : button.focused ? 1.06 : 1;
    if (hasAsset("ui/button")) {
      const value = k.lerp(button.scale.x, button.baseScale * target, 12 * k.dt());
      button.scale = k.vec2(value);
    }
    button.opacity = k.lerp(button.opacity, button.focused ? 1 : 0.9, 10 * k.dt());
  });
  return button;
}

export function enableButtonNavigation(k, buttons) {
  let selected = 0;
  const refresh = () => buttons.forEach((button, index) => button.setFocused(index === selected));
  const move = (step) => {
    selected = (selected + step + buttons.length) % buttons.length;
    refresh();
  };
  refresh();
  const events = [
    k.onKeyPress(["up", "left"], () => move(-1)),
    k.onKeyPress(["down", "right"], () => move(1)),
    k.onKeyPress("enter", () => buttons[selected]?.activate()),
  ];
  return () => events.forEach((event) => event.cancel());
}
