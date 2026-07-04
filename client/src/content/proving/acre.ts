/**
 * content/proving/acre.ts — THE ACRE (PROVING), station 13 (Sprint 002 C1).
 *
 * SEQUENCES layer: builds the covenant arena grey-box per SPRINT-002-PLAN §7.
 * Scale-table true [BIV-QR §3]; canon hex anchors ONLY (grey discipline; the
 * sapling is the frame's single green — the ration rehearsed in grey-box).
 * 70×55 m radial arena · defended center r=20 m · cover ring 8–12 m ·
 * 30 m viaduct-stub slab overhead · three lanes (N/SW/SE) · +4 m gantry flank ·
 * read-vantage ridge at the S entry · D-1 husk silhouette on the far ridge.
 */

import * as THREE from 'three';

export interface AcreWorld {
  colliders: THREE.Box3[];
  lanes: Record<'N' | 'SW' | 'SE', { spawn: THREE.Vector3; gate: THREE.Mesh }>;
  center: THREE.Vector3;
  sapling: THREE.Group;
  greenUnit: THREE.Mesh;
  spawnPoint: THREE.Vector3;
  root: THREE.Group;
}

// Canon anchors [BIV §5].
const CONCRETE = 0x6e6e6a;
const CONCRETE_DARK = 0x4a4b48;
const DUST = 0x9b948a;
const BONE = 0xe8e4da;
const AMBER = 0xd9a226;
const LINE_GREEN = 0x4f7a3d;
const SHADOW = 0x1c1d1e;

function mat(color: number, rough = 0.95): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0.05 });
}

