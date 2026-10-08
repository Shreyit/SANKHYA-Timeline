# 03 — Motion System

Motion should feel **smooth, weighted and inevitable** — things arrive fast and settle slowly.

## Easing tokens

```css
--ease-out-expo:   cubic-bezier(0.16, 1, 0.3, 1);    /* DEFAULT for entrances & reveals */
--ease-out-quart:  cubic-bezier(0.25, 1, 0.5, 1);    /* hovers, small UI */
--ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1); /* page transitions, curtains, masks */
--ease-in-quart:   cubic-bezier(0.5, 0, 0.75, 0);    /* exits only */
```

GSAP equivalents: `expo.out`, `power3.out`, `power4.inOut`, `power3.in`.
Framer Motion: `[0.16, 1, 0.3, 1]`, springs `{ type: "spring", stiffness: 300, damping: 30 }`.

## Duration tokens

| Token | ms | Use |
|---|---|---|
| `--dur-instant` | 100 | Press states, toggles |
| `--dur-fast` | 200 | Hover colour, icon nudges |
| `--dur-base` | 400 | Buttons, menus, small reveals |
| `--dur-slow` | 800 | Section reveals, image reveals, headline lines |
| `--dur-slower` | 1200 | Page transitions, hero intro (max) |

Rule: bigger distance/area → longer duration. Exits ~30% faster than entrances.

## Choreography

- **Stagger** related items: 0.04–0.08s for letters/words, 0.08–0.12s for lines/cards.
- **Order** follows reading order: label → headline → body → CTA → media.
- **Overlap** steps (start the next at ~60% of the previous) — never wait for each to finish.
- **Distance** small: reveals move 20–60px or come from a mask (`yPercent: 100`), not 300px.
- **Once**: scroll reveals play once; don't re-animate on scroll back up (except scrubbed effects).
- **Scrub** (tied to scroll position) for parallax, progress, pinned stories. Use `scrub: 0.8–1.2` for smoothing.

## The motion vocabulary (use these, avoid inventing new ones per page)

1. **Mask line reveal** — headline lines slide up from behind an overflow-hidden wrapper.
2. **Fade-up** — body, cards: `opacity 0→1, y 30→0`.
3. **Clip image reveal** — `clip-path: inset(100% 0 0 0)` → `inset(0)` with slight scale 1.15→1.
4. **Parallax** — images drift −10% to +10% within a clipped frame.
5. **Marquee** — infinite horizontal logos/words; speed reacts to scroll velocity.
6. **Magnetic hover** — buttons/icons pull toward cursor (strength 0.2–0.4).
7. **Text roll hover** — label duplicates and rolls vertically on hover.
8. **Cursor follower** — small dot that grows with a label ("View") over work cards.
9. **Pinned horizontal scroll** — for process steps or a work gallery (max one per page).
10. **Curtain page transition** — full-screen panel wipes in/out with `ease-in-out-quart`.
11. **Counter** — stats count up once when in view.
12. **Smooth scroll** — Lenis, `lerp: 0.1`, applied site-wide.

## Load sequence (hero)

```
0.0s  preloader (optional, < 1.5s, only if assets are heavy) → curtain up
0.1s  nav fades in (y -10 → 0)
0.2s  hero label fades in
0.3s  headline lines mask-reveal, stagger 0.1
0.8s  sub-copy + CTA fade-up
0.9s  hero media clip-reveal / scale 1.1 → 1
```

## Reduced motion (mandatory)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
```js
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// if reduce: skip Lenis, skip parallax/scrub/marquee speed changes, show content immediately
```

## Performance rules

- Animate only `transform`, `opacity`, `clip-path`, `filter` (sparingly).
- `will-change: transform` only during the animation, not permanently everywhere.
- Kill ScrollTriggers / Lenis on route change (`ctx.revert()`, `lenis.destroy()`).
- Lazy-load WebGL; pause render loops when off-screen or tab hidden.
- Test on a mid-range Android phone, not just a MacBook.
