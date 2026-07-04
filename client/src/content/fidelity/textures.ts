/**
 * content/fidelity/textures.ts — procedural material baker (Sprint 003 F1).
 *
 * The web lane ships no scanned textures (originality law: silhouettes and
 * surfaces bespoke [BIV §15]). Board-form concrete and stillwood bark are
 * BAKED here at load: albedo (canon hex families + biography), height →
 * normal (Sobel), AO folded into albedo shadows. Every mark answers "what
 * motion made this?" [BIV-QR §2.6]:
 *   plank joints = the formwork's boards · lift seams = the pour schedule ·
 *   tie holes + rust halos = the ties, weeping · stain tongues = water, years
 *   of it · lime bloom = the cold joints breathing.
 */

import * as THREE from 'three';

interface Baked { map: THREE.Texture; normalMap: THREE.Texture; }

function canvasPair(size: number): { color: CanvasRenderingContext2D; height: CanvasRenderingContext2D } {
  const mk = () => {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    return c.getContext('2d')!;
  };
  return { color: mk(), height: mk() };
}

/** Small deterministic PRNG so bakes are stable per seed. */
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

function heightToNormal(hctx: CanvasRenderingContext2D, strength = 2.2): THREE.Texture {
  const size = hctx.canvas.width;
  const src = hctx.getImageData(0, 0, size, size).data;
  const out = hctx.createImageData(size, size);
  const h = (x: number, y: number) => src[(((y + size) % size) * size + ((x + size) % size)) * 4] / 255;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (h(x - 1, y) - h(x + 1, y)) * strength;
      const dy = (h(x, y - 1) - h(x, y + 1)) * strength;
      const inv = 1 / Math.hypot(dx, dy, 1);
      const i = (y * size + x) * 4;
      out.data[i] = (dx * inv * 0.5 + 0.5) * 255;
      out.data[i + 1] = (dy * inv * 0.5 + 0.5) * 255;
      out.data[i + 2] = (1 * inv * 0.5 + 0.5) * 255;
      out.data[i + 3] = 255;
    }
  }
  const c = document.createElement('canvas');
  c.width = c.height = size;
  c.getContext('2d')!.putImageData(out, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/**
 * Board-form concrete. UV space: 1 texture = 3.0 m × 3.0 m of wall
 * (one pour lift + its board rows). Tile vertically per lift.
 */
export function bakeBoardForm(seed = 7, size = 1024): Baked {
  const { color, height } = canvasPair(size);
  const R = rng(seed);
  const mPx = size / 3.0; // pixels per meter

  // Base: canon concrete family, warm grey.
  color.fillStyle = '#6E6E6A';
  color.fillRect(0, 0, size, size);
  height.fillStyle = '#808080';
  height.fillRect(0, 0, size, size);

  // Plank rows (0.15–0.30 m), each with tonal drift + grain streaks.
  let y = 0;
  while (y < size) {
    const plankH = (0.15 + R() * 0.15) * mPx;
    const tone = 104 + Math.floor((R() - 0.5) * 14);
    color.fillStyle = `rgb(${tone + 6},${tone + 6},${tone})`;
    color.fillRect(0, y, size, plankH);
    // Wood-grain ghosts: faint horizontal streaks the pour remembered.
    color.globalAlpha = 0.10;
    for (let i = 0; i < 10; i++) {
      const gy = y + R() * plankH;
      color.fillStyle = R() > 0.5 ? '#5c5c58' : '#7d7d78';
      color.fillRect(0, gy, size, 1 + R() * 2);
    }
    color.globalAlpha = 1;
    // Joint line between boards: recessed.
    color.fillStyle = 'rgba(40,41,40,0.55)';
    color.fillRect(0, y + plankH - 2, size, 2);
    height.fillStyle = 'rgb(96,96,96)';
    height.fillRect(0, y + plankH - 3, size, 3);
    // Plank height variance (proud/shy boards).
    const hv = 128 + Math.floor((R() - 0.5) * 26);
    height.globalAlpha = 0.5;
    height.fillStyle = `rgb(${hv},${hv},${hv})`;
    height.fillRect(0, y, size, plankH - 3);
    height.globalAlpha = 1;
    y += plankH;
  }

  // The pour-lift seam (one per tile): proud line + lime bloom above.
  const liftY = size * 0.62;
  color.fillStyle = 'rgba(210,206,196,0.20)'; // bloom
  color.fillRect(0, liftY - 26, size, 26);
  color.fillStyle = 'rgba(52,53,52,0.6)';
  color.fillRect(0, liftY, size, 4);
  color.fillStyle = 'rgba(190,188,180,0.5)';
  color.fillRect(0, liftY + 4, size, 2);
  height.fillStyle = 'rgb(180,180,180)';
  height.fillRect(0, liftY - 2, size, 4);
  height.fillStyle = 'rgb(70,70,70)';
  height.fillRect(0, liftY + 2, size, 4);

  // Tie holes: grid 0.9 m × 0.75 m, cone recess + rust halo + weep.
  const tieDX = 0.9 * mPx, tieDY = 0.75 * mPx;
  for (let ty = tieDY * 0.7; ty < size; ty += tieDY) {
    for (let tx = tieDX * 0.5; tx < size; tx += tieDX) {
      const jx = tx + (R() - 0.5) * 6, jy = ty + (R() - 0.5) * 6;
      const r = 0.02 * mPx + R() * 2;
      // Rust halo + downward weep (maintenance withdrawn = budget = morality).
      const weep = color.createLinearGradient(jx, jy, jx, jy + (0.25 + R() * 0.5) * mPx);
      weep.addColorStop(0, 'rgba(122,82,52,0.35)');
      weep.addColorStop(1, 'rgba(122,82,52,0)');
      color.fillStyle = weep;
      color.fillRect(jx - r * 1.6, jy, r * 3.2, (0.25 + R() * 0.5) * mPx);
      const halo = color.createRadialGradient(jx, jy, r * 0.4, jx, jy, r * 2.6);
      halo.addColorStop(0, 'rgba(96,66,44,0.5)');
      halo.addColorStop(1, 'rgba(96,66,44,0)');
      color.fillStyle = halo;
      color.beginPath(); color.arc(jx, jy, r * 2.6, 0, 7); color.fill();
      color.fillStyle = '#3a3a38';
      color.beginPath(); color.arc(jx, jy, r, 0, 7); color.fill();
      const hg = height.createRadialGradient(jx, jy, 0, jx, jy, r * 1.8);
      hg.addColorStop(0, 'rgb(40,40,40)');
      hg.addColorStop(1, 'rgb(128,128,128)');
      height.fillStyle = hg;
      height.beginPath(); height.arc(jx, jy, r * 1.8, 0, 7); height.fill();
    }
  }

  // Stain tongues: vertical water histories from the top edge.
  for (let i = 0; i < 7; i++) {
    const sx = R() * size, w = (0.05 + R() * 0.12) * mPx, len = (0.8 + R() * 2.0) * mPx;
    const g = color.createLinearGradient(sx, 0, sx, len);
    g.addColorStop(0, `rgba(58,59,56,${0.18 + R() * 0.15})`);
    g.addColorStop(1, 'rgba(58,59,56,0)');
    color.fillStyle = g;
    color.fillRect(sx - w / 2, 0, w, len);
  }

  // Fine grain + blotch noise (aggregate breathing through).
  const img = color.getImageData(0, 0, size, size);
  const hImg = height.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (R() - 0.5) * 12;
    img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n;
    hImg.data[i] += (R() - 0.5) * 8;
  }
  color.putImageData(img, 0, 0);
  height.putImageData(hImg, 0, 0);

  const map = new THREE.CanvasTexture(color.canvas);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace;
  return { map, normalMap: heightToNormal(height, 2.6) };
}

