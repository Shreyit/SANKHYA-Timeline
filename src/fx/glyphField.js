// Glyph field — vanilla port of AakaarIO's hooks/useGlyphField.js (Build.io /
// landing footer spotlight), re-themed to an ember orange → amber → white palette.
//
// A field of monospace glyphs drawn on canvas that shimmer constantly and
// light up in a soft spotlight following the cursor (or drifting on its own
// when nobody is hovering). Each cell owns one warm hue (theme orange, amber,
// white, grey) so the spotlight reveals a multi-colour glow; the lead entry
// follows the live --c-main token, the rest are fixed harmonics.
//
// Usage:
//   import { mountGlyphField } from './glyphField.js';
//   const ctl = mountGlyphField(root, canvas, haze, { fadeTop, baseAlpha, ... });
//   ctl.destroy();
//
// - root: element (or window) that receives pointermove/pointerleave.
// - canvas: absolutely positioned <canvas> filling its box.
// - haze: optional element whose background uses var(--fx)/var(--fy).
//
// Options (same defaults as the footer in AakaarIO):
//   fadeTop, baseAlpha, idleRadius, activeRadius, hotAlpha, wideAlpha, follow,
//   colorScope (element to read --c-* tokens from, default documentElement),
//   font (canvas font string).

const GLYPHS = '#$%&@*+=<>/\\{}[]();:~?!8B0#%&@$';
const CELL_W = 16;
const CELL_H = 21;

// Fixed ember harmonics (orange → amber → white → grey). Index 0 is the live
// theme orange (--c-main) so the field still follows a palette swap.
const WARM = [
  null, // [0] live orange, filled in per-frame from colors.main
  [74, 140, 70], // [1] fern (palette green, lifted)
  [226, 201, 143], // [2] sand
  [242, 228, 194], // [3] light sand sparkle
  [70, 100, 66], // [4] moss smoke
];
const HOT_WHITE = [246, 240, 220]; // spotlight core tint

// Weighted pick so the theme orange dominates, white/grey sparkle sparsely.
function pickInk() {
  const r = Math.random();
  if (r < 0.38) return 0;
  if (r < 0.62) return 1;
  if (r < 0.82) return 2;
  if (r < 0.94) return 3;
  return 4;
}

