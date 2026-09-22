import { COLORS, LAMP_RADIUS, PLAYER_LIGHT_RADIUS, VIEW_HEIGHT } from "../config.js";

export function createDarkness(k, player) {
  const overlay = k.add([
    k.pos(0, 0), k.fixed(), k.z(100),
    {
      id: "darkness",
      draw() {
        const uiScale = k.height() / VIEW_HEIGHT;
        const playerScreen = k.toScreen(player.pos.add(0, -32));
        const lamps = k.get("lamp").map((lamp) => k.toScreen(lamp.pos.add(28, -48)));
        for (const lamp of lamps) {
          k.drawCircle({
            pos: lamp, radius: LAMP_RADIUS * uiScale,
            color: k.rgb(...COLORS.warm), opacity: 0.08,
          });
        }
        k.drawSubtracted(
          () => k.drawRect({ width: k.width(), height: k.height(), color: k.rgb(5, 4, 12), opacity: 0.48 }),
          () => {
            k.drawCircle({ pos: playerScreen, radius: PLAYER_LIGHT_RADIUS * uiScale });
            lamps.forEach((lamp) => k.drawCircle({ pos: lamp, radius: LAMP_RADIUS * uiScale }));
          },
        );
        const edge = 110 * uiScale;
        k.drawRect({ width: k.width(), height: edge, color: k.rgb(...COLORS.night), opacity: 0.38 });
        k.drawRect({ pos: k.vec2(0, k.height() - edge), width: k.width(), height: edge, color: k.rgb(...COLORS.night), opacity: 0.38 });
        k.drawRect({ width: edge, height: k.height(), color: k.rgb(...COLORS.night), opacity: 0.28 });
        k.drawRect({ pos: k.vec2(k.width() - edge, 0), width: edge, height: k.height(), color: k.rgb(...COLORS.night), opacity: 0.28 });
      },
    },
  ]);
  return overlay;
}
