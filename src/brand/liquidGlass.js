// Liquid glass — a physically-based approximation of Apple's material.
//
// A glass shape is a slab whose edge rounds over a bezel of width B. For every
// pixel we know d = distance to the shape's edge. Then:
//
//   1. Height   h(d) = T · s(x),  x = min(d / B, 1),  s(x) = (1 − (1 − x)^4)^(1/4)
//               (a squircle profile: steep at the edge, flat in the middle)
//   2. Normal   slope m = dh/dd = T · s'(x) / B; the surface normal tilts outward
//               along the 2D edge direction g (unit vector pointing into the shape):
//               n = normalize(−m·gx, −m·gy, 1)
//   3. Snell    a ray looking straight down meets the surface at θ1 = atan(m);
//               inside glass (n = 1.5) it continues at θ2 = asin(sin θ1 / 1.5).
//               It bends inward by (θ1 − θ2) and lands on the background shifted by
//               Δ = h · tan(θ1 − θ2), along g.
//   4. Map      Δ·g is written to R/G around a neutral 128, normalised by maxΔ, so
//               feDisplacementMap(scale = 2·maxΔ) reproduces the true pixel offset.
//   5. Light    a specular map from the same normals: a sharp key highlight where n
//               faces the light, a dimmer bounce on the opposite rim.
//
// Refraction runs through `backdrop-filter: url(#filter)`, which only Chromium
// supports; elsewhere the specular + tint still render, without the bend.

const IOR = 1.5;
const LIGHT = norm3([-0.55, -0.75, 0.6]);          // from the top-left, toward the viewer
export const supportsRefraction = () => !!navigator.userAgentData?.brands?.some((b) => /Chrom/i.test(b.brand));

function norm3([x, y, z]) { const l = Math.hypot(x, y, z) || 1; return [x / l, y / l, z / l]; }
const profile = (x) => Math.pow(1 - Math.pow(1 - x, 4), 0.25);
const profileSlope = (x) => {
  const e = 1e-3, a = Math.max(0, x - e), b = Math.min(1, x + e);
  return (profile(b) - profile(a)) / (b - a);
};

/**
 * Build displacement + specular maps.
 * @param dist  Float32Array, distance to the edge in px (0 outside the shape)
 * @param w,h   map size in CSS px
 * @param bezel B in px, thickness T in px
 */
export function glassMaps(dist, w, h, { bezel = 16, thickness = 18, specular = 1 } = {}) {
  const N = w * h;
  const dx = new Float32Array(N), dy = new Float32Array(N), spec = new Float32Array(N);
  let maxShift = 0;
  const at = (x, y) => dist[Math.min(h - 1, Math.max(0, y)) * w + Math.min(w - 1, Math.max(0, x))];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const k = y * w + x, d = dist[k];
      if (d <= 0 || d >= bezel) continue;                   // outside, or the flat middle
      // edge direction g: gradient of the distance field (points inward)
      // sampled ±2 px: a wider stencil keeps the normals (and the highlight) smooth
      let gx = at(x + 2, y) - at(x - 2, y), gy = at(x, y + 2) - at(x, y - 2);
      const gl = Math.hypot(gx, gy) || 1; gx /= gl; gy /= gl;
      const t = Math.max(1e-3, d / bezel);
      const height = thickness * profile(t);
      const slope = (thickness * profileSlope(t)) / bezel;
      const th1 = Math.atan(slope);
      const th2 = Math.asin(Math.sin(th1) / IOR);
      const shift = height * Math.tan(th1 - th2);
      dx[k] = gx * shift; dy[k] = gy * shift;
      if (shift > maxShift) maxShift = shift;
      // specular from the 3D normal
      const n = norm3([-slope * gx, -slope * gy, 1]);
      const rim = 1 - n[2];                                  // 0 flat → 1 vertical
      // how much the outward-tilted rim faces the light (in the image plane)
      const facing = (n[0] * LIGHT[0] + n[1] * LIGHT[1]) / (Math.hypot(n[0], n[1]) || 1);
      const key = Math.pow(Math.max(0, facing), 2.2);
      const bounce = Math.pow(Math.max(0, -facing), 3) * 0.35;
      spec[k] = Math.min(1, specular * Math.pow(rim, 1.3) * (key + bounce) * 1.6);
    }
  }
  const disp = new ImageData(w, h), sp = new ImageData(w, h);
  const norm = maxShift || 1;
  for (let k = 0; k < N; k++) {
    const q = k * 4;
    disp.data[q] = 128 + (dx[k] / norm) * 127;
    disp.data[q + 1] = 128 + (dy[k] / norm) * 127;
    disp.data[q + 2] = 128; disp.data[q + 3] = 255;
    sp.data[q] = sp.data[q + 1] = sp.data[q + 2] = 255;
    sp.data[q + 3] = spec[k] * 255;
  }
  return { dispUrl: toUrl(disp), specUrl: toUrl(sp), scale: Math.round(maxShift * 2) };
}

