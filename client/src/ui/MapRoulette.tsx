/**
 * MapRoulette.tsx — Pre-match horizontal map reveal.
 *
 * When a match starts, a strip of map-name cards sweeps horizontally and
 * decelerates onto the chosen map (slot-machine style, but linear — no wheel),
 * holds a beat, then fades out over live gameplay. Driven by hud.mapName,
 * which Game sets to "NAME#seed" so repeat maps still re-trigger.
 */
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { MAP_NAMES, MAP_THEMES } from '../engine/Arena';

const CARD_W = 250; // must match .mr-card width + margins in CSS

export function MapRoulette() {
  const raw = useStore((s) => s.hud.mapName);
  const mapName = raw.split('#')[0];
  const [phase, setPhase] = useState<'hidden' | 'spin' | 'landed' | 'fade'>('hidden');
  const [offset, setOffset] = useState(0);
  const strip = useRef<string[]>([]);

  useEffect(() => {
    if (!raw) { setPhase('hidden'); return; }
    const names = MAP_THEMES.map((t) => MAP_NAMES[t]);
    const s: string[] = [];
    for (let i = 0; i < 4; i++) s.push(...names);     // the pass-bys
    s.push(names[(names.indexOf(mapName) + 3) % names.length], mapName); // land on the real one
    strip.current = s;
    setOffset(0);
    setPhase('spin');
    // Two rAFs so the strip mounts at offset 0 before the transition kicks in.
    requestAnimationFrame(() => requestAnimationFrame(() => setOffset((s.length - 1) * CARD_W)));
    const t1 = setTimeout(() => setPhase('landed'), 2400);
    const t2 = setTimeout(() => setPhase('fade'), 3400);
    const t3 = setTimeout(() => setPhase('hidden'), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw]);

  if (phase === 'hidden' || !raw) return null;
  return (
    <div className={`map-roulette ${phase}`}>
      <div className="mr-label">COMBAT ZONE</div>
      <div className="mr-window">
        <div className="mr-strip" style={{ transform: `translateX(${-offset}px)` }}>
          {strip.current.map((n, i) => (
            <div key={i} className={`mr-card${i === strip.current.length - 1 && phase !== 'spin' ? ' final' : ''}`}>{n}</div>
          ))}
        </div>
        <div className="mr-marker" />
      </div>
    </div>
  );
}
