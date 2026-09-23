export const TILE = 64;
export const VIEW_HEIGHT = 768;
export const GRAVITY = 3600;
export const WALK_SPEED = 220;
export const RUN_SPEED = 440;
export const JUMP_FORCE = 1040;
export const COYOTE_TIME = 0.1;
export const STAMINA_MAX = 2.5;
export const STAMINA_REGEN_TIME = 3;

export const WANDERER_PATROL_SPEED = 100;
export const WANDERER_CHASE_SPEED = 380;
export const WANDERER_PATROL_RANGE = 384;
export const WANDERER_SIGHT_RANGE = 320;
export const WANDERER_SIGHT_HEIGHT = 128;
export const WANDERER_HEAR_RANGE = 256;
export const WANDERER_ALERT_TIME = 0.4;
export const WANDERER_LOSE_TIME = 2;
export const GHOST_BOB = 6;

export const PEEKER_RANGE = 512;
export const PEEKER_SPEED = 200;
export const PEEKER_RETURN_SPEED = 80;

export const SHADOW_TRIGGER_RANGE = 96;
export const SHADOW_WARN_TIME = 0.5;
export const SHADOW_UP_TIME = 1;
export const SHADOW_COOLDOWN = 2;

export const LAMP_RADIUS = 160;
export const PLAYER_LIGHT_RADIUS = 128;
export const CLOSET_SAFE_DISTANCE = 64;

export const MENU_BACKGROUND_SCALE = 1.012;
export const MENU_BACKGROUND_SWAY_X = 3;
export const MENU_BACKGROUND_SWAY_Y = 2;
export const MENU_BACKGROUND_SWAY_SPEED = 0.12;
export const MENU_MOONLIGHT_OPACITY = 0.018;
export const MENU_MOONLIGHT_PULSE = 0.007;
export const MENU_LAMP_FLICKER_SPEED = 2.2;
export const MENU_MUSIC_VOLUME = 0.4;
export const MENU_LOGO_SCALE = 0.3;
export const MENU_LAMP_GLOWS = [
  { x: 0.058, y: 0.601, radius: 0.035, phase: 0.2 },
  { x: 0.112, y: 0.61, radius: 0.04, phase: 1.6 },
  { x: 0.39, y: 0.657, radius: 0.038, phase: 3.1 },
  { x: 0.826, y: 0.655, radius: 0.042, phase: 4.7 },
  { x: 0.973, y: 0.493, radius: 0.045, phase: 5.8 },
];
export const MENU_GLOW_LAYERS = [
  { scale: 1, opacity: 0.025 },
  { scale: 0.62, opacity: 0.045 },
  { scale: 0.3, opacity: 0.075 },
];

export const COLORS = {
  night: [21, 19, 38],
  shadow: [43, 36, 70],
  moon: [201, 214, 240],
  ghost: [159, 227, 193],
  warm: [255, 217, 138],
  red: [224, 71, 76],
};
