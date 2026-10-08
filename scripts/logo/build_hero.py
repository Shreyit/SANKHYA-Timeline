"""Build the Sankhya '27 logo from public/img/hero_logo.png (green on black).

The PNG is split into layers, each traced to smooth vectors (potrace), so the
decorations can move while the letters stay put:

  .lg-text                   letters — static (final A is cut by the comet trail)
  .lg-leaf  > .lg-leaf__big / .lg-leaf__small   sprout growing out of the S
  .lg-star                   the four-point star cut out of the H (a mask, so
                             the *hole* itself spins)
  .lg-eye-cut / .lg-eye      eye cut into the N (the opening, in the
                             mask) + an iris clipped to the opening, so it can
                             look around, and a lid (inside the same clip) whose
                             lower edge sweeps from the upper lid to the lower
                             lid to blink — src/logo.js draws it
  .lg-comet                  dashed trail (one dashed stroke, so it can march),
                             big planet, mid planet, and a planet inside the A

Outputs
  src/assets/sankhya27.svg       inlined by src/logo.js
  public/logo/sankhya27.svg      same, for downloads / print
  public/logo/sankhya27-S.svg    S + sprout letter mark (transparent)
  public/logo/sankhya-mark.svg   favicon (letter mark on a nardo tile)

Needs: numpy, pillow, scipy, potracer
  python3 -m venv .venv-logo && .venv-logo/bin/pip install numpy pillow scipy potracer
  .venv-logo/bin/python scripts/logo/build_hero.py
"""
import math, os
import numpy as np
import potrace
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
SRC = os.path.join(ROOT, 'public/img/hero_logo.png')

rgb = np.asarray(Image.open(SRC).convert('RGB')).astype(int)
H, W = rgb.shape[:2]
ink = rgb[..., 1] > 110                       # green vs black
lab, _ = ndimage.label(ink)

def comp_at(x, y):
    """Label of the connected component under pixel (x, y)."""
    return lab[y, x]

def poly_mask(points):
    img = Image.new('1', (W, H), 0)
    ImageDraw.Draw(img).polygon(points, fill=1)
    return np.asarray(img, bool)

# ── pick components by a pixel known to be inside them (robust to relabelling)
S_FULL = lab == comp_at(300, 300)             # S, fused with the big leaf's stem
LEAF_SMALL = lab == comp_at(200, 380)         # small right leaf + its stem
# every other big component is a letter (A, N, K, H, Y, and the final A — which the
# comet trail cuts into two pieces)
areas = ndimage.sum(ink, lab, range(1, lab.max() + 1))
s_label, small_label = comp_at(300, 300), comp_at(200, 380)
OTHER_LETTERS = np.isin(lab, [i + 1 for i, a in enumerate(areas) if a > 20000 and i + 1 not in (s_label, small_label)])

# the big leaf: the part of the S component above the S's tail, left of its bowl
LEAF_CUT = [(20, 327), (180, 320), (220, 335), (237, 360), (240, 410), (237, 447),
            (207, 457), (177, 451), (120, 455), (20, 460)]
leaf_big = S_FULL & poly_mask(LEAF_CUT)
S_ONLY = S_FULL & ~leaf_big

# H: fill the star hole so the star can live in a mask instead
h_comp = lab == comp_at(1230, 300)
h_filled = ndimage.binary_fill_holes(h_comp)
star_hole = h_filled & ~h_comp
star_lab, _ = ndimage.label(star_hole)
sizes = ndimage.sum(star_hole, star_lab, range(1, star_lab.max() + 1))
star_hole = star_lab == (1 + int(np.argmax(sizes)))
letters = (S_ONLY | (OTHER_LETTERS & ~h_comp) | h_filled)

