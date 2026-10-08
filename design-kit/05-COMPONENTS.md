# 05 — Components & Section Patterns

Patterns for studio-grade marketing sites. Each lists layout, style, and motion.

## Page skeleton (studio / agency / product landing)

1. Nav
2. Hero — statement headline + media
3. Marquee (clients / capabilities)
4. Intro statement — large paragraph, words fade in on scroll
5. Selected work — large project cards
6. Services — numbered list / accordion
7. Process — pinned horizontal steps (signature moment, optional)
8. Stats — 3–4 count-up numbers
9. Testimonials
10. CTA — huge "Let's talk"
11. Footer — giant wordmark

Alternate light/dark: light (1–4) → dark (5) → light (6–8) → dark (9–11).

---

## Nav
- Fixed, transparent over hero; gains `backdrop-filter: blur(12px)` + subtle bg after 40px scroll.
- Hides on scroll down, reappears on scroll up (`y: -100%` ↔ `0`, 0.4s ease-out-quart).
- Left: wordmark. Center/right: 3–5 links with **text-roll hover**. Right: pill CTA (accent) wrapped in **Magnetic**.
- Optional live element: local time or "Available for projects ●" with pulsing accent dot.
- Mobile: full-screen menu; links are huge (`--fs-h2`), mask-reveal with stagger 0.06; menu background curtains down.

## Hero
- Headline in `--fs-h1`/`--fs-display`, 2–3 lines, tight leading, one word in serif italic or accent colour.
- Small label above ("Design & Development Studio — Est. 2021").
- Sub-copy ≤ 2 lines, max 40ch, muted colour. One primary CTA + one text link.
- Media: large video/image with rounded corners that **expands to full-bleed on scroll**.
- Motion: hero intro timeline (recipe 12).

## Buttons
```
Primary:   pill, bg accent/ink, text contrasting, padding 14px 24px, --fs-sm weight 500
           hover → text-roll + small arrow icon slides/rotates 45°, bg darkens 6%
Secondary: pill, 1px --c-line border, transparent; hover → fill ink, text inverts (bg scales from bottom)
Text link: underline via ::after scaleX(0→1) origin-left on hover, origin-right on leave
```
Circle icon button: 48–56px, arrow `↗`, magnetic.

## Selected work (case study grid)
- 2-column asymmetric grid (7/5 cols, then 5/7), or a single column of full-width cards.
- Card: image (4:3 or 16:10, `--radius-lg`) → below: project name (`--fs-h3`) + tags as small pills + year right-aligned.
- Hover: image scales 1.04 (0.8s ease-out-expo), cursor becomes "View" circle, other cards dim to 0.5 opacity.
- Motion: clip image reveal + parallax on scroll.
- End with a "View all work" circle button.

## Services
- Numbered rows: `(01)` label | service name `--fs-h2` | short description | arrow.
- Rows separated by hairlines. Hover: row text slides right 12px, accent dot appears, or a preview image follows the cursor.
- Or accordion: open/close height with `motion` `layout` + 0.5s ease.
- Include sub-capabilities as small pills (UX/UI · Design systems · Prototyping · Web apps · Mobile apps).

## Intro statement
- One big paragraph (`--fs-h3`/`--fs-h2`) spanning cols 3–12.
- Scroll-scrubbed word highlight: each word goes opacity 0.15 → 1 as you scroll through (SplitText words + scrub).

## Process
- 4 steps: Discover → Design → Develop → Launch. Each: big number, title, 2-line text, small visual.
- Pinned horizontal scroll on desktop; vertical stack on mobile.

## Stats
- 3–4 columns, giant tabular numbers (`--fs-h1`) with count-up, tiny label under each, hairline dividers.

## Testimonials
- One quote at a time, large (`--fs-h3`), with name, role, company logo.
- Slider with drag + arrow buttons; transition: fade + 20px x-shift. Or a slow auto-scrolling marquee of cards.
- Use real, attributed quotes only.

## CTA
- Dark section, massive "Let's build something" (`--fs-display`), email link with underline animation,
  magnetic circle button. Optional: accent circle that follows cursor within the section.

## Footer
- Columns: sitemap, socials, address/email, newsletter input.
- Giant wordmark across full width at bottom (`--fs-display`, maybe clipped at the bottom edge).
- "Back to top ↑" with smooth scroll. Copyright + local time.

## Case study page template
1. Title hero: project name, client, year, services, role (grid of meta).
2. Full-bleed cover (expand on scroll).
3. Challenge / Approach / Outcome — label left, text right.
4. Image sequences: full-bleed, 2-up, device mockups on neutral bg.
5. Results: stats.
6. "Next project" — full-width card; hover preview; click triggers curtain transition.

## Forms (contact)
- Large underlined inputs (no boxes), floating labels, accent focus line animating from left.
- Service/budget as selectable pills. Submit = primary button. Success: text-roll to "Sent ✓".