function toUrl(img) {
  const c = document.createElement('canvas');
  c.width = img.width; c.height = img.height;
  c.getContext('2d').putImageData(img, 0, 0);
  return c.toDataURL('image/png');
}

/** Distance field of a rounded rectangle (exact SDF), positive inside. */
export function roundedRectDistance(w, h, r) {
  const d = new Float32Array(w * h);
  const bx = w / 2 - r, by = h / 2 - r;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const qx = Math.abs(x + 0.5 - w / 2) - bx, qy = Math.abs(y + 0.5 - h / 2) - by;
    const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
    const inside = Math.min(Math.max(qx, qy), 0);
    d[y * w + x] = Math.max(0, -(outside + inside - r));
  }
  return d;
}

/** Distance field of an arbitrary shape (alpha mask), two-pass chamfer + light smoothing. */
export function maskDistance(alpha, w, h) {
  const N = w * h, D = Math.SQRT2;
  const d = new Float32Array(N);
  for (let k = 0; k < N; k++) d[k] = alpha[k] > 127 ? 1e6 : 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const k = y * w + x; if (!d[k]) continue;
    let v = d[k];
    if (x > 0) v = Math.min(v, d[k - 1] + 1);
    if (y > 0) { v = Math.min(v, d[k - w] + 1); if (x > 0) v = Math.min(v, d[k - w - 1] + D); if (x < w - 1) v = Math.min(v, d[k - w + 1] + D); }
    d[k] = v;
  }
  for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
    const k = y * w + x; if (!d[k]) continue;
    let v = d[k];
    if (x < w - 1) v = Math.min(v, d[k + 1] + 1);
    if (y < h - 1) { v = Math.min(v, d[k + w] + 1); if (x < w - 1) v = Math.min(v, d[k + w + 1] + D); if (x > 0) v = Math.min(v, d[k + w - 1] + D); }
    d[k] = v;
  }
  // three 3×3 box-blur passes inside the shape: chamfer distances are stepped,
  // and their raw gradients would make the highlight sparkle along the rim
  let src = d;
  for (let pass = 0; pass < 3; pass++) {
    const o = new Float32Array(N);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const k = y * w + x; if (!d[k]) continue;
      let s = 0, n = 0;
      for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
        const xx = x + i, yy = y + j;
        if (xx >= 0 && xx < w && yy >= 0 && yy < h) { s += src[yy * w + xx]; n++; }
      }
      o[k] = s / n;
    }
    src = o;
  }
  return src;
}

let filterSeq = 0;
/** An SVG displacement filter sized to w×h CSS px; returns its url(). */
export function refractionFilter(dispUrl, w, h, scale) {
  const id = `lglass-${++filterSeq}`;
  let host = document.getElementById('lglass-defs');
  if (!host) {
    host = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    host.id = 'lglass-defs';
    host.setAttribute('width', '0'); host.setAttribute('height', '0'); host.setAttribute('aria-hidden', 'true');
    host.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    document.body.appendChild(host);
  }
  host.insertAdjacentHTML('beforeend',
    `<filter id="${id}" x="0" y="0" width="${w}" height="${h}" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feImage href="${dispUrl}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none" result="map"/>
      <feDisplacementMap in="SourceGraphic" in2="map" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/>
    </filter>`);
  return { url: `url(#${id})`, remove: () => document.getElementById(id)?.remove() };
}

/**
 * Turn a box element (e.g. the nav pill) into liquid glass. Its own border-radius
 * clips the backdrop; the specular map goes into --glass-spec for a pseudo-element.
 * Rebuilds when the element resizes.
 */
export function liquidGlassBox(el, { bezel = 18, thickness = 20, extra = 'saturate(160%) brightness(1.06)' } = {}) {
  let filter = null, last = '';
  const build = () => {
    const r = el.getBoundingClientRect();
    const w = Math.round(r.width), h = Math.round(r.height);
    if (!w || !h || `${w}x${h}` === last) return;
    last = `${w}x${h}`;
    const radius = Math.min(h / 2, parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0);
    const { dispUrl, specUrl, scale } = glassMaps(roundedRectDistance(w, h, radius), w, h, { bezel, thickness });
    el.style.setProperty('--glass-spec', `url("${specUrl}")`);
    if (supportsRefraction()) {
      filter?.remove();
      filter = refractionFilter(dispUrl, w, h, scale);
      el.style.backdropFilter = `${filter.url} ${extra}`;
    }
    el.classList.add('is-liquid');
  };
  build();
  new ResizeObserver(build).observe(el);
}
