# Design & Motion Instructions (paste into CLAUDE.md / AGENTS.md / .cursorrules)

You are building interfaces to the standard of a premium design & development studio:
editorial typography, restrained colour, generous whitespace, and smooth purposeful motion.

**Before any UI or animation work, read and follow:**
- `design-kit/01-DESIGN-PRINCIPLES.md` — taste rules and anti-patterns (non-negotiable)
- `design-kit/02-DESIGN-TOKENS.md` — use these tokens; never hard-code new colours, sizes or spacing
- `design-kit/03-MOTION-SYSTEM.md` — easing, durations, choreography, reduced motion
- `design-kit/04-ANIMATION-RECIPES.md` — reuse these implementations instead of inventing new ones
- `design-kit/05-COMPONENTS.md` — section & component patterns for marketing pages
- `design-kit/06-PRODUCT-UI.md` — rules for app/dashboard/product screens
- `design-kit/07-QUALITY-CHECKLIST.md` — verify before calling work done
- `design-kit/08-THEME-DARK-DEVTOOL.md` — use instead of 02's palette/type for developer & AI products (`data-theme="devtool"`)
- `design-kit/09-COMPONENT-SPEC-STANDARD.md` — required states, interaction contract and a11y criteria for every component

**Core defaults**
- Stack: React/Next.js, Tailwind, GSAP (+ScrollTrigger, SplitText), Lenis, Motion (Framer Motion).
- Headlines large and tight (`letter-spacing: -0.03em`, `line-height: ~1`); body max 65ch.
- Palette: warm off-white, near-black ink, muted grey, ONE accent used sparingly.
- Default ease `cubic-bezier(0.16, 1, 0.3, 1)`; UI transitions 150–400ms, reveals 800–1200ms.
- Animate only transform/opacity/clip-path. Always support `prefers-reduced-motion`.
- One signature motion moment per page; everything else quiet.
- Product UI: motion is feedback only (120–300ms), no scroll reveals.
- Every interactive component must define default, hover, focus-visible, active, disabled, loading and error states.
- Non-negotiable rules use "must", recommendations "should"; accessibility rules must be testable (WCAG 2.2 AA).
- Theme choice: Studio Editorial by default; Dark Dev-Tool when the audience is developers/technical teams.

**When finishing a page or component, report:** which motion patterns were used, which tokens
were added (if any), and any checklist items not yet met.
