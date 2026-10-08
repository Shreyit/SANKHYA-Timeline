# Studio Design Kit — Premium Web & Product Design System

A drop-in set of guideline files for building interfaces and motion in the style of modern
premium design studios (e.g. the Lumina-style aesthetic): editorial typography, restrained
colour, generous whitespace, and smooth, purposeful motion that makes a brand feel crafted.

Load these files into any project (Claude Project knowledge, `CLAUDE.md`, `AGENTS.md`,
Cursor rules, `/docs` folder) so every design and animation decision follows one system.

## Files

| File | Use it for |
|---|---|
| `01-DESIGN-PRINCIPLES.md` | The taste rules. Read first. What "premium" means and what to avoid. |
| `02-DESIGN-TOKENS.md` | Type scale, colour, spacing, grid, radius, shadows — as CSS variables + Tailwind config. |
| `03-MOTION-SYSTEM.md` | Easing curves, durations, choreography rules, reduced motion. |
| `04-ANIMATION-RECIPES.md` | Copy-paste code: text reveals, scroll reveals, marquees, magnetic buttons, cursor, parallax, page transitions. GSAP + Framer Motion. |
| `05-COMPONENTS.md` | Section and component patterns: nav, hero, work grid, services, testimonials, CTA, footer. |
| `06-PRODUCT-UI.md` | Applying the system to apps, dashboards and SaaS products (not just marketing sites). |
| `07-QUALITY-CHECKLIST.md` | Pre-ship review: craft, performance, accessibility, responsiveness. |
| `08-THEME-DARK-DEVTOOL.md` | Alternate theme: black, monochrome, Geist, deep shadows with inset highlights — for developer tools and AI products. |
| `09-COMPONENT-SPEC-STANDARD.md` | How every component is specified: 7 required states, keyboard/pointer/touch, edge cases, testable a11y criteria, reference specs. |
| `AGENT-INSTRUCTIONS.md` | A short, paste-ready instruction block for AI coding tools that points to all of the above. |

## How to use

1. Copy the `design-kit/` folder into your repo root (or `/docs/design-kit`).
2. Paste the contents of `AGENT-INSTRUCTIONS.md` into your `CLAUDE.md`, `AGENTS.md`,
   `.cursorrules`, or project instructions.
3. Pick a theme: **Studio Editorial** (`02`, default) or **Dark Dev-Tool** (`08`, set `data-theme="devtool"`).
   Adjust accent and fonts per brand. Everything else stays.
4. Spec new components with the template in `09-COMPONENT-SPEC-STANDARD.md`.
5. Before shipping any page, run through `07-QUALITY-CHECKLIST.md`.

## Default stack assumed

- Next.js / React + Tailwind CSS (plain HTML/CSS works too — tokens are CSS variables)
- GSAP + ScrollTrigger + SplitText for scroll-driven and text animation
- Lenis for smooth scrolling
- Framer Motion (`motion`) for component-level/state animation in React
- Optional: Three.js / React Three Fiber for a single hero 3D moment

> Note: this kit captures a *style* — editorial, minimal, motion-rich. Always use your own
> brand name, copy, imagery and logo. Don't copy another studio's assets or content.
