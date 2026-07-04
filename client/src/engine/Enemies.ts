/**
 * Enemies.ts — Enemy roster, AI and rendering.
 *
 * Two operating modes share one manager:
 *   - LOCAL (single-player): full client-side simulation. Each enemy runs a
 *     small state machine (approach → strafe/flank → attack → reposition) with
 *     line-of-sight tests against the arena; ranged types shoot hitscan at the
 *     player, melee types rush. Damage, death, score and headshots are resolved
 *     here.
 *   - NET (co-op): the server owns positions/HP. The manager reconciles the
 *     server's EnemyState list (spawn/update/despawn) and interpolates. Client
 *     hits are reported upward for the server to adjudicate.
 *
 * Every enemy mesh carries `userData.enemyId` + `userData.headY` so the weapon
 * raycaster can register body/head hits.
 */

import * as THREE from 'three';
import type { Collider } from './Arena';
import type { Effects } from './Effects';
import type { Audio } from './Audio';

export interface EnemyType {
  hp: number; speed: number; damage: number; range: number; ranged: boolean;
  hoverY?: number;    // flying units: cruise height (drone 4, wraith low glide)
  bomber?: boolean;   // lobs arcing bombs instead of hitscan fire
  color: number; emissive: number; size: number; score: number; flying: boolean;
  fireInterval: number;
}

// Bone-white ceramic bodies with oxide-red / gunmetal accents — the biomech
// homunculi of the mood board. Dim ember "eye" emission, never neon.
// HP anchors a grunt at 100 = an unarmoured PUBG player, so the rebalanced
// weapon table produces reference-game TTKs: AR = 3 body shots (~0.28s),
// bolt sniper deletes a grunt, shield/heavy soak like armoured targets.
export const ENEMY_TYPES: Record<string, EnemyType> = {
  grunt:   { hp: 100, speed: 3.6, damage: 12, range: 2.2,  ranged: false, color: 0xccc3af, emissive: 0x5a1c0c, size: 1.0, score: 100, flying: false, fireInterval: 0.8 },
  soldier: { hp: 150, speed: 3.0, damage: 11, range: 34,   ranged: true,  color: 0xa8482c, emissive: 0x2a0d05, size: 1.0, score: 150, flying: false, fireInterval: 1.1 },
  shield:  { hp: 280, speed: 2.2, damage: 16, range: 2.4,  ranged: false, color: 0x55635d, emissive: 0x141f1c, size: 1.15, score: 200, flying: false, fireInterval: 1.0 },
  drone:   { hp: 70,  speed: 5.0, damage: 8,  range: 40,   ranged: true,  color: 0xb4ae9f, emissive: 0x4a1e0a, size: 0.7, score: 180, flying: true,  fireInterval: 1.3 },
  heavy:   { hp: 450, speed: 1.7, damage: 22, range: 30,   ranged: true,  color: 0x5e1e1a, emissive: 0x1a0504, size: 1.7, score: 300, flying: false, fireInterval: 1.4 },
  boss:    { hp: 2600, speed: 2.0, damage: 30, range: 42,  ranged: true,  color: 0xc2a44e, emissive: 0x2a1d07, size: 3.0, score: 2000, flying: false, fireInterval: 0.7 },
  // New units for the concept-board bestiary:
  hound:   { hp: 80,  speed: 6.4, damage: 14, range: 2.0,  ranged: false, color: 0x3f5a5c, emissive: 0x102022, size: 1.0, score: 140, flying: false, fireInterval: 0.7 },
  wraith:  { hp: 130, speed: 2.6, damage: 10, range: 36,   ranged: true,  color: 0xb7b0a0, emissive: 0x3a2c0c, size: 1.05, score: 220, flying: true, hoverY: 2.4, fireInterval: 1.2 },
  bomber:  { hp: 120, speed: 2.4, damage: 26, range: 30,   ranged: true,  color: 0x7a5a3a, emissive: 0x2a1505, size: 1.05, score: 250, flying: false, bomber: true, fireInterval: 2.6 },
};

