/**
 * content/proving/WardenRig.ts — grey-rig Line Warden / First Class (Sprint 002 A2/A5/§6).
 *
 * Visual adapter over core/ai/warden: capsule posture-proxy rig, bone-white +
 * amber panel (canon livery), matte visor head — NO eyes (visor law, BVII).
 * Posture law: every AI state maps 1:1 to a readable posture change; the
 * elite reads by wear-biography (resprayed panel patches), never by size.
 * Movement is doctrine steering: gate → cover slot → hold/fire; retreat is
 * dignified (bounding withdrawal stub v1 = fall-back slot).
 */

import * as THREE from 'three';
import { WardenAI, AIState, DrillStage, LINE_WARDEN, FIRST_CLASS, type LedgerWrite } from '../../core/ai/warden';
import { route, DamageClass, HitZone, type RoutedDamage } from '../../core/combat/damage';

const BONE = 0xe8e4da;
const AMBER = 0xd9a226;
const GREY = 0x6e6e6a;
const VISOR = 0x3a3b38;

export interface WardenHooks {
  onLedger: (w: LedgerWrite) => void;
  /** Fire a shot at the player: ProvingGame resolves LOS/cone → damage. */
  onShoot: (from: THREE.Vector3) => void;
  onBark: (text: string) => void;
  onRadioTone: (on: boolean) => void;
}

export class WardenRig {
  readonly group = new THREE.Group();
  readonly ai: WardenAI;
  readonly elite: boolean;
  /** Zone meshes for the player's hit resolution. */
  readonly zones: { plate: THREE.Mesh; helmet: THREE.Mesh; join: THREE.Mesh };

  private stateLight: THREE.Mesh;
  private body: THREE.Mesh;
  private coverSlot: THREE.Vector3;
  private speed = 2.2;
  private fireTimer = 0;
  private plateHp = 40;
  private coreHp = 50;
  dead = false;
  private deadT = 0;
  private radioWasAudible = false;

