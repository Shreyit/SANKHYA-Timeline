# 08 — Theme Preset: Dark Dev-Tool

An alternate theme for the kit: a **near-black, monochrome, Geist-based** look used by modern
developer-tool and AI-infra marketing sites (reference analysed: memorable.sh). Use it instead
of the warm editorial palette in `02-DESIGN-TOKENS.md` when the audience is developers and
technical teams. Everything else (principles, motion vocabulary, recipes, checklist) still applies.

> Use the *style*, not the brand. Always ship your own name, logo, copy and imagery.

## When to use which theme

| | Studio Editorial (02, default) | Dark Dev-Tool (this file) |
|---|---|---|
| Audience | Founders, brands, consumers | Developers, technical teams |
| Surface | Warm off-white, alternating dark sections | Pure black everywhere |
| Type | Satoshi / General Sans, huge display | Geist (+ Geist Mono), tighter, smaller display |
| Colour | 1 warm accent | Monochrome; accent optional and tiny |
| Depth | Borders, almost no shadow | Deep drop shadows + 1px inset top highlight |
| Motion | Expressive, 800–1200ms reveals | Crisp, 150–650ms |

## Design intent (one sentence)

Clean, functional, implementation-oriented: a dark canvas where content, code and product
UI float on softly-lit surfaces, and nothing decorative competes with the message.

---

## Tokens

The raw values were extracted from a scaled render (×0.764). They're normalised back to whole
pixels below. **Use these, not the raw extraction.**

### Typography

```css
:root[data-theme="devtool"] {
  --font-body:    "Geist", "Geist Fallback", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-display: var(--font-body);
  --font-mono:    "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace;

  /* UI / body scale (normalised from extraction) */
  --fs-2xs: 12px;   /* raw 9.93  → badges, legal */
  --fs-xs:  13px;   /* raw 10.70 → labels, meta */
  --fs-sm:  14px;   /* raw 12.22 → secondary text, nav links */
  --fs-base:16px;   /* body (line-height 24px) */
  --fs-md:  17px;   /* raw 12.99 */
  --fs-lg:  18px;   /* raw 13.75 → lead */
  --fs-xl:  19px;   /* raw 14.52 */

  /* Display scale (not in extraction — kit defaults, tuned for Geist) */
  --fs-h3:      clamp(1.25rem, 1.05rem + 0.8vw, 1.75rem);
  --fs-h2:      clamp(2rem, 1.5rem + 2.2vw, 3.5rem);
  --fs-h1:      clamp(2.5rem, 1.6rem + 4vw, 5.5rem);
  --fs-display: clamp(3rem, 1.6rem + 6vw, 8rem);
}
```

- Base: 16px / 24px line-height / weight 400.
- Headings: weight 500–600, `letter-spacing: -0.04em` (display) to `-0.02em` (h3), `line-height: 1–1.1`.
- Labels, code, tokens, stats: `--font-mono`, `--fs-xs`, uppercase optional, `letter-spacing: 0.02em`.
- Load Geist from the `geist` npm package (`import { GeistSans, GeistMono } from 'geist/font'`) or Google Fonts.

### Colour (semantic)

```css
:root[data-theme="devtool"] {
  --c-bg:          #000000;                 /* color.surface.base */
  --c-surface:     #131418;                 /* color.surface.strong — cards, panels */
  --c-surface-muted: rgba(255,255,255,0.03);/* color.surface.muted — subtle fills, hover */
  --c-ink:         #EDEDED;                 /* color.text.primary */
  --c-ink-strong:  #FFFFFF;                 /* color.text.tertiary — headings, key numbers */
  --c-muted:       #A0A0A8;                 /* color.text.secondary (lab 65.6) */
  --c-inverse:     #F2F2F2;                 /* color.text.inverse — text on light buttons */
  --c-line:        rgba(255,255,255,0.08);  /* hairlines */
  --c-line-strong: rgba(255,255,255,0.14);  /* input borders, hover borders */

  --c-accent:      #FFFFFF;                 /* monochrome by default */
  --c-accent-ink:  #000000;
  /* Optional brand accent: one hue at ≤3% of the screen, e.g. status dots, focus ring */
  --c-signal:      #3DDC97;                 /* success/live; swap per brand */
  --c-danger:      #FF6369;
  --focus-ring:    0 0 0 2px var(--c-bg), 0 0 0 4px rgba(255,255,255,0.9);
}
```

Contrast (on `#000`): `--c-ink` ≈ 17:1, `--c-muted` ≈ 8:1 — both pass AA. Never put `--c-muted`
text on `--c-surface-muted` fills lighter than 8% white without re-checking.

### Spacing

The extracted spacing values were micro-offsets from the scaled render, not a real scale. Use the
kit's 8pt scale from `02-DESIGN-TOKENS.md` with one addition for dense UI:

```css
--space-0-5: 2px;   /* hairline gaps, icon nudges */
```

