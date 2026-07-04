/**
 * FrontEnd.tsx — the Front-End Suite (Sprint 004 FE1–FE7).
 *
 * The author's art is front-end canon (user ruling, 2026-07-04): the title key
 * art and every codex/cast image are the designer's own boards; captions use
 * the boards' own printed text. The in-world renderer stays under the bible
 * palette — two registers, one game.
 *
 * Components: TitleScreen (FE1) · SignLedger (FE5, the "login": a name signed
 * into the journal) · Foreword (FE2, the banned book's opening — the "intro
 * video" as motion pages) · Registry (FE3, lore codex) · CastPage (FE4) ·
 * EndCard (FE7, the demo ending + call-to-action).
 */

import { useEffect, useMemo, useState } from 'react';
import { useStore, store } from '../store';

const ART = {
  title: '/art/title.jpg',
  converter: '/art/converter.jpg',
  robot: '/art/robot.jpg',
  vault: '/art/vault.jpg',
  scientist: '/art/scientist.jpg',
  fight: '/art/fight.jpg',
  scene1: '/art/scene1.jpg',
  building: '/art/building.jpg',
};

/* ------------------------------- shared bits ------------------------------ */

const paper: React.CSSProperties = {
  background: '#D8D2C4', color: '#1A1916',
  fontFamily: 'Georgia, serif', lineHeight: 1.55,
  borderTop: '3px double #1A1916', borderBottom: '3px double #1A1916',
};

function PageShell({ children, onBack, title }: { children: React.ReactNode; onBack: () => void; title: string }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#1c1d1e', overflowY: 'auto', zIndex: 30 }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '38px 22px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ color: '#E8E4DA', fontFamily: 'Georgia, serif', fontVariant: 'small-caps', fontSize: 26, letterSpacing: 2 }}>
            {title}
          </div>
          <button className="btn ghost" onClick={onBack}>◂ Back</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* --------------------------------- FE1: title ----------------------------- */

export function TitleScreen({ onEnter }: { onEnter: () => void }) {
  useEffect(() => {
    const go = () => onEnter();
    const onKey = () => go();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onEnter]);
  return (
    <div
      onClick={onEnter}
      style={{
        position: 'fixed', inset: 0, cursor: 'pointer', zIndex: 40,
        background: `#0b0c0c url(${ART.title}) center/cover no-repeat`,
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(11,12,12,0.15) 55%, rgba(11,12,12,0.88) 100%)',
      }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 46, textAlign: 'center', color: '#E8E4DA' }}>
        <div style={{ fontFamily: 'Georgia, serif', letterSpacing: 6, fontSize: 13, opacity: 0.85 }}>
          A SINGLE-PLAYER STORY FPS · BY JASON BANG
        </div>
        <div style={{ marginTop: 14, fontSize: 12, letterSpacing: 3, opacity: 0.6, animation: 'pulse 2.2s infinite' }}>
          CLICK OR PRESS ANY KEY
        </div>
      </div>
    </div>
  );
}

/* ------------------------- FE5: sign the ledger --------------------------- */

export function SignLedger({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState('');
  const sign = () => {
    const n = name.trim();
    if (!n) return;
    store.get().setUsername(n);
    try { localStorage.setItem('eoe:signed:v1', '1'); } catch { /* ok */ }
    onDone();
  };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 45, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1c1d1e' }}>
      <div style={{ ...paper, width: 'min(480px, 88vw)', padding: '38px 42px' }}>
        <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.6, marginBottom: 10 }}>THE PARISH LEDGER · NEW ENTRY</div>
        <div style={{ fontVariant: 'small-caps', fontSize: 22, marginBottom: 8 }}>Sign the Ledger</div>
        <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 20 }}>
          Every account in this world is kept by hand. Write the name the
          ledger will remember. There are no accounts, no passwords — only
          paper, and what you plant in it.
        </div>
        <input
          autoFocus
          value={name}
          maxLength={24}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') sign(); }}
          placeholder="your name, in your own hand"
          style={{
            width: '100%', boxSizing: 'border-box', padding: '10px 12px',
            fontFamily: 'Georgia, serif', fontSize: 18, fontStyle: 'italic',
            background: 'transparent', color: '#1A1916',
            border: 'none', borderBottom: '2px solid #1A1916', outline: 'none',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 26 }}>
          <button className="btn" onClick={sign} disabled={!name.trim()}>Sign</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------- FE2: the foreword (intro pages) ------------------- */

