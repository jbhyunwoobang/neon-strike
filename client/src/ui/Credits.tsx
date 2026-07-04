/** Credits.tsx — Attribution + honest note on scope. */
export function Credits({ onBack }: { onBack: () => void }) {
  return (
    <div className="overlay">
      <button className="btn ghost small back" onClick={onBack}>◂ Back</button>
      <div className="brand" style={{ fontSize: 46 }}>CREDITS</div>
      <div className="panel credits" style={{ marginTop: 20 }}>
        <p>
          <b>NEON STRIKE</b> — a browser-native, AAA-inspired FPS.<br />
          Design, engine, netcode & UI built as an open reference project.
        </p>
        <p>
          <b>Engine:</b> Three.js (WebGL) · custom render, movement, weapon,
          AI and effects systems.<br />
                    <b>UI:</b> React + TypeScript + Zustand.
        </p>
        <p>
          Audio is fully procedural (Web Audio API) — no external assets, so the
          whole game streams in seconds. The brutalist megacity is generated
          procedurally from a per-match seed.
        </p>
        <p style={{ fontSize: 12.5 }}>
          Built with Claude Code. MIT licensed — fork it, learn from it, ship
          your own. See the repo README for architecture & deployment.
        </p>
      </div>
    </div>
  );
}
