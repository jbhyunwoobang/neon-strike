/**
 * Engine.ts — Rendering core.
 *
 * Owns the WebGLRenderer, scene, camera and the postprocessing pipeline
 * (render → bloom → filmic tone-mapping/output). It also owns the animation
 * loop and a list of per-frame update callbacks that gameplay systems register.
 *
 * Quality presets scale device pixel ratio, shadow resolution and whether the
 * bloom pass runs, so the same code path serves a phone and a desktop GPU.
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import type { Quality } from '../store';

export type UpdateFn = (dt: number, elapsed: number) => void;

interface QualityPreset {
  pixelRatio: number;
  shadowMap: number;
  bloom: boolean;
  shadows: boolean;
  fogDensity: number;
}

const PRESETS: Record<Quality, QualityPreset> = {
  low:    { pixelRatio: 1.0, shadowMap: 0,    bloom: false, shadows: false, fogDensity: 0.0075 },
  medium: { pixelRatio: 1.0, shadowMap: 1024, bloom: true,  shadows: true,  fogDensity: 0.0062 },
  high:   { pixelRatio: 1.5, shadowMap: 2048, bloom: true,  shadows: true,  fogDensity: 0.0052 },
  ultra:  { pixelRatio: 2.0, shadowMap: 4096, bloom: true,  shadows: true,  fogDensity: 0.0044 },
};

export class Engine {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly composer: EffectComposer;
  readonly clock = new THREE.Clock();

  private bloomPass: UnrealBloomPass;
  private updates: UpdateFn[] = [];
  private raf = 0;
  private running = false;
  private preset: QualityPreset;
  private elapsed = 0;

  // Rolling FPS estimate exposed to the HUD.
  fps = 0;
  private fpsAccum = 0;
  private fpsFrames = 0;

  constructor(canvas: HTMLCanvasElement, quality: Quality, fov: number) {
    this.preset = PRESETS[quality];

    this.renderer = new THREE.WebGLRenderer({
      canvas, antialias: quality !== 'low', powerPreference: 'high-performance',
      stencil: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.preset.pixelRatio));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = this.preset.shadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Filmic tone mapping + natural exposure for a photographic look.
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;

    this.scene = new THREE.Scene();
    // Concrete void with a warm, dusty haze (per art direction) — lifted a
    // touch so architectural detail reads without losing the mood.
    this.scene.background = new THREE.Color(0x0b0a0c);
    this.scene.fog = new THREE.FogExp2(0x161217, this.preset.fogDensity);

    this.camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.05, 800);

    // Postprocessing chain.
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.62,  // strength
      0.8,   // radius — soft, hazy ember bloom
      0.55,  // threshold — lower so ember glow-strips bloom against the dark
    );
    this.bloomPass.enabled = this.preset.bloom;
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(new OutputPass());

    window.addEventListener('resize', this.onResize);
  }

  /** Directional shadow resolution for lights created by the arena. */
  get shadowMapSize() { return this.preset.shadowMap; }
  get shadowsEnabled() { return this.preset.shadows; }

  onUpdate(fn: UpdateFn) { this.updates.push(fn); }
  offUpdate(fn: UpdateFn) { this.updates = this.updates.filter((u) => u !== fn); }

  setFov(fov: number) {
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.clock.start();
    this.loop();
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private loop = () => {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min(this.clock.getDelta(), 0.05); // clamp huge tab-switch gaps
    this.elapsed += dt;

    // FPS estimate over ~0.5s windows.
    this.fpsAccum += dt; this.fpsFrames++;
    if (this.fpsAccum >= 0.5) {
      this.fps = Math.round(this.fpsFrames / this.fpsAccum);
      this.fpsAccum = 0; this.fpsFrames = 0;
    }

    for (const u of this.updates) u(dt, this.elapsed);
    this.composer.render();
  };

  private onResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
  };

  dispose() {
    this.stop();
    window.removeEventListener('resize', this.onResize);
    this.updates = [];
    this.composer.dispose();
    this.renderer.dispose();
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    });
  }
}
