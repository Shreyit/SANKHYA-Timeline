// Smooth scroll (Lenis) driven by GSAP's ticker, so Lenis, ScrollTrigger and
// every tween share one clock — scroll-linked animation never drifts or jitters.
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap.js';
import { reduce } from './env.js';

let lenis = null;

export function initScroll() {
  if (reduce) return null;          // native scrolling for reduced-motion users
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/** Scroll to an element (or 0 for the top), smoothly when Lenis is running. */
export function scrollToTarget(target, { offset = -24, duration = 1.4 } = {}) {
  if (lenis) lenis.scrollTo(target, { offset, duration });
  else if (typeof target === 'number') window.scrollTo({ top: target, behavior: reduce ? 'auto' : 'smooth' });
  else target.scrollIntoView();
}

/** Pause / resume smooth scroll (e.g. while a modal or the mascot panel owns the wheel). */
export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();
