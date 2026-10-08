# Hover Animations — the recipes actually in use

A focused catalog of the hover interactions built for this project, written
so each one can be lifted into a different project on its own. Where
`04-ANIMATION-RECIPES.md` covers the kit's general-purpose motion recipes
(reveals, marquees, page transitions…), this file is specifically about
**hover** — the small, constant feedback that makes chrome feel alive.

Pair with `cursor.md` for the pointer itself; these recipes are for the
*elements* the pointer moves over.

## Which recipe for which element

| Recipe | Use it for | Cost |
|---|---|---|
| [Pointer-tracked glass](#1-pointer-tracked-glass-highlight) | Frosted-glass chrome: nav bars, floating panels, modal headers | 1 JS listener + CSS |
| [Spotlight card](#2-spotlight-card) | Rows/cards in a list: template pickers, settings rows, menu items | 1 JS listener + CSS |
| [Mark tilt + dot bounce](#3-logo-mark-tilt--dot-bounce) | A logo/wordmark, once per page | CSS only |
| [Sliding pill indicator](#4-sliding-pill-indicator) | Tabs, segmented controls, a pill nav | GSAP `quickTo` |
| [Lift + spring button](#5-lift--spring-cta-button) | The one primary action on a view | Framer Motion |
| [Flat chip/tile](#6-flat-chiptile-hover-the-baseline) | Many small repeated items (chips, list rows) | CSS only |
| [Icon slide](#7-icon-slide-on-hover) | An arrow/chevron inside a button or link | CSS only |

Rules that apply to all of them, from `03-MOTION-SYSTEM.md` /
`06-PRODUCT-UI.md`: product-UI hovers use `--dur-instant` (150ms) to
`--dur-base` (300ms) and `ease-out-quart` — never the slower 800ms+
easing reserved for marketing-page scroll reveals. Hover feedback must
never block input.

---

## 1. Pointer-tracked glass highlight

A soft light that follows the cursor across a frosted-glass surface — the
detail that sells "glass" as a real material rather than a blurred
rectangle. Used on floating nav/header capsules and panel chrome.

```css
/* Base glass surface (trim to taste — this is the recipe's shell) */
.glass {
  position: relative;
  isolation: isolate;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%),
    rgba(18, 20, 26, 0.46);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid transparent;
}

/* The pointer-tracked light — the part this recipe is actually about */
.glass::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: radial-gradient(320px circle at var(--gx, 30%) var(--gy, -40px),
              rgba(255,255,255,0.09), transparent 60%);
  opacity: 0.6;
  transition: opacity 300ms cubic-bezier(0.25,1,0.5,1);
  pointer-events: none;
}
.glass:hover::after { opacity: 1; }
```

```js
// Attach to onPointerMove on the .glass element.
export function trackGlass(e) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--gx', `${e.clientX - r.left}px`);
  el.style.setProperty('--gy', `${e.clientY - r.top}px`);
}
```

```jsx
<nav className="glass" onPointerMove={trackGlass}>…</nav>
```

**Tune:** `320px` is the light's radius, `0.09` its brightness, `0.6`/`1` its
resting/hover opacity. On a large or crowded surface, drop brightness
toward `0.05–0.06` so it doesn't compete with content.

## 2. Spotlight card

The same idea as #1, sized for opaque (non-glass) cards and rows — a
directional highlight instead of a full re-lit background, so it reads as
"this row is reactive" without needing blur.

```css
.spot {
  position: relative;
  isolation: isolate;
}
.spot::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  pointer-events: none;
  background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%),
              rgba(255,255,255,0.07), transparent 45%);
  opacity: 0;
  transition: opacity 300ms cubic-bezier(0.25,1,0.5,1);
}
.spot:hover::before { opacity: 1; }
```

```js
export function trackSpotlight(e) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}
```

```jsx
<button className="spot" onPointerMove={trackSpotlight}>…</button>
```

**Note:** `trackGlass`/`trackSpotlight` are the same function with different
variable names — merge them into one utility if a project uses both, just
keep the CSS variable names (`--gx/--gy` vs `--mx/--my`) distinct per
surface so nested glass-inside-a-spotlight-card elements don't collide.

## 3. Logo/mark tilt + dot bounce

For a wordmark or icon-based logo: the mark tilts with a colour glow, and
if it has a separable "dot" (the `i` in a wordmark, say), the dot bounces
independently — a tiny, specific delight that reads as "handmade," not a
generic `scale(1.05)`.

```css
.mark {
  display: inline-block;
  transition: transform 500ms cubic-bezier(0.22,1,0.36,1), filter 500ms ease;
}
.markWrap:hover .mark {
  transform: translateY(-3%) rotate(-8deg);
  filter: drop-shadow(0 0 10px rgba(var(--accent-rgb), 0.7));
}

.dot { transform-origin: center; }
.markWrap:hover .dot {
  animation: dotBounce 0.9s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes dotBounce {
  0%   { transform: translateY(0); }
  35%  { transform: translateY(-38%) scale(1.08); }
  65%  { transform: translateY(6%) scale(0.96, 1.04); }
  100% { transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .mark { transition: none; }
  .markWrap:hover .dot { animation: none; }
}
```

```jsx
<a className="markWrap" href="/">
  <span className="mark"><LogoIcon /></span>
  Brand
</a>
```

**Requires** `--accent-rgb` as an `R, G, B` triplet (not a hex) so it can
sit inside `rgba(var(--accent-rgb), 0.7)` — see `02-DESIGN-TOKENS.md`'s
Tailwind mapping for the pattern, or just compute it once in JS
(`hexToRgb`) and set it as a CSS custom property at the root.

**Once per page.** This is a signature moment for the one logo instance —
don't apply it to every small icon on the page (see `01-DESIGN-
PRINCIPLES.md` rule 6, "one signature moment per page").

## 4. Sliding pill indicator

A highlight that glides between tabs/segments to whichever one is active
or hovered, instead of snapping — the detail every polished segmented
control has. CSS `transition` on `left` fights layout thrashing at scale;
GSAP `quickTo` is the right tool once you're animating on every
`pointermove`/`mouseenter`.

```jsx
'use client';
import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';

export function usePillIndicator(activeIndex) {
  const navRef = useRef(null);
  const indRef = useRef(null);
  const itemRefs = useRef([]);
  const placed = useRef(false);

  const moveTo = useCallback((i, animate = true) => {
    const el = itemRefs.current[i];
    const ind = indRef.current;
    if (!el || !ind) return;
    const vars = { x: el.offsetLeft, width: el.offsetWidth, opacity: 1 };
    if (animate && placed.current) {
      gsap.to(ind, { ...vars, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
    } else {
      gsap.set(ind, vars);
    }
    placed.current = true;
  }, []);

  const rest = useCallback(() => {
    if (activeIndex >= 0) moveTo(activeIndex);
  }, [activeIndex, moveTo]);

  // Sit on the active tab whenever it changes (route change, state change…).
  useEffect(() => { if (activeIndex >= 0) moveTo(activeIndex, false); }, [activeIndex, moveTo]);

  // Re-measure on resize/font-load so the pill doesn't drift out of place.
  useEffect(() => {
    if (!navRef.current || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => activeIndex >= 0 && moveTo(activeIndex, false));
    ro.observe(navRef.current);
    return () => ro.disconnect();
  }, [activeIndex, moveTo]);

  return { navRef, indRef, itemRefs, moveTo, rest };
}
```

```jsx
function PillNav({ items, activeIndex }) {
  const { navRef, indRef, itemRefs, moveTo, rest } = usePillIndicator(activeIndex);
  return (
    <nav ref={navRef} onMouseLeave={rest} style={{ position: 'relative', display: 'flex' }}>
      <span ref={indRef} className="pillInd" aria-hidden="true" style={{ position: 'absolute' }} />
      {items.map((item, i) => (
        <button
          key={item.id}
          ref={(el) => (itemRefs.current[i] = el)}
          onMouseEnter={() => moveTo(i)}
          aria-current={i === activeIndex ? 'true' : undefined}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
```

`.pillInd` needs `top`/`bottom` (or `height`) set in CSS to fill the tab
row, plus your surface styling (fill colour, radius) — only `x`/`width` are
animated here.

## 5. Lift + spring CTA button

The one primary action on a screen gets a small physical lift on hover,
via Framer Motion's spring — cheap, and reads as "premium" far more than a
CSS `transition` on `transform` because springs overshoot and settle
naturally instead of easing to a stop.

```jsx
import { motion } from 'framer-motion';

<motion.button
  whileHover={{ scale: 1.015, y: -2 }}
  whileTap={{ scale: 0.98, y: 0 }}
  transition={{ type: 'spring', stiffness: 420, damping: 28 }}
  className="cta"
>
  Sign In
</motion.button>
```

**Tune:** higher `stiffness` = snappier/less travel, lower `damping` = more
bounce/overshoot. `420/28` reads as firm and controlled; `300/15` would
feel bouncier and more playful — pick per brand voice
(`01-DESIGN-PRINCIPLES.md`: "Bouncy/elastic easing on UI chrome... feels
toy-like" — keep damping high enough that it doesn't overshoot visibly).

**One per view.** Reserve the lift for the single primary CTA; secondary
buttons use recipe #6 instead, or the lift reads as noise.

## 6. Flat chip/tile hover (the baseline)

For anything repeated many times (a grid of chips, a long settings list) —
skip transforms and GSAP entirely. A pure background/border colour
transition is the cheapest possible hover feedback and is what most
elements on a dense screen should use.

```css
.chip {
  border: 1px solid var(--c-line);
  background: rgba(255, 255, 255, 0.03);
  transition: background-color 150ms cubic-bezier(0.25,1,0.5,1),
              border-color 150ms cubic-bezier(0.25,1,0.5,1);
}
.chip:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--c-line-strong);
}
```

This is intentionally the least interesting recipe in this file — that's
the point. A screen where every element does #1–#5 is noisy; most of a UI
should be this quiet, so the one or two elements using the louder recipes
actually stand out.

## 7. Icon slide-on-hover

A small forward nudge on an arrow/chevron inside a button — cheap, but it
reinforces the action's direction ("this goes forward").

```css
.btn svg { transition: transform 300ms; }
.btn:hover svg { transform: translateX(4px); }
```

Or with Tailwind, no custom CSS needed:

```html
<button class="group flex items-center gap-2">
  Continue
  <svg class="transition-transform duration-300 group-hover:translate-x-1">…</svg>
</button>
```

---

## Checklist before shipping a hover recipe

Mirrors `07-QUALITY-CHECKLIST.md`'s Motion section, hover-specific:

- [ ] Every hovered element has a **focus-visible** equivalent — a
      keyboard user must get the same information the hover gives a mouse
      user (see `09-COMPONENT-SPEC-STANDARD.md`'s interaction contract).
      Pointer-tracked recipes (#1, #2) are decorative extras layered on
      top of a real `:hover`/`:focus-visible` state, never the only
      feedback.
- [ ] `pointermove`-driven recipes (#1, #2) are attached with
      `onPointerMove`, not `onMouseMove` — pointer events unify mouse/pen
      and won't misfire on touch the way naive mouse-event polyfills can.
- [ ] Nothing here runs on `(pointer: coarse)` (touch) — hover has no
      meaning there; make sure the tap state (`:active`) carries the
      equivalent feedback instead.
- [ ] `prefers-reduced-motion` is respected per-recipe: #3's animation is
      turned off outright; #4/#5's GSAP/spring calls are fine to leave
      running since they're short and triggered by direct interaction
      (not autoplaying), but confirm project policy either way.
- [ ] Only one "loud" recipe (#3, #4, #5) is layered per screen at a time
      per element — a button doesn't need both a spring lift *and* a
      spotlight *and* an icon slide simultaneously.
- [ ] Colours reference a token (`--accent-rgb`, `--c-line`, etc.), never
      a hardcoded hex — see `02-DESIGN-TOKENS.md`.
