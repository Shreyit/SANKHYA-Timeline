# SANKHYA '27 — TISS Mumbai

The cultural fest of the School of Analytics, Tata Institute of Social Sciences,
Mumbai. A 2027 landing page and a separate 2026 “Circle of Life” archive.

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
2026 archive uses forest-green accents on warm paper. Folk ornaments, paper
grain and halftone details add character; readable grids and
quiet information sections keep the site practical.

See `design-kit/10-THEME-INDIAN-POPART.md` for palette, typography, motif and
motion rules. This direction overrides the design kit's one-accent defaults.

The new wordmark is `public/logo/sankhya-popart.svg`, inlined from
`src/assets/sankhya-popart.svg` by `src/brand/logo.js`. Lettering is real vector
paths, with independent lotus, paisley and flower ornaments that animate on
hover. The nav, hero and footer have unique SVG IDs. The favicon is
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

## Content and structure

`src/data.js` contains archive stats, days, events, committee contacts, cultural
invitation cards and the registration configuration. The page shells contain
hero copy and 2027 lineup placeholders.

- Open registration: set `fest.registrationOpen` and `fest.registerUrl`.
- Add an archive photo: place it in `public/img/recap/`, then add its `photo` URL
  to an event in `recap.events`.
- Add a result: set an event's `result` text.
- Add contacts: fill `committee` names, emails and phones.

```text
index.html, recap.html       Page shells
src/main.js                 Boot and module wiring
src/data.js                 Editable content
src/style.css               Tokens, responsive layout and print styling
src/brand/logo.js           Inline SVG mounting and ornament animation
src/brand/motifs.js          Shared hand-drawn folk motif paths
src/fx/motifField.js         Canvas spotlight; static when idle or on touch
src/fx/motif-fields.js       Hero/footer motif mounting
src/features/               Content renderer, nav, pointer effects, archive controls
src/core/                   Environment, GSAP, Lenis and section tracking
src/motion/                 Scroll choreography, text reveals and smoky page transitions
src/mascot/                 Sanku, section-aware tips and Three.js scene
public/patterns/             Grain, rangoli linework and folk border SVGs
scripts/logo/build_popart.py Vector wordmark builder
```

Reduced motion disables animated logo ornaments and scroll choreography. The
motif field remains static on touch, follows the pointer without animation for
reduced-motion users, and pauses rendering when hidden or out of view. Mobile
navigation supports Escape, contained keyboard focus and scroll locking. Internal
page changes pass through a short smoke curtain, with an incoming pre-paint
handoff. Anchors, external links and new-tab clicks retain native behaviour;
reduced motion skips the curtain, and browser Back/Forward clears it on restore.

`vite.config.js` refuses to erase unrecognised files in `dist/`. Put photos and
other static content in `public/`, rather than hand-placing them in `dist/`.
