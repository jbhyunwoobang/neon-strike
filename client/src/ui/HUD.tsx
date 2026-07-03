/** HUD.tsx — In-game heads-up display. Subscribes to the engine-fed HUD store
    slice; all values update every frame from Game.update(). Also renders the
    Tab scoreboard in multiplayer. */
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';

export function Hud() {
  const hud = useStore((s) => s.hud);
  const mp = useStore((s) => s.mp);
  const showFps = useStore((s) => s.settings.showFps);
  const killFeed = mp.killFeed;

  // Hitmarker / damage-flash driven by timestamps set by the engine.
  const [hitOn, setHitOn] = useState(false);
  const [dmgOn, setDmgOn] = useState(false);
  const lastHit = useRef(0); const lastDmg = useRef(0);

  useEffect(() => {
    if (hud.hitmarker && hud.hitmarker !== lastHit.current) {
      lastHit.current = hud.hitmarker; setHitOn(true);
      const t = setTimeout(() => setHitOn(false), 120); return () => clearTimeout(t);
    }
  }, [hud.hitmarker]);
  useEffect(() => {
    if (hud.damageFlash && hud.damageFlash !== lastDmg.current) {
      lastDmg.current = hud.damageFlash; setDmgOn(true);
      const t = setTimeout(() => setDmgOn(false), 120); return () => clearTimeout(t);
    }
  }, [hud.damageFlash]);

  const [flashOn, setFlashOn] = useState(false);
  const lastFlash = useRef(0);
  useEffect(() => {
    if (hud.flash && hud.flash !== lastFlash.current) {
      lastFlash.current = hud.flash; setFlashOn(true);
      const t = setTimeout(() => setFlashOn(false), 1400); return () => clearTimeout(t);
    }
  }, [hud.flash]);

  const [showScores, setShowScores] = useState(false);
  useEffect(() => {
    const d = (e: KeyboardEvent) => { if (e.code === 'Tab') { e.preventDefault(); setShowScores(true); } };
    const u = (e: KeyboardEvent) => { if (e.code === 'Tab') setShowScores(false); };
    window.addEventListener('keydown', d); window.addEventListener('keyup', u);
    return () => { window.removeEventListener('keydown', d); window.removeEventListener('keyup', u); };
  }, []);

  return (
    <div className="hud">
      {dmgOn && <div className="damage-flash" />}
      {flashOn && <div className="flash-white" />}
      {hud.scope && (
        <div className="scope">
          {/* black surround with a circular window, fine crosshair + mil-dots, range stamp */}
          <div className="scope-ring" />
          <div className="scope-cross h" /><div className="scope-cross v" />
          {[-3, -2, -1, 1, 2, 3].map((m) => (
            <span key={'h' + m} className="scope-mil" style={{ left: `calc(50% + ${m * 4.2}vmin)`, top: '50%' }} />
          ))}
          {[-3, -2, -1, 1, 2, 3].map((m) => (
            <span key={'v' + m} className="scope-mil" style={{ top: `calc(50% + ${m * 4.2}vmin)`, left: '50%' }} />
          ))}
          <div className="scope-stamp">RX-9 // 6.0×<br />ZERO 100M</div>
        </div>
      )}
      {!hud.scope && <div className="crosshair"><span className="t u" /><span className="t d" /><span className="t l" /><span className="t r" /><i /></div>}
      {hitOn && <div className="hitmarker" style={{ color: hud.headshot ? 'var(--warn)' : '#fff' }}><span className="h" /><span className="v" /></div>}

      {showFps && <div className="hud-fps">{hud.fps} FPS</div>}
      {mp.connected && <div className="hud-ping">{mp.ping} ms</div>}

      <div className="hud-top">
        <div className="stat score"><span className="k">SCORE</span><span className="v">{hud.score.toLocaleString()}</span></div>
        <div className="stat"><span className="k">WAVE</span><span className="v">{hud.wave}</span></div>
        <div className="stat"><span className="k">KILLS</span><span className="v">{hud.kills}</span></div>
      </div>
      {hud.enemiesLeft > 0 && <div className="wave-pill">{hud.enemiesLeft} HOSTILES</div>}

      {killFeed.length > 0 && (
        <div className="killfeed">
          {killFeed.slice(-5).map((k, i) => <div className="kf" key={k.t + '' + i}>{k.text}</div>)}
        </div>
      )}

      {hud.toast && <div className="toast">{hud.toast}</div>}

      <div className="vitals">
        <div className="label">HEALTH {Math.round(hud.health)}</div>
        <div className="bar hp"><i style={{ width: `${Math.max(0, hud.health)}%` }} /></div>
        {hud.armor > 0 && (<>
          <div className="label">ARMOR {Math.round(hud.armor)}</div>
          <div className="bar ar"><i style={{ width: `${Math.min(100, hud.armor)}%` }} /></div>
        </>)}
      </div>

      <div className="weapon-box">
        <div className="wname">{hud.weapon}</div>
        <div className="ammo">{hud.ammo}<small>/{hud.reserve}</small></div>
        {hud.reloading ? <div className="reloading">RELOADING…</div> : <div className="mode">{hud.fireMode} · [R] RELOAD</div>}
      </div>

      {showScores && mp.connected && (
        <div className="scoreboard">
          <table>
            <thead><tr><th>Operator</th><th>Kills</th><th>Deaths</th><th>Score</th><th>Ping</th></tr></thead>
            <tbody>
              {[...mp.players].sort((a, b) => b.score - a.score).map((p) => (
                <tr key={p.id} style={{ color: p.id === mp.selfId ? 'var(--accent)' : undefined }}>
                  <td>{p.name}</td><td>{p.kills}</td><td>{p.deaths}</td><td>{p.score}</td><td>{p.ping}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
