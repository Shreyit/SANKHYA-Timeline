# 09 — Component Spec Standard

How to write (and review) the spec for any component in this kit, so every component ships with
complete states, interaction rules and testable accessibility criteria. Applies to both themes.

## Language rules (quality gates)

- Non-negotiable rules **must** use "must". Recommendations **should** use "should".
- Every accessibility rule **must** be testable: it states what to do and how to check it.
- Component guidance **must** reference semantic tokens (`--c-ink`, `--space-4`, `--radius-md`),
  never raw hex or pixel values.
- Teams **should** prefer system consistency over local visual exceptions. A one-off spacing or
  type value **must not** be introduced; add a token or use an existing one.

## Authoring workflow

1. **Intent** — restate the component's purpose in one sentence.
2. **Foundations** — list the tokens it uses (type, colour, space, radius, shadow, motion).
3. **Anatomy & variants** — name every part and every variant.
4. **States** — define all seven required states (below).
5. **Interaction** — keyboard, pointer and touch behaviour.
6. **Responsive & edge cases** — breakpoints, long content, overflow, empty, loading, error.
7. **Accessibility acceptance criteria** — pass/fail checks.
8. **Content** — label rules with good/bad examples.
9. **Anti-patterns & migration notes**.
10. **QA checklist**.

## Required states (every interactive component)

| State | Must define | Typical treatment |
|---|---|---|
| default | Resting appearance | Tokens only |
| hover | Pointer-over change (pointer devices only) | Fill/border shift, `--dur-instant` |
| focus-visible | Keyboard focus | `--focus-ring`, never removed, ≥ 3:1 against adjacent colours |
| active | Pressed | `scale(0.97)` or darker fill, 100–150ms |
| disabled | Non-interactive | 40–50% opacity, `cursor: not-allowed`, `aria-disabled` or `disabled`, no hover |
| loading | Work in progress | Spinner/skeleton, width locked, `aria-busy="true"`, repeat clicks ignored |
| error | Failure | `--c-danger` border/icon **plus** text message; never colour alone |

## Interaction contract

- **Keyboard:** Tab order follows visual order. Enter/Space activate buttons; Enter activates links;
  Esc closes overlays and returns focus to the trigger; arrow keys move within composite widgets
  (tabs, menus, radio groups, carousels). No keyboard traps.
- **Pointer:** hover effects are enhancements only and **must not** hide information or actions.
  Magnetic/cursor effects only on `(pointer: fine)`.
- **Touch:** targets ≥ 44×44px; no hover-dependent content; swipe gestures always have a button
  equivalent; no 300ms-delay tricks (use `touch-action: manipulation`).

## Edge cases every spec must cover

- **Long content:** labels wrap to at most 2 lines, then truncate with ellipsis and expose the full
  text (tooltip or `title`). Headings use `text-wrap: balance`. Long URLs/tokens use `overflow-wrap: anywhere`.
- **Overflow:** tables and code scroll horizontally inside their container, never the page.
- **Empty:** one sentence of explanation plus one action.
- **Loading:** skeleton matching final layout (no layout shift, CLS < 0.1).
- **Error:** what happened, why (if known), and what to do next.
- **Localisation:** allow 30–40% text expansion without breaking layout.

---

## Reference specs

### Button

- **Intent:** trigger an action.
- **Tokens:** `--fs-sm` weight 500, height `--ui-control-h` (36px; lg 44px), padding-x `--space-5`,
  `--radius-pill` (editorial) / `--radius-md` (dev-tool), `--dur-instant`.
- **Anatomy:** container, label, optional leading/trailing icon, optional spinner.
- **Variants:** primary, secondary (ghost/outline), text, icon-only, destructive.
- **States:** all seven. Loading keeps width, swaps label for spinner, sets `aria-busy`.
- **Keyboard:** Enter and Space activate. Icon-only **must** have `aria-label`.
- **A11y acceptance:**
  - [ ] Label contrast ≥ 4.5:1 in every state except disabled.
  - [ ] Focus ring visible when tabbing, absent on mouse click (`:focus-visible`).
  - [ ] Screen reader announces name + role "button"; loading announces busy.
  - [ ] Hit area ≥ 44×44px on touch breakpoints.
