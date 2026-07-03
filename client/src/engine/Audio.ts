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

  /* Staged reload foley — called by the weapon at the matching animation
   * beats, so what you hear tracks what the hands are doing. */
  magOut() {           // release lever snap + mag sliding free
    this.tone(340, 0.04, 'square', 0.16);
    this.noise(0.12, 0.14, 1200);
    setTimeout(() => this.tone(150, 0.07, 'triangle', 0.12), 60);
  }
  magIn() {            // mag body slap + seat click
    this.noise(0.05, 0.16, 700);
    this.tone(120, 0.08, 'sine', 0.22);
    setTimeout(() => this.tone(480, 0.035, 'square', 0.16), 70);
  }
  boltRack() {         // charging handle back + slam forward
    this.tone(900, 0.03, 'square', 0.14);
    this.noise(0.06, 0.16, 2400);
    setTimeout(() => { this.tone(620, 0.04, 'square', 0.18); this.noise(0.05, 0.18, 1500); }, 95);
  }
  reload() { this.magOut(); }  // legacy single-shot alias
  throwSwish() {       // grenade toss: air swish + strap noise
    this.noise(0.16, 0.16, 2600);
    setTimeout(() => this.noise(0.1, 0.08, 900), 60);
  }
  impact(material: 'concrete' | 'metal' | 'glass', dist = 0) {
    if (material === 'glass') { this.noise(0.25, 0.3, 3200, dist); this.tone(2400, 0.08, 'triangle', 0.1, dist); }
    else if (material === 'metal') { this.tone(1400, 0.05, 'square', 0.12, dist); this.noise(0.05, 0.2, 2200, dist); }
    else this.noise(0.06, 0.22, 800, dist);
  }
  hitmarker(head: boolean) { this.tone(head ? 1000 : 620, 0.05, 'triangle', 0.14); }
  kill() { this.tone(440, 0.08, 'square', 0.12); setTimeout(() => this.tone(720, 0.1, 'square', 0.1), 70); }
  hurt() { this.tone(130, 0.18, 'sawtooth', 0.2); }
  pickup() { this.tone(520, 0.06, 'triangle', 0.14); setTimeout(() => this.tone(820, 0.08, 'triangle', 0.12), 70); }
  footstep(metal: boolean) {
    // Two-layer step: low body thump + surface texture, pitch-jittered per
    // step so runs don't sound like a machine gun of identical clicks.
    const jitter = 0.85 + Math.random() * 0.3;
    this.tone((metal ? 95 : 70) * jitter, 0.06, 'sine', metal ? 0.1 : 0.12);
    this.noise(0.055, metal ? 0.09 : 0.06, (metal ? 2100 : 620) * jitter);
    if (metal && Math.random() < 0.3) this.tone(1500 * jitter, 0.03, 'triangle', 0.04); // grate ring
  }
  waveHorn() { this.tone(160, 0.5, 'sawtooth', 0.16); setTimeout(() => this.tone(240, 0.6, 'sawtooth', 0.14), 120); }

  /* ---- per-map ambient bed: looping filtered noise + slow LFO drift ---- */
  private ambientNodes: AudioNode[] = [];
  ambient(theme: string) {
    this.stopAmbient();
    if (!this.ctx || !this.master || !this.noiseBuffer) return;
    const mk = (filterType: BiquadFilterType, hz: number, gain: number, lfoHz = 0, lfoDepth = 0) => {
      const src = this.ctx!.createBufferSource();
      src.buffer = this.noiseBuffer; src.loop = true;
      const filt = this.ctx!.createBiquadFilter();
      filt.type = filterType; filt.frequency.value = hz; filt.Q.value = 0.6;
      const g = this.ctx!.createGain(); g.gain.value = gain;
      src.connect(filt); filt.connect(g); g.connect(this.master!);
      if (lfoHz > 0) {   // slow wander so wind breathes instead of hissing flat
        const lfo = this.ctx!.createOscillator(); lfo.frequency.value = lfoHz;
        const lg = this.ctx!.createGain(); lg.gain.value = lfoDepth;
        lfo.connect(lg); lg.connect(filt.frequency); lfo.start();
        this.ambientNodes.push(lfo, lg);
      }
      src.start();
      this.ambientNodes.push(src, filt, g);
    };
    const hum = (hz: number, gain: number) => {
      const o = this.ctx!.createOscillator(); o.type = 'sine'; o.frequency.value = hz;
      const g = this.ctx!.createGain(); g.gain.value = gain;
      o.connect(g); g.connect(this.master!); o.start();
      this.ambientNodes.push(o, g);
    };
    switch (theme) {
      case 'sanctum':    mk('lowpass', 240, 0.035); hum(50, 0.012); break;                 // warm room tone + HVAC
      case 'lighthouse': hum(55, 0.02); hum(110, 0.008); mk('lowpass', 160, 0.02); break;  // deep building hum
      case 'atrium':     mk('bandpass', 950, 0.035, 0.13, 260); mk('highpass', 5200, 0.012); break; // drizzle + mist hiss
      case 'skyfall':    mk('bandpass', 700, 0.045, 0.08, 420); break;                     // high lonely wind
      case 'bastion':    mk('bandpass', 480, 0.04, 0.1, 260); mk('lowpass', 120, 0.02); break; // moor wind + far rumble
    }
  }
  stopAmbient() {
    for (const n of this.ambientNodes) {
      try { (n as OscillatorNode | AudioBufferSourceNode).stop?.(); } catch { /* already stopped */ }
      try { n.disconnect(); } catch { /* detached */ }
    }
    this.ambientNodes = [];
  }

  dispose() { this.stopAmbient(); this.ctx?.close(); this.ctx = null; }
}
