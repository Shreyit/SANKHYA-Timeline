import { gsap, ScrollTrigger, SplitText } from '../core/gsap.js';
import { $, $$, reduce, finePointer, esc, pad2 } from '../core/env.js';
import { mountGlyphField } from './glyphField.js';

/* ── Glyph fields (Build.io spotlight, ported from AakaarIO) ──
   Top: same clean footer recipe — shimmer + cursor spotlight behind the
   hero, fades out on scroll. Bottom: footer spotlight behind the mark. */
export function initGlyphFields() {
  // Warm spotlight preset: brighter + wider than the AakaarIO defaults so
  // the orange → amber → white palette reads clearly on the near-black bg.
  const warm = {
    fadeTop: false,
    baseAlpha: 0.06,
    idleRadius: 210,
    activeRadius: 260,
    hotAlpha: 0.9,
    wideAlpha: 0.32,
    follow: 0.08,
  };
  const topLayer = $('[data-glyph-top]');
  if (topLayer) {
    mountGlyphField(window, $('[data-glyph-top-canvas]'), $('[data-glyph-top-haze]'), warm);
    // Fade the top band out as the hero scrolls away (see ShellGlyphs.jsx).
    let raf = 0;
    const update = () => {
      raf = 0;
      topLayer.style.setProperty('--top-a', Math.max(0, 1 - window.scrollY / 480).toFixed(3));
    };
    update();
    window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  }
  const foot = $('[data-glyph-foot]');
  if (foot) {
    mountGlyphField(foot, $('[data-glyph-foot-canvas]'), $('[data-glyph-foot-haze]'), {
      ...warm,
      fadeTop: true,
    });
  }
}