interface Ctx {
  scene: THREE.Scene;
  colliders: Collider[];
  effects: Effects;
  audio: Audio;
  getPlayerPos: () => THREE.Vector3;
  onPlayerDamage: (dmg: number) => void;
  onKill: (score: number, type: string, headshot: boolean) => void;
  onRagdoll?: (group: THREE.Object3D, hitDir: THREE.Vector3) => void;
  onBomb?: (from: THREE.Vector3, to: THREE.Vector3) => void;   // bomber lob
}

type AIState = 'approach' | 'strafe' | 'attack' | 'reposition';

/**
 * Per-type enemy models built from complex rounded geometry — lathed robes
 * with cloth folds, capsule limbs with joint spheres, torus ribcages and
 * halos, sagging cable tubes, spiked shields and blades — keyed to the user's
 * concept boards (haloed floating shrouds, sword-and-board ceramic skeleton,
 * cable-hung homunculus boss, Ultron-heart drone, gaunt hound). Returns the
 * group + the body material (hurt flash) + head height (headshots).
 */
export function buildFigure(def: EnemyType, type = 'grunt'): { group: THREE.Group; bodyMat: THREE.MeshStandardMaterial; headY: number } {
  const g = new THREE.Group();
  const s = def.size;
  const BONE = 0xe7e0d2;

  const bodyMat = new THREE.MeshStandardMaterial({
    color: def.color, emissive: def.emissive, emissiveIntensity: 0.5, roughness: 0.9, metalness: 0.08, flatShading: true,
  });
  const boneMat = new THREE.MeshStandardMaterial({ color: BONE, emissive: def.color, emissiveIntensity: 0.22, roughness: 0.55, metalness: 0.05, flatShading: true });
  const rustMat = new THREE.MeshStandardMaterial({ color: 0x8a3b26, roughness: 0.85, metalness: 0.35 });
  const gunMat = new THREE.MeshStandardMaterial({ color: 0x3a3c42, roughness: 0.5, metalness: 0.75 });
  const haloMat = new THREE.MeshStandardMaterial({ color: 0xc2a44e, emissive: 0xc2a44e, emissiveIntensity: 0.8, roughness: 0.4, metalness: 0.8 });
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff6a2a });

  const add = (m: THREE.Mesh, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) => {
    m.position.set(x * s, y * s, z * s); m.rotation.set(rx, ry, rz);
    m.castShadow = true; m.receiveShadow = true; g.add(m); return m;
  };
  const cap = (r: number, len: number, m: THREE.Material) => new THREE.Mesh(new THREE.CapsuleGeometry(r * s, len * s, 4, 10), m);
  const sph = (r: number, m: THREE.Material, w = 10, h = 8) => new THREE.Mesh(new THREE.SphereGeometry(r * s, w, h), m);
  const torus = (r: number, t: number, m: THREE.Material, arc = Math.PI * 2) => new THREE.Mesh(new THREE.TorusGeometry(r * s, t * s, 8, 20, arc), m);
  /** Sagging cable tube through the given local points (Hohenheim dressing). */
  const cable = (pts: [number, number, number][], r = 0.02) => {
    const curve = new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => new THREE.Vector3(x * s, y * s, z * s)));
    const t = new THREE.Mesh(new THREE.TubeGeometry(curve, 14, r * s, 6), gunMat);
    t.castShadow = true; g.add(t); return t;
  };
  /** Skull with brow ridge, cheek sockets, jaw + ember eyes at local (0, y, forward). */
  const skullAt = (y: number, sc = 1) => {
    const skull = sph(0.2 * sc, boneMat, 10, 8);
    skull.scale.set(1, 1.2, 1.08); add(skull, 0, y, 0);
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.3 * s * sc, 0.05 * s * sc, 0.12 * s * sc), boneMat);
    add(brow, 0, y + 0.08 * sc, 0.12 * sc);
    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.16 * s * sc, 0.1 * s * sc, 0.16 * s * sc), boneMat);
    add(jaw, 0, y - 0.14 * sc, 0.04 * sc);
    for (const dx of [-0.075, 0.075]) add(sph(0.035 * sc, eyeMat, 6, 6), dx * sc, y + 0.02 * sc, 0.16 * sc);
    return y + 0.1 * sc;
  };
  /** Robed lower body — deep lathe folds (the shroud silhouette). */
  const robe = (h = 1.06, flare = 1) => {
    const prof: THREE.Vector2[] = [
      [0.06, 1.68], [0.28, 1.6], [0.34, 1.42], [0.31, 1.2], [0.42, 0.9],
      [0.4, 0.62], [0.52, 0.34], [0.5 * flare, 0.14], [0.62 * flare, 0],
    ].map(([r, y]) => new THREE.Vector2(r * s, y * s * h));
    const m = new THREE.Mesh(new THREE.LatheGeometry(prof, 12), bodyMat);
    m.castShadow = true; m.receiveShadow = true; g.add(m); return m;
  };
  /** Torus-arc ribcage over the chest. */
  const ribs = (y: number, sc = 1) => {
    for (let i = 0; i < 3; i++) {
      const rib = torus((0.2 - i * 0.03) * sc, 0.018 * sc, boneMat, Math.PI * 1.3);
      add(rib, 0, y - i * 0.13 * sc, 0.06 * sc, Math.PI / 2 + 0.35, 0, Math.PI - Math.PI * 0.65);
    }
  };
  /** Capsule arm with shoulder + elbow joint spheres; returns nothing. */
  const arm = (side: number, y: number, drop = 0.5, out = 0.34) => {
    add(sph(0.075, bodyMat), side * out, y, 0);                                 // shoulder ball
    const up = cap(0.045, 0.34, bodyMat);
    add(up, side * (out + 0.05), y - 0.22, 0.02, 0, 0, side * 0.35);
    add(sph(0.055, boneMat, 8, 6), side * (out + 0.1), y - 0.44, 0.03);          // elbow
    const lo = cap(0.035, 0.3, bodyMat);
    add(lo, side * (out + 0.12), y - 0.66, 0.05, 0.15, 0, side * drop * 0.25);
    add(sph(0.05, boneMat, 8, 6), side * (out + 0.14), y - 0.86, 0.08);          // hand
  };

  let headY = 1.74 * s;

  switch (type) {
    case 'hound': {
      // Gaunt greyhound-wraith (teal concept): arched spine, tucked waist,
      // long neck, muzzle skull, four jointed capsule legs, whip tail.
      const body = cap(0.2, 0.5, bodyMat); add(body, 0, 0.85, -0.1, Math.PI / 2 - 0.18, 0, 0);
      const chest = sph(0.26, bodyMat); chest.scale.set(0.9, 1, 1.15); add(chest, 0, 0.95, 0.3);
      // Spine ridges along the back.
      for (let i = 0; i < 5; i++) add(sph(0.05, boneMat, 6, 5), 0, 1.12 - i * 0.045, 0.16 - i * 0.16);
      // Neck arc up + skull muzzle.
      const neck = cap(0.09, 0.34, bodyMat); add(neck, 0, 1.22, 0.5, 0.9, 0, 0);
      const head = sph(0.13, boneMat); head.scale.set(0.8, 0.9, 1.7); add(head, 0, 1.42, 0.72);
      const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.1 * s, 0.05 * s, 0.3 * s), boneMat);
      add(jaw, 0, 1.33, 0.74, 0.2, 0, 0);
      for (const dx of [-0.05, 0.05]) add(sph(0.028, eyeMat, 6, 6), dx, 1.46, 0.82);
      for (const dx of [-0.06, 0.06]) add(new THREE.Mesh(new THREE.ConeGeometry(0.03 * s, 0.12 * s, 5), boneMat), dx, 1.52, 0.62, -0.5, 0, dx * 6);
      // Legs: front straight, rear angled (capsules + joint balls + paw).
      const leg = (x: number, z: number, rear: boolean) => {
        add(sph(0.07, bodyMat, 8, 6), x, rear ? 0.85 : 0.9, z);
        const up = cap(0.045, 0.3, bodyMat); add(up, x, 0.62, z + (rear ? 0.06 : 0), rear ? 0.35 : 0.05, 0, 0);
        add(sph(0.05, boneMat, 6, 5), x, 0.42, z + (rear ? 0.12 : 0.01));
        const lo = cap(0.03, 0.32, bodyMat); add(lo, x, 0.2, z + (rear ? 0.08 : 0.01), rear ? -0.15 : 0, 0, 0);
        add(sph(0.045, boneMat, 6, 5), x, 0.04, z + (rear ? 0.04 : 0.02));
      };
      leg(-0.14, 0.42, false); leg(0.14, 0.42, false); leg(-0.15, -0.42, true); leg(0.15, -0.42, true);
      // Whip tail — torus arc curling down.
      const tail = torus(0.22, 0.02, bodyMat, Math.PI * 1.2); add(tail, 0, 0.85, -0.62, 0.4, Math.PI / 2, 0);
      headY = 1.35 * s;
      break;
    }
    case 'drone': {
      // Ultron-heart: spherical core, armour ring, red iris stack, side pod,
      // antennas + trailing sagging cables.
      const core = sph(0.32, gunMat, 14, 12); add(core, 0, 0, 0);
      const ring = torus(0.34, 0.05, bodyMat); add(ring, 0, 0, 0, 0.35, 0.4, 0);
      const collar = torus(0.2, 0.04, rustMat); add(collar, 0, 0.28, -0.05, 1.2, 0, 0);
      // Red iris: emissive lens + rim rings.
      add(sph(0.11, new THREE.MeshBasicMaterial({ color: 0xd02a1e }), 10, 8), 0, 0.02, 0.3);
      const iris = torus(0.14, 0.025, gunMat); add(iris, 0, 0.02, 0.32, 0, 0, 0);
      const iris2 = torus(0.19, 0.02, boneMat); add(iris2, 0, 0.02, 0.3, 0, 0, 0);
      // Side sensor pod.
      const pod = sph(0.12, gunMat, 10, 8); add(pod, -0.34, -0.16, 0.1);
      add(sph(0.05, new THREE.MeshBasicMaterial({ color: 0xd02a1e }), 6, 6), -0.4, -0.16, 0.19);
      // Trailing cables (the concept's hanging harness).
      cable([[0.1, -0.2, 0], [0.22, -0.6, 0.05], [0.14, -1.0, -0.08], [0.3, -1.3, 0]], 0.025);
      cable([[-0.1, -0.24, 0.05], [-0.16, -0.7, 0.12], [-0.05, -1.1, 0.05]], 0.02);
      cable([[0, -0.28, -0.1], [0.06, -0.5, -0.2], [0, -0.9, -0.12]], 0.016);
      cable([[0.05, 0.3, -0.05], [0.2, 0.55, -0.15], [0.1, 0.8, -0.05]], 0.018);   // top spray
      headY = 0.35 * s + 4;   // flying: head zone ~ core (bob handled by AI)
      break;
    }
    case 'wraith': {
      // Haloed floating shroud (triptych concept): tall robe tapering to a
      // point, gold halo, clasped arms, no legs — it levitates.
      robe(1.3, 0.55);
      // Tapered hem spike below the robe (the floating "tail").
      add(new THREE.Mesh(new THREE.ConeGeometry(0.3 * s, 0.7 * s, 9), bodyMat), 0, -0.28, 0, Math.PI, 0, 0);
      ribs(1.35);
      const shoulder = cap(0.09, 0.4, bodyMat); add(shoulder, 0, 1.6, 0, 0, 0, Math.PI / 2);
      headY = skullAt(1.92);
      const halo = torus(0.3, 0.02, haloMat); add(halo, 0, 2.06, -0.12, 0.15, 0, 0);
      arm(-1, 1.58, 0.9, 0.3); arm(1, 1.58, 0.9, 0.3);
      break;
    }
    case 'shield': {
      // Sword-and-board ceramic skeleton (white biomech concept): rusted
      // spiked tower shield on the left, blade on the right.
      robe(1.0);
      ribs(1.35);
      const shoulder = cap(0.1, 0.44, bodyMat); add(shoulder, 0, 1.6, 0, 0, 0, Math.PI / 2);
      headY = skullAt(1.9);
      arm(-1, 1.56); arm(1, 1.56);
      // Tower shield: rounded slab + rows of cone spikes + rim.
      const shield = new THREE.Mesh(new THREE.CylinderGeometry(0.5 * s, 0.44 * s, 0.1 * s, 14, 1, false, 0, Math.PI), rustMat);
      add(shield, -0.55, 1.05, 0.12, Math.PI / 2, 0, Math.PI / 2);
      for (let i = 0; i < 3; i++)
        add(new THREE.Mesh(new THREE.ConeGeometry(0.05 * s, 0.16 * s, 6), gunMat), -0.62, 0.75 + i * 0.32, 0.14, 0, 0, Math.PI / 2);
      // Rusted blade hanging from the right hand.
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05 * s, 0.85 * s, 0.12 * s), rustMat);
      add(blade, 0.5, 0.45, 0.1, 0, 0, 0.08);
      add(new THREE.Mesh(new THREE.ConeGeometry(0.06 * s, 0.18 * s, 4), rustMat), 0.5, -0.02, 0.1, Math.PI, 0, 0);
      break;
    }
    case 'bomber': {
      // Demolition unit: shroud frame + red boiler tank + bomb in hand.
      robe(1.0);
      ribs(1.35);
      const shoulder = cap(0.09, 0.4, bodyMat); add(shoulder, 0, 1.6, 0, 0, 0, Math.PI / 2);
      headY = skullAt(1.9);
      arm(-1, 1.56); arm(1, 1.56, 0.2);
      const tank = sph(0.3, rustMat, 12, 10); tank.scale.y = 1.3; add(tank, 0, 1.15, -0.34);
      const band = torus(0.31, 0.03, gunMat); add(band, 0, 1.15, -0.34, Math.PI / 2, 0, 0);
      add(sph(0.08, new THREE.MeshBasicMaterial({ color: 0xff7a2e }), 8, 6), 0, 1.5, -0.34); // valve glow
      add(sph(0.12, gunMat, 10, 8), 0.46, 0.68, 0.12);                                        // held bomb
      cable([[0.15, 1.4, -0.3], [0.4, 1.1, -0.1], [0.46, 0.8, 0.1]], 0.02);                   // feed hose
      break;
    }
    case 'heavy': {
      // Siege frame: broad lathed torso, slab pauldrons, twin mortar tubes,
      // column legs — a walking bunker.
      robe(1.05, 1.25);
      ribs(1.35, 1.2);
      const shoulder = cap(0.13, 0.6, bodyMat); add(shoulder, 0, 1.62, 0, 0, 0, Math.PI / 2);
      for (const side of [-1, 1]) {
        const pauldron = sph(0.22, rustMat, 10, 8); pauldron.scale.set(1, 0.7, 1);
        add(pauldron, side * 0.42, 1.7, 0);
        const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.07 * s, 0.09 * s, 0.5 * s, 10), gunMat);
        add(tube, side * 0.3, 1.9, -0.1, -0.5, 0, 0);
      }
      headY = skullAt(1.95, 0.9);
      arm(-1, 1.55, 0.4, 0.44); arm(1, 1.55, 0.4, 0.44);
      cable([[0.2, 1.5, -0.2], [0.35, 1.1, -0.3], [0.25, 0.7, -0.2]], 0.025);
      cable([[-0.2, 1.5, -0.2], [-0.3, 1.2, -0.32], [-0.2, 0.8, -0.2]], 0.025);
      break;
    }
    case 'boss': {
      // The hanging homunculus (Hohenheim/Paracelsus): elongated ceramic
      // torso, asymmetric shoulder ring, glowing core, long claw arms, a
      // storm of sagging cables, gold halo crown.
      robe(1.15, 0.8);
      ribs(1.4, 1.3);
      // Segmented spine stack above the robe.
      for (let i = 0; i < 3; i++) { const v = sph(0.12 - i * 0.015, boneMat, 8, 6); add(v, 0, 1.55 + i * 0.16, -0.04); }
      const shoulder = cap(0.11, 0.55, bodyMat); add(shoulder, 0, 1.78, 0, 0, 0, Math.PI / 2);
      // Asymmetric armour ring sweeping around one shoulder (concept 3).
      const ringArc = torus(0.5, 0.06, rustMat, Math.PI * 1.4); add(ringArc, 0.1, 1.7, 0, 0.4, 0.5, 0.4);
      headY = skullAt(2.1, 1.1);
      const halo = torus(0.42, 0.025, haloMat); add(halo, 0, 2.32, -0.15, 0.12, 0, 0);
      // Glowing chest core behind the ribs.
      add(sph(0.12, new THREE.MeshBasicMaterial({ color: 0xff4a7a }), 10, 8), 0, 1.32, 0.1);
      const coreRing = torus(0.16, 0.02, gunMat); add(coreRing, 0, 1.32, 0.14, 0, 0, 0);
      // Long claw arms reaching below the hem.
      for (const side of [-1, 1]) {
        arm(side, 1.72, 1.2, 0.42);
        const claw = cap(0.03, 0.5, bodyMat); add(claw, side * 0.6, 0.35, 0.1, 0.1, 0, side * 0.15);
        for (let f = 0; f < 3; f++)
          add(new THREE.Mesh(new THREE.ConeGeometry(0.02 * s, 0.14 * s, 5), boneMat), side * (0.56 + f * 0.04), 0.06, 0.12, Math.PI, 0, 0);
      }
      // Cable storm.
      cable([[0.2, 1.9, -0.2], [0.5, 1.3, -0.3], [0.4, 0.6, -0.1], [0.55, 0.1, -0.2]], 0.03);
      cable([[-0.25, 1.85, -0.15], [-0.45, 1.2, -0.35], [-0.3, 0.5, -0.15]], 0.026);
      cable([[0, 1.95, -0.25], [0.1, 1.5, -0.45], [-0.05, 0.9, -0.3], [0.05, 0.3, -0.35]], 0.02);
      cable([[0.3, 2.0, 0], [0.7, 1.8, -0.1], [0.9, 1.3, 0]], 0.02);
      break;
    }
    case 'soldier': {
      // Ranged trooper: shroud + shoulder cannon + backpack + feed cables.
      robe(1.0);
      ribs(1.35);
      const shoulder = cap(0.09, 0.4, bodyMat); add(shoulder, 0, 1.6, 0, 0, 0, Math.PI / 2);
      headY = skullAt(1.9);
      arm(-1, 1.56); arm(1, 1.56, 0.2);
      const cannon = new THREE.Mesh(new THREE.CylinderGeometry(0.05 * s, 0.06 * s, 0.6 * s, 10), gunMat);
      add(cannon, 0.34, 1.74, 0.1, Math.PI / 2, 0, 0);
      add(new THREE.Mesh(new THREE.CylinderGeometry(0.07 * s, 0.07 * s, 0.08 * s, 10), rustMat), 0.34, 1.74, 0.38, Math.PI / 2, 0, 0);
      const pack = new THREE.Mesh(new THREE.CapsuleGeometry(0.14 * s, 0.3 * s, 4, 8), gunMat);
      add(pack, -0.1, 1.25, -0.3);
      cable([[-0.1, 1.45, -0.3], [0.15, 1.6, -0.25], [0.34, 1.7, -0.05]], 0.02);
      break;
    }
    default: {
      // grunt — the base rusher: shroud, ribcage, jointed arms, rusted
      // forearm blade (the white-skeleton concept's weapon arm).
      robe(1.0);
      ribs(1.35);
      const shoulder = cap(0.09, 0.4, bodyMat); add(shoulder, 0, 1.6, 0, 0, 0, Math.PI / 2);
      headY = skullAt(1.9);
      arm(-1, 1.56); arm(1, 1.56, 0.2);
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.04 * s, 0.6 * s, 0.1 * s), rustMat);
      add(blade, 0.48, 0.55, 0.1, 0, 0, 0.06);
      break;
    }
  }

  return { group: g, bodyMat, headY };
}