# comet pieces = everything right of the A that isn't a letter or the S/leaf
comet = ink & ~letters & ~S_FULL & ~LEAF_SMALL & ~h_comp
cl, cn = ndimage.label(comet)
pieces = []
for i, sl in enumerate(ndimage.find_objects(cl), 1):
    m = cl[sl] == i
    area = int(m.sum())
    if area < 40:
        continue
    ys, xs = np.nonzero(m)
    pieces.append(dict(area=area, cx=sl[1].start + xs.mean(), cy=sl[0].start + ys.mean(),
                       w=sl[1].stop - sl[1].start, h=sl[0].stop - sl[0].start, mask=(cl == i)))

def is_round(p):
    return p['area'] >= 200 and abs(p['w'] - p['h']) <= 6 and p['area'] > 0.55 * p['w'] * p['h']

planets = sorted([p for p in pieces if is_round(p)], key=lambda p: -p['area'])
dashes = [p for p in pieces if not is_round(p)]

# ── potrace → SVG path
def trace(mask, turdsize=8, alphamax=1.05, opttolerance=0.25):
    bm = potrace.Bitmap(~mask)        # potracer traces the *low* pixels
    plist = bm.trace(turdsize=turdsize, alphamax=alphamax, opticurve=True, opttolerance=opttolerance)
    f = lambda p: f'{p.x:.1f} {p.y:.1f}'
    out = []
    for curve in plist:
        out.append(f'M{f(curve.start_point)}')
        for seg in curve.segments:
            if seg.is_corner:
                out.append(f'L{f(seg.c)}L{f(seg.end_point)}')
            else:
                out.append(f'C{f(seg.c1)} {f(seg.c2)} {f(seg.end_point)}')
        out.append('Z')
    return ''.join(out)

def bbox(mask):
    ys, xs = np.nonzero(mask)
    return xs.min(), ys.min(), xs.max() + 1, ys.max() + 1

d_letters = trace(letters)
d_leaf_big = trace(leaf_big, turdsize=2)
d_leaf_small = trace(LEAF_SMALL, turdsize=2)
d_star = trace(star_hole, turdsize=2)
d_S = trace(S_ONLY)

sx0, sy0, sx1, sy1 = bbox(star_hole)
star_c = ((sx0 + sx1) / 2, (sy0 + sy1) / 2)
hx0, hy0, hx1, hy1 = bbox(h_filled)

# leaf pivots: where each stem meets the S
leaf_big_pivot = (190, 455)
lx0, ly0, lx1, ly1 = bbox(LEAF_SMALL)
leaf_small_pivot = ((lx0 + lx1) / 2 + 6, ly1 - 4)

# ── comet: one dashed stroke through the dash centres, ending at the big planet
big = planets[0]
mid = planets[1] if len(planets) > 1 else None
# the third planet sits on the trail *inside* the A, in a dark halo cut into it
halo = planets[2] if len(planets) > 2 else None

# order along the trail: top dashes left→right, the big planet, then back down
# the right side (dashes and the mid planet interleaved, right→left)
top = sorted([(d['cx'], d['cy']) for d in dashes if d['cy'] <= big['cy']])
low = [(d['cx'], d['cy']) for d in dashes if d['cy'] > big['cy']]
if mid:
    low.append((mid['cx'], mid['cy']))
low.sort(key=lambda c: -c[0])
r_big = max(big['w'], big['h']) / 2

def catmull(points):
    """Smooth open path through points."""
    d = f'M{points[0][0]:.1f} {points[0][1]:.1f}'
    for i in range(len(points) - 1):
        p0 = points[i - 1] if i else points[i]
        p1, p2 = points[i], points[i + 1]
        p3 = points[i + 2] if i + 2 < len(points) else p2
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f' C{c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}'
    return d

# arc: start just left of the first dash, pass through the big planet, come back
# down through the lower dashes to the mid planet
first = top[0]
arc_pts = [(first[0] - 12, first[1] + 1)] + top + [(big['cx'], big['cy'])] + low
d_trail = catmull(arc_pts)
dash_len = float(np.median([max(d['w'], d['h']) for d in dashes])) if dashes else 20
dash_gap = 13
dash_w = float(np.median([min(d['w'], d['h']) for d in dashes])) if dashes else 11


