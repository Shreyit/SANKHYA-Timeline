# SANKHYA '27 — TISS Mumbai

The cultural fest of the School of Analytics, Tata Institute of Social Sciences,
Mumbai. A 2027 landing page themed **Cultural diversity** and a separate
Sankhya recap archive.

## Run

```sh
npm ci
npm run dev
npm run build       # both pages → dist/
npm run preview
```

Vite, vanilla JavaScript, GSAP/ScrollTrigger/SplitText and Lenis. Sanku is a
lazy-loaded Three.js mascot. The Rive runtime loads only when a page uses it.
Registration is a coming-soon CTA; a registration backend is not connected yet.

## Brand

Indian pop-art: crimson, marigold, indigo, charcoal, warm sand and deep maroon.
The hero uses slightly deeper crimson to keep cream body copy legible. The
Recap uses forest-green accents on warm paper. Folk ornaments, paper
grain and halftone details add character; readable grids and
quiet information sections keep the site practical.

See `design-kit/10-THEME-INDIAN-POPART.md` for palette, typography, motif and
motion rules. This direction overrides the design kit's one-accent defaults.

The navbar, landing hero and footer use the supplied motif-free
`SANKHYA Graffiti Comic Logo.png`, using its built-in transparency directly.
The earlier `public/logo/sankhya-popart.svg` vector and its builder remain
available for reference. The favicon is
`public/logo/sankhya-popart-mark.svg`. Original supplied images and traced SVG
remain in `public/logo/` for reference.

To rebuild the wordmark, install Python's `fonttools` package and run:

```sh
npm run logo
# Uses Georgia Bold from the macOS system font directory by default.
# To provide that font on another system:
python3 scripts/logo/build_popart.py --font /path/to/Georgia-Bold.ttf
```

The font is outlined at build time and is never downloaded by site visitors.
Normal Vite builds use the checked-in SVGs and do not require Python or fonts.
The retired green wordmark and tracing scripts remain for reference.

## Graffiti site wordmark

The navbar, landing hero and footer share the supplied
`public/logo/SANKHYA Graffiti Comic Logo.png`. Its oversized S, sweeping
headline, marigold print texture and indigo extrusion are retained. No decorative
motifs or hover animation are added to the lettering.

The supplied PNG has built-in transparency and is displayed directly, without
the older image's outline mask. CSS crops transparent canvas margins only.
The artwork is preloaded and also works without JavaScript. The old PNG,
outline mask, ornate layers and builders remain as unused references.

## Cultural diversity assets and research

`public/elements/motifs/shared/` and `public/elements/motifs/regional/` are ready
for independently chosen artwork. `public/elements/textures/` is reserved for
static material tiles. `catalog.json` records asset files, tradition/place,
maker, source and credit; its lists are empty until the artwork is selected.

See [the asset guide](public/elements/README.md) and
[regional art and texture research](design-kit/11-CULTURAL-DIVERSITY-RESEARCH.md).
The research proposes paper grain, contained textile details and compact print
patterns, with source links and a CSS recipe. No new regional motifs or textures
are active yet.

## Content and structure

`src/data.js` contains archive stats, days, events, committee contacts, cultural
invitation cards and the registration configuration. The page shells contain
hero copy and 2027 lineup placeholders.

- Open registration: set `fest.registrationOpen` and `fest.registerUrl`.
- Add an archive photo: place responsive WebP copies in its folder under
  `public/img/recap/events/`, then add `eventId`, URLs, dimensions and alt text
  to `recap.photos`. The event's name, day and description appear below the film.
  [The event folder guide](public/img/recap/events/README.md) lists all 16 folders.
- Add a result: set an event's `result` text.
- Add contacts: fill `committee` names, emails and phones.

```text
index.html, recap.html       Page shells
src/main.js                 Boot and module wiring
src/data.js                 Editable content
src/style.css               Tokens, responsive layout and print styling
src/brand/motifs.js          Shared hand-drawn folk motif paths
src/fx/motifField.js         Canvas spotlight; static when idle or on touch
src/fx/motif-fields.js       Hero/footer motif mounting
src/features/               Content renderer, nav, pointer effects, archive controls
src/features/film-gallery.js Scroll-driven photo reel and native carousel controls
src/core/                   Environment, GSAP, Lenis and section tracking
src/motion/                 Scroll choreography, text reveals and a GSAP title curtain
src/mascot/                 Sanku, section-aware tips and Three.js scene
public/patterns/             Grain, rangoli linework and folk border SVGs
public/elements/             Future regional motifs, textures and asset credits
scripts/logo/build_graffiti.py Retired outline-mask builder for the earlier PNG
scripts/logo/build_popart.py Vector wordmark builder
```

