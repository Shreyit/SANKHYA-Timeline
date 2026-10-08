// Sankhya '27 logo — inline, layered SVG (built by scripts/logo/build_hero.py
// from public/img/hero_logo.png). The letters never move. On hover the
// decorations play one full pass:
//   leaf   → sways from where its stem meets the S, the small leaf follows
//   star   → the cut-out in the H spins a quarter turn with a pulse
//   comet  → dashes stream toward the big planet, which bobs; the mid planet
//            nudges along the trail; the planet inside the A pulses
// The leaves and planets are liquid glass (src/liquidGlass.js) on the hero and
// footer marks; the letters stay solid.
//
//   eye    → (in the N) blinks; and while the pointer is anywhere in the
//            logo's section, the iris follows it. It also blinks on its own
//            every few seconds while on screen, now and then twice.
// A pass always finishes, even if the pointer leaves early, so nothing snaps.
//
import gsap from 'gsap';
import logoSvg from '../assets/sankhya27.svg?raw';
import { glassMaps, maskDistance, refractionFilter, supportsRefraction } from './liquidGlass.js';

/** Swap every <img class="logo"> (the no-JS fallback) for the inline SVG. */
export function mountLogos({ reduce = false } = {}) {
  document.querySelectorAll('img.logo').forEach((img, i) => {
    const wrap = document.createElement('span');
    wrap.className = 'logo';
    wrap.setAttribute('role', 'img');
    wrap.setAttribute('aria-label', img.alt || "Sankhya '27");
    // mask ids must be unique per instance
    wrap.innerHTML = logoSvg.replaceAll('lgX-', `lg${i}-`).replace('<svg ', '<svg aria-hidden="true" focusable="false" ');
    img.replaceWith(wrap);
    blendLeaf(wrap, i);
    const lid = makeLid(wrap);
    if (wrap.closest('.hero__logo, .footer__mark')) glassDecor(wrap);
    if (!reduce) { wire(wrap, lid); watch(wrap); idleBlink(wrap, lid); }
  });
}

/**
 * Eyelid. The lid lives inside the eye's clip; its lower edge is a cubic whose
 * points are interpolated from the upper-lid curve (t = 0, open) to just above
 * the lower-lid curve (t = 1, shut — a thin lash line stays visible). Lerping
 * the control points means the lid edge starts arched like the upper lid and
 * flattens as it lands, like a real blink.
 */
/**
 * The sprout grows out of the S: leaf green at the tips, fading into the
 * S's grey toward the stems, so there's no hard colour seam where they meet.
 * (The glass leaves on hero/footer get the same ramp in CSS: .lg-glass--leaf.)
 */
function blendLeaf(logo, i) {
  const leaf = logo.querySelector('.lg-leaf');
  const defs = logo.querySelector('defs');
  if (!leaf || !defs) return;
  const bb = leaf.getBBox();
  const id = `lg${i}-leafgrad`;
  defs.insertAdjacentHTML('beforeend',
    `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${bb.y}" x2="0" y2="${bb.y + bb.height}">` +
    `<stop offset="0" style="stop-color:var(--c-leaf)"/>` +
    `<stop offset="0.5" style="stop-color:var(--c-leaf)"/>` +
    `<stop offset="0.92" style="stop-color:var(--c-logo)"/>` +
    `</linearGradient>`);
  leaf.querySelectorAll('path').forEach((p) => p.setAttribute('fill', `url(#${id})`));
}