VB = f'20 180 {W - 40} {H - 330}'           # tight frame around the art

# ── eye in the N: hand-drawn vector (the reference was a 144px screenshot).
# Placement is free: tweak these, run `npm run logo`.
#   EYE_AT      centre in source-image px     EYE_ROT    angle in degrees
#   EYE_W/H     stretch of the opening (1 = drawn size, ~138 × 60 px)
#   EYE_IRIS    iris size (stays a perfect circle whatever W/H are)
#   EYE_GAZE    how far the iris can travel along / across the eye (px)
# Default: the N's thick upper shoulder, leaning 15° with the letter — the
# largest near-level spot in the N where the exact eye outline keeps ≥16 px of
# solid letter on every side (found by scanning the glyph). Steeper angles read
# as one more of the N's slashes rather than an eye.
EYE_AT, EYE_ROT = (746, 338), 15
EYE_W, EYE_H, EYE_IRIS = 0.9, 0.9, 0.85
EYE_GAZE = (22, 5)
# Demon Slayer–style: sharp angular almond — high tense upper lid, pointed
# inner corner, outer corner flicks out — and a demon iris: outer ring, thin
# concentric gap, inner disc, vertical slit pupil, catchlight (all evenodd holes).
def _sxy(pts):
    return tuple(round(v * (EYE_W if i % 2 == 0 else EYE_H), 2) for i, v in enumerate(pts))
EYE_UPPER = _sxy((-62, 6, -38, -24, 14, -36, 48, -14))   # upper lid: start, c1, c2, end
EYE_LOWER = _sxy((-62, 6, -26, 24, 28, 24, 54, 5))       # lower lid, same direction
EYE_FLICK = _sxy((76, -9))                               # outer-corner point
EYE_OPEN = (f'M{EYE_UPPER[0]} {EYE_UPPER[1]} C{EYE_UPPER[2]} {EYE_UPPER[3]} {EYE_UPPER[4]} {EYE_UPPER[5]} {EYE_UPPER[6]} {EYE_UPPER[7]} '
            f'L{EYE_FLICK[0]} {EYE_FLICK[1]} L{EYE_LOWER[6]} {EYE_LOWER[7]} '
            f'C{EYE_LOWER[4]} {EYE_LOWER[5]} {EYE_LOWER[2]} {EYE_LOWER[3]} {EYE_LOWER[0]} {EYE_LOWER[1]}Z')
def _circle(r, cx=0, cy=0):
    return f'M{cx - r} {cy}a{r} {r} 0 1 0 {2 * r} 0a{r} {r} 0 1 0 {-2 * r} 0Z'
# iris is a touch larger than the opening, so the lids crop it (hooded look)
EYE_IRIS_D = (_circle(21.5) + _circle(15) + _circle(13.2)                   # ring, gap, disc
              + 'M0 -13.2 C4.4 -6 4.4 6 0 13.2 C-4.4 6 -4.4 -6 0 -13.2Z'     # slit pupil
              + _circle(2.6, -8.2, 2.5))                                     # catchlight (off the slit)
EYE_T = f'translate({EYE_AT[0]} {EYE_AT[1]}) rotate({EYE_ROT})'

def logo_svg():
    planet_mid = (f'<circle class="lg-planet lg-planet--mid" r="{max(mid["w"], mid["h"]) / 2:.1f}" '
                  f'transform="translate({mid["cx"]:.1f} {mid["cy"]:.1f})"/>') if mid else ''
    halo_svg = (f'<circle class="lg-planet lg-planet--halo" r="{max(halo["w"], halo["h"]) / 2:.1f}" '
                f'transform="translate({halo["cx"]:.1f} {halo["cy"]:.1f})"/>') if halo else ''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VB}" class="lg" fill="currentColor">
