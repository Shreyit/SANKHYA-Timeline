# SANKHYA '27 — Landing Page

Sankhya is the annual cultural fest of the **School of Analytics**, **Tata Institute of Social Sciences (TISS) Mumbai**. This repo is the landing page for the 2027 edition, plus an archive of Sankhya '26 — *Circle of Life*.

## Stack

- **Vite** (vanilla JS, no framework) — static build, deploys to Vercel as-is
- **GSAP** (ScrollTrigger, SplitText) + **Lenis** smooth scroll
- Fonts: Geist, Geist Mono (Google Fonts)
- Design system: `design-kit/`. Theme is "Nardo": sporty dark greys with one electric-green accent `#3DFF8C`; the '26 recap re-maps tokens to gold `#FFC53D`

The backend (FastAPI, for registrations) will come later. For now the Register buttons show a "soon" badge.

## Run

```bash
npm install
npm run dev       # local dev server
npm run build     # → dist/
npm run logo      # re-export logo SVGs to public/logo/
```

## Editing content

All copy lives in **`src/data.js`**. You shouldn't need to touch any markup:

| What | Where in `data.js` |
|---|---|
| Open registrations | `fest.registrationOpen = true`, `fest.registerUrl = '…'` |
| 2026 event photos | add `photo: '/img/recap/<file>.jpg'` to an event (put files in `public/img/recap/`) |
| 2026 results / winners | add `result: '1st — Team X'` to an event |
| Core committee contacts | `committee[]` — `name`, `email`, `phone` |
| 2026 stats | `recap.stats` |

The 2027 schedule, events, competitions and sponsor cards are "coming soon" placeholders in `index.html` (`#lineup`).

## Logos

'27 mark: green wordmark with a sprout, a star and a comet.

- Source art: `public/img/hero_logo.png` (green on black). Edit this, never the generated SVGs.
- Build: `npm run logo` runs `scripts/logo/build_hero.py`. It splits the PNG into layers and traces each one to smooth vectors with potrace:
  - letters: static, one flat colour (`currentColor`, set on `.logo`)
  - leaf: the sprout, cut away from the S where its stems join
  - star: the cut-out in the H, kept as a mask so the hole itself can spin
  - comet: the dashes redrawn as one dashed stroke so they can stream, plus three planets
  - eye (in the N): hand-drawn vector, not traced. The opening, brow and lash tail are cut out of the N; the iris is clipped to the opening, plus a lid. Placement is fully adjustable in the build script: `EYE_AT` (centre), `EYE_ROT` (angle), `EYE_W`/`EYE_H` (stretch the opening), `EYE_IRIS` (iris size, always round), `EYE_GAZE` (how far the iris looks around). It sits on the N's upper shoulder by default
- One-time setup for the build: `python3 -m venv .venv-logo && .venv-logo/bin/pip install numpy pillow scipy potracer`
- Outputs:
  - `src/assets/sankhya27.svg`: inlined into the page by `src/logo.js` (replaces each `<img class="logo">`, which stays as the no-JS fallback)
  - `public/logo/sankhya27.svg`: the same logo for downloads/print
  - `public/logo/sankhya27-S.svg`: **S letter mark** (the S with its sprout)
  - `public/logo/sankhya-mark.svg`: favicon (letter mark on a nardo tile)
- Hover (GSAP, one full pass that always finishes): the leaf sways from its stem, the star spins a quarter turn with a pulse, the comet dashes stream toward the big planet, the planets bob and pulse, and the eye blinks. The letters never move.
- Eye blink: the lid's edge is a curve interpolated from the upper lid to the lower lid, so it sweeps down and flattens like a real blink. It plays on hover and on its own every 3–6.5 s (now and then a double blink).
- Eye tracking: while the pointer is anywhere in the logo's section (hero, footer, nav), the iris follows it (`watch` in `src/logo.js`; it reads the angle and travel from the SVG, so nothing needs syncing).
- Sized in `em`: set `font-size` on the wrapper (nav 30px, hero ~17vw/256px max, footer full width).
- The previous graffiti tag is archived in `scripts/logo/archive/` and no longer used.

'26 mark: white emblem — `public/img/Sankhya_white.svg` (tight-cropped viewBox, transparency kept). Lives on `recap.html` above the archive title as `img.mark26`.

