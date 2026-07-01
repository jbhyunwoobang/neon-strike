/**
 * Audio.ts — Procedural sound via the Web Audio API (zero asset downloads).
 *
 * Every effect is synthesised from oscillators + noise buffers and routed
 * through a master gain that follows the user's volume setting. Positional
 * cues (distance attenuation) are approximated for weapon/impact events so the
 * mix stays readable without a full HRTF panner graph.
 *
 * Swapping in real recorded assets later is a drop-in: replace the synth
 * methods with buffer playback; call sites (Weapons, Enemies, Player) are
 * already event-shaped ("shoot", "reload", "impact", ...).
 */

import { store } from '../store';

export class Audio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  /** Must be called from a user gesture (menu button) to satisfy autoplay policy. */
  resume() {
    if (!this.ctx) this.init();
    this.ctx?.resume();
  }

  private init() {
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = store.get().settings.masterVolume;
      this.master.connect(this.ctx.destination);
      // 1s of white noise reused for gunfire/impacts/wind.
      const len = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    } catch {
      this.ctx = null;
    }
  }

  setVolume(v: number) { if (this.master) this.master.gain.value = v; }

  private now() { return this.ctx?.currentTime ?? 0; }

  private tone(freq: number, dur: number, type: OscillatorType, gain: number, dist = 0) {
    if (!this.ctx || !this.master) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type; o.frequency.value = freq;
    const vol = gain * Math.max(0.15, 1 - dist / 120);
    const t = this.now();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t + dur);
  }

  private noise(dur: number, gain: number, filterHz: number, dist = 0) {
    if (!this.ctx || !this.master || !this.noiseBuffer) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filt = this.ctx.createBiquadFilter();
    filt.type = 'bandpass'; filt.frequency.value = filterHz; filt.Q.value = 0.8;
    const g = this.ctx.createGain();
    const vol = gain * Math.max(0.12, 1 - dist / 120);
    const t = this.now();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filt); filt.connect(g); g.connect(this.master);
    src.start(t); src.stop(t + dur);
  }

  /* ---- event API ---- */

  shoot(caliber: 'light' | 'heavy' | 'shotgun', dist = 0) {
    if (caliber === 'shotgun') { this.noise(0.18, 0.5, 700, dist); this.tone(70, 0.16, 'sawtooth', 0.3, dist); }
    else if (caliber === 'heavy') { this.noise(0.12, 0.4, 900, dist); this.tone(90, 0.12, 'sawtooth', 0.28, dist); }
    else { this.noise(0.07, 0.32, 1600, dist); this.tone(180, 0.07, 'square', 0.18, dist); }
  }
  dryFire() { this.tone(1200, 0.03, 'square', 0.08); }
  reload() { this.tone(320, 0.05, 'square', 0.12); setTimeout(() => this.tone(200, 0.05, 'square', 0.1), 90); setTimeout(() => this.tone(520, 0.06, 'square', 0.12), 240); }
  impact(material: 'concrete' | 'metal' | 'glass', dist = 0) {
    if (material === 'glass') { this.noise(0.25, 0.3, 3200, dist); this.tone(2400, 0.08, 'triangle', 0.1, dist); }
    else if (material === 'metal') { this.tone(1400, 0.05, 'square', 0.12, dist); this.noise(0.05, 0.2, 2200, dist); }
    else this.noise(0.06, 0.22, 800, dist);
  }
  hitmarker(head: boolean) { this.tone(head ? 1000 : 620, 0.05, 'triangle', 0.14); }
  kill() { this.tone(440, 0.08, 'square', 0.12); setTimeout(() => this.tone(720, 0.1, 'square', 0.1), 70); }
  hurt() { this.tone(130, 0.18, 'sawtooth', 0.2); }
  pickup() { this.tone(520, 0.06, 'triangle', 0.14); setTimeout(() => this.tone(820, 0.08, 'triangle', 0.12), 70); }
  footstep(metal: boolean) { this.noise(0.05, metal ? 0.06 : 0.04, metal ? 1800 : 500); }
  waveHorn() { this.tone(160, 0.5, 'sawtooth', 0.16); setTimeout(() => this.tone(240, 0.6, 'sawtooth', 0.14), 120); }

  dispose() { this.ctx?.close(); this.ctx = null; }
}
