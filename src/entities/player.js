import {
  COYOTE_TIME, JUMP_FORCE, RUN_SPEED, STAMINA_MAX,
  STAMINA_REGEN_TIME, WALK_SPEED,
} from "../config.js";
import { hasAsset } from "../manifest.js";
import { addGroundShadow, setVisualFrame } from "./shared.js";
import { fadeTo } from "../scenes/shared.js";

const WALK_FRAMES = Array.from({ length: 6 }, (_, index) => `player/jalan-${index + 1}`);

export function createPlayer(k, position, worldHeight) {
  const player = k.add([
    k.pos(position),
    k.area({ shape: new k.Rect(k.vec2(-18, -56), 36, 56) }),
    k.body({ jumpForce: JUMP_FORCE }),
    k.z(20),
    "player", "gameplay",
    {
      facing: 1, stamina: STAMINA_MAX, runLocked: false, isRunning: false,
      isHidden: false, dead: false, coyote: 0, animationTime: 0, landingTime: 0,
    },
  ]);
  const visual = player.add([
    hasAsset("player/idle") ? k.sprite("player/idle") : k.rect(36, 64),
    k.anchor("bot"), k.scale(0.25), k.pos(0, 0), k.opacity(1),
    { currentFrame: "player/idle" },
  ]);
  const staminaBack = player.add([
    k.rect(44, 6, { radius: 3 }), k.pos(-22, -76),
    k.color(21, 19, 38), k.opacity(0), k.z(2),
  ]);
  const staminaBar = player.add([
    k.rect(42, 4, { radius: 2 }), k.pos(-21, -75),
    k.color(246, 208, 77), k.opacity(0), k.z(3),
  ]);
  addGroundShadow(k, player, 24);

  player.kill = (reason) => {
    if (player.dead) return;
    player.dead = true;
    fadeTo(k, "gameover", { reason });
  };
  player.inLampLight = () => k.get("lamp").some((lamp) => player.pos.dist(lamp.pos) <= lamp.radius);
  player.enterCloset = (closet) => {
    const nearbyChaser = k.get("wanderer").some((ghost) => ghost.state === "chase" && ghost.pos.dist(player.pos) <= 64);
    if (nearbyChaser) return player.kill("TERTANGKAP");
    player.isHidden = true;
    player.hiddenIn = closet;
    player.vel = k.vec2(0, 0);
    player.pos.x = closet.pos.x + (closet.worldWidth ?? 64) / 2;
    visual.opacity = 0.5;
    setVisualFrame(k, visual, "player/sembunyi");
  };
  player.exitCloset = () => {
    player.isHidden = false;
    player.hiddenIn = null;
    visual.opacity = 1;
  };

  let wasGrounded = false;
  k.onKeyPress(["space", "w"], () => {
    if (!player.exists() || player.isHidden) return;
    if (player.isGrounded() || player.coyote <= COYOTE_TIME) {
      player.jump(JUMP_FORCE);
      player.coyote = COYOTE_TIME + 1;
    }
  });
  player.onCollide("ghost", (ghost) => {
    if (ghost.dangerous && !player.isHidden && !player.inLampLight()) player.kill("TERTANGKAP");
  });
  player.onCollide("goal", () => {
    if (!player.dead) {
      player.dead = true;
      fadeTo(k, "win");
    }
  });

  player.onUpdate(() => {
    if (player.dead) return;
    const closet = k.get("closet").find((item) => Math.abs(item.pos.x + (item.worldWidth ?? 64) / 2 - player.pos.x) < 52 && Math.abs(item.pos.y - player.pos.y) < 80);
    if (k.isKeyDown("s") && closet && !player.isHidden) player.enterCloset(closet);
    if (!k.isKeyDown("s") && player.isHidden) player.exitCloset();
    if (player.isHidden) {
      if (player.hiddenIn) player.pos.x = player.hiddenIn.pos.x + (player.hiddenIn.worldWidth ?? 64) / 2;
      return;
    }

    const direction = (k.isKeyDown("d") || k.isKeyDown("right") ? 1 : 0)
      - (k.isKeyDown("a") || k.isKeyDown("left") ? 1 : 0);
    if (direction) player.facing = direction;
    const wantsRun = direction !== 0 && k.isKeyDown("shift") && !player.runLocked;
    player.isRunning = wantsRun && player.stamina > 0;
    if (player.isRunning) {
      player.stamina = Math.max(0, player.stamina - k.dt());
      if (player.stamina === 0) player.runLocked = true;
    } else {
      player.stamina = Math.min(STAMINA_MAX, player.stamina + STAMINA_MAX / STAMINA_REGEN_TIME * k.dt());
      if (player.stamina >= STAMINA_MAX) player.runLocked = false;
    }
    player.move(direction * (player.isRunning ? RUN_SPEED : WALK_SPEED), 0);

    const grounded = player.isGrounded();
    player.coyote = grounded ? 0 : player.coyote + k.dt();
    if (grounded && !wasGrounded) player.landingTime = 0.12;
    wasGrounded = grounded;
    player.landingTime = Math.max(0, player.landingTime - k.dt());
    player.animationTime += k.dt();
    let frame = "player/idle";
    if (!grounded) frame = "player/lompat";
    else if (direction) {
      const fps = player.isRunning ? 10 : 6;
      frame = WALK_FRAMES[Math.floor(player.animationTime * fps) % WALK_FRAMES.length];
    }
    setVisualFrame(k, visual, frame);
    const stretchY = !grounded ? 1.08 : player.landingTime > 0 ? 0.9 : 1;
    visual.scale = k.vec2(0.25 * player.facing / stretchY, 0.25 * stretchY);
    const showStamina = player.stamina < STAMINA_MAX;
    staminaBack.opacity = showStamina ? 0.8 : 0;
    staminaBar.opacity = showStamina ? 1 : 0;
    staminaBar.width = 42 * player.stamina / STAMINA_MAX;
    if (player.pos.y > worldHeight + 128) player.kill("JATUH KE KEGELAPAN");
  });
  return player;
}
