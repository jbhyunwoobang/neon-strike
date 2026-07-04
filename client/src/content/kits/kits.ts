/**
 * content/kits/kits.ts — K1 Gravity kit v1 + K2 Stillwood kit v1 (Sprint 003).
 *
 * The campaign's factory, stamped from the F1-proven recipe: shared baked
 * materials (ONE board-form material, ONE bark material — instancing is the
 * budget [BIV §15]) + module factories at scale-table dimensions [BIV-QR §3].
 * Modules return {mesh, collider} so levels stay collision-honest.
 *
 * K1 modules (12): wall3, wall6, fin, pier, lintel, slab, parapet, stair,
 *                  buttress, doorframe (5.4m Edge / 2.2m human), plinth.
 * K2 pieces  (6): trunk variants by seed (height/radius/flute params).
 */

import * as THREE from 'three';
import { bakeBoardForm, bakeStillwoodBark } from '../fidelity/textures';

export interface KitPiece { mesh: THREE.Mesh; collider: THREE.Box3 | null; }

let pourMat: THREE.MeshStandardMaterial | null = null;
let barkMat: THREE.MeshStandardMaterial | null = null;

/** The shared board-form material (baked once per session). */
export function gravityMaterial(): THREE.MeshStandardMaterial {
  if (!pourMat) {
    const b = bakeBoardForm(7);
    b.map.repeat.set(1, 1); // per-mesh UV scaling via geometry size, world-space 3m tile
    pourMat = new THREE.MeshStandardMaterial({
      map: b.map, normalMap: b.normalMap,
      normalScale: new THREE.Vector2(0.9, 0.9), roughness: 0.96, metalness: 0.02,
    });
  }
  return pourMat;
}

export function barkMaterial(): THREE.MeshStandardMaterial {
  if (!barkMat) {
    const b = bakeStillwoodBark(11);
    b.map.repeat.set(2, 5);
    b.normalMap.repeat.copy(b.map.repeat);
    barkMat = new THREE.MeshStandardMaterial({
      map: b.map, normalMap: b.normalMap,
      normalScale: new THREE.Vector2(1.1, 1.1), roughness: 0.98,
    });
  }
  return barkMat;
}

/** World-space UV mapping: 1 texture tile = 3m × 3m on every pour face. */
export function pourBox(w: number, h: number, d: number): THREE.Mesh {
  const geo = new THREE.BoxGeometry(w, h, d);
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const normal = geo.attributes.normal as THREE.BufferAttribute;
  const v = new THREE.Vector3(), n = new THREE.Vector3();
  for (let i = 0; i < uv.count; i++) {
    v.fromBufferAttribute(pos, i);
    n.fromBufferAttribute(normal, i);
    // Project by dominant axis → world-metric UVs (the 3m tile).
    let u: number, vv: number;
    if (Math.abs(n.x) > 0.5) { u = v.z; vv = v.y; }
    else if (Math.abs(n.y) > 0.5) { u = v.x; vv = v.z; }
    else { u = v.x; vv = v.y; }
    uv.setXY(i, u / 3, vv / 3);
  }
  const m = new THREE.Mesh(geo, gravityMaterial());
  m.castShadow = m.receiveShadow = true;
  return m;
}

function piece(mesh: THREE.Mesh, x: number, y: number, z: number, ry = 0, collide = true): KitPiece {
  mesh.position.set(x, y, z);
  mesh.rotation.y = ry;
  mesh.updateMatrixWorld(true);
  return { mesh, collider: collide ? new THREE.Box3().setFromObject(mesh) : null };
}

/* ------------------------------- K1: GRAVITY ------------------------------ */

export const Gravity = {
  wall3: (x: number, y: number, z: number, ry = 0) => piece(pourBox(3, 7.2, 0.8), x, y + 3.6, z, ry),
  wall6: (x: number, y: number, z: number, ry = 0) => piece(pourBox(6, 7.2, 0.8), x, y + 3.6, z, ry),
  fin: (x: number, y: number, z: number, ry = 0) => piece(pourBox(1.6, 10, 0.8), x, y + 5, z, ry),
  pier: (x: number, y: number, z: number, ry = 0) => piece(pourBox(2.2, 15, 2.2), x, y + 7.5, z, ry),
  lintel: (x: number, y: number, z: number, ry = 0) => piece(pourBox(7, 1.6, 1.2), x, y + 0.8, z, ry),
  slab: (x: number, y: number, z: number, ry = 0) => piece(pourBox(12, 1.2, 8), x, y + 0.6, z, ry),
  parapet: (x: number, y: number, z: number, ry = 0) => piece(pourBox(6, 1.1, 0.5), x, y + 0.55, z, ry),
  buttress: (x: number, y: number, z: number, ry = 0) => {
    const m = pourBox(0.9, 6, 3.2);
    m.geometry.translate(0, 0, 0);
    return piece(m, x, y + 3, z, ry);
  },
  plinth: (x: number, y: number, z: number, ry = 0) => piece(pourBox(1.8, 1.2, 1.8), x, y + 0.6, z, ry),
  coverFin: (x: number, y: number, z: number, ry = 0) => piece(pourBox(3.2, 1.4, 0.6), x, y + 0.7, z, ry),
  /** Edge civic doorframe: 5.4 m opening (two jambs + lintel — pass-through). */
  doorframeEdge: (x: number, y: number, z: number, ry = 0): KitPiece[] => [
    piece(pourBox(1.2, 7, 1.2), x - 3.3, y + 3.5, z, ry),
    piece(pourBox(1.2, 7, 1.2), x + 3.3, y + 3.5, z, ry),
    piece(pourBox(7.8, 1.2, 1.2), x, y + 7.6, z, ry),
  ],
  /** Stair run: 6 shallow steps → +1.9 m (walkable via step colliders). */
  stair: (x: number, y: number, z: number, ry = 0): KitPiece[] => {
    const out: KitPiece[] = [];
    for (let i = 0; i < 6; i++) {
      out.push(piece(pourBox(3, 0.32, 1.6), x, y + 0.16 + i * 0.31, z - i * 1.35, ry));
    }
    return out;
  },
};

/* ------------------------------ K2: STILLWOOD ----------------------------- */

function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

/** A stillwood trunk-column: fluted, root-flared, mineral — a cast of a tree. */
export function trunk(seed: number, x: number, z: number, height = 14, radius = 0.9): KitPiece {
  const R = rng(seed);
  const twist = (R() - 0.5) * 3;
  const fluteN = 7 + Math.floor(R() * 5);
  const geo = new THREE.CylinderGeometry(radius * 0.8, radius * 1.15, height, 40, 18, true);
  const p = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const theta = Math.atan2(v.z, v.x);
    const yy = v.y / height + 0.5;
    const flute = Math.sin(theta * fluteN + yy * twist) * 0.07 + Math.sin(theta * 21 + seed) * 0.02;
    const flare = Math.pow(Math.max(0, 0.16 - yy), 1.4) * 2.4;
    const r = 1 + flute + flare;
    const len = Math.hypot(v.x, v.z);
    if (len > 0.001) { v.x *= r; v.z *= r; }
    p.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, barkMaterial());
  m.castShadow = m.receiveShadow = true;
  m.position.set(x, height / 2, z);
  m.rotation.y = R() * Math.PI * 2;
  m.updateMatrixWorld(true);
  // Collision: a tight box column (grey-box honest; capsule later if needed).
  const collider = new THREE.Box3(
    new THREE.Vector3(x - radius, 0, z - radius),
    new THREE.Vector3(x + radius, height, z + radius),
  );
  return { mesh: m, collider };
}