class Enemy {
  id: number;
  type: string;
  def: EnemyType;
  hp: number;
  maxHp: number;
  group: THREE.Group;
  mat: THREE.MeshStandardMaterial;   // body material (hurt flash)
  headY: number;
  state: AIState = 'approach';
  stateT = 0;
  fireCd = 0;
  strafeDir = 1;
  hurtT = 0;
  stun = 0;                 // EMP disable timer
  private _meshes: THREE.Object3D[] = [];

  constructor(id: number, type: string, x: number, z: number) {
    this.id = id;
    this.type = type;
    this.def = ENEMY_TYPES[type] ?? ENEMY_TYPES.grunt;
    this.hp = this.maxHp = this.def.hp;

    const f = buildFigure(this.def, type);
    this.group = f.group;
    this.mat = f.bodyMat;
    this.headY = f.headY;
    this.group.position.set(x, this.def.flying ? 4 : 0, z);
    // Every mesh in the figure is a hittable enemy target.
    this.group.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) { m.userData.enemyId = id; m.userData.headY = f.headY; this._meshes.push(m); }
    });
  }

  meshes(): THREE.Object3D[] { return this._meshes; }
}

export class EnemyManager {
  private ctx: Ctx;
  private ray = new THREE.Raycaster();
  private local = new Map<number, Enemy>();
  private seq = 1;

