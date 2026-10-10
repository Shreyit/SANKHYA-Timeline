# Simple filmstrip

`film-simple.svg` preserves the original shallow wave, punched rectangular
perforations and black surface. It repeats every 720px behind the photo reel.
The original 40px desktop / 32px mobile layout padding remains in place.

Only the photograph is enlarged. `film-aperture.svg` clips it to the curved
opening between the two rails, using the same wave and repeat width as the
ribbon. The photo fills that opening with `object-fit: cover`, so it crops to
fit instead of leaving empty space. Each frame's aperture phase follows its
position in the strip; it is measured on layout, not on every scroll frame.

Event text and controls stay outside the strip. The ribbon travels with the
photos through the existing scroll animation, with no extra animation loop.

`film-segment.svg`, `film-curl.svg` and `photo-window.svg` are retired reference
assets; the website no longer loads their curl, perspective or photo mask.
