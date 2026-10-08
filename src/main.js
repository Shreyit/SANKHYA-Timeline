// Sankhya '27 — boot. Architecture:
//   core/      env helpers · GSAP registration · Lenis smooth scroll · section tracker
//   motion/    scroll choreography (GSAP + ScrollTrigger + SplitText)
//   features/  data rendering · nav · pointer layer (cursor, spotlight, magnetic) · recap
//   brand/     the '27 logo (layered SVG + hover motion) and its liquid-glass parts
//   fx/        glyph fields, hover helpers
//   rive/      Rive vector animations (loaded only if a page has [data-rive])
//   mascot/    Sanku, the floating three.js guide (loaded when the browser is idle)
import './style.css';
import { reduce } from './core/env.js';
import { initScroll } from './core/scroll.js';
import { initMotion } from './motion/scroll-animations.js';
import { render } from './features/render.js';
import { initNav, initPillNav, initAnchors, initNavState } from './features/nav.js';
import { initSurfaces, initCursor, initMagnetic } from './features/pointer.js';
import { initTabs, initOdometers } from './features/recap.js';
import { mountLogos } from './brand/logo.js';
import { initGlyphFields } from './fx/glyph-fields.js';
import { initRive } from './rive/rive.js';
import { initMascot } from './mascot/index.js';

/* motion-off is set pre-paint by the inline <head> script (see index.html),
   so the CSS-hidden intro states never flash for reduced-motion users. */

render();
mountLogos({ reduce });
initScroll();
initNavState();
initAnchors();
initNav();
initPillNav();
initSurfaces();
initCursor();
initMagnetic();
initTabs();
initOdometers();
initGlyphFields();
initRive();
document.fonts.ready.then(() => { initMotion(); initMascot(); });
