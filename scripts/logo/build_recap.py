"""Outline Merienda Black beside the original Sankhya S.

python3 scripts/logo/build_recap.py (requires fontTools)
The bundled OFL font is used at build time only; visitors load SVG paths.
"""
from pathlib import Path
import xml.etree.ElementTree as E
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.svgLib.path import parse_path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parents[2]
source = E.parse(ROOT / 'public/img/Sankhya_white.svg').getroot()
# The original file contains off-canvas artwork; use the visible S only.
art = list(source.iter('{http://www.w3.org/2000/svg}path'))[-1].attrib['d']
bounds = BoundsPen(None)
parse_path(art, bounds)
left, top, right, bottom = bounds.bounds
scale = 420 / (bottom - top)
s_pen = SVGPathPen(None)
parse_path(art, TransformPen(s_pen, (scale, 0, 0, scale, 20 - left * scale, 20 - top * scale)))

# The brush typeface gives ANKHYA a heavier, calligraphic rhythm. Its lower
# baseline sits just above the S's bottom sweep instead of floating high.
font = instantiateVariableFont(TTFont(ROOT / 'scripts/logo/fonts/Merienda.ttf'), {'wght': 900})
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
raw = SVGPathPen(glyphs)
x = 0
for char in 'ANKHYA':
    glyph = glyphs[cmap[ord(char)]]
    glyph.draw(TransformPen(raw, (1, 0, 0, 1, x, 0)))
    x += glyph.width - 52

letter_bounds = BoundsPen(None)
parse_path(raw.getCommands(), letter_bounds)
_, bottom, _, top = letter_bounds.bounds
sy = 320 / (top - bottom)
shaped = SVGPathPen(None)
parse_path(raw.getCommands(), TransformPen(shaped, (1, 0, .04, -sy, 0, 0)))
letter_bounds = BoundsPen(None)
parse_path(shaped.getCommands(), letter_bounds)
left, _, right, bottom = letter_bounds.bounds
sx = 1140 / (right - left)
letters = SVGPathPen(None)
parse_path(shaped.getCommands(), TransformPen(letters, (sx, 0, 0, 1, 430 - left * sx, 425 - bottom)))

width = 1590
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} 460" role="img" aria-label="Sankhya">
<!-- Original Sankhya S; ANKHYA outlined from Merienda Black (SIL OFL). -->
<g fill="#1B4D32"><path d="{s_pen.getCommands()}"/><path d="{letters.getCommands()}"/></g>
</svg>'''
(ROOT / 'public/logo/sankhya-recap.svg').write_text(svg)
print(f'Built {width} × 460 brush wordmark, preserving the S.')