  constructor(ctx: Ctx) { this.ctx = ctx; }

  get count() { return this.local.size; }

  meshes(): THREE.Object3D[] {
    const out: THREE.Object3D[] = [];
    this.local.forEach((e) => out.push(...e.meshes()));
    return out;
  }

  /* ------------------------------- LOCAL -------------------------------- */

  spawnLocal(type: string, x: number, z: number): number {
    const e = new Enemy(this.seq++, type, x, z);
    this.ctx.scene.add(e.group);
    this.local.set(e.id, e);
    return e.id;
  }

  clear() {
    this.local.forEach((e) => this.ctx.scene.remove(e.group));
    this.local.clear();
  }

  /** Apply a client hit locally (single-player). Returns kill info. */
  damageLocal(enemyId: number, dmg: number, headshot: boolean): { killed: boolean; type: string } | null {
    const e = this.local.get(enemyId);
    if (!e) return null;
    e.hp -= dmg;
    e.hurtT = 0.12;
    if (e.hp <= 0) { this.killLocal(e, headshot); return { killed: true, type: e.type }; }
    return { killed: false, type: e.type };
  }

  /** Radial damage (grenades / explosions). Kills within range flop as ragdolls. */
  damageArea(pos: THREE.Vector3, radius: number, dmg: number) {
    for (const e of [...this.local.values()]) {
      const d = e.group.position.distanceTo(pos);
      if (d > radius) continue;
      e.hp -= dmg * (1 - d / radius);
      e.hurtT = 0.12;
      if (e.hp <= 0) this.killLocal(e, false);
    }
  }

