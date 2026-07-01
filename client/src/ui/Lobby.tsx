/** Lobby.tsx — Pre-match room: shareable link, roster, mode, chat, start. */
import { useState } from 'react';
import { useStore } from '../store';
import type { Net } from '../engine/Net';
import type { GameMode } from '../shared/protocol';

const MODE_LABEL: Record<GameMode, string> = { coop: 'CO-OP SURVIVAL', ffa: 'FREE FOR ALL', tdm: 'TEAM DEATHMATCH' };

export function Lobby({ net, onStart, onLeave }: { net: Net | null; onStart: () => void; onLeave: () => void }) {
  const mp = useStore((s) => s.mp);
  const [chatText, setChatText] = useState('');
  const [copied, setCopied] = useState(false);
  const snap = mp.snapshot;
  const link = `${location.origin}/room/${mp.roomCode ?? ''}`;

  function copy() {
    navigator.clipboard?.writeText(link).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  }
  function sendChat() {
    if (chatText.trim()) { net?.chat(chatText.trim()); setChatText(''); }
  }

  const canStart = mp.isHost && (snap?.players.length ?? 0) >= 1;

  return (
    <div className="overlay">
      <button className="btn ghost small back" onClick={onLeave}>◂ Leave</button>
      <div className="tagline">Room</div>
      <div className="roomcode">{mp.roomCode}</div>

      <div className="lobby-grid">
        <div className="panel">
          <div className="row">
            <label>Share link</label>
            <span className="val" style={{ minWidth: 0, flex: 1, textAlign: 'left', color: 'var(--accent)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{link}</span>
            <button className="btn ghost small" onClick={copy}>{copied ? 'Copied!' : 'Copy'}</button>
          </div>
          <div className="row">
            <label>Mode</label>
            {mp.isHost ? (
              <select value={snap?.mode ?? 'coop'} onChange={(e) => net?.setMode(e.target.value as GameMode)}>
                {(['coop', 'ffa', 'tdm'] as GameMode[]).map((m) => <option key={m} value={m}>{MODE_LABEL[m]}</option>)}
              </select>
            ) : <span className="val">{MODE_LABEL[snap?.mode ?? 'coop']}</span>}
          </div>

          <h2 style={{ marginTop: 14 }}>Squad ({snap?.players.length ?? 0})</h2>
          <div className="playerlist">
            {snap?.players.map((p) => (
              <div className="pl" key={p.id}>
                <span className="dot" style={{ background: `#${p.color.toString(16).padStart(6, '0')}` }} />
                <span className="nm">{p.name}{p.id === mp.selfId ? ' (you)' : ''}{p.id === snap.hostId ? ' · host' : ''}</span>
                {snap.mode === 'tdm' && <span className="rd" style={{ color: p.team === 'red' ? 'var(--danger)' : 'var(--accent)' }}>{p.team.toUpperCase()}</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h2>Comms</h2>
          <div className="chatbox">
            {mp.chat.map((c, i) => <div className="cl" key={i}><b>{c.from}:</b> {c.text}</div>)}
            {mp.chat.length === 0 && <div className="hintline">No messages yet.</div>}
          </div>
          <div className="chat-input">
            <input type="text" value={chatText} placeholder="Message squad…" maxLength={200}
              onChange={(e) => setChatText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendChat()} />
            <button className="btn ghost small" onClick={sendChat}>Send</button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        {mp.isHost
          ? <button className="btn" disabled={!canStart} onClick={onStart}>Start Match</button>
          : <div className="tagline">Waiting for host to start…</div>}
      </div>
      <div className="hintline" style={{ marginTop: 10 }}>Ping {mp.ping} ms</div>
    </div>
  );
}
