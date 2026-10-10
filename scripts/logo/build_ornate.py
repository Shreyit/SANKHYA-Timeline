"""Create independently animatable motif layers around the supplied logo.

The PNG is unchanged. SVG underpainting covers selected ornaments, and exact
clipped copies of those pixels are emitted as small composited HTML layers.
Run: python3 scripts/logo/build_ornate.py (requires Pillow).
"""
from pathlib import Path
from collections import defaultdict
from statistics import median
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
image = Image.open(ROOT / 'public/logo/Ornate SANKHYA Golden Wordmark.png').convert('RGBA')
pixels = image.load()
regions = [
    ('lotus-top', 'removed', (253, 147, 441, 308)),
    ('lotus-centre', 'removed', (232, 364, 407, 477)),
    ('lotus-bottom', 'removed', (256, 618, 403, 738)),
    ('vine', 'removed', (432, 186, 533, 309)),
    ('s-foliage-bottom', 'removed', (104, 511, 302, 731)),
    ('s-floral-stem', 'removed', (289, 458, 432, 596)),
    ('star-s', 'turn', (206, 288, 260, 346)),
    ('star-s-lower', 'turn', (424, 599, 475, 652)),
    ('flower-a', 'static', (548, 521, 693, 636)),
    ('star-n', 'turn', (831, 479, 932, 578)),
    ('star-h', 'turn', (1270, 467, 1335, 541)),
    ('flower-a-last', 'static', (1507, 553, 1628, 672)),
]

def simplify(points, tolerance=.55):
    if len(points) < 3:
        return points
    a, b = points[0], points[-1]
    dx, dy = b[0] - a[0], b[1] - a[1]
    length = (dx * dx + dy * dy) ** .5
    distances = [(abs(dy*(p[0]-a[0])-dx*(p[1]-a[1]))/length if length else
                  ((p[0]-a[0])**2+(p[1]-a[1])**2)**.5) for p in points]
    index = max(range(len(points)), key=lambda i: distances[i])
    if distances[index] <= tolerance:
        return [a, b]
    return simplify(points[:index+1], tolerance)[:-1] + simplify(points[index:], tolerance)

def contour(mask):
    edges = defaultdict(list)
    for x, y in mask:
        if (x, y-1) not in mask: edges[(x, y)].append((x+1, y))
        if (x+1, y) not in mask: edges[(x+1, y)].append((x+1, y+1))
        if (x, y+1) not in mask: edges[(x+1, y+1)].append((x, y+1))
        if (x-1, y) not in mask: edges[(x, y+1)].append((x, y))
    loops = []
    while edges:
        start = min(edges)
        point = start
        loop = [start]
        while True:
            next_point = edges[point].pop()
            if not edges[point]: del edges[point]
            loop.append(next_point)
            point = next_point
            if point == start: break
        if len(loop) > 4:
            loops.append(simplify(loop))
    return ''.join('M'+'L'.join(f'{x} {y}' for x,y in loop[:-1])+'Z' for loop in loops)

motifs = []
for name, motion, (x0, y0, x1, y1) in regions:
    candidates = set()
    gold = []
    for y in range(y0, y1):
        for x in range(x0, x1):
            r, g, b, alpha = pixels[x,y]
            if alpha > 180 and 65 < r < 190 and g < 110 and b < 110 and r > g+40:
                candidates.add((x,y))
            if alpha > 220 and r > 225 and g > 160 and b < 135:
                gold.append((r,g,b))
    selected = set()
    while candidates:
        point = candidates.pop()
        group, stack = {point}, [point]
        while stack:
            x,y = stack.pop()
            for other in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
                if other in candidates:
                    candidates.remove(other);group.add(other);stack.append(other)
        if len(group) >= 60:
            selected.update(group)
    if not selected: continue
    # One pixel of original edge colour is carried with each ornament.
    mask = set(selected)
    for x,y in selected:
        mask.update((x+dx,y+dy) for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)])
    bounds = [min(x for x,y in mask), min(y for x,y in mask),
              max(x for x,y in mask)+1, max(y for x,y in mask)+1]
    fill = '#%02x%02x%02x' % tuple(round(median(c[i] for c in gold)) for i in range(3))
    motifs.append({'name':name,'motion':motion,'bounds':bounds,'path':contour(mask),'fill':fill})

viewbox = '0 115 1774 690'
source_url = '/logo/Ornate%20SANKHYA%20Golden%20Wordmark.png'
patches = ''.join(f'<path d="{m["path"]}" fill="{m["fill"]}" fill-rule="evenodd"/>' for m in motifs)
patch_clip = ''.join(f'<path d="{m["path"]}" clip-rule="evenodd"/>' for m in motifs)
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" role="img" aria-labelledby="sk-title sk-desc">
<title id="sk-title">Sankhya</title>
<desc id="sk-desc">Ornate Sankhya lettering with a simplified S and independently rotating stars.</desc>
<defs>
  <clipPath id="sk-patches">{patch_clip}</clipPath>
  <pattern id="sk-print" width="31" height="29" patternUnits="userSpaceOnUse" fill="#DB781B" opacity=".13"><circle cx="3" cy="7" r=".7"/><circle cx="17" cy="19" r=".5"/><circle cx="26" cy="4" r=".6"/></pattern>
</defs>
<image href="{source_url}" x="0" y="0" width="1774" height="887"/>
{patches}
<rect x="0" y="115" width="1774" height="690" fill="url(#sk-print)" clip-path="url(#sk-patches)"/>
</svg>'''
(ROOT / 'src/assets/sankhya-ornate.svg').write_text(svg)
visible = [m for m in motifs if m['motion'] != 'removed']
(ROOT / 'src/assets/ornate-motifs.json').write_text(json.dumps(visible,separators=(',',':')))
# A standalone wrapper retains the ornaments at rest as well.
rest = ''.join(f'<defs><clipPath id="orn-{m["name"]}"><path d="{m["path"]}" clip-rule="evenodd"/></clipPath></defs><image href="{source_url}" width="1774" height="887" clip-path="url(#orn-{m["name"]})"/>' for m in visible)
(ROOT / 'public/logo/sankhya-ornate.svg').write_text(svg.replace('</svg>',rest+'</svg>'))
print(f'Simplified S; {sum(m["motion"] == "turn" for m in visible)} rotating stars and static A details. Original PNG untouched.')
