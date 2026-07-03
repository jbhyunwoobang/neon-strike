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
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
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
  private gtaoPass?: GTAOPass;
  private updates: UpdateFn[] = [];
  private raf = 0;
  private running = false;
  private preset: QualityPreset;
  private elapsed = 0;

  // Rolling FPS estimate exposed to the HUD.
  fps = 0;
  private fpsAccum = 0;
  private fpsFrames = 0;
  private lowStreak = 0;   // seconds spent under the governor's FPS floor

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
    this.renderer.toneMappingExposure = 1.25;

    this.scene = new THREE.Scene();
    // Overcast dusk sky + distance haze that the far megastructures fade into.
    this.scene.background = new THREE.Color(0x6b7482);
    this.scene.fog = new THREE.FogExp2(0x707a86, this.preset.fogDensity * 0.7);

    this.camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.05, 800);
    // The camera must live in the scene graph so camera-parented objects (the
    // weapon view-model + its light) are included in the render traversal.
    this.scene.add(this.camera);

    // Image-based lighting: prefilter an environment so every PBR surface
    // (gunmetal, glass, water, crates) picks up realistic reflections + fill —
    // the single biggest step toward an "engine-rendered" look in WebGL.
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    pmrem.compileEquirectangularShader();
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // Postprocessing chain: render → GTAO → bloom → output.
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    // Ground-Truth Ambient Occlusion — the working AO route (the older SSAOPass
    // rendered black in this composer). GTAO runs a depth+normal prepass and
    // multiplies soft contact-shadow occlusion into the beauty pass, so pillar
    // bases, crevices and stacked geometry gain grounded depth. It costs a full
    // depth+normal prepass, so it only runs on the high/ultra tiers.
    if (this.preset.pixelRatio >= 1.5) {
      const gtao = new GTAOPass(this.scene, this.camera, window.innerWidth, window.innerHeight);
      gtao.output = GTAOPass.OUTPUT.Default;
      gtao.updateGtaoMaterial({
        radius: 0.55, distanceExponent: 1.2, thickness: 1.0,
        scale: 1.1, samples: this.preset.pixelRatio >= 1.5 ? 16 : 9,
        distanceFallOff: 1.0, screenSpaceRadius: false,
      });
      gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 4, radiusExponent: 1, rings: 2, samples: 8 });
      this.gtaoPass = gtao;
      this.composer.addPass(gtao);
    }

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
  /** Scale factor (0.3–1) the arena applies to particle/prop counts. */
  get particleScale() { return this.preset.pixelRatio >= 2 ? 1 : this.preset.pixelRatio >= 1.5 ? 0.8 : this.preset.shadows ? 0.55 : 0.3; }
  /** Planar-reflection texture size — sharper mirrors on high tiers. */
  get reflectorRes() { return this.preset.pixelRatio >= 2 ? 1024 : this.preset.pixelRatio >= 1.5 ? 768 : 384; }

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

      // Perf governor: if the frame rate stays under ~38 FPS, shed the most
      // expensive features one notch at a time (GTAO → bloom → pixel ratio)
      // instead of letting the whole game chug. Never re-escalates mid-match.
      if (this.fps > 5 && this.fps < 38) this.lowStreak += 0.5; else this.lowStreak = 0;
      if (this.lowStreak >= 3) {
        this.lowStreak = 0;
        if (this.gtaoPass?.enabled) {
          this.gtaoPass.enabled = false;
          console.info('[perf] sustained low FPS — disabled ambient occlusion');
        } else if (this.bloomPass.enabled) {
          this.bloomPass.enabled = false;
          console.info('[perf] sustained low FPS — disabled bloom');
        } else if (this.renderer.getPixelRatio() > 1) {
          this.renderer.setPixelRatio(1);
          this.composer.setSize(window.innerWidth, window.innerHeight);
          console.info('[perf] sustained low FPS — reduced render resolution');
        }
      }
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
