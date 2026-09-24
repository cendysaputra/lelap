export function fadeTo(k, sceneName, data) {
  if (k.get("sceneTransition").length) return;
  const overlay = k.add([
    k.rect(k.width(), k.height()),
    k.pos(0, 0),
    k.color(0, 0, 0),
    k.opacity(0),
    k.fixed(),
    k.z(1000),
    "sceneTransition",
  ]);
  overlay.onUpdate(() => {
    overlay.width = k.width();
    overlay.height = k.height();
    overlay.opacity = Math.min(1, overlay.opacity + k.dt() * 3.5);
    if (overlay.opacity >= 1) k.go(sceneName, data);
  });
}

export async function requestFullscreen(k) {
  try {
    if (!document.fullscreenElement) await k.canvas.requestFullscreen();
  } catch (error) {
    console.warn("Browser menolak layar penuh; permainan tetap berjalan.", error);
  }
}

export async function toggleFullscreen(k) {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await requestFullscreen(k);
  } catch (error) {
    console.warn("Layar penuh tidak tersedia.", error);
  }
}
