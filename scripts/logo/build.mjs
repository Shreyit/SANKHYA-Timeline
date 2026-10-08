// Sankhya '27 logo — built as SVG, exported as two same-frame PNG layers:
//   sankhya27-base.png  → wordmark, speed stripe, telemetry line, '27
//   sankhya27-dot.png   → just the red data-point dot (bounces on hover)
// Theme: data × motorsport telemetry. Letters are custom chamfered strokes,
// italicised, cut by a speed stripe; a telemetry trace runs under the word and
// peaks at the dot.
// Run: npm run logo   (needs rsvg-convert, from librsvg)
import { writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const W = 2048, H = 560;           // shared frame for both layers
const INK = '#F2F2F0';
const RED = '#E8202A';
const SW = 21;                     // letter stroke weight (letter box is 100 tall)

// Centre-line strokes per letter on a 100-unit-tall box; [width, paths]
const L = {
  S: [66, ['M66 13 H24 L13 24 V40 L22 49 H44 L53 58 V76 L42 87 H0']],
  A: [68, ['M13 100 V30 L32 13 H36 L55 30 V100', 'M13 60 H55']],
  N: [70, ['M13 100 V13 H22 L48 87 H57 V0']],
  K: [68, ['M13 0 V100', 'M66 4 L26 50 L66 96']],
  H: [70, ['M13 0 V100', 'M57 0 V100', 'M13 50 H57']],
  Y: [72, ['M4 0 L36 50 L68 0', 'M36 50 V100']],
};
const WORD = 'SANKHYA';
const GAP = 10;

function wordPaths() {
  let x = 0; const out = [];
  for (const ch of WORD) {
    const [w, ps] = L[ch];
    for (const d of ps) out.push(`<path d="${d}" transform="translate(${x} 0)"/>`);
    x += w + GAP;
  }
  return { paths: out.join(''), width: x - GAP };
}

function svg({ layer }) {
  const { paths, width } = wordPaths();
  const scale = 2.9;                        // 100-unit letters → 290px tall
  const wordW = width * scale;
  const ox = 170, oy = 110;
  const skew = -14;
  // speed stripe: a gap cut through the letters + red streak trailing left
  const stripeY = 64, stripeH = 6;
  const base_y = oy + 100 * scale;
  const dotX = ox + wordW + 112, dotY = base_y - 36;
  const base = `
  <defs>
    <clipPath id="box"><rect x="0" y="0" width="${width}" height="100"/></clipPath>
    <mask id="cut">
      <rect x="-50" y="-20" width="${width + 100}" height="140" fill="#fff"/>
      <rect x="-50" y="${stripeY}" width="${width + 100}" height="${stripeH}" fill="#000"/>
    </mask>
  </defs>
  <g transform="translate(${ox} ${oy}) scale(${scale}) skewX(${skew})">
    <g mask="url(#cut)"><g clip-path="url(#box)" fill="none" stroke="${INK}" stroke-width="${SW}" stroke-linejoin="miter" stroke-miterlimit="8" stroke-linecap="butt">${paths}</g></g>
    <!-- speed streaks trailing off the left -->
    <rect x="-34" y="${stripeY + 1}" width="30" height="${stripeH - 2}" fill="${RED}"/>
    <rect x="-34" y="${stripeY - 22}" width="18" height="4" fill="${INK}" opacity=".55"/>
    <rect x="-30" y="${stripeY + 16}" width="22" height="4" fill="${INK}" opacity=".35"/>
    <!-- '27 tucked top-right, red -->
    <g transform="translate(${width + 8} 0)" fill="none" stroke="${RED}" stroke-width="13" stroke-linejoin="miter">
      <path d="M4 0 L0 18"/>
      <path d="M12 8 H34 L40 14 V22 L14 42 V47 H42"/>
      <path d="M48 8 H78 L60 47"/>
    </g>
  </g>
  <!-- telemetry trace under the word, climbing to the data point -->
  <polyline fill="none" stroke="${RED}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"
    points="${ox - 90},${base_y + 70} ${ox + 180},${base_y + 70} ${ox + 230},${base_y + 44} ${ox + 285},${base_y + 88} ${ox + 335},${base_y + 70} ${ox + 700},${base_y + 70} ${ox + 760},${base_y + 26} ${ox + 815},${base_y + 96} ${ox + 870},${base_y + 60} ${ox + 1180},${base_y + 60} ${ox + wordW - 10},${base_y + 60} ${dotX - 22},${dotY + 26}"/>`;
  const dot = `<circle cx="${dotX}" cy="${dotY}" r="30" fill="${RED}"/><circle cx="${dotX}" cy="${dotY}" r="11" fill="#1c1d1f"/>`;
  const body = layer === 'base' ? base : layer === 'dot' ? dot : base + dot;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body}</svg>`;
}

const out = new URL('../../public/logo/', import.meta.url);
mkdirSync(out, { recursive: true });
for (const layer of ['base', 'dot', 'full']) {
  const file = new URL(`sankhya27-${layer}.svg`, out);
  writeFileSync(file, svg({ layer }));
  if (layer !== 'full') execFileSync('rsvg-convert', ['-w', String(W), '-h', String(H), file.pathname, '-o', file.pathname.replace(/\.svg$/, '.png')]);
}
// favicon / avatar: the S on a nardo tile with the red data point
const [sw, [sPath]] = L.S;
writeFileSync(new URL('sankhya-mark.svg', out), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1c1d1f"/><g transform="translate(17 12) scale(.38) skewX(-12)"><path d="${sPath}" fill="none" stroke="${INK}" stroke-width="${SW + 4}" stroke-linejoin="miter"/></g><circle cx="50" cy="48" r="5" fill="${RED}"/></svg>`);
console.log('logo written to public/logo/');
