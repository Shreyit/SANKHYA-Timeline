# Cursor — custom pointer styles

A drop-in, GSAP-driven cursor follower with **two selectable styles**. Both keep
the native OS cursor visible — this is an enhancement layer on top of it, not a
replacement — so people who aren't used to custom cursors never lose track of
where they are.

Use a custom cursor only on **pointer-fine, desktop-first surfaces**: product
consoles, dashboards, portfolio/agency sites with a lot of hover-driven
navigation. Skip it on content-heavy marketing pages where it reads as a
gimmick, and always gate it behind `(pointer: fine)` and
`prefers-reduced-motion` — both styles below do this for you already.

## Choosing a style

| | **Dot + Label** | **Target Lock** (this file) |
|---|---|---|
| Feel | Minimal, editorial | Technical, "dev-tool" |
| What it does | A small dot that grows into a pill with a text label over `data-cursor` elements | Four corner brackets that snap out to frame whatever's under the pointer |
| Best for | Studio/agency sites, case-study cards ("View" on hover) | Product UI, consoles, anything with buttons/links to "lock onto" |
| Full recipe | `04-ANIMATION-RECIPES.md` §8 | Below |
| Pairs with theme | `02-DESIGN-TOKENS.md` (Studio Editorial) | `08-THEME-DARK-DEVTOOL.md` (Dark Dev-Tool) |

They share the same mounting pattern (one component near the root, GSAP
`quickTo` for the follow, a pointer-fine + reduced-motion guard) — swapping
one for the other later is a small change, not a rewrite.

---

## Target Lock — how it behaves

- **Free-floating:** off any interactive element, a small square reticle
  (default 28×28) trails the pointer with a soft, slightly-lagged ease.
- **Lock:** hovering a link, button, `<summary>`, radio or anything tagged
  `data-cursor` snaps the brackets to frame that element's actual box —
  matching its border-radius — and leans a few px toward the pointer inside
  it, so the lock still feels alive rather than static.
- **Label:** an element with `data-cursor="View project"` shows that text as
  a small tag near the pointer while locked.
- **Text fields:** hovering a `<textarea>`/`<input>`/`contenteditable` hides
  the reticle entirely so the native text-caret isn't fought over.
- **Press:** the lock box scales down slightly on `pointerdown`, back up on
  `pointerup` — a tiny bit of tactile feedback.
- **Disabled elements:** the lock still shows, dimmed to 35% opacity, so a
  disabled button still reads as "not clickable" rather than invisible.
- **Scroll-safe:** a `gsap.ticker` tick (not just `pointermove`) keeps the
  lock glued to its element if the page scrolls, or the element moves,
  without the pointer itself moving.

## Full code

```bash
npm i gsap
```

`TargetCursor.jsx` — mount **once**, near the root of the page or app shell
(not per-element):