function makeLid(logo) {
  const el = logo.querySelector('.lg-eye__lid');
  if (!el) return null;
  const nums = (a) => el.getAttribute(a).split(/\s+/).map(Number);
  const U = nums('data-upper'), L = nums('data-lower'), F = nums('data-flick');
  const OPEN_LIFT = -4, SHUT_GAP = -2.2;   // edge just above the upper lid / lash line at the bottom
  const state = { t: 0 };
  const lerp = (a, b, t) => a + (b - a) * t;
  const draw = () => {
    const t = state.t;
    // points 1..3 of each curve (0 is the shared inner corner)
    const p = [1, 2, 3].map((i) => [
      lerp(U[i * 2], L[i * 2], t),
      lerp(U[i * 2 + 1] + OPEN_LIFT, L[i * 2 + 1] + SHUT_GAP, t),
    ]);
    const f = (v) => v.toFixed(2);
    // everything above the moving edge; the eye's clip trims it to the opening
    el.setAttribute('d',
      `M-120 -120 L140 -120 L140 ${F[1]} L${F[0]} ${F[1]} L${f(p[2][0])} ${f(p[2][1])} ` +
      `C${f(p[1][0])} ${f(p[1][1])} ${f(p[0][0])} ${f(p[0][1])} ${U[0] - 6} ${U[1]} L-120 ${U[1]} Z`);
  };
  draw();
  return {
    // close fast (lids accelerate), a beat shut, open slower (they ease out)
    blink(double = false) {
      const tl = gsap.timeline()
        .to(state, { t: 1, duration: 0.13, ease: 'power2.in', onUpdate: draw })
        .to(state, { t: 0, duration: 0.26, ease: 'power3.out', onUpdate: draw }, '+=0.05');
      if (double) tl.to(state, { t: 1, duration: 0.12, ease: 'power2.in', onUpdate: draw }, '+=0.08')
        .to(state, { t: 0, duration: 0.24, ease: 'power3.out', onUpdate: draw }, '+=0.04');
      return tl;
    },
  };
}

/** Natural idle blinks every 2.8–6.5 s while the logo is on screen. */
function idleBlink(logo, lid) {
  if (!lid || !logo.closest('.hero__logo, .footer__mark')) return;
  let visible = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(logo);
  const next = () => gsap.delayedCall(2.8 + Math.random() * 3.7, () => {
    if (visible && !document.hidden) lid.blink(Math.random() < 0.2);
    next();
  });
  next();
}

