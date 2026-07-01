/** GameOver.tsx — End-of-match summary + restart/menu. */
import { useStore } from '../store';
import type { Game } from '../engine/Game';
import type { GameMode } from '../shared/protocol';

export function GameOver({ game, mode, onRestart, onMenu }: { game: Game | null; mode: GameMode; onRestart: () => void; onMenu: () => void }) {
  const best = useStore((s) => s.bestScore);
  const mp = useStore((s) => s.mp);
  const score = game?.finalScore ?? 0;
  const kills = game?.finalKills ?? 0;
  const wave = game?.finalWave ?? 0;
  const isMp = mp.connected;

  return (
    <div className="overlay">
      <div className="brand gameover-title">
        {isMp ? 'MATCH OVER' : 'TERMINATED'}
      </div>

      {!isMp && (
        <div className="scores" style={{ marginTop: 18 }}>
          <div className="srow"><span>Score</span><b>{score.toLocaleString()}</b></div>
          <div className="srow"><span>Kills</span><b>{kills}</b></div>
          <div className="srow"><span>Wave Reached</span><b>{wave}</b></div>
          <div className="srow"><span>Best</span><b>{Math.max(best, score).toLocaleString()}</b></div>
        </div>
      )}

      {isMp && mp.snapshot && (
        <div className="scoreboard" style={{ position: 'static', background: 'none', marginTop: 18 }}>
          <table>
            <thead><tr><th>Operator</th><th>Kills</th><th>Deaths</th><th>Score</th></tr></thead>
            <tbody>
              {[...mp.snapshot.players].sort((a, b) => b.score - a.score).map((p) => (
                <tr key={p.id} style={{ color: p.id === mp.selfId ? 'var(--accent)' : undefined }}>
                  <td>{p.name}</td><td>{p.kills}</td><td>{p.deaths}</td><td>{p.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="menu-col" style={{ width: 280 }}>
        {!isMp && <button className="btn" onClick={onRestart}>Redeploy</button>}
        <button className="btn ghost" onClick={onMenu}>Main Menu</button>
      </div>
    </div>
  );
}
