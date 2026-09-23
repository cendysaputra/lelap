import sharp from "sharp";

const FRAME_WIDTH = 960;
const FRAME_STEP = 2;
const SHEET_COLUMNS = 6;
const FRAME_RATE = 10;

export async function buildAnimatedBackground(file, target, outputName, scale) {
  const metadata = await sharp(file, { animated: true }).metadata();
  const totalFrames = metadata.pages ?? 1;
  const sourceHeight = metadata.pageHeight ?? metadata.height;
  const frameHeight = Math.round(sourceHeight * FRAME_WIDTH / metadata.width);
  const pages = Array.from(
    { length: Math.ceil(totalFrames / FRAME_STEP) },
    (_, index) => index * FRAME_STEP,
  ).filter((page) => page < totalFrames);
  const rows = Math.ceil(pages.length / SHEET_COLUMNS);
  const frames = await Promise.all(pages.map((page) => (
    sharp(file, { page }).resize({ width: FRAME_WIDTH }).png().toBuffer()
  )));
  await sharp({
    create: {
      width: FRAME_WIDTH * SHEET_COLUMNS,
      height: frameHeight * rows,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  }).composite(frames.map((input, index) => ({
    input,
    left: index % SHEET_COLUMNS * FRAME_WIDTH,
    top: Math.floor(index / SHEET_COLUMNS) * frameHeight,
  }))).png({ compressionLevel: 9 }).toFile(target);
  return {
    file: outputName,
    width: FRAME_WIDTH / scale,
    height: frameHeight / scale,
    sliceX: SHEET_COLUMNS,
    sliceY: rows,
    anims: {
      drift: { from: 0, to: pages.length - 1, speed: FRAME_RATE, loop: true },
    },
    defaultAnim: "drift",
  };
}
