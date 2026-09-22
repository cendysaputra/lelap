import { COLORS } from "../config.js";
import { addGameText } from "../ui/text.js";

export function registerLoadingScene(k) {
  k.scene("loading", () => {
    k.setBackground(...COLORS.night);
    const title = addGameText(k, "MEMASUKI MIMPI...", k.center(), { size: 34 });
    const barWidth = Math.min(420, k.width() * 0.55);
    const bar = k.add([
      k.rect(1, 14, { radius: 7 }),
      k.pos(k.width() / 2 - barWidth / 2, k.height() / 2 + 54),
      k.color(...COLORS.ghost), k.fixed(),
    ]);
    k.add([
      k.rect(barWidth, 14, { radius: 7 }),
      k.pos(k.width() / 2 - barWidth / 2, k.height() / 2 + 54),
      k.outline(2, k.rgb(...COLORS.moon)), k.opacity(0.2), k.fixed(),
    ]);
    let completed = false;
    k.onUpdate(() => {
      const progress = k.loadProgress();
      bar.width = Math.max(1, barWidth * progress);
      if (!completed && progress >= 1) {
        completed = true;
        title.destroy();
        k.wait(0.15, () => k.go("menu"));
      }
    });
  });
}
