// Sankhya '27 — boot. Architecture:
//   core/      env helpers · GSAP registration · Lenis smooth scroll · section tracker
//   motion/    scroll choreography (GSAP + ScrollTrigger + SplitText)
//   features/  data rendering · nav · pointer layer (cursor, spotlight, magnetic) · recap
//   brand/     shared folk-inspired motifs
//   fx/        pointer-revealed motif fields and hover helpers
//   rive/      Rive vector animations (loaded only if a page has [data-rive])
//   mascot/    Sanku, the floating three.js guide (loaded when the browser is idle)
import './style.css';
import { ScrollTrigger } from './core/gsap.js';
import { initScroll } from './core/scroll.js';
import { initMotion } from './motion/scroll-animations.js';
import { initPageTransitions } from './motion/page-transitions.js';
import { render } from './features/render.js';
import { initNav, initPillNav, initAnchors, initNavState } from './features/nav.js';
import { initSurfaces, initCursor, initMagnetic } from './features/pointer.js';
import { initOdometers } from './features/recap.js';
import { initFilmGallery } from './features/film-gallery.js';
import { initMotifFields } from './fx/motif-fields.js';
import { initRive } from './rive/rive.js';
import { initMascot } from './mascot/index.js';

/* motion-off is set pre-paint by the inline <head> script (see index.html),
   so the CSS-hidden intro states never flash for reduced-motion users. */

render();
initScroll();
const pageTransition = initPageTransitions();
initNavState();
initAnchors();
initNav();
initPillNav();
initSurfaces();
initCursor();
initMagnetic();
initOdometers();
initMotifFields();
initRive();
// A slow font request must not hold the page behind a loading curtain.
Promise.race([
  document.fonts.ready,
  new Promise((resolve) => setTimeout(resolve, 350)),
]).then(() => {
  initFilmGallery();
  initMotion();
  // The gallery pin is measured before reveals below it.
  ScrollTrigger.refresh();
  pageTransition.reveal().then(() => initMascot());
});