const FOREWORD_PAGES: Array<{ kicker: string; body: string }> = [
  {
    kicker: 'THE ECHOES OF EDEN · A BANNED BOOK · FOREWORD',
    body:
      'In 2050, the U.S. relies on energy converters that extract energy ' +
      'from plants, causing massive deforestation and environmental ' +
      'collapse. Asher Forester, a high-ranking Edge Corp employee, loses ' +
      'his hand in a work accident, replaced by a robotic prosthetic. ' +
      'Haunted by trauma and guilt, his perspective shifts after receiving ' +
      'a plant from a critical friend. Witnessing the destruction caused ' +
      'by his work, he resolves to fight against Edge Corp.',
  },
  {
    kicker: 'FROM THE PRINTERS’ NOTE',
    body:
      'This book explores the conflict between technology and nature, ' +
      'inspired by ecological disasters that were real, and near, and ' +
      'filed. It records one man’s journey from indifference to the work ' +
      '— hope and redemption, with a gifted plant for a seed. Through its ' +
      'pages, the argument is simple: balance and coexistence, or nothing. ' +
      '\n\nIt is printed on paper because what is written in charge can be ' +
      'unwritten.',
  },
  {
    kicker: 'PASSED HAND TO HAND',
    body:
      'The Wardenry lists possession of this volume as a citable offense, ' +
      'class two.\n\nPlant it somewhere it will be found.\n\n— reckoned',
  },
];

