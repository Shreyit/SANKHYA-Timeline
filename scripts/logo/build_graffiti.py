"""Trace a static SVG silhouette for the supplied graffiti PNG.

The source bitmap is read only. CSS uses this vector mask to hide its black
canvas while retaining the gold lettering, print texture and indigo extrusion.
Run: python3 scripts/logo/build_graffiti.py (requires Pillow).
"""
from collections import defaultdict
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'public/logo/Golden SANKHYA Graffiti Logo.png'
image = Image.open(SOURCE).convert('RGB')
width, height = image.size

# Trace the bright gold and indigo shapes, excluding the source's faint sketch
# lines. Tiny morphology removes speckles without bridging the letter gaps.
# This derives vector geometry only; the source raster is never edited.
silhouette = Image.new('L', image.size)
source_pixels = image.load()


def is_artwork(pixel):
    r, g, b = pixel
    return (r > 170 and g > 115) or (b > 115 and b > r * 1.25 and b > g * 1.25)


silhouette.putdata([255 if is_artwork(source_pixels[x, y]) else 0
                   for y in range(height) for x in range(width)])
silhouette = (silhouette.filter(ImageFilter.MinFilter(3))
              .filter(ImageFilter.MaxFilter(3))
              .filter(ImageFilter.MaxFilter(5))
              .filter(ImageFilter.MinFilter(5))
              .filter(ImageFilter.GaussianBlur(.7)))
mask = {(x, y) for y in range(height) for x in range(width) if silhouette.getpixel((x, y)) >= 128}

# Keep the lettering/extrusion and the sweeping headline. Detached pen marks
# in the source canvas are not part of either large artwork component.
remaining, artwork = set(mask), set()
while remaining:
    point = remaining.pop()
    stack, component = [point], {point}
    while stack:
        x, y = stack.pop()
        for other in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if other in remaining:
                remaining.remove(other)
                component.add(other)
                stack.append(other)
    if len(component) >= 1500:
        artwork.update(component)
mask = artwork


def simplify(points, tolerance=.85):
    if len(points) < 3:
        return points
    a, b = points[0], points[-1]
    dx, dy = b[0] - a[0], b[1] - a[1]
    length = (dx * dx + dy * dy) ** .5
    distances = [abs(dy * (p[0] - a[0]) - dx * (p[1] - a[1])) / length if length else
                 ((p[0] - a[0]) ** 2 + (p[1] - a[1]) ** 2) ** .5 for p in points]
    index = max(range(len(points)), key=lambda i: distances[i])
    if distances[index] <= tolerance:
        return [a, b]
    return simplify(points[:index + 1], tolerance)[:-1] + simplify(points[index:], tolerance)


edges = defaultdict(list)
for x, y in mask:
    if (x, y - 1) not in mask: edges[(x, y)].append((x + 1, y))
    if (x + 1, y) not in mask: edges[(x + 1, y)].append((x + 1, y + 1))
    if (x, y + 1) not in mask: edges[(x + 1, y + 1)].append((x, y + 1))
    if (x - 1, y) not in mask: edges[(x, y + 1)].append((x, y))

loops = []
while edges:
    start = min(edges)
    point, loop = start, [start]
    while True:
        next_point = edges[point].pop()
        if not edges[point]: del edges[point]
        loop.append(next_point)
        point = next_point
        if point == start: break
    area = abs(sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(loop, loop[1:]))) / 2
    if area > 160:
        loops.append(simplify(loop))

path = ''.join('M' + 'L'.join(f'{x} {y}' for x, y in loop[:-1]) + 'Z' for loop in loops)
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 115 {width} 690"><path fill="white" stroke="white" stroke-width="3" stroke-linejoin="round" fill-rule="evenodd" d="{path}"/></svg>\n'
destination = ROOT / 'public/logo/sankhya-graffiti-mask.svg'
destination.write_text(svg)
print(f'{destination.relative_to(ROOT)}: {len(loops)} outlines, {len(svg):,} bytes. Original PNG untouched.')
