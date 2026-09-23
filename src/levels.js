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
  index === 28 || (index >= 54 && index <= 55) ? "." : "#"
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
    row(),
    row([[16, "1"], [73, "1"], [85, "1"]]),
    row([[24, "="], [62, "="]]),
    row([[2, "P"], [5, "L"], [12, "H"], [19, "b"],
      [33, "m"], [39, "3"], [44, "L"], [49, "k"],
      [65, "2"], [70, "H"], [78, "L"], [87, "3"], [92, "*"]]),
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