```jsx
'use client'; // Next.js App Router only — drop this line in a plain React/Vite app

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './TargetCursor.module.css';

// ── Configure for your project ──────────────────────────────────────
// What counts as "lockable" — widen or narrow this selector freely.
const LOCK_SELECTOR = 'a[href], button, summary, [role="radio"], [data-cursor]';
// Elements the reticle should step aside for entirely.
const TEXT_SELECTOR = 'textarea, input, [contenteditable="true"]';
const FREE_SIZE = 28;      // px, the free-floating reticle's side length
const PAD = 6;              // px, gap between the lock brackets and the element
const EASE_OUT_QUART = 'power3.out';

function hasFinePointer() {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
}
function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function TargetCursor() {
  const boxRef = useRef(null);
  const dotRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return undefined;
    const box = boxRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;

    const move = { duration: 0.35, ease: EASE_OUT_QUART };
    const boxX = gsap.quickTo(box, 'x', move);
    const boxY = gsap.quickTo(box, 'y', move);
    const boxW = gsap.quickTo(box, 'width', move);
    const boxH = gsap.quickTo(box, 'height', move);
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'none' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'none' });
    const labX = gsap.quickTo(label, 'x', { duration: 0.25, ease: EASE_OUT_QUART });
    const labY = gsap.quickTo(label, 'y', { duration: 0.25, ease: EASE_OUT_QUART });

    let target = null;
    let labelText = '';
    let visible = false;
    let last = { x: -100, y: -100 };

    const show = () => {
      if (visible) return;
      visible = true;
      gsap.to([box, dot], { opacity: 1, duration: 0.2 });
    };
    const hide = () => {
      visible = false;
      gsap.to([box, dot, label], { opacity: 0, duration: 0.2 });
    };

    const radiusOf = (el, h) => {
      const r = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
      return Math.max(3, Math.min(r + PAD / 2, h / 2));
    };

    const setLabel = (text) => {
      if (text === labelText) return;
      labelText = text;
      if (text) {
        label.textContent = text;
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.2, ease: EASE_OUT_QUART });
      } else {
        gsap.to(label, { opacity: 0, scale: 0.9, duration: 0.15, ease: EASE_OUT_QUART });
      }
    };

    const update = (x, y) => {
      dotX(x);
      dotY(y);
      labX(x + 16);
      labY(y + 18);

      if (target) {
        const r = target.getBoundingClientRect();
        // Lean toward the pointer a little, so the lock feels magnetic
        // rather than a rigid static frame. Set both to 0 to disable.
        const lx = (x - (r.left + r.width / 2)) * 0.08;
        const ly = (y - (r.top + r.height / 2)) * 0.08;
        boxX(r.left - PAD + lx);
        boxY(r.top - PAD + ly);
        boxW(r.width + PAD * 2);
        boxH(r.height + PAD * 2);
      } else {
        boxX(x - FREE_SIZE / 2);
        boxY(y - FREE_SIZE / 2);
        boxW(FREE_SIZE);
        boxH(FREE_SIZE);
      }
    };

    const onMove = (e) => {
      last = { x: e.clientX, y: e.clientY };
      show();
      const el = e.target instanceof Element ? e.target : null;
      const overText = el?.closest(TEXT_SELECTOR);
      const next = overText ? null : el?.closest(LOCK_SELECTOR) || null;

      if (next !== target) {
        target = next;
        if (target) {
          const r = target.getBoundingClientRect();
          const disabled = target.matches(':disabled, [aria-disabled="true"]');
          gsap.to(box, { '--r': `${radiusOf(target, r.height + PAD * 2)}px`, opacity: disabled ? 0.35 : 1, duration: 0.3, ease: EASE_OUT_QUART });
          gsap.to(dot, { scale: 0, duration: 0.2 });
        } else {
          gsap.to(box, { '--r': '3px', opacity: overText ? 0 : 1, duration: 0.3, ease: EASE_OUT_QUART });
          gsap.to(dot, { scale: overText ? 0 : 1, duration: 0.2 });
        }
      }
      setLabel(target?.closest('[data-cursor]')?.getAttribute('data-cursor') || '');
      update(last.x, last.y);
    };

    // Keep the lock on its element when it moves without the pointer moving
    // (page scroll, or content above it opening/closing).
    const onTick = () => {
      if (visible && target) update(last.x, last.y);
    };
    const onDown = () => {
      setLabel('');
      gsap.to(box, { scale: 0.94, duration: 0.1, ease: EASE_OUT_QUART });
    };
    const onUp = () => gsap.to(box, { scale: 1, duration: 0.3, ease: EASE_OUT_QUART });
    const onLeave = (e) => {
      if (!e.relatedTarget) hide(); // pointer left the window
    };

    gsap.set([box, dot], { x: -100, y: -100 });
    gsap.set(label, { scale: 0.9 });
    window.addEventListener('pointermove', onMove, { passive: true });
    gsap.ticker.add(onTick);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('pointerout', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      gsap.ticker.remove(onTick);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerout', onLeave);
      gsap.killTweensOf([box, dot, label]);
    };
  }, []);

  return (
    <>
      <div ref={boxRef} className={styles.cursorBox} aria-hidden="true">
        <span className={`${styles.corner} ${styles.cTL}`} />
        <span className={`${styles.corner} ${styles.cTR}`} />
        <span className={`${styles.corner} ${styles.cBL}`} />
        <span className={`${styles.corner} ${styles.cBR}`} />
      </div>
      <div ref={dotRef} className={styles.cursorDot} aria-hidden="true" />
      <div ref={labelRef} className={styles.cursorLabel} aria-hidden="true" />
    </>
  );
}
```

`TargetCursor.module.css` — every colour reads one variable
(`--cursor-accent`), so retheming is a one-line change per project:

```css
/* Point this at your own accent token — e.g. var(--c-main) if you're
   using 02-DESIGN-TOKENS.md, or hardcode a hex. Everything else here
   is layout/behaviour, not brand, and shouldn't need to change. */
:root {
  --cursor-accent: #FF6B00;
  --cursor-ink: #000000;      /* text colour on top of --cursor-accent */
  --cursor-z: 9999;
}

.cursorBox {
  position: fixed;
  left: 0;
  top: 0;
  z-index: var(--cursor-z);
  width: 28px;   /* keep in sync with FREE_SIZE in the JS */
  height: 28px;
  --r: 3px;      /* driven by the JS per-target; this is just the initial value */
  pointer-events: none;
  opacity: 0;
  will-change: transform;
}
.corner {
  position: absolute;
  width: max(8px, calc(var(--r) + 4px));
  height: max(8px, calc(var(--r) + 4px));
  border-color: var(--cursor-accent);
  border-style: solid;
  border-width: 0;
}
.cTL { left: 0; top: 0; border-left-width: 1.5px; border-top-width: 1.5px; border-top-left-radius: var(--r); }
.cTR { right: 0; top: 0; border-right-width: 1.5px; border-top-width: 1.5px; border-top-right-radius: var(--r); }
.cBL { left: 0; bottom: 0; border-left-width: 1.5px; border-bottom-width: 1.5px; border-bottom-left-radius: var(--r); }
.cBR { right: 0; bottom: 0; border-right-width: 1.5px; border-bottom-width: 1.5px; border-bottom-right-radius: var(--r); }

.cursorDot {
  position: fixed;
  left: 0;
  top: 0;
  z-index: var(--cursor-z);
  width: 4px;
  height: 4px;
  margin: -2px 0 0 -2px;
  border-radius: 999px;
  background: var(--cursor-accent);
  pointer-events: none;
  opacity: 0;
}
.cursorLabel {
  position: fixed;
  left: 0;
  top: 0;
  z-index: var(--cursor-z);
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--cursor-accent);
  color: var(--cursor-ink);
  font-family: ui-monospace, SFMono-Regular, 'Geist Mono', Menlo, monospace;
  font-size: 11px;
  line-height: 16px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
}
```

Mount it once, at the top of the page (or the app shell, if you want it on
every route):

```jsx
export default function Page() {
  return (
    <>
      <TargetCursor />
      {/* rest of the page */}
    </>
  );
}
```

Tag anything that should show a label while locked:

```html
<button data-cursor="Use template">SaaS Landing</button>
<a href="/projects/1" data-cursor="View project">…</a>
```

## Style-select: picking or extending the target style

The "style" is entirely the two files above — there's no runtime prop for
switching styles, because a cursor style is a per-project design decision,
not a per-view one. To offer a genuine second style in the same project
(e.g. a lighter free-roam dot on marketing pages, Target Lock in the
product), build both as separate components sharing the same
mount/guard/`quickTo` skeleton and mount whichever one that layout needs —
see `09-COMPONENT-SPEC-STANDARD.md`'s own rule: *"a one-off spacing or type
value must not be introduced; add a token or use an existing one"* — the same
applies here: extend the shared skeleton, don't fork a whole new cursor
system per page.

### Configuration reference

| Change | Where | Effect |
|---|---|---|
| Accent colour | `--cursor-accent` (CSS) | Bracket/dot/label colour — the only thing you *must* set per project |
| Reticle size | `FREE_SIZE` (JS) + `.cursorBox` width/height (CSS, keep in sync) | Size of the free-floating square |
| Lock padding | `PAD` (JS) | Gap between the brackets and the locked element's edge |
| What locks | `LOCK_SELECTOR` (JS) | Add/remove selectors — e.g. add `'[data-lockable]'` for custom elements |
| What's excluded | `TEXT_SELECTOR` (JS) | Elements the reticle disappears over entirely |
| Magnetic lean | the `* 0.08` factors in `update()` (JS) | Set to `0` for a perfectly static lock frame |
| Follow smoothness | the `duration`/`ease` in each `gsap.quickTo` call (JS) | Lower duration = snappier, higher = floatier |
| Label font | `.cursorLabel` `font-family` (CSS) | Match your own mono/UI token |
| Stacking | `--cursor-z` (CSS) | Raise above modals if you have higher z-index layers |

### Accessibility & performance

- **Never the only affordance.** Everything the cursor locks onto must
  already have its own visible hover/focus state (see
  `09-COMPONENT-SPEC-STANDARD.md`) — the cursor is a bonus layer, not how
  people find out something's clickable.
- **Keyboard parity isn't needed here** — the cursor only ever responds to
  a real pointer (`pointer: fine` gate), so keyboard users are unaffected
  by design, not by omission.
- **Touch is excluded** by the same gate — never show this on
  `(pointer: coarse)`.
- **`prefers-reduced-motion`** skips mounting the effect entirely (the
  `useEffect` returns early) rather than just disabling the animation, so
  there's zero added listener/ticker overhead for those users.
- **Clean up.** The effect's return function removes every listener and
  kills the tweens — required if this ever mounts/unmounts across route
  changes (e.g. only shown on some pages in a shared app shell).