  /** EMP stun: disable machines in radius for a few seconds. */
  empStun(pos: THREE.Vector3, radius: number, duration = 4) {
    for (const e of this.local.values()) {
      if (e.group.position.distanceTo(pos) < radius) e.stun = duration;
    }
  }

  private killLocal(e: Enemy, headshot: boolean) {
    this.local.delete(e.id);
    if (this.ctx.onRagdoll) {
      const hit = e.group.position.clone().sub(this.ctx.getPlayerPos());
      this.ctx.onRagdoll(e.group, hit);        // physics takes ownership + removes it
    } else {
      this.ctx.scene.remove(e.group);
    }
    this.ctx.onKill(e.def.score, e.type, headshot);
  }

  updateLocal(dt: number, elapsed: number) {
    const player = this.ctx.getPlayerPos();
    for (const e of this.local.values()) {
      const gp = e.group.position;
      const toX = player.x - gp.x, toZ = player.z - gp.z;
      const dist = Math.hypot(toX, toZ) || 1;
      const dirX = toX / dist, dirZ = toZ / dist;

      // Face the player + a subtle idle sway.
      e.group.rotation.y = Math.atan2(toX, toZ);
      e.group.rotation.z = Math.sin(elapsed * 2 + e.id) * 0.02;

      // EMP-stunned: twitch in place, no movement or attacks.
      if (e.stun > 0) {
        e.stun -= dt;
        e.group.rotation.z += Math.sin(elapsed * 40) * 0.05;
        e.mat.emissiveIntensity = 0.2 + Math.random() * 0.6;
        continue;
      }

      // Simple state machine.
      e.stateT -= dt;
      e.fireCd -= dt;
      const d = e.def;

      if (!d.ranged) {
        // Melee: rush and swing.
        if (dist > d.range) { gp.x += dirX * d.speed * dt; gp.z += dirZ * d.speed * dt; }
        else if (e.fireCd <= 0) { e.fireCd = d.fireInterval; this.ctx.onPlayerDamage(d.damage); }
      } else {
        // Ranged: hold at mid-range, strafe, shoot on LOS.
        const ideal = d.range * 0.55;
        if (dist > ideal + 4) { gp.x += dirX * d.speed * dt; gp.z += dirZ * d.speed * dt; }
        else if (dist < ideal - 4) { gp.x -= dirX * d.speed * 0.7 * dt; gp.z -= dirZ * d.speed * 0.7 * dt; }
        // Strafe perpendicular for a "flanking" read.
        if (e.stateT <= 0) { e.strafeDir = Math.random() > 0.5 ? 1 : -1; e.stateT = 1 + Math.random() * 1.5; }
        gp.x += -dirZ * e.strafeDir * d.speed * 0.5 * dt;
        gp.z += dirX * e.strafeDir * d.speed * 0.5 * dt;

        if (e.fireCd <= 0 && dist < d.range) {
          e.fireCd = d.fireInterval;
          const eye = gp.clone(); eye.y += d.flying ? 0 : 1.4;
          if (d.bomber) {
            // Demolition unit: lob an arcing bomb at the player's position.
            this.ctx.onBomb?.(eye, player.clone());
            this.ctx.audio.impact('metal', dist);
          } else {
            const aim = player.clone(); aim.y += 1.4;
            this.ctx.effects.tracer(eye, aim, 0xff5a3b);
            // Falloff damage.
            const dmg = d.damage * THREE.MathUtils.clamp(1 - dist / (d.range * 1.4), 0.3, 1);
            this.ctx.onPlayerDamage(dmg);
            this.ctx.audio.shoot('light', dist);
          }
        }
      }

      // Flying bob — drones cruise high, wraiths glide just off the floor.
      if (d.flying) gp.y = (d.hoverY ?? 4) + Math.sin(elapsed * 2 + e.id) * 0.6;

      // Keep inside the arena and off the exact player position.
      gp.x = THREE.MathUtils.clamp(gp.x, -106, 106);
      gp.z = THREE.MathUtils.clamp(gp.z, -106, 106);

      // Hurt flash decay.
      if (e.hurtT > 0) { e.hurtT -= dt; e.mat.emissiveIntensity = 1.7; }
      else { e.mat.emissiveIntensity = 0.5; }
    }
  }
}
