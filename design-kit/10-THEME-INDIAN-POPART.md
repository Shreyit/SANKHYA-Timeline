# Sankhya — Indian pop-art

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
outlined SVG, with an oversized S, black keyline and indigo print offset.

Motifs are decorative interpretations of lotus, paisley, rangoli, flowers,
peacock feathers and geometric folk dancers. They suggest cultural variety;
they are not an exhaustive representation of regions or traditions. Avoid
claiming a particular regional provenance without a researched reference.

Textures live in `public/patterns/`: paper grain, rangoli linework and a repeated
folk border. Keep pattern contrast low behind copy. Halftone and speckle details
are clipped to the vector wordmark. Do not flatten its ornaments into an image.

On hover, the background motifs gently reveal around the pointer. Inside the
wordmark, flowers turn, lotus forms bloom and paisleys sway. Letters stay still.
Pause the motif canvas when hidden, off screen or settled. On touch, keep a
static pattern; reduced motion removes turns and blooms. No information depends
on hovering. Retain mask reveals, quiet fade-ups and a scrolling cultural band.

Small sand text on poster crimson has a 4.67:1 contrast ratio; sand on indigo
has 6.42:1. The brighter primary red remains available for decorative accents.
Interactive targets are at least 44px. Check 320, 375, 768, 1024, 1440 and 1920px.

The 2026 archive has its own forest-green accents (`--p-green: #236942`,
`--p-green-dark: #1B4D32`) on warm paper, including headings, tabs, filters,
focus rings and cursor. The landing-page indigo remains part of the pop-art brand.

Between documents, use a short smoke curtain (`--c-smoke: #101813`): two static
SVG plumes drift with transform/opacity while a solid veil covers the page load.
Departure lasts 600ms; arrival clears in 940ms. Same-page anchors, external
links, modifier clicks and downloads must keep normal browser behaviour. Skip
the transition for reduced motion and reset it on a Back/Forward cache restore.
