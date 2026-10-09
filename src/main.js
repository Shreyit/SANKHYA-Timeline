// Sankhya '27 — boot. Architecture:
//   core/      env helpers · GSAP registration · Lenis smooth scroll · section tracker
//   motion/    scroll choreography (GSAP + ScrollTrigger + SplitText)
//   features/  data rendering · nav · pointer layer (cursor, spotlight, magnetic) · recap
//   brand/     pop-art vector wordmark and shared folk-inspired motifs
//   fx/        pointer-revealed motif fields and hover helpers
//   rive/      Rive vector animations (loaded only if a page has [data-rive])
//   mascot/    Sanku, the floating three.js guide (loaded when the browser is idle)
import './style.css';
import { reduce } from './core/env.js';
import { initScroll } from './core/scroll.js';
import { initMotion } from './motion/scroll-animations.js';
import { initPageTransitions } from './motion/page-transitions.js';
import { render } from './features/render.js';
import { initNav, initPillNav, initAnchors, initNavState } from './features/nav.js';
import { initSurfaces, initCursor, initMagnetic } from './features/pointer.js';
import { initTabs, initOdometers } from './features/recap.js';
import { mountLogos } from './brand/logo.js';
import { initMotifFields } from './fx/motif-fields.js';
import { initRive } from './rive/rive.js';
import { initMascot } from './mascot/index.js';

/* motion-off is set pre-paint by the inline <head> script (see index.html),
   so the CSS-hidden intro states never flash for reduced-motion users. */

render();
mountLogos({ reduce });
initScroll();
initPageTransitions();
initNavState();
initAnchors();
initNav();
initPillNav();
initSurfaces();
initCursor();
initMagnetic();
initTabs();
initOdometers();
initMotifFields();
initRive();
document.fonts.ready.then(() => { initMotion(); initMascot(); });
