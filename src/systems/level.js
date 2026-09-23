import { PLATFORM_COLLISION_HEIGHT, TILE } from "../config.js";
import { assetData, decorCount, worldSprite } from "../manifest.js";
import { validateLevel } from "../levels.js";

const KNOWN = new Set(".#=mbkP123HL*fF");
const hash = (x, y) => Math.abs(((x * 73856093) ^ (y * 19349663)) >>> 0);

function spawner(k, callback) {
  return [{
    id: "levelSpawner",
    add() {
      callback(this.pos.clone());
    },
  }];
}

function platform(k, asset, width) {
  const height = assetData(asset)?.height ?? TILE / 2;
  return [
    k.pos(0, TILE - height),
    k.area({ shape: new k.Rect(k.vec2(0, 0), width, PLATFORM_COLLISION_HEIGHT) }),
    k.body({ isStatic: true }),
    k.z(5), "platform",
    {
      id: "platformVisual",
      add() {
        // KAPLAY 3001's effector rejects falling bodies; resolve only landings.
        this.onBeforePhysicsResolve((collision) => {
          if (!collision.isTop() || (collision.target.vel?.y ?? 0) < 0) {
            collision.preventResolution();
          }
        });
        this.add([
          ...worldSprite(k, asset, { width, height }),
          k.anchor("topleft"), k.z(1),
        ]);
      },
    },
  ];
}

function solidObject(k, asset, width = TILE) {
  return [
    ...worldSprite(k, asset, { width, height: TILE }),
    k.pos(0, TILE), k.anchor("botleft"), k.area(),
    k.body({ isStatic: true }), k.z(6), "solid",
  ];
}

export function buildLevel(k, level, entities) {
  const size = validateLevel(level);
  const unknown = new Set();
  level.map.forEach((line) => [...line].forEach((symbol) => {
    if (!KNOWN.has(symbol)) unknown.add(symbol);
  }));
  unknown.forEach((symbol) => console.warn(`Simbol level tidak dikenal: "${symbol}"`));

  const floorTile = (position) => {
    const x = position.x;
    const y = position.y;
    const top = y === 0 || level.map[y - 1]?.[x] !== "#";
    return [
      ...worldSprite(k, top ? "tiles/lantai" : "tiles/fondasi", { width: TILE, height: TILE }),
      k.area(), k.body({ isStatic: true }), "solid",
      {
        id: "floorBacking",
        add() {
          this.add([k.rect(TILE, TILE), k.color(12, 10, 22), k.z(-1)]);
        },
      },
    ];
  };
  const decor = (sizeName) => (position) => {
    const count = decorCount(sizeName);
    const index = count ? hash(position.x, position.y) % count + 1 : 1;
    const name = `dekor/${sizeName}-${index}`;
    return [
      ...worldSprite(k, name, { width: TILE, height: sizeName === "kecil" ? 48 : 128 }),
      k.pos(0, TILE), k.anchor("botleft"), k.z(-2), "decor",
    ];
  };

  k.addLevel(level.map, {
    tileWidth: TILE,
    tileHeight: TILE,
    tiles: {
      ".": () => null, "#": floorTile,
      "=": () => platform(k, "pijakan/rak", TILE * 2),
      "m": () => platform(k, "pijakan/meja", TILE * 2),
      "b": () => solidObject(k, "pijakan/buku"),
      "k": () => solidObject(k, "pijakan/kotak"),
      "f": decor("kecil"), "F": decor("besar"),
      "P": () => spawner(k, (pos) => entities.player(pos.add(0, TILE))),
      "1": () => spawner(k, (pos) => entities.wanderer(pos.add(0, TILE))),
      "2": () => spawner(k, (pos) => entities.peeker(pos.add(0, TILE))),
      "3": () => spawner(k, (pos) => entities.shadow(pos.add(0, TILE))),
      "H": () => spawner(k, (pos) => entities.closet(pos.add(0, TILE))),
      "L": () => spawner(k, (pos) => entities.lamp(pos.add(0, TILE))),
      "*": () => spawner(k, (pos) => entities.goal(pos.add(0, TILE))),
    },
    wildcardTile: (symbol) => { unknown.add(symbol); return null; },
  });
  console.info(`Level "${level.name}": ${level.map[0].length}x${level.map.length} tile, spawn P, simbol tidak dikenal: ${[...unknown].join(", ") || "tidak ada"}.`);
  return size;
}
