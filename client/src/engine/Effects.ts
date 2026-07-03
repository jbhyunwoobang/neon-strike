/**
 * Effects.ts — Transient combat visuals.
 *
 * A single manager owns short-lived visual effects and ages them out each
 * frame: bullet tracers, muzzle flashes (light + sprite), surface impacts
 * (decal + sparks + debris) and explosions. Decals are capped and recycled so
 * long matches don't leak geometry.
 *
 * Impacts are material-aware — concrete puffs dust, metal throws sparks, glass
 * shatters — which pairs with the material-tagged Arena colliders.
 */

import * as THREE from 'three';
import type { SurfaceMat } from './Arena';

interface Timed { obj: THREE.Object3D; life: number; max: number; kind: string; }

const MAX_DECALS = 64;

export class Effects {
  private scene: THREE.Scene;
  private items: Timed[] = [];
  private decals: THREE.Mesh[] = [];

  private tracerMat = new THREE.LineBasicMaterial({ color: 0xfff2c0, transparent: true, opacity: 0.9 });
  private flashSprite: THREE.SpriteMaterial;
  private decalGeo = new THREE.CircleGeometry(0.16, 8);
  private sparkGeo = new THREE.BufferGeometry();

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    // Radial gradient sprite for muzzle flashes / sparks.
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,240,190,1)');
    grad.addColorStop(0.4, 'rgba(255,180,90,0.8)');
    grad.addColorStop(1, 'rgba(255,120,40,0)');
    g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    this.flashSprite = new THREE.SpriteMaterial({ map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });

    // Soft grey radial puff for smooth smoke (normal blending, feathered edge).
    const sc = document.createElement('canvas');
    sc.width = sc.height = 128;
    const sg = sc.getContext('2d')!;
    const sgrad = sg.createRadialGradient(64, 64, 0, 64, 64, 64);
    sgrad.addColorStop(0, 'rgba(210,208,204,0.75)');
    sgrad.addColorStop(0.45, 'rgba(170,168,164,0.45)');
    sgrad.addColorStop(1, 'rgba(140,138,134,0)');
    sg.fillStyle = sgrad; sg.fillRect(0, 0, 128, 128);
    const stex = new THREE.CanvasTexture(sc);
    this.smokeSprite = new THREE.SpriteMaterial({ map: stex, transparent: true, depthWrite: false });
  }
  private smokeSprite!: THREE.SpriteMaterial;

  /** A soft eased smoke puff: rises, expands, fades with smoothstep. */
  puff(pos: THREE.Vector3, scale = 1, tint = 0xffffff, life = 1.4) {
    const spr = new THREE.Sprite(this.smokeSprite.clone());
    spr.material.color.setHex(tint);
    spr.position.copy(pos).add(new THREE.Vector3((Math.random() - 0.5) * 0.8, Math.random() * 0.4, (Math.random() - 0.5) * 0.8));
    spr.scale.setScalar(0.5 * scale);
    (spr as any).userData = { rise: 0.7 + Math.random() * 0.9, grow: (2.2 + Math.random() * 1.6) * scale, spin: (Math.random() - 0.5) * 0.8 };
    this.scene.add(spr);
    this.items.push({ obj: spr, life, max: life, kind: 'puff' });
  }

  /** A glowing beam from origin to end, fading fast. */
  tracer(from: THREE.Vector3, to: THREE.Vector3, color = 0xfff2c0) {
    const geo = new THREE.BufferGeometry().setFromPoints([from.clone(), to.clone()]);
    const mat = this.tracerMat.clone();
    mat.color.setHex(color);
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);
    this.items.push({ obj: line, life: 0.055, max: 0.055, kind: 'tracer' });
  }

  /** Muzzle flash at a world position, oriented loosely toward `dir`. */
  muzzle(pos: THREE.Vector3) {
    const spr = new THREE.Sprite(this.flashSprite.clone());
    spr.position.copy(pos);
    spr.scale.setScalar(1.1 + Math.random() * 0.5);
    this.scene.add(spr);
    this.items.push({ obj: spr, life: 0.06, max: 0.06, kind: 'flash' });

    const light = new THREE.PointLight(0xffd08a, 6, 8, 2);
    light.position.copy(pos);
    this.scene.add(light);
    this.items.push({ obj: light, life: 0.06, max: 0.06, kind: 'light' });
  }

  /** Surface impact: decal + material-appropriate particles. */
  impact(point: THREE.Vector3, normal: THREE.Vector3, material: SurfaceMat) {
    // Oriented decal.
    const decalMat = new THREE.MeshBasicMaterial({
      color: material === 'glass' ? 0x88ccff : material === 'metal' ? 0x222222 : 0x111111,
      transparent: true, opacity: 0.85, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4,
    });
    const decal = new THREE.Mesh(this.decalGeo, decalMat);
    decal.position.copy(point).addScaledVector(normal, 0.02);
    decal.lookAt(point.clone().add(normal));
    this.scene.add(decal);
    this.decals.push(decal);
    if (this.decals.length > MAX_DECALS) {
      const old = this.decals.shift()!;
      this.scene.remove(old);
      (old.material as THREE.Material).dispose();
    }

    // Sparks / dust particles.
    const n = material === 'metal' ? 10 : material === 'glass' ? 14 : 6;
    const color = material === 'metal' ? 0xffcf7a : material === 'glass' ? 0xbfe4ff : 0x9a9a9a;
    const positions = new Float32Array(n * 3);
    const vel: THREE.Vector3[] = [];
    for (let i = 0; i < n; i++) {
      positions.set([point.x, point.y, point.z], i * 3);
      const v = normal.clone().multiplyScalar(2 + Math.random() * 4);
      v.x += (Math.random() - 0.5) * 4; v.y += Math.random() * 3; v.z += (Math.random() - 0.5) * 4;
      vel.push(v);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color, size: 0.08, transparent: true, blending: THREE.AdditiveBlending }));
    (pts as any).userData.vel = vel;
    this.scene.add(pts);
    this.items.push({ obj: pts, life: 0.4, max: 0.4, kind: 'sparks' });
  }

  /** Layered blast: eased fireball core + expanding shockwave ring + a crown
   *  of soft rising smoke puffs — smooth, not a popping sphere. */
  explosion(pos: THREE.Vector3) {
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0xffa040, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    ball.position.copy(pos);
    this.scene.add(ball);
    this.items.push({ obj: ball, life: 0.5, max: 0.5, kind: 'explosion' });

    // Ground shockwave ring racing outward.
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.8, 1.05, 40),
      new THREE.MeshBasicMaterial({ color: 0xffc890, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(pos.x, Math.max(0.12, pos.y - 0.8), pos.z);
    this.scene.add(ring);
    this.items.push({ obj: ring, life: 0.45, max: 0.45, kind: 'shock' });

    // Soft smoke crown that lingers after the flash dies.
    for (let i = 0; i < 6; i++) this.puff(pos, 1.6, 0x9a9691, 1.3 + Math.random() * 0.7);

    const light = new THREE.PointLight(0xffa040, 30, 30, 2);
    light.position.copy(pos);
    this.scene.add(light);
    this.items.push({ obj: light, life: 0.4, max: 0.4, kind: 'light' });
  }

  update(dt: number) {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      it.life -= dt;
      const k = Math.max(0, it.life / it.max);

      if (it.kind === 'sparks') {
        const pts = it.obj as THREE.Points;
        const vel = (pts as any).userData.vel as THREE.Vector3[];
        const pos = pts.geometry.getAttribute('position') as THREE.BufferAttribute;
        const arr = pos.array as Float32Array;
        for (let j = 0; j < vel.length; j++) {
          vel[j].y -= 12 * dt;
          arr[j * 3] += vel[j].x * dt;
          arr[j * 3 + 1] += vel[j].y * dt;
          arr[j * 3 + 2] += vel[j].z * dt;
        }
        pos.needsUpdate = true;
        (pts.material as THREE.PointsMaterial).opacity = k;
      } else if (it.kind === 'explosion') {
        const m = it.obj as THREE.Mesh;
        // Eased growth (fast then settling) + smoothstep fade — no linear pop.
        const g2 = 1 - k, ease = 1 - (1 - g2) * (1 - g2);
        m.scale.setScalar(1 + ease * 6.5);
        (m.material as THREE.MeshBasicMaterial).opacity = k * k * (3 - 2 * k) * 0.9;
      } else if (it.kind === 'shock') {
        const m = it.obj as THREE.Mesh;
        const g2 = 1 - k, ease = 1 - (1 - g2) * (1 - g2) * (1 - g2);
        m.scale.setScalar(1 + ease * 11);
        (m.material as THREE.MeshBasicMaterial).opacity = k * 0.75;
      } else if (it.kind === 'puff') {
        const spr = it.obj as THREE.Sprite;
        const u = (spr as any).userData;
        spr.position.y += u.rise * dt;
        spr.material.rotation += u.spin * dt;
        const g2 = 1 - k;
        spr.scale.setScalar(0.5 + g2 * u.grow);            // steady expansion
        spr.material.opacity = k * k * (3 - 2 * k) * 0.85; // smoothstep fade
      } else if (it.kind === 'flash') {
        (it.obj as THREE.Sprite).material.opacity = k;
      } else if (it.kind === 'light') {
        (it.obj as THREE.PointLight).intensity = k * 6;
      } else if (it.kind === 'tracer') {
        ((it.obj as THREE.Line).material as THREE.LineBasicMaterial).opacity = k * 0.9;
      }

      if (it.life <= 0) {
        this.scene.remove(it.obj);
        const anyObj = it.obj as any;
        anyObj.geometry?.dispose?.();
        if (anyObj.material) {
          if (Array.isArray(anyObj.material)) anyObj.material.forEach((m: THREE.Material) => m.dispose());
          else anyObj.material.dispose?.();
        }
        this.items.splice(i, 1);
      }
    }
  }
}
