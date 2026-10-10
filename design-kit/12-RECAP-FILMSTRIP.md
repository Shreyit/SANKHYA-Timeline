# Event snippets — photo filmstrip

The supplied Re: Vogue photo appears in a simple, perforated film strip with
a shallow wave. The heading is **Event snippets**. The earlier event-card grid
is removed, so the reel is the single place for event photographs and stories.
Only real photographs belong here: one uploaded photograph means one frame.
Add future photos to `recap.photos` in `src/data.js`; the strip grows sideways
without adding a vertical photo grid. Each photo's `eventId` links to the event
name, category, day, description and optional result in `recap.events`.
Those details appear below the strip and follow the active photograph.

## Interaction

On desktop viewports at least 768px wide and 800px high, the gallery pins below
the navigation. Vertical scroll moves its child track horizontally with GSAP
ScrollTrigger, `ease: none` and `scrub: .45`. Only the track's transform changes.
A repeating SVG preserves the original gentle wave and perforations. Its
40px desktop / 32px mobile layout padding and 16:9 frame measurements stay
unchanged. Only the photo is enlarged to fill the opening between the rails.
`film-aperture.svg` clips its edges to the same curve and repeat phase as the
ribbon; `object-fit: cover` crops the photograph to fill this opening. The
phase is measured on layout, without an extra scroll animation or clock.
There is no curled leader, perspective or tilted frame. The scroll
span is capped at 1.6 viewport heights regardless of the number of frames.
Scrolling back reverses the reel; no autoplay loop runs.

Phones, short screens and reduced motion use a native horizontal scroll-snap
carousel. Multiple frames gain previous/next buttons, left/right arrow keys,
Home/End shortcuts and an actual frame count. Buttons announce the selected
frame; scroll updates do not generate repeated live-region announcements.
The continue link takes visitors directly to Achievements. The separate
three-day schedule section has been removed.

## States and accessibility

- Default: real photograph inside the film; all event text and counts outside.
- Hover/focus: controls use the existing accent and global visible focus ring.
- Active: small button press feedback using transform.
- Disabled: previous/next stop at the ends; controls are hidden for one photo.
- Loading: intrinsic dimensions and the frame reserve image space; lazy loading
  and responsive `srcset` select a 960px or 1600px WebP.
- Error: the frame retains its size and the error appears below the film.
- Empty: the gallery is hidden when the photo list is empty.

Each photograph needs descriptive alt text. No information relies on motion or
hover. The first photo also has a native HTML fallback without JavaScript.
Button targets are 44px. The media query falls back to touch/native behaviour
and removes the pin on resize.

The component reuses semantic palette/type/spacing tokens. Local geometry
tokens are `--film-frame-width`, `--film-leader` and `--film-rail`.
No new colour or typeface is added.

## Source assets and references

- Original: `public/img/recap/events/re-vogue/Fashion_01_2026.JPG` (unchanged contents).
- Responsive copies: `fashion-01-960.webp` and `fashion-01-1600.webp` beside it.
  They are resized/encoded with `cwebp -q 84 -m 6`; no scene alterations.
- Film and arrow icons: [Lucide on GitHub](https://github.com/lucide-icons/lucide),
  stored with its full license in `public/elements/icons/lucide/`.
- Active ribbon: original `public/elements/film/film-simple.svg`, with
  `film-aperture.svg` matching its curved opening for the photo crop.
  It uses punched perforations and static shading. The old complex ribbon
  assets remain as unused references. No extra rendering loop runs.
- Motion API: [GSAP ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
  and [the GSAP repository](https://github.com/greensock/GSAP).
  The implementation measures actual track overflow rather than using a fixed
  distance copied from an example. It integrates with the existing Lenis clock.

All 16 scheduled events have folders under `public/img/recap/events/`, listed
in its README. For a new photo, put the original and browser-sized copies in
its event folder; register `eventId`, URLs, dimensions and alt text in
`recap.photos`. Empty folders do not create placeholder or repeated frames.
Keep source photographs
out of runtime requests. Profile on a physical mid-range phone before claiming
frame-rate or Core Web Vitals targets; desktop browser checks are not a device
performance benchmark.
