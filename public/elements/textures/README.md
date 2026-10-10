# Material textures

Reserved for seamless, static paper, print and textile tiles. No new textures
are active yet. Suggested starting size: 128–256px; target 10–30KB per tile.
Those are project budgets to validate visually, not browser limits.

Use WebP with an optional AVIF alternative for material textures, and compact
SVG for simple line/dot patterns. Keep repeat edges seamless. Avoid text and
regional symbols in a generic material tile. Register each tile and its
maker/source in `../catalog.json`.

Textures stay still: no scrolling backgrounds, animated noise, blur or
full-page parallax. Keep them faint behind reading areas and preserve focus
and text contrast. The implementation recipe lives in the design-kit research.
