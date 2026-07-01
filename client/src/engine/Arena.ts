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

export const ARENA_HALF = 96;

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

export class Arena {
  readonly colliders: Collider[] = [];
  readonly spawnPoints: THREE.Vector3[] = [];
  readonly raycastTargets: THREE.Object3D[] = [];

  private scene: THREE.Scene;
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
  private floorTex: THREE.Texture;

  constructor(engine: Engine, seed: number) {
    this.scene = engine.scene;
    const rng = mulberry32(seed || 1);

    /* ---- procedural textures + shared PBR materials ---- */
    this.aggregateTex = makeAggregateTexture();
    this.floorTex = makeFloorTexture();
    this.materials = {
      concrete: new THREE.MeshStandardMaterial({ color: 0x9a948a, roughness: 0.94, metalness: 0.05, map: this.aggregateTex }),
      metal: new THREE.MeshStandardMaterial({ color: 0x565049, roughness: 0.5, metalness: 0.8 }),
      glass: new THREE.MeshStandardMaterial({ color: 0x1a2220, roughness: 0.18, metalness: 0.2, transparent: true, opacity: 0.55 }),
    };
    this.glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x141b1c, roughness: 0.1, metalness: 0.0, transmission: 0.5,
      transparent: true, opacity: 0.6, reflectivity: 0.5, ior: 1.4,
    });
    // Ember, oxide-red, muted gold — the only chromatic notes in a grey world.
    this.neonMats = [0xd9552b, 0xb3402f, 0xc2a44e].map((c) => new THREE.MeshBasicMaterial({ color: c }));

    this.buildGround();
    this.buildPerimeter(engine.shadowsEnabled);
    this.buildCity(rng, engine.shadowsEnabled);
    this.buildCover(rng, engine.shadowsEnabled);
    this.buildSkyBridges(rng);
    this.buildPillars(rng, engine.shadowsEnabled);
    this.buildLighting(engine);
    this.buildCofferedCeiling(engine.shadowsEnabled);
    this.buildStaircases(rng);
    this.buildDebris(rng);
    this.buildRooms(rng);
    this.buildGlowStrips(rng);
    this.buildOculus();
    this.buildSignage(rng);
    this.buildRain();

    // Scatter PvP spawn points around the ring.
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const r = 40 + rng() * 40;
      this.spawnPoints.push(new THREE.Vector3(Math.cos(a) * r, 1.7, Math.sin(a) * r));
    }

    // Ambient soundscape + storytelling props.
    this.buildProps(rng, engine.shadowsEnabled);

    this.ambient = this.ambientRef!;
    this.keyLight = this.keyRef!;
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
    const mat = new THREE.MeshStandardMaterial({ color: 0xccc6ba, map: this.floorTex, roughness: 0.6, metalness: 0.14 });
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
    const H = 22, T = 2;
    const spans: [number, number, number, number][] = [
      [ARENA_HALF * 2, T, 0, -ARENA_HALF],
      [ARENA_HALF * 2, T, 0, ARENA_HALF],
      [T, ARENA_HALF * 2, -ARENA_HALF, 0],
      [T, ARENA_HALF * 2, ARENA_HALF, 0],
    ];
    for (const [w, d, x, z] of spans) {
      this.addBox(w, H, d, x, H / 2, z, 'concrete', { shadow });
      // Neon top trim for bloom + boundary legibility.
      const trim = new THREE.Mesh(
        new THREE.BoxGeometry(w, 0.4, d),
        this.neonMats[0],
      );
      trim.position.set(x, H, z);
      this.scene.add(trim);
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

  /* Coffered ceiling with a central square light-well (reference boards). */
  private buildCofferedCeiling(shadow: boolean) {
    const y = 22, half = 34, hole = 11; // hole = half-width of the central opening
    const mat = this.materials.concrete;
    // Top slab as a frame of four beams around the central light-well.
    const frame: [number, number, number, number][] = [
      [half * 2, half - hole, 0, (hole + half) / 2],
      [half * 2, half - hole, 0, -(hole + half) / 2],
      [half - hole, hole * 2, (hole + half) / 2, 0],
      [half - hole, hole * 2, -(hole + half) / 2, 0],
    ];
    for (const [w, d, x, z] of frame) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(w, 1.6, d), mat);
      s.position.set(x, y + 0.8, z); s.castShadow = shadow; s.receiveShadow = true; this.scene.add(s);
    }
    // Waffle beams under the frame (skip the light-well) → coffers.
    const n = 8, cell = (half * 2) / n, beamH = 2.6;
    for (let i = 0; i <= n; i++) {
      const p = -half + i * cell;
      // X-spanning beam at z=p, split around the hole
      if (Math.abs(p) >= hole) {
        const bx = new THREE.Mesh(new THREE.BoxGeometry(half * 2, beamH, 0.9), mat);
        bx.position.set(0, y - beamH / 2, p); bx.castShadow = shadow; bx.receiveShadow = true; this.scene.add(bx);
        const bz = new THREE.Mesh(new THREE.BoxGeometry(0.9, beamH, half * 2), mat);
        bz.position.set(p, y - beamH / 2, 0); bz.castShadow = shadow; bz.receiveShadow = true; this.scene.add(bz);
      } else {
        // near the hole, only the outer segments
        for (const seg of [1, -1]) {
          const len = half - hole;
          const bx = new THREE.Mesh(new THREE.BoxGeometry(len, beamH, 0.9), mat);
          bx.position.set(seg * (hole + len / 2), y - beamH / 2, p); bx.castShadow = shadow; this.scene.add(bx);
          const bz = new THREE.Mesh(new THREE.BoxGeometry(0.9, beamH, len), mat);
          bz.position.set(p, y - beamH / 2, seg * (hole + len / 2)); bz.castShadow = shadow; this.scene.add(bz);
        }
      }
    }

    // Recessed warm downlights in a ring of coffers — lifts the atrium and adds
    // the ceiling-light detail from the reference interiors.
    const lamps: [number, number][] = [
      [-22, -22], [22, -22], [-22, 22], [22, 22],
      [0, -26], [0, 26], [-26, 0], [26, 0],
    ];
    lamps.forEach(([lx, lz], i) => {
      // Every lamp gets an emissive disc (free glow via bloom); only a few carry
      // an actual dynamic light, to keep the light count cheap.
      const bulb = new THREE.Mesh(new THREE.CircleGeometry(0.9, 16), new THREE.MeshBasicMaterial({ color: 0xffdca6 }));
      bulb.rotation.x = Math.PI / 2; bulb.position.set(lx, y - beamH - 0.15, lz); this.scene.add(bulb);
      if (i % 2 === 0) {
        const pl = new THREE.PointLight(0xffdca6, 3.6, 46, 2); pl.position.set(lx, y - beamH - 0.6, lz); this.scene.add(pl);
      }
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
    // Cool sky bounce lifting the concrete so architecture + floor detail read.
    const ambient = new THREE.HemisphereLight(0x4a525e, 0x1a150f, 0.8);
    this.scene.add(ambient);
    this.ambientRef = ambient;

    const key = new THREE.DirectionalLight(0xc2ccd8, 1.05);
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

    // Warm fill from the opposite side (no shadow → cheap) so the coffered
    // ceiling and towers don't cast the plaza into pure black.
    const fill = new THREE.DirectionalLight(0xc4b09a, 0.42);
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

  /* -------------------------------- update ------------------------------- */

  update(dt: number, elapsed: number, camPos: THREE.Vector3) {
    // Day→night cycle over ~5 minutes: swing exposure + sky tint + key colour.
    const cycle = (Math.sin(elapsed * 0.0035) + 1) / 2; // 0 night .. 1 dusk
    if (this.ambient) this.ambient.intensity = 0.72 + cycle * 0.34;
    if (this.keyLight) {
      this.keyLight.intensity = 0.62 + cycle * 0.6;
      this.keyLight.color.setHSL(0.6 - cycle * 0.06, 0.35, 0.55 + cycle * 0.08);
      // Keep the shadow frustum centred on the player.
      this.keyLight.target.position.set(camPos.x, 0, camPos.z);
      this.keyLight.position.set(camPos.x + 60, 90, camPos.z + 30);
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

    // Occasional lightning: brief ambient spike.
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
