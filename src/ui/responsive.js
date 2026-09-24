// Keep screen-space elements aligned to the same 768-unit UI coordinate system.
export function makeResponsive(k, object) {
  const initialHeight = k.height();
  const offsetX = object.pos.x - k.width() / 2;
  const relativeY = object.pos.y / initialHeight;
  if (!object.is("scale")) object.use(k.scale(1));
  const initialScale = object.scale.clone();
  const baseScale = object.baseScale;
  let width = k.width();
  let height = k.height();
  object.onUpdate(() => {
    if (width === k.width() && height === k.height()) return;
    width = k.width();
    height = k.height();
    const ratio = height / initialHeight;
    object.pos = k.vec2(width / 2 + offsetX * ratio, height * relativeY);
    object.scale = initialScale.scale(ratio);
    if (baseScale !== undefined) object.baseScale = baseScale * ratio;
  });
  return object;
}
