/**
 * Intro.tsx — Cinematic title screen (detailed pass).
 *
 * A depth-layered composition in the mood-board style: eroded, weathered
 * monolith shards suspended in a cloud break, lit by a volumetric godray, with
 * atmospheric haze, drifting dust, a lone figure on a foreground ridge, and the
 * ECHOES OF EDEN wordmark rendered with editorial registration detail.
 *
 * Weathering + surface grain come from SVG filters (feTurbulence +
 * feDisplacementMap); depth comes from tint + blur (atmospheric perspective).
 * Everything animates via CSS (compositor-driven), so it stays smooth and
 * renders reliably. Honours prefers-reduced-motion (see index.css) and applies
 * the ui-ux-pro-max accessibility checklist (cursor, focus, SVG icon).
 */

import { useEffect } from 'react';

export function Intro({ onEnter }: { onEnter: () => void }) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key !== 'Tab') onEnter(); };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [onEnter]);

  return (
    <div className="intro" onClick={onEnter} role="button" tabIndex={0} aria-label="Enter ECHOES OF EDEN">
      {/* atmosphere */}
      <div className="intro-sky" />
      <div className="intro-cloud c1" />
      <div className="intro-cloud c2" />
      <div className="intro-cloud c3" />
      <div className="intro-haze" />

      {/* monolith field */}
      <svg className="intro-monoliths" viewBox="0 0 720 1280" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          {/* warm luminous core of the hero shard */}
          <linearGradient id="godray" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#26262c" />
            <stop offset="0.22" stopColor="#c9772a" />
            <stop offset="0.46" stopColor="#ffe0ab" />
            <stop offset="0.5" stopColor="#fff2d6" />
            <stop offset="0.56" stopColor="#ffcf8c" />
            <stop offset="0.8" stopColor="#a85a26" />
            <stop offset="1" stopColor="#17140f" />
          </linearGradient>
          <linearGradient id="slabNear" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#26282f" /><stop offset="0.5" stopColor="#3d3f47" /><stop offset="1" stopColor="#111216" />
          </linearGradient>
          <linearGradient id="slabMid" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#41444d" /><stop offset="0.5" stopColor="#5c5f68" /><stop offset="1" stopColor="#2a2c33" />
          </linearGradient>
          <linearGradient id="slabFar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7c8698" /><stop offset="1" stopColor="#5a6273" />
          </linearGradient>

          {/* eroded edges + surface grain */}
          <filter id="weather" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.05" numOctaves="3" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="14" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="grainOverlay">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="g" />
            <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" />
            <feComposite operator="in" in2="SourceGraphic" />
          </filter>
          <filter id="farHaze" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.2" />
          </filter>
        </defs>

        {/* far shards — hazy, cool, atmospheric */}
        <g className="mono-far" filter="url(#farHaze)" opacity="0.72">
          <g filter="url(#weather)">
            <polygon points="34,150 92,96 116,720 78,900 26,760" fill="url(#slabFar)" />
            <polygon points="596,70 660,110 692,700 646,880 604,700" fill="url(#slabFar)" />
            <polygon points="150,220 196,190 214,560 176,700 150,560" fill="url(#slabFar)" opacity="0.8" />
            <polygon points="516,180 556,150 574,540 540,660 512,520" fill="url(#slabFar)" opacity="0.8" />
          </g>
        </g>

        {/* mid shards */}
        <g className="mono-mid" filter="url(#weather)" opacity="0.96">
          <polygon points="470,120 528,150 548,700 506,840 466,660" fill="url(#slabMid)" />
          <polygon points="196,90 250,120 268,760 224,930 190,720" fill="url(#slabMid)" />
          <g stroke="#15171c" strokeWidth="1" opacity="0.4">
            <line x1="210" y1="160" x2="252" y2="180" /><line x1="206" y1="360" x2="256" y2="380" />
            <line x1="214" y1="560" x2="258" y2="580" /><line x1="228" y1="140" x2="234" y2="820" />
          </g>
        </g>

        {/* hero shard — luminous */}
        <g className="mono-hero">
          <g filter="url(#weather)">
            <polygon points="286,26 452,60 476,858 430,1000 320,972 268,840" fill="url(#godray)" />
          </g>
          {/* etched structure + cracks (crisp, no displacement) */}
          <g stroke="#241a0f" strokeWidth="1.3" opacity="0.32" fill="none">
            <line x1="322" y1="120" x2="446" y2="140" /><line x1="300" y1="300" x2="458" y2="326" />
            <line x1="312" y1="500" x2="452" y2="520" /><line x1="300" y1="680" x2="454" y2="700" />
            <line x1="350" y1="70" x2="358" y2="900" /><line x1="404" y1="80" x2="410" y2="900" />
            <polyline points="330,220 348,300 336,340 356,430" /><polyline points="420,360 404,430 418,470 402,560" />
          </g>
          {/* broken base debris */}
          <g className="mono-hero-shards" fill="#181410">
            <polygon points="320,972 430,1000 420,1044 368,1030 330,1050" opacity="0.85" />
          </g>
        </g>

        {/* near shard — dark, framing */}
        <g className="mono-near" filter="url(#weather)">
          <polygon points="120,40 186,66 210,940 172,1120 118,1150 96,900" fill="url(#slabNear)" />
          <polygon points="120,40 186,66 194,880 156,1060 130,900" fill="#0c0d10" opacity="0.55" />
          <g stroke="#05060a" strokeWidth="1.2" opacity="0.5">
            <line x1="140" y1="120" x2="182" y2="140" /><line x1="132" y1="420" x2="188" y2="440" />
            <line x1="140" y1="720" x2="186" y2="740" />
          </g>
        </g>

        {/* free-floating fragments */}
        <g className="mono-frags" fill="#20222a">
          <polygon className="frag f1" points="300,470 322,462 330,486 306,494" />
          <polygon className="frag f2" points="440,560 460,556 466,578 444,584" />
          <polygon className="frag f3" points="250,640 266,636 272,654 252,660" />
          <polygon className="frag f4" points="470,720 486,716 492,734 472,740" />
        </g>

        {/* surface grain wash over the hero shard */}
        <rect x="268" y="26" width="210" height="980" filter="url(#grainOverlay)" opacity="0.5" />
      </svg>

      {/* volumetric godray beams */}
      <div className="intro-beam b1" />
      <div className="intro-beam b2" />
      <div className="intro-beam b3" />
      <div className="intro-core" />

      {/* drifting dust */}
      <div className="intro-dust">
        {Array.from({ length: 26 }).map((_, i) => (
          <span key={i} style={{
            left: `${4 + i * 3.6}%`,
            ['--s' as string]: `${1 + (i % 3)}px`,
            animationDelay: `${(i % 9) * -1.7}s`,
            animationDuration: `${8 + (i % 6)}s`,
            opacity: 0.3 + (i % 4) * 0.16,
          }} />
        ))}
      </div>

      {/* foreground ridge + lone figure */}
      <svg className="intro-ground" viewBox="0 0 720 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <path d="M0 200 L120 150 L210 138 L300 128 L360 118 L430 128 L540 150 L720 168 L720 200 Z" fill="#0a0908" />
        <path d="M0 200 L160 170 L320 158 L520 172 L720 184 L720 200 Z" fill="#050403" />
        {/* standing stones for scale */}
        <g fill="#070605">
          <path d="M96 150 l6 -30 l7 2 l-2 30 z" />
          <path d="M612 156 l5 -22 l6 2 l-2 22 z" />
        </g>
        {/* figure */}
        <g fill="#040302" transform="translate(352 108)">
          <rect x="0" y="0" width="3.4" height="13" rx="1.2" />
          <circle cx="1.7" cy="-2.4" r="2.4" />
        </g>
      </svg>

      {/* wordmark */}
      <div className="intro-center">
        <div className="intro-kicker"><span>◦</span> SECTOR 13 · TRANSMISSION MMXCV <span>◦</span></div>
        <h1 className="intro-wordmark"><span>ECHOES</span><span>OF EDEN</span></h1>
        <div className="intro-rule"><i /><em>STILL HERE</em><i /></div>

        <button className="intro-cta" onClick={(e) => { e.stopPropagation(); onEnter(); }} aria-label="Enter">
          <span className="br tl" /><span className="br tr" /><span className="br bl" /><span className="br br2" />
          <span className="intro-cta-label">ENTER</span>
          <svg className="intro-cta-icon" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="intro-cta-shine" />
        </button>
        <div className="intro-hint">click anywhere · press any key</div>
      </div>

      {/* framing + registration */}
      <div className="intro-frame" aria-hidden="true">
        <span className="reg tl" /><span className="reg tr" /><span className="reg bl" /><span className="reg br" />
      </div>
      <div className="intro-meta ml">HDR.PSD // NS-051<br />RENDER · 4K · ACES</div>
      <div className="intro-meta mr">SINGLE PLAYER · STORY FPS<br />SYSTEM ONLINE</div>
      <div className="intro-lensvig" aria-hidden="true" />
    </div>
  );
}