/** Stillwood bark: mineral grey flutes — a cast of a tree, not a tree. */
export function bakeStillwoodBark(seed = 11, size = 1024): Baked {
  const { color, height } = canvasPair(size);
  const R = rng(seed);

  color.fillStyle = '#7d7c76';
  color.fillRect(0, 0, size, size);
  height.fillStyle = '#808080';
  height.fillRect(0, 0, size, size);

  // Vertical fissure ridges: deep crevices to bone-grey crowns.
  let x = 0;
  while (x < size) {
    const w = 14 + R() * 46;
    const tone = 112 + Math.floor((R() - 0.5) * 30);
    color.fillStyle = `rgb(${tone},${tone},${tone - 5})`;
    color.fillRect(x, 0, w, size);
    const hv = 120 + Math.floor(R() * 70);
    height.fillStyle = `rgb(${hv},${hv},${hv})`;
    height.fillRect(x, 0, w, size);
    // Crevice between flutes.
    color.fillStyle = 'rgba(40,41,40,0.7)';
    color.fillRect(x + w - 3, 0, 4, size);
    height.fillStyle = 'rgb(46,46,46)';
    height.fillRect(x + w - 4, 0, 6, size);
    // Wandering crack inside the flute.
    if (R() > 0.45) {
      let cx = x + R() * w;
      color.strokeStyle = 'rgba(45,46,45,0.5)';
      height.strokeStyle = 'rgb(60,60,60)';
      color.lineWidth = 1.5; height.lineWidth = 2.5;
      color.beginPath(); height.beginPath();
      color.moveTo(cx, 0); height.moveTo(cx, 0);
      for (let yy = 0; yy < size; yy += size / 14) {
        cx += (R() - 0.5) * 18;
        color.lineTo(cx, yy); height.lineTo(cx, yy);
      }
      color.stroke(); height.stroke();
    }
    x += w;
  }

  // Horizontal checking (dry-crack bands) — sparse.
  for (let i = 0; i < 9; i++) {
    const yy = R() * size;
    color.fillStyle = 'rgba(50,51,50,0.35)';
    color.fillRect(0, yy, size, 1 + R() * 2);
    height.fillStyle = 'rgb(80,80,80)';
    height.fillRect(0, yy, size, 2);
  }

  // Mineral dust settle on ridge tops (the Belt's snow).
  const img = color.getImageData(0, 0, size, size);
  const hImg = height.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const lift = hImg.data[i] > 150 ? 10 : 0; // dust on proud surfaces
    const n = (R() - 0.5) * 10;
    img.data[i] += n + lift; img.data[i + 1] += n + lift; img.data[i + 2] += n + lift * 0.8;
  }
  color.putImageData(img, 0, 0);

  const map = new THREE.CanvasTexture(color.canvas);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace;
  return { map, normalMap: heightToNormal(height, 3.0) };
}
