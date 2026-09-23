import {
  COLORS, MENU_BACKGROUND_SCALE, MENU_BACKGROUND_SWAY_SPEED,
  MENU_BACKGROUND_SWAY_X, MENU_BACKGROUND_SWAY_Y, MENU_GLOW_LAYERS,
  MENU_LAMP_FLICKER_SPEED, MENU_LAMP_GLOWS, MENU_MOONLIGHT_OPACITY,
  MENU_MOONLIGHT_PULSE,
} from "../config.js";

function coverMetrics(k, data) {
  const width = data.width * 4;
  const height = data.height * 4;
  const scale = Math.max(k.width() / width, k.height() / height);
  return {
    scale,
    width: width * scale,
    height: height * scale,
    left: (k.width() - width * scale) / 2,
    top: (k.height() - height * scale) / 2,
  };
}

export function addMenuAtmosphere(k, cover, data) {
  if (!cover || !data) return;
  const moonlight = k.add([
    k.rect(k.width(), k.height()), k.pos(0, 0), k.color(...COLORS.moon),
    k.opacity(MENU_MOONLIGHT_OPACITY), k.fixed(), k.z(-98),
  ]);
  const lights = MENU_LAMP_GLOWS.map((lamp) => ({
    lamp,
    rings: MENU_GLOW_LAYERS.map((layer) => k.add([
      k.circle(1), k.pos(0, 0), k.anchor("center"), k.scale(1),
      k.color(...COLORS.warm), k.opacity(layer.opacity), k.fixed(), k.z(-95),
      { glowLayer: layer },
    ])),
  }));
  const controller = k.add([{ elapsed: 0, viewportWidth: 0, viewportHeight: 0 }]);

  controller.onUpdate(() => {
    controller.elapsed += k.dt();
    const metrics = coverMetrics(k, data);
    const breathe = MENU_BACKGROUND_SCALE + Math.sin(
      controller.elapsed * MENU_BACKGROUND_SWAY_SPEED,
    ) * 0.002;
    cover.scale = k.vec2(metrics.scale * breathe);
    cover.pos = k.vec2(
      k.width() / 2 + Math.sin(controller.elapsed * MENU_BACKGROUND_SWAY_SPEED) * MENU_BACKGROUND_SWAY_X,
      k.height() / 2 + Math.cos(controller.elapsed * MENU_BACKGROUND_SWAY_SPEED * 0.8) * MENU_BACKGROUND_SWAY_Y,
    );
    moonlight.width = k.width();
    moonlight.height = k.height();
    moonlight.opacity = MENU_MOONLIGHT_OPACITY
      + Math.sin(controller.elapsed * 0.35) * MENU_MOONLIGHT_PULSE;

    for (const { lamp, rings } of lights) {
      const softPulse = 0.9
        + Math.sin(controller.elapsed * MENU_LAMP_FLICKER_SPEED + lamp.phase) * 0.07
        + Math.sin(controller.elapsed * 11.3 + lamp.phase * 2) * 0.03;
      const x = metrics.left + metrics.width * lamp.x;
      const y = metrics.top + metrics.height * lamp.y;
      for (const ring of rings) {
        const radius = metrics.width * lamp.radius * ring.glowLayer.scale * softPulse;
        ring.pos = k.vec2(x, y);
        ring.scale = k.vec2(radius);
        ring.opacity = ring.glowLayer.opacity * softPulse;
      }
    }
  });
}
