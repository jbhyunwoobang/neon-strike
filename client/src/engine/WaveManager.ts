/**
 * WaveManager.ts — Single-player "wave survival" director.
 *
 * Owns wave count + difficulty scaling and drips enemies into the local
 * EnemyManager. Composition follows the design brief:
 *   waves 1–3   grunts (slow, simple)
 *   waves 4–6   + soldiers (ranged), tougher
 *   waves 7–10  + drones + shields, flanking
 *   waves 11+   + heavies, larger groups
 *   every 5th   a boss leads the wave
 *
 * Enemy spawns pick ring positions away from the player. Wave transitions fire
 * callbacks the HUD/audio hook into (horn, toast, counter).
 */

import * as THREE from 'three';
import type { EnemyManager } from './Enemies';

interface Ctx {
  enemies: EnemyManager;
  getPlayerPos: () => THREE.Vector3;
  onWaveChange: (wave: number, enemyCount: number) => void;
  onToast: (msg: string) => void;
  onWaveHorn: () => void;
}

export class WaveManager {
  wave = 0;
  private ctx: Ctx;
  private pending = 0;
  private spawnTimer = 0;
  private breakTimer = 0;
  active = false;

  constructor(ctx: Ctx) { this.ctx = ctx; }

  start() {
    this.wave = 0;
    this.active = true;
    this.beginWave(1);
  }

  stop() { this.active = false; }

  get enemyCount() { return this.pending + this.ctx.enemies.count; }

  update(dt: number) {
    if (!this.active) return;

    // Between-wave breather.
    if (this.breakTimer > 0) {
      this.breakTimer -= dt;
      if (this.breakTimer <= 0) this.beginWave(this.wave + 1);
      return;
    }

    // Spawn drip.
    if (this.pending > 0) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnOne();
        this.pending--;
        this.spawnTimer = Math.max(0.28, 1.3 - this.wave * 0.045);
      }
    } else if (this.ctx.enemies.count === 0) {
      // Wave cleared.
      this.ctx.onToast(`WAVE ${this.wave} CLEARED`);
      this.breakTimer = 4.5;
    }
  }

  private beginWave(n: number) {
    this.wave = n;
    const boss = n % 5 === 0;
    const base = 4 + Math.floor(n * 1.8);
    this.pending = boss ? base + 1 : base;
    this.spawnTimer = 0;
    this.ctx.onWaveHorn();
    this.ctx.onToast(boss ? `WAVE ${n} — BOSS INCOMING` : `WAVE ${n}`);
    this.ctx.onWaveChange(n, this.enemyCount);
    this.bossQueued = boss;
  }

  private bossQueued = false;

  private spawnOne() {
    const type = this.bossQueued ? 'boss' : this.pickType();
    if (this.bossQueued) this.bossQueued = false;

    const player = this.ctx.getPlayerPos();
    // Spawn on a ring, biased away from the player.
    let x = 0, z = 0, tries = 0;
    do {
      const a = Math.random() * Math.PI * 2;
      const r = 55 + Math.random() * 35;
      x = Math.cos(a) * r; z = Math.sin(a) * r;
      tries++;
    } while (tries < 8 && Math.hypot(x - player.x, z - player.z) < 22);

    this.ctx.enemies.spawnLocal(type, THREE.MathUtils.clamp(x, -92, 92), THREE.MathUtils.clamp(z, -92, 92));
    this.ctx.onWaveChange(this.wave, this.enemyCount);
  }

  private pickType(): string {
    const n = this.wave;
    const r = Math.random();
    if (n >= 11 && r < 0.16) return 'heavy';
    if (n >= 7 && r < 0.3) return Math.random() > 0.5 ? 'drone' : 'shield';
    if (n >= 4 && r < 0.5) return 'soldier';
    return 'grunt';
  }
}
