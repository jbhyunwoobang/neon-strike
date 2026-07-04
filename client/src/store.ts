/**
 * store.ts — Global UI/application state (Zustand).
 *
 * Two concerns live here:
 *   1. Screen/navigation state that React renders.
 *   2. A HUD "mailbox" the imperative game engine writes into each frame; React
 *      subscribes and re-renders only the changed HUD widgets.
 *
 * Settings are persisted to localStorage so sensitivity/keybinds/quality stick
 * between sessions. The engine never imports React — it reads/writes this store
 * directly, which keeps the render loop and the DOM cleanly decoupled.
 */

import { create } from 'zustand';

export type Screen =
  | 'intro'
  | 'menu' | 'settings' | 'credits'
  | 'loadout'
  | 'playing' | 'gameover';

export type GrenadeType = 'frag' | 'smoke' | 'flash' | 'emp';

export interface Loadout {
  weapon: number;        // index into the weapon roster
  grenade: GrenadeType;
  map: string;           // MapTheme id or 'random'
}

export type Quality = 'low' | 'medium' | 'high' | 'ultra';

export interface Keybinds {
  forward: string; back: string; left: string; right: string;
  jump: string; crouch: string; sprint: string; reload: string;
  slide: string; interact: string;
}

export interface Settings {
  sensitivity: number;     // 0.05 – 1.5
  fov: number;             // 70 – 110
  invertY: boolean;
  masterVolume: number;    // 0 – 1
  quality: Quality;
  showFps: boolean;
  keybinds: Keybinds;
}

export interface Hud {
  health: number;
  armor: number;
  ammo: number;
  reserve: number;
  weapon: string;
  fireMode: string;
  wave: number;
  score: number;
  kills: number;
  enemiesLeft: number;
  alive: boolean;
  reloading: boolean;
  fps: number;
  hitmarker: number;       // timestamp of last hit (drives the marker animation)
  headshot: boolean;
  damageFlash: number;     // timestamp of last damage taken
  flash: number;           // timestamp of last flashbang (white)
  interactHint: string;    // e.g. "HOLD F — UPGRADE"
  toast: string;
  scope: boolean;          // scoped weapon at full ADS → HUD draws the scope overlay
  scopeZoom: number;       // magnification of the active optic (2/4/6×)
  grenade: string;         // equipped grenade type (frag/smoke/flash/emp)
  grenades: number;        // grenades remaining
  mapName: string;         // final map for this match (drives the pre-match roulette)
}

const DEFAULT_KEYBINDS: Keybinds = {
  forward: 'KeyW', back: 'KeyS', left: 'KeyA', right: 'KeyD',
  jump: 'Space', crouch: 'ControlLeft', sprint: 'ShiftLeft',
  reload: 'KeyR', slide: 'KeyC', interact: 'KeyF',
};

const DEFAULT_SETTINGS: Settings = {
  sensitivity: 0.4, fov: 90, invertY: false, masterVolume: 0.7,
  quality: 'high', showFps: true, keybinds: DEFAULT_KEYBINDS,
};

const SETTINGS_KEY = 'neon-strike:settings:v1';

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS, ...parsed,
      keybinds: { ...DEFAULT_KEYBINDS, ...(parsed.keybinds ?? {}) },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

const emptyHud: Hud = {
  health: 100, armor: 0, ammo: 30, reserve: 120, weapon: 'RIFLE', fireMode: 'AUTO',
  wave: 1, score: 0, kills: 0, enemiesLeft: 0, alive: true, reloading: false,
  fps: 0, hitmarker: 0, headshot: false, damageFlash: 0, flash: 0, interactHint: '', toast: '', scope: false,
  grenade: 'frag', grenades: 3, mapName: '', scopeZoom: 2,
};

interface State {
  screen: Screen;
  username: string;
  bestScore: number;
  loadout: Loadout;
  setLoadout: (patch: Partial<Loadout>) => void;

  settings: Settings;
  hud: Hud;

  // navigation
  setScreen: (s: Screen) => void;
  setUsername: (n: string) => void;

  // settings
  updateSettings: (patch: Partial<Settings>) => void;
  setKeybind: (action: keyof Keybinds, code: string) => void;
  resetSettings: () => void;

  // hud (engine -> UI)
  setHud: (patch: Partial<Hud>) => void;
  resetHud: () => void;
  recordScore: (score: number) => void;
}

const BEST_KEY = 'neon-strike:best:v1';
const NAME_KEY = 'neon-strike:name:v1';

export const useStore = create<State>((set, get) => ({
  screen: 'intro',
  username: localStorage.getItem(NAME_KEY) ?? `Op-${Math.floor(Math.random() * 900 + 100)}`,
  bestScore: Number(localStorage.getItem(BEST_KEY) ?? 0),

  settings: loadSettings(),
  hud: { ...emptyHud },
  loadout: { weapon: 2, grenade: 'frag', map: 'random' }, // default: AR + frag + random map
  setLoadout: (patch) => set((s) => ({ loadout: { ...s.loadout, ...patch } })),

  setScreen: (screen) => set({ screen }),
  setUsername: (username) => { localStorage.setItem(NAME_KEY, username); set({ username }); },

  updateSettings: (patch) => {
    const settings = { ...get().settings, ...patch };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    set({ settings });
  },
  setKeybind: (action, code) => {
    const keybinds = { ...get().settings.keybinds, [action]: code };
    const settings = { ...get().settings, keybinds };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    set({ settings });
  },
  resetSettings: () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    set({ settings: { ...DEFAULT_SETTINGS, keybinds: { ...DEFAULT_KEYBINDS } } });
  },

  setHud: (patch) => set((s) => ({ hud: { ...s.hud, ...patch } })),
  resetHud: () => set({ hud: { ...emptyHud } }),
  recordScore: (score) => {
    if (score > get().bestScore) {
      localStorage.setItem(BEST_KEY, String(score));
      set({ bestScore: score });
    }
  },

}));

/** Non-reactive accessors for the engine (avoids React hook rules). */
export const store = {
  get: useStore.getState,
  set: useStore.setState,
  sub: useStore.subscribe,
};
