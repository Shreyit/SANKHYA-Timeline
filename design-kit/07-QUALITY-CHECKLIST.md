# 07 — Quality Checklist (run before shipping)

## Craft
- [ ] Headline is the strongest element on each screen; one clear focal point per section.
- [ ] Max 2 typefaces, 1 accent colour; accent used ≤ ~5% of the viewport.
- [ ] Everything snaps to the 12-col grid; any break is intentional.
- [ ] Section padding uses `--section-y`; nothing feels cramped.
- [ ] Headings use `text-wrap: balance`; no orphans in hero/section titles.
- [ ] Negative letter-spacing on large headings; labels uppercase + tracked.
- [ ] Real copy and real imagery — no lorem, no placeholder testimonials.
- [ ] Hover states exist for every interactive element (links, cards, buttons, icons).
- [ ] Custom cursor/magnetic effects disabled on touch devices.
- [ ] Hairlines are consistent (1px, `--c-line`).

## Component states & rules (see 09)
- [ ] Every interactive component has default, hover, focus-visible, active, disabled, loading and error states.
- [ ] Only semantic tokens used; no one-off spacing or type values.
- [ ] Keyboard, pointer and touch behaviour work (Enter/Space/Esc/arrows; targets ≥ 44px; no hover-only info).
- [ ] Long content, overflow, empty, loading and error cases handled.
- [ ] Labels are specific verbs/destinations — no "Click here" or bare "Submit".

## Motion
- [ ] Uses only the vocabulary in `03-MOTION-SYSTEM.md`; one signature moment per page.
- [ ] Easing is expo/quart — no linear (except scrub/marquee), no bounce on UI.
- [ ] Entrances staggered in reading order; nothing animates all at once.
- [ ] Scroll reveals play once; no content stays invisible if JS fails (use `.js` class gating).
- [ ] No animation blocks reading or clicking for more than ~1s.
- [ ] `prefers-reduced-motion` respected (Lenis off, reveals instant, no parallax).
- [ ] ScrollTriggers/Lenis cleaned up on route change; no duplicate triggers after navigation.

## Performance
- [ ] Only `transform` / `opacity` / `clip-path` animated.
- [ ] Lighthouse: Performance ≥ 90, LCP < 2.5s, CLS < 0.1, INP < 200ms.
- [ ] Images: AVIF/WebP, `sizes` set, hero image preloaded, others lazy.
- [ ] Videos: muted, `playsinline`, poster image, compressed (< 3MB hero loop).
- [ ] Fonts: `font-display: swap`, subset, preload the display font only.
- [ ] WebGL lazy-loaded and paused off-screen.
- [ ] Tested at 60fps on a mid-range Android phone.

## Responsive
- [ ] Checked at 375, 768, 1024, 1440, 1920.
- [ ] Fluid type doesn't overflow at 320px; giant words don't cause horizontal scroll.
- [ ] Pinned/horizontal sections have a mobile alternative.
- [ ] Touch targets ≥ 44px.

## Accessibility
- [ ] Semantic landmarks (`header`, `nav`, `main`, `footer`), one `h1`, logical heading order.
- [ ] SplitText output keeps accessible text (`aria-label` on the element, `aria-hidden` on pieces — SplitText does this by default).
- [ ] WCAG 2.2 AA: text contrast ≥ 4.5:1 (large ≥ 3:1), focus indicator ≥ 3:1 and never hidden (muted text on off-white / tinted dark surfaces included).
- [ ] Focus not obscured by sticky headers or overlays (WCAG 2.4.11).
- [ ] Full keyboard navigation with visible focus; skip-to-content link.
- [ ] Alt text on meaningful images; decorative ones `alt=""`.

## SEO / meta
- [ ] Title, description, OG image per page; case studies have unique OG images.
- [ ] Favicon + touch icon; sitemap; clean URLs.