Section padding is tighter than the editorial theme: `--section-y: clamp(80px, 5vw + 48px, 160px)`.

### Radius

```css
--radius-xs: 4px;  --radius-sm: 5px;  --radius-md: 6px;  /* inputs, small buttons, badges */
--radius-lg: 8px;  --radius-xl: 10px; --radius-2xl: 12px; /* cards, panels, code blocks */
--radius-pill: 999px;
```
Smaller and more technical than the editorial theme (cards 10–12px, not 20px).

### Shadows — the signature of this theme

Surfaces are lit from above with a **1px inset top highlight**, and float on **very deep, soft
drop shadows**. (Extraction had 4 empty ring layers per shadow — Tailwind artefacts, removed.)

```css
--shadow-float:   0 40px 100px 0 rgba(0,0,0,0.85), inset 0 1px 1px 0 rgba(255,255,255,0.16); /* hero product shot, modals */
--shadow-deep:    0 40px 100px 0 rgba(0,0,0,0.95);                                           /* large media */
--shadow-card:    0 20px 60px 0 rgba(0,0,0,0.5),  inset 0 1px 1px 0 rgba(255,255,255,0.06);  /* cards */
--shadow-inset:   inset 0 1px 1px 0 rgba(255,255,255,0.07);                                   /* buttons, inputs, chips */
```

### Motion

Crisper than the editorial theme. Same easing tokens (`03-MOTION-SYSTEM.md`), shorter durations:

| Token | ms | Use |
|---|---|---|
| `--dur-instant` | 150 | Hover fills, press, focus |
| `--dur-fast` | 200 | Menus, tooltips, icon swaps |
| `--dur-base` | 300 | Tabs, accordions, card hover lift |
| `--dur-slow` | 350 | Modals, drawers |
| `--dur-slower` | 600 | Section fade-ups, line reveals |
| `--dur-hero` | 650 | Hero intro steps (max) |

Rules: fade-ups travel 12–24px (not 30–60), stagger 0.05–0.08s, no magnetic/elastic effects,
custom cursor off by default. Signature moment options: a live terminal/code block that types
out, a product screenshot that tilts/brightens on scroll, or a glowing grid/beam background.

---

## Theme-specific patterns

- **Hero:** centred or left-aligned headline (`--fs-h1`, white), one muted sub-line, two buttons
  (primary white-on-black inverted, secondary ghost). Below: product screenshot or code panel on
  `--c-surface` with `--shadow-float`, fading into the black at the bottom (mask-image gradient).
- **Install/CLI block:** mono command in a pill (`npm i …`), copy button with a 1.2s "Copied ✓" state.
- **Bento grid of feature cards:** 3–6 cards, `--c-surface`, `--radius-xl`, `--shadow-card`, 1px
  `--c-line` border; each has a mono label, a title, one sentence, and a small live UI snippet —
  not an icon. Hover: border → `--c-line-strong`, highlight follows cursor (radial gradient at 6% white).
- **Code blocks:** `--c-surface`, mono 13–14px, line numbers in `--c-muted`, tabs for languages.
- **Logo wall:** monochrome logos at 50% opacity → 100% on hover.
- **Background texture:** faint dot or line grid (`rgba(255,255,255,0.04)`) with a radial fade;
  optional single soft light beam behind the hero. No colourful gradients.

```css
/* Cursor-following highlight for cards */
.card { position:relative; background:var(--c-surface); border:1px solid var(--c-line);
        border-radius:var(--radius-xl); box-shadow:var(--shadow-card);
        transition:border-color var(--dur-base) var(--ease-out-quart); }
.card::before { content:''; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
  background: radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,.06), transparent 40%);
  opacity:0; transition:opacity var(--dur-base); }
.card:hover { border-color:var(--c-line-strong); }
.card:hover::before { opacity:1; }
```
```js
document.querySelectorAll('.card').forEach(c => c.addEventListener('pointermove', e => {
  const r = c.getBoundingClientRect();
  c.style.setProperty('--mx', `${e.clientX - r.left}px`);
  c.style.setProperty('--my', `${e.clientY - r.top}px`);
}));
```

## Density reference

The reference page is card-heavy: roughly 91 cards, 51 links, 25 buttons and 3 navigation
regions. Expect the card, link and button specs in `09-COMPONENT-SPEC-STANDARD.md` to carry
most of the page, and keep cards consistent rather than inventing variants per section.

## Tone

Concise, confident, implementation-focused. Lead with what it does, then how.
- ✅ "Give your agents memory that persists across runs." / "Install in one command."
- ❌ "Unlock the revolutionary power of next-generation AI memory solutions."

## Switching themes

```html
<html data-theme="devtool">   <!-- or omit for the default Studio Editorial theme -->
```
Keep all component code on semantic tokens (`--c-bg`, `--c-ink`, `--c-surface`…) so the switch is
one attribute.
