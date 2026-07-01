/** Loadout.tsx — Pre-deployment weapon + grenade selection. */
import { useStore } from '../store';
import type { GrenadeType } from '../store';
import { WEAPONS } from '../engine/Weapons';

const GRENADES: { id: GrenadeType; name: string; desc: string }[] = [
  { id: 'frag', name: 'FRAG', desc: 'Lethal blast + shrapnel' },
  { id: 'smoke', name: 'SMOKE', desc: 'Concealment screen' },
  { id: 'flash', name: 'FLASHBANG', desc: 'Blinds on line of sight' },
  { id: 'emp', name: 'EMP', desc: 'Stuns machines briefly' },
];

const CAT: Record<string, string> = { light: 'CARBINE', heavy: 'BATTLE', shotgun: 'CQB' };

export function Loadout({ onDeploy, onBack }: { onDeploy: () => void; onBack: () => void }) {
  const loadout = useStore((s) => s.loadout);
  const setLoadout = useStore((s) => s.setLoadout);
  const sel = WEAPONS[loadout.weapon];

  return (
    <div className="overlay">
      <button className="btn ghost small back" onClick={onBack}>◂ Back</button>
      <div className="tagline">Deployment Loadout</div>
      <div className="brand" style={{ fontSize: 40 }}>{sel.name}</div>
      <div className="hintline" style={{ textAlign: 'center', marginTop: -4 }}>
        {sel.melee ? 'MELEE' : `${CAT[sel.caliber] ?? 'RIFLE'} · ${sel.damage} DMG · ${sel.rpm} RPM · ${sel.mag} RD · ${sel.modes.join('/').toUpperCase()}`}
      </div>

      <div className="loadout-grid">
        {WEAPONS.map((w, i) => (
          <button
            key={w.id}
            className={`wcard${i === loadout.weapon ? ' active' : ''}`}
            onClick={() => setLoadout({ weapon: i })}
          >
            <span className="wslot-n">{i + 1}</span>
            <span className="wname2">{w.name}</span>
            <span className="wcat">{w.melee ? 'MELEE' : (CAT[w.caliber] ?? 'RIFLE')}</span>
          </button>
        ))}
      </div>

      <div className="tagline" style={{ marginTop: 22 }}>Tactical · [G] to throw</div>
      <div className="gren-row">
        {GRENADES.map((g) => (
          <button
            key={g.id}
            className={`gcard${g.id === loadout.grenade ? ' active' : ''}`}
            onClick={() => setLoadout({ grenade: g.id })}
          >
            <span className="gname">{g.name}</span>
            <span className="gdesc">{g.desc}</span>
          </button>
        ))}
      </div>

      <button className="btn" style={{ marginTop: 30, minWidth: 260 }} onClick={onDeploy}>Deploy</button>
    </div>
  );
}
