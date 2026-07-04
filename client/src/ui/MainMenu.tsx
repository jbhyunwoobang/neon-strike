/** MainMenu.tsx — Title screen with mode selection, controls and best score. */
import { useStore } from '../store';

interface Props {
  onSolo: () => void;
  onProving: () => void;
  onRegistry: () => void;
  onCast: () => void;
  onSettings: () => void;
  onCredits: () => void;
}

export function MainMenu({ onSolo, onProving, onRegistry, onCast, onSettings, onCredits }: Props) {
  const best = useStore((s) => s.bestScore);

  return (
    <div className="overlay">
      <div className="brand">ECHOES OF EDEN</div>
      <div className="tagline">Brutalist Megacity · 2095</div>

      <div className="menu-col">
        <button className="btn" onClick={onSolo}>Single Player</button>
        <button className="btn ghost" onClick={onProving}>The Acre — Covenant Proving</button>
        <button className="btn ghost" onClick={onRegistry}>The Registry</button>
        <button className="btn ghost" onClick={onCast}>The Cast</button>
        <button className="btn ghost" onClick={onSettings}>Settings</button>
        <button className="btn ghost" onClick={onCredits}>Credits</button>
      </div>

      <div className="controls-help">
        <span><b>WASD</b> Move</span>
        <span><b>Mouse / Drag / Arrows</b> Look</span>
        <span><b>LMB</b> Fire</span>
        <span><b>RMB</b> Aim</span>
        <span><b>Shift</b> Sprint</span>
        <span><b>Ctrl</b> Crouch</span>
        <span><b>C</b> Slide</span>
        <span><b>Space</b> Jump / Vault</span>
        <span><b>Q / E</b> Lean</span>
        <span><b>1-9</b> Weapons</span>
        <span><b>R</b> Reload</span>
        <span><b>V</b> Fire mode</span>
        <span><b>Esc</b> Pause</span>
      </div>

      {best > 0 && (
        <div className="scores">
          <div className="srow"><span>BEST SCORE</span><b>{best.toLocaleString()}</b></div>
        </div>
      )}
    </div>
  );
}
