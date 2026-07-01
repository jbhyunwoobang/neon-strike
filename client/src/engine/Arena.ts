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

  constructor(engine: Engine, seed: number) {
    this.scene = engine.scene;
    const rng = mulberry32(seed || 1);

    /* ---- shared PBR materials — warm raw concrete, gunmetal, dark glass ---- */
    this.materials = {
      concrete: new THREE.MeshStandardMaterial({ color: 0x8a857b, roughness: 0.96, metalness: 0.04 }),
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
    // Wet polished concrete — dark, slightly metallic so ember light streaks across it.
    const mat = new THREE.MeshStandardMaterial({ color: 0x0e0c0b, roughness: 0.42, metalness: 0.35 });
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

    // The atrium roof slab those pillars carry.
    this.addBox(60, 1.5, 60, 0, 20.5, 0, 'concrete', { shadow, collide: false });
  }

  private buildProps(rng: () => number, shadow: boolean) {
    // Environmental storytelling: emergency lights, barricades, drone remains.
    for (let i = 0; i < 8; i++) {
      const a = rng() * Math.PI * 2, r = 15 + rng() * 60;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      const light = new THREE.PointLight(0xff4a1e, 7, 16, 2);
      light.position.set(x, 3, z);
      this.scene.add(light);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff6a2e }));
      bulb.position.copy(light.position);
      this.scene.add(bulb);
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
    // Cold, weak sky bounce — the concrete is lit mostly by the embers below.
    const ambient = new THREE.HemisphereLight(0x2b3138, 0x0a0806, 0.32);
    this.scene.add(ambient);
    this.ambientRef = ambient;

    const key = new THREE.DirectionalLight(0xaeb8c4, 0.55);
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
      for (let i = 0; i < 2; i++) {
        const t = i === 0 ? -0.3 : 0.3;
        const lx = w > d ? x + t * w : x;
        const lz = d > w ? z + t * d : z;
        const pl = new THREE.PointLight(0xff5a24, 5, 30, 2);
        pl.position.set(lx, 1.4, lz);
        this.scene.add(pl);
      }
    }
    // A few interior floor cuts of ember light near the plaza rim.
    for (let i = 0; i < 3; i++) {
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
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(20, 48),
      new THREE.MeshBasicMaterial({ color: 0xdfe6ea, side: THREE.DoubleSide }),
    );
    disc.rotation.x = Math.PI / 2; disc.position.set(0, 42, 0);
    this.scene.add(disc);
    const spot = new THREE.SpotLight(0xcfe0ff, 3.4, 130, Math.PI / 5, 0.55, 1.1);
    spot.position.set(0, 44, 0);
    spot.target.position.set(0, 0, 0);
    this.scene.add(spot);
    this.scene.add(spot.target);
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
    if (this.ambient) this.ambient.intensity = 0.17 + cycle * 0.24;
    if (this.keyLight) {
      this.keyLight.intensity = 0.3 + cycle * 0.5;
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
