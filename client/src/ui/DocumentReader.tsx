/**
 * DocumentReader.tsx — the paper reader (S003 P2; Registry-drawer grammar).
 * Documents render as in-world facsimiles: paper ground, ink text, serif
 * small-caps title [B0 §9-UI]. Close: click, F, or Esc. No paraphrase, ever.
 */
import { useEffect } from 'react';
import { useStore, store } from '../store';

export function DocumentReader() {
  const doc = useStore((s) => s.reading);
  useEffect(() => {
    if (!doc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'KeyF') store.get().setReading(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [doc]);
  if (!doc) return null;
  return (
    <div
      onClick={() => store.get().setReading(null)}
      style={{
        position: 'fixed', inset: 0, zIndex: 60, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'rgba(28,29,30,0.55)', cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: 'min(520px, 86vw)', maxHeight: '78vh', overflowY: 'auto',
          background: '#D8D2C4', color: '#1A1916', padding: '34px 38px',
          boxShadow: '0 18px 60px rgba(0,0,0,0.5)',
          borderTop: '3px double #1A1916', borderBottom: '3px double #1A1916',
          fontFamily: 'Georgia, serif', lineHeight: 1.55, fontSize: 15,
        }}
      >
        {doc.kicker && (
          <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.65, marginBottom: 10 }}>
            {doc.kicker.toUpperCase()}
          </div>
        )}
        <div style={{ fontVariant: 'small-caps', fontSize: 20, letterSpacing: 1, marginBottom: 14 }}>
          {doc.title}
        </div>
        <div style={{ whiteSpace: 'pre-wrap' }}>{doc.body}</div>
        <div style={{ marginTop: 22, fontSize: 11, letterSpacing: 2, opacity: 0.5 }}>
          [F] CLOSE
        </div>
      </div>
    </div>
  );
}