<defs>
  <mask id="lgX-star" maskUnits="userSpaceOnUse" x="0" y="0" width="{W}" height="{H}">
    <rect width="{W}" height="{H}" fill="#fff"/>
    <path class="lg-star" d="{d_star}" fill="#000" data-origin="{star_c[0]:.1f} {star_c[1]:.1f}"/>
    <g class="lg-eye-cut" transform="{EYE_T}" fill="#000">
      <path class="lg-eye__open" d="{EYE_OPEN}"/>
    </g>
  </mask>
</defs>
<g class="lg-text" mask="url(#lgX-star)"><path d="{d_letters}" fill-rule="evenodd"/></g>
<g class="lg-eye" transform="{EYE_T}" data-tilt="{EYE_ROT}" data-gaze="{EYE_GAZE[0]} {EYE_GAZE[1]}">
  <clipPath id="lgX-eye"><path class="lg-eye__open" d="{EYE_OPEN}"/></clipPath>
  <g clip-path="url(#lgX-eye)"><g class="lg-eye__iris" transform="translate(2 -4)">
    <path d="{EYE_IRIS_D}" fill-rule="evenodd" transform="scale({EYE_IRIS})"/>
  </g>
  <path class="lg-eye__lid" d="" data-upper="{' '.join(map(str, EYE_UPPER))}" data-lower="{' '.join(map(str, EYE_LOWER))}" data-flick="{EYE_FLICK[0]} {EYE_FLICK[1]}"/>
  </g>
</g>
<g class="lg-leaf">
  <path class="lg-leaf__big" d="{d_leaf_big}" fill-rule="evenodd" data-origin="{leaf_big_pivot[0]} {leaf_big_pivot[1]}"/>
  <path class="lg-leaf__small" d="{d_leaf_small}" fill-rule="evenodd" data-origin="{leaf_small_pivot[0]:.1f} {leaf_small_pivot[1]:.1f}"/>
</g>
<g class="lg-comet">
  <path class="lg-trail" d="{d_trail}" fill="none" stroke="currentColor" stroke-width="{dash_w:.1f}" stroke-linecap="round"
        stroke-dasharray="{dash_len - dash_w:.1f} {dash_gap + dash_w:.1f}"/>
  <circle class="lg-planet lg-planet--big" r="{r_big:.1f}" transform="translate({big["cx"]:.1f} {big["cy"]:.1f})"/>
  {planet_mid}
  {halo_svg}
</g>
</svg>'''

def s_mark(tile=False):
    x0, y0, x1, y1 = bbox(S_FULL | LEAF_SMALL)
    pad = 40
    side = max(x1 - x0, y1 - y0) + pad * 2
    vx, vy = (x0 + x1) / 2 - side / 2, (y0 + y1) / 2 - side / 2
    bg = (f'<rect x="{vx:.1f}" y="{vy:.1f}" width="{side}" height="{side}" rx="{side * 0.22:.1f}" fill="#071906"/>'
          if tile else '')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vx:.1f} {vy:.1f} {side} {side}" role="img" aria-label="Sankhya">'
            f'<title>Sankhya</title>{bg}<g fill-rule="evenodd"><path fill="#E2C98F" d="{d_S}"/>'
            f'<path fill="#4ADE6B" d="{d_leaf_big}"/><path fill="#4ADE6B" d="{d_leaf_small}"/></g></svg>')

def write(rel, text):
    path = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'w').write(text)

logo = logo_svg()
write('src/assets/sankhya27.svg', logo)
write('public/logo/sankhya27.svg', logo.replace('class="lg" fill="currentColor"', 'class="lg" fill="currentColor" color="#E2C98F" role="img" aria-label="Sankhya \'27"'))
write('public/logo/sankhya27-S.svg', s_mark())
write('public/logo/sankhya-mark.svg', s_mark(tile=True))
print(f'planets: big r={r_big:.1f}, mid={bool(mid)}, halo={bool(halo)}; dashes={len(dashes)}; viewBox {VB}')
