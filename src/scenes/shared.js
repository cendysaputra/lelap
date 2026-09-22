export function fadeTo(k, sceneName, data) {
  const overlay = k.add([
    k.rect(k.width(), k.height()),
    k.pos(0, 0),
    k.color(0, 0, 0),
    k.opacity(0),
    k.fixed(),
    k.z(1000),
  ]);
  overlay.onUpdate(() => {
    overlay.opacity = Math.min(1, overlay.opacity + k.dt() * 3.5);
    if (overlay.opacity >= 1) k.go(sceneName, data);
  });
}

export async function requestFullscreen(k) {
  try {
    if (!k.isFullscreen()) await k.setFullscreen(true);
  } catch (error) {
    console.warn("Browser menolak layar penuh; permainan tetap berjalan.", error);
  }
}
