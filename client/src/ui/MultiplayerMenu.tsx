/** MultiplayerMenu.tsx — Username entry + Create/Join room.
    Supports deep-linked /room/CODE joins. */
import { useState } from 'react';
import { useStore } from '../store';
import type { GameMode } from '../shared/protocol';

interface Props {
  serverUrl: string;
  deepCode: string | null;
  onHost: (name: string, mode: GameMode) => void;
  onJoin: (name: string, code: string) => void;
  onBack: () => void;
}

const MODES: { id: GameMode; label: string; desc: string }[] = [
  { id: 'coop', label: 'Co-op Survival', desc: '2–4 players vs escalating waves' },
  { id: 'ffa', label: 'Free For All', desc: '2–4 players, everyone for themselves' },
  { id: 'tdm', label: 'Team Deathmatch', desc: '2–4 players, red vs blue' },
];

export function MultiplayerMenu({ serverUrl, deepCode, onHost, onJoin, onBack }: Props) {
  const savedName = useStore((s) => s.username);
  const error = useStore((s) => s.mp.error);
  const [name, setName] = useState(savedName);
  const [code, setCode] = useState(deepCode ?? '');
  const [mode, setMode] = useState<GameMode>('coop');
  const [busy, setBusy] = useState(false);

  const wrap = (fn: () => void) => { setBusy(true); fn(); setTimeout(() => setBusy(false), 1500); };

  return (
    <div className="overlay">
      <button className="btn ghost small back" onClick={onBack}>◂ Back</button>
      <div className="brand" style={{ fontSize: 46 }}>MULTIPLAYER</div>
      <div className="tagline">Server: {serverUrl.replace(/^https?:\/\//, '')}</div>

      <div className="panel" style={{ marginTop: 24 }}>
        <div className="row">
          <label>Callsign</label>
          <input type="text" maxLength={16} value={name} onChange={(e) => setName(e.target.value)} placeholder="Operator" />
        </div>

        <h2 style={{ marginTop: 18 }}>Host a Room</h2>
        {MODES.map((m) => (
          <label className="row" key={m.id} style={{ cursor: 'pointer' }}>
            <span>
              <input type="radio" name="mode" checked={mode === m.id} onChange={() => setMode(m.id)} style={{ marginRight: 10 }} />
              <b style={{ color: mode === m.id ? 'var(--accent)' : undefined }}>{m.label}</b>
              <div className="hintline">{m.desc}</div>
            </span>
          </label>
        ))}
        <button className="btn" style={{ width: '100%', marginTop: 14 }} disabled={busy || !name.trim()}
          onClick={() => wrap(() => onHost(name.trim(), mode))}>Create Room</button>

        <h2 style={{ marginTop: 22 }}>Join a Room</h2>
        <div className="row" style={{ borderBottom: 'none' }}>
          <input type="text" placeholder="ROOM CODE" maxLength={6} value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())} style={{ letterSpacing: 4, flex: 1 }} />
          <button className="btn ghost" disabled={busy || !name.trim() || code.length < 4}
            onClick={() => wrap(() => onJoin(name.trim(), code))}>Join</button>
        </div>

        {error && <div className="error">{error}</div>}
        <div className="hintline">Share your room link — friends who open it drop straight into your lobby.</div>
      </div>
    </div>
  );
}