  constructor(spawn: THREE.Vector3, coverSlot: THREE.Vector3, elite: boolean, private hooks: WardenHooks) {
    this.elite = elite;
    this.coverSlot = coverSlot.clone();
    this.ai = new WardenAI(elite ? FIRST_CLASS : LINE_WARDEN, { onLedger: hooks.onLedger });

    // --- rig: one dominant mass + one break (silhouette law).
    const boneMat = new THREE.MeshStandardMaterial({ color: BONE, roughness: 0.85 });
    this.body = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 1.0, 4, 10), boneMat);
    this.body.position.y = 1.0;
    this.body.castShadow = true;
    this.body.userData.zone = HitZone.PlateArc;

    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.28, 0.06),
      new THREE.MeshStandardMaterial({ color: AMBER, emissive: AMBER, emissiveIntensity: 0.2 }),
    );
    panel.position.set(0, 1.25, 0.32);
    // Elite wear-biography: resprayed mismatched patches on the plate (BVII §5).
    if (elite) {
      for (const [px, py] of [[-0.18, 0.9], [0.15, 1.35], [0.05, 0.65]] as const) {
        const patch = new THREE.Mesh(
          new THREE.BoxGeometry(0.16, 0.12, 0.02),
          new THREE.MeshStandardMaterial({ color: 0xcfc9ba, roughness: 1 }),
        );
        patch.position.set(px, py, 0.34);
        this.group.add(patch);
      }
    }

    const helmet = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 12, 10),
      new THREE.MeshStandardMaterial({ color: BONE, roughness: 0.7 }),
    );
    helmet.position.y = 1.85;
    helmet.userData.zone = HitZone.Helmet;
    const visor = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.09, 0.12),
      new THREE.MeshStandardMaterial({ color: VISOR, roughness: 0.4 }),
    );
    visor.position.set(0, 1.85, 0.18); // matte band — no eyes, ever (LAW)

    // The join: shoulder strap gap — the honest skill target (BVII/Book V §4.7).
    const join = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.22, 0.3),
      new THREE.MeshStandardMaterial({ color: GREY, roughness: 1 }),
    );
    join.position.set(0.4, 1.45, 0);
    join.userData.zone = HitZone.Join;

    // Dev-honest state gizmo (grey-box only; stripped with the art pass).
    this.stateLight = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x888888 }),
    );
    this.stateLight.position.y = 2.25;

    this.group.add(this.body, panel, helmet, visor, join, this.stateLight);
    this.group.position.copy(spawn);
    this.zones = { plate: this.body, helmet, join };
    for (const z of Object.values(this.zones)) z.userData.rig = this;
  }

  /** Player weapon hit on one of this rig's zone meshes. */
  takeHit(zone: HitZone, base: number, distanceM: number): RoutedDamage {
    const r = route({ cls: DamageClass.BallLong, zone, base, distanceM });
    this.plateHp -= r.breath;
    this.coreHp -= r.binding;
    // Being fired upon: the ONLY drill skip (Lock §17).
    const p = this.group.position;
    this.ai.perceive({ kind: 'attacked', x: p.x, z: p.z });
    if (r.feedback.includes('stagger')) this.group.position.add(new THREE.Vector3(0, 0, 0.001)); // posture stagger hook
    if ((this.plateHp <= 0 && this.coreHp <= 30) || this.coreHp <= 0) this.die();
    return r;
  }

  private die() {
    if (this.dead) return;
    this.dead = true;
    // Radio-still-talking beat: if mid-call, the set dies with the caller.
    if (this.ai.radio?.audible) { this.ai.radio.interrupt(); this.hooks.onRadioTone(false); }
    this.deadT = 0;
  }

  /**
   * Doctrine tick. senses: sight strength (0/partial/1) + player pos when sensed.
   */
  tick(dt: number, player: THREE.Vector3, sight: number, heardNoiseAt: THREE.Vector3 | null) {
    if (this.dead) {
      // Grounded fold — brief, unglorified (BVII §12).
      this.deadT += dt;
      const k = Math.min(1, this.deadT / 0.6);
      this.group.rotation.x = -k * (Math.PI / 2) * 0.9;
      this.group.position.y = -0.2 * k;
      return;
    }

    const p = this.group.position;
    if (sight > 0) this.ai.perceive({ kind: 'sight', x: player.x, z: player.z, strength: sight });
    else if (heardNoiseAt) this.ai.perceive({ kind: 'sound', x: heardNoiseAt.x, z: heardNoiseAt.z });
    this.ai.tick(dt, sight >= 0.99);

    // Radio tone (audible, interruptible — the player can silence the caller).
    const audible = !!this.ai.radio?.audible;
    if (audible !== this.radioWasAudible) { this.hooks.onRadioTone(audible); this.radioWasAudible = audible; }

    // --- posture proxies (state ↔ posture 1:1 LAW) + steering.
    const st = this.ai.state;
    const colors: Record<AIState, number> = {
      [AIState.Unaware]: 0x888888, [AIState.Curious]: 0xd9a226, [AIState.Engaged]: 0xa6231c,
      [AIState.Searching]: 0xc2a44e, [AIState.Filed]: 0xe8e4da,
    };
    (this.stateLight.material as THREE.MeshBasicMaterial).color.setHex(colors[st]);

    let target: THREE.Vector3 | null = null;
    let crouched = false;
    switch (st) {
      case AIState.Unaware:
        target = this.coverSlot; // walk the rotation to the assigned post
        break;
      case AIState.Curious:
        target = heardNoiseAt ?? this.coverSlot;
        break;
      case AIState.Engaged: {
        target = this.coverSlot;
        crouched = this.ai.drillStage === DrillStage.Posture || this.ai.drillStage === DrillStage.Fire;
        // Face the player; announce bark once.
        this.group.lookAt(player.x, this.group.position.y, player.z);
        if (this.ai.drillStage === DrillStage.Announce && !this.barked) {
          this.barked = true;
          this.hooks.onBark(this.elite ? 'HOLD.' : 'COMPLY AND THIS IS A CITATION.');
        }
        if (this.ai.canFire) {
          this.fireTimer -= dt;
          if (this.fireTimer <= 0) {
            this.fireTimer = this.elite ? 0.9 : 1.3; // burst cadence, doctrine-calm
            const muzzle = p.clone().add(new THREE.Vector3(0, 1.4, 0));
            this.hooks.onShoot(muzzle);
          }
        }
        break;
      }
      case AIState.Searching:
        target = heardNoiseAt ?? new THREE.Vector3(player.x, 0, player.z); // LKP held by core
        break;
      case AIState.Filed:
        this.ai.resumePatrol();
        target = this.coverSlot;
        break;
    }

    // Steering: walk toward target, stop at 1.5 m (posts, not bumper cars).
    if (target) {
      const d = new THREE.Vector3(target.x - p.x, 0, target.z - p.z);
      const dist = d.length();
      if (dist > 1.5) {
        d.normalize();
        p.x += d.x * this.speed * dt;
        p.z += d.z * this.speed * dt;
        if (st !== AIState.Engaged) this.group.lookAt(p.x + d.x, p.y, p.z + d.z);
      }
    }
    // Posture: crouch scale (drill POSTURE/FIRE reads at silhouette range).
    const targetScale = crouched ? 0.82 : 1;
    this.body.scale.y += (targetScale - this.body.scale.y) * Math.min(1, dt * 10);
  }

  private barked = false;
}
