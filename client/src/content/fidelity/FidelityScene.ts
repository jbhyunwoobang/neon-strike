/**
 * content/fidelity/FidelityScene.ts — F1: THE FIDELITY GATE (Sprint 003).
 *
 * One pour module + one stillwood trunk at target quality, judged under the
 * two canonical light regimes:
 *   VIEW 1 — the wall study under a raking BLADE (daylight-as-judgment: does
 *            the board-form biography read as relief?)
 *   VIEW 2 — the monument wide under GREY NOON (the ration mood: does
 *            monumentality survive the soft dust-light, tenant <3%?)
 *   VIEW 3 — the trunk study under a blade (does the stillwood read as a CAST
 *            of a tree — mineral, architectural, dead-still?)
 *
 * GO criteria: one-frame test on views 2/3; relief legible in view 1;
 * 60 fps; zero console errors. Keys 1/2/3 switch views in-browser.
 */

import * as THREE from 'three';
import { Engine } from '../../engine/Engine';
import { bakeBoardForm, bakeStillwoodBark } from './textures';

const DUST = 0x9b948a;

export class FidelityScene {
  private engine: Engine;
  private view = 2;
  private blade!: THREE.DirectionalLight;
  private noon!: THREE.DirectionalLight;
  private overlay: HTMLDivElement;
  private t = 0;
  private keyHandler = (e: KeyboardEvent) => {
    if (e.code === 'Digit1') this.setView(1);
    if (e.code === 'Digit2') this.setView(2);
    if (e.code === 'Digit3') this.setView(3);
  };

  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, 'high', 55); // 55° ≈ 35mm study framing
    this.overlay = document.createElement('div');
    this.overlay.style.cssText =
      'position:fixed;top:8px;left:8px;z-index:50;font:12px monospace;color:#e8e4da;' +
      'background:rgba(28,29,30,.7);padding:6px 10px;border:1px solid #4a4b48;pointer-events:none';
    document.body.appendChild(this.overlay);
  }

  start() {
    // The Ch.1 grade anchor: the game's greyest hour — exposure held low,
    // bloom near-zero, CA at the canon's 'subtle' (the arcade's smear retired),
    // grain at the locked 0.10 [Book V §19.3].
    this.engine.setGrade({ exposure: 0.88, bloom: 0.08, ca: 0.00025, grain: 0.1 });
    const scene = this.engine.scene;
    scene.background = new THREE.Color(0x8f8a80);
    scene.fog = new THREE.Fog(0x8f8a80, 40, 160);

    // ---- lights: the two regimes (one dominates 4:1 per view — the law).
    this.noon = new THREE.DirectionalLight(0xd6d4ca, 0.95);
    this.noon.position.set(-20, 60, 25);
    this.blade = new THREE.DirectionalLight(0xf2ead8, 1.5);
    this.blade.position.set(-14, 10, 3); // low, raking across the wall face
    this.blade.castShadow = true;
    this.blade.shadow.mapSize.set(2048, 2048);
    scene.add(this.noon, this.blade, new THREE.HemisphereLight(0xbdbab1, 0x33342f, 0.3));

    // ---- ground.
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(300, 300),
      new THREE.MeshStandardMaterial({ color: DUST, roughness: 1 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // ---- HERO 1: the pour wall module (6 m wide × 7.2 m tall — 2.4 m lifts ×3).
    const pour = bakeBoardForm(7);
    pour.map.repeat.set(2, 2.4);          // 3 m tile → 6 m × 7.2 m
    pour.normalMap.repeat.copy(pour.map.repeat);
    const wallMat = new THREE.MeshStandardMaterial({
      map: pour.map, normalMap: pour.normalMap,
      normalScale: new THREE.Vector2(0.9, 0.9), roughness: 0.96, metalness: 0.02,
    });
    const wall = new THREE.Mesh(new THREE.BoxGeometry(6, 7.2, 0.8), wallMat);
    wall.position.set(0, 3.6, 0);
    wall.castShadow = wall.receiveShadow = true;
    scene.add(wall);
    // The fin: same material, vertical proportion (repetition's first two beats).
    const fin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 10, 0.8), wallMat);
    fin.position.set(4.6, 5, 0);
    fin.castShadow = fin.receiveShadow = true;
    scene.add(fin);

    // ---- HERO 2: the stillwood trunk — a cast of a tree (fluted, mineral).
    const bark = bakeStillwoodBark(11);
    bark.map.repeat.set(2, 5);
    bark.normalMap.repeat.copy(bark.map.repeat);
    const trunkGeo = new THREE.CylinderGeometry(0.72, 1.05, 14, 64, 28, true);
    const p = trunkGeo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const theta = Math.atan2(v.z, v.x);
      const yy = v.y / 14 + 0.5;
      // Flutes + root-flare + slow twist — silhouette first, texture second.
      const flute = Math.sin(theta * 9 + yy * 2.5) * 0.06 + Math.sin(theta * 23) * 0.02;
      const flare = Math.pow(Math.max(0, 0.18 - yy), 1.4) * 2.2;
      const r = 1 + flute + flare;
      const len = Math.hypot(v.x, v.z);
      if (len > 0.001) { v.x *= r; v.z *= r; }
      p.setXYZ(i, v.x, v.y, v.z);
    }
    trunkGeo.computeVertexNormals();
    const trunk = new THREE.Mesh(
      trunkGeo,
      new THREE.MeshStandardMaterial({
        map: bark.map, normalMap: bark.normalMap,
        normalScale: new THREE.Vector2(1.1, 1.1), roughness: 0.98,
      }),
    );
    trunk.position.set(-5.5, 7, -4);
    trunk.castShadow = trunk.receiveShadow = true;
    scene.add(trunk);

    // ---- the human datum: 1.8 m silhouette (the tenant, for scale honesty).
    const datum = new THREE.Group();
    const dm = new THREE.MeshStandardMaterial({ color: 0x2a2b2a, roughness: 1 });
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 1.1, 4, 8), dm);
    body.position.y = 0.85;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), dm);
    head.position.y = 1.66;
    datum.add(body, head);
    datum.position.set(1.8, 0, 2.4);
    datum.traverse((o) => { (o as THREE.Mesh).castShadow = true; });
    scene.add(datum);

    this.setView(2);
    this.engine.onUpdate(this.update);
    this.engine.start();
    document.addEventListener('keydown', this.keyHandler);

    if ((import.meta as any).env?.DEV) {
      (window as any).__fid = {
        view: (n: number) => this.setView(n),
        fps: () => this.engine.fps,
        render: () => this.engine.composer.render(),
        info: () => ({
          calls: this.engine.renderer.info.render.calls,
          tris: this.engine.renderer.info.render.triangles,
          fps: this.engine.fps,
        }),
      };
    }
  }

  private setView(n: number) {
    this.view = n;
    const cam = this.engine.camera;
    // Regime per view: blade dominates studies; noon dominates the wide (4:1).
    const bladeOn = n !== 2;
    this.blade.intensity = bladeOn ? 1.5 : 0.0;
    this.noon.intensity = bladeOn ? 0.3 : 0.95;
    if (n === 1) {
      cam.position.set(-4.2, 1.7, 6.4);
      cam.lookAt(0.5, 3.2, 0);
    } else if (n === 2) {
      cam.position.set(7.5, 1.6, 13.5);
      cam.lookAt(-1.5, 5.2, -2);
    } else {
      cam.position.set(-8.6, 1.7, 0.5);
      cam.lookAt(-5.5, 5.5, -4);
    }
    this.engine.scene.updateMatrixWorld(true);
  }

  private update = (dt: number) => {
    this.t += dt;
    // A breath of drift so the eye can judge parallax (≤2%/s — the GN law's pace).
    const cam = this.engine.camera;
    cam.position.y += Math.sin(this.t * 0.5) * 0.0006;
    this.overlay.textContent =
      `F1 FIDELITY GATE — view ${this.view} (keys 1/2/3) · ` +
      `${this.engine.fps} fps · calls ${this.engine.renderer.info.render.calls} · ` +
      `tris ${(this.engine.renderer.info.render.triangles / 1000).toFixed(0)}k`;
  };

  dispose() {
    document.removeEventListener('keydown', this.keyHandler);
    this.overlay.remove();
    this.engine.offUpdate(this.update);
    this.engine.dispose();
  }
}
