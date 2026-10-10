# SANKHYA 2027 — cultural diversity and texture research

Research date: 9 October 2026. Status: directions for discussion; no regional
motifs or new texture assets are selected or implemented.

## Design direction

Keep the motif-free **SANKHYA Graffiti Comic Logo.png** as the shared identity.
Its gold lettering, indigo depth and printed halftone already establish the
pop-art character. Regional art should appear as separate illustrations,
borders or feature panels, giving each tradition room to be recognised.

Keep the existing crimson, marigold, indigo, charcoal, sand and maroon palette
for the site's interface. The recap keeps its forest-green archive treatment.
Regional artwork can retain characteristic colours where that improves its
identity; use consistent margins, typography and credits to unite it.

Show the tradition's name, associated place/community and maker alongside
substantial artwork. These are living traditions with overlapping geographies,
not a one-symbol-per-state system. The following is a broad starting shortlist,
not a complete survey of India.

## Regional shortlist

The visual associations below come from primary government tourism and craft
sources. **Proposed website uses are our design interpretations**, not claims
made by those sources. Reference images have not been downloaded or reused.

| Tradition and association | Useful visual qualities | Possible placement | Research source |
| --- | --- | --- | --- |
| Warli — Warli communities in Maharashtra and neighbouring western regions | Simple geometric figures and scenes of community life | A small illustration accompanying dance or participation content | [Incredible India: Warli](https://www.incredibleindia.gov.in/en/maharashtra/the-enduring-tribal-artistry-of-maharashtra-warli-paintings) |
| Mithila / Madhubani — Bihar's Mithila region | Dense linework, geometric filling and strong frames | A framed art feature or section divider | [Bihar Tourism: Madhubani](https://tourism.bihar.gov.in/en/experiences/art-and-craft/painting/madhubani-or-mithila-painting) |
| Pattachitra — Raghurajpur, Odisha | Cloth painting, detailed narrative imagery | A dedicated artwork panel with a caption | [Odisha Tourism: Raghurajpur](https://odishatourism.gov.in/content/tourism/en/discover/attractions/arts-crafts/raghurajpur.html) |
| Gond painting — including artists in Patangarh, Madhya Pradesh | Patterned lines and dots within recognisable subjects | One commissioned nature or collective-life illustration | [MP Tourism: Patangarh](https://www.mptourism.com/patangarhs-gond-paintings.html) |
| Kalamkari — Andhra Pradesh; distinguish Srikalahasti pen work from Machilipatnam / Pedana block printing | Drawn textile narratives or repeating textile borders | A narrow textile-inspired frame beside fashion or craft content | [Development Commissioner (Handicrafts): Kalamkari](https://handicrafts.nic.in/crafts/All_Crafts/Craft_Categories/Textile/Other_Textiles_Based/Machilipatnam_Kalamkari/MachilipatnamKalamkariWebPage.html) |
| Phulkari — Punjab | Geometric and floral forms made with counted stitches | A woven-edge detail or fashion illustration | [Incredible India: Phulkari](https://www.incredibleindia.gov.in/en/punjab/phulkari) |
| Kutch Ajrakh — Kachchh, Gujarat; connected to a wider textile tradition | Symmetrical block prints in indigo, red and contrasting neutrals | A compact border or one contained patterned panel | [Development Commissioner (Handicrafts): Kutch Ajrakh](https://handicrafts.nic.in/crafts/All_Crafts/Craft_Categories/Textile/Hand_Block_Printing/Kutch_Ajrakh/KutchAjrakhwebpage.html) |
| Phad — Rajasthan, including Shahpura near Bhilwara | Narrative cloth scrolls | A sequence of illustrated moments in a culture feature | [Rajasthan Tourism: Phads](https://www.tourism.rajasthan.gov.in/content/rajasthan-tourism/en/shopping-in-rajasthan.html) |
| Majuli mask-making — Assam's satra and Bhaona performance context | Sculptural theatrical masks | A theatre feature with its specific cultural context | [Incredible India: Majuli](https://www.incredibleindia.gov.in/en/assam/majuli) |

First design round: compare a small Warli illustration, an Ajrakh border and a
Phulkari detail with the unchanged wordmark. Include a southern and northeastern
reference in the following round so a few familiar traditions do not define
the whole theme. This is a suggested review sequence; the selection remains open.

Keep sacred figures and ceremonial imagery within their explained context.
Choose artists' appropriate subjects instead of turning every cultural image
into a generic hover decoration. For an adaptation, credit the actual designer
and name the reference tradition rather than implying it is traditional work.

## Textures that fit this site

These are design recommendations for the next implementation phase.

| Surface | Treatment | Starting intensity | Purpose |
| --- | --- | --- | --- |
| Crimson hero | Fine static print grain; leave the wordmark's existing texture intact | 3–5% overlay | A festival-poster feel without crowding the logo |
| Warm-paper about / recap | A seamless paper-fibre tile | 3–6% overlay | Tactile paper while preserving reading clarity |
| Culture / fashion feature | A subtle cotton weave within its illustration panel | 4–8% overlay | Material context in a limited area |
| Illustration edges / selected borders | Static halftone or slightly uneven ink coverage | Adjust locally | Connect original artwork with the pop-art palette |
| Nav, forms, schedules, body-copy cards | Plain surfaces or the faint shared paper tile | Minimal | Keep practical information easy to scan |

Material grain and regional pattern are different layers: paper/cloth adds
surface character, while named artwork communicates cultural identity. Avoid
making every section a competing pattern. Keep one main artwork per view and
let controls and text breathe.

## Lightweight implementation

The site currently has a fixed, static grain overlay using
`public/patterns/print-grain.svg` (`feTurbulence`, three octaves). It does not
animate. A later texture pass should compare it with a pre-rendered seamless
raster tile, rather than stacking another noise layer on top. Whether it is
faster on the target device needs profiling; no performance gain is assumed.

Use a small repeated WebP tile for realistic fibres/weave. Use a compact SVG
without live filters for simple dots or linework. Proposed project budgets:
128–256px tiles, 10–30KB each, and at most one material layer per surface.
Check compression and seams at normal size before accepting those targets.

CSS supports repeated and multiple background images. `image-set()` can
provide alternative formats/densities, with a simple URL fallback. A pseudo
element permits independent texture opacity without dimming the text.
[MDN: multiple backgrounds](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Backgrounds_and_borders/Using_multiple_backgrounds),
[MDN: image-set](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/image/image-set).

```css
/* Proposed recipe only; these files and classes are not active yet. */
.paper-surface {
  --texture-strength: .045;
  position: relative;
  isolation: isolate;
  background-color: var(--p-sand);
}
.paper-surface::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: var(--texture-strength);
  background-image: url('/elements/textures/paper-fine.webp');
  background-image: image-set(
    url('/elements/textures/paper-fine.avif') type('image/avif'),
    url('/elements/textures/paper-fine.webp') type('image/webp')
  );
  background-repeat: repeat;
  background-size: 192px 192px;
}
```

Keep textures stationary. Avoid animated `background-position`, turbulence,
full-screen blur and scroll-linked scaling. If we later animate the shared
circle/star, restrict the change to a small element's transform/opacity and
honour reduced motion. Avoid permanent `will-change` on every section: extra
compositing layers have their own memory cost.
[web.dev: performant animations](https://web.dev/articles/animations-guide),
[web.dev: layer management](https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count).

## Next implementation review

1. Choose traditions and actual artwork with credits; add separate SVGs or
   illustration images to `public/elements/motifs/regional/` and the catalog.
2. Compare two static paper tiles on crimson and warm sand; use one shared
   base and a contained textile treatment where it has a clear purpose.
3. Check seam visibility, legibility and focus contrast on mobile and desktop.
4. Profile scroll and hover with DevTools Paint Flashing and a Performance
   recording. Texture surfaces should not repaint continuously while idle.
   Validate on a mid-range phone before claiming smooth performance.

The large moving background rangoli remains removed. The new logo has no
appended decorative motifs or hover animation. Existing small generic fields
and transition-band accents remain separate until the regional design pass.
