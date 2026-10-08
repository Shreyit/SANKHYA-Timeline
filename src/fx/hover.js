// Card highlight that follows the pointer (design-kit 08). Sets --mx/--my on
// the hovered element; the CSS draws the radial light.
export function trackSpotlight(e) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}

// Moves the glass highlight (see .glass in style.css) toward the pointer,
// like the light on iOS glass surfaces.
export function trackGlass(e) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--gx', `${e.clientX - r.left}px`);
  el.style.setProperty('--gy', `${e.clientY - r.top}px`);
}
