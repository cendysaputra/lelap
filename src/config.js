export const TILE = 64;
export const VIEW_HEIGHT = 768;
export const GRAVITY = 3600;
export const WALK_SPEED = 220;
export const RUN_SPEED = 340;
export const JUMP_FORCE = 1040;
export const COYOTE_TIME = 0.1;
export const STAMINA_MAX = 2.5;
export const STAMINA_REGEN_TIME = 3;
export const BEARS_REQUIRED = 1;
export const WANDERER_ANIMATION_FPS = 4;
export const PORTAL_ANIMATION_FPS = 10;
export const PORTAL_FRAME_COUNT = 3;
export const PORTAL_WIDTH = 92;
export const PORTAL_HEIGHT = 128;
export const HUD_MARGIN = 18;
export const HUD_EMBLEM_SIZE = 48;
export const HUD_BAR_WIDTH = 88;
export const HUD_BAR_HEIGHT = 6;
export const HUD_NAME_SIZE = 17;
export const HUD_CONTENT_GAP = 6;
export const HUD_PROFILE_PADDING = 8;
export const HUD_BEAR_SIZE = 30;
export const HUD_BEAR_GAP = 7;
export const HUD_PANEL_HEIGHT = 64;
export const HUD_BEAR_PANEL_PADDING = 9;
export const HUD_TIMER_WIDTH = 90;
export const HUD_TIMER_HEIGHT = 40;
export const HUD_TIMER_SIZE = 20;
export const HUD_PROFILE_GAP = 10;
export const HUD_PANEL_RADIUS = 10;
export const HUD_PANEL_OPACITY = 0.78;
export const HUD_BAR_BORDER = 2;
export const HUD_Z = 150;
export const HUD_TEXT_Z = 151;
export const HUD_STAMINA_COLOR = [246, 208, 77];

export const WANDERER_PATROL_SPEED = 80;
export const WANDERER_CHASE_SPEED = 300;
export const WANDERER_PATROL_RANGE = 6 * TILE;
export const WANDERER_SIGHT_RANGE = 5 * TILE;
export const WANDERER_SIGHT_HEIGHT = 128;
export const WANDERER_HEAR_RANGE = 256;
export const WANDERER_ALERT_TIME = 0.4;
export const WANDERER_LOSE_TIME = 2;
export const WANDERER_LAMP_WAIT_TIME = 2;
export const GHOST_BOB = 6;

export const PEEKER_RANGE = 8 * TILE;
export const PEEKER_SPEED = 140;
export const PEEKER_RETURN_SPEED = 80;
export const PEEKER_RETURN_DELAY = 0.4;

export const SHADOW_TRIGGER_RANGE = 96;
export const SHADOW_WARN_TIME = 0.5;
export const SHADOW_UP_TIME = 1;
export const SHADOW_COOLDOWN = 2;

export const LAMP_RADIUS = 160;
export const PLAYER_LIGHT_RADIUS = 128;
export const CLOSET_SAFE_DISTANCE = 64;
export const GHOST_LAMP_BOUNDARY_MARGIN = 72;
export const LAMP_LIGHT_OFFSET_X = 28;
export const LAMP_LIGHT_OFFSET_Y = -48;
export const PLAYER_LIGHT_OFFSET_Y = -32;
export const PLAYER_WALK_FPS = 6;
export const PLAYER_RUN_FPS = 10;
export const PLAYER_LANDING_TIME = 0.12;
export const PLAYER_AIR_STRETCH = 1.08;
export const PLAYER_LANDING_SQUASH = 0.9;
export const CLOSET_REACH_X = 52;
export const CLOSET_REACH_Y = 80;
export const FALL_MARGIN = 128;
export const CAMERA_FOLLOW_SPEED = 5;
export const PLATFORM_COLLISION_HEIGHT = 24;
export const PIT_EDGE_EXTENSION_PER_TILE = 8;
export const DARKNESS_COLOR = [5, 4, 12];
export const DARKNESS_OPACITY = 0.46;
export const DARKNESS_FEATHER_STEPS = 6;
export const DARKNESS_INNER_LIGHT_SCALE = 0.72;
export const DARKNESS_OUTER_LIGHT_SCALE = 1.22;
export const LAMP_GLOW_OPACITY = 0.08;
export const VIGNETTE_STEPS = 8;
export const VIGNETTE_STEP_OPACITY = 0.035;
export const VIGNETTE_INNER_RADIUS = [0.34, 0.3];
export const VIGNETTE_OUTER_RADIUS = [0.54, 0.52];

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

export const GAME_OVER_PANEL_SCALE = 1.65;
export const GAME_OVER_PANEL_MARGIN = 32;
export const GAME_OVER_ART_MAX_WIDTH = 320;
export const GAME_OVER_ART_MAX_HEIGHT = 240;
export const GAME_OVER_ART_Y = 0.36;
export const GAME_OVER_TITLE_Y = 0.57;
export const GAME_OVER_BUTTON_Y = 0.71;
export const GAME_OVER_BUTTON_OFFSET = 145;

export const COLORS = {
  night: [21, 19, 38],
  shadow: [43, 36, 70],
  moon: [201, 214, 240],
  ghost: [159, 227, 193],
  warm: [255, 217, 138],
  red: [224, 71, 76],
};
