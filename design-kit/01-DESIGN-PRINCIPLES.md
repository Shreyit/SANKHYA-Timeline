# 01 — Design Principles

The goal: interfaces that feel *designed by a studio*, not assembled from a template.
Calm, confident, editorial, with motion that rewards attention.

## The 10 rules

1. **Typography is the hero.** Big, tight, confident headlines do most of the visual work.
   A page with one great headline and whitespace beats a page with ten illustrations.
2. **Restraint in colour.** Near-black, near-white, one or two neutrals, and ONE accent used
   sparingly (≤5% of the screen). Accent marks what matters: a CTA, an active state, a dot.
3. **Whitespace is a feature.** Sections breathe. Minimum 120px vertical padding on desktop
   sections (see tokens). Crowding reads as cheap.
4. **Grid discipline, then one deliberate break.** Align everything to a 12-column grid. Then
   break it once per section on purpose (an offset image, an oversized word bleeding off-edge).
5. **Motion has a job.** Every animation either (a) guides attention, (b) explains a change of
   state, or (c) adds tactile feedback. If it does none, remove it.
6. **One signature moment per page.** A single memorable interaction (a WebGL hero, a pinned
   horizontal scroll, a big text-mask reveal). Everything else stays quiet so it lands.
7. **Real content, real imagery.** Large, high-quality project imagery and specific copy.
   No stock-photo handshakes, no lorem ipsum in reviews.
8. **Details signal craft.** Custom cursor states, hover micro-interactions, tabular numbers,
   optical kerning, consistent 1px hairlines, balanced line breaks (`text-wrap: balance`).
9. **Fast is premium.** A beautiful site that janks is not premium. 60fps, animate only
   `transform` and `opacity`, LCP < 2.5s.
10. **Accessible by default.** Respect `prefers-reduced-motion`, keep contrast AA, keyboard
    reachable, semantic HTML. Craft includes everyone.

## Tone of the visual language

- **Editorial** — magazine-like hierarchy, large numerals, small uppercase labels
  ("(01) Services", "Selected Work — 2026").
- **Warm minimalism** — not cold/corporate; soft off-whites, subtle grain, rounded-but-not-bubbly.
- **Confident copy** — short, declarative lines. "We don't do generic." beats
  "We are a full-service agency offering a wide range of solutions."

## Anti-patterns (never do)

- Default Tailwind blue / Bootstrap look; gradient-purple "AI startup" hero by reflex.
- Everything fading up at once on load. (Stagger; choreograph.)
- Bouncy/elastic easing on UI chrome. It feels toy-like.
- Animation durations > 1.2s for UI, or anything that blocks the user from reading/clicking.
- Centered text for long paragraphs. Body copy is left-aligned, max ~65ch.
- More than 2 typefaces. More than 1 accent colour.
- Icon soup: 6 feature cards each with a generic line icon.
- Scroll-jacking that changes scroll speed/direction without a clear reason.
- Emoji as UI decoration on premium surfaces.

## Decision heuristics

- When unsure, **make it bigger and remove something.**
- If two elements compete, **shrink one and increase the gap.**
- If a section feels flat, **add contrast in scale** (huge headline + tiny label) before adding colour.
- If motion feels cheap, **slow the ease-out, shorten the distance** (y: 40px not 200px).
