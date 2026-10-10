# Sankhya 2027 — cultural diversity and Indian pop-art

This brand direction supersedes the kit's one-accent and warm-minimalism defaults.
Keep its grid, spacing, accessible controls and purposeful motion rules.

| Token | Colour | Role |
| --- | --- | --- |
| `--p-red` | `#E61E25` | Brand crimson, print accents |
| `--c-poster` | `#C91A23` | Poster surfaces; deeper crimson for cream body text |
| `--p-yellow` | `#FFD129` | Marigold lettering, actions and ornament |
| `--p-indigo` | `#3B1CF4` | Dimensional wordmark shadows, selected controls |
| `--p-black` | `#0B0B0B` | Information surfaces, navigation, print outlines |
| `--p-sand` | `#F4E7C3` | Paper surfaces and text |
| `--p-maroon` | `#8B0F14` | Folk ornament and secondary poster surfaces |

The hero is a festival poster. The rest of the page has clear reading order:
warm paper for the introduction and archive, charcoal for practical information,
maroon for the registration invitation. Use colour blocks and generous space.

Use Geist for body and controls, Georgia for editorial accents. The wordmark is
supplied graffiti artwork, with an oversized S, black keyline and indigo depth.

Motifs are decorative interpretations of lotus, paisley, rangoli, flowers,
peacock feathers and geometric folk dancers. They suggest cultural variety;
they are not an exhaustive representation of regions or traditions. Avoid
claiming a particular regional provenance without a researched reference.

Existing textures live in `public/patterns/`. New regional motifs and material
textures belong in `public/elements/`, with maker and source credits in its
catalog. Keep pattern contrast low behind copy. The new logo already contains
halftone and speckle details; keep future motifs separate from its lettering.

Existing small background motifs gently reveal around the pointer. The
graffiti wordmark stays still and has no added ornaments or hover animation.
Pause the motif canvas when hidden, off screen or settled. On touch, keep a
static pattern; reduced motion stops animated motion. No information depends
on hovering. Retain mask reveals, quiet fade-ups and a scrolling cultural band.

Small sand text on poster crimson has a 4.67:1 contrast ratio; sand on indigo
has 6.42:1. The brighter primary red remains available for decorative accents.
Interactive targets are at least 44px. Check 320, 375, 768, 1024, 1440 and 1920px.

The 2026 archive has its own forest-green accents (`--p-green: #236942`,
`--p-green-dark: #1B4D32`) on warm paper, including headings, tabs, filters,
focus rings and cursor. The landing-page indigo remains part of the pop-art brand.

Between documents, use a forest-green GSAP title curtain: a single solid
composited panel, the brush SANKHYA mark, a recap/home caption and a thin
loading cue. Departure lasts 280ms; arrival clears in 680ms. No SVG turbulence,
animated blur, full-screen filters or elastic easing. The original S remains
static on hover. ANKHYA uses outlined Merienda Black at weight 900, with brush
terminals and a lower baseline beside the S. Tighter spacing and a 92% hero
width keep the recap wordmark compact; the original S contours remain intact.

The recap also shows this entrance on a direct visit. Begin the page's quiet
intro under the curtain and defer the mascot until it clears. Fonts must never
hold the loader indefinitely (350ms ready fallback). Keep the critical curtain
CSS in the head to prevent an unstyled frame across document navigation.

Same-page anchors, external links, modifier clicks and downloads must retain
normal browser behaviour. Skip the curtain for reduced motion and reset it on
a Back/Forward cache restore. Keep historical dates in content, while navigation
and the hero identify the page simply as Recap.

The landing hero, navbar and footer use **SANKHYA Graffiti Comic Logo.png**.
Keep its lettering, sweeping headline, print texture and indigo extrusion intact.
Use its built-in transparency directly; the supplied PNG is untouched and
the older image's outline mask is retired. Preload the image and crop only
transparent canvas padding.
The older logo's ornament layers and sprite animation are no longer loaded.
The sharp green recap title retains its own role.

Navigation pills use a translucent charcoal tint, a static edge highlight and
a single reflection sweep on hover/focus. The reflection animates only
transform/opacity inside each pill; touch and reduced motion keep it static.
The TISS mark uses `--nav-host-size` (36px; 28px on narrow phones).

Large background rangoli graphics and their motion are currently removed for
performance. Do not reintroduce them without a new request. Keep the existing
small motif fields and loading-screen motif band. The
recap background wash stays static, with no scroll-scrubbed background motion.

The 2027 theme is **Cultural diversity**. Future regional artwork should use
named traditions, places/communities and maker credits rather than a generic
symbol for each state. New motifs and textures will be chosen in the next
design phase. See `11-CULTURAL-DIVERSITY-RESEARCH.md` for the research shortlist
and a lightweight static-texture plan.
