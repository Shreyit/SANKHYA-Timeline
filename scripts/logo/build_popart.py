"""Build the pop-art wordmark as real vector paths, with separate ornaments.

Usage: python3 scripts/logo/build_popart.py [--font /path/to/bold-serif.ttf]
Requires fontTools. The font is outlined at build time, never served to visitors.
"""
import argparse
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser()
parser.add_argument('--font', default='/System/Library/Fonts/Supplemental/Georgia Bold.ttf')
args = parser.parse_args()
font = TTFont(args.font)
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
units = font['head'].unitsPerEm

# The silhouette stays still; only the folk ornaments move.
letters = []
x = 42
for i, char in enumerate('SANKHYA'):
    size = 490 if i == 0 else 340
    sx = size / units * (1.05 if i == 0 else .89)
    sy = size / units
    baseline = 380 if i == 0 else 352
    pen = SVGPathPen(glyphs)
    glyph = glyphs[cmap[ord(char)]]
    glyph.draw(TransformPen(pen, (sx, 0, 0, -sy, x, baseline)))
    letters.append(pen.getCommands())
    x += glyph.width * sx - (5 if i == 0 else 7)
width = round(x + 48)
paths = ''.join(f'<path d="{p}"/>' for p in letters)

lotus = 'M50 82C30 74 12 65 9 44C28 44 38 53 50 70C34 48 34 27 50 8C66 27 66 48 50 70C62 53 72 44 91 44C88 65 70 74 50 82Z M18 32C34 34 43 45 46 62C28 54 21 46 18 32Z M82 32C66 34 57 45 54 62C72 54 79 46 82 32Z'
paisley = 'M36 86C6 76 7 43 32 34C57 26 65 8 61 3C89 22 92 64 70 82C60 91 46 92 36 86Z M42 72C25 63 30 46 44 45C56 44 63 37 65 28C78 51 65 80 42 72Z'
diamond = 'M50 5C56 30 69 43 93 50C69 56 56 70 50 95C44 70 31 56 7 50C31 43 44 30 50 5Z'
flower = ''.join(f'<path d="M50 50C27 33 33 9 50 3C67 9 73 33 50 50Z" transform="rotate({a} 50 50)"/>' for a in range(0,360,60)) + '<circle cx="50" cy="50" r="7" fill="#FFD129"/>'

def ornament(kind, px, py, size, motion):
    art = flower if kind == 'flower' else f'<path d="{dict(lotus=lotus, paisley=paisley, diamond=diamond)[kind]}"/>'
    return (f'<g transform="translate({px} {py}) scale({size/100})">'
            f'<g class="sk-ornament sk-ornament--{kind}" data-motion="{motion}" fill="#8B0F14">{art}</g></g>')

# Coordinates correspond to the outlined glyphs, not a font rendered at runtime.
ornaments = (
    ornament('lotus', 149, 163, 74, 'bloom') +
    ornament('lotus', 154, 325, 48, 'bloom') +
    ornament('paisley', 92, 132, 56, 'sway') +
    ornament('diamond', 286, 252, 40, 'turn') +
    ornament('flower', 503, 237, 40, 'turn') +
    ornament('paisley', 645, 141, 40, 'sway') +
    ornament('diamond', 758, 278, 38, 'turn') +
    ornament('flower', 890, 219, 44, 'turn') +
    ornament('lotus', 1007, 304, 34, 'bloom') +
    ornament('flower', 1131, 211, 44, 'turn') +
    ornament('paisley', 1269, 157, 40, 'sway') +
    ornament('diamond', 1444, 303, 36, 'turn') +
    ornament('flower', 1696, 237, 40, 'turn')
)

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} 432" role="img" aria-labelledby="sk-title sk-desc">
<title id="sk-title">Sankhya</title>
<desc id="sk-desc">Marigold serif lettering with indigo print shadows and Indian folk-inspired ornaments.</desc>
<defs>
  <g id="sk-letters">{paths}</g>
  <clipPath id="sk-face">{paths}</clipPath>
  <pattern id="sk-halftone" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.35" fill="#E61E25"/></pattern>
  <pattern id="sk-speckle" width="89" height="73" patternUnits="userSpaceOnUse" fill="#8B0F14">{''.join(f'<circle cx="{(i*31)%89}" cy="{(i*23)%73}" r="{.5+(i%3)*.3}"/>' for i in range(22))}</pattern>
  <linearGradient id="sk-ink" x2="0.2" y2="1"><stop stop-color="#FFE46C"/><stop offset=".65" stop-color="#FFD129"/><stop offset="1" stop-color="#FFBD25"/></linearGradient>
</defs>
<use href="#sk-letters" transform="translate(14 22)" fill="#0B0B0B" stroke="#0B0B0B" stroke-width="19" stroke-linejoin="round"/>
<use href="#sk-letters" transform="translate(12 17)" fill="#3B1CF4" stroke="#3B1CF4" stroke-width="4" stroke-linejoin="round"/>
<use href="#sk-letters" fill="url(#sk-ink)" stroke="#0B0B0B" stroke-width="5" stroke-linejoin="round"/>
<g clip-path="url(#sk-face)">
  <rect width="{width}" height="432" fill="url(#sk-speckle)" opacity=".24"/>
  <path d="M0 90L{width} 200V227L0 117Z M0 322L{width} 360V400L0 368Z" fill="url(#sk-halftone)" opacity=".48"/>
  {ornaments}
</g>
</svg>'''
(ROOT / 'src/assets/sankhya-popart.svg').write_text(svg)
(ROOT / 'public/logo/sankhya-popart.svg').write_text(svg)

# The navigation and favicon use a legible, simplified S at small sizes.
mark = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 432"><rect width="432" height="432" rx="48" fill="#C91A23"/><g transform="translate(25 0)"><path d="{letters[0]}" transform="translate(8 16)" fill="#3B1CF4" stroke="#0B0B0B" stroke-width="12"/><path d="{letters[0]}" fill="#FFD129"/>{ornament('lotus',149,163,74,'bloom')}</g></svg>'''
(ROOT / 'public/logo/sankhya-popart-mark.svg').write_text(mark)
print(f'Built {width} × 432 vector wordmark and S mark.')
