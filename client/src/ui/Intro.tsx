/**
 * Intro.tsx — Cinematic title screen.
 *
 * A layered, animated composition in the mood-board style: colossal weathered
 * monolith shards hanging in a bright cloud break, warm godray shafts, drifting
 * fog, floating debris and a lone figure on a ridge — with the NEON STRIKE
 * wordmark revealing in Cinzel.
 *
 * Everything is SVG + CSS (compositor-driven), so it animates smoothly and is
 * cheap. Applies the ui-ux-pro-max-skill checklist: cursor-pointer on the CTA,
 * 200–300ms transitions, a visible :focus-visible ring, SVG icon (no emoji),
 * and a full `prefers-reduced-motion` fallback (see index.css).
 *
 * 21st.dev-style "magic" CTA: the ENTER control uses a shimmer sweep + glow
 * hover pattern; swap in a live 21st.dev component via their Magic MCP/registry
 * if you connect an account (see docs/DESIGN_NOTES.md).
 */

import { useEffect } from 'react';

export function Intro({ onEnter }: { onEnter: () => void }) {
  // Any click or key enters the game (and unlocks audio downstream).
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key !== 'Tab') onEnter(); };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [onEnter]);

  return (
    <div className="intro" onClick={onEnter} role="button" tabIndex={0} aria-label="Enter NEON STRIKE">
      {/* sky + cloud break */}
      <div className="intro-sky" />
      <div className="intro-cloud c1" />
      <div className="intro-cloud c2" />
      <div className="intro-cloud c3" />

      {/* monolith shards */}
      <svg className="intro-monoliths" viewBox="0 0 720 1280" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="godray" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a2a30" />
            <stop offset="0.28" stopColor="#d9862b" />
            <stop offset="0.5" stopColor="#ffd9a0" />
            <stop offset="0.72" stopColor="#c26a2a" />
            <stop offset="1" stopColor="#1a1712" />
          </linearGradient>
          <linearGradient id="slab" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3a3c42" />
            <stop offset="0.5" stopColor="#6a6b70" />
            <stop offset="1" stopColor="#26272c" />
          </linearGradient>
          <linearGradient id="slabDark" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#20222a" />
            <stop offset="1" stopColor="#0d0e12" />
          </linearGradient>
        </defs>

        {/* far shards */}
        <g className="mono-far">
          <polygon points="40,120 96,90 120,760 70,900 30,780" fill="url(#slabDark)" opacity="0.7" />
          <polygon points="590,60 660,96 690,720 640,880 600,700" fill="url(#slabDark)" opacity="0.7" />
          <polygon points="470,140 520,120 540,640 500,760 468,600" fill="url(#slabDark)" opacity="0.55" />
        </g>

        {/* central luminous monolith */}
        <g className="mono-hero">
          <polygon points="250,20 430,60 452,880 410,1010 300,980 244,860" fill="url(#godray)" />
          {/* etched detailing */}
          <g stroke="#1c140c" strokeWidth="1.4" opacity="0.35">
            <line x1="300" y1="120" x2="410" y2="140" />
            <line x1="286" y1="300" x2="430" y2="330" />
            <line x1="300" y1="520" x2="424" y2="540" />
            <line x1="292" y1="700" x2="430" y2="720" />
            <line x1="330" y1="90" x2="336" y2="900" />
            <line x1="378" y1="100" x2="384" y2="900" />
          </g>
          {/* broken base debris */}
          <polygon points="300,980 410,1010 400,1050 360,1040 320,1055" fill="#1a1712" opacity="0.8" />
        </g>

        {/* near shards */}
        <g className="mono-near">
          <polygon points="150,40 214,70 236,900 190,1080 140,1120 120,900" fill="url(#slab)" opacity="0.92" />
          <polygon points="150,40 214,70 220,860 172,1040 150,900" fill="url(#slabDark)" opacity="0.5" />
        </g>
      </svg>

      {/* warm volumetric shafts */}
      <div className="intro-ray r1" />
      <div className="intro-ray r2" />

      {/* floating debris */}
      <div className="intro-debris">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} style={{ left: `${8 + i * 6.4}%`, animationDelay: `${(i % 7) * -1.3}s`, animationDuration: `${7 + (i % 5)}s` }} />
        ))}
      </div>

      {/* lone figure on a ridge */}
      <svg className="intro-figure" viewBox="0 0 120 80" aria-hidden="true">
        <path d="M0 80 L38 58 L70 52 L120 66 L120 80 Z" fill="#0b0a09" />
        <g fill="#050403">
          <rect x="56" y="40" width="3.2" height="12" rx="1" />
          <circle cx="57.6" cy="38" r="2.2" />
        </g>
      </svg>

      {/* wordmark */}
      <div className="intro-center">
        <div className="intro-kicker">SECTOR 13 · MMXCV</div>
        <h1 className="intro-wordmark"><span>NEON</span><span>STRIKE</span></h1>
        <div className="intro-sub">MONOLITH</div>

        <button className="intro-cta" onClick={(e) => { e.stopPropagation(); onEnter(); }} aria-label="Enter">
          <span className="intro-cta-label">ENTER</span>
          <svg className="intro-cta-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="intro-cta-shine" />
        </button>
        <div className="intro-hint">click anywhere · press any key</div>
      </div>

      {/* editorial corner marks */}
      <div className="intro-stamp tl">HDR.PSD // NS-051</div>
      <div className="intro-stamp tr">FPS · CO-OP · PVP</div>
    </div>
  );
}