- Hover (CSS only): `jelly` — squash/stretch/overshoot bounce in the spirit of the old dot bounce, plus a gold glow. Triggered by `.mark26-trigger`.
- `sankhya-mark.svg` is the favicon. (`scripts/logo/build.mjs` + `sankhya27-base/dot/full.svg` are the retired telemetry mark — kept for reference.)

## Liquid glass (`src/liquidGlass.js`)

A physically-based approximation of Apple's material, used on the **logo's leaves and planets** on the hero and footer. The letters stay solid.

1. **Distance field:** distance to the edge per pixel. It's a two-pass chamfer approximation, smoothed, for the leaf and planet shapes.
2. **Height:** a squircle bezel `h = T·(1 − (1 − d/B)⁴)^¼`, flat beyond the bezel width B.
3. **Normal:** slope `m = dh/dd`, tilted outward along the edge direction.
4. **Snell's law:** `θ₁ = atan(m)`, `θ₂ = asin(sin θ₁ / 1.5)`. The background shifts by `Δ = h·tan(θ₁ − θ₂)` toward the inside.
5. **Displacement map:** `Δ` goes into R/G (`scale = 2·maxΔ`) for an SVG `feDisplacementMap` applied through `backdrop-filter: url()`.
6. **Specular map:** from the same normals and a top-left light, giving a sharp key rim and a dim opposite bounce.

Refraction needs Chromium (Chrome, Edge, Brave). Other browsers get the specular rim and tint without the bend. Tune `bezel` and `thickness` in `glassDecor` in `logo.js`.

The navbar is deliberately plain: a forest-green frosted pill (light blur, hairline border, sand top edge) that firms up once you scroll (`.glass` / `.nav.is-scrolled` in `style.css`).

## Interaction recipes in use

- `src/hover.js`: `trackSpotlight` (cards)
- Target-lock cursor (`initCursor` in `main.js`, design-kit `CURSOR.md`)
- Pill nav (`initPillNav`): the indicator glides to the hovered link and rests on the section in view
- `src/glyphField.js`: green glyph spotlight (top band + footer). Cursor spotlight over shimmering `#$%&@` glyphs.

## Structure

```text
index.html, recap.html     page shells
src/main.js                boot only — wires the modules below
src/core/                  env helpers · gsap.js (plugins registered once) ·
                           scroll.js (Lenis on GSAP's ticker → ScrollTrigger) ·
                           sections.js (fires `section:change` as you scroll)
src/motion/                scroll-animations.js — all GSAP/ScrollTrigger/SplitText choreography
src/features/              render.js (data → markup) · nav.js · pointer.js (cursor, spotlight,
                           magnetic) · recap.js (tabs, filters, odometers)
src/brand/                 logo.js (inline layered logo + hover) · liquidGlass.js
src/fx/                    glyph fields, hover helpers
src/rive/                  rive.js — Rive loader for <canvas data-rive>
src/mascot/                Sanku: index.js (dock, bubble, logic) · scene.js (three.js) · tips.js (copy)
src/data.js                editable content
src/assets/                generated logo SVG (inlined)
scripts/logo/build_hero.py '27 logo build (PNG → layered SVG + S mark)
public/                    static files (put photos in public/img/recap/, Rive files in public/rive/)
design-kit/                design system guidelines
```

## Motion stack

- **Lenis**: smooth scroll. It runs on GSAP's ticker, so scroll, ScrollTrigger and every tween share one clock. It's off for reduced-motion users.
- **GSAP + ScrollTrigger + SplitText**: all scroll animation lives in `src/motion/`.
- **Rive**: vector animation. Add `<canvas data-rive="/rive/name.riv" data-rive-sm="State Machine 1" data-rive-hover="isHovered">`. The runtime downloads only on pages that use it, animations play only while on screen, and a failed load adds `.rive--failed` for a static fallback.
- **three.js**: Sanku, the floating mascot (bottom-right). It's built in code, with no model file. It's lazy-loaded when the browser is idle, follows the cursor, leans with scroll, blinks, and hops or spins when you reach a new section. Its tips come from `src/mascot/tips.js`, keyed by page section. It pops up once per section; "Hide tips" turns auto-popups off (remembered), and tapping Sanku always cycles tips. Rendering pauses when the tab is hidden, and it stays still for reduced-motion users.

