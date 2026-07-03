/**
 * Arena.ts — Procedural futuristic-brutalist environment.
 *
 * Builds one deterministic map (seed-driven) out of raw-concrete volumes, steel
 * pillars, glass curtain walls, sky bridges and neon emergency strips. Repeated
 * elements (windows, pillars, rain) use InstancedMesh / Points for throughput.
 *
 * It also drives dynamic weather + a day→night lighting cycle: an exponential
 * fog, a moving key light, rain particles and occasional lightning that briefly
 * lifts ambient exposure.
 *
 * Gameplay reads `colliders` (axis-aligned boxes tagged by material) for player
 * movement and bullet impacts, and `spawnPoints` for PvP respawns.
 */

import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import type { Engine } from './Engine';

export type SurfaceMat = 'concrete' | 'metal' | 'glass';

export interface Collider {
  box: THREE.Box3;
  material: SurfaceMat;
}

/** Small seeded PRNG so the same seed yields the same city on every client. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const ARENA_HALF = 112;

/* --------------------------------- themes --------------------------------- *
 * Five map identities, each keyed to one of the user's reference boards. The
 * theme is derived from the match seed, so every client in a room builds the
 * same map and solo players get a random one each match.
 * --------------------------------------------------------------------------- */

export type MapTheme = 'sanctum' | 'lighthouse' | 'atrium' | 'skyfall' | 'bastion';
export const MAP_THEMES: MapTheme[] = ['sanctum', 'lighthouse', 'atrium', 'skyfall', 'bastion'];
export const MAP_NAMES: Record<MapTheme, string> = {
  sanctum: 'THE SANCTUM',       // warm salmon brutalist interior, red carpet, stepped coffers
  lighthouse: 'OLDEST LIGHT',   // near-black hall, monumental light-well shaft, red lobby
  atrium: 'REDWOOD ATRIUM',     // misty concrete courtyard, giant redwoods, wet floor
  skyfall: 'SKYFALL',           // open wilds under colossal floating monoliths, golden light
  bastion: 'GREEN BASTION',     // mossy hills + an ancient colossal wall, overcast
};

interface ThemeCfg {
  skyTop: number; skyHorizon: number; fogColor: number; fogMul: number;
  concrete: number; floorColor: number; floorRough: number; floorMetal: number;
  ambSky: number; ambGround: number; ambI: number;
  keyColor: number; keyI: number; fillColor: number; fillI: number;
  accent: number;
  enclosed: boolean;                                  // solid walls + ceiling instead of open colonnade
  ceiling: 'coffers-warm' | 'coffers-dark' | 'dome' | null;
  pillars: boolean; city: boolean; exterior: 'green' | 'rocky' | null;
  rain: boolean; lightning: boolean; dayCycle: boolean;
  water: boolean; waterfall: boolean; oculus: boolean; glowStrips: boolean; signage: boolean;
  carpet: 'run' | 'zone' | null;
  redwoods: boolean; monoliths: boolean; greatwall: boolean; lightwell: boolean;
}

const THEMES: Record<MapTheme, ThemeCfg> = {
  sanctum: {
    skyTop: 0x241812, skyHorizon: 0x54342a, fogColor: 0x3d2a20, fogMul: 0.85,
    concrete: 0xc79f88, floorColor: 0xb08a72, floorRough: 0.8, floorMetal: 0.05,
    ambSky: 0xe8c3a4, ambGround: 0x63392a, ambI: 0.95,
    keyColor: 0xffd9b0, keyI: 0.9, fillColor: 0xe0784a, fillI: 0.5, accent: 0xe0653a,
    enclosed: true, ceiling: 'coffers-warm', pillars: true, city: false, exterior: null,
    rain: false, lightning: false, dayCycle: false,
    water: false, waterfall: false, oculus: false, glowStrips: false, signage: true,
    carpet: 'run', redwoods: false, monoliths: false, greatwall: false, lightwell: false,
  },
  lighthouse: {
    skyTop: 0x030304, skyHorizon: 0x0a0a0d, fogColor: 0x08080a, fogMul: 1.05,
    concrete: 0x94908a, floorColor: 0x8e897f, floorRough: 0.34, floorMetal: 0.3,
    ambSky: 0x2c313a, ambGround: 0x0d0d10, ambI: 0.4,
    keyColor: 0xeef2f8, keyI: 0.45, fillColor: 0xc2a44e, fillI: 0.18, accent: 0xc2a44e,
    enclosed: true, ceiling: 'coffers-dark', pillars: true, city: false, exterior: null,
    rain: false, lightning: false, dayCycle: false,
    water: false, waterfall: false, oculus: false, glowStrips: false, signage: false,
    carpet: 'zone', redwoods: false, monoliths: false, greatwall: false, lightwell: true,
  },
  atrium: {
    skyTop: 0xaebbb7, skyHorizon: 0xdde5e0, fogColor: 0xa9b8b1, fogMul: 1.7,
    concrete: 0xcfd2c9, floorColor: 0x5b615a, floorRough: 0.26, floorMetal: 0.5,
    ambSky: 0xd2dcd6, ambGround: 0x4c584a, ambI: 1.35,
    keyColor: 0xe8eee9, keyI: 0.85, fillColor: 0xb9c8bd, fillI: 0.4, accent: 0x8fae9a,
    enclosed: false, ceiling: 'dome', pillars: true, city: true, exterior: 'green',
    rain: true, lightning: false, dayCycle: false,
    water: true, waterfall: true, oculus: true, glowStrips: false, signage: true,
    carpet: null, redwoods: true, monoliths: false, greatwall: false, lightwell: false,
  },
  skyfall: {
    skyTop: 0x46435e, skyHorizon: 0x8a7a66, fogColor: 0x6e6980, fogMul: 0.4,
    concrete: 0x837c72, floorColor: 0x6a5f50, floorRough: 0.95, floorMetal: 0.03,
    ambSky: 0x8b84a8, ambGround: 0x453d31, ambI: 0.85,
    keyColor: 0xffd9a0, keyI: 1.35, fillColor: 0x7d76a0, fillI: 0.4, accent: 0xd9a24e,
    enclosed: false, ceiling: null, pillars: false, city: false, exterior: 'rocky',
    rain: false, lightning: false, dayCycle: false,
    water: false, waterfall: false, oculus: false, glowStrips: false, signage: false,
    carpet: null, redwoods: false, monoliths: true, greatwall: false, lightwell: false,
  },
  bastion: {
    skyTop: 0x5e6467, skyHorizon: 0x9aa0a0, fogColor: 0x7c8382, fogMul: 0.75,
    concrete: 0x8b8d7f, floorColor: 0x57633c, floorRough: 1.0, floorMetal: 0.0,
    ambSky: 0x97a492, ambGround: 0x2f3d24, ambI: 1.15,
    keyColor: 0xcfd6d2, keyI: 1.0, fillColor: 0x8f9a84, fillI: 0.4, accent: 0xd9552b,
    enclosed: false, ceiling: null, pillars: false, city: false, exterior: 'green',
    rain: true, lightning: true, dayCycle: true,
    water: true, waterfall: false, oculus: false, glowStrips: false, signage: false,
    carpet: null, redwoods: false, monoliths: false, greatwall: true, lightwell: false,
  },
};

/* ----------------------- procedural surface textures ---------------------- *
 * Canvas-generated so the game ships zero image assets. These give concrete
 * its exposed-aggregate speckle and the floor its scuffs, scratches, stains
 * and expansion joints — the fine detail the reference boards call for.
 * ------------------------------------------------------------------------- */

function canvas2d(size: number): { c: HTMLCanvasElement; g: CanvasRenderingContext2D } {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return { c, g: c.getContext('2d')! };
}