export function buildAcre(scene: THREE.Scene): AcreWorld {
  const root = new THREE.Group();
  const colliders: THREE.Box3[] = [];

  const box = (w: number, h: number, d: number, x: number, y: number, z: number, color = CONCRETE, collide = true) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
    m.position.set(x, y, z);
    m.castShadow = m.receiveShadow = true;
    root.add(m);
    if (collide) colliders.push(new THREE.Box3().setFromObject(m));
    return m;
  };

  // ---- light: grey noon — ONE dominant source (LAW) + low bounce fill.
  scene.background = new THREE.Color(DUST);
  scene.fog = new THREE.Fog(DUST, 60, 220);
  const sun = new THREE.DirectionalLight(0xdadad2, 1.15);
  sun.position.set(-30, 80, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -80; sun.shadow.camera.right = 80;
  sun.shadow.camera.top = 80; sun.shadow.camera.bottom = -80;
  root.add(sun);
  root.add(new THREE.HemisphereLight(0xc9c6bd, 0x3a3b38, 0.5));

  // ---- ground: the dead clearing.
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), mat(DUST, 1));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  root.add(ground);

  // ---- the viaduct-stub slab: insignificance in grey (30 m up, enormous).
  box(90, 6, 26, 0, 33, -6, CONCRETE_DARK, false);
  // Its two piers (landing in the arena — the contempt, buildable).
  box(8, 30, 8, -34, 15, -6);
  box(8, 30, 8, 34, 15, -6);

  // ---- colonnade-stub rows along the three lanes (metronomic, 10 m spacing).
  const colonnade = (dirX: number, dirZ: number, count: number) => {
    for (let i = 2; i <= count + 1; i++) {
      const d = i * 10;
      const px = dirX * d, pz = dirZ * d;
      box(1.8, 14, 1.8, px + dirZ * 5, 7, pz + dirX * 5, CONCRETE);
      box(1.8, 14, 1.8, px - dirZ * 5, 7, pz - dirX * 5, CONCRETE);
    }
  };
  colonnade(0, -1, 4);                       // N lane (−z)
  colonnade(-0.77, 0.64, 4);                 // SW lane
  colonnade(0.77, 0.64, 4);                  // SE lane

  // ---- cover ring: 6 chest-height fins (1.4 m) at 8–12 m from center.
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.4;
    const r = 8 + (i % 2) * 3.5;
    const fin = box(3.2, 1.4, 0.6, Math.cos(a) * r, 0.7, Math.sin(a) * r, CONCRETE);
    fin.rotation.y = -a;
    colliders[colliders.length - 1] = new THREE.Box3().setFromObject(fin);
  }

  // ---- the gantry flank (+4 m, N side): the ownable flank, ramp access.
  box(14, 0.5, 3.5, -14, 4, -22);            // deck
  box(1, 4, 1, -20, 2, -22);                  // legs
  box(1, 4, 1, -8, 2, -22);
  const ramp = new THREE.Mesh(new THREE.BoxGeometry(3, 0.4, 12), mat(CONCRETE_DARK));
  ramp.position.set(-14, 2, -14.5);
  ramp.rotation.x = -Math.atan2(4, 12);
  ramp.castShadow = ramp.receiveShadow = true;
  root.add(ramp);
  // Walkable ramp approximated by shallow step colliders.
  for (let i = 0; i < 6; i++) box(3, 0.3, 2, -14, 0.3 + i * 0.62, -10.5 - i * 1.8, CONCRETE_DARK, true);

  // ---- the read-vantage ridge (S entry): see the whole arena BEFORE entering.
  box(26, 2.4, 10, 0, 1.2, 34, DUST);
  const spawnPoint = new THREE.Vector3(0, 4.2, 36);

  // ---- lane gates: staged, watchable arrivals (amber jamb stripes).
  const mkGate = (x: number, z: number): THREE.Mesh => {
    box(5.4, 7, 1, x, 3.5, z, CONCRETE_DARK);
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(5.6, 0.3, 1.05),
      new THREE.MeshStandardMaterial({ color: AMBER, emissive: AMBER, emissiveIntensity: 0.25, roughness: 0.6 }),
    );
    stripe.position.set(x, 7.1, z);
    root.add(stripe);
    // Doorway hole: gates are visual frames at lane mouths, passage beside them.
    return stripe;
  };
  const lanes: AcreWorld['lanes'] = {
    N: { spawn: new THREE.Vector3(0, 0, -52), gate: mkGate(0, -46) },
    SW: { spawn: new THREE.Vector3(-40, 0, 34), gate: mkGate(-36, 30) },
    SE: { spawn: new THREE.Vector3(40, 0, 34), gate: mkGate(36, 30) },
  };

  // ---- the D-1 husk silhouette: the boss you never fight (100 m, unlit).
  const husk = new THREE.Group();
  const huskMat = new THREE.MeshBasicMaterial({ color: SHADOW });
  const body = new THREE.Mesh(new THREE.BoxGeometry(14, 8, 10), huskMat);
  body.position.y = 9;
  husk.add(body);
  for (const [lx, lz] of [[-5, -3], [5, -3], [-5, 3], [5, 3]] as const) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(2, 10, 2), huskMat);
    leg.position.set(lx, 5, lz);
    husk.add(leg);
  }
  const head = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 5), huskMat);
  head.position.set(0, 14, -4);
  husk.add(head);
  husk.position.set(-70, 0, -95);
  husk.rotation.y = 0.5;
  root.add(husk);

  // ---- the center: sapling stub + green unit (the frame's ONLY green — LAW).
  const center = new THREE.Vector3(0, 0, 0);
  const sapling = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 1.1, 6), mat(0x5c5f52));
  trunk.position.y = 0.55;
  sapling.add(trunk);
  const crownMat = new THREE.MeshStandardMaterial({ color: LINE_GREEN, emissive: LINE_GREEN, emissiveIntensity: 0.15, roughness: 0.8 });
  const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.45, 0), crownMat);
  crown.position.y = 1.35;
  crown.name = 'sapling-crown';
  sapling.add(crown);
  sapling.position.copy(center);
  root.add(sapling);

  const greenUnit = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 1.4), mat(0x55574f, 0.7));
  greenUnit.position.set(1.6, 0.35, 0.6);
  const lens = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.1, 12),
    new THREE.MeshStandardMaterial({ color: LINE_GREEN, emissive: LINE_GREEN, emissiveIntensity: 0.0 }),
  );
  lens.rotation.z = Math.PI / 2;
  lens.position.set(-0.5, 0.15, 0);
  greenUnit.add(lens);
  root.add(greenUnit);
  colliders.push(new THREE.Box3().setFromObject(greenUnit));

  // ---- cordon-stub: the previous incident (procedure archaeology, grey).
  const tape = new THREE.Mesh(
    new THREE.BoxGeometry(12, 0.06, 0.02),
    new THREE.MeshBasicMaterial({ color: BONE }),
  );
  tape.position.set(9, 1.0, -14);
  tape.rotation.y = 0.7;
  root.add(tape);

  scene.add(root);
  return { colliders, lanes, center, sapling, greenUnit, spawnPoint, root };
}
