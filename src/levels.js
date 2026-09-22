import { TILE } from "./config.js";

const WIDTH = 96;

function row(entries = [], fill = ".") {
  const cells = Array.from({ length: WIDTH }, () => fill);
  for (const [start, value] of entries) {
    for (let index = 0; index < value.length; index += 1) cells[start + index] = value[index];
  }
  return cells.join("");
}

const floor = Array.from({ length: WIDTH }, (_, index) => (
  (index >= 26 && index <= 28) || (index >= 52 && index <= 54) ? "." : "#"
)).join("");

export const LEVELS = [{
  name: "Mimpi Buruk",
  map: [
    row(),
    row(),
    row(),
    row(),
    row(),
    row(),
    row([[24, "="], [27, "m"], [50, "="], [53, "m"]]),
    row([[16, "1"], [72, "1"], [84, "1"]]),
    row(),
    row([[2, "PLf"], [12, "H"], [20, "Fb"], [33, "3"], [45, "fk"], [61, "2"], [69, "H"], [76, "L"], [87, "3"], [92, "*"]]),
    floor,
    floor,
  ],
}];

export function validateLevel(level) {
  if (!level.map.length) throw new Error(`Level ${level.name} tidak memiliki peta.`);
  const width = level.map[0].length;
  level.map.forEach((line, index) => {
    if (line.length !== width) {
      throw new Error(`Baris ${index + 1} tidak rata: ${line.length}, seharusnya ${width}.`);
    }
  });
  return { width: width * TILE, height: level.map.length * TILE };
}