function parseColor(str, fallback) {
  const s = (str || '').trim();
  let m = s.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  if (m) return [+m[1], +m[2], +m[3]];
  m = s.match(/^#([0-9a-f]{6})$/i);
  if (m) {
    const n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  return fallback;
}

const mixRgb = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

export function mountGlyphField(root, canvas, haze, options = {}) {
  const {
    fadeTop = true,
    baseAlpha = 0.045,
    idleRadius = 190,
    activeRadius = 230,
    hotAlpha = 0.75,
    wideAlpha = 0.24,
    follow = 0.08,
    colorScope = null,
    font = `600 13px 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace`,
  } = options;

  if (!canvas) return { destroy() {} };
  const ctx = canvas.getContext('2d');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scope = colorScope || document.documentElement;

  let w = 0, h = 0, cols = 0, rows = 0, grid = [], ink = [];
  // Ember ramp fallbacks: ember orange, warm white core, deep espresso base.
  let colors = { main: [217, 189, 122], light: [246, 243, 232], deep: [7, 25, 6] };
  const readColors = () => {
    const cs = getComputedStyle(scope);
    colors = {
      main: parseColor(cs.getPropertyValue('--c-main'), colors.main),
      light: parseColor(cs.getPropertyValue('--c-light'), colors.light),
      deep: parseColor(cs.getPropertyValue('--c-deep'), colors.deep),
    };
  };
  const randGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    if (!w || !h) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / CELL_W) + 1;
    rows = Math.ceil(h / CELL_H) + 1;
    grid = Array.from({ length: cols * rows }, randGlyph);
    ink = Array.from({ length: cols * rows }, pickInk);
  };

  const pointer = { x: 0, y: 0, active: false };
  const spot = { x: 0, y: 0, r: 0 };

  const draw = (t) => {
    if (!w || !h || !grid.length) return;
    const tx = pointer.active ? pointer.x : w * (0.5 + 0.34 * Math.sin(t * 0.00031));
    const ty = pointer.active ? pointer.y : h * (0.42 + 0.18 * Math.sin(t * 0.00053 + 1.3));
    const targetR = pointer.active ? activeRadius : idleRadius;
    spot.x += (tx - spot.x) * (reduced ? 1 : follow);
    spot.y += (ty - spot.y) * (reduced ? 1 : follow);
    spot.r += (targetR - spot.r) * (reduced ? 1 : follow * 0.75);

    if (!reduced) {
      const n = Math.max(1, (grid.length * 0.012) | 0);
      for (let k = 0; k < n; k++) grid[(Math.random() * grid.length) | 0] = randGlyph();
    }

    ctx.clearRect(0, 0, w, h);
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const R1 = spot.r * spot.r;
    const R2 = (spot.r * 2.6) * (spot.r * 2.6);
    for (let row = 0; row < rows; row++) {
      const cy = row * CELL_H + CELL_H / 2;
      let edge = 1;
      if (fadeTop) {
        const e = Math.min(1, cy / (h * 0.45));
        edge = e * e * (3 - 2 * e);
      }
      for (let col = 0; col < cols; col++) {
        const cx = col * CELL_W + CELL_W / 2;
        const dx = cx - spot.x, dy = cy - spot.y;
        const d2 = dx * dx + dy * dy;
        const hot = Math.exp(-d2 / R1);
        const wide = Math.exp(-d2 / R2);
        const alpha = (baseAlpha + wideAlpha * wide + hotAlpha * hot) * edge;
        if (alpha < 0.03) continue;
        const idx = row * cols + col;
        const base = ink[idx] === 0 ? colors.main : WARM[ink[idx]];
        let rgb = mixRgb(colors.deep, base, Math.min(1, wide * 1.2 + 0.15));
        if (hot > 0.35) rgb = mixRgb(rgb, HOT_WHITE, (hot - 0.35) / 0.65);
        ctx.fillStyle = `rgba(${rgb[0] | 0}, ${rgb[1] | 0}, ${rgb[2] | 0}, ${Math.min(1, alpha).toFixed(3)})`;
        ctx.fillText(grid[idx], cx, cy);
      }
    }
    if (haze) {
      haze.style.setProperty('--fx', `${spot.x}px`);
      haze.style.setProperty('--fy', `${spot.y}px`);
    }
  };

  let raf = 0, running = false, frame = 0, last = 0;
  const loop = (t) => {
    raf = requestAnimationFrame(loop);
    if (t - last < 33) return;
    last = t;
    if (frame++ % 30 === 0) readColors();
    draw(t);
  };
  const start = () => {
    if (!running && !reduced) {
      running = true;
      raf = requestAnimationFrame(loop);
    }
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const onMove = (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
    pointer.active = true;
    if (reduced) draw(performance.now());
  };
  const onLeave = () => {
    pointer.active = false;
  };

  resize();
  readColors();
  spot.x = w / 2; spot.y = h * 0.42; spot.r = idleRadius;
  draw(performance.now());

  const listenTarget = root || window;
  const ro = new ResizeObserver(() => {
    resize();
    draw(performance.now());
  });
  ro.observe(canvas);
  // Observe the visible scope: canvas for fixed layers, root element otherwise.
  const ioTarget = listenTarget === window
    ? canvas
    : (listenTarget instanceof Element ? listenTarget : canvas);
  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 });
  io.observe(ioTarget);
  listenTarget.addEventListener('pointermove', onMove);
  listenTarget.addEventListener('pointerleave', onLeave);

  return {
    destroy() {
      stop();
      ro.disconnect();
      io.disconnect();
      listenTarget.removeEventListener('pointermove', onMove);
      listenTarget.removeEventListener('pointerleave', onLeave);
    },
  };
}
