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
  (index >= 26 && index <= 31)
  || (index >= 53 && index <= 56)
  || (index >= 78 && index <= 80) ? "." : "#"
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
    row([[16, "1"], [40, "1"], [64, "1"], [86, "1"]]),
    row([[20, "v"], [47, "v"], [72, "v"]]),
    row([[2, "P"], [5, "L"], [12, "H"], [15, "b"],
      [18, "s"], [22, "t"], [24, "t"], [26, "t"], [28, "t"], [30, "t"], [32, "t"],
      [36, "m"], [39, "3"], [42, "L"], [45, "s"], [49, "t"], [51, "t"],
      [53, "t"], [55, "t"], [57, "t"], [63, "2"], [67, "H"], [70, "s"],
      [74, "t"], [76, "t"], [78, "t"], [80, "t"], [82, "t"],
      [86, "L"], [88, "3"], [92, "*"]]),
    floor,
    floor,
  ],
}];

export function validateLevel(level) {
  if (!Array.isArray(level.map) || !level.map.length || !level.map[0]?.length) throw new Error(`Level ${level.name} tidak memiliki peta.`);
  const width = level.map[0].length;
  level.map.forEach((line, index) => {
    if (typeof line !== "string") throw new Error(`Baris ${index + 1} harus berupa string.`);
    if (line.length !== width) {
      throw new Error(`Baris ${index + 1} tidak rata: ${line.length}, seharusnya ${width}.`);
    }
    [...line].forEach((symbol, column) => {
      if ((symbol === "b" || symbol === "k") && !["#", "b", "k", "t"].includes(level.map[index + 1]?.[column])) {
        throw new Error(`Objek ${symbol} di baris ${index + 1}, kolom ${column + 1} harus berdiri di atas solid.`);
      }
    });
  });
  return { width: width * TILE, height: level.map.length * TILE };
}
