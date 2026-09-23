import sharp from "sharp";

const FAVICON_SIZE = 128;

export async function buildFavicon(source, target) {
  await sharp(source)
    .resize(FAVICON_SIZE, FAVICON_SIZE, {
      fit: "cover",
      kernel: sharp.kernel.nearest,
    })
    .png({ compressionLevel: 9 })
    .toFile(target);
}
