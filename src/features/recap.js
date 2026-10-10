// Recap interactions: odometer stats.
import { ScrollTrigger } from '../core/gsap.js';
import { $$, reduce } from '../core/env.js';

/* ── Odometer stats: roll up once in view, re-roll on hover ── */
export function initOdometers() {
  $$('[data-odometer]').forEach((el) => {
    const digits = String(el.dataset.odometer).padStart(2, '0').split('').map(Number);
    const cols = $$('.digit', el);
    const set = (vals) => cols.forEach((c, i) => { c.style.transform = `translateY(${-vals[i]}em)`; });
    if (reduce) { set(digits); return; }
    set(digits.map(() => 0));
    cols.forEach((c, i) => { c.style.transitionDelay = `${i * 90}ms`; c.style.transitionDuration = '1400ms'; });
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => set(digits) });
    el.parentElement.addEventListener('pointerenter', () => {
      cols.forEach((c) => { c.style.transitionDuration = '700ms'; });
      set(digits.map((d) => (d + 5) % 10));
      setTimeout(() => set(digits), 180);
    });
  });
}
