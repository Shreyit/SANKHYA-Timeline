# SANKHYA 2027 — cultural diversity assets

This library is ready for the next design phase. Regional artwork and new
textures have not been selected or connected to the website yet.

```text
elements/
  motifs/
    shared/       Shared accents, chosen separately from regional artwork
    regional/     One folder per named tradition when its artwork is ready
  textures/       Small seamless paper, print and textile tiles
  icons/lucide/   Filmstrip UI icons with upstream source and license
  film/           Original curved celluloid surfaces for the archive reel
  catalog.json    Asset credits and file paths; currently empty
```

Keep the graffiti logo in `public/logo/`. Place decorative elements beside it
in this library, rather than baking them into the lettering. Public file URLs
start with `/elements/`, without the `public/` prefix.

## Adding an asset

Use lowercase descriptive names: `motifs/regional/<tradition>/<subject>.svg`
or `textures/<material>-<variant>.webp`. Create a tradition folder once its
artwork is chosen. A tradition can span multiple places and communities;
organise by its name rather than assigning one generic symbol to each state.

Add an entry to `catalog.json` with:

- `id`, `file`, `kind` (`motif` or `texture`), and `status` (`draft` or `selected`).
- `tradition`, `places` and `community` where applicable.
- `artist`, `sourceUrl`, `license` and a short `credit` for the actual asset.
- `description` and `decorative` for accessible usage.
- `motion` (`none` initially; `rotate` only when deliberately chosen).

Use original, commissioned or licensed artwork. Research references describe
traditions; their page illustrations are not website assets. Label original
adaptations as interpretations, and preserve the maker's attribution.

See [the research notes](../../design-kit/11-CULTURAL-DIVERSITY-RESEARCH.md)
in the repository for candidate traditions, placement and texture specifications.