export function Foreword({ onDone }: { onDone: () => void }) {
  const [page, setPage] = useState(0);
  const advance = () => {
    if (page < FOREWORD_PAGES.length - 1) setPage(page + 1);
    else { try { localStorage.setItem('eoe:foreword:v1', '1'); } catch { /* ok */ } onDone(); }
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.code === 'Escape') onDone(); else advance(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  const p = FOREWORD_PAGES[page];
  return (
    <div onClick={advance} style={{ position: 'fixed', inset: 0, zIndex: 45, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#141515', cursor: 'pointer' }}>
      <div key={page} style={{ ...paper, width: 'min(560px, 88vw)', padding: '44px 48px', animation: 'fadein 0.6s ease' }}>
        <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.6, marginBottom: 14 }}>{p.kicker}</div>
        <div style={{ whiteSpace: 'pre-wrap', fontSize: 16 }}>{p.body}</div>
        <div style={{ marginTop: 30, display: 'flex', justifyContent: 'space-between', fontSize: 11, letterSpacing: 2, opacity: 0.5 }}>
          <span>{page + 1} / {FOREWORD_PAGES.length}</span>
          <span>CLICK / ANY KEY — TURN · ESC — SKIP</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- FE3: the registry (codex) ---------------------- */

const REGISTRY: Array<{ img: string; title: string; kicker: string; body: string }> = [
  {
    img: ART.scene1, title: 'The Sowers', kicker: 'RESISTANCE · FIELD RECORD',
    body:
      'Nocturnal replanters. They carry stolen Converters run in reverse, ' +
      'and seed the drained tracts by lamplight. Their sign is a green line ' +
      'breaking a grey circle. Their law is older than the leases.',
  },
  {
    img: ART.converter, title: 'The Converter', kicker: 'EDGE CORP · FIELD EQUIPMENT',
    body:
      'The Converter, a creation of Edge’s scientists, is both ingenious ' +
      'and destructive: it drains nature’s life energy for Edge’s greed. ' +
      'As workers wield it, they unwittingly aid in the destruction of ' +
      'nature, blinded by promises of power. Beyond a mere machine, it is ' +
      'a weapon symbolizing Edge’s relentless pursuit.',
  },
  {
    img: ART.robot, title: 'Devastator 3000', kicker: 'EDGE CORP · HEAVY PLATFORM',
    body:
      'Designed for the contested tracts, it operates with ruthless ' +
      'efficiency: advanced weaponry, impenetrable armor, and no opinion ' +
      'of its own. It leaves devastation toward nature in its wake — ' +
      'technological malice with a maintenance schedule.',
  },
  {
    img: ART.vault, title: 'The Bioharvest Vault', kicker: 'EDGE CORP · LOGISTICS',
    body:
      'A worker-carried capacitor, almost as big as a full-grown adult, ' +
      'that stores the converted energy of destroyed forests. Practical ' +
      'design, impressive capacity — tragically employed, facilitating the ' +
      'destruction of natural habitats one shift at a time.',
  },
  {
    img: ART.fight, title: 'The Battle of Steelgate', kicker: 'FORBIDDEN PAGES',
    body:
      'The pages the censors chase hardest: the Sowers inside Edge’s own ' +
      'headquarters, facing the towering silhouette of the machine. Charge ' +
      'guns roaring, enormous fists answering. The book insists it ' +
      'happened. Edge insists there is no book.',
  },
  {
    img: ART.building, title: 'The Poured World', kicker: 'ARCHITECTURE · THE GRAVITY STYLE',
    body:
      'They built as if forgetting were the only enemy: concrete poured ' +
      'past every need, halls for crowds that never came. What stands, ' +
      'remembers. The stillwoods paid for the cathedrals.',
  },
];

export function Registry({ onBack }: { onBack: () => void }) {
  return (
    <PageShell title="The Registry" onBack={onBack}>
      <div style={{ color: '#9b948a', fontFamily: 'Georgia, serif', fontSize: 13, marginBottom: 26, letterSpacing: 1 }}>
        Recovered records, kept against the day someone has to be believed.
      </div>
      <div style={{ display: 'grid', gap: 28 }}>
        {REGISTRY.map((e) => (
          <div key={e.title} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,5fr) minmax(0,4fr)', gap: 0, background: '#232424', border: '1px solid #3a3b38' }}>
            <img src={e.img} alt={e.title} style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 180, maxHeight: 260 }} />
            <div style={{ ...paper, borderTop: 'none', borderBottom: 'none', borderLeft: '3px double #1A1916', padding: '22px 24px' }}>
              <div style={{ fontSize: 10, letterSpacing: 2, opacity: 0.6, marginBottom: 8 }}>{e.kicker}</div>
              <div style={{ fontVariant: 'small-caps', fontSize: 19, marginBottom: 8 }}>{e.title}</div>
              <div style={{ fontSize: 13.5 }}>{e.body}</div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

/* ------------------------------ FE4: the cast ----------------------------- */

const CAST: Array<{ img: string; name: string; role: string; body: string }> = [
  {
    img: ART.scene1, name: 'Asher Forester', role: 'THE DEFECTOR',
    body:
      'Warden First Class, twelve years of service — until his own machine ' +
      'took his left hand, and a friend’s gifted plant took the rest of ' +
      'him. He speaks to a seedling once a day. He is correcting a report ' +
      'he filed once. Still here.',
  },
  {
    img: ART.scientist, name: 'Dr. Beck Grimwood', role: 'THE FOUNDER-MIND',
    body:
      'The genius who taught the world to hold the terminals — whose ' +
      'invention lit the cities and drank the forests. He does not raise ' +
      'his voice. He says returning, keeping, devotion. The horror is the ' +
      'warmth.',
  },
  {
    img: ART.fight, name: 'The Sowers of Taproot', role: 'THE CELL',
    body:
      'Mara, who hands you a spade before a weapon. Coil, who taught an ' +
      'ivory hand to solder. Eleven crews’ worth of debts and one rule: ' +
      'a dead Sower plants nothing.',
  },
  {
    img: ART.robot, name: 'The Machines', role: 'THE FLEET',
    body:
      'D-1. D-2. Devastator-3000. Exactly as moral as their owners, which ' +
      'is the point. They do not hate you. You are a line in a table, and ' +
      'the table is policy.',
  },
];

export function CastPage({ onBack }: { onBack: () => void }) {
  return (
    <PageShell title="The Cast" onBack={onBack}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        {CAST.map((c) => (
          <div key={c.name} style={{ background: '#232424', border: '1px solid #3a3b38' }}>
            <img src={c.img} alt={c.name} style={{ width: '100%', height: 210, objectFit: 'cover' }} />
            <div style={{ ...paper, borderBottom: 'none', padding: '18px 20px' }}>
              <div style={{ fontSize: 10, letterSpacing: 2, opacity: 0.6 }}>{c.role}</div>
              <div style={{ fontVariant: 'small-caps', fontSize: 19, margin: '4px 0 8px' }}>{c.name}</div>
              <div style={{ fontSize: 13.5 }}>{c.body}</div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

/* ------------------------- FE7: the demo end card ------------------------- */

export function EndCard({ onReplay, onMenu }: { onReplay: () => void; onMenu: () => void }) {
  const name = useStore((s) => s.username);
  const shareUrl = 'https://jbhyunwoobang.github.io/neon-strike/';
  const [copied, setCopied] = useState(false);
  const link = useMemo(() => shareUrl, []);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `#0b0c0c url(${ART.title}) center/cover no-repeat` }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(11,12,12,0.82)' }} />
      <div style={{ ...paper, position: 'relative', width: 'min(540px, 88vw)', padding: '40px 44px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.6, marginBottom: 12 }}>ENTERED INTO THE LEDGER</div>
        <div style={{ fontVariant: 'small-caps', fontSize: 24, marginBottom: 10 }}>The Acre Stands</div>
        <div style={{ fontSize: 15, marginBottom: 6 }}>
          The charge banked. The sapling held. The ledger remembers{name ? `, ${name}` : ''}.
        </div>
        <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 24 }}>
          This is a working slice of ECHOES OF EDEN — the book continues.
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn" onClick={onReplay}>Hold It Again</button>
          <button className="btn ghost" onClick={onMenu}>Main Menu</button>
          <button
            className="btn ghost"
            onClick={() => { navigator.clipboard?.writeText(link).then(() => setCopied(true)); }}
          >
            {copied ? 'Link Copied ✓' : 'Give Someone the Link'}
          </button>
        </div>
        <div style={{ marginTop: 22, fontSize: 12, opacity: 0.55, fontStyle: 'italic' }}>
          "One more than you were leaving."
        </div>
      </div>
    </div>
  );
}
