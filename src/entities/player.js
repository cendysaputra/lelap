import {
  CLOSET_SAFE_DISTANCE, COYOTE_TIME, JUMP_FORCE, RUN_SPEED, STAMINA_MAX,
  STAMINA_REGEN_TIME, WALK_SPEED, PLAYER_LIGHT_OFFSET_Y, PLAYER_WALK_FPS, PLAYER_RUN_FPS,
  PLAYER_LANDING_TIME, PLAYER_AIR_STRETCH, PLAYER_LANDING_SQUASH, CLOSET_REACH_X, CLOSET_REACH_Y, FALL_MARGIN,
} from "../config.js";
import { hasAsset } from "../manifest.js";
import { addGroundShadow, lampCenter, setVisualFrame } from "./shared.js";
import { fadeTo } from "../scenes/shared.js";

const WALK_FRAMES = Array.from({ length: 8 }, (_, index) => `player/jalan-${index + 1}`);

export function createPlayer(k, position, worldHeight) {
  const player = k.add([
    k.pos(position),
    k.area({ shape: new k.Rect(k.vec2(-18, -56), 36, 56) }),
    k.body({ jumpForce: JUMP_FORCE }),
    k.z(20),
    "player", "gameplay",
    {
      facing: 1, stamina: STAMINA_MAX, runLocked: false, isRunning: false,
      isHidden: false, dead: false, coyote: COYOTE_TIME + 1, jumpConsumed: false, animationTime: 0, landingTime: 0, bears: 0,
    },
  ]);
  const visual = player.add([
    hasAsset("player/idle") ? k.sprite("player/idle") : k.rect(144, 256),
    k.anchor("bot"), k.scale(0.25), k.pos(0, 0), k.opacity(1),
    { currentFrame: "player/idle" },
  ]);
  addGroundShadow(k, player, 24);

  player.kill = (reason) => {
    if (player.dead) return;
    player.dead = true;
    fadeTo(k, "gameover", { reason });
  };
  player.inLampLight = () => k.get("lamp").some((lamp) => player.pos.add(0, PLAYER_LIGHT_OFFSET_Y).dist(lampCenter(lamp)) <= lamp.radius);
  player.enterCloset = (closet) => {
    const nearbyChaser = k.get("wanderer").some((ghost) => ghost.state === "chase" && ghost.pos.dist(player.pos) <= CLOSET_SAFE_DISTANCE);
    if (nearbyChaser) return player.kill("TERTANGKAP");
    player.isHidden = true;
    player.hiddenIn = closet;
    player.vel = k.vec2(0, 0);
    player.pos.x = closet.pos.x + (closet.worldWidth ?? 64) / 2;
    player.gravityScale = 0;
    player.isRunning = false;
    visual.opacity = 0;
    setVisualFrame(k, visual, "player/sembunyi");
  };
  player.exitCloset = () => {
    player.isHidden = false;
    player.hiddenIn = null;
    player.gravityScale = 1;
    visual.opacity = 1;
  };

  let wasGrounded = false;
  k.onKeyPress(["space", "w"], () => {
    if (!player.exists() || player.isHidden || player.dead || player.paused) return;
    if (!player.jumpConsumed && (player.isGrounded() || player.coyote <= COYOTE_TIME)) {
      player.jump(JUMP_FORCE);
      player.jumpConsumed = true;
      player.coyote = COYOTE_TIME + 1;
    }
  });
  player.onCollideUpdate("ghost", (ghost) => {
    if (!player.paused && !player.dead && ghost.dangerous && !player.isHidden && !player.inLampLight()) {
      player.kill("TERTANGKAP");
    }
  });
  player.onCollideUpdate("goal", (bear) => {
    if (player.dead || player.paused || player.isHidden || !bear.exists()) return;
    k.destroy(bear);
    player.bears += 1;
    player.dead = true;
    fadeTo(k, "win");
  });

  player.onUpdate(() => {
    if (player.dead) return;
    const closet = k.get("closet").find((item) => Math.abs(item.pos.x + (item.worldWidth ?? 64) / 2 - player.pos.x) < CLOSET_REACH_X && Math.abs(item.pos.y - player.pos.y) < CLOSET_REACH_Y);
    if (k.isKeyDown("s") && closet && !player.isHidden) player.enterCloset(closet);
    if (!k.isKeyDown("s") && player.isHidden) player.exitCloset();
    if (player.dead) return;
    if (player.isHidden) {
      player.vel = k.vec2(0, 0);
      player.stamina = Math.min(STAMINA_MAX, player.stamina + STAMINA_MAX / STAMINA_REGEN_TIME * k.dt());
      if (player.stamina === STAMINA_MAX) player.runLocked = false;
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
    if (grounded && !wasGrounded) {
      player.landingTime = PLAYER_LANDING_TIME;
      player.jumpConsumed = false;
    }
    wasGrounded = grounded;
    player.landingTime = Math.max(0, player.landingTime - k.dt());
    player.animationTime += k.dt();
    let frame = "player/idle";
    if (!grounded) frame = "player/lompat";
    else if (direction) {
      const fps = player.isRunning ? PLAYER_RUN_FPS : PLAYER_WALK_FPS;
      const frames = WALK_FRAMES.filter(hasAsset);
      frame = frames[Math.floor(player.animationTime * fps) % frames.length] ?? "player/idle";
    }
    setVisualFrame(k, visual, frame);
    const stretchY = !grounded ? PLAYER_AIR_STRETCH : player.landingTime > 0 ? PLAYER_LANDING_SQUASH : 1;
    visual.scale = k.vec2(0.25 * player.facing / stretchY, 0.25 * stretchY);
    if (player.pos.y > worldHeight + FALL_MARGIN) player.kill("JATUH KE KEGELAPAN");
  });
  return player;
}
