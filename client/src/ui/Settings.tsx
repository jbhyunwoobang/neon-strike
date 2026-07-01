/** Settings.tsx — Graphics, audio, sensitivity and keybind configuration.
    All changes persist via the store (localStorage). */
import { useState } from 'react';
import { useStore, type Quality, type Keybinds } from '../store';

const QUALITIES: Quality[] = ['low', 'medium', 'high', 'ultra'];
const BIND_LABELS: Record<keyof Keybinds, string> = {
  forward: 'Move Forward', back: 'Move Back', left: 'Strafe Left', right: 'Strafe Right',
  jump: 'Jump / Vault', crouch: 'Crouch', sprint: 'Sprint', reload: 'Reload',
  slide: 'Slide', interact: 'Interact',
};

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const settings = useStore((s) => s.settings);
  const update = useStore((s) => s.updateSettings);
  const setKeybind = useStore((s) => s.setKeybind);
  const reset = useStore((s) => s.resetSettings);
  const [listening, setListening] = useState<keyof Keybinds | null>(null);

  function captureKey(e: React.KeyboardEvent) {
    if (!listening) return;
    e.preventDefault();
    setKeybind(listening, e.code);
    setListening(null);
  }

  return (
    <div className="overlay" onKeyDown={captureKey} tabIndex={0}>
      <button className="btn ghost small back" onClick={onBack}>◂ Back</button>
      <div className="panel" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <h2>Settings</h2>

        <div className="row">
          <label>Mouse Sensitivity</label>
          <input type="range" min={0.05} max={1.5} step={0.01} value={settings.sensitivity}
            onChange={(e) => update({ sensitivity: +e.target.value })} />
          <span className="val">{settings.sensitivity.toFixed(2)}</span>
        </div>

        <div className="row">
          <label>Field of View</label>
          <input type="range" min={70} max={110} step={1} value={settings.fov}
            onChange={(e) => update({ fov: +e.target.value })} />
          <span className="val">{settings.fov}°</span>
        </div>

        <div className="row">
          <label>Invert Vertical</label>
          <input type="checkbox" checked={settings.invertY} onChange={(e) => update({ invertY: e.target.checked })} />
        </div>

        <div className="row">
          <label>Master Volume</label>
          <input type="range" min={0} max={1} step={0.01} value={settings.masterVolume}
            onChange={(e) => update({ masterVolume: +e.target.value })} />
          <span className="val">{Math.round(settings.masterVolume * 100)}%</span>
        </div>

        <div className="row">
          <label>Graphics Quality</label>
          <select value={settings.quality} onChange={(e) => update({ quality: e.target.value as Quality })}>
            {QUALITIES.map((q) => <option key={q} value={q}>{q.toUpperCase()}</option>)}
          </select>
        </div>

        <div className="row">
          <label>Show FPS</label>
          <input type="checkbox" checked={settings.showFps} onChange={(e) => update({ showFps: e.target.checked })} />
        </div>

        <h2 style={{ marginTop: 20 }}>Keybinds</h2>
        {(Object.keys(BIND_LABELS) as (keyof Keybinds)[]).map((k) => (
          <div className="row" key={k}>
            <label>{BIND_LABELS[k]}</label>
            <button className="btn ghost small" onClick={() => setListening(k)}>
              {listening === k ? 'Press a key…' : settings.keybinds[k].replace('Key', '').replace('Left', ' L').replace('Digit', '')}
            </button>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button className="btn ghost small" onClick={reset}>Reset Defaults</button>
          <div className="hintline">Quality changes apply to the next match.</div>
        </div>
      </div>
    </div>
  );
}
