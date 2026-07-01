/**
 * Input.ts — Unified mouse/keyboard/pointer-lock input.
 *
 * Exposes:
 *   - a snapshot of currently-held actions (mapped through user keybinds),
 *   - accumulated look delta (yaw/pitch) that the player consumes each frame,
 *   - firing / aiming intent (mouse buttons),
 *   - a trackpad-friendly fallback: when the pointer isn't locked, click-drag
 *     rotates the view (so laptops without a mouse are fully playable).
 *
 * The class is deliberately framework-free and reads keybinds/sensitivity from
 * the store on demand.
 */

import { store, type Keybinds } from '../store';

type Action = keyof Keybinds;

export class Input {
  private el: HTMLElement;
  private keys = new Set<string>();
  private lookX = 0;
  private lookY = 0;

  locked = false;
  firing = false;
  aiming = false;
  wantReload = false;
  wantInteract = false;
  wheel = 0;

  private dragging = false;
  private dragMoved = false;
  private lastX = 0;
  private lastY = 0;
  enabled = false;

  constructor(el: HTMLElement) {
    this.el = el;
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('pointerlockchange', this.onLockChange);
    document.addEventListener('mousemove', this.onMouseMove);
    el.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointermove', this.onPointerMove);
    el.addEventListener('wheel', this.onWheel, { passive: true });
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  requestLock() { this.el.requestPointerLock?.(); }
  exitLock() { if (document.pointerLockElement) document.exitPointerLock(); }

  /** True if the mapped action's key is currently held. */
  action(a: Action): boolean {
    return this.keys.has(store.get().settings.keybinds[a]);
  }

  /** True if a specific physical key code is held (for fixed binds like lean). */
  isDown(code: string): boolean {
    return this.keys.has(code);
  }

  /** Consume and reset the accumulated look delta (radians). */
  consumeLook(): { dx: number; dy: number } {
    const s = store.get().settings;
    const invert = s.invertY ? -1 : 1;
    const out = { dx: this.lookX, dy: this.lookY * invert };
    this.lookX = 0; this.lookY = 0;
    return out;
  }

  private sens() {
    // Map the 0.05–1.5 UI slider onto a comfortable radians/pixel range.
    return store.get().settings.sensitivity * 0.0035;
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (!this.enabled) return;
    this.keys.add(e.code);
    if (e.code === store.get().settings.keybinds.reload) this.wantReload = true;
    if (e.code === store.get().settings.keybinds.interact) this.wantInteract = true;
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
  };
  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
    if (e.code === store.get().settings.keybinds.interact) this.wantInteract = false;
  };

  private onLockChange = () => { this.locked = document.pointerLockElement === this.el; };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.enabled) return;
    const s = this.sens();
    if (this.locked) {
      // Pointer-locked: relative movement deltas.
      this.lookX -= e.movementX * s;
      this.lookY -= e.movementY * s;
    } else {
      // UNLOCKED one-finger trackpad / mouse: bare cursor movement turns the
      // view (no click, no lock). movementX/Y are populated on move events even
      // without pointer lock, so a single finger swipe steers the camera.
      this.lookX -= e.movementX * s * 0.85;
      this.lookY -= e.movementY * s * 0.85;
    }
  };

  private onPointerDown = (e: PointerEvent) => {
    if (!this.enabled) return;
    if (e.button === 0) this.firing = true;
    if (e.button === 2) this.aiming = true;
    if (!this.locked) {
      this.dragging = true; this.dragMoved = false;
      this.lastX = e.clientX; this.lastY = e.clientY;
    }
  };
  private onPointerUp = (e: PointerEvent) => {
    if (e.button === 0) this.firing = false;
    if (e.button === 2) this.aiming = false;
    this.dragging = false;
  };
  private onPointerMove = (e: PointerEvent) => {
    // Look is driven by onMouseMove (works for bare trackpad movement). Here we
    // only note whether a press became a drag, so a click-drag isn't also
    // treated as a tap. No look accumulation → avoids double-counting movement.
    if (!this.enabled || this.locked || !this.dragging) return;
    const dx = e.clientX - this.lastX, dy = e.clientY - this.lastY;
    this.lastX = e.clientX; this.lastY = e.clientY;
    if (Math.hypot(dx, dy) > 2) this.dragMoved = true;
  };

  /** Discard any accumulated look delta (called on pause/resume to avoid jumps). */
  resetLook() { this.lookX = 0; this.lookY = 0; }

  private onWheel = (e: WheelEvent) => { if (this.enabled) this.wheel += Math.sign(e.deltaY); };

  /** Arrow keys provide a no-mouse look option for trackpad players. */
  applyArrowLook(dt: number) {
    if (!this.enabled) return;
    const speed = 2.2 * dt;
    if (this.keys.has('ArrowLeft')) this.lookX += speed;
    if (this.keys.has('ArrowRight')) this.lookX -= speed;
    if (this.keys.has('ArrowUp')) this.lookY += speed;
    if (this.keys.has('ArrowDown')) this.lookY -= speed;
  }

  dispose() {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('pointerlockchange', this.onLockChange);
    document.removeEventListener('mousemove', this.onMouseMove);
    this.el.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointermove', this.onPointerMove);
    this.el.removeEventListener('wheel', this.onWheel);
  }
}
