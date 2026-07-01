/** Pause.tsx — In-match pause menu (single-player pauses the sim; in MP the
    world keeps running server-side, so this is an overlay only). */
export function PauseMenu({ onResume, onSettings, onQuit }: { onResume: () => void; onSettings: () => void; onQuit: () => void }) {
  return (
    <div className="overlay" style={{ zIndex: 24 }}>
      <div className="brand" style={{ fontSize: 44 }}>PAUSED</div>
      <div className="menu-col" style={{ width: 260 }}>
        <button className="btn" onClick={onResume}>Resume</button>
        <button className="btn ghost" onClick={onSettings}>Settings</button>
        <button className="btn ghost" onClick={onQuit}>Quit to Menu</button>
      </div>
    </div>
  );
}
