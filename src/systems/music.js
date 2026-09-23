import { MENU_MUSIC_VOLUME } from "../config.js";
import { hasMusic } from "../manifest.js";

const MENU_TRACK = "music/deep-pulse";
let menuMusic = null;
let audioUnlocked = false;
let musicMuted = false;

export function prepareMenuMusic(k) {
  if (!hasMusic(MENU_TRACK)) return;
  if (!menuMusic) {
    menuMusic = k.play(MENU_TRACK, {
      loop: true,
      paused: true,
      volume: MENU_MUSIC_VOLUME,
    });
  }
  menuMusic.paused = !audioUnlocked || musicMuted;
}

export function resumeMenuMusic(k) {
  audioUnlocked = true;
  prepareMenuMusic(k);
  if (menuMusic) menuMusic.paused = musicMuted;
}

export function isMenuMusicMuted() {
  return musicMuted;
}

export function toggleMenuMusic(k) {
  musicMuted = !musicMuted;
  if (musicMuted) pauseMenuMusic();
  else resumeMenuMusic(k);
  return musicMuted;
}

export function pauseMenuMusic() {
  if (menuMusic) menuMusic.paused = true;
}
