# 02 — Design Tokens

This is the default **Studio Editorial** theme. For developer-tool / AI products, use the
**Dark Dev-Tool** preset in `08-THEME-DARK-DEVTOOL.md`, which overrides these same variable names.

Change the accent and fonts per brand. Keep the scales.

## Typography

**Pairing (pick one):**
| Display | Body | Feel |
|---|---|---|
| Inter Tight / Inter | Inter | Neutral, product-y |
| General Sans / Satoshi | Satoshi | Modern studio (default) |
| PP Neue Montreal | PP Neue Montreal | Swiss, editorial |
| Instrument Serif (accent words) | Inter | Editorial with a serif flourish |

Tip: mix a serif *italic* for 1–2 words inside a sans headline — "Design that *works*."

**Fluid type scale** (clamp: mobile → desktop):

```css
--fs-xs:      clamp(0.75rem, 0.72rem + 0.15vw, 0.8125rem); /* labels */
--fs-sm:      clamp(0.875rem, 0.85rem + 0.1vw, 0.9375rem);
--fs-base:    clamp(1rem, 0.96rem + 0.2vw, 1.125rem);      /* body */
--fs-lg:      clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem);      /* lead */
--fs-h3:      clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem);
--fs-h2:      clamp(2.25rem, 1.6rem + 3vw, 4.5rem);
--fs-h1:      clamp(3rem, 1.8rem + 6vw, 8rem);
--fs-display: clamp(4rem, 2rem + 10vw, 14rem);             /* giant wordmarks, footer */
```

**Rules**
- Headlines: weight 500–600, `line-height: 0.95–1.05`, `letter-spacing: -0.03em to -0.05em`.
- Body: weight 400, `line-height: 1.5–1.6`, `letter-spacing: -0.01em`, max-width `65ch`.
- Labels: uppercase, `--fs-xs`, `letter-spacing: 0.08em`, weight 500, muted colour.
- Numbers in stats/tables: `font-variant-numeric: tabular-nums`.
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.

## Colour

```css
:root {
  /* Neutrals (warm) */
  --c-bg:        #F5F4F0;  /* off-white page */
  --c-surface:   #FFFFFF;
  --c-ink:       #0E0E0E;  /* primary text / dark sections */
  --c-ink-2:     #3A3A38;
  --c-muted:     #8A8984;  /* labels, meta */
  --c-line:      rgba(14,14,14,0.12); /* hairlines */

  /* Accent — ONE colour, use sparingly */
  --c-accent:    #FF5B1F;  /* warm orange; swap per brand */
  --c-accent-ink:#FFFFFF;
}

/* Dark sections / dark mode */
[data-theme="dark"], .section--dark {
  --c-bg:      #0E0E0E;
  --c-surface: #171716;
  --c-ink:     #F5F4F0;
  --c-ink-2:   #C9C8C3;
  --c-muted:   #7A7975;
  --c-line:    rgba(245,244,240,0.14);
}
```

- Alternate light and dark sections to create rhythm (e.g. light hero → dark work → light services).
- Optional subtle film grain overlay (SVG noise, opacity 0.04–0.06) for warmth.
- Never pure `#000` on pure `#FFF` for large surfaces.

## Spacing (8pt base)

```css
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
--space-5: 24px;  --space-6: 32px;  --space-7: 48px;  --space-8: 64px;
--space-9: 96px;  --space-10: 128px; --space-11: 160px; --space-12: 224px;

--section-y: clamp(96px, 6vw + 64px, 200px);  /* vertical section padding */
--gutter:    clamp(16px, 2vw, 32px);          /* page side padding + column gap */
```

## Grid & layout

- 12 columns, gutter `--gutter`, max content width `1440px` (full-bleed allowed for imagery).
- Mobile: 4 columns, 16px side padding.
- Common splits: label in cols 1–3, content in cols 5–12 (editorial offset).
- Breakpoints: `640 / 768 / 1024 / 1280 / 1536`.

## Radius, borders, shadows

```css
--radius-sm: 6px;  --radius-md: 12px;  --radius-lg: 20px;  --radius-xl: 32px;
--radius-pill: 999px;
--border: 1px solid var(--c-line);

/* Shadows: soft & rare. Prefer borders + contrast over shadows. */
--shadow-sm: 0 1px 2px rgba(0,0,0,.04), 0 1px 1px rgba(0,0,0,.03);
--shadow-md: 0 8px 24px -8px rgba(0,0,0,.12);
--shadow-lg: 0 24px 64px -16px rgba(0,0,0,.18);
```

- Buttons: pill. Cards/images: `--radius-lg`. Inputs: `--radius-md`.

## Tailwind mapping (tailwind.config.js excerpt)

```js
theme: {
  extend: {
    colors: {
      bg: 'var(--c-bg)', surface: 'var(--c-surface)', ink: 'var(--c-ink)',
      'ink-2': 'var(--c-ink-2)', muted: 'var(--c-muted)', line: 'var(--c-line)',
      accent: 'var(--c-accent)',
    },
    fontFamily: {
      display: ['var(--font-display)', 'sans-serif'],
      sans: ['var(--font-body)', 'sans-serif'],
      serif: ['var(--font-serif)', 'serif'],
    },
    fontSize: {
      display: 'var(--fs-display)', h1: 'var(--fs-h1)', h2: 'var(--fs-h2)',
      h3: 'var(--fs-h3)', lg: 'var(--fs-lg)', base: 'var(--fs-base)',
    },
    letterSpacing: { tightest: '-0.05em', tighter: '-0.03em', label: '0.08em' },
    borderRadius: { lg: '20px', xl: '32px' },
    transitionTimingFunction: {
      'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      'in-out-quart': 'cubic-bezier(0.76, 0, 0.24, 1)',
    },
  },
}
```