function wire(logo, eyelid) {
  const trigger = logo.closest('.logo-trigger');
  if (!trigger) return;
  const q = (s) => logo.querySelector(s);
  const origin = (el) => el?.getAttribute('data-origin');
  const leafBig = q('.lg-leaf__big');
  const leafSmall = q('.lg-leaf__small');
  const star = q('.lg-star');
  const trail = q('.lg-trail');
  const big = q('.lg-planet--big');
  const mid = q('.lg-planet--mid');
  const halo = q('.lg-planet--halo');
  // one dash + gap, so the march always ends on a whole pattern (no jump at rest)
  const period = (trail?.getAttribute('stroke-dasharray') || '20 20').split(/[\s,]+/).map(Number).reduce((a, b) => a + b, 0);

  let tl = null;
  const play = () => {
    if (tl && tl.isActive()) return;
    tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
    tl
      // leaf: lean back, spring forward, settle
      .to(leafBig, { rotation: -9, svgOrigin: origin(leafBig), duration: 0.35, ease: 'power2.out' }, 0)
      .to(leafBig, { rotation: 0, svgOrigin: origin(leafBig), duration: 1.1, ease: 'elastic.out(1, 0.35)' }, 0.35)
      .to(leafSmall, { rotation: 11, svgOrigin: origin(leafSmall), duration: 0.35, ease: 'power2.out' }, 0.08)
      .to(leafSmall, { rotation: 0, svgOrigin: origin(leafSmall), duration: 1.1, ease: 'elastic.out(1, 0.35)' }, 0.43)
      // star: quarter spin with a pulse — a four-point star looks identical at 90°
      .fromTo(star, { rotation: 0, scale: 1 }, { rotation: 90, svgOrigin: origin(star), duration: 0.9, ease: 'back.out(2.2)' }, 0.1)
      .to(star, { scale: 1.3, svgOrigin: origin(star), duration: 0.3, ease: 'power2.out', yoyo: true, repeat: 1 }, 0.1)
      // comet: dashes stream along the trail toward the big planet
      .fromTo(trail, { strokeDashoffset: 0 }, { strokeDashoffset: -period * 4, duration: 1.4, ease: 'power2.inOut' }, 0)
      .to(big, { y: '-=10', scale: 1.15, duration: 0.45, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, 0.2)
      .to(mid, { x: '+=16', y: '-=12', duration: 0.4, ease: 'power2.inOut', yoyo: true, repeat: 1 }, 0.35)
      .to(halo, { scale: 1.4, duration: 0.3, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, 0.55);
    // eye: one full blink
    if (eyelid) tl.add(eyelid.blink(), 0.2);
  };
  trigger.addEventListener('pointerenter', play);
  trigger.addEventListener('focus', play);
}

/**
 * Eye tracking: while the pointer is anywhere in the logo's section (hero,
 * footer, nav bar), the iris looks toward it. The pointer direction is turned
 * into the eye's own tilted frame, so it slides along the almond and only a
 * little up/down. It drifts back to centre when the pointer leaves.
 */
const REST = { x: 2, y: -4 };          // the iris's resting offset in the build

function watch(logo) {
  const iris = logo.querySelector('.lg-eye__iris');
  const eye = logo.querySelector('.lg-eye');
  const area = logo.closest('section, footer, header');
  if (!iris || !eye || !area || !window.matchMedia('(pointer: fine)').matches) return;
  // angle and travel come from the build (data-tilt / data-gaze on .lg-eye)
  const tilt = ((parseFloat(eye.dataset.tilt) || 0) * Math.PI) / 180;
  const [gx, gy] = (eye.dataset.gaze || '20 7').split(' ').map(Number);
  const toX = gsap.quickTo(iris, 'x', { duration: 0.35, ease: 'power3.out' });
  const toY = gsap.quickTo(iris, 'y', { duration: 0.35, ease: 'power3.out' });
  area.addEventListener('pointermove', (e) => {
    const r = eye.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const len = Math.hypot(dx, dy) || 1;
    const reach = Math.min(1, len / 240);     // close to the eye → small glance
    const lx = (dx * Math.cos(tilt) + dy * Math.sin(tilt)) / len;
    const ly = (-dx * Math.sin(tilt) + dy * Math.cos(tilt)) / len;
    toX(REST.x + lx * gx * reach);
    toY(REST.y + ly * gy * reach);
  }, { passive: true });
  area.addEventListener('pointerleave', () => { toX(REST.x); toY(REST.y); });
}

/**
 * Liquid-glass decorations. Each leaf / planet gets an HTML lens span over its
 * own bounding box: masked to its exact shape, with physically-based refraction
 * + specular maps (liquidGlass.js). The SVG shape itself turns transparent. Every
 * frame the span copies the SVG element's current transform (relative to rest),
 * converted from logo units to px, so the glass sways and bobs with the motion.
 */
const GLASS_PARTS = '.lg-leaf__big, .lg-leaf__small, .lg-planet';

function glassDecor(logo) {
  const svg = logo.querySelector('svg');
  const parts = [...logo.querySelectorAll(GLASS_PARTS)];
  if (!svg || !parts.length) return;
  let lenses = [];
  let run = 0;

  const build = async () => {
    const mine = ++run;                       // a newer build supersedes this one
    lenses.forEach((l) => { l.span.remove(); l.filter?.remove(); });
    lenses = [];
    const vb = svg.viewBox.baseVal;
    const box = logo.getBoundingClientRect();
    if (!box.width) return;
    const s = box.width / vb.width;
    for (const el of parts) {
      const rest = el.transform.baseVal.consolidate()?.matrix ?? svg.createSVGMatrix();
      const bb = el.getBBox();
      const pts = [[bb.x, bb.y], [bb.x + bb.width, bb.y], [bb.x, bb.y + bb.height], [bb.x + bb.width, bb.y + bb.height]]
        .map(([x, y]) => [rest.a * x + rest.c * y + rest.e, rest.b * x + rest.d * y + rest.f]);
      const pad = 3 / s;
      const ux = Math.min(...pts.map((p) => p[0])) - pad, uy = Math.min(...pts.map((p) => p[1])) - pad;
      const uw = Math.max(...pts.map((p) => p[0])) + pad - ux, uh = Math.max(...pts.map((p) => p[1])) + pad - uy;
      const w = Math.max(2, Math.round(uw * s)), h = Math.max(2, Math.round(uh * s));

      // the element alone, at rest, as a mask image
      const shape = el.cloneNode(true);
      shape.removeAttribute('class'); shape.removeAttribute('transform'); shape.removeAttribute('data-origin');
      shape.setAttribute('fill', '#000');     // its own fill may reference a gradient the mask file doesn't have
      const m = `matrix(${rest.a} ${rest.b} ${rest.c} ${rest.d} ${rest.e} ${rest.f})`;
      const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${ux} ${uy} ${uw} ${uh}" width="${w}" height="${h}" preserveAspectRatio="none"><g transform="${m}" fill="#000" fill-rule="evenodd">${shape.outerHTML}</g></svg>`;
      const maskUrl = URL.createObjectURL(new Blob([maskSvg], { type: 'image/svg+xml' }));
      const img = new Image(); img.src = maskUrl;
      try { await img.decode(); } catch { continue; }
      if (mine !== run) return;
      // maps are computed at 2× (these shapes are small) and drawn back at 1×
      const SS = 2, W2 = w * SS, H2 = h * SS;
      const c = document.createElement('canvas'); c.width = W2; c.height = H2;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, W2, H2);
      const px = ctx.getImageData(0, 0, W2, H2).data;
      const alpha = new Uint8Array(W2 * H2);
      for (let k = 0; k < W2 * H2; k++) alpha[k] = px[k * 4 + 3];
      const minSide = Math.min(W2, H2);
      const maps = glassMaps(maskDistance(alpha, W2, H2), W2, H2, {
        bezel: Math.max(6, minSide * 0.34), thickness: Math.max(8, minSide * 0.5), specular: 1.6,
      });
      const { dispUrl, specUrl } = maps;
      const scale = Math.round(maps.scale / SS);       // displacement back in 1× px

      const span = document.createElement('span');
      const kind = el.closest('.lg-leaf') ? 'leaf' : (el.getAttribute('class').match(/lg-planet--(\w+)/) || [])[1];
      span.className = kind ? `lg-glass lg-glass--${kind}` : 'lg-glass';
      span.setAttribute('aria-hidden', 'true');
      Object.assign(span.style, {
        left: `${(ux - vb.x) * s}px`, top: `${(uy - vb.y) * s}px`, width: `${w}px`, height: `${h}px`,
      });
      span.style.setProperty('--lens-mask', `url("${maskUrl}")`);
      span.style.setProperty('--glass-spec', `url("${specUrl}")`);
      let filter = null;
      if (supportsRefraction()) {
        filter = refractionFilter(dispUrl, w, h, scale);
        span.style.backdropFilter = `${filter.url} saturate(150%) brightness(1.1)`;
      }
      logo.appendChild(span);
      el.style.fillOpacity = '0';
      lenses.push({ el, span, filter, rest: rest.inverse(), o: [ux, uy], s, last: '' });
    }
  };

  // follow the SVG element's motion: M = now · rest⁻¹ (logo units) → CSS matrix (px)
  const sync = () => {
    for (const l of lenses) {
      const now = l.el.transform.baseVal.consolidate()?.matrix;
      if (!now) continue;
      const M = now.multiply(l.rest);
      const [ox, oy] = l.o;
      const tx = l.s * (M.a * ox + M.c * oy + M.e - ox);
      const ty = l.s * (M.b * ox + M.d * oy + M.f - oy);
      const css = `matrix(${M.a.toFixed(4)},${M.b.toFixed(4)},${M.c.toFixed(4)},${M.d.toFixed(4)},${tx.toFixed(2)},${ty.toFixed(2)})`;
      if (css !== l.last) { l.span.style.transform = css; l.last = css; }
    }
  };
  gsap.ticker.add(sync);

  let raf = 0, lastW = 0;     // the observer's first callback does the initial build
  new ResizeObserver(([e]) => {
    const w = Math.round(e.contentRect.width);
    if (w === lastW) return;
    lastW = w; cancelAnimationFrame(raf); raf = requestAnimationFrame(build);
  }).observe(logo);
}