- **Content:** verb + object. ✅ "Start free trial", "Copy command" ❌ "Click here", "Submit", "OK".

### Link

- **Intent:** navigate. If it doesn't navigate, it **must** be a button.
- **States:** default, hover (underline grows), focus-visible, active, visited (optional in body copy).
- **Rules:** external links show `↗` and use `rel="noopener"`; new-tab links say so to screen readers.
- **A11y acceptance:**
  - [ ] Link text makes sense out of context (no "read more" without `aria-label`).
  - [ ] Inline links are distinguishable by more than colour (underline or 3:1 contrast + hover underline).

### Card

- **Intent:** group a single piece of content (project, feature, post) with one primary destination.
- **Tokens:** `--c-surface`, `--radius-lg`/`--radius-xl`, `--shadow-card` (dev-tool) or border only (editorial), padding `--space-5`–`--space-6`.
- **Anatomy:** media (optional), label, title, description (≤ 2 lines, clamp), meta/tags, action.
- **Clickable cards:** one real `<a>` on the title with a stretched `::after` covering the card;
  secondary actions sit above it (`position: relative; z-index: 1`). Never nest links.
- **States:** default, hover (image scale / border lift), focus-visible (ring on the whole card via `:focus-within`), active, loading (skeleton), error (fallback image + alt text), empty grid state.
- **Responsive:** grid 3 → 2 → 1 columns; equal heights in a row; media keeps aspect ratio.
- **A11y acceptance:**
  - [ ] Card announces as a single link with the title as its name.
  - [ ] Images have meaningful `alt` or `alt=""` if decorative.

### Navigation

- **Intent:** move between top-level sections.
- **Anatomy:** `<nav aria-label="Primary">`, logo (link to home), links, CTA, mobile menu toggle.
- **States:** link states as above; current page uses `aria-current="page"` plus a visual marker.
- **Mobile:** toggle is a `<button aria-expanded aria-controls>`; opening moves focus into the menu,
  Esc closes it and returns focus to the toggle; body scroll locked while open.
- **A11y acceptance:**
  - [ ] "Skip to content" link is the first focusable element.
  - [ ] Menu is fully operable by keyboard; focus is trapped only while the overlay is open.

### Form field

- **Anatomy:** label (always visible, never placeholder-only), control, hint, error message.
- **States:** all seven plus filled and read-only.
- **Rules:** error text linked via `aria-describedby`, `aria-invalid="true"` on error; validate on
  blur or submit, not on every keystroke.
- **A11y acceptance:**
  - [ ] Clicking the label focuses the control.
  - [ ] Error is announced and describes how to fix it.

---

## Anti-patterns (prohibited)

- Removing outlines (`outline: none`) without a replacement focus style.
- Low-contrast text (e.g. muted grey on a tinted surface below 4.5:1).
- `<div onclick>` instead of `<button>` / `<a>`.
- Ambiguous labels: "Click here", "Learn more" ×10, "Submit".
- Placeholder-as-label inputs.
- Component specs without explicit state rules.
- Local spacing/type overrides (`mt-[13px]`, `text-[15.5px]`).

## Migration notes

When adopting this standard on an existing product: inventory components, map hard-coded values to
the nearest token, add missing focus-visible/disabled/loading/error states first (highest a11y
impact), then consolidate duplicate variants.

## Spec template

```md
### <Component>
- Intent:
- Tokens:
- Anatomy:
- Variants:
- States: default / hover / focus-visible / active / disabled / loading / error
- Keyboard / Pointer / Touch:
- Responsive:
- Edge cases: long content / overflow / empty / loading / error
- A11y acceptance: - [ ] …
- Content: ✅ … ❌ …
- Anti-patterns:
```
