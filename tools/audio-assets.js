import fs from "node:fs/promises";
import path from "node:path";

export async function copyMusicAsset(file, name, output) {
  const target = path.join(output, name);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.copyFile(file, target);
  return { file: name };
}
