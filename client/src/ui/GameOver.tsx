/** GameOver.tsx — End-of-match summary + restart/menu (single-player). */
import { useStore } from '../store';
import type { Game } from '../engine/Game';

export function GameOver({ game, onRestart, onMenu }: { game: Game | null; onRestart: () => void; onMenu: () => void }) {
  const best = useStore((s) => s.bestScore);
  const score = game?.finalScore ?? 0;
  const kills = game?.finalKills ?? 0;
  const wave = game?.finalWave ?? 0;

  return (
    <div className="overlay">
      <div className="brand gameover-title">TERMINATED</div>

      <div className="scores" style={{ marginTop: 18 }}>
        <div className="srow"><span>Score</span><b>{score.toLocaleString()}</b></div>
        <div className="srow"><span>Kills</span><b>{kills}</b></div>
        <div className="srow"><span>Wave Reached</span><b>{wave}</b></div>
        <div className="srow"><span>Best</span><b>{Math.max(best, score).toLocaleString()}</b></div>
      </div>

      <div className="menu-col" style={{ width: 280 }}>
        <button className="btn" onClick={onRestart}>Redeploy</button>
        <button className="btn ghost" onClick={onMenu}>Main Menu</button>
      </div>
    </div>
  );
}