Reduced motion disables scroll choreography. The wordmark is static. The
motif field remains static on touch, follows the pointer without animation for
reduced-motion users, and pauses rendering when hidden or out of view. Mobile
navigation supports Escape, contained keyboard focus and scroll locking. Internal
page changes use a single forest-green GSAP title curtain (280ms cover, 680ms
reveal), with a pre-paint handoff and a decorative loading line. The recap also
has this entrance on a direct visit. A font-ready timeout keeps it from stalling;
Sanku starts after the reveal. Anchors, external links and new-tab clicks retain
native behaviour. Reduced motion skips the curtain, and Back/Forward clears it
on restore. There are no smoke filters, animated blur or bounce on the recap mark.

`vite.config.js` refuses to erase unrecognised files in `dist/`. Put photos and
other static content in `public/`, rather than hand-placing them in `dist/`.

## Archive filmstrip

Achievements includes the independently verified 2026 greenhouse gas inventory,
with the supplied report statement in `public/reports/sankhya-2026/`.
The feature states the ISO 14064-3:2019 limited assurance scope and credits
Adyra ESG Technologies and Switch Climate Tech. It does not claim festival-wide
ISO certification. Its markup is in `recap.html` and remains available without
JavaScript.

**Event snippets** is a simple, gently waving filmstrip with perforated edges.
The strip contains photographs only. Event titles, categories, descriptions,
results and photo controls live below it and follow the selected photograph.
It replaces the separate event-card grid.
Desktop scrolling advances the reel; mobile and reduced motion use a native
horizontal carousel. Multiple photos enable arrow buttons and keyboard
navigation. One actual photograph produces one frame, with no repetitions.
The pin's scroll distance is bounded so the gallery does not become a long page.

All 16 scheduled events have folders in `public/img/recap/events/`. The fashion
original and its responsive copies are in `re-vogue/`. Empty folders produce
no frames until their photographs are registered in `recap.photos`.

The original 11 MB photograph is retained. Responsive 960px and 1600px WebP
copies (about 22 KB / 47 KB) are lazy-loaded by the browser. UI assets come from
[Lucide on GitHub](https://github.com/lucide-icons/lucide), with their license
included. The film frame uses native SVG and CSS; no carousel dependency or
animation runtime is added. See [the component notes](design-kit/12-RECAP-FILMSTRIP.md).

## Recap wordmark and motion references

The recap hero says **SANKHYA recap**. Its S is preserved from the original
`public/img/Sankhya_white.svg`; ANKHYA uses Merienda Black (weight 900), outlined
as SVG paths with a lower baseline, heavier brush strokes and tighter spacing.
The recap hero mark is slightly smaller within its section. No display font
is requested by visitors and the mark stays still. Regenerate it with:

```sh
python3 scripts/logo/build_recap.py
```

The resulting wordmark is `public/logo/sankhya-recap.svg`. The Merienda source
and its SIL OFL license are bundled in `scripts/logo/fonts/`; the earlier
Knewave font remains for reference. [Merienda source](https://github.com/etunni/merienda).

The navigation uses translucent tinted glass, a static edge highlight and a
single transform/opacity reflection sweep on hover or keyboard focus. The
reflection is confined to each pill and disabled on touch and reduced motion.
The larger TISS mark is 36px wide, with a 28px size on narrow phones.

Motion guidance reviewed for this implementation:
- [GSAP motion skill](https://github.com/Hendo10X/gsap-skills/blob/main/SKILL.md)
- [Official GSAP timelines](https://gsap.com/docs/v3/GSAP/Timeline/)
- [Lenis GSAP integration](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger)

The site's existing npm GSAP setup is retained; the skill's older CDN setup
and licensing examples are not used. The curtain animates transform/opacity
and coordinates with the existing Lenis clock.

## Background performance

Large background rangoli ornaments and their hover/parallax handlers have been
removed from the hero, about, recap, CTA and loading screen. The recap's subtle
green wash is static. Existing small generic hover motif fields remain, along
with the transition's small motif band. The old logo sprite runtime is removed.
