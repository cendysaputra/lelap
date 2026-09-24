import { gameFont } from "../manifest.js";
import { makeResponsive } from "./responsive.js";
import { COLORS, VIEW_HEIGHT } from "../config.js";

export function textComponents(k, value, options = {}) {
  const uiScale = options.fixed === false ? 1 : k.height() / VIEW_HEIGHT;
  const components = [
    k.text(value, {
      size: (options.size ?? 28) * uiScale,
      width: options.width ? options.width * uiScale : undefined,
      align: options.align ?? "center",
      font: gameFont(),
      lineSpacing: (options.lineSpacing ?? 6) * uiScale,
    }),
    k.color(...(options.color ?? COLORS.moon)),
    k.outline((options.outline ?? 3) * uiScale, k.rgb(...COLORS.night)),
    k.anchor(options.anchor ?? "center"),
  ];
  if (options.fixed !== false) components.push(k.fixed());
  if (options.z !== undefined) components.push(k.z(options.z));
  return components;
}

export function addGameText(k, value, position, options = {}) {
  const uiScale = options.fixed === false ? 1 : k.height() / VIEW_HEIGHT;
  const shadow = k.add([
    ...textComponents(k, value, { ...options, color: COLORS.night, outline: 0 }),
    k.pos(position.x + 3 * uiScale, position.y + 4 * uiScale),
    k.opacity(0.6),
  ]);
  const label = k.add([...textComponents(k, value, options), k.pos(position)]);
  if (options.fixed !== false) {
    makeResponsive(k, shadow);
    makeResponsive(k, label);
  }
  return {
    label,
    shadow,
    destroy: () => { k.destroy(label); k.destroy(shadow); },
  };
}