function makeAggregateTexture(): THREE.Texture {
  const { c, g } = canvas2d(512);
  g.fillStyle = '#8d887e'; g.fillRect(0, 0, 512, 512);
  // broad tonal mottle (form-work stains)
  for (let i = 0; i < 46; i++) {
    const x = Math.random() * 512, y = Math.random() * 512, r = 40 + Math.random() * 90;
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    const dark = Math.random() > 0.5;
    grd.addColorStop(0, dark ? 'rgba(96,90,82,0.28)' : 'rgba(168,162,150,0.22)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  // aggregate specks
  for (let i = 0; i < 13000; i++) {
    const x = Math.random() * 512, y = Math.random() * 512, r = Math.random() * 1.7;
    const light = Math.random() > 0.42;
    const v = light ? 168 + Math.random() * 74 : 44 + Math.random() * 42;
    g.fillStyle = `rgba(${v | 0},${(v * 0.95) | 0},${(v * 0.87) | 0},${0.12 + Math.random() * 0.3})`;
    g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 3); t.anisotropy = 4;
  return t;
}

function makeFloorTexture(): THREE.Texture {
  const { c, g } = canvas2d(1024);
  g.fillStyle = '#2c251d'; g.fillRect(0, 0, 1024, 1024);
  // tonal mottle
  for (let i = 0; i < 70; i++) {
    const x = Math.random() * 1024, y = Math.random() * 1024, r = 30 + Math.random() * 130;
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, Math.random() > 0.5 ? 'rgba(46,40,34,0.4)' : 'rgba(12,10,9,0.5)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  // oil / water stains
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * 1024, y = Math.random() * 1024, r = 18 + Math.random() * 90;
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, 'rgba(0,0,0,0.4)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  // fine scuffs + scratches
  g.lineCap = 'round';
  for (let i = 0; i < 520; i++) {
    const x = Math.random() * 1024, y = Math.random() * 1024, a = Math.random() * Math.PI, len = 6 + Math.random() * 80;
    const v = 130 + (Math.random() * 70) | 0;
    g.strokeStyle = `rgba(${v},${v - 8},${v - 18},${0.03 + Math.random() * 0.12})`;
    g.lineWidth = Math.random() * 1.3;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len); g.stroke();
  }
  // expansion joints
  g.strokeStyle = 'rgba(0,0,0,0.5)'; g.lineWidth = 2.5;
  for (let i = 0; i <= 4; i++) {
    const p = i * 256;
    g.beginPath(); g.moveTo(p, 0); g.lineTo(p, 1024); g.moveTo(0, p); g.lineTo(1024, p); g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6, 6); t.anisotropy = 8;
  return t;
}

/**
 * Derive a tangent-space normal map from a procedural colour canvas by reading
 * its luminance as a height field and taking the Sobel gradient. This reuses
 * the aggregate speckle / floor scuffs already drawn, so specks bump outward
 * and scratches cut grooves — real surface depth under raking ember light, at
 * zero extra asset cost. Wrap/repeat/anisotropy are copied from the source.
 */
function heightToNormal(src: THREE.Texture, strength = 1): THREE.Texture {
  const img = src.image as HTMLCanvasElement;
  const size = img.width;
  const data = img.getContext('2d')!.getImageData(0, 0, size, size).data;
  const { c, g } = canvas2d(size);
  const out = g.createImageData(size, size);
  const lum = (x: number, y: number) => {
    x = (x + size) % size; y = (y + size) % size;
    const i = (y * size + x) * 4;
    return (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (lum(x - 1, y) - lum(x + 1, y)) * strength;
      const dy = (lum(x, y - 1) - lum(x, y + 1)) * strength;
      const len = Math.hypot(dx, dy, 1);
      const i = (y * size + x) * 4;
      out.data[i] = ((dx / len) * 0.5 + 0.5) * 255;
      out.data[i + 1] = ((dy / len) * 0.5 + 0.5) * 255;
      out.data[i + 2] = (1 / len) * 0.5 * 255 + 127.5;
      out.data[i + 3] = 255;
    }
  }
  g.putImageData(out, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = src.wrapS; t.wrapT = src.wrapT;
  t.repeat.copy(src.repeat); t.anisotropy = src.anisotropy;
  return t;
}

export class Arena {
  readonly colliders: Collider[] = [];
  readonly spawnPoints: THREE.Vector3[] = [];
  readonly raycastTargets: THREE.Object3D[] = [];
  readonly theme: MapTheme;

  private cfg: ThemeCfg;
  private scene: THREE.Scene;
  private monolithRefs: { mesh: THREE.Object3D; baseY: number; phase: number }[] = [];
  private motes: THREE.Points | null = null;
  private keyLight: THREE.DirectionalLight;
  private ambient: THREE.HemisphereLight;
  private rain: THREE.Points | null = null;
  private rainVel: Float32Array | null = null;
  private lightningTimer = 4;
  private materials: Record<SurfaceMat, THREE.MeshStandardMaterial>;
  private glassMat: THREE.MeshPhysicalMaterial;
  private neonMats: THREE.MeshBasicMaterial[];
  private groundMesh!: THREE.Mesh;
  private aggregateTex: THREE.Texture;
  private aggregateNrm: THREE.Texture;
  private floorTex: THREE.Texture;
  private floorNrm: THREE.Texture;
  private waterfallTex: THREE.Texture | null = null;
  private reflectors: Reflector[] = [];

  constructor(engine: Engine, seed: number, theme: MapTheme = 'atrium') {
    this.scene = engine.scene;
    this.theme = theme;
    const cfg = this.cfg = THEMES[theme];
    const rng = mulberry32(seed || 1);

    /* ---- theme atmosphere: gradient sky dome + fog ---- */
    this.buildSky(cfg);
    const baseFog = (this.scene.fog as THREE.FogExp2 | null)?.density ?? 0.0044;
    this.scene.fog = new THREE.FogExp2(cfg.fogColor, baseFog * cfg.fogMul);

    /* ---- procedural textures + theme-tinted shared PBR materials ---- */
    this.aggregateTex = makeAggregateTexture();
    this.aggregateNrm = heightToNormal(this.aggregateTex, 2.4);
    this.floorTex = makeFloorTexture();
    this.floorNrm = heightToNormal(this.floorTex, 1.8);
    this.materials = {
      concrete: new THREE.MeshStandardMaterial({
        color: cfg.concrete, roughness: 0.94, metalness: 0.05,
        map: this.aggregateTex, normalMap: this.aggregateNrm,
        normalScale: new THREE.Vector2(0.7, 0.7),
      }),
      metal: new THREE.MeshStandardMaterial({ color: 0x565049, roughness: 0.5, metalness: 0.8 }),
      glass: new THREE.MeshStandardMaterial({ color: 0x1a2220, roughness: 0.18, metalness: 0.2, transparent: true, opacity: 0.55 }),
    };
    this.glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x141b1c, roughness: 0.1, metalness: 0.0, transmission: 0.5,
      transparent: true, opacity: 0.6, reflectivity: 0.5, ior: 1.4,
    });
    // Accent + oxide-red + muted gold — the only chromatic notes.
    this.neonMats = [cfg.accent, 0xb3402f, 0xc2a44e].map((c) => new THREE.MeshBasicMaterial({ color: c }));

    const shadow = engine.shadowsEnabled;
    this.buildGround();
    if (cfg.enclosed) this.buildEnclosure(shadow); else this.buildPerimeter(shadow);
    if (cfg.city) this.buildCity(rng, shadow);
    this.buildCover(rng, shadow);
    if (!cfg.enclosed) this.buildSkyBridges(rng);
    if (cfg.pillars) this.buildPillars(rng, shadow);
    this.buildLighting(engine);
    if (cfg.ceiling === 'dome') this.buildCurvedChamber(shadow);
    else if (cfg.ceiling) this.buildCoffers(cfg.ceiling === 'coffers-warm', rng, shadow);
    this.buildStaircases(rng);
    this.buildDebris(rng);
    this.buildRooms(rng);
    if (cfg.carpet) this.buildCarpet(cfg.carpet, rng);
    if (cfg.glowStrips) this.buildGlowStrips(rng);
    if (cfg.oculus) this.buildOculus();
    if (cfg.signage) this.buildSignage(rng);
    if (cfg.exterior) this.buildExterior(rng, shadow, cfg.exterior);
    if (cfg.water) this.buildWater();
    if (cfg.waterfall) this.buildWaterfall();
    if (cfg.rain) this.buildRain();
    if (cfg.redwoods) this.buildRedwoods(rng, shadow);
    if (cfg.monoliths) this.buildMonoliths(rng);
    if (cfg.greatwall) this.buildGreatWall(rng, shadow);
    if (cfg.lightwell) this.buildLightWell();

    // Scatter PvP spawn points around the ring.
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const r = 40 + rng() * 40;
      this.spawnPoints.push(new THREE.Vector3(Math.cos(a) * r, 1.7, Math.sin(a) * r));
    }

    // Ambient soundscape + storytelling props.
    this.buildProps(rng, shadow);

    this.ambient = this.ambientRef!;
    this.keyLight = this.keyRef!;
  }

  /** Gradient sky dome (canvas vertical gradient on a back-side sphere) — far
   *  richer than a flat clear colour, and each theme gets its own horizon. */
  private buildSky(cfg: ThemeCfg) {
    const c = document.createElement('canvas'); c.width = 4; c.height = 256;
    const g = c.getContext('2d')!;
    const grd = g.createLinearGradient(0, 0, 0, 256);
    const hex = (n: number) => '#' + n.toString(16).padStart(6, '0');
    grd.addColorStop(0, hex(cfg.skyTop));
    grd.addColorStop(0.62, hex(cfg.skyHorizon));
    grd.addColorStop(1, hex(cfg.fogColor));
    g.fillStyle = grd; g.fillRect(0, 0, 4, 256);
    const tex = new THREE.CanvasTexture(c);
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(740, 24, 14),
      new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, fog: false, depthWrite: false }),
    );
    dome.renderOrder = -10;
    this.scene.add(dome);
    this.scene.background = new THREE.Color(cfg.fogColor); // fallback beyond the dome
  }

  /* ------------------------------- geometry ------------------------------ */

  private addBox(
    w: number, h: number, d: number, x: number, y: number, z: number,
    material: SurfaceMat, opts: { shadow?: boolean; emissiveTrim?: boolean; collide?: boolean } = {},
  ): THREE.Mesh {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, material === 'glass' ? this.glassMat : this.materials[material]);
    mesh.position.set(x, y, z);
    mesh.castShadow = opts.shadow ?? true;
    mesh.receiveShadow = true;
    mesh.userData.material = material;
    this.scene.add(mesh);
    this.raycastTargets.push(mesh);
    if (opts.collide ?? true) {
      this.colliders.push({ box: new THREE.Box3().setFromObject(mesh), material });
    }
    return mesh;
  }

  private buildGround() {
    const geo = new THREE.PlaneGeometry(ARENA_HALF * 2 + 40, ARENA_HALF * 2 + 40);
    // Wet polished concrete — scuffed + scratched, slightly metallic so ember
    // light streaks across it and the light-pool reflects.
    const mat = new THREE.MeshStandardMaterial({
      color: this.cfg.floorColor, map: this.floorTex, normalMap: this.floorNrm,
      normalScale: new THREE.Vector2(0.5, 0.5),
      roughness: this.cfg.floorRough, metalness: this.cfg.floorMetal,
    });
    this.groundMesh = new THREE.Mesh(geo, mat);
    this.groundMesh.rotation.x = -Math.PI / 2;
    this.groundMesh.receiveShadow = true;
    this.groundMesh.userData.material = 'concrete';
    this.scene.add(this.groundMesh);
    this.raycastTargets.push(this.groundMesh);

    // Barely-there expansion-joint grid, warm and dim.
    const grid = new THREE.GridHelper(ARENA_HALF * 2, 48, 0x241610, 0x140d0a);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.22;
    grid.position.y = 0.02;
    this.scene.add(grid);
  }

  private buildPerimeter(shadow: boolean) {
    // Open colonnade instead of a solid wall: a low parapet + a row of tall
    // columns carrying a lintel, so you see straight out to the landscape.
    const P = ARENA_HALF, T = 1.4, parH = 2.6, colH = 20;
    const spans: { w: number; d: number; x: number; z: number; horiz: boolean }[] = [
      { w: P * 2, d: T, x: 0, z: -P, horiz: true },
      { w: P * 2, d: T, x: 0, z: P, horiz: true },
      { w: T, d: P * 2, x: -P, z: 0, horiz: false },
      { w: T, d: P * 2, x: P, z: 0, horiz: false },
    ];
    for (const s of spans) {
      // low parapet (collides; the hard boundary clamp backs it up)
      this.addBox(s.w, parH, s.d, s.x, parH / 2, s.z, 'concrete', { shadow });
      const trim = new THREE.Mesh(new THREE.BoxGeometry(s.w, 0.35, s.d), this.neonMats[0]);
      trim.position.set(s.x, parH, s.z); this.scene.add(trim);
      // colonnade + lintel
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(s.horiz ? P * 2 : 2.2, 2, s.horiz ? 2.2 : P * 2), this.materials.concrete);
      lintel.position.set(s.x, colH, s.z); lintel.castShadow = shadow; lintel.receiveShadow = true; this.scene.add(lintel);
      const n = 14;
      for (let i = 0; i <= n; i++) {
        const t = -P + (i / n) * P * 2;
        const cx = s.horiz ? t : s.x, cz = s.horiz ? s.z : t;
        const col = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.3, colH, 10), this.materials.concrete);
        col.position.set(cx, colH / 2, cz); col.castShadow = shadow; col.receiveShadow = true;
        this.scene.add(col);
      }
    }
  }

  private buildCity(rng: () => number, shadow: boolean) {
    // A ring of monolithic towers surrounding a central plaza kept clear for
    // combat. Each tower gets an instanced grid of emissive "windows".
    const towers = 14;
    const winGeo = new THREE.BoxGeometry(1.4, 1.9, 0.2);
    // Most windows dead; the few that are lit burn a dim sodium ember.
    const winMat = new THREE.MeshStandardMaterial({
      color: 0x0b0806, emissive: 0x7a3212, emissiveIntensity: 0.55, roughness: 0.5,
    });
    const winInstances: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();

    for (let i = 0; i < towers; i++) {
      const a = (i / towers) * Math.PI * 2 + rng() * 0.2;
      const ring = 46 + rng() * 40;
      const x = Math.cos(a) * ring;
      const z = Math.sin(a) * ring;
      if (Math.hypot(x, z) < 26) continue; // keep the plaza open
      const w = 10 + rng() * 12;
      const d = 10 + rng() * 12;
      const h = 24 + rng() * 60;
      this.addBox(w, h, d, x, h / 2, z, 'concrete', { shadow });

      // Cantilevered upper mass — signature brutalist overhang.
      if (rng() > 0.4) {
        const cw = w * (1.2 + rng() * 0.4);
        this.addBox(cw, 6, d * 0.8, x + (rng() - 0.5) * w, h - 8, z, 'concrete', { shadow });
      }

      // Window instances across the four faces.
      const rows = Math.floor(h / 4);
      const cols = Math.max(2, Math.floor(w / 3));
      for (let r = 1; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (rng() > 0.4) continue; // mostly dark — a city with the power cut
          const wy = r * 4;
          const wx = -w / 2 + 1.6 + c * ((w - 3) / Math.max(1, cols - 1));
          dummy.position.set(x + wx, wy, z + d / 2 + 0.05);
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          winInstances.push(dummy.matrix.clone());
        }
      }
    }

    if (winInstances.length) {
      const inst = new THREE.InstancedMesh(winGeo, winMat, winInstances.length);
      winInstances.forEach((m, i) => inst.setMatrixAt(i, m));
      inst.instanceMatrix.needsUpdate = true;
      this.scene.add(inst);
    }
  }

  private buildCover(rng: () => number, shadow: boolean) {
    // Shipping containers / barricades / vehicle husks scattered for combat.
    const count = 26;
    for (let i = 0; i < count; i++) {
      const a = rng() * Math.PI * 2;
      const r = 10 + rng() * 70;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      const kind = rng();
      if (kind < 0.5) {
        this.addBox(4 + rng() * 3, 2.6, 2.4, x, 1.3, z, 'metal', { shadow }); // container
      } else if (kind < 0.8) {
        this.addBox(2, 1 + rng() * 1.5, 2, x, 0.75, z, 'concrete', { shadow }); // barrier block
      } else {
        // Destroyed vehicle: a low slab + cabin.
        this.addBox(4.4, 1.2, 2, x, 0.6, z, 'metal', { shadow });
        this.addBox(2.2, 1, 1.9, x - 0.6, 1.6, z, 'metal', { shadow });
      }
    }
  }

  private buildSkyBridges(rng: () => number) {
    // Elevated walkways connecting towers — vertical gameplay.
    for (let i = 0; i < 4; i++) {
      const a = rng() * Math.PI * 2;
      const r = 40;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      const len = 30 + rng() * 20;
      const y = 12 + rng() * 14;
      const bridge = this.addBox(len, 0.6, 4, x, y, z, 'metal', { shadow: true });
      bridge.rotation.y = a;
      // Rebuild the collider from the rotated mesh.
      this.colliders[this.colliders.length - 1].box.setFromObject(bridge);
    }
  }

  private buildPillars(rng: () => number, shadow: boolean) {
    // Massive instanced support pillars under the central atrium.
    const geo = new THREE.CylinderGeometry(1.1, 1.3, 20, 10);
    const mat = this.materials.concrete;
    const positions: [number, number][] = [];
    for (let gx = -2; gx <= 2; gx++) for (let gz = -2; gz <= 2; gz++) {
      if (gx === 0 && gz === 0) continue;
      positions.push([gx * 11 + (rng() - 0.5) * 2, gz * 11 + (rng() - 0.5) * 2]);
    }
    const inst = new THREE.InstancedMesh(geo, mat, positions.length);
    const dummy = new THREE.Object3D();
    positions.forEach(([x, z], i) => {
      dummy.position.set(x, 10, z);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
      // Each pillar still needs a collider.
      const b = new THREE.Box3(new THREE.Vector3(x - 1.3, 0, z - 1.3), new THREE.Vector3(x + 1.3, 20, z + 1.3));
      this.colliders.push({ box: b, material: 'concrete' });
    });
    inst.instanceMatrix.needsUpdate = true;
    inst.castShadow = shadow; inst.receiveShadow = true;
    this.scene.add(inst);
    // (The coffered ceiling these pillars carry is built separately.)

    // A monumental central pillar — the atrium's structural hero.
    const core = new THREE.Mesh(new THREE.BoxGeometry(5, 21, 5), this.materials.concrete);
    core.position.set(0, 10.5, 0); core.castShadow = shadow; core.receiveShadow = true;
    this.scene.add(core); this.raycastTargets.push(core);
    this.colliders.push({ box: new THREE.Box3().setFromObject(core), material: 'concrete' });
    // recessed detailing panels on the pillar faces
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x6d685f, roughness: 0.9, metalness: 0.06, map: this.aggregateTex });
    for (let f = 0; f < 4; f++) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(3.4, 16, 0.3), panelMat);
      const ang = (f / 4) * Math.PI * 2;
      p.position.set(Math.sin(ang) * 2.55, 11, Math.cos(ang) * 2.55);
      p.rotation.y = ang; this.scene.add(p);
    }
  }

  /* Curved concrete dome-canopy with an elliptical oculus — the smooth
   * lathe-shell hero space (reference 2). Overhead, so the plaza stays open. */
  private buildCurvedChamber(shadow: boolean) {
    // Profile revolved around Y: wide skirt at the base curving up and inward
    // to the oculus rim. Low-ish segments keep it faceted-yet-smooth + cheap.
    const profile: THREE.Vector2[] = [
      [42, 8.5], [41.2, 11], [39, 13.4], [35.5, 15.8], [30.5, 18.2],
      [24.5, 20.4], [18.5, 22.2], [14.5, 23.6], [13, 24.4],
    ].map(([r, y]) => new THREE.Vector2(r, y));
    const geo = new THREE.LatheGeometry(profile, 96);
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({
      color: 0xb4aea3, roughness: 0.92, metalness: 0.05, map: this.aggregateTex, side: THREE.DoubleSide,
    });
    const dome = new THREE.Mesh(geo, mat);
    dome.castShadow = shadow; dome.receiveShadow = true;
    this.scene.add(dome);

    // A thin lower rim + oculus rim to crisp the curved edges.
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x77726a, roughness: 0.9, metalness: 0.1, map: this.aggregateTex });
    const baseRim = new THREE.Mesh(new THREE.TorusGeometry(42, 0.5, 10, 96), rimMat);
    baseRim.rotation.x = Math.PI / 2; baseRim.position.y = 8.5; this.scene.add(baseRim);
    const ocuRim = new THREE.Mesh(new THREE.TorusGeometry(13, 0.6, 10, 72), rimMat);
    ocuRim.rotation.x = Math.PI / 2; ocuRim.position.y = 24.4; this.scene.add(ocuRim);

    // Warm ember light-strip washing the base of the curved wall (per reference).
    const emberRing = new THREE.Mesh(new THREE.TorusGeometry(41.4, 0.28, 8, 110), this.neonMats[0]);
    emberRing.rotation.x = Math.PI / 2; emberRing.position.y = 9.2; this.scene.add(emberRing);

    // A few warm accent lights under the canopy so the curved shell reads.
    const accents: [number, number][] = [[24, 0], [-24, 0], [0, 24], [0, -24]];
    accents.forEach(([x, z], i) => {
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffcf9a }));
      bulb.position.set(x, 15, z); this.scene.add(bulb);
      if (i % 2 === 0) { const pl = new THREE.PointLight(0xffcf9a, 3.2, 48, 2); pl.position.set(x, 14, z); this.scene.add(pl); }
    });
  }

  /* Monumental staircases — vertical play + brutalist mass. Each step is a
   * collider so the auto step-up lets you climb them. */
  private buildStaircases(rng: () => number) {
    const makeStair = (x: number, z: number, ry: number, steps: number, w: number) => {
      const cos = Math.cos(ry), sin = Math.sin(ry);
      for (let i = 0; i < steps; i++) {
        const s = new THREE.Mesh(new THREE.BoxGeometry(w, 0.4, 1.1), this.materials.concrete);
        const lz = -i * 1.0;
        s.position.set(x + sin * lz, 0.2 + i * 0.4, z + cos * lz);
        s.rotation.y = ry; s.castShadow = true; s.receiveShadow = true;
        this.scene.add(s);
        this.colliders.push({ box: new THREE.Box3().setFromObject(s), material: 'concrete' });
      }
    };
    makeStair(-36, 34, 0.5, 11, 9);
    makeStair(40, -30, -1.1, 13, 11);
    makeStair(24, 44, Math.PI, 8, 7);
  }

  /* Scattered rubble + faceted rocks (instanced) for ground detail. */
  private buildDebris(rng: () => number) {
    const rockGeo = new THREE.IcosahedronGeometry(0.6, 0);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x413c35, roughness: 0.96, metalness: 0.04, map: this.aggregateTex, flatShading: true });
    const N = 70;
    const inst = new THREE.InstancedMesh(rockGeo, rockMat, N);
    const d = new THREE.Object3D();
    for (let i = 0; i < N; i++) {
      const a = rng() * Math.PI * 2, r = 8 + rng() * 82;
      d.position.set(Math.cos(a) * r, 0.15 + rng() * 0.25, Math.sin(a) * r);
      d.rotation.set(rng() * 3, rng() * 3, rng() * 3);
      const s = 0.28 + rng() * 1.1;
      d.scale.set(s, s * (0.5 + rng() * 0.6), s);
      d.updateMatrix(); inst.setMatrixAt(i, d.matrix);
    }
    inst.instanceMatrix.needsUpdate = true; inst.castShadow = true; inst.receiveShadow = true;
    this.scene.add(inst);

    // Broken concrete chunks near walls/cover.
    for (let i = 0; i < 26; i++) {
      const a = rng() * Math.PI * 2, r = 18 + rng() * 72;
      const chunk = new THREE.Mesh(
        new THREE.BoxGeometry(0.4 + rng() * 0.9, 0.3 + rng() * 0.5, 0.4 + rng() * 0.9),
        this.materials.concrete,
      );
      chunk.position.set(Math.cos(a) * r, 0.2, Math.sin(a) * r);
      chunk.rotation.set(rng() * 0.4, rng() * 3, rng() * 0.4);
      chunk.castShadow = true; chunk.receiveShadow = true; this.scene.add(chunk);
    }
  }

  /* Furnished interior zones (carpet + furniture) + partial room enclosures. */
  private buildRooms(rng: () => number) {
    // A red-carpet lobby zone (the warm reference interiors).
    const carpet = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 13),
      new THREE.MeshStandardMaterial({ color: 0x6e211a, roughness: 0.95, metalness: 0.0 }),
    );
    carpet.rotation.x = -Math.PI / 2; carpet.position.set(-42, 0.04, -32); carpet.receiveShadow = true;
    this.scene.add(carpet);

    const furnMat = new THREE.MeshStandardMaterial({ color: 0x14141a, roughness: 0.4, metalness: 0.55 });
    const furniture: [number, number, number, number, number][] = [
      [-46, -36, 1.6, 0.6, 1.0], [-40, -30, 1.2, 0.5, 1.2], [-44, -28, 1.0, 0.9, 0.5], [-38, -35, 1.8, 0.5, 0.9],
    ];
    for (const [x, z, w, h, dd] of furniture) {
      const t = new THREE.Mesh(new THREE.BoxGeometry(w, h, dd), furnMat);
      t.position.set(x, h / 2, z); t.rotation.y = rng() * 0.6; t.castShadow = true; t.receiveShadow = true;
      this.scene.add(t);
      this.colliders.push({ box: new THREE.Box3().setFromObject(t), material: 'metal' });
    }

    // Partial room enclosures (three walls + a doorway) to fight through.
    const room = (x: number, z: number, ry: number) => {
      const parts: THREE.Mesh[] = [
        new THREE.Mesh(new THREE.BoxGeometry(13, 5.5, 0.6), this.materials.concrete),   // back
        new THREE.Mesh(new THREE.BoxGeometry(0.6, 5.5, 13), this.materials.concrete),   // left
        new THREE.Mesh(new THREE.BoxGeometry(0.6, 5.5, 5.5), this.materials.concrete),  // right (partial → doorway)
      ];
      parts[0].position.set(0, 2.75, -6.5);
      parts[1].position.set(-6.5, 2.75, 0);
      parts[2].position.set(6.5, 2.75, -3.75);
      const g = new THREE.Group();
      parts.forEach((p) => { p.castShadow = true; p.receiveShadow = true; g.add(p); });
      g.position.set(x, 0, z); g.rotation.y = ry; this.scene.add(g);
      parts.forEach((p) => {
        this.raycastTargets.push(p);
        this.colliders.push({ box: new THREE.Box3().setFromObject(p), material: 'concrete' });
      });
    };
    room(62, 52, -0.7);
    room(-66, -44, 0.55);
    room(56, -58, 2.3);
  }

  private buildProps(rng: () => number, shadow: boolean) {
    // Environmental storytelling: emergency lights, barricades, drone remains.
    for (let i = 0; i < 9; i++) {
      const a = rng() * Math.PI * 2, r = 15 + rng() * 60;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff6a2e }));
      bulb.position.set(x, 3, z);
      this.scene.add(bulb);
      // Only some emergency lamps carry a real light (perf); the rest just glow.
      if (i < 4) {
        const light = new THREE.PointLight(0xff4a1e, 7, 16, 2);
        light.position.copy(bulb.position);
        this.scene.add(light);
      }
    }
    // Broken drone husks (metal debris).
    for (let i = 0; i < 6; i++) {
      const a = rng() * Math.PI * 2, r = 12 + rng() * 60;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      this.addBox(1.4, 0.4, 1.4, x, 0.2, z, 'metal', { shadow, collide: false });
    }
  }

  private ambientRef?: THREE.HemisphereLight;
  private keyRef?: THREE.DirectionalLight;

  private buildLighting(engine: Engine) {
    // Per-theme hemisphere bounce + key + fill, from the theme's palette.
    const cfg = this.cfg;
    const ambient = new THREE.HemisphereLight(cfg.ambSky, cfg.ambGround, cfg.ambI);
    this.scene.add(ambient);
    this.ambientRef = ambient;

    const key = new THREE.DirectionalLight(cfg.keyColor, cfg.keyI);
    key.position.set(60, 90, 30);
    key.castShadow = engine.shadowsEnabled;
    if (engine.shadowsEnabled && engine.shadowMapSize) {
      key.shadow.mapSize.set(engine.shadowMapSize, engine.shadowMapSize);
      const c = key.shadow.camera;
      c.left = -ARENA_HALF; c.right = ARENA_HALF; c.top = ARENA_HALF; c.bottom = -ARENA_HALF;
      c.near = 1; c.far = 320;
      key.shadow.bias = -0.0005;
    }
    this.scene.add(key);
    this.scene.add(key.target);
    this.keyRef = key;

    // Fill from the opposite side (no shadow → cheap) so ceilings and towers
    // don't cast the plaza into pure black.
    const fill = new THREE.DirectionalLight(this.cfg.fillColor, this.cfg.fillI);
    fill.position.set(-55, 34, -46);
    this.scene.add(fill);
  }

  /** Ember light-strips raking the floor — the signature glow of the mood board. */
  private buildGlowStrips(rng: () => number) {
    const stripMat = this.neonMats[0]; // ember, unlit (blooms)
    const inset = ARENA_HALF - 2;
    const spans: [number, number, number, number][] = [
      [ARENA_HALF * 2 - 6, 0.4, 0, -inset],
      [ARENA_HALF * 2 - 6, 0.4, 0, inset],
      [0.4, ARENA_HALF * 2 - 6, -inset, 0],
      [0.4, ARENA_HALF * 2 - 6, inset, 0],
    ];
    for (const [w, d, x, z] of spans) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(w, 0.16, d), stripMat);
      bar.position.set(x, 0.32, z);
      this.scene.add(bar);
      // One dynamic light per wall — the strips themselves bloom for the rest.
      const pl = new THREE.PointLight(0xff5a24, 5.5, 34, 2);
      pl.position.set(x, 1.4, z);
      this.scene.add(pl);
    }
    // A couple of interior floor cuts of ember light near the plaza rim.
    for (let i = 0; i < 2; i++) {
      const a = rng() * Math.PI * 2, r = 22 + rng() * 12;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.14, 6 + rng() * 6), stripMat);
      bar.position.set(x, 0.3, z); bar.rotation.y = a;
      this.scene.add(bar);
      const pl = new THREE.PointLight(0xff5a24, 4, 18, 2); pl.position.set(x, 1, z); this.scene.add(pl);
    }
  }

  /** Overhead light-well: a bright disc + spot casting a pool on the plaza. */
  private buildOculus() {
    // Bright skylight disc above the coffered light-well.
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(14, 48),
      new THREE.MeshBasicMaterial({ color: 0xeef2f6, side: THREE.DoubleSide }),
    );
    disc.rotation.x = Math.PI / 2; disc.position.set(0, 44, 0);
    this.scene.add(disc);

    // A strong shaft pooling light on the plaza around the central pillar.
    const spot = new THREE.SpotLight(0xdce6f4, 6.5, 160, Math.PI / 4.4, 0.5, 1.0);
    spot.position.set(0, 46, 0);
    spot.target.position.set(0, 0, 0);
    this.scene.add(spot);
    this.scene.add(spot.target);

    // Soft additive "pool" decal on the floor so the light reads even at grazing angles.
    const pool = new THREE.Mesh(
      new THREE.CircleGeometry(22, 48),
      new THREE.MeshBasicMaterial({ color: 0x9fb2c8, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    pool.rotation.x = -Math.PI / 2; pool.position.set(0, 0.04, 0);
    this.scene.add(pool);
  }

  /** Stencilled wayfinding — "FLOOR 01 / UNIT NN" on the perimeter, per reference. */
  private buildSignage(rng: () => number) {
    const makeSign = (unit: number): THREE.Texture => {
      const c = document.createElement('canvas'); c.width = c.height = 256;
      const g = c.getContext('2d')!;
      g.clearRect(0, 0, 256, 256);
      g.fillStyle = 'rgba(231,224,210,0.86)';
      g.textAlign = 'center';
      g.font = '600 30px "Barlow Condensed", Arial Narrow, sans-serif';
      g.fillText('FLOOR 01', 128, 56);
      g.font = '700 150px "Barlow Condensed", Arial Narrow, sans-serif';
      g.fillText(String(unit), 128, 196);
      g.strokeStyle = 'rgba(217,85,43,0.95)'; g.lineWidth = 5;
      g.beginPath(); g.moveTo(58, 214); g.lineTo(198, 214); g.stroke();
      const t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t;
    };
    const P = ARENA_HALF - 0.6;
    const placements: { x: number; z: number; ry: number }[] = [
      { x: -30, z: -P, ry: 0 }, { x: 34, z: -P, ry: 0 },
      { x: -28, z: P, ry: Math.PI }, { x: 30, z: P, ry: Math.PI },
      { x: -P, z: 26, ry: Math.PI / 2 }, { x: P, z: -24, ry: -Math.PI / 2 },
    ];
    placements.forEach((p, i) => {
      const mat = new THREE.MeshBasicMaterial({ map: makeSign(13 + i), transparent: true, depthWrite: false });
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), mat);
      sign.position.set(p.x, 5, p.z); sign.rotation.y = p.ry;
      this.scene.add(sign);
    });
  }

  /** A properly detailed tree: tapered leaning trunk, branch stubs, and a crown
   *  of 4–7 jittered icosahedron foliage clumps (two green tones) — or a conifer
   *  of stacked irregular cones. Far richer than the old single-cone trees. */
  private makeTree(rng: () => number, x: number, z: number, scale: number, shadow: boolean) {
    const g = new THREE.Group();
    const conifer = rng() < 0.45;
    const barkMat = new THREE.MeshStandardMaterial({ color: conifer ? 0x3a2c1c : 0x4a3823, roughness: 1 });
    const th = (conifer ? 7 : 5.5) * scale * (0.8 + rng() * 0.5);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22 * scale, 0.55 * scale, th, 8), barkMat);
    trunk.position.y = th / 2; trunk.rotation.z = (rng() - 0.5) * 0.09;
    trunk.castShadow = shadow; g.add(trunk);
    if (conifer) {
      // Stacked irregular cones, each offset + squashed differently.
      const leaf = new THREE.MeshStandardMaterial({ color: 0x2c421e, roughness: 1, flatShading: true });
      const tiers = 4 + Math.floor(rng() * 3);
      for (let t = 0; t < tiers; t++) {
        const f = t / tiers;
        const cr = (2.6 - f * 1.9) * scale * (0.85 + rng() * 0.3);
        const ch = (2.2 - f * 0.8) * scale;
        const cone = new THREE.Mesh(new THREE.ConeGeometry(cr, ch, 9), leaf);
        cone.position.set((rng() - 0.5) * 0.5 * scale, th * 0.42 + f * th * 0.72, (rng() - 0.5) * 0.5 * scale);
        cone.rotation.y = rng() * Math.PI; cone.castShadow = shadow; g.add(cone);
      }
    } else {
      // Broadleaf: a cluster of jittered rounded clumps in two greens.
      const tones = [0x3a5423, 0x2e451c, 0x49632c];
      const clumps = 4 + Math.floor(rng() * 4);
      for (let cN = 0; cN < clumps; cN++) {
        const s = (1.3 + rng() * 1.4) * scale;
        const clump = new THREE.Mesh(
          new THREE.IcosahedronGeometry(s, 1),
          new THREE.MeshStandardMaterial({ color: tones[Math.floor(rng() * tones.length)], roughness: 1, flatShading: true }),
        );
        const aa = rng() * Math.PI * 2, rr = rng() * 1.6 * scale;
        clump.position.set(Math.cos(aa) * rr, th * 0.86 + (rng() - 0.3) * 1.6 * scale, Math.sin(aa) * rr);
        clump.scale.y = 0.75 + rng() * 0.3; clump.castShadow = shadow; g.add(clump);
      }
      // A couple of bare branch stubs poking out of the crown.
      for (let b = 0; b < 2; b++) {
        const br = new THREE.Mesh(new THREE.CylinderGeometry(0.05 * scale, 0.1 * scale, 1.8 * scale, 5), barkMat);
        br.position.set((rng() - 0.5) * 1.6 * scale, th * 0.8, (rng() - 0.5) * 1.6 * scale);
        br.rotation.z = 0.7 + rng() * 0.7; g.add(br);
      }
    }
    g.position.set(x, 0, z);
    this.scene.add(g);
  }

  /** The world beyond the colonnade — green valley or golden rocky wilds. */
  private buildExterior(rng: () => number, shadow: boolean, kind: 'green' | 'rocky') {
    const green = kind === 'green';
    // Vast outer ground fading into the fog.
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(1800, 1800),
      new THREE.MeshStandardMaterial({ color: green ? 0x2c3626 : 0x574b3c, roughness: 1, metalness: 0 }),
    );
    ground.rotation.x = -Math.PI / 2; ground.position.y = -0.6; ground.receiveShadow = true; this.scene.add(ground);

    // Rolling mounds — mossy (green) or ochre scree (rocky).
    const hillMat = new THREE.MeshStandardMaterial({ color: green ? 0x38492a : 0x5f5240, roughness: 1, flatShading: true });
    for (let i = 0; i < 16; i++) {
      const a = rng() * Math.PI * 2, r = 150 + rng() * 240, s = 40 + rng() * 90;
      const hill = new THREE.Mesh(new THREE.SphereGeometry(s, 10, 7), hillMat);
      hill.position.set(Math.cos(a) * r, -s * 0.72, Math.sin(a) * r);
      hill.scale.y = (green ? 0.34 : 0.22) + rng() * 0.25; this.scene.add(hill);
    }

    if (green) {
      // Distant megastructures with faint lit-window strips.
      const megaMat = new THREE.MeshStandardMaterial({ color: 0x2a2f37, roughness: 0.9, metalness: 0.25 });
      const stripMat = new THREE.MeshStandardMaterial({ color: 0x11100e, emissive: 0x8a4a20, emissiveIntensity: 0.5 });
      for (let i = 0; i < 12; i++) {
        const a = rng() * Math.PI * 2, r = 220 + rng() * 240;
        const w = 20 + rng() * 46, h = 70 + rng() * 150, d = 20 + rng() * 46;
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), megaMat);
        m.position.set(Math.cos(a) * r, h / 2 - 6, Math.sin(a) * r); m.rotation.y = rng(); this.scene.add(m);
        for (let sN = 0; sN < 3; sN++) {
          if (rng() < 0.5) continue;
          const strip = new THREE.Mesh(new THREE.BoxGeometry(w * 1.01, 0.9, d * 1.01), stripMat);
          strip.position.set(m.position.x, 12 + rng() * (h - 20), m.position.z);
          strip.rotation.y = m.rotation.y; this.scene.add(strip);
        }
      }
      // A colossal dam wall spanning the valley.
      const da = rng() * Math.PI * 2;
      const dam = new THREE.Mesh(new THREE.BoxGeometry(420, 96, 26), megaMat);
      dam.position.set(Math.cos(da) * 340, 42, Math.sin(da) * 340); dam.rotation.y = da; this.scene.add(dam);
    } else {
      // Rocky wilds: shattered mega-boulders + a broken ridge line.
      const rockMat = new THREE.MeshStandardMaterial({ color: 0x4c4238, roughness: 1, flatShading: true });
      for (let i = 0; i < 22; i++) {
        const a = rng() * Math.PI * 2, r = 140 + rng() * 260, s = 6 + rng() * 26;
        const rock = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 1), rockMat);
        rock.position.set(Math.cos(a) * r, s * 0.28, Math.sin(a) * r);
        rock.rotation.set(rng() * 3, rng() * 3, rng() * 3);
        rock.scale.y = 0.5 + rng() * 0.5; this.scene.add(rock);
      }
    }

    // Trees — detailed broadleaf/conifer mix; sparse dead snags on rocky wilds.
    if (green) {
      for (let i = 0; i < 40; i++) {
        const inside = i < 6;
        const a = rng() * Math.PI * 2;
        const r = inside ? 34 + rng() * 55 : 130 + rng() * 160;
        this.makeTree(rng, Math.cos(a) * r, Math.sin(a) * r, inside ? 1 : 1.4 + rng() * 1.6, shadow && inside);
      }
    } else {
      const snagMat = new THREE.MeshStandardMaterial({ color: 0x33291d, roughness: 1 });
      for (let i = 0; i < 10; i++) {
        const a = rng() * Math.PI * 2, r = 60 + rng() * 160, h = 5 + rng() * 7;
        const snag = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.4, h, 6), snagMat);
        snag.position.set(Math.cos(a) * r, h / 2, Math.sin(a) * r);
        snag.rotation.z = (rng() - 0.5) * 0.25; this.scene.add(snag);
      }
    }
  }

  /** Reflective water: a real planar mirror pool inside + a cheap glossy lake out. */
  private buildWater() {
    // Inner reflective pool (Reflector — genuine reflections of the architecture).
    const pool = new Reflector(new THREE.PlaneGeometry(34, 22), {
      textureWidth: 512, textureHeight: 512, color: 0x33454c,   // 512px keeps the extra pass cheap
    });
    pool.rotation.x = -Math.PI / 2; pool.position.set(-52, 0.06, 6);
    this.scene.add(pool); this.reflectors.push(pool);
    // A thin water-tint sheet over it for colour + subtle ripple look.
    const tint = new THREE.Mesh(new THREE.PlaneGeometry(34, 22),
      new THREE.MeshStandardMaterial({ color: 0x24343a, transparent: true, opacity: 0.4, roughness: 0.1, metalness: 0.6 }));
    tint.rotation.x = -Math.PI / 2; tint.position.set(-52, 0.08, 6); this.scene.add(tint);

    // Outer lake/moat — cheap glossy plane (no reflector cost).
    const lake = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600),
      new THREE.MeshStandardMaterial({ color: 0x141e22, roughness: 0.08, metalness: 0.85 }));
    lake.rotation.x = -Math.PI / 2; lake.position.y = -0.35; this.scene.add(lake);
  }

  /** An animated waterfall cascading inside near the west colonnade + splash pool. */
  private buildWaterfall() {
    // Vertical streak texture that scrolls downward.
    const c = document.createElement('canvas'); c.width = 64; c.height = 256;
    const g = c.getContext('2d')!;
    g.clearRect(0, 0, 64, 256);
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * 64, w = 1 + Math.random() * 3;
      g.fillStyle = `rgba(200,224,232,${0.15 + Math.random() * 0.4})`;
      g.fillRect(x, 0, w, 256);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(2, 3);
    this.waterfallTex = tex;

    const fallMat = new THREE.MeshBasicMaterial({ map: tex, color: 0x9fc0cc, transparent: true, opacity: 0.42, side: THREE.DoubleSide, depthWrite: false });
    const fall = new THREE.Mesh(new THREE.PlaneGeometry(8, 24), fallMat);
    fall.position.set(-70, 12, 40); fall.rotation.y = Math.PI / 2;
    this.scene.add(fall);

    // Ledge it pours from + splash pool + mist.
    this.addBox(6, 2, 10, -70, 24, 40, 'concrete', { shadow: true, collide: false });
    const splash = new THREE.Mesh(new THREE.CircleGeometry(6, 20),
      new THREE.MeshStandardMaterial({ color: 0x2a3c40, roughness: 0.1, metalness: 0.7 }));
    splash.rotation.x = -Math.PI / 2; splash.position.set(-70, 0.09, 40); this.scene.add(splash);

    const mistCount = 40;
    const mp = new Float32Array(mistCount * 3);
    for (let i = 0; i < mistCount; i++) { mp[i * 3] = -70 + (Math.random() - 0.5) * 8; mp[i * 3 + 1] = Math.random() * 3; mp[i * 3 + 2] = 40 + (Math.random() - 0.5) * 8; }
    const mistGeo = new THREE.BufferGeometry();
    mistGeo.setAttribute('position', new THREE.BufferAttribute(mp, 3));
    const mist = new THREE.Points(mistGeo, new THREE.PointsMaterial({ color: 0xcfe0e6, size: 1.6, transparent: true, opacity: 0.35, depthWrite: false }));
    this.scene.add(mist);
  }

  private buildRain() {
    const count = 4000;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    this.rainVel = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * ARENA_HALF * 2;
      pos[i * 3 + 1] = Math.random() * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * ARENA_HALF * 2;
      this.rainVel[i] = 30 + Math.random() * 30;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0x9fc7ff, size: 0.09, transparent: true, opacity: 0.5 });
    this.rain = new THREE.Points(geo, mat);
    this.scene.add(this.rain);
  }

  /* --------------------------- theme-only builders ------------------------ */

  /** Solid enclosing walls (interior themes) — replaces the open colonnade. */
  private buildEnclosure(shadow: boolean) {
    const P = ARENA_HALF, H = 30, T = 2;
    const warm = this.theme === 'sanctum';
    const spans: [number, number, number, number][] = [
      [P * 2 + T, T, 0, -P], [P * 2 + T, T, 0, P], [T, P * 2 + T, -P, 0], [T, P * 2 + T, P, 0],
    ];
    for (const [w, d, x, z] of spans) {
      this.addBox(w, H, d, x, H / 2, z, 'concrete', { shadow });
      if (warm) {
        // Long recessed light slits washing warm light down the walls (ref 1).
        const slit = new THREE.Mesh(
          new THREE.BoxGeometry(Math.max(w - 8, 0.3), 0.5, Math.max(d - 8, 0.3)),
          new THREE.MeshStandardMaterial({ color: 0x1c0f08, emissive: 0xffb37e, emissiveIntensity: 1.6 }),
        );
        slit.position.set(x * 0.98, H - 6, z * 0.98);
        this.scene.add(slit);
      }
    }
    if (warm) {
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const pl = new THREE.PointLight(0xffb37e, 6, 70, 1.8);
        pl.position.set(Math.cos(a) * P * 0.7, H - 7, Math.sin(a) * P * 0.7);
        this.scene.add(pl);
      }
    }
  }

  /** Stepped hanging coffer ceiling — warm (ref 1) or near-black grid (ref 2). */
  private buildCoffers(warm: boolean, rng: () => number, shadow: boolean) {
    const H = 30, P = ARENA_HALF;
    const slabMat = new THREE.MeshStandardMaterial({
      color: warm ? 0xb98d74 : 0x141518, roughness: 0.95, metalness: 0.05, map: this.aggregateTex,
    });
    // Main ceiling slab (leave a big opening over the light-well if there is one).
    const hole = this.cfg.lightwell ? 12 : 0;
    if (hole) {
      // Four slabs framing a central square opening (the light-well aperture).
      this.addCeilSlab(-(hole + (P - hole) / 2), 0, P - hole, P * 2, H, slabMat);
      this.addCeilSlab(hole + (P - hole) / 2, 0, P - hole, P * 2, H, slabMat);
      this.addCeilSlab(0, -(hole + (P - hole) / 2), hole * 2, P - hole, H, slabMat, true);
      this.addCeilSlab(0, hole + (P - hole) / 2, hole * 2, P - hole, H, slabMat, true);
    } else {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(P * 2, 1.4, P * 2), slabMat);
      slab.position.y = H; slab.receiveShadow = true; this.scene.add(slab);
    }

    if (warm) {
      // The signature of ref 1: cantilevered boxes stepping down at varied
      // depths, each underside washed by a warm recessed light.
      const boxMat = new THREE.MeshStandardMaterial({ color: 0xc59a80, roughness: 0.92, metalness: 0.04, map: this.aggregateTex });
      const glowMat = new THREE.MeshStandardMaterial({ color: 0x2a170e, emissive: 0xffc290, emissiveIntensity: 1.1 });
      for (let i = 0; i < 16; i++) {
        const x = (rng() - 0.5) * (P * 2 - 40);
        const z = (rng() - 0.5) * (P * 2 - 40);
        const w = 12 + rng() * 22, d = 8 + rng() * 16, drop = 3 + rng() * 6.5;
        const bx = new THREE.Mesh(new THREE.BoxGeometry(w, drop, d), boxMat);
        bx.position.set(x, H - drop / 2, z); bx.castShadow = shadow; bx.receiveShadow = true;
        this.scene.add(bx);
        // warm glow plane on the underside
        const glow = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.8, d * 0.8), glowMat);
        glow.rotation.x = Math.PI / 2; glow.position.set(x, H - drop - 0.05, z);
        this.scene.add(glow);
      }
      // Recessed square downlights.
      for (let i = 0; i < 8; i++) {
        const x = (rng() - 0.5) * (P * 2 - 30), z = (rng() - 0.5) * (P * 2 - 30);
        const lamp = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4),
          new THREE.MeshBasicMaterial({ color: 0xffe2be }));
        lamp.rotation.x = Math.PI / 2; lamp.position.set(x, H - 0.75, z); this.scene.add(lamp);
        if (i < 4) { const pl = new THREE.PointLight(0xffd9ae, 5, 44, 1.9); pl.position.set(x, H - 4, z); this.scene.add(pl); }
      }
    } else {
      // Ref 2: a deep, dark structural grid — long crossing beams.
      const beamMat = new THREE.MeshStandardMaterial({ color: 0x0c0d10, roughness: 0.9, metalness: 0.15 });
      for (let i = -4; i <= 4; i++) {
        const b1 = new THREE.Mesh(new THREE.BoxGeometry(P * 2, 3.4, 2.2), beamMat);
        b1.position.set(0, H - 1.8, i * (P / 4.5)); this.scene.add(b1);
        const b2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.4, P * 2), beamMat);
        b2.position.set(i * (P / 4.5), H - 1.8, 0); this.scene.add(b2);
      }
    }
  }

  private addCeilSlab(x: number, z: number, w: number, d: number, H: number, mat: THREE.Material, _rot = false) {
    const slab = new THREE.Mesh(new THREE.BoxGeometry(Math.abs(w), 1.4, Math.abs(d)), mat);
    slab.position.set(x, H, z); slab.receiveShadow = true; this.scene.add(slab);
  }

  /** Red carpet — the chromatic anchor of refs 1 & 2. */
  private buildCarpet(kind: 'run' | 'zone', rng: () => number) {
    const carpetMat = new THREE.MeshStandardMaterial({ color: kind === 'run' ? 0xa8341f : 0x8e2a1a, roughness: 0.98, metalness: 0 });
    if (kind === 'run') {
      // A grand carpet run with broad carpeted steps rising to the south (ref 1).
      const run = new THREE.Mesh(new THREE.PlaneGeometry(24, 70), carpetMat);
      run.rotation.x = -Math.PI / 2; run.position.set(0, 0.05, 20); run.receiveShadow = true;
      this.scene.add(run);
      for (let i = 0; i < 9; i++) {
        const step = new THREE.Mesh(new THREE.BoxGeometry(24, 0.42, 1.3), carpetMat);
        step.position.set(0, 0.21 + i * 0.42, 58 + i * 1.25);
        step.castShadow = true; step.receiveShadow = true; this.scene.add(step);
        this.colliders.push({ box: new THREE.Box3().setFromObject(step), material: 'concrete' });
      }
      // Cream lounge chairs at the foot of the stair (ref 1's furniture).
      const cream = new THREE.MeshStandardMaterial({ color: 0xd8c9ae, roughness: 0.9 });
      for (let i = 0; i < 5; i++) {
        const cx = -8 + rng() * 16, cz = 28 + rng() * 18;
        const seat = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.7, 1.9), cream);
        seat.position.set(cx, 0.35, cz); seat.rotation.y = rng() * Math.PI;
        seat.castShadow = true; this.scene.add(seat);
        const back = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.9, 0.35), cream);
        back.position.set(cx, 1.05, cz - 0.8); back.rotation.y = seat.rotation.y; this.scene.add(back);
        this.colliders.push({ box: new THREE.Box3().setFromObject(seat), material: 'concrete' });
      }
    } else {
      // Ref 2: a sharply-bounded red lobby island in the dark, with furniture.
      const zone = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), carpetMat);
      zone.rotation.x = -Math.PI / 2; zone.position.set(0, 0.05, 34); zone.receiveShadow = true;
      this.scene.add(zone);
      const dark = new THREE.MeshStandardMaterial({ color: 0x101013, roughness: 0.5, metalness: 0.4 });
      for (let i = 0; i < 7; i++) {
        const w = 1 + rng() * 1.6, h = 0.5 + rng() * 0.5, d = 0.8 + rng() * 1.2;
        const f = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), dark);
        f.position.set(-10 + rng() * 20, h / 2, 24 + rng() * 20);
        f.rotation.y = rng() * Math.PI; f.castShadow = true; this.scene.add(f);
        this.colliders.push({ box: new THREE.Box3().setFromObject(f), material: 'metal' });
      }
      // Planter with broad leaves.
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x2e4a2c, roughness: 1, flatShading: true });
      const pot = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 4), this.materials.concrete);
      pot.position.set(0, 0.5, 26); this.scene.add(pot);
      this.colliders.push({ box: new THREE.Box3().setFromObject(pot), material: 'concrete' });
      for (let i = 0; i < 8; i++) {
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.5, 2.6, 5), leafMat);
        leaf.position.set((rng() - 0.5) * 2.4, 2 + rng(), 26 + (rng() - 0.5) * 2.4);
        leaf.rotation.set((rng() - 0.5) * 0.9, rng() * Math.PI, (rng() - 0.5) * 0.9);
        this.scene.add(leaf);
      }
    }
  }

  /** Ref 2's hero: a monumental shaft of white light around the central core,
   *  pouring through the ceiling opening — plus drifting dust motes. */
  private buildLightWell() {
    // Blazing ceiling aperture.
    const aperture = new THREE.Mesh(
      new THREE.PlaneGeometry(22, 22),
      new THREE.MeshBasicMaterial({ color: 0xf4f6f8, side: THREE.DoubleSide, fog: false }),
    );
    aperture.rotation.x = Math.PI / 2; aperture.position.set(0, 29.2, 0);
    this.scene.add(aperture);

    // Volumetric-ish shaft: nested additive translucent boxes, fading outward.
    for (let i = 0; i < 3; i++) {
      const s = 20 - i * 4;
      const shaft = new THREE.Mesh(
        new THREE.BoxGeometry(s, 29, s),
        new THREE.MeshBasicMaterial({
          color: 0xdfe8f2, transparent: true, opacity: 0.05 + i * 0.02,
          blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide, fog: false,
        }),
      );
      shaft.position.set(0, 14.5, 0);
      this.scene.add(shaft);
    }

    // The hard downlight + a bright floor pool.
    const spot = new THREE.SpotLight(0xf2f5f9, 14, 90, Math.PI / 5.5, 0.35, 1.2);
    spot.position.set(0, 30, 0); spot.target.position.set(0, 0, 0);
    this.scene.add(spot); this.scene.add(spot.target);
    const pool = new THREE.Mesh(new THREE.CircleGeometry(15, 48),
      new THREE.MeshBasicMaterial({ color: 0xcfdbe8, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
    pool.rotation.x = -Math.PI / 2; pool.position.y = 0.06; this.scene.add(pool);

    // Gold "elevator door" panel glowing on the core (ref 2's brass shrine).
    const door = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 12),
      new THREE.MeshStandardMaterial({ color: 0x231a08, emissive: 0xc2a44e, emissiveIntensity: 0.9, roughness: 0.3, metalness: 0.9 }));
    door.position.set(0, 7, 2.56); this.scene.add(door);

    // Dust motes drifting in the shaft.
    const N = 120, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = Math.random() * 28;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.motes = new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0xe8eef4, size: 0.06, transparent: true, opacity: 0.6, depthWrite: false,
    }));
    this.scene.add(this.motes);
  }

  /** Ref 3's hero: giant redwoods rising through the atrium mist. */
  private buildRedwoods(rng: () => number, shadow: boolean) {
    const barkMat = new THREE.MeshStandardMaterial({ color: 0x6b4632, roughness: 1, map: this.aggregateTex });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2e4c33, roughness: 1, flatShading: true });
    const spots: [number, number][] = [[-34, -20], [30, -38], [-18, 42], [44, 26], [-52, 14], [12, -58]];
    for (const [x, z] of spots) {
      const h = 34 + rng() * 12;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.6, h, 12), barkMat);
      trunk.position.set(x, h / 2, z);
      trunk.rotation.z = (rng() - 0.5) * 0.04;
      trunk.castShadow = shadow; trunk.receiveShadow = true;
      this.scene.add(trunk); this.raycastTargets.push(trunk);
      this.colliders.push({
        box: new THREE.Box3(new THREE.Vector3(x - 2.4, 0, z - 2.4), new THREE.Vector3(x + 2.4, h, z + 2.4)),
        material: 'concrete',
      });
      // Root flare.
      const flare = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 4.2, 2.2, 10), barkMat);
      flare.position.set(x, 1.1, z); this.scene.add(flare);
      // Foliage: flattened dark clumps from 55% height to the crown.
      const clumps = 7 + Math.floor(rng() * 4);
      for (let cN = 0; cN < clumps; cN++) {
        const f = 0.55 + (cN / clumps) * 0.5;
        const s = (6.5 - f * 3.5) * (0.8 + rng() * 0.4);
        const clump = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 1), leafMat);
        const aa = rng() * Math.PI * 2, rr = 1 + rng() * 3;
        clump.position.set(x + Math.cos(aa) * rr, h * f, z + Math.sin(aa) * rr);
        clump.scale.y = 0.42 + rng() * 0.2;
        clump.castShadow = shadow;
        this.scene.add(clump);
      }
    }
  }

  /** Ref 4's hero: colossal shattered monoliths hovering in the golden sky,
   *  trailing debris — they bob almost imperceptibly (see update()). */
  private buildMonoliths(rng: () => number) {
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x4a4550, roughness: 0.92, metalness: 0.1, map: this.aggregateTex });
    const glowMat = new THREE.MeshStandardMaterial({ color: 0x3a2c14, emissive: 0xffca7a, emissiveIntensity: 1.5, roughness: 0.6 });
    for (let i = 0; i < 7; i++) {
      const g = new THREE.Group();
      const a = (i / 7) * Math.PI * 2 + rng() * 0.5;
      const r = 170 + rng() * 220;
      const w = 20 + rng() * 16, h = 100 + rng() * 90, d = 10 + rng() * 10;
      const y = 40 + rng() * 90;
      const slab = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), rockMat);
      g.add(slab);
      // Sunlit face — a gold-glowing panel on one side (ref 4's lit column).
      const lit = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.92, h * 0.6), glowMat);
      lit.position.set(0, h * 0.08, d / 2 + 0.2); g.add(lit);
      // Crumbling base: clustered small chunks below + drifting shards.
      for (let cN = 0; cN < 9; cN++) {
        const cs = 1.2 + rng() * 4;
        const chunk = new THREE.Mesh(new THREE.BoxGeometry(cs, cs * (0.5 + rng()), cs * 0.8), rockMat);
        chunk.position.set((rng() - 0.5) * w, -h / 2 - rng() * 22, (rng() - 0.5) * d * 1.6);
        chunk.rotation.set(rng() * 3, rng() * 3, rng() * 3);
        g.add(chunk);
      }
      g.position.set(Math.cos(a) * r, y + h / 2, Math.sin(a) * r);
      g.rotation.set((rng() - 0.5) * 0.14, rng() * Math.PI, (rng() - 0.5) * 0.1);
      this.scene.add(g);
      this.monolithRefs.push({ mesh: g, baseY: g.position.y, phase: rng() * Math.PI * 2 });
    }
  }

  /** Ref 5's hero: an ancient colossal wall breaking out of a mossy berm. */
  private buildGreatWall(rng: () => number, shadow: boolean) {
    const ancientMat = new THREE.MeshStandardMaterial({ color: 0x7f8276, roughness: 0.98, metalness: 0.04, map: this.aggregateTex });
    const mossMat = new THREE.MeshStandardMaterial({ color: 0x3f5427, roughness: 1, flatShading: true });
    const a = rng() * Math.PI * 2;
    const cx = Math.cos(a) * 200, cz = Math.sin(a) * 200;

    // The green berm the wall erupts from.
    const berm = new THREE.Mesh(new THREE.SphereGeometry(110, 12, 8), mossMat);
    berm.position.set(cx, -68, cz); berm.scale.y = 0.75; this.scene.add(berm);

    // The wall: a sheer weathered slab + sloping buttresses + a distant twin.
    const wall = new THREE.Mesh(new THREE.BoxGeometry(150, 95, 20), ancientMat);
    wall.position.set(cx, 60, cz); wall.rotation.y = a + Math.PI / 2;
    wall.castShadow = shadow; this.scene.add(wall);
    for (const s of [-1, 1]) {
      const butt = new THREE.Mesh(new THREE.BoxGeometry(26, 80, 30), ancientMat);
      butt.position.set(cx + Math.cos(a + Math.PI / 2) * s * 66, 34, cz + Math.sin(a + Math.PI / 2) * s * 66);
      butt.rotation.y = a + Math.PI / 2; butt.rotation.z = s * 0.18; this.scene.add(butt);
    }
    const twin = new THREE.Mesh(new THREE.BoxGeometry(60, 130, 40), ancientMat);
    const ta = a + 0.5;
    twin.position.set(Math.cos(ta) * 400, 55, Math.sin(ta) * 400); this.scene.add(twin);

    // Moss creeping up the wall base.
    for (let i = 0; i < 10; i++) {
      const off = (rng() - 0.5) * 130;
      const moss = new THREE.Mesh(new THREE.IcosahedronGeometry(7 + rng() * 9, 1), mossMat);
      moss.position.set(
        cx + Math.cos(a + Math.PI / 2) * off - Math.cos(a) * 8,
        6 + rng() * 16,
        cz + Math.sin(a + Math.PI / 2) * off - Math.sin(a) * 8,
      );
      moss.scale.set(1, 0.5 + rng() * 0.4, 0.5); this.scene.add(moss);
    }

    // Birds circling the wall (tiny dark points, static — read as distance).
    const N = 14, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = cx + (rng() - 0.5) * 120;
      pos[i * 3 + 1] = 95 + rng() * 30;
      pos[i * 3 + 2] = cz + (rng() - 0.5) * 120;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x14171a, size: 1.1 })));
  }

  /* -------------------------------- update ------------------------------- */

  update(dt: number, elapsed: number, camPos: THREE.Vector3) {
    // Scroll the waterfall.
    if (this.waterfallTex) this.waterfallTex.offset.y -= dt * 0.9;

    if (this.keyLight) {
      // Keep the shadow frustum centred on the player (all themes).
      this.keyLight.target.position.set(camPos.x, 0, camPos.z);
      this.keyLight.position.set(camPos.x + 60, 90, camPos.z + 30);
    }
    // Overcast-dusk cycle — only on themes with a moving sky.
    if (this.cfg.dayCycle && this.ambient && this.keyLight) {
      const cycle = (Math.sin(elapsed * 0.0035) + 1) / 2; // 0 night .. 1 dusk
      this.ambient.intensity = this.cfg.ambI * (0.9 + cycle * 0.3);
      this.keyLight.intensity = this.cfg.keyI * (0.85 + cycle * 0.45);
    }

    // Floating monoliths bob almost imperceptibly — enough to feel alive.
    for (const m of this.monolithRefs) {
      m.mesh.position.y = m.baseY + Math.sin(elapsed * 0.1 + m.phase) * 2.2;
      m.mesh.rotation.y += dt * 0.004;
    }

    // Dust motes drift slowly upward through the light shaft.
    if (this.motes) {
      const pos = this.motes.geometry.getAttribute('position') as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      for (let i = 0; i < arr.length / 3; i++) {
        arr[i * 3 + 1] += dt * (0.12 + (i % 5) * 0.04);
        if (arr[i * 3 + 1] > 28) arr[i * 3 + 1] = 0;
      }
      pos.needsUpdate = true;
    }

    // Rain fall + wrap; follow the camera so it always surrounds the player.
    if (this.rain && this.rainVel) {
      const pos = (this.rain.geometry.getAttribute('position') as THREE.BufferAttribute);
      const arr = pos.array as Float32Array;
      for (let i = 0; i < this.rainVel.length; i++) {
        arr[i * 3 + 1] -= this.rainVel[i] * dt;
        if (arr[i * 3 + 1] < 0) {
          arr[i * 3 + 1] = 55 + Math.random() * 10;
          arr[i * 3] = camPos.x + (Math.random() - 0.5) * ARENA_HALF * 2;
          arr[i * 3 + 2] = camPos.z + (Math.random() - 0.5) * ARENA_HALF * 2;
        }
      }
      pos.needsUpdate = true;
    }

    // Occasional lightning: brief ambient spike (stormy themes only).
    if (!this.cfg.lightning) return;
    this.lightningTimer -= dt;
    if (this.lightningTimer <= 0) {
      this.lightningTimer = 6 + Math.random() * 12;
      if (this.ambient) {
        const base = this.ambient.intensity;
        this.ambient.intensity = 2.4;
        setTimeout(() => { if (this.ambient) this.ambient.intensity = base; }, 80);
        setTimeout(() => { if (this.ambient) this.ambient.intensity = 2.0; }, 160);
        setTimeout(() => { if (this.ambient) this.ambient.intensity = base; }, 240);
      }
    }
  }
}
