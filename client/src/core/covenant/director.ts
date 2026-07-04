/**
 * core/covenant/director.ts — the covenant wave director v1 (Sprint 002 C2).
 *
 * The loop's heart: a protected thing + a green unit banking charge + waves
 * arriving on doctrine. LAWS:
 *  - The director schedules SPAWN ORDERS only; AI stays autonomous (it never
 *    aims, buffs, or cheats units).
 *  - Escalation is composition, never HP inflation.
 *  - Pressure is mechanical: hostiles standing inside the acre slow the bank.
 *  - The sapling is damageable by the PLAYER and no one is exempt from the
 *    consequence (Book V LAW 4-D): its death fails the covenant, full stop.
 *  - Winning = the charge banks AND the last wave resolves. Kills are not
 *    scored; no kill-score field exists (Book X §21.4).
 */

export interface SpawnOrder {
  /** Unit key from the Book VII roster (data, not class). */
  unit: 'line-warden' | 'first-class' | 'surveyor';
  /** Arrival route marker id — staged, watchable (LAW 6-B). */
  route: string;
}

export interface WaveSpec {
  orders: SpawnOrder[];
  /** Seconds after the previous wave resolves (the designed breath, 15–25 s). */
  breathS: number;
}

export interface CovenantConfig {
  bankTarget: number;
  /** Charge banked per second, unpressured. */
  bankRatePerS: number;
  /** Bank multiplier while hostiles stand inside the acre radius. */
  pressureFactor: number;
  waves: WaveSpec[];
}

export const ACRE_PROVING: CovenantConfig = {
  bankTarget: 100,
  bankRatePerS: 1.0,
  pressureFactor: 0.35,
  waves: [
    { orders: [{ unit: 'line-warden', route: 'N' }, { unit: 'line-warden', route: 'N' }], breathS: 0 },
    { orders: [{ unit: 'first-class', route: 'N' }, { unit: 'line-warden', route: 'SW' }], breathS: 20 },
    {
      orders: [
        { unit: 'line-warden', route: 'SW' }, { unit: 'line-warden', route: 'SE' },
        { unit: 'line-warden', route: 'N' }, { unit: 'line-warden', route: 'N' },
      ],
      breathS: 20,
    },
  ],
};

export type CovenantPhase = 'idle' | 'banking' | 'breath' | 'won' | 'failed';

export interface CovenantSample {
  phase: CovenantPhase;
  bank: number;
  waveIndex: number;
  /** Orders emitted this tick — the encounter layer stages the arrivals. */
  spawns: SpawnOrder[];
}

export interface FieldReport {
  /** Hostiles currently alive from issued orders. */
  hostilesAlive: number;
  /** Hostiles standing inside the acre radius (pressure rule). */
  hostilesInAcre: number;
  saplingAlive: boolean;
}

export class CovenantDirector {
  private cfg: CovenantConfig;
  private phase: CovenantPhase = 'idle';
  private bank = 0;
  private wave = -1;
  private breathT = 0;
  private waveOutstanding = false;

  constructor(cfg: CovenantConfig) { this.cfg = cfg; }

  /** The plant/start hold-verb completed → the covenant begins. */
  start(): void {
    if (this.phase === 'idle') { this.phase = 'banking'; this.wave = -1; this.breathT = 0; }
  }

  tick(dt: number, field: FieldReport): CovenantSample {
    const spawns: SpawnOrder[] = [];

    if (!field.saplingAlive && this.phase !== 'idle' && this.phase !== 'won') {
      this.phase = 'failed'; // LAW 4-D: the covenant is real
    }

    switch (this.phase) {
      case 'banking': {
        const pressured = field.hostilesInAcre > 0;
        this.bank = Math.min(
          this.cfg.bankTarget,
          this.bank + this.cfg.bankRatePerS * (pressured ? this.cfg.pressureFactor : 1) * dt,
        );

        // Wave scheduling: next wave launches when the previous one resolves.
        if (!this.waveOutstanding && this.wave < this.cfg.waves.length - 1) {
          if (this.breathT > 0) {
            this.breathT -= dt;
          } else {
            this.wave += 1;
            spawns.push(...this.cfg.waves[this.wave].orders);
            this.waveOutstanding = true;
          }
        }
        if (this.waveOutstanding && field.hostilesAlive === 0) {
          this.waveOutstanding = false;
          const next = this.cfg.waves[this.wave + 1];
          this.breathT = next ? next.breathS : 0;
        }

        const wavesDone = !this.waveOutstanding && this.wave >= this.cfg.waves.length - 1;
        if (this.bank >= this.cfg.bankTarget && wavesDone) this.phase = 'won';
        break;
      }
      default:
        break;
    }

    return { phase: this.phase, bank: this.bank, waveIndex: this.wave, spawns };
  }
}
