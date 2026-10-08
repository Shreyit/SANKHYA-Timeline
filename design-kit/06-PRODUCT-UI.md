# 06 — Applying the System to Product UI

Marketing sites can be expressive; products must be **fast, clear and calm**. Keep the same
taste (type, colour, restraint) but dial motion down to feedback and state changes.

## What changes vs. marketing

| | Marketing site | Product / app |
|---|---|---|
| Type scale | Up to `--fs-display` | Cap at `--fs-h2` for page titles; UI text 13–15px |
| Motion | Scroll reveals, signature moments | State transitions, feedback, no scroll reveals |
| Durations | 400–1200ms | 120–300ms (never block input) |
| Easing | expo out, in-out quart | ease-out-quart or springs |
| Colour | Alternating light/dark sections | One theme; accent for primary actions & focus |
| Density | Airy | Comfortable default, compact option for tables |

## Product tokens (add to 02)

```css
--ui-fs-xs: 12px; --ui-fs-sm: 13px; --ui-fs-base: 14px; --ui-fs-md: 15px;
--ui-fs-lg: 18px; --ui-fs-xl: 24px; --ui-fs-2xl: 32px;
--ui-row-h: 40px;          /* table rows, list items (compact: 32px) */
--ui-control-h: 36px;      /* inputs & buttons (lg: 44px) */
--ui-radius: 10px;
--focus-ring: 0 0 0 2px var(--c-bg), 0 0 0 4px var(--c-accent);
```

## Micro-interactions that make a product feel premium

- **Buttons:** press = `scale(0.97)` 100ms; loading = label fades, spinner fades in, width locked.
- **Hover:** background tint 4–6%, 150ms. No movement on dense UI.
- **Menus/popovers:** `opacity 0→1, scale 0.96→1, y -4→0`, 160ms, `transform-origin` at the trigger.
- **Modals:** backdrop fade 200ms; panel `y 16→0, opacity`, spring (stiffness 400, damping 32).
- **Drawers/sheets:** slide from edge, 280ms ease-out-quart; drag to dismiss on mobile.
- **Tabs:** active indicator slides between tabs (`motion` `layoutId="tab-indicator"`).
- **Lists:** new items animate height + fade (`AnimatePresence` + `layout`); removed items collapse.
- **Toasts:** slide up + fade from bottom-right, auto-dismiss 4s, stack with 8px offset.
- **Skeletons:** subtle shimmer (1.5s linear), matched to real layout; swap with 150ms crossfade.
- **Numbers:** animate value changes (count/roll) on dashboards; tabular nums always.
- **Optimistic UI:** reflect the change instantly, reconcile quietly.
- **Empty states:** one line of confident copy + one action + a small, tasteful illustration or icon.

```tsx
// Shared layout indicator (tabs / segmented control)
{tabs.map(t => (
  <button key={t} onClick={() => set(t)} className="relative px-3 h-9 text-sm">
    {active === t && (
      <motion.span layoutId="pill" className="absolute inset-0 rounded-full bg-ink/5"
        transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
    )}
    <span className="relative">{t}</span>
  </button>
))}
```

## Layout patterns

- **App shell:** 240px sidebar (collapsible to 64px), 56px top bar, content max-width 1200px for forms, full width for tables.
- **Page header:** title + short description left, primary action right, tabs below with hairline.
- **Cards:** border `--c-line`, no shadow, radius `--ui-radius`, padding 20–24px.
- **Tables:** hairline rows, sticky header, right-align numbers, row hover tint, bulk actions bar slides up when rows are selected.
- **Command palette (⌘K):** centered, 640px, instant open (120ms), fuzzy search, keyboard-first.

## Product onboarding & landing moments

This is where expressive motion *is* allowed: first-run screens, empty-state heroes, upgrade
modals, and feature announcements may use mask reveals and staggered fade-ups (≤ 800ms total).

## Accessibility for product

- All interactive elements reachable by keyboard with visible `--focus-ring`.
- Don't convey status by colour alone — pair with icon/text.
- Motion never required to understand state; respect reduced motion.
- Hit targets ≥ 40px (44px on touch).
