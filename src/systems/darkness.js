import { lampCenter } from "../entities/shared.js";
import {
  COLORS, DARKNESS_COLOR, DARKNESS_FEATHER_STEPS, DARKNESS_INNER_LIGHT_SCALE,
  DARKNESS_OPACITY, DARKNESS_OUTER_LIGHT_SCALE, LAMP_GLOW_OPACITY, LAMP_RADIUS,
  PLAYER_LIGHT_RADIUS, PLAYER_LIGHT_OFFSET_Y, VIEW_HEIGHT, VIGNETTE_INNER_RADIUS,
  VIGNETTE_OUTER_RADIUS, VIGNETTE_STEP_OPACITY, VIGNETTE_STEPS,
} from "../config.js";

function drawLightMask(k, playerScreen, lamps, uiScale, lightScale) {
  k.drawCircle({
    pos: playerScreen,
    radius: PLAYER_LIGHT_RADIUS * uiScale * lightScale,
  });
  lamps.forEach((lamp) => k.drawCircle({
    pos: lamp,
    radius: LAMP_RADIUS * uiScale * lightScale,
  }));
}

function drawFeatheredDarkness(k, playerScreen, lamps, uiScale) {
  for (let step = 0; step < DARKNESS_FEATHER_STEPS; step += 1) {
    const progress = DARKNESS_FEATHER_STEPS === 1
      ? 1 : step / (DARKNESS_FEATHER_STEPS - 1);
    const lightScale = k.lerp(
      DARKNESS_INNER_LIGHT_SCALE,
      DARKNESS_OUTER_LIGHT_SCALE,
      progress,
    );
    k.drawSubtracted(
      () => k.drawRect({
        width: k.width(), height: k.height(),
        color: k.rgb(...DARKNESS_COLOR),
        opacity: DARKNESS_OPACITY / DARKNESS_FEATHER_STEPS,
      }),
      () => drawLightMask(k, playerScreen, lamps, uiScale, lightScale),
    );
  }
}

function drawFeatheredVignette(k) {
  for (let step = 0; step < VIGNETTE_STEPS; step += 1) {
    const progress = VIGNETTE_STEPS === 1 ? 1 : step / (VIGNETTE_STEPS - 1);
    const radiusX = k.lerp(VIGNETTE_INNER_RADIUS[0], VIGNETTE_OUTER_RADIUS[0], progress);
    const radiusY = k.lerp(VIGNETTE_INNER_RADIUS[1], VIGNETTE_OUTER_RADIUS[1], progress);
    k.drawSubtracted(
      () => k.drawRect({
        width: k.width(), height: k.height(),
        color: k.rgb(...COLORS.night), opacity: VIGNETTE_STEP_OPACITY,
      }),
      () => k.drawEllipse({
        pos: k.center(),
        radiusX: k.width() * radiusX,
        radiusY: k.height() * radiusY,
        anchor: "center",
      }),
    );
  }
}

export function createDarkness(k, player) {
  const overlay = k.add([
    k.pos(0, 0), k.fixed(), k.z(100),
    {
      id: "darkness",
      draw() {
        const uiScale = k.height() / VIEW_HEIGHT;
        const playerScreen = k.toScreen(player.pos.add(0, PLAYER_LIGHT_OFFSET_Y));
        const lamps = k.get("lamp").map((lamp) => k.toScreen(lampCenter(lamp)));
        for (const lamp of lamps) {
          k.drawCircle({
            pos: lamp, radius: LAMP_RADIUS * uiScale,
            color: k.rgb(...COLORS.warm), opacity: LAMP_GLOW_OPACITY,
          });
        }
        drawFeatheredDarkness(k, playerScreen, lamps, uiScale);
        drawFeatheredVignette(k);
      },
    },
  ]);
  return overlay;
}
